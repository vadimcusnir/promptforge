-- PromptForge Database Migration 008
-- Seed data for plans, modules and demo organization
-- Minimum viable data for testing and development

-- Insert canonical plans with feature flags
INSERT INTO plans (code, name, flags, retention_days) VALUES 
(
    'pilot',
    'Pilot Plan',
    '{
        "canUseAllModules": false,
        "canExportMD": true,
        "canExportPDF": false,
        "canExportJSON": true,
        "canUseGptTestReal": false,
        "hasAPI": false,
        "canExportBundleZip": false,
        "maxRunsPerDay": 10,
        "maxSeats": 1,
        "canUseAdvancedModules": false,
        "canCreateProjects": true,
        "maxProjects": 3
    }'::jsonb,
    7
),
(
    'pro',
    'Pro Plan', 
    '{
        "canUseAllModules": true,
        "canExportMD": true,
        "canExportPDF": true,
        "canExportJSON": true,
        "canUseGptTestReal": true,
        "hasAPI": true,
        "canExportBundleZip": true,
        "maxRunsPerDay": 100,
        "maxSeats": 5,
        "canUseAdvancedModules": true,
        "canCreateProjects": true,
        "maxProjects": 25,
        "canUseVersioning": true
    }'::jsonb,
    30
),
(
    'enterprise',
    'Enterprise Plan',
    '{
        "canUseAllModules": true,
        "canExportMD": true,
        "canExportPDF": true,
        "canExportJSON": true,
        "canUseGptTestReal": true,
        "hasAPI": true,
        "canExportBundleZip": true,
        "maxRunsPerDay": 1000,
        "maxSeats": 50,
        "canUseAdvancedModules": true,
        "canCreateProjects": true,
        "maxProjects": 100,
        "canUseVersioning": true,
        "canCustomizeModules": true,
        "hasWhiteLabel": true,
        "hasPrioritySupport": true
    }'::jsonb,
    90
);

-- Insert core domain configurations (CORE 25 industrial profiles)
INSERT INTO domain_configs (industry, jargon, kpis, compliance_notes, default_output_format, risk_level, style_bias) VALUES
(
    'FinTech',
    '{
        "terms": ["AUM", "KYC", "AML", "PCI DSS", "regulatory capital", "liquidity ratio"],
        "context": "Financial technology sector with heavy regulatory oversight"
    }'::jsonb,
    '{
        "primary": ["conversion_rate", "customer_acquisition_cost", "regulatory_compliance_score"],
        "secondary": ["transaction_volume", "fraud_detection_accuracy", "time_to_market"]
    }'::jsonb,
    'Must comply with PCI DSS, SOX, GDPR. All financial calculations require audit trails.',
    'structured',
    'high',
    '{
        "tone": "professional",
        "complexity": "technical",
        "risk_tolerance": "low"
    }'::jsonb
),
(
    'HealthTech',
    '{
        "terms": ["HIPAA", "PHI", "EHR", "clinical trials", "FDA approval", "telehealth"],
        "context": "Healthcare technology with strict privacy and safety requirements"
    }'::jsonb,
    '{
        "primary": ["patient_outcomes", "compliance_score", "data_security_rating"],
        "secondary": ["user_adoption", "clinical_efficiency", "cost_per_patient"]
    }'::jsonb,
    'HIPAA compliance mandatory. All PHI must be protected. FDA regulations for medical devices.',
    'technical',
    'critical',
    '{
        "tone": "clinical",
        "complexity": "expert",
        "risk_tolerance": "minimal"
    }'::jsonb
),
(
    'EdTech',
    '{
        "terms": ["LMS", "FERPA", "adaptive learning", "competency-based", "SCORM", "xAPI"],
        "context": "Educational technology focused on learning outcomes and accessibility"
    }'::jsonb,
    '{
        "primary": ["learning_outcomes", "engagement_rate", "completion_rate"],
        "secondary": ["accessibility_score", "teacher_satisfaction", "cost_per_student"]
    }'::jsonb,
    'FERPA compliance for student data. WCAG 2.1 AA accessibility standards required.',
    'structured',
    'medium',
    '{
        "tone": "educational",
        "complexity": "accessible",
        "risk_tolerance": "medium"
    }'::jsonb
),
(
    'E-Commerce',
    '{
        "terms": ["conversion funnel", "CAC", "LTV", "cart abandonment", "personalization", "omnichannel"],
        "context": "Online retail and marketplace platforms"
    }'::jsonb,
    '{
        "primary": ["revenue_growth", "conversion_rate", "customer_lifetime_value"],
        "secondary": ["cart_abandonment_rate", "average_order_value", "return_rate"]
    }'::jsonb,
    'PCI DSS for payment processing. GDPR/CCPA for customer data. Accessibility standards.',
    'executive',
    'medium',
    '{
        "tone": "business",
        "complexity": "moderate",
        "risk_tolerance": "medium"
    }'::jsonb
),
(
    'SaaS',
    '{
        "terms": ["MRR", "ARR", "churn", "CAC", "LTV", "product-market fit", "freemium"],
        "context": "Software as a Service platforms and applications"
    }'::jsonb,
    '{
        "primary": ["monthly_recurring_revenue", "churn_rate", "customer_acquisition_cost"],
        "secondary": ["feature_adoption", "support_ticket_volume", "uptime"]
    }'::jsonb,
    'SOC 2 Type II compliance. Data residency requirements. API rate limiting.',
    'structured',
    'medium',
    '{
        "tone": "technical",
        "complexity": "moderate",
        "risk_tolerance": "medium"
    }'::jsonb
);

