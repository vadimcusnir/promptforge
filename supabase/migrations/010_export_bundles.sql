-- PromptForge Database Migration 010
-- Export Bundle System - Additional tables and constraints
-- Ensures proper bundle export functionality

-- Update bundles table to match export requirements
ALTER TABLE bundles 
  DROP CONSTRAINT IF EXISTS bundles_formats_valid,
  DROP CONSTRAINT IF EXISTS bundles_checksum_format;

-- Add proper constraints for export bundle system
ALTER TABLE bundles 
  ADD CONSTRAINT bundles_formats_valid CHECK (
    array_length(formats, 1) > 0 AND
    formats <@ ARRAY['txt', 'md', 'json', 'pdf', 'zip', 'xml']
  ),
  ADD CONSTRAINT bundles_checksum_format CHECK (
    checksum ~ '^sha256:[0-9a-f]{64}$'
  );

-- Add module_id column if not exists (for bundle metadata)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bundles' AND column_name = 'module_id'
  ) THEN
    ALTER TABLE bundles ADD COLUMN module_id TEXT;
  END IF;
END $$;

-- Add domain column if not exists (for bundle organization)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bundles' AND column_name = 'domain'
  ) THEN
    ALTER TABLE bundles ADD COLUMN domain TEXT;
  END IF;
END $$;

-- Add signature_7d column if not exists (for run identification)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bundles' AND column_name = 'signature_7d'
  ) THEN
    ALTER TABLE bundles ADD COLUMN signature_7d TEXT;
  END IF;
END $$;

-- Create export_telemetry table for tracking export events
CREATE TABLE IF NOT EXISTS export_telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL CHECK (event_type IN ('export.started', 'export.finished', 'export.failed')),
  trace_id UUID NOT NULL,
  run_id UUID REFERENCES runs(id) ON DELETE CASCADE,
  bundle_id UUID REFERENCES bundles(id) ON DELETE CASCADE,
  org_id UUID REFERENCES orgs(id) ON DELETE CASCADE,
  user_id UUID,
  plan TEXT CHECK (plan IN ('pilot', 'pro', 'enterprise')),
  formats TEXT[],
  duration_ms INTEGER,
  bytes_total BIGINT,
  error_code TEXT,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indices for export_telemetry
CREATE INDEX IF NOT EXISTS export_telemetry_event_type_idx ON export_telemetry (event_type);
CREATE INDEX IF NOT EXISTS export_telemetry_trace_id_idx ON export_telemetry (trace_id);
CREATE INDEX IF NOT EXISTS export_telemetry_run_id_idx ON export_telemetry (run_id);
CREATE INDEX IF NOT EXISTS export_telemetry_org_id_created_at_idx ON export_telemetry (org_id, created_at DESC);
CREATE INDEX IF NOT EXISTS export_telemetry_created_at_idx ON export_telemetry (created_at DESC);

-- Function to get export statistics for an organization
CREATE OR REPLACE FUNCTION get_org_export_stats(
  org_uuid UUID,
  days_back INTEGER DEFAULT 30
) RETURNS TABLE (
  total_exports BIGINT,
  successful_exports BIGINT,
  failed_exports BIGINT,
  avg_duration_ms NUMERIC,
  total_bytes BIGINT,
  formats_breakdown JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH export_events AS (
    SELECT 
      et.event_type,
      et.duration_ms,
      et.bytes_total,
      et.formats
    FROM export_telemetry et
    WHERE 
      et.org_id = org_uuid 
      AND et.created_at >= NOW() - (days_back || ' days')::INTERVAL
      AND et.event_type IN ('export.finished', 'export.failed')
  ),
  format_counts AS (
    SELECT 
      unnest(formats) as format,
      COUNT(*) as count
    FROM export_events
    WHERE event_type = 'export.finished'
    GROUP BY unnest(formats)
  )
  SELECT 
    COUNT(*) as total_exports,
    COUNT(*) FILTER (WHERE event_type = 'export.finished') as successful_exports,
    COUNT(*) FILTER (WHERE event_type = 'export.failed') as failed_exports,
    ROUND(AVG(duration_ms), 2) as avg_duration_ms,
    COALESCE(SUM(bytes_total), 0) as total_bytes,
    COALESCE(
      jsonb_object_agg(fc.format, fc.count),
      '{}'::jsonb
    ) as formats_breakdown
  FROM export_events ee
  LEFT JOIN format_counts fc ON TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate bundle before export
CREATE OR REPLACE FUNCTION validate_export_eligibility(
  run_uuid UUID,
  required_score INTEGER DEFAULT 80
) RETURNS TABLE (
  eligible BOOLEAN,
  reason TEXT,
  current_score INTEGER,
  run_status TEXT
) AS $$
DECLARE
  run_record runs;
  score_record prompt_scores;
BEGIN
  -- Get run information
  SELECT * INTO run_record FROM runs WHERE id = run_uuid;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 'Run not found', NULL::INTEGER, NULL::TEXT;
    RETURN;
  END IF;
  
  -- Get score information
  SELECT * INTO score_record FROM prompt_scores WHERE run_id = run_uuid;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 'Run not scored', NULL::INTEGER, run_record.status::TEXT;
    RETURN;
  END IF;
  
  -- Check eligibility
  IF run_record.status != 'success' THEN
    RETURN QUERY SELECT FALSE, 'Run not successful', score_record.overall_score, run_record.status::TEXT;
    RETURN;
  END IF;
  
  IF score_record.overall_score < required_score THEN
    RETURN QUERY SELECT FALSE, 'Score below threshold', score_record.overall_score, run_record.status::TEXT;
    RETURN;
  END IF;
  
  RETURN QUERY SELECT TRUE, 'Eligible for export', score_record.overall_score, run_record.status::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on export_telemetry
ALTER TABLE export_telemetry ENABLE ROW LEVEL SECURITY;

-- RLS Policy for export_telemetry
-- Members can see their org's export telemetry
CREATE POLICY "export_telemetry_member_select" ON export_telemetry
  FOR SELECT TO authenticated
  USING (is_org_member(org_id, get_current_user_id()));

-- Service role manages export telemetry
CREATE POLICY "export_telemetry_service_write" ON export_telemetry
  FOR ALL TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- Create Storage bucket for bundles if not exists
-- Note: This would typically be done via Supabase dashboard or CLI
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES ('bundles', 'bundles', false, 104857600, ARRAY['text/plain', 'text/markdown', 'application/json', 'application/pdf', 'application/zip'])
-- ON CONFLICT (id) DO NOTHING;

-- Storage policies for bundles bucket would be:
-- CREATE POLICY "Bundle uploads for service role" ON storage.objects
-- FOR INSERT TO service_role WITH CHECK (bucket_id = 'bundles');
-- 
-- CREATE POLICY "Bundle downloads for authenticated users" ON storage.objects
-- FOR SELECT TO authenticated USING (bucket_id = 'bundles');

-- Migration completed
SELECT 'Migration 010 completed: Export Bundle System' as status;
