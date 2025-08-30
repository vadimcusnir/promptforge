#!/usr/bin/env node

/**
 * Comprehensive Gate Testing Script
 * Runs all CI/CD gates with proper thresholds and reporting
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n🔍 ${description}...`, 'cyan');
  
  try {
    const output = execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      timeout: 300000 // 5 minutes timeout
    });
    
    log(`✅ ${description} passed`, 'green');
    return { success: true, output };
  } catch (error) {
    log(`❌ ${description} failed`, 'red');
    log(`Error: ${error.message}`, 'red');
    if (error.stdout) {
      log(`Output: ${error.stdout}`, 'yellow');
    }
    if (error.stderr) {
      log(`Error output: ${error.stderr}`, 'red');
    }
    return { success: false, error: error.message, output: error.stdout };
  }
}

function testUnitTests() {
  return runCommand('pnpm test:unit --coverage --watchAll=false', 'Unit Tests');
}

function testContractSchemas() {
  return runCommand('pnpm test:contracts', 'Contract Schema Tests');
}

function testE2E() {
  return runCommand('pnpm test:e2e', 'E2E Tests');
}

function testRedirects() {
  return runCommand('pnpm test:redirects', 'Redirect Tests');
}

function testLighthouse() {
  return runCommand('pnpm test:lighthouse:local', 'Lighthouse Performance/Accessibility/SEO Tests');
}

function testSecurity() {
  return runCommand('pnpm security:scan-ci', 'Security Scan');
}

function testTypeCheck() {
  return runCommand('pnpm type-check', 'TypeScript Type Check');
}

function testLint() {
  return runCommand('pnpm lint', 'ESLint');
}

function generateReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: results.length,
      passed: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    },
    gates: results,
    recommendations: []
  };
  
  // Calculate success rate
  report.summary.successRate = (report.summary.passed / report.summary.total * 100).toFixed(1);
  
  // Generate recommendations based on failures
  const failedGates = results.filter(r => !r.success);
  
  if (failedGates.length > 0) {
    failedGates.forEach(gate => {
      switch (gate.name) {
        case 'Unit Tests':
          report.recommendations.push({
            type: 'unit_tests',
            message: 'Unit tests are failing',
            action: 'Fix failing unit tests and ensure coverage thresholds are met'
          });
          break;
        case 'Contract Schema Tests':
          report.recommendations.push({
            type: 'contract_tests',
            message: 'API contract schema validation failed',
            action: 'Update API schemas in schemas/api-contracts.json to match implementation'
          });
          break;
        case 'E2E Tests':
          report.recommendations.push({
            type: 'e2e_tests',
            message: 'End-to-end tests are failing',
            action: 'Fix failing E2E tests and ensure critical user flows work'
          });
          break;
        case 'Redirect Tests':
          report.recommendations.push({
            type: 'redirect_tests',
            message: 'Redirect tests are failing',
            action: 'Fix redirect issues and ensure 308 status codes are used'
          });
          break;
        case 'Lighthouse Performance/Accessibility/SEO Tests':
          report.recommendations.push({
            type: 'lighthouse_tests',
            message: 'Lighthouse tests failed (Performance ≥85, Accessibility ≥95, SEO ≥90)',
            action: 'Optimize performance, fix accessibility issues, and improve SEO'
          });
          break;
        case 'Security Scan':
          report.recommendations.push({
            type: 'security_tests',
            message: 'Security scan found issues',
            action: 'Address security vulnerabilities and ensure proper security headers'
          });
          break;
        case 'TypeScript Type Check':
          report.recommendations.push({
            type: 'type_check',
            message: 'TypeScript compilation failed',
            action: 'Fix TypeScript errors and ensure type safety'
          });
          break;
        case 'ESLint':
          report.recommendations.push({
            type: 'linting',
            message: 'ESLint found code quality issues',
            action: 'Fix linting errors and maintain code quality standards'
          });
          break;
      }
    });
  }
  
  return report;
}

function saveReport(report) {
  const reportPath = path.join(__dirname, '..', 'test-results', 'all-gates-report.json');
  
  try {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log(`💾 Gate test report saved to ${reportPath}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Error saving report: ${error.message}`, 'red');
    return false;
  }
}

function printSummary(report) {
  log('\n' + '=' .repeat(70), 'cyan');
  log('📊 CI/CD Gates Testing Summary', 'cyan');
  log('=' .repeat(70), 'cyan');
  
  log(`Total gates tested: ${report.summary.total}`, 'blue');
  log(`Passed: ${report.summary.passed}`, 'green');
  log(`Failed: ${report.summary.failed}`, 'red');
  log(`Success rate: ${report.summary.successRate}%`, 'blue');
  
  log('\n📋 Gate Results:', 'cyan');
  report.gates.forEach(gate => {
    const status = gate.success ? '✅' : '❌';
    const color = gate.success ? 'green' : 'red';
    log(`  ${status} ${gate.name}`, color);
  });
  
  if (report.summary.failed > 0) {
    log('\n❌ Failed Gates:', 'red');
    report.gates
      .filter(gate => !gate.success)
      .forEach(gate => {
        log(`  • ${gate.name}`, 'red');
        if (gate.error) {
          log(`    Error: ${gate.error}`, 'red');
        }
      });
  }
  
  if (report.recommendations.length > 0) {
    log('\n💡 Recommendations:', 'yellow');
    report.recommendations.forEach(rec => {
      log(`  • ${rec.message}`, 'yellow');
      log(`    Action: ${rec.action}`, 'yellow');
    });
  }
  
  log('\n' + '=' .repeat(70), 'cyan');
}

async function main() {
  log('🚀 Starting Comprehensive CI/CD Gates Testing', 'cyan');
  log('=' .repeat(50), 'cyan');
  
  const results = [];
  
  // Gate 1: Linting and Type Checking
  log('\n🔧 Gate 1: Code Quality', 'magenta');
  results.push({ ...testLint(), name: 'ESLint' });
  results.push({ ...testTypeCheck(), name: 'TypeScript Type Check' });
  
  // Gate 2: Unit Tests
  log('\n🧪 Gate 2: Unit Tests', 'magenta');
  results.push({ ...testUnitTests(), name: 'Unit Tests' });
  
  // Gate 3: Contract Tests
  log('\n📋 Gate 3: Contract Tests', 'magenta');
  results.push({ ...testContractSchemas(), name: 'Contract Schema Tests' });
  
  // Gate 4: E2E Tests
  log('\n🎭 Gate 4: E2E Tests', 'magenta');
  results.push({ ...testE2E(), name: 'E2E Tests' });
  
  // Gate 5: Redirect Tests
  log('\n🔄 Gate 5: Redirect Tests', 'magenta');
  results.push({ ...testRedirects(), name: 'Redirect Tests' });
  
  // Gate 6: Lighthouse Tests
  log('\n📊 Gate 6: Lighthouse Tests', 'magenta');
  results.push({ ...testLighthouse(), name: 'Lighthouse Performance/Accessibility/SEO Tests' });
  
  // Gate 7: Security Tests
  log('\n🔒 Gate 7: Security Tests', 'magenta');
  results.push({ ...testSecurity(), name: 'Security Scan' });
  
  // Generate report
  const report = generateReport(results);
  
  // Save report
  const reportSaved = saveReport(report);
  
  // Print summary
  printSummary(report);
  
  // Exit with appropriate code
  if (report.summary.failed > 0) {
    log('💥 CI/CD Gates testing failed!', 'red');
    log('Some gates did not meet the required thresholds:', 'red');
    log('• Performance: ≥85', 'red');
    log('• Accessibility: ≥95', 'red');
    log('• SEO: ≥90', 'red');
    log('• All unit tests must pass', 'red');
    log('• All E2E tests must pass', 'red');
    log('• All redirects must use 308 status codes', 'red');
    process.exit(1);
  } else {
    log('🎉 All CI/CD Gates passed successfully!', 'green');
    log('✅ Ready for deployment!', 'green');
    process.exit(0);
  }
}

// Run the tests
if (require.main === module) {
  main();
}

module.exports = {
  testUnitTests,
  testContractSchemas,
  testE2E,
  testRedirects,
  testLighthouse,
  testSecurity,
  generateReport
};
