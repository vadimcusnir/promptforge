#!/usr/bin/env node

/**
 * Supabase Backup & Recovery Script
 * Handles daily database backups, versioning, and recovery procedures
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

// Configuration
const CONFIG = {
  backupDir: './db/backups',
  retentionDays: 30,
  maxBackups: 100,
  backupPrefix: 'promptforge',
  rulesetFile: './ruleset.yml',
  modulesFile: './lib/modules.ts',
  versionFile: './VERSION',
  logFile: './db/backups/backup.log'
};

// Backup metadata
const BACKUP_METADATA = {
  timestamp: new Date().toISOString(),
  version: getAppVersion(),
  rulesetVersion: getRulesetVersion(),
  modulesVersion: getModulesVersion(),
  backupType: 'daily',
  checksum: null,
  size: 0
};

/**
 * Main backup execution
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    // Ensure backup directory exists
    ensureBackupDirectory();

    switch (command) {
      case 'backup':
        await performBackup();
        break;
      case 'restore':
        const backupFile = args[1];
        if (!backupFile) {
          console.error('❌ Please specify backup file to restore');
          process.exit(1);
        }
        await performRestore(backupFile);
        break;
      case 'list':
        listBackups();
        break;
      case 'verify':
        const fileToVerify = args[1];
        if (!fileToVerify) {
          console.error('❌ Please specify backup file to verify');
          process.exit(1);
        }
        verifyBackup(fileToVerify);
        break;
      case 'cleanup':
        cleanupOldBackups();
        break;
      case 'test-restore':
        await testRestore();
        break;
      case 'test-restore-env':
        const testBackupFile = args[1];
        const testDbUrl = args[2];
        if (!testBackupFile || !testDbUrl) {
          console.error('❌ Please specify backup file and test database URL');
          console.error('Usage: node supabase-backup.js test-restore-env <backup-file> <test-db-url>');
          process.exit(1);
        }
        await testEnvironmentRestore(path.join(CONFIG.backupDir, testBackupFile), testDbUrl);
        break;
      default:
        console.log(`
🔧 Supabase Backup & Recovery Tool

Usage:
  node supabase-backup.js <command> [options]

Commands:
  backup           - Perform daily backup
  restore <file>   - Restore from backup file
  list             - List available backups
  verify <file>    - Verify backup integrity
  cleanup          - Remove old backups
  test-restore     - Test restore on dummy project
  test-restore-env - Test restore in a specific environment (requires backup file and test DB URL)

Examples:
  node supabase-backup.js backup
  node supabase-backup.js restore promptforge-backup-2025-01-15.sql
  node supabase-backup.js list
  node supabase-backup.js test-restore-env 20250115_1430-promptforge-v100.sql postgresql://test:test@localhost:5432/test_db
        `);
        process.exit(0);
    }
  } catch (error) {
    console.error('❌ Backup operation failed:', error.message);
    logError(error);
    process.exit(1);
  }
}

/**
 * Perform daily backup
 */
async function performBackup() {
  console.log('🔄 Starting daily backup...');
  
  const startTime = Date.now();
  const backupFileName = generateBackupFileName();
  const backupPath = path.join(CONFIG.backupDir, backupFileName);

  try {
    // 1. Create database backup
    console.log('📊 Creating database backup...');
    await createDatabaseBackup(backupPath);

    // 2. Backup configuration files
    console.log('📁 Backing up configuration files...');
    await backupConfigurationFiles(backupPath);

    // 3. Generate metadata and checksum
    console.log('🔍 Generating backup metadata...');
    const metadata = await generateBackupMetadata(backupPath);

    // 4. Save metadata
    const metadataPath = backupPath.replace('.sql', '.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    // 5. Verify backup integrity
    console.log('✅ Verifying backup integrity...');
    const isValid = verifyBackupIntegrity(backupPath, metadata.checksum);
    
    if (!isValid) {
      throw new Error('Backup integrity check failed');
    }

    const duration = (Date.now() - startTime) / 1000;
    console.log(`✅ Backup completed successfully in ${duration.toFixed(2)}s`);
    console.log(`📁 Backup saved: ${backupPath}`);
    console.log(`📊 Size: ${(metadata.size / 1024 / 1024).toFixed(2)} MB`);

    // 6. Cleanup old backups
    cleanupOldBackups();

    // 7. Log success
    logSuccess(`Daily backup completed: ${backupFileName}`);

  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    // Clean up failed backup file
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
    }
    throw error;
  }
}

