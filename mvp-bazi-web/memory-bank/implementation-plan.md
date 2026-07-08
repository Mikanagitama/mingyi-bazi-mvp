# Mingyi Commercial Launch Implementation Plan

> This plan must be executed one stage at a time. Do not start a later stage until the current stage is implemented, verified, committed, pushed, and recorded in `memory-bank/progress.md`.

## Current Gate

P1 verification is complete. The next implementation stage is commercial launch readiness: official domain canonicalization, Creem payment provider integration, launch documentation, and security verification.

## Stage C1: Official Domain + Creem Launch Readiness

### Objective

Make `https://www.fountersaying.com` the canonical production domain and use Creem as the commercial payment provider while preserving Stripe as a test/fallback provider.

### Planned Files

- Update `PRD.md`, `memory-bank/design-document.md`, `memory-bank/tech-stack.md`, `memory-bank/architecture.md`, and this plan to reflect Creem commercial launch readiness.
- Modify `src/lib/config.ts` and `src/lib/site-links.ts` for official domain and payment provider configuration.
- Add Creem helpers under `src/lib/payments/creem.ts`.
- Add a provider-neutral payment entry under `src/lib/payments/provider.ts` or equivalent.
- Add `/api/creem/create-checkout-session` and `/api/creem/webhook`.
- Keep `/api/checkout` as the frontend-compatible provider router.
- Extend `src/lib/db/schema.sql`, local store types, and `markReadingPaid` to store provider-neutral payment data while keeping Stripe fields.
- Update readiness, preflight, smoke, and tests for Creem default plus Stripe fallback.
- Add launch docs such as `RELEASE_CHECKLIST.md` and `LAUNCH_QA.md`.

### Steps

- [x] Confirm official-domain URL handling uses `NEXT_PUBLIC_SITE_URL` with `https://www.fountersaying.com` as production fallback.
- [x] Update contact email and public trust copy to `support@fountersaying.com` and provider-neutral secure checkout language.
- [x] Add Creem config, checkout creation, redirect URL, and metadata/request_id handling.
- [x] Add Creem webhook verification with optional secret in test setup and required verification when configured.
- [x] Make payment persistence provider-neutral and idempotent for both Creem and Stripe.
- [x] Add tests for Creem checkout, webhook unlock, duplicate webhook idempotency, readiness, and Stripe fallback.
- [x] Update schema docs and launch checklist.
- [x] Run `npm test`.
- [x] Run `npm run build`.
- [x] Run `npm run smoke:p0` or provider-aware equivalent.
- [x] Verify production official domain `/api/health`, sitemap, robots, and public pages.
- [x] Document manual Creem webhook setup and remaining user tasks.
- [x] Set Vercel production env to `PAYMENT_PROVIDER=creem`, add Creem env vars, redeploy, and rerun `npm run smoke:creem`.
- [x] Run signed Creem webhook smoke to confirm `checkout.completed` unlocks the correct reading and produces an 8-section full report.
- [ ] Complete a manual Creem hosted checkout in the browser; the checkout page currently requires billing address validation before showing card fields.

### Acceptance

- `PAYMENT_PROVIDER=creem` creates a Creem checkout without exposing `CREEM_API_KEY`.
- `checkout.completed` Creem webhooks unlock the correct reading and do not duplicate unlock/report generation.
- Stripe test fallback still works when `PAYMENT_PROVIDER=stripe`.
- Official canonical metadata/sitemap/robots point to `https://www.fountersaying.com`.
- Public UI uses `support@fountersaying.com` and provider-neutral trust copy.
- Preview still does not leak full report; paid access still uses `paymentStatus=paid`.
- DeepSeek remains the default AI provider and 8 fixed report sections remain intact.

## Stage P0.5: Payment-to-Full-Report UX Polish

### Objective

Make paid users feel guided after Stripe Checkout and prevent confusion during report generation.

### Planned Files

