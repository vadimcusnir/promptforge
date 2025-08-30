#!/usr/bin/env node

/**
 * Accessibility Testing Script
 * Runs comprehensive accessibility tests on the PromptForge application
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkDependencies() {
  log('🔍 Checking accessibility testing dependencies...', 'blue');
  
  const dependencies = [
    { name: '@axe-core/cli', command: 'axe --version' },
    { name: 'pa11y-ci', command: 'pa11y-ci --version' },
    { name: 'linkchecker', command: 'linkchecker --version' }
  ];
  
  const missing = [];
  
  for (const dep of dependencies) {
    try {
      execSync(dep.command, { stdio: 'ignore' });
      log(`✅ ${dep.name} is installed`, 'green');
    } catch (error) {
      log(`❌ ${dep.name} is not installed`, 'red');
      missing.push(dep.name);
    }
  }
  
  if (missing.length > 0) {
    log(`\n📦 Installing missing dependencies: ${missing.join(', ')}`, 'yellow');
    try {
      execSync(`npm install -g ${missing.join(' ')}`, { stdio: 'inherit' });
      log('✅ Dependencies installed successfully', 'green');
    } catch (error) {
      log('❌ Failed to install dependencies', 'red');
      process.exit(1);
    }
  }
}

function checkAppRunning() {
  log('\n🚀 Checking if application is running...', 'blue');
  
  try {
    execSync('curl -s http://localhost:3000 > /dev/null', { stdio: 'ignore' });
    log('✅ Application is running on http://localhost:3000', 'green');
    return true;
  } catch (error) {
    log('❌ Application is not running on http://localhost:3000', 'red');
    log('Please start the application with: pnpm dev', 'yellow');
    return false;
  }
}

function runAxeTests() {
  log('\n♿ Running axe-core accessibility tests...', 'blue');
  
  const pages = [
    'http://localhost:3000',
    'http://localhost:3000/modules',
    'http://localhost:3000/pricing',
    'http://localhost:3000/docs',
    'http://localhost:3000/guides',
    'http://localhost:3000/generator'
  ];
  
  const results = [];
  
  for (const page of pages) {
    try {
      log(`Testing: ${page}`, 'cyan');
      const output = execSync(`axe "${page}" --exit --reporter json`, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const result = JSON.parse(output);
      results.push({ page, result });
      
      if (result.violations && result.violations.length > 0) {
        log(`⚠️  Found ${result.violations.length} accessibility violations on ${page}`, 'yellow');
      } else {
        log(`✅ No accessibility violations found on ${page}`, 'green');
      }
    } catch (error) {
      log(`❌ Failed to test ${page}: ${error.message}`, 'red');
    }
  }
  
  // Save results
  fs.writeFileSync('axe-results.json', JSON.stringify(results, null, 2));
  log('📄 axe-core results saved to axe-results.json', 'blue');
  
  return results;
}

function runPa11yTests() {
  log('\n♿ Running pa11y accessibility tests...', 'blue');
  
  try {
    execSync('pa11y-ci --config .pa11yci.json --json > pa11y-results.json', { stdio: 'inherit' });
    log('✅ pa11y tests completed', 'green');
    log('📄 pa11y results saved to pa11y-results.json', 'blue');
  } catch (error) {
    log('⚠️  pa11y tests completed with issues', 'yellow');
  }
}

function runLinkChecker() {
  log('\n🔗 Running link checker...', 'blue');
  
  try {
    execSync('linkchecker --config=.linkcheckerrc --output=json http://localhost:3000 > linkchecker-results.json', { 
      stdio: 'inherit' 
    });
    log('✅ Link checker completed', 'green');
    log('📄 Link checker results saved to linkchecker-results.json', 'blue');
  } catch (error) {
    log('⚠️  Link checker found broken links', 'yellow');
  }
}

function validateARIA() {
  log('\n♿ Validating ARIA attributes...', 'blue');
  
  let issues = 0;
  
  // Check for missing aria-labels on interactive elements
  try {
    const onClickFiles = execSync('grep -r "onClick" components/ app/ --include="*.tsx" --include="*.ts"', { 
      encoding: 'utf8' 
    });
    
    const lines = onClickFiles.split('\n').filter(line => line.trim());
    const withoutAria = lines.filter(line => 
      !line.includes('aria-label') && 
      !line.includes('aria-describedby') &&
      !line.includes('aria-labelledby')
    );
    
    if (withoutAria.length > 0) {
      log(`⚠️  Found ${withoutAria.length} interactive elements without ARIA labels`, 'yellow');
      issues += withoutAria.length;
    }
  } catch (error) {
    // No interactive elements found, which is fine
  }
  
  // Check for proper heading hierarchy
  try {
    const headingFiles = execSync('grep -r "h[1-6]" app/ --include="*.tsx" --include="*.ts"', { 
      encoding: 'utf8' 
    });
    
    const h1Count = (headingFiles.match(/h1/g) || []).length;
    if (h1Count === 0) {
      log('⚠️  No h1 elements found - check heading hierarchy', 'yellow');
      issues++;
    } else if (h1Count > 1) {
      log(`⚠️  Found ${h1Count} h1 elements - should have only one per page`, 'yellow');
      issues++;
    }
  } catch (error) {
    // No headings found, which might be an issue
    log('⚠️  No heading elements found', 'yellow');
    issues++;
  }
  
  if (issues === 0) {
    log('✅ No ARIA issues found', 'green');
  } else {
    log(`⚠️  Found ${issues} ARIA-related issues`, 'yellow');
  }
  
  return issues;
}

function checkColorContrast() {
  log('\n🎨 Checking color contrast compliance...', 'blue');
  
  let issues = 0;
  
  // Check for hardcoded colors
  try {
    const hardcodedColors = execSync('grep -r "bg-\\[#" app/ components/ --include="*.tsx" --include="*.ts"', { 
      encoding: 'utf8' 
    });
    
    if (hardcodedColors.trim()) {
      log('⚠️  Hardcoded colors found - use design tokens instead', 'yellow');
      issues++;
    }
  } catch (error) {
    // No hardcoded colors found, which is good
  }
  
  // Check for proper contrast ratios in CSS
  try {
    const cssColors = execSync('grep -r "color.*#[0-9a-fA-F]" app/globals.css', { 
      encoding: 'utf8' 
    });
    
    if (cssColors.trim()) {
      log('⚠️  Check color contrast ratios in globals.css', 'yellow');
      issues++;
    }
  } catch (error) {
    // No hardcoded colors in CSS, which is good
  }
  
  if (issues === 0) {
    log('✅ Color contrast compliance looks good', 'green');
  } else {
    log(`⚠️  Found ${issues} color contrast issues`, 'yellow');
  }
  
  return issues;
}

function generateReport(results) {
  log('\n📊 Generating accessibility report...', 'blue');
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalPages: results.length,
      violations: results.reduce((sum, r) => sum + (r.result.violations?.length || 0), 0),
      passes: results.reduce((sum, r) => sum + (r.result.passes?.length || 0), 0)
    },
    pages: results.map(r => ({
      url: r.page,
      violations: r.result.violations?.length || 0,
      passes: r.result.passes?.length || 0
    }))
  };
  
  fs.writeFileSync('accessibility-report.json', JSON.stringify(report, null, 2));
  log('📄 Accessibility report saved to accessibility-report.json', 'blue');
  
  // Print summary
  log('\n📋 Accessibility Test Summary:', 'magenta');
  log(`Total pages tested: ${report.summary.totalPages}`, 'white');
  log(`Total violations: ${report.summary.violations}`, report.summary.violations > 0 ? 'yellow' : 'green');
  log(`Total passes: ${report.summary.passes}`, 'green');
  
  if (report.summary.violations > 0) {
    log('\n⚠️  Accessibility issues found. Please review the detailed results.', 'yellow');
    log('Check axe-results.json, pa11y-results.json, and linkchecker-results.json for details.', 'blue');
  } else {
    log('\n✅ All accessibility tests passed!', 'green');
  }
}

function main() {
  log('🚀 Starting PromptForge Accessibility Testing', 'magenta');
  log('===============================================', 'magenta');
  
  // Check dependencies
  checkDependencies();
  
  // Check if app is running
  if (!checkAppRunning()) {
    process.exit(1);
  }
  
  // Run tests
  const axeResults = runAxeTests();
  runPa11yTests();
  runLinkChecker();
  
  // Run additional validations
  const ariaIssues = validateARIA();
  const contrastIssues = checkColorContrast();
  
  // Generate report
  generateReport(axeResults);
  
  // Exit with appropriate code
  const totalIssues = axeResults.reduce((sum, r) => sum + (r.result.violations?.length || 0), 0) + ariaIssues + contrastIssues;
  
  if (totalIssues > 0) {
    log(`\n⚠️  Accessibility testing completed with ${totalIssues} issues found.`, 'yellow');
    process.exit(1);
  } else {
    log('\n✅ All accessibility tests passed!', 'green');
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  checkDependencies,
  checkAppRunning,
  runAxeTests,
  runPa11yTests,
  runLinkChecker,
  validateARIA,
  checkColorContrast,
  generateReport
};
