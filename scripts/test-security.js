#!/usr/bin/env node

/**
 * Security Test Script for PromptForge v3
 * Tests security headers, rate limiting, and environment variable exposure
 */

const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const isHttps = BASE_URL.startsWith('https://');

console.log('🔒 PromptForge v3 Security Test Suite');
console.log('=====================================\n');

// Test 1: Security Headers
async function testSecurityHeaders() {
  console.log('1. Testing Security Headers...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/`, 'HEAD');
    
    const requiredHeaders = {
      'content-security-policy': 'Content Security Policy',
      'strict-transport-security': 'HTTP Strict Transport Security',
      'x-frame-options': 'X-Frame-Options',
      'x-content-type-options': 'X-Content-Type-Options',
      'referrer-policy': 'Referrer Policy',
      'permissions-policy': 'Permissions Policy',
      'x-permitted-cross-domain-policies': 'X-Permitted-Cross-Domain-Policies',
      'x-download-options': 'X-Download-Options',
      'x-xss-protection': 'X-XSS-Protection'
    };
    
    let allHeadersPresent = true;
    
    Object.entries(requiredHeaders).forEach(([header, description]) => {
      if (response.headers[header]) {
        console.log(`   ✅ ${description}: ${response.headers[header]}`);
      } else {
        console.log(`   ❌ ${description}: MISSING`);
        allHeadersPresent = false;
      }
    });
    
    if (allHeadersPresent) {
      console.log('   🎉 All security headers are present!');
    } else {
      console.log('   ⚠️  Some security headers are missing');
    }
    
    return allHeadersPresent;
  } catch (error) {
    console.log(`   ❌ Error testing headers: ${error.message}`);
    return false;
  }
}

// Test 2: Rate Limiting
async function testRateLimiting() {
  console.log('\n2. Testing Rate Limiting...');
  
  try {
    // Make multiple requests to trigger rate limiting
    const requests = [];
    for (let i = 0; i < 15; i++) {
      requests.push(makeRequest(`${BASE_URL}/api/gpt-editor`, 'POST', { test: true }));
    }
    
    const responses = await Promise.allSettled(requests);
    
    let successCount = 0;
    let rateLimitedCount = 0;
    let otherErrors = 0;
    
    responses.forEach(response => {
      if (response.status === 'fulfilled') {
        if (response.value.status === 200) {
          successCount++;
        } else if (response.value.status === 429) {
          rateLimitedCount++;
        } else {
          otherErrors++;
        }
      } else {
        otherErrors++;
      }
    });
    
    console.log(`   📊 Total requests: ${responses.length}`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   🚫 Rate limited: ${rateLimitedCount}`);
    console.log(`   ❌ Other errors: ${otherErrors}`);
    
    if (rateLimitedCount > 0) {
      console.log('   🎉 Rate limiting is working!');
      return true;
    } else {
      console.log('   ⚠️  Rate limiting may not be working properly');
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error testing rate limiting: ${error.message}`);
    return false;
  }
}

// Test 3: Environment Variable Exposure
async function testEnvVarExposure() {
  console.log('\n3. Testing Environment Variable Exposure...');
  
  try {
    // Check if sensitive environment variables are exposed in the client bundle
    const response = await makeRequest(`${BASE_URL}/`, 'GET');
    const html = response.data;
    
    const sensitivePatterns = [
      /SUPABASE_SERVICE_ROLE_KEY/,
      /STRIPE_SECRET_KEY/,
      /STRIPE_WEBHOOK_SECRET/,
      /SENDGRID_API_KEY/,
      /JWT_SECRET/,
      /ENCRYPTION_KEY/
    ];
    
    let exposedVars = [];
    sensitivePatterns.forEach(pattern => {
      if (pattern.test(html)) {
        exposedVars.push(pattern.source.replace(/[\/\\]/g, ''));
      }
    });
    
    if (exposedVars.length === 0) {
      console.log('   ✅ No sensitive environment variables exposed in client bundle');
      return true;
    } else {
      console.log(`   ❌ CRITICAL: Sensitive variables exposed: ${exposedVars.join(', ')}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error testing env var exposure: ${error.message}`);
    return false;
  }
}

// Test 4: CORS Configuration
async function testCORS() {
  console.log('\n4. Testing CORS Configuration...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/`, 'OPTIONS', null, {
      'Origin': 'https://malicious-site.com',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type'
    });
    
    const corsHeaders = response.headers['access-control-allow-origin'];
    
    if (corsHeaders === '*' || corsHeaders === 'https://malicious-site.com') {
      console.log('   ❌ CORS is too permissive');
      return false;
    } else if (corsHeaders === BASE_URL || corsHeaders === 'null') {
      console.log('   ✅ CORS is properly restricted');
      return true;
    } else {
      console.log(`   ⚠️  CORS configuration unclear: ${corsHeaders}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error testing CORS: ${error.message}`);
    return false;
  }
}

// Test 5: HTTPS Enforcement (if applicable)
async function testHTTPSEnforcement() {
  if (!isHttps) {
    console.log('\n5. Testing HTTPS Enforcement...');
    console.log('   ℹ️  Skipping HTTPS test (not using HTTPS)');
    return true;
  }
  
  console.log('\n5. Testing HTTPS Enforcement...');
  
  try {
    // Try to access via HTTP to see if it redirects to HTTPS
    const httpUrl = BASE_URL.replace('https://', 'http://');
    const response = await makeRequest(httpUrl, 'GET');
    
    if (response.status === 301 || response.status === 302) {
      const location = response.headers.location;
      if (location && location.startsWith('https://')) {
        console.log('   ✅ HTTP to HTTPS redirect is working');
        return true;
      }
    }
    
    console.log('   ⚠️  HTTPS enforcement may not be working properly');
    return false;
  } catch (error) {
    console.log(`   ❌ Error testing HTTPS enforcement: ${error.message}`);
    return false;
  }
}

// Helper function to make HTTP/HTTPS requests
function makeRequest(url, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 3000),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'User-Agent': 'PromptForge-Security-Test/1.0',
        ...headers
      }
    };
    
    const client = isHttps ? https : http;
    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Main test execution
async function runAllTests() {
  const results = {
    headers: await testSecurityHeaders(),
    rateLimiting: await testRateLimiting(),
    envVars: await testEnvVarExposure(),
    cors: await testCORS(),
    https: await testHTTPSEnforcement()
  };
  
  console.log('\n📋 Security Test Summary');
  console.log('========================');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${test}`);
  });
  
  console.log(`\nOverall: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All security tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some security tests failed. Please review and fix the issues.');
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = {
  testSecurityHeaders,
  testRateLimiting,
  testEnvVarExposure,
  testCORS,
  testHTTPSEnforcement,
  runAllTests
};
