#!/usr/bin/env node

/**
 * Stripe Production Setup Script
 * Creates products and prices for PromptForge v3 with standardized naming
 */

const Stripe = require('stripe')

// Validate environment variables
function validateEnvironment() {
  const requiredVars = [
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
  ]

  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:')
    missing.forEach(varName => console.error(`   - ${varName}`))
    console.error('\nPlease set these variables in your .env.local file')
    process.exit(1)
  }

  if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')) {
    console.warn('⚠️  Warning: You are using a test key. For production, use sk_live_...')
  }
}

// Initialize Stripe
function initializeStripe() {
  try {
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil'
    })
  } catch (error) {
    console.error('❌ Failed to initialize Stripe:', error.message)
    process.exit(1)
  }
}

// Plan configuration
const PLANS = {
  pilot: {
    name: 'PromptForge Pilot',
    description: 'Free tier for getting started with prompt engineering',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      'Modules M01, M10, M18',
      'Export txt, md',
      'Local history',
      'Community support'
    ]
  },
  pro: {
    name: 'PromptForge Pro',
    description: 'Professional plan with advanced features for teams',
    monthlyPrice: 4900, // $49.00 in cents
    annualPrice: 49000, // $490.00 in cents
    features: [
      'All modules (M01-M50)',
      'Export txt, md, pdf, json',
      'Live Test Engine',
      'Cloud history',
      'Advanced analytics',
      'Priority support'
    ]
  },
  enterprise: {
    name: 'PromptForge Enterprise',
    description: 'Enterprise plan with full features and 5 seats included',
    monthlyPrice: 29900, // $299.00 in cents
    annualPrice: 299000, // $2990.00 in cents
    features: [
      'Everything in Pro',
      'API access',
      'Bundle.zip exports',
      'White-label options',
      '5 seats included',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee'
    ]
  }
}

// Create or update product
async function createOrUpdateProduct(stripe, planId, planConfig) {
  try {
    console.log(`📦 Creating/updating product for ${planId}...`)
    
    // Check if product already exists
    const existingProducts = await stripe.products.list({
      active: true,
      limit: 100
    })
    
    const existingProduct = existingProducts.data.find(
      product => product.metadata?.plan_code === planId
    )
    
    let product
    if (existingProduct) {
      console.log(`   ✅ Product already exists: ${existingProduct.id}`)
      product = existingProduct
    } else {
      product = await stripe.products.create({
        name: planConfig.name,
        description: planConfig.description,
        metadata: {
          plan_code: planId,
          features: JSON.stringify(planConfig.features)
        }
      })
      console.log(`   ✅ Created product: ${product.id}`)
    }
    
    return product
  } catch (error) {
    console.error(`   ❌ Failed to create/update product for ${planId}:`, error.message)
    throw error
  }
}

// Create or update price
async function createOrUpdatePrice(stripe, product, planId, amount, interval) {
  try {
    console.log(`   💰 Creating/updating ${interval} price for ${planId}...`)
    
    // Check if price already exists
    const existingPrices = await stripe.prices.list({
      product: product.id,
      active: true,
      limit: 100
    })
    
    const existingPrice = existingPrices.data.find(
      price => price.recurring?.interval === interval
    )
    
    let price
    if (existingPrice) {
      console.log(`     ✅ Price already exists: ${existingPrice.id}`)
      price = existingPrice
    } else {
      const priceData = {
        product: product.id,
        unit_amount: amount,
        currency: 'usd',
        recurring: {
          interval: interval
        },
        metadata: {
          plan_code: planId,
          billing_interval: interval
        }
      }
      
      // For free plans, don't set recurring
      if (amount === 0) {
        delete priceData.recurring
        priceData.unit_amount = 0
      }
      
      price = await stripe.prices.create(priceData)
      console.log(`     ✅ Created price: ${price.id}`)
    }
    
    return price
  } catch (error) {
    console.error(`     ❌ Failed to create/update price for ${planId} ${interval}:`, error.message)
    throw error
  }
}

// Generate environment variables output
function generateEnvOutput(products, prices) {
  console.log('\n📋 Environment Variables to add to your .env.local:')
  console.log('=' * 60)
  
  Object.keys(PLANS).forEach(planId => {
    const product = products[planId]
    const monthlyPrice = prices[planId]?.monthly
    const annualPrice = prices[planId]?.annual
    
    console.log(`# ${PLANS[planId].name}`)
    console.log(`STRIPE_PRODUCT_${planId.toUpperCase()}=${product.id}`)
    if (monthlyPrice) {
      console.log(`STRIPE_${planId.toUpperCase()}_MONTHLY_PRICE_ID=${monthlyPrice.id}`)
    }
    if (annualPrice) {
      console.log(`STRIPE_${planId.toUpperCase()}_ANNUAL_PRICE_ID=${annualPrice.id}`)
    }
    console.log('')
  })
}

// Main setup function
async function setupStripe() {
  console.log('🚀 PromptForge v3 - Stripe Production Setup')
  console.log('=' * 50)
  
  // Validate environment
  validateEnvironment()
  
  // Initialize Stripe
  const stripe = initializeStripe()
  
  const products = {}
  const prices = {}
  
  try {
    // Create products and prices for each plan
    for (const [planId, planConfig] of Object.entries(PLANS)) {
      console.log(`\n📦 Setting up ${planId} plan...`)
      
      // Create product
      const product = await createOrUpdateProduct(stripe, planId, planConfig)
      products[planId] = product
      
      // Create prices
      prices[planId] = {}
      
      if (planConfig.monthlyPrice > 0) {
        const monthlyPrice = await createOrUpdatePrice(
          stripe, 
          product, 
          planId, 
          planConfig.monthlyPrice, 
          'month'
        )
        prices[planId].monthly = monthlyPrice
      }
      
      if (planConfig.annualPrice > 0) {
        const annualPrice = await createOrUpdatePrice(
          stripe, 
          product, 
          planId, 
          planConfig.annualPrice, 
          'year'
        )
        prices[planId].annual = annualPrice
      }
    }
    
    // Generate environment variables
    generateEnvOutput(products, prices)
    
    console.log('\n✅ Stripe setup completed successfully!')
    console.log('\n📝 Next steps:')
    console.log('1. Copy the environment variables above to your .env.local file')
    console.log('2. Update your webhook endpoint in Stripe Dashboard')
    console.log('3. Test the payment flow in your application')
    console.log('4. Run the database migration: pnpm run migrate')
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message)
    process.exit(1)
  }
}

// Run setup if called directly
if (require.main === module) {
  setupStripe().catch(error => {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  })
}

module.exports = { setupStripe, PLANS }
