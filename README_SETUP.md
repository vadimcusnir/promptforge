# 🚀 PromptForge v3 - Complete Setup Guide

## 📋 Overview

This guide will walk you through setting up PromptForge v3 with all the advanced features:
- 💳 Stripe payment processing
- 🔐 User authentication & plan management
- 📊 Analytics & conversion tracking
- 🧪 A/B testing for pricing optimization
- 🌍 Multi-language localization
- 📧 Automated email notifications

## 🎯 Quick Start (Automated Setup)

For the fastest setup, use our automated script:

```bash
# 1. Copy environment template
cp env.template .env.local

# 2. Edit .env.local with your API keys
nano .env.local

# 3. Run complete setup
pnpm run setup:complete
```

This will automatically:
- ✅ Verify prerequisites
- ✅ Configure environment
- ✅ Set up Stripe products & webhooks
- ✅ Run database migrations
- ✅ Configure SendGrid
- ✅ Run comprehensive tests
- ✅ Generate setup report

## 🛠️ Manual Setup (Step by Step)

### Step 1: Environment Configuration

```bash
# Copy environment template
cp env.example .env.local

# Edit with your actual values
nano .env.local
```

**Important:** The `.env.local` file contains sensitive information and should never be committed to version control. Use `env.example` as a template and create your local `.env.local` file.

**Required Variables:**
```bash
# Stripe (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Database (PostgreSQL connection string)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/db

# SendGrid (get from https://app.sendgrid.com/settings/api_keys)
SENDGRID_API_KEY=SG...
```

### Step 2: Install Dependencies

```bash
# Install all packages
pnpm install

# Verify installation
pnpm type-check
```

### Step 3: Stripe Setup

```bash
# Set your Stripe secret key
export STRIPE_SECRET_KEY=sk_test_...

# Run Stripe setup
pnpm run stripe:setup
```

This will create:
- ✅ Products for each plan (Creator, Pro, Enterprise)
- ✅ Monthly and annual pricing
- ✅ Webhook endpoint configuration
- ✅ Environment file with product IDs

### Step 4: Database Setup

```bash
# Set your database URL
export DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/db

# Run migrations
pnpm run migrate
```

This will create:
- ✅ Users table with RLS policies
- ✅ Subscriptions table
- ✅ Analytics events table
- ✅ A/B testing events table
- ✅ Email notifications table

### Step 5: SendGrid Setup

```bash
# Set your SendGrid API key
export SENDGRID_API_KEY=SG...

# Run SendGrid setup
pnpm run sendgrid:setup
```

This will:
- ✅ Verify API key
- ✅ Check domain authentication
- ✅ Generate email templates
- ✅ Test email delivery

### Step 6: Testing

```bash
# Start development server
pnpm dev

# In another terminal, run tests
pnpm run test:all
```

## 🔧 Individual Scripts

### Stripe Management
```bash
# Setup Stripe products and webhooks
pnpm run stripe:setup

# Test Stripe checkout
pnpm run test:stripe

# Test webhook endpoint
pnpm run test:webhook
```

### Database Management
```bash
# Run migrations
pnpm run migrate

# Setup database
pnpm run db:setup

# Seed with sample data
pnpm run db:seed
```

### Email Service
```bash
# Setup SendGrid
pnpm run sendgrid:setup

# Test email delivery
# (Email testing requires real email addresses)
```

### Testing
```bash
# Run all tests
pnpm run test:all

# Test specific endpoints
pnpm run test:stripe
pnpm run test:webhook
pnpm run test:analytics
```

## 🌐 Webhook Configuration

### Stripe Dashboard Setup

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.created`

### Test Webhook Delivery

```bash
# Test with Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Or test manually
curl -X POST http://localhost:3000/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -H "stripe-signature: test" \
  -d '{"type":"test.event","data":{"object":{"id":"test"}}}'
```

## 📧 Email Configuration

### SendGrid Domain Authentication

1. Go to [SendGrid Sender Authentication](https://app.sendgrid.com/settings/sender_auth)
2. Click "Authenticate Your Domain"
3. Enter your domain (e.g., `[EXAMPLE_DOMAIN_yourdomain.com]`)
4. Add DNS records:
   - SPF record
   - DKIM record
   - DMARC record
5. Wait for verification (up to 48 hours)

### Email Templates

The setup script generates HTML templates:
- `sendgrid-template-payment_confirmation.html`
- `sendgrid-template-welcome_email.html`

Upload these to SendGrid Dynamic Templates:
1. Go to [Dynamic Templates](https://app.sendgrid.com/dynamic_templates)
2. Create new template
3. Copy HTML content
4. Set up dynamic variables

## 🗄️ Database Schema

### Tables Created

```sql
-- Users and authentication
users (id, email, plan_id, is_annual, subscription_id, stripe_customer_id)