- Modify `src/lib/bazi/types.ts` to add explicit paid report readiness/status response types if needed.
- Modify `src/lib/db/readings.ts` to expose status without leaking unpaid full report data.
- Modify `src/app/api/readings/[id]/route.ts` or add a focused status endpoint for polling.
- Modify `src/app/reading/[id]/full/page.tsx` to render a client-side status experience.
- Add a client component such as `src/components/FullReportStatus.tsx` for polling and progress states.
- Modify `src/lib/payments/stripe.ts` only if success/cancel URL behavior needs adjustment.
- Add or update tests in `src/tests/report-access.test.ts` and payment-related tests.

### Steps

- [x] Verify current success URL is `/reading/[id]/full?session_id={CHECKOUT_SESSION_ID}` and only change if production behavior contradicts it.
- [x] Add a failing test proving unpaid API responses do not expose `fullReport`.
- [x] Add a failing test proving paid API/status responses can indicate `paid`, `generating`, and `ready`.
- [x] Implement the smallest server-side status shape needed for polling.
- [x] Add a client waiting UI with progress bands: 0-25 confirming, 25-50 preparing chart, 50-85 writing report, 85-100 unlocking result.
- [x] Poll every 2-3 seconds while status is confirming or generating.
- [x] Automatically render the full report once paid and ready.
- [x] Add calm timeout copy after 60-90 seconds.
- [x] Add retry UI for true generation failure without exposing internal AI errors.
- [x] Run `npm test`.
- [x] Run `npm run build`.
- [x] Run `npm run smoke:p0`.
- [x] Update `memory-bank/progress.md`.
- [x] Commit and push.

### Acceptance

- Paid Stripe return lands on the correct full-report page.
- Paid user sees waiting UI if the full report is not ready.
- Page auto-updates when the report is ready.
- Unpaid user cannot access full report.
- Preview still does not leak full report.
- P0 smoke remains green.

### Deployment Verification

- Production status API probe confirmed `/api/readings/[id]?session_id=...` returns `status.reportState=confirming`.
- Production full-page HTTP probe confirmed `/reading/[id]/full?session_id=...` returns waiting UI text and does not leak full report content before payment.
- Production signed webhook probe confirmed a valid `checkout.session.completed` event unlocks a reading, generates an AI full report, returns 8 sections, and renders the paid full page.
- `npm run smoke:p0` passed after deployment.
- Manual Stripe test-card browser flow remains a human verification item because it requires completing checkout in Stripe.

## Stage P0.6: Landing Page + Birth Form Conversion Polish

### Objective

Make the homepage and form clear enough for real English-speaking users.

### Planned Files

- Modify `src/components/LandingPage.tsx`.
- Modify `src/components/ReadingForm.tsx`.
- Modify `src/lib/i18n/en.ts` and `src/lib/i18n/zh.ts`.
- Modify `src/styles/globals.css`.
- Add or update tests for unknown birth time and form-safe payloads if missing.

### Steps

- [x] Update English homepage headline and CTA to focus on a free preview.
- [x] Add discover cards for Core Personality, Five Elements Balance, Career Direction, Wealth Pattern, Love & Relationships, and Current 30-Day Energy.
- [x] Add a clear Mingyi workflow section: structured Bazi first, AI interpretation second, true solar time supported, private birth data, secure checkout, one-time payment.
- [x] Add true solar time helper text.
- [x] Make unknown birth time a clear supported path.
- [x] Verify mobile input spacing through responsive CSS constraints.
- [x] Run relevant tests.
- [x] Run `npm run build`.
- [x] Run `npm run smoke:p0`.
- [x] Update progress and commit.

### Deployment Verification

- Production homepage HTTP probe confirmed the new headline, method section, and Current 30-Day Energy discovery card are live.
- `npm run smoke:p0` passed after deployment.
- Birth form helper text is client-rendered; local tests and production build verify the copy contract.

## Stage P0.7: Preview Page + Trust Conversion Polish

### Objective

Make the free preview useful and conversion-ready without leaking paid content.

### Planned Files

- Modify `src/components/FreeReport.tsx`.
- Modify `src/components/LockedSection.tsx`.
- Modify footer/navigation shared in page components.
- Modify trust pages under `src/app/privacy`, `terms`, `refund`, `disclaimer`, and `methodology`.
- Add or update access tests.

### Steps

