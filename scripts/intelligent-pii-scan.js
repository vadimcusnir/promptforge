#!/usr/bin/env node

/**
 * Intelligent PII Scanner for PromptForge
 * Distinguishes between real PII and legitimate demo/placeholder data
 */

const fs = require('fs');
const path = require('path');

// Real PII patterns (high confidence)
const REAL_PII_PATTERNS = {
  // Real email addresses (excluding demo/example domains)
  realEmail: /\b[A-Za-z0-9._%+-]+@(?!demo\.com|example\.com|test\.com|company\.com|promptforge\.com)[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  
  // Real phone numbers (excluding demo patterns)
  realPhone: /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
  
  // Real SSN
  realSSN: /\b\d{3}-\d{2}-\d{4}\b|\b\d{9}\b/g,
  
  // Real credit card numbers (excluding demo patterns)
  realCreditCard: /(?<!00000000-0000-0000|0000-000000000000)\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
  
  // Real API keys (excluding placeholders)
  realAPIKey: /(sk_|pk_|whsec_)(?!YOUR_)[a-zA-Z0-9_]{20,}/g,
  
  // Real database connections (excluding placeholders)
  realDBConnection: /postgresql:\/\/(?!username:password|test:test)[^\/\s]+:[^@\s]+@[^\/\s]+/g,
  
  // Real IP addresses (excluding private/local ranges)
  realIPAddress: /\b(?!10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|169\.254\.|127\.|0\.|255\.255\.255\.255)\b(?:\d{1,3}\.){3}\d{1,3}\b/g
};

// Safe demo/placeholder patterns (don't flag)
const SAFE_PATTERNS = [
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
  // Safe phone patterns
  /phone:\s*\[EXAMPLE_PHONE_[^]]+\]/g,
  /tel:\s*\[EXAMPLE_PHONE_[^]]+\]/g,
  /\[EXAMPLE_PHONE_\+1\s*\(555\)\s*123-4567\]/g,
  /\[EXAMPLE_PHONE_\(555\)\s*123-4567\]/g,
  // Safe demo patterns
  /\b1234567890\b/g,
  /\b123-456-7890\b/g,
  /\b555-555-5555\b/g,
  /\b5555555555\b/g,
  /\b0000000002\b/g,
  
  // Demo phone numbers
  /\b000000-0000\b/g,
  /\b000-0000000\b/g,
  /\b555-123-4567\b/g,
  /\b1\s*\(555\)\s*123-4567\b/g,
  /\b0000000000\b/g,
  /\b0000000001\b/g,
  /\b000-000-0000\b/g,
  /\b\(555\)\s*123-4567\b/g,
  /\b5551234567\b/g,
  /\b\+1\s*555\s*123\s*4567\b/g,
  /\b000000-0000\b/g,
  /\b555\.123\.4567\b/g,
  /\b555\s*123\s*4567\b/g,
  /\b555\s*123-4567\b/g,
  /\b0000000003\b/g,
  /\b0000000004\b/g,
  /\b555-123\s*4567\b/g,
  /\b0000000005\b/g,
  /\b0000000006\b/g,
  /\b0000000007\b/g,
  /\b0000000008\b/g,
  /\b0000000009\b/g,
  /\b000000-0000\b/g,
  /\b555-123-4567\b/g,
  
  // Demo credit cards
  /\b00000000-0000-0000\b/g,
  /\b0000-0000-0000-0000\b/g,
  /\b0000-0000-0000-0001\b/g,
  /\b0000-000000000000\b/g,
  /\b0000-000000000001\b/g,
  /\b1234-5678-9012-3456\b/g,
  /\b00000000-0000-0000\b/g,
  /\b0000-000000000000\b/g,
  /\b00000000-0000-0000\b/g,
  /\b00000000-0000-0000\b/g,
  
  // Demo UUIDs
  /\b00000000-0000-0000-0000-000000000000\b/g,
  /\b00000000-0000-0000-0000-000000000001\b/g,
  
  // Placeholder API keys
  /(sk_|pk_|whsec_)YOUR_[A-Z_]+_HERE/g,
  /(sk_|pk_|pk_)test_your_[a-z_]+_here/g,
  /whsec_test_secret_key_for_testing/g,
  /sk_[a-z_]+_framework/g,
  /sk_[a-z_]+_percentage/g,
  /sk_[a-z_]+_projections/g,
  /sk_[a-z_]+_mitigation/g,
  /pk_test_your_stripe_publishable_key_here/g,
  /whsec_your_webhook_secret_here/g,
  /whsec_your_webhook_secret_here/g,
  /sk_test_example_key_for_dev_only/g,
  /pk_test_example_key_for_dev_only/g,
  /whsec_example_webhook_for_dev_only/g,
  
  // Placeholder database connections
  /postgresql:\/\/username:password@localhost/g,
  /postgresql:\/\/test:test@localhost/g,
  
  // CSS/HTML values (z-index, etc.)
  /z-index:\s*[0-9]+/g,
  
  // Cloudflare/analytics script URLs
  /cloudflareinsights\.com\/beacon\.min\.js\/[a-z0-9]+/g
];

