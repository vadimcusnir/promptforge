-- Security: RLS policies and tamper-evident audit trail
-- This migration implements multi-tenant isolation and audit logging

-- Enable RLS on all tables with org_id
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- Create audit trail table with tamper-evident hashing
CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL, -- 'user', 'run', 'export', 'organization', etc.
  entity_id UUID,
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted', 'accessed', etc.
  record_json JSONB,
  prev_hash TEXT, -- SHA-256 of previous audit record
  hash TEXT NOT NULL, -- SHA-256 of current record
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audits table
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_audits_org_id ON audits(org_id);
CREATE INDEX IF NOT EXISTS idx_audits_entity ON audits(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at);
CREATE INDEX IF NOT EXISTS idx_audits_hash ON audits(hash);

-- RLS Policies for multi-tenant isolation

-- Runs table: users can only access runs from their organization
CREATE POLICY "runs_org_isolation" ON runs
  FOR ALL
  USING (org_id = current_setting('app.org_id')::uuid);

-- Exports table: users can only access exports from their organization
CREATE POLICY "exports_org_isolation" ON exports
  FOR ALL
  USING (org_id = current_setting('app.org_id')::uuid);

-- Telemetry events: users can only access telemetry from their organization
CREATE POLICY "telemetry_org_isolation" ON telemetry_events
  FOR ALL
  USING (org_id = current_setting('app.org_id')::uuid);

-- API keys: users can only access API keys from their organization
CREATE POLICY "api_keys_org_isolation" ON api_keys
  FOR ALL
  USING (org_id = current_setting('app.org_id')::uuid);

-- Memberships: users can only access memberships from their organization
CREATE POLICY "memberships_org_isolation" ON memberships
  FOR ALL
  USING (org_id = current_setting('app.org_id')::uuid);

-- Audits: users can only access audit records from their organization
CREATE POLICY "audits_org_isolation" ON audits
  FOR ALL
  USING (org_id = current_setting('app.org_id')::uuid);

-- Function to generate audit hash
CREATE OR REPLACE FUNCTION generate_audit_hash(
  p_org_id UUID,
  p_actor_id UUID,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_action TEXT,
  p_record_json JSONB,
  p_prev_hash TEXT,
  p_metadata JSONB
) RETURNS TEXT AS $$
DECLARE
  hash_input TEXT;
  new_hash TEXT;
BEGIN
  -- Create canonical string for hashing
  hash_input := concat(
    p_org_id::text,
    COALESCE(p_actor_id::text, ''),
    p_entity_type,
    COALESCE(p_entity_id::text, ''),
    p_action,
    COALESCE(p_record_json::text, '{}'),
    COALESCE(p_prev_hash, ''),
    COALESCE(p_metadata::text, '{}'),
    extract(epoch from now())::text
  );
  
  -- Generate SHA-256 hash
  new_hash := encode(digest(hash_input, 'sha256'), 'hex');
  
  RETURN new_hash;
END;
$$ LANGUAGE plpgsql;