- [x] Structure preview around Bazi Preview, Basic Chart Summary, Day Master, Five Elements Snapshot, Short Personality Insight, Locked Full Report Modules, and Unlock CTA.
- [x] Show locked cards for the paid modules.
- [x] Add one-time payment, Stripe checkout, instant digital access, and no recurring charge text near CTA.
- [x] Add privacy and access/refund reassurance.
- [x] Ensure legal footer links appear on relevant pages.
- [x] Strengthen methodology language.
- [x] Run relevant tests, build, and P0 smoke.
- [x] Update progress and commit.

### Deployment Verification

- Production checks confirmed `/contact`, shared footer links, preview trust text, locked modules, and methodology copy are live.
- `npm run smoke:p0` passed after deployment.

## Stage P0.8: Stability, Logging, Anti-Abuse, Recovery

### Objective

Protect AI cost, improve reliability, and make payment/report issues debuggable.

### Planned Files

- Modify `src/lib/db/schema.sql` for event logging and rate-limit storage if needed.
- Add focused logging helpers under `src/lib/db`.
- Modify readings, checkout, webhook, and report generation entry points.
- Add tests for webhook idempotency and rate-limit behavior.

### Steps

- [x] Add event logging for reading, checkout, webhook, payment, generation, and report-view events.
- [x] Add basic preview and regeneration rate limits.
- [x] Ensure duplicate Stripe events and sessions remain idempotent.
- [x] Keep AI timeout, retry, and fallback behavior explicit.
- [x] Add recovery behavior for revisiting paid report links.
- [x] Run relevant tests, build, database dry-run/setup, preflight smoke, and P0 smoke.
- [x] Update progress, commit, push, and verify deployment.

### Implementation Notes

- Added `app_events` and `app_rate_limits` schema objects.
- Added local-store equivalents so tests and local development can verify logging and rate-limit behavior without Supabase.
- Logged reading creation, preview generation, checkout start/completion, webhook receipt, payment marking, full-report generation start/completion/failure, and paid report views.
- Added IP preview rate limiting, session/email reading rate limiting, and per-reading full generation rate limiting.
- Moved duplicate payment checks before full-report generation so Stripe retries do not burn AI calls.
- Kept existing DeepSeek timeout/retry/fallback behavior in `src/lib/reports/ai-report.ts`.

### Verification

- `npm test -- src/tests/p08-stability.test.ts` passed.
- `npm test` passed: 9 files, 33 tests.
- `npm run db:setup:dry` passed.
- `npm run preflight:smoke` passed.
- `npm run build` passed.
- `npm run smoke:p0` passed against production baseline.
- `npm run db:setup` completed after loading `.env.local` into the process, creating/syncing the new non-destructive schema.
- Post-deploy `npm run smoke:p0` passed.
- Post-deploy signed webhook smoke passed: the signed `checkout.session.completed` event unlocked a paid reading, returned `state=ready`, used AI generation, and preserved the 8-section full-report contract.

## Stage P1.1: Sample Report

### Objective

Show what a paid report looks like before payment using fake data only.

### Planned Files

- Add `src/app/sample-report/page.tsx`.
- Add sample report data under `src/lib/reports` or a small local module.
- Link from homepage and preview page.
- Style using existing report components where possible.

### Acceptance

- Sample Report is clearly labeled as fake.
- It includes chart, elements, personality, career, wealth, relationships, current energy, yearly timing, and practical advice examples.
- Build and P0 smoke pass.

### Steps

- [x] Add fake sample report data only.
- [x] Add `/sample-report` route.
- [x] Show fake profile, Four Pillars chart, Five Elements balance, and the 8 full-report section shape.
- [x] Clearly state the sample is not based on the user's birth details.
- [x] Link to Sample Report from homepage and preview page.
- [x] Run relevant tests, build, database dry-run, preflight smoke, and P0 smoke.
- [x] Commit, push, and verify deployment.

### Verification

- `npm test -- src/tests/p11-sample-report.test.ts` passed.
- `npm test` passed: 10 files, 35 tests.
- `npm run build` passed and listed `/sample-report`.
- `npm run db:setup:dry` passed.
- `npm run preflight:smoke` passed.
- `npm run smoke:p0` passed against the current production baseline.
- Post-deploy `/sample-report` production smoke passed: page returned 200, sample disclaimer was present, Four Pillars Chart was present, Current 30-Day Energy was present, and the homepage linked to `/sample-report`.
- Post-deploy `npm run smoke:p0` passed.

