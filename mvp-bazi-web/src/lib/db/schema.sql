create extension if not exists pgcrypto;

create table if not exists readings (
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

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  reading_id uuid not null references readings(id),
  stripe_session_id text unique,
  stripe_payment_intent text,
  amount integer not null,
  currency text not null default 'usd',
  status text not null,
  created_at timestamptz not null default now()
);