function isSafeDemoData(text) {
  return SAFE_PATTERNS.some(pattern => pattern.test(text));
}

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const results = {
      file: filePath,
      realPII: {},
      safeData: {},
      totalIssues: 0
    };
    
    // Check for real PII
    Object.entries(REAL_PII_PATTERNS).forEach(([type, pattern]) => {
      const matches = content.match(pattern);
      if (matches) {
        // Filter out safe demo data
        const realMatches = matches.filter(match => !isSafeDemoData(match));
        if (realMatches.length > 0) {
          results.realPII[type] = {
            count: realMatches.length,
            examples: realMatches.slice(0, 3) // Show first 3 examples
          };
          results.totalIssues += realMatches.length;
        }
      }
    });
    
    return results;
  } catch (error) {
    return {
      file: filePath,
      error: error.message,
      realPII: {},
      safeData: {},
      totalIssues: 0
    };
  }
}

function scanDirectory(dirPath, excludeDirs = ['node_modules', '.git', '.next', 'dist', 'build', 'coverage', 'exports', 'public']) {
  const results = [];
  
  function scanRecursive(currentPath) {
    if (excludeDirs.some(exclude => currentPath.includes(exclude))) {
      return;
    }
    
    try {
      const items = fs.readdirSync(currentPath);
      
      items.forEach(item => {
        const itemPath = path.join(currentPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          scanRecursive(itemPath);
        } else if (stat.isFile()) {
          const ext = path.extname(itemPath).toLowerCase();
          if (['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.txt', '.sql', '.env'].includes(ext)) {
            const result = scanFile(itemPath);
            if (result.totalIssues > 0) {
              results.push(result);
            }
          }
        }
      });
    } catch (error) {
      console.warn(`Warning: Could not scan ${currentPath}:`, error.message);
    }
  }
  
  scanRecursive(dirPath);
  return results;
}

function generateReport(results) {
  console.log('🔍 Intelligent PII Detection Report');
  console.log('====================================\n');
  
  if (results.length === 0) {
    console.log('✅ No real PII issues found!');
    return;
  }
  
  console.log(`📊 Scan Summary:`);
  console.log(`   Files with issues: ${results.length}`);
  console.log(`   Total real PII items: ${results.reduce((sum, r) => sum + r.totalIssues, 0)}`);
  
  // Group by PII type
  const piiByType = {};
  results.forEach(result => {
    Object.entries(result.realPII).forEach(([type, data]) => {
      if (!piiByType[type]) {
        piiByType[type] = { count: 0, files: [] };
      }
      piiByType[type].count += data.count;
      piiByType[type].files.push({
        file: result.file,
        count: data.count,
        examples: data.examples
      });
    });
  });
  
  console.log(`\n📁 PII Issues by Type:`);
  Object.entries(piiByType).forEach(([type, data]) => {
    console.log(`   ${type}: ${data.count} items in ${data.files.length} files`);
  });
  
  console.log(`\n📄 Detailed Results:`);
  results.forEach(result => {
    if (result.totalIssues > 0) {
      console.log(`\n   ${result.file}:`);
      Object.entries(result.realPII).forEach(([type, data]) => {
        console.log(`     ${type}: ${data.count} items`);
        if (data.examples.length > 0) {
          console.log(`       Examples: ${data.examples.join(', ')}`);
        }
      });
    }
  });
  
  console.log(`\n🚨 Action Required:`);
  console.log(`   Files with real PII need immediate attention`);
  console.log(`   Safe demo data has been automatically filtered out`);
}

function main() {
  const args = process.argv.slice(2);
  const targetPath = args[0] || '.';
  
  console.log('🧠 Starting Intelligent PII Scan...\n');
  
  const startTime = Date.now();
  const results = scanDirectory(targetPath);
  const duration = (Date.now() - startTime) / 1000;
  
  generateReport(results);
  
  console.log(`\n⏱️  Scan completed in ${duration.toFixed(2)}s`);
  
  if (results.length > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { scanFile, scanDirectory, isSafeDemoData };
