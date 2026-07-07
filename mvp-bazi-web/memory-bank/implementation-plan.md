# Mingyi P1-Ready Implementation Plan

> This plan must be executed one stage at a time. Do not start a later stage until the current stage is implemented, verified, committed, pushed, and recorded in `memory-bank/progress.md`.

## Current Gate

P0.5 implementation is complete locally and ready for deployment verification. The next implementation stage after P0.5 is accepted is P0.6. Do not start P0.6 until P0.5 is deployed, smoke-checked, and recorded as accepted.

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

- [ ] Update English homepage headline and CTA to focus on a free preview.
- [ ] Add discover cards for Core Personality, Five Elements Balance, Career Direction, Wealth Pattern, Love & Relationships, and Current 30-Day Energy.
- [ ] Add a clear Mingyi workflow section: structured Bazi first, AI interpretation second, true solar time supported, private birth data, secure checkout, one-time payment.
- [ ] Add true solar time helper text.
- [ ] Make unknown birth time a clear supported path.
- [ ] Verify mobile input spacing.
- [ ] Run relevant tests.
- [ ] Run `npm run build`.
- [ ] Run `npm run smoke:p0`.
- [ ] Update progress and commit.

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

- [ ] Structure preview around Bazi Preview, Basic Chart Summary, Day Master, Five Elements Snapshot, Short Personality Insight, Locked Full Report Modules, and Unlock CTA.
- [ ] Show locked cards for the paid modules.
- [ ] Add one-time payment, Stripe checkout, instant digital access, and no recurring charge text near CTA.
- [ ] Add privacy and access/refund reassurance.
- [ ] Ensure legal footer links appear on relevant pages.
- [ ] Strengthen methodology language.
- [ ] Run relevant tests, build, and P0 smoke.
- [ ] Update progress and commit.

## Stage P0.8: Stability, Logging, Anti-Abuse, Recovery

### Objective

Protect AI cost, improve reliability, and make payment/report issues debuggable.

### Planned Files

- Modify `src/lib/db/schema.sql` for event logging and rate-limit storage if needed.
- Add focused logging helpers under `src/lib/db`.
- Modify readings, checkout, webhook, and report generation entry points.
- Add tests for webhook idempotency and rate-limit behavior.

### Steps

- [ ] Add event logging for reading, checkout, webhook, payment, generation, and report-view events.
- [ ] Add basic preview and regeneration rate limits.
- [ ] Ensure duplicate Stripe events and sessions remain idempotent.
- [ ] Keep AI timeout, retry, and fallback behavior explicit.
- [ ] Add recovery behavior for revisiting paid report links.
- [ ] Run relevant tests, build, signed webhook smoke, and P0 smoke.
- [ ] Update progress and commit.

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

## Final P1 Verification

- [ ] Run `npm run build`.
- [ ] Run `npm run smoke:p0`.
- [ ] Run signed Stripe webhook smoke.
- [ ] Run manual Stripe test-card flow.
- [ ] Confirm preview does not leak full report.
- [ ] Confirm unpaid full-report access is blocked.
- [ ] Confirm paid access works.
- [ ] Confirm paid report recovery after refresh works.
- [ ] Confirm true solar time still works.
- [ ] Confirm DeepSeek default provider still works.
- [ ] Confirm 8 fixed report sections still exist.
- [ ] Confirm trust pages are accessible.
- [ ] Confirm sample report is accessible.
- [ ] Check mobile layout manually.