/**
 * Create database backup using Supabase CLI
 */
async function createDatabaseBackup(backupPath) {
  try {
    // Check if Supabase CLI is available
    const hasSupabaseCLI = checkSupabaseCLI();
    
    if (hasSupabaseCLI) {
      // Use Supabase CLI for backup
      console.log('   Using Supabase CLI...');
      execSync(`supabase db dump --file ${backupPath}`, { 
        stdio: 'pipe',
        cwd: process.cwd()
      });
    } else {
      // Fallback to pg_dump if available
      console.log('   Using pg_dump fallback...');
      const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
      if (!dbUrl) {
        throw new Error('No database URL available for backup');
      }
      
      execSync(`pg_dump "${dbUrl}" > ${backupPath}`, { 
        stdio: 'pipe',
        shell: true
      });
    }
  } catch (error) {
    throw new Error(`Database backup failed: ${error.message}`);
  }
}

/**
 * Backup configuration files
 */
async function backupConfigurationFiles(backupPath) {
  const configDir = path.join(CONFIG.backupDir, 'config');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().split('T')[0];
  
  // Backup ruleset.yml
  if (fs.existsSync(CONFIG.rulesetFile)) {
    const rulesetBackup = path.join(configDir, `ruleset-${timestamp}.yml`);
    fs.copyFileSync(CONFIG.rulesetFile, rulesetBackup);
  }

  // Backup modules.ts
  if (fs.existsSync(CONFIG.modulesFile)) {
    const modulesBackup = path.join(configDir, `modules-${timestamp}.ts`);
    fs.copyFileSync(CONFIG.modulesFile, modulesBackup);
  }

  // Backup version file
  if (fs.existsSync(CONFIG.versionFile)) {
    const versionBackup = path.join(configDir, `version-${timestamp}.txt`);
    fs.copyFileSync(CONFIG.versionFile, versionBackup);
  }
}

/**
 * Generate backup metadata
 */
async function generateBackupMetadata(backupPath) {
  const stats = fs.statSync(backupPath);
  const content = fs.readFileSync(backupPath);
  const checksum = crypto.createHash('sha256').update(content).digest('hex');

  return {
    ...BACKUP_METADATA,
    timestamp: new Date().toISOString(),
    backupFile: path.basename(backupPath),
    size: stats.size,
    checksum: checksum,
    database: {
      tables: await getDatabaseTableCount(),
      size: await getDatabaseSize()
    }
  };
}

/**
 * Verify backup integrity
 */
function verifyBackupIntegrity(backupPath, expectedChecksum) {
  try {
    const content = fs.readFileSync(backupPath);
    const actualChecksum = crypto.createHash('sha256').update(content).digest('hex');
    return actualChecksum === expectedChecksum;
  } catch (error) {
    return false;
  }
}

/**
 * Verify backup file
 */
function verifyBackup(backupFile) {
  const backupPath = path.join(CONFIG.backupDir, backupFile);
  const metadataPath = backupPath.replace('.sql', '.json');

  if (!fs.existsSync(backupPath)) {
    console.error(`❌ Backup file not found: ${backupFile}`);
    return false;
  }

  try {
    console.log(`🔍 Verifying backup: ${backupFile}`);
    
    // Check if metadata exists
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      const isValid = verifyBackupIntegrity(backupPath, metadata.checksum);
      
      if (isValid) {
        console.log('✅ Backup integrity verified');
        console.log(`   Version: ${metadata.version}`);
        console.log(`   Ruleset: ${metadata.rulesetVersion}`);
        console.log(`   Size: ${(metadata.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Created: ${metadata.timestamp}`);
        return true;
      } else {
        console.error('❌ Backup integrity check failed');
        return false;
      }
    } else {
      console.log('⚠️  No metadata found, performing basic file check');
      const stats = fs.statSync(backupPath);
      const size = (stats.size / 1024 / 1024).toFixed(2);
      console.log(`   Size: ${size} MB`);
      console.log(`   Modified: ${stats.mtime}`);
      return true;
    }
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return false;
  }
}

