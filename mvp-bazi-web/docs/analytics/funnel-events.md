# Funnel Events

Mingyi uses first-party event logging through `app_events`. Events are best effort and must never block reading creation, checkout, payment confirmation, or report rendering.

## Privacy Rules

- Do not store full report text in analytics events.
- Do not store card details, payment provider secrets, API keys, or raw birth form text in analytics events.
- `readingId` may be stored to connect funnel steps for one report.
- Metadata should stay small and operational: path, provider, report state, language, amount, currency, and coarse status.
- Public browser event submissions are rate limited per IP with `MINGYI_EVENTS_RATE_LIMIT_PER_MINUTE` to reduce event-spam cost.

## Event Map

| Event | When Fired | Key Properties |
| --- | --- | --- |
| `page_view` | Browser route renders | `path` |
| `homepage_cta_clicked` | Homepage CTA link is clicked | `href` |
| `form_started` | Birth form receives first focus | `language` |
| `form_submitted` | Birth form is submitted | `language` |
| `reading_created` | Server creates reading row | `readingId`, `language` |
| `preview_generated` | Server creates free preview | `readingId`, `lockedSections` |
| `unlock_clicked` | User clicks unlock CTA | `readingId` |
| `checkout_started` | Server creates checkout | `readingId`, `provider`, `paymentStatus` |
| `checkout_returned` | Full report route opens with checkout/session parameter | `readingId`, `reportState` |
| `webhook_received` | Creem or Stripe webhook reaches server | provider/type metadata |
| `checkout_completed` | Payment provider reports completed checkout | `readingId`, provider checkout ids |
| `payment_confirmed` | App marks the reading paid or client observes paid status | `readingId`, `provider`, `reportState` |
| `payment_marked_paid` | Server writes paid payment record | `readingId`, `provider`, `amount`, `currency` |
| `full_report_generating` | Full report generation begins or client observes generating state | `readingId` |
| `full_generation_started` | Server begins full report generation | `readingId` |
| `full_generation_completed` | Server stores full report | `readingId`, `mode` |
| `full_generation_failed` | Server report generation fails | `readingId`, safe error category/message |
| `full_report_viewed` | Paid report page renders a paid reading | `readingId`, `path` |
| `sample_report_viewed` | Sample report page renders | `path` |
| `trust_page_viewed` | Privacy, terms, refund, disclaimer, methodology, or contact page renders | `page` |

## Basic Funnel Query

Example Supabase SQL:

```sql
select
  event_name,
  count(*) as events,
  count(distinct reading_id) as readings
from app_events
where created_at >= now() - interval '14 days'
group by event_name
order by events desc;
```

Checkout conversion:

```sql
with funnel as (
  select
    reading_id,
    bool_or(event_name = 'preview_generated') as previewed,
    bool_or(event_name = 'unlock_clicked') as unlock_clicked,
    bool_or(event_name = 'checkout_started') as checkout_started,
    bool_or(event_name = 'payment_confirmed') as paid,
    bool_or(event_name = 'full_report_viewed') as viewed_full_report
  from app_events
  where reading_id is not null
  group by reading_id
)
select
  count(*) filter (where previewed) as previews,
  count(*) filter (where unlock_clicked) as unlock_clicks,
  count(*) filter (where checkout_started) as checkouts,
  count(*) filter (where paid) as paid_reports,
  count(*) filter (where viewed_full_report) as full_report_views
from funnel;
```

## Implementation References

- Server logging: `src/lib/db/events.ts`
- Browser logging endpoint: `src/app/api/events/route.ts`
- Page/click tracking: `src/components/AnalyticsTracker.tsx`
- Form tracking: `src/components/ReadingForm.tsx`
- Unlock tracking: `src/components/CheckoutButton.tsx`
- Paid return tracking: `src/components/FullReportStatus.tsx`
