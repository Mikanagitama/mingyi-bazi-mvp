# Mingyi Progress

## 2026-07-07

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

P1.5 Basic SEO + Contact + Social Links is implemented, pushed, deployed, and smoke-checked.

### Next Required Action

Run final P1 verification. The manual Stripe test-card flow remains a final P1 verification item.

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
