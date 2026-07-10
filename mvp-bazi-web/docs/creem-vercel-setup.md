# Creem + Vercel Setup Guide

This guide is for switching the production site to Creem while keeping Stripe as a fallback/testing provider.

Official site:

- `https://www.fountersaying.com`

## 1. Vercel Environment Variables

Open Vercel:

1. Project: `mingyi-bazi-mvp`
2. Settings
3. Environment Variables
4. Add or update these variables for `Production` and `Preview`.

Required for Creem test mode:

```text
NEXT_PUBLIC_SITE_URL=https://www.fountersaying.com
PAYMENT_PROVIDER=creem
CREEM_API_KEY=your_creem_test_api_key
CREEM_PRODUCT_ID=your_full_bazi_reading_product_id
CREEM_API_BASE_URL=https://test-api.creem.io
```

Required for Creem live mode:

```text
NEXT_PUBLIC_SITE_URL=https://www.fountersaying.com
PAYMENT_PROVIDER=creem
CREEM_API_KEY=your_creem_live_api_key
CREEM_PRODUCT_ID=your_live_full_bazi_reading_product_id
CREEM_API_BASE_URL=https://api.creem.io
```

Creem test and production environments are isolated. Test keys/products must use `https://test-api.creem.io`; live keys/products must use `https://api.creem.io`. If these are mixed, checkout creation can fail with `Invalid API Key`.

Required after creating the Creem webhook:

```text
CREEM_WEBHOOK_SECRET=the_secret_from_creem_webhook_page
```

Keep existing fallback/testing variables if Stripe fallback should remain available:

```text
STRIPE_SECRET_KEY=your_stripe_test_secret_key
STRIPE_PRICE_ID=your_stripe_test_price_id
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

Do not add any secret key with a `NEXT_PUBLIC_` prefix.

## 2. Creem Webhook

Open Creem Dashboard:

1. Go to Developers / Webhooks.
2. Create a new webhook endpoint.
3. Webhook URL:

```text
https://www.fountersaying.com/api/creem/webhook
```

4. Select the completed checkout event:

```text
checkout.completed
```

5. Save the webhook.
6. Copy the webhook secret.
7. Add it to Vercel as:

```text
CREEM_WEBHOOK_SECRET=...
```

8. Redeploy the Vercel production deployment after saving the secret.

## 3. Redeploy

After updating Vercel env vars:

1. Open Vercel project `mingyi-bazi-mvp`.
2. Go to Deployments.
3. Select the latest `main` deployment.
4. Click Redeploy.
5. Make sure it redeploys with the newest environment variables.

## 4. Verification

Run:

```bash
npm run smoke:creem
```

Expected production health:

```json
{
  "ok": true,
  "paymentProvider": "creem",
  "creemCheckoutConfigured": true,
  "creemWebhookConfigured": true
}
```

If it says `paymentProvider` is `stripe`, Vercel has not received `PAYMENT_PROVIDER=creem` in the active production deployment.

If `creemCheckoutConfigured` is `false`, check:

- `CREEM_API_KEY`
- `CREEM_PRODUCT_ID`
- `CREEM_API_BASE_URL`

If `creemWebhookConfigured` is `false`, check:

- `CREEM_WEBHOOK_SECRET`

If `/api/health` says Creem checkout is configured but `/api/checkout` returns `Invalid API Key`, check this exact pairing:

| Mode | API key | Product ID | API base URL |
| --- | --- | --- | --- |
| Test | Test-mode key | Test-mode product ID | `https://test-api.creem.io` |
| Live | Live/production key | Live product ID | `https://api.creem.io` |

After changing any of these values in Vercel, redeploy production before running smoke tests again.

## 5. Manual Checkout Test

After `npm run smoke:creem` passes:

1. Open `https://www.fountersaying.com`.
2. Create a free Bazi preview.
3. Click the unlock/full report button.
4. Confirm the checkout page is Creem.
5. Complete a Creem test payment.
6. Confirm the success page returns to:

```text
https://www.fountersaying.com/reading/[reading_id]/full
```

7. Confirm the full report unlocks and survives refresh.

## 6. Live Mode Note

Use test mode until the Creem account, company verification, product, and live payments are approved.

Only switch to live mode when you have:

- live Creem API key
- live Creem product ID
- live webhook secret
- live API base URL: `https://api.creem.io`
