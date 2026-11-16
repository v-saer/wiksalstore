require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */
const PORT = process.env.PORT || 3000;
const PAYLINK_API_BASE_URL = process.env.PAYLINK_API_BASE_URL || '';
const PAYLINK_API_KEY = process.env.PAYLINK_API_KEY || '';
const PAYLINK_WEBHOOK_SECRET = process.env.PAYLINK_WEBHOOK_SECRET || '';
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '';
const QR_TTL_MS = 15 * 60 * 1000;
const KHR_PER_USD = 4000;
const STORE_NAME = '';
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');
const SUPPORT = 'nhsalnghahh';
const PAYMENT_LINKS = {
  t3: 'https://pay.ababank.com/oRF8/r1vh4twz',
  t6: 'https://pay.ababank.com/oRF8/vyl8jywz',
  t12: 'https://pay.ababank.com/oRF8/j0k6hips',
};
const PAYMENT_QR_IMAGES = {
  t3: '/img/aba-khqr-t3.png',
  t6: '/img/aba-khqr-t6.png',
  t12: '/img/aba-khqr-t12.png',
};

/* ------------------------------------------------------------------ */
/*  Catalog (server is the source of truth for prices)                 */
/* ------------------------------------------------------------------ */
const CATALOG = {
  telegram: {
    label: 'Telegram Premium',
    platform: 'telegram',
    items: {
      t3:  { name: 'Premium 3 Months',  was: 14.99, price: 13.99 },
      t6:  { name: 'Premium 6 Months',  was: 19.99, price: 18.99 },
      t12: { name: 'Premium 12 Months', was: 39.99, price: 36.99 },
    },
  },
};

/* ------------------------------------------------------------------ */
/*  Orders file (orders.json) – serialized, atomic writes              */
/* ------------------------------------------------------------------ */
let orders = [];
try {
  orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
  if (!Array.isArray(orders)) orders = [];
} catch { orders = []; }

let writing = Promise.resolve();
const proofSubmissions = new Set();
function saveOrders() {
  writing = writing.then(async () => {
    const tmp = ORDERS_FILE + '.tmp';
    await fs.promises.mkdir(path.dirname(ORDERS_FILE), { recursive: true });
    await fs.promises.writeFile(tmp, JSON.stringify(orders, null, 2));
    await fs.promises.rename(tmp, ORDERS_FILE);
  }).catch((e) => console.error('saveOrders failed:', e.message));
  return writing;
}
const findOrder = (id) => orders.find((o) => o.id === id);
const paymentAvailableForItem = (itemId) =>
  !!PAYMENT_LINKS[itemId] && !!BOT_TOKEN && !!ADMIN_CHAT_ID;
function parsePaymentProof(req, res, next) {
  express.raw({ type: ['image/png', 'image/jpeg', 'image/webp'], limit: '5mb' })(req, res, (error) => {
    if (!error) return next();
    if (error.type === 'entity.too.large') {
      return res.status(413).json({ error: 'Payment screenshot must be 5 MB or smaller.' });
    }
    return res.status(400).json({ error: 'Could not read the payment screenshot.' });
  });
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const UA = 'Mozilla/5.0 (compatible; WiksalStore/1.0)';

// tiny in-memory rate limiter
const hits = new Map();
function rateLimit(max, windowMs) {
  return (req, res, next) => {
    const key = req.ip + req.path;
    const now = Date.now();
    const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
    arr.push(now);
    hits.set(key, arr);
    if (arr.length > max) return res.status(429).json({ error: 'Too many requests, please slow down.' });
    next();
  };
}
setInterval(() => hits.clear(), 10 * 60 * 1000).unref();

/* ------------------------------------------------------------------ */
/*  Telegram username lookup                                           */
/* ------------------------------------------------------------------ */
function meta(html, prop) {
  const m = html.match(new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']*)["']`, 'i'));
  return m ? m[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'") : '';
}

async function lookupTelegram(username) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  let html;
  try {
    const res = await fetch(`https://t.me/${encodeURIComponent(username)}`, { signal: ctrl.signal, headers: { 'User-Agent': UA } });
    if (!res.ok) return null;
    html = await res.text();
  } finally { clearTimeout(t); }
  const title = meta(html, 'og:title');
  const image = meta(html, 'og:image');
  // Non-existing usernames return the generic "Telegram: Contact @x" page with no photo block
  const hasProfile = /tgme_page_title|tgme_page_photo/.test(html);
  if (!hasProfile || !title || /^Telegram: Contact/i.test(title)) return null;
  const isUserLike = /tgme_action_button_new|tgme_page_extra/.test(html) || true;
  const extraMatch = html.match(/<div class="tgme_page_extra">([^<]*)<\/div>/);
  const bio = meta(html, 'og:description');
  return {
    platform: 'telegram',
    username,
    displayName: title,
    description: bio && !/^If you have Telegram/i.test(bio) ? bio.slice(0, 120) : '',
    extra: extraMatch ? extraMatch[1].trim() : '',
    avatar: image && !/telegram\.org\/img\/t_logo/.test(image) ? image : null,
    profileUrl: `https://t.me/${username}`,
    isUserLike,
  };
}

