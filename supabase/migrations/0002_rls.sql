-- 0002_rls.sql — row level security & policies
begin;

-- Enable RLS on all tables
alter table if exists orgs enable row level security;
alter table if exists org_members enable row level security;
alter table if exists profiles enable row level security;
alter table if exists plans enable row level security;
alter table if exists subscriptions enable row level security;
alter table if exists entitlements enable row level security;
alter table if exists user_addons enable row level security;
alter table if exists modules enable row level security;
alter table if exists module_versions enable row level security;
alter table if exists projects enable row level security;
alter table if exists prompts enable row level security;
alter table if exists prompt_versions enable row level security;
alter table if exists version_edges enable row level security;
alter table if exists runs enable row level security;
alter table if exists scores enable row level security;
alter table if exists bundles enable row level security;
alter table if exists artifacts enable row level security;
alter table if exists manifests enable row level security;
alter table if exists signatures enable row level security;
alter table if exists industry_packs enable row level security;
alter table if exists org_industry_packs enable row level security;
alter table if exists api_keys enable row level security;
alter table if exists event_log enable row level security;

-- Public read access for modules and plans
create policy if not exists "modules_read_public" on modules
  for select using (true);

create policy if not exists "module_versions_read_public" on module_versions
  for select using (true);

create policy if not exists "plans_read_public" on plans
  for select using (true);

create policy if not exists "industry_packs_read_public" on industry_packs
  for select using (true);

-- User profiles
create policy if not exists "profiles_read_own" on profiles
  for select using (user_id = auth.uid());

create policy if not exists "profiles_update_own" on profiles
  for update using (user_id = auth.uid());

create policy if not exists "profiles_insert_own" on profiles
  for insert with check (user_id = auth.uid());

-- Organizations - members can read their orgs
create policy if not exists "orgs_read_members" on orgs
  for select using (
    exists (select 1 from org_members m 
            where m.org_id = orgs.id and m.user_id = auth.uid())
  );

create policy if not exists "orgs_update_admins" on orgs
  for update using (
    exists (select 1 from org_members m 
            where m.org_id = orgs.id and m.user_id = auth.uid() 
            and m.role in ('owner', 'admin'))
  );

-- Org members - can read own membership
create policy if not exists "org_members_read_own" on org_members
  for select using (
    user_id = auth.uid() or 
    exists (select 1 from org_members m2 
            where m2.org_id = org_members.org_id and m2.user_id = auth.uid())
  );

create policy if not exists "org_members_manage_admins" on org_members
  for all using (
    exists (select 1 from org_members m 
            where m.org_id = org_members.org_id and m.user_id = auth.uid() 
            and m.role in ('owner', 'admin'))
  );

-- Subscriptions - org members can read
create policy if not exists "subscriptions_read_members" on subscriptions
  for select using (
    exists (select 1 from org_members m 
            where m.org_id = subscriptions.org_id and m.user_id = auth.uid())
  );

create policy if not exists "subscriptions_manage_owners" on subscriptions
  for all using (
    exists (select 1 from org_members m 
            where m.org_id = subscriptions.org_id and m.user_id = auth.uid() 
            and m.role = 'owner')
  );

-- Entitlements - org members can read
create policy if not exists "entitlements_read_members" on entitlements
  for select using (
    exists (select 1 from org_members m 
            where m.org_id = entitlements.org_id and m.user_id = auth.uid())
  );

-- Projects - org members can access
create policy if not exists "projects_read_members" on projects
  for select using (
    exists (select 1 from org_members m 
            where m.org_id = projects.org_id and m.user_id = auth.uid())
  );

create policy if not exists "projects_write_members" on projects
  for all using (
    exists (select 1 from org_members m 
            where m.org_id = projects.org_id and m.user_id = auth.uid())
  )
  with check (
    exists (select 1 from org_members m 
            where m.org_id = projects.org_id and m.user_id = auth.uid())
  );

-- Prompts - via projects to orgs
create policy if not exists "prompts_read_members" on prompts
  for select using (
    exists (select 1 from projects p join org_members m on m.org_id = p.org_id
            where p.id = prompts.project_id and m.user_id = auth.uid())
  );

create policy if not exists "prompts_write_members" on prompts
  for all using (
    exists (select 1 from projects p join org_members m on m.org_id = p.org_id
            where p.id = prompts.project_id and m.user_id = auth.uid())
  )
  with check (
    exists (select 1 from projects p join org_members m on m.org_id = p.org_id
            where p.id = prompts.project_id and m.user_id = auth.uid())
  );

-- Prompt versions - via prompts to projects to orgs
create policy if not exists "prompt_versions_read_members" on prompt_versions
  for select using (
    exists (select 1 from prompts pr join projects p on p.id = pr.project_id 
            join org_members m on m.org_id = p.org_id
            where pr.id = prompt_versions.prompt_id and m.user_id = auth.uid())
  );

