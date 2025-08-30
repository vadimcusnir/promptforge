#!/usr/bin/env node

/**
 * AI Gateway Table Verification Script
 * Checks if AI Gateway tables exist in the database
 */

const { createClient } = require('@supabase/supabase-js');

// You'll need to set these environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const TABLES_TO_CHECK = [
  'ai_usage_logs',
  'ai_cache',
  'ai_cost_analytics',
  'ai_daily_usage',
  'ai_monthly_usage',
  'ai_user_usage',
  'ai_cache_analytics',
  'ai_cache_daily_usage',
  'ai_cache_top_prompts',
  'ai_cache_performance'
];

async function verifyTables() {
  console.log('🔍 Verifying AI Gateway tables...\n');
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.log('❌ Missing Supabase configuration:');
    console.log('   NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌');
    console.log('   SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_KEY ? '✅' : '❌');
    console.log('\n📝 Please set these environment variables and try again.');
    return;
  }
  
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    
    console.log('🔗 Connected to Supabase');
    console.log('📊 Checking tables...\n');
    
    const results = {};
    
    for (const tableName of TABLES_TO_CHECK) {
      try {
        // Try to query the table to see if it exists
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          if (error.code === 'PGRST116') {
            results[tableName] = { exists: false, error: 'Table does not exist' };
          } else {
            results[tableName] = { exists: false, error: error.message };
          }
        } else {
          results[tableName] = { exists: true, count: data?.length || 0 };
        }
      } catch (err) {
        results[tableName] = { exists: false, error: err.message };
      }
    }
    
    // Display results
    console.log('📋 Table Verification Results:');
    console.log('═'.repeat(60));
    
    let existingTables = 0;
    let missingTables = 0;
    
    Object.entries(results).forEach(([table, result]) => {
      const status = result.exists ? '✅' : '❌';
      const info = result.exists ? 
        `(${result.count} rows)` : 
        `(${result.error})`;
      
      console.log(`${status} ${table.padEnd(25)} ${info}`);
      
      if (result.exists) {
        existingTables++;
      } else {
        missingTables++;
      }
    });
    
    console.log('═'.repeat(60));
    console.log(`📊 Summary: ${existingTables} existing, ${missingTables} missing`);
    
    if (missingTables > 0) {
      console.log('\n🔧 Missing tables detected. Please run the migrations:');
      console.log('   1. Copy SQL from supabase/migrations/20241220_ai_usage_tracking.sql');
      console.log('   2. Copy SQL from supabase/migrations/20241220_ai_cache.sql');
      console.log('   3. Run them in your Supabase SQL Editor');
      console.log('   4. Or use: supabase db push (if Docker is running)');
    } else {
      console.log('\n🎉 All AI Gateway tables are present!');
      console.log('✅ Ready to test the AI Gateway integration');
    }
    
  } catch (error) {
    console.error('❌ Error connecting to Supabase:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check your Supabase URL and service key');
    console.log('   2. Ensure your Supabase project is running');
    console.log('   3. Verify network connectivity');
  }
}

// Run if called directly
if (require.main === module) {
  verifyTables().catch(console.error);
}

module.exports = { verifyTables, TABLES_TO_CHECK };
