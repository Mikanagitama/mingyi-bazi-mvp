# Pre-Launch Bug Bash + Security QA

Date: 2026-07-10

Official site: `https://www.fountersaying.com`

Scope: bug discovery, focused bug fixes, privacy/security QA, price consistency, real-user flow simulation, and launch readiness decision for the existing one-time Full Bazi Reading product only.

## Official Price

- Product: Full Bazi Reading
- Price: $2.99 USD
- Payment model: one-time payment
- Subscription: none
- Recurring charge: none

## Bugs Found

| ID | Severity | Area | Finding | Status | Evidence |
| --- | --- | --- | --- | --- | --- |
| BB-001 | High | Sample report funnel | `/sample-report` bottom CTA only sent users to free preview and did not preserve purchase intent from preview. | Fixed | `src/app/sample-report/page.tsx`, `src/components/FreeReport.tsx`, `src/tests/p11-sample-report.test.ts` |
| BB-002 | High | Price consistency | Public copy still showed retired launch-test pricing. | Fixed | `src/lib/product.ts`, `src/lib/i18n/en.ts`, `src/lib/i18n/zh.ts`, `src/app/terms/page.tsx`, `src/tests/price-consistency.test.ts` |
| BB-003 | High | Payment consistency | Creem webhook accepted completed events even when amount/currency did not match the official $2.99 USD product price. | Fixed | `src/lib/payments/creem.ts`, `src/tests/creem-payment.test.ts` |
| BB-004 | Medium | Abuse protection | Public analytics endpoint sanitized metadata but had no per-IP rate limit. | Fixed | `src/app/api/events/route.ts`, `src/tests/analytics-events.test.ts` |
| BB-005 | Medium | Product scope cleanup | `schema.sql` still contains unused credits/subscriptions tables from earlier planning. They are RLS-enabled and not surfaced in UI/API, but they create scope noise. | Deferred | Remove in a separate DB cleanup after confirming no production references |

## Marketplace / SaaS Checklist

