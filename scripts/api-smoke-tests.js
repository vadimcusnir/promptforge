#!/usr/bin/env node

/**
 * PromptForge v3 - API Smoke Tests
 * Comprehensive testing of critical API endpoints for functionality and security
 */

const https = require('https');
const http = require('http');

// Configuration
const config = {
  baseUrl: process.env.STAGING_URL || 'http://localhost:3000',
  authToken: process.env.AUTH_TOKEN || '',
  orgId: process.env.ORG_ID || '',
  timeout: 10000,
  verbose: process.env.VERBOSE === 'true'
};

// Test results tracking
const results = {
  total: 4,
  passed: 0,
  failed: 0,
  skipped: 0,
  details: []
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name, status, details = '') {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  const color = status === 'PASS' ? 'green' : status === 'FAIL' ? 'red' : 'yellow';
  log(`${icon} ${name}: ${status}`, color);
  if (details) log(`   ${details}`, 'cyan');
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PromptForge-SmokeTests/1.0',
        ...options.headers
      },
      timeout: config.timeout
    };

    if (options.body) {
      requestOptions.headers['Content-Length'] = Buffer.byteLength(options.body);
    }

    const req = client.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: parsed
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: { raw: data }
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

function checkPII(data) {
  const piiPatterns = [
    /email/i,
    /phone/i,
    /address/i,
    /ssn/i,
    /credit_card/i,
    /password/i,
    /api_key/i,
    /secret/i
  ];
  
  const dataStr = JSON.stringify(data).toLowerCase();
  const foundPII = piiPatterns.filter(pattern => pattern.test(dataStr));
  
  return {
    hasPII: foundPII.length > 0,
    patterns: foundPII
  };
}

// Test functions
async function testEntitlements() {
  if (!config.authToken || !config.orgId) {
    results.skipped++;
    logTest('Entitlements API', 'SKIP', 'Missing auth token or org ID');
    return;
  }

  try {
    const url = `${config.baseUrl}/api/entitlements?orgId=${config.orgId}`;
    const response = await makeRequest(url, {
      headers: { 'Authorization': `Bearer ${config.authToken}` }
    });

    const piiCheck = checkPII(response.data);
    
    if (response.status === 200 && response.data.entitlements) {
      results.passed++;
      logTest('Entitlements API', 'PASS', `Status: ${response.status}, Flags: ${Object.keys(response.data.entitlements).length}`);
      
      if (piiCheck.hasPII) {
        logTest('Entitlements PII Check', 'FAIL', `PII patterns detected: ${piiCheck.patterns.join(', ')}`);
        results.failed++;
      } else {
        logTest('Entitlements PII Check', 'PASS', 'No PII detected');
      }
    } else {
      results.failed++;
      logTest('Entitlements API', 'FAIL', `Status: ${response.status}, Response: ${JSON.stringify(response.data).substring(0, 100)}`);
    }
  } catch (error) {
    results.failed++;
    logTest('Entitlements API', 'FAIL', `Error: ${error.message}`);
  }
}

async function testGptEditor() {
  if (!config.authToken || !config.orgId) {
    results.skipped++;
    logTest('GPT Editor API', 'SKIP', 'Missing auth token or org ID');
    return;
  }

  try {
    const payload = {
      prompt: "This is a test prompt that meets the minimum length requirement of 64 characters for testing purposes.",
      orgId: config.orgId,
      sevenD: {
        domain: "test",
        scale: "small",
        urgency: "low"
      }
    };

    const url = `${config.baseUrl}/api/gpt-editor`;
    const response = await makeRequest(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${config.authToken}` },
      body: JSON.stringify(payload)
    });

    const piiCheck = checkPII(response.data);
    
    if (response.status === 200 && response.data.success) {
      results.passed++;
      logTest('GPT Editor API', 'PASS', `Status: ${response.status}, Success: ${response.data.success}`);
      
      if (piiCheck.hasPII) {
        logTest('GPT Editor PII Check', 'FAIL', `PII patterns detected: ${piiCheck.patterns.join(', ')}`);
        results.failed++;
      } else {
        logTest('GPT Editor PII Check', 'PASS', 'No PII detected');
      }
    } else {
      results.failed++;
      logTest('GPT Editor API', 'FAIL', `Status: ${response.status}, Response: ${JSON.stringify(response.data).substring(0, 100)}`);
    }
  } catch (error) {
    results.failed++;
    logTest('GPT Editor API', 'FAIL', `Error: ${error.message}`);
  }
}

async function testGptTest() {
  if (!config.authToken || !config.orgId) {
    results.skipped++;
    logTest('GPT Test API', 'SKIP', 'Missing auth token or org ID');
    return;
  }

  try {
    const payload = {
      prompt: "Test prompt for GPT testing",
      testType: "mock",
      orgId: config.orgId,
      sevenD: {
        domain: "test",
        scale: "small"
      }
    };

    const url = `${config.baseUrl}/api/gpt-test`;
    const response = await makeRequest(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${config.authToken}` },
      body: JSON.stringify(payload)
    });

    const piiCheck = checkPII(response.data);
    
    if (response.status === 200 && response.data.success) {
      results.passed++;
      logTest('GPT Test API', 'PASS', `Status: ${response.status}, Success: ${response.data.success}`);
      
      if (piiCheck.hasPII) {
        logTest('GPT Test PII Check', 'FAIL', `PII patterns detected: ${piiCheck.patterns.join(', ')}`);
        results.failed++;
      } else {
        logTest('GPT Test PII Check', 'PASS', 'No PII detected');
      }
    } else {
      results.failed++;
      logTest('GPT Test API', 'FAIL', `Status: ${response.status}, Response: ${JSON.stringify(response.data).substring(0, 100)}`);
    }
  } catch (error) {
    results.failed++;
    logTest('GPT Test API', 'FAIL', `Error: ${error.message}`);
  }
}

