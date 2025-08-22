-- 0001_base.sql — core schema PROMPTFORGE™ v3
begin;

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- CORE IDENTITY
create table if not exists orgs (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  stripe_customer_id text unique,
  billing_email text,
  created_at timestamptz default now()
);

create table if not exists org_members (
  org_id uuid not null references orgs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','member')),
  invited_at timestamptz default now(),
  joined_at timestamptz,
  primary key (org_id, user_id)
);

create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- PLANS & ENTITLEMENTS
create table if not exists plans (
  plan_code text primary key,
  name text not null,
  flags jsonb not null,
  module_allowlist text[] not null default '{}',
  retention_days int not null default 90,
  created_at timestamptz default now()
);

create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references orgs(id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text unique,
  plan_code text not null references plans(plan_code),
  status text not null,
  current_period_end timestamptz,
  seats int not null default 1,
  trial_end timestamptz,
  updated_at timestamptz default now(),
  unique(org_id, plan_code)
);

create type entitlement_source as enum ('plan','addon','pack','license');

create table if not exists entitlements (
  id bigserial primary key,
  org_id uuid not null references orgs(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  flag text not null,
  value boolean not null default true,
  source entitlement_source not null,
  source_ref text,
  expires_at timestamptz,
  created_at timestamptz default now(),
  unique (org_id, coalesce(user_id, '00000000-0000-0000-0000-000000000000'::uuid), flag, source, source_ref)
);

create table if not exists user_addons (
  org_id uuid not null references orgs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  addon_code text not null,
  stripe_price_id text not null,
  status text not null,
  created_at timestamptz default now(),
  primary key (org_id, user_id, addon_code)
);

-- MODULES & VERSIONING
create table if not exists modules (
  id text primary key,
  title text not null,
  description text,
  vectors int[] not null,
  requirements text,
  spec text,
  output_schema text,
  kpi text,
  guardrails text,
  created_at timestamptz default now()
);

create table if not exists module_versions (
  id uuid primary key default uuid_generate_v4(),
  module_id text not null references modules(id) on delete cascade,
  semver text not null,
  parent_version_id uuid references module_versions(id),
  changelog text,
  spec_json jsonb not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  unique(module_id, semver)
);

create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references orgs(id) on delete cascade,
  slug text not null,
  name text not null,
  created_at timestamptz default now(),
  unique (org_id, slug)
);

create table if not exists prompts (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  module_id text not null references modules(id),
  title text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

create table if not exists prompt_versions (
  id uuid primary key default uuid_generate_v4(),
  prompt_id uuid not null references prompts(id) on delete cascade,
  module_version_id uuid references module_versions(id),
  semver text not null,
  parent_version_id uuid references prompt_versions(id),
  status text not null default 'active',
  params_7d jsonb not null,
  body_md text not null,
  body_txt text,
  body_json jsonb,
  diff_json jsonb,
  checksum_sha256 text not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  unique(prompt_id, semver)
);

create table if not exists version_edges (
  id bigserial primary key,
  from_version uuid not null references prompt_versions(id) on delete cascade,
  to_version uuid not null references prompt_versions(id) on delete cascade,
  relation text not null check (relation in ('parent','merge')),
  created_at timestamptz default now(),
  unique(from_version, to_version, relation)
);

-- EXECUTION & RESULTS
create table if not exists runs (
  id uuid primary key default uuid_generate_v4(),
  prompt_version_id uuid references prompt_versions(id) on delete cascade,
  org_id uuid not null references orgs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null references modules(id),
  run_hash text not null,
  parameter_set_7d jsonb not null,
  mode text not null check (mode in ('sim','real')),
  model text,
  tokens int,
  cost_usd numeric(10,4),
  status text not null default 'ok',
  runtime_ms int,
  telemetry jsonb,
  created_at timestamptz default now(),
  unique(prompt_version_id, run_hash)
);

create table if not exists scores (
  run_id uuid primary key references runs(id) on delete cascade,
  clarity int not null check (clarity between 0 and 100),
  execution int not null check (execution between 0 and 100),
  ambiguity int not null check (ambiguity between 0 and 100),
  business_fit int not null check (business_fit between 0 and 100),
  composite numeric(5,2),
  verdict text not null check (verdict in ('pass','partial_pass','fail')),
  thresholds jsonb,
  weights jsonb,
  feedback jsonb,
  scored_at timestamptz default now()
);

create table if not exists bundles (
  id uuid primary key default uuid_generate_v4(),
  run_id uuid not null references runs(id) on delete cascade,
  module_id text not null references modules(id),
  run_hash text not null,
  formats text[] not null,
  created_at timestamptz default now(),
  unique(run_id)
);

create table if not exists artifacts (
  id bigserial primary key,
  bundle_id uuid not null references bundles(id) on delete cascade,
  file_name text not null,
  bytes bigint not null,
  sha256 text not null,
  storage_path text,
  created_at timestamptz default now(),
  unique(bundle_id, file_name)
);

create table if not exists manifests (
  bundle_id uuid primary key references bundles(id) on delete cascade,
  json jsonb not null,
  created_at timestamptz default now()
);

create table if not exists signatures (
  bundle_id uuid primary key references bundles(id) on delete cascade,
  algorithm text not null check (algorithm='ed25519'),
  signed_by text not null,
  signature text not null,
  created_at timestamptz default now()
);

-- INDUSTRY & API
create table if not exists industry_packs (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  min_plan text not null references plans(plan_code),
  price_eur int not null,
  modules text[] not null,
  domain_config jsonb not null,
  created_at timestamptz default now()
);

create table if not exists org_industry_packs (
  org_id uuid not null references orgs(id) on delete cascade,
  pack_id uuid not null references industry_packs(id) on delete cascade,
  activated_at timestamptz default now(),
  expires_at timestamptz,
  primary key (org_id, pack_id)
);

create table if not exists api_keys (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references orgs(id) on delete cascade,
  name text not null,
  key_hash text unique not null,
  scopes text[] not null,
  rate_limit_rpm int not null default 60,
  last_used_at timestamptz,
  created_at timestamptz default now(),
  revoked_at timestamptz
);

-- AUDIT & EVENTS
create table if not exists stripe_events (
  id text primary key,
  type text not null,
  payload jsonb not null,
  processed_at timestamptz default now()
);

create table if not exists event_log (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references orgs(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  event text not null,
  payload jsonb,
  created_at timestamptz default now()
);

-- TRIGGERS
create or replace function pf_compute_checksum()
returns trigger as $$
declare
  payload text;
begin
  payload := coalesce(new.body_md,'') || coalesce(new.body_txt,'') ||
             coalesce(new.body_json::text,'') || coalesce(new.params_7d::text,'');
  new.checksum_sha256 := 'sha256:' || encode(digest(payload, 'sha256'),'hex');
  return new;
end; $$ language plpgsql;

drop trigger if exists trg_checksum on prompt_versions;
create trigger trg_checksum
before insert or update of body_md, body_txt, body_json, params_7d
on prompt_versions
for each row execute function pf_compute_checksum();

commit;
