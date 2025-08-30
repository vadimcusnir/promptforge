-- AI Cache Migration
-- Creates tables for caching AI responses and improving performance

-- Create AI cache table
CREATE TABLE IF NOT EXISTS ai_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  prompt TEXT NOT NULL,
  model TEXT NOT NULL,
  temperature DECIMAL(3,2) NOT NULL,
  max_tokens INTEGER NOT NULL,
  system_prompt TEXT,
  response TEXT NOT NULL,
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  latency INTEGER NOT NULL DEFAULT 0, -- in milliseconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  hit_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_cache_key ON ai_cache(key);
CREATE INDEX IF NOT EXISTS idx_ai_cache_expires_at ON ai_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_ai_cache_model ON ai_cache(model);
CREATE INDEX IF NOT EXISTS idx_ai_cache_created_at ON ai_cache(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_cache_hit_count ON ai_cache(hit_count);
CREATE INDEX IF NOT EXISTS idx_ai_cache_last_accessed ON ai_cache(last_accessed);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_ai_cache_expires_created ON ai_cache(expires_at, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_cache_model_hits ON ai_cache(model, hit_count);

-- Create cache analytics view
CREATE OR REPLACE VIEW ai_cache_analytics AS
SELECT 
  model,
  COUNT(*) as total_entries,
  SUM(hit_count) as total_hits,
  AVG(hit_count) as avg_hits_per_entry,
  SUM(total_tokens * hit_count) as total_tokens_saved,
  AVG(latency) as avg_latency,
  MIN(created_at) as first_entry,
  MAX(last_accessed) as last_access
FROM ai_cache
GROUP BY model;

-- Create daily cache usage view
CREATE OR REPLACE VIEW ai_cache_daily_usage AS
SELECT 
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as new_entries,
  SUM(hit_count) as total_hits,
  SUM(total_tokens * hit_count) as tokens_saved,
  AVG(latency) as avg_latency
FROM ai_cache
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Create top cached prompts view
CREATE OR REPLACE VIEW ai_cache_top_prompts AS
SELECT 
  LEFT(prompt, 100) as prompt_preview,
  model,
  hit_count,
  total_tokens * hit_count as tokens_saved,
  created_at,
  last_accessed
FROM ai_cache
WHERE hit_count > 0
ORDER BY hit_count DESC
LIMIT 100;

-- Create cache performance view
CREATE OR REPLACE VIEW ai_cache_performance AS
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) as cache_entries,
  SUM(hit_count) as cache_hits,
  AVG(latency) as avg_latency,
  SUM(total_tokens * hit_count) as tokens_saved
FROM ai_cache
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE_TRUNC('hour', created_at)
ORDER BY hour DESC;

-- Create function to clean up expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_ai_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM ai_cache 
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get cache hit rate
CREATE OR REPLACE FUNCTION get_cache_hit_rate(p_days INTEGER DEFAULT 7)
RETURNS TABLE (
  total_entries BIGINT,
  total_hits BIGINT,
  hit_rate NUMERIC,
  tokens_saved BIGINT,
  avg_latency NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_entries,
    COALESCE(SUM(hit_count), 0) as total_hits,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        COALESCE(SUM(hit_count), 0)::NUMERIC / COUNT(*)::NUMERIC * 100
      ELSE 0
    END as hit_rate,
    COALESCE(SUM(total_tokens * hit_count), 0) as tokens_saved,
    COALESCE(AVG(latency), 0) as avg_latency
  FROM ai_cache
  WHERE created_at >= NOW() - (p_days || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;

-- Create function to get cache statistics
CREATE OR REPLACE FUNCTION get_cache_stats()
RETURNS TABLE (
  total_entries BIGINT,
  total_hits BIGINT,
  hit_rate NUMERIC,
  tokens_saved BIGINT,
  avg_latency NUMERIC,
  top_models JSONB,
  top_prompts JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_entries,
    COALESCE(SUM(hit_count), 0) as total_hits,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        COALESCE(SUM(hit_count), 0)::NUMERIC / COUNT(*)::NUMERIC * 100
      ELSE 0
    END as hit_rate,
    COALESCE(SUM(total_tokens * hit_count), 0) as tokens_saved,
    COALESCE(AVG(latency), 0) as avg_latency,
    COALESCE(
      jsonb_object_agg(
        model, 
        jsonb_build_object(
          'entries', model_entries,
          'hits', model_hits,
          'tokens_saved', model_tokens_saved
        )
      ) FILTER (WHERE model IS NOT NULL),
      '{}'::jsonb
    ) as top_models,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'prompt', LEFT(prompt, 100),
          'hits', hit_count,
          'tokens_saved', total_tokens * hit_count
        ) ORDER BY hit_count DESC
      ) FILTER (WHERE hit_count > 0),
      '[]'::jsonb
    ) as top_prompts
  FROM (
    SELECT 
      model,
      COUNT(*) as model_entries,
      SUM(hit_count) as model_hits,
      SUM(total_tokens * hit_count) as model_tokens_saved,
      prompt,
      hit_count,
      total_tokens
    FROM ai_cache
    GROUP BY model, prompt, hit_count, total_tokens
  ) stats;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update total_tokens
CREATE OR REPLACE FUNCTION update_ai_cache_total_tokens()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_tokens = NEW.prompt_tokens + NEW.completion_tokens;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ai_cache_total_tokens
  BEFORE INSERT OR UPDATE ON ai_cache
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_cache_total_tokens();

-- Create trigger to update last_accessed on hit
CREATE OR REPLACE FUNCTION update_ai_cache_last_accessed()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_accessed = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ai_cache_last_accessed
  BEFORE UPDATE ON ai_cache
  FOR EACH ROW
  WHEN (NEW.hit_count > OLD.hit_count)
  EXECUTE FUNCTION update_ai_cache_last_accessed();

-- Grant permissions
GRANT SELECT ON ai_cache TO authenticated;
GRANT SELECT ON ai_cache_analytics TO authenticated;
GRANT SELECT ON ai_cache_daily_usage TO authenticated;
GRANT SELECT ON ai_cache_top_prompts TO authenticated;
GRANT SELECT ON ai_cache_performance TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_cache_hit_rate(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_cache_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_ai_cache() TO service_role;

-- Create RLS policies
ALTER TABLE ai_cache ENABLE ROW LEVEL SECURITY;

-- Policy for service role to manage cache
CREATE POLICY "Service role can manage AI cache" ON ai_cache
  FOR ALL USING (true);

-- Policy for authenticated users to read cache (for analytics)
CREATE POLICY "Authenticated users can read AI cache" ON ai_cache
  FOR SELECT USING (true);

-- Insert sample data for testing (optional)
-- INSERT INTO ai_cache (key, prompt, model, temperature, max_tokens, response, prompt_tokens, completion_tokens, latency, expires_at)
-- VALUES 
--   ('test-key-1', 'What is artificial intelligence?', 'gpt-4o', 0.7, 500, 'AI is...', 10, 50, 1200, NOW() + INTERVAL '1 hour');

COMMENT ON TABLE ai_cache IS 'Caches AI responses to improve performance and reduce costs';
COMMENT ON VIEW ai_cache_analytics IS 'Analytics for AI cache performance by model';
COMMENT ON VIEW ai_cache_daily_usage IS 'Daily cache usage statistics';
COMMENT ON VIEW ai_cache_top_prompts IS 'Most frequently cached prompts';
COMMENT ON VIEW ai_cache_performance IS 'Hourly cache performance metrics';
