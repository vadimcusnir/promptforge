#!/usr/bin/env node

/**
 * Fix only critical parsing errors - Minimal effort, maximum impact
 * Focus on function declaration syntax errors only
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

console.log('🎯 Critical Parsing Fix - Function Declaration Syntax Only\n');

// Target only the most critical parsing errors
const criticalPatterns = [
  'lib/**/*.ts',
  'components/**/*.tsx',
  'hooks/**/*.ts'
];

let fixedFiles = 0;
let totalFixes = 0;

// Fix only function declaration syntax errors
function fixCriticalParsing(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let fixes = 0;

  console.log(`🔧 Checking: ${filePath}`);

  // Fix malformed function declarations (most common parsing error)
  // Pattern: async function function name -> async function name
  content = content.replace(
    /\basync\s+function\s+function\s+(\w+)/g,
    'async function $1'
  );

  // Pattern: export async function function name -> export async function name
  content = content.replace(
    /\bexport\s+async\s+function\s+function\s+(\w+)/g,
    'export async function $1'
  );

  // Pattern: function function name -> function name
  content = content.replace(
    /\bfunction\s+function\s+(\w+)/g,
    'function $1'
  );

  // Pattern: export function function name -> export function name
  content = content.replace(
    /\bexport\s+function\s+function\s+(\w+)/g,
    'export function $1'
  );

  // Fix const function syntax errors
  content = content.replace(
    /\bconst\s+function\s+(\w+)\s*=\s*async\s*\(/g,
    'const $1 = async ('
  );

  // Save file if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed critical parsing errors in ${filePath}`);
    fixedFiles++;
    totalFixes++;
  } else {
    console.log(`ℹ️  No critical parsing errors in ${filePath}`);
  }
}

// Process critical files only
async function processCriticalFiles() {
  for (const pattern of criticalPatterns) {
    const files = await glob(pattern, { cwd: process.cwd() });
    for (const file of files) {
      const fullPath = path.resolve(file);
      if (fs.existsSync(fullPath)) {
        fixCriticalParsing(fullPath);
      }
    }
  }

  console.log(`\n🎯 Critical Parsing Fix Complete:`);
  console.log(`📁 Files with critical fixes: ${fixedFiles}`);
  console.log(`🔧 Critical issues resolved: ${totalFixes}`);
  console.log(`\n💡 Next: Run 'pnpm lint' to see remaining non-critical issues`);
}

// Run the critical fix
processCriticalFiles().catch(console.error);
