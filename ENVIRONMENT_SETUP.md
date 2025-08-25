# Environment Variables & Secrets Setup

This guide covers setting up all required environment variables for PromptForge v3 production deployment.

## 🌐 Production Domain Configuration

**Your Production Domain:** `chatgpt-prompting.com`

### Quick Production Setup
```bash
# Run this command to see your production environment setup
pnpm run env:setup
```

## 🔐 Required Environment Variables

### Supabase Configuration
```bash
# Supabase Project URL
SUPABASE_URL=https://your-project.supabase.co

# Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Anonymous Key (for client-side operations)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Stripe Configuration
```bash
# Stripe Secret Key (use sk_test_... for testing, sk_live_... for production)
STRIPE_SECRET_KEY=sk_live_...

# Stripe Webhook Signing Secret
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs for Plans
STRIPE_CREATOR_MONTHLY_PRICE_ID=price_...
STRIPE_CREATOR_ANNUAL_PRICE_ID=price_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_ANNUAL_PRICE_ID=price_...
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=price_...
STRIPE_ENTERPRISE_ANNUAL_PRICE_ID=price_...
```

### OpenAI Configuration
```bash
# OpenAI API Key
OPENAI_API_KEY=sk-...
```

### Application Configuration
```bash
# Application URL (PRODUCTION)
NEXT_PUBLIC_APP_URL=https://chatgpt-prompting.com

# Success and Cancel URLs for Stripe checkout (PRODUCTION)
STRIPE_SUCCESS_URL=https://chatgpt-prompting.com/dashboard?success=true
STRIPE_CANCEL_URL=https://chatgpt-prompting.com/pricing?canceled=true

# Site Name
NEXT_PUBLIC_SITE_NAME=PromptForge v3

# Export Watermark for Trial Users
EXPORT_WATERMARK_TRIAL=TRIAL — Not for Redistribution
```

### Stripe Webhook Configuration
```bash
# Webhook Endpoint URL (PRODUCTION)
STRIPE_WEBHOOK_ENDPOINT=https://chatgpt-prompting.com/api/webhooks/stripe

# Webhook Events to Configure in Stripe Dashboard:
# - customer.subscription.created
# - customer.subscription.updated
# - customer.subscription.deleted
# - invoice.payment_succeeded
# - invoice.payment_failed
# - customer.subscription.trial_will_end
```

### Optional Configuration
```bash
# Coming Soon Mode
COMING_SOON=false

# Agents Enabled
AGENTS_ENABLED=true

# Motion Effects
NEXT_PUBLIC_MOTION=on

# Slack Webhook for Alerts
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# SMTP Configuration for Email Alerts
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Admin Password
ADMIN_PASSWORD=your-secure-admin-password
```

## 🚀 Deployment Setup

### Vercel Deployment

1. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to Settings → Environment Variables
   - Add each environment variable from above

2. **Environment Variable Groups:**
   - Create separate groups for Production, Preview, and Development
   - Ensure Production has all required variables set

### GitHub Actions (if using)

1. **Set Repository Secrets:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add each environment variable as a repository secret

2. **Update Workflow Files:**
   ```yaml
   env:
     SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
     SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
     STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
     # ... other variables
   ```

### Local Development

1. **Create `.env.local` file:**
   ```bash
   cp stripe-config.env .env.local
   ```

2. **Update with your actual values:**
   - Replace all placeholder values with real API keys
   - Use test keys for development

## 🔒 Security Best Practices

### Never Commit Secrets
- ✅ `.env.local` is in `.gitignore`
- ✅ `stripe-config.env` contains only placeholders
- ❌ Never commit actual API keys to Git

### Use Different Keys for Environments
- **Development:** Test keys (sk_test_..., pk_test_...)
- **Production:** Live keys (sk_live_..., pk_live_...)

### Rotate Keys Regularly
- Update API keys quarterly
- Monitor for unauthorized usage
- Use Stripe's key rotation features

### Environment Variable Validation
- Validate all required variables are set on startup
- Provide clear error messages for missing variables
- Use TypeScript to ensure type safety

## 🧪 Testing Environment Variables

### Local Testing
```bash
# Check if all required variables are set
pnpm run env:check

# Start development server
pnpm dev
```

### Production Testing
```bash
# Build and start production server
pnpm build
pnpm start
```

## 📋 Environment Variable Checklist

- [ ] Supabase URL and keys configured
- [ ] Stripe secret and publishable keys set
- [ ] Stripe webhook secret configured
- [ ] Stripe price IDs for all plans set
- [ ] OpenAI API key configured
- [ ] Application URLs configured
- [ ] Optional variables set as needed
- [ ] Environment variables tested locally
- [ ] Environment variables set in production
- [ ] Webhook endpoints configured
- [ ] Database migrations run
- [ ] RLS policies tested

## 🚨 Troubleshooting

### Common Issues

1. **"Environment variable not found"**
   - Check variable name spelling
   - Ensure variable is set in deployment platform
   - Restart deployment after adding variables

2. **"Invalid API key"**
   - Verify key format (sk_live_... vs sk_test_...)
   - Check if key has expired or been revoked
   - Ensure key has required permissions

3. **"Webhook signature verification failed"**
   - Verify webhook secret is correct
   - Check webhook endpoint URL
   - Ensure webhook events are properly configured

### Support
- Check application logs for detailed error messages
- Verify environment variables in deployment platform
- Test API endpoints individually
- Review Stripe webhook delivery logs
