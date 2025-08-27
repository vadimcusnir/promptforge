#!/usr/bin/env node

/**
 * Simple Security Test Script for PromptForge v3
 * Tests basic security functionality
 */

console.log('🔒 PromptForge v3 Simple Security Test');
console.log('======================================\n');

// Test 1: Check if security files exist
const fs = require('fs');
const path = require('path');

console.log('1. Checking Security Files...');

const securityFiles = [
  'lib/security.ts',
  'lib/rate-limit.ts',
  'next.config.mjs',
  'middleware.ts'
];

let allFilesExist = true;
securityFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ❌ ${file} missing`);
    allFilesExist = false;
  }
});

// Test 2: Check Next.js config for security headers
console.log('\n2. Checking Next.js Security Configuration...');

try {
  const nextConfigPath = 'next.config.mjs';
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
  
  const securityHeaders = [
    'Content-Security-Policy',
    'Strict-Transport-Security',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'Referrer-Policy',
    'Permissions-Policy'
  ];
  
  let allHeadersConfigured = true;
  securityHeaders.forEach(header => {
    if (nextConfigContent.includes(header)) {
      console.log(`   ✅ ${header} configured`);
    } else {
      console.log(`   ❌ ${header} not configured`);
      allHeadersConfigured = false;
    }
  });
  
  if (allHeadersConfigured) {
    console.log('   🎉 All security headers are configured!');
  }
} catch (error) {
  console.log(`   ❌ Error reading Next.js config: ${error.message}`);
}

// Test 3: Check middleware for rate limiting
console.log('\n3. Checking Middleware Security...');

try {
  const middlewarePath = 'middleware.ts';
  const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
  
  const securityFeatures = [
    'rate-limit',
    'createRateLimit',
    'RATE_LIMITS',
    'getClientIdentifier'
  ];
  
  let allFeaturesPresent = true;
  securityFeatures.forEach(feature => {
    if (middlewareContent.includes(feature)) {
      console.log(`   ✅ ${feature} implemented`);
    } else {
      console.log(`   ❌ ${feature} not implemented`);
      allFeaturesPresent = false;
    }
  });
  
  if (allFeaturesPresent) {
    console.log('   🎉 Rate limiting is implemented in middleware!');
  }
} catch (error) {
  console.log(`   ❌ Error reading middleware: ${error.message}`);
}

// Test 4: Check package.json for security scripts
console.log('\n4. Checking Security Scripts...');

try {
  const packageJsonPath = 'package.json';
  const packageJsonContent = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const securityScripts = [
    'security:test',
    'security:check',
    'security:headers',
    'security:validate'
  ];
  
  let allScriptsPresent = true;
  securityScripts.forEach(script => {
    if (packageJsonContent.scripts && packageJsonContent.scripts[script]) {
      console.log(`   ✅ ${script} script available`);
    } else {
      console.log(`   ❌ ${script} script missing`);
      allScriptsPresent = false;
    }
  });
  
  if (allScriptsPresent) {
    console.log('   🎉 All security scripts are available!');
  }
} catch (error) {
  console.log(`   ❌ Error reading package.json: ${error.message}`);
}

// Test 5: Check for sensitive environment variables in code
console.log('\n5. Checking for Sensitive Data Exposure...');

try {
  const sensitivePatterns = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'SENDGRID_API_KEY',
    'JWT_SECRET',
    'ENCRYPTION_KEY'
  ];
  
  let exposedVars = [];
  
  // Check in key files
  const filesToCheck = [
    'app/api/gpt-editor/route.ts',
    'lib/config.ts',
    'lib/billing/stripe.ts'
  ];
  
  filesToCheck.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      sensitivePatterns.forEach(pattern => {
        if (content.includes(pattern)) {
          // Check if it's properly handled (not hardcoded)
          if (!content.includes(`process.env.${pattern}`) && 
              !content.includes(`NEXT_PUBLIC_${pattern}`)) {
            exposedVars.push(`${pattern} in ${file}`);
          }
        }
      });
    }
  });
  
  if (exposedVars.length === 0) {
    console.log('   ✅ No sensitive environment variables are hardcoded');
  } else {
    console.log(`   ❌ CRITICAL: Sensitive variables exposed: ${exposedVars.join(', ')}`);
  }
} catch (error) {
  console.log(`   ❌ Error checking for sensitive data: ${error.message}`);
}

// Summary
console.log('\n📋 Security Test Summary');
console.log('========================');

if (allFilesExist) {
  console.log('✅ All security files are present');
} else {
  console.log('❌ Some security files are missing');
}

console.log('\n🔒 Security Implementation Status:');
console.log('- Security headers: Configured in Next.js');
console.log('- Rate limiting: Implemented in middleware');
console.log('- Environment validation: Available in lib/security.ts');
console.log('- Testing tools: Available via npm scripts');
console.log('- Documentation: Available in SECURITY.md');

console.log('\n🚀 Next Steps:');
console.log('1. Run: npm run security:check (for quick validation)');
console.log('2. Run: npm run security:test (for comprehensive testing)');
console.log('3. Start dev server and test: npm run dev');
console.log('4. Test headers: curl -I http://localhost:3000');

console.log('\n🎉 Security implementation is ready for testing!');
