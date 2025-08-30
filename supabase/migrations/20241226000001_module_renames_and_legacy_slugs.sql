-- ============================================================================
-- MODULE RENAMES AND LEGACY SLUGS MIGRATION
-- Version: 1.0.0
-- Date: 2024-12-26
-- ============================================================================
-- This migration applies the module renames and fusions as specified in the
-- module rename requirements, adding legacy_slugs support for backward compatibility.

-- Add legacy_slugs column if it doesn't exist
ALTER TABLE modules ADD COLUMN IF NOT EXISTS legacy_slugs TEXT[] DEFAULT '{}';

-- Update module names and add legacy slugs
-- Strategic & Operations (M01-M10)
UPDATE modules SET 
  name = 'TRUST REVERSAL PROTOCOL™',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['risk-and-trust-reversal'])
WHERE id = 'M07';

UPDATE modules SET 
  name = 'CRISIS COMMUNICATION PLAYBOOK™',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['crisis-communication'])
WHERE id = 'M10';

-- Content & Marketing (M11-M20)
UPDATE modules SET 
  name = 'SOCIAL CONTENT GRID™',
  description = 'Unified social media and content calendar with engagement optimization and audience segmentation',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['social-media-calendar', 'content-calendar-optimizer'])
WHERE id = 'M14';

UPDATE modules SET 
  name = 'LANDING PAGE ALCHEMIST™',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['landing-page-optimizer'])
WHERE id = 'M15';

UPDATE modules SET 
  name = 'INFLUENCE PARTNERSHIP FRAME™',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['influencer-partnership-framework'])
WHERE id = 'M17';

UPDATE modules SET 
  name = 'CONTENT ANALYTICS DASHBOARD™',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['content-performance-analyzer'])
WHERE id = 'M18';

UPDATE modules SET 
  name = 'AUDIENCE SEGMENT PERSONALIZER™',
  description = 'Advanced audience segmentation and personalization engine for targeted content delivery',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['content-calendar-optimizer'])
WHERE id = 'M19';

UPDATE modules SET 
  name = 'MOMENTUM CAMPAIGN BUILDER™',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['content-personalization-engine'])
WHERE id = 'M20';

-- Technical Architecture (M21-M30)
UPDATE modules SET 
  name = 'DATA SCHEMA OPTIMIZER™',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['database-design-optimizer'])
WHERE id = 'M24';

UPDATE modules SET 
  name = 'MICROSERVICES GRID™',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['microservices-architecture'])
WHERE id = 'M25';

UPDATE modules SET 
  name = 'SECURITY FORTRESS FRAME™',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['security-architecture-framework'])
WHERE id = 'M26';

UPDATE modules SET 
  name = 'PERFORMANCE ENGINE™',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['performance-optimization-engine'])
WHERE id = 'M27';

UPDATE modules SET 
  name = 'ORCHESTRATION MATRIX™',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['container-orchestration-strategy'])
WHERE id = 'M29';

UPDATE modules SET 
  name = 'CLOUD INFRA MAP™',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['cloud-infrastructure-architect'])
WHERE id = 'M30';

-- Sales & Customer Ops (M31-M40)
UPDATE modules SET 
  name = 'SALES FLOW ARCHITECT™',
  description = 'Comprehensive sales process optimization and operations framework with conversion enhancement',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['sales-process-optimizer', 'sales-operations-framework'])
WHERE id = 'M31';

UPDATE modules SET 
  name = 'ENABLEMENT FRAME™',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['sales-enablement-framework'])
WHERE id = 'M33';

UPDATE modules SET 
  name = 'CUSTOMER SUCCESS PLAYBOOK™',
  description = 'Comprehensive customer success strategy and implementation framework',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['sales-operations-framework'])
WHERE id = 'M37';

UPDATE modules SET 
  name = 'INTELLIGENCE ENGINE™',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['sales-intelligence-framework'])
WHERE id = 'M39';

UPDATE modules SET 
  name = 'NEGOTIATION DYNAMICS™',
  description = 'Advanced negotiation strategies and dynamic pricing optimization',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['sales-intelligence-framework'])
WHERE id = 'M40';

