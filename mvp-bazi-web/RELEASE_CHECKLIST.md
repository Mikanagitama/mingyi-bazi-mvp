# Founter Saying Commercial Launch Checklist

Canonical production URL:

- `https://www.fountersaying.com`

## Required Vercel Environment Variables

- `NEXT_PUBLIC_SITE_URL=https://www.fountersaying.com`
- `PAYMENT_PROVIDER=creem`
- `CREEM_API_KEY`
- `CREEM_PRODUCT_ID`
- `CREEM_WEBHOOK_SECRET`
- `CREEM_API_BASE_URL=https://test-api.creem.io` for Creem test mode; switch to `https://api.creem.io` only after live approval.
- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `AI_PROVIDER=deepseek`
- `OPENAI_API_KEY` or `DEEPSEEK_API_KEY`, matching the current DeepSeek compatibility setup.
- `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, and `STRIPE_WEBHOOK_SECRET` only if Stripe fallback testing remains enabled.

## Creem Webhook Setup

1. Open Creem Dashboard.
2. Go to Developers / Webhooks.
3. Create a webhook endpoint.
4. Use this URL:
   - `https://www.fountersaying.com/api/creem/webhook`
5. Select the completed checkout event:
   - `checkout.completed`
6. Copy the webhook secret.
7. Add it to Vercel:
   - `CREEM_WEBHOOK_SECRET=...`
8. Redeploy after saving the secret.

Creem signs webhooks with the `creem-signature` header. The app verifies that header when `CREEM_WEBHOOK_SECRET` is configured. If the secret is empty during test setup, the app can build and start, but the site should not be treated as commercially ready.

## Email Routing

Public UI uses:

- `support@fountersaying.com`

If Cloudflare Email Routing is not configured yet:

1. Open Cloudflare for `fountersaying.com`.
2. Enable Email Routing.
3. Create `support@fountersaying.com`.
4. Forward it to the owner's Gmail.
5. Send a test email and confirm delivery.

## Manual Commercial Checks

1. Homepage opens on `https://www.fountersaying.com`.
2. `/api/health` returns `ok:true`.
3. Birth form works.
4. Free preview generates.
5. Full report is locked before payment.
6. Creem checkout opens from the unlock button.
7. Successful Creem test payment returns to `/reading/[id]/full`.
8. Webhook unlocks the correct reading.
9. Full report waits or generates if needed.
10. Full report unlocks and survives refresh.
11. Mobile layout has no horizontal overflow.
12. Trust pages work.
13. Sample report works.
14. SEO pages work.
15. `/sitemap.xml` and `/robots.txt` use `https://www.fountersaying.com`.
16. Footer links work.
17. No secret key appears in the frontend bundle.
18. Stripe test fallback works when `PAYMENT_PROVIDER=stripe`.

## Known Launch Gate

Creem live payments may require account approval/KYC. Keep `CREEM_API_BASE_URL=https://test-api.creem.io` until live mode is approved and a live product/API key is ready.
