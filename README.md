# WIKSALSTORE

Telegram Premium checkout with ABA payment links, package-matched KHQR images, and manual payment verification.

## Run it

```bash
npm install
cp .env.example .env
# Configure Telegram bot settings in .env or your hosting provider.
npm start
```

Needs Node.js 18+. Each USD package displays its matching ABA KHQR image and direct payment link. Customers upload a PNG, JPEG, or WebP payment screenshot (up to 5 MB); the server sends it with the order details to the configured Telegram admin chat. A submitted screenshot is **not** treated as verified payment. Confirm the transaction before delivering Premium.

## Server environment

| Variable | Purpose |
|---|---|
| `PORT` | HTTP server port (default `3000`) |
| `TELEGRAM_BOT_TOKEN` | Bot token used to send payment proofs |
| `TELEGRAM_ADMIN_CHAT_ID` | Telegram chat that receives payment proofs |
| `PAYLINK_API_BASE_URL` | Optional legacy PayWay API URL for previously created PayWay orders |
| `PAYLINK_API_KEY` | Optional legacy PayWay API key |
| `PAYLINK_WEBHOOK_SECRET` | Optional legacy PayWay webhook HMAC secret |

Telegram bot settings are required for customers to submit payment screenshots. Start a chat with the bot and make sure it can send messages to the configured admin chat. Keep all credentials in server-side environment variables; never add real values to source control, browser code, logs, or support messages.

The server loads `.env` from its working directory via `dotenv`; `.env.example` is only a blank template. Put credentials in the ignored `.env` file or configure them in the hosting provider's server environment, then restart the Node server.

## Manual payment flow

1. The server verifies the Telegram username and chooses the matching ABA payment link and amount from its catalog.
2. The browser displays the original ABA KHQR image associated with that package's payment link. Customers can scan it with a KHQR-capable banking app or open the ABA link directly.
3. Customers upload their payment screenshot and submit it. The server validates the image type and size, then forwards it with order details to the configured Telegram admin chat.
4. The order is marked `proof_submitted`, not `paid`; an admin must verify the payment before delivery.

Previously saved PayWay orders retain their legacy status-check and webhook handling. New checkouts use the manual payment-link flow.
