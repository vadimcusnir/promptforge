#!/usr/bin/env node

/**
 * Verify Supabase Migration Results
 * Check if tables and functions were created successfully
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Verifying Supabase Migration Results...');
console.log('==========================================');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function verifyMigration() {
    try {
        console.log('\n📊 Checking database tables...');
        
        // Try to query the orgs table directly
        const { data: orgs, error: orgsError } = await supabase
            .from('orgs')
            .select('*')
            .limit(1);
        
        if (orgsError) {
            console.log('   ❌ orgs table error:', orgsError.message);
        } else {
            console.log('   ✅ orgs table accessible');
            console.log('   📋 Sample data:', orgs?.length || 0, 'records');
        }
        
        // Check plans table
        const { data: plans, error: plansError } = await supabase
            .from('plans')
            .select('*')
            .limit(5);
        
        if (plansError) {
            console.log('   ❌ plans table error:', plansError.message);
        } else {
            console.log('   ✅ plans table accessible');
            console.log('   📋 Found plans:', plans?.map(p => p.code).join(', ') || 'None');
        }
        
        // Check modules table
        const { data: modules, error: modulesError } = await supabase
            .from('modules')
            .select('*')
            .limit(5);
        
        if (modulesError) {
            console.log('   ❌ modules table error:', modulesError.message);
        } else {
            console.log('   ✅ modules table accessible');
            console.log('   📋 Found modules:', modules?.map(m => m.module_id).join(', ') || 'None');
        }
        
        // Check entitlements table
        const { data: entitlements, error: entitlementsError } = await supabase
            .from('entitlements')
            .select('*')
            .limit(5);
        
        if (entitlementsError) {
            console.log('   ❌ entitlements table error:', entitlementsError.message);
        } else {
            console.log('   ✅ entitlements table accessible');
            console.log('   📋 Found entitlements:', entitlements?.length || 0, 'records');
        }
        
        console.log('\n⚙️  Checking functions...');
        
        // Try to call the QA test function
        try {
            const { data: qaResults, error: qaError } = await supabase.rpc('run_all_qa_tests');
            
            if (qaError) {
                console.log('   ❌ QA tests function error:', qaError.message);
            } else {
                console.log('   ✅ QA tests function working');
                console.log('   📊 QA Results:', qaResults ? 'Available' : 'No results');
            }
        } catch (err) {
            console.log('   ❌ QA tests function not accessible:', err.message);
        }
        
        // Try to call the plan entitlements function
        try {
            const { data: planResult, error: planError } = await supabase.rpc('pf_apply_plan_entitlements', {
                org_id: '00000000-0000-0000-0000-000000000000',
                plan_code: 'pilot'
            });
            
            if (planError) {
                console.log('   ℹ️  Plan entitlements function error (expected):', planError.message);
            } else {
                console.log('   ✅ Plan entitlements function working');
            }
        } catch (err) {
            console.log('   ℹ️  Plan entitlements function not accessible (expected):', err.message);
        }
        
        console.log('\n🎯 Migration Verification Summary:');
        console.log('==================================');
        
        // Count total tables
        try {
            const { data: tableCount, error: countError } = await supabase
                .from('information_schema.tables')
                .select('table_name')
                .eq('table_schema', 'public');
            
            if (!countError && tableCount) {
                console.log(`   📊 Total tables created: ${tableCount.length}`);
                console.log('   📋 Table names:', tableCount.map(t => t.table_name).join(', '));
            }
        } catch (err) {
            console.log('   ❌ Could not count tables:', err.message);
        }
        
        console.log('\n✅ Verification completed!');
        console.log('\n📋 Next steps:');
        console.log('   1. Check Supabase dashboard for detailed table structure');
        console.log('   2. Test your application functionality');
        console.log('   3. Verify RLS policies are working');
        
    } catch (error) {
        console.error('❌ Verification failed:', error.message);
        console.error('\n🔧 Troubleshooting:');
        console.error('   1. Check if migrations actually ran in Supabase dashboard');
        console.error('   2. Verify service role key has proper permissions');
        console.error('   3. Check Supabase project status');
    }
}

verifyMigration();
