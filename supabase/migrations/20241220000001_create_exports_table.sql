-- Create exports table for PromptForge v3 export pipeline
-- Migration: [PHONE_REDACTED]0001_create_exports_table.sql

CREATE TABLE IF NOT EXISTS exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  run_id UUID REFERENCES prompt_runs(id) ON DELETE SET NULL,
  module_id TEXT,
  formats TEXT[] NOT NULL DEFAULT '{}',
  score INTEGER CHECK (score >= 0 AND score <= 100),
  watermark BOOLEAN DEFAULT false,
  bundle_path TEXT NOT NULL,
  checksum TEXT NOT NULL,
  manifest JSONB NOT NULL,
  file_size_bytes BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_exports_org_id ON exports(org_id);
CREATE INDEX IF NOT EXISTS idx_exports_user_id ON exports(user_id);
CREATE INDEX IF NOT EXISTS idx_exports_run_id ON exports(run_id);
CREATE INDEX IF NOT EXISTS idx_exports_module_id ON exports(module_id);
CREATE INDEX IF NOT EXISTS idx_exports_created_at ON exports(created_at);
CREATE INDEX IF NOT EXISTS idx_exports_score ON exports(score);
CREATE INDEX IF NOT EXISTS idx_exports_checksum ON exports(checksum);

-- RLS policies for data privacy
ALTER TABLE exports ENABLE ROW LEVEL SECURITY;

-- Users can view their own exports
CREATE POLICY "Users can view their own exports" ON exports
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can create exports for their organization
CREATE POLICY "Users can create exports for their org" ON exports
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM organizations 
      WHERE id = org_id 
      AND auth.uid()::text = ANY(users)
    )
  );

-- Service role can manage all exports
CREATE POLICY "Service role can manage all exports" ON exports
  FOR ALL USING (true);

-- Add comments for documentation
COMMENT ON TABLE exports IS 'Stores export records and bundle metadata for compliance tracking';
COMMENT ON COLUMN exports.run_id IS 'Reference to the prompt run that generated this export';
COMMENT ON COLUMN exports.module_id IS 'Module identifier (e.g., M01, M10)';
COMMENT ON COLUMN exports.formats IS 'Array of export formats generated (txt, md, json, pdf, zip)';
COMMENT ON COLUMN exports.score IS 'Quality score (0-100) - must be ≥80 for export';
COMMENT ON COLUMN exports.watermark IS 'Whether watermark was applied (trial users)';
COMMENT ON COLUMN exports.bundle_path IS 'File system path to the export bundle';
COMMENT ON COLUMN exports.checksum IS 'SHA256 checksum for bundle integrity verification';
COMMENT ON COLUMN exports.manifest IS 'Complete export manifest with metadata and compliance info';
COMMENT ON COLUMN exports.file_size_bytes IS 'Total size of all exported files in bytes';

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_exports_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_exports_updated_at
  BEFORE UPDATE ON exports
  FOR EACH ROW
  EXECUTE FUNCTION update_exports_updated_at();

-- Create view for export analytics
CREATE OR REPLACE VIEW export_analytics AS
SELECT 
  e.id,
  e.org_id,
  e.user_id,
  e.module_id,
  e.formats,
  e.score,
  e.watermark,
  e.file_size_bytes,
  e.created_at,
  o.name as org_name,
  u.email as user_email,
  CASE 
    WHEN e.score >= 80 THEN 'high_quality'
    WHEN e.score >= 60 THEN 'medium_quality'
    ELSE 'low_quality'
  END as quality_tier,
  array_length(e.formats, 1) as format_count,
  e.file_size_bytes / 1024.0 as size_kb
FROM exports e
JOIN organizations o ON e.org_id = o.id
JOIN users u ON e.user_id = u.id;

-- Grant permissions
GRANT SELECT ON export_analytics TO authenticated;
GRANT ALL ON exports TO service_role;