-- Function to insert audit record with hash chain
CREATE OR REPLACE FUNCTION insert_audit_record(
  p_org_id UUID,
  p_actor_id UUID,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_action TEXT,
  p_record_json JSONB DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  prev_hash TEXT;
  new_hash TEXT;
  audit_id UUID;
BEGIN
  -- Get the hash of the most recent audit record for this org
  SELECT hash INTO prev_hash
  FROM audits
  WHERE org_id = p_org_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Generate new hash
  new_hash := generate_audit_hash(
    p_org_id,
    p_actor_id,
    p_entity_type,
    p_entity_id,
    p_action,
    p_record_json,
    prev_hash,
    p_metadata
  );
  
  -- Insert audit record
  INSERT INTO audits (
    org_id,
    actor_id,
    entity_type,
    entity_id,
    action,
    record_json,
    prev_hash,
    hash,
    metadata
  ) VALUES (
    p_org_id,
    p_actor_id,
    p_entity_type,
    p_entity_id,
    p_action,
    p_record_json,
    prev_hash,
    new_hash,
    p_metadata
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$ LANGUAGE plpgsql;

-- Function to verify audit chain integrity
CREATE OR REPLACE FUNCTION verify_audit_chain(p_org_id UUID)
RETURNS TABLE(
  record_id UUID,
  is_valid BOOLEAN,
  expected_hash TEXT,
  actual_hash TEXT
) AS $$
DECLARE
  rec RECORD;
  expected_hash TEXT;
  prev_hash TEXT := '';
BEGIN
  FOR rec IN 
    SELECT id, org_id, actor_id, entity_type, entity_id, action, 
           record_json, prev_hash, hash, metadata, created_at
    FROM audits
    WHERE org_id = p_org_id
    ORDER BY created_at ASC
  LOOP
    -- Calculate expected hash
    expected_hash := generate_audit_hash(
      rec.org_id,
      rec.actor_id,
      rec.entity_type,
      rec.entity_id,
      rec.action,
      rec.record_json,
      prev_hash,
      rec.metadata
    );
    
    -- Return verification result
    record_id := rec.id;
    is_valid := (expected_hash = rec.hash);
    expected_hash := expected_hash;
    actual_hash := rec.hash;
    
    RETURN NEXT;
    
    -- Update previous hash for next iteration
    prev_hash := rec.hash;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically create audit records

-- Audit trigger for runs table
CREATE OR REPLACE FUNCTION audit_runs_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM insert_audit_record(
      NEW.org_id,
      NEW.user_id,
      'run',
      NEW.id,
      'created',
      to_jsonb(NEW),
      jsonb_build_object('trigger', 'runs_insert')
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM insert_audit_record(
      NEW.org_id,
      NEW.user_id,
      'run',
      NEW.id,
      'updated',
      jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)),
      jsonb_build_object('trigger', 'runs_update')
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM insert_audit_record(
      OLD.org_id,
      OLD.user_id,
      'run',
      OLD.id,
      'deleted',
      to_jsonb(OLD),
      jsonb_build_object('trigger', 'runs_delete')
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_runs_trigger
  AFTER INSERT OR UPDATE OR DELETE ON runs
  FOR EACH ROW EXECUTE FUNCTION audit_runs_trigger();

-- Audit trigger for exports table
CREATE OR REPLACE FUNCTION audit_exports_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM insert_audit_record(
      NEW.org_id,
      NEW.user_id,
      'export',
      NEW.id,
      'created',
      to_jsonb(NEW),
      jsonb_build_object('trigger', 'exports_insert')
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM insert_audit_record(
      NEW.org_id,
      NEW.user_id,
      'export',
      NEW.id,
      'updated',
      jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)),
      jsonb_build_object('trigger', 'exports_update')
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM insert_audit_record(
      OLD.org_id,
      OLD.user_id,
      'export',
      OLD.id,
      'deleted',
      to_jsonb(OLD),
      jsonb_build_object('trigger', 'exports_delete')
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_exports_trigger
  AFTER INSERT OR UPDATE OR DELETE ON exports
  FOR EACH ROW EXECUTE FUNCTION audit_exports_trigger();

-- Function to set organization context for RLS
CREATE OR REPLACE FUNCTION set_org_context(p_org_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.org_id', p_org_id::text, true);
END;
$$ LANGUAGE plpgsql;

-- Function to get current organization context
CREATE OR REPLACE FUNCTION get_org_context()
RETURNS UUID AS $$
BEGIN
  RETURN current_setting('app.org_id')::uuid;
END;
$$ LANGUAGE plpgsql;

-- Create view for audit summary
CREATE OR REPLACE VIEW audit_summary AS
SELECT 
  org_id,
  entity_type,
  action,
  COUNT(*) as event_count,
  MIN(created_at) as first_event,
  MAX(created_at) as last_event
FROM audits
GROUP BY org_id, entity_type, action
ORDER BY org_id, entity_type, action;

-- Grant necessary permissions
GRANT SELECT ON audit_summary TO authenticated;
GRANT EXECUTE ON FUNCTION insert_audit_record TO authenticated;
GRANT EXECUTE ON FUNCTION verify_audit_chain TO authenticated;
GRANT EXECUTE ON FUNCTION set_org_context TO authenticated;
GRANT EXECUTE ON FUNCTION get_org_context TO authenticated;

-- Create retention policy for audit records (18 months)
CREATE OR REPLACE FUNCTION cleanup_old_audits()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM audits 
  WHERE created_at < NOW() - INTERVAL '18 months';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup job (this would be configured in your cron system)
-- SELECT cron.schedule('cleanup-audits', '0 2 * * 0', 'SELECT cleanup_old_audits();');