-- Subscription management
subscriptions (id, user_id, stripe_subscription_id, plan_id, status, billing_dates)

-- Analytics tracking
analytics_events (id, user_id, event_name, properties, timestamp)

-- A/B testing
ab_test_events (id, test_id, variant_id, user_id, event_type, properties)

-- Email notifications
email_notifications (id, user_id, email_type, status, sent_at)
```

### Row Level Security (RLS)

All tables have RLS enabled with policies:
- Users can only access their own data
- Analytics are user-scoped
- Subscriptions are user-scoped

## 🧪 A/B Testing Configuration

### Test Variants

The system automatically creates 3 pricing variants:

1. **Control** - Current pricing ($19/$49/$299)
2. **Lower Price** - Reduced pricing (-21%/-20%/-17%)
3. **Premium** - Higher pricing with extra features (+26%/+20%/+17%)

### Tracking Events

```javascript
// Track variant view
analytics.trackVariantView('pricing_v1', 'control');

// Track conversion
analytics.trackVariantConversion('pricing_v1', 'control', {
  plan: 'pro',
  amount: 4900,
  billing: 'monthly'
});
```

## 🌍 Localization Setup

### Supported Languages

- 🇺🇸 English (default)
- 🇷🇴 Romanian
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German

### Language Detection

```javascript
// Auto-detect from browser
const locale = navigator.language.split('-')[0];

// Manual selection
localization.changeLocale('ro');

// Get translated content
const title = t('pricing.title');
const features = getFeatures();
```

## 📊 Analytics Dashboard

### Available Metrics

- **Revenue Tracking**: Total revenue, MRR, plan performance
- **Conversion Funnel**: Views → Clicks → Checkout → Subscriptions
- **User Behavior**: Scroll depth, time on page, feature interactions
- **A/B Testing**: Statistical significance, winner detection

### Dashboard Access

Visit `/dashboard/analytics` to see:
- Overview metrics
- Plan performance analysis
- A/B testing results
- Timeline tracking

## 🚀 Production Deployment

### Environment Variables

```bash
# Production values
NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### Security Checklist

- [ ] Use production Stripe keys
- [ ] Enable HTTPS everywhere
- [ ] Set secure cookies
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Monitor error rates

### Performance Optimization

- [ ] Enable database connection pooling
- [ ] Implement caching strategies
- [ ] Optimize image delivery
- [ ] Monitor response times
- [ ] Set up CDN

## 🆘 Troubleshooting

### Common Issues

#### Stripe Webhook Failures
```bash
# Check webhook status
stripe webhooks list

# Test webhook delivery
stripe webhooks test --endpoint=whsec_xxx

# Check logs
tail -f logs/stripe-webhooks.log
```

#### Email Delivery Issues
```bash
# Verify SendGrid configuration
pnpm run sendgrid:setup

# Check domain authentication
# Monitor bounce rates in SendGrid dashboard
```

#### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check migration status
pnpm run migrate

# Verify tables
psql $DATABASE_URL -c "\dt"
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=true pnpm dev

# Check console for detailed logs
# Monitor network requests in browser dev tools
```

## 📚 Additional Resources

### Documentation
- [Stripe API Reference](https://stripe.com/docs/api)
- [SendGrid API Docs](https://sendgrid.com/docs/api-reference/)
- [Supabase Documentation](https://supabase.com/docs)

### Support
- Check the `SETUP_REPORT.md` generated after setup
- Review console output for error details
- Verify environment variables are correct
- Test individual components with provided scripts

## 🎉 Success!

Once setup is complete, you'll have:

✅ **Complete payment processing** with Stripe  
✅ **User management system** with authentication  
✅ **Analytics tracking** for conversions and behavior  
✅ **A/B testing framework** for pricing optimization  
✅ **Multi-language support** for global reach  
✅ **Automated email system** for user engagement  
✅ **Production-ready database** with security policies  

Your PromptForge v3 is now ready to handle enterprise-grade pricing and subscriptions! 🚀

---

**Need help?** Run `pnpm run setup:complete` for automated setup, or use individual scripts for specific components.
