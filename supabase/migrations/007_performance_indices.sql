-- PromptForge Database Migration 007
-- Critical performance indices for gating and queries
-- Ensures O(1) entitlement checks and fast reporting

-- Additional critical indices for entitlement gating (O(1) lookups)
-- These are the most important for feature gating performance

-- Compound index for entitlement lookups by org + flag (most common query)
CREATE INDEX CONCURRENTLY IF NOT EXISTS entitlements_org_flag_active_idx 
ON entitlements (org_id, flag) 
WHERE (expires_at IS NULL OR expires_at > NOW());

-- Compound index for user-specific entitlement lookups
CREATE INDEX CONCURRENTLY IF NOT EXISTS entitlements_user_flag_active_idx 
ON entitlements (user_id, flag) 
WHERE user_id IS NOT NULL AND (expires_at IS NULL OR expires_at > NOW());

-- Index for entitlement source tracking (for audit and debugging)
CREATE INDEX CONCURRENTLY IF NOT EXISTS entitlements_source_ref_idx 
ON entitlements (source, source_ref);

-- Additional performance indices for common query patterns

-- Plans table - for pricing page and plan comparison
CREATE INDEX CONCURRENTLY IF NOT EXISTS plans_updated_at_desc_idx 
ON plans (updated_at DESC);

-- Subscriptions table - for billing operations
CREATE INDEX CONCURRENTLY IF NOT EXISTS subscriptions_period_end_desc_idx 
ON subscriptions (current_period_end DESC) 
WHERE status IN ('active', 'trialing', 'past_due');

CREATE INDEX CONCURRENTLY IF NOT EXISTS subscriptions_trial_ending_idx 
ON subscriptions (trial_end) 
WHERE trial_end IS NOT NULL AND status = 'trialing';

-- Organization members - for membership checks (most critical for RLS)
CREATE INDEX CONCURRENTLY IF NOT EXISTS org_members_user_org_role_idx 
ON org_members (user_id, org_id, role);

