#!/usr/bin/env node

/**
 * Check Database State Script for PromptForge
 * Identifies existing tables and potential migration conflicts
 */

const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function checkDatabaseState() {
  console.log('🔍 PromptForge Database State Check');
  console.log('==================================\n');
  
  const dbUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || process.env.DATABASE_URL;
  const dbUrlClean = dbUrl.replace(/sslmode=require/, 'sslmode=disable');
  
  const client = new Client({
    connectionString: dbUrlClean,
    ssl: false
  });
  
  try {
    await client.connect();
    console.log('✅ Connected to database successfully\n');
    
    // Check existing tables in public schema
    console.log('📋 Existing tables in public schema:');
    const tablesResult = await client.query(`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length === 0) {
      console.log('   No tables found');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name} (${row.table_type})`);
      });
    }
    
    // Check auth schema tables
    console.log('\n🔐 Existing tables in auth schema:');
    const authTablesResult = await client.query(`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'auth' 
      ORDER BY table_name
    `);
    
    if (authTablesResult.rows.length === 0) {
      console.log('   No tables found');
    } else {
      authTablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name} (${row.table_type})`);
      });
    }
    
    // Check storage schema tables
    console.log('\n💾 Existing tables in storage schema:');
    const storageTablesResult = await client.query(`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'storage' 
      ORDER BY table_name
    `);
    
    if (storageTablesResult.rows.length === 0) {
      console.log('   No tables found');
    } else {
      storageTablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name} (${row.table_type})`);
      });
    }
    
    // Check for specific key tables
    console.log('\n🎯 Key table existence check:');
    const keyTables = ['users', 'organizations', 'runs', 'prompt_history', 'entitlements', 'subscriptions'];
    
    for (const tableName of keyTables) {
      const exists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )
      `, [tableName]);
      
      console.log(`   ${tableName}: ${exists.rows[0].exists ? '✅ EXISTS' : '❌ MISSING'}`);
    }
    
    // Check table counts
    console.log('\n📊 Table record counts:');
    for (const tableName of keyTables) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) FROM ${tableName}`);
        console.log(`   ${tableName}: ${countResult.rows[0].count} records`);
      } catch (error) {
        console.log(`   ${tableName}: Cannot count (${error.message})`);
      }
    }
    
    // Check for existing migrations table
    console.log('\n🔄 Migration tracking:');
    const migrationsTableExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'schema_migrations'
      )
    `);
    
    if (migrationsTableExists.rows[0].exists) {
      const migrations = await client.query('SELECT name, executed_at FROM schema_migrations ORDER BY id');
      console.log(`   ✅ Migrations table exists with ${migrations.rows.length} recorded migrations:`);
      migrations.rows.forEach(m => {
        console.log(`     - ${m.name} (${m.executed_at})`);
      });
    } else {
      console.log('   ❌ No migrations table found');
    }
    
    console.log('\n💡 Recommendations:');
    if (tablesResult.rows.length > 0) {
      console.log('   - Database has existing tables - consider backup before migration');
      console.log('   - Some migrations may fail due to existing objects');
      console.log('   - Consider using "IF NOT EXISTS" in migration scripts');
    } else {
      console.log('   - Database is empty - safe to run all migrations');
    }
    
  } catch (error) {
    console.error('❌ Error checking database state:', error.message);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  checkDatabaseState().catch(console.error);
}

module.exports = { checkDatabaseState };
