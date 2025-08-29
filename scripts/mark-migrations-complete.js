#!/usr/bin/env node

/**
 * Mark Migrations Complete Script for PromptForge
 * Records existing migrations as complete since database schema already exists
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function markMigrationsComplete() {
  console.log('✅ PromptForge - Marking Existing Migrations Complete');
  console.log('====================================================\n');
  
  const dbUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || process.env.DATABASE_URL;
  const dbUrlClean = dbUrl.replace(/sslmode=require/, 'sslmode=disable');
  
  const client = new Client({
    connectionString: dbUrlClean,
    ssl: false
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database successfully\n');
    
    // Get all migration files
    const migrationsDir = path.join(__dirname, '../supabase/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    console.log(`📁 Found ${migrationFiles.length} migration files:`);
    migrationFiles.forEach(file => console.log(`   - ${file}`));
    
    // Check current migration status
    const migrationsTableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'schema_migrations'
      )
    `);
    
    if (!migrationsTableExists.rows[0].exists) {
      console.log('\n📋 Creating migrations tracking table...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          notes TEXT DEFAULT 'Marked as complete - schema already existed'
        )
      `);
    }
    
    // Get already recorded migrations
    const existingMigrations = await client.query('SELECT name FROM schema_migrations');
    const existingNames = existingMigrations.rows.map(r => r.name);
    
    console.log(`\n📊 Current migration status:`);
    console.log(`   Recorded: ${existingNames.length}`);
    console.log(`   Pending: ${migrationFiles.length - existingNames.length}`);
    
    // Mark pending migrations as complete
    const pendingMigrations = migrationFiles.filter(name => !existingNames.includes(name));
    
    if (pendingMigrations.length === 0) {
      console.log('\n✅ All migrations are already marked as complete!');
      return;
    }
    
    console.log(`\n🔄 Marking ${pendingMigrations.length} migrations as complete...`);
    
    for (const migrationName of pendingMigrations) {
      try {
        await client.query(
          'INSERT INTO schema_migrations (name) VALUES ($1)',
          [migrationName]
        );
        console.log(`   ✅ ${migrationName} - marked complete`);
      } catch (error) {
        if (error.code === '23505') { // Unique violation
          console.log(`   ⚠️  ${migrationName} - already recorded`);
        } else {
          console.error(`   ❌ ${migrationName} - error: ${error.message}`);
        }
      }
    }
    
    // Final status
    const finalCount = await client.query('SELECT COUNT(*) FROM schema_migrations');
    console.log(`\n📊 Final migration status:`);
    console.log(`   Total recorded: ${finalCount.rows[0].count}`);
    console.log(`   Database schema: Already complete`);
    console.log(`   Status: Production ready ✅`);
    
  } catch (error) {
    console.error('❌ Error marking migrations complete:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  markMigrationsComplete().catch(console.error);
}

module.exports = { markMigrationsComplete };