-- Insert core modules (M01-M50) - Starting with essential ones for testing
INSERT INTO modules (module_id, name, vectors, requirements, spec, output_schema, kpi, guardrails, enabled) VALUES
(
    'M01',
    'Strategic Vision Generator',
    ARRAY[1, 2, 7],
    '{
        "min_complexity": "moderate",
        "required_context": ["industry", "scale", "timeframe"],
        "expertise_level": "strategic"
    }'::jsonb,
    'Generates comprehensive strategic vision statements aligned with business objectives, market positioning, and long-term goals. Incorporates industry best practices and competitive analysis.',
    '{
        "type": "object",
        "properties": {
            "vision_statement": {"type": "string", "minLength": 100},
            "key_pillars": {"type": "array", "items": {"type": "string"}},
            "success_metrics": {"type": "array", "items": {"type": "string"}},
            "timeline": {"type": "string"},
            "risks": {"type": "array", "items": {"type": "string"}}
        },
        "required": ["vision_statement", "key_pillars", "success_metrics"]
    }'::jsonb,
    'Strategic alignment score ≥85%, stakeholder buy-in probability ≥70%',
    'Must not include unrealistic timelines. Avoid generic corporate speak. Ensure measurable outcomes.',
    true
),
(
    'M10',
    'Market Analysis Engine',
    ARRAY[2, 3, 4],
    '{
        "min_complexity": "complex",
        "required_context": ["market_size", "competitors", "trends"],
        "data_sources": ["market_research", "competitor_analysis"]
    }'::jsonb,
    'Comprehensive market analysis including competitive landscape, market sizing, trends, and opportunity identification. Uses structured analytical frameworks.',
    '{
        "type": "object",
        "properties": {
            "market_size": {"type": "object"},
            "competitive_landscape": {"type": "array"},
            "key_trends": {"type": "array"},
            "opportunities": {"type": "array"},
            "threats": {"type": "array"},
            "recommendations": {"type": "array"}
        },
        "required": ["market_size", "competitive_landscape", "key_trends"]
    }'::jsonb,
    'Analysis depth score ≥80%, actionability score ≥75%',
    'Data must be recent (<6 months). Sources must be credible. Avoid speculation without evidence.',
    true
),
(
    'M18',
    'Customer Persona Builder',
    ARRAY[3, 5, 6],
    '{
        "min_complexity": "moderate",
        "required_context": ["target_market", "product_type", "user_research"],
        "methodology": "jobs_to_be_done"
    }'::jsonb,
    'Creates detailed customer personas based on research data, behavioral patterns, and market insights. Includes pain points, motivations, and journey mapping.',
    '{
        "type": "object",
        "properties": {
            "persona_name": {"type": "string"},
            "demographics": {"type": "object"},
            "psychographics": {"type": "object"},
            "pain_points": {"type": "array"},
            "motivations": {"type": "array"},
            "preferred_channels": {"type": "array"},
            "journey_stages": {"type": "array"}
        },
        "required": ["persona_name", "demographics", "pain_points", "motivations"]
    }'::jsonb,
    'Persona accuracy score ≥82%, actionability for marketing ≥78%',
    'Must be based on real data, not assumptions. Avoid stereotypes. Include diverse perspectives.',
    true
),
(
    'M25',
    'Product Roadmap Architect',
    ARRAY[1, 4, 7],
    '{
        "min_complexity": "complex",
        "required_context": ["product_vision", "resources", "market_timing"],
        "frameworks": ["OKR", "RICE", "Kano"]
    }'::jsonb,
    'Develops strategic product roadmaps with prioritized features, timeline, and resource allocation. Balances user needs, business goals, and technical constraints.',
    '{
        "type": "object",
        "properties": {
            "roadmap_timeline": {"type": "object"},
            "feature_priorities": {"type": "array"},
            "resource_requirements": {"type": "object"},
            "success_metrics": {"type": "array"},
            "dependencies": {"type": "array"},
            "risks": {"type": "array"}
        },
        "required": ["roadmap_timeline", "feature_priorities", "success_metrics"]
    }'::jsonb,
    'Feasibility score ≥80%, strategic alignment ≥85%',
    'Timeline must be realistic. Dependencies must be clearly identified. Resource constraints acknowledged.',
    true
),
(
    'M33',
    'Content Strategy Framework',
    ARRAY[5, 6],
    '{
        "min_complexity": "moderate",
        "required_context": ["audience", "brand_voice", "channels"],
        "content_types": ["blog", "social", "email", "video"]
    }'::jsonb,
    'Creates comprehensive content strategy including editorial calendar, content pillars, distribution strategy, and performance metrics.',
    '{
        "type": "object",
        "properties": {
            "content_pillars": {"type": "array"},
            "editorial_calendar": {"type": "object"},
            "channel_strategy": {"type": "object"},
            "content_types": {"type": "array"},
            "success_metrics": {"type": "array"},
            "resource_plan": {"type": "object"}
        },
        "required": ["content_pillars", "editorial_calendar", "channel_strategy"]
    }'::jsonb,
    'Content engagement prediction ≥75%, brand alignment ≥88%',
    'Content must align with brand values. Distribution must match audience preferences. Metrics must be measurable.',
    true
);

