#!/usr/bin/env node

/**
 * Database Migration Script for PromptForge v3
 * 
 * This script sets up:
 * - User management tables
 * - Analytics tables
 * - A/B testing tables
 * - Email notification tables
 * 
 * Usage:
 * 1. Set your DATABASE_URL: export DATABASE_URL=postgresql://...
 * 2. Run: node scripts/migrate.js
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuration
const DATABASE_URL = process.env.DATABASE_URL || '[EXAMPLE_DB_URL_postgresql://username:password@localhost:5432/promptforge]';

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.log('Set it with: export DATABASE_URL=postgresql://username:password@localhost:5432/promptforge');
  process.exit(1);
}

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Migration files
const MIGRATIONS = [
  {
    name: 'Create User Management Tables',
    file: 'supabase/migrations/20241220000000_create_user_management_tables.sql'
  }
];

async function runMigration(migration) {
  console.log(`📦 Running migration: ${migration.name}`);
  
  try {
    const sqlPath = path.join(process.cwd(), migration.file);
    
    if (!fs.existsSync(sqlPath)) {
      console.log(`   ⚠️  Migration file not found: ${migration.file}`);
      return false;
    }
    
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        await client.query(statement);
      }
    }
    
    console.log(`   ✅ Migration completed successfully`);
    return true;
    
  } catch (error) {
    console.error(`   ❌ Migration failed:`, error.message);
    return false;
  }
}

async function createInitialData() {
  console.log('\n🌱 Creating initial data...\n');
  
  try {
    // Create default user roles
    await client.query(`
      INSERT INTO users (id, email, plan_id, is_annual, is_active, created_at)
      VALUES 
        ('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', '[EMAIL_REDACTED]', 'enterprise', true, true, NOW()),
        ('00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', '[EMAIL_REDACTED]', 'pro', false, true, NOW())
      ON CONFLICT (id) DO NOTHING;
    `);
    
    console.log('   ✅ Default users created');
    
    // Create sample analytics data
    await client.query(`
      INSERT INTO analytics_events (id, user_id, event_name, event_properties, page, timestamp)
      VALUES 
        (gen_random_uuid(), '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', 'page_view', '{"page": "pricing"}', 'pricing', NOW() - INTERVAL '1 hour'),
        (gen_random_uuid(), '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', 'plan_click', '{"plan": "pro", "billing": "monthly"}', 'pricing', NOW() - INTERVAL '30 minutes'),
        (gen_random_uuid(), '00[EXAMPLE_PHONE_555-123-4567]', 'checkout', NOW() - INTERVAL '15 minutes');
    `);
    
    console.log('   ✅ Sample analytics data created');
    
    // Create sample A/B test data
    await client.query(`
      INSERT INTO ab_test_events (id, test_id, variant_id, user_id, event_type, event_properties, timestamp)
      VALUES 
        (gen_random_uuid(), 'pricing_v1', 'control', '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', 'view', '{"page": "pricing"}', NOW() - INTERVAL '1 hour'),
        (gen_random_uuid(), 'pricing_v1', 'control', '00[EXAMPLE_PHONE_555-123-4567]', NOW() - INTERVAL '15 minutes');
    `);
    
    console.log('   ✅ Sample A/B test data created');
    
  } catch (error) {
    console.error('   ❌ Error creating initial data:', error.message);
  }
}

async function verifyTables() {
  console.log('\n�� Verifying database tables...\n');
  
  try {
    const tables = [
      'users',
      'subscriptions', 
      'analytics_events',
      'ab_test_events',
      'email_notifications'
    ];
    
    for (const table of tables) {
      const result = await client.query(`
        SELECT COUNT(*) as count FROM ${table}
      `);
      
      const count = result.rows[0].count;
      console.log(`   📊 ${table}: ${count} records`);
    }
    
    // Check RLS policies
    const policies = await client.query(`
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
      FROM pg_policies 
      WHERE schemaname = 'public'
      ORDER BY tablename, policyname;
    `);
    
    console.log(`\n   🛡️  RLS Policies: ${policies.rows.length} policies found`);
    
    for (const policy of policies.rows) {
      console.log(`      - ${policy.tablename}.${policy.policyname} (${policy.cmd})`);
    }
    
  } catch (error) {
    console.error('   ❌ Error verifying tables:', error.message);
  }
}

async function main() {
  console.log('🎯 PromptForge v3 - Database Migration Script\n');
  
  try {
    // Connect to database
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('   ✅ Connected successfully\n');
    
    // Run migrations
    console.log('🚀 Running database migrations...\n');
    
    let successCount = 0;
    for (const migration of MIGRATIONS) {
      const success = await runMigration(migration);
      if (success) successCount++;
    }
    
    console.log(`\n📊 Migration Summary: ${successCount}/${MIGRATIONS.length} successful`);
    
    if (successCount === MIGRATIONS.length) {
      // Create initial data
      await createInitialData();
      
      // Verify tables
      await verifyTables();
      
      console.log('\n🎉 Database setup complete!');
      console.log('\n📋 Next steps:');
      console.log('1. Verify all tables were created correctly');
      console.log('2. Check RLS policies are in place');
      console.log('3. Test user authentication flow');
      console.log('4. Verify analytics tracking is working');
      
    } else {
      console.log('\n⚠️  Some migrations failed. Please check the errors above.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { runMigration, createInitialData, verifyTables };
