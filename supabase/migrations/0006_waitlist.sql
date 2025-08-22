-- 0006_waitlist.sql — waitlist support for coming-soon
begin;

-- Waitlist signups table
create table if not exists waitlist_signups (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  name text,
  org_id uuid references orgs(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table waitlist_signups enable row level security;

-- Allow public inserts (for coming-soon page)
create policy "waitlist_public_insert" on waitlist_signups
  for insert 
  to anon
  with check (true);

-- Allow authenticated users to read their own entries
create policy "waitlist_user_read" on waitlist_signups
  for select 
  to authenticated
  using (true); -- Admins can read all for now

-- Indexes for performance
create index if not exists idx_waitlist_email on waitlist_signups (email);
create index if not exists idx_waitlist_created on waitlist_signups (created_at desc);

-- Update timestamp trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end; $$ language plpgsql;

create trigger update_waitlist_updated_at
  before update on waitlist_signups
  for each row execute function update_updated_at_column();

commit;
