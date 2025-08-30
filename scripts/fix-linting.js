#!/usr/bin/env node

/**
 * Automated Linting Fix Script for PromptForge v3
 * Fixes common ESLint violations automatically
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

console.log('🔧 PromptForge v3 - Automated Linting Fix Script\n');

// Files to process
const patterns = [
  'app/**/*.tsx',
  'app/**/*.ts',
  'components/**/*.tsx',
  'components/**/*.ts',
  'lib/**/*.ts',
  'hooks/**/*.ts'
];

let totalFiles = 0;
let totalFixes = 0;

// Fix common issues
function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let fixes = 0;

  console.log(`📝 Processing: ${filePath}`);

  // 1. Fix unused imports with underscore prefix
  const unusedImportRegex = /import\s+{\s*([^}]+)\s*}\s+from\s+['"]([^'"]+)['"]/g;
  content = content.replace(unusedImportRegex, (match, imports, from) => {
    const importList = imports.split(',').map(imp => imp.trim());
    const filteredImports = importList.filter(imp => {
      // Keep imports that don't start with underscore (they're used)
      return !imp.startsWith('_');
    });

    if (filteredImports.length === 0) {
      fixes++;
      return `// Removed unused imports from ${from}`;
    }

    return `import { ${filteredImports.join(', ')} } from '${from}'`;
  });

  // 2. Fix console statements - only remove in production files
  if (!filePath.includes('test') && !filePath.includes('spec')) {
    const consoleRegex = /console\.(log|warn|error|info|debug)\([^)]*\);?/g;
    content = content.replace(consoleRegex, (match) => {
      fixes++;
      return `// ${match} // Removed for production`;
    });
  }

  // 3. Fix empty object patterns
  const emptyObjectRegex = /{\s*}/g;
  content = content.replace(emptyObjectRegex, (match) => {
    if (match.trim() === '{}') {
      fixes++;
      return '{ /* empty */ }';
    }
    return match;
  });

  // 4. Fix prefer-const issues
  const letRegex = /\blet\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*([^;]+);/g;
  content = content.replace(letRegex, (match, varName, value) => {
    // Simple heuristic: if value doesn't contain assignment operators, suggest const
    if (!value.includes('=') && !value.includes('++') && !value.includes('--')) {
      fixes++;
      return `const ${varName} = ${value};`;
    }
    return match;
  });

  // 5. Remove unused variables with underscore prefix from function parameters
  const funcParamRegex = /function\s+\w+\s*\(([^)]*)\)/g;
  content = content.replace(funcParamRegex, (match, params) => {
    const paramList = params.split(',').map(p => p.trim());
    const filteredParams = paramList.filter(p => {
      const paramName = p.split(':')[0]?.trim();
      return !paramName?.startsWith('_') || paramName === '_';
    });

    if (filteredParams.length !== paramList.length) {
      fixes++;
    }

    return `function ${match.split('(')[0]}(${filteredParams.join(', ')})`;
  });

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
        fixFile(fullPath);
      }
    }
  }

  console.log(`\n🎯 Summary:`);
  console.log(`📁 Files processed: ${totalFiles}`);
  console.log(`🔧 Issues fixed: ${totalFixes}`);
  console.log(`✅ Automated fixes complete!`);
}

// Run the script
processAllFiles().catch(console.error);
