#!/usr/bin/env node

/**
 * Comprehensive CI Test Script for PromptForge v3
 * Runs all required tests and checks for CI pipeline
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  ci: process.env.CI === 'true',
  verbose: process.argv.includes('--verbose') || process.argv.includes('-v'),
  failFast: process.argv.includes('--fail-fast'),
  skipBuild: process.argv.includes('--skip-build'),
  skipE2E: process.argv.includes('--skip-e2e')
};

// Test results tracking
const results = {
  passed: [],
  failed: [],
  warnings: [],
  startTime: Date.now()
};

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : '🔍';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function runCommand(command, description, critical = true) {
  try {
    log(`Running: ${description}`);
    if (CONFIG.verbose) {
      console.log(`Command: ${command}`);
    }
    
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: CONFIG.verbose ? 'inherit' : 'pipe',
      cwd: process.cwd()
    });
    
    log(`${description} completed successfully`, 'success');
    results.passed.push(description);
    return { success: true, output };
    
  } catch (error) {
    const errorMsg = `${description} failed: ${error.message}`;
    log(errorMsg, 'error');
    results.failed.push(description);
    
    if (critical && CONFIG.failFast) {
      process.exit(1);
    }
    
    return { success: false, error: error.message };
  }
}

function checkEnvironment() {
  log('Checking environment configuration...');
  
  // Check if .env.local exists
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    log('.env.local file not found - required for CI', 'error');
    results.failed.push('Environment file check');
    return false;
  }
  
  // Check required environment variables
  const requiredVars = [
    'STRIPE_SECRET_KEY',
    'SUPABASE_URL', 
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_BASE_URL'
  ];
  
  let envCheckPassed = true;
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      log(`Required environment variable ${varName} not set`, 'warning');
      results.warnings.push(`Missing ${varName}`);
      envCheckPassed = false;
    }
  });
  
  if (envCheckPassed) {
    log('Environment configuration check passed', 'success');
    results.passed.push('Environment configuration check');
  } else {
    log('Environment configuration check completed with warnings', 'warning');
  }
  
  return envCheckPassed;
}

function checkDatabaseSchema() {
  log('Checking database schema consistency...');
  
  const migrationsDir = path.join(process.cwd(), 'supabase/migrations');
  if (!fs.existsSync(migrationsDir)) {
    log('Database migrations directory not found', 'error');
    results.failed.push('Database schema check');
    return false;
  }
  
  // Count migration files
  const migrationFiles = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.sql'));
  log(`Found ${migrationFiles.length} migration files`);
  
  // Check for duplicate timestamps
  const timestamps = migrationFiles.map(file => file.split('_')[0]);
  const duplicates = timestamps.filter((item, index) => timestamps.indexOf(item) !== index);
  
  if (duplicates.length > 0) {
    log(`Found ${duplicates.length} duplicate migration timestamps`, 'error');
    results.failed.push('Database schema check');
    return false;
  }
  
  // Check schema.sql
  const schemaPath = path.join(process.cwd(), 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const stats = fs.statSync(schemaPath);
    const ageDays = Math.floor((Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24));
    
    if (ageDays > 30) {
      log(`Schema file is ${ageDays} days old - consider updating`, 'warning');
      results.warnings.push('Schema file outdated');
    }
  }
  
  log('Database schema check completed', 'success');
  results.passed.push('Database schema check');
  return true;
}

function runLinting() {
  return runCommand('pnpm lint', 'Linting check');
}

function runTypeChecking() {
  return runCommand('pnpm type-check', 'TypeScript type checking');
}

function runUnitTests() {
  return runCommand('pnpm test:unit', 'Unit tests');
}

function runE2ETests() {
  if (CONFIG.skipE2E) {
    log('Skipping E2E tests as requested', 'warning');
    results.warnings.push('E2E tests skipped');
    return { success: true };
  }
  
  return runCommand('pnpm test:e2e', 'E2E tests');
}

function runBackupTests() {
  return runCommand('pnpm test:backup', 'Backup system tests');
}

function runPIIScan() {
  return runCommand('pnpm test:pii', 'PII detection scan');
}

function runSecretScan() {
  return runCommand('pnpm test:secrets', 'Secret detection scan');
}

function runBuild() {
  if (CONFIG.skipBuild) {
    log('Skipping build as requested', 'warning');
    results.warnings.push('Build skipped');
    return { success: true };
  }
  
  return runCommand('pnpm build', 'Application build');
}

function generateReport() {
  const duration = (Date.now() - results.startTime) / 1000;
  
  console.log('\n' + '='.repeat(60));
  console.log('🔍 CI COMPREHENSIVE TEST REPORT');
  console.log('='.repeat(60));
  
  console.log(`\n⏱️  Total Duration: ${duration.toFixed(2)}s`);
  console.log(`✅ Passed: ${results.passed.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⚠️  Warnings: ${results.warnings.length}`);
  
  if (results.passed.length > 0) {
    console.log('\n✅ PASSED TESTS:');
    results.passed.forEach(test => console.log(`   - ${test}`));
  }
  
  if (results.failed.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    results.failed.forEach(test => console.log(`   - ${test}`));
  }
  
  if (results.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    results.warnings.forEach(warning => console.log(`   - ${warning}`));
  }
  
  console.log('\n' + '='.repeat(60));
  
  // Exit with appropriate code
  if (results.failed.length > 0) {
    console.log('❌ CI tests failed - please fix the issues above');
    process.exit(1);
  } else if (results.warnings.length > 0) {
    console.log('⚠️  CI tests passed with warnings');
    process.exit(0);
  } else {
    console.log('✅ All CI tests passed successfully!');
    process.exit(0);
  }
}

// Main execution
async function main() {
  log('Starting comprehensive CI test suite...');
  
  try {
    // Environment and schema checks
    checkEnvironment();
    checkDatabaseSchema();
    
    // Core tests
    runLinting();
    runTypeChecking();
    runUnitTests();
    runE2ETests();
    
    // Security and backup tests
    runBackupTests();
    runPIIScan();
    runSecretScan();
    
    // Build test
    runBuild();
    
    // Generate final report
    generateReport();
    
  } catch (error) {
    log(`Unexpected error: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🔍 PromptForge v3 - Comprehensive CI Test Script

Usage: node scripts/test-ci-comprehensive.js [options]

Options:
  --verbose, -v        Enable verbose output
  --fail-fast          Stop on first failure
  --skip-build         Skip build step
  --skip-e2e           Skip E2E tests
  --help, -h           Show this help message

Examples:
  node scripts/test-ci-comprehensive.js                    # Run all tests
  node scripts/test-ci-comprehensive.js --verbose          # Verbose output
  node scripts/test-ci-comprehensive.js --skip-e2e        # Skip E2E tests
  node scripts/test-ci-comprehensive.js --fail-fast       # Stop on first failure

This script runs all required tests for the CI pipeline:
- Environment configuration check
- Database schema validation
- Linting and type checking
- Unit and E2E tests
- Backup system tests
- PII and secret detection
- Application build
`);
  process.exit(0);
}

// Run the main function
if (require.main === module) {
  main();
}

module.exports = {
  runCommand,
  checkEnvironment,
  checkDatabaseSchema,
  generateReport
};
