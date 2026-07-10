# Live Commercial Readiness

## Technically Ready

- Official domain works: `https://www.fountersaying.com`.
- Canonical metadata, sitemap, and robots use the official domain.
- Creem test hosted checkout has been verified.
- Creem signed webhook smoke passes.
- Creem return lands on the official domain.
- Paid readings become `paymentStatus=paid`.
- Full report unlocks after payment.
- Full report contract remains 8 sections.
- Trust pages, sample report, SEO pages, sitemap, and robots exist.
- Mobile QA passed across required viewports.
- First-party funnel events are documented and trackable without report-content logging.
- OG, square, vertical, favicon, and app icon assets exist.
- Launch content kit exists for small-scale public marketing.
- Official displayed price is `Full Bazi Reading: $2.99 USD`, one-time payment.
- Sample report CTA dead end has been fixed and verified in production.
- Creem completed webhooks now validate amount/currency against `$2.99 USD`.
- Public analytics events are rate limited.
- Invalid reading ids now return friendly not found instead of production 500s.
- Signed Creem webhook unlock still produces an 8-section full report.

## Current Blocker

Production Creem checkout creation currently fails:

- `npm run smoke:p0` reaches `/api/checkout` and receives `400 {"error":"Invalid API Key"}`.
- `npm run smoke:creem` reaches `/api/checkout` and receives `400 {"error":"Invalid API Key"}`.
- `/api/health` still reports Creem env vars as present, so the likely issue is that the Vercel `CREEM_API_KEY` value, live/test mode, or `CREEM_API_BASE_URL` does not match the active Creem product/account.

This blocks real checkout cancel/success testing and any real-money public launch.

## Manual Business Tasks Before Real-Money Launch

- Confirm Creem live/KYC approval remains active.
- Confirm the live Creem Full Bazi Reading product price is exactly `$2.99 USD`.
- Replace Vercel test values with live values:
  - `CREEM_API_KEY`
  - `CREEM_PRODUCT_ID`
  - `CREEM_WEBHOOK_SECRET`
  - `CREEM_API_BASE_URL` if Creem requires a different live endpoint
- Configure live Creem webhook:
  - `https://www.fountersaying.com/api/creem/webhook`
  - event: `checkout.completed`
- Redeploy Vercel after live env changes.
- Confirm `support@fountersaying.com` receives email.
- Run one small real payment test after live approval.
- Confirm the Creem dashboard order amount/currency and that the paid report unlocks 8 sections.
- Confirm tax/accounting obligations with an accountant before broad paid traffic.

## Do Not Claim Yet

- Do not claim real payments are live until Creem live env verification and a small real payment test pass.
- Do not claim tax compliance is solved without accountant confirmation.
- Do not present reports as medical, legal, financial, investment, or psychological advice.
- Do not claim guaranteed predictions, guaranteed wealth, guaranteed relationship outcomes, or health outcomes.

## Final Pre-Launch Checklist

- [ ] Creem live mode enabled.
- [ ] Live Creem product ID configured in Vercel.
- [ ] Live Creem product price confirmed as `$2.99 USD`.
- [ ] Vercel `CREEM_API_KEY` confirmed valid for the same live/test mode as the configured product and API base URL.
- [ ] Live Creem webhook secret configured in Vercel.
- [ ] Vercel redeployed after live env updates.
- [ ] `npm run smoke:p0` passes against production.
- [ ] `npm run smoke:creem` passes against production.
- [x] `npm run smoke:creem-webhook` passes against production.
- [ ] One small real payment test passes.
- [ ] Creem dashboard order shows `$2.99 USD`.
- [ ] Paid report unlocks after the real payment.
- [ ] Refund/contact email works.
- [x] Post-deploy sample report CTA flow passes from preview and direct `/sample-report`.
- [x] Mobile final check passed for launch-polish build and 2026-07-10 sample CTA re-check.
- [x] Public marketing materials are prepared.

## Readiness Answer

Small-scale public marketing: safe for cautious non-payment traffic, content review, SEO/social testing, and user feedback. Avoid paid conversion pushes until checkout creation passes.

Real-money launch: not ready. Fix the production Creem `Invalid API Key` checkout blocker, redeploy, rerun `npm run smoke:p0` and `npm run smoke:creem`, then complete one small user-approved real payment and confirm the Creem dashboard order plus paid report unlock.
