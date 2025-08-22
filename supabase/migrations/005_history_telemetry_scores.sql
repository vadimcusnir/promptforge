-- PromptForge Database Migration 005
-- History, telemetry, scores and exports
-- Complete audit trail and scoring system

-- Enum types for runs and scoring
CREATE TYPE run_type_t AS ENUM ('generation', 'test', 'agent_execution');
CREATE TYPE run_status_t AS ENUM ('queued', 'running', 'success', 'error', 'timeout', 'cancelled');

-- Projects table (optional grouping for runs)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    meta JSONB NOT NULL DEFAULT '{}',
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT projects_slug_unique_per_org UNIQUE (org_id, slug),
    CONSTRAINT projects_name_not_empty CHECK (length(trim(name)) > 0),
    CONSTRAINT projects_slug_format CHECK (slug ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$' AND length(slug) >= 3),
    CONSTRAINT projects_creator_member CHECK (
        EXISTS (SELECT 1 FROM org_members WHERE org_id = projects.org_id AND user_id = projects.created_by)
    )
);

-- Prompt history table
CREATE TABLE prompt_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    module_id TEXT NOT NULL REFERENCES modules(module_id),
    parameter_set_id UUID REFERENCES parameter_sets(id),
    project_id UUID REFERENCES projects(id),
    hash TEXT NOT NULL, -- SHA-256 hash of the prompt configuration
    config JSONB NOT NULL,
    output TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT prompt_history_hash_format CHECK (hash ~ '^sha256:[0-9a-f]{64}$'),
    CONSTRAINT prompt_history_output_not_empty CHECK (length(trim(output)) > 0),
    CONSTRAINT prompt_history_version_positive CHECK (version > 0),
    CONSTRAINT prompt_history_user_member CHECK (
        EXISTS (SELECT 1 FROM org_members WHERE org_id = prompt_history.org_id AND user_id = prompt_history.user_id)
    )
);

-- Runs table (execution tracking)
CREATE TABLE runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    module_id TEXT NOT NULL REFERENCES modules(module_id),
    parameter_set_id UUID REFERENCES parameter_sets(id),
    project_id UUID REFERENCES projects(id),
    prompt_history_id UUID REFERENCES prompt_history(id),
    type run_type_t NOT NULL DEFAULT 'generation',
    status run_status_t NOT NULL DEFAULT 'queued',
    model TEXT,
    tokens_used INTEGER DEFAULT 0,
    cost_usd DECIMAL(10,6) DEFAULT 0.00,
    duration_ms INTEGER,
    telemetry JSONB NOT NULL DEFAULT '{}',
    error_message TEXT,
    started_at TIMESTAMPTZ,
    finished_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT runs_tokens_non_negative CHECK (tokens_used >= 0),
    CONSTRAINT runs_cost_non_negative CHECK (cost_usd >= 0),
    CONSTRAINT runs_duration_positive CHECK (duration_ms IS NULL OR duration_ms > 0),
    CONSTRAINT runs_finished_after_started CHECK (finished_at IS NULL OR started_at IS NULL OR finished_at >= started_at),
    CONSTRAINT runs_user_member CHECK (
        EXISTS (SELECT 1 FROM org_members WHERE org_id = runs.org_id AND user_id = runs.user_id)
    )
);

-- Prompt scores table (rubric-based evaluation)
CREATE TABLE prompt_scores (
    run_id UUID PRIMARY KEY REFERENCES runs(id) ON DELETE CASCADE,
    clarity INTEGER NOT NULL CHECK (clarity >= 0 AND clarity <= 100),
    execution INTEGER NOT NULL CHECK (execution >= 0 AND execution <= 100),
    ambiguity INTEGER NOT NULL CHECK (ambiguity >= 0 AND ambiguity <= 100), -- Lower is better, inverted in calculation
    alignment INTEGER NOT NULL CHECK (alignment >= 0 AND alignment <= 100),
    business_fit INTEGER NOT NULL CHECK (business_fit >= 0 AND business_fit <= 100),
    overall_score INTEGER GENERATED ALWAYS AS (
        ROUND((clarity + execution + (100 - ambiguity) + alignment + business_fit) / 5.0)
    ) STORED,
    feedback JSONB NOT NULL DEFAULT '{}',
    scored_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    scored_by UUID, -- NULL for automated scoring
    
    CONSTRAINT prompt_scores_threshold CHECK (overall_score >= 0 AND overall_score <= 100)
);

