#!/usr/bin/env node

/**
 * Clean up unnecessary eslint-disable directives
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

console.log('🧹 Cleaning up unnecessary eslint-disable directives\n');

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

// Clean up unnecessary eslint-disable directives
function cleanupEslintDisable(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let fixes = 0;

  console.log(`📝 Processing: ${filePath}`);

  // Remove unnecessary eslint-disable comments for unused variables
  content = content.replace(/\/\* eslint-disable no-unused-vars \*\/\s*(\w+)/g, '$1');

  // Remove unnecessary eslint-disable comments for TypeScript any
  content = content.replace(/\/\* eslint-disable @typescript-eslint\/no-explicit-any \*\/\s*any/g, 'any');

  // Remove unnecessary eslint-disable comments for unused vars in function params
  content = content.replace(/\/\* eslint-disable no-unused-vars \*\/\s*(_\w+)/g, '$1');

  // Remove unnecessary eslint-disable comments for catch blocks
  content = content.replace(/catch\s*\(\s*\/\* eslint-disable no-unused-vars \*\/\s*(\w+)\s*\)/g, 'catch ($1)');

  // Remove empty eslint-disable comments
  content = content.replace(/\/\* eslint-disable no-unused-vars \*\/\s*/g, '');

  // Remove duplicate eslint-disable comments
  content = content.replace(/(\/\* eslint-disable no-unused-vars \*\/\s*)+/g, '/* eslint-disable no-unused-vars */ ');

  // Clean up trailing whitespace after removing comments
  content = content.replace(/\/\* eslint-disable no-unused-vars \*\/\s*$/gm, '');
  content = content.replace(/^\s*\/\* eslint-disable no-unused-vars \*\/\s*$/gm, '');

  // Save file if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Cleaned up ${fixes} eslint-disable directives in ${filePath}`);
    totalFixes += fixes;
  } else {
    console.log(`ℹ️  No cleanup needed in ${filePath}`);
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
        cleanupEslintDisable(fullPath);
      }
    }
  }

  console.log(`\n🎯 Summary:`);
  console.log(`📁 Files processed: ${totalFiles}`);
  console.log(`🧹 ESLint disable directives cleaned up: ${totalFixes}`);
  console.log(`✅ Cleanup complete!`);
}

// Run the script
processAllFiles().catch(console.error);