-- Business Ops & Identity (M41-M50)
UPDATE modules SET 
  name = 'QUALITY SYSTEM MAP™',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['quality-management-system'])
WHERE id = 'M42';

UPDATE modules SET 
  name = 'SUPPLY FLOW OPTIMIZER™',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['supply-chain-optimizer'])
WHERE id = 'M43';

UPDATE modules SET 
  name = 'CHANGE FORCE FIELD™',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['change-management-framework'])
WHERE id = 'M45';

UPDATE modules SET 
  name = 'EXECUTIVE PROMPT DOSSIER™',
  legacy_slugs = array_cat(COALESCE(legacy_slugs, '{}'), ARRAY['executive-prompt-report'])
WHERE id = 'M49';

-- Create index on legacy_slugs for efficient lookups
CREATE INDEX IF NOT EXISTS idx_modules_legacy_slugs ON modules USING GIN (legacy_slugs);

-- Create function to find module by slug or legacy slug
CREATE OR REPLACE FUNCTION find_module_by_slug(slug_param TEXT)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  description TEXT,
  vectors TEXT[],
  difficulty INTEGER,
  estimated_tokens INTEGER,
  requires_plan TEXT,
  purpose TEXT,
  input_schema JSONB,
  output_template TEXT,
  kpi JSONB,
  guardrails JSONB,
  sample_output TEXT,
  dependencies JSONB,
  legacy_slugs TEXT[],
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.name,
    m.description,
    m.vectors,
    m.difficulty,
    m.estimated_tokens,
    m.requires_plan,
    m.purpose,
    m.input_schema,
    m.output_template,
    m.kpi,
    m.guardrails,
    m.sample_output,
    m.dependencies,
    m.legacy_slugs,
    m.is_active,
    m.created_at,
    m.updated_at
  FROM modules m
  WHERE m.is_active = true
    AND (
      m.id = slug_param
      OR m.legacy_slugs @> ARRAY[slug_param]
    )
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Create view for module catalog with legacy slug support
CREATE OR REPLACE VIEW v_modules_catalog AS
SELECT 
  id,
  name,
  description,
  vectors,
  difficulty,
  estimated_tokens,
  requires_plan,
  purpose,
  input_schema,
  output_template,
  kpi,
  guardrails,
  sample_output,
  dependencies,
  legacy_slugs,
  is_active,
  created_at,
  updated_at,
  -- Generate current slug from module name
  LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '™', '', 'g'), '[^a-zA-Z0-9\s]', '', 'g')) AS current_slug
FROM modules
WHERE is_active = true;

-- Add RLS policy for legacy_slugs column
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- Create policy for legacy_slugs access (same as existing modules policy)
CREATE POLICY IF NOT EXISTS "Allow read access to legacy_slugs" ON modules
  FOR SELECT USING (true);

-- Update the updated_at timestamp for all modified modules
UPDATE modules SET updated_at = NOW() 
WHERE id IN (
  'M07', 'M10', 'M14', 'M15', 'M17', 'M18', 'M19', 'M20',
  'M24', 'M25', 'M26', 'M27', 'M29', 'M30',
  'M31', 'M33', 'M37', 'M39', 'M40',
  'M42', 'M43', 'M45', 'M49'
);

-- Verify the migration
DO $$
DECLARE
  module_count INTEGER;
  legacy_slugs_count INTEGER;
BEGIN
  -- Count modules with legacy_slugs
  SELECT COUNT(*) INTO module_count FROM modules WHERE legacy_slugs IS NOT NULL AND array_length(legacy_slugs, 1) > 0;
  
  -- Count total legacy slugs
  SELECT SUM(array_length(legacy_slugs, 1)) INTO legacy_slugs_count FROM modules WHERE legacy_slugs IS NOT NULL;
  
  RAISE NOTICE 'Migration completed successfully:';
  RAISE NOTICE '- Modules with legacy slugs: %', module_count;
  RAISE NOTICE '- Total legacy slugs: %', legacy_slugs_count;
  RAISE NOTICE '- Function find_module_by_slug created';
  RAISE NOTICE '- View v_modules_catalog updated';
END $$;
