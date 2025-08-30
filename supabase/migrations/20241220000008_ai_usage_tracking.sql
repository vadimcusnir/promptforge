-- AI Usage Tracking Migration
-- Creates tables for tracking AI costs, usage, and analytics

-- Create AI usage logs table
CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'anthropic')),
  model TEXT NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('generate', 'stream', 'analyze', 'tighten')),
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  cost DECIMAL(10, 6) NOT NULL DEFAULT 0,
  latency INTEGER NOT NULL DEFAULT 0, -- in milliseconds
  success BOOLEAN NOT NULL DEFAULT true,
  error TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_org_id ON ai_usage_logs(org_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_id ON ai_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_created_at ON ai_usage_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_provider ON ai_usage_logs(provider);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_model ON ai_usage_logs(model);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_operation ON ai_usage_logs(operation);

-- Create composite index for common queries
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_org_created ON ai_usage_logs(org_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_created ON ai_usage_logs(user_id, created_at);

-- Create AI cost analytics view
CREATE OR REPLACE VIEW ai_cost_analytics AS
SELECT 
  org_id,
  DATE_TRUNC('day', created_at) as date,
  provider,
  model,
  operation,
  COUNT(*) as request_count,
  SUM(total_tokens) as total_tokens,
  SUM(cost) as total_cost,
  AVG(latency) as avg_latency,
  AVG(CASE WHEN success THEN 1.0 ELSE 0.0 END) as success_rate
FROM ai_usage_logs
GROUP BY org_id, DATE_TRUNC('day', created_at), provider, model, operation;

-- Create daily usage summary view
CREATE OR REPLACE VIEW ai_daily_usage AS
SELECT 
  org_id,
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as total_requests,
  SUM(total_tokens) as total_tokens,
  SUM(cost) as total_cost,
  AVG(latency) as avg_latency,
  AVG(CASE WHEN success THEN 1.0 ELSE 0.0 END) as success_rate,
  COUNT(DISTINCT user_id) as active_users
FROM ai_usage_logs
GROUP BY org_id, DATE_TRUNC('day', created_at);

-- Create monthly usage summary view
CREATE OR REPLACE VIEW ai_monthly_usage AS
SELECT 
  org_id,
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as total_requests,
  SUM(total_tokens) as total_tokens,
  SUM(cost) as total_cost,
  AVG(latency) as avg_latency,
  AVG(CASE WHEN success THEN 1.0 ELSE 0.0 END) as success_rate,
  COUNT(DISTINCT user_id) as active_users,
  COUNT(DISTINCT DATE_TRUNC('day', created_at)) as active_days
FROM ai_usage_logs
GROUP BY org_id, DATE_TRUNC('month', created_at);

-- Create user usage summary view
CREATE OR REPLACE VIEW ai_user_usage AS
SELECT 
  user_id,
  org_id,
  COUNT(*) as total_requests,
  SUM(total_tokens) as total_tokens,
  SUM(cost) as total_cost,
  AVG(latency) as avg_latency,
  AVG(CASE WHEN success THEN 1.0 ELSE 0.0 END) as success_rate,
  MIN(created_at) as first_usage,
  MAX(created_at) as last_usage
FROM ai_usage_logs
GROUP BY user_id, org_id;

-- Create RLS policies
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Policy for organization members to view their org's usage
CREATE POLICY "Users can view their organization's AI usage" ON ai_usage_logs
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM organization_members 
      WHERE user_id = auth.uid()
    )
  );

-- Policy for users to view their own usage
CREATE POLICY "Users can view their own AI usage" ON ai_usage_logs
  FOR SELECT USING (user_id = auth.uid());

-- Policy for service role to insert usage logs
CREATE POLICY "Service role can insert AI usage logs" ON ai_usage_logs
  FOR INSERT WITH CHECK (true);

-- Policy for service role to update usage logs
CREATE POLICY "Service role can update AI usage logs" ON ai_usage_logs
  FOR UPDATE USING (true);

-- Create function to clean up old usage logs (keep 1 year)
CREATE OR REPLACE FUNCTION cleanup_old_ai_usage_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM ai_usage_logs 
  WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Create function to get usage stats for an organization
