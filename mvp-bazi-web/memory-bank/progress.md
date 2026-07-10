# Mingyi Progress

## 2026-07-10 Pre-Launch Bug Bash

### Scope

- Current goal is bug discovery/fixes, privacy/security QA, price consistency, real-user flow simulation, and launch readiness decision.
- Product scope remains the existing one-time Full Bazi Reading only.
- Official launch price is `Full Bazi Reading: $2.99 USD, one-time payment, no subscription, no recurring charge`.

### Fixes Completed

- Added `src/lib/product.ts` as the single price/copy source for the Full Bazi Reading price and primary paid CTA.
- Replaced retired launch-test public copy with `$2.99`.
- Removed retired price defaults from Stripe fallback/webhook tests so old 500-style values remain only in negative guardrail tests.
- Updated sample report top and bottom CTA areas so the page is not a dead end:
  - with `reading_id`, it can start checkout for the active reading
  - without `reading_id`, it explains that a free preview is needed first
- Added one-time/no-recurring payment copy to direct `/sample-report` CTA areas.
- Updated preview sample-report link to preserve reading context through `?reading_id=...`.
- Added invalid reading id validation so production no longer returns 500 for non-UUID reading ids.
- Added a friendly not-found page with support email for missing readings.
- Added Creem webhook amount/currency validation for `$2.99 USD`.
- Added public analytics endpoint rate limiting with `MINGYI_EVENTS_RATE_LIMIT_PER_MINUTE`.
- Created:
  - `BUG_BASH_SECURITY_QA.md`
  - `PRIVACY_DATA_MAP.md`
  - `SECURITY_AUDIT.md`

### Verification So Far

- `npm test` passed: 17 files, 57 tests.
- `npm run build` passed.
- `npm run smoke:creem-webhook` passed against production and unlocked an 8-section paid report.
- Production `/api/health` returned `ok=true`, `paymentProvider=creem`, `creemCheckoutConfigured=true`, `creemWebhookConfigured=true`, `aiProvider=deepseek`.
- Production `/api/health` now also reports `creemApiEnvironment=live`, proving the app is using the live Creem API endpoint.
- Production `/robots.txt` and `/sitemap.xml` use `https://www.fountersaying.com` and do not reference `vercel.app`.
- Production preview flow check created reading `80c10212-8fad-41be-b637-645832ec2fa5`; preview preserved `/sample-report?reading_id=...`, sample report linked back to the same reading, and preview did not leak a full report.
- Production invalid reading API now returns 404; invalid full-report page returns friendly not found with `support@fountersaying.com` and no report leak.
- Mobile/browser QA checked 20 page/viewport combinations across `360x800`, `390x844`, `430x932`, and `768x1024`; failures: 0.
- Retired launch-test pricing search only finds test-only negative guardrails.

### 2026-07-10 Creem Live Env Redeploy

- Overwrote Vercel production `CREEM_API_KEY`, `CREEM_PRODUCT_ID`, and `CREEM_API_BASE_URL` from the locally verified live `.env.local` values without printing secrets.
- Redeployed production from Vercel after the environment update.
- `/api/health` reports `paymentProvider=creem` and `creemApiEnvironment=live`.
- `npm run smoke:creem` passed: production created a reading and returned Creem checkout URLs from both `/api/checkout` and `/api/creem/create-checkout-session`.
- `npm run smoke:p0` passed against `https://www.fountersaying.com`.
- `npm run smoke:creem-webhook` passed and unlocked reading `d8e0a459-2b82-4188-a020-5dc7678c2956` with an 8-section paid report.
- Manual browser checkout abandon/cancel recovery passed for reading `85929332-2d9e-4548-b458-b15d22867291`: preview -> unlock -> Creem checkout -> browser Back returned to the same preview page with the unlock CTA still visible.
- Creem checkout showed localized Chinese billing labels in this browser while product name, description, and `$2.99` price remained correct. Creem documents automatic checkout localization, so re-check with an English browser/profile before English-market paid ads.
- Public page sweep passed for homepage, form, sample report, legal/trust pages, sitemap, robots, and health: all returned 2xx/3xx, no retired JPY/yen copy, no `vercel.app` leakage, and robots/sitemap use the official domain.
- Static public bundle scan found no configured payment/database secret values in `.next/static` or `public`.
- Found `/favicon.ico` returning 404 while other icon/OG assets existed; fixed by generating `public/favicon.ico`, adding metadata, and extending SEO test coverage.
- Post-deploy `main` verification passed after the favicon fix: `/favicon.ico`, OG image, Apple touch icon, and 512 app icon all return 200; `npm run smoke:p0`, `npm run smoke:creem`, and `npm run smoke:creem-webhook` passed against `https://www.fountersaying.com`. The signed Creem webhook smoke unlocked reading `ea5f69f0-44a0-41c7-ac3a-2a6f144deba0` with an 8-section report.