/**
 * Perform restore from backup
 */
async function performRestore(backupFile) {
  console.log(`🔄 Restoring from backup: ${backupFile}`);
  
  const backupPath = path.join(CONFIG.backupDir, backupFile);
  const metadataPath = backupPath.replace('.sql', '.json');

  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup file not found: ${backupPath}`);
  }

  try {
    // 1. Verify backup integrity
    console.log('🔍 Verifying backup integrity...');
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      const isValid = verifyBackupIntegrity(backupPath, metadata.checksum);
      if (!isValid) {
        throw new Error('Backup integrity check failed');
      }
    }

    // 2. Confirm restore
    console.log('⚠️  WARNING: This will overwrite the current database!');
    console.log('   Backup file:', backupFile);
    console.log('   Backup date:', fs.statSync(backupPath).mtime);
    
    // In production, require explicit confirmation
    if (process.env.NODE_ENV === 'production') {
      console.log('❌ Production restore requires manual confirmation');
      process.exit(1);
    }

    // 3. Perform restore
    console.log('🔄 Restoring database...');
    await restoreDatabase(backupPath);

    // 4. Restore configuration files
    console.log('📁 Restoring configuration files...');
    await restoreConfigurationFiles(backupFile);

    console.log('✅ Restore completed successfully');
    logSuccess(`Database restored from: ${backupFile}`);

  } catch (error) {
    console.error('❌ Restore failed:', error.message);
    throw error;
  }
}

/**
 * Restore database from backup
 */
async function restoreDatabase(backupPath) {
  try {
    const hasSupabaseCLI = checkSupabaseCLI();
    
    if (hasSupabaseCLI) {
      // Use Supabase CLI for restore
      execSync(`supabase db reset --db-url ${backupPath}`, { 
        stdio: 'pipe',
        cwd: process.cwd()
      });
    } else {
      // Fallback to psql
      const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
      if (!dbUrl) {
        throw new Error('No database URL available for restore');
      }
      
      execSync(`psql "${dbUrl}" < ${backupPath}`, { 
        stdio: 'pipe',
        shell: true
      });
    }
  } catch (error) {
    throw new Error(`Database restore failed: ${error.message}`);
  }
}

/**
 * Restore configuration files
 */
async function restoreConfigurationFiles(backupFile) {
  const timestamp = backupFile.split('-').slice(-1)[0].replace('.sql', '');
  const configDir = path.join(CONFIG.backupDir, 'config');

  // Restore ruleset.yml
  const rulesetBackup = path.join(configDir, `ruleset-${timestamp}.yml`);
  if (fs.existsSync(rulesetBackup)) {
    fs.copyFileSync(rulesetBackup, CONFIG.rulesetFile);
  }

  // Restore modules.ts
  const modulesBackup = path.join(configDir, `modules-${timestamp}.ts`);
  if (fs.existsSync(modulesBackup)) {
    fs.copyFileSync(modulesBackup, CONFIG.modulesFile);
  }

  // Restore version file
  const versionBackup = path.join(configDir, `version-${timestamp}.txt`);
  if (fs.existsSync(versionBackup)) {
    fs.copyFileSync(versionBackup, CONFIG.versionFile);
  }
}

/**
 * Test restore on dummy project
 */
async function testRestore() {
  console.log('🧪 Testing restore on dummy project...');
  
  // Create dummy project directory
  const dummyDir = path.join(CONFIG.backupDir, 'test-restore');
  if (!fs.existsSync(dummyDir)) {
    fs.mkdirSync(dummyDir, { recursive: true });
  }

  try {
    // Copy latest backup to test directory
    const backups = listBackups();
    if (backups.length === 0) {
      throw new Error('No backups available for testing');
    }

    const latestBackup = backups[0];
    const testBackupPath = path.join(dummyDir, 'test-backup.sql');
    fs.copyFileSync(latestBackup.path, testBackupPath);

    // Create dummy database
    console.log('   Creating dummy database...');
    const dummyDbUrl = `postgresql://test:test@localhost:5432/promptforge_test`;
    
    // Test restore using test environment restore
    console.log('   Testing restore process...');
    await testEnvironmentRestore(testBackupPath, dummyDbUrl);
    console.log('   ✅ Restore test completed successfully');

    // Cleanup
    fs.rmSync(dummyDir, { recursive: true, force: true });
    
    console.log('✅ Restore test completed successfully');

  } catch (error) {
    console.error('❌ Restore test failed:', error.message);
    // Cleanup on failure
    if (fs.existsSync(dummyDir)) {
      fs.rmSync(dummyDir, { recursive: true, force: true });
    }
    throw error;
  }
}

