-- 0004_indexes.sql — performance indexes
begin;

-- Core lookups
create index if not exists idx_orgs_stripe_customer on orgs (stripe_customer_id);
create index if not exists idx_org_members_user on org_members (user_id);
create index if not exists idx_org_members_org on org_members (org_id);

-- Subscriptions and billing
create index if not exists idx_subscriptions_org on subscriptions (org_id);
create index if not exists idx_subscriptions_stripe on subscriptions (stripe_subscription_id);
create index if not exists idx_subscriptions_status on subscriptions (status) where status in ('active', 'trialing');

-- Entitlements lookups
create index if not exists idx_entitlements_org_flag on entitlements (org_id, flag);
create index if not exists idx_entitlements_effective on entitlements (org_id, flag) where value = true;

-- Projects and prompts
create index if not exists idx_projects_org on projects (org_id);
create index if not exists idx_prompts_project on prompts (project_id);
create index if not exists idx_prompts_module on prompts (module_id);

-- Prompt versions and history
create index if not exists idx_prompt_versions_prompt on prompt_versions (prompt_id, created_at desc);
create index if not exists idx_prompt_versions_latest on prompt_versions (prompt_id, created_at desc) where status = 'active';
create index if not exists idx_prompt_versions_checksum on prompt_versions (checksum_sha256);

-- Module versioning
create index if not exists idx_module_versions_module on module_versions (module_id, created_at desc);

-- Run performance and telemetry
create index if not exists idx_runs_org_created on runs (org_id, created_at desc);
create index if not exists idx_runs_module_created on runs (module_id, created_at desc);
create index if not exists idx_runs_user_created on runs (user_id, created_at desc);
create index if not exists idx_runs_hash on runs (run_hash);
create index if not exists idx_runs_status on runs (status);
create index if not exists idx_runs_cost on runs (cost_usd) where cost_usd is not null;

-- Prompt version to runs relationship
create index if not exists idx_runs_prompt_version on runs (prompt_version_id, created_at desc);

-- Scores and evaluation
create index if not exists idx_scores_verdict on scores (verdict);
create index if not exists idx_scores_composite on scores (composite desc);

-- Bundle and artifacts
create index if not exists idx_bundles_run on bundles (run_id);
create index if not exists idx_bundles_module_created on bundles (module_id, created_at desc);
create index if not exists idx_artifacts_bundle on artifacts (bundle_id);
create index if not exists idx_artifacts_filename on artifacts (file_name);

-- Industry packs
create index if not exists idx_org_industry_packs_org on org_industry_packs (org_id);
create index if not exists idx_org_industry_packs_pack on org_industry_packs (pack_id);

-- API keys
create index if not exists idx_api_keys_org on api_keys (org_id);
create index if not exists idx_api_keys_hash on api_keys (key_hash) where revoked_at is null;
create index if not exists idx_api_keys_active on api_keys (org_id) where revoked_at is null;

-- Event logging and audit
create index if not exists idx_event_log_org_created on event_log (org_id, created_at desc);
create index if not exists idx_event_log_user_created on event_log (user_id, created_at desc);
create index if not exists idx_event_log_event on event_log (event);

-- Stripe events for webhook deduplication
create index if not exists idx_stripe_events_processed on stripe_events (processed_at desc);

-- Time-based partitioning helpers (for future optimization)
create index if not exists idx_runs_created_month on runs (date_trunc('month', created_at));
create index if not exists idx_event_log_created_day on event_log (date_trunc('day', created_at));

-- Composite indexes for common queries
create index if not exists idx_runs_org_module_created on runs (org_id, module_id, created_at desc);
create index if not exists idx_entitlements_org_source on entitlements (org_id, source, value);

-- Full text search preparation (if needed later)
create index if not exists idx_modules_search on modules using gin(to_tsvector('english', title || ' ' || coalesce(description, '')));
create index if not exists idx_prompts_search on prompts using gin(to_tsvector('english', title));

-- Version edges for DAG queries
create index if not exists idx_version_edges_from on version_edges (from_version);
create index if not exists idx_version_edges_to on version_edges (to_version);
create index if not exists idx_version_edges_relation on version_edges (relation);

commit;
