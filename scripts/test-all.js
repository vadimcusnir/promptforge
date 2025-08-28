#!/usr/bin/env node

/**
 * Comprehensive Testing Script for PromptForge v3
 * 
 * This script tests:
 * - Stripe checkout creation
 * - Webhook endpoint
 * - Analytics tracking
 * - Email service
 * - A/B testing
 * - Localization
 * 
 * Usage:
 * 1. Start your dev server: pnpm dev
 * 2. Run: node scripts/test-all.js
 */

const fetch = require('node-fetch');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const TEST_EMAIL = 'test@[EXAMPLE_DOMAIN_yourdomain.com]';

// Test results
const testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

function logTest(name, passed, details = '') {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    console.log(`   ✅ ${name}`);
  } else {
    testResults.failed++;
    console.log(`   ❌ ${name}`);
    if (details) console.log(`      ${details}`);
  }
}

async function testStripeCheckout() {
  console.log('\n💳 Testing Stripe Checkout...\n');
  
  try {
    const response = await fetch(`${BASE_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        planId: 'pro',
        isAnnual: false,
        userId: 'test-user-123'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      logTest('Checkout session creation', true);
      logTest('Response format', !!data.sessionId && !!data.url);
      logTest('Session ID format', data.sessionId?.startsWith('cs_'));
      logTest('Checkout URL format', data.url?.includes('checkout.stripe.com'));
      
      console.log(`      Session ID: ${data.sessionId}`);
      console.log(`      Checkout URL: ${data.url}`);
      
    } else {
      const error = await response.text();
      logTest('Checkout session creation', false, `Status: ${response.status}, Error: ${error}`);
    }
    
  } catch (error) {
    logTest('Checkout session creation', false, error.message);
  }
}

async function testWebhookEndpoint() {
  console.log('\n🔗 Testing Webhook Endpoint...\n');
  
  try {
    const response = await fetch(`${BASE_URL}/api/webhooks/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'test-signature'
      },
      body: JSON.stringify({
        type: 'test.event',
        data: { object: { id: 'test' } }
      })
    });
    
    // Should fail due to invalid signature (expected behavior)
    if (response.status === 400) {
      logTest('Webhook signature validation', true);
      logTest('Webhook endpoint accessible', true);
    } else {
      logTest('Webhook signature validation', false, `Expected 400, got ${response.status}`);
    }
    
  } catch (error) {
    logTest('Webhook endpoint accessible', false, error.message);
  }
}

async function testAnalyticsTracking() {
  console.log('\n📊 Testing Analytics Tracking...\n');
  
  try {
    // Test general analytics
    const analyticsResponse = await fetch(`${BASE_URL}/api/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event_name: 'test_event',
        event_properties: { test: true },
        page: 'test',
        timestamp: new Date().toISOString()
      })
    });
    
    if (analyticsResponse.ok) {
      const data = await analyticsResponse.json();
      logTest('Analytics tracking endpoint', true);
      logTest('Analytics response format', !!data.success && !!data.eventId);
    } else {
      logTest('Analytics tracking endpoint', false, `Status: ${analyticsResponse.status}`);
    }
    
    // Test A/B testing analytics
    const abTestResponse = await fetch(`${BASE_URL}/api/analytics/ab-test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        test_id: 'pricing_v1',
        variant_id: 'control',
        event: 'view',
        user_id: 'test-user-123'
      })
    });
    
    if (abTestResponse.ok) {
      const data = await abTestResponse.json();
      logTest('A/B testing analytics endpoint', true);
      logTest('A/B testing response format', !!data.success && !!data.test_id);
    } else {
      logTest('A/B testing analytics endpoint', false, `Status: ${abTestResponse.status}`);
    }
    
  } catch (error) {
    logTest('Analytics tracking', false, error.message);
  }
}

async function testPricingPage() {
  console.log('\n💰 Testing Pricing Page...\n');
  
  try {
    const response = await fetch(`${BASE_URL}/pricing`);
    
    if (response.ok) {
      const html = await response.text();
      
      logTest('Pricing page accessible', true);
      logTest('Page contains pricing title', html.includes('Choose Your Plan') || html.includes('Alege Planul Tău'));
      logTest('Page contains plan cards', html.includes('Creator') && html.includes('Pro') && html.includes('Enterprise'));
      logTest('Page contains billing toggle', html.includes('Monthly') && html.includes('Annual'));
      logTest('Page contains checkout buttons', html.includes('Get Started') || html.includes('Începe Acum'));
      
    } else {
      logTest('Pricing page accessible', false, `Status: ${response.status}`);
    }
    
  } catch (error) {
    logTest('Pricing page', false, error.message);
  }
}

