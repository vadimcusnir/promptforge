#!/usr/bin/env node

/**
 * Test Supabase Connection
 * Simple script to verify connectivity before running migrations
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testing Supabase Connection...');
console.log('==================================');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables:');
    console.error('   SUPABASE_URL:', SUPABASE_URL ? '✅ Set' : '❌ Missing');
    console.error('   SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
    process.exit(1);
}

console.log('✅ Environment variables loaded');
console.log('   URL:', SUPABASE_URL);
console.log('   Service Role Key:', SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + '...');

// Create client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function testConnection() {
    try {
        console.log('\n🔌 Testing connection...');
        
        // Test basic connection by checking auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
            console.log('   ℹ️  Auth test result:', authError.message);
        } else {
            console.log('   ✅ Auth connection successful');
        }
        
        // Test database access by checking if we can query system tables
        console.log('\n🗄️  Testing database access...');
        
        const { data: tables, error: dbError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .limit(5);
        
        if (dbError) {
            console.log('   ❌ Database access failed:', dbError.message);
            console.log('   💡 This might be expected if no tables exist yet');
        } else {
            console.log('   ✅ Database access successful');
            console.log('   📊 Found tables:', tables.length);
            if (tables.length > 0) {
                console.log('   📋 Sample tables:', tables.slice(0, 3).map(t => t.table_name).join(', '));
            }
        }
        
        // Test RPC access
        console.log('\n⚙️  Testing RPC access...');
        
        try {
            const { data: version, error: rpcError } = await supabase.rpc('version');
            if (rpcError) {
                console.log('   ℹ️  RPC test result:', rpcError.message);
            } else {
                console.log('   ✅ RPC access successful');
            }
        } catch (err) {
            console.log('   ℹ️  RPC test result:', err.message);
        }
        
        console.log('\n🎉 Connection test completed!');
        console.log('\n📋 Next steps:');
        console.log('   1. If connection is successful, you can run migrations');
        console.log('   2. Use: node scripts/migrate-supabase.js');
        console.log('   3. Or run migrations manually via Supabase dashboard');
        
    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
        console.error('\n🔧 Troubleshooting:');
        console.error('   1. Check your .env.local file');
        console.error('   2. Verify Supabase project is active');
        console.error('   3. Check service role key permissions');
        process.exit(1);
    }
}

testConnection();
