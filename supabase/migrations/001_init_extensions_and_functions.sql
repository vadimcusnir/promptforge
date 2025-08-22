-- PromptForge Database Migration 001
-- Initialize extensions and utility functions
-- Run once to set up the foundation

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Utility function for updated_at timestamps
-- This will be reused across all tables with updated_at columns
CREATE OR REPLACE FUNCTION trg_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Utility function to check if a user is a member of an organization
CREATE OR REPLACE FUNCTION is_org_member(org_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM org_members 
        WHERE org_id = org_uuid 
        AND user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Utility function to check if a user has a specific role in an organization
CREATE OR REPLACE FUNCTION has_org_role(org_uuid UUID, user_uuid UUID, required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM org_members 
        WHERE org_id = org_uuid 
        AND user_id = user_uuid 
        AND role::text = required_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Utility function to check if a user is owner or admin of an organization
CREATE OR REPLACE FUNCTION is_org_admin(org_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM org_members 
        WHERE org_id = org_uuid 
        AND user_id = user_uuid 
        AND role IN ('owner', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user ID (for RLS policies)
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN (auth.jwt() ->> 'sub')::UUID;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Migration completed
SELECT 'Migration 001 completed: Extensions and utility functions initialized' as status;
