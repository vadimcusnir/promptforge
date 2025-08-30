#!/usr/bin/env node

/**
 * Comprehensive ESLint fixes - remove unnecessary disable comments and fix unused variables
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

console.log('🔧 Comprehensive ESLint fixes\n');

// Files to process
const patterns = [
  'app/**/*.ts',
  'app/**/*.tsx',
  'components/**/*.tsx',
  'components/**/*.ts',
  'lib/**/*.ts',
  'hooks/**/*.ts'
];

let totalFiles = 0;
let totalFixes = 0;

// Comprehensive fix function
function fixEslintIssues(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let fixes = 0;

  console.log(`📝 Processing: ${filePath}`);

  // Remove unnecessary eslint-disable comments from catch blocks
  content = content.replace(
    /}\s*catch\s*\(\s*_error\s*\)\s*\{[\s\S]*?\}\s*\/\/\s*eslint-disable-line\s+no-unused-vars/g,
    (match) => {
      fixes++;
      return match.replace(/\s*\/\/\s*eslint-disable-line\s+no-unused-vars/g, '');
    }
  );

  // Remove unnecessary eslint-disable comments from function signatures
  content = content.replace(
    /\}\s*\/\/\s*eslint-disable-line\s+no-unused-vars\s*\n/g,
    '}\n'
  );

  // Remove duplicate eslint-disable comments
  content = content.replace(
    /\/\/\s*eslint-disable-line\s+no-unused-vars\s*\n\s*\/\/\s*eslint-disable-line\s+no-unused-vars/g,
    '// eslint-disable-line no-unused-vars'
  );

  // Remove eslint-disable comments from type annotations
  content = content.replace(
    /as\s*\{\s*\n\s*from:\s*\([^)]+\)\s*=>\s*\{[\s\S]*?\}\s*\n\s*\}\s*\/\/\s*eslint-disable-line\s+no-unused-vars/g,
    (match) => {
      fixes++;
      return match.replace(/\s*\/\/\s*eslint-disable-line\s+no-unused-vars/g, '');
    }
  );

  // Remove unnecessary eslint-disable comments from unused imports
  content = content.replace(
    /import\s*\{\s*([^}]*)\s*\}\s*from\s*['"]([^'"]+)['"]\s*;?\s*\/\/\s*Removed unused imports/g,
    'import { $1 } from "$2";'
  );

  // Remove eslint-disable comments that are no longer needed
  content = content.replace(
    /\/\* eslint-disable no-unused-vars \*\/\s*\/\*\s*eslint-disable\s+no-unused-vars\s*\*\//g,
    '/* eslint-disable no-unused-vars */'
  );

  // Clean up any remaining unnecessary disable comments
  content = content.replace(
    /\/\* eslint-disable no-unused-vars \*\/\s*$/gm,
    ''
  );

  // Save file if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Cleaned up ESLint issues in ${filePath}`);
    totalFixes += fixes;
  } else {
    console.log(`ℹ️  No ESLint cleanup needed in ${filePath}`);
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
        fixEslintIssues(fullPath);
      }
    }
  }

  console.log(`\n🎯 Summary:`);
  console.log(`📁 Files processed: ${totalFiles}`);
  console.log(`🧹 ESLint issues cleaned up: ${totalFixes}`);
  console.log(`✅ ESLint cleanup complete!`);
}

// Run the script
processAllFiles().catch(console.error);