### Remaining Before Launch Decision

- User-approved small real Creem payment test remains required.
- Creem dashboard order amount/currency must be confirmed as `$2.99 USD`.

## 2026-07-07

### 2026-07-08 Commercial Launch Notes

- Added official canonical-domain support for `https://www.fountersaying.com`, with URL normalization when env values omit `https://`.
- Added Creem as the commercial payment provider through `PAYMENT_PROVIDER=creem`.
- Preserved Stripe as fallback/testing provider through `PAYMENT_PROVIDER=stripe`.
- Added Creem checkout creation, `/api/creem/create-checkout-session`, and `/api/creem/webhook`.
- Added Creem webhook handling for `checkout.completed`, optional signature verification during test setup, required configured-secret behavior for commercial readiness, provider-neutral paid unlocks, and duplicate event/checkout idempotency.
- Extended payment persistence with provider-neutral fields while preserving Stripe fields.
- Updated public contact email to `support@fountersaying.com`.
- Updated public trust and privacy copy to say secure checkout/payment provider instead of Stripe-only language.
- Added `RELEASE_CHECKLIST.md` and `LAUNCH_QA.md`.
- Added `npm run smoke:creem` for strict production verification after Vercel is switched to Creem.
- Added `npm run smoke:creem-webhook` for a signed production Creem webhook unlock smoke.
- Added final launch-polish scope: mobile QA, formal English copy audit, social sharing assets, launch content kit, first-party funnel documentation, and live commercial readiness.

### 2026-07-08 Verification

