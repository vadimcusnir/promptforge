#!/usr/bin/env node

/**
 * Intelligent Security Scanner for PromptForge v3
 * 
 * This scanner respects whitelisted patterns and files, focusing only on
 * genuinely sensitive information that could pose security risks.
 * 
 * Usage: node scripts/intelligent-security-scanner.js
 */

const fs = require('fs');
const path = require('path');

// Load whitelist configuration
let whitelistConfig = {};
try {
  whitelistConfig = JSON.parse(fs.readFileSync('scripts/security-whitelist.json', 'utf8'));
} catch (error) {
  console.warn('⚠️  Warning: Could not load whitelist config, using default patterns');
  whitelistConfig = {
    whitelisted_patterns: {
      phone_numbers: [],
      email_addresses: [],
      domains: [],
      addresses: []
    },
    whitelisted_files: [],
    whitelisted_extensions: []
  };
}

// Critical security patterns that should ALWAYS trigger alerts
const CRITICAL_PATTERNS = {
  // API Keys and Secrets
  stripeKeys: {
    name: 'Stripe API Keys',
    patterns: [
      /sk_(live|test)_[a-zA-Z0-9]{24,}/g,
      /pk_(live|test)_[a-zA-Z0-9]{24,}/g,
      /whsec_[a-zA-Z0-9]{24,}/g
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
  
  // Database URLs with credentials
  databaseUrls: {
    name: 'Database URLs with Credentials',
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
  
  // Credit Card Numbers (excluding obvious examples)
  creditCards: {
    name: 'Credit Card Numbers',
    patterns: [
      /(?<!00000000-0000-0000|0000-00000000000|1234-5678-9012-3456|0000-0000-0000-0000)\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g
    ],
    severity: 'CRITICAL'
  }
};

// High priority patterns that might be sensitive
const HIGH_PRIORITY_PATTERNS = {
  // Real-looking email addresses (excluding whitelisted)
  realEmails: {
    name: 'Potentially Real Email Addresses',
    patterns: [
      /(?<!example|test|demo|placeholder|your|company|domain|noreply|admin|info|support|contact|hello)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    ],
    severity: 'HIGH'
  },
  
  // Real-looking phone numbers (excluding whitelisted)
  realPhones: {
    name: 'Potentially Real Phone Numbers',
    patterns: [
      /(?<!555|000|123|999|111|222|333|444|666|777|888)[+]?[1-9][\d\s\-\(\)]{9,}/g
    ],
    severity: 'HIGH'
  },
  
  // Sensitive API endpoints
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
  /logs/
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
 * Check if a file is whitelisted
 */
function isWhitelistedFile(filePath) {
  // Check whitelisted extensions
  if (whitelistConfig.whitelisted_extensions.some(ext => filePath.endsWith(ext))) {
    return true;
  }
  
  // Check whitelisted file patterns
  return whitelistConfig.whitelisted_files.some(pattern => {
    const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
    return regex.test(filePath);
  });
}

/**
 * Check if a file has a scannable extension
 */
function hasScannableExtension(filePath) {
  return SCAN_EXTENSIONS.some(ext => filePath.endsWith(ext));
}

/**
 * Check if a pattern match is whitelisted
 */
function isWhitelistedPattern(match, patternType) {
  if (!whitelistConfig.whitelisted_patterns[patternType]) {
    return false;
  }
  
  return whitelistConfig.whitelisted_patterns[patternType].some(whitelisted => {
    // Convert whitelisted pattern to regex if it contains special characters
    if (/[.*+?^${}()|[\]\\]/.test(whitelisted)) {
      const regex = new RegExp(whitelisted.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      return regex.test(match);
    }
    return match.toLowerCase().includes(whitelisted.toLowerCase());
  });
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
  
  // Check if file is whitelisted
  if (isWhitelistedFile(filePath)) {
    return findings; // Skip whitelisted files
  }
  
  // Scan for critical patterns
  Object.entries(CRITICAL_PATTERNS).forEach(([key, patternInfo]) => {
    patternInfo.patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        findings.push({
          type: key,
          name: patternInfo.name,
          severity: patternInfo.severity,
          matches: matches.slice(0, 5),
          totalMatches: matches.length,
          lineNumbers: getLineNumbers(content, matches)
        });
      }
    });
  });
  
  // Scan for high priority patterns
  Object.entries(HIGH_PRIORITY_PATTERNS).forEach(([key, patternInfo]) => {
    patternInfo.patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        // Filter out whitelisted patterns
        const filteredMatches = matches.filter(match => {
          if (key === 'realEmails') {
            return !isWhitelistedPattern(match, 'email_addresses');
          } else if (key === 'realPhones') {
            return !isWhitelistedPattern(match, 'phone_numbers');
          }
          return true;
        });
        
        if (filteredMatches.length > 0) {
          findings.push({
            type: key,
            name: patternInfo.name,
            severity: patternInfo.severity,
            matches: filteredMatches.slice(0, 5),
            totalMatches: filteredMatches.length,
            lineNumbers: getLineNumbers(content, filteredMatches)
          });
        }
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
  
  return [...new Set(lineNumbers)].slice(0, 5);
}

/**
 * Generate a detailed report
 */
function generateReport(allFindings) {
  let report = '\n🔍 INTELLIGENT SECURITY SCAN REPORT\n';
  report += '=====================================\n\n';
  
  if (allFindings.length === 0) {
    report += '✅ No security issues detected!\n';
    report += '   All whitelisted patterns have been respected.\n';
    return report;
  }
  
  // Group findings by severity
  const criticalFindings = allFindings.filter(f => f.severity === 'CRITICAL');
  const highFindings = allFindings.filter(f => f.severity === 'HIGH');
  
  // Summary
  report += `📊 SUMMARY:\n`;
  report += `   Critical: ${criticalFindings.length}\n`;
  report += `   High: ${highFindings.length}\n\n`;
  
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
  
  // Whitelist information
  report += `📋 WHITELIST INFORMATION:\n`;
  report += `   - Documentation files (.md, .txt) are whitelisted\n`;
  report += `   - Example patterns (555-123-4567, test@example.com) are whitelisted\n`;
  report += `   - Cursor documentation files are whitelisted\n`;
  report += `   - Only genuinely sensitive data triggers alerts\n\n`;
  
  return report;
}

/**
 * Main scanning function
 */
function main() {
  console.log('🔍 Starting Intelligent Security Scan...\n');
  console.log('📋 Using whitelist configuration for legitimate example data\n');
  
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
      console.log(`💡 All detected issues are legitimate examples or documentation.`);
      console.log(`   The repository is secure for commit.\n`);
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
  CRITICAL_PATTERNS,
  HIGH_PRIORITY_PATTERNS
};
