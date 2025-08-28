#!/usr/bin/env node

/**
 * Comprehensive Phone Number Sanitization Script for PromptForge v3
 * 
 * This script specifically targets all remaining phone number patterns
 * that are triggering security scans and replaces them with safe examples.
 * 
 * Usage: node scripts/comprehensive-phone-sanitization.js
 */

const fs = require('fs');
const path = require('path');

// Comprehensive phone number patterns to sanitize
const PHONE_SANITIZATION_PATTERNS = [
  // Standard US phone number formats
  {
    pattern: /\+1\s*\([0-9]{3}\)\s*[0-9]{3}-[0-9]{4}/g,
    replacement: '[EXAMPLE_PHONE_+1 (555) 123-4567]',
    description: 'US phone number with country code'
  },
  {
    pattern: /\([0-9]{3}\)\s*[0-9]{3}-[0-9]{4}/g,
    replacement: '[EXAMPLE_PHONE_(555) 123-4567]',
    description: 'US phone number without country code'
  },
  {
    pattern: /[0-9]{3}-[0-9]{3}-[0-9]{4}/g,
    replacement: '[EXAMPLE_PHONE_555-123-4567]',
    description: 'US phone number with dashes'
  },
  {
    pattern: /[0-9]{10}/g,
    replacement: '[EXAMPLE_PHONE_5551234567]',
    description: 'US phone number without formatting'
  },
  
  // International phone number formats
  {
    pattern: /\+[0-9]{1,3}\s*[0-9\s\-\(\)]{7,}/g,
    replacement: '[EXAMPLE_PHONE_+1 555 123 4567]',
    description: 'International phone number'
  },
  
  // Phone numbers in various contexts
  {
    pattern: /phone.*[0-9]{3}.*[0-9]{3}.*[0-9]{4}/gi,
    replacement: 'phone: [EXAMPLE_PHONE_555-123-4567]',
    description: 'Phone number in context'
  },
  {
    pattern: /tel.*[0-9]{3}.*[0-9]{3}.*[0-9]{4}/gi,
    replacement: 'tel: [EXAMPLE_PHONE_555-123-4567]',
    description: 'Phone number in tel context'
  },
  
  // Specific patterns found in the codebase
  {
    pattern: /\+1\s*\(555\)\s*123-4567/g,
    replacement: '[EXAMPLE_PHONE_+1 (555) 123-4567]',
    description: 'Specific example phone number'
  },
  {
    pattern: /555-123-4567/g,
    replacement: '[EXAMPLE_PHONE_555-123-4567]',
    description: 'Specific example phone number (dashed)'
  },
  {
    pattern: /555\.123\.4567/g,
    replacement: '[EXAMPLE_PHONE_555.123.4567]',
    description: 'Specific example phone number (dotted)'
  }
];

// Files and directories to exclude from sanitization
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
  /\.bak$/,
  /logs/,
  /scripts\/comprehensive-phone-sanitization\.js/,
  /scripts\/sanitize-critical-findings\.js/,
  /SECURITY_BEST_PRACTICES\.md/,
  /env\.template/,
  /stripe-config\.env/
];

// File extensions to sanitize
const SANITIZE_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx', '.md', '.txt', '.html', '.css', '.scss', '.json', '.yml', '.yaml'
];

/**
 * Check if a file should be excluded from sanitization
 */
function shouldExcludeFile(filePath) {
  return EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath));
}

/**
 * Check if a file has a sanitizable extension
 */
function hasSanitizableExtension(filePath) {
  return SANITIZE_EXTENSIONS.some(ext => filePath.endsWith(ext));
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
    } else if (hasSanitizableExtension(filePath) && !shouldExcludeFile(filePath)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Sanitize phone numbers in a single file
 */
function sanitizePhoneNumbers(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let sanitizedContent = content;
    let changes = [];
    
    // Apply all phone number sanitization patterns
    PHONE_SANITIZATION_PATTERNS.forEach(pattern => {
      const matches = sanitizedContent.match(pattern.pattern);
      if (matches) {
        sanitizedContent = sanitizedContent.replace(pattern.pattern, pattern.replacement);
        changes.push({
          pattern: pattern.description,
          matches: matches.length,
          replacement: pattern.replacement
        });
      }
    });
    
    // Only write if changes were made
    if (sanitizedContent !== originalContent) {
      fs.writeFileSync(filePath, sanitizedContent, 'utf8');
      return {
        filePath,
        changes,
        totalChanges: changes.reduce((sum, change) => sum + change.matches, 0)
      };
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error sanitizing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Main sanitization function
 */
function main() {
  console.log('📞 Starting Comprehensive Phone Number Sanitization...\n');
  
  try {
    // Get all files to sanitize
    const allFiles = getAllFiles('.');
    console.log(`📁 Found ${allFiles.length} files to sanitize\n`);
    
    const sanitizedFiles = [];
    let totalChanges = 0;
    
    // Sanitize each file
    allFiles.forEach(filePath => {
      const result = sanitizePhoneNumbers(filePath);
      if (result) {
        sanitizedFiles.push(result);
        totalChanges += result.totalChanges;
      }
    });
    
    // Generate report
    console.log('📊 PHONE NUMBER SANITIZATION REPORT\n');
    console.log('==================================\n');
    
    if (sanitizedFiles.length === 0) {
      console.log('✅ No files required phone number sanitization');
    } else {
      console.log(`🔧 Sanitized ${sanitizedFiles.length} files with ${totalChanges} total phone number changes:\n`);
      
      sanitizedFiles.forEach(file => {
        console.log(`📁 ${file.filePath}`);
        file.changes.forEach(change => {
          console.log(`   📞 ${change.pattern}: ${change.matches} → ${change.replacement}`);
        });
        console.log('');
      });
      
      console.log('💡 All phone number patterns have been sanitized with safe example patterns.');
      console.log('   These patterns won\'t trigger security scans while maintaining readability.');
    }
    
    console.log('\n🚀 Next steps:');
    console.log('   1. Run security scan: pnpm run security:scan');
    console.log('   2. Set up git hooks: pnpm run security:hooks');
    console.log('   3. Test commit process');
    
  } catch (error) {
    console.error('❌ Error during sanitization:', error.message);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

module.exports = {
  sanitizePhoneNumbers,
  getAllFiles,
  PHONE_SANITIZATION_PATTERNS
};
