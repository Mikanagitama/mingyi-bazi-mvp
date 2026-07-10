# Security Audit

Date: 2026-07-10

Mode: pre-launch application security review for the existing Full Bazi Reading MVP.

## Summary

No critical exploitable code issue was confirmed in code review. The earlier production Creem checkout `Invalid API Key` blocker is fixed: Vercel live `CREEM_API_KEY`, `CREEM_PRODUCT_ID`, and `CREEM_API_BASE_URL` were corrected and production checkout smoke now passes. Four launch-relevant code/issues were fixed:

1. Sample report conversion dead end.
2. Price/currency mismatch risk in public copy and Creem webhook application.
3. Missing public analytics endpoint rate limit.
4. Missing default `/favicon.ico` asset.

Remaining manual launch gates are one small user-approved real payment, Creem dashboard order confirmation, support email check, and browser console spot checks.

## Findings

| ID | Severity | Confidence | Finding | Status |
| --- | --- | --- | --- | --- |
| SEC-001 | High | 9/10 | Creem completed events with mismatched amount/currency could mark a reading paid if signature was valid. | Fixed by explicit $2.99 USD validation. |
| SEC-002 | Medium | 9/10 | Public analytics endpoint accepted unlimited valid events. | Fixed with per-IP rate limiting. |
| SEC-003 | Medium | 8/10 | Schema contains unused credits/subscriptions tables, expanding audit surface despite no UI/API usage. | Deferred cleanup. |
| SEC-004 | Critical Launch Blocker | 10/10 | Production Creem checkout creation failed with `Invalid API Key` while health reported `creemApiEnvironment=live`. | Fixed by correcting Vercel live Creem env and redeploying; `npm run smoke:p0` and `npm run smoke:creem` pass. |
| SEC-005 | Low | 10/10 | `/favicon.ico` returned 404 even though SVG and PNG icons existed. | Fixed by adding `public/favicon.ico` and metadata coverage. |

## Access Control

- Pass: `getReading` strips `fullReport` unless `paymentStatus === "paid"`.
- Pass: `ensureFullReport` returns null for unpaid readings.
- Pass: paid status is set only by server-side Creem/Stripe webhook application or trusted server code.
- Pass: preview creation response does not expose `fullReport`.
- Note: reading ids are UUIDs. Direct access to an unpaid `/reading/[id]/full` should show locked state, not full report.

## Database / Supabase

- Pass: schema enables RLS on readings, payments, reports, users, events, rate limits, and unused future tables.
- Pass: database access uses server-side `DATABASE_URL`.
- Watch: no RLS policies are defined in `schema.sql`; app uses server connection string. Confirm Supabase anon/public keys cannot query tables directly before broad launch.
- Deferred: remove unused credit/subscription tables after confirming no production references.

## Payment Security

- Pass: Creem checkout metadata includes reading id/product/language only; no birth details.
- Pass: Creem webhook signature is verified when `CREEM_WEBHOOK_SECRET` is configured.
- Pass: duplicate provider event/checkout ids are idempotent.
- Fixed: Creem completed event amount/currency must match $2.99 USD.
- Pass: Production Creem checkout creation works against live Creem API after Vercel env correction.
- Pass: Stripe fallback webhook uses Stripe signature verification.
- Manual: confirm live Creem product dashboard price is exactly $2.99 USD.

## Environment Variables

Server-only by code boundary:

- `DATABASE_URL`
- `CREEM_API_KEY`
- `CREEM_WEBHOOK_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `OPENAI_API_KEY`
- `DEEPSEEK_API_KEY`

Search guidance before launch:

```bash
rg -n "CREEM_API_KEY|CREEM_WEBHOOK_SECRET|STRIPE_SECRET_KEY|DATABASE_URL|DEEPSEEK_API_KEY|OPENAI_API_KEY" .next src public
```

Do not print actual secret values in logs or docs.

2026-07-10 static asset scan: locally built `.next/static` and `public` did not contain the configured `CREEM_API_KEY`, `CREEM_WEBHOOK_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, or `DATABASE_URL` values.

## Input Validation

- Birth form fields are normalized and length-limited in `POST /api/readings`.
- `birthPlace`, `timezone`, `userQuestion`, and `name` are sliced before storage.
- Language and gender are allowlisted.
- Analytics event names are allowlisted, metadata keys are constrained, values are sliced.
- AI output is parsed as JSON and validated against exact section count/title contract.

## AI / LLM Security

- Prompt says user optional question is context only, not instruction.
- Prompt forbids outcome guarantees and professional medical/legal/financial/investment/psychological advice.
- `assertSafeReportText` rejects obvious deterministic/fear phrases.
- AI response must be JSON and is rendered as text sections, not HTML.
- Residual risk: safety phrase filter is not comprehensive. Manual spot checks of live paid reports remain required.

## Cost Protection

- Preview creation rate limit by IP.
- Reading/session daily limit.
- Full report regeneration limit per reading.
- AI request timeout: 20 seconds.
- AI attempts: max 2, then deterministic fallback.
- Fixed: `/api/events` now has per-IP rate limit.

## Error Handling

- Payment/report generation paths return user-safe messages.
- Event logging failures are caught and do not block checkout/report flows.
- Invalid reading id returns not found JSON or page copy.
- Support email appears in contact/refund/failure flows.

## Browser / Headers / HTTPS

- Official domain redirects HTTP to HTTPS through Vercel.
- `robots.txt` and `sitemap.xml` use official domain.
- Header check: Vercel HSTS is present on homepage, form, and sample report. `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and CSP were not expanded in this pass. Consider adding them after launch analytics/payment flows stabilize.

## Manual Checks Required

- Browser console on homepage, form, preview, sample report, checkout return, and full report.
- Mobile 360/390/430/768 after the sample report CTA change: passed in the 2026-07-10 re-check.
- Live Creem checkout creates a non-test checkout for $2.99 USD: passed by production smoke; dashboard amount still needs manual confirmation.
- Real small payment, with user approval, unlocks one 8-section report.
- Creem dashboard order amount/currency match `$2.99 USD`.

## Disclaimer

This is an AI-assisted first-pass security review. It is not a substitute for a professional penetration test or legal/compliance review. For public paid traffic involving personal birth data and payments, schedule a professional review as the product grows.
