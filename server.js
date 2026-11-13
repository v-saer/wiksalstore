require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */
const PORT = process.env.PORT || 3000;
const PAYWAY_MODE = String(process.env.PAYWAY_MODE || 'qr-api').toLowerCase();
const PAYWAY_MERCHANT_ID = process.env.PAYWAY_MERCHANT_ID || '';
const PAYWAY_SECRET_KEY = process.env.PAYWAY_SECRET_KEY || '';
const PAYWAY_API_URL = process.env.PAYWAY_API_URL || 'https://checkout.payway.com.kh/api/payment-gateway/v1/payments/generate-qr';
const PAYWAY_CHECK_API_URL = process.env.PAYWAY_CHECK_API_URL || 'https://checkout.payway.com.kh/api/payment-gateway/v1/payments/check-transaction-2';
const PAYWAY_CALLBACK_URL = process.env.PAYWAY_CALLBACK_URL || '';
const PAYWAY_LIFETIME = Number(process.env.PAYWAY_LIFETIME || 6);
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '';
const QR_TTL_MS = PAYWAY_LIFETIME * 60 * 1000;
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');
const SUPPORT = 'nhsalnghahh';

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
/*  ABA QR generation                                                   */
/* ------------------------------------------------------------------ */
function paywayHash(payload) {
  const fields = [
    'req_time', 'merchant_id', 'tran_id', 'amount', 'items', 'first_name', 'last_name',
    'email', 'phone', 'purchase_type', 'payment_option', 'callback_url', 'return_deeplink',
    'currency', 'custom_fields', 'return_params', 'payout', 'lifetime', 'qr_image_template',
  ];
  const value = fields.map((field) => payload[field] == null ? '' : String(payload[field])).join('');
  return crypto.createHmac('sha512', PAYWAY_SECRET_KEY).update(value).digest('base64');
}

function paywayRequestTime() {
  return new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
}

async function checkPaywayTransaction(order) {
  const reqTime = paywayRequestTime();
  const payload = {
    req_time: reqTime,
    merchant_id: PAYWAY_MERCHANT_ID,
    tran_id: order.id,
    hash: crypto.createHmac('sha512', PAYWAY_SECRET_KEY)
      .update(reqTime + PAYWAY_MERCHANT_ID + order.id)
      .digest('base64'),
  };
  const response = await fetch(PAYWAY_CHECK_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': UA },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  let data;
  try { data = JSON.parse(text); } catch { throw new Error('ABA transaction check returned invalid JSON.'); }
  if (!response.ok) throw new Error(`ABA transaction check failed (HTTP ${response.status}).`);

  const transaction = data.data && typeof data.data === 'object' ? data.data : data;
  const gatewayStatus = data.status || transaction.status;
  const amount = Number(transaction.total_amount);
  return String(gatewayStatus && gatewayStatus.code) === '00'
    && transaction.payment_status === 'APPROVED'
    && Number(transaction.payment_status_code) === 0
    && Number.isFinite(amount)
    && Math.round(amount * 100) === Math.round(Number(order.amount) * 100);
}

async function generatePaywayQr(order) {
  if (!PAYWAY_MERCHANT_ID) throw new Error('PAYWAY_MERCHANT_ID is not configured.');
  if (!PAYWAY_SECRET_KEY) throw new Error('PAYWAY_SECRET_KEY is not configured.');
  if (!PAYWAY_CALLBACK_URL) throw new Error('PAYWAY_CALLBACK_URL is not configured.');
  if (!Number.isInteger(PAYWAY_LIFETIME) || PAYWAY_LIFETIME < 3 || PAYWAY_LIFETIME > 172800) {
    throw new Error('PAYWAY_LIFETIME must be a whole number between 3 and 172800 minutes.');
  }

  const amount = Number(order.amount).toFixed(2);
  const base = {
    req_time: paywayRequestTime(),
    merchant_id: PAYWAY_MERCHANT_ID,
    tran_id: order.id,
    first_name: 'ABA',
    last_name: 'Pay',
    email: 'store@wiksalstore.com',
    phone: '000000000',
    amount,
    purchase_type: 'purchase',
    payment_option: 'abapay_khqr',
    items: Buffer.from(JSON.stringify([{ name: `${order.itemName} (${order.id})`, quantity: 1, price: Number(amount) }])).toString('base64'),
    currency: 'USD',
    callback_url: Buffer.from(PAYWAY_CALLBACK_URL).toString('base64'),
    return_deeplink: null,
    custom_fields: null,
    return_params: null,
    payout: null,
    lifetime: Number(PAYWAY_LIFETIME) || 6,
    qr_image_template: 'template3_color',
  };

  const payload = { ...base, hash: paywayHash(base) };
  const res = await fetch(PAYWAY_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': UA },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }
  if (!res.ok || (data && data.status && String(data.status.code) !== '0')) {
    const msg = (data && data.status && data.status.message) || text || 'ABA QR generation failed';
    throw new Error(msg);
  }
  if (!data.qrString || !data.qrImage) throw new Error('ABA QR API returned no QR string or image.');

  return {
    qr: data.qrString || '',
    qrImage: data.qrImage || '',
    raw: data,
  };
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
    `💵 <b>Amount:</b> $${order.amount.toFixed(2)}\n` +
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
app.use(express.json({ limit: '10kb' }));
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
  });
  next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/config', (req, res) => {
  const catalog = {};
  for (const [k, c] of Object.entries(CATALOG)) {
    catalog[k] = { label: c.label, platform: c.platform, items: Object.entries(c.items).map(([id, i]) => ({ id, ...i })) };
  }
  res.json({ support: SUPPORT, catalog });
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
  try {
    const { category, itemId, username } = req.body || {};
    const cat = CATALOG[category];
    const item = cat && cat.items[itemId];
    if (!item) return res.status(400).json({ error: 'Invalid product.' });
    if (PAYWAY_MODE !== 'qr-api') {
      return res.status(503).json({ error: 'Only ABA QR API payments are supported.' });
    }
    if (!PAYWAY_MERCHANT_ID || !PAYWAY_SECRET_KEY || !PAYWAY_CALLBACK_URL) {
      return res.status(503).json({ error: 'ABA QR payments are not configured yet. Please contact support.' });
    }

    // re-verify the account server-side so nobody can order for a made-up profile
    const clean = String(username || '').trim().replace(/^@/, '');
    const account = /^[A-Za-z0-9_]{5,32}$/.test(clean) ? await lookupTelegram(clean) : null;
    if (!account) return res.status(400).json({ error: 'Account could not be verified.' });

    const id = 'WS-' + Date.now().toString(36).toUpperCase() + crypto.randomBytes(2).toString('hex').toUpperCase();
    const now = Date.now();
    const order = {
      id,
      status: 'pending',
      category,
      categoryLabel: cat.label,
      platform: cat.platform,
      itemId,
      itemName: item.name,
      amount: item.price,
      currency: 'USD',
      account: {
        username: account.username,
        displayName: account.displayName || '',
        id: account.id || null,
        profileUrl: account.profileUrl,
      },
      createdAt: new Date(now).toISOString(),
      expiresAt: now + QR_TTL_MS,
      paidAt: null,
      botNotified: false,
      provider: 'aba-payway-api',
    };

    const payway = await generatePaywayQr(order);
    order.payway = payway.raw;
    orders.push(order);
    await saveOrders();
    res.json({
      id,
      amount: order.amount,
      itemName: item.name,
      expiresAt: order.expiresAt,
      qrImage: payway.qrImage,
      provider: order.provider,
    });
  } catch (e) {
    console.error('create order:', e);
    res.status(500).json({ error: 'Could not create the payment. Please try again or contact support.' });
  }
});