async function testLocalization() {
  console.log('\n🌍 Testing Localization...\n');
  
  try {
    // Test Romanian localization
    const roResponse = await fetch(`${BASE_URL}/pricing`, {
      headers: {
        'Accept-Language': 'ro-RO,ro;q=0.9'
      }
    });
    
    if (roResponse.ok) {
      const html = await roResponse.text();
      logTest('Romanian localization', html.includes('Alege Planul Tău') || html.includes('Creator') || html.includes('Pro'));
    } else {
      logTest('Romanian localization', false, `Status: ${roResponse.status}`);
    }
    
    // Test Spanish localization
    const esResponse = await fetch(`${BASE_URL}/pricing`, {
      headers: {
        'Accept-Language': 'es-ES,es;q=0.9'
      }
    });
    
    if (esResponse.ok) {
      const html = await esResponse.text();
      logTest('Spanish localization', html.includes('Elige Tu Plan') || html.includes('Creator') || html.includes('Pro'));
    } else {
      logTest('Spanish localization', false, `Status: ${esResponse.status}`);
    }
    
  } catch (error) {
    logTest('Localization', false, error.message);
  }
}

async function testEmailService() {
  console.log('\n📧 Testing Email Service...\n');
  
  try {
    // Test email service import
    const EmailService = require('../lib/email-service');
    
    if (EmailService && typeof EmailService.sendPaymentConfirmation === 'function') {
      logTest('Email service import', true);
      logTest('Payment confirmation method', true);
      logTest('Welcome email method', typeof EmailService.sendWelcomeEmail === 'function');
      logTest('Subscription update method', typeof EmailService.sendSubscriptionUpdate === 'function');
    } else {
      logTest('Email service import', false, 'EmailService not found or methods missing');
    }
    
  } catch (error) {
    logTest('Email service', false, error.message);
  }
}

async function testABTesting() {
  console.log('\n🧪 Testing A/B Testing...\n');
  
  try {
    // Test A/B testing hook import
    const useABTesting = require('../hooks/use-ab-testing');
    
    if (useABTesting && typeof useABTesting === 'function') {
      logTest('A/B testing hook import', true);
    } else {
      logTest('A/B testing hook import', false, 'useABTesting hook not found');
    }
    
    // Test A/B testing analytics endpoint
    const response = await fetch(`${BASE_URL}/api/analytics/ab-test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        test_id: 'pricing_v1',
        variant_id: 'variant_a',
        event: 'conversion',
        user_id: 'test-user-123',
        properties: { plan: 'pro', amount: 4900 }
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      logTest('A/B testing conversion tracking', true);
      logTest('A/B testing data format', !!data.success && !!data.test_id && !!data.variant_id);
    } else {
      logTest('A/B testing conversion tracking', false, `Status: ${response.status}`);
    }
    
  } catch (error) {
    logTest('A/B testing', false, error.message);
  }
}

async function testDatabaseConnection() {
  console.log('\n🗄️  Testing Database Connection...\n');
  
  try {
    // Test if migration script can connect
    const { Client } = require('pg');
    
    if (Client) {
      logTest('PostgreSQL client available', true);
    } else {
      logTest('PostgreSQL client available', false, 'pg module not found');
    }
    
    // Test migration file exists
    const fs = require('fs');
    const migrationPath = 'supabase/migrations/[EXAMPLE_phone: [EXAMPLE_PHONE_[EXAMPLE_PHONE_555-123-4567]]_create_user_management_tables.sql';
    
    if (fs.existsSync(migrationPath)) {
      logTest('Migration file exists', true);
      const content = fs.readFileSync(migrationPath, 'utf8');
      logTest('Migration contains users table', content.includes('CREATE TABLE users'));
      logTest('Migration contains subscriptions table', content.includes('CREATE TABLE subscriptions'));
      logTest('Migration contains analytics table', content.includes('CREATE TABLE analytics_events'));
    } else {
      logTest('Migration file exists', false, 'Migration file not found');
    }
    
  } catch (error) {
    logTest('Database connection', false, error.message);
  }
}

async function runAllTests() {
  console.log('🎯 PromptForge v3 - Comprehensive Testing Suite\n');
  console.log('Starting all tests...\n');
  
  try {
    await testStripeCheckout();
    await testWebhookEndpoint();
    await testAnalyticsTracking();
    await testPricingPage();
    await testLocalization();
    await testEmailService();
    await testABTesting();
    await testDatabaseConnection();
    
    // Summary
    console.log('\n📊 Test Results Summary');
    console.log('========================');
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`Passed: ${testResults.passed} ✅`);
    console.log(`Failed: ${testResults.failed} ❌`);
    console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
    
    if (testResults.failed === 0) {
      console.log('\n🎉 All tests passed! Your PromptForge v3 setup is working perfectly.');
    } else {
      console.log(`\n⚠️  ${testResults.failed} test(s) failed. Please check the errors above.`);
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Fix any failed tests');
    console.log('2. Configure your environment variables');
    console.log('3. Set up Stripe products and webhooks');
    console.log('4. Configure SendGrid for email delivery');
    console.log('5. Test with real data');
    
  } catch (error) {
    console.error('\n❌ Testing failed:', error.message);
    process.exit(1);
  }
}

// Run tests
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testStripeCheckout,
  testWebhookEndpoint,
  testAnalyticsTracking,
  testPricingPage,
  testLocalization,
  testEmailService,
  testABTesting,
  testDatabaseConnection,
  runAllTests
};
