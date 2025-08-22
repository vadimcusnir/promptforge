-- PromptForge Database Migration 003
-- Billing, plans, subscriptions and entitlements system
-- Complete feature flags and gating infrastructure

-- Enum types
CREATE TYPE plan_code_t AS ENUM ('pilot', 'pro', 'enterprise');
CREATE TYPE subscription_status_t AS ENUM ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid');
CREATE TYPE entitlement_source_t AS ENUM ('plan', 'addon', 'pack', 'license', 'manual');

-- Plans table with canonical feature flags
CREATE TABLE plans (
    code plan_code_t PRIMARY KEY,
    name TEXT NOT NULL,
    flags JSONB NOT NULL,
    retention_days INTEGER NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT plans_flags_required CHECK (
        flags ? 'canUseAllModules' AND
        flags ? 'canExportMD' AND
        flags ? 'canExportPDF' AND
        flags ? 'canExportJSON' AND
        flags ? 'canUseGptTestReal' AND
        flags ? 'hasAPI' AND
        flags ? 'canExportBundleZip' AND
        flags ? 'maxRunsPerDay' AND
        flags ? 'maxSeats'
    )
);

-- Subscriptions table
CREATE TABLE subscriptions (
    org_id UUID PRIMARY KEY REFERENCES orgs(id) ON DELETE CASCADE,
    stripe_customer_id TEXT UNIQUE,
    plan_code plan_code_t NOT NULL REFERENCES plans(code),
    status subscription_status_t NOT NULL DEFAULT 'incomplete',
    seats INTEGER NOT NULL DEFAULT 1,
    trial_end TIMESTAMPTZ,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT subscriptions_seats_positive CHECK (seats > 0),
    CONSTRAINT subscriptions_trial_end_future CHECK (trial_end IS NULL OR trial_end > created_at)
);

-- Entitlements table - the core of feature gating
CREATE TABLE entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    user_id UUID, -- NULL means org-wide entitlement
    flag TEXT NOT NULL,
    value BOOLEAN NOT NULL DEFAULT TRUE,
    source entitlement_source_t NOT NULL,
    source_ref TEXT, -- Reference to source (plan_code, addon_id, etc.)
    meta JSONB DEFAULT '{}',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT entitlements_flag_not_empty CHECK (length(trim(flag)) > 0),
    CONSTRAINT entitlements_expires_future CHECK (expires_at IS NULL OR expires_at > created_at),
    CONSTRAINT entitlements_user_member CHECK (
        user_id IS NULL OR 
        EXISTS (SELECT 1 FROM org_members WHERE org_id = entitlements.org_id AND user_id = entitlements.user_id)
    )
);

-- User addons table
CREATE TABLE user_addons (
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    addon_code TEXT NOT NULL,
    status subscription_status_t NOT NULL DEFAULT 'active',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    PRIMARY KEY (org_id, user_id, addon_code),
    CONSTRAINT user_addons_user_member CHECK (
        EXISTS (SELECT 1 FROM org_members WHERE org_id = user_addons.org_id AND user_id = user_addons.user_id)
    )
);

-- API Keys table
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    key_hash TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    rate_limit INTEGER DEFAULT 1000, -- requests per hour
    last_used_at TIMESTAMPTZ,
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT api_keys_name_not_empty CHECK (length(trim(name)) > 0),
    CONSTRAINT api_keys_rate_limit_positive CHECK (rate_limit > 0),
    CONSTRAINT api_keys_creator_member CHECK (
        EXISTS (SELECT 1 FROM org_members WHERE org_id = api_keys.org_id AND user_id = api_keys.created_by)
    )
);

-- Triggers for updated_at
CREATE TRIGGER trg_plans_updated_at 
    BEFORE UPDATE ON plans 
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

CREATE TRIGGER trg_subscriptions_updated_at 
    BEFORE UPDATE ON subscriptions 
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

CREATE TRIGGER trg_entitlements_updated_at 
    BEFORE UPDATE ON entitlements 
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

CREATE TRIGGER trg_user_addons_updated_at 
    BEFORE UPDATE ON user_addons 
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

CREATE TRIGGER trg_api_keys_updated_at 
    BEFORE UPDATE ON api_keys 
    FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();

-- Performance indices
CREATE INDEX subscriptions_org_id_idx ON subscriptions (org_id);
CREATE INDEX subscriptions_status_idx ON subscriptions (status);
CREATE INDEX subscriptions_current_period_end_idx ON subscriptions (current_period_end DESC);
CREATE INDEX subscriptions_stripe_customer_idx ON subscriptions (stripe_customer_id);

CREATE INDEX entitlements_org_id_flag_idx ON entitlements (org_id, flag);
CREATE INDEX entitlements_user_id_flag_idx ON entitlements (user_id, flag) WHERE user_id IS NOT NULL;
CREATE INDEX entitlements_flag_idx ON entitlements (flag);
CREATE INDEX entitlements_expires_at_idx ON entitlements (expires_at) WHERE expires_at IS NOT NULL;

CREATE INDEX user_addons_org_user_idx ON user_addons (org_id, user_id);
CREATE INDEX user_addons_status_idx ON user_addons (status);

CREATE INDEX api_keys_org_id_idx ON api_keys (org_id);
CREATE INDEX api_keys_active_idx ON api_keys (active) WHERE active = TRUE;
CREATE INDEX api_keys_last_used_idx ON api_keys (last_used_at DESC);