| # | Check | Result | Notes |
| --- | --- | --- | --- |
| 1 | CTA loops or dead ends | Fixed | Sample report now has top/bottom unlock and free-preview paths. |
| 2 | Wrong language displayed | Pass | English public funnel remains English; Chinese copy is in `/zh`/Chinese reading flow. |
| 3 | Mobile overflow | Pending re-check | Prior `MOBILE_QA.md` passed; changed sample CTA needs mobile re-check. |
| 4 | Checkout opens wrong product | Pending live-safe smoke | Checkout uses Creem product env; webhook now validates amount/currency. |
| 5 | Wrong price displayed on site vs checkout | Fixed in site | Site uses one source: `src/lib/product.ts`; live Creem dashboard price must be manually confirmed as $2.99 USD. |
| 6 | Payment success returns to wrong page | Pending smoke/manual | Existing success URL returns to `/reading/[id]/full`; re-run smoke/manual. |
| 7 | Payment cancel returns usefully | Pending manual | External Creem cancel behavior needs browser/manual check. |
| 8 | Paid report not generated | Previously pass | Covered by webhook smokes; re-run required. |
| 9 | Paid report generated twice | Pass | Duplicate event tests exist for Stripe and Creem. |
| 10 | Duplicate webhook duplicates order | Pass | Provider event/checkout IDs are idempotent. |
| 11 | Refresh loses report | Previously pass | Paid report stored in `readings.full_report_json`. |
| 12 | Browser back creates broken state | Pending manual | Needs browser flow pass. |
| 13 | Direct full report URL leaks content | Pass by tests | `getReading` strips `fullReport` unless paid. |
| 14 | Preview source/API leaks full report | Pass by tests | Smoke/tests assert no unpaid `fullReport`. |
| 15 | Metadata/OG broken | Previously pass | Re-check after deploy. |
| 16 | Footer links broken | Previously pass | Re-check during browser QA. |
| 17 | Support email missing | Pass | Footer/contact/refund/failure copy reference `support@fountersaying.com`. |
| 18 | Sample report confused with real report | Pass | Notice says sample is not based on user birth details. |
| 19 | Form accepts impossible dates | Pending | Browser/API validation should be rechecked. |
| 20 | Unknown birth time path breaks | Previously pass | Existing tests/smokes cover basic path; re-check manually. |
| 21 | True solar time toggle breaks | Previously pass | Production smoke checks Tokyo true solar time. |
| 22 | Timezone missing/incorrect | Pending manual | Birth-place/timezone UX should be rechecked. |
| 23 | AI unsafe claims | Pass with guard | Prompt + `assertSafeReportText`; not a substitute for manual spot-check. |
| 24 | AI markdown/JSON artifacts | Pass by parser | AI response is strict JSON and rendered as section text. |
| 25 | Long report breaks mobile | Pending re-check | Prior mobile QA passed. |
| 26 | Creem live/test env mixed | Pending production check | `/api/health` plus checkout URL host/path must be checked after env updates. |
| 27 | Wrong API base URL | Pending production check | Live should use `https://api.creem.io`. |
| 28 | Webhook secret mismatch | Pending production check | `npm run smoke:creem-webhook` verifies local secret against production. |
| 29 | Rate limit blocks legitimate paid user | Pass | Full-generation rate limit is per reading and duplicate webhooks return before regeneration. |
| 30 | Error messages expose stack traces | Pass | API routes return short messages, not stack traces. |
| 31 | Vercel logs leak sensitive data | Pass by code review | No raw request bodies are logged; event logger logs only error message on logging failure. |
| 32 | Supabase events store sensitive raw payload | Pass | Public event endpoint allowlists small primitive metadata only. |
| 33 | Analytics endpoint accepts huge payloads | Fixed | Metadata values are sliced and endpoint is now rate limited. |
| 34 | User can spam `/api/events` | Fixed | `MINGYI_EVENTS_RATE_LIMIT_PER_MINUTE`, default 120/min/IP. |
| 35 | User can spam report generation | Pass | Preview and full-generation rate limits exist. |
| 36 | 404/500 pages look broken | Pending manual | Invalid reading id should be browser-checked. |
| 37 | Browser console errors | Pending manual | Check during browser QA. |
| 38 | SEO canonical broken | Previously pass | Re-check after deploy. |
| 39 | Robots/sitemap point to vercel.app | Pass | Current live robots/sitemap use official domain. |
| 40 | Brand naming inconsistent | Pass | Founter Saying domain/company, Mingyi Bazi product. |
| 41 | Price/currency inconsistent | Fixed | `$2.99` source centralized. |
| 42 | Old launch-test pricing appears | Fixed | Search only finds test-only guardrails. |
| 43 | One-time payment unclear | Fixed | Payment CTA areas use one-time/no-recurring copy. |
| 44 | User thinks subscription | Pass | Public copy says no subscription/no recurring charge. |
| 45 | Sample report does not lead to payment/preview | Fixed | Top and bottom CTAs now route to checkout if `reading_id` exists, otherwise preview creation. |

## Flow Simulation Matrix

| Path | Status | Evidence Needed Before Launch |
| --- | --- | --- |
| A: homepage -> form -> preview -> sample -> unlock -> checkout -> cancel/success -> full report | Pending | Browser run after deploy; Creem real-money success requires user approval. |
| B: direct sample report -> preview -> unlock | Partially fixed | Browser run must confirm no CTA loop. |
| C: unpaid/paid/invalid direct full-report URLs | Partially automated | Tests and smokes cover unpaid/paid; invalid page needs browser check. |
| D: mobile 360/390/430/768 flows | Pending re-check | Prior mobile QA passed before sample CTA change. |

## Current Launch Decision

- Safe to continue technical QA: yes.
- Safe to start small public traffic: not yet proven after the new fixes; run full tests, build, production smokes, and browser/mobile checks first.
- Ready for real-money public launch: not yet. Requires live Creem env verification, one small real payment with user approval, dashboard order confirmation, and paid report unlock confirmation.
