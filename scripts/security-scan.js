#!/usr/bin/env node

/**
 * 🔒 Comprehensive Security Scanner for PromptForge
 * 
 * This script scans the entire codebase for potential security issues:
 * - API keys and secrets
 * - Hardcoded credentials
 * - JWT tokens
 * - Private keys
 * - Database connection strings
 * - Environment file issues
 * - PII data
 * 
 * Usage:
 *   node scripts/security-scan.js [options]
 * 
 * Options:
 *   --fix          Attempt to fix common issues
 *   --verbose      Show detailed output
 *   --json         Output results in JSON format
 *   --exclude-dirs Comma-separated list of directories to exclude
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  fix: args.includes('--fix'),
  verbose: args.includes('--verbose'),
  json: args.includes('--json'),
  excludeDirs: args.find(arg => arg.startsWith('--exclude-dirs='))?.split('=')[1]?.split(',') || []
};

// Default exclude directories
const DEFAULT_EXCLUDE_DIRS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'coverage',
  '.nyc_output',
  'logs',
  'tmp',
  'temp'
];

// Combine default and custom exclude directories
const excludeDirs = [...DEFAULT_EXCLUDE_DIRS, ...options.excludeDirs];

// Security patterns to detect
const SECURITY_PATTERNS = {
  // API Keys
  stripe: {
    name: 'Stripe API Keys',
    patterns: [
      /sk_(live|test)_[a-zA-Z0-9]{24,}/g,
      /pk_(live|test)_[a-zA-Z0-9]{24,}/g,
      /whsec_[a-zA-Z0-9]{32,}/g,
      /rpk_[a-zA-Z0-9]{24,}/g
    ],
    severity: 'HIGH',
    description: 'Stripe API keys should be stored in environment variables'
  },
  
  // JWT Tokens
  jwt: {
    name: 'JWT Tokens',
    patterns: [
      /eyJ[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,}/g
    ],
    severity: 'HIGH',
    description: 'JWT tokens should not be hardcoded in source code'
  },
  
  // SendGrid
  sendgrid: {
    name: 'SendGrid API Keys',
    patterns: [
      /SG\.[a-zA-Z0-9_-]{32,}/g
    ],
    severity: 'HIGH',
    description: 'SendGrid API keys should be stored in environment variables'
  },
  
  // AWS
  aws: {
    name: 'AWS Credentials',
    patterns: [
      /AKIA[0-9A-Z]{16}/g,
      /[0-9a-zA-Z/+]{40}/g
    ],
    severity: 'HIGH',
    description: 'AWS access keys should be stored in environment variables'
  },
  
  // Database URLs
  database: {
    name: 'Database Connection Strings',
    patterns: [
      /(postgresql?|mysql|mongodb):\/\/[^:]+:[^@]+@[^\/]+\/[^?\s]+/g,
      /(postgresql?|mysql|mongodb):\/\/[^:]+:[^@]+@[^\/]+/g
    ],
    severity: 'MEDIUM',
    description: 'Database credentials should be stored in environment variables'
  },
  
  // Private Keys
  privateKeys: {
    name: 'Private Keys',
    patterns: [
      /-----BEGIN\s+(RSA|DSA|EC|OPENSSH)\s+PRIVATE\s+KEY-----/g,
      /-----BEGIN\s+PRIVATE\s+KEY-----/g
    ],
    severity: 'CRITICAL',
    description: 'Private keys should never be committed to version control'
  },
  
  // Generic API Keys
  genericApiKeys: {
    name: 'Generic API Keys',
    patterns: [
      /[a-zA-Z0-9]{32,}/g
    ],
    severity: 'LOW',
    description: 'Potential API keys - review manually'
  },
  
  // OAuth Secrets
  oauth: {
    name: 'OAuth Secrets',
    patterns: [
      /[a-zA-Z0-9]{20,}_[a-zA-Z0-9]{20,}/g
    ],
    severity: 'MEDIUM',
    description: 'OAuth client secrets should be stored in environment variables'
  },
  
  // Email Addresses (potential PII)
  emailAddresses: {
    name: 'Email Addresses',
    patterns: [
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    ],
    severity: 'LOW',
    description: 'Email addresses may contain PII - review manually'
  },
  
  // Phone Numbers (potential PII)
  phoneNumbers: {
    name: 'Phone Numbers',
    patterns: [
      /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g
    ],
    severity: 'LOW',
    description: 'Phone numbers may contain PII - review manually'
  }
};

// File extensions to scan
const SCANNABLE_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', '.json', '.yaml', '.yml',
  '.md', '.txt', '.sh', '.bash', '.zsh', '.fish',
  '.env', '.env.local', '.env.example', '.env.template'
];

// Results storage
const scanResults = {
  startTime: new Date(),
  endTime: null,
  totalFiles: 0,
  scannedFiles: 0,
  issues: [],
  summary: {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  }
};

/**
 * Check if a file should be scanned
 */
function shouldScanFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const relativePath = path.relative(process.cwd(), filePath);
  
  // Check if file extension is scannable
  if (!SCANNABLE_EXTENSIONS.includes(ext)) {
    return false;
  }
  
  // Check if file is in excluded directories
  for (const excludeDir of excludeDirs) {
    if (relativePath.startsWith(excludeDir + path.sep) || relativePath === excludeDir) {
      return false;
    }
  }
  
  // Skip binary files
  try {
    const stats = fs.statSync(filePath);
    if (stats.size > 1024 * 1024) { // Skip files larger than 1MB
      return false;
    }
  } catch (error) {
    return false;
  }
  
  return true;
}

/**
 * Scan a single file for security issues
 */
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(process.cwd(), filePath);
    const issues = [];
    
    // Check each security pattern
    for (const [category, config] of Object.entries(SECURITY_PATTERNS)) {
      for (const pattern of config.patterns) {
        const matches = content.match(pattern);
        if (matches) {
          // Filter out false positives for generic patterns
          if (category === 'genericApiKeys') {
            // Skip common false positives
            const falsePositives = [
              'node_modules', 'package.json', 'README', 'LICENSE',
              'commit', 'hash', 'sha256', 'md5', 'uuid'
            ];
            
            const isFalsePositive = falsePositives.some(fp => 
              content.toLowerCase().includes(fp.toLowerCase())
            );
            
            if (isFalsePositive) continue;
          }
          
          // Get context around the match
          const lines = content.split('\n');
          const contextLines = [];
          
          for (const match of matches) {
            const lineIndex = lines.findIndex(line => line.includes(match));
            if (lineIndex !== -1) {
              const start = Math.max(0, lineIndex - 2);
              const end = Math.min(lines.length - 1, lineIndex + 2);
              
              for (let i = start; i <= end; i++) {
                const prefix = i === lineIndex ? '>>> ' : '    ';
                contextLines.push(`${prefix}${i + 1}: ${lines[i]}`);
              }
              contextLines.push(''); // Empty line for separation
            }
          }
          
          issues.push({
            category,
            pattern: config.name,
            severity: config.severity,
            description: config.description,
            matches: matches.length,
            context: contextLines.join('\n'),
            suggestions: getSuggestions(category, relativePath)
          });
        }
      }
    }
    
    // Check for environment file issues
    if (relativePath.includes('.env') && !relativePath.includes('.example') && !relativePath.includes('.template')) {
      const envIssues = checkEnvironmentFile(content, relativePath);
      issues.push(...envIssues);
    }
    
    return issues;
  } catch (error) {
    if (options.verbose) {
      console.warn(`Warning: Could not read file ${filePath}: ${error.message}`);
    }
    return [];
  }
}

/**
 * Check environment files for common issues
 */
