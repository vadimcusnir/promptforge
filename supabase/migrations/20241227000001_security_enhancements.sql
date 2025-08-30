-- Security Enhancements Migration
-- Multi-Factor Authentication, Session Monitoring, Anomaly Detection, Device Fingerprinting

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User MFA table
CREATE TABLE user_mfa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References auth.users from Supabase
    secret TEXT NOT NULL,
    backup_codes TEXT[] NOT NULL DEFAULT '{}',
    is_enabled BOOLEAN DEFAULT false,
    last_used TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- User sessions table (enhanced)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References auth.users from Supabase
    session_id TEXT NOT NULL UNIQUE,
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    location JSONB,
    device_info JSONB,
    is_active BOOLEAN DEFAULT true,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- User behavior profiles table
CREATE TABLE user_behavior_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE, -- References auth.users from Supabase
    common_locations TEXT[] DEFAULT '{}',
    common_devices TEXT[] DEFAULT '{}',
    common_user_agents TEXT[] DEFAULT '{}',
    login_times INTEGER[] DEFAULT '{}', -- Hours of day (0-23)
    login_days INTEGER[] DEFAULT '{}', -- Days of week (0-6)
    average_session_duration INTEGER DEFAULT 0, -- in minutes
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Device fingerprints table
CREATE TABLE device_fingerprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References auth.users from Supabase
    fingerprint_hash TEXT NOT NULL,
    components JSONB NOT NULL,
    location JSONB,
    is_trusted BOOLEAN DEFAULT false,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, fingerprint_hash)
);

-- Anomaly events table
CREATE TABLE anomaly_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References auth.users from Supabase
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
        'login_anomaly', 'location_anomaly', 'device_anomaly', 
        'behavior_anomaly', 'rate_anomaly'
    )),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    location JSONB,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MFA attempts table
CREATE TABLE mfa_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References auth.users from Supabase
    method VARCHAR(20) NOT NULL CHECK (method IN ('totp', 'backup_code', 'sms', 'email')),
    success BOOLEAN NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security events table (enhanced)
CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- References auth.users from Supabase (nullable for system events)
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
        'threat_detected', 'rate_limit_exceeded', 'injection_attempt', 
        'honeypot_accessed', 'suspicious_activity', 'mfa_failure',
        'anomaly_detected', 'device_fingerprint_mismatch'
    )),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    fingerprint TEXT,
    ip_address INET,
    user_agent TEXT,
    pathname TEXT,
    method VARCHAR(10),
    details JSONB DEFAULT '{}',
    blocked BOOLEAN DEFAULT false,
    response_code INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_user_mfa_user_id ON user_mfa(user_id);
CREATE INDEX idx_user_mfa_enabled ON user_mfa(is_enabled);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_last_activity ON user_sessions(last_activity);

CREATE INDEX idx_user_behavior_profiles_user_id ON user_behavior_profiles(user_id);
CREATE INDEX idx_user_behavior_profiles_updated ON user_behavior_profiles(last_updated);

CREATE INDEX idx_device_fingerprints_user_id ON device_fingerprints(user_id);
CREATE INDEX idx_device_fingerprints_hash ON device_fingerprints(fingerprint_hash);
CREATE INDEX idx_device_fingerprints_trusted ON device_fingerprints(is_trusted);
CREATE INDEX idx_device_fingerprints_last_seen ON device_fingerprints(last_seen);

CREATE INDEX idx_anomaly_events_user_id ON anomaly_events(user_id);
CREATE INDEX idx_anomaly_events_type ON anomaly_events(event_type);
CREATE INDEX idx_anomaly_events_severity ON anomaly_events(severity);
CREATE INDEX idx_anomaly_events_resolved ON anomaly_events(is_resolved);
CREATE INDEX idx_anomaly_events_created_at ON anomaly_events(created_at);

