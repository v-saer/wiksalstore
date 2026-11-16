const assert = require('node:assert/strict');
const test = require('node:test');
const { createOrderStore } = require('../lib/order-store');

class FakeRedis {
  constructor() {
    this.values = new Map();
    this.counters = new Map();
  }

  async get(key) {
    return this.values.get(key) ?? null;
  }

  async set(key, value, options = {}) {
    if (options.nx && this.values.has(key)) return null;
    this.values.set(key, value);
    return 'OK';
  }

  async eval(script, keys, args) {
    if (script.includes("redis.call('INCR'")) {
      const count = (this.counters.get(keys[0]) || 0) + 1;
      this.counters.set(keys[0], count);
      return count;
    }
    if (script.includes("redis.call('GET'")) {
      if (this.values.get(keys[0]) !== args[0]) return 0;
      this.values.delete(keys[0]);
      return 1;
    }
    throw new Error('Unexpected Redis script.');
  }
}

function createStore() {
  return createOrderStore({ redis: new FakeRedis(), isVercel: true });
}

test('creates orders once and reads them from shared storage', async () => {
  const store = createStore();
  const order = { id: 'WS-test-123', status: 'pending', provider: 'khqr-manual' };

  assert.equal(await store.createOrder(order), true);
  assert.deepEqual(await store.getOrder(order.id), order);
  assert.equal(await store.createOrder({ ...order, status: 'paid' }), false);
  assert.deepEqual(await store.getOrder(order.id), order);
});

test('indexes migrated PayWay orders by transaction ID', async () => {
  const store = createStore();
  const order = {
    id: 'WS-payway-123',
    provider: 'aba-payway',
    payment: { tranId: 'transaction-123' },
  };

  await store.createOrder(order);
  assert.deepEqual(await store.findPaywayOrder('', 'transaction-123'), order);
});

test('allows only one concurrent proof submission per order', async () => {
  const store = createStore();
  const first = await store.claimProofSubmission('WS-proof-123');

  assert.ok(first);
  assert.equal(await store.claimProofSubmission('WS-proof-123'), null);
  await store.releaseProofSubmission('WS-proof-123', first);
  assert.ok(await store.claimProofSubmission('WS-proof-123'));
});

test('does not fall back to local files when Vercel Redis is missing', async () => {
  const store = createOrderStore({ redis: null, isVercel: true });

  assert.equal(store.isAvailable, false);
  await assert.rejects(store.getOrder('WS-missing-123'), /Order storage is not configured/);
});
