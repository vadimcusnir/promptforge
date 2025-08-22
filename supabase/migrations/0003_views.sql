-- 0003_views.sql — helper views and functions
begin;

-- Entitlements effective view (OR logic across all sources)
create or replace view entitlements_effective as
select
  e.org_id,
  e.flag,
  bool_or(e.value) as enabled
from entitlements e
group by e.org_id, e.flag;

-- Current plan snapshot per org
create or replace view org_plan_snapshot as
select 
  s.org_id, 
  s.plan_code, 
  p.flags, 
  p.module_allowlist, 
  p.retention_days, 
  s.status,
  s.current_period_end,
  s.trial_end,
  s.seats
from subscriptions s
join plans p on p.plan_code = s.plan_code
where s.status in ('trialing','active','past_due');

-- Latest prompt version per prompt
create or replace view prompt_latest as
select distinct on (p.id)
  p.id as prompt_id, 
  pv.id as prompt_version_id, 
  pv.semver, 
  pv.created_at,
  pv.status
from prompts p
join prompt_versions pv on pv.prompt_id = p.id
where pv.status = 'active'
order by p.id, pv.created_at desc;

-- Latest bundle per run
create or replace view run_latest_bundle as
select 
  r.id as run_id, 
  b.id as bundle_id, 
  b.created_at,
  b.formats
from runs r
join bundles b on b.run_id = r.id
order by b.created_at desc;

-- Module usage statistics
create or replace view module_usage_stats as
select 
  r.module_id,
  count(*) as total_runs,
  avg(r.cost_usd) as avg_cost_usd,
  avg(r.runtime_ms) as avg_runtime_ms,
  count(*) filter (where r.status = 'ok') as successful_runs,
  count(*) filter (where s.verdict = 'pass') as passed_runs,
  avg(s.composite) as avg_composite_score
from runs r
left join scores s on s.run_id = r.id
where r.created_at >= now() - interval '30 days'
group by r.module_id;

-- Org telemetry summary
create or replace view org_telemetry_summary as
select 
  r.org_id,
  count(*) as total_runs,
  sum(r.cost_usd) as total_cost_usd,
  avg(r.runtime_ms) as avg_runtime_ms,
  count(*) filter (where r.created_at >= current_date) as runs_today,
  sum(r.cost_usd) filter (where r.created_at >= current_date) as cost_today,
  count(*) filter (where r.created_at >= date_trunc('month', current_date)) as runs_this_month,
  sum(r.cost_usd) filter (where r.created_at >= date_trunc('month', current_date)) as cost_this_month
from runs r
where r.created_at >= now() - interval '90 days'
group by r.org_id;

-- Functions for entitlements management
create or replace function pf_apply_plan_entitlements(p_org uuid, p_plan text)
returns void language sql as $$
  insert into entitlements(org_id, flag, value, source, source_ref)
  select p_org, key, (p.flags->>key)::boolean, 'plan', p_plan
  from plans p, jsonb_object_keys(p.flags) as key
  where p.plan_code = p_plan
  on conflict (org_id, user_id, flag, source, source_ref) do update
    set value = excluded.value, created_at = now();
$$;

create or replace function pf_revoke_plan_entitlements(p_org uuid, p_plan text)
returns void language sql as $$
  delete from entitlements
  where org_id = p_org and source = 'plan' and source_ref = p_plan;
$$;

create or replace function pf_apply_pack(p_org uuid, p_pack_slug text)
returns void language plpgsql as $$
declare
  pack_id uuid;
begin
  -- get pack id
  select id into pack_id from industry_packs where slug = p_pack_slug;
  
  if pack_id is null then
    raise exception 'Industry pack not found: %', p_pack_slug;
  end if;
  
  -- attach pack to org
  insert into org_industry_packs(org_id, pack_id)
  values (p_org, pack_id)
  on conflict do nothing;
  
  -- activate pack entitlement flag
  insert into entitlements(org_id, flag, value, source, source_ref)
  values (p_org, 'industryPack_' || p_pack_slug, true, 'pack', p_pack_slug)
  on conflict (org_id, user_id, flag, source, source_ref) do update 
    set value = true, created_at = now();
end; $$;

-- Function to check if org has entitlement
create or replace function pf_has_entitlement(p_org uuid, p_flag text)
returns boolean language sql as $$
  select coalesce(
    (select enabled from entitlements_effective where org_id = p_org and flag = p_flag),
    false
  );
$$;

-- Function to get org's allowed modules
create or replace function pf_get_allowed_modules(p_org uuid)
returns text[] language sql as $$
  select 
    case 
      when pf_has_entitlement(p_org, 'canUseAllModules') then 
        array(select id from modules order by id)
      else 
        coalesce(
          (select module_allowlist from org_plan_snapshot where org_id = p_org),
          array[]::text[]
        )
    end;
$$;

-- Function to validate module access
create or replace function pf_can_access_module(p_org uuid, p_module_id text)
returns boolean language sql as $$
  select p_module_id = any(pf_get_allowed_modules(p_org));
$$;

commit;
