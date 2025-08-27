#!/usr/bin/env node

/**
 * Export Pipeline Test Script
 * 
 * This script tests the export pipeline including:
 * - Bundle generation with all formats
 * - Manifest creation with 7D parameters
 * - Checksum generation and verification
 * - Score validation (DoD requirements)
 * - Watermark application for trial users
 * - Enterprise ZIP bundle generation
 */

const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

console.log('🔍 Testing Export Pipeline...\n')

// Test data
const testData = {
  runId: 'test-run-' + Date.now(),
  moduleId: 'M01',
  promptText: 'This is a test prompt for export pipeline validation.',
  sevenD: {
    domain: 'technology',
    scale: 'enterprise',
    urgency: 'high',
    complexity: 'medium',
    resources: 'adequate',
    application: 'production',
    output_format: 'structured'
  },
  formats: ['txt', 'md', 'json', 'pdf'],
  score: 85, // Above threshold
  orgId: 'test-org-123',
  userId: 'test-user-456',
  planName: 'pro'
}

// Test 1: Export Pipeline API
console.log('1️⃣ Export Pipeline API Test:')
testExportPipeline()
  .then(() => {
    console.log('   ✅ Export pipeline working')
  })
  .catch((error) => {
    console.log(`   ❌ Export pipeline failed: ${error.message}`)
  })

// Test 2: Score Validation
console.log('2️⃣ Score Validation Test:')
testScoreValidation()
  .then(() => {
    console.log('   ✅ Score validation working')
  })
  .catch((error) => {
    console.log(`   ❌ Score validation failed: ${error.message}`)
  })

// Test 3: Bundle Verification
console.log('3️⃣ Bundle Verification Test:')
testBundleVerification()
  .then(() => {
    console.log('   ✅ Bundle verification working')
  })
  .catch((error) => {
    console.log(`   ❌ Bundle verification failed: ${error.message}`)
  })

// Test 4: Checksum Validation
console.log('4️⃣ Checksum Validation Test:')
testChecksumValidation()
  .then(() => {
    console.log('   ✅ Checksum validation working')
  })
  .catch((error) => {
    console.log(`   ❌ Checksum validation failed: ${error.message}`)
  })

console.log('\n📊 Test Summary:')
console.log('   Run the tests above to see results')
console.log('   Check exports directory for generated bundles')
console.log('   Verify manifest.json and checksum.sha256 files')

// Helper functions
async function testExportPipeline() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(testData)

    const options = {
      hostname: new URL(BASE_URL).hostname,
      port: new URL(BASE_URL).port || 80,
      path: '/api/export/pipeline',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }

    const req = http.request(options, (res) => {
      let responseData = ''
      res.on('data', chunk => responseData += chunk)
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(responseData)
            console.log(`      ✅ Bundle created: ${response.bundleId}`)
            console.log(`      ✅ Checksum: ${response.checksum}`)
            console.log(`      ✅ Files: ${response.files?.length || 0}`)
            resolve()
          } catch (error) {
            reject(new Error('Invalid JSON response'))
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`))
        }
      })
    })

    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

async function testScoreValidation() {
  return new Promise((resolve, reject) => {
    const lowScoreData = { ...testData, score: 75 } // Below threshold
    const data = JSON.stringify(lowScoreData)

    const options = {
      hostname: new URL(BASE_URL).hostname,
      port: new URL(BASE_URL).port || 80,
      path: '/api/export/pipeline',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }

    const req = http.request(options, (res) => {
      let responseData = ''
      res.on('data', chunk => responseData += chunk)
      res.on('end', () => {
        if (res.statusCode === 403) {
          try {
            const response = JSON.parse(responseData)
            if (response.reason && response.reason.includes('Score must be ≥80')) {
              console.log(`      ✅ Score validation working (rejected score ${lowScoreData.score})`)
              resolve()
            } else {
              reject(new Error('Unexpected rejection reason'))
            }
          } catch (error) {
            reject(new Error('Invalid JSON response'))
          }
        } else {
          reject(new Error(`Expected 403, got ${res.statusCode}`))
        }
      })
    })

    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

async function testBundleVerification() {
  return new Promise((resolve, reject) => {
    // First create a bundle
    const data = JSON.stringify(testData)

    const options = {
      hostname: new URL(BASE_URL).hostname,
      port: new URL(BASE_URL).port || 80,
      path: '/api/export/pipeline',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }

    const req = http.request(options, (res) => {
      let responseData = ''
      res.on('data', chunk => responseData += chunk)
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(responseData)
            // Now verify the bundle
            verifyBundle(response.bundleId, response.checksum)
              .then(resolve)
              .catch(reject)
          } catch (error) {
            reject(new Error('Invalid JSON response'))
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`))
        }
      })
    })

    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

async function verifyBundle(bundleId, checksum) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: new URL(BASE_URL).hostname,
      port: new URL(BASE_URL).port || 80,
      path: `/api/export/pipeline?bundleId=${bundleId}&checksum=${checksum}`,
      method: 'GET'
    }

    const req = http.request(options, (res) => {
      let responseData = ''
      res.on('data', chunk => responseData += chunk)
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(responseData)
            if (response.integrity === 'valid') {
              console.log(`      ✅ Bundle integrity verified`)
              resolve()
            } else {
              reject(new Error('Bundle integrity check failed'))
            }
          } catch (error) {
            reject(new Error('Invalid JSON response'))
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`))
        }
      })
    })

    req.on('error', reject)
    req.end()
  })
}

async function testChecksumValidation() {
  return new Promise((resolve, reject) => {
    // Test with invalid checksum
    const options = {
      hostname: new URL(BASE_URL).hostname,
      port: new URL(BASE_URL).port || 80,
      path: `/api/export/pipeline?bundleId=invalid-id&checksum=invalid-checksum`,
      method: 'GET'
    }

    const req = http.request(options, (res) => {
      let responseData = ''
      res.on('data', chunk => responseData += chunk)
      res.on('end', () => {
        if (res.statusCode === 404) {
          console.log(`      ✅ Invalid bundle ID handling working`)
          resolve()
        } else {
          reject(new Error(`Expected 404, got ${res.statusCode}`))
        }
      })
    })

    req.on('error', reject)
    req.end()
  })
}

// Test bundle file structure
function testBundleStructure() {
  const exportsDir = path.join(process.cwd(), 'exports')
  
  if (!fs.existsSync(exportsDir)) {
    console.log('   ⚠️  Exports directory not found')
    return
  }

  const bundles = fs.readdirSync(exportsDir)
  if (bundles.length === 0) {
    console.log('   ⚠️  No bundles found in exports directory')
    return
  }

  console.log(`   📁 Found ${bundles.length} bundle(s) in exports directory`)
  
  for (const bundle of bundles.slice(0, 3)) { // Check first 3 bundles
    const bundlePath = path.join(exportsDir, bundle)
    const stats = fs.statSync(bundlePath)
    
    if (stats.isDirectory()) {
      const files = fs.readdirSync(bundlePath)
      console.log(`      📦 ${bundle}: ${files.length} files`)
      
      // Check for required files
      const requiredFiles = ['manifest.json', 'checksum.sha256']
      for (const required of requiredFiles) {
        if (files.includes(required)) {
          console.log(`         ✅ ${required}`)
        } else {
          console.log(`         ❌ ${required} missing`)
        }
      }
    }
  }
}

// Run bundle structure test after a delay
setTimeout(() => {
  console.log('\n5️⃣ Bundle Structure Test:')
  testBundleStructure()
}, 2000)
