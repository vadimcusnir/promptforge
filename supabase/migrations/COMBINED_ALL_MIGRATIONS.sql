-- PromptForge Complete Database Setup
-- Combined migration file for Supabase SQL Editor
-- Run this entire file in Supabase Dashboard > SQL Editor

-- ============================================================================
-- Migration 001: Extensions and utility functions
-- ============================================================================

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

SELECT 'Migration 001 completed: Extensions and utility functions initialized' as status;

-- ============================================================================
-- Migration 002: Organizations and membership with RLS
-- ============================================================================

-- Organization role enum
CREATE TYPE org_role_t AS ENUM ('owner', 'admin', 'member');

-- Organizations table
CREATE TABLE orgs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT orgs_slug_unique UNIQUE (slug),
    CONSTRAINT orgs_name_not_empty CHECK (length(trim(name)) > 0),
    CONSTRAINT orgs_slug_format CHECK (slug ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$' AND length(slug) >= 3)
);

-- Organization members table
CREATE TABLE org_members (
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role org_role_t NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    PRIMARY KEY (org_id, user_id),
    CONSTRAINT org_members_unique_per_org UNIQUE (org_id, user_id)
);

-- Triggers for updated_at
CREATE TRIGGER trg_orgs_updated_at 
    BEFORE UPDATE ON orgs 
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

-- Performance indices
CREATE INDEX orgs_created_at_desc_idx ON orgs (created_at DESC);
CREATE INDEX orgs_slug_idx ON orgs (slug);
CREATE INDEX org_members_user_id_idx ON org_members (user_id);
CREATE INDEX org_members_org_id_role_idx ON org_members (org_id, role);

-- Function to prevent deletion/demotion of last owner
CREATE OR REPLACE FUNCTION prevent_last_owner_removal()
RETURNS TRIGGER AS $$
DECLARE
    owner_count INTEGER;
BEGIN
    -- Check if this affects an owner
    IF (TG_OP = 'DELETE' AND OLD.role = 'owner') OR 
       (TG_OP = 'UPDATE' AND OLD.role = 'owner' AND NEW.role != 'owner') THEN
        
        -- Count remaining owners after this operation
        SELECT COUNT(*) INTO owner_count
        FROM org_members 
        WHERE org_id = COALESCE(OLD.org_id, NEW.org_id) 
        AND role = 'owner'
        AND (TG_OP = 'DELETE' OR user_id != OLD.user_id);
        
        -- Prevent if this would be the last owner
        IF owner_count = 0 THEN
            RAISE EXCEPTION 'Cannot remove or demote the last owner of organization';
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger
CREATE TRIGGER trg_prevent_last_owner_removal
    BEFORE UPDATE OR DELETE ON org_members
    FOR EACH ROW EXECUTE FUNCTION prevent_last_owner_removal();

-- Enable RLS
ALTER TABLE orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orgs
CREATE POLICY "orgs_member_select" ON orgs
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_id = orgs.id 
            AND user_id = get_current_user_id()
        )
    );

CREATE POLICY "orgs_admin_update" ON orgs
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_id = orgs.id 
            AND user_id = get_current_user_id() 
            AND role IN ('owner', 'admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_id = orgs.id 
            AND user_id = get_current_user_id() 
            AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "orgs_owner_delete" ON orgs
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_id = orgs.id 
            AND user_id = get_current_user_id() 
            AND role = 'owner'
        )
    );

-- RLS Policies for org_members
CREATE POLICY "org_members_member_select" ON org_members
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM org_members om 
            WHERE om.org_id = org_members.org_id 
            AND om.user_id = get_current_user_id()
        )
    );

CREATE POLICY "org_members_admin_insert" ON org_members
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_id = org_members.org_id 
            AND user_id = get_current_user_id() 
            AND role IN ('owner', 'admin')
        )
    );

CREATE POLICY "org_members_update" ON org_members
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM org_members om 
            WHERE om.org_id = org_members.org_id 
            AND om.user_id = get_current_user_id() 
            AND (
                om.role = 'owner' OR 
                (om.role = 'admin' AND org_members.role = 'member')
            )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM org_members om 
            WHERE om.org_id = org_members.org_id 
            AND om.user_id = get_current_user_id() 
            AND (
                om.role = 'owner' OR 
                (om.role = 'admin' AND org_members.role = 'member')
            )
        )
    );

CREATE POLICY "org_members_admin_delete" ON org_members
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM org_members om 
            WHERE om.org_id = org_members.org_id 
            AND om.user_id = get_current_user_id() 
            AND om.role IN ('owner', 'admin')
        )
    );

SELECT 'Migration 002 completed: Organizations and membership with RLS' as status;
