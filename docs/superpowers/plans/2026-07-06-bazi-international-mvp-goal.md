# Bazi International MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and launch the first commercial MVP for an international Bazi reading website: English by default, Chinese optional, free preview first, $2.99 Stripe Checkout unlock for the full report.

**Architecture:** Keep the current local Python prototype intact as reference, and create a separate deployable Next.js MVP app for Vercel. The MVP uses server-side API routes for chart generation, report generation, Stripe Checkout, Stripe webhook verification, and database persistence.

**Tech Stack:** Next.js, TypeScript, Vercel, Stripe Checkout, Supabase or Neon Postgres, AI report generation provider, existing Bazi/Python logic as reference material.

---

## Goal Mode Brief

Use this as the Goal-mode objective:

```text
完成国际版八字解读 MVP 并上线：默认英文、支持中文切换、不收户籍地、不强制出生地，用户可生成免费八字预览，支付 $2.99 后通过 Stripe Checkout 解锁完整报告，并部署到 Vercel 可公网访问。本轮开发必须保留现有本地原型，不破坏 webapp/；所有新增和修改文件限制在 D:\文档\算命 内。
```

## Execution Boundaries

- Do not modify files outside `D:\文档\算命`.
- Do not delete the existing `webapp/` Python prototype.
- Do not remove `mingli-master/`; use it as reference if needed.
- Do not implement Zi Wei, Da Liu Ren, login/password accounts, subscriptions, credits, or multi-turn chat in MVP.
- Do not collect hukou.
- Do not make birthplace mandatory.
- Do not rely on frontend-only locking for paid content.
- Do not claim launch is complete until Vercel deployment, Stripe test payment, webhook unlock, and mobile QA all pass.

## Required Decisions Before Execution

These are the only user confirmations needed before starting implementation:

- Brand: continue using `MINGYI / Bazi Destiny`.
- Price: fixed MVP price is `$2.99`.
- Payment provider: use `Stripe Checkout`.
- Account model: no full login in MVP; use email/report link recovery.
- Location policy: no hukou; birthplace is not required.
- Deployment: use Vercel for first public launch.

## Proposed File Structure

Create a separate deployable app so the old local prototype remains available:

```text
D:\文档\算命\
  docs\
    PRD-bazi-international-mvp.md
    superpowers\
      plans\
        2026-07-06-bazi-international-mvp-goal.md
  webapp\
    ...existing local prototype, preserve
  mvp-bazi-web\
    package.json
    next.config.mjs
    tsconfig.json
    .env.example
    src\
      app\
        page.tsx
        zh\
          page.tsx
        reading\
          new\
            page.tsx
          [id]\
            page.tsx
          [id]\
            full\
              page.tsx
        api\
          readings\
            route.ts
          readings\
            [id]\
              route.ts
          checkout\
            route.ts
          stripe\
            webhook\
              route.ts
      components\
        LandingPage.tsx
        LanguageSwitch.tsx
        ReadingForm.tsx
        FreeReport.tsx
        LockedSection.tsx
        FullReport.tsx
        CheckoutButton.tsx
      lib\
        bazi\
          chart.ts
          types.ts
        reports\
          free-report.ts
          full-report.ts
          prompts.ts
          safety.ts
        payments\
          stripe.ts
        db\
          schema.sql
          client.ts
          readings.ts
        i18n\
          en.ts
          zh.ts
        config.ts
      styles\
        globals.css
      tests\
        chart.test.ts
        report-access.test.ts
        stripe-webhook.test.ts
```

## Milestone 0: Approval And Setup

Outcome: the implementation can start without stopping for product uncertainty.

- [ ] Confirm the six decisions listed in `Required Decisions Before Execution`.
- [ ] Confirm whether the first public domain will be a Vercel subdomain or a purchased custom domain.
- [ ] Confirm whether Stripe account creation is already available.
- [ ] Confirm whether GitHub repository should be created from the existing workspace or from the new `mvp-bazi-web/` folder only.
- [ ] Record approved decisions in `docs/PRD-bazi-international-mvp.md`.

Validation:

```powershell
Select-String -LiteralPath 'docs\PRD-bazi-international-mvp.md' -Pattern '状态：|MVP|Stripe|Vercel|\$2.99'
```

Expected: PRD clearly shows approved MVP scope and payment/deployment direction.

## Milestone 1: Create Deployable Next.js MVP Shell

Outcome: a new Vercel-ready app exists without disturbing the current local prototype.

Files:

