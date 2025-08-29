#!/usr/bin/env node

/**
 * PII Detection Test Script for CI
 * Scans the codebase for potential PII exposure
 * Handles test patterns and CI environment
 */

const fs = require('fs');
const path = require('path');

// PII patterns to test
const PII_PATTERNS = {
  // Critical patterns that will fail the job
  critical: {
    ssn: /\b\d{3}-\d{2}-\d{4}\b|\b\d{9}\b/g,
    creditCard: /\b(?:4\d{3}|5[1-5]\d{2}|3[47]\d{2}|3[0-35-9]\d{2}|6(?:011|5\d{2}))[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
    apiKey: /\b(?:sk_live_|pk_live_|AIza|ghp_|gho_)[A-Za-z0-9_-]{20,}\b/g,
    privateKey: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----[\s\S]*?-----END\s+(?:RSA\s+)?PRIVATE\s+KEY-----/gi,
    awsCredentials: /\bAKIA[0-9A-Z]{16}\b|\baws_access_key_id\s*=\s*[^\s]+/gi,
    webhookSecret: /\bwhsec_[a-zA-Z0-9]{32,}\b/g,
    sendgridKey: /\bSG\.[a-zA-Z0-9_-]{32,}\b/g
  },
  
  // Warning patterns that won't fail the job
  warning: {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    phone: /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
    ipAddress: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
    jwtToken: /\beyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*\b/g,
    dbConnection: /(?:postgresql?|mysql|mongodb):\/\/[^:\s]+:[^@\s]+@[^:\s]+/gi
  }
};

// Allowed test patterns (won't trigger failures)
const ALLOWED_PATTERNS = {
  testEmail: /\btest@example\.com\b/gi,
  testPhone: /\b000-0000000\b/gi,
  testStripe: /\b(?:sk_test_|pk_test_)[a-zA-Z0-9_-]{24,}\b/gi,
  testWebhook: /\bwhsec_test_[a-zA-Z0-9]{32,}\b/gi,
  testSendGrid: /\bSG_test_[a-zA-Z0-9_-]{32,}\b/gi,
  testJWT: /\beyJ0ZXN0[a-zA-Z0-9-_]*\.[a-zA-Z0-9-_]*\.[a-zA-Z0-9-_]*\b/gi
};

// Directories to exclude from scanning
const EXCLUDE_DIRS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'coverage',
  'exports',
  'public',
  'test-backups',
  'backups',
  'cursor'
];

// File extensions to scan
const SCAN_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.txt', '.sql', '.env'
];

// Results storage
const results = {
  filesScanned: 0,
  totalMatches: 0,
  criticalIssues: 0,
  warningIssues: 0,
  allowedPatterns: 0,
  matchesByType: {},
  filesWithMatches: [],
  criticalFiles: []
};

/**
 * Check if a file should be scanned
 */
function shouldScanFile(filePath) {
  const ext = path.extname(filePath);
  const dir = path.dirname(filePath);
  
  // Check extension
  if (!SCAN_EXTENSIONS.includes(ext)) {
    return false;
  }
  
  // Check if in excluded directory
  for (const excludeDir of EXCLUDE_DIRS) {
    if (dir.includes(excludeDir)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Check if a match is an allowed test pattern
 */
function isAllowedPattern(match, type) {
  for (const [patternName, pattern] of Object.entries(ALLOWED_PATTERNS)) {
    if (pattern.test(match)) {
      return true;
    }
  }
  return false;
}

/**
 * Scan a single file for PII
 */
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileMatches = {};
    let fileCriticalIssues = 0;
    let fileWarningIssues = 0;
    let fileAllowedPatterns = 0;
    
    // Scan for critical patterns
    for (const [type, pattern] of Object.entries(PII_PATTERNS.critical)) {
      const matches = content.match(pattern);
      if (matches) {
        const validMatches = matches.filter(match => !isAllowedPattern(match, type));
        if (validMatches.length > 0) {
          fileMatches[type] = validMatches;
          fileCriticalIssues += validMatches.length;
          
          // Count by type
          if (!results.matchesByType[type]) {
            results.matchesByType[type] = 0;
          }
          results.matchesByType[type] += validMatches.length;
          
          // Track critical files
          if (!results.criticalFiles.includes(filePath)) {
            results.criticalFiles.push(filePath);
          }
        }
      }
    }
    
    // Scan for warning patterns
    for (const [type, pattern] of Object.entries(PII_PATTERNS.warning)) {
      const matches = content.match(pattern);
      if (matches) {
        const validMatches = matches.filter(match => !isAllowedPattern(match, type));
        if (validMatches.length > 0) {
          if (!fileMatches[type]) {
            fileMatches[type] = [];
          }
          fileMatches[type].push(...validMatches);
          fileWarningIssues += validMatches.length;
          
          // Count by type
          if (!results.matchesByType[type]) {
            results.matchesByType[type] = 0;
          }
          results.matchesByType[type] += validMatches.length;
        }
      }
    }
    
    // Count allowed patterns
    for (const [patternName, pattern] of Object.entries(ALLOWED_PATTERNS)) {
      const matches = content.match(pattern);
      if (matches) {
        fileAllowedPatterns += matches.length;
      }
    }
    
    // Update global results
    if (Object.keys(fileMatches).length > 0) {
      results.filesWithMatches.push({
        file: filePath,
        matches: fileMatches,
        critical: fileCriticalIssues,
        warning: fileWarningIssues,
        allowed: fileAllowedPatterns
      });
      
      results.totalMatches += fileCriticalIssues + fileWarningIssues;
      results.criticalIssues += fileCriticalIssues;
      results.warningIssues += fileWarningIssues;
      results.allowedPatterns += fileAllowedPatterns;
    }
    
  } catch (error) {
    console.warn(`⚠️  Warning: Could not read file ${filePath}: ${error.message}`);
  }
}

/**
 * Recursively scan a directory
 */
function scanDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stat.isFile() && shouldScanFile(fullPath)) {
        results.filesScanned++;
        scanFile(fullPath);
      }
    }
  } catch (error) {
    console.warn(`⚠️  Warning: Could not scan directory ${dirPath}: ${error.message}`);
  }
}