-- Create demo organization and set up initial user
-- Note: This uses a placeholder UUID - in production, this would be replaced with actual user IDs
DO $$
DECLARE
    demo_org_id UUID;
    demo_user_id UUID := '00000000-0000-0000-0000-000000000001'::UUID; -- Placeholder
BEGIN
    -- Insert demo organization
    INSERT INTO orgs (id, name, slug) 
    VALUES (gen_random_uuid(), 'PromptForge Demo', 'promptforge-demo')
    RETURNING id INTO demo_org_id;
    
    -- Add demo user as owner
    INSERT INTO org_members (org_id, user_id, role)
    VALUES (demo_org_id, demo_user_id, 'owner');
    
    -- Create demo subscription (Pro plan)
    INSERT INTO subscriptions (org_id, plan_code, status, seats, current_period_start, current_period_end)
    VALUES (
        demo_org_id, 
        'pro', 
        'active', 
        5,
        NOW(),
        NOW() + INTERVAL '30 days'
    );
    
    -- Apply Pro plan entitlements
    PERFORM pf_apply_plan_entitlements(demo_org_id, 'pro');
    
    -- Create demo project
    INSERT INTO projects (org_id, slug, name, description, created_by)
    VALUES (
        demo_org_id,
        'demo-project',
        'Demo Project',
        'Sample project for testing PromptForge functionality',
        demo_user_id
    );
    
    RAISE NOTICE 'Demo organization created with ID: %', demo_org_id;
END $$;

