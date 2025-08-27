-- PromptForge v3 Database Schema
-- Version: 1.0.0
-- Environment: Production
-- Purpose: Multi-tenant prompt engineering platform with RLS and entitlements

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types and enums
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'unpaid', 'trialing');
CREATE TYPE subscription_interval AS ENUM ('monthly', 'yearly');
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member', 'viewer');
CREATE TYPE run_status AS ENUM ('pending', 'running', 'completed', 'failed', 'canceled');
CREATE TYPE export_format AS ENUM ('txt', 'md', 'json', 'pdf', 'bundle');
CREATE TYPE domain_type AS ENUM (
    'business_strategy', 'marketing', 'sales', 'customer_service', 'product_development',
    'operations', 'finance', 'hr', 'legal', 'compliance', 'software_development',
    'data_science', 'ai_ml', 'cybersecurity', 'devops', 'cloud_computing',
    'blockchain', 'iot', 'content_creation', 'design', 'copywriting',
    'translation', 'education', 'research', 'general'
);
CREATE TYPE scale_type AS ENUM ('micro', 'small', 'medium', 'large', 'enterprise');
CREATE TYPE urgency_type AS ENUM ('critical', 'urgent', 'high', 'normal', 'low');
CREATE TYPE complexity_type AS ENUM ('trivial', 'simple', 'moderate', 'complex', 'expert');
CREATE TYPE resources_type AS ENUM ('minimal', 'limited', 'standard', 'advanced', 'enterprise');
CREATE TYPE application_type AS ENUM ('personal', 'team', 'department', 'organization', 'external');
CREATE TYPE output_format_type AS ENUM ('text', 'markdown', 'json', 'csv', 'xml', 'yaml', 'code', 'documentation');

-- Organizations table - Core tenant entity
CREATE TABLE orgs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    industry VARCHAR(100),
    size VARCHAR(50),
    country VARCHAR(2),
    timezone VARCHAR(50) DEFAULT 'UTC',
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false
);

-- Organization members - User-org relationships
CREATE TABLE org_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- References auth.users from Supabase
    role user_role NOT NULL DEFAULT 'member',
    permissions JSONB DEFAULT '{}',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invited_by UUID,
    invited_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(org_id, user_id)
);

-- Subscription plans - Available plan tiers
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    features JSONB NOT NULL DEFAULT '{}',
    limits JSONB NOT NULL DEFAULT '{}',
    entitlements JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_custom BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions - Active subscriptions per user
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References auth.users from Supabase
    org_id UUID REFERENCES orgs(id) ON DELETE SET NULL,
    plan_id UUID NOT NULL REFERENCES plans(id),
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    status subscription_status NOT NULL DEFAULT 'active',
    interval subscription_interval NOT NULL DEFAULT 'monthly',
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Entitlements - Feature flags and access control
CREATE TABLE entitlements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    user_id UUID, -- NULL for org-wide entitlements
    source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('plan', 'addon', 'license', 'trial')),
    source_id UUID NOT NULL, -- References plan_id, addon_id, or license_id
    flag VARCHAR(100) NOT NULL,
    value JSONB NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(org_id, user_id, flag)
);

-- User addons - Additional features purchased
CREATE TABLE user_addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL, -- References auth.users from Supabase
    org_id UUID REFERENCES orgs(id) ON DELETE SET NULL,
    addon_type VARCHAR(100) NOT NULL,
    addon_data JSONB NOT NULL,
    stripe_product_id VARCHAR(255),
    stripe_price_id VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API keys - For programmatic access
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- References auth.users from Supabase
    name VARCHAR(255) NOT NULL,
    key_hash TEXT NOT NULL, -- Hashed API key
    permissions JSONB NOT NULL DEFAULT '{}',
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Modules - Prompt engineering modules
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES orgs(id) ON DELETE SET NULL, -- NULL for system modules
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
    category VARCHAR(100),
    tags TEXT[],
    content JSONB NOT NULL,
    parameters JSONB DEFAULT '{}',
    examples JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);

