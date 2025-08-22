-- PromptForge Database Rollback Script
-- WARNING: This will destroy ALL data and schema
-- Only use in development or when you need to start fresh

-- Drop all views first (they depend on tables)
DROP VIEW IF EXISTS qa_performance_check CASCADE;
DROP VIEW IF EXISTS qa_verification_summary CASCADE;
DROP VIEW IF EXISTS successful_runs_summary CASCADE;
DROP VIEW IF EXISTS runs_with_scores CASCADE;
DROP VIEW IF EXISTS v_module_version_history CASCADE;
DROP VIEW IF EXISTS v_module_versions CASCADE;
DROP VIEW IF EXISTS v_module_latest CASCADE;
DROP VIEW IF EXISTS domain_stats CASCADE;
DROP VIEW IF EXISTS modules_active CASCADE;
DROP VIEW IF EXISTS entitlements_effective_user CASCADE;
DROP VIEW IF EXISTS entitlements_effective_org CASCADE;

-- Drop all functions
DROP FUNCTION IF EXISTS run_all_qa_tests() CASCADE;
DROP FUNCTION IF EXISTS test_last_owner_protection() CASCADE;
DROP FUNCTION IF EXISTS test_data_integrity() CASCADE;
DROP FUNCTION IF EXISTS test_performance_indices() CASCADE;
DROP FUNCTION IF EXISTS test_scoring_bundle_workflow() CASCADE;
DROP FUNCTION IF EXISTS test_entitlements_system() CASCADE;
DROP FUNCTION IF EXISTS test_rls_isolation() CASCADE;
DROP FUNCTION IF EXISTS monitor_query_performance() CASCADE;
DROP FUNCTION IF EXISTS suggest_missing_indices() CASCADE;
DROP FUNCTION IF EXISTS get_index_usage_stats() CASCADE;
DROP FUNCTION IF EXISTS analyze_query_performance() CASCADE;
DROP FUNCTION IF EXISTS module_version_compare(TEXT, TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS module_get_latest_version(TEXT) CASCADE;
DROP FUNCTION IF EXISTS module_version_rollback_to(TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS module_version_set_enabled(TEXT, TEXT, BOOLEAN) CASCADE;
DROP FUNCTION IF EXISTS module_version_publish(TEXT, TEXT, TEXT, UUID) CASCADE;
DROP FUNCTION IF EXISTS run_meets_export_threshold(UUID, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS generate_bundle_manifest(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_org_run_stats(UUID, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS get_default_parameter_set(TEXT) CASCADE;
DROP FUNCTION IF EXISTS validate_parameter_set(TEXT, scale_t, urgency_t, complexity_t, resources_t, application_t, TEXT[], JSONB) CASCADE;
DROP FUNCTION IF EXISTS get_module_recommendations(INTEGER[]) CASCADE;
DROP FUNCTION IF EXISTS pf_apply_plan_entitlements(UUID, plan_code_t) CASCADE;
DROP FUNCTION IF EXISTS prevent_last_owner_removal() CASCADE;
DROP FUNCTION IF EXISTS is_org_admin(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS has_org_role(UUID, UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS is_org_member(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS get_current_user_id() CASCADE;
DROP FUNCTION IF EXISTS trg_set_updated_at() CASCADE;

-- Drop all tables (in reverse dependency order)
DROP TABLE IF EXISTS bundles CASCADE;
DROP TABLE IF EXISTS prompt_scores CASCADE;
DROP TABLE IF EXISTS runs CASCADE;
DROP TABLE IF EXISTS prompt_history CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS module_versions CASCADE;
DROP TABLE IF EXISTS parameter_sets CASCADE;
DROP TABLE IF EXISTS domain_configs CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS api_keys CASCADE;
DROP TABLE IF EXISTS user_addons CASCADE;
DROP TABLE IF EXISTS entitlements CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS plans CASCADE;
DROP TABLE IF EXISTS org_members CASCADE;
DROP TABLE IF EXISTS orgs CASCADE;

-- Drop all custom types
DROP TYPE IF EXISTS risk_level_t CASCADE;
DROP TYPE IF EXISTS application_t CASCADE;
DROP TYPE IF EXISTS resources_t CASCADE;
DROP TYPE IF EXISTS complexity_t CASCADE;
DROP TYPE IF EXISTS urgency_t CASCADE;
DROP TYPE IF EXISTS scale_t CASCADE;
DROP TYPE IF EXISTS run_status_t CASCADE;
DROP TYPE IF EXISTS run_type_t CASCADE;
DROP TYPE IF EXISTS entitlement_source_t CASCADE;
DROP TYPE IF EXISTS subscription_status_t CASCADE;
DROP TYPE IF EXISTS plan_code_t CASCADE;
DROP TYPE IF EXISTS org_role_t CASCADE;

-- Note: Extensions (pgcrypto, uuid-ossp) are left intact as they may be used by other schemas

SELECT 'Rollback completed - all PromptForge schema dropped' as status;
