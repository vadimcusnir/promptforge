-- PromptForge Database Migration 004
-- Catalog & 7D Engine: modules + domains + parameter sets
-- Source of truth for M01-M50 and industrial profiles

-- Enum types for parameter validation
CREATE TYPE scale_t AS ENUM ('startup', 'scaleup', 'enterprise', 'conglomerate');
CREATE TYPE urgency_t AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE complexity_t AS ENUM ('simple', 'moderate', 'complex', 'expert');
CREATE TYPE resources_t AS ENUM ('minimal', 'standard', 'extensive', 'unlimited');
CREATE TYPE application_t AS ENUM ('internal', 'client_facing', 'product', 'marketing', 'operations', 'strategic');
CREATE TYPE risk_level_t AS ENUM ('low', 'medium', 'high', 'critical');

-- Modules catalog (M01-M50)
CREATE TABLE modules (
    module_id TEXT PRIMARY KEY CHECK (module_id ~ '^M[0-4][0-9]$|^M50$'), -- M01 to M50
    name TEXT NOT NULL,
    vectors INTEGER[] NOT NULL DEFAULT '{}',
    requirements JSONB NOT NULL DEFAULT '{}',
    spec TEXT NOT NULL,
    output_schema JSONB NOT NULL DEFAULT '{}',
    kpi TEXT NOT NULL,
    guardrails TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT modules_name_not_empty CHECK (length(trim(name)) > 0),
    CONSTRAINT modules_spec_not_empty CHECK (length(trim(spec)) > 0),
    CONSTRAINT modules_kpi_not_empty CHECK (length(trim(kpi)) > 0),
    CONSTRAINT modules_guardrails_not_empty CHECK (length(trim(guardrails)) > 0),
    CONSTRAINT modules_vectors_valid CHECK (
        array_length(vectors, 1) IS NULL OR 
        (array_length(vectors, 1) > 0 AND array_length(vectors, 1) <= 7)
    )
);

-- Domain configurations (CORE 25 industrial profiles)
CREATE TABLE domain_configs (
    industry TEXT PRIMARY KEY,
    jargon JSONB NOT NULL DEFAULT '{}',
    kpis JSONB NOT NULL DEFAULT '{}',
    compliance_notes TEXT,
    default_output_format TEXT NOT NULL DEFAULT 'structured',
    risk_level risk_level_t NOT NULL DEFAULT 'medium',
    style_bias JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT domain_configs_industry_not_empty CHECK (length(trim(industry)) > 0),
    CONSTRAINT domain_configs_format_valid CHECK (
        default_output_format IN ('structured', 'narrative', 'technical', 'executive', 'creative')
    )
);

-- Parameter sets for 7D Engine
CREATE TABLE parameter_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain TEXT NOT NULL REFERENCES domain_configs(industry),
    scale scale_t NOT NULL,
    urgency urgency_t NOT NULL,
    complexity complexity_t NOT NULL,
    resources resources_t NOT NULL,
    application application_t NOT NULL,
    output_formats TEXT[] NOT NULL DEFAULT '{"structured"}',
    overrides JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT parameter_sets_output_formats_valid CHECK (
        array_length(output_formats, 1) > 0 AND
        output_formats <@ ARRAY['structured', 'narrative', 'technical', 'executive', 'creative', 'markdown', 'json', 'xml']
    ),
    CONSTRAINT parameter_sets_domain_exists CHECK (
        EXISTS (SELECT 1 FROM domain_configs WHERE industry = parameter_sets.domain)
    )
);

-- Triggers for updated_at
CREATE TRIGGER trg_modules_updated_at 
    BEFORE UPDATE ON modules 
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

CREATE TRIGGER trg_domain_configs_updated_at 
    BEFORE UPDATE ON domain_configs 
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

-- Performance indices
CREATE INDEX modules_enabled_idx ON modules (enabled) WHERE enabled = TRUE;
CREATE INDEX modules_vectors_gin_idx ON modules USING GIN (vectors);
CREATE INDEX modules_name_idx ON modules (name);

CREATE INDEX domain_configs_industry_idx ON domain_configs (industry);
CREATE INDEX domain_configs_risk_level_idx ON domain_configs (risk_level);

CREATE INDEX parameter_sets_domain_idx ON parameter_sets (domain);
CREATE INDEX parameter_sets_created_at_idx ON parameter_sets (created_at DESC);
CREATE INDEX parameter_sets_scale_urgency_idx ON parameter_sets (scale, urgency);

