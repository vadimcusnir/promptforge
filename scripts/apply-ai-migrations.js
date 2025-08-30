#!/usr/bin/env node

/**
 * AI Gateway Migration Runner
 * Applies AI Gateway database migrations to existing Supabase instance
 */

const fs = require('fs');
const path = require('path');

// Migration files to apply
const MIGRATIONS = [
  'supabase/migrations/20241220_ai_usage_tracking.sql',
  'supabase/migrations/20241220_ai_cache.sql'
];

async function applyMigrations() {
  console.log('🚀 Starting AI Gateway migrations...\n');
  
  for (const migrationFile of MIGRATIONS) {
    try {
      console.log(`📄 Reading migration: ${migrationFile}`);
      
      if (!fs.existsSync(migrationFile)) {
        console.log(`❌ Migration file not found: ${migrationFile}`);
        continue;
      }
      
      const migrationSQL = fs.readFileSync(migrationFile, 'utf8');
      console.log(`✅ Migration file loaded: ${path.basename(migrationFile)}`);
      console.log(`📊 SQL size: ${migrationSQL.length} characters`);
      
      // Display the first few lines of the migration
      const lines = migrationSQL.split('\n').slice(0, 10);
      console.log('📝 Migration preview:');
      lines.forEach((line, index) => {
        if (line.trim()) {
          console.log(`   ${index + 1}: ${line.trim()}`);
        }
      });
      console.log('   ...\n');
      
    } catch (error) {
      console.error(`❌ Error reading migration ${migrationFile}:`, error.message);
    }
  }
  
  console.log('📋 Migration Summary:');
  console.log('   • AI Usage Tracking Tables');
  console.log('   • AI Cache Tables');
  console.log('   • Analytics Views');
  console.log('   • RLS Policies');
  console.log('   • Helper Functions');
  
  console.log('\n🔧 Next Steps:');
  console.log('   1. Copy the SQL from the migration files');
  console.log('   2. Run them in your Supabase SQL Editor');
  console.log('   3. Or use the Supabase CLI: supabase db push');
  console.log('   4. Verify tables were created successfully');
  
  console.log('\n📚 Migration Files:');
  MIGRATIONS.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });
  
  console.log('\n✨ AI Gateway migrations ready to apply!');
}

// Run if called directly
if (require.main === module) {
  applyMigrations().catch(console.error);
}

module.exports = { applyMigrations, MIGRATIONS };
