# Mingyi Architecture

## Current Architecture

Mingyi is a Next.js application deployed to Vercel. The app stores readings and payments in Supabase Postgres when `DATABASE_URL` is configured, with a local JSON store fallback for local development.

## Core Flow

```mermaid
flowchart TD
  A["Visitor opens homepage"] --> B["Birth form"]
  B --> C["POST /api/readings"]
  C --> D["Deterministic Bazi chart"]
  D --> E["Free preview stored"]
  E --> F["Preview page /reading/[id]"]
  F --> G["POST /api/checkout"]
  G --> H["Stripe Checkout"]
  H --> I["Stripe webhook"]
  I --> J["markReadingPaid"]
  J --> K["AI or fallback full report"]
  H --> L["Return to /reading/[id]/full"]
  L --> M["Render full report if paid"]
```

## Boundaries

- `src/lib/bazi/chart.ts`: deterministic chart calculation and true solar time policy.
- `src/lib/reports/free-report.ts`: free preview generation.
- `src/lib/reports/ai-report.ts`: AI full-report generation through DeepSeek by default, OpenAI optionally.
- `src/lib/reports/full-report.ts`: deterministic fallback full report.
- `src/lib/db/readings.ts`: reading persistence, public/private reading shaping, payment marking, full-report storage.
- `src/lib/payments/stripe.ts`: Stripe Checkout and webhook verification.
- `src/lib/payments/webhook.ts`: Stripe event application.
- `src/components/*`: landing, form, preview, locked modules, and full report rendering.

## Access Model

- `getInternalReading` may return full data for server-side trusted code.
- `getReading` returns public data and strips `fullReport` unless `paymentStatus` is `paid`.
- Preview APIs and pages must not expose paid report content for unpaid readings.
- Stripe webhook is the trusted unlock path.

## P1 Architecture Direction

P1 should keep the current architecture and add small focused pieces:

- A report status surface for polling after payment. P0.5 adds this to `GET /api/readings/[id]` as a `status` object.
- A client-side full-report waiting component. P0.5 adds `FullReportStatus` for `/reading/[id]/full`.
- Structured visual report components based on `reading.chart`.
- Event logging helpers and tables for observability.
- Optional rate-limit helpers for preview and regeneration protection.
- SEO and sample-report pages as normal Next.js routes.

## P0.5 Status Flow

```mermaid
flowchart TD
  A["/reading/[id]/full"] --> B["Render FullReportStatus"]
  B --> C["GET /api/readings/[id]?session_id=...&ensure_full=1"]
  C --> D{"status.reportState"}
  D -->|locked| E["Show free preview and unlock CTA"]
  D -->|confirming| F["Show payment confirmation progress"]
  D -->|generating| G["Show report generation progress"]
  D -->|ready| H["Render paid full report"]
  D -->|fallback_ready| I["Render fallback full report with customer-safe note"]
  F --> C
  G --> C
```

The public status API strips internal fallback reasons from `fullReport.generation` before sending paid report data to the browser.

## Architecture Constraints

- Do not rewrite deterministic Bazi calculation unless fixing a clear bug.
- Do not change the 8-section full-report contract.
- Do not move secrets into frontend code.
- Do not add a normal-user payment bypass.
- Do not build admin dashboards, subscriptions, credits, or extra report payment flows in P1.
