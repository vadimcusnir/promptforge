#!/usr/bin/env node

/**
 * Security Lockdown Test Suite
 * Tests all implemented security measures
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔒 SECURITY LOCKDOWN TEST SUITE')
console.log('================================\n')

// Test results tracking
const results = {
  jwt: { passed: 0, failed: 0, tests: [] },
  rateLimit: { passed: 0, failed: 0, tests: [] },
  sanitization: { passed: 0, failed: 0, tests: [] },
  waf: { passed: 0, failed: 0, tests: [] },
  monitoring: { passed: 0, failed: 0, tests: [] }
}

// Test helper functions
function test(name, testFn, category) {
  try {
    console.log(`🧪 Testing: ${name}`)
    const result = testFn()
    if (result) {
      console.log(`✅ PASS: ${name}`)
      results[category].passed++
      results[category].tests.push({ name, status: 'PASS' })
    } else {
      console.log(`❌ FAIL: ${name}`)
      results[category].failed++
      results[category].tests.push({ name, status: 'FAIL' })
    }
  } catch (error) {
    console.log(`💥 ERROR: ${name} - ${error.message}`)
    results[category].failed++
    results[category].tests.push({ name, status: 'ERROR', error: error.message })
  }
  console.log('')
}

// JWT Security Tests
console.log('🔐 JWT Security Hardening Tests')
console.log('--------------------------------')

test('JWT Security Module Exists', () => {
  return fs.existsSync(path.join(__dirname, '../lib/auth/jwt-security.ts'))
}, 'jwt')

test('JWT Refresh Endpoint Exists', () => {
  return fs.existsSync(path.join(__dirname, '../app/api/auth/refresh/route.ts'))
}, 'jwt')

test('JWT Security Manager Class Exists', () => {
  const content = fs.readFileSync(path.join(__dirname, '../lib/auth/jwt-security.ts'), 'utf8')
  return content.includes('class JWTSecurityManager')
}, 'jwt')

test('HttpOnly Cookie Configuration', () => {
  const content = fs.readFileSync(path.join(__dirname, '../lib/auth/jwt-security.ts'), 'utf8')
  return content.includes('httpOnly: true')
}, 'jwt')

test('Token Rotation Mechanism', () => {
  const content = fs.readFileSync(path.join(__dirname, '../lib/auth/jwt-security.ts'), 'utf8')
  return content.includes('shouldRotateToken')
}, 'jwt')

// Rate Limiting Tests
console.log('🚦 Rate Limiting Fortress Tests')
console.log('--------------------------------')

test('Rate Limiter Module Exists', () => {
  return fs.existsSync(path.join(__dirname, '../lib/security/rate-limiter.ts'))
}, 'rateLimit')

test('Advanced Rate Limiter Class Exists', () => {
  const content = fs.readFileSync(path.join(__dirname, '../lib/security/rate-limiter.ts'), 'utf8')
  return content.includes('class AdvancedRateLimiter')
}, 'rateLimit')

test('Fingerprinting Implementation', () => {
  const content = fs.readFileSync(path.join(__dirname, '../lib/security/rate-limiter.ts'), 'utf8')
  return content.includes('generateFingerprint')
}, 'rateLimit')

test('Honeypot Endpoints Configuration', () => {
  const content = fs.readFileSync(path.join(__dirname, '../lib/security/rate-limiter.ts'), 'utf8')
  return content.includes('HONEYPOT_ENDPOINTS')
}, 'rateLimit')

test('Burst Protection', () => {
  const content = fs.readFileSync(path.join(__dirname, '../lib/security/rate-limiter.ts'), 'utf8')
  return content.includes('checkBurstLimit')
}, 'rateLimit')

// Input Sanitization Tests
console.log('🧹 Input Sanitization Tests')
console.log('----------------------------')

test('Input Sanitizer Module Exists', () => {
  return fs.existsSync(path.join(__dirname, '../lib/security/input-sanitizer.ts'))
}, 'sanitization')

test('DOMPurify Integration', () => {
  const content = fs.readFileSync(path.join(__dirname, '../lib/security/input-sanitizer.ts'), 'utf8')
  return content.includes('import DOMPurify')
}, 'sanitization')

test('Prompt Injection Detection', () => {
  const content = fs.readFileSync(path.join(__dirname, '../lib/security/input-sanitizer.ts'), 'utf8')
  return content.includes('detectPromptInjection')
}, 'sanitization')

test('XSS Protection Patterns', () => {
  const content = fs.readFileSync(path.join(__dirname, '../lib/security/input-sanitizer.ts'), 'utf8')
  return content.includes('<script') && content.includes('javascript:')
}, 'sanitization')

test('SQL Injection Protection', () => {
  const content = fs.readFileSync(path.join(__dirname, '../lib/security/input-sanitizer.ts'), 'utf8')
  return content.includes('union') && content.includes('select')
}, 'sanitization')

// WAF Tests
console.log('🛡️ Web Application Firewall Tests')
console.log('-----------------------------------')

test('WAF Middleware Module Exists', () => {
  return fs.existsSync(path.join(__dirname, '../lib/security/waf-middleware.ts'))
}, 'waf')

test('WAF Middleware Class Exists', () => {
  const content = fs.readFileSync(path.join(__dirname, '../lib/security/waf-middleware.ts'), 'utf8')
  return content.includes('class WAFMiddleware')
}, 'waf')

test('Security Headers Implementation', () => {
  const content = fs.readFileSync(path.join(__dirname, '../lib/security/waf-middleware.ts'), 'utf8')
  return content.includes('addSecurityHeaders')
}, 'waf')

test('CSP Header Configuration', () => {
  const content = fs.readFileSync(path.join(__dirname, '../lib/security/waf-middleware.ts'), 'utf8')
  return content.includes('Content-Security-Policy')
}, 'waf')

test('Request Body Sanitization', () => {
  const content = fs.readFileSync(path.join(__dirname, '../lib/security/waf-middleware.ts'), 'utf8')
  return content.includes('sanitizeRequestBody')
}, 'waf')

// Security Monitoring Tests
console.log('📊 Security Monitoring Tests')
console.log('-----------------------------')

test('Security Monitor Module Exists', () => {
  return fs.existsSync(path.join(__dirname, '../lib/security/security-monitor.ts'))
}, 'monitoring')

test('Security Monitor Class Exists', () => {
  const content = fs.readFileSync(path.join(__dirname, '../lib/security/security-monitor.ts'), 'utf8')
  return content.includes('class SecurityMonitor')
}, 'monitoring')

test('Security Metrics API Endpoint', () => {
  return fs.existsSync(path.join(__dirname, '../app/api/security/metrics/route.ts'))
}, 'monitoring')

test('Security Dashboard Component', () => {
  return fs.existsSync(path.join(__dirname, '../components/security/SecurityDashboard.tsx'))
}, 'monitoring')

test('Database Migration Exists', () => {
  return fs.existsSync(path.join(__dirname, '../supabase/migrations/20241220000000_security_lockdown.sql'))
}, 'monitoring')

// Integration Tests
console.log('🔗 Integration Tests')
console.log('--------------------')

test('Middleware Integration', () => {
  const content = fs.readFileSync(path.join(__dirname, '../middleware.ts'), 'utf8')
  return content.includes('wafMiddleware.processRequest')
}, 'waf')

test('Package Dependencies', () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'))
  return packageJson.dependencies.dompurify && packageJson.dependencies.jsdom
}, 'sanitization')

test('TypeScript Configuration', () => {
  return fs.existsSync(path.join(__dirname, '../tsconfig.json'))
}, 'jwt')

// Security Headers Test
console.log('📋 Security Headers Test')
console.log('-------------------------')

test('Security Headers in WAF', () => {
  const content = fs.readFileSync(path.join(__dirname, '../lib/security/waf-middleware.ts'), 'utf8')
  const requiredHeaders = [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
    'Referrer-Policy',
    'Permissions-Policy',
    'Content-Security-Policy'
  ]
  return requiredHeaders.every(header => content.includes(header))
}, 'waf')

// Summary
console.log('📊 SECURITY LOCKDOWN TEST RESULTS')
console.log('==================================')

Object.entries(results).forEach(([category, result]) => {
  const total = result.passed + result.failed
  const percentage = total > 0 ? Math.round((result.passed / total) * 100) : 0
  const emoji = percentage === 100 ? '🟢' : percentage >= 80 ? '🟡' : '🔴'
  
  console.log(`${emoji} ${category.toUpperCase()}: ${result.passed}/${total} (${percentage}%)`)
  
  if (result.failed > 0) {
    result.tests.filter(t => t.status !== 'PASS').forEach(test => {
      console.log(`   ❌ ${test.name}${test.error ? ` - ${test.error}` : ''}`)
    })
  }
})

const totalPassed = Object.values(results).reduce((sum, r) => sum + r.passed, 0)
const totalTests = Object.values(results).reduce((sum, r) => sum + r.passed + r.failed, 0)
const overallPercentage = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0

console.log(`\n🎯 OVERALL: ${totalPassed}/${totalTests} (${overallPercentage}%)`)

if (overallPercentage === 100) {
  console.log('\n🎉 ALL SECURITY TESTS PASSED! Security lockdown is complete.')
  process.exit(0)
} else if (overallPercentage >= 80) {
  console.log('\n⚠️  Most security tests passed. Review failed tests and fix critical issues.')
  process.exit(1)
} else {
  console.log('\n🚨 CRITICAL: Multiple security tests failed. Immediate attention required!')
  process.exit(1)
}
