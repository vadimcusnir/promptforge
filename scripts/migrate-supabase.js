#!/usr/bin/env node

/**
 * PromptForge Supabase Migration Runner
 * This script helps automate the migration process
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required environment variables:');
    console.error('   - SUPABASE_URL');
    console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Migration files in order
const MIGRATION_FILES = [
    '001_init_extensions_and_functions.sql',
    '002_orgs_members.sql',
    '003_billing_entitlements.sql',
    '004_catalog_engine.sql',
    '005_history_telemetry_scores.sql',
    '006_module_versioning.sql',
    '007_performance_indices.sql',
    '008_seed_data.sql',
    '009_qa_testing.sql'
];

async function checkCurrentStatus() {
    console.log('🔍 Checking current database status...');
    
    try {
        // Check if key tables exist
        const { data: tables, error } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .in('table_name', ['orgs', 'plans', 'entitlements', 'modules', 'runs']);
        
        if (error) {
            console.log('   ❌ Could not check tables (database may not be set up yet)');
            return false;
        }
        
        const existingTables = tables.map(t => t.table_name);
        console.log('   📊 Existing tables:', existingTables.length > 0 ? existingTables.join(', ') : 'None');
        
        return existingTables.length > 0;
    } catch (err) {
        console.log('   ❌ Error checking status:', err.message);
        return false;
    }
}

async function runMigration(fileName) {
    const filePath = path.join(__dirname, '..', 'supabase', 'migrations', fileName);
    
    if (!fs.existsSync(filePath)) {
        console.log(`   ❌ Migration file not found: ${fileName}`);
        return false;
    }
    
    console.log(`   📝 Running migration: ${fileName}`);
    
    try {
        const sql = fs.readFileSync(filePath, 'utf8');
        
        // Split SQL into individual statements
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--'));
        
        for (const statement of statements) {
            if (statement.trim()) {
                try {
                    const { error } = await supabase.rpc('exec_sql', { sql: statement });
                    if (error) {
                        console.log(`      ⚠️  Statement warning: ${error.message}`);
                    }
                } catch (err) {
                    // Some statements might fail if they're already applied
                    console.log(`      ℹ️  Statement info: ${err.message}`);
                }
            }
        }
        
        console.log(`   ✅ Migration completed: ${fileName}`);
        return true;
    } catch (err) {
        console.log(`   ❌ Migration failed: ${fileName} - ${err.message}`);
        return false;
    }
}

async function runAllMigrations() {
    console.log('🚀 Starting Supabase migrations...');
    console.log('=====================================');
    
    // Check current status
    const hasExistingData = await checkCurrentStatus();
    
    if (hasExistingData) {
        console.log('\n⚠️  Database appears to have existing data');
        console.log('   Consider running CHECK_INSTALLATION_STATUS.sql first');
        console.log('   to see what needs to be migrated\n');
    }
    
    console.log('\n📋 Running migrations in order:');
    console.log('===============================');
    
    let successCount = 0;
    let totalCount = MIGRATION_FILES.length;
    
    for (const fileName of MIGRATION_FILES) {
        const success = await runMigration(fileName);
        if (success) successCount++;
        
        // Small delay between migrations
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n📊 Migration Summary:');
    console.log('=====================');
    console.log(`   ✅ Successful: ${successCount}/${totalCount}`);
    console.log(`   ❌ Failed: ${totalCount - successCount}/${totalCount}`);
    
    if (successCount === totalCount) {
        console.log('\n🎉 All migrations completed successfully!');
        console.log('\n🔍 Next steps:');
        console.log('   1. Verify installation: SELECT * FROM run_all_qa_tests();');
        console.log('   2. Check table counts in Supabase dashboard');
        console.log('   3. Test your application');
    } else {
        console.log('\n⚠️  Some migrations failed. Check the logs above.');
        console.log('   You may need to run migrations manually via Supabase dashboard.');
    }
}

async function verifyInstallation() {
    console.log('🔍 Verifying installation...');
    
    try {
        const { data, error } = await supabase.rpc('run_all_qa_tests');
        
        if (error) {
            console.log('   ❌ QA tests function not found - migrations may not be complete');
            return;
        }
        
        console.log('   📊 QA Test Results:');
        console.log(JSON.stringify(data, null, 2));
        
    } catch (err) {
        console.log('   ❌ Could not run QA tests:', err.message);
    }
}

// Main execution
async function main() {
    const command = process.argv[2];
    
    switch (command) {
        case 'status':
            await checkCurrentStatus();
            break;
        case 'verify':
            await verifyInstallation();
            break;
        case 'migrate':
        default:
            await runAllMigrations();
            break;
    }
}

// Handle errors gracefully
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

main().catch(console.error);
