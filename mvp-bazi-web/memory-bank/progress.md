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

P0.6 Landing Page + Birth Form Conversion Polish is implemented locally and ready to deploy.

### Next Required Action

Commit, push, deploy, and verify that the production homepage and birth form show the P0.6 copy and helper text. The manual Stripe test-card flow remains a final P1 verification item.

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
- Production status API probe passed after deploy: `/api/readings/[id]?session_id=...` returns `status.reportState=confirming`.
- Production full-page HTTP probe passed: `/reading/[id]/full?session_id=...` includes the waiting UI and does not leak full report content before payment.
- Production signed Stripe webhook probe passed: webhook returned 200, payment status became paid, report state became ready, AI generation mode was `ai`, 8 full-report sections were present, and the paid full page rendered.
- Production `npm run smoke:p0` passed after deploy.

### Known Current Product Gaps After P0.6

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