-- Module versions - Version history
CREATE TABLE module_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    version VARCHAR(50) NOT NULL,
    content JSONB NOT NULL,
    parameters JSONB DEFAULT '{}',
    changelog TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    UNIQUE(module_id, version)
);

-- Domain configurations - 7D parameter configurations
CREATE TABLE domain_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain domain_type NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    default_params JSONB NOT NULL DEFAULT '{}',
    constraints JSONB DEFAULT '{}',
    examples JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(domain)
);

-- Parameter sets - Reusable 7D configurations
CREATE TABLE parameter_sets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    domain domain_type NOT NULL,
    scale scale_type NOT NULL,
    urgency urgency_type NOT NULL,
    complexity complexity_type NOT NULL,
    resources resources_type NOT NULL,
    application application_type NOT NULL,
    output_format output_format_type NOT NULL,
    parameters JSONB DEFAULT '{}',
    tags TEXT[],
    is_template BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);

-- Prompt history - All generated prompts
CREATE TABLE prompt_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- References auth.users from Supabase
    run_id UUID, -- References runs(id)
    prompt_text TEXT NOT NULL,
    prompt_hash TEXT NOT NULL, -- Hash of prompt content
    seven_d_params JSONB NOT NULL,
    domain domain_type NOT NULL,
    scale scale_type NOT NULL,
    urgency urgency_type NOT NULL,
    complexity complexity_type NOT NULL,
    resources resources_type NOT NULL,
    application application_type NOT NULL,
    output_format output_format_type NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Runs - Execution instances
CREATE TABLE runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- References auth.users from Supabase
    module_id UUID REFERENCES modules(id),
    parameter_set_id UUID REFERENCES parameter_sets(id),
    status run_status NOT NULL DEFAULT 'pending',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    input_data JSONB DEFAULT '{}',
    output_data JSONB DEFAULT '{}',
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prompt scores - Quality assessment results
CREATE TABLE prompt_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prompt_id UUID NOT NULL REFERENCES prompt_history(id) ON DELETE CASCADE,
    run_id UUID REFERENCES runs(id),
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    clarity_score INTEGER CHECK (clarity_score >= 0 AND clarity_score <= 100),
    execution_score INTEGER CHECK (execution_score >= 0 AND execution_score <= 100),
    ambiguity_inverse_score INTEGER CHECK (ambiguity_inverse_score >= 0 AND ambiguity_inverse_score <= 100),
    business_fit_score INTEGER CHECK (business_fit_score >= 0 AND business_fit_score <= 100),
    pragmatism_score INTEGER CHECK (pragmatism_score >= 0 AND pragmatism_score <= 100),
    rubric_details JSONB DEFAULT '{}',
    feedback TEXT,
    evaluator_id UUID, -- References auth.users from Supabase
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bundles - Export packages
CREATE TABLE bundles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- References auth.users from Supabase
    run_id UUID REFERENCES runs(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    export_formats export_format[] NOT NULL,
    file_paths JSONB NOT NULL DEFAULT '[]',
    manifest JSONB NOT NULL,
    checksum TEXT NOT NULL,
    file_size_bytes BIGINT,
    download_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects - Organization projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    tags TEXT[],
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    UNIQUE(org_id, slug)
);

-- Ruleset versions - Configuration management
CREATE TABLE ruleset_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version VARCHAR(50) NOT NULL UNIQUE,
    content JSONB NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT false,
    deployed_at TIMESTAMP WITH TIME ZONE,
    deployed_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_orgs_created_at ON orgs(created_at);
