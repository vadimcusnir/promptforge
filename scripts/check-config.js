#!/usr/bin/env node

/**
 * Configuration Check Script for PromptForge v3 Billing System
 * Verifies all required environment variables and configurations
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 PROMPTFORGE v3 - CONFIGURATION CHECK\n')

// Required environment variables
const requiredVars = {
  // Stripe Configuration
  STRIPE_SECRET_KEY: {
    required: true,
    pattern: /^sk_(test|live)_/,
    description: 'Stripe Secret Key (starts with sk_test_ or sk_live_)'
  },
  STRIPE_WEBHOOK_SECRET: {
    required: true,
    pattern: /^whsec_/,
    description: 'Stripe Webhook Secret (starts with whsec_)'
  },
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {
    required: true,
    pattern: /^pk_(test|live)_/,
    description: 'Stripe Publishable Key (starts with pk_test_ or pk_live_)'
  },
  
  // Supabase Configuration
  SUPABASE_URL: {
    required: true,
    pattern: /^https:\/\/.*\.supabase\.co$/,
    description: 'Supabase Project URL (https://project-id.supabase.co)'
  },
  SUPABASE_SERVICE_ROLE_KEY: {
    required: true,
    pattern: /^eyJ/,
    description: 'Supabase Service Role Key (JWT token)'
  },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: {
    required: true,
    pattern: /^eyJ/,
    description: 'Supabase Anon Key (JWT token)'
  },
  
  // Application Configuration
  NEXT_PUBLIC_BASE_URL: {
    required: true,
    pattern: /^https?:\/\/.+/,
    description: 'Application Base URL'
  },
  NODE_ENV: {
    required: true,
    pattern: /^(development|staging|production)$/,
    description: 'Node Environment'
  }
}

// Optional environment variables
const optionalVars = {
  STRIPE_PORTAL_CONFIGURATION_ID: {
    pattern: /^bpc_/,
    description: 'Stripe Portal Configuration ID (starts with bpc_)'
  },
  SENDGRID_API_KEY: {
    pattern: /^SG\./,
    description: 'SendGrid API Key (starts with SG.)'
  },
  DEBUG: {
    pattern: /.*/,
    description: 'Debug mode configuration'
  }
}

// Check environment file
function checkEnvFile() {
  console.log('📁 Checking environment configuration...')
  
  const envPath = path.join(__dirname, '../.env.local')
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found')
    console.log('   Run: pnpm run setup:billing')
    return false
  }
  
  console.log('✅ .env.local file found')
  
  // Read and parse .env.local
  const envContent = fs.readFileSync(envPath, 'utf8')
  const envVars = {}
  
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
      envVars[match[1]] = match[2]
    }
  })
  
  return envVars
}

// Validate environment variables
function validateEnvVars(envVars) {
  console.log('\n🔍 Validating environment variables...')
  
  let allValid = true
  const results = {
    required: { valid: 0, invalid: 0, missing: 0 },
    optional: { valid: 0, invalid: 0, missing: 0 }
  }
  
  // Check required variables
  console.log('\n📋 Required Variables:')
  for (const [varName, config] of Object.entries(requiredVars)) {
    const value = envVars[varName]
    
    if (!value) {
      console.log(`   ❌ ${varName}: MISSING`)
      results.required.missing++
      allValid = false
      continue
    }
    
    if (config.pattern && !config.pattern.test(value)) {
      console.log(`   ❌ ${varName}: INVALID FORMAT`)
      console.log(`      Expected: ${config.description}`)
      console.log(`      Got: ${value}`)
      results.required.invalid++
      allValid = false
    } else {
      console.log(`   ✅ ${varName}: VALID`)
      results.required.valid++
    }
  }
  
  // Check optional variables
  console.log('\n📋 Optional Variables:')
  for (const [varName, config] of Object.entries(optionalVars)) {
    const value = envVars[varName]
    
    if (!value) {
      console.log(`   ⚠️  ${varName}: NOT SET`)
      results.optional.missing++
      continue
    }
    
    if (config.pattern && !config.pattern.test(value)) {
      console.log(`   ❌ ${varName}: INVALID FORMAT`)
      console.log(`      Expected: ${config.description}`)
      console.log(`      Got: ${value}`)
      results.optional.invalid++
    } else {
      console.log(`   ✅ ${varName}: VALID`)
      results.optional.valid++
    }
  }
  
  return { allValid, results }
}