-- Effective entitlements views for O(1) gating
-- Organization-wide effective entitlements (OR logic per flag)
CREATE OR REPLACE VIEW entitlements_effective_org AS
SELECT 
    org_id,
    flag,
    bool_or(value) as value,
    array_agg(DISTINCT source::text) as sources,
    min(expires_at) as earliest_expiry
FROM entitlements 
WHERE 
    user_id IS NULL 
    AND (expires_at IS NULL OR expires_at > NOW())
GROUP BY org_id, flag;

-- User-specific effective entitlements (OR between org-wide and per-user)
CREATE OR REPLACE VIEW entitlements_effective_user AS
SELECT 
    COALESCE(org_ent.org_id, user_ent.org_id) as org_id,
    COALESCE(org_ent.user_id, user_ent.user_id) as user_id,
    COALESCE(org_ent.flag, user_ent.flag) as flag,
    COALESCE(org_ent.value, FALSE) OR COALESCE(user_ent.value, FALSE) as value,
    COALESCE(org_ent.sources, '{}') || COALESCE(user_ent.sources, '{}') as sources,
    LEAST(org_ent.earliest_expiry, user_ent.earliest_expiry) as earliest_expiry
FROM (
    SELECT org_id, NULL as user_id, flag, value, sources, earliest_expiry
    FROM entitlements_effective_org
) org_ent
FULL OUTER JOIN (
    SELECT 
        org_id, 
        user_id, 
        flag,
        bool_or(value) as value,
        array_agg(DISTINCT source::text) as sources,
        min(expires_at) as earliest_expiry
    FROM entitlements 
    WHERE 
        user_id IS NOT NULL 
        AND (expires_at IS NULL OR expires_at > NOW())
    GROUP BY org_id, user_id, flag
) user_ent ON org_ent.org_id = user_ent.org_id AND org_ent.flag = user_ent.flag;

-- Function to apply plan entitlements atomically
CREATE OR REPLACE FUNCTION pf_apply_plan_entitlements(org_uuid UUID, plan_code_val plan_code_t)
RETURNS VOID AS $$
DECLARE
    plan_flags JSONB;
    flag_key TEXT;
    flag_value BOOLEAN;
BEGIN
    -- Get plan flags
    SELECT flags INTO plan_flags FROM plans WHERE code = plan_code_val;
    
    IF plan_flags IS NULL THEN
        RAISE EXCEPTION 'Plan % not found', plan_code_val;
    END IF;
    
    -- Remove existing plan entitlements for this org
    DELETE FROM entitlements 
    WHERE org_id = org_uuid 
    AND source = 'plan' 
    AND user_id IS NULL;
    
    -- Insert new plan entitlements
    FOR flag_key, flag_value IN SELECT * FROM jsonb_each_text(plan_flags)
    LOOP
        INSERT INTO entitlements (org_id, user_id, flag, value, source, source_ref)
        VALUES (org_uuid, NULL, flag_key, flag_value::BOOLEAN, 'plan', plan_code_val::TEXT);
    END LOOP;
    
    -- Log the operation
    RAISE NOTICE 'Applied plan % entitlements to org %', plan_code_val, org_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies for plans (public read for pricing page)
CREATE POLICY "plans_public_select" ON plans
    FOR SELECT TO authenticated, anon
    USING (TRUE);

-- RLS Policies for subscriptions
-- Only org owners/admins can see and modify subscriptions
CREATE POLICY "subscriptions_admin_all" ON subscriptions
    FOR ALL TO authenticated
    USING (is_org_admin(org_id, get_current_user_id()))
    WITH CHECK (is_org_admin(org_id, get_current_user_id()));

-- RLS Policies for entitlements
-- Members can read org entitlements (for feature gating)
-- Only service role can write (from webhooks/admin functions)
CREATE POLICY "entitlements_member_select" ON entitlements
    FOR SELECT TO authenticated
    USING (is_org_member(org_id, get_current_user_id()));

-- No client-side writes to entitlements - only service role
CREATE POLICY "entitlements_service_only_write" ON entitlements
    FOR INSERT TO service_role
    WITH CHECK (TRUE);

CREATE POLICY "entitlements_service_only_update" ON entitlements
    FOR UPDATE TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

CREATE POLICY "entitlements_service_only_delete" ON entitlements
    FOR DELETE TO service_role
    USING (TRUE);

-- RLS Policies for user_addons
-- Owners/admins can manage user addons
CREATE POLICY "user_addons_admin_all" ON user_addons
    FOR ALL TO authenticated
    USING (is_org_admin(org_id, get_current_user_id()))
    WITH CHECK (is_org_admin(org_id, get_current_user_id()));

-- Users can see their own addons
CREATE POLICY "user_addons_self_select" ON user_addons
    FOR SELECT TO authenticated
    USING (user_id = get_current_user_id() AND is_org_member(org_id, get_current_user_id()));

-- RLS Policies for api_keys
-- Owners/admins can manage API keys
CREATE POLICY "api_keys_admin_all" ON api_keys
    FOR ALL TO authenticated
    USING (is_org_admin(org_id, get_current_user_id()))
    WITH CHECK (is_org_admin(org_id, get_current_user_id()));

-- Migration completed
SELECT 'Migration 003 completed: Billing, plans, subscriptions and entitlements' as status;
