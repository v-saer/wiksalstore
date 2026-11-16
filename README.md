# WIKSALSTORE

Telegram Premium checkout with ABA payment links, package-matched KHQR images, and manual payment verification.

## Run it

```bash
npm install
cp .env.example .env
# Configure Telegram bot settings in .env or your hosting provider.
npm start
```

Needs Node.js 24.x. Each USD package displays its matching ABA KHQR image and direct payment link. Customers upload a PNG, JPEG, or WebP payment screenshot (up to 5 MB); the server sends it with the order details to the configured Telegram admin chat. A submitted screenshot is **not** treated as verified payment. Confirm the transaction before delivering Premium.

## Server environment

| Variable | Purpose |
|---|---|
| `PORT` | HTTP server port (default `3000`) |
| `TELEGRAM_BOT_TOKEN` | Bot token used to send payment proofs |
| `TELEGRAM_ADMIN_CHAT_ID` | Telegram chat that receives payment proofs |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint for shared order storage and rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token used to issue private client-upload tokens |
| `PAYLINK_API_BASE_URL` | Optional legacy PayWay API URL for previously created PayWay orders |
| `PAYLINK_API_KEY` | Optional legacy PayWay API key |
| `PAYLINK_WEBHOOK_SECRET` | Optional legacy PayWay webhook HMAC secret |

Telegram bot settings are required for customers to submit payment screenshots. Start a chat with the bot and make sure it can send messages to the configured admin chat. Keep all credentials in server-side environment variables; never add real values to source control, browser code, logs, or support messages.

Vercel detects the exported Express app in `server.js` and runs it as a Function; files in `public/` are served as static assets. Connect an Upstash Redis store and a **private** Vercel Blob store to the project. Add the Upstash variables, `BLOB_READ_WRITE_TOKEN`, and Telegram variables to the Vercel project environment before enabling checkout. Without these services, checkout is disabled and API routes that need storage return an explicit service-unavailable response.

Receipt images upload directly from the browser to private Blob storage, so the 5 MB limit does not exceed Vercel Function's request-body limit. After forwarding a screenshot to Telegram, the app deletes it from Blob; abandoned uploads expire after one day.

For local development, the server loads `.env` via `dotenv` and uses `data/orders.json` unless Upstash credentials are configured. Run `npm run build:client` after changing `src/blob-upload.js`; its generated `public/blob-upload.js` is served as a static asset. `.env.example` is only a blank template. Never commit `.env` or `data/orders.json`.

### Migrate existing orders

The migration command copies `data/orders.json` into Upstash without overwriting existing Redis order records. It also recreates the transaction lookup keys used by legacy PayWay webhooks.

1. Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to the ignored local `.env` file.
2. Preview the record count with `npm run migrate:orders -- --dry-run`.
3. Run `npm run migrate:orders`. The source file is not changed; the command can be rerun safely if interrupted.

## Manual payment flow

1. The server verifies the Telegram username and chooses the matching ABA payment link and amount from its catalog.
2. The browser displays the original ABA KHQR image associated with that package's payment link. Customers can scan it with a KHQR-capable banking app or open the ABA link directly.
3. Customers upload their payment screenshot and submit it. The server validates the image type and size, then forwards it with order details to the configured Telegram admin chat.
4. The order is marked `proof_submitted`, not `paid`; an admin must verify the payment before delivery.

Previously saved PayWay orders retain their legacy status-check and webhook handling. New checkouts use the manual payment-link flow.