CREATE INDEX idx_orgs_slug ON orgs(slug);
CREATE INDEX idx_org_members_org_id ON org_members(org_id);
CREATE INDEX idx_org_members_user_id ON org_members(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_org_id ON subscriptions(org_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_entitlements_org_id ON entitlements(org_id);
CREATE INDEX idx_entitlements_user_id ON entitlements(user_id);
CREATE INDEX idx_entitlements_flag ON entitlements(flag);
CREATE INDEX idx_api_keys_org_id ON api_keys(org_id);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_modules_org_id ON modules(org_id);
CREATE INDEX idx_modules_slug ON modules(slug);
CREATE INDEX idx_modules_category ON modules(category);
CREATE INDEX idx_domain_configs_domain ON domain_configs(domain);
CREATE INDEX idx_parameter_sets_org_id ON parameter_sets(org_id);
CREATE INDEX idx_parameter_sets_domain ON parameter_sets(domain);
CREATE INDEX idx_prompt_history_org_id ON prompt_history(org_id);
CREATE INDEX idx_prompt_history_user_id ON prompt_history(user_id);
CREATE INDEX idx_prompt_history_domain ON prompt_history(domain);
CREATE INDEX idx_prompt_history_created_at ON prompt_history(created_at);
CREATE INDEX idx_runs_org_id ON runs(org_id);
CREATE INDEX idx_runs_user_id ON runs(user_id);
CREATE INDEX idx_runs_status ON runs(status);
CREATE INDEX idx_runs_started_at ON runs(started_at);
CREATE INDEX idx_runs_org_id_started_at ON runs(org_id, started_at);
CREATE INDEX idx_prompt_scores_prompt_id ON prompt_scores(prompt_id);
CREATE INDEX idx_prompt_scores_overall_score ON prompt_scores(overall_score);
CREATE INDEX idx_bundles_org_id ON bundles(org_id);
CREATE INDEX idx_bundles_run_id ON bundles(run_id);
CREATE INDEX idx_bundles_user_id ON bundles(user_id);
CREATE INDEX idx_projects_org_id ON projects(org_id);
CREATE INDEX idx_projects_slug ON projects(slug);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_orgs_updated_at BEFORE UPDATE ON orgs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_entitlements_updated_at BEFORE UPDATE ON entitlements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_addons_updated_at BEFORE UPDATE ON user_addons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parameter_sets_updated_at BEFORE UPDATE ON parameter_sets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_domain_configs_updated_at BEFORE UPDATE ON domain_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_runs_updated_at BEFORE UPDATE ON runs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bundles_updated_at BEFORE UPDATE ON bundles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE parameter_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE ruleset_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orgs
CREATE POLICY "Users can view organizations they are members of" ON orgs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_members.org_id = orgs.id 
            AND org_members.user_id = auth.uid()
            AND org_members.is_active = true
        )
    );

CREATE POLICY "Organization owners can update their org" ON orgs
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_members.org_id = orgs.id 
            AND org_members.user_id = auth.uid()
            AND org_members.role IN ('owner', 'admin')
            AND org_members.is_active = true
        )
    );

-- RLS Policies for org_members
CREATE POLICY "Users can view members of organizations they belong to" ON org_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM org_members om
            WHERE om.org_id = org_members.org_id 
            AND om.user_id = auth.uid()
            AND om.is_active = true
        )
    );

CREATE POLICY "Organization owners and admins can manage members" ON org_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM org_members om
            WHERE om.org_id = org_members.org_id 
            AND om.user_id = auth.uid()
            AND om.role IN ('owner', 'admin')
            AND om.is_active = true
        )
    );

-- RLS Policies for plans (read-only for all authenticated users)
CREATE POLICY "All authenticated users can view plans" ON plans
    FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own subscriptions" ON subscriptions
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own subscriptions" ON subscriptions
    FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for entitlements
CREATE POLICY "Users can view entitlements for organizations they belong to" ON entitlements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_members.org_id = entitlements.org_id 
            AND org_members.user_id = auth.uid()
            AND org_members.is_active = true
        )
    );

CREATE POLICY "System can manage entitlements" ON entitlements
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for modules
CREATE POLICY "Users can view public modules and modules from their organizations" ON modules
    FOR SELECT USING (
        is_public = true OR
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_members.org_id = modules.org_id 
            AND org_members.user_id = auth.uid()
            AND org_members.is_active = true
        )
    );

CREATE POLICY "Organization members can create modules" ON modules
    FOR INSERT WITH CHECK (
        org_id IS NULL OR
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_members.org_id = modules.org_id 
            AND org_members.user_id = auth.uid()
            AND org_members.is_active = true
        )
    );

