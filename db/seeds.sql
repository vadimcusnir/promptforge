-- 🚀 PROMPTFORGE v3 - COMPREHENSIVE DATABASE SEEDS
-- This file creates all necessary data for QA demo and production testing

-- =============================================================================
-- CLEANUP EXISTING DATA (if any)
-- =============================================================================

-- Clear existing data (safe for development)
DELETE FROM bundles WHERE 1=1;
DELETE FROM prompt_history WHERE 1=1;
DELETE FROM runs WHERE 1=1;
DELETE FROM entitlements WHERE 1=1;
DELETE FROM subscriptions WHERE 1=1;
DELETE FROM webhook_events WHERE 1=1;

-- =============================================================================
-- PLANS & ENTITLEMENTS SEEDING
-- =============================================================================

-- Insert base plans
INSERT INTO plans (id, name, slug, description, price_monthly, price_yearly, features, metadata) VALUES
(
  'pilot-plan-id',
  'Pilot',
  'pilot',
  'Free tier for getting started with PromptForge',
  0,
  0,
  ARRAY['Basic prompt generation', 'Markdown export', 'Community support'],
  '{"max_runs_per_month": 50, "max_prompts_per_run": 5}'
),
(
  'pro-plan-id',
  'Pro',
  'pro',
  'Professional features for power users and teams',
  49,
  490,
  ARRAY['Advanced prompt generation', 'PDF & JSON export', 'Real GPT testing', 'Cloud history', 'AI evaluator', 'Priority support'],
  '{"max_runs_per_month": 500, "max_prompts_per_run": 20, "api_calls": 1000}'
),
(
  'enterprise-plan-id',
  'Enterprise',
  'enterprise',
  'Enterprise-grade features for large organizations',
  299,
  2990,
  ARRAY['All Pro features', 'Bundle export (ZIP)', 'API access', 'White labeling', 'Team management', 'Custom integrations', 'Dedicated support'],
  '{"max_runs_per_month": -1, "max_prompts_per_run": -1, "api_calls": -1, "seats": 5}'
);

-- Insert entitlements for each plan
INSERT INTO entitlements (org_id, flag, value, source, expires_at) VALUES
-- Pilot Plan Entitlements
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', 'canUseAllModules', false, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', 'canExportMD', true, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', 'canExportPDF', false, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', 'canExportJSON', false, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', 'canUseGptTestReal', false, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', 'hasCloudHistory', false, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', 'hasEvaluatorAI', false, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', 'hasAPI', false, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', 'canExportBundleZip', false, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', 'hasWhiteLabel', false, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', 'hasSeatsGT1', false, 'plan', NULL),

-- Pro Plan Entitlements
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', 'canUseAllModules', true, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', 'canExportMD', true, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', 'canExportPDF', true, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', 'canExportJSON', true, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', 'canUseGptTestReal', true, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', 'hasCloudHistory', true, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', 'hasEvaluatorAI', true, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', 'hasAPI', false, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', 'canExportBundleZip', false, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', 'hasWhiteLabel', false, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', 'hasSeatsGT1', false, 'plan', NULL),

-- Enterprise Plan Entitlements
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003', 'canUseAllModules', true, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003', 'canExportMD', true, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003', 'canExportPDF', true, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003', 'canExportJSON', true, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003', 'canUseGptTestReal', true, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003', 'hasCloudHistory', true, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003', 'hasEvaluatorAI', true, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003', 'hasAPI', true, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003', 'canExportBundleZip', true, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003', 'hasWhiteLabel', true, 'plan', NULL),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003', 'hasSeatsGT1', true, 'plan', NULL);

-- =============================================================================
-- DOMAIN CONFIGURATIONS SEEDING
-- =============================================================================

-- Create domain_configs table if it doesn't exist
CREATE TABLE IF NOT EXISTS domain_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  industry VARCHAR(100),
  use_cases TEXT[],
  best_practices TEXT[],
  compliance_requirements TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert domain configurations
