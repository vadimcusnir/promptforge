-- Migration: Security Enhancements
-- Implements session management, MFA, device fingerprinting, and security monitoring

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- SESSION MANAGEMENT
-- ============================================================================

-- User sessions table for tracking active sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    device_fingerprint TEXT,
    ip_address INET,
    user_agent TEXT,
    location_data JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session activity log
CREATE TABLE IF NOT EXISTS session_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES user_sessions(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MULTI-FACTOR AUTHENTICATION
-- ============================================================================

-- MFA settings for users
CREATE TABLE IF NOT EXISTS user_mfa (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    totp_secret TEXT,
    totp_enabled BOOLEAN DEFAULT false,
    backup_codes TEXT[] DEFAULT '{}',
    sms_phone TEXT,
    sms_enabled BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- MFA verification attempts
CREATE TABLE IF NOT EXISTS mfa_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
    method TEXT NOT NULL CHECK (method IN ('totp', 'sms', 'email', 'backup_code')),
    success BOOLEAN NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECURITY MONITORING
-- ============================================================================

-- Security events and anomalies
CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL CHECK (event_type IN (
        'login_success', 'login_failed', 'logout', 'password_reset',
        'mfa_success', 'mfa_failed', 'suspicious_activity', 'account_locked',
        'device_change', 'location_change', 'concurrent_session', 'token_expired'
    )),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    location_data JSONB DEFAULT '{}',
    resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Device fingerprinting
CREATE TABLE IF NOT EXISTS device_fingerprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    fingerprint_hash TEXT NOT NULL,
    device_info JSONB NOT NULL,
    is_trusted BOOLEAN DEFAULT false,
    first_seen TIMESTAMPTZ DEFAULT NOW(),
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, fingerprint_hash)
);

-- Rate limiting and brute force protection
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier TEXT NOT NULL, -- IP, user_id, or email
    action TEXT NOT NULL, -- login, password_reset, mfa, etc.
    attempt_count INTEGER DEFAULT 1,
    window_start TIMESTAMPTZ DEFAULT NOW(),
    blocked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(identifier, action, window_start)
);

-- ============================================================================
-- CSRF PROTECTION
-- ============================================================================

-- CSRF tokens for state-changing operations
CREATE TABLE IF NOT EXISTS csrf_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Session indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- Activity indexes
CREATE INDEX IF NOT EXISTS idx_session_activity_session_id ON session_activity(session_id);
CREATE INDEX IF NOT EXISTS idx_session_activity_created_at ON session_activity(created_at DESC);

-- MFA indexes
CREATE INDEX IF NOT EXISTS idx_user_mfa_user_id ON user_mfa(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_attempts_user_id ON mfa_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_attempts_created_at ON mfa_attempts(created_at DESC);

-- Security event indexes
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_resolved ON security_events(resolved);

-- Device fingerprint indexes
CREATE INDEX IF NOT EXISTS idx_device_fingerprints_user_id ON device_fingerprints(user_id);
CREATE INDEX IF NOT EXISTS idx_device_fingerprints_hash ON device_fingerprints(fingerprint_hash);
CREATE INDEX IF NOT EXISTS idx_device_fingerprints_trusted ON device_fingerprints(is_trusted);

-- Rate limit indexes
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier);
CREATE INDEX IF NOT EXISTS idx_rate_limits_action ON rate_limits(action);
CREATE INDEX IF NOT EXISTS idx_rate_limits_blocked ON rate_limits(blocked_until);

-- CSRF token indexes
CREATE INDEX IF NOT EXISTS idx_csrf_tokens_user_id ON csrf_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_csrf_tokens_hash ON csrf_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_csrf_tokens_expires ON csrf_tokens(expires_at);

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language plpgsql;

-- Apply update triggers
CREATE TRIGGER update_user_sessions_updated_at 
    BEFORE UPDATE ON user_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_mfa_updated_at 
    BEFORE UPDATE ON user_mfa 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rate_limits_updated_at 
    BEFORE UPDATE ON rate_limits 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_sessions 
    WHERE expires_at < NOW() OR (last_activity < NOW() - INTERVAL '30 days');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Also clean up expired CSRF tokens
    DELETE FROM csrf_tokens WHERE expires_at < NOW();
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to check rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_identifier TEXT,
    p_action TEXT,
    p_max_attempts INTEGER DEFAULT 5,
    p_window_minutes INTEGER DEFAULT 15
)
RETURNS BOOLEAN AS $$
DECLARE
    current_window TIMESTAMPTZ;
    attempt_count INTEGER;
    blocked_until TIMESTAMPTZ;
