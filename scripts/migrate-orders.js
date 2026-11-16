require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const fs = require('fs');
const path = require('path');
const { Redis } = require('@upstash/redis');
const { ORDER_KEY_PREFIX, TRANSACTION_KEY_PREFIX } = require('../lib/order-store');

async function main() {
  const source = path.join(__dirname, '..', 'data', 'orders.json');
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const dryRun = process.argv.includes('--dry-run');

  if (!fs.existsSync(source)) throw new Error('The local data/orders.json file was not found.');
  if (!dryRun && (!url || !token)) {
    throw new Error('Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env before migrating.');
  }

  const orders = JSON.parse(fs.readFileSync(source, 'utf8'));
  if (!Array.isArray(orders)) throw new Error('The local order file must contain a JSON array.');
  const redis = dryRun ? null : new Redis({ url, token });
  let imported = 0;
  let preserved = 0;

  for (const order of orders) {
    if (!order || typeof order !== 'object' || Array.isArray(order) ||
        typeof order.id !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(order.id)) {
      throw new Error('The local order file contains an invalid order record; no record details were printed.');
    }

    if (dryRun) {
      imported += 1;
      continue;
    }

    const key = `${ORDER_KEY_PREFIX}${order.id}`;
    const result = await redis.set(key, JSON.stringify(order), { nx: true });
    const savedOrder = result === 'OK' ? order : await redis.get(key);
    if (result === 'OK') imported += 1;
    else preserved += 1;

    const existing = typeof savedOrder === 'string' ? JSON.parse(savedOrder) : savedOrder;
    if (
      existing &&
      existing.provider === 'aba-payway' &&
      existing.payment &&
      existing.payment.tranId
    ) {
      await redis.set(`${TRANSACTION_KEY_PREFIX}${existing.payment.tranId}`, existing.id);
    }
  }

  console.log(
    dryRun
      ? `Dry run complete: ${imported} records are eligible for migration.`
      : `Migration complete: ${imported} imported, ${preserved} existing records preserved.`,
  );
}

main().catch((error) => {
  console.error(`Order migration failed: ${error.message}`);
  process.exitCode = 1;
});
