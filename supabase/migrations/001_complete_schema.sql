-- ============================================================================
-- SUPABASE SCHEMA - PromptForge Infrastructure
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- CORE TYPES & ENUMS
-- ============================================================================

CREATE TYPE plan_type AS ENUM ('pilot', 'pro', 'enterprise');
CREATE TYPE export_format AS ENUM ('txt', 'md', 'json', 'pdf', 'zip');
CREATE TYPE run_status AS ENUM ('pending', 'running', 'completed', 'failed', 'cancelled');
CREATE TYPE module_vector AS ENUM ('strategic', 'content', 'technical', 'sales', 'operational', 'creative', 'analytical');

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

-- Users table (extends auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    plan plan_type DEFAULT 'pilot' NOT NULL,
    credits_remaining INTEGER DEFAULT 10,
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    subscription_status TEXT,
    trial_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences and settings
CREATE TABLE public.user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    default_vectors JSONB DEFAULT '{}',
    export_preferences JSONB DEFAULT '{}',
    ui_preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================================================
-- MODULES SYSTEM (M01-M50)
-- ============================================================================

-- Modules catalog
CREATE TABLE public.modules (
    id TEXT PRIMARY KEY, -- M01, M02, etc.
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    vector module_vector NOT NULL,
    difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
    estimated_tokens INTEGER,
    input_schema JSONB NOT NULL,
    output_template TEXT NOT NULL,
    guardrails TEXT[],
    kpi_target TEXT,
    sample_output TEXT,
    is_active BOOLEAN DEFAULT true,
    requires_plan plan_type DEFAULT 'pilot',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Module usage analytics
CREATE TABLE public.module_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    module_id TEXT REFERENCES public.modules(id),
    usage_count INTEGER DEFAULT 0,
    avg_score DECIMAL(3,1),
    success_rate DECIMAL(3,2),
    last_used TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(module_id)
);

-- ============================================================================
-- PROMPT RUNS & HISTORY
-- ============================================================================

-- Prompt generation runs
CREATE TABLE public.prompt_runs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    module_id TEXT REFERENCES public.modules(id),
    session_config JSONB NOT NULL, -- 7-D configuration
    generated_prompt TEXT,
    optimized_prompt TEXT,
    ai_score INTEGER CHECK (ai_score BETWEEN 0 AND 100),
    test_result JSONB,
    status run_status DEFAULT 'pending',
    execution_time_ms INTEGER,
    token_usage INTEGER,
    cost_usd DECIMAL(8,4),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- User session configurations (7-D specs)
CREATE TABLE public.session_configs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT,
    config JSONB NOT NULL, -- domain, scale, urgency, complexity, resources, application, output
    is_default BOOLEAN DEFAULT false,
    used_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- EXPORTS & STORAGE
-- ============================================================================

-- Export requests and tracking
CREATE TABLE public.exports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    prompt_run_id UUID REFERENCES public.prompt_runs(id) ON DELETE CASCADE,
    format export_format NOT NULL,
    file_path TEXT, -- Supabase Storage path
    file_size INTEGER,
    download_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bundle exports (zip containing multiple formats)
CREATE TABLE public.export_bundles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    prompt_run_ids UUID[],
    bundle_name TEXT NOT NULL,
    file_path TEXT,
    file_size INTEGER,
    formats export_format[],
    download_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ENTITLEMENTS & GATING
-- ============================================================================

-- Feature entitlements per plan
CREATE TABLE public.entitlements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    plan plan_type NOT NULL,
    feature_key TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT false,
    limit_value INTEGER, -- NULL = unlimited
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(plan, feature_key)
);

-- User-specific feature overrides
CREATE TABLE public.user_entitlements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    feature_key TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT false,
    limit_value INTEGER,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, feature_key)
);

-- Usage tracking for gated features
CREATE TABLE public.feature_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    feature_key TEXT NOT NULL,
    usage_count INTEGER DEFAULT 1,
    usage_date DATE DEFAULT CURRENT_DATE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, feature_key, usage_date)
);

-- ============================================================================
-- ANALYTICS & METRICS
-- ============================================================================

-- Daily usage aggregates
CREATE TABLE public.daily_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL,
    total_runs INTEGER DEFAULT 0,
    total_users INTEGER DEFAULT 0,
    total_exports INTEGER DEFAULT 0,
    avg_score DECIMAL(3,1),
    revenue_usd DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(date)
);

