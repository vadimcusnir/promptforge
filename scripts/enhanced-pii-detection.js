#!/usr/bin/env node

/**
 * Enhanced PII Detection Script for PromptForge v3
 * 
 * This script scans the codebase for potential PII and secret exposures:
 * - API keys and secrets
 * - Email addresses
 * - Phone numbers
 * - Credit card numbers
 * - UUIDs that might be real
 * - Hardcoded credentials
 * - Sensitive URLs
 * 
 * Usage: node scripts/enhanced-pii-detection.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Enhanced patterns for detecting sensitive information
const SENSITIVE_PATTERNS = {
  // API Keys and Secrets
  stripeKeys: {
    name: 'Stripe API Keys',
    patterns: [
      /sk_(live|test)_[a-zA-Z0-9]{24,}/g,
      /pk_(live|test)_[a-zA-Z0-9]{24,}/g,
      /whsec_[a-zA-Z0-9]{24,}/g,
      /sk_[a-zA-Z0-9]{24,}/g,
      /pk_[a-zA-Z0-9]{24,}/g
    ],
    severity: 'CRITICAL'
  },
  
  // Supabase Keys
  supabaseKeys: {
    name: 'Supabase Keys',
    patterns: [
      /eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/g
    ],
    severity: 'CRITICAL'
  },
  
  // SendGrid Keys
  sendgridKeys: {
    name: 'SendGrid API Keys',
    patterns: [
      /SG\.[a-zA-Z0-9_-]{20,}/g
    ],
    severity: 'CRITICAL'
  },
  
  // Email Addresses (excluding obvious examples)
  emailAddresses: {
    name: 'Email Addresses',
    patterns: [
      /(?<!example|test|demo|placeholder|your|company|domain|noreply|admin|info|support|contact|hello|hello@|test@|demo@|placeholder@|your@|company@|domain@|noreply@|admin@|info@|support@|contact@|hello@)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    ],
    severity: 'HIGH'
  },
  
  // Phone Numbers (excluding obvious examples)
  phoneNumbers: {
    name: 'Phone Numbers',
    patterns: [
      /(?<!000000-0000|000-0000000|123-456-7890|555-555-5555|000-000-0000|1234567890|0000000000|5555555555)[+]?[1-9][\d\s\-\(\)]{9,}/g
    ],
    severity: 'HIGH'
  },
  
  // Credit Card Numbers (excluding obvious examples)
  creditCards: {
    name: 'Credit Card Numbers',
    patterns: [
      /(?<!00000000-0000-0000|0000-00000000000|1234-5678-9012-3456|0000-0000-0000-0000)\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g
    ],
    severity: 'CRITICAL'
  },
  
  // UUIDs (excluding obvious examples)
  uuids: {
    name: 'UUIDs',
    patterns: [
      /(?<!00000000-0000-0000-0000-00000000000|00000000-0000-0000-0000-00000000001|00000000-0000-0000-0000-00000000002|00000000-0000-0000-0000-00000000003|00000000-0000-0000-0000-00000000004|00000000-0000-0000-0000-00000000005|00000000-0000-0000-0000-00000000006|00000000-0000-0000-0000-00000000007|00000000-0000-0000-0000-00000000008|00000000-0000-0000-0000-00000000009)[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi
    ],
    severity: 'MEDIUM'
  },
  
  // Database URLs
  databaseUrls: {
    name: 'Database URLs',
    patterns: [
      /postgresql:\/\/[^:\s]+:[^@\s]+@[^\s]+/g,
      /mysql:\/\/[^:\s]+:[^@\s]+@[^\s]+/g,
      /mongodb:\/\/[^:\s]+:[^@\s]+@[^\s]+/g
    ],
    severity: 'CRITICAL'
  },
  
  // JWT Secrets
  jwtSecrets: {
    name: 'JWT Secrets',
    patterns: [
      /JWT_SECRET\s*=\s*['"`][^'"`]{20,}['"`]/g,
      /NEXTAUTH_SECRET\s*=\s*['"`][^'"`]{20,}['"`]/g
    ],
    severity: 'CRITICAL'
  },
  
  // API Endpoints with potential sensitive data
  sensitiveEndpoints: {
    name: 'Sensitive API Endpoints',
    patterns: [
      /https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\/[a-zA-Z0-9\/_-]*\?[^'"`\s]*token[^'"`\s]*/g,
      /https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\/[a-zA-Z0-9\/_-]*\?[^'"`\s]*key[^'"`\s]*/g,
      /https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\/[a-zA-Z0-9\/_-]*\?[^'"`\s]*secret[^'"`\s]*/g
    ],
    severity: 'HIGH'
  }
};

// Files and directories to exclude from scanning
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /\.next/,
  /\.vercel/,
  /dist/,
  /build/,
  /coverage/,
  /\.DS_Store/,
  /\.env\.local/,
  /\.env\.production/,
  /\.env\.staging/,
  /pnpm-lock\.yaml/,
  /package-lock\.json/,
  /yarn\.lock/,
  /\.log$/,
  /\.tmp$/,
  /\.cache$/,
  /\.backup$/,
  /\.old$/,
  /\.bak$/
];

// File extensions to scan
const SCAN_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', '.md', '.txt', '.html', '.css', '.scss', '.json', '.yml', '.yaml', '.env', '.sh', '.sql'
];

/**
 * Check if a file should be excluded from scanning
 */
function shouldExcludeFile(filePath) {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath));
}

/**
 * Check if a file has a scannable extension
 */