- Create: `mvp-bazi-web/package.json`
- Create: `mvp-bazi-web/next.config.mjs`
- Create: `mvp-bazi-web/tsconfig.json`
- Create: `mvp-bazi-web/src/app/page.tsx`
- Create: `mvp-bazi-web/src/app/zh/page.tsx`
- Create: `mvp-bazi-web/src/styles/globals.css`
- Create: `mvp-bazi-web/src/lib/i18n/en.ts`
- Create: `mvp-bazi-web/src/lib/i18n/zh.ts`
- Create: `mvp-bazi-web/src/components/LandingPage.tsx`
- Create: `mvp-bazi-web/src/components/LanguageSwitch.tsx`

Steps:

- [ ] Create the Next.js app under `mvp-bazi-web/`.
- [ ] Build English and Chinese home pages using real DOM text.
- [ ] Preserve the current MINGYI/Bazi visual direction without depending on one full-page screenshot as the only content.
- [ ] Add language switch links: `/` and `/zh`.
- [ ] Add CTAs to `/reading/new`.
- [ ] Run local app.

Validation:

```powershell
cd mvp-bazi-web
npm run build
npm run dev
```

Expected:

- Build succeeds.
- `/` renders English.
- `/zh` renders Chinese.
- CTA links to `/reading/new`.
- Mobile width does not horizontally scroll.

## Milestone 2: Bazi Input And Free Preview

Outcome: users can enter birth data and receive a free preview.

Files:

- Create: `mvp-bazi-web/src/app/reading/new/page.tsx`
- Create: `mvp-bazi-web/src/components/ReadingForm.tsx`
- Create: `mvp-bazi-web/src/lib/bazi/types.ts`
- Create: `mvp-bazi-web/src/lib/bazi/chart.ts`
- Create: `mvp-bazi-web/src/lib/reports/free-report.ts`
- Create: `mvp-bazi-web/src/components/FreeReport.tsx`
- Create: `mvp-bazi-web/src/components/LockedSection.tsx`
- Create: `mvp-bazi-web/src/tests/chart.test.ts`

Input fields:

- Optional display name.
- Birth date.
- Birth time.
- `I don't know exact time` option.
- Optional gender.
- Language.
- Gregorian calendar by default.

Rules:

- Hukou field must not exist.
- Birthplace field must not be required.
- If exact birth time is unknown, show an accuracy note.

Steps:

- [ ] Write tests for chart input validation.
- [ ] Implement chart calculation wrapper.
- [ ] Implement free preview generator.
- [ ] Build reading form.
- [ ] Build free preview UI.
- [ ] Add locked paid-section teasers.

Validation:

```powershell
cd mvp-bazi-web
npm test
npm run build
```

Expected:

- Valid birth data produces four pillars data.
- Unknown birth time produces a lower-accuracy note.
- Free preview includes chart, Day Master, element balance, and teasers.
- Paid sections are visible as locked summaries but full text is not present.

## Milestone 3: Database Persistence

Outcome: generated readings persist and can be reopened by URL.

Files:

- Create: `mvp-bazi-web/src/lib/db/schema.sql`
- Create: `mvp-bazi-web/src/lib/db/client.ts`
- Create: `mvp-bazi-web/src/lib/db/readings.ts`
- Create: `mvp-bazi-web/src/app/api/readings/route.ts`
- Create: `mvp-bazi-web/src/app/api/readings/[id]/route.ts`
- Create: `mvp-bazi-web/src/app/reading/[id]/page.tsx`
- Create: `mvp-bazi-web/.env.example`

Database tables:

```sql
create table readings (
  id uuid primary key default gen_random_uuid(),
  name text,
  gender text,
  birth_date date not null,
  birth_time text,
  birth_time_unknown boolean not null default false,
  language text not null default 'en',
  chart_json jsonb not null,
  free_report_json jsonb not null,
  full_report_json jsonb,
  payment_status text not null default 'free',
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  reading_id uuid not null references readings(id),
  stripe_session_id text unique,
  stripe_payment_intent text,
  amount integer not null,
  currency text not null default 'usd',
  status text not null,
  created_at timestamptz not null default now()
);
```

Steps:

- [ ] Configure database connection.
- [ ] Add `.env.example` with required variables only.
- [ ] Add `POST /api/readings` to create a reading.
- [ ] Add `GET /api/readings/[id]` to fetch only allowed content.
- [ ] Add reading result page.
- [ ] Confirm API never returns `full_report_json` unless `payment_status = 'paid'`.

Validation:

```powershell
cd mvp-bazi-web
npm test
npm run build
```

Expected:

- Reading creation returns `reading_id`.
- Refreshing `/reading/[id]` keeps the free preview.
- Unpaid API response does not include full report body.

