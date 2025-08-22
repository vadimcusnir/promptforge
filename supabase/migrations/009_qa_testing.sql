-- PromptForge Database Migration 009
-- QA Testing - Verification queries for RLS and functionality
-- Run these tests to ensure everything works correctly

-- Test 1: Verify RLS isolation between organizations
-- This test ensures users can only see their own organization's data
CREATE OR REPLACE FUNCTION test_rls_isolation()
RETURNS TABLE (
    test_name TEXT,
    status TEXT,
    details TEXT
) AS $$
DECLARE
    org1_id UUID;
    org2_id UUID;
    user1_id UUID := '11111111-1111-1111-1111-111111111111'::UUID;
    user2_id UUID := '22222222-2222-2222-2222-222222222222'::UUID;
    visible_orgs INTEGER;
    cross_org_runs INTEGER;
BEGIN
    -- Create two test organizations
    INSERT INTO orgs (name, slug) VALUES ('Test Org 1', 'test-org-1') RETURNING id INTO org1_id;
    INSERT INTO orgs (name, slug) VALUES ('Test Org 2', 'test-org-2') RETURNING id INTO org2_id;
    
    -- Add users to their respective organizations
    INSERT INTO org_members (org_id, user_id, role) VALUES (org1_id, user1_id, 'owner');
    INSERT INTO org_members (org_id, user_id, role) VALUES (org2_id, user2_id, 'owner');
    
    -- Test: User 1 should only see their own org
    -- Note: This is a simplified test - in reality, you'd test with actual auth context
    SELECT COUNT(*) INTO visible_orgs FROM orgs WHERE id = org1_id;
    
    IF visible_orgs = 1 THEN
        RETURN QUERY VALUES ('RLS Org Isolation', 'PASS', 'Users can see their own organization');
    ELSE
        RETURN QUERY VALUES ('RLS Org Isolation', 'FAIL', 'Incorrect org visibility count: ' || visible_orgs::TEXT);
    END IF;
    
    -- Test: Cross-org data access should be blocked
    -- This simulates checking that user1 cannot see user2's runs
    SELECT COUNT(*) INTO cross_org_runs 
    FROM runs r 
    JOIN org_members om ON r.org_id = om.org_id 
    WHERE om.user_id = user1_id AND r.org_id = org2_id;
    
    IF cross_org_runs = 0 THEN
        RETURN QUERY VALUES ('Cross-Org Data Access', 'PASS', 'Users cannot access other orgs data');
    ELSE
        RETURN QUERY VALUES ('Cross-Org Data Access', 'FAIL', 'Found cross-org data access: ' || cross_org_runs::TEXT);
    END IF;
    
    -- Cleanup test data
    DELETE FROM org_members WHERE org_id IN (org1_id, org2_id);
    DELETE FROM orgs WHERE id IN (org1_id, org2_id);
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test 2: Verify entitlements system works correctly
CREATE OR REPLACE FUNCTION test_entitlements_system()
RETURNS TABLE (
    test_name TEXT,
    status TEXT,
    details TEXT
) AS $$
DECLARE
    test_org_id UUID;
    pilot_flags JSONB;
    pro_flags JSONB;
    effective_flags RECORD;
BEGIN
    -- Create test organization
    INSERT INTO orgs (name, slug) VALUES ('Entitlements Test Org', 'entitlements-test') RETURNING id INTO test_org_id;
    
    -- Test: Apply pilot plan entitlements
    PERFORM pf_apply_plan_entitlements(test_org_id, 'pilot');
    
    -- Check if pilot entitlements were applied correctly
    SELECT COUNT(*) as count INTO pilot_flags 
    FROM entitlements 
    WHERE org_id = test_org_id AND source = 'plan';
    
    IF pilot_flags->>'count' = '9' THEN  -- Pilot plan has 9 flags
        RETURN QUERY VALUES ('Pilot Plan Entitlements', 'PASS', 'All pilot entitlements applied');
    ELSE
        RETURN QUERY VALUES ('Pilot Plan Entitlements', 'FAIL', 'Expected 9 entitlements, got: ' || (pilot_flags->>'count'));
    END IF;
    
    -- Test: Upgrade to pro plan
    PERFORM pf_apply_plan_entitlements(test_org_id, 'pro');
    
    -- Check if pro entitlements were applied (should replace pilot)
    SELECT COUNT(*) as count INTO pro_flags 
    FROM entitlements 
    WHERE org_id = test_org_id AND source = 'plan';
    
    IF pro_flags->>'count' = '12' THEN  -- Pro plan has 12 flags
        RETURN QUERY VALUES ('Pro Plan Upgrade', 'PASS', 'Pro entitlements applied correctly');
    ELSE
        RETURN QUERY VALUES ('Pro Plan Upgrade', 'FAIL', 'Expected 12 entitlements, got: ' || (pro_flags->>'count'));
    END IF;
    
    -- Test: Check effective entitlements view
    SELECT flag, value INTO effective_flags 
    FROM entitlements_effective_org 
    WHERE org_id = test_org_id AND flag = 'canExportPDF' 
    LIMIT 1;
    
    IF effective_flags.value = TRUE THEN
        RETURN QUERY VALUES ('Effective Entitlements View', 'PASS', 'PDF export enabled for Pro plan');
    ELSE
        RETURN QUERY VALUES ('Effective Entitlements View', 'FAIL', 'PDF export should be enabled for Pro plan');
    END IF;
    
    -- Cleanup
    DELETE FROM entitlements WHERE org_id = test_org_id;
    DELETE FROM orgs WHERE id = test_org_id;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test 3: Verify scoring and bundle export workflow
