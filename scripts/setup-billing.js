#!/usr/bin/env node

/**
 * Automated Billing System Setup for PromptForge v3
 * This script configures the complete billing system
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const readline = require('readline')

console.log('🚀 PROMPTFORGE v3 - AUTOMATED BILLING SYSTEM SETUP\n')

// Configuration questions
const questions = [
  {
    name: 'stripeSecretKey',
    message: 'Enter your Stripe Secret Key (sk_test_... or sk_live_...):',
    validate: (input) => input.startsWith('sk_') ? true : 'Must start with sk_'
  },
  {
    name: 'stripeWebhookSecret',
    message: 'Enter your Stripe Webhook Secret (whsec_...):',
    validate: (input) => input.startsWith('whsec_') ? true : 'Must start with whsec_'
  },
  {
    name: 'stripePublishableKey',
    message: 'Enter your Stripe Publishable Key (pk_test_... or pk_live_...):',
    validate: (input) => input.startsWith('pk_') ? true : 'Must start with pk_'
  },
  {
    name: 'supabaseUrl',
    message: 'Enter your Supabase Project URL (https://...):',
    validate: (input) => input.startsWith('https://') ? true : 'Must be a valid HTTPS URL'
  },
  {
    name: 'supabaseServiceRoleKey',
    message: 'Enter your Supabase Service Role Key:',
    validate: (input) => input.length > 0 ? true : 'Service role key is required'
  },
  {
    name: 'supabaseAnonKey',
    message: 'Enter your Supabase Anon Key:',
    validate: (input) => input.length > 0 ? true : 'Anon key is required'
  },
  {
    name: 'baseUrl',
    message: 'Enter your application base URL (http://localhost:3000 for dev):',
    default: 'http://localhost:3000'
  },
  {
    name: 'environment',
    message: 'Select environment:',
    choices: ['development', 'staging', 'production'],
    default: 'development'
  }
]

// Interactive prompt function
async function promptUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    if (question.choices) {
      console.log(`\n${question.message}`)
      question.choices.forEach((choice, index) => {
        console.log(`${index + 1}. ${choice}`)
      })
      
      rl.question(`Select (1-${question.choices.length}) [${question.default}]: `, (answer) => {
        rl.close()
        const selection = answer.trim()
        if (selection === '') {
          resolve(question.default)
        } else {
          const index = parseInt(selection) - 1
          resolve(question.choices[index])
        }
      })
    } else {
      rl.question(`${question.message} ${question.default ? `[${question.default}]: ` : ': '}`, (answer) => {
        rl.close()
        const value = answer.trim() || question.default || ''
        
        if (question.validate) {
          const validation = question.validate(value)
          if (validation !== true) {
            console.log(`❌ ${validation}`)
            return promptUser(question)
          }
        }
        
        resolve(value)
      })
    }
  })
}

// Generate environment file
function generateEnvFile(config) {
  const envContent = `# 🚀 PROMPTFORGE v3 - AUTO-GENERATED ENVIRONMENT

# =============================================================================
# STRIPE CONFIGURATION
# =============================================================================

# Stripe Secret Key
STRIPE_SECRET_KEY=${config.stripeSecretKey}

# Stripe Webhook Secret
STRIPE_WEBHOOK_SECRET=${config.stripeWebhookSecret}

# Stripe Publishable Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${config.stripePublishableKey}

# =============================================================================
# SUPABASE CONFIGURATION
# =============================================================================

# Supabase Project URL
SUPABASE_URL=${config.supabaseUrl}

# Supabase Service Role Key
SUPABASE_SERVICE_ROLE_KEY=${config.supabaseServiceRoleKey}

# Supabase Anon Key
NEXT_PUBLIC_SUPABASE_ANON_KEY=${config.supabaseAnonKey}

# =============================================================================
# APPLICATION CONFIGURATION
# =============================================================================

# Base URL
NEXT_PUBLIC_BASE_URL=${config.baseUrl}

# Environment
NODE_ENV=${config.environment}

# =============================================================================
# DEVELOPMENT & DEBUGGING
# =============================================================================

# Debug mode
DEBUG=stripe:*,billing:*,webhook:*

# Log level
LOG_LEVEL=info

# =============================================================================
# GENERATED ON: ${new Date().toISOString()}
# =============================================================================
`

  const envPath = path.join(__dirname, '../.env.local')
  fs.writeFileSync(envPath, envContent)
  
  console.log(`✅ Environment file generated: ${envPath}`)
  return envPath
}

// Setup Stripe products
async function setupStripeProducts() {
  console.log('\n🔧 Setting up Stripe products and prices...')
  
  try {
    // Check if .env.local exists
    if (!fs.existsSync(path.join(__dirname, '../.env.local'))) {
      throw new Error('.env.local file not found. Please run the setup first.')
    }
    
    // Run the Stripe products creation script
    execSync('node scripts/create-stripe-products.js', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    })
    
    console.log('✅ Stripe products setup completed')
    return true
  } catch (error) {
    console.error('❌ Error setting up Stripe products:', error.message)
    return false
  }
}

// Setup database
async function setupDatabase() {
  console.log('\n🗄️  Setting up database...')
  
  try {
    // Run database migration
    execSync('pnpm run migrate', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    })
    
    console.log('✅ Database setup completed')
    return true
  } catch (error) {
    console.error('❌ Error setting up database:', error.message)
    return false
  }
}

// Test configuration
async function testConfiguration() {
  console.log('\n🧪 Testing configuration...')
  
  try {
    // Test TypeScript compilation
    console.log('   Testing TypeScript compilation...')
    execSync('pnpm type-check', { 
      stdio: 'pipe',
      cwd: path.join(__dirname, '..')
    })
    console.log('   ✅ TypeScript compilation successful')
    
    // Test build
    console.log('   Testing production build...')
    execSync('pnpm build', { 
      stdio: 'pipe',
      cwd: path.join(__dirname, '..')
    })
    console.log('   ✅ Production build successful')
    
    console.log('✅ Configuration test completed')
    return true
  } catch (error) {
    console.error('❌ Configuration test failed:', error.message)
    return false
  }
}

// Main setup function
async function runSetup() {
  try {
    console.log('🎯 Starting automated billing system setup...\n')
    
    // Collect configuration
    const config = {}
    for (const question of questions) {
      config[question.name] = await promptUser(question)
    }
    
    console.log('\n📝 Configuration collected successfully!')
    
    // Generate environment file
    const envPath = generateEnvFile(config)
    
    // Setup Stripe products
    const stripeSuccess = await setupStripeProducts()
    
    // Setup database
    const dbSuccess = await setupDatabase()
    
    // Test configuration
    const testSuccess = await testConfiguration()
    
    // Final summary
    console.log('\n' + '='.repeat(60))
    console.log('🎯 SETUP SUMMARY')
    console.log('='.repeat(60))
    console.log(`✅ Environment file: ${stripeSuccess ? 'GENERATED' : 'FAILED'}`)
    console.log(`✅ Stripe products: ${stripeSuccess ? 'SETUP' : 'FAILED'}`)
    console.log(`✅ Database: ${dbSuccess ? 'SETUP' : 'FAILED'}`)
    console.log(`✅ Configuration test: ${testSuccess ? 'PASSED' : 'FAILED'}`)
    
    if (stripeSuccess && dbSuccess && testSuccess) {
      console.log('\n🏆 BILLING SYSTEM SETUP COMPLETED SUCCESSFULLY!')
      console.log('🚀 PromptForge v3 is ready for production!')
      
      console.log('\n📋 Next steps:')
      console.log('1. Configure webhook endpoint in Stripe Dashboard')
      console.log('2. Test all API endpoints')
      console.log('3. Deploy to production')
      
    } else {
      console.log('\n⚠️  Setup completed with issues')
      console.log('🔧 Please review and fix the failed steps')
    }
    
  } catch (error) {
    console.error('\n💥 Setup failed:', error.message)
    process.exit(1)
  }
}

// Run setup if called directly
if (require.main === module) {
  runSetup().catch(console.error)
}

module.exports = { runSetup }
