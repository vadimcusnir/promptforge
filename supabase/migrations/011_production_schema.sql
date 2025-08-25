-- PromptForge v3 Production Database Migration 011
-- Complete production schema for billing, entitlements, and user management
-- Run this migration on your production Supabase instance

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

-- Plan codes for different subscription tiers
CREATE TYPE IF NOT EXISTS plan_code_t AS ENUM ('free', 'creator', 'pro', 'enterprise');

-- Subscription status types
CREATE TYPE IF NOT EXISTS subscription_status_t AS ENUM (
    'incomplete', 'incomplete_expired', 'trialing', 'active', 
    'past_due', 'canceled', 'unpaid'
);

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Customers table for Stripe integration
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    stripe_customer_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    stripe_subscription_id TEXT UNIQUE,
    plan_code plan_code_t NOT NULL DEFAULT 'free',
    status subscription_status_t NOT NULL DEFAULT 'active',
    billing_cycle TEXT NOT NULL DEFAULT 'monthly',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User entitlements table
CREATE TABLE IF NOT EXISTS public.user_entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE,
    plan_code plan_code_t NOT NULL DEFAULT 'free',
    can_export_pdf BOOLEAN DEFAULT FALSE,
    can_export_json BOOLEAN DEFAULT FALSE,
    can_export_bundle_zip BOOLEAN DEFAULT FALSE,
    can_use_gpt_test_real BOOLEAN DEFAULT FALSE,
    max_prompts_per_month INTEGER DEFAULT 10,
    max_exports_per_month INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- API usage tracking
CREATE TABLE IF NOT EXISTS public.api_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    requests_count INTEGER DEFAULT 0,
    window_start TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enterprise usage tracking
CREATE TABLE IF NOT EXISTS public.enterprise_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    module_id TEXT NOT NULL,
    request_data JSONB,
    response_data JSONB,
    execution_time_ms INTEGER,
    tokens_used INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prompt history table
CREATE TABLE IF NOT EXISTS public.prompt_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    module_id TEXT NOT NULL,
    seven_d_config JSONB NOT NULL,
    generated_prompt TEXT NOT NULL,
    test_result JSONB,
    export_formats TEXT[],
    score INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Export bundles table
CREATE TABLE IF NOT EXISTS public.export_bundles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    prompt_history_id UUID REFERENCES public.prompt_history(id),
    bundle_hash TEXT NOT NULL,
    formats TEXT[] NOT NULL,
    manifest JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- User lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_stripe_id ON public.customers(stripe_customer_id);

-- Subscription lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- Entitlements lookups
CREATE INDEX IF NOT EXISTS idx_entitlements_user_id ON public.user_entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_plan_code ON public.user_entitlements(plan_code);

-- API usage tracking
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON public.api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_window ON public.api_usage(window_start);

-- Enterprise usage tracking
CREATE INDEX IF NOT EXISTS idx_enterprise_usage_user_id ON public.enterprise_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_usage_module ON public.enterprise_usage(module_id);

-- Prompt history
CREATE INDEX IF NOT EXISTS idx_prompt_history_user_id ON public.prompt_history(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_history_created ON public.prompt_history(created_at);

-- Export bundles
CREATE INDEX IF NOT EXISTS idx_export_bundles_user_id ON public.export_bundles(user_id);
CREATE INDEX IF NOT EXISTS idx_export_bundles_hash ON public.export_bundles(bundle_hash);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_bundles ENABLE ROW LEVEL SECURITY;

-- Users: Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = email);

-- Customers: Users can only see their own customer record
CREATE POLICY "Users can view own customer record" ON public.customers
    FOR SELECT USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Users can insert own customer record" ON public.customers
    FOR INSERT WITH CHECK (email = auth.jwt() ->> 'email');

-- Subscriptions: Users can only see their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (user_id = auth.jwt() ->> 'email');

CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'email');

-- User entitlements: Users can only see their own entitlements
CREATE POLICY "Users can view own entitlements" ON public.user_entitlements
    FOR SELECT USING (user_id = auth.jwt() ->> 'email');

CREATE POLICY "Users can insert own entitlements" ON public.user_entitlements
    FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'email');

-- API usage: Users can only see their own usage
CREATE POLICY "Users can view own API usage" ON public.api_usage
    FOR SELECT USING (user_id = auth.jwt() ->> 'email');

CREATE POLICY "Users can insert own API usage" ON public.api_usage
    FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'email');

-- Enterprise usage: Users can only see their own usage
CREATE POLICY "Users can view own enterprise usage" ON public.enterprise_usage
    FOR SELECT USING (user_id = auth.jwt() ->> 'email');

CREATE POLICY "Users can insert own enterprise usage" ON public.enterprise_usage
    FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'email');

-- Prompt history: Users can only see their own history
CREATE POLICY "Users can view own prompt history" ON public.prompt_history
    FOR SELECT USING (user_id = auth.jwt() ->> 'email');

CREATE POLICY "Users can insert own prompt history" ON public.prompt_history
    FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'email');

-- Export bundles: Users can only see their own bundles
CREATE POLICY "Users can view own export bundles" ON public.export_bundles
    FOR SELECT USING (user_id = auth.jwt() ->> 'email');

CREATE POLICY "Users can insert own export bundles" ON public.export_bundles
    FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'email');

-- =============================================================================
-- FUNCTIONS AND TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_entitlements_updated_at BEFORE UPDATE ON public.user_entitlements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create default entitlements for new users
CREATE OR REPLACE FUNCTION create_default_entitlements()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_entitlements (user_id, plan_code)
    VALUES (NEW.email, 'free');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create default entitlements when a user is created
CREATE TRIGGER create_user_entitlements_trigger
    AFTER INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION create_default_entitlements();

-- =============================================================================
-- SEED DATA
-- =============================================================================

-- Insert default plans if they don't exist
INSERT INTO public.user_entitlements (user_id, plan_code, can_export_pdf, can_export_json, can_export_bundle_zip, can_use_gpt_test_real, max_prompts_per_month, max_exports_per_month)
VALUES 
    ('free@example.com', 'free', false, false, false, false, 10, 5),
    ('creator@example.com', 'creator', false, false, false, false, 100, 50),
    ('pro@example.com', 'pro', true, true, true, true, 1000, 500),
    ('enterprise@example.com', 'enterprise', true, true, true, true, -1, -1)
ON CONFLICT (user_id) DO NOTHING;

-- =============================================================================
-- MIGRATION COMPLETION
-- =============================================================================

-- Log migration completion
INSERT INTO public.prompt_history (user_id, module_id, seven_d_config, generated_prompt, score)
VALUES (
    'system@promptforge.com',
    'MIGRATION_011',
    '{"domain": "system", "scale": "enterprise", "urgency": "planned", "complexity": "expert", "resources": "enterprise_budget", "application": "database_migration", "output": "structured"}',
    'Production database migration 011 completed successfully. All tables, indexes, RLS policies, and functions have been created.',
    100
) ON CONFLICT DO NOTHING;

-- Display completion message
DO $$
BEGIN
    RAISE NOTICE 'Production database migration 011 completed successfully!';
    RAISE NOTICE 'Tables created: users, customers, subscriptions, user_entitlements, api_usage, enterprise_usage, prompt_history, export_bundles';
    RAISE NOTICE 'Indexes created for optimal performance';
    RAISE NOTICE 'RLS policies enabled for security';
    RAISE NOTICE 'Triggers and functions configured';
    RAISE NOTICE 'Seed data inserted';
END $$;
