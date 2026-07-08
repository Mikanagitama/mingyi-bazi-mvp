create extension if not exists pgcrypto;

create table if not exists readings (
  id uuid primary key default gen_random_uuid(),
  name text,
  gender text,
  birth_date date not null,
  birth_time text,
  birth_time_unknown boolean not null default false,
  birth_place text,
  timezone text,
  true_solar_time boolean not null default false,
  user_question text,
  language text not null default 'en',
  chart_json jsonb not null,
  free_report_json jsonb not null,
  full_report_json jsonb,
  payment_status text not null default 'free',
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  reading_id uuid not null references readings(id),
  provider text not null default 'stripe',
  provider_checkout_id text,
  provider_event_id text,
  provider_customer_id text,
  stripe_session_id text unique,
  stripe_event_id text unique,
  stripe_payment_intent text,
  amount integer not null,
  currency text not null default 'usd',
  status text not null,
  raw_event_json jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table readings add column if not exists birth_place text;
alter table readings add column if not exists timezone text;
alter table readings add column if not exists true_solar_time boolean not null default false;
alter table readings add column if not exists user_question text;
alter table payments add column if not exists stripe_event_id text unique;
alter table payments add column if not exists provider text not null default 'stripe';
alter table payments add column if not exists provider_checkout_id text;
alter table payments add column if not exists provider_event_id text;
alter table payments add column if not exists provider_customer_id text;
alter table payments add column if not exists raw_event_json jsonb not null default '{}'::jsonb;
alter table payments add column if not exists updated_at timestamptz not null default now();
create unique index if not exists payments_stripe_event_id_idx on payments(stripe_event_id);
create unique index if not exists payments_provider_event_id_idx on payments(provider, provider_event_id) where provider_event_id is not null;
create unique index if not exists payments_provider_checkout_id_idx on payments(provider, provider_checkout_id) where provider_checkout_id is not null;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reading_id uuid unique references readings(id),
  user_id uuid references users(id),
  report_type text not null default 'full_bazi',
  language text not null default 'en',
  status text not null default 'created',
  preview_json jsonb,
  full_json jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists reports_reading_id_idx on reports(reading_id);

create table if not exists app_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  reading_id uuid references readings(id),
  stripe_event_id text,
  stripe_session_id text,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists app_events_event_name_idx on app_events(event_name);
create index if not exists app_events_reading_id_idx on app_events(reading_id);
create index if not exists app_events_created_at_idx on app_events(created_at);

create table if not exists app_rate_limits (
  rate_key text primary key,
  count integer not null default 0,
  reset_at timestamptz not null,
  updated_at timestamptz not null default now()
);

create table if not exists credit_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references users(id),
  balance integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists credit_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid references credit_wallets(id),
  stripe_event_id text unique,
  amount integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  stripe_subscription_id text unique,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table readings enable row level security;
alter table payments enable row level security;
alter table users enable row level security;
alter table reports enable row level security;
alter table app_events enable row level security;
alter table app_rate_limits enable row level security;
alter table credit_wallets enable row level security;
alter table credit_transactions enable row level security;
alter table subscriptions enable row level security;