function hasScannableExtension(filePath) {
  return SCAN_EXTENSIONS.some(ext => filePath.endsWith(ext));
}

/**
 * Recursively get all files in a directory
 */
function getAllFiles(dirPath, fileList = []) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!shouldExcludeFile(filePath)) {
        getAllFiles(filePath, fileList);
      }
    } else if (hasScannableExtension(filePath) && !shouldExcludeFile(filePath)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Scan a single file for sensitive patterns
 */
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const findings = [];
  
  Object.entries(SENSITIVE_PATTERNS).forEach(([key, patternInfo]) => {
    patternInfo.patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        findings.push({
          type: key,
          name: patternInfo.name,
          severity: patternInfo.severity,
          matches: matches.slice(0, 5), // Limit to first 5 matches
          totalMatches: matches.length,
          lineNumbers: getLineNumbers(content, matches)
        });
      }
    });
  });
  
  return findings;
}

/**
 * Get line numbers where matches occur
 */
function getLineNumbers(content, matches) {
  const lines = content.split('\n');
  const lineNumbers = [];
  
  matches.forEach(match => {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(match)) {
        lineNumbers.push(i + 1);
        break;
      }
    }
  });
  
  return [...new Set(lineNumbers)].slice(0, 5); // Limit to first 5 line numbers
}

/**
 * Generate a detailed report
 */
function generateReport(allFindings) {
  let report = '\n🔍 ENHANCED PII DETECTION REPORT\n';
  report += '=====================================\n\n';
  
  if (allFindings.length === 0) {
    report += '✅ No sensitive information detected!\n';
    return report;
  }
  
  // Group findings by severity
  const criticalFindings = allFindings.filter(f => f.severity === 'CRITICAL');
  const highFindings = allFindings.filter(f => f.severity === 'HIGH');
  const mediumFindings = allFindings.filter(f => f.severity === 'MEDIUM');
  
  // Summary
  report += `📊 SUMMARY:\n`;
  report += `   Critical: ${criticalFindings.length}\n`;
  report += `   High: ${highFindings.length}\n`;
  report += `   Medium: ${mediumFindings.length}\n\n`;
  
  // Critical findings
  if (criticalFindings.length > 0) {
    report += `🚨 CRITICAL FINDINGS (${criticalFindings.length}):\n`;
    report += `   These require immediate attention!\n\n`;
    
    criticalFindings.forEach(finding => {
      report += `   📁 ${finding.filePath}\n`;
      report += `   🔍 ${finding.name}\n`;
      report += `   📍 Lines: ${finding.lineNumbers.join(', ')}\n`;
      report += `   📊 Total matches: ${finding.totalMatches}\n`;
      report += `   🔑 Sample matches: ${finding.matches.slice(0, 3).join(', ')}\n\n`;
    });
  }
  
  // High findings
  if (highFindings.length > 0) {
    report += `⚠️  HIGH FINDINGS (${highFindings.length}):\n`;
    report += `   These should be reviewed soon.\n\n`;
    
    highFindings.forEach(finding => {
      report += `   📁 ${finding.filePath}\n`;
      report += `   🔍 ${finding.name}\n`;
      report += `   📍 Lines: ${finding.lineNumbers.join(', ')}\n`;
      report += `   📊 Total matches: ${finding.totalMatches}\n\n`;
    });
  }
  
  // Medium findings
  if (mediumFindings.length > 0) {
    report += `ℹ️  MEDIUM FINDINGS (${mediumFindings.length}):\n`;
    report += `   These should be reviewed when possible.\n\n`;
    
    mediumFindings.forEach(finding => {
      report += `   📁 ${finding.filePath}\n`;
      report += `   🔍 ${finding.name}\n`;
      report += `   📍 Lines: ${finding.lineNumbers.join(', ')}\n\n`;
    });
  }
  
  // Recommendations
  report += `💡 RECOMMENDATIONS:\n`;
  report += `   1. Review all CRITICAL findings immediately\n`;
  report += `   2. Replace real secrets with [EXAMPLE_PLACEHOLDER_...] format\n`;
  report += `   3. Use .env.local for actual values (already in .gitignore)\n`;
  report += `   4. Run this script before every commit\n`;
  report += `   5. Consider implementing git hooks for automated scanning\n\n`;
  
  return report;
}

/**
 * Main scanning function
 */
function main() {
  console.log('🔍 Starting Enhanced PII Detection Scan...\n');
  
  try {
    // Get all files to scan
    const allFiles = getAllFiles('.');
    console.log(`📁 Found ${allFiles.length} files to scan\n`);
    
    const allFindings = [];
    
    // Scan each file
    allFiles.forEach(filePath => {
      const findings = scanFile(filePath);
      if (findings.length > 0) {
        findings.forEach(finding => {
          finding.filePath = filePath;
          allFindings.push(finding);
        });
      }
    });
    
    // Generate and display report
    const report = generateReport(allFindings);
    console.log(report);
    
    // Exit with error code if critical findings exist
    const criticalCount = allFindings.filter(f => f.severity === 'CRITICAL').length;
    if (criticalCount > 0) {
      console.log(`❌ Scan completed with ${criticalCount} critical findings.`);
      console.log(`   Please address these issues before committing.\n`);
      process.exit(1);
    } else {
      console.log(`✅ Scan completed successfully!\n`);
      process.exit(0);
    }
    
  } catch (error) {
    console.error('❌ Error during scan:', error.message);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

module.exports = {
  scanFile,
  getAllFiles,
  SENSITIVE_PATTERNS
};