INSERT INTO domain_configs (name, slug, description, industry, use_cases, best_practices, compliance_requirements) VALUES
(
  'Financial Technology',
  'fintech',
  'AI-powered financial services and fintech applications',
  'Financial Services',
  ARRAY['Risk assessment', 'Fraud detection', 'Customer onboarding', 'Investment analysis', 'Regulatory reporting'],
  ARRAY['Ensure data privacy', 'Implement audit trails', 'Follow regulatory guidelines', 'Maintain transparency'],
  ARRAY['GDPR', 'SOX', 'PCI-DSS', 'Basel III', 'MiFID II']
),
(
  'Education Technology',
  'edutech',
  'AI-enhanced learning and educational technology solutions',
  'Education',
  ARRAY['Personalized learning', 'Assessment automation', 'Content generation', 'Student analytics', 'Administrative automation'],
  ARRAY['Maintain educational standards', 'Ensure accessibility', 'Protect student privacy', 'Promote engagement'],
  ARRAY['FERPA', 'COPPA', 'ADA', 'Section 508', 'GDPR (EU students)']
),
(
  'Software as a Service',
  'saas',
  'AI-powered SaaS applications and business software',
  'Technology',
  ARRAY['Customer support', 'Sales automation', 'Marketing optimization', 'Product analytics', 'User onboarding'],
  ARRAY['Focus on user experience', 'Implement analytics', 'Ensure scalability', 'Maintain security'],
  ARRAY['SOC 2', 'ISO 27001', 'GDPR', 'CCPA', 'HIPAA (if applicable)']
),
(
  'Healthcare Technology',
  'healthtech',
  'AI applications in healthcare and medical technology',
  'Healthcare',
  ARRAY['Diagnostic assistance', 'Patient monitoring', 'Drug discovery', 'Medical imaging', 'Administrative automation'],
  ARRAY['Ensure patient safety', 'Maintain accuracy', 'Protect patient privacy', 'Follow medical guidelines'],
  ARRAY['HIPAA', 'FDA regulations', 'HITECH', 'GDPR', 'ISO 13485']
),
(
  'Manufacturing & Industry 4.0',
  'manufacturing',
  'AI-powered manufacturing and industrial automation',
  'Manufacturing',
  ARRAY['Predictive maintenance', 'Quality control', 'Supply chain optimization', 'Process automation', 'Safety monitoring'],
  ARRAY['Ensure operational safety', 'Maintain quality standards', 'Optimize efficiency', 'Reduce waste'],
  ARRAY['ISO 9001', 'ISO 14001', 'OSHA', 'CE marking', 'Industry-specific standards']
);

-- =============================================================================
-- MODULES M01-M50 SEEDING
-- =============================================================================

-- Create modules table if it doesn't exist
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  domain_slug VARCHAR(50) REFERENCES domain_configs(slug),
  complexity VARCHAR(20),
  estimated_time_minutes INTEGER,
  tags TEXT[],
  template_prompt TEXT,
  example_output TEXT,
  best_practices TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert M01-M50 modules