CREATE OR REPLACE FUNCTION get_org_ai_usage_stats(
  p_org_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  total_cost DECIMAL(10, 6),
  total_tokens BIGINT,
  total_requests BIGINT,
  avg_latency NUMERIC,
  success_rate NUMERIC,
  provider_breakdown JSONB,
  model_breakdown JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(cost), 0) as total_cost,
    COALESCE(SUM(total_tokens), 0) as total_tokens,
    COUNT(*) as total_requests,
    COALESCE(AVG(latency), 0) as avg_latency,
    COALESCE(AVG(CASE WHEN success THEN 1.0 ELSE 0.0 END) * 100, 0) as success_rate,
    COALESCE(
      jsonb_object_agg(
        provider, 
        jsonb_build_object(
          'cost', provider_cost,
          'tokens', provider_tokens,
          'requests', provider_requests
        )
      ), 
      '{}'::jsonb
    ) as provider_breakdown,
    COALESCE(
      jsonb_object_agg(
        model, 
        jsonb_build_object(
          'cost', model_cost,
          'tokens', model_tokens,
          'requests', model_requests
        )
      ), 
      '{}'::jsonb
    ) as model_breakdown
  FROM (
    SELECT 
      provider,
      model,
      SUM(cost) as provider_cost,
      SUM(total_tokens) as provider_tokens,
      COUNT(*) as provider_requests,
      SUM(cost) as model_cost,
      SUM(total_tokens) as model_tokens,
      COUNT(*) as model_requests
    FROM ai_usage_logs
    WHERE org_id = p_org_id
      AND created_at >= NOW() - (p_days || ' days')::INTERVAL
    GROUP BY provider, model
  ) stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user usage stats
CREATE OR REPLACE FUNCTION get_user_ai_usage_stats(
  p_user_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  total_cost DECIMAL(10, 6),
  total_tokens BIGINT,
  total_requests BIGINT,
  avg_latency NUMERIC,
  success_rate NUMERIC,
  recent_activity JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(cost), 0) as total_cost,
    COALESCE(SUM(total_tokens), 0) as total_tokens,
    COUNT(*) as total_requests,
    COALESCE(AVG(latency), 0) as avg_latency,
    COALESCE(AVG(CASE WHEN success THEN 1.0 ELSE 0.0 END) * 100, 0) as success_rate,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', id,
          'provider', provider,
          'model', model,
          'operation', operation,
          'cost', cost,
          'tokens', total_tokens,
          'latency', latency,
          'success', success,
          'created_at', created_at
        ) ORDER BY created_at DESC
      ) FILTER (WHERE id IS NOT NULL),
      '[]'::jsonb
    ) as recent_activity
  FROM (
    SELECT *
    FROM ai_usage_logs
    WHERE user_id = p_user_id
      AND created_at >= NOW() - (p_days || ' days')::INTERVAL
    ORDER BY created_at DESC
    LIMIT 10
  ) recent;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON ai_usage_logs TO authenticated;
GRANT SELECT ON ai_cost_analytics TO authenticated;
GRANT SELECT ON ai_daily_usage TO authenticated;
GRANT SELECT ON ai_monthly_usage TO authenticated;
GRANT SELECT ON ai_user_usage TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_org_ai_usage_stats(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_ai_usage_stats(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_ai_usage_logs() TO service_role;

-- Create trigger to automatically update total_tokens
CREATE OR REPLACE FUNCTION update_total_tokens()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_tokens = NEW.prompt_tokens + NEW.completion_tokens;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_total_tokens
  BEFORE INSERT OR UPDATE ON ai_usage_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_total_tokens();

-- Insert sample data for testing (optional)
-- INSERT INTO ai_usage_logs (org_id, user_id, provider, model, operation, prompt_tokens, completion_tokens, cost, latency, success)
-- VALUES 
--   ('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000', 'openai', 'gpt-4o', 'generate', 100, 200, 0.0015, 1500, true);

COMMENT ON TABLE ai_usage_logs IS 'Tracks AI usage, costs, and performance metrics';
COMMENT ON VIEW ai_cost_analytics IS 'Daily analytics for AI usage by organization, provider, model, and operation';
COMMENT ON VIEW ai_daily_usage IS 'Daily usage summary by organization';
COMMENT ON VIEW ai_monthly_usage IS 'Monthly usage summary by organization';
COMMENT ON VIEW ai_user_usage IS 'User usage summary by organization';
