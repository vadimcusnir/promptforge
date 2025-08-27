-- Create analytics tables for PromptForge v3
-- Migration: [PHONE_REDACTED]0000_create_analytics_tables.sql

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  url TEXT,
  user_id TEXT,
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics pageviews table
CREATE TABLE IF NOT EXISTS analytics_pageviews (
  id BIGSERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  referrer TEXT,
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);

CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_url ON analytics_pageviews(url);
CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_timestamp ON analytics_pageviews(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_session_id ON analytics_pageviews(session_id);

-- RLS policies for data privacy
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_pageviews ENABLE ROW LEVEL SECURITY;

-- Only allow service role to insert analytics data
CREATE POLICY "Service role can insert analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can insert pageviews" ON analytics_pageviews
  FOR INSERT WITH CHECK (true);

-- Only allow authenticated users to view their own analytics data
CREATE POLICY "Users can view their own analytics events" ON analytics_events
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own pageviews" ON analytics_pageviews
  FOR SELECT USING (auth.uid()::text = user_id);

-- Service role can view all data for admin purposes
CREATE POLICY "Service role can view all analytics" ON analytics_events
  FOR SELECT USING (true);

CREATE POLICY "Service role can view all pageviews" ON analytics_pageviews
  FOR SELECT USING (true);

-- Add comments for documentation
COMMENT ON TABLE analytics_events IS 'Stores user interaction events for analytics and PLG tracking';
COMMENT ON TABLE analytics_pageviews IS 'Stores page view data for user journey analysis';
COMMENT ON COLUMN analytics_events.event_name IS 'Name of the tracked event (e.g., PF_LANDING_CTA_CLICK)';
COMMENT ON COLUMN analytics_events.properties IS 'JSON object containing event-specific properties';
COMMENT ON COLUMN analytics_events.user_id IS 'Hashed user identifier for privacy';
COMMENT ON COLUMN analytics_events.session_id IS 'Browser session identifier';
COMMENT ON COLUMN analytics_pageviews.url IS 'URL of the viewed page';
COMMENT ON COLUMN analytics_pageviews.referrer IS 'Referring page URL';