create policy if not exists "prompt_versions_write_members" on prompt_versions
  for all using (
    exists (select 1 from prompts pr join projects p on p.id = pr.project_id 
            join org_members m on m.org_id = p.org_id
            where pr.id = prompt_versions.prompt_id and m.user_id = auth.uid())
  )
  with check (
    exists (select 1 from prompts pr join projects p on p.id = pr.project_id 
            join org_members m on m.org_id = p.org_id
            where pr.id = prompt_versions.prompt_id and m.user_id = auth.uid())
  );

-- Runs - org members can access
create policy if not exists "runs_read_members" on runs
  for select using (
    exists (select 1 from org_members m 
            where m.org_id = runs.org_id and m.user_id = auth.uid())
  );

create policy if not exists "runs_write_members" on runs
  for all using (
    exists (select 1 from org_members m 
            where m.org_id = runs.org_id and m.user_id = auth.uid())
  )
  with check (
    exists (select 1 from org_members m 
            where m.org_id = runs.org_id and m.user_id = auth.uid())
  );

-- Scores - via runs
create policy if not exists "scores_read_members" on scores
  for select using (
    exists (select 1 from runs r join org_members m on m.org_id = r.org_id
            where r.id = scores.run_id and m.user_id = auth.uid())
  );

create policy if not exists "scores_write_members" on scores
  for all using (
    exists (select 1 from runs r join org_members m on m.org_id = r.org_id
            where r.id = scores.run_id and m.user_id = auth.uid())
  )
  with check (
    exists (select 1 from runs r join org_members m on m.org_id = r.org_id
            where r.id = scores.run_id and m.user_id = auth.uid())
  );

-- Bundles - via runs
create policy if not exists "bundles_read_members" on bundles
  for select using (
    exists (select 1 from runs r join org_members m on m.org_id = r.org_id
            where r.id = bundles.run_id and m.user_id = auth.uid())
  );

create policy if not exists "bundles_write_members" on bundles
  for all using (
    exists (select 1 from runs r join org_members m on m.org_id = r.org_id
            where r.id = bundles.run_id and m.user_id = auth.uid())
  )
  with check (
    exists (select 1 from runs r join org_members m on m.org_id = r.org_id
            where r.id = bundles.run_id and m.user_id = auth.uid())
  );

-- Artifacts - via bundles to runs
create policy if not exists "artifacts_read_members" on artifacts
  for select using (
    exists (select 1 from bundles b join runs r on r.id = b.run_id 
            join org_members m on m.org_id = r.org_id
            where b.id = artifacts.bundle_id and m.user_id = auth.uid())
  );

create policy if not exists "artifacts_write_members" on artifacts
  for all using (
    exists (select 1 from bundles b join runs r on r.id = b.run_id 
            join org_members m on m.org_id = r.org_id
            where b.id = artifacts.bundle_id and m.user_id = auth.uid())
  )
  with check (
    exists (select 1 from bundles b join runs r on r.id = b.run_id 
            join org_members m on m.org_id = r.org_id
            where b.id = artifacts.bundle_id and m.user_id = auth.uid())
  );

-- Manifests and signatures - via bundles
create policy if not exists "manifests_read_members" on manifests
  for select using (
    exists (select 1 from bundles b join runs r on r.id = b.run_id 
            join org_members m on m.org_id = r.org_id
            where b.id = manifests.bundle_id and m.user_id = auth.uid())
  );

create policy if not exists "signatures_read_members" on signatures
  for select using (
    exists (select 1 from bundles b join runs r on r.id = b.run_id 
            join org_members m on m.org_id = r.org_id
            where b.id = signatures.bundle_id and m.user_id = auth.uid())
  );

-- API keys - org admins only
create policy if not exists "api_keys_read_admins" on api_keys
  for select using (
    exists (select 1 from org_members m 
            where m.org_id = api_keys.org_id and m.user_id = auth.uid() 
            and m.role in ('owner', 'admin'))
  );

create policy if not exists "api_keys_manage_admins" on api_keys
  for all using (
    exists (select 1 from org_members m 
            where m.org_id = api_keys.org_id and m.user_id = auth.uid() 
            and m.role in ('owner', 'admin'))
  )
  with check (
    exists (select 1 from org_members m 
            where m.org_id = api_keys.org_id and m.user_id = auth.uid() 
            and m.role in ('owner', 'admin'))
  );

-- Industry packs - org members can read their packs
create policy if not exists "org_industry_packs_read_members" on org_industry_packs
  for select using (
    exists (select 1 from org_members m 
            where m.org_id = org_industry_packs.org_id and m.user_id = auth.uid())
  );

-- Event log - org members can read their events
create policy if not exists "event_log_read_members" on event_log
  for select using (
    org_id is null or 
    exists (select 1 from org_members m 
            where m.org_id = event_log.org_id and m.user_id = auth.uid())
  );

commit;