-- Bundles table (export packages)
CREATE TABLE bundles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
    formats TEXT[] NOT NULL,
    paths JSONB NOT NULL, -- {"markdown": "path/to/file.md", "pdf": "path/to/file.pdf"}
    checksum TEXT NOT NULL,
    version TEXT NOT NULL DEFAULT '1.0.0',
    license_notice TEXT NOT NULL,
    exported_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    
    CONSTRAINT bundles_checksum_format CHECK (checksum ~ '^sha256:[0-9a-f]{64}$'),
    CONSTRAINT bundles_formats_valid CHECK (
        array_length(formats, 1) > 0 AND
        formats <@ ARRAY['markdown', 'pdf', 'json', 'xml', 'docx', 'zip']
    ),
    CONSTRAINT bundles_license_not_empty CHECK (length(trim(license_notice)) > 0),
    CONSTRAINT bundles_version_semver CHECK (version ~ '^\d+\.\d+\.\d+(-[a-zA-Z0-9-]+)?$')
);

-- Triggers for updated_at
CREATE TRIGGER trg_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

-- Performance indices
CREATE INDEX projects_org_id_created_at_idx ON projects (org_id, created_at DESC);
CREATE INDEX projects_created_by_idx ON projects (created_by);

CREATE INDEX prompt_history_org_id_created_at_idx ON prompt_history (org_id, created_at DESC);
CREATE INDEX prompt_history_user_id_idx ON prompt_history (user_id);
CREATE INDEX prompt_history_module_id_idx ON prompt_history (module_id);
CREATE INDEX prompt_history_hash_idx ON prompt_history (hash);

CREATE INDEX runs_org_id_started_at_idx ON runs (org_id, started_at DESC);
CREATE INDEX runs_org_id_module_id_started_at_idx ON runs (org_id, module_id, started_at DESC);
CREATE INDEX runs_user_id_idx ON runs (user_id);
CREATE INDEX runs_status_idx ON runs (status);
CREATE INDEX runs_type_idx ON runs (type);
CREATE INDEX runs_project_id_idx ON runs (project_id) WHERE project_id IS NOT NULL;

CREATE INDEX prompt_scores_overall_score_idx ON prompt_scores (overall_score DESC);
CREATE INDEX prompt_scores_scored_at_idx ON prompt_scores (scored_at DESC);

CREATE INDEX bundles_run_id_idx ON bundles (run_id);
CREATE INDEX bundles_formats_gin_idx ON bundles USING GIN (formats);
CREATE INDEX bundles_exported_at_idx ON bundles (exported_at DESC);
CREATE INDEX bundles_expires_at_idx ON bundles (expires_at) WHERE expires_at IS NOT NULL;

