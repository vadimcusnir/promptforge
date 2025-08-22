-- PromptForge Database Migration 006
-- Module versioning system (optional but recommended for production)
-- Enables deterministic rollback and contract freezing

-- Module versions table
CREATE TABLE module_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id TEXT NOT NULL REFERENCES modules(module_id),
    semver TEXT NOT NULL,
    parent_version_id UUID REFERENCES module_versions(id),
    
    -- Snapshot of module data at this version
    snapshot_name TEXT NOT NULL,
    snapshot_vectors INTEGER[] NOT NULL DEFAULT '{}',
    snapshot_spec TEXT NOT NULL,
    snapshot_output_schema JSONB NOT NULL DEFAULT '{}',
    snapshot_kpi TEXT NOT NULL,
    snapshot_guardrails TEXT NOT NULL,
    
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    changelog TEXT,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT module_versions_semver_format CHECK (semver ~ '^\d+\.\d+\.\d+(-[a-zA-Z0-9-]+)?(\+[a-zA-Z0-9-]+)?$'),
    CONSTRAINT module_versions_unique_per_module UNIQUE (module_id, semver),
    CONSTRAINT module_versions_name_not_empty CHECK (length(trim(snapshot_name)) > 0),
    CONSTRAINT module_versions_spec_not_empty CHECK (length(trim(snapshot_spec)) > 0),
    CONSTRAINT module_versions_kpi_not_empty CHECK (length(trim(snapshot_kpi)) > 0),
    CONSTRAINT module_versions_guardrails_not_empty CHECK (length(trim(snapshot_guardrails)) > 0),
    CONSTRAINT module_versions_vectors_valid CHECK (
        array_length(snapshot_vectors, 1) IS NULL OR 
        (array_length(snapshot_vectors, 1) > 0 AND array_length(snapshot_vectors, 1) <= 7)
    )
);

-- Trigger for updated_at
CREATE TRIGGER trg_module_versions_updated_at 
    BEFORE UPDATE ON module_versions 
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

-- Performance indices
CREATE INDEX module_versions_module_id_semver_idx ON module_versions (module_id, semver);
CREATE INDEX module_versions_enabled_idx ON module_versions (enabled) WHERE enabled = TRUE;
CREATE INDEX module_versions_created_at_idx ON module_versions (created_at DESC);
CREATE INDEX module_versions_parent_idx ON module_versions (parent_version_id) WHERE parent_version_id IS NOT NULL;