- `npm test -- src/tests/creem-payment.test.ts src/tests/deployment-readiness.test.ts src/tests/p07-preview-trust.test.ts src/tests/p15-seo-social.test.ts` passed: 14 tests.
- `npm run preflight:smoke` passed.
- `npm test` passed: 15 files, 46 tests.
- `npm test -- src/tests/creem-payment.test.ts src/tests/stripe-webhook.test.ts src/tests/p08-stability.test.ts` passed: 9 tests.
- `npm run build` passed and included `/api/creem/create-checkout-session`, `/api/creem/webhook`, and `/reading/[id]/preview`.
- Production `/api/health` on `https://www.fountersaying.com` currently reports `paymentProvider=stripe`, so commercial Creem launch verification is still blocked on Vercel env configuration.
- Added local `CREEM_API_BASE_URL=https://test-api.creem.io` in `.env.local` for Creem test mode.
- Rechecked local Creem env presence without printing secrets: `PAYMENT_PROVIDER=creem`, `CREEM_API_KEY` set, `CREEM_PRODUCT_ID` set, `CREEM_WEBHOOK_SECRET` blank, `CREEM_API_BASE_URL=https://test-api.creem.io`.
- `npm run preflight:smoke` passed after the local env update.
- `npm run smoke:p0` passed against `https://www.fountersaying.com`; production still used Stripe checkout because Vercel reports `paymentProvider=stripe`.
- `npm run smoke:creem` failed as expected with `Expected paymentProvider=creem, got stripe.`
- `https://www.fountersaying.com/sitemap.xml` uses the official domain.
- Added `docs/creem-vercel-setup.md` with exact Vercel env, Creem webhook, redeploy, and verification steps.
- Added Creem variables in Vercel for Production and Preview: `PAYMENT_PROVIDER`, `CREEM_API_KEY`, `CREEM_PRODUCT_ID`, `CREEM_API_BASE_URL`, and `CREEM_WEBHOOK_SECRET`.
- Created the Creem test-mode webhook `Founter Saying production checkout` for `https://www.fountersaying.com/api/creem/webhook` with only `checkout.completed` enabled.
- Redeployed production from `main` after saving the Creem env vars; Vercel reported the deployment `Ready` and assigned `www.fountersaying.com`.
- `npm run smoke:creem` passed against `https://www.fountersaying.com`.
- Updated Creem webhook handling so Creem dashboard sample `checkout.completed` events without `reading_id` are acknowledged as ignored instead of failing the endpoint, while real checkout events with metadata still unlock the matching reading.
- Normalized whitespace in the `creem-signature` header before HMAC comparison because Creem documentation examples show spaced hexadecimal signatures.
- Extended Creem signature parsing to support bare hex, spaced hex, `sha256=...`, and timestamped `v1=...` style headers while still requiring a valid HMAC match.
- Added an existence check before treating Creem `request_id` as an unlockable reading id, so Creem dashboard sample events with unknown IDs are acknowledged as ignored instead of causing foreign-key errors.
- `npm test -- src/tests/creem-payment.test.ts` passed: 6 tests.
- `npm run build` passed after the Creem dashboard test-event handling update.
- Post-deploy `npm run smoke:creem` passed against `https://www.fountersaying.com`.
- Creem dashboard `checkout.completed` test event delivered successfully with HTTP 200 after the unknown-ID handling fix.
- `npm run smoke:creem-webhook` passed against `https://www.fountersaying.com`: created unpaid reading `7008e41f-65d8-4d57-860e-18c8c8c9cfee`, sent signed `checkout.completed`, received handled response, and confirmed paid unlock with an 8-section full report.
- `npm test` passed: 15 files, 49 tests.
- `npm run build` passed after adding the signed Creem webhook smoke script.
- `npm run smoke:creem` passed after adding the signed Creem webhook smoke script.
- Manual Creem hosted checkout passed in test mode for reading `975d4a98-7008-4f61-ae22-22ed28847948`: Creem returned to `https://www.fountersaying.com/reading/975d4a98-7008-4f61-ae22-22ed28847948/full?...`, the production API reported `paymentStatus=paid`, `paymentProvider=creem`, `reportState=ready`, and an 8-section full report.
- Mobile QA passed locally on the final launch-polish build: 105 page/viewport combinations, 0 failures, 30 screenshots saved under `docs/mobile-qa/screenshots`.
- Added OG, square, vertical, favicon, apple-touch, and 512 app icon assets.
- Added first-party funnel events and documentation for launch analytics without storing full report content.
- Added `docs/marketing/launch-content-kit.md`.
- Added `LIVE_COMMERCIAL_READINESS.md`.
- Final local verification passed: `npm test` (16 files, 51 tests) and `npm run build`.
- Final production smoke passed before deploy: `npm run smoke:p0`, `npm run smoke:creem`, and `npm run smoke:creem-webhook`; the signed Creem webhook smoke unlocked reading `4d8390f8-2610-4f7f-8c58-7e9615e9955f` with an 8-section full report.
- Post-deploy production verification passed: `npm run smoke:p0`, `npm run smoke:creem`, and `npm run smoke:creem-webhook`; the signed Creem webhook smoke unlocked reading `9f569273-e586-4f7a-9470-0363e2ffec9d` with an 8-section full report.
- Post-deploy direct URL checks passed for `https://www.fountersaying.com`, `https://fountersaying.com`, `/api/health`, `/sitemap.xml`, `/robots.txt`, `/og/founter-saying-og.png`, `/og/founter-saying-square.png`, `/og/founter-saying-vertical.png`, `/favicon.svg`, trust pages, sample report, SEO pages, and `/api/events`.

### 2026-07-08 Remaining Launch Tasks

- Switch Creem from test mode to live mode after the account/product/KYC are approved, then replace Vercel Creem env vars with live values and repeat the checkout smoke.
- Configure Cloudflare Email Routing for `support@fountersaying.com` if not already active.

### Completed

