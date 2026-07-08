# Mingyi Tech Stack

## Application

- Framework: Next.js `16.2.10`
- UI: React `19.2.7`
- Language: TypeScript
- Styling: global CSS in `src/styles/globals.css`
- Runtime target: Node.js `>=20.0.0`

## Bazi Calculation

- Library: `lunar-typescript`
- Deterministic chart logic: `src/lib/bazi/chart.ts`
- Data types: `src/lib/bazi/types.ts`
- True solar time: implemented in chart calculation policy when location can be resolved

## AI Report Generation

- Default provider: DeepSeek
- DeepSeek endpoint: chat completions through `DEEPSEEK_BASE_URL`
- Optional fallback provider: OpenAI through `AI_PROVIDER=openai`
- AI report entry: `src/lib/reports/ai-report.ts`
- Deterministic fallback report: `src/lib/reports/full-report.ts`
- Safety language guard: `src/lib/reports/safety.ts`

## Payments

- Commercial provider: Creem Checkout through `PAYMENT_PROVIDER=creem`
- Fallback/testing provider: Stripe Checkout through `PAYMENT_PROVIDER=stripe`
- Product model: one-time Full Bazi Report payment
- Provider router: `src/lib/payments/provider.ts`
- Checkout creation: `src/app/api/checkout/route.ts`
- Creem checkout alias: `src/app/api/creem/create-checkout-session/route.ts`
- Creem helper and webhook application: `src/lib/payments/creem.ts`
- Creem webhook: `src/app/api/creem/webhook/route.ts`
- Stripe helper: `src/lib/payments/stripe.ts`
- Stripe signed webhook: `src/app/api/stripe/webhook/route.ts`
- Stripe webhook application: `src/lib/payments/webhook.ts`

## Database

- Production database: Supabase Postgres through `DATABASE_URL`
- Local fallback: JSON local store through `src/lib/db/client.ts`
- Schema: `src/lib/db/schema.sql`
- Current key tables: `readings`, `payments`, `reports`, `users`, `app_events`, `app_rate_limits`
- RLS: enabled on schema tables

## Stability And Abuse Protection

- Event logging: `src/lib/db/events.ts`
- Browser funnel endpoint: `src/app/api/events/route.ts`
- Client event tracker: `src/components/AnalyticsTracker.tsx` and `src/lib/client-events.ts`
- Rate limits: `src/lib/db/rate-limit.ts`
- Preview limit env: `MINGYI_PREVIEW_RATE_LIMIT_PER_HOUR`
- Reading/session limit env: `MINGYI_READING_RATE_LIMIT_PER_DAY`
- Full generation limit env: `MINGYI_FULL_REPORT_REGEN_LIMIT_PER_DAY`
- AI timeout/retry/fallback: `src/lib/reports/ai-report.ts`

## Verification

- Unit/integration tests: Vitest
- Test command: `npm test`
- Build command: `npm run build`
- Local DB dry run: `npm run db:setup:dry`
- Production smoke: `npm run smoke:p0`
- Combined verifier: `npm run verify`
- Mobile QA evidence: `MOBILE_QA.md` and `docs/mobile-qa/mobile-qa-results.json`
- Marketing kit: `docs/marketing/launch-content-kit.md`
- Funnel docs: `docs/analytics/funnel-events.md`
- Live readiness doc: `LIVE_COMMERCIAL_READINESS.md`

## Deployment

- Hosting: Vercel
- Canonical production URL: `https://www.fountersaying.com`
- Vercel fallback URL: `https://mingyi-bazi-mvp.vercel.app`
- GitHub repository: `Mikanagitama/mingyi-bazi-mvp`
- Working app directory: `D:\文档\算命\mvp-bazi-web`

## Public Assets

- Open Graph image: `public/og/founter-saying-og.png` (`1200x630`)
- Square social image: `public/og/founter-saying-square.png` (`1080x1080`)
- Vertical social image: `public/og/founter-saying-vertical.png` (`1080x1920`)
- Favicon: `public/favicon.svg`
- Apple touch icon: `public/apple-touch-icon.png`
- App icon: `public/icon-512.png`

## Secret Boundaries

These values must stay server-side only:

- `DATABASE_URL`
- `PAYMENT_PROVIDER`
- `CREEM_API_KEY`
- `CREEM_PRODUCT_ID`
- `CREEM_WEBHOOK_SECRET`
- `CREEM_API_BASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID`
- `OPENAI_API_KEY`
- `DEEPSEEK_API_KEY`
- `ADMIN_UNLOCK_TOKEN`
- `ADMIN_TOKEN`
