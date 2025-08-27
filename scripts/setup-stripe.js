#!/usr/bin/env node

/**
 * Stripe Setup Script for PromptForge v3
 * 
 * This script automatically creates:
 * - Products for each plan (Creator, Pro, Enterprise)
 * - Prices for monthly and annual billing
 * - Webhook endpoint configuration
 * 
 * Usage:
 * 1. Set your Stripe secret key: export STRIPE_SECRET_KEY=sk_test_...
 * 2. Run: node scripts/setup-stripe.js
 */

const Stripe = require('stripe');

// Configuration
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY environment variable is required');
  console.log('Set it with: export STRIPE_SECRET_KEY=sk_test_...');
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
});

// Plan configurations
const PLANS = {
  creator: {
    name: 'Creator Plan',
    description: 'Perfect for creators and individual users',
    monthly_price: 1900, // $19.00
    annual_price: 19000, // $190.00
    features: [
      'Access to 50+ AI modules',
      'Basic prompt templates',
      'Export to TXT format',
      'Community support',
      '5 projects per month'
    ]
  },
  pro: {
    name: 'Pro Plan',
    description: 'Advanced features for professionals and teams',
    monthly_price: 4900, // $49.00
    annual_price: 49000, // $490.00
    features: [
      'Access to 200+ AI modules',
      'Advanced prompt engineering',
      'Export to PDF, JSON, TXT',
      'Priority support',
      'Unlimited projects',
      'Team collaboration',
      'API access (1000 calls/month)'
    ]
  },
  enterprise: {
    name: 'Enterprise Plan',
    description: 'Enterprise-grade solution for large organizations',
    monthly_price: 29900, // $299.00
    annual_price: 299000, // $2,990.00
    features: [
      'Access to all AI modules',
      'Custom module development',
      'Export to all formats',
      'Dedicated support',
      'Unlimited everything',
      'Advanced analytics',
      'Custom integrations',
      'SLA guarantees',
      'On-premise deployment option'
    ]
  }
};

async function createProducts() {
  console.log('🚀 Creating Stripe products and prices...\n');
  
  const results = {};
  
  for (const [planKey, plan] of Object.entries(PLANS)) {
    try {
      console.log(`📦 Creating ${plan.name}...`);
      
      // Create product
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: {
          plan_type: planKey,
          features: plan.features.join('|'),
          promptforge_version: 'v3'
        }
      });
      
      console.log(`   ✅ Product created: ${product.id}`);
      
      // Create monthly price
      const monthlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.monthly_price,
        currency: 'usd',
        recurring: {
          interval: 'month'
        },
        metadata: {
          plan_type: planKey,
          billing_interval: 'monthly',
          promptforge_version: 'v3'
        }
      });
      
      console.log(`   ✅ Monthly price created: ${monthlyPrice.id} ($${(plan.monthly_price / 100).toFixed(2)})`);
      
      // Create annual price
      const annualPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.annual_price,
        currency: 'usd',
        recurring: {
          interval: 'year'
        },
        metadata: {
          plan_type: planKey,
          billing_interval: 'annual',
          promptforge_version: 'v3'
        }
      });
      
      console.log(`   ✅ Annual price created: ${annualPrice.id} ($${(plan.annual_price / 100).toFixed(2)})`);
      
      results[planKey] = {
        product_id: product.id,
        monthly_price_id: monthlyPrice.id,
        annual_price_id: annualPrice.id
      };
      
      console.log(`   🎯 ${plan.name} setup complete!\n`);
      
    } catch (error) {
      console.error(`   ❌ Error creating ${plan.name}:`, error.message);
    }
  }
  
  return results;
}