- Confirmed P0 was previously verified with production health, DeepSeek default AI, P0 smoke, signed Stripe webhook smoke, paid AI report generation, full-report 8-section contract, preview access protection, Stripe unlock, true solar time, and trust pages.
- Inspected current project structure under `D:\文档\算命\mvp-bazi-web`.
- Confirmed there was no existing `PRD.md` or `memory-bank` in the app directory.
- Created P1 planning docs:
  - `PRD.md`
  - `memory-bank/design-document.md`
  - `memory-bank/tech-stack.md`
  - `memory-bank/implementation-plan.md`
  - `memory-bank/progress.md`
  - `memory-bank/architecture.md`
- Updated AI provider setup documentation to reflect current DeepSeek-first production posture.

### Current Stage

Final P1 verification is complete. The Stripe test-card browser flow, signed webhook smoke, paid report recovery, and mobile layout review have all passed against production.

### Next Required Action

After P1, decide the next product direction separately: custom domain/email, analytics, calibration questions, or a second paid report type. Do not expand the current MVP goal with credits, subscriptions, AI chat, compatibility reports, Ziwei, Western astrology, app, or admin dashboard.

### P0.5 Implementation Notes

- Added explicit report status states: locked, confirming, generating, ready, fallback_ready, and failed_retryable.
- Updated `/api/readings/[id]` to return `status` for polling.
- Added `ensure_full=1` support so a paid reading missing a full report can be prepared by the polling client.
- Added `FullReportStatus` client component with waiting progress, 2.5 second polling, 60 second delay reassurance, retry UI, and automatic full report rendering.
- Changed `/reading/[id]/full` so it no longer blocks on server-side report generation before showing the page.
- Stripped internal `fallbackReason` from public paid reading responses.

### P0.5 Verification

- `npm test` passed: 6 files, 24 tests.
- `npm run build` passed.
- `npm run db:setup:dry` passed.
- `npm run preflight:smoke` passed.
- `npm run smoke:p0` passed against current production baseline.
- Production probe confirmed `/contact`, shared footer links, preview trust text, locked modules, and methodology copy are live.
- Production `npm run smoke:p0` passed after deployment.
- Production status API probe passed after deploy: `/api/readings/[id]?session_id=...` returns `status.reportState=confirming`.
- Production full-page HTTP probe passed: `/reading/[id]/full?session_id=...` includes the waiting UI and does not leak full report content before payment.
- Production signed Stripe webhook probe passed: webhook returned 200, payment status became paid, report state became ready, AI generation mode was `ai`, 8 full-report sections were present, and the paid full page rendered.
- Production `npm run smoke:p0` passed after deploy.

### Known Current Product Gaps After P0.7

- Full report UI is still mostly prose and needs stronger Bazi visual evidence.
- Sample Report page does not exist yet.
- P1 SEO pages and social/contact configuration are not implemented yet.
- Manual Stripe test-card verification is still needed for final P0.5 acceptance.

### P0.6 Implementation Notes

- Updated English homepage positioning to "Ancient Chinese Bazi Reading, Explained by AI".
- Changed primary English CTA to "Get My Free Preview".
- Added Current 30-Day Energy to homepage discovery cards.
- Added a Mingyi method section covering structured Bazi calculation, AI interpretation, true solar time, private data, secure checkout, and one-time payment.
- Added true solar time helper text to the form.
- Added unknown birth time helper text when that option is selected.
- Updated Chinese copy to match the free-preview flow.

### P0.6 Verification

- `npm test` passed: 7 files, 27 tests.
- `npm run build` passed.
- `npm run db:setup:dry` passed.
- `npm run preflight:smoke` passed.
- `npm run smoke:p0` passed against current production baseline.
- Production homepage probe confirmed the P0.6 headline, method section, and Current 30-Day Energy card are live.
- Production `npm run smoke:p0` passed after deployment.

### P0.7 Implementation Notes

- Expanded free preview locked modules to include Career Direction, Wealth Pattern, Love & Relationships, Current 30-Day Energy, 2026 Yearly Timing, and Practical Advice.
- Added a Day Master card to the free preview.
- Added payment trust bullets near checkout: one-time payment, Stripe checkout, instant digital access, and no recurring charge.
- Added privacy reassurance and access/refund reassurance near the checkout CTA.
- Added shared footer links across all pages: Privacy Policy, Terms of Service, Refund Policy, Disclaimer, Methodology, and Contact.
- Added `/contact` support page.
- Strengthened methodology copy to explain Four Pillars, Five Elements, Ten Gods, timing cycles, AI-after-calculation, and professional-advice boundaries.