/* ------------------------------------------------------------------ */
/*  ABA PayWay API                                                     */
/* ------------------------------------------------------------------ */
function paylinkUrl(pathname) {
  if (!PAYLINK_API_BASE_URL || !PAYLINK_API_KEY) {
    throw new Error('Payment gateway is not configured.');
  }
  let base;
  try { base = new URL(PAYLINK_API_BASE_URL); } catch { throw new Error('Payment gateway URL is invalid.'); }
  if (base.protocol !== 'https:' || base.username || base.password || base.search || base.hash) {
    throw new Error('Payment gateway URL must be a clean HTTPS URL.');
  }
  return `${base.toString().replace(/\/+$/, '')}${pathname}`;
}

async function paylinkRequest(pathname, payload, idempotencyKey) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${PAYLINK_API_KEY}`,
  };
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    let response;
    try {
      response = await fetch(paylinkUrl(pathname), {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
        redirect: 'error',
      });
    } catch {
      throw new Error('Payment gateway request failed.');
    }

    let data;
    const text = await response.text();
    if (text.length > 65536) throw new Error('Payment gateway response is too large.');
    try { data = JSON.parse(text); } catch { throw new Error('Payment gateway returned an invalid response.'); }
    if (!response.ok) throw new Error('Payment gateway request failed.');
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

function paymentAmount(item, currency) {
  return currency === 'KHR' ? Math.round(item.price * KHR_PER_USD) : Number(item.price.toFixed(2));
}

function formatOrderAmount(order) {
  return order.currency === 'KHR'
    ? `Û ${Math.round(order.amount).toLocaleString('en-US')}`
    : `$${Number(order.amount).toFixed(2)} USD`;
}

function paymentResponse(order) {
  return {
    id: order.id,
    amount: order.amount,
    currency: order.currency,
    itemName: order.itemName,
    expiresAt: order.expiresAt,
    qrString: order.payment.qrString,
    tranId: order.payment.tranId,
    deepLink: order.payment.deepLink,
    storeName: STORE_NAME,
    provider: order.provider,
  };
}

function manualPaymentResponse(order) {
  return {
    id: order.id,
    amount: order.amount,
    currency: order.currency,
    itemName: order.itemName,
    paymentLink: PAYMENT_LINKS[order.itemId],
    paymentQrImage: PAYMENT_QR_IMAGES[order.itemId],
    provider: order.provider,
  };
}

async function generatePaywayQr(order) {
  const data = await paylinkRequest('/api/payment/generate-qr', {
    amount: order.amount,
    currency: order.currency,
    orderId: order.id,
  }, order.id);
  const tranId = data && (data.tranId || data.transactionId);
  if (
    !data || (data.success !== undefined && data.success !== true) ||
    typeof data.qrString !== 'string' || !data.qrString || data.qrString.length > 8192 ||
    typeof tranId !== 'string' || !tranId || tranId.length > 128 ||
    typeof data.deepLink !== 'string' || !data.deepLink || data.deepLink.length > 2048
  ) {
    throw new Error('Payment gateway returned incomplete payment details.');
  }
  return { qrString: data.qrString, tranId, deepLink: data.deepLink };
}

/* ------------------------------------------------------------------ */
/*  Telegram bot alert                                                 */
/* ------------------------------------------------------------------ */
async function alertBot(order) {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) { console.warn('Telegram bot not configured – skipped alert for', order.id); return false; }
  const text =
    `🛒 <b>NEW PAID ORDER</b>\n` +
    `━━━━━━━━━━━━━━\n` +
    `🧾 <b>Order:</b> <code>${esc(order.id)}</code>\n` +
    `📦 <b>Product:</b> ${esc(order.categoryLabel)} — ${esc(order.itemName)}\n` +
    `💵 <b>Amount:</b> ${formatOrderAmount(order)}\n` +
    `👤 <b>${order.platform === 'roblox' ? 'Roblox' : 'Telegram'}:</b> ${esc(order.account.username)}` +
    (order.account.displayName ? ` (${esc(order.account.displayName)})` : '') + `\n` +
    `🔗 ${esc(order.account.profileUrl)}\n` +
    `🕒 ${esc(order.paidAt)}\n` +
    `━━━━━━━━━━━━━━\n` +
    `⏳ Please deliver the order.`;
  try {
    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    });
    const j = await r.json();
    if (!j.ok) throw new Error(j.description);
    return true;
  } catch (e) {
    console.error('Bot alert failed:', e.message);
    return false;
  }
}

async function alertPaymentProof(order, image, mimeType) {
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) throw new Error('Telegram bot is not configured.');

  const text =
    `🧾 <b>PAYMENT PROOF SUBMITTED</b>\n` +
    `━━━━━━━━━━━━━━\n` +
    `🧾 <b>Order:</b> <code>${esc(order.id)}</code>\n` +
    `📦 <b>Product:</b> ${esc(order.categoryLabel)} — ${esc(order.itemName)}\n` +
    `💵 <b>Amount:</b> ${formatOrderAmount(order)}\n` +
    `👤 <b>Telegram:</b> ${esc(order.account.username)}` +
    (order.account.displayName ? ` (${esc(order.account.displayName)})` : '') + `\n` +
    `🔗 ${esc(order.account.profileUrl)}\n` +
    `🕒 ${esc(new Date().toISOString())}\n` +
    `━━━━━━━━━━━━━━\n` +
    `⚠️ Verify the payment before delivering Premium.`;
  const form = new FormData();
  const extension = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';
  form.append('chat_id', ADMIN_CHAT_ID);
  form.append('caption', text);
  form.append('parse_mode', 'HTML');
  form.append('photo', new Blob([image], { type: mimeType }), `payment-proof.${extension}`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      body: form,
      signal: controller.signal,
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error('Telegram did not accept the payment proof.');
  } finally {
    clearTimeout(timeout);
  }
}

async function markPaid(order, txn) {
  if (order.status === 'paid') return;
  order.status = 'paid';
  order.paidAt = new Date().toISOString();
  if (txn) order.transaction = { hash: txn.hash || null, from: txn.fromAccountId || txn.from || null };
  order.botNotified = await alertBot(order);
  await saveOrders();
}

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */
const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
  });
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
  }
  if (process.env.NODE_ENV === 'production' && req.secure) {
    res.set('Strict-Transport-Security', 'max-age=31536000');
  }
  next();
});
app.post('/api/webhook', express.raw({ type: 'application/json', limit: '32kb' }), async (req, res) => {
  if (!PAYLINK_WEBHOOK_SECRET) return res.status(503).json({ ok: false, error: 'Webhook is not configured.' });
  if (!Buffer.isBuffer(req.body)) return res.status(400).json({ ok: false, error: 'Invalid webhook body.' });

  const signature = req.headers['x-signature'];
  const sig = Buffer.from(typeof signature === 'string' ? signature : '');
  const want = Buffer.from(crypto.createHmac('sha256', PAYLINK_WEBHOOK_SECRET).update(req.body).digest('hex'));
  if (sig.length !== want.length || !/^[a-f\d]{64}$/i.test(sig.toString('utf8')) || !crypto.timingSafeEqual(sig, want)) {
    return res.status(401).json({ ok: false, error: 'Invalid webhook signature.' });
  }

  let payload;
  try { payload = JSON.parse(req.body.toString('utf8')); } catch {
    return res.status(400).json({ ok: false, error: 'Invalid webhook payload.' });
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return res.status(400).json({ ok: false, error: 'Invalid webhook payload.' });
  }
  const eventData = payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)
    ? payload.data
    : {};
  const transactionId = typeof eventData.tranId === 'string'
    ? eventData.tranId
    : typeof payload.tranId === 'string' ? payload.tranId : '';
  const orderId = typeof eventData.orderId === 'string'
    ? eventData.orderId
    : typeof payload.orderId === 'string' ? payload.orderId : '';
  const order = orders.find((entry) =>
    entry.provider === 'aba-payway' &&
    (entry.id === orderId || (transactionId && entry.payment && entry.payment.tranId === transactionId))
  );
  if (!order) return res.status(404).json({ ok: false, error: 'Order not found.' });
  if (payload.status === 'PAID' && order.status !== 'paid') {
    await markPaid(order);
  }
  res.json({ ok: true, status: order.status });
});
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/config', (req, res) => {
  const catalog = {};
  for (const [k, c] of Object.entries(CATALOG)) {
    catalog[k] = {
      label: c.label,
      platform: c.platform,
      items: Object.entries(c.items).map(([id, i]) => ({ id, ...i, paymentAvailable: paymentAvailableForItem(id) })),
    };
  }
  res.json({ support: SUPPORT, catalog, storeName: STORE_NAME, khrPerUsd: KHR_PER_USD });
});

app.get('/api/telegram/:username', rateLimit(30, 60_000), async (req, res) => {
  const u = req.params.username.trim().replace(/^@/, '');
  if (!/^[A-Za-z0-9_]{5,32}$/.test(u)) return res.status(400).json({ error: 'Telegram usernames are 5–32 letters, numbers or underscores.' });
  try {
    const p = await lookupTelegram(u);
    if (!p) return res.status(404).json({ error: 'No public Telegram account found with that username.' });
    res.json(p);
  } catch (e) {
    res.status(502).json({ error: 'Could not reach Telegram right now. Please try again.' });
  }
});

app.post('/api/orders', rateLimit(10, 60_000), async (req, res) => {
  let orderId = '';
  try {
    const { category, itemId, username, currency, orderId: requestedOrderId } = req.body || {};
    orderId = typeof requestedOrderId === 'string' ? requestedOrderId : '';
    const cat = CATALOG[category];
    const item = cat && cat.items[itemId];
    if (!item) return res.status(400).json({ error: 'Invalid product.' });
    if (!PAYMENT_LINKS[itemId]) {
      return res.status(503).json({ error: 'This payment option is temporarily unavailable. Please contact support.' });
    }
    if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
      return res.status(503).json({ error: 'Payment proof notifications are not configured. Please contact support.' });
    }
    if (currency !== 'USD') {
      return res.status(400).json({ error: 'Only USD payments are available.' });
    }
    if (!/^WS-[A-Za-z0-9-]{16,50}$/.test(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID.' });
    }

    // re-verify the account server-side so nobody can order for a made-up profile
    const clean = String(username || '').trim().replace(/^@/, '');
    const account = /^[A-Za-z0-9_]{5,32}$/.test(clean) ? await lookupTelegram(clean) : null;
    if (!account) return res.status(400).json({ error: 'Account could not be verified.' });

    const existing = findOrder(orderId);
    if (existing) {
      if (
        existing.provider !== 'khqr-manual' || existing.category !== category ||
        existing.itemId !== itemId || existing.currency !== currency ||
        existing.account.username !== account.username
      ) return res.status(409).json({ error: 'Order ID has already been used.' });
      if (existing.status !== 'pending' && existing.status !== 'proof_submitted') {
        return res.status(409).json({ error: 'This order is no longer available.' });
      }
      return res.json(manualPaymentResponse(existing));
    }

    const now = Date.now();
    const order = {
      id: orderId,
      status: 'pending',
      category,
      categoryLabel: cat.label,
      platform: cat.platform,
      itemId,
      itemName: item.name,
      amount: item.price,
      currency: 'USD',
      amountUsd: item.price,
      account: {
        username: account.username,
        displayName: account.displayName || '',
        id: account.id || null,
        profileUrl: account.profileUrl,
      },
      createdAt: new Date(now).toISOString(),
      paidAt: null,
      botNotified: false,
      provider: 'khqr-manual',
    };

    orders.push(order);
    await saveOrders();
    res.json(manualPaymentResponse(order));
  } catch {
    console.error('Payment order creation failed for order', orderId || '(invalid ID)');
    res.status(502).json({ error: 'Could not create the payment order. Please try again or contact support.' });
  }
});

app.post(
  '/api/orders/:id/proof',
  rateLimit(5, 10 * 60_000),
  parsePaymentProof,
  async (req, res) => {
    const order = findOrder(req.params.id);
    if (!order || order.provider !== 'khqr-manual') return res.status(404).json({ error: 'Order not found.' });
    if (order.status === 'proof_submitted') {
      return res.json({ id: order.id, status: order.status, submitted: true });
    }
    if (order.status !== 'pending') return res.status(409).json({ error: 'This order cannot accept a payment proof.' });
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: 'Choose a payment screenshot to upload.' });
    }

    const mimeType = req.headers['content-type'];
    const isPng = mimeType === 'image/png' && req.body.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const isJpeg = mimeType === 'image/jpeg' && req.body[0] === 0xff && req.body[1] === 0xd8 && req.body[2] === 0xff;
    const isWebp = mimeType === 'image/webp' &&
      req.body.toString('ascii', 0, 4) === 'RIFF' &&
      req.body.toString('ascii', 8, 12) === 'WEBP';
    if (!isPng && !isJpeg && !isWebp) {
      return res.status(400).json({ error: 'Upload a valid PNG, JPEG, or WebP payment screenshot.' });
    }
    if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
      return res.status(503).json({ error: 'Payment proof notifications are not configured. Please contact support.' });
    }
    if (proofSubmissions.has(order.id)) {
      return res.status(409).json({ error: 'Your payment proof is already being sent.' });
    }

    proofSubmissions.add(order.id);
    try {
      await alertPaymentProof(order, req.body, mimeType);
      order.status = 'proof_submitted';
      order.proofSubmittedAt = new Date().toISOString();
      order.proofBotNotified = true;
      await saveOrders();
      res.json({ id: order.id, status: order.status, submitted: true });
    } catch (e) {
      console.error(`Payment proof alert failed for order ${order.id}:`, e.message);
      res.status(502).json({ error: 'Could not send your payment proof. Please try again or contact support.' });
    } finally {
      proofSubmissions.delete(order.id);
    }
  }
);

app.get('/api/orders/:id/status', rateLimit(120, 60_000), async (req, res) => {
  const order = findOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  if (order.status === 'pending' && Date.now() > order.expiresAt) {
    order.status = 'expired';
    await saveOrders();
  }
  res.json({ id: order.id, status: order.status, paidAt: order.paidAt });
});

app.post('/api/orders/:id/check', rateLimit(30, 60_000), async (req, res) => {
  const order = findOrder(req.params.id);
  if (!order || order.provider !== 'aba-payway') return res.status(404).json({ error: 'Order not found.' });
  if (order.status === 'paid') return res.json({ id: order.id, status: 'PAID', paid: true });
  if (Date.now() > order.expiresAt) {
    order.status = 'expired';
    await saveOrders();
    return res.json({ id: order.id, status: 'EXPIRED', paid: false });
  }
  if (!order.payment || !order.payment.tranId) {
    return res.status(409).json({ error: 'Payment has not been initialized.' });
  }

  try {
    const result = await paylinkRequest('/api/payment/check', { tranId: order.payment.tranId });
    if (result && result.status === 'PAID' && result.paid !== false) {
      await markPaid(order);
      return res.json({ id: order.id, status: 'PAID', paid: true });
    }
    if (!result || result.status !== 'PENDING') {
      return res.status(502).json({ error: 'Payment gateway returned an invalid status.' });
    }
    res.json({ id: order.id, status: 'PENDING', paid: false });
  } catch {
    res.status(502).json({ error: 'Could not verify the payment right now.' });
  }
});

app.listen(PORT, () => {
  console.log(`WIKSALSTORE running → http://localhost:${PORT}`);
  if (!PAYLINK_API_BASE_URL || !PAYLINK_API_KEY) console.warn('! Legacy ABA PayWay checks are not configured.');
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) console.warn('! Telegram bot not configured – payment proof alerts disabled.');
});