/**
 * Test environment restore with pg_restore -C option
 * This creates the database if it doesn't exist
 */
async function testEnvironmentRestore(backupPath, testDbUrl) {
  try {
    console.log('   Using pg_restore with -C option for test environment...');
    
    // Extract database name from URL
    const dbName = testDbUrl.split('/').pop();
    const baseUrl = testDbUrl.replace(`/${dbName}`, '');
    
    // First, try to connect to postgres database to create test database
    try {
      execSync(`psql "${baseUrl}/postgres" -c "CREATE DATABASE ${dbName};"`, {
        stdio: 'pipe',
        shell: true
      });
      console.log(`   ✅ Created test database: ${dbName}`);
    } catch (error) {
      // Database might already exist, which is fine
      console.log(`   ℹ️  Test database ${dbName} already exists or creation failed`);
    }
    
    // Now restore using pg_restore with -C option
    // -C creates the database if it doesn't exist
    // -d specifies the database to restore to
    execSync(`pg_restore -C -d "${testDbUrl}" "${backupPath}"`, {
      stdio: 'pipe',
      shell: true
    });
    
    console.log(`   ✅ Successfully restored to test database: ${dbName}`);
    
  } catch (error) {
    throw new Error(`Test environment restore failed: ${error.message}`);
  }
}

/**
 * List available backups
 */
function listBackups() {
  if (!fs.existsSync(CONFIG.backupDir)) {
    console.log('📁 No backup directory found');
    return [];
  }

  const files = fs.readdirSync(CONFIG.backupDir)
    .filter(file => file.endsWith('.sql'))
    .map(file => {
      const filePath = path.join(CONFIG.backupDir, file);
      const stats = fs.statSync(filePath);
      const size = (stats.size / 1024 / 1024).toFixed(2);
      
      return {
        name: file,
        path: filePath,
        size: `${size} MB`,
        date: stats.mtime,
        age: Math.floor((Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24))
      };
    })
    .sort((a, b) => b.date - a.date);

  if (files.length === 0) {
    console.log('📁 No backups found');
    return [];
  }

  console.log('\n📁 Available Backups:');
  console.log('─'.repeat(80));
  files.forEach((backup, index) => {
    console.log(`${index + 1}. ${backup.name}`);
    console.log(`   Size: ${backup.size} | Date: ${backup.date.toLocaleString()} | Age: ${backup.age} days`);
    
    // Check for metadata
    const metadataPath = backup.path.replace('.sql', '.json');
    if (fs.existsSync(metadataPath)) {
      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
        console.log(`   Version: ${metadata.version} | Ruleset: ${metadata.rulesetVersion}`);
      } catch (error) {
        console.log(`   Metadata: Corrupted`);
      }
    }
    console.log('');
  });

  return files;
}

/**
 * Cleanup old backups
 */