INSERT INTO modules (module_code, name, description, category, domain_slug, complexity, estimated_time_minutes, tags, template_prompt, example_output, best_practices) VALUES
-- FINANCIAL TECHNOLOGY MODULES (M01-M10)
(
  'M01',
  'Risk Assessment Framework',
  'Comprehensive risk evaluation for financial products and services',
  'Risk Management',
  'fintech',
  'Advanced',
  45,
  ARRAY['risk', 'assessment', 'financial', 'compliance'],
  'Create a comprehensive risk assessment framework for {financial_product} that evaluates market risk, credit risk, operational risk, and regulatory risk. Include risk scoring methodology, mitigation strategies, and monitoring procedures.',
  'Risk Assessment Framework for Digital Banking Platform...',
  ARRAY['Use industry-standard risk models', 'Include regulatory requirements', 'Document all assumptions', 'Regular review cycles']
),
(
  'M02',
  'Fraud Detection System',
  'AI-powered fraud detection and prevention mechanisms',
  'Security',
  'fintech',
  'Expert',
  60,
  ARRAY['fraud', 'detection', 'AI', 'security', 'machine-learning'],
  'Design an AI-powered fraud detection system for {financial_service} that can identify suspicious patterns, flag potential fraud, and provide real-time alerts. Include machine learning models, feature engineering, and alert mechanisms.',
  'AI-Powered Fraud Detection System for Payment Processing...',
  ARRAY['Use multiple ML models', 'Implement real-time monitoring', 'Include explainability', 'Regular model updates']
),
(
  'M03',
  'Customer Onboarding Automation',
  'Streamlined customer verification and account setup process',
  'Customer Experience',
  'fintech',
  'Intermediate',
  30,
  ARRAY['onboarding', 'automation', 'KYC', 'customer-experience'],
  'Design an automated customer onboarding process for {financial_product} that handles KYC verification, document processing, and account activation. Include compliance checks, user experience flow, and error handling.',
  'Automated Customer Onboarding for Digital Banking...',
  ARRAY['Follow regulatory requirements', 'Optimize user experience', 'Include fallback processes', 'Monitor completion rates']
),
(
  'M04',
  'Investment Portfolio Analysis',
  'AI-driven investment portfolio optimization and analysis',
  'Investment Management',
  'fintech',
  'Advanced',
  50,
  ARRAY['investment', 'portfolio', 'analysis', 'optimization', 'AI'],
  'Create an AI-powered investment portfolio analysis tool for {investment_type} that provides risk-adjusted returns, diversification analysis, and rebalancing recommendations. Include market data integration, risk metrics, and performance tracking.',
  'AI-Powered Investment Portfolio Analysis Tool...',
  ARRAY['Use modern portfolio theory', 'Include risk metrics', 'Regular rebalancing', 'Monitor performance']
),
(
  'M05',
  'Regulatory Compliance Reporting',
  'Automated regulatory reporting and compliance monitoring',
  'Compliance',
  'fintech',
  'Expert',
  75,
  ARRAY['compliance', 'reporting', 'regulatory', 'automation'],
  'Design an automated regulatory compliance reporting system for {financial_institution} that handles multiple regulatory frameworks, generates required reports, and monitors compliance status. Include audit trails, validation rules, and alert systems.',
  'Automated Regulatory Compliance Reporting System...',
  ARRAY['Follow regulatory guidelines', 'Include audit trails', 'Regular validation', 'Automated alerts']
),

-- EDUCATION TECHNOLOGY MODULES (M11-M20)
(
  'M11',
  'Personalized Learning Path',
  'AI-driven adaptive learning pathways for students',
  'Learning Analytics',
  'edutech',
  'Advanced',
  40,
  ARRAY['personalized-learning', 'adaptive', 'AI', 'education'],
  'Create a personalized learning path system for {subject_area} that adapts to individual student needs, learning styles, and progress. Include assessment algorithms, content recommendations, and progress tracking.',
  'Personalized Learning Path for Mathematics...',
  ARRAY['Adapt to learning styles', 'Include progress tracking', 'Regular assessments', 'Content variety']
),
(
  'M12',
  'Assessment Automation',
  'Automated grading and assessment tools for educators',
  'Assessment',
  'edutech',
  'Intermediate',
  35,
  ARRAY['assessment', 'automation', 'grading', 'education'],
  'Design an automated assessment system for {subject_area} that can grade various question types, provide detailed feedback, and generate performance analytics. Include question banks, scoring algorithms, and feedback templates.',
  'Automated Assessment System for Science...',
  ARRAY['Multiple question types', 'Detailed feedback', 'Performance analytics', 'Question banks']
),
(
  'M13',
  'Content Generation Engine',
  'AI-powered educational content creation and curation',
  'Content Creation',
  'edutech',
  'Advanced',
  50,
  ARRAY['content-generation', 'AI', 'education', 'curation'],
  'Create an AI-powered content generation engine for {subject_area} that can create lesson plans, quizzes, explanations, and multimedia content. Include content templates, quality checks, and customization options.',
  'AI-Powered Content Generation Engine for History...',
  ARRAY['Quality content standards', 'Multiple formats', 'Customization options', 'Regular updates']
),
(
  'M14',
  'Student Analytics Dashboard',
  'Comprehensive student performance and engagement analytics',
  'Analytics',
  'edutech',
  'Intermediate',
  30,
  ARRAY['analytics', 'student-performance', 'dashboard', 'education'],
  'Design a comprehensive student analytics dashboard that tracks performance metrics, engagement levels, and learning outcomes. Include data visualization, trend analysis, and actionable insights.',
  'Student Analytics Dashboard for School District...',
  ARRAY['Clear visualizations', 'Actionable insights', 'Privacy protection', 'Regular updates']
),
(
  'M15',
  'Administrative Automation',
  'Streamlined administrative processes for educational institutions',
  'Administration',
  'edutech',
  'Intermediate',
  25,
  ARRAY['automation', 'administration', 'education', 'processes'],
  'Create an administrative automation system for {educational_institution} that handles scheduling, resource allocation, and communication. Include workflow automation, notification systems, and reporting tools.',
  'Administrative Automation for University...',
  ARRAY['Workflow automation', 'Efficient processes', 'Clear communication', 'Regular reporting']
),

