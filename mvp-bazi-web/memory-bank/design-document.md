# Mingyi P1 Design Document

## Design Principle

Commercial launch readiness should strengthen the existing P1 flow without changing the core product shape. The site remains a bilingual Bazi report product: free preview first, one-time secure checkout second, full AI report after payment. Creem is the commercial payment provider, while Stripe remains available as a fallback/testing provider.

## User Journey

1. Visitor lands on English homepage by default.
2. Visitor understands the offer in about 10 seconds: a structured Chinese Four Pillars reading explained by AI.
3. Visitor enters birth details. Birth place is optional, true solar time is explained, and unknown birth time is allowed.
4. Visitor receives a free preview with basic chart evidence and locked full-report modules.
5. Visitor clicks unlock and pays through the configured secure checkout provider.
6. Creem returns to `/reading/[id]/full` with checkout parameters; Stripe fallback returns to `/reading/[id]/full?session_id={CHECKOUT_SESSION_ID}`.
7. The full-report page shows payment confirmation and generation progress if the report is not ready.
8. The page automatically updates when the paid report is ready.
9. User can refresh or revisit the reading link and still access the paid report.

## Payment-To-Report States

The full-report route needs clear user states:

- `locked`: payment is not paid, show preview and unlock CTA.
- `confirming`: checkout returned but webhook or session confirmation is still pending.
- `generating`: payment is paid and full report is being prepared.
- `ready`: full report exists and is rendered.
- `fallback_ready`: AI failed but template fallback exists and is rendered without exposing internal errors.
- `failed_retryable`: no full report exists and retry is possible.

The UI should not include a normal-user skip-payment path.

## Report Product Shape

The 8 fixed full-report section contract remains unchanged:

1. Core Personality
2. Five Elements Balance
3. Career Direction
4. Wealth Pattern
5. Love & Relationships
6. Current 30-Day Energy
7. 2026 Yearly Timing
8. Practical Advice

P1 visualization should sit around this contract, not replace it. The structured Bazi evidence comes from `reading.chart`; AI prose comes from `reading.fullReport`.

## Page Design Direction

- Homepage: premium, calm, East Asian visual language; primary CTA is `Get My Free Preview`.
- Birth form: plain-language helper text, mobile-friendly controls, no cramped fields.
- Preview page: useful enough to build confidence, locked enough to preserve paid value.
- Full report: report shell with chart evidence, visual summaries, and readable sections.
- Trust pages: plain, transparent, and non-sensational.
- Sample report: fake data only and clearly labeled as sample content.
- Sample report conversion: if opened from a real preview, preserve `reading_id` so users can return to the paid unlock flow; if opened directly, explain that checkout needs a free preview first.

## Error Handling

Payment and generation states should avoid blame and technical wording.

- Payment still confirming: explain that secure checkout is being confirmed.
- Report still generating after 60-90 seconds: tell users to keep the page open or refresh later.
- AI failure with fallback: show the fallback report as normal.
- True failure: show a calm error, retry button, and support email.

## Testing Strategy

Each stage must keep:

- unit tests passing where touched
- `npm run build` passing
- `npm run smoke:p0` passing
- preview/full access boundaries intact
- Creem webhook signature verification intact when `CREEM_WEBHOOK_SECRET` is configured
- Stripe webhook signature verification intact for fallback/testing

Manual checks are required for Creem test checkout, Stripe fallback test-card return flow, and mobile layout because they involve browser state and external provider behavior.

## Final Commercial Polish

The final launch-polish layer keeps the product scope unchanged and prepares the site for cautious public marketing. It adds first-party funnel visibility, formal English copy constraints, social sharing assets, mobile QA evidence, and launch documentation without adding credits, subscriptions, chat, compatibility reports, Ziwei, Western astrology, apps, admin dashboards, or Chinese payment.

Brand usage:

- Product name: Mingyi Bazi.
- Company/domain-facing brand: Founter Saying.
- Footer wording: Founter Saying owns the site; Mingyi Bazi is the AI-powered Bazi digital report product.

Commercial readiness is split into two states:

- Public marketing readiness: suitable for cautious traffic and feedback once tests and mobile QA pass.
- Real-money readiness: requires Creem live/KYC approval, live env values, support email routing, and a small real payment test.

Pre-launch bug bash adds one more gate: the official price must be consistent everywhere as `$2.99 USD`, the sample report must not be a conversion dead end, and security/privacy documents must be current before the readiness answer is final.
