#!/usr/bin/env node

/**
 * SendGrid Setup Script for PromptForge v3
 * 
 * This script helps configure:
 * - Domain authentication (SPF, DKIM, DMARC)
 * - Email templates
 * - API key verification
 * - Sender verification
 * 
 * Usage:
 * 1. Set your SENDGRID_API_KEY: export SENDGRID_API_KEY=SG.xxx
 * 2. Run: node scripts/setup-sendgrid.js
 */

const sgMail = require('@sendgrid/mail');

// Configuration
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

if (!SENDGRID_API_KEY) {
  console.error('❌ SENDGRID_API_KEY environment variable is required');
  console.log('Set it with: export SENDGRID_API_KEY=SG.xxx');
  process.exit(1);
}

sgMail.setApiKey(SENDGRID_API_KEY);

async function testApiKey() {
  console.log('🔑 Testing SendGrid API key...\n');
  
  try {
    // Test API key by getting account info
    const response = await fetch('https://api.sendgrid.com/v3/user/profile', {
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const profile = await response.json();
      console.log('   ✅ API key is valid');
      console.log(`   👤 Account: ${profile.first_name} ${profile.last_name}`);
      console.log(`   📧 Email: ${profile.email}`);
      console.log(`   🏢 Company: ${profile.company || 'Not set'}`);
      return true;
    } else {
      console.log('   ❌ API key is invalid');
      return false;
    }
    
  } catch (error) {
    console.error('   ❌ Error testing API key:', error.message);
    return false;
  }
}

async function checkDomainAuthentication() {
  console.log('\n🌐 Checking domain authentication...\n');
  
  try {
    // Get authenticated domains
    const response = await fetch('https://api.sendgrid.com/v3/whitelabel/domains', {
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const domains = await response.json();
      
      if (domains.length === 0) {
        console.log('   ⚠️  No authenticated domains found');
        console.log('   📋 To authenticate a domain:');
        console.log('      1. Go to: https://app.sendgrid.com/settings/sender_auth');
        console.log('      2. Click "Authenticate Your Domain"');
        console.log('      3. Enter your domain (e.g., promptforge.com)');
        console.log('      4. Add the provided DNS records');
        console.log('      5. Wait for verification (can take up to 48 hours)');
        return false;
      } else {
        console.log('   ✅ Authenticated domains found:');
        for (const domain of domains) {
          console.log(`      - ${domain.domain} (${domain.valid ? '✅ Valid' : '⏳ Pending'})`);
        }
        return true;
      }
    } else {
      console.log('   ❌ Error checking domains');
      return false;
    }
    
  } catch (error) {
    console.error('   ❌ Error checking domain authentication:', error.message);
    return false;
  }
}

async function testEmailDelivery() {
  console.log('\n📧 Testing email delivery...\n');
  
  try {
    const testEmail = {
      to: 'test@example.com', // This will fail, but we can test the API
      from: {
        email: 'noreply@promptforge.com',
        name: 'PromptForge Test'
      },
      subject: 'SendGrid Test Email',
      text: 'This is a test email to verify SendGrid configuration.',
      html: '<h1>SendGrid Test</h1><p>This is a test email to verify SendGrid configuration.</p>'
    };
    
    // Note: This will fail because we're using a test email, but it tests the API
    try {
      await sgMail.send(testEmail);
      console.log('   ✅ Email sent successfully (if using real email)');
      return true;
    } catch (error) {
      if (error.response?.body?.errors?.[0]?.message?.includes('test@example.com')) {
        console.log('   ✅ API is working (expected failure for test email)');
        return true;
      } else {
        console.log('   ❌ Email delivery failed:', error.message);
        return false;
      }
    }
    
  } catch (error) {
    console.error('   ❌ Error testing email delivery:', error.message);
    return false;
  }
}

async function createEmailTemplates() {
  console.log('\n📝 Creating email templates...\n');
  
  try {
    // Note: SendGrid dynamic templates require manual creation in the dashboard
    // This script provides the HTML content for manual setup
    
    const templates = {
      'payment_confirmation': {
        name: 'Payment Confirmation',
        subject: 'Payment Confirmed - {{plan_name}} Plan',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Payment Confirmation</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #d1a954, #b8941f); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .plan-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d1a954; }
                .amount { font-size: 24px; font-weight: bold; color: #d1a954; }
                .button { display: inline-block; background: #d1a954; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 Payment Confirmed!</h1>
                  <p>Thank you for choosing PromptForge</p>
                </div>
                
                <div class="content">
                  <h2>Hello {{user_name}},</h2>
                  <p>Your payment has been successfully processed. Here are the details:</p>
                  
                  <div class="plan-details">
                    <h3>{{plan_name}} Plan</h3>
                    <p><strong>Amount:</strong> <span class="amount">{{amount}}</span></p>
                    <p><strong>Billing Cycle:</strong> {{billing_cycle}}</p>
                    <p><strong>Next Billing Date:</strong> {{next_billing_date}}</p>
                  </div>
                  
                  <p>You now have access to all the features included in your plan. Start exploring PromptForge to unlock your AI potential!</p>
                  
                  <a href="{{dashboard_url}}" class="button">Go to Dashboard</a>
                  
                  <p>If you have any questions, please don't hesitate to contact our support team.</p>
                  
                  <p>Best regards,<br>The PromptForge Team</p>
                </div>
                
                <div class="footer">
                  <p>© 2024 PromptForge. All rights reserved.</p>
                  <p>This email was sent to {{user_email}}</p>
                </div>
              </div>
            </body>
          </html>
        `
      },
      'welcome_email': {
        name: 'Welcome Email',
        subject: 'Welcome to PromptForge - {{plan_name}} Plan',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to PromptForge</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #d1a954, #b8941f); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .features { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d1a954; }
                .button { display: inline-block; background: #d1a954; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🚀 Welcome to PromptForge!</h1>
                  <p>Your AI journey starts now</p>
                </div>
                
                <div class="content">
                  <h2>Hello {{user_name}},</h2>
                  <p>Welcome to PromptForge! We're excited to have you on board with the {{plan_name}} plan.</p>
                  
                  <div class="features">
                    <h3>What's Next?</h3>
                    <ul>
                      <li>Explore our comprehensive module library</li>
                      <li>Create and test your first prompts</li>
                      <li>Export your work in multiple formats</li>
                      <li>Join our community of AI enthusiasts</li>
                    </ul>
                  </div>
                  
                  <p>Ready to get started? Head over to your dashboard and begin creating amazing AI prompts!</p>
                  
                  <a href="{{dashboard_url}}" class="button">Get Started</a>
                  
                  <p>If you need help getting started, check out our <a href="{{docs_url}}">documentation</a> or contact our support team.</p>
                  
                  <p>Best regards,<br>The PromptForge Team</p>
                </div>
                
                <div class="footer">
                  <p>© 2024 PromptForge. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `
      }
    };
    
    console.log('   📋 Email templates ready for manual setup:');
    console.log('      1. Go to: https://app.sendgrid.com/dynamic_templates');
    console.log('      2. Click "Create Template"');
    console.log('      3. Copy the HTML content below');
    console.log('      4. Set up dynamic variables ({{user_name}}, {{plan_name}}, etc.)');
    
    for (const [key, template] of Object.entries(templates)) {
      console.log(`\n   📧 ${template.name}:`);
      console.log(`      Subject: ${template.subject}`);
      console.log(`      Variables: ${template.html.match(/\{\{([^}]+)\}\}/g)?.join(', ') || 'None'}`);
    }
    
    // Save templates to files
    const fs = require('fs');
    for (const [key, template] of Object.entries(templates)) {
      fs.writeFileSync(`sendgrid-template-${key}.html`, template.html);
      console.log(`      💾 Template saved to: sendgrid-template-${key}.html`);
    }
    
    return true;
    
  } catch (error) {
    console.error('   ❌ Error creating email templates:', error.message);
    return false;
  }
}

async function main() {
  console.log('🎯 PromptForge v3 - SendGrid Setup Script\n');
  
  try {
    // Test API key
    const apiKeyValid = await testApiKey();
    if (!apiKeyValid) {
      process.exit(1);
    }
    
    // Check domain authentication
    const domainAuthenticated = await checkDomainAuthentication();
    
    // Test email delivery
    const emailWorking = await testEmailDelivery();
    
    // Create email templates
    const templatesCreated = await createEmailTemplates();
    
    console.log('\n📊 Setup Summary:');
    console.log(`   ✅ API Key: ${apiKeyValid ? 'Valid' : 'Invalid'}`);
    console.log(`   🌐 Domain Auth: ${domainAuthenticated ? 'Complete' : 'Pending'}`);
    console.log(`   📧 Email Delivery: ${emailWorking ? 'Working' : 'Issues'}`);
    console.log(`   📝 Templates: ${templatesCreated ? 'Ready' : 'Failed'}`);
    
    if (apiKeyValid && emailWorking) {
      console.log('\n🎉 SendGrid setup complete!');
      console.log('\n📋 Next steps:');
      console.log('1. Authenticate your domain in SendGrid dashboard');
      console.log('2. Create dynamic templates using the provided HTML');
      console.log('3. Test email delivery with real email addresses');
      console.log('4. Update your .env.local with the correct from email');
      
      if (!domainAuthenticated) {
        console.log('\n⚠️  Important: Domain authentication is required for production use');
      }
    } else {
      console.log('\n⚠️  Some setup steps failed. Please check the errors above.');
    }
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { testApiKey, checkDomainAuthentication, testEmailDelivery, createEmailTemplates };