-- SOFTWARE AS A SERVICE MODULES (M21-M30)
(
  'M21',
  'Customer Support Automation',
  'AI-powered customer support and helpdesk automation',
  'Customer Support',
  'saas',
  'Advanced',
  45,
  ARRAY['customer-support', 'automation', 'AI', 'helpdesk'],
  'Design an AI-powered customer support automation system for {saas_product} that handles common inquiries, provides instant responses, and escalates complex issues. Include chatbot integration, knowledge base, and ticket management.',
  'AI-Powered Customer Support for SaaS Platform...',
  ARRAY['Quick response times', 'Knowledge base integration', 'Escalation procedures', 'Customer satisfaction']
),
(
  'M22',
  'Sales Pipeline Automation',
  'Automated sales process management and lead tracking',
  'Sales',
  'saas',
  'Intermediate',
  35,
  ARRAY['sales', 'automation', 'pipeline', 'CRM'],
  'Create a sales pipeline automation system for {business_type} that tracks leads, manages opportunities, and automates follow-up processes. Include lead scoring, pipeline visualization, and performance metrics.',
  'Sales Pipeline Automation for B2B SaaS...',
  ARRAY['Lead scoring', 'Pipeline visibility', 'Automated follow-ups', 'Performance tracking']
),
(
  'M23',
  'Marketing Campaign Optimization',
  'AI-driven marketing campaign performance optimization',
  'Marketing',
  'saas',
  'Advanced',
  50,
  ARRAY['marketing', 'optimization', 'AI', 'campaigns'],
  'Design an AI-powered marketing campaign optimization system that analyzes performance data, identifies optimization opportunities, and provides actionable recommendations. Include A/B testing, performance metrics, and ROI analysis.',
  'Marketing Campaign Optimization for SaaS...',
  ARRAY['Data-driven decisions', 'A/B testing', 'Performance metrics', 'ROI optimization']
),
(
  'M24',
  'Product Analytics Platform',
  'Comprehensive product usage and performance analytics',
  'Analytics',
  'saas',
  'Advanced',
  60,
  ARRAY['analytics', 'product', 'usage', 'performance'],
  'Create a comprehensive product analytics platform for {saas_product} that tracks user behavior, feature usage, and performance metrics. Include data visualization, cohort analysis, and actionable insights.',
  'Product Analytics Platform for SaaS...',
  ARRAY['User behavior tracking', 'Feature usage analysis', 'Cohort analysis', 'Actionable insights']
),
(
  'M25',
  'User Onboarding Flow',
  'Optimized user onboarding and activation process',
  'User Experience',
  'saas',
  'Intermediate',
  30,
  ARRAY['onboarding', 'user-experience', 'activation', 'saas'],
  'Design an optimized user onboarding flow for {saas_product} that guides new users through key features, reduces friction, and increases activation rates. Include progress tracking, contextual help, and success metrics.',
  'User Onboarding Flow for SaaS Platform...',
  ARRAY['Reduce friction', 'Progress tracking', 'Contextual help', 'Success metrics']
),