## Milestone 4: Stripe Checkout Unlock

Outcome: test payment unlocks full report through verified webhook.

Files:

- Create: `mvp-bazi-web/src/lib/payments/stripe.ts`
- Create: `mvp-bazi-web/src/app/api/checkout/route.ts`
- Create: `mvp-bazi-web/src/app/api/stripe/webhook/route.ts`
- Create: `mvp-bazi-web/src/components/CheckoutButton.tsx`
- Create: `mvp-bazi-web/src/tests/stripe-webhook.test.ts`

Stripe configuration:

- Product: `Full Bazi Reading`
- Price: `$2.99`
- Currency: `USD`
- Mode: one-time payment
- Metadata: `reading_id`, `product=full_bazi_reading`, `language`

Steps:

- [ ] Add Stripe environment variables to `.env.example`.
- [ ] Add checkout session creation endpoint.
- [ ] Add unlock button on the reading page.
- [ ] Add webhook handler for `checkout.session.completed`.
- [ ] Verify Stripe webhook signature server-side.
- [ ] Update `readings.payment_status` to `paid` only after webhook success.
- [ ] Store payment record.

Validation:

```powershell
cd mvp-bazi-web
npm test
npm run build
```

Expected:

- Checkout session is created only for an existing reading.
- Stripe metadata includes reading id.
- Fake frontend success URL cannot unlock paid content.
- Webhook test marks reading as paid.

## Milestone 5: Full Paid Report Generation

Outcome: paid users receive a full bilingual-capable report with practical plain-language interpretation.

Files:

- Create: `mvp-bazi-web/src/lib/reports/full-report.ts`
- Create: `mvp-bazi-web/src/lib/reports/prompts.ts`
- Create: `mvp-bazi-web/src/lib/reports/safety.ts`
- Create: `mvp-bazi-web/src/components/FullReport.tsx`
- Create: `mvp-bazi-web/src/app/reading/[id]/full/page.tsx`
- Create: `mvp-bazi-web/src/tests/report-access.test.ts`

Paid report sections:

- Executive Summary.
- Four Pillars Chart.
- Day Master Interpretation.
- Five Elements Balance.
- Personality & Strengths.
- Career & Wealth.
- Relationships.
- Health & Energy.
- Yearly Forecast.
- Lucky Guide.
- Practical Advice.
- Cultural Notes.
- Disclaimer.

Content safety rules:

- Avoid fatalistic claims.
- Avoid medical, legal, or financial guarantees.
- Use `may indicate`, `can suggest`, `often reflects`.
- Provide practical reflection, not fear-based pressure.

Steps:

- [ ] Write access tests: unpaid users cannot fetch full report.
- [ ] Implement report generation with structured JSON output.
- [ ] Cache generated full report in database.
- [ ] Render full report after paid status.
- [ ] Add copy report button.
- [ ] Add simple print/download via browser print.

Validation:

```powershell
cd mvp-bazi-web
npm test
npm run build
```

Expected:

- Paid reading displays all full report sections.
- Unpaid reading redirects to unlock page or shows locked state.
- Full report remains accessible after page refresh.
- Language choice controls report language.

## Milestone 6: Legal, Trust, And Conversion Pages

Outcome: the MVP is commercially presentable and less risky.

Files:

- Create: `mvp-bazi-web/src/app/privacy/page.tsx`
- Create: `mvp-bazi-web/src/app/terms/page.tsx`
- Create: `mvp-bazi-web/src/app/disclaimer/page.tsx`
- Modify: `mvp-bazi-web/src/components/LandingPage.tsx`
- Modify: `mvp-bazi-web/src/components/FreeReport.tsx`
- Modify: `mvp-bazi-web/src/lib/i18n/en.ts`
- Modify: `mvp-bazi-web/src/lib/i18n/zh.ts`

Required messages:

- Entertainment/reflection disclaimer.
- No guarantee of outcomes.
- No medical, financial, legal advice.
- Data use and payment privacy.
- Refund/contact path.

Steps:

- [ ] Add footer links to Privacy, Terms, and Disclaimer.
- [ ] Add FAQ explaining no hukou and no mandatory birthplace.
- [ ] Add secure payment text near checkout CTA.
- [ ] Add honest limitations around unknown birth time and solar-time correction.
- [ ] Make English copy native and not direct machine translation.

Validation:

```powershell
cd mvp-bazi-web
npm run build
```

Expected:

- Legal pages are accessible.
- Footer links work.
- No page claims guaranteed destiny, guaranteed wealth, or guaranteed relationship outcomes.