// Check file structure
function checkFileStructure() {
  console.log('\n📁 Checking file structure...')
  
  const requiredFiles = [
    'lib/billing/stripe.ts',
    'lib/billing/entitlements.ts',
    'app/api/webhooks/stripe/route.ts',
    'app/api/billing/checkout/route.ts',
    'app/api/billing/portal/route.ts',
    'app/api/entitlements/route.ts',
    'supabase/migrations/[EXAMPLE_phone: [EXAMPLE_PHONE_[EXAMPLE_PHONE_555-123-4567]]_stripe_billing.sql',
    'scripts/create-stripe-products.js',
    'scripts/setup-billing.js'
  ]
  
  let allFilesExist = true
  
  for (const file of requiredFiles) {
    const filePath = path.join(__dirname, '..', file)
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${file}`)
    } else {
      console.log(`   ❌ ${file}`)
      allFilesExist = false
    }
  }
  
  return allFilesExist
}

// Check database migration
function checkDatabaseMigration() {
  console.log('\n🗄️  Checking database migration...')
  
  const migrationPath = path.join(__dirname, '../supabase/migrations/[EXAMPLE_phone: [EXAMPLE_PHONE_[EXAMPLE_PHONE_555-123-4567]]_stripe_billing.sql')
  
  if (!fs.existsSync(migrationPath)) {
    console.log('   ❌ Database migration file not found')
    return false
  }
  
  const migrationContent = fs.readFileSync(migrationPath, 'utf8')
  
  // Check for key components
  const checks = [
    { name: 'Subscriptions table', pattern: /CREATE TABLE.*subscriptions/ },
    { name: 'Entitlements table', pattern: /CREATE TABLE.*entitlements/ },
    { name: 'Webhook events table', pattern: /CREATE TABLE.*webhook_events/ },
    { name: 'pf_apply_plan_entitlements function', pattern: /CREATE.*FUNCTION.*pf_apply_plan_entitlements/ },
    { name: 'RLS policies', pattern: /CREATE POLICY/ },
    { name: 'Indexes', pattern: /CREATE INDEX/ }
  ]
  
  let allChecksPassed = true
  
  for (const check of checks) {
    if (check.pattern.test(migrationContent)) {
      console.log(`   ✅ ${check.name}`)
    } else {
      console.log(`   ❌ ${check.name}`)
      allChecksPassed = false
    }
  }
  
  return allChecksPassed
}

// Main check function
async function runConfigCheck() {
  try {
    // Check environment file
    const envVars = checkEnvFile()
    if (!envVars) {
      return
    }
    
    // Validate environment variables
    const validation = validateEnvVars(envVars)
    
    // Check file structure
    const filesExist = checkFileStructure()
    
    // Check database migration
    const migrationValid = checkDatabaseMigration()
    
    // Final summary
    console.log('\n' + '='.repeat(60))
    console.log('🎯 CONFIGURATION CHECK SUMMARY')
    console.log('='.repeat(60))
    
    console.log(`📋 Environment Variables:`)
    console.log(`   Required: ${validation.results.required.valid}/${validation.results.required.valid + validation.results.required.invalid + validation.results.required.missing} valid`)
    console.log(`   Optional: ${validation.results.optional.valid}/${validation.results.optional.valid + validation.results.optional.invalid} valid`)
    
    console.log(`📁 File Structure: ${filesExist ? 'COMPLETE' : 'INCOMPLETE'}`)
    console.log(`🗄️  Database Migration: ${migrationValid ? 'VALID' : 'INVALID'}`)
    
    if (validation.allValid && filesExist && migrationValid) {
      console.log('\n🏆 CONFIGURATION CHECK PASSED!')
      console.log('🚀 PromptForge v3 billing system is properly configured!')
      
      console.log('\n📋 Next steps:')
      console.log('1. Run: pnpm run setup:stripe (to create Stripe products)')
      console.log('2. Run: pnpm run migrate (to apply database schema)')
      console.log('3. Test the system with: pnpm run test:optimizations')
      
    } else {
      console.log('\n⚠️  CONFIGURATION CHECK FAILED')
      console.log('🔧 Please fix the issues above before proceeding')
      
      if (!validation.allValid) {
        console.log('\n💡 To fix environment variables:')
        console.log('   Run: pnpm run setup:billing')
      }
    }
    
  } catch (error) {
    console.error('\n💥 Configuration check failed:', error.message)
    process.exit(1)
  }
}

// Run check if called directly
if (require.main === module) {
  runConfigCheck().catch(console.error)
}

module.exports = { runConfigCheck }