### P0.7 Verification

- `npm test` passed: 8 files, 30 tests.
- `npm run build` passed.
- `npm run db:setup:dry` passed.
- `npm run preflight:smoke` passed.
- `npm run smoke:p0` passed against current production baseline.

### P0.8 Implementation Notes

- Added `app_events` and `app_rate_limits` to the Supabase schema, with local JSON-store equivalents for development and tests.
- Added event logging for reading creation, preview generation, checkout start/completion, webhook receipt, payment marking, full report generation start/completion/failure, and paid report views.
- Added rate limits for preview generation by IP, reading creation by session/email/IP, and full report regeneration by reading id.
- Moved duplicate Stripe event/session checks before full report generation, preventing retried webhooks from causing repeated paid report generation.
- Preserved DeepSeek default AI generation, retry/timeout behavior, and deterministic fallback report behavior.
- Synced the non-destructive schema to Supabase with `npm run db:setup` after loading `.env.local` into the process.

### P0.8 Verification

- `npm test -- src/tests/p08-stability.test.ts` passed: 3 tests.
- `npm test` passed: 9 files, 33 tests.
- `npm run build` passed.
- `npm run db:setup:dry` passed.
- `npm run preflight:smoke` passed.
- `npm run smoke:p0` passed against the current production baseline.
- Post-deploy homepage smoke passed for the future product cards.
- Post-deploy `npm run smoke:p0` passed against `https://mingyi-bazi-mvp.vercel.app`.

### P1.5 Implementation Notes

- Added professional contact/social link config in `src/lib/site-links.ts`.
- Expanded footer to include legal links, SEO guide links, email, X, TikTok, Instagram, Xiaohongshu, and Douyin.
- Added homepage SEO metadata, Open Graph, and Twitter card metadata.
- Added SEO pages for Bazi, Four Pillars of Destiny, and Day Master.
- Added `/sitemap.xml` and `/robots.txt`.

### P1.5 Verification

- `npm test -- src/tests/p15-seo-social.test.ts` passed: 3 tests.
- `npm test` passed: 14 files, 42 tests.
- `npm run build` passed and generated SEO pages, `/sitemap.xml`, and `/robots.txt`.
- `npm run db:setup:dry` passed.
- `npm run preflight:smoke` passed.
- `npm run smoke:p0` passed against the current production baseline.
- Post-deploy SEO smoke passed for the three SEO pages, sitemap, robots, homepage metadata, and footer links.
- Post-deploy `npm run smoke:p0` passed against `https://mingyi-bazi-mvp.vercel.app`.

### Final P1 Automated Verification

- `npm run build` passed.
- `npm run smoke:p0` passed.
- Signed production webhook smoke passed.
- Preview did not leak `fullReport`.
- Unpaid full-report access was locked.
- Paid access worked after signed webhook unlock.
- Paid report recovery after refresh worked.
- True solar time remained applied for Tokyo test input.
- DeepSeek AI generation worked in the final production probe.
- Full report still returned 8 sections.
- Trust pages, sample report, SEO pages, sitemap, and robots were accessible.

### Final Manual Checks

- Stripe test-card flow completed in Edge through Stripe Checkout and returned to `/reading/8ccf5733-f749-449e-afeb-5c7b73c635a0/full?session_id=...`.
- Mobile production layout inspection completed at 390px viewport for homepage, birth form, sample report, and paid full report. All checked pages reported `scrollWidth=390`, no horizontal overflow, and the paid full report contained Four Pillars Table and Core Personality content.
- Final signed production webhook smoke after the mobile fix passed for reading `9f7093a7-2d0a-489b-b68e-1fcd5f2aa28d`: webhook returned handled, report state became `ready`, generation mode was `ai`, model was `deepseek:deepseek-v4-flash`, 8 sections were present, and true solar time remained applied.
- Post-deploy homepage smoke passed for the future product cards.
- Post-deploy `npm run smoke:p0` passed against `https://mingyi-bazi-mvp.vercel.app`.
- Post-deploy current-energy smoke passed for a production paid test reading.
- Post-deploy `npm run smoke:p0` passed against `https://mingyi-bazi-mvp.vercel.app`.
- `npm run db:setup` completed successfully after loading local environment variables.
- Post-deploy `npm run smoke:p0` passed against `https://mingyi-bazi-mvp.vercel.app`.
- Post-deploy signed Stripe webhook smoke passed for a production test reading: payment status became paid, report state was `ready`, generation mode was `ai`, and the full report contained 8 sections.

