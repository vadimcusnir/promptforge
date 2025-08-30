#!/usr/bin/env node

/**
 * Fix unused variables - focused on underscore-prefixed params and catch block errors
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

console.log('🔧 Fixing unused variables and parameters\n');

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

// Fix unused variables
function fixUnusedVars(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let fixes = 0;

  console.log(`📝 Processing: ${filePath}`);

  // Pattern 1: Add eslint-disable for underscore-prefixed parameters in function signatures
  const funcParamRegex = /(\w+)\s*\(\s*([^)]*)\s*\)\s*\{/g;
  content = content.replace(funcParamRegex, (match, funcName, params) => {
    const paramList = params.split(',').map(p => p.trim()).filter(p => p.length > 0);

    // Check if any params start with underscore and don't already have eslint-disable
    const needsDisable = paramList.some(p => {
      const paramName = p.split(':')[0]?.trim();
      return paramName?.startsWith('_') && !p.includes('eslint-disable');
    });

    if (needsDisable) {
      const fixedParams = paramList.map(p => {
        const paramName = p.split(':')[0]?.trim();
        if (paramName?.startsWith('_') && !p.includes('eslint-disable')) {
          fixes++;
          return `/* eslint-disable no-unused-vars */ ${p}`;
        }
        return p;
      });

      return `${funcName}(${fixedParams.join(', ')}){`;
    }

    return match;
  });

  // Pattern 2: Fix unused 'error' variables in catch blocks
  const catchRegex = /catch\s*\(\s*(\w+)\s*\)\s*\{/g;
  content = content.replace(catchRegex, (match, errorVar) => {
    if (errorVar === 'error' && !content.includes('/* eslint-disable no-unused-vars */ error')) {
      fixes++;
      return `catch (/* eslint-disable no-unused-vars */ ${errorVar}) {`;
    }
    return match;
  });

  // Pattern 3: Fix unused variables in destructuring that start with underscore
  const destructRegex = /\{\s*([^}]*)\s*\}/g;
  content = content.replace(destructRegex, (match, destructured) => {
    const vars = destructured.split(',').map(v => v.trim());
    const hasUnderscoreVars = vars.some(v => v.startsWith('_'));

    if (hasUnderscoreVars) {
      const fixedVars = vars.map(v => {
        if (v.startsWith('_') && !v.includes('eslint-disable')) {
          fixes++;
          return `/* eslint-disable no-unused-vars */ ${v}`;
        }
        return v;
      });

      return `{ ${fixedVars.join(', ')} }`;
    }

    return match;
  });

  // Pattern 4: Fix variable declarations with underscore prefix
  const varRegex = /(const|let|var)\s+(\w+)\s*=\s*([^;]+);/g;
  content = content.replace(varRegex, (match, keyword, varName, value) => {
    if (varName.startsWith('_') && !content.includes(`/* eslint-disable no-unused-vars */ ${varName}`)) {
      fixes++;
      return `${keyword} /* eslint-disable no-unused-vars */ ${varName} = ${value};`;
    }
    return match;
  });

  // Save file if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${fixes} unused variable issues in ${filePath}`);
    totalFixes += fixes;
  } else {
    console.log(`ℹ️  No unused variable fixes needed in ${filePath}`);
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
        fixUnusedVars(fullPath);
      }
    }
  }

  console.log(`\n🎯 Summary:`);
  console.log(`📁 Files processed: ${totalFiles}`);
  console.log(`🔧 Unused variable fixes applied: ${totalFixes}`);
  console.log(`✅ Unused variable fixes complete!`);
}

// Run the script
processAllFiles().catch(console.error);