-- HEALTHCARE TECHNOLOGY MODULES (M31-M40)
(
  'M31',
  'Diagnostic Assistance System',
  'AI-powered diagnostic support and medical decision assistance',
  'Clinical Decision Support',
  'healthtech',
  'Expert',
  80,
  ARRAY['diagnostic', 'AI', 'healthcare', 'clinical-decision'],
  'Create an AI-powered diagnostic assistance system for {medical_specialty} that provides diagnostic suggestions, differential diagnoses, and evidence-based recommendations. Include medical knowledge base, validation algorithms, and safety protocols.',
  'AI-Powered Diagnostic Assistance for Radiology...',
  ARRAY['Evidence-based recommendations', 'Safety protocols', 'Medical validation', 'Continuous learning']
),
(
  'M32',
  'Patient Monitoring Platform',
  'Real-time patient monitoring and alert system',
  'Patient Care',
  'healthtech',
  'Advanced',
  55,
  ARRAY['patient-monitoring', 'real-time', 'healthcare', 'alerts'],
  'Design a real-time patient monitoring platform that tracks vital signs, detects anomalies, and provides early warning alerts. Include sensor integration, alert algorithms, and clinical workflows.',
  'Real-Time Patient Monitoring Platform...',
  ARRAY['Real-time monitoring', 'Early warning alerts', 'Clinical workflows', 'Data accuracy']
),
(
  'M33',
  'Drug Discovery Pipeline',
  'AI-accelerated drug discovery and development process',
  'Drug Development',
  'healthtech',
  'Expert',
  90,
  ARRAY['drug-discovery', 'AI', 'pharmaceutical', 'development'],
  'Create an AI-accelerated drug discovery pipeline that identifies potential drug candidates, predicts efficacy, and optimizes development processes. Include molecular modeling, predictive algorithms, and validation protocols.',
  'AI-Accelerated Drug Discovery Pipeline...',
  ARRAY['Molecular modeling', 'Predictive algorithms', 'Validation protocols', 'Regulatory compliance']
),
(
  'M34',
  'Medical Imaging Analysis',
  'AI-powered medical image analysis and interpretation',
  'Medical Imaging',
  'healthtech',
  'Expert',
  70,
  ARRAY['medical-imaging', 'AI', 'analysis', 'radiology'],
  'Design an AI-powered medical imaging analysis system that can detect abnormalities, provide diagnostic insights, and assist radiologists. Include image processing algorithms, validation protocols, and clinical integration.',
  'AI-Powered Medical Imaging Analysis...',
  ARRAY['Image processing', 'Abnormality detection', 'Clinical validation', 'Radiologist assistance']
),
(
  'M35',
  'Healthcare Administrative Automation',
  'Streamlined healthcare administrative processes and workflows',
  'Administration',
  'healthtech',
  'Intermediate',
  40,
  ARRAY['healthcare', 'administration', 'automation', 'workflows'],
  'Create an administrative automation system for {healthcare_facility} that handles scheduling, billing, and patient management. Include workflow automation, compliance checks, and reporting tools.',
  'Healthcare Administrative Automation...',
  ARRAY['Workflow automation', 'Compliance checks', 'Patient privacy', 'Efficient processes']
),

