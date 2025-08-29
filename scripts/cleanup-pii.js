#!/usr/bin/env node

/**
 * PII Cleanup Script for PromptForge
 * Systematically removes or sanitizes identified PII issues
 * Produces structured JSON reports for CI integration
 */

const fs = require('fs');
const path = require('path');

// Updated PII patterns with better categorization
const PII_PATTERNS = {
  // Critical PII patterns (immediate action required)
  realEmail: {
    pattern: /\b[A-Za-z0-9._%+-]+@(?!demo\.com|example\.com|test\.com|company\.com|promptforge\.com|yourcompany\.com)[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    replacement: '[EMAIL_REDACTED]',
    severity: 'critical',
    description: 'Real email addresses (excluding safe demo domains)'
  },
  realPhone: {
    pattern: /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
    replacement: '[PHONE_REDACTED]',
    severity: 'critical',
    description: 'Real phone numbers (excluding demo patterns)'
  },
  realSSN: {
    pattern: /\b\d{3}-\d{2}-\d{4}\b|\b\d{9}\b/g,
    replacement: '[SSN_REDACTED]',
    severity: 'critical',
    description: 'Social Security Numbers'
  },
  realCreditCard: {
    pattern: /(?<!00000000-0000-0000|0000-000000000000)\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
    replacement: '[CARD_REDACTED]',
    severity: 'critical',
    description: 'Real credit card numbers (excluding demo patterns)'
  },
  realAPIKey: {
    pattern: /(sk_|pk_|whsec_)(?!YOUR_|test_|example_)[a-zA-Z0-9_]{20,}/g,
    replacement: '[API_KEY_REDACTED]',
    severity: 'critical',
    description: 'Real API keys (excluding placeholders)'
  },
  
  // Medium priority patterns
  realDBConnection: {
    pattern: /postgresql:\/\/(?!username:password|test:test|USER:PASSWORD)[^\/\s]+:[^@\s]+@[^\/\s]+/g,
    replacement: '[DB_CONNECTION_REDACTED]',
    severity: 'medium',
    description: 'Real database connection strings'
  },
  realIPAddress: {
    pattern: /\b(?!10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|169\.254\.|127\.|0\.|255\.255\.255\.255)\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
    replacement: '[IP_REDACTED]',
    severity: 'medium',
    description: 'Real public IP addresses'
  }
};

// Safe demo/placeholder patterns (don't remove)
const SAFE_DEMO_PATTERNS = [
  // Demo emails
  /\b[a-z]+@demo\.com\b/g,
  /\b[a-z]+@example\.com\b/g,
  /\b[a-z]+@test\.com\b/g,
  /\b[a-z]+@company\.com\b/g,
  /\b[a-z]+@promptforge\.com\b/g,
  /\b[a-z]+@yourcompany\.com\b/g,
  /\b[a-z]+@chatgpt-prompting\.com\b/g,
  
  // Safe placeholder patterns
  /\[EXAMPLE_EMAIL_[^]]+\]/g,
  /\[EXAMPLE_PHONE_[^]]+\]/g,
  /\[EXAMPLE_PLACEHOLDER_[^]]+\]/g,
  /\[EXAMPLE_DB_URL_[^]]+\]/g,
  
  // Safe phone patterns
  /\b000-000-0000\b/g,
  /\b555-123-4567\b/g,
  /\b\(555\)\s*123-4567\b/g,
  /\b000000-0000\b/g,
  
  // Safe demo patterns
  /\b00000000-0000-0000-0000-000000000000\b/g,
  /\b0000-0000-0000-0000\b/g,
  /\b00000000-0000-0000\b/g,
  
  // Placeholder API keys
  /(sk_|pk_|whsec_)YOUR_[A-Z_]+_HERE/g,
  /(sk_|pk_|whsec_)test_[a-z_]+_here/g,
  /whsec_test_secret_key_for_testing/g
];