/**
 * Generate report
 */
function generateReport() {
  console.log('\n=== PII DETECTION REPORT (CI) ===\n');
  
  console.log(`📊 Scan Summary:`);
  console.log(`   Files scanned: ${results.filesScanned}`);
  console.log(`   Total matches: ${results.totalMatches}`);
  console.log(`   Critical issues: ${results.criticalIssues}`);
  console.log(`   Warning issues: ${results.warningIssues}`);
  console.log(`   Allowed patterns: ${results.allowedPatterns}`);
  
  if (results.totalMatches > 0) {
    console.log(`\n🚨 PII DETECTED!`);
    
    if (results.criticalIssues > 0) {
      console.log(`\n🚨 CRITICAL ISSUES (${results.criticalIssues}):`);
      results.criticalFiles.forEach(file => {
        console.log(`   ❌ ${file}`);
      });
    }
    
    if (results.warningIssues > 0) {
      console.log(`\n⚠️  WARNING ISSUES (${results.warningIssues}):`);
      results.filesWithMatches.forEach(fileResult => {
        if (fileResult.warning > 0) {
          console.log(`   ⚠️  ${fileResult.file} (${fileResult.warning} warnings)`);
        }
      });
    }
    
    console.log(`\n📈 Matches by type:`);
    Object.entries(results.matchesByType).forEach(([type, count]) => {
      const isCritical = Object.keys(PII_PATTERNS.critical).includes(type);
      const icon = isCritical ? '🚨' : '⚠️';
      console.log(`   ${icon} ${type}: ${count}`);
    });
    
  } else {
    console.log(`\n✅ NO PII DETECTED!`);
    console.log(`   Codebase is clean of personal identifiable information.`);
  }
  
  if (results.allowedPatterns > 0) {
    console.log(`\n✅ Allowed test patterns: ${results.allowedPatterns}`);
    console.log(`   These are safe test patterns and won't cause failures.`);
  }
  
  console.log(`\n=== COMPLIANCE STATUS ===`);
  if (results.criticalIssues > 0) {
    console.log(`🚨 FAILED: ${results.criticalIssues} critical PII issues detected`);
    console.log(`   BLOCKED: Production deployment not allowed`);
    console.log(`   ACTION REQUIRED: Remove critical PII before proceeding`);
  } else if (results.totalMatches > 0) {
    console.log(`⚠️  WARNING: ${results.warningIssues} non-critical PII patterns detected`);
    console.log(`   REVIEW REQUIRED: Clean up PII before production deployment`);
  } else {
    console.log(`✅ PASSED: Zero PII exposure detected`);
    console.log(`✅ READY: Safe for production deployment`);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Starting PII detection scan (CI mode)...\n');
  
  const startTime = Date.now();
  const projectRoot = process.cwd();
  
  console.log(`📁 Scanning project root: ${projectRoot}`);
  console.log(`🚫 Excluding directories: ${EXCLUDE_DIRS.join(', ')}`);
  console.log(`📄 File types: ${SCAN_EXTENSIONS.join(', ')}`);
  console.log(`✅ Allowing test patterns: ${Object.keys(ALLOWED_PATTERNS).join(', ')}\n`);
  
  // Start scanning
  scanDirectory(projectRoot);
  
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  console.log(`\n⏱️  Scan completed in ${duration.toFixed(2)}s`);
  
  // Generate and display report
  generateReport();
  
  // Exit with appropriate code
  if (results.criticalIssues > 0) {
    console.log(`\n🚨 EXIT CODE: 1 (Critical PII detected)`);
    process.exit(1);
  } else if (results.totalMatches > 0) {
    console.log(`\n⚠️  EXIT CODE: 2 (Warnings detected)`);
    process.exit(2);
  } else {
    console.log(`\n✅ EXIT CODE: 0 (Clean scan)`);
    process.exit(0);
  }
}

// Run the scan
if (require.main === module) {
  main();
}

module.exports = { scanDirectory, scanFile, results };