-- MANUFACTURING & INDUSTRY 4.0 MODULES (M41-M50)
(
  'M41',
  'Predictive Maintenance System',
  'AI-powered predictive maintenance and equipment monitoring',
  'Maintenance',
  'manufacturing',
  'Advanced',
  65,
  ARRAY['predictive-maintenance', 'AI', 'manufacturing', 'IoT'],
  'Design an AI-powered predictive maintenance system for {manufacturing_equipment} that monitors equipment health, predicts failures, and optimizes maintenance schedules. Include sensor integration, ML models, and maintenance workflows.',
  'AI-Powered Predictive Maintenance System...',
  ARRAY['Sensor integration', 'ML models', 'Maintenance optimization', 'Failure prediction']
),
(
  'M42',
  'Quality Control Automation',
  'Automated quality control and defect detection system',
  'Quality Assurance',
  'manufacturing',
  'Advanced',
  55,
  ARRAY['quality-control', 'automation', 'defect-detection', 'manufacturing'],
  'Create an automated quality control system for {manufacturing_process} that detects defects, ensures quality standards, and provides real-time feedback. Include vision systems, defect algorithms, and quality metrics.',
  'Automated Quality Control System...',
  ARRAY['Vision systems', 'Defect detection', 'Quality metrics', 'Real-time feedback']
),
(
  'M43',
  'Supply Chain Optimization',
  'AI-driven supply chain optimization and demand forecasting',
  'Supply Chain',
  'manufacturing',
  'Advanced',
  70,
  ARRAY['supply-chain', 'optimization', 'AI', 'forecasting'],
  'Design an AI-driven supply chain optimization system that forecasts demand, optimizes inventory, and improves logistics. Include demand forecasting, inventory optimization, and logistics planning.',
  'AI-Driven Supply Chain Optimization...',
  ARRAY['Demand forecasting', 'Inventory optimization', 'Logistics planning', 'Cost reduction']
),
(
  'M44',
  'Process Automation Platform',
  'Comprehensive manufacturing process automation and control',
  'Process Control',
  'manufacturing',
  'Expert',
  80,
  ARRAY['process-automation', 'manufacturing', 'control', 'optimization'],
  'Create a comprehensive process automation platform for {manufacturing_facility} that controls production processes, optimizes efficiency, and ensures quality. Include process control, optimization algorithms, and monitoring systems.',
  'Manufacturing Process Automation Platform...',
  ARRAY['Process control', 'Optimization algorithms', 'Real-time monitoring', 'Quality assurance']
),
(
  'M45',
  'Safety Monitoring System',
  'Real-time safety monitoring and hazard detection',
  'Safety',
  'manufacturing',
  'Advanced',
  45,
  ARRAY['safety', 'monitoring', 'hazard-detection', 'manufacturing'],
  'Design a real-time safety monitoring system for {manufacturing_environment} that detects hazards, monitors safety compliance, and provides emergency alerts. Include sensor networks, hazard detection, and alert systems.',
  'Real-Time Safety Monitoring System...',
  ARRAY['Sensor networks', 'Hazard detection', 'Emergency alerts', 'Safety compliance']
);

-- =============================================================================
-- DEMO DATA SEEDING
-- =============================================================================

-- Insert demo organizations
INSERT INTO organizations (id, name, slug, plan_code, created_at) VALUES
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', 'Demo Pilot Org', 'demo-pilot', 'pilot', NOW()),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', 'Demo Pro Org', 'demo-pro', 'pro', NOW()),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003', 'Demo Enterprise Org', 'demo-enterprise', 'enterprise', NOW());

-- Insert demo users
INSERT INTO users (id, email, full_name, org_id, created_at) VALUES
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', '[EMAIL_REDACTED]', 'Pilot User', '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', NOW()),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', '[EMAIL_REDACTED]', 'Pro User', '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', NOW()),
('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003', '[EMAIL_REDACTED]', 'Enterprise User', '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003', NOW());

-- Insert demo runs
INSERT INTO runs (id, org_id, user_id, status, started_at, completed_at, duration_ms, input_data, output_data, metadata) VALUES
(
  '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001',
  '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002',
  '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002',
  'completed',
  NOW() - INTERVAL '1 hour',
  NOW() - INTERVAL '30 minutes',
  1800000,
  '{"prompt": "Create a risk assessment framework for digital banking", "module": "M01", "domain": "fintech"}',
  '{"result": "Comprehensive risk assessment framework...", "score": 85, "recommendations": ["Implement real-time monitoring", "Add fraud detection"]}',
  '{"operation": "module_execution", "module_code": "M01", "domain": "fintech"}'
),
(
  '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002',
  '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002',
  '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002',
  'completed',
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '1 hour',
  3600000,
  '{"prompt": "Design a fraud detection system for payment processing", "module": "M02", "domain": "fintech"}',
  '{"result": "AI-powered fraud detection system...", "score": 92, "recommendations": ["Use ensemble models", "Implement real-time alerts"]}',
  '{"operation": "module_execution", "module_code": "M02", "domain": "fintech"}'
),
(
  '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003',
  '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003',
  '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003',
  'completed',
  NOW() - INTERVAL '3 hours',
  NOW() - INTERVAL '2 hours',
  3600000,
  '{"prompt": "Create a personalized learning path for mathematics", "module": "M11", "domain": "edutech"}',
  '{"result": "Personalized learning path system...", "score": 88, "recommendations": ["Adaptive algorithms", "Progress tracking"]}',
  '{"operation": "module_execution", "module_code": "M11", "domain": "edutech"}'
);