## Stage P1.2: Report Visualization

### Objective

Make the paid report look like a structured Bazi product.

### Planned Files

- Modify `src/components/FullReport.tsx`.
- Add focused visualization components if the file becomes too large.
- Modify CSS.
- Add rendering tests if practical.

### Acceptance

- Full report includes Four Pillars table, Five Elements balance, Day Master card, Luck Pillar timeline, and current energy card.
- The 8-section report contract remains unchanged.
- Mobile layout works.
- Build and P0 smoke pass.

### Steps

- [x] Add Four Pillars Table to the paid full report.
- [x] Add Five Elements Balance visualization to the paid full report.
- [x] Add Day Master card to the paid full report.
- [x] Add Luck Pillar timeline to the paid full report.
- [x] Add Current Year / Current 30-Day Energy visual card.
- [x] Preserve the 8-section full-report contract.
- [x] Run relevant tests, build, database dry-run, preflight smoke, and P0 smoke.
- [x] Commit, push, and verify deployment.

### Verification

- `npm test -- src/tests/p12-report-visualization.test.ts` passed.
- `npm test` passed: 11 files, 36 tests.
- `npm run build` passed.
- `npm run db:setup:dry` passed.
- `npm run preflight:smoke` passed.
- `npm run smoke:p0` passed against the current production baseline.
- Post-deploy paid-report visualization smoke passed: a signed production webhook unlocked a test reading and the full page contained Four Pillars Table, Five Elements Balance, Your Day Master, Luck Pillar Timeline, and Current Year / Current 30-Day Energy.
- Post-deploy `npm run smoke:p0` passed.

## Stage P1.3: Current 30-Day Energy Productization

### Objective

Strengthen the current-energy section so it can later become a repeat-purchase product without building that product now.

### Planned Files

- Modify AI prompt in `src/lib/reports/ai-report.ts`.
- Modify fallback full report in `src/lib/reports/full-report.ts`.
- Modify full report UI if needed.

### Acceptance

- Current 30-Day Energy contains emotional energy, work momentum, money opportunities, relationship atmosphere, what to push, what to avoid, stronger/weaker days if available, and one practical suggestion.
- Copy avoids guaranteed predictions.
- Build and P0 smoke pass.

### Steps

- [x] Extract current-energy fallback logic into a focused helper.
- [x] Strengthen the English and Chinese fallback Current 30-Day Energy section.
- [x] Update the AI prompt to require emotional energy, career/work momentum, money opportunities, relationship atmosphere, what to push, what to avoid, stronger/weaker days if available, and one practical suggestion.
- [x] Keep current timing language non-absolute and reflective.
- [x] Avoid building a separate payment flow.
- [x] Run relevant tests, build, database dry-run, preflight smoke, and P0 smoke.
- [x] Commit, push, and verify deployment.

### Verification

- `npm test -- src/tests/p13-current-energy.test.ts` passed.
- `npm test` passed: 12 files, 38 tests.
- `npm run build` passed.
- `npm run db:setup:dry` passed.
- `npm run preflight:smoke` passed.
- `npm run smoke:p0` passed against the current production baseline.
- Post-deploy current-energy smoke passed: a signed production webhook unlocked a paid test reading, the Current 30-Day Energy section contained emotional/work/money/relationship signals, and fallback generation remained customer-safe.
- Post-deploy `npm run smoke:p0` passed.

## Stage P1.4: Future Product Entry Points

### Objective

Prepare future monetization without implementing separate products.

### Planned Files

- Modify homepage, preview, or post-report UI where the cards fit naturally.
- Modify i18n copy.
- Modify CSS.

### Acceptance

- Wealth Pattern Report and Love & Relationship Report cards exist as Coming Soon or Notify Me Later.
- No new checkout path is added.
- Main Full Bazi Report flow is unchanged.
- Build and P0 smoke pass.

### Steps

