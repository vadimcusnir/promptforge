#!/usr/bin/env node

/**
 * Quick Setup Script for PromptForge v3 Billing System
 * Sets up missing environment variables with default values
 */

const fs = require('fs')
const path = require('path')

console.log('⚡ PROMPTFORGE v3 - QUICK SETUP\n')

// Default configuration values
const defaultConfig = {
  SUPABASE_URL: 'https://your-project-id.supabase.co',
  NEXT_PUBLIC_BASE_URL: 'http://localhost:3000',
  STRIPE_PORTAL_CONFIGURATION_ID: 'bpc_test_portal_config_id_here',
  SENDGRID_API_KEY: '[EXAMPLE_SENDGRID_KEY_SG.your_sendgrid_api_key_here]',
  DEBUG: 'stripe:*,billing:*,webhook:*'
}

// Read current .env.local
function readEnvFile() {
  const envPath = path.join(__dirname, '../.env.local')
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found')
    console.log('   Run: pnpm run setup:billing')
    return null
  }
  
  return fs.readFileSync(envPath, 'utf8')
}

// Add missing variables
function addMissingVariables(envContent) {
  console.log('🔧 Adding missing environment variables...\n')
  
  let updated = false
  
  for (const [varName, defaultValue] of Object.entries(defaultConfig)) {
    if (!envContent.includes(`${varName}=`)) {
      console.log(`   ➕ Adding ${varName}=${defaultValue}`)
      envContent += `\n# ${varName} (configure with your actual value)\n${varName}=${defaultValue}`
      updated = true
    } else {
      console.log(`   ✅ ${varName} already configured`)
    }
  }
  
  if (updated) {
    // Add timestamp
    envContent += `\n\n# Quick setup completed on: ${new Date().toISOString()}\n`
  }
  
  return { content: envContent, updated }
}

// Write updated .env.local
function writeEnvFile(content) {
  const envPath = path.join(__dirname, '../.env.local')
  fs.writeFileSync(envPath, content)
  console.log(`\n✅ Updated .env.local file`)
}

// Main function
function runQuickSetup() {
  try {
    // Read current environment file
    const envContent = readEnvFile()
    if (!envContent) {
      return
    }
    
    // Add missing variables
    const { content: updatedContent, updated } = addMissingVariables(envContent)
    
    if (updated) {
      // Write updated file
      writeEnvFile(updatedContent)
      
      console.log('\n🎯 Quick setup completed!')
      console.log('\n📋 Next steps:')
      console.log('1. Edit .env.local and replace placeholder values with your actual configuration')
      console.log('2. Run: pnpm run check:config (to verify configuration)')
      console.log('3. Run: pnpm run setup:stripe (to create Stripe products)')
      console.log('4. Run: pnpm run migrate (to apply database schema)')
      
    } else {
      console.log('\n✅ All environment variables are already configured!')
      console.log('\n📋 Next steps:')
      console.log('1. Run: pnpm run check:config (to verify configuration)')
      console.log('2. Run: pnpm run setup:stripe (to create Stripe products)')
      console.log('3. Run: pnpm run migrate (to apply database schema)')
    }
    
  } catch (error) {
    console.error('\n💥 Quick setup failed:', error.message)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  runQuickSetup()
}

module.exports = { runQuickSetup }
