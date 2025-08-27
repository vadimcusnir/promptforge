#!/usr/bin/env node

/**
 * Create Stripe Products and Prices for PromptForge v3
 * Creates: Pilot (free), Pro (49€/month, 490€/year), Enterprise (299€/month, 2990€/year, 5 seats)
 */

const Stripe = require('stripe')
const fs = require('fs')
const path = require('path')

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil'
})

// Product definitions
const products = [
  {
    name: 'PromptForge Pilot',
    description: 'Free tier for getting started with PromptForge',
    plan_code: 'pilot',
    prices: [
      {
        amount: 0,
        currency: 'eur',
        interval: 'month',
        type: 'recurring'
      }
    ]
  },
  {
    name: 'PromptForge Pro',
    description: 'Professional plan with advanced features',
    plan_code: 'pro',
    prices: [
      {
        amount: 4900, // 49.00 EUR in cents
        currency: 'eur',
        interval: 'month',
        type: 'recurring'
      },
      {
        amount: 49000, // 490.00 EUR in cents
        currency: 'eur',
        interval: 'year',
        type: 'recurring'
      }
    ]
  },
  {
    name: 'PromptForge Enterprise',
    description: 'Enterprise plan with full features and 5 seats included',
    plan_code: 'enterprise',
    prices: [
      {
        amount: 29900, // 299.00 EUR in cents
        currency: 'eur',
        interval: 'month',
        type: 'recurring'
      },
      {
        amount: 299000, // 2990.00 EUR in cents
        currency: 'eur',
        interval: 'year',
        type: 'recurring'
      }
    ],
    metadata: {
      seats_included: '5',
      features: 'api,white_label,bundle_export,advanced_analytics'
    }
  }
]

async function createStripeProducts() {
  console.log('🚀 Creating Stripe Products and Prices for PromptForge v3...\n')
  
  const stripeProducts = []
  
  try {
    for (const productDef of products) {
      console.log(`📦 Creating product: ${productDef.name}`)
      
      // Create product
      const product = await stripe.products.create({
        name: productDef.name,
        description: productDef.description,
        metadata: {
          plan_code: productDef.plan_code,
          ...productDef.metadata
        }
      })
      
      console.log(`   ✅ Product created: ${product.id}`)
      
      // Create prices for this product
      const prices = []
      for (const priceDef of productDef.prices) {
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: priceDef.amount,
          currency: priceDef.currency,
          recurring: {
            interval: priceDef.interval
          },
          metadata: {
            plan_code: productDef.plan_code,
            interval: priceDef.interval,
            amount_eur: (priceDef.amount / 100).toFixed(2)
          }
        })
        
        console.log(`   💰 Price created: ${price.id} (${priceDef.amount / 100}€/${priceDef.interval})`)
        prices.push(price)
      }
      
      stripeProducts.push({
        product,
        prices,
        metadata: {
          plan_code: productDef.plan_code
        }
      })
      
      console.log(`   ✨ Product ${productDef.name} completed\n`)
    }
    
    // Generate seed file
    await generateSeedFile(stripeProducts)
    
    console.log('🎯 All Stripe products and prices created successfully!')
    console.log('📁 Check stripe_products_seed.json for the complete configuration')
    
  } catch (error) {
    console.error('❌ Error creating Stripe products:', error.message)
    process.exit(1)
  }
}

async function generateSeedFile(stripeProducts) {
  const seedData = {
    created_at: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    products: stripeProducts.map(({ product, prices, metadata }) => ({
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        metadata: product.metadata
      },
      prices: prices.map(price => ({
        id: price.id,
        unit_amount: price.unit_amount,
        currency: price.currency,
        recurring: price.recurring,
        metadata: price.metadata
      })),
      metadata
    }))
  }
  
  const seedPath = path.join(__dirname, '../stripe_products_seed.json')
  fs.writeFileSync(seedPath, JSON.stringify(seedData, null, 2))
  
  console.log(`📄 Seed file generated: ${seedPath}`)
}

// Run if called directly
if (require.main === module) {
  // Check environment variables
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY environment variable is required')
    process.exit(1)
  }
  
  createStripeProducts().catch(console.error)
}

module.exports = { createStripeProducts }