BEGIN
    -- Get current window start
    current_window := date_trunc('minute', NOW()) - 
                     (EXTRACT(minute FROM NOW())::INTEGER % p_window_minutes) * INTERVAL '1 minute';
    
    -- Check if currently blocked
    SELECT blocked_until INTO blocked_until
    FROM rate_limits 
    WHERE identifier = p_identifier 
      AND action = p_action 
      AND window_start = current_window;
    
    IF blocked_until IS NOT NULL AND blocked_until > NOW() THEN
        RETURN FALSE; -- Still blocked
    END IF;
    
    -- Get current attempt count
    SELECT COALESCE(attempt_count, 0) INTO attempt_count
    FROM rate_limits 
    WHERE identifier = p_identifier 
      AND action = p_action 
      AND window_start = current_window;
    
    -- Increment attempt count
    INSERT INTO rate_limits (identifier, action, attempt_count, window_start)
    VALUES (p_identifier, p_action, 1, current_window)
    ON CONFLICT (identifier, action, window_start)
    DO UPDATE SET 
        attempt_count = rate_limits.attempt_count + 1,
        updated_at = NOW();
    
    -- Check if limit exceeded
    IF attempt_count + 1 >= p_max_attempts THEN
        UPDATE rate_limits 
        SET blocked_until = NOW() + INTERVAL '1 hour'
        WHERE identifier = p_identifier 
          AND action = p_action 
          AND window_start = current_window;
        RETURN FALSE; -- Blocked
    END IF;
    
    RETURN TRUE; -- Allowed
END;
$$ LANGUAGE plpgsql;

-- Function to log security events
CREATE OR REPLACE FUNCTION log_security_event(
    p_user_id UUID,
    p_session_id UUID,
    p_event_type TEXT,
    p_severity TEXT,
    p_description TEXT,
    p_metadata JSONB DEFAULT '{}',
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO security_events (
        user_id, session_id, event_type, severity, description,
        metadata, ip_address, user_agent
    ) VALUES (
        p_user_id, p_session_id, p_event_type, p_severity, p_description,
        p_metadata, p_ip_address, p_user_agent
    ) RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mfa ENABLE ROW LEVEL SECURITY;
ALTER TABLE mfa_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE csrf_tokens ENABLE ROW LEVEL SECURITY;

-- Session policies
CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON user_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all sessions" ON user_sessions
    FOR ALL USING (auth.role() = 'service_role');

-- Session activity policies
CREATE POLICY "Users can view own session activity" ON session_activity
    FOR SELECT USING (
        session_id IN (
            SELECT id FROM user_sessions WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage all session activity" ON session_activity
    FOR ALL USING (auth.role() = 'service_role');

-- MFA policies
CREATE POLICY "Users can manage own MFA" ON user_mfa
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own MFA attempts" ON mfa_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all MFA" ON user_mfa
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage all MFA attempts" ON mfa_attempts
    FOR ALL USING (auth.role() = 'service_role');

-- Security events policies
CREATE POLICY "Users can view own security events" ON security_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all security events" ON security_events
    FOR ALL USING (auth.role() = 'service_role');

-- Device fingerprint policies
CREATE POLICY "Users can view own device fingerprints" ON device_fingerprints
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own device fingerprints" ON device_fingerprints
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all device fingerprints" ON device_fingerprints
    FOR ALL USING (auth.role() = 'service_role');

-- Rate limit policies (service role only)
CREATE POLICY "Service role can manage rate limits" ON rate_limits
    FOR ALL USING (auth.role() = 'service_role');

-- CSRF token policies
CREATE POLICY "Users can manage own CSRF tokens" ON csrf_tokens
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all CSRF tokens" ON csrf_tokens
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- GRANTS
-- ============================================================================

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON user_sessions TO authenticated;
GRANT SELECT, INSERT ON session_activity TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_mfa TO authenticated;
GRANT SELECT ON mfa_attempts TO authenticated;
GRANT SELECT ON security_events TO authenticated;
GRANT SELECT, INSERT, UPDATE ON device_fingerprints TO authenticated;
GRANT SELECT, INSERT, UPDATE ON csrf_tokens TO authenticated;

-- Grant function execution permissions
GRANT EXECUTE ON FUNCTION cleanup_expired_sessions() TO authenticated;
GRANT EXECUTE ON FUNCTION check_rate_limit(TEXT, TEXT, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION log_security_event(UUID, UUID, TEXT, TEXT, TEXT, JSONB, INET, TEXT) TO authenticated;
