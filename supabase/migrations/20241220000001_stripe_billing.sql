-- Migration: Stripe Billing Integration
-- Creates tables for subscriptions, webhook events, and entitlements management
-- Implements the pf_apply_plan_entitlements function for automatic entitlement application

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    stripe_customer_id TEXT NOT NULL,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    plan_code TEXT NOT NULL CHECK (plan_code IN ('pilot', 'pro', 'enterprise')),
    status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'paused', 'past_due', 'unpaid')),
    seats INTEGER NOT NULL DEFAULT 1 CHECK (seats > 0),
    trial_end TIMESTAMPTZ,
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create webhook events table for idempotency
CREATE TABLE IF NOT EXISTS webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stripe_event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create entitlements table if it doesn't exist
CREATE TABLE IF NOT EXISTS entitlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    flag TEXT NOT NULL,
    value JSONB NOT NULL, -- Can be boolean, number, or string
    source TEXT NOT NULL CHECK (source IN ('plan', 'addon', 'trial')),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(org_id, flag, source)
);

-- Create effective entitlements view
CREATE OR REPLACE VIEW entitlements_effective AS
WITH latest_entitlements AS (
    SELECT DISTINCT ON (org_id, flag)
        org_id,
        flag,
        value,
        source,
        expires_at,
        updated_at
    FROM entitlements
    WHERE expires_at IS NULL OR expires_at > NOW()
    ORDER BY org_id, flag, updated_at DESC
)
SELECT 
    org_id,
    flag,
    value,
    source,
    updated_at
