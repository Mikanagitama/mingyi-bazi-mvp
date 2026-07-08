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
```

`npm run smoke:p0` is provider-aware. When production health reports `paymentProvider=creem`, the checkout URL must be a Creem checkout URL. When `paymentProvider=stripe`, the checkout URL must be a Stripe Checkout URL.

`npm run smoke:creem` is stricter and should pass before commercial launch. It requires production `/api/health` to report:

- `paymentProvider=creem`
- `creemCheckoutConfigured=true`
- `creemWebhookConfigured=true`

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

## Support Readiness

- `support@fountersaying.com` receives mail.
- Contact page uses `support@fountersaying.com`.
- Refund wording covers paid access failures and duplicate/technical issues.
- Refund wording does not promise refunds for subjective disagreement with a reading.