-- RLS Policies for domain_configs (read-only for all authenticated users)
CREATE POLICY "All authenticated users can view domain configs" ON domain_configs
    FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for parameter_sets
CREATE POLICY "Users can view parameter sets from their organizations" ON parameter_sets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_members.org_id = parameter_sets.org_id 
            AND org_members.user_id = auth.uid()
            AND org_members.is_active = true
        )
    );

CREATE POLICY "Organization members can manage parameter sets" ON parameter_sets
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_members.org_id = parameter_sets.org_id 
            AND org_members.user_id = auth.uid()
            AND org_members.is_active = true
        )
    );

-- RLS Policies for prompt_history
CREATE POLICY "Users can view prompts from their organizations" ON prompt_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_members.org_id = prompt_history.org_id 
            AND org_members.user_id = auth.uid()
            AND org_members.is_active = true
        )
    );

CREATE POLICY "Users can create prompts in their organizations" ON prompt_history
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_members.org_id = prompt_history.org_id 
            AND org_members.user_id = auth.uid()
            AND org_members.is_active = true
        )
    );

-- RLS Policies for runs
CREATE POLICY "Users can view runs from their organizations" ON runs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_members.org_id = runs.org_id 
            AND org_members.user_id = auth.uid()
            AND org_members.is_active = true
        )
    );

CREATE POLICY "Users can create runs in their organizations" ON runs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_members.org_id = runs.org_id 
            AND org_members.user_id = auth.uid()
            AND org_members.is_active = true
        )
    );

CREATE POLICY "Users can update their own runs" ON runs
    FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for prompt_scores
CREATE POLICY "Users can view scores for prompts from their organizations" ON prompt_scores
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM prompt_history ph
            JOIN org_members om ON om.org_id = ph.org_id
            WHERE ph.id = prompt_scores.prompt_id
            AND om.user_id = auth.uid()
            AND om.is_active = true
        )
    );

-- RLS Policies for bundles
CREATE POLICY "Users can view bundles from their organizations" ON bundles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_members.org_id = bundles.org_id 
            AND org_members.user_id = auth.uid()
            AND org_members.is_active = true
        )
    );

CREATE POLICY "Users can create bundles in their organizations" ON bundles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_members.org_id = bundles.org_id 
            AND org_members.user_id = auth.uid()
            AND org_members.is_active = true
        )
    );

-- RLS Policies for projects
CREATE POLICY "Users can view projects from their organizations" ON projects
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_members.org_id = projects.org_id 
            AND org_members.user_id = auth.uid()
            AND org_members.is_active = true
        )
    );

CREATE POLICY "Organization members can manage projects" ON projects
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM org_members 
            WHERE org_members.org_id = projects.org_id 
            AND org_members.user_id = auth.uid()
            AND org_members.is_active = true
        )
    );

-- RLS Policies for ruleset_versions (read-only for all authenticated users)
CREATE POLICY "All authenticated users can view ruleset versions" ON ruleset_versions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Seed data for plans
INSERT INTO plans (slug, name, description, price_monthly, price_yearly, features, limits, entitlements) VALUES
('pilot', 'Pilot', 'Free pilot plan for testing', 0, 0, 
 '{"basic_prompt_generation": true, "score_calculation": true}', 
 '{"max_prompts_per_month": 10, "max_export_size_mb": 5}',
 '{"canExportPDF": false, "canExportJSON": true, "canExportBundleZip": false, "canUseGptTestReal": false, "canUseAPI": false}'),
('pro', 'Pro', 'Professional plan for teams', 29, 290,
 '{"advanced_prompt_generation": true, "full_score_analysis": true, "pdf_export": true, "basic_analytics": true}',
 '{"max_prompts_per_month": 1000, "max_export_size_mb": 50}',
 '{"canExportPDF": true, "canExportJSON": true, "canExportBundleZip": false, "canUseGptTestReal": true, "canUseAPI": false}'),
