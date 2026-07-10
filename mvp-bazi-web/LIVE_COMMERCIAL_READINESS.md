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
- Sample report CTA dead end has been fixed in code and needs post-deploy browser verification.
- Creem completed webhooks now validate amount/currency against `$2.99 USD`.
- Public analytics events are rate limited.

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
- [ ] Live Creem webhook secret configured in Vercel.
- [ ] Vercel redeployed after live env updates.
- [ ] `npm run smoke:creem` passes against production.
- [ ] `npm run smoke:creem-webhook` passes if Creem live webhook testing supports it safely.
- [ ] One small real payment test passes.
- [ ] Creem dashboard order shows `$2.99 USD`.
- [ ] Paid report unlocks after the real payment.
- [ ] Refund/contact email works.
- [ ] Post-deploy sample report CTA flow passes from preview and direct `/sample-report`.
- [x] Mobile final check passed locally for launch-polish build.
- [x] Public marketing materials are prepared.

## Readiness Answer

Small-scale public marketing: pending the current pre-launch bug bash verification after the sample CTA and price/security fixes deploy.

Real-money launch: not ready until live Creem env verification, support email routing, one small real payment test, and paid report unlock confirmation are complete.
