#!/usr/bin/env node

/**
 * Final comprehensive linting fix - targeted approach for remaining issues
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

console.log('🔧 Final comprehensive linting fix\n');

// Files to process - focus on API routes first
const patterns = [
  'app/api/**/*.ts',
  'app/api/**/*.tsx'
];

let totalFiles = 0;
let totalFixes = 0;

// Final fix function - very targeted
function finalLintFix(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let fixes = 0;

  console.log(`📝 Processing: ${filePath}`);

  // Fix 1: Remove unnecessary eslint-disable comments from catch blocks
  content = content.replace(
    /}\s*catch\s*\(\s*_error\s*\)\s*\{[\s\S]*?\}\s*\/\/\s*eslint-disable-line\s+no-unused-vars/g,
    (match) => {
      fixes++;
      return match.replace(/\s*\/\/\s*eslint-disable-line\s+no-unused-vars/g, '');
    }
  );

  // Fix 2: Remove unnecessary eslint-disable comments from function signatures
  content = content.replace(
    /\}\s*\/\/\s*eslint-disable-line\s+no-unused-vars\s*\n/g,
    '}\n'
  );

  // Fix 3: Remove duplicate eslint-disable comments
  content = content.replace(
    /\/\/\s*eslint-disable-line\s+no-unused-vars\s*\n\s*\/\/\s*eslint-disable-line\s+no-unused-vars/g,
    '// eslint-disable-line no-unused-vars'
  );

  // Fix 4: Clean up any trailing eslint-disable comments
  content = content.replace(
    /\/\* eslint-disable no-unused-vars \*\/\s*$/gm,
    ''
  );

  // Fix 5: Remove eslint-disable comments from type annotations
  content = content.replace(
    /as\s*\{\s*\n\s*from:\s*\([^)]+\)\s*=>\s*\{[\s\S]*?\}\s*\n\s*\}\s*\/\/\s*eslint-disable-line\s+no-unused-vars/g,
    (match) => {
      fixes++;
      return match.replace(/\s*\/\/\s*eslint-disable-line\s+no-unused-vars/g, '');
    }
  );

  // Fix 6: Remove unnecessary eslint-disable comments from unused imports
  content = content.replace(
    /import\s*\{\s*([^}]*)\s*\}\s*from\s*['"]([^'"]+)['"]\s*;?\s*\/\/\s*Removed unused imports/g,
    'import { $1 } from "$2";'
  );

  // Fix 7: Clean up multiple eslint-disable comments
  content = content.replace(
    /\/\* eslint-disable no-unused-vars \*\/\s*\/\*\s*eslint-disable\s+no-unused-vars\s*\*\//g,
    '/* eslint-disable no-unused-vars */'
  );

  // Fix 8: Remove trailing whitespace after removing comments
  content = content.replace(/^\s*\/\* eslint-disable no-unused-vars \*\/\s*$/gm, '');

  // Save file if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${fixes} issues in ${filePath}`);
    totalFixes += fixes;
  } else {
    console.log(`ℹ️  No changes needed in ${filePath}`);
  }

  totalFiles++;
}

// Process all files
async function processAllFiles() {
  for (const pattern of patterns) {
    const files = await glob(pattern, { cwd: process.cwd() });
    for (const file of files) {
      const fullPath = path.resolve(file);
      if (fs.existsSync(fullPath)) {
        finalLintFix(fullPath);
      }
    }
  }

  console.log(`\n🎯 Summary:`);
  console.log(`📁 Files processed: ${totalFiles}`);
  console.log(`🔧 Issues fixed: ${totalFixes}`);
  console.log(`✅ Final linting fix complete!`);
}

// Run the script
processAllFiles().catch(console.error);