('enterprise', 'Enterprise', 'Enterprise plan with custom features', 99, 990,
 '{"unlimited_prompts": true, "custom_export_formats": true, "advanced_api_access": true, "dedicated_support": true}',
 '{"max_prompts_per_month": -1, "max_export_size_mb": 500}',
 '{"canExportPDF": true, "canExportJSON": true, "canExportBundleZip": true, "canUseGptTestReal": true, "canUseAPI": true}');

-- Seed data for domain_configs (CORE 25)
INSERT INTO domain_configs (domain, name, description, default_params, constraints) VALUES
('business_strategy', 'Business Strategy', 'Strategic planning and business development', 
 '{"scale": "large", "urgency": "normal", "complexity": "complex", "resources": "advanced", "application": "organization", "output_format": "documentation"}',
 '{"min_score": 80, "required_expertise": "business"}'),
('marketing', 'Marketing', 'Marketing campaigns and strategies', 
 '{"scale": "medium", "urgency": "high", "complexity": "moderate", "resources": "standard", "application": "department", "output_format": "markdown"}',
 '{"min_score": 75, "required_expertise": "marketing"}'),
('sales', 'Sales', 'Sales processes and techniques', 
 '{"scale": "medium", "urgency": "high", "complexity": "moderate", "resources": "standard", "application": "team", "output_format": "text"}',
 '{"min_score": 75, "required_expertise": "sales"}'),
('customer_service', 'Customer Service', 'Customer support and service', 
 '{"scale": "small", "urgency": "critical", "complexity": "simple", "resources": "limited", "application": "team", "output_format": "text"}',
 '{"min_score": 70, "required_expertise": "customer_service"}'),
('product_development', 'Product Development', 'Product design and development', 
 '{"scale": "large", "urgency": "normal", "complexity": "complex", "resources": "advanced", "application": "organization", "output_format": "documentation"}',
 '{"min_score": 80, "required_expertise": "product"}'),
('operations', 'Operations', 'Operational processes and efficiency', 
 '{"scale": "medium", "urgency": "normal", "complexity": "moderate", "resources": "standard", "application": "department", "output_format": "markdown"}',
 '{"min_score": 75, "required_expertise": "operations"}'),
('finance', 'Finance', 'Financial analysis and planning', 
 '{"scale": "medium", "urgency": "high", "complexity": "complex", "resources": "advanced", "application": "department", "output_format": "json"}',
 '{"min_score": 80, "required_expertise": "finance"}'),
('hr', 'Human Resources', 'HR processes and policies', 
 '{"scale": "medium", "urgency": "normal", "complexity": "moderate", "resources": "standard", "application": "department", "output_format": "markdown"}',
 '{"min_score": 75, "required_expertise": "hr"}'),
('legal', 'Legal', 'Legal documentation and compliance', 
 '{"scale": "medium", "urgency": "critical", "complexity": "complex", "resources": "advanced", "application": "department", "output_format": "documentation"}',
 '{"min_score": 85, "required_expertise": "legal"}'),
('compliance', 'Compliance', 'Regulatory compliance and audits', 
 '{"scale": "large", "urgency": "high", "complexity": "expert", "resources": "enterprise", "application": "organization", "output_format": "documentation"}',
 '{"min_score": 90, "required_expertise": "compliance"}'),
('software_development', 'Software Development', 'Software engineering and development', 
 '{"scale": "medium", "urgency": "normal", "complexity": "complex", "resources": "advanced", "application": "team", "output_format": "code"}',
 '{"min_score": 80, "required_expertise": "software"}'),
('data_science', 'Data Science', 'Data analysis and machine learning', 
 '{"scale": "medium", "urgency": "normal", "complexity": "expert", "resources": "advanced", "application": "team", "output_format": "json"}',
 '{"min_score": 85, "required_expertise": "data_science"}'),
('ai_ml', 'AI/ML', 'Artificial intelligence and machine learning', 
 '{"scale": "large", "urgency": "normal", "complexity": "expert", "resources": "enterprise", "application": "organization", "output_format": "code"}',
 '{"min_score": 90, "required_expertise": "ai_ml"}'),
