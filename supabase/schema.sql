-- Production-ready waitlist schema for PromptForge
-- Run this once in your Supabase SQL editor

-- Table
create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references public.orgs(id) on delete cascade,
  email text not null unique,
  name text,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.waitlist_signups enable row level security;

-- Allow inserts for anon visitors (for public waitlist signups)
create policy "waitlist_public_insert"
on public.waitlist_signups
for insert
to anon
with check (true);

-- Optional: allow admins to read them
create policy "waitlist_admin_read"
on public.waitlist_signups
for select
to authenticated
using (true);
