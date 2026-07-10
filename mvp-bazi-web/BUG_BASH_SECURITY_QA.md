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
| BB-006 | Critical | Live checkout | Production Creem checkout creation returns `400 {"error":"Invalid API Key"}` even though `/api/health` reports Creem env vars present. | Blocker | `npm run smoke:p0`, `npm run smoke:creem` fail at `/api/checkout`; Vercel `CREEM_API_KEY` must be corrected and redeployed |
| BB-007 | High | Invalid direct URLs | Invalid reading ids returned 500 from production API/page because Postgres expected UUID ids. | Fixed | `src/lib/db/readings.ts`, `src/app/not-found.tsx`, `src/tests/reading-status-route.test.ts`; production API now 404 and page shows friendly not found |
| BB-008 | Medium | Direct sample report trust copy | Direct `/sample-report` showed unlock price but did not show one-time/no-recurring copy without a `reading_id`. | Fixed | `src/app/sample-report/page.tsx`, `src/tests/p11-sample-report.test.ts` |
| BB-009 | Medium | Retired price cleanup | Stripe fallback tests/webhook defaults still used old 500-style test amount. | Fixed | `src/lib/payments/webhook.ts`, Stripe/stability/access tests now use official price constants or 299 USD |

## Marketplace / SaaS Checklist

| # | Check | Result | Notes |
| --- | --- | --- | --- |
| 1 | CTA loops or dead ends | Fixed | Sample report now has top/bottom unlock and free-preview paths. |
| 2 | Wrong language displayed | Pass | English public funnel remains English; Chinese copy is in `/zh`/Chinese reading flow. |
| 3 | Mobile overflow | Pass | Browser QA checked 20 page/viewport combinations at 360, 390, 430, and 768 widths; failures: 0. |
| 4 | Checkout opens wrong product | Blocked | Checkout cannot be created because production Creem returns `Invalid API Key`. |
| 5 | Wrong price displayed on site vs checkout | Fixed in site | Site uses one source: `src/lib/product.ts`; live Creem dashboard price must be manually confirmed as $2.99 USD after API key is fixed. |
| 6 | Payment success returns to wrong page | Blocked for real checkout | Signed webhook unlock returns paid access, but real Creem success cannot be checked until checkout creation works. |
| 7 | Payment cancel returns usefully | Blocked for real checkout | External Creem cancel behavior needs browser/manual check after checkout creation works. |
| 8 | Paid report not generated | Pass | `npm run smoke:creem-webhook` passed and unlocked an 8-section report. |
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
| 19 | Form accepts impossible dates | Pass by chart validation | Date/time validation lives in `generateBaziChart`; invalid input returns controlled API errors. |
| 20 | Unknown birth time path breaks | Previously pass | Existing tests/smokes cover basic path; re-check manually. |
| 21 | True solar time toggle breaks | Previously pass | Production smoke checks Tokyo true solar time. |
| 22 | Timezone missing/incorrect | Pass in smoke | Production smoke created Tokyo reading with true solar time applied. |
| 23 | AI unsafe claims | Pass with guard | Prompt + `assertSafeReportText`; not a substitute for manual spot-check. |
| 24 | AI markdown/JSON artifacts | Pass by parser | AI response is strict JSON and rendered as section text. |
| 25 | Long report breaks mobile | Pending re-check | Prior mobile QA passed. |
| 26 | Creem live/test env mixed | Blocked | Production health reports `paymentProvider=creem`, but checkout API key is rejected by Creem. Confirm live/test key and base URL pair. |
| 27 | Wrong API base URL | Needs env check | Error is consistent with wrong/expired/mismatched live/test API key or base URL. |
| 28 | Webhook secret mismatch | Pass | `npm run smoke:creem-webhook` passes against production. |
| 29 | Rate limit blocks legitimate paid user | Pass | Full-generation rate limit is per reading and duplicate webhooks return before regeneration. |
| 30 | Error messages expose stack traces | Pass | API routes return short messages, not stack traces. |
| 31 | Vercel logs leak sensitive data | Pass by code review | No raw request bodies are logged; event logger logs only error message on logging failure. |
| 32 | Supabase events store sensitive raw payload | Pass | Public event endpoint allowlists small primitive metadata only. |
| 33 | Analytics endpoint accepts huge payloads | Fixed | Metadata values are sliced and endpoint is now rate limited. |
| 34 | User can spam `/api/events` | Fixed | `MINGYI_EVENTS_RATE_LIMIT_PER_MINUTE`, default 120/min/IP. |
| 35 | User can spam report generation | Pass | Preview and full-generation rate limits exist. |
| 36 | 404/500 pages look broken | Fixed | Invalid reading API now returns 404; invalid reading page shows friendly not found with support email and no report leak. |
| 37 | Browser console errors | Not fully checked | Headless browser DOM/layout checks passed; console-log collection was not part of this run. |
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
| B: direct sample report -> preview -> unlock | Pass until checkout | Direct sample report shows unlock/free-preview paths and one-time copy; checkout remains blocked by Creem API key. |
| C: unpaid/paid/invalid direct full-report URLs | Pass | Unpaid remains locked, signed webhook paid unlock works, invalid direct URL is friendly 404/not found. |
| D: mobile 360/390/430/768 flows | Pass | Browser QA checked homepage, form, sample, sample-with-reading, and invalid full URL with no overflow and no CTA failures. |

## Current Launch Decision

- Safe to continue technical QA: yes.
- Safe to start small public traffic: yes for non-payment traffic only, because homepage, preview, sample report, legal, SEO, mobile layout, and webhook unlock passed.
- Ready for real-money public launch: no. Production checkout creation is blocked by Creem `Invalid API Key`; fix Vercel/Creem live API key or base URL, redeploy, then rerun `npm run smoke:p0`, `npm run smoke:creem`, a real checkout cancel/success test, and one small user-approved real payment.