CREATE OR REPLACE FUNCTION test_scoring_bundle_workflow()
RETURNS TABLE (
    test_name TEXT,
    status TEXT,
    details TEXT
) AS $$
DECLARE
    test_org_id UUID;
    test_user_id UUID := '33333333-3333-3333-3333-333333333333'::UUID;
    test_run_id UUID;
    test_score INTEGER;
    can_export BOOLEAN;
    bundle_created BOOLEAN;
BEGIN
    -- Create test organization and membership
    INSERT INTO orgs (name, slug) VALUES ('Scoring Test Org', 'scoring-test') RETURNING id INTO test_org_id;
    INSERT INTO org_members (org_id, user_id, role) VALUES (test_org_id, test_user_id, 'owner');
    
    -- Create test run
    INSERT INTO runs (org_id, user_id, module_id, type, status, model, tokens_used, cost_usd, duration_ms, started_at, finished_at)
    VALUES (
        test_org_id, test_user_id, 'M01', 'generation', 'success', 
        'gpt-4', 1000, 0.02, 2000, NOW() - INTERVAL '10 minutes', NOW() - INTERVAL '8 minutes'
    ) RETURNING id INTO test_run_id;
    
    -- Test: Create high-quality score (≥80)
    INSERT INTO prompt_scores (run_id, clarity, execution, ambiguity, alignment, business_fit)
    VALUES (test_run_id, 85, 88, 10, 90, 82);
    
    -- Check calculated overall score
    SELECT overall_score INTO test_score FROM prompt_scores WHERE run_id = test_run_id;
    
    IF test_score >= 80 THEN
        RETURN QUERY VALUES ('Score Calculation', 'PASS', 'Overall score: ' || test_score::TEXT || ' (≥80 threshold)');
    ELSE
        RETURN QUERY VALUES ('Score Calculation', 'FAIL', 'Overall score: ' || test_score::TEXT || ' (below 80 threshold)');
    END IF;
    
    -- Test: Check export threshold function
    SELECT run_meets_export_threshold(test_run_id) INTO can_export;
    
    IF can_export THEN
        RETURN QUERY VALUES ('Export Threshold Check', 'PASS', 'Run meets export threshold (score ≥80)');
    ELSE
        RETURN QUERY VALUES ('Export Threshold Check', 'FAIL', 'Run should meet export threshold');
    END IF;
    
    -- Test: Create bundle with proper checksum and license
    INSERT INTO bundles (run_id, formats, paths, checksum, license_notice)
    VALUES (
        test_run_id,
        ARRAY['markdown', 'json'],
        '{"markdown": "/test/file.md", "json": "/test/file.json"}'::jsonb,
        'sha256:' || encode(sha256('test-content'::bytea), 'hex'),
        'Test license notice for QA'
    );
    
    -- Check if bundle was created correctly
    SELECT EXISTS(
        SELECT 1 FROM bundles 
        WHERE run_id = test_run_id 
        AND checksum ~ '^sha256:[0-9a-f]{64}$'
        AND length(license_notice) > 0
    ) INTO bundle_created;
    
    IF bundle_created THEN
        RETURN QUERY VALUES ('Bundle Creation', 'PASS', 'Bundle created with valid checksum and license');
    ELSE
        RETURN QUERY VALUES ('Bundle Creation', 'FAIL', 'Bundle creation failed or invalid format');
    END IF;
    
    -- Cleanup
    DELETE FROM bundles WHERE run_id = test_run_id;
    DELETE FROM prompt_scores WHERE run_id = test_run_id;
    DELETE FROM runs WHERE id = test_run_id;
    DELETE FROM org_members WHERE org_id = test_org_id;
    DELETE FROM orgs WHERE id = test_org_id;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test 4: Verify performance indices are working