('cybersecurity', 'Cybersecurity', 'Security and threat protection', 
 '{"scale": "medium", "urgency": "critical", "complexity": "expert", "resources": "advanced", "application": "department", "output_format": "documentation"}',
 '{"min_score": 85, "required_expertise": "cybersecurity"}'),
('devops', 'DevOps', 'Development operations and infrastructure', 
 '{"scale": "medium", "urgency": "normal", "complexity": "complex", "resources": "advanced", "application": "team", "output_format": "yaml"}',
 '{"min_score": 80, "required_expertise": "devops"}'),
('cloud_computing', 'Cloud Computing', 'Cloud infrastructure and services', 
 '{"scale": "large", "urgency": "normal", "complexity": "complex", "resources": "enterprise", "application": "organization", "output_format": "yaml"}',
 '{"min_score": 80, "required_expertise": "cloud"}'),
('blockchain', 'Blockchain', 'Blockchain and distributed systems', 
 '{"scale": "large", "urgency": "normal", "complexity": "expert", "resources": "enterprise", "application": "organization", "output_format": "code"}',
 '{"min_score": 90, "required_expertise": "blockchain"}'),
('iot', 'IoT', 'Internet of Things and connected devices', 
 '{"scale": "medium", "urgency": "normal", "complexity": "complex", "resources": "advanced", "application": "team", "output_format": "json"}',
 '{"min_score": 80, "required_expertise": "iot"}'),
('content_creation', 'Content Creation', 'Content writing and creation', 
 '{"scale": "small", "urgency": "normal", "complexity": "simple", "resources": "limited", "application": "personal", "output_format": "markdown"}',
 '{"min_score": 70, "required_expertise": "content"}'),
('design', 'Design', 'Graphic and visual design', 
 '{"scale": "small", "urgency": "normal", "complexity": "moderate", "resources": "standard", "application": "team", "output_format": "markdown"}',
 '{"min_score": 75, "required_expertise": "design"}'),
('copywriting', 'Copywriting', 'Marketing copy and advertising', 
 '{"scale": "small", "urgency": "high", "complexity": "simple", "resources": "limited", "application": "team", "output_format": "text"}',
 '{"min_score": 70, "required_expertise": "copywriting"}'),
('translation', 'Translation', 'Language translation and localization', 
 '{"scale": "small", "urgency": "normal", "complexity": "moderate", "resources": "standard", "application": "team", "output_format": "text"}',
 '{"min_score": 75, "required_expertise": "translation"}'),
('education', 'Education', 'Educational content and training', 
 '{"scale": "medium", "urgency": "normal", "complexity": "moderate", "resources": "standard", "application": "organization", "output_format": "markdown"}',
 '{"min_score": 75, "required_expertise": "education"}'),
('research', 'Research', 'Research and analysis', 
 '{"scale": "large", "urgency": "low", "complexity": "expert", "resources": "advanced", "application": "organization", "output_format": "documentation"}',
 '{"min_score": 85, "required_expertise": "research"}'),
('general', 'General', 'General purpose prompts', 
 '{"scale": "small", "urgency": "normal", "complexity": "simple", "resources": "minimal", "application": "personal", "output_format": "text"}',
 '{"min_score": 60, "required_expertise": "none"}');

-- Seed data for modules (M01-M50 demo)
INSERT INTO modules (slug, name, description, category, tags, content, parameters, is_public) VALUES
('M01', 'Business Plan Generator', 'Generate comprehensive business plans', 'business', ARRAY['business', 'planning', 'strategy'], 
 '{"template": "business_plan", "sections": ["executive_summary", "market_analysis", "financial_projections"]}', 
 '{"industry": "string", "target_market": "string", "funding_needed": "number"}', true),
('M02', 'Marketing Campaign Creator', 'Create marketing campaign strategies', 'marketing', ARRAY['marketing', 'campaign', 'strategy'], 
 '{"template": "marketing_campaign", "channels": ["social_media", "email", "ppc"]}', 
 '{"product": "string", "audience": "string", "budget": "number"}', true),
