const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { Redis } = require('@upstash/redis');

const ORDER_KEY_PREFIX = 'wiksalstore:order:';
const TRANSACTION_KEY_PREFIX = 'wiksalstore:payment-transaction:';
const PROOF_LOCK_KEY_PREFIX = 'wiksalstore:proof-lock:';
const RATE_LIMIT_KEY_PREFIX = 'wiksalstore:rate-limit:';
const RATE_LIMIT_SCRIPT = `
  local count = redis.call('INCR', KEYS[1])
  if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
  return count
`;
const RELEASE_LOCK_SCRIPT = `
  if redis.call('GET', KEYS[1]) == ARGV[1] then
    return redis.call('DEL', KEYS[1])
  end
  return 0
`;

function createRedisClient(env = process.env) {
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function decodeOrder(value) {
  if (value && typeof value === 'object') return value;
  if (typeof value !== 'string') throw new Error('Stored order has an invalid format.');
  const order = JSON.parse(value);
  if (!order || typeof order !== 'object' || Array.isArray(order)) {
    throw new Error('Stored order has an invalid format.');
  }
  return order;
}

function createOrderStore({
  redis = createRedisClient(),
  isVercel = Boolean(process.env.VERCEL),
  ordersFile = path.join(__dirname, '..', 'data', 'orders.json'),
} = {}) {
  let localOrders;
  const localProofLocks = new Map();
  const localRateLimits = new Map();
  if (!redis && !isVercel) {
    const cleanupTimer = setInterval(() => localRateLimits.clear(), 10 * 60 * 1000);
    cleanupTimer.unref();
  }

  function ensureAvailable() {
    if (!redis && isVercel) {
      throw new Error('Order storage is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.');
    }
  }

  function readLocalOrders() {
    if (localOrders) return localOrders;
    try {
      const contents = fs.readFileSync(ordersFile, 'utf8');
      const parsed = JSON.parse(contents);
      if (!Array.isArray(parsed)) throw new Error('Local order store must contain a JSON array.');
      localOrders = parsed;
    } catch (error) {
      if (error.code === 'ENOENT') {
        localOrders = [];
      } else {
        throw error;
      }
    }
    return localOrders;
  }

  async function writeLocalOrders(orders) {
    const temporaryFile = `${ordersFile}.tmp`;
    await fs.promises.mkdir(path.dirname(ordersFile), { recursive: true });
    await fs.promises.writeFile(temporaryFile, JSON.stringify(orders, null, 2));
    await fs.promises.rename(temporaryFile, ordersFile);
    localOrders = orders;
  }

  async function getOrder(id) {
    ensureAvailable();
    if (!redis) return readLocalOrders().find((order) => order.id === id) || null;
    const value = await redis.get(`${ORDER_KEY_PREFIX}${id}`);
    return value == null ? null : decodeOrder(value);
  }

  async function createOrder(order) {
    ensureAvailable();
    if (!redis) {
      const orders = readLocalOrders();
      if (orders.some((existing) => existing.id === order.id)) return false;
      await writeLocalOrders([...orders, order]);
      return true;
    }
    const result = await redis.set(
      `${ORDER_KEY_PREFIX}${order.id}`,
      JSON.stringify(order),
      { nx: true },
    );
    if (result !== 'OK') return false;
    await indexTransaction(order);
    return true;
  }

  async function saveOrder(order) {
    ensureAvailable();
    if (!redis) {
      const orders = readLocalOrders();
      const index = orders.findIndex((entry) => entry.id === order.id);
      if (index < 0) throw new Error('Cannot update an order that does not exist.');
      const updatedOrders = orders.slice();
      updatedOrders[index] = order;
      await writeLocalOrders(updatedOrders);
      return;
    }
    await redis.set(`${ORDER_KEY_PREFIX}${order.id}`, JSON.stringify(order));
    await indexTransaction(order);
  }

  async function indexTransaction(order) {
    if (order.provider === 'aba-payway' && order.payment && order.payment.tranId) {
      await redis.set(`${TRANSACTION_KEY_PREFIX}${order.payment.tranId}`, order.id);
    }
  }

  async function findPaywayOrder(orderId, transactionId) {
    ensureAvailable();
    let order = orderId ? await getOrder(orderId) : null;
    if ((!order || order.provider !== 'aba-payway') && transactionId && redis) {
      const indexedId = await redis.get(`${TRANSACTION_KEY_PREFIX}${transactionId}`);
      if (indexedId) order = await getOrder(indexedId);
    }
    if ((!order || order.provider !== 'aba-payway') && transactionId && !redis) {
      order = readLocalOrders().find((entry) =>
        entry.provider === 'aba-payway' &&
        entry.payment &&
        entry.payment.tranId === transactionId
      ) || null;
    }
    return order && order.provider === 'aba-payway' ? order : null;
  }

  async function consumeRateLimit(key, windowMs) {
    ensureAvailable();
    if (redis) {
      const seconds = Math.max(1, Math.ceil(windowMs / 1000));
      const count = await redis.eval(
        RATE_LIMIT_SCRIPT,
        [`${RATE_LIMIT_KEY_PREFIX}${key}`],
        [String(seconds)],
      );
      return Number(count);
    }
    const now = Date.now();
    const activeHits = (localRateLimits.get(key) || []).filter((timestamp) => now - timestamp < windowMs);
    activeHits.push(now);
    localRateLimits.set(key, activeHits);
    return activeHits.length;
  }

  async function claimProofSubmission(orderId) {
    ensureAvailable();
    const token = crypto.randomUUID();
    if (!redis) {
      if (localProofLocks.has(orderId)) return null;
      localProofLocks.set(orderId, token);
      return token;
    }
    const result = await redis.set(
      `${PROOF_LOCK_KEY_PREFIX}${orderId}`,
      token,
      { nx: true, ex: 60 },
    );
    return result === 'OK' ? token : null;
  }

  async function releaseProofSubmission(orderId, token) {
    ensureAvailable();
    if (!redis) {
      if (localProofLocks.get(orderId) === token) localProofLocks.delete(orderId);
      return;
    }
    await redis.eval(
      RELEASE_LOCK_SCRIPT,
      [`${PROOF_LOCK_KEY_PREFIX}${orderId}`],
      [token],
    );
  }

  return {
    isAvailable: Boolean(redis) || !isVercel,
    getOrder,
    createOrder,
    saveOrder,
    findPaywayOrder,
    consumeRateLimit,
    claimProofSubmission,
    releaseProofSubmission,
  };
}

module.exports = {
  ORDER_KEY_PREFIX,
  TRANSACTION_KEY_PREFIX,
  createOrderStore,
  createRedisClient,
};
