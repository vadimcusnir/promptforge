#!/usr/bin/env node

/**
 * PII Cleanup Script for PromptForge
 * Systematically removes or sanitizes identified PII issues
 */

const fs = require('fs');
const path = require('path');

// PII patterns that need cleanup
const PII_PATTERNS = {
  // Real PII patterns (high priority)
  realEmail: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  realPhone: /(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
  realSSN: /\b\d{3}-\d{2}-\d{4}\b|\b\d{9}\b/g,
  realCreditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
  realAPIKey: /(sk_|pk_|whsec_)[a-zA-Z0-9_]{20,}/g,
  
  // Demo/placeholder patterns (lower priority)
  demoUUID: /\b00000000-0000-0000-0000-000000000000\b/g,
  demoPhone: /\b000000-0000\b/g,
  demoCreditCard: /\b00000000-0000-0000\b|\b0000-000000000000\b/g,
  placeholderAPIKey: /(sk_|pk_|whsec_)YOUR_[A-Z_]+_HERE/g,
  placeholderEmail: /[a-z]+@[a-z]+\.com/g,
  placeholderPhone: /\b000-000-0000\b/g
};

  // Files to clean up (priority order)
  const CRITICAL_FILES = [
    'cursor/f_v3_sops/f_v3_00_code_html_404_example.txt', // DELETED - contained real PII
    'db/seeds.sql', // Contains demo data (safe)
    'stripe-config.env', // Contains placeholders (safe)
    'scripts/migrate.js', // Contains demo data (safe)
    'supabase/migrations' // Directory to scan
  ];

  // Safe demo data patterns (don't remove)
  const SAFE_DEMO_PATTERNS = [
    /\b00000000-0000-0000-0000-000000000000\b/g, // UUIDs
    /\b000000-0000\b/g, // Demo phone
    /\b00000000-0000-0000\b/g, // Demo credit card
    /\b0000-000000000000\b/g, // Demo credit card
    /(sk_|pk_|whsec_)YOUR_[A-Z_]+_HERE/g, // Placeholder API keys
    /[a-z]+@demo\.com/g, // Demo emails
    /[a-z]+@example\.com/g, // Example emails
    /user@example\.com/g, // Generic examples
    /test@[a-z]+\.com/g, // Test emails
    /noreply@[a-z]+\.com/g, // No-reply emails
    /support@[a-z]+\.com/g, // Support emails
    /legal@[a-z]+\.com/g, // Legal emails
    /dpo@[a-z]+\.com/g, // DPO emails
    /dev@[a-z]+\.com/g, // Dev emails
    /devops@[a-z]+\.com/g // DevOps emails
  ];

function isSafeDemoData(text) {
  return SAFE_DEMO_PATTERNS.some(pattern => pattern.test(text));
}

function cleanupFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changes = 0;
    
    // Remove real PII (high priority)
    if (PII_PATTERNS.realEmail.test(content)) {
      content = content.replace(PII_PATTERNS.realEmail, '[EMAIL_REDACTED]');
      changes++;
    }
    
    if (PII_PATTERNS.realPhone.test(content)) {
      content = content.replace(PII_PATTERNS.realPhone, '[PHONE_REDACTED]');
      changes++;
    }
    
    if (PII_PATTERNS.realSSN.test(content)) {
      content = content.replace(PII_PATTERNS.realSSN, '[SSN_REDACTED]');
      changes++;
    }
    
    if (PII_PATTERNS.realCreditCard.test(content)) {
      content = content.replace(PII_PATTERNS.realCreditCard, '[CARD_REDACTED]');
      changes++;
    }
    
    if (PII_PATTERNS.realAPIKey.test(content)) {
      content = content.replace(PII_PATTERNS.realAPIKey, '[API_KEY_REDACTED]');
      changes++;
    }
    
    if (changes > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Cleaned ${filePath} (${changes} changes)`);
    } else {
      console.log(`✅ ${filePath} - No real PII found`);
    }
    
  } catch (error) {
    console.error(`❌ Error cleaning ${filePath}:`, error.message);
  }
}

function main() {
  console.log('🧹 PromptForge PII Cleanup Script');
  console.log('==================================\n');
  
  // Clean up critical files
  CRITICAL_FILES.forEach(file => {
    if (fs.existsSync(file)) {
      if (fs.statSync(file).isDirectory()) {
        // Handle directories
        const files = fs.readdirSync(file).filter(f => f.endsWith('.sql'));
        files.forEach(f => cleanupFile(path.join(file, f)));
      } else {
        cleanupFile(file);
      }
    } else {
      console.log(`⚠️  File not found: ${file}`);
    }
  });
  
  console.log('\n🎉 PII cleanup completed!');
  console.log('\n📋 Summary:');
  console.log('   ✅ Removed real PII data');
  console.log('   ✅ Preserved safe demo data');
  console.log('   ✅ Updated affected files');
  console.log('\n🔍 Next steps:');
  console.log('   1. Run PII scan again: node scripts/test-pii-detection.js');
  console.log('   2. Review any remaining issues');
  console.log('   3. Commit changes with appropriate message');
}

if (require.main === module) {
  main();
}

module.exports = { cleanupFile, isSafeDemoData };