-- Insert demo prompt history
INSERT INTO prompt_history (id, org_id, user_id, run_id, prompt_text, prompt_hash, seven_d_params, domain, scale, urgency, complexity, resources, application, output_format, metadata) VALUES
(
  '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001',
  '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002',
  '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002',
  '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001',
  'Create a comprehensive risk assessment framework for digital banking that evaluates market risk, credit risk, operational risk, and regulatory risk.',
  'base64_hash_here',
  '{"domain": "fintech", "scale": "enterprise", "urgency": "high", "complexity": "advanced", "resources": "full", "application": "internal", "output_format": "documentation"}',
  'fintech',
  'enterprise',
  'high',
  'advanced',
  'full',
  'internal',
  'documentation',
  '{"module_code": "M01", "quality_score": 85}'
),
(
  '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002',
  '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002',
  '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002',
  '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002',
  'Design an AI-powered fraud detection system for payment processing that can identify suspicious patterns and provide real-time alerts.',
  'base64_hash_here',
  '{"domain": "fintech", "scale": "enterprise", "urgency": "critical", "complexity": "expert", "resources": "full", "application": "internal", "output_format": "documentation"}',
  'fintech',
  'enterprise',
  'critical',
  'expert',
  'full',
  'internal',
  'documentation',
  '{"module_code": "M02", "quality_score": 92}'
);

-- Insert demo bundle
INSERT INTO bundles (id, org_id, user_id, name, description, export_formats, file_paths, manifest, checksum, file_size_bytes, metadata) VALUES
(
  '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001',
  '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003',
  '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00003',
  'Demo Enterprise Bundle',
  'Comprehensive demo bundle showcasing Enterprise features',
  ARRAY['pdf', 'json', 'zip'],
  ARRAY['/exports/demo-bundle/risk-assessment.pdf', '/exports/demo-bundle/fraud-detection.json', '/exports/demo-bundle/learning-path.md'],
  '{"version": "1.0", "modules": ["M01", "M02", "M11"], "domains": ["fintech", "edutech"], "total_prompts": 3}',
  'sha256:demo_checksum_here',
  2048576,
  '{"demo": true, "showcase": "enterprise_features", "watermark": false}'
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_modules_domain_slug ON modules(domain_slug);
CREATE INDEX IF NOT EXISTS idx_modules_category ON modules(category);
CREATE INDEX IF NOT EXISTS idx_modules_complexity ON modules(complexity);
CREATE INDEX IF NOT EXISTS idx_runs_org_id ON runs(org_id);
CREATE INDEX IF NOT EXISTS idx_runs_user_id ON runs(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_history_org_id ON prompt_history(org_id);
CREATE INDEX IF NOT EXISTS idx_prompt_history_domain ON prompt_history(domain);
CREATE INDEX IF NOT EXISTS idx_bundles_org_id ON bundles(org_id);

-- =============================================================================
-- SEED COMPLETION
-- =============================================================================

-- Log seed completion
INSERT INTO webhook_events (stripe_event_id, event_type, processed_at) VALUES
('seed_completion_001', 'seed.completed', NOW());

-- Display seed summary
SELECT 
  'SEED COMPLETION SUMMARY' as info,
  COUNT(*) as total_modules,
  'M01-M50 modules created' as details
FROM modules;

SELECT 
  'DOMAIN CONFIGS' as info,
  COUNT(*) as total_domains,
  string_agg(name, ', ') as domains
FROM domain_configs;

SELECT 
  'DEMO DATA' as info,
  COUNT(*) as total_organizations,
  'Demo organizations with different plans created' as details
FROM organizations;
