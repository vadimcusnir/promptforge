-- PromptForge Installation Status Check
-- Run this to see what's already been installed

-- Check if basic tables exist
SELECT 
    'Tables Status' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orgs') THEN '✅ orgs'
        ELSE '❌ orgs MISSING'
    END as orgs_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'plans') THEN '✅ plans'
        ELSE '❌ plans MISSING'
    END as plans_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'entitlements') THEN '✅ entitlements'
        ELSE '❌ entitlements MISSING'
    END as entitlements_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'modules') THEN '✅ modules'
        ELSE '❌ modules MISSING'
    END as modules_status,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'runs') THEN '✅ runs'
        ELSE '❌ runs MISSING'
    END as runs_status;

-- Check if key functions exist
SELECT 
    'Functions Status' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'trg_set_updated_at') THEN '✅ trg_set_updated_at'
        ELSE '❌ trg_set_updated_at MISSING'
    END as basic_functions,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'pf_apply_plan_entitlements') THEN '✅ pf_apply_plan_entitlements'
        ELSE '❌ pf_apply_plan_entitlements MISSING'
    END as entitlements_function,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'run_all_qa_tests') THEN '✅ run_all_qa_tests'
        ELSE '❌ run_all_qa_tests MISSING (need migration 009)'
    END as qa_function;

-- Check what migrations appear to be completed
SELECT 
    'Migration Status' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'get_current_user_id') THEN '✅ Migration 001 (Extensions)'
        ELSE '❌ Migration 001 MISSING'
    END as migration_001,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orgs') THEN '✅ Migration 002 (Orgs)'
        ELSE '❌ Migration 002 MISSING'
    END as migration_002,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'plans') THEN '✅ Migration 003 (Billing)'
        ELSE '❌ Migration 003 MISSING'
    END as migration_003,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'modules') THEN '✅ Migration 004 (Catalog)'
        ELSE '❌ Migration 004 MISSING'
    END as migration_004,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'runs') THEN '✅ Migration 005 (History)'
        ELSE '❌ Migration 005 MISSING'
    END as migration_005;

-- Check for sample data
SELECT 
    'Data Status' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM plans WHERE code = 'pro') THEN '✅ Plans seeded'
        ELSE '❌ Plans NOT seeded'
    END as plans_data,
    CASE 
        WHEN EXISTS (SELECT 1 FROM modules WHERE module_id = 'M01') THEN '✅ Modules seeded'
        ELSE '❌ Modules NOT seeded'
    END as modules_data,
    CASE 
        WHEN EXISTS (SELECT 1 FROM orgs WHERE slug = 'promptforge-demo') THEN '✅ Demo org created'
        ELSE '❌ Demo org NOT created'
    END as demo_org;

-- Show table counts if they exist
SELECT 
    'Current Data Counts' as info_type,
    COALESCE((SELECT COUNT(*)::text FROM orgs), 'N/A') as orgs_count,
    COALESCE((SELECT COUNT(*)::text FROM plans), 'N/A') as plans_count,
    COALESCE((SELECT COUNT(*)::text FROM modules), 'N/A') as modules_count,
    COALESCE((SELECT COUNT(*)::text FROM entitlements), 'N/A') as entitlements_count;