-- Create parameter sets for common use cases
INSERT INTO parameter_sets (domain, scale, urgency, complexity, resources, application, output_formats) VALUES
('FinTech', 'scaleup', 'high', 'complex', 'standard', 'product', ARRAY['structured', 'technical']),
('HealthTech', 'enterprise', 'critical', 'expert', 'extensive', 'client_facing', ARRAY['technical', 'executive']),
('EdTech', 'startup', 'medium', 'moderate', 'minimal', 'product', ARRAY['structured', 'narrative']),
('E-Commerce', 'enterprise', 'high', 'complex', 'extensive', 'marketing', ARRAY['executive', 'creative']),
('SaaS', 'scaleup', 'medium', 'moderate', 'standard', 'internal', ARRAY['structured', 'technical']);

-- Create some sample prompt history and runs for demo
DO $$
DECLARE
    demo_org_id UUID;
    demo_user_id UUID := '00000000-0000-0000-0000-000000000001'::UUID;
    demo_project_id UUID;
    param_set_id UUID;
    history_id UUID;
    run_id UUID;
BEGIN
    -- Get demo org and project
    SELECT id INTO demo_org_id FROM orgs WHERE slug = 'promptforge-demo';
    SELECT id INTO demo_project_id FROM projects WHERE org_id = demo_org_id LIMIT 1;
    SELECT id INTO param_set_id FROM parameter_sets WHERE domain = 'SaaS' LIMIT 1;
    
    -- Create sample prompt history
    INSERT INTO prompt_history (org_id, user_id, module_id, parameter_set_id, project_id, hash, config, output)
    VALUES (
        demo_org_id,
        demo_user_id,
        'M01',
        param_set_id,
        demo_project_id,
        'sha256:' || encode(sha256('demo-config-1'::bytea), 'hex'),
        '{
            "industry": "SaaS",
            "company_size": "scaleup",
            "target_market": "SMB",
            "product_type": "productivity_tool"
        }'::jsonb,
        'Our vision is to become the leading productivity platform for small and medium businesses, empowering teams to collaborate seamlessly and achieve their goals through intelligent automation and intuitive design.'
    ) RETURNING id INTO history_id;
    
    -- Create sample run
    INSERT INTO runs (
        org_id, user_id, module_id, parameter_set_id, project_id, prompt_history_id,
        type, status, model, tokens_used, cost_usd, duration_ms, started_at, finished_at
    ) VALUES (
        demo_org_id,
        demo_user_id,
        'M01',
        param_set_id,
        demo_project_id,
        history_id,
        'generation',
        'success',
        'gpt-4',
        1250,
        0.025,
        3500,
        NOW() - INTERVAL '1 hour',
        NOW() - INTERVAL '59 minutes'
    ) RETURNING id INTO run_id;
    
    -- Create sample score
    INSERT INTO prompt_scores (run_id, clarity, execution, ambiguity, alignment, business_fit, feedback)
    VALUES (
        run_id,
        88,
        92,
        15,  -- Low ambiguity is good
        90,
        85,
        '{
            "strengths": ["Clear strategic direction", "Measurable outcomes", "Market-focused"],
            "improvements": ["Could include more specific timelines", "Risk mitigation strategies"],
            "overall": "High-quality strategic vision with strong business alignment"
        }'::jsonb
    );
    
    -- Create sample bundle
    INSERT INTO bundles (run_id, formats, paths, checksum, license_notice)
    VALUES (
        run_id,
        ARRAY['markdown', 'json'],
        '{
            "markdown": "/exports/demo-vision-statement.md",
            "json": "/exports/demo-vision-statement.json"
        }'::jsonb,
        'sha256:' || encode(sha256('demo-bundle-content'::bytea), 'hex'),
        'Generated by PromptForge. Licensed under PromptForge Terms of Service. © 2024'
    );
    
    RAISE NOTICE 'Demo data created successfully';
END $$;

-- Update statistics for better query planning
ANALYZE plans;
ANALYZE orgs;
ANALYZE org_members;
ANALYZE subscriptions;
ANALYZE entitlements;
ANALYZE domain_configs;
ANALYZE modules;
ANALYZE parameter_sets;
ANALYZE projects;
ANALYZE prompt_history;
ANALYZE runs;
ANALYZE prompt_scores;
ANALYZE bundles;

-- Migration completed
SELECT 'Migration 008 completed: Seed data for plans, modules, demo org and sample data' as status;
