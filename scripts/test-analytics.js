#!/usr/bin/env node

/**
 * Analytics & Observability Test Script
 * 
 * This script tests the analytics setup including:
 * - GA4 tracking
 * - Sentry error reporting
 * - Internal analytics API
 * - PLG event tracking
 */

const https = require('https')
const http = require('http')

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

console.log('🔍 Testing Analytics & Observability Setup...\n')

// Test 1: Check environment variables
console.log('1️⃣ Environment Variables Check:')
console.log(`   GA4 Measurement ID: ${GA4_ID ? '✅ Set' : '❌ Missing'}`)
console.log(`   Sentry DSN: ${SENTRY_DSN ? '✅ Set' : '❌ Missing'}`)
console.log(`   Base URL: ${BASE_URL}`)
console.log('')

// Test 2: Test internal analytics API
console.log('2️⃣ Internal Analytics API Test:')
testAnalyticsAPI()
  .then(() => {
    console.log('   ✅ Analytics API working')
  })
  .catch((error) => {
    console.log(`   ❌ Analytics API failed: ${error.message}`)
  })

// Test 3: Test pageview tracking
console.log('3️⃣ Pageview Tracking Test:')
testPageviewTracking()
  .then(() => {
    console.log('   ✅ Pageview tracking working')
  })
  .catch((error) => {
    console.log(`   ❌ Pageview tracking failed: ${error.message}`)
  })

// Test 4: Test PLG events
console.log('4️⃣ PLG Events Test:')
testPLGEvents()
  .then(() => {
    console.log('   ✅ PLG events working')
  })
  .catch((error) => {
    console.log(`   ❌ PLG events failed: ${error.message}`)
  })

// Test 5: Check GA4 script loading
console.log('5️⃣ GA4 Script Check:')
checkGA4Script()
  .then(() => {
    console.log('   ✅ GA4 script loading correctly')
  })
  .catch((error) => {
    console.log(`   ❌ GA4 script check failed: ${error.message}`)
  })

// Test 6: Check Sentry script loading
console.log('6️⃣ Sentry Script Check:')
checkSentryScript()
  .then(() => {
    console.log('   ✅ Sentry script loading correctly')
  })
  .catch((error) => {
    console.log(`   ❌ Sentry script check failed: ${error.message}`)
  })

console.log('\n📊 Test Summary:')
console.log('   Run the tests above to see results')
console.log('   Check browser console for GA4 and Sentry logs')
console.log('   Verify events appear in your analytics dashboard')

// Helper functions
async function testAnalyticsAPI() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      event: 'test_event',
      properties: {
        test: true,
        timestamp: Date.now(),
        source: 'test_script'
      }
    })

    const options = {
      hostname: new URL(BASE_URL).hostname,
      port: new URL(BASE_URL).port || 80,
      path: '/api/analytics/track',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve()
      } else {
        reject(new Error(`HTTP ${res.statusCode}`))
      }
    })

    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

async function testPageviewTracking() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      url: '/test-page',
      title: 'Test Page',
      timestamp: Date.now()
    })

    const options = {
      hostname: new URL(BASE_URL).hostname,
      port: new URL(BASE_URL).port || 80,
      path: '/api/analytics/pageview',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve()
      } else {
        reject(new Error(`HTTP ${res.statusCode}`))
      }
    })

    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

async function testPLGEvents() {
  const events = [
    'PF_LANDING_CTA_CLICK',
    'PF_PRICING_VIEW',
    'PF_PLAN_SELECTED',
    'PF_CHECKOUT_STARTED',
    'PF_CHECKOUT_COMPLETED',
    'PF_GATE_HIT',
    'PF_PAYWALL_VIEWED',
    'PF_PAYWALL_CTA_CLICK'
  ]

  console.log(`   Testing ${events.length} PLG events...`)
  
  for (const event of events) {
    try {
      await testEvent(event)
      console.log(`      ✅ ${event}`)
    } catch (error) {
      console.log(`      ❌ ${event}: ${error.message}`)
    }
  }
  
  resolve()
}

async function testEvent(eventName) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      event: eventName,
      properties: {
        test: true,
        timestamp: Date.now(),
        source: 'test_script'
      }
    })

    const options = {
      hostname: new URL(BASE_URL).hostname,
      port: new URL(BASE_URL).port || 80,
      path: '/api/analytics/track',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve()
      } else {
        reject(new Error(`HTTP ${res.statusCode}`))
      }
    })

    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

async function checkGA4Script() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: new URL(BASE_URL).hostname,
      port: new URL(BASE_URL).port || 80,
      path: '/',
      method: 'GET'
    }

    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        if (data.includes('gtag') && data.includes('GA4_MEASUREMENT_ID')) {
          resolve()
        } else {
          reject(new Error('GA4 script not found in HTML'))
        }
      })
    })

    req.on('error', reject)
    req.end()
  })
}

async function checkSentryScript() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: new URL(BASE_URL).hostname,
      port: new URL(BASE_URL).port || 80,
      path: '/',
      method: 'GET'
    }

    const req = http.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        if (data.includes('sentry-cdn.com')) {
          resolve()
        } else {
          reject(new Error('Sentry script not found in HTML'))
        }
      })
    })

    req.on('error', reject)
    req.end()
  })
}
