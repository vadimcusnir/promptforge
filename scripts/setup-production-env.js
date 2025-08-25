#!/usr/bin/env node

/**
 * Production Environment Setup Script
 * 
 * This script helps set up production environment variables
 * for the chatgpt-prompting.com domain.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'chatgpt-prompting.com';

// Production environment variables to set
const PRODUCTION_VARS = {
  'NEXT_PUBLIC_APP_URL': `https://${DOMAIN}`,
  'STRIPE_SUCCESS_URL': `https://${DOMAIN}/dashboard?success=true`,
  'STRIPE_CANCEL_URL': `https://${DOMAIN}/pricing?canceled=true`,
  'STRIPE_WEBHOOK_ENDPOINT': `https://${DOMAIN}/api/webhooks/stripe`
};

console.log('🚀 PromptForge v3 Production Environment Setup\n');
console.log(`📍 Domain: ${DOMAIN}\n`);

console.log('📋 Required Environment Variables for Production:\n');

Object.entries(PRODUCTION_VARS).forEach(([key, value]) => {
  console.log(`${key}=${value}`);
});

console.log('\n' + '='.repeat(60));
console.log('🔧 Setup Instructions:\n');

console.log('1. **Vercel Dashboard:**');
console.log('   - Go to your project settings');
console.log('   - Navigate to Environment Variables');
console.log('   - Add each variable above\n');

console.log('2. **GitHub Secrets (if using GitHub Actions):**');
console.log('   - Go to repository Settings → Secrets and variables → Actions');
console.log('   - Add each variable as a repository secret\n');

console.log('3. **Stripe Dashboard:**');
console.log('   - Go to Webhooks section');
console.log('   - Create webhook endpoint:');
console.log(`   - URL: ${PRODUCTION_VARS.STRIPE_WEBHOOK_ENDPOINT}`);
console.log('   - Events: customer.subscription.*, invoice.payment_*\n');

console.log('4. **Verify Configuration:**');
console.log('   - Run: pnpm run env:check');
console.log('   - All required variables should show ✅ SET\n');

console.log('5. **Test Deployment:**');
console.log('   - Push to main branch');
console.log('   - Verify build succeeds');
console.log('   - Test webhook endpoint\n');

console.log('📞 **Support:**');
console.log('- Check PRODUCTION_DEPLOYMENT.md for complete checklist');
console.log('- Review STRIPE_SETUP.md for detailed Stripe configuration');
console.log('- Use ENVIRONMENT_SETUP.md for troubleshooting');

console.log('\n' + '='.repeat(60));
console.log('🎯 **Next Steps:**');
console.log('1. Set environment variables in your hosting platform');
console.log('2. Configure Stripe webhook endpoint');
console.log('3. Run database migrations');
console.log('4. Deploy and test end-to-end flow');
console.log('5. Go live! 🚀\n');
