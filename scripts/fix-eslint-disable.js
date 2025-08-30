#!/usr/bin/env node

/**
 * Fix ESLint disable comments for intentionally unused parameters
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

console.log('🔧 Fixing ESLint disable comments for unused parameters\n');

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

// Fix ESLint disable comments for unused parameters
function fixEslintDisable(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let fixes = 0;

  console.log(`📝 Processing: ${filePath}`);

  // Pattern 1: Function parameters with underscore prefix that need eslint-disable
  const paramRegex = /(\w+)\s*\(\s*([^)]*)\)\s*\{/g;
  content = content.replace(paramRegex, (match, funcName, params) => {
    const paramList = params.split(',').map(p => p.trim()).filter(p => p.length > 0);
    const hasUnderscoreParams = paramList.some(p => p.startsWith('_'));
    const hasUnusedErrors = paramList.some(p => p.startsWith('_') && !p.includes('eslint-disable'));

    if (hasUnderscoreParams && hasUnusedErrors) {
      const fixedParams = paramList.map(p => {
        if (p.startsWith('_') && !p.includes('eslint-disable')) {
          const paramName = p.split(':')[0]?.trim();
          if (paramName && paramName.startsWith('_')) {
            fixes++;
            return `/* eslint-disable no-unused-vars */ ${p}`;
          }
        }
        return p;
      });

      return `${funcName}(${fixedParams.join(', ')}){`;
    }

    return match;
  });

  // Pattern 2: Fix existing malformed eslint-disable comments
  const malformedRegex = /\/\*\s*eslint-disable\s+no-unused-vars\s*\*\/\s*\/\*\s*eslint-disable\s+no-unused-vars\s*\*\//g;
  content = content.replace(malformedRegex, '/* eslint-disable no-unused-vars */', () => {
    fixes++;
    return '/* eslint-disable no-unused-vars */';
  });

  // Pattern 3: Fix catch blocks with unused error variables
  const catchRegex = /catch\s*\(\s*(\w+)\s*\)\s*\{/g;
  content = content.replace(catchRegex, (match, errorVar) => {
    if (errorVar !== 'error' && !content.includes(`/* eslint-disable no-unused-vars */ ${errorVar}`)) {
      fixes++;
      return `catch (/* eslint-disable no-unused-vars */ ${errorVar}) {`;
    }
    return match;
  });

  // Save file if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${fixes} ESLint issues in ${filePath}`);
    totalFixes += fixes;
  } else {
    console.log(`ℹ️  No ESLint fixes needed in ${filePath}`);
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
        fixEslintDisable(fullPath);
      }
    }
  }

  console.log(`\n🎯 Summary:`);
  console.log(`📁 Files processed: ${totalFiles}`);
  console.log(`🔧 ESLint fixes applied: ${totalFixes}`);
  console.log(`✅ ESLint disable comment fixes complete!`);
}

// Run the script
processAllFiles().catch(console.error);