('M03', 'Sales Pitch Generator', 'Generate compelling sales pitches', 'sales', ARRAY['sales', 'pitch', 'conversion'], 
 '{"template": "sales_pitch", "structure": ["hook", "problem", "solution", "proof", "call_to_action"]}', 
 '{"product": "string", "target_audience": "string", "pain_point": "string"}', true),
('M04', 'Customer Service Script', 'Create customer service responses', 'customer_service', ARRAY['customer_service', 'script', 'support'], 
 '{"template": "customer_service", "tone": "professional", "empathy_level": "high"}', 
 '{"issue_type": "string", "customer_mood": "string", "urgency": "string"}', true),
('M05', 'Product Requirements Doc', 'Generate product requirement documents', 'product_development', ARRAY['product', 'requirements', 'specification'], 
 '{"template": "product_requirements", "sections": ["overview", "features", "constraints", "acceptance_criteria"]}', 
 '{"product_name": "string", "target_users": "string", "core_features": "array"}', true);

-- Insert ruleset version
INSERT INTO ruleset_versions (version, content, description, is_active) VALUES
('1.0.0', '{"version": "1.0.0", "schema_version": "2024.12.19"}', 'Initial production ruleset', true);

-- Create function to check user organization membership
CREATE OR REPLACE FUNCTION check_user_org_membership(org_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM org_members 
        WHERE org_id = org_uuid 
        AND user_id = user_uuid 
        AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's organizations
CREATE OR REPLACE FUNCTION get_user_organizations(user_uuid UUID)
RETURNS TABLE(org_id UUID, role user_role) AS $$
BEGIN
    RETURN QUERY
    SELECT om.org_id, om.role
    FROM org_members om
    WHERE om.user_id = user_uuid 
    AND om.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT INSERT, UPDATE, DELETE ON orgs, org_members, modules, parameter_sets, prompt_history, runs, prompt_scores, bundles, projects TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create view for user entitlements
CREATE VIEW user_entitlements AS
SELECT 
    e.org_id,
    e.user_id,
    e.flag,
    e.value,
    e.expires_at,
    p.name as plan_name,
    p.slug as plan_slug
FROM entitlements e
LEFT JOIN plans p ON e.source_id = p.id AND e.source_type = 'plan'
WHERE e.is_active = true;

-- Grant access to the view
GRANT SELECT ON user_entitlements TO authenticated;

-- Create materialized view for organization statistics
CREATE MATERIALIZED VIEW org_statistics AS
SELECT 
    o.id as org_id,
    o.name as org_name,
    COUNT(DISTINCT om.user_id) as member_count,
    COUNT(DISTINCT r.id) as total_runs,
    COUNT(DISTINCT ph.id) as total_prompts,
    AVG(ps.overall_score) as avg_score,
    COUNT(DISTINCT b.id) as total_bundles
FROM orgs o
LEFT JOIN org_members om ON o.id = om.org_id AND om.is_active = true
LEFT JOIN runs r ON o.id = r.org_id
LEFT JOIN prompt_history ph ON o.id = ph.org_id
LEFT JOIN prompt_scores ps ON ph.id = ps.prompt_id
LEFT JOIN bundles b ON o.id = b.org_id
GROUP BY o.id, o.name;

-- Create index on the materialized view
CREATE INDEX idx_org_statistics_org_id ON org_statistics(org_id);

-- Refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_org_statistics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW org_statistics;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION refresh_org_statistics() TO authenticated;

-- Final verification queries
-- These can be run to verify the schema is working correctly
/*
-- Check table count
SELECT COUNT(*) as table_count FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Check index count
SELECT COUNT(*) as index_count FROM pg_indexes 
WHERE schemaname = 'public';

-- Check seed data
SELECT 'plans' as table_name, COUNT(*) as count FROM plans
UNION ALL
SELECT 'domain_configs', COUNT(*) FROM domain_configs
UNION ALL
SELECT 'modules', COUNT(*) FROM modules
UNION ALL
SELECT 'ruleset_versions', COUNT(*) FROM ruleset_versions;
*/