// Files to clean up (priority order)
const CRITICAL_FILES = [
  'db/seeds.sql',
  'stripe-config.env',
  'scripts/migrate.js',
  'supabase/migrations'
];

function isSafeDemoData(text) {
  return SAFE_DEMO_PATTERNS.some(pattern => pattern.test(text));
}

function cleanupFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {
      file: filePath,
      status: 'not_found',
      changes: 0,
      errors: []
    };
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changes = 0;
    const changesDetail = [];
    
    // Apply PII cleanup patterns
    Object.entries(PII_PATTERNS).forEach(([type, config]) => {
      if (config.pattern.test(content)) {
        const beforeCount = (content.match(config.pattern) || []).length;
        content = content.replace(config.pattern, config.replacement);
        const afterCount = (content.match(config.pattern) || []).length;
        const actualChanges = beforeCount - afterCount;
        
        if (actualChanges > 0) {
          changes += actualChanges;
          changesDetail.push({
            type,
            severity: config.severity,
            description: config.description,
            count: actualChanges
          });
        }
      }
    });
    
    if (changes > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      return {
        file: filePath,
        status: 'cleaned',
        changes,
        changesDetail,
        errors: []
      };
    } else {
      return {
        file: filePath,
        status: 'no_changes',
        changes: 0,
        changesDetail: [],
        errors: []
      };
    }
    
  } catch (error) {
    return {
      file: filePath,
      status: 'error',
      changes: 0,
      changesDetail: [],
      errors: [error.message]
    };
  }
}

function generateJSONReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    script: 'cleanup-pii.js',
    summary: {
      totalFiles: results.length,
      cleaned: results.filter(r => r.status === 'cleaned').length,
      noChanges: results.filter(r => r.status === 'no_changes').length,
      errors: results.filter(r => r.status === 'error').length,
      notFound: results.filter(r => r.status === 'not_found').length,
      totalChanges: results.reduce((sum, r) => sum + r.changes, 0)
    },
    results: results,
    metadata: {
      patterns: Object.keys(PII_PATTERNS),
      safePatterns: SAFE_DEMO_PATTERNS.length,
      version: '2.0.0'
    }
  };
  
  return report;
}

function main() {
  console.log('🧹 PromptForge PII Cleanup Script v2.0');
  console.log('========================================\n');
  
  const results = [];
  
  // Clean up critical files
  CRITICAL_FILES.forEach(file => {
    if (fs.existsSync(file)) {
      if (fs.statSync(file).isDirectory()) {
        // Handle directories
        const files = fs.readdirSync(file).filter(f => f.endsWith('.sql'));
        files.forEach(f => {
          const result = cleanupFile(path.join(file, f));
          results.push(result);
        });
      } else {
        const result = cleanupFile(file);
        results.push(result);
      }
    } else {
      results.push({
        file,
        status: 'not_found',
        changes: 0,
        changesDetail: [],
        errors: []
      });
    }
  });
  
  // Generate and save JSON report
  const report = generateJSONReport(results);
  const reportPath = 'pii-cleanup-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Display summary
  console.log('📊 Cleanup Summary:');
  console.log(`   Files processed: ${report.summary.totalFiles}`);
  console.log(`   Files cleaned: ${report.summary.cleaned}`);
  console.log(`   No changes needed: ${report.summary.noChanges}`);
  console.log(`   Errors: ${report.summary.errors}`);
  console.log(`   Total changes: ${report.summary.totalChanges}`);
  
  if (report.summary.cleaned > 0) {
    console.log('\n✅ PII cleanup completed successfully!');
    console.log(`📄 Detailed report saved to: ${reportPath}`);
  }
  
  console.log('\n🔍 Next steps:');
  console.log('   1. Review the JSON report for detailed information');
  console.log('   2. Run PII scan again: node scripts/intelligent-pii-scan.js');
  console.log('   3. Commit changes with appropriate message');
  
  // Exit with error code if there were issues
  if (report.summary.errors > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { cleanupFile, isSafeDemoData, generateJSONReport };
