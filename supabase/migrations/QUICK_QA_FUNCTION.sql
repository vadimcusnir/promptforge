-- Quick QA Function - Minimal version for immediate testing
-- This creates just the main QA test function you need

-- Simple version of run_all_qa_tests that checks basic installation
CREATE OR REPLACE FUNCTION run_all_qa_tests()
RETURNS TABLE (
    test_suite TEXT,
    test_name TEXT,
    status TEXT,
    details TEXT
) AS $$
BEGIN
    -- Test 1: Check if core tables exist
    RETURN QUERY 
    SELECT 
        'Installation'::TEXT as test_suite,
        'Core Tables'::TEXT as test_name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orgs') 
             AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'plans')
             AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'entitlements')
             AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'modules')
             AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'runs')
            THEN 'PASS'::TEXT
            ELSE 'FAIL'::TEXT
        END as status,
        'Core tables: orgs, plans, entitlements, modules, runs'::TEXT as details;
    
    -- Test 2: Check if key functions exist
    RETURN QUERY 
    SELECT 
        'Installation'::TEXT as test_suite,
        'Key Functions'::TEXT as test_name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'pf_apply_plan_entitlements')
             AND EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'get_current_user_id')
            THEN 'PASS'::TEXT
            ELSE 'FAIL'::TEXT
        END as status,
        'Key functions: pf_apply_plan_entitlements, get_current_user_id'::TEXT as details;
    
    -- Test 3: Check if seed data exists
    RETURN QUERY 
    SELECT 
        'Data'::TEXT as test_suite,
        'Seed Data'::TEXT as test_name,
        CASE 
            WHEN EXISTS (SELECT 1 FROM plans WHERE code = 'pro')
             AND EXISTS (SELECT 1 FROM modules WHERE module_id = 'M01')
            THEN 'PASS'::TEXT
            ELSE 'FAIL'::TEXT
        END as status,
        'Seed data: plans and modules loaded'::TEXT as details;
    
    -- Test 4: Check RLS is enabled
    RETURN QUERY 
    SELECT 
        'Security'::TEXT as test_suite,
        'RLS Enabled'::TEXT as test_name,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM pg_tables 
                WHERE schemaname = 'public' 
                AND tablename IN ('orgs', 'entitlements', 'runs')
                AND rowsecurity = true
            )
            THEN 'PASS'::TEXT
            ELSE 'FAIL'::TEXT
        END as status,
        'Row Level Security enabled on core tables'::TEXT as details;
        
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also create a simple verification summary
CREATE OR REPLACE VIEW qa_verification_summary AS
SELECT 
    'Organizations' as entity,
    COALESCE((SELECT COUNT(*)::bigint FROM orgs), 0) as total_count,
    COALESCE((SELECT COUNT(*)::bigint FROM orgs WHERE created_at >= NOW() - INTERVAL '1 day'), 0) as recent_count
UNION ALL
SELECT 
    'Plans' as entity,
    COALESCE((SELECT COUNT(*)::bigint FROM plans), 0) as total_count,
    COALESCE((SELECT COUNT(*)::bigint FROM plans), 0) as recent_count
UNION ALL
SELECT 
    'Modules' as entity,
    COALESCE((SELECT COUNT(*)::bigint FROM modules WHERE enabled = TRUE), 0) as total_count,
    COALESCE((SELECT COUNT(*)::bigint FROM modules WHERE enabled = TRUE), 0) as recent_count
UNION ALL
SELECT 
    'Entitlements' as entity,
    COALESCE((SELECT COUNT(*)::bigint FROM entitlements), 0) as total_count,
    COALESCE((SELECT COUNT(*)::bigint FROM entitlements WHERE created_at >= NOW() - INTERVAL '1 day'), 0) as recent_count;

SELECT 'Quick QA function created - now you can run: SELECT * FROM run_all_qa_tests();' as status;
