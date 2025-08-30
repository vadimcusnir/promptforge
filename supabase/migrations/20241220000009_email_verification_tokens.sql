-- Migration: Email Verification Tokens
-- Creates table for secure email verification and password reset tokens

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Email verification tokens table
CREATE TABLE IF NOT EXISTS email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('password_reset', 'email_verification', 'mfa_recovery')),
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_type ON email_verification_tokens(type);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_expires_at ON email_verification_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_used ON email_verification_tokens(used);

-- Function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_email_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM email_verification_tokens 
    WHERE expires_at < NOW() OR (used = true AND created_at < NOW() - INTERVAL '24 hours');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own email tokens" ON email_verification_tokens
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all email tokens" ON email_verification_tokens
    FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON email_verification_tokens TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_email_tokens() TO authenticated;