function checkEnvironmentFile(content, filePath) {
  const issues = [];
  
  // Check for real API keys (not placeholder values)
  const realKeyPatterns = [
    /sk_live_[a-zA-Z0-9]{24,}/g,
    /pk_live_[a-zA-Z0-9]{24,}/g,
    /whsec_[a-zA-Z0-9]{32,}/g,
    /SG\.[a-zA-Z0-9_-]{32,}/g,
    /AKIA[0-9A-Z]{16}/g
  ];
  
  for (const pattern of realKeyPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      issues.push({
        category: 'environmentFile',
        pattern: 'Real API Keys in Environment File',
        severity: 'CRITICAL',
        description: `Real API keys found in ${filePath} - this file should not be committed!`,
        matches: matches.length,
        context: `File: ${filePath}`,
        suggestions: [
          'Remove this file from version control immediately',
          'Add it to .gitignore if not already there',
          'Use .env.local.example for templates',
          'Store real keys in environment variables or secure secret management'
        ]
      });
    }
  }
  
  // Check for placeholder values that should be replaced
  const placeholderPatterns = [
    /your_key_here/g,
    /your_secret_here/g,
    /your_project_id/g,
    /your_database_url/g
  ];
  
  for (const pattern of placeholderPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      issues.push({
        category: 'environmentFile',
        pattern: 'Placeholder Values',
        severity: 'LOW',
        description: `Placeholder values found in ${filePath}`,
        matches: matches.length,
        context: `File: ${filePath}`,
        suggestions: [
          'Replace placeholder values with actual configuration',
          'Ensure this file is not committed to version control'
        ]
      });
    }
  }
  
  return issues;
}

/**
 * Get suggestions for fixing security issues
 */
function getSuggestions(category, filePath) {
  const suggestions = {
    stripe: [
      'Store Stripe keys in environment variables',
      'Use process.env.STRIPE_SECRET_KEY in your code',
      'Never commit .env.local files'
    ],
    jwt: [
      'Remove hardcoded JWT tokens',
      'Generate tokens dynamically',
      'Store secrets in environment variables'
    ],
    sendgrid: [
      'Store SendGrid API key in environment variables',
      'Use process.env.SENDGRID_API_KEY in your code'
    ],
    aws: [
      'Store AWS credentials in environment variables',
      'Use AWS IAM roles when possible',
      'Rotate access keys regularly'
    ],
    database: [
      'Store database credentials in environment variables',
      'Use connection pooling',
      'Implement proper access controls'
    ],
    privateKeys: [
      'Remove private keys immediately',
      'Use environment variables for sensitive data',
      'Consider using key management services'
    ],
    genericApiKeys: [
      'Review if this is actually a secret',
      'Store in environment variables if sensitive',
      'Document non-sensitive keys'
    ],
    oauth: [
      'Store OAuth secrets in environment variables',
      'Use secure secret management',
      'Rotate secrets regularly'
    ],
    emailAddresses: [
      'Review if email addresses contain PII',
      'Use placeholder emails in examples',
      'Implement proper data anonymization'
    ],
    phoneNumbers: [
      'Review if phone numbers contain PII',
      'Use placeholder numbers in examples',
      'Implement proper data anonymization'
    ]
  };
  
  return suggestions[category] || ['Review this issue manually'];
}

/**
 * Recursively scan directory for files
 */
function scanDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      
      try {
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          scanDirectory(fullPath);
        } else if (stats.isFile()) {
          scanResults.totalFiles++;
          
          if (shouldScanFile(fullPath)) {
            scanResults.scannedFiles++;
            const fileIssues = scanFile(fullPath);
            scanResults.issues.push(...fileIssues.map(issue => ({
              ...issue,
              file: fullPath
            })));
          }
        }
      } catch (error) {
        if (options.verbose) {
          console.warn(`Warning: Could not access ${fullPath}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    if (options.verbose) {
      console.warn(`Warning: Could not read directory ${dirPath}: ${error.message}`);
    }
  }
}

/**
 * Generate summary statistics
 */
function generateSummary() {
  for (const issue of scanResults.issues) {
    switch (issue.severity) {
      case 'CRITICAL':
        scanResults.summary.critical++;
        break;
      case 'HIGH':
        scanResults.summary.high++;
        break;
      case 'MEDIUM':
        scanResults.summary.medium++;
        break;
      case 'LOW':
        scanResults.summary.low++;
        break;
    }
  }
}

/**
 * Display results in console
 */
function displayResults() {
  if (options.json) {
    console.log(JSON.stringify(scanResults, null, 2));
    return;
  }
  
  console.log('\n🔒 Security Scan Results');
  console.log('=' .repeat(50));
  console.log(`Start Time: ${scanResults.startTime.toISOString()}`);
  console.log(`Total Files: ${scanResults.totalFiles}`);
  console.log(`Scanned Files: ${scanResults.scannedFiles}`);
  console.log(`Issues Found: ${scanResults.issues.length}`);
  
  console.log('\n📊 Summary:');
  console.log(`  Critical: ${scanResults.summary.critical}`);
  console.log(`  High:     ${scanResults.summary.high}`);
  console.log(`  Medium:   ${scanResults.summary.medium}`);
  console.log(`  Low:      ${scanResults.summary.low}`);
  
  if (scanResults.issues.length === 0) {
    console.log('\n✅ No security issues found!');
    return;
  }
  
  console.log('\n🚨 Issues Found:');
  console.log('=' .repeat(50));
  
  // Group issues by severity
  const criticalIssues = scanResults.issues.filter(i => i.severity === 'CRITICAL');
  const highIssues = scanResults.issues.filter(i => i.severity === 'HIGH');
  const mediumIssues = scanResults.issues.filter(i => i.severity === 'MEDIUM');
  const lowIssues = scanResults.issues.filter(i => i.severity === 'LOW');
  
  const displayIssues = (issues, severity) => {
    if (issues.length === 0) return;
    
    console.log(`\n${severity} Severity Issues:`);
    console.log('-' .repeat(30));
    
    for (const issue of issues) {
      const relativePath = path.relative(process.cwd(), issue.file);
      console.log(`\n🔍 ${issue.pattern}`);
      console.log(`📁 File: ${relativePath}`);
      console.log(`⚠️  Severity: ${issue.severity}`);
      console.log(`📝 Description: ${issue.description}`);
      console.log(`🔢 Matches: ${issue.matches}`);
      
      if (options.verbose) {
        console.log(`📄 Context:\n${issue.context}`);
      }
      
      console.log(`💡 Suggestions:`);
      for (const suggestion of issue.suggestions) {
        console.log(`   • ${suggestion}`);
      }
    }
  };
  
  displayIssues(criticalIssues, '🚨 CRITICAL');
  displayIssues(highIssues, '🔴 HIGH');
  displayIssues(mediumIssues, '🟡 MEDIUM');
  displayIssues(lowIssues, '🟢 LOW');
  
  // Display recommendations
  console.log('\n💡 Recommendations:');
  console.log('=' .repeat(50));
  
  if (scanResults.summary.critical > 0) {
    console.log('🚨 CRITICAL: Fix these issues immediately before any commits!');
  }
  
  if (scanResults.summary.high > 0) {
    console.log('🔴 HIGH: Fix these issues before deploying to production.');
  }
  
  if (scanResults.summary.medium > 0) {
    console.log('🟡 MEDIUM: Address these issues in the next development cycle.');
  }
  
  if (scanResults.summary.low > 0) {
    console.log('🟢 LOW: Review these issues when convenient.');
  }
  
  console.log('\n🔧 Next Steps:');
  console.log('1. Review and fix critical and high severity issues');
  console.log('2. Update .env.local.example with any new environment variables');
  console.log('3. Ensure .env.local is in .gitignore');
  console.log('4. Run this scan again after making changes');
  console.log('5. Consider setting up pre-commit hooks for ongoing security');
}

/**
 * Main function
 */
function main() {
  console.log('🔒 Starting security scan...');
  console.log(`📁 Scanning directory: ${process.cwd()}`);
  console.log(`🚫 Excluding directories: ${excludeDirs.join(', ')}`);
  
  if (options.fix) {
    console.log('🔧 Fix mode enabled - attempting to fix common issues');
  }
  
  if (options.verbose) {
    console.log('📝 Verbose mode enabled - showing detailed output');
  }
  
  // Start scanning
  const startTime = Date.now();
  scanDirectory(process.cwd());
  const endTime = Date.now();
  
  // Generate results
  scanResults.endTime = new Date();
  generateSummary();
  
  // Display results
  displayResults();
  
  console.log(`\n⏱️  Scan completed in ${((endTime - startTime) / 1000).toFixed(2)} seconds`);
  
  // Exit with appropriate code
  if (scanResults.summary.critical > 0 || scanResults.summary.high > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// Run the scan
if (require.main === module) {
  main();
}

module.exports = {
  scanDirectory,
  scanFile,
  shouldScanFile,
  SECURITY_PATTERNS
};