-- Function to calculate run statistics
CREATE OR REPLACE FUNCTION get_org_run_stats(
    org_uuid UUID, 
    days_back INTEGER DEFAULT 30
) RETURNS TABLE (
    total_runs BIGINT,
    successful_runs BIGINT,
    failed_runs BIGINT,
    avg_duration_ms NUMERIC,
    total_tokens BIGINT,
    total_cost_usd NUMERIC,
    avg_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_runs,
        COUNT(*) FILTER (WHERE r.status = 'success') as successful_runs,
        COUNT(*) FILTER (WHERE r.status = 'error') as failed_runs,
        ROUND(AVG(r.duration_ms), 2) as avg_duration_ms,
        COALESCE(SUM(r.tokens_used), 0) as total_tokens,
        COALESCE(SUM(r.cost_usd), 0) as total_cost_usd,
        ROUND(AVG(ps.overall_score), 2) as avg_score
    FROM runs r
    LEFT JOIN prompt_scores ps ON r.id = ps.run_id
    WHERE 
        r.org_id = org_uuid 
        AND r.created_at >= NOW() - (days_back || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate bundle manifest
CREATE OR REPLACE FUNCTION generate_bundle_manifest(bundle_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    bundle_record bundles;
    run_record runs;
    manifest JSONB;
BEGIN
    -- Get bundle and run information
    SELECT b.*, r.* INTO bundle_record, run_record
    FROM bundles b
    JOIN runs r ON b.run_id = r.id
    WHERE b.id = bundle_uuid;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Bundle % not found', bundle_uuid;
    END IF;
    
    -- Generate manifest
    manifest := jsonb_build_object(
        'bundle_id', bundle_record.id,
        'version', bundle_record.version,
        'created_at', bundle_record.exported_at,
        'checksum', bundle_record.checksum,
        'license', bundle_record.license_notice,
        'formats', bundle_record.formats,
        'paths', bundle_record.paths,
        'run_info', jsonb_build_object(
            'run_id', run_record.id,
            'module_id', run_record.module_id,
            'type', run_record.type,
            'model', run_record.model,
            'tokens_used', run_record.tokens_used,
            'duration_ms', run_record.duration_ms
        )
    );
    
    RETURN manifest;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if run meets scoring threshold for export
CREATE OR REPLACE FUNCTION run_meets_export_threshold(run_uuid UUID, threshold INTEGER DEFAULT 80)
RETURNS BOOLEAN AS $$
DECLARE
    score INTEGER;
BEGIN
    SELECT overall_score INTO score
    FROM prompt_scores
    WHERE run_id = run_uuid;
    
    -- If no score exists, default to false (must be scored first)
    IF score IS NULL THEN
        RETURN FALSE;
    END IF;
    
    RETURN score >= threshold;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
-- Members can see org projects, owners/admins can manage
CREATE POLICY "projects_member_select" ON projects
    FOR SELECT TO authenticated
    USING (is_org_member(org_id, get_current_user_id()));

CREATE POLICY "projects_admin_write" ON projects
    FOR INSERT TO authenticated
    WITH CHECK (is_org_admin(org_id, get_current_user_id()));

CREATE POLICY "projects_admin_update" ON projects
    FOR UPDATE TO authenticated
    USING (is_org_admin(org_id, get_current_user_id()))
    WITH CHECK (is_org_admin(org_id, get_current_user_id()));

CREATE POLICY "projects_admin_delete" ON projects
    FOR DELETE TO authenticated
    USING (is_org_admin(org_id, get_current_user_id()));

-- RLS Policies for prompt_history
-- Members can see org history
CREATE POLICY "prompt_history_member_select" ON prompt_history
    FOR SELECT TO authenticated
    USING (is_org_member(org_id, get_current_user_id()));

-- Users can insert their own history (service role handles this)
CREATE POLICY "prompt_history_service_write" ON prompt_history
    FOR ALL TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

-- RLS Policies for runs
-- Members can see org runs
CREATE POLICY "runs_member_select" ON runs
    FOR SELECT TO authenticated
    USING (is_org_member(org_id, get_current_user_id()));

-- Service role manages runs
CREATE POLICY "runs_service_write" ON runs
    FOR ALL TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

-- RLS Policies for prompt_scores
-- Members can see scores for their org's runs
CREATE POLICY "prompt_scores_member_select" ON prompt_scores
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM runs r 
            WHERE r.id = prompt_scores.run_id 
            AND is_org_member(r.org_id, get_current_user_id())
        )
    );

-- Service role manages scoring
CREATE POLICY "prompt_scores_service_write" ON prompt_scores
    FOR ALL TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

-- RLS Policies for bundles
-- Members can see bundles for their org's runs (read-only from client)
CREATE POLICY "bundles_member_select" ON bundles
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM runs r 
            WHERE r.id = bundles.run_id 
            AND is_org_member(r.org_id, get_current_user_id())
        )
    );

-- Service role manages bundle creation
CREATE POLICY "bundles_service_write" ON bundles
    FOR ALL TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

-- Views for reporting and analytics
CREATE OR REPLACE VIEW runs_with_scores AS
SELECT 
    r.*,
    ps.clarity,
    ps.execution,
    ps.ambiguity,
    ps.alignment,
    ps.business_fit,
    ps.overall_score,
    ps.feedback,
    ps.scored_at
FROM runs r
LEFT JOIN prompt_scores ps ON r.id = ps.run_id;

CREATE OR REPLACE VIEW successful_runs_summary AS
SELECT 
    r.org_id,
    r.module_id,
    COUNT(*) as total_runs,
    COUNT(ps.run_id) as scored_runs,
    COUNT(*) FILTER (WHERE ps.overall_score >= 80) as high_quality_runs,
    AVG(ps.overall_score) as avg_score,
    SUM(r.tokens_used) as total_tokens,
    SUM(r.cost_usd) as total_cost,
    AVG(r.duration_ms) as avg_duration_ms
FROM runs r
LEFT JOIN prompt_scores ps ON r.id = ps.run_id
WHERE r.status = 'success'
GROUP BY r.org_id, r.module_id;

-- Migration completed
SELECT 'Migration 005 completed: History, telemetry, scores and exports' as status;
