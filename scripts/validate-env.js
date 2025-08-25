#!/usr/bin/env node

/**
 * Environment Variables Validation Script
 * 
 * This script checks that all required environment variables are set
 * before starting the application or deploying to production.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Required environment variables by category
const REQUIRED_VARS = {
  'Supabase': [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_ANON_KEY'
  ],
  'Stripe': [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_CREATOR_MONTHLY_PRICE_ID',
    'STRIPE_CREATOR_ANNUAL_PRICE_ID',
    'STRIPE_PRO_MONTHLY_PRICE_ID',
    'STRIPE_PRO_ANNUAL_PRICE_ID',
    'STRIPE_ENTERPRISE_MONTHLY_PRICE_ID',
    'STRIPE_ENTERPRISE_ANNUAL_PRICE_ID'
  ],
  'OpenAI': [
    'OPENAI_API_KEY'
  ],
  'Application': [
    'NEXT_PUBLIC_APP_URL',
    'STRIPE_SUCCESS_URL',
    'STRIPE_CANCEL_URL'
  ]
};

// Optional environment variables
const OPTIONAL_VARS = [
  'NEXT_PUBLIC_SITE_NAME',
  'EXPORT_WATERMARK_TRIAL',
  'COMING_SOON',
  'AGENTS_ENABLED',
  'NEXT_PUBLIC_MOTION',
  'SLACK_WEBHOOK_URL',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'ADMIN_PASSWORD'
];

// Load environment variables from .env.local if it exists
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          envVars[key] = valueParts.join('=');
        }
      }
    });
    
    // Set environment variables
    Object.entries(envVars).forEach(([key, value]) => {
      if (!process.env[key]) {
        process.env[key] = value;
      }
    });
  }
}

// Check if a variable is set and has a meaningful value
function isVariableSet(key) {
  const value = process.env[key];
  return value && value.trim() !== '' && 
         !value.includes('YOUR_') && 
         !value.includes('PLACEHOLDER') &&
         !value.includes('HERE');
}

// Validate environment variables
function validateEnvironment() {
  console.log('🔍 Validating environment variables...\n');
  
  let allValid = true;
  let totalRequired = 0;
  let totalValid = 0;
  
  // Check required variables
  Object.entries(REQUIRED_VARS).forEach(([category, variables]) => {
    console.log(`📋 ${category}:`);
    totalRequired += variables.length;
    
    variables.forEach(varName => {
      const isValid = isVariableSet(varName);
      const status = isValid ? '✅' : '❌';
      const value = process.env[varName] || 'NOT SET';
      
      console.log(`  ${status} ${varName}: ${isValid ? 'SET' : value}`);
      
      if (isValid) {
        totalValid++;
      } else {
        allValid = false;
      }
    });
    console.log('');
  });
  
  // Check optional variables
  console.log('📋 Optional Variables:');
  OPTIONAL_VARS.forEach(varName => {
    const isValid = isVariableSet(varName);
    const status = isValid ? '✅' : '⚠️';
    const value = process.env[varName] || 'NOT SET';
    
    console.log(`  ${status} ${varName}: ${isValid ? 'SET' : value}`);
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Summary: ${totalValid}/${totalRequired} required variables are set`);
  
  if (allValid) {
    console.log('🎉 All required environment variables are properly configured!');
    console.log('✅ Ready for production deployment');
    return true;
  } else {
    console.log('❌ Some required environment variables are missing or invalid');
    console.log('⚠️  Please check the configuration before deploying');
    return false;
  }
}

// Check for common configuration issues
function checkConfiguration() {
  console.log('\n🔧 Configuration Checks:');
  
  // Check Stripe key format
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (stripeKey) {
    if (stripeKey.startsWith('sk_test_')) {
      console.log('  ⚠️  Using Stripe TEST keys (sk_test_...)');
      console.log('     Switch to live keys (sk_live_...) for production');
    } else if (stripeKey.startsWith('sk_live_')) {
      console.log('  ✅ Using Stripe LIVE keys (sk_live_...)');
    } else {
      console.log('  ❌ Invalid Stripe key format');
    }
  }
  
  // Check webhook URL format
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    if (appUrl.includes('localhost') || appUrl.includes('127.0.0.1')) {
      console.log('  ⚠️  Using localhost URL - update for production');
    } else if (appUrl.startsWith('https://')) {
      console.log('  ✅ Using HTTPS production URL');
    } else {
      console.log('  ⚠️  Consider using HTTPS for production');
    }
  }
  
  // Check Supabase URL format
  const supabaseUrl = process.env.SUPABASE_URL;
  if (supabaseUrl) {
    if (supabaseUrl.includes('dev-placeholder')) {
      console.log('  ❌ Using placeholder Supabase URL');
    } else if (supabaseUrl.includes('supabase.co')) {
      console.log('  ✅ Using valid Supabase URL');
    } else {
      console.log('  ⚠️  Check Supabase URL format');
    }
  }
}

// Main execution
function main() {
  console.log('🚀 PromptForge v3 Environment Validation\n');
  
  // Load .env.local if it exists
  loadEnvFile();
  
  // Validate environment
  const isValid = validateEnvironment();
  
  // Check configuration
  checkConfiguration();
  
  // Exit with appropriate code
  process.exit(isValid ? 0 : 1);
}

// Run if called directly
main();
