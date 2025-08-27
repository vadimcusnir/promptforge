#!/usr/bin/env node

/**
 * PII Detection Test Script
 * Scans the codebase for potential PII exposure
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// PII patterns to test
const PII_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b|\b\d{9}\b/g,
  creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
  ipAddress: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
  apiKey: /\b(?:sk-|pk_|AIza|ghp_|gho_)[A-Za-z0-9_-]{20,}\b/g,
  privateKey: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----[\s\S]*?-----END\s+(?:RSA\s+)?PRIVATE\s+KEY-----/gi,
  jwtToken: /\beyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*\b/g,
  dbConnection: /(?:postgresql?|mysql|mongodb):\/\/[^:\s]+:[^@\s]+@[^:\s]+/gi,
  awsCredentials: /\bAKIA[0-9A-Z]{16}\b|\baws_access_key_id\s*=\s*[^\s]+/gi
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
  'public'
];

// File extensions to scan
const SCAN_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.txt', '.sql', '.env'
];

// Results storage
const results = {
  filesScanned: 0,
  totalMatches: 0,
  matchesByType: {},
  filesWithMatches: [],
  criticalIssues: 0
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
 * Scan a single file for PII
 */
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileMatches = {};
    let fileTotalMatches = 0;
    
    // Scan for each PII type
    for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
      const matches = content.match(pattern);
      if (matches) {
        fileMatches[type] = matches;
        fileTotalMatches += matches.length;
        
        // Count by type
        if (!results.matchesByType[type]) {
          results.matchesByType[type] = 0;
        }
        results.matchesByType[type] += matches.length;
        
        // Check for critical issues
        if (['ssn', 'creditCard', 'apiKey', 'privateKey', 'awsCredentials'].includes(type)) {
          results.criticalIssues += matches.length;
        }
      }
    }
    
    if (fileTotalMatches > 0) {
      results.filesWithMatches.push({
        file: filePath,
        matches: fileMatches,
        total: fileTotalMatches
      });
      results.totalMatches += fileTotalMatches;
    }
    
    results.filesScanned++;
    
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath}:`, error.message);
  }
}

/**
 * Recursively scan directory
 */
function scanDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stat.isFile()) {
        if (shouldScanFile(fullPath)) {
          scanFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not access directory ${dirPath}:`, error.message);
  }
}

/**
 * Generate report
 */
function generateReport() {
  console.log('\n=== PII DETECTION REPORT ===\n');
  
  console.log(`📊 Scan Summary:`);
  console.log(`   Files scanned: ${results.filesScanned}`);
  console.log(`   Total matches: ${results.totalMatches}`);
  console.log(`   Critical issues: ${results.criticalIssues}`);
  
  if (results.totalMatches > 0) {
    console.log(`\n🚨 PII DETECTED!`);
    console.log(`\n📁 Files with matches:`);
    
    results.filesWithMatches.forEach(fileResult => {
      console.log(`\n   ${fileResult.file} (${fileResult.total} matches):`);
      Object.entries(fileResult.matches).forEach(([type, matches]) => {
        console.log(`     ${type}: ${matches.length} matches`);
        // Show first few matches as examples
        matches.slice(0, 3).forEach(match => {
          console.log(`       - ${match.substring(0, 50)}${match.length > 50 ? '...' : ''}`);
        });
      });
    });
    
    console.log(`\n📈 Matches by type:`);
    Object.entries(results.matchesByType).forEach(([type, count]) => {
      const critical = ['ssn', 'creditCard', 'apiKey', 'privateKey', 'awsCredentials'].includes(type);
      const icon = critical ? '🚨' : '⚠️';
      console.log(`   ${icon} ${type}: ${count}`);
    });
    
    if (results.criticalIssues > 0) {
      console.log(`\n🚨 CRITICAL: ${results.criticalIssues} critical PII issues found!`);
      console.log(`   Immediate action required to prevent data exposure.`);
      process.exit(1);
    }
    
  } else {
    console.log(`\n✅ NO PII DETECTED!`);
    console.log(`   Codebase is clean of personal identifiable information.`);
  }
  
  console.log(`\n=== COMPLIANCE STATUS ===`);
  if (results.totalMatches === 0) {
    console.log(`✅ PASSED: Zero PII exposure detected`);
    console.log(`✅ READY: Safe for production deployment`);
  } else if (results.criticalIssues === 0) {
    console.log(`⚠️  WARNING: Non-critical PII patterns detected`);
    console.log(`   Review and clean before production deployment`);
  } else {
    console.log(`🚨 FAILED: Critical PII exposure detected`);
    console.log(`   BLOCKED: Production deployment not allowed`);
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Starting PII detection scan...\n');
  
  const startTime = Date.now();
  const projectRoot = process.cwd();
  
  console.log(`📁 Scanning project root: ${projectRoot}`);
  console.log(`🚫 Excluding directories: ${EXCLUDE_DIRS.join(', ')}`);
  console.log(`📄 File types: ${SCAN_EXTENSIONS.join(', ')}\n`);
  
  // Start scanning
  scanDirectory(projectRoot);
  
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  console.log(`\n⏱️  Scan completed in ${duration.toFixed(2)}s`);
  
  // Generate and display report
  generateReport();
  
  // Exit with appropriate code
  if (results.criticalIssues > 0) {
    process.exit(1);
  } else if (results.totalMatches > 0) {
    process.exit(2);
  } else {
    process.exit(0);
  }
}

// Run the scan
if (require.main === module) {
  main();
}

module.exports = { scanDirectory, scanFile, results };
