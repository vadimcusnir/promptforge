#!/usr/bin/env node

/**
 * Test Error States Script
 * 
 * This script temporarily disables API endpoints to test error handling
 * and loading states across the application.
 * 
 * Usage:
 * 1. Run this script to disable APIs: node scripts/test-error-states.js disable
 * 2. Test the application UI for error states
 * 3. Re-enable APIs: node scripts/test-error-states.js enable
 */

const fs = require('fs');
const path = require('path');

const API_ROUTES = [
  'app/api/dashboard/metrics/route.ts',
  'app/api/dashboard/trends/route.ts',
  'app/api/dashboard/alerts/route.ts',
  'app/api/dashboard/insights/route.ts',
  'app/api/gpt-editor/route.ts',
  'app/api/gpt-test/route.ts',
  'app/api/runs/history/route.ts',
  'app/api/runs/[runId]/export/route.ts'
];

const BACKUP_DIR = 'backups/api-disabled';

function createBackup() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  console.log('Creating backups...');
  
  API_ROUTES.forEach(route => {
    if (fs.existsSync(route)) {
      const backupPath = path.join(BACKUP_DIR, route.replace(/\//g, '_'));
      fs.copyFileSync(route, backupPath);
      console.log(`✓ Backed up: ${route}`);
    }
  });
}

function disableAPIs() {
  console.log('Disabling APIs for error state testing...');
  
  createBackup();
  
  API_ROUTES.forEach(route => {
    if (fs.existsSync(route)) {
      const content = fs.readFileSync(route, 'utf8');
      
      // Add error simulation at the beginning of the handler
      const errorSimulation = `
// TEMPORARILY DISABLED FOR ERROR STATE TESTING
export async function GET() {
  return new Response(JSON.stringify({ 
    error: 'API_DISABLED_FOR_TESTING',
    message: 'This API is temporarily disabled for error state testing'
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST() {
  return new Response(JSON.stringify({ 
    error: 'API_DISABLED_FOR_TESTING',
    message: 'This API is temporarily disabled for error state testing'
  }), {
    status: 503,
    headers: { 'Content-Type': 'application/json' }
  });
}

// ORIGINAL CODE BELOW:
`;
      
      const modifiedContent = errorSimulation + content;
      fs.writeFileSync(route, modifiedContent);
      console.log(`✓ Disabled: ${route}`);
    }
  });
  
  console.log('\n✅ APIs disabled for error state testing');
  console.log('Test the application UI now to verify error handling');
  console.log('Run "node scripts/test-error-states.js enable" to restore');
}

function enableAPIs() {
  console.log('Re-enabling APIs...');
  
  API_ROUTES.forEach(route => {
    const backupPath = path.join(BACKUP_DIR, route.replace(/\//g, '_'));
    
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, route);
      console.log(`✓ Restored: ${route}`);
    } else {
      console.log(`⚠ No backup found for: ${route}`);
    }
  });
  
  console.log('\n✅ APIs re-enabled');
  console.log('Application should now work normally');
}

function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'disable':
      disableAPIs();
      break;
    case 'enable':
      enableAPIs();
      break;
    default:
      console.log(`
Test Error States Script

Usage:
  node scripts/test-error-states.js disable  - Disable APIs for error testing
  node scripts/test-error-states.js enable   - Re-enable APIs

This script temporarily disables API endpoints to test error handling
and loading states across the application.

⚠️  WARNING: Always run 'enable' after testing to restore functionality
      `);
      break;
  }
}

if (require.main === module) {
  main();
}