async function testExportBundle() {
  if (!config.authToken) {
    results.skipped++;
    logTest('Export Bundle API', 'SKIP', 'Missing auth token');
    return;
  }

  try {
    const payload = {
      orgId: config.orgId,
      bundleType: "test"
    };

    const url = `${config.baseUrl}/api/export/bundle`;
    const response = await makeRequest(url, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${config.authToken}` },
      body: JSON.stringify(payload)
    });

    const piiCheck = checkPII(response.data);
    
    // Note: This endpoint is currently disabled (503) during launch phase
    if (response.status === 503 && response.data.code === 'LAUNCH_MODE') {
      results.passed++;
      logTest('Export Bundle API', 'PASS', `Status: ${response.status}, Expected: Launch mode restriction`);
      
      if (piiCheck.hasPII) {
        logTest('Export Bundle PII Check', 'FAIL', `PII patterns detected: ${piiCheck.patterns.join(', ')}`);
        results.failed++;
      } else {
        logTest('Export Bundle PII Check', 'PASS', 'No PII detected');
      }
    } else {
      results.failed++;
      logTest('Export Bundle API', 'FAIL', `Status: ${response.status}, Response: ${JSON.stringify(response.data).substring(0, 100)}`);
    }
  } catch (error) {
    results.failed++;
    logTest('Export Bundle API', 'FAIL', `Error: ${error.message}`);
  }
}

// Main execution
async function runTests() {
  log('\n🚀 PromptForge v3 API Smoke Tests', 'blue');
  log('================================', 'blue');
  log(`Base URL: ${config.baseUrl}`, 'cyan');
  log(`Auth Token: ${config.authToken ? config.authToken.substring(0, 20) + '...' : 'Not provided'}`, 'cyan');
  log(`Org ID: ${config.orgId || 'Not provided'}`, 'cyan');
  log(`Timeout: ${config.timeout}ms`, 'cyan');
  log('');

  const startTime = Date.now();

  // Run all tests
  await testEntitlements();
  await testGptEditor();
  await testGptTest();
  await testExportBundle();

  const endTime = Date.now();
  const duration = endTime - startTime;

  // Results summary
  log('\n================================', 'blue');
  log('Test Results Summary', 'blue');
  log('================================', 'blue');
  log(`Total Tests: ${results.total}`, 'cyan');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, 'red');
  log(`Skipped: ${results.skipped}`, 'yellow');
  log(`Duration: ${duration}ms`, 'cyan');

  if (results.failed === 0 && results.skipped === 0) {
    log('\n🎉 All smoke tests passed!', 'green');
    process.exit(0);
  } else if (results.failed === 0) {
    log('\n⚠️  Some tests were skipped, but all executed tests passed', 'yellow');
    process.exit(0);
  } else {
    log('\n❌ Some tests failed. Check the output above.', 'red');
    process.exit(1);
  }
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  log('PromptForge v3 API Smoke Tests', 'blue');
  log('Usage: node api-smoke-tests.js [options]', 'cyan');
  log('', 'reset');
  log('Environment Variables:', 'yellow');
  log('  STAGING_URL    Base URL for the staging environment', 'cyan');
  log('  AUTH_TOKEN     Authentication token for API requests', 'cyan');
  log('  ORG_ID         Organization ID for testing', 'cyan');
  log('  VERBOSE        Enable verbose output (true/false)', 'cyan');
  log('', 'reset');
  log('Examples:', 'yellow');
  log('  node api-smoke-tests.js', 'cyan');
  log('  STAGING_URL=https://staging.example.com AUTH_TOKEN=token ORG_ID=uuid node api-smoke-tests.js', 'cyan');
  process.exit(0);
}

// Run tests
runTests().catch(error => {
  log(`\n💥 Fatal error: ${error.message}`, 'red');
  process.exit(1);
});
