#!/usr/bin/env node

/**
 * E2E Redirect Testing Script
 * Tests all redirects to ensure they work correctly with 308 status codes
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

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

function loadRedirects() {
  const redirectsPath = path.join(__dirname, '..', 'lib', 'redirects.json');
  
  if (!fs.existsSync(redirectsPath)) {
    log('❌ Redirects file not found', 'red');
    return null;
  }
  
  try {
    const redirects = JSON.parse(fs.readFileSync(redirectsPath, 'utf8'));
    log(`📋 Loaded ${redirects.redirects.length} redirects for testing`, 'blue');
    return redirects.redirects.filter(r => r.status === 'active');
  } catch (error) {
    log(`❌ Error loading redirects: ${error.message}`, 'red');
    return null;
  }
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      method: 'GET',
      followRedirect: false, // Don't follow redirects automatically
      timeout: 10000,
      headers: {
        'User-Agent': 'PromptForge-Redirect-Test/1.0',
        ...options.headers
      }
    };
    
    const req = client.request(url, requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          url: url
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

async function testRedirect(redirect, baseUrl) {
  const sourceUrl = `${baseUrl}${redirect.source}`;
  const expectedDestination = `${baseUrl}${redirect.destination}`;
  
  try {
    log(`🔍 Testing: ${redirect.legacySlug} → ${redirect.currentSlug}`, 'magenta');
    
    const response = await makeRequest(sourceUrl);
    
    const testResult = {
      redirect,
      sourceUrl,
      expectedDestination,
      actualStatusCode: response.statusCode,
      actualLocation: response.headers.location,
      success: false,
      issues: []
    };
    
    // Check status code (should be 308 for permanent redirects)
    if (response.statusCode === 308) {
      log(`  ✅ Status code: 308 (Permanent Redirect)`, 'green');
    } else if (response.statusCode === 301 || response.statusCode === 302) {
      log(`  ⚠️  Status code: ${response.statusCode} (should be 308)`, 'yellow');
      testResult.issues.push(`Expected 308, got ${response.statusCode}`);
    } else {
      log(`  ❌ Status code: ${response.statusCode} (not a redirect)`, 'red');
      testResult.issues.push(`Expected redirect status, got ${response.statusCode}`);
    }
    
    // Check location header
    if (response.headers.location) {
      if (response.headers.location === expectedDestination) {
        log(`  ✅ Location header: ${response.headers.location}`, 'green');
      } else {
        log(`  ❌ Location header: ${response.headers.location}`, 'red');
        log(`  Expected: ${expectedDestination}`, 'red');
        testResult.issues.push(`Location mismatch: expected ${expectedDestination}, got ${response.headers.location}`);
      }
    } else {
      log(`  ❌ Missing location header`, 'red');
      testResult.issues.push('Missing location header');
    }
    
    // Check if destination is accessible
    if (response.headers.location) {
      try {
        const destResponse = await makeRequest(response.headers.location);
        if (destResponse.statusCode === 200) {
          log(`  ✅ Destination accessible: ${destResponse.statusCode}`, 'green');
        } else {
          log(`  ⚠️  Destination status: ${destResponse.statusCode}`, 'yellow');
          testResult.issues.push(`Destination returns ${destResponse.statusCode}`);
        }
      } catch (error) {
        log(`  ❌ Destination not accessible: ${error.message}`, 'red');
        testResult.issues.push(`Destination not accessible: ${error.message}`);
      }
    }
    
    // Determine overall success
    testResult.success = testResult.issues.length === 0 && response.statusCode === 308;
    
    if (testResult.success) {
      log(`  🎉 Redirect test passed!`, 'green');
    } else {
      log(`  💥 Redirect test failed!`, 'red');
    }
    
    return testResult;
    
  } catch (error) {
    log(`  ❌ Request failed: ${error.message}`, 'red');
    return {
      redirect,
      sourceUrl,
      expectedDestination,
      success: false,
      issues: [`Request failed: ${error.message}`]
    };
  }
}

async function testAllRedirects(redirects, baseUrl) {
  log(`\n🚀 Starting E2E redirect testing...`, 'cyan');
  log(`Base URL: ${baseUrl}`, 'blue');
  log(`Testing ${redirects.length} redirects...`, 'blue');
  
  const results = [];
  let passed = 0;
  let failed = 0;
  
  for (let i = 0; i < redirects.length; i++) {
    const redirect = redirects[i];
    log(`\n[${i + 1}/${redirects.length}]`, 'cyan');
    
    const result = await testRedirect(redirect, baseUrl);
    results.push(result);
    
    if (result.success) {
      passed++;
    } else {
      failed++;
    }
    
    // Add small delay between requests to avoid overwhelming the server
    if (i < redirects.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return {
    results,
    summary: {
      total: redirects.length,
      passed,
      failed,
      successRate: (passed / redirects.length * 100).toFixed(1)
    }
  };
}

function generateReport(testResults) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: testResults.summary,
    results: testResults.results,
    failedRedirects: testResults.results.filter(r => !r.success),
    recommendations: []
  };
  
  // Generate recommendations based on failures
  const statusCodeIssues = testResults.results.filter(r => 
    r.issues.some(issue => issue.includes('Expected 308'))
  );
  
  if (statusCodeIssues.length > 0) {
    report.recommendations.push({
      type: 'status_code',
      message: `${statusCodeIssues.length} redirects are not using 308 status code`,
      action: 'Update middleware to use 308 status code for permanent redirects'
    });
  }
  
  const locationIssues = testResults.results.filter(r => 
    r.issues.some(issue => issue.includes('Location mismatch'))
  );
  
  if (locationIssues.length > 0) {
    report.recommendations.push({
      type: 'location_header',
      message: `${locationIssues.length} redirects have incorrect location headers`,
      action: 'Verify redirect destinations in redirects.json'
    });
  }
  
  const accessibilityIssues = testResults.results.filter(r => 
    r.issues.some(issue => issue.includes('Destination not accessible'))
  );
  
  if (accessibilityIssues.length > 0) {
    report.recommendations.push({
      type: 'destination_accessibility',
      message: `${accessibilityIssues.length} redirect destinations are not accessible`,
      action: 'Check that all destination URLs are valid and accessible'
    });
  }
  
  return report;
}

function saveReport(report) {
  const reportPath = path.join(__dirname, '..', 'test-results', 'redirect-e2e-report.json');
  
  try {
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log(`💾 Test report saved to ${reportPath}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Error saving report: ${error.message}`, 'red');
    return false;
  }
}

function printSummary(testResults, report) {
  log('\n' + '=' .repeat(60), 'cyan');
  log('📊 E2E Redirect Testing Summary', 'cyan');
  log('=' .repeat(60), 'cyan');
  
  log(`Total redirects tested: ${testResults.summary.total}`, 'blue');
  log(`Passed: ${testResults.summary.passed}`, 'green');
  log(`Failed: ${testResults.summary.failed}`, 'red');
  log(`Success rate: ${testResults.summary.successRate}%`, 'blue');
  
  if (testResults.summary.failed > 0) {
    log('\n❌ Failed redirects:', 'red');
    testResults.results
      .filter(r => !r.success)
      .forEach(result => {
        log(`  • ${result.redirect.legacySlug} → ${result.redirect.currentSlug}`, 'red');
        result.issues.forEach(issue => {
          log(`    - ${issue}`, 'red');
        });
      });
  }
  
  if (report.recommendations.length > 0) {
    log('\n💡 Recommendations:', 'yellow');
    report.recommendations.forEach(rec => {
      log(`  • ${rec.message}`, 'yellow');
      log(`    Action: ${rec.action}`, 'yellow');
    });
  }
  
  log('\n' + '=' .repeat(60), 'cyan');
}

async function main() {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  
  log('🚀 Starting E2E Redirect Testing Suite', 'cyan');
  log('=' .repeat(50), 'cyan');
  
  // Load redirects
  const redirects = loadRedirects();
  if (!redirects) {
    log('❌ Failed to load redirects', 'red');
    process.exit(1);
  }
  
  if (redirects.length === 0) {
    log('⚠️  No active redirects found to test', 'yellow');
    process.exit(0);
  }
  
  // Test all redirects
  const testResults = await testAllRedirects(redirects, baseUrl);
  
  // Generate report
  const report = generateReport(testResults);
  
  // Save report
  const reportSaved = saveReport(report);
  
  // Print summary
  printSummary(testResults, report);
  
  // Exit with appropriate code
  if (testResults.summary.failed > 0) {
    log('💥 E2E redirect testing failed!', 'red');
    process.exit(1);
  } else {
    log('🎉 All E2E redirect tests passed!', 'green');
    process.exit(0);
  }
}

// Run the tests
if (require.main === module) {
  main();
}

module.exports = {
  testRedirect,
  testAllRedirects,
  generateReport
};