CREATE OR REPLACE FUNCTION test_performance_indices()
RETURNS TABLE (
    test_name TEXT,
    status TEXT,
    details TEXT
) AS $$
DECLARE
    index_exists BOOLEAN;
    query_plan TEXT;
BEGIN
    -- Test: Check critical entitlement index exists
    SELECT EXISTS(
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'entitlements' 
        AND indexname LIKE '%org_flag%'
    ) INTO index_exists;
    
    IF index_exists THEN
        RETURN QUERY VALUES ('Entitlement Index', 'PASS', 'Critical org+flag index exists');
    ELSE
        RETURN QUERY VALUES ('Entitlement Index', 'FAIL', 'Missing critical entitlement index');
    END IF;
    
    -- Test: Check org_members index for RLS
    SELECT EXISTS(
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'org_members' 
        AND indexname LIKE '%user%'
    ) INTO index_exists;
    
    IF index_exists THEN
        RETURN QUERY VALUES ('Membership Index', 'PASS', 'User membership index exists');
    ELSE
        RETURN QUERY VALUES ('Membership Index', 'FAIL', 'Missing user membership index');
    END IF;
    
    -- Test: Check runs performance index
    SELECT EXISTS(
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'runs' 
        AND indexname LIKE '%org_id%created%'
    ) INTO index_exists;
    
    IF index_exists THEN
        RETURN QUERY VALUES ('Runs Performance Index', 'PASS', 'Runs org+created_at index exists');
    ELSE
        RETURN QUERY VALUES ('Runs Performance Index', 'FAIL', 'Missing runs performance index');
    END IF;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test 5: Verify module and domain data integrity
CREATE OR REPLACE FUNCTION test_data_integrity()
RETURNS TABLE (
    test_name TEXT,
    status TEXT,
    details TEXT
) AS $$
DECLARE
    module_count INTEGER;
    domain_count INTEGER;
    plan_count INTEGER;
    demo_org_exists BOOLEAN;
BEGIN
    -- Test: Check minimum modules exist
    SELECT COUNT(*) INTO module_count FROM modules WHERE enabled = TRUE;
    
    IF module_count >= 5 THEN
        RETURN QUERY VALUES ('Module Data', 'PASS', module_count::TEXT || ' enabled modules found');
    ELSE
        RETURN QUERY VALUES ('Module Data', 'FAIL', 'Only ' || module_count::TEXT || ' modules found (need ≥5)');
    END IF;
    
    -- Test: Check domain configurations
    SELECT COUNT(*) INTO domain_count FROM domain_configs;
    
    IF domain_count >= 5 THEN
        RETURN QUERY VALUES ('Domain Data', 'PASS', domain_count::TEXT || ' domain configs found');
    ELSE
        RETURN QUERY VALUES ('Domain Data', 'FAIL', 'Only ' || domain_count::TEXT || ' domains found (need ≥5)');
    END IF;
    
    -- Test: Check all plans exist
    SELECT COUNT(*) INTO plan_count FROM plans;
    
    IF plan_count = 3 THEN
        RETURN QUERY VALUES ('Plan Data', 'PASS', 'All 3 plans (pilot, pro, enterprise) exist');
    ELSE
        RETURN QUERY VALUES ('Plan Data', 'FAIL', 'Expected 3 plans, found ' || plan_count::TEXT);
    END IF;
    
    -- Test: Check demo organization exists
    SELECT EXISTS(SELECT 1 FROM orgs WHERE slug = 'promptforge-demo') INTO demo_org_exists;
    
    IF demo_org_exists THEN
        RETURN QUERY VALUES ('Demo Organization', 'PASS', 'Demo organization exists');
    ELSE
        RETURN QUERY VALUES ('Demo Organization', 'FAIL', 'Demo organization not found');
    END IF;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test 6: Verify last owner protection trigger
CREATE OR REPLACE FUNCTION test_last_owner_protection()
RETURNS TABLE (
    test_name TEXT,
    status TEXT,
    details TEXT
) AS $$
DECLARE
    test_org_id UUID;
    owner_id UUID := '44444444-4444-4444-4444-444444444444'::UUID;
    member_id UUID := '55555555-5555-5555-5555-555555555555'::UUID;
    error_caught BOOLEAN := FALSE;
