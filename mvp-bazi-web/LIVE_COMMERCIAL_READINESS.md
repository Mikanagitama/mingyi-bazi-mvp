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
- Production Creem checkout creation now passes after correcting Vercel live `CREEM_API_KEY`, `CREEM_PRODUCT_ID`, and `CREEM_API_BASE_URL`.
- `npm run smoke:p0`, `npm run smoke:creem`, and `npm run smoke:creem-webhook` pass against `https://www.fountersaying.com`.
- Manual browser cancel recovery passed: preview -> unlock -> Creem checkout -> browser Back returns to the same preview page.
- Public page/asset QA passed for homepage, form, sample report, legal/trust pages, robots, sitemap, OG images, Apple touch icon, app icon, and default `/favicon.ico`.
- Static public bundle scan found no configured payment/database secret values in `.next/static` or `public`.

## Resolved Blocker

Production Creem checkout creation previously failed:

- Cause: Vercel production env did not match the locally verified live Creem key/product/base URL pairing.
- Action: Vercel `CREEM_API_KEY`, `CREEM_PRODUCT_ID`, and `CREEM_API_BASE_URL` were overwritten from the verified local env, then production was redeployed.
- Result: `/api/health` reports `creemApiEnvironment=live`; `npm run smoke:p0` and `npm run smoke:creem` now pass.

This unblocks checkout creation. Real-money launch still needs a user-approved small live payment and Creem dashboard order confirmation.

## Manual Business Tasks Before Real-Money Launch

- Confirm Creem live/KYC approval remains active.
- Confirm the live Creem Full Bazi Reading product price is exactly `$2.99 USD`.
- Configure/confirm live Creem webhook:
  - `https://www.fountersaying.com/api/creem/webhook`
  - event: `checkout.completed`
- Confirm `support@fountersaying.com` receives email.
- Run one small real payment test after live approval.
- Confirm the Creem dashboard order amount/currency and that the paid report unlocks 8 sections.
- Re-check Creem checkout language from an English browser/profile before English-market paid ads; Creem localizes checkout automatically.
- Confirm tax/accounting obligations with an accountant before broad paid traffic.
- Consider adding CSP, `X-Frame-Options`, `X-Content-Type-Options`, and `Referrer-Policy` after launch analytics/payment flows stabilize; Vercel HSTS is already present.

## Do Not Claim Yet

- Do not claim real payments are live until Creem live env verification and a small real payment test pass.
- Do not claim tax compliance is solved without accountant confirmation.
- Do not present reports as medical, legal, financial, investment, or psychological advice.
- Do not claim guaranteed predictions, guaranteed wealth, guaranteed relationship outcomes, or health outcomes.

## Final Pre-Launch Checklist

- [x] Creem live mode enabled.
- [x] Live Creem product ID configured in Vercel.
- [ ] Live Creem product price confirmed as `$2.99 USD`.
- [x] Vercel `CREEM_API_KEY` confirmed valid for live Creem mode by production checkout smoke.
- [x] Vercel `CREEM_PRODUCT_ID` confirmed compatible with the live API key by production checkout smoke.
- [x] Production Creem API environment reports `live` from `/api/health`.
- [x] Live Creem webhook secret configured in Vercel.
- [x] Vercel redeployed after live env updates.
- [x] `npm run smoke:p0` passes against production.
- [x] `npm run smoke:creem` passes against production.
- [x] `npm run smoke:creem-webhook` passes against production.
- [ ] One small real payment test passes.
- [ ] Creem dashboard order shows `$2.99 USD`.
- [ ] Paid report unlocks after the real payment.
- [x] Checkout abandon/cancel recovery checked with browser Back.
- [ ] Refund/contact email works.
- [x] Post-deploy sample report CTA flow passes from preview and direct `/sample-report`.
- [x] Mobile final check passed for launch-polish build and 2026-07-10 sample CTA re-check.
- [x] Public marketing materials are prepared.
- [x] Default `/favicon.ico` returns a real icon asset after the favicon fix is deployed.

## Readiness Answer

Small-scale public marketing: safe for cautious traffic, content review, SEO/social testing, and user feedback. Checkout creation now passes, but keep spend low until the first real live payment is confirmed.

Real-money launch: close, but not fully proven. Complete one small user-approved real payment, confirm the Creem dashboard order shows `$2.99 USD`, confirm the return reaches the paid full report, and confirm the paid report remains accessible after refresh. Also spot-check checkout language in an English browser before scaling English-market ads.