FROM latest_entitlements;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_org_id ON subscriptions(org_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_code ON subscriptions(plan_code);

CREATE INDEX IF NOT EXISTS idx_webhook_events_stripe_event_id ON webhook_events(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed_at ON webhook_events(processed_at);

CREATE INDEX IF NOT EXISTS idx_entitlements_org_id ON entitlements(org_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_flag ON entitlements(flag);
CREATE INDEX IF NOT EXISTS idx_entitlements_source ON entitlements(source);
CREATE INDEX IF NOT EXISTS idx_entitlements_expires_at ON entitlements(expires_at);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entitlements_updated_at 
    BEFORE UPDATE ON entitlements 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create the pf_apply_plan_entitlements function
CREATE OR REPLACE FUNCTION pf_apply_plan_entitlements(
    p_org_id UUID,
    p_plan_code TEXT
)
RETURNS VOID AS $$
DECLARE
    v_entitlement RECORD;
    v_flag TEXT;
    v_value BOOLEAN;
BEGIN
    -- Log the function call
    RAISE NOTICE 'Applying entitlements for org % with plan %', p_org_id, p_plan_code;
    
    -- Define entitlements for each plan
    CASE p_plan_code
        WHEN 'pilot' THEN
            -- Pilot plan entitlements
            INSERT INTO entitlements (org_id, flag, value, source) VALUES
                (p_org_id, 'canUseAllModules', false, 'plan'),
                (p_org_id, 'canExportMD', true, 'plan'),
                (p_org_id, 'canExportPDF', false, 'plan'),
                (p_org_id, 'canExportJSON', false, 'plan'),
                (p_org_id, 'canUseGptTestReal', false, 'plan'),
                (p_org_id, 'hasCloudHistory', false, 'plan'),
                (p_org_id, 'hasEvaluatorAI', false, 'plan'),
                (p_org_id, 'hasAPI', false, 'plan'),
                (p_org_id, 'canExportBundleZip', false, 'plan'),
                (p_org_id, 'hasWhiteLabel', false, 'plan'),
                (p_org_id, 'hasSeatsGT1', false, 'plan')
            ON CONFLICT (org_id, flag, source) 
            DO UPDATE SET 
                value = EXCLUDED.value,
                updated_at = NOW();
                
        WHEN 'pro' THEN
            -- Pro plan entitlements
            INSERT INTO entitlements (org_id, flag, value, source) VALUES
                (p_org_id, 'canUseAllModules', true, 'plan'),
                (p_org_id, 'canExportMD', true, 'plan'),
                (p_org_id, 'canExportPDF', true, 'plan'),
                (p_org_id, 'canExportJSON', true, 'plan'),
                (p_org_id, 'canUseGptTestReal', true, 'plan'),
                (p_org_id, 'hasCloudHistory', true, 'plan'),
                (p_org_id, 'hasEvaluatorAI', true, 'plan'),
                (p_org_id, 'hasAPI', false, 'plan'),
                (p_org_id, 'canExportBundleZip', false, 'plan'),
                (p_org_id, 'hasWhiteLabel', false, 'plan'),
                (p_org_id, 'hasSeatsGT1', false, 'plan')
            ON CONFLICT (org_id, flag, source) 
            DO UPDATE SET 
                value = EXCLUDED.value,
                updated_at = NOW();
                
        WHEN 'enterprise' THEN
            -- Enterprise plan entitlements
            INSERT INTO entitlements (org_id, flag, value, source) VALUES
                (p_org_id, 'canUseAllModules', true, 'plan'),
                (p_org_id, 'canExportMD', true, 'plan'),
                (p_org_id, 'canExportPDF', true, 'plan'),
                (p_org_id, 'canExportJSON', true, 'plan'),
                (p_org_id, 'canUseGptTestReal', true, 'plan'),
                (p_org_id, 'hasCloudHistory', true, 'plan'),
                (p_org_id, 'hasEvaluatorAI', true, 'plan'),
                (p_org_id, 'hasAPI', true, 'plan'),
                (p_org_id, 'canExportBundleZip', true, 'plan'),
                (p_org_id, 'hasWhiteLabel', true, 'plan'),
                (p_org_id, 'hasSeatsGT1', true, 'plan')
            ON CONFLICT (org_id, flag, source) 
            DO UPDATE SET 
                value = EXCLUDED.value,
                updated_at = NOW();
                
        ELSE
            RAISE EXCEPTION 'Invalid plan code: %', p_plan_code;
    END CASE;
    
    -- Log successful completion
    RAISE NOTICE 'Successfully applied entitlements for org % with plan %', p_org_id, p_plan_code;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error applying entitlements: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON subscriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON webhook_events TO authenticated;
GRANT SELECT, INSERT, UPDATE ON entitlements TO authenticated;
GRANT SELECT ON entitlements_effective TO authenticated;

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscriptions
CREATE POLICY "Users can view their organization's subscriptions" ON subscriptions
    FOR SELECT USING (
        org_id IN (
            SELECT org_id FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage all subscriptions" ON subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for webhook events
CREATE POLICY "Service role can manage all webhook events" ON webhook_events
    FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for entitlements
CREATE POLICY "Users can view their organization's entitlements" ON entitlements
    FOR SELECT USING (
        org_id IN (
            SELECT org_id FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage all entitlements" ON entitlements
    FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for entitlements_effective view
CREATE POLICY "Users can view their organization's effective entitlements" ON entitlements_effective
    FOR SELECT USING (
        org_id IN (
            SELECT org_id FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

-- Insert sample data for testing (optional)
INSERT INTO subscriptions (org_id, stripe_customer_id, stripe_subscription_id, plan_code, status, seats, current_period_start, current_period_end)
VALUES 
    ('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', 'cus_sample_pilot', 'sub_sample_pilot', 'pilot', 'active', 1, NOW(), NOW() + INTERVAL '1 month'),
    ('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', 'cus_sample_pro', 'sub_sample_pro', 'pro', 'active', 1, NOW(), NOW() + INTERVAL '1 month'),
    ('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003', 'cus_sample_enterprise', 'sub_sample_enterprise', 'enterprise', 'active', 5, NOW(), NOW() + INTERVAL '1 month')
ON CONFLICT (stripe_subscription_id) DO NOTHING;

-- Apply entitlements for sample data
SELECT pf_apply_plan_entitlements('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', 'pilot');
SELECT pf_apply_plan_entitlements('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', 'pro');
SELECT pf_apply_plan_entitlements('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003', 'enterprise');
