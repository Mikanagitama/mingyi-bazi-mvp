# Mingyi Bazi P1-Ready Commercial Prototype PRD

## Product Goal

Bring Mingyi / Founter Saying from a verified P1 MVP to a small-scale commercial launch candidate for English-speaking users. The product remains a one-time paid Bazi digital report: users generate a free preview, then pay once through the configured secure checkout provider to unlock a full AI-written report grounded in deterministic Bazi chart data.

## Current P0 Evidence

- Production health endpoint returns `ok: true`.
- DeepSeek is the default AI provider.
- OpenAI remains an optional fallback through `AI_PROVIDER=openai`.
- `npm run smoke:p0` has passed against production.
- Signed Stripe webhook smoke has passed and Stripe remains available as a test/fallback provider.
- Creem is the target commercial payment provider through `PAYMENT_PROVIDER=creem`.
- Paid full report generation uses AI and returns 8 fixed sections.
- Free preview does not expose `fullReport`.
- Provider-neutral paid unlock works through `paymentStatus=paid`.
- True solar time works online.
- Trust pages are accessible.
- Final launch-polish build includes mobile QA evidence, first-party funnel events, OG/social assets, launch content drafts, and live readiness documentation.

## Target Audience

Primary users are English-speaking people outside China who are curious about Chinese metaphysics, self-reflection, timing insight, and personality patterns. The product should feel premium, calm, and culturally grounded, not sensational or fear-based.

## Positioning

Mingyi is an AI-powered Chinese Four Pillars / Bazi report website.

The product should feel like:

- structured Bazi calculation first
- AI natural-language explanation second
- premium Eastern / Chinese metaphysics aesthetic
- entertainment, self-reflection, cultural interest, and timing insight

The product must not feel like:

- scammy fortune telling
- guaranteed destiny prediction
- fear-based future claims
- medical, legal, financial, investment, or professional advice

## Language Rules

Do not use:

- `100% accurate`
- `guaranteed prediction`
- fear-based warnings
- guaranteed wealth, marriage, health, or exact future claims

Prefer:

- `for entertainment and self-reflection`
- `cultural interest`
- `timing insight`
- `structured Bazi interpretation`
- `not medical, legal, financial, investment, or professional advice`

## P1-Ready Requirements

1. Payment-to-full-report experience is smooth and understandable.
2. Landing page and birth form are clear enough for first-time English-speaking users.
3. Free preview encourages payment without leaking full report content.
4. Trust, legal, privacy, methodology, and refund messaging are visible and calm.
5. Full report looks like a structured product, not only plain AI text.
6. Report includes visible Bazi evidence: Four Pillars table, Five Elements balance, Day Master card, Luck Pillar timeline, and current-year / current-30-day energy.
7. Sample Report page exists and uses fake data only.
8. Basic SEO, contact, and social link structure exist.
9. Basic stability, logging, anti-abuse, and recovery protections exist.
10. P0 verification remains green.
11. Final commercial polish keeps mobile layouts usable across common phone/tablet widths.
12. Public English copy stays formal, non-sensational, and clear about one-time secure checkout.
13. Social sharing cards render premium Mingyi Bazi/Founter Saying assets on the official domain.
14. Funnel events show the path from page view to full report viewed without storing report content.
15. Live-readiness docs distinguish technical readiness from Creem live/KYC and business operations readiness.

## Execution Scope

Allowed stages:

- P0.5 Payment-to-Full-Report UX Polish
- P0.6 Landing Page + Birth Form Conversion Polish
- P0.7 Preview Page + Trust Conversion Polish
- P0.8 Stability, Logging, Anti-Abuse, Recovery
- P1.1 Sample Report
- P1.2 Report Visualization
- P1.3 Current 30-Day Energy Productization
- P1.4 Future Product Entry Points
- P1.5 Basic SEO + Contact + Social Links
- Final P1 Verification
- Final Commercial Launch Polish

## Explicit Non-Goals

Do not add in this goal:

- credits
- subscription
- membership
- AI chat
- compatibility report
- Ziwei
- Western astrology
- mobile app
- admin dashboard
- separate payment flows for future products

## Commercial Model

P1 keeps one product: Full Bazi Report.

- Commercial checkout is managed by Creem through `CREEM_PRODUCT_ID`.
- Stripe test checkout remains available through `PAYMENT_PROVIDER=stripe`.
- Official launch price is `$2.99 USD`.
- Checkout remains a one-time payment.
- The website must clearly say there is no recurring charge.
- Refund messaging should cover paid-access failures, not subjective accuracy claims.

## Pre-Launch Bug Bash Gate

Before public launch, the product must pass a focused bug bash covering price consistency, sample-report conversion paths, privacy/security QA, real-user flow simulation, and mobile re-checks. Do not add subscriptions, credits, AI chat, compatibility reports, Ziwei, Western astrology, apps, admin dashboards, or extra payment products during this gate.

## Privacy And Safety

- Birth details are used only to generate the report.
- Full report must not be returned for unpaid readings.
- Secrets must remain in environment variables.
- Frontend must not expose Creem API key, Creem webhook secret, Stripe secret key, webhook secret, Supabase service role, `DATABASE_URL`, DeepSeek key, or OpenAI key.
- Creem webhooks must be signed and verified when `CREEM_WEBHOOK_SECRET` is configured.
- Stripe webhooks must remain signed and verified for fallback/testing.
- Supabase RLS must remain enabled.

## Final P1 Acceptance

P1 is complete only when these pass:

- `npm run build`
- `npm run smoke:p0`
- signed Creem webhook smoke where possible
- signed Stripe webhook smoke for fallback
- manual Creem test checkout flow
- preview does not leak full report
- unpaid full report access is blocked
- paid access works
- paid report recovery after refresh works
- true solar time still works
- DeepSeek remains default provider
- 8 fixed report sections still exist
- trust pages are accessible
- sample report is accessible
- mobile layout is manually checked
- OG/social image paths load
- launch content kit exists
- funnel events are documented
- live commercial readiness document separates marketing readiness from real-money readiness