-- User activity tracking
CREATE TABLE public.user_activity (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- User preferences
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
    FOR ALL USING (auth.uid() = user_id);

-- Prompt runs
CREATE POLICY "Users can view own runs" ON public.prompt_runs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create runs" ON public.prompt_runs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own runs" ON public.prompt_runs
    FOR UPDATE USING (auth.uid() = user_id);

-- Session configs
CREATE POLICY "Users can manage own configs" ON public.session_configs
    FOR ALL USING (auth.uid() = user_id);

-- Exports
CREATE POLICY "Users can view own exports" ON public.exports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create exports" ON public.exports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Export bundles
CREATE POLICY "Users can manage own bundles" ON public.export_bundles
    FOR ALL USING (auth.uid() = user_id);

-- User entitlements
CREATE POLICY "Users can view own entitlements" ON public.user_entitlements
    FOR SELECT USING (auth.uid() = user_id);

-- Feature usage
CREATE POLICY "Users can view own usage" ON public.feature_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can track own usage" ON public.feature_usage
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User activity
CREATE POLICY "Users can view own activity" ON public.user_activity
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can log user activity" ON public.user_activity
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for modules and entitlements
CREATE POLICY "Anyone can view modules" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Anyone can view base entitlements" ON public.entitlements FOR SELECT USING (true);
CREATE POLICY "Anyone can view module usage stats" ON public.module_usage FOR SELECT USING (true);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User lookup indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_stripe_customer ON public.users(stripe_customer_id);
CREATE INDEX idx_users_plan ON public.users(plan);

-- Prompt runs indexes
CREATE INDEX idx_prompt_runs_user_id ON public.prompt_runs(user_id);
CREATE INDEX idx_prompt_runs_module_id ON public.prompt_runs(module_id);
CREATE INDEX idx_prompt_runs_created_at ON public.prompt_runs(created_at DESC);
CREATE INDEX idx_prompt_runs_status ON public.prompt_runs(status);

-- Export indexes
CREATE INDEX idx_exports_user_id ON public.exports(user_id);
CREATE INDEX idx_exports_created_at ON public.exports(created_at DESC);

-- Feature usage indexes
CREATE INDEX idx_feature_usage_user_date ON public.feature_usage(user_id, usage_date);
CREATE INDEX idx_feature_usage_feature_key ON public.feature_usage(feature_key);

-- Activity tracking
CREATE INDEX idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX idx_user_activity_created_at ON public.user_activity(created_at DESC);

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
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_session_configs_updated_at BEFORE UPDATE ON public.session_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INITIAL DATA SEEDING
-- ============================================================================

-- Default entitlements per plan
INSERT INTO public.entitlements (plan, feature_key, is_enabled, limit_value) VALUES
-- Pilot plan
('pilot', 'generator_access', true, NULL),
('pilot', 'basic_modules', true, 12),
('pilot', 'export_txt', true, NULL),
('pilot', 'export_md', true, NULL),
('pilot', 'monthly_runs', true, 50),

-- Pro plan  
('pro', 'generator_access', true, NULL),
('pro', 'all_modules', true, NULL),
('pro', 'gpt_testing', true, NULL),
('pro', 'export_txt', true, NULL),
('pro', 'export_md', true, NULL),
('pro', 'export_json', true, NULL),
('pro', 'export_pdf', true, NULL),
('pro', 'cloud_history', true, NULL),
('pro', 'monthly_runs', true, 500),

-- Enterprise plan
('enterprise', 'generator_access', true, NULL),
('enterprise', 'all_modules', true, NULL),
('enterprise', 'gpt_testing', true, NULL),
('enterprise', 'api_access', true, NULL),
('enterprise', 'export_txt', true, NULL),
('enterprise', 'export_md', true, NULL),
('enterprise', 'export_json', true, NULL),
('enterprise', 'export_pdf', true, NULL),
('enterprise', 'export_zip', true, NULL),
('enterprise', 'cloud_history', true, NULL),
('enterprise', 'custom_modules', true, NULL),
('enterprise', 'whitelabel', true, NULL),
('enterprise', 'monthly_runs', true, NULL); -- NULL = unlimited