async function createWebhook() {
  console.log('🔗 Setting up webhook endpoint...\n');
  
  try {
    // List existing webhooks
    const existingWebhooks = await stripe.webhookEndpoints.list();
    
    // Check if our webhook already exists
    const promptforgeWebhook = existingWebhooks.data.find(
      webhook => webhook.url.includes('/api/webhooks/stripe')
    );
    
    if (promptforgeWebhook) {
      console.log(`   ✅ Webhook already exists: ${promptforgeWebhook.id}`);
      console.log(`   📍 URL: ${promptforgeWebhook.url}`);
      console.log(`   🔑 Secret: ${promptforgeWebhook.secret}`);
      return promptforgeWebhook;
    }
    
    // Create new webhook
    const webhook = await stripe.webhookEndpoints.create({
      url: 'https://yourdomain.com/api/webhooks/stripe', // Update this with your actual domain
      enabled_events: [
        'checkout.session.completed',
        'invoice.payment_succeeded',
        'invoice.payment_failed',
        'customer.subscription.updated',
        'customer.subscription.deleted',
        'customer.subscription.created',
        'customer.subscription.trial_will_end',
        'payment_method.attached',
        'payment_method.detached'
      ],
      metadata: {
        promptforge_version: 'v3',
        environment: 'production'
      }
    });
    
    console.log(`   ✅ Webhook created: ${webhook.id}`);
    console.log(`   📍 URL: ${webhook.url}`);
    console.log(`   🔑 Secret: ${webhook.secret}`);
    console.log(`   📋 Events: ${webhook.enabled_events.length} events enabled`);
    
    return webhook;
    
  } catch (error) {
    console.error('   ❌ Error creating webhook:', error.message);
    return null;
  }
}

async function generateEnvironmentFile(results) {
  console.log('📝 Generating environment configuration...\n');
  
  const envContent = `# Stripe Product & Price IDs (auto-generated)
# Generated on: ${new Date().toISOString()}

# Creator Plan
STRIPE_CREATOR_MONTHLY_PRICE_ID=${results.creator?.monthly_price_id || 'NOT_CREATED'}
STRIPE_CREATOR_ANNUAL_PRICE_ID=${results.creator?.annual_price_id || 'NOT_CREATED'}

# Pro Plan
STRIPE_PRO_MONTHLY_PRICE_ID=${results.pro?.monthly_price_id || 'NOT_CREATED'}
STRIPE_PRO_ANNUAL_PRICE_ID=${results.pro?.annual_price_id || 'NOT_CREATED'}

# Enterprise Plan
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=${results.enterprise?.monthly_price_id || 'NOT_CREATED'}
STRIPE_ENTERPRISE_ANNUAL_PRICE_ID=${results.enterprise?.annual_price_id || 'NOT_CREATED'}

# Webhook Configuration
STRIPE_WEBHOOK_SECRET=${webhook?.secret || 'NOT_CREATED'}
STRIPE_WEBHOOK_ENDPOINT_ID=${webhook?.id || 'NOT_CREATED'}
`;

  console.log('📄 Environment configuration:');
  console.log(envContent);
  
  // Save to file
  const fs = require('fs');
  fs.writeFileSync('stripe-config.env', envContent);
  console.log('   💾 Configuration saved to stripe-config.env');
  
  return envContent;
}

async function main() {
  console.log('🎯 PromptForge v3 - Stripe Setup Script\n');
  console.log('This script will set up your Stripe products, prices, and webhooks.\n');
  
  try {
    // Test Stripe connection
    console.log('🔌 Testing Stripe connection...');
    const account = await stripe.accounts.retrieve();
    console.log(`   ✅ Connected to Stripe account: ${account.business_profile?.name || account.id}\n`);
    
    // Create products and prices
    const results = await createProducts();
    
    // Create webhook
    const webhook = await createWebhook();
    
    // Generate environment file
    await generateEnvironmentFile(results);
    
    console.log('\n🎉 Stripe setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Copy the generated IDs to your .env.local file');
    console.log('2. Update the webhook URL with your actual domain');
    console.log('3. Test the webhook endpoint');
    console.log('4. Run your application and test checkout flow');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { createProducts, createWebhook, generateEnvironmentFile };