app.get('/api/orders/:id/status', rateLimit(120, 60_000), async (req, res) => {
  const order = findOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  if (order.status === 'pending' && Date.now() > order.expiresAt) {
    order.status = 'expired';
    await saveOrders();
  }
  res.json({ id: order.id, status: order.status, paidAt: order.paidAt });
});

app.post('/api/payway/callback', express.json({ limit: '1mb' }), async (req, res) => {
  try {
    const payload = req.body || {};
    const orderId = typeof payload.tran_id === 'string' ? payload.tran_id : '';
    const order = findOrder(orderId);
    if (!order) return res.status(404).json({ ok: false, error: 'Order not found' });
    if (order.provider !== 'aba-payway-api') return res.status(400).json({ ok: false, error: 'This order is not an ABA QR API payment.' });

    if (String(payload.status) === '0' && order.status !== 'paid' && await checkPaywayTransaction(order)) {
      await markPaid(order, { hash: payload.apv || null, from: payload.payer_account || 'payway' });
    }

    res.json({ ok: true, status: order.status });
  } catch (e) {
    console.error('PayWay callback failed:', e.message);
    res.status(500).json({ ok: false, error: 'Callback failed' });
  }
});

app.listen(PORT, () => {
  console.log(`WIKSALSTORE running → http://localhost:${PORT}`);
  if (PAYWAY_MODE !== 'qr-api') {
    console.error('! Unsupported payment mode – only ABA QR API payments are allowed.');
  } else if (!PAYWAY_MERCHANT_ID || !PAYWAY_SECRET_KEY || !PAYWAY_CALLBACK_URL) {
    console.warn('! ABA QR payment is not fully configured yet – checkout will be disabled.');
  }
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) console.warn('! Telegram bot not configured – order alerts disabled.');
  if (PAYWAY_MODE === 'qr-api' && PAYWAY_MERCHANT_ID && PAYWAY_SECRET_KEY && PAYWAY_CALLBACK_URL) console.log('ABA QR API mode enabled.');
});