-- Function to get module recommendations based on vectors
CREATE OR REPLACE FUNCTION get_module_recommendations(target_vectors INTEGER[])
RETURNS TABLE (
    module_id TEXT,
    name TEXT,
    match_score INTEGER,
    vectors INTEGER[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.module_id,
        m.name,
        array_length(m.vectors & target_vectors, 1) as match_score,
        m.vectors
    FROM modules m
    WHERE 
        m.enabled = TRUE 
        AND m.vectors && target_vectors -- Has intersection
    ORDER BY match_score DESC, m.module_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate parameter set against ruleset
CREATE OR REPLACE FUNCTION validate_parameter_set(
    p_domain TEXT,
    p_scale scale_t,
    p_urgency urgency_t,
    p_complexity complexity_t,
    p_resources resources_t,
    p_application application_t,
    p_output_formats TEXT[],
    p_overrides JSONB DEFAULT '{}'
) RETURNS BOOLEAN AS $$
DECLARE
    domain_exists BOOLEAN;
    valid_combinations TEXT[];
BEGIN
    -- Check if domain exists
    SELECT EXISTS(SELECT 1 FROM domain_configs WHERE industry = p_domain) INTO domain_exists;
    IF NOT domain_exists THEN
        RAISE EXCEPTION 'Invalid domain: %', p_domain;
    END IF;
    
    -- Validate output formats
    IF NOT (p_output_formats <@ ARRAY['structured', 'narrative', 'technical', 'executive', 'creative', 'markdown', 'json', 'xml']) THEN
        RAISE EXCEPTION 'Invalid output format in: %', p_output_formats;
    END IF;
    
    -- Additional business logic validation can be added here
    -- For now, basic validation passes
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get default parameter set for domain
CREATE OR REPLACE FUNCTION get_default_parameter_set(p_domain TEXT)
RETURNS parameter_sets AS $$
DECLARE
    result parameter_sets;
    domain_config domain_configs;
BEGIN
    -- Get domain configuration
    SELECT * INTO domain_config FROM domain_configs WHERE industry = p_domain;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Domain % not found', p_domain;
    END IF;
    
    -- Create default parameter set
    result.id := gen_random_uuid();
    result.domain := p_domain;
    result.scale := 'scaleup'; -- Default scale
    result.urgency := 'medium'; -- Default urgency
    result.complexity := 'moderate'; -- Default complexity
    result.resources := 'standard'; -- Default resources
    result.application := 'internal'; -- Default application
    result.output_formats := ARRAY[domain_config.default_output_format];
    result.overrides := '{}';
    result.created_at := NOW();
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE parameter_sets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for modules
-- Public read for catalog browsing (authenticated users)
CREATE POLICY "modules_authenticated_select" ON modules
    FOR SELECT TO authenticated
    USING (enabled = TRUE);

-- Only service role can modify modules (admin operations)
CREATE POLICY "modules_service_write" ON modules
    FOR ALL TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

-- RLS Policies for domain_configs  
-- Public read for domain selection
CREATE POLICY "domain_configs_authenticated_select" ON domain_configs
    FOR SELECT TO authenticated
    USING (TRUE);

-- Only service role can modify domain configs
CREATE POLICY "domain_configs_service_write" ON domain_configs
    FOR ALL TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

-- RLS Policies for parameter_sets
-- Users can create and read their own parameter sets
-- For now, we'll make them public within authenticated users
-- In production, you might want to tie them to organizations
CREATE POLICY "parameter_sets_authenticated_all" ON parameter_sets
    FOR ALL TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- View for active modules with metadata
CREATE OR REPLACE VIEW modules_active AS
SELECT 
    module_id,
    name,
    vectors,
    array_length(vectors, 1) as vector_count,
    requirements,
    spec,
    output_schema,
    kpi,
    guardrails,
    created_at,
    updated_at
FROM modules 
WHERE enabled = TRUE
ORDER BY module_id;

-- View for domain summary statistics
CREATE OR REPLACE VIEW domain_stats AS
SELECT 
    dc.industry,
    dc.risk_level,
    dc.default_output_format,
    COUNT(ps.id) as parameter_sets_count,
    dc.created_at
FROM domain_configs dc
LEFT JOIN parameter_sets ps ON dc.industry = ps.domain
GROUP BY dc.industry, dc.risk_level, dc.default_output_format, dc.created_at
ORDER BY dc.industry;

-- Migration completed
SELECT 'Migration 004 completed: Catalog & 7D Engine modules, domains, parameter sets' as status;
