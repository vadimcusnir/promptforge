#!/usr/bin/env node

/**
 * Build-time Voice & Branding Check
 * 
 * This script runs during the build process to ensure:
 * - No forbidden words in production code
 * - Single H1 per page
 * - Consistent font usage
 * - Minimal glass/glow effects
 */

const { checkFile, FORBIDDEN_WORDS } = require('./check-voice-branding');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function buildCheck() {
  console.log('🔍 Build-time Voice & Branding Check\n');
  
  // Find all production files
  const files = glob.sync('app/**/*.{tsx,ts}', { 
    ignore: [
      '**/node_modules/**',
      '**/*.test.*',
      '**/*.spec.*',
      '**/__tests__/**'
    ] 
  });
  
  const results = [];
  let criticalIssues = 0;
  let warnings = 0;
  
  files.forEach(file => {
    const result = checkFile(file);
    results.push(result);
    
    // Count critical issues (forbidden words, multiple H1)
    const critical = result.issues.filter(issue => 
      issue.includes('❌') && 
      (issue.includes('forbidden') || issue.includes('Multiple H1'))
    ).length;
    
    criticalIssues += critical;
    
    // Count warnings (glass/glow tokens)
    const warning = result.issues.filter(issue => 
      issue.includes('❌') && issue.includes('glass/glow')
    ).length;
    
    warnings += warning;
  });
  
  // Display critical issues first
  const filesWithCriticalIssues = results.filter(r => 
    r.issues.some(i => i.includes('❌') && 
      (i.includes('forbidden') || i.includes('Multiple H1')))
  );
  
  if (filesWithCriticalIssues.length > 0) {
    console.log('🚨 CRITICAL ISSUES (must fix before build):');
    filesWithCriticalIssues.forEach(result => {
      console.log(`\n📁 ${result.file}`);
      result.issues
        .filter(issue => issue.includes('❌') && 
          (issue.includes('forbidden') || issue.includes('Multiple H1')))
        .forEach(issue => {
          console.log(`  ${issue}`);
        });
    });
  }
  
  // Display warnings
  const filesWithWarnings = results.filter(r => 
    r.issues.some(i => i.includes('❌') && i.includes('glass/glow'))
  );
  
  if (filesWithWarnings.length > 0) {
    console.log('\n⚠️  WARNINGS (consider fixing for better UX):');
    filesWithWarnings.forEach(result => {
      console.log(`\n📁 ${result.file}`);
      result.issues
        .filter(issue => issue.includes('❌') && issue.includes('glass/glow'))
        .forEach(issue => {
          console.log(`  ${issue}`);
        });
    });
  }
  
  // Summary
  console.log('\n📊 Build Check Summary:');
  console.log(`Files checked: ${files.length}`);
  console.log(`Critical issues: ${criticalIssues}`);
  console.log(`Warnings: ${warnings}`);
  
  if (criticalIssues === 0) {
    console.log('\n✅ Build can proceed - no critical Voice & Branding issues');
    if (warnings > 0) {
      console.log('⚠️  Consider addressing glass/glow token warnings for better performance');
    }
    process.exit(0);
  } else {
    console.log('\n❌ Build blocked - critical Voice & Branding issues must be fixed');
    console.log('Fix the issues above and run the build again');
    process.exit(1);
  }
}

if (require.main === module) {
  buildCheck();
}

module.exports = { buildCheck };
