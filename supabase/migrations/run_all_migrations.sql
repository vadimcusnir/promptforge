-- PromptForge Master Migration Runner
-- Executes all migrations in the correct order
-- Run this in Supabase SQL editor to set up the complete database

-- Migration 001: Extensions and utility functions
\i 001_init_extensions_and_functions.sql

-- Migration 002: Organizations and membership with RLS
\i 002_orgs_members.sql

-- Migration 003: Billing, plans, subscriptions and entitlements
\i 003_billing_entitlements.sql

-- Migration 004: Catalog & 7D Engine modules, domains, parameter sets
\i 004_catalog_engine.sql

-- Migration 005: History, telemetry, scores and exports
\i 005_history_telemetry_scores.sql

-- Migration 006: Module versioning system (optional but recommended)
\i 006_module_versioning.sql

-- Migration 007: Critical performance indices
\i 007_performance_indices.sql

-- Migration 008: Seed data for plans, modules and demo organization
\i 008_seed_data.sql

-- Migration 009: QA testing and verification
\i 009_qa_testing.sql

-- Final verification
SELECT 'All migrations completed successfully!' as status;
SELECT 'Run the following to verify everything works:' as next_step;
SELECT 'SELECT * FROM run_all_qa_tests();' as verification_command;

-- Show summary of what was created
SELECT 
    'Tables Created' as category,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
UNION ALL
SELECT 
    'Views Created' as category,
    COUNT(*) as count
FROM information_schema.views 
WHERE table_schema = 'public'
UNION ALL
SELECT 
    'Functions Created' as category,
    COUNT(*) as count
FROM information_schema.routines 
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
UNION ALL
SELECT 
    'Custom Types Created' as category,
    COUNT(*) as count
FROM information_schema.user_defined_types 
WHERE user_defined_type_schema = 'public';