- [x] Add Wealth Pattern Report coming-soon card.
- [x] Add Love & Relationship Report coming-soon card.
- [x] Keep cards non-disruptive and clearly separate from the current Full Bazi Report purchase flow.
- [x] Avoid adding credits, subscriptions, separate checkout, notify storage, or AI chat.
- [x] Run relevant tests, build, database dry-run, preflight smoke, and P0 smoke.
- [x] Commit, push, and verify deployment.

### Verification

- `npm test -- src/tests/p14-future-products.test.ts` passed.
- `npm test` passed: 13 files, 39 tests.
- `npm run build` passed.
- `npm run db:setup:dry` passed.
- `npm run preflight:smoke` passed.
- `npm run smoke:p0` passed against the current production baseline.
- Post-deploy homepage smoke passed: production showed Future Report Editions, Wealth Pattern Report, Love & Relationship Report, and Coming Soon labels.
- Post-deploy `npm run smoke:p0` passed.

## Stage P1.5: Basic SEO + Contact + Social Links

### Objective

Make the site more shareable and search-ready.

### Planned Files

- Modify `src/app/layout.tsx`.
- Add SEO pages under `src/app`.
- Add sitemap and robots routes or files.
- Add contact/social config.
- Modify footer rendering.

### Acceptance

- Homepage metadata exists.
- Open Graph and Twitter metadata exist where supported.
- SEO pages exist for Bazi, Four Pillars, and Day Master.
- Footer hides empty social links.
- Sitemap and robots are available.
- Build and P0 smoke pass.

### Steps

- [x] Add professional contact/social link config.
- [x] Render legal, SEO, contact, and social links in the footer.
- [x] Add homepage title, description, Open Graph, and Twitter metadata.
- [x] Add SEO pages for Bazi, Four Pillars of Destiny, and Day Master.
- [x] Add sitemap and robots routes.
- [x] Run relevant tests, build, database dry-run, preflight smoke, and P0 smoke.
- [x] Commit, push, and verify deployment.

### Verification

- `npm test -- src/tests/p15-seo-social.test.ts` passed.
- `npm test` passed: 14 files, 42 tests.
- `npm run build` passed and generated SEO pages, `/sitemap.xml`, and `/robots.txt`.
- `npm run db:setup:dry` passed.
- `npm run preflight:smoke` passed.
- `npm run smoke:p0` passed against the current production baseline.
- Post-deploy SEO smoke passed: production returned 200 for the three SEO pages, `/sitemap.xml`, and `/robots.txt`; homepage contained SEO metadata and footer contact/SEO links.
- Post-deploy `npm run smoke:p0` passed.

## Final P1 Verification

- [x] Run `npm run build`.
- [x] Run `npm run smoke:p0`.
- [x] Run signed Stripe webhook smoke.
- [x] Run manual Stripe test-card flow.
- [x] Confirm preview does not leak full report.
- [x] Confirm unpaid full-report access is blocked.
- [x] Confirm paid access works.
- [x] Confirm paid report recovery after refresh works.
- [x] Confirm true solar time still works.
- [x] Confirm DeepSeek default provider still works.
- [x] Confirm 8 fixed report sections still exist.
- [x] Confirm trust pages are accessible.
- [x] Confirm sample report is accessible.
- [x] Check mobile layout manually.

### Final Verification Notes

- Automated production verification passed for preview access, unpaid lock, signed webhook unlock, paid recovery, true solar time, AI generation, 8-section full-report contract, trust pages, sample report, SEO pages, sitemap, and robots.
- Stripe test-card checkout was completed in Edge against Stripe Checkout. The flow returned to `/reading/8ccf5733-f749-449e-afeb-5c7b73c635a0/full?session_id=...`, then the paid report became accessible.
- A final signed production webhook smoke passed after the mobile overflow fix: reading `9f7093a7-2d0a-489b-b68e-1fcd5f2aa28d` reached `reportState=ready`, used `deepseek:deepseek-v4-flash`, returned 8 sections, and preserved true solar time.
- Mobile production layout was checked at 390px width for homepage, birth form, sample report, and paid full report. All pages reported `scrollWidth=390`, no horizontal overflow, and the paid full report contained Four Pillars Table and Core Personality content.
