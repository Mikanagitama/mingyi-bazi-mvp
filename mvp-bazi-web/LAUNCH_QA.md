# Launch QA

## Automated Checks

Run before every launch deploy:

```bash
npm test
npm run build
npm run db:setup:dry
npm run preflight:smoke
npm run smoke:p0
npm run smoke:creem
npm run smoke:creem-webhook
```

`npm run smoke:p0` is provider-aware. When production health reports `paymentProvider=creem`, the checkout URL must be a Creem checkout URL. When `paymentProvider=stripe`, the checkout URL must be a Stripe Checkout URL.

`npm run smoke:creem` is stricter and should pass before commercial launch. It requires production `/api/health` to report:

- `paymentProvider=creem`
- `creemCheckoutConfigured=true`
- `creemWebhookConfigured=true`

`npm run smoke:creem-webhook` sends a signed `checkout.completed` event to production using the local `CREEM_WEBHOOK_SECRET`, verifies the matching reading is marked paid, and confirms the paid report contains 8 sections.

Current 2026-07-10 status:

- `npm test` passes.
- `npm run build` passes.
- `npm run smoke:creem-webhook` passes.
- `npm run smoke:p0` passes.
- `npm run smoke:creem` passes.
- `/api/health` reports `creemApiEnvironment=live`, so the live API endpoint is active.
- The Vercel live `CREEM_API_KEY`, `CREEM_PRODUCT_ID`, and `CREEM_API_BASE_URL` pairing was corrected and production was redeployed.
- Public page sweep passes for homepage, form, sample report, legal/trust pages, sitemap, robots, and health.
- Static public bundle scan found no configured payment/database secret values in `.next/static` or `public`.
- `/favicon.ico` was added after a 404 was found during asset QA.
- Before broad real-money launch, complete one small user-approved live payment and confirm the Creem dashboard order shows `$2.99 USD`.

## Official Price Check

Full Bazi Reading: `$2.99 USD`, one-time payment.

Required before launch:

- Public paid CTA text: `Unlock Full Report — $2.99`
- Payment explanation: `One-time payment. Secure checkout. No recurring charge.`
- No public UI/docs show retired launch-test price or currency copy.
- Creem live product price must match `$2.99 USD`.
- Sample report, preview page, and locked full-report state must all show the same price.

## Creem Webhook Smoke

Use a Creem `checkout.completed` test event or complete a test checkout in the Creem dashboard. Confirm:

- webhook endpoint returns 200
- event id is processed once
- provider is stored as `creem`
- reading `paymentStatus` becomes `paid`
- full report generation still uses DeepSeek
- duplicate event does not create a second payment or regenerate the report

## Stripe Fallback Smoke

Temporarily set:

- `PAYMENT_PROVIDER=stripe`

Then confirm:

- `/api/checkout` returns a Stripe Checkout URL
- signed Stripe webhook still unlocks paid reports
- duplicate Stripe webhooks remain idempotent

## Security Checks

Search public output and source before launch:

- no `CREEM_API_KEY` value in frontend output
- no `CREEM_WEBHOOK_SECRET` value in frontend output
- no `STRIPE_SECRET_KEY` value in frontend output
- no `STRIPE_WEBHOOK_SECRET` value in frontend output
- no `DATABASE_URL` value in frontend output
- no Supabase service role key in frontend output

Functional checks:

- preview API/page does not expose `fullReport`
- unpaid full report page stays locked
- paid report recovery works after refresh
- true solar time works for a recognized city such as Tokyo
- full report still has exactly 8 fixed sections
- mobile paid full report has no horizontal overflow
- sample report does not become a CTA dead end
- public analytics endpoint is rate limited
- invalid reading ids return safe not-found responses instead of 500

## Domain And Asset Checks

- `https://www.fountersaying.com`
- `https://www.fountersaying.com/api/health`
- `https://www.fountersaying.com/sitemap.xml`
- `https://www.fountersaying.com/robots.txt`
- `https://www.fountersaying.com/og/founter-saying-og.png`
- `https://www.fountersaying.com/og/founter-saying-square.png`
- `https://www.fountersaying.com/og/founter-saying-vertical.png`
- `https://www.fountersaying.com/favicon.svg`

## Mobile QA

See `MOBILE_QA.md` for the current final launch-polish layout check.

Required viewports:

- `360x800`
- `375x812`
- `390x844`
- `414x896`
- `430x932`
- `768x1024`
- `1440x900`

Required result: no global horizontal overflow, no clipped CTAs, readable report visualizations, usable footer/legal links, and a clear payment return/progress state.

## Funnel Analytics

See `docs/analytics/funnel-events.md`.

Key conversion steps must be trackable without storing report content:

- `page_view`
- `homepage_cta_clicked`
- `form_started`
- `form_submitted`
- `preview_generated`
- `unlock_clicked`
- `checkout_started`
- `checkout_returned`
- `payment_confirmed`
- `full_report_generating`
- `full_report_viewed`

## Support Readiness

- `support@fountersaying.com` receives mail.
- Contact page uses `support@fountersaying.com`.
- Refund wording covers paid access failures and duplicate/technical issues.
- Refund wording does not promise refunds for subjective disagreement with a reading.