### P1.1 Implementation Notes

- Added `src/lib/reports/sample-report.ts` with fake sample data only.
- Added `/sample-report` with a clear sample disclaimer, fake profile, Four Pillars chart, Five Elements balance, and all 8 paid-report sections.
- Added Sample Report entry points from the homepage navigation/hero and from the free preview unlock panel.
- Kept the main paid report checkout flow unchanged.

### P1.1 Verification

- `npm test -- src/tests/p11-sample-report.test.ts` passed: 2 tests.
- `npm test` passed: 10 files, 35 tests.
- `npm run build` passed and generated `/sample-report`.
- `npm run db:setup:dry` passed.
- `npm run preflight:smoke` passed.
- `npm run smoke:p0` passed against the current production baseline.
- Post-deploy `/sample-report` production smoke passed.
- Post-deploy `npm run smoke:p0` passed against `https://mingyi-bazi-mvp.vercel.app`.

### P1.2 Implementation Notes

- Added structured Bazi evidence to the paid full-report component before the prose sections.
- Added Four Pillars Table with heavenly stems, earthly branches, elements, Ten Gods, and hidden stems.
- Added Five Elements balance, Day Master card, Luck Pillar timeline, and Current Year / Current 30-Day Energy card.
- Preserved the existing 8-section full-report contract and did not change AI prompt structure.

### P1.2 Verification

- `npm test -- src/tests/p12-report-visualization.test.ts` passed: 1 test.
- `npm test` passed: 11 files, 36 tests.
- `npm run build` passed.
- `npm run db:setup:dry` passed.
- `npm run preflight:smoke` passed.
- `npm run smoke:p0` passed against the current production baseline.
- Post-deploy paid-report visualization smoke passed for a production test reading.
- Post-deploy `npm run smoke:p0` passed against `https://mingyi-bazi-mvp.vercel.app`.

### P1.3 Implementation Notes

- Added `src/lib/reports/current-energy.ts` as a focused helper so the 30-day energy section can later become its own report product.
- Strengthened fallback Current 30-Day Energy copy with emotional energy, career/work momentum, money opportunities, relationship atmosphere, what to push forward, what to avoid, stronger/weaker days, and one practical suggestion.
- Updated the AI prompt to require the same current-energy structure and avoid absolute predictions.
- Did not add any separate payment flow, credits, subscription, or new product checkout.

### P1.3 Verification

- `npm test -- src/tests/p13-current-energy.test.ts` passed: 2 tests.
- `npm test` passed: 12 files, 38 tests.
- `npm run build` passed.
- `npm run db:setup:dry` passed.
- `npm run preflight:smoke` passed.
- `npm run smoke:p0` passed against the current production baseline.
- Post-deploy current-energy smoke passed for a production paid test reading.
- Post-deploy `npm run smoke:p0` passed against `https://mingyi-bazi-mvp.vercel.app`.

### P1.4 Implementation Notes

- Added non-disruptive homepage cards for Wealth Pattern Report and Love & Relationship Report.
- Marked both future reports as Coming Soon.
- Kept the current Full Bazi Report checkout flow unchanged and did not add a new payment path.

### P1.4 Verification

- `npm test -- src/tests/p14-future-products.test.ts` passed: 1 test.
- `npm test` passed: 13 files, 39 tests.
- `npm run build` passed.
- `npm run db:setup:dry` passed.
- `npm run preflight:smoke` passed.
- `npm run smoke:p0` passed against the current production baseline.