-- Runs table - for dashboard and analytics
CREATE INDEX CONCURRENTLY IF NOT EXISTS runs_org_status_created_idx 
ON runs (org_id, status, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS runs_user_status_created_idx 
ON runs (user_id, status, created_at DESC);

-- For cost tracking and billing
CREATE INDEX CONCURRENTLY IF NOT EXISTS runs_cost_tracking_idx 
ON runs (org_id, created_at DESC) 
WHERE cost_usd > 0;

-- For token usage analytics
CREATE INDEX CONCURRENTLY IF NOT EXISTS runs_token_usage_idx 
ON runs (org_id, created_at DESC) 
WHERE tokens_used > 0;

-- Prompt history - for version tracking and deduplication
CREATE INDEX CONCURRENTLY IF NOT EXISTS prompt_history_hash_module_idx 
ON prompt_history (hash, module_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS prompt_history_user_module_created_idx 
ON prompt_history (user_id, module_id, created_at DESC);

-- Projects - for project-based filtering
CREATE INDEX CONCURRENTLY IF NOT EXISTS projects_org_slug_idx 
ON projects (org_id, slug);

-- API Keys - for authentication and rate limiting
CREATE INDEX CONCURRENTLY IF NOT EXISTS api_keys_hash_active_idx 
ON api_keys (key_hash) 
WHERE active = TRUE;

CREATE INDEX CONCURRENTLY IF NOT EXISTS api_keys_org_active_used_idx 
ON api_keys (org_id, active, last_used_at DESC);

-- Bundles - for export management
CREATE INDEX CONCURRENTLY IF NOT EXISTS bundles_checksum_idx 
ON bundles (checksum);

CREATE INDEX CONCURRENTLY IF NOT EXISTS bundles_run_formats_idx 
ON bundles (run_id, formats);

-- Module versions - for version management
CREATE INDEX CONCURRENTLY IF NOT EXISTS module_versions_module_enabled_created_idx 
ON module_versions (module_id, enabled, created_at DESC);

-- Composite indices for complex queries

-- For billing dashboard - subscription status by org
CREATE INDEX CONCURRENTLY IF NOT EXISTS subscriptions_org_status_period_idx 
ON subscriptions (org_id, status, current_period_end DESC);

-- For run analytics - success rate by module
CREATE INDEX CONCURRENTLY IF NOT EXISTS runs_module_status_created_idx 
ON runs (module_id, status, created_at DESC);

-- For user activity tracking
CREATE INDEX CONCURRENTLY IF NOT EXISTS runs_user_org_created_idx 
ON runs (user_id, org_id, created_at DESC);

-- For entitlement expiry management
CREATE INDEX CONCURRENTLY IF NOT EXISTS entitlements_expiry_management_idx 
ON entitlements (expires_at, org_id) 
WHERE expires_at IS NOT NULL;

-- Partial indices for specific use cases

-- Active subscriptions only (most common billing queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS subscriptions_active_only_idx 
ON subscriptions (org_id, plan_code, seats) 
WHERE status IN ('active', 'trialing');

-- Successful runs only (for analytics and reporting)
CREATE INDEX CONCURRENTLY IF NOT EXISTS runs_success_analytics_idx 
ON runs (org_id, module_id, created_at DESC, tokens_used, cost_usd, duration_ms) 
WHERE status = 'success';

-- High-scoring runs (for quality metrics)
CREATE INDEX CONCURRENTLY IF NOT EXISTS prompt_scores_high_quality_idx 
ON prompt_scores (run_id, overall_score, scored_at DESC) 
WHERE overall_score >= 80;

-- Recent activity indices (last 30 days - common dashboard timeframe)
CREATE INDEX CONCURRENTLY IF NOT EXISTS runs_recent_activity_idx 
ON runs (org_id, created_at DESC, status) 
WHERE created_at >= NOW() - INTERVAL '30 days';

-- Function to analyze query performance for common patterns
CREATE OR REPLACE FUNCTION analyze_query_performance()
RETURNS TABLE (
    query_type TEXT,
    table_name TEXT,
    estimated_rows BIGINT,
    index_used TEXT,
    performance_note TEXT
) AS $$
BEGIN
    RETURN QUERY VALUES
        ('Entitlement Check', 'entitlements', 
         (SELECT COUNT(*) FROM entitlements), 
         'entitlements_org_flag_active_idx',
         'O(1) lookup for feature gating'),
        
        ('Membership Check', 'org_members', 
         (SELECT COUNT(*) FROM org_members), 
         'org_members_user_org_role_idx',
         'Critical for RLS policies'),
        
        ('Recent Runs', 'runs', 
         (SELECT COUNT(*) FROM runs WHERE created_at >= NOW() - INTERVAL '30 days'), 
         'runs_recent_activity_idx',
         'Dashboard performance'),
        
        ('Active Subscriptions', 'subscriptions', 
         (SELECT COUNT(*) FROM subscriptions WHERE status IN ('active', 'trialing')), 
         'subscriptions_active_only_idx',
         'Billing operations'),
        
        ('Bundle Lookups', 'bundles', 
         (SELECT COUNT(*) FROM bundles), 
         'bundles_run_id_idx',
         'Export functionality');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get index usage statistics
CREATE OR REPLACE FUNCTION get_index_usage_stats()
RETURNS TABLE (
    schemaname TEXT,
    tablename TEXT,
    indexname TEXT,
    idx_scan BIGINT,
    idx_tup_read BIGINT,
    idx_tup_fetch BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.schemaname::TEXT,
        s.tablename::TEXT,
        s.indexname::TEXT,
        s.idx_scan,
        s.idx_tup_read,
        s.idx_tup_fetch
    FROM pg_stat_user_indexes s
    WHERE s.schemaname = 'public'
    ORDER BY s.idx_scan DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to identify missing indices for common queries
CREATE OR REPLACE FUNCTION suggest_missing_indices()
RETURNS TABLE (
    table_name TEXT,
    suggested_index TEXT,
    reason TEXT
) AS $$
BEGIN
    RETURN QUERY VALUES
        ('entitlements', 'CREATE INDEX ON entitlements (flag, value) WHERE value = true', 'Fast flag filtering'),
        ('runs', 'CREATE INDEX ON runs (finished_at DESC) WHERE status = ''success''', 'Completion time analytics'),
        ('prompt_history', 'CREATE INDEX ON prompt_history (org_id, module_id, version)', 'Version-based queries'),
        ('user_addons', 'CREATE INDEX ON user_addons (addon_code, status)', 'Addon management'),
        ('api_keys', 'CREATE INDEX ON api_keys (rate_limit, last_used_at)', 'Rate limiting queries');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to monitor slow queries and suggest optimizations
CREATE OR REPLACE FUNCTION monitor_query_performance()
RETURNS TABLE (
    query TEXT,
    calls BIGINT,
    total_time NUMERIC,
    avg_time NUMERIC,
    suggestion TEXT
) AS $$
BEGIN
    -- This would typically query pg_stat_statements if available
    -- For now, return common optimization suggestions
    RETURN QUERY VALUES
        ('SELECT * FROM entitlements WHERE org_id = ? AND flag = ?', 1000, 50.0, 0.05, 'Use entitlements_org_flag_active_idx'),
        ('SELECT * FROM runs WHERE org_id = ? ORDER BY created_at DESC', 500, 100.0, 0.2, 'Use runs_org_status_created_idx'),
        ('SELECT * FROM org_members WHERE user_id = ?', 2000, 20.0, 0.01, 'Use org_members_user_org_role_idx');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update table statistics for better query planning
ANALYZE orgs;
ANALYZE org_members;
ANALYZE plans;
ANALYZE subscriptions;
ANALYZE entitlements;
ANALYZE user_addons;
ANALYZE api_keys;
ANALYZE modules;
ANALYZE domain_configs;
ANALYZE parameter_sets;
ANALYZE projects;
ANALYZE prompt_history;
ANALYZE runs;
ANALYZE prompt_scores;
ANALYZE bundles;
ANALYZE module_versions;

-- Migration completed
SELECT 'Migration 007 completed: Critical performance indices for O(1) gating and fast queries' as status;
