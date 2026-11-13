# WIKSALSTORE

Telegram Premium — pay with ABA QR.

## Run it

```bash
npm install
cp .env.example .env     # then fill in the values
npm start                # http://localhost:3000
```

Needs Node 18+.

The storefront opens in Khmer for first-time visitors. Use the Khmer / English
buttons in the header to switch languages; the selection is remembered in that browser.

## .env settings

| Key | What it is |
|---|---|
| `PAYWAY_MODE` | Must be `qr-api`; hosted/demo payment is not supported |
| `PAYWAY_MERCHANT_ID` | Your ABA PayWay merchant ID |
| `PAYWAY_SECRET_KEY` | Your ABA PayWay secret key |
| `PAYWAY_API_URL` | ABA PayWay production QR-generation endpoint |
| `PAYWAY_CHECK_API_URL` | ABA PayWay production transaction-check endpoint |
| `PAYWAY_CALLBACK_URL` | Public HTTPS callback URL for payment confirmation |
| `PAYWAY_LIFETIME` | QR lifetime in minutes |
| `TELEGRAM_BOT_TOKEN` | Create a bot with @BotFather |
| `TELEGRAM_ADMIN_CHAT_ID` | Your chat id (ask @userinfobot). Press **Start** on your bot first |

## How an order flows

1. Customer picks a Telegram Premium plan → types their Telegram username.
2. Site looks up the profile (avatar + name) so they can confirm it is theirs.
3. The server calls ABA PayWay's QR API to generate an order-specific KHQR code for the exact price.
4. Customer pays through ABA.
5. The callback is independently verified through ABA PayWay's Check Transaction API before the order is marked paid. The order is saved to
   `data/orders.json`, and your Telegram bot sends you the order alert.

There is no hosted-link or demo-payment fallback. Real checkout stays disabled until you configure your production merchant ID, API key, and publicly reachable HTTPS callback URL in `.env`. QR generation uses ABA PayWay `payments/generate-qr` with `payment_option=abapay_khqr`; payment confirmation uses `payments/check-transaction-2`.

Prices live in `server.js` (`CATALOG`). The server uses its own prices, so customers can't change them.

## Files

- `server.js` – Telegram Premium catalog, API, ABA QR generation, callback handling, bot alert, orders.json
- `public/` – the website (index.html, style.css, app.js)
- `data/orders.json` – every order (pending / paid / expired)

## Hosting

Run it on any Node host (VPS, Railway, Render…). Put it behind HTTPS (Caddy / nginx / the host's built-in HTTPS).
Keep `.env` private and do not upload it anywhere.

Support link shown on the site: https://t.me/nhsalnghahh