-- Function to create a new module version from current module state
CREATE OR REPLACE FUNCTION module_version_publish(
    p_module_id TEXT,
    p_semver TEXT,
    p_changelog TEXT DEFAULT NULL,
    p_created_by UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    module_record modules;
    version_id UUID;
    creator_id UUID;
BEGIN
    -- Get current module state
    SELECT * INTO module_record FROM modules WHERE module_id = p_module_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Module % not found', p_module_id;
    END IF;
    
    -- Use provided creator or try to get from context
    creator_id := COALESCE(p_created_by, get_current_user_id());
    
    -- Create version snapshot
    INSERT INTO module_versions (
        module_id,
        semver,
        snapshot_name,
        snapshot_vectors,
        snapshot_spec,
        snapshot_output_schema,
        snapshot_kpi,
        snapshot_guardrails,
        changelog,
        created_by
    ) VALUES (
        p_module_id,
        p_semver,
        module_record.name,
        module_record.vectors,
        module_record.spec,
        module_record.output_schema,
        module_record.kpi,
        module_record.guardrails,
        p_changelog,
        creator_id
    ) RETURNING id INTO version_id;
    
    RAISE NOTICE 'Published module % version %', p_module_id, p_semver;
    RETURN version_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set a specific version as enabled/disabled
CREATE OR REPLACE FUNCTION module_version_set_enabled(
    p_module_id TEXT,
    p_semver TEXT,
    p_enabled BOOLEAN
) RETURNS BOOLEAN AS $$
DECLARE
    affected_rows INTEGER;
BEGIN
    UPDATE module_versions 
    SET enabled = p_enabled, updated_at = NOW()
    WHERE module_id = p_module_id AND semver = p_semver;
    
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    
    IF affected_rows = 0 THEN
        RAISE EXCEPTION 'Module version % % not found', p_module_id, p_semver;
    END IF;
    
    RAISE NOTICE 'Set module % version % enabled = %', p_module_id, p_semver, p_enabled;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to rollback module to a specific version
CREATE OR REPLACE FUNCTION module_version_rollback_to(
    p_module_id TEXT,
    p_semver TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    version_record module_versions;
BEGIN
    -- Get the target version
    SELECT * INTO version_record 
    FROM module_versions 
    WHERE module_id = p_module_id AND semver = p_semver;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Module version % % not found', p_module_id, p_semver;
    END IF;
    
    IF NOT version_record.enabled THEN
        RAISE EXCEPTION 'Cannot rollback to disabled version % %', p_module_id, p_semver;
    END IF;
    
    -- Update the main module table with the snapshot data
    UPDATE modules SET
        name = version_record.snapshot_name,
        vectors = version_record.snapshot_vectors,
        spec = version_record.snapshot_spec,
        output_schema = version_record.snapshot_output_schema,
        kpi = version_record.snapshot_kpi,
        guardrails = version_record.snapshot_guardrails,
        updated_at = NOW()
    WHERE module_id = p_module_id;
    
    RAISE NOTICE 'Rolled back module % to version %', p_module_id, p_semver;
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get the latest version of a module
CREATE OR REPLACE FUNCTION module_get_latest_version(p_module_id TEXT)
RETURNS module_versions AS $$
DECLARE
    result module_versions;
BEGIN
    SELECT * INTO result
    FROM module_versions
    WHERE module_id = p_module_id AND enabled = TRUE
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No enabled versions found for module %', p_module_id;
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to compare two module versions
CREATE OR REPLACE FUNCTION module_version_compare(
    p_module_id TEXT,
    p_semver_a TEXT,
    p_semver_b TEXT
) RETURNS TABLE (
    field TEXT,
    version_a TEXT,
    version_b TEXT,
    changed BOOLEAN
) AS $$
DECLARE
    version_a module_versions;
    version_b module_versions;
BEGIN
    -- Get both versions
    SELECT * INTO version_a FROM module_versions WHERE module_id = p_module_id AND semver = p_semver_a;
    SELECT * INTO version_b FROM module_versions WHERE module_id = p_module_id AND semver = p_semver_b;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'One or both versions not found';
    END IF;
    
    -- Compare fields
    RETURN QUERY VALUES
        ('name', version_a.snapshot_name, version_b.snapshot_name, version_a.snapshot_name != version_b.snapshot_name),
        ('vectors', version_a.snapshot_vectors::TEXT, version_b.snapshot_vectors::TEXT, version_a.snapshot_vectors != version_b.snapshot_vectors),
        ('spec', left(version_a.snapshot_spec, 100) || '...', left(version_b.snapshot_spec, 100) || '...', version_a.snapshot_spec != version_b.snapshot_spec),
        ('kpi', version_a.snapshot_kpi, version_b.snapshot_kpi, version_a.snapshot_kpi != version_b.snapshot_kpi),
        ('guardrails', left(version_a.snapshot_guardrails, 100) || '...', left(version_b.snapshot_guardrails, 100) || '...', version_a.snapshot_guardrails != version_b.snapshot_guardrails);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE module_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for module_versions
-- Authenticated users can read enabled versions
CREATE POLICY "module_versions_authenticated_select" ON module_versions
    FOR SELECT TO authenticated
    USING (enabled = TRUE);

-- Only service role can manage versions (admin operations)
CREATE POLICY "module_versions_service_write" ON module_versions
    FOR ALL TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

-- Views for version management
-- Latest version of each module
CREATE OR REPLACE VIEW v_module_latest AS
SELECT DISTINCT ON (mv.module_id)
    mv.id,
    mv.module_id,
    mv.semver,
    mv.snapshot_name as name,
    mv.snapshot_vectors as vectors,
    mv.snapshot_spec as spec,
    mv.snapshot_output_schema as output_schema,
    mv.snapshot_kpi as kpi,
    mv.snapshot_guardrails as guardrails,
    mv.enabled,
    mv.created_at,
    mv.updated_at
FROM module_versions mv
WHERE mv.enabled = TRUE
ORDER BY mv.module_id, mv.created_at DESC;

-- All versions with metadata
CREATE OR REPLACE VIEW v_module_versions AS
SELECT 
    mv.*,
    m.enabled as module_enabled,
    CASE 
        WHEN mv.parent_version_id IS NOT NULL THEN 
            (SELECT semver FROM module_versions WHERE id = mv.parent_version_id)
        ELSE NULL
    END as parent_semver,
    -- Check if this is the latest version
    mv.created_at = (
        SELECT MAX(created_at) 
        FROM module_versions mv2 
        WHERE mv2.module_id = mv.module_id AND mv2.enabled = TRUE
    ) as is_latest
FROM module_versions mv
JOIN modules m ON mv.module_id = m.module_id
ORDER BY mv.module_id, mv.created_at DESC;

-- Version history summary
CREATE OR REPLACE VIEW v_module_version_history AS
SELECT 
    module_id,
    COUNT(*) as total_versions,
    COUNT(*) FILTER (WHERE enabled = TRUE) as enabled_versions,
    MAX(created_at) FILTER (WHERE enabled = TRUE) as latest_version_date,
    (SELECT semver FROM module_versions mv WHERE mv.module_id = mvh.module_id AND enabled = TRUE ORDER BY created_at DESC LIMIT 1) as latest_semver
FROM module_versions mvh
GROUP BY module_id
ORDER BY module_id;

-- Migration completed
SELECT 'Migration 006 completed: Module versioning system' as status;