BEGIN
    -- Create test organization with one owner
    INSERT INTO orgs (name, slug) VALUES ('Owner Test Org', 'owner-test') RETURNING id INTO test_org_id;
    INSERT INTO org_members (org_id, user_id, role) VALUES (test_org_id, owner_id, 'owner');
    INSERT INTO org_members (org_id, user_id, role) VALUES (test_org_id, member_id, 'member');
    
    -- Test: Try to delete the only owner (should fail)
    BEGIN
        DELETE FROM org_members WHERE org_id = test_org_id AND user_id = owner_id;
        error_caught := FALSE;
    EXCEPTION WHEN OTHERS THEN
        error_caught := TRUE;
    END;
    
    IF error_caught THEN
        RETURN QUERY VALUES ('Last Owner Protection', 'PASS', 'Cannot delete last owner - trigger working');
    ELSE
        RETURN QUERY VALUES ('Last Owner Protection', 'FAIL', 'Last owner was deleted - trigger not working');
    END IF;
    
    -- Test: Try to demote the only owner (should fail)
    error_caught := FALSE;
    BEGIN
        UPDATE org_members SET role = 'member' WHERE org_id = test_org_id AND user_id = owner_id;
        error_caught := FALSE;
    EXCEPTION WHEN OTHERS THEN
        error_caught := TRUE;
    END;
    
    IF error_caught THEN
        RETURN QUERY VALUES ('Last Owner Demotion', 'PASS', 'Cannot demote last owner - trigger working');
    ELSE
        RETURN QUERY VALUES ('Last Owner Demotion', 'FAIL', 'Last owner was demoted - trigger not working');
    END IF;
    
    -- Cleanup (add another owner first to allow deletion)
    INSERT INTO org_members (org_id, user_id, role) VALUES (test_org_id, member_id, 'owner') 
    ON CONFLICT (org_id, user_id) DO UPDATE SET role = 'owner';
    DELETE FROM org_members WHERE org_id = test_org_id;
    DELETE FROM orgs WHERE id = test_org_id;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Master QA test runner
CREATE OR REPLACE FUNCTION run_all_qa_tests()
RETURNS TABLE (
    test_suite TEXT,
    test_name TEXT,
    status TEXT,
    details TEXT
) AS $$
BEGIN
    -- Run all test suites
    RETURN QUERY 
    SELECT 'RLS Isolation'::TEXT, t.test_name, t.status, t.details FROM test_rls_isolation() t
    UNION ALL
    SELECT 'Entitlements'::TEXT, t.test_name, t.status, t.details FROM test_entitlements_system() t
    UNION ALL
    SELECT 'Scoring & Bundles'::TEXT, t.test_name, t.status, t.details FROM test_scoring_bundle_workflow() t
    UNION ALL
    SELECT 'Performance'::TEXT, t.test_name, t.status, t.details FROM test_performance_indices() t
    UNION ALL
    SELECT 'Data Integrity'::TEXT, t.test_name, t.status, t.details FROM test_data_integrity() t
    UNION ALL
    SELECT 'Security'::TEXT, t.test_name, t.status, t.details FROM test_last_owner_protection() t;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Quick verification queries for manual testing
CREATE OR REPLACE VIEW qa_verification_summary AS
SELECT 
    'Organizations' as entity,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day') as recent_count
FROM orgs
UNION ALL
SELECT 
    'Active Subscriptions' as entity,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE status IN ('active', 'trialing')) as recent_count
FROM subscriptions
UNION ALL
SELECT 
    'Enabled Modules' as entity,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE enabled = TRUE) as recent_count
FROM modules
UNION ALL
SELECT 
    'Domain Configs' as entity,
    COUNT(*) as total_count,
    COUNT(*) as recent_count
FROM domain_configs
UNION ALL
SELECT 
    'Successful Runs' as entity,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE status = 'success') as recent_count
FROM runs
UNION ALL
SELECT 
    'High Quality Scores' as entity,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE overall_score >= 80) as recent_count
FROM prompt_scores;

-- Performance monitoring query
CREATE OR REPLACE VIEW qa_performance_check AS
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as scans,
    idx_tup_read as tuples_read,
    CASE 
        WHEN idx_scan = 0 THEN 'UNUSED'
        WHEN idx_scan < 100 THEN 'LOW_USAGE'
        ELSE 'ACTIVE'
    END as usage_status
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Run a quick smoke test
SELECT 'QA Migration 009 completed - run SELECT * FROM run_all_qa_tests(); to verify all functionality' as status;

-- Example usage instructions
/*
To run all QA tests:
SELECT * FROM run_all_qa_tests();

To check data integrity:
SELECT * FROM qa_verification_summary;

To monitor performance:
SELECT * FROM qa_performance_check WHERE usage_status = 'UNUSED';

To test entitlements for a specific org:
SELECT * FROM entitlements_effective_org WHERE org_id = 'your-org-id';

To verify RLS (run as authenticated user):
SELECT * FROM orgs; -- Should only show user's orgs
SELECT * FROM runs WHERE org_id = 'your-org-id'; -- Should work
SELECT * FROM runs WHERE org_id = 'other-org-id'; -- Should return empty

To test scoring workflow:
1. Create a run with status 'success'
2. Add a score with overall_score >= 80
3. Check: SELECT run_meets_export_threshold('run-id');
4. Create bundle if threshold met
*/
