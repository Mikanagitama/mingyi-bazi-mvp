# Privacy Data Map

Date: 2026-07-10

Scope: Founter Saying / Mingyi Bazi public one-time Full Bazi Reading flow.

## Data Inventory

| Data | Collected From | Stored In | Sent To | Notes / Minimization |
| --- | --- | --- | --- | --- |
| Display name | Birth form, optional | `readings.name`; local JSON in dev | AI provider as part of stored chart context only if included in chart/report flow? Current AI prompt does not include name. | Optional, sliced to 80 chars. |
| Gender | Birth form, optional | `readings.gender`, chart JSON | AI provider in `birth_context.gender` | Normalized to female/male/unspecified. |
| Birth date | Birth form | `readings.birth_date`, chart JSON | Not directly sent as raw date; deterministic chart outputs are sent to AI | Required for Bazi calculation. |
| Birth time | Birth form unless unknown | `readings.birth_time`, chart JSON | Not directly sent as raw time; deterministic chart outputs are sent to AI | Unknown-time path supported. |
| Birth place | Birth form, optional | `readings.birth_place`, chart input/policy | AI provider in `birth_context.birth_place` | Optional, sliced to 120 chars; not sent to Creem. |
| Timezone | Form/derived user selection | `readings.timezone`, chart JSON | AI provider in `birth_context.timezone` | Sliced to 80 chars. |
| True solar time flag/derived policy | Form + chart calculation | `readings.true_solar_time`, `chart_json.calculation_policy` | AI provider as deterministic chart context | Used only to explain calculation policy. |
| Optional user question | Birth form, optional | `readings.user_question`, chart input | AI provider in `birth_context.user_question` | Sliced to 500 chars; prompt says to use only as context. |
| Email | Creem/Stripe webhook after payment | `readings.email`, payment provider data | Not sent to AI; received from payment provider | Used for support/recovery. |
| Payment checkout/session ids | Creem/Stripe | `payments.provider_checkout_id`, Stripe fallback fields, `app_events` ids | Provider webhooks | Used for idempotency and support. |
| Payment status | Server-side payment application | `readings.payment_status`, `payments.status` | Frontend as coarse paid/free status | Cannot be set from frontend. |
| Free preview | Generated server-side | `readings.free_report_json`, `reports.preview_json` | Frontend before payment | Does not include full report. |
| Full report | Generated after payment | `readings.full_report_json`, `reports.full_json` | Frontend only if paid | Stripped for unpaid readings by `getReading`. |
| Analytics events | Browser/server | `app_events` | Not sent externally by app | Public endpoint allowlists event names and small primitive metadata; no full report/birth form body. |
| IP address | Request headers | `app_rate_limits.rate_key` as part of rate-limit key | Not sent externally | Used for preview/event abuse protection. |
| User agent | Browser request | Not explicitly stored by app | Vercel logs may retain request metadata | App code does not persist user agent. |

## Supabase Tables

- `readings`: birth inputs, chart JSON, free preview, full report after payment, payment status, email after payment.
- `payments`: provider/payment ids, amount, currency, status, provider customer id, webhook audit JSON.
- `reports`: preview/full report mirror by reading id.
- `app_events`: small operational funnel events.
- `app_rate_limits`: counters keyed by IP/session/reading.
- `users`, `credit_wallets`, `credit_transactions`, `subscriptions`: present in schema with RLS enabled, but not part of the public product flow.

## AI Provider Payload

DeepSeek is the default provider. OpenAI is optional via `AI_PROVIDER=openai`.

Sent:

- Deterministic chart JSON: pillars, Day Master, Five Elements, Ten Gods, hidden stems, Na Yin, luck pillars, transits, interactions, calculation policy.
- Context: gender, optional birth place, timezone, true solar time, optional user question.

Not sent:

- Email
- Payment ids
- Creem/Stripe customer ids
- Database URLs or secrets
- Prior full report history
- Card/payment details

Minimization note: raw birth date/time are stored for product function, but the AI prompt sends derived deterministic chart data rather than raw payment/user identifiers.

## Creem / Stripe Payload

Sent to Creem checkout creation:

- `product_id`
- `request_id` = reading id
- `success_url`
- metadata: `reading_id`, product type, product slug, language

Not sent to Creem:

- birth date/time/place
- optional user question
- free preview text
- full report text
- AI provider data

Received from provider webhooks:

- provider event/checkout/customer ids
- amount/currency
- payer email if provider includes it

## Frontend Exposure Rules

- Before payment: frontend receives free preview and chart, not `fullReport`.
- After payment: frontend may receive full report for that paid reading id.
- Secrets are not referenced in client components.
- `DATABASE_URL`, Creem/Stripe secrets, DeepSeek/OpenAI keys, and webhook secrets stay server-side.

## Logging Rules

- App code does not print birth details, full report text, webhook bodies, or API keys.
- Event logging is best effort and stores only allowlisted event names plus small metadata.
- Server/Vercel platform logs may include request paths and high-level errors; do not paste secrets into URLs or public metadata.

## Retention Notes

No automatic deletion/retention job exists yet. Contact/refund/privacy pages should direct deletion requests to `support@fountersaying.com`. A formal retention/deletion workflow is a post-launch operations task.