CREATE INDEX idx_mfa_attempts_user_id ON mfa_attempts(user_id);
CREATE INDEX idx_mfa_attempts_method ON mfa_attempts(method);
CREATE INDEX idx_mfa_attempts_success ON mfa_attempts(success);
CREATE INDEX idx_mfa_attempts_created_at ON mfa_attempts(created_at);

CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_type ON security_events(event_type);
CREATE INDEX idx_security_events_severity ON security_events(severity);
CREATE INDEX idx_security_events_created_at ON security_events(created_at);
CREATE INDEX idx_security_events_fingerprint ON security_events(fingerprint);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_user_mfa_updated_at 
    BEFORE UPDATE ON user_mfa 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE user_mfa ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behavior_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomaly_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_mfa
CREATE POLICY "Users can view their own MFA settings" ON user_mfa
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own MFA settings" ON user_mfa
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "System can manage MFA settings" ON user_mfa
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for user_sessions
CREATE POLICY "Users can view their own sessions" ON user_sessions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own sessions" ON user_sessions
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "System can manage all sessions" ON user_sessions
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for user_behavior_profiles
CREATE POLICY "Users can view their own behavior profile" ON user_behavior_profiles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage behavior profiles" ON user_behavior_profiles
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for device_fingerprints
CREATE POLICY "Users can view their own device fingerprints" ON device_fingerprints
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage device fingerprints" ON device_fingerprints
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for anomaly_events
CREATE POLICY "Users can view their own anomaly events" ON anomaly_events
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage anomaly events" ON anomaly_events
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for mfa_attempts
CREATE POLICY "Users can view their own MFA attempts" ON mfa_attempts
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage MFA attempts" ON mfa_attempts
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for security_events
CREATE POLICY "Users can view their own security events" ON security_events
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage all security events" ON security_events
    FOR ALL USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_mfa, user_sessions, user_behavior_profiles, device_fingerprints, anomaly_events, mfa_attempts, security_events TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create functions for security monitoring

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    UPDATE user_sessions 
    SET is_active = false 
    WHERE expires_at < NOW() AND is_active = true;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user security summary
CREATE OR REPLACE FUNCTION get_user_security_summary(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'mfa_enabled', COALESCE(mfa.is_enabled, false),
        'active_sessions', COALESCE(session_count.count, 0),
        'recent_anomalies', COALESCE(anomaly_count.count, 0),
        'trusted_devices', COALESCE(device_count.count, 0),
        'last_security_event', security_events.created_at
    ) INTO result
    FROM (
        SELECT is_enabled FROM user_mfa WHERE user_id = user_uuid
    ) mfa
    CROSS JOIN (
        SELECT COUNT(*) as count FROM user_sessions 
        WHERE user_id = user_uuid AND is_active = true AND expires_at > NOW()
    ) session_count
    CROSS JOIN (
        SELECT COUNT(*) as count FROM anomaly_events 
        WHERE user_id = user_uuid AND created_at > NOW() - INTERVAL '7 days'
    ) anomaly_count
    CROSS JOIN (
        SELECT COUNT(*) as count FROM device_fingerprints 
        WHERE user_id = user_uuid AND is_trusted = true
    ) device_count
    LEFT JOIN security_events ON security_events.user_id = user_uuid
    ORDER BY security_events.created_at DESC
    LIMIT 1;
    
    RETURN COALESCE(result, '{}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION cleanup_expired_sessions() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_security_summary(UUID) TO authenticated;

-- Create a scheduled job to clean up expired sessions (if pg_cron is available)
-- SELECT cron.schedule('cleanup-expired-sessions', '0 * * * *', 'SELECT cleanup_expired_sessions();');

-- Insert initial security configuration
INSERT INTO security_events (event_type, severity, description, details, created_at) VALUES
('threat_detected', 'low', 'Security enhancements migration completed', 
 '{"migration": "20241227000001_security_enhancements", "features": ["mfa", "session_monitoring", "anomaly_detection", "device_fingerprinting"]}', 
 NOW())
ON CONFLICT DO NOTHING;