## Milestone 7: Vercel Deployment

Outcome: the MVP is live on a public URL.

Files:

- Create: `mvp-bazi-web/vercel.json` only if needed.
- Modify: `mvp-bazi-web/.env.example` if any production env var is missing.
- Update: `docs/PRD-bazi-international-mvp.md` with final deployment notes.

Vercel environment variables:

```text
DATABASE_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
NEXT_PUBLIC_SITE_URL=
OPENAI_API_KEY=
```

Steps:

- [ ] Create or connect GitHub repository.
- [ ] Import project into Vercel.
- [ ] Set Vercel project root to `mvp-bazi-web`.
- [ ] Add environment variables.
- [ ] Deploy Preview.
- [ ] Run Stripe test payment against Preview.
- [ ] Configure production domain or Vercel subdomain.
- [ ] Deploy Production.
- [ ] Re-test reading creation, checkout, webhook, paid unlock, and language switch in Production.

Validation:

```powershell
cd mvp-bazi-web
npm run build
```

Manual browser checklist:

- English homepage loads.
- Chinese homepage loads.
- Free reading generation works.
- Unpaid full report is locked.
- Stripe test checkout completes.
- Webhook unlocks report.
- Paid report refresh still works.
- Mobile layout works at 390px width.

## Milestone 8: Launch QA And Handoff

Outcome: the user has a clear public MVP, known limitations, and next-step options.

Files:

- Create: `docs/launch-checklist-bazi-mvp.md`
- Update: `README_LOCAL.md` with how to run the MVP locally.
- Update: `docs/PRD-bazi-international-mvp.md` with actual launch URL and pending future work.

Steps:

- [ ] Run full local test suite.
- [ ] Run production smoke test.
- [ ] Capture screenshots of homepage, free report, checkout start, paid report, mobile view.
- [ ] Document final public URL.
- [ ] Document Stripe mode: test or live.
- [ ] Document environment variable list without secrets.
- [ ] Document known limitations.
- [ ] Document recommended next iteration.

Validation:

```powershell
cd mvp-bazi-web
npm test
npm run build
```

Expected:

- Tests pass.
- Build passes.
- Production URL works.
- User can personally try the full flow.

## MVP Acceptance Criteria

The goal is complete only when all of these are true:

- Public URL is accessible.
- Default page is English.
- Chinese version is accessible.
- User can generate free Bazi preview.
- Free preview does not expose full paid content.
- Stripe Checkout can charge `$2.99` in test mode, and live mode is prepared when user is ready.
- Webhook, not frontend redirect, unlocks payment.
- Paid full report persists after refresh.
- No hukou field exists.
- Birthplace is not mandatory.
- Existing `webapp/` local prototype still exists.
- Launch notes are documented.

## Recommended Execution Order

1. Approval and account setup.
2. Next.js shell.
3. Bazi input and free report.
4. Database persistence.
5. Stripe Checkout and webhook.
6. Full paid report.
7. Legal/trust pages.
8. Vercel deployment.
9. Production QA and launch handoff.

## Stop Points

Pause and ask the user before:

- Switching from `$2.99` to another price.
- Making birthplace mandatory.
- Adding account/password login.
- Changing brand away from MINGYI / Bazi Destiny.
- Using a deployment platform other than Vercel.
- Enabling live payment collection.
- Deleting or replacing the old local prototype.

## Self-Review

Spec coverage:

- PRD requirement for international default English is covered in Milestones 1 and 7.
- Chinese language support is covered in Milestones 1, 5, and 7.
- No hukou and no mandatory birthplace are covered in Milestones 2, 6, and Acceptance Criteria.
- Free preview and paid unlock are covered in Milestones 2, 4, and 5.
- Stripe Checkout and webhook are covered in Milestone 4.
- Vercel deployment is covered in Milestone 7.
- Legal/trust basics are covered in Milestone 6.

Placeholder scan:

- This plan contains no `TBD` or `TODO` placeholders.
- Every milestone has concrete files, actions, and validation.

Type consistency:

- Reading, payment, report, language, and payment status concepts are named consistently across file structure, schema, and API routes.

## Execution Choice

Plan complete and saved to `docs/superpowers/plans/2026-07-06-bazi-international-mvp-goal.md`.

Recommended execution mode:

1. **Subagent-Driven:** best for this scope because frontend, payments, database, and deployment QA can be reviewed in stages.
2. **Inline Execution:** acceptable if you want one continuous session with manual checkpoints.

For this specific MVP, use Subagent-Driven unless the user asks to keep everything in one visible thread.
