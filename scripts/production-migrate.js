#!/usr/bin/env node

/**
 * Production Database Migration Script for PromptForge
 * Tests connectivity and runs migrations on production database
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Configuration validation
function validateProductionConfig() {
  console.log('🔍 Debug: Environment variables loaded:');
  console.log('   POSTGRES_URL:', process.env.POSTGRES_URL ? 'SET' : 'NOT SET');
  console.log('   POSTGRES_URL_NON_POOLING:', process.env.POSTGRES_URL_NON_POOLING ? 'SET' : 'NOT SET');
  console.log('   DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
  console.log('   SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');
  console.log('   NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
  console.log('');
  
  const errors = [];
  
  // Check required environment variables
  const requiredVars = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_SUPABASE_URL'
  ];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`${varName} is required`);
    }
  });
  
  // Check for database URL (try multiple possible names)
  const dbUrl = process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || process.env.DATABASE_URL;
  if (!dbUrl) {
    errors.push('Database URL is required (POSTGRES_URL, POSTGRES_URL_NON_POOLING, or DATABASE_URL)');
  }
  
  // Validate database URL format
  if (dbUrl && !dbUrl.startsWith('postgres://')) {
    errors.push('Database URL must be a valid PostgreSQL connection string');
  }
  
  return errors;
}

// Test database connectivity
async function testDatabaseConnection() {
  console.log('🔌 Testing production database connectivity...');
  
  // Prefer non-pooling URL for migrations to avoid SSL issues
  let dbUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  // Remove SSL requirement from connection string
  dbUrl = dbUrl.replace(/sslmode=require/, 'sslmode=disable');
  
  console.log('🔗 Using database URL:', dbUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
  
  const client = new Client({
    connectionString: dbUrl,
    ssl: false // Disable SSL for Supabase direct connection
  });
  
  try {
    await client.connect();
    console.log('✅ Database connection successful');
    
    // Test basic query
    const result = await client.query('SELECT version()');
    console.log('📊 Database version:', result.rows[0].version.split(' ')[0]);
    
    // Test schema access
    const schemas = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name IN ('public', 'auth', 'storage')
      ORDER BY schema_name
    `);
    
    console.log('🏗️  Available schemas:', schemas.rows.map(r => r.schema_name).join(', '));
    
    await client.end();
    return true;
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    await client.end();
    return false;
  }
}

// Get migration files
function getMigrationFiles() {
  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Ensure proper order
  
  console.log(`📁 Found ${files.length} migration files:`);
  files.forEach(file => console.log(`   - ${file}`));
  
  return files.map(file => ({
    name: file,
    path: path.join(migrationsDir, file),
    content: fs.readFileSync(path.join(migrationsDir, file), 'utf8')
  }));
}

// Check migration status
async function checkMigrationStatus() {
  console.log('\n🔍 Checking migration status...');
  
  let dbUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  // Remove SSL requirement from connection string
  dbUrl = dbUrl.replace(/sslmode=require/, 'sslmode=disable');
  
  const client = new Client({
    connectionString: dbUrl,
    ssl: false // Disable SSL for Supabase direct connection
  });
  
  try {
    await client.connect();
    
    // Check if migrations table exists
    const tableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'schema_migrations'
      )
    `);
    
    if (!tableExists.rows[0].exists) {
      console.log('📋 Creating migrations tracking table...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }
    
    // Get executed migrations
    const executed = await client.query('SELECT name FROM schema_migrations ORDER BY id');
    const executedNames = executed.rows.map(r => r.name);
    
    console.log(`✅ Executed migrations: ${executedNames.length}`);
    executedNames.forEach(name => console.log(`   - ${name}`));
    
    await client.end();
    return executedNames;
    
  } catch (error) {
    console.error('❌ Error checking migration status:', error.message);
    await client.end();
    return [];
  }
}

// Run pending migrations
async function runPendingMigrations(executedMigrations) {
  console.log('\n🚀 Running pending migrations...');
  
  const migrations = getMigrationFiles();
  const pending = migrations.filter(m => !executedMigrations.includes(m.name));
  
  if (pending.length === 0) {
    console.log('✅ All migrations are up to date');
    return true;
  }
  
  console.log(`📋 ${pending.length} pending migrations to run`);
  
  let dbUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  // Remove SSL requirement from connection string
  dbUrl = dbUrl.replace(/sslmode=require/, 'sslmode=disable');
  
  const client = new Client({
    connectionString: dbUrl,
    ssl: false // Disable SSL for Supabase direct connection
  });
  
  try {
    await client.connect();
    
    for (const migration of pending) {
      console.log(`\n🔄 Running migration: ${migration.name}`);
      
      try {
        // Execute migration
        await client.query('BEGIN');
        await client.query(migration.content);
        
        // Record migration
        await client.query(
          'INSERT INTO schema_migrations (name) VALUES ($1)',
          [migration.name]
        );
        
        await client.query('COMMIT');
        console.log(`✅ Migration ${migration.name} completed successfully`);
        
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`❌ Migration ${migration.name} failed:`, error.message);
        throw error;
      }
    }
    
    await client.end();
    return true;
    
  } catch (error) {
    console.error('❌ Migration execution failed:', error.message);
    await client.end();
    return false;
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const testOnly = args.includes('--test-only');
  
  console.log('🚀 PromptForge Production Migration Script');
  console.log('==========================================\n');
  
  // Validate configuration
  const configErrors = validateProductionConfig();
  if (configErrors.length > 0) {
    console.error('❌ Configuration validation failed:');
    configErrors.forEach(error => console.error(`   - ${error}`));
    process.exit(1);
  }
  
  console.log('✅ Configuration validation passed\n');
  
  // Test connectivity
  const connected = await testDatabaseConnection();
  if (!connected) {
    console.error('❌ Cannot proceed without database connectivity');
    process.exit(1);
  }
  
  if (testOnly) {
    console.log('\n🧪 Test mode - connectivity verified successfully!');
    console.log('✅ Database connection working');
    console.log('✅ Configuration valid');
    console.log('✅ Ready for production migration');
    return;
  }
  
  // Check migration status
  const executedMigrations = await checkMigrationStatus();
  
  // Run pending migrations
  const success = await runPendingMigrations(executedMigrations);
  
  if (success) {
    console.log('\n🎉 Production migration completed successfully!');
    console.log('✅ Database is up to date');
    console.log('✅ All migrations applied');
    console.log('✅ Production ready');
  } else {
    console.error('\n❌ Migration failed');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = {
  testDatabaseConnection,
  checkMigrationStatus,
  runPendingMigrations
};