function cleanupOldBackups() {
  if (!fs.existsSync(CONFIG.backupDir)) {
    return;
  }

  const files = fs.readdirSync(CONFIG.backupDir)
    .filter(file => file.endsWith('.sql'))
    .map(file => {
      const filePath = path.join(CONFIG.backupDir, file);
      const stats = fs.statSync(filePath);
      return { name: file, path: filePath, stats };
    })
    .sort((a, b) => b.stats.mtime - a.stats.mtime);

  // Remove old backups beyond retention period
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - CONFIG.retentionDays);

  let removedCount = 0;
  files.forEach(file => {
    if (file.stats.mtime < cutoffDate) {
      try {
        fs.unlinkSync(file.path);
        
        // Remove metadata file if it exists
        const metadataPath = file.path.replace('.sql', '.json');
        if (fs.existsSync(metadataPath)) {
          fs.unlinkSync(metadataPath);
        }
        
        removedCount++;
        console.log(`🗑️  Removed old backup: ${file.name}`);
      } catch (error) {
        console.warn(`⚠️  Failed to remove old backup: ${file.name}`);
      }
    }
  });

  if (removedCount > 0) {
    console.log(`🗑️  Cleaned up ${removedCount} old backups`);
  }

  // Remove excess backups beyond max count
  if (files.length > CONFIG.maxBackups) {
    const excessFiles = files.slice(CONFIG.maxBackups);
    excessFiles.forEach(file => {
      try {
        fs.unlinkSync(file.path);
        
        const metadataPath = file.path.replace('.sql', '.json');
        if (fs.existsSync(metadataPath)) {
          fs.unlinkSync(metadataPath);
        }
        
        console.log(`🗑️  Removed excess backup: ${file.name}`);
      } catch (error) {
        console.warn(`⚠️  Failed to remove excess backup: ${file.name}`);
      }
    });
  }
}

/**
 * Utility functions
 */
function ensureBackupDirectory() {
  if (!fs.existsSync(CONFIG.backupDir)) {
    fs.mkdirSync(CONFIG.backupDir, { recursive: true });
  }
}

function generateBackupFileName() {
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/T/, '_')
    .replace(/\..+/, '')
    .replace(/:/g, '')
    .replace(/-/g, '');
  
  const schemaVersion = getAppVersion();
  const version = schemaVersion.replace(/\./g, '');
  
  return `${timestamp}-${CONFIG.backupPrefix}-v${version}.sql`;
}

function checkSupabaseCLI() {
  try {
    execSync('supabase --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

function getAppVersion() {
  try {
    if (fs.existsSync(CONFIG.versionFile)) {
      return fs.readFileSync(CONFIG.versionFile, 'utf8').trim();
    }
    return '1.0.0';
  } catch (error) {
    return '1.0.0';
  }
}

function getRulesetVersion() {
  try {
    if (fs.existsSync(CONFIG.rulesetFile)) {
      const content = fs.readFileSync(CONFIG.rulesetFile, 'utf8');
      const versionMatch = content.match(/version:\s*["']?([^"\s]+)["']?/);
      return versionMatch ? versionMatch[1] : '1.0.0';
    }
    return '1.0.0';
  } catch (error) {
    return '1.0.0';
  }
}

function getModulesVersion() {
  try {
    if (fs.existsSync(CONFIG.modulesFile)) {
      const content = fs.readFileSync(CONFIG.modulesFile, 'utf8');
      const versionMatch = content.match(/version:\s*["']?([^"\s]+)["']?/);
      return versionMatch ? versionMatch[1] : '1.0.0';
    }
    return '1.0.0';
  } catch (error) {
    return '1.0.0';
  }
}

async function getDatabaseTableCount() {
  // This would query the database for table count
  // For now, return a placeholder
  return 'unknown';
}

async function getDatabaseSize() {
  // This would query the database for size
  // For now, return a placeholder
  return 'unknown';
}

function logSuccess(message) {
  const logEntry = `[${new Date().toISOString()}] SUCCESS: ${message}\n`;
  fs.appendFileSync(CONFIG.logFile, logEntry);
}

function logError(error) {
  const logEntry = `[${new Date().toISOString()}] ERROR: ${error.message}\n${error.stack}\n`;
  fs.appendFileSync(CONFIG.logFile, logEntry);
}

// Run the script
if (require.main === module) {
  main();
}

// Export functions for external use
module.exports = {
  performBackup,
  performRestore,
  listBackups,
  verifyBackup,
  cleanupOldBackups,
  testRestore,
  testEnvironmentRestore,
  generateBackupFileName
};
