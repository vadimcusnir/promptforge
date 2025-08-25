# Stripe Integration Setup Guide

This guide covers setting up Stripe products, prices, and webhooks for PromptForge v3.

## 🏗️ Stripe Product Setup

### 1. Create Products in Stripe Dashboard

Navigate to [Stripe Dashboard → Products](https://dashboard.stripe.com/products) and create the following products:

#### Free Plan (No Product Needed)
- Free users don't require a Stripe product
- They get basic access with limited features

#### Creator Plan
- **Product Name:** `PromptForge Creator`
- **Description:** `Professional prompt generation with 100 prompts/month and 50 exports/month`
- **Features:** 
  - 100 prompts per month
  - 50 exports per month
  - Markdown export format
  - Basic analytics

#### Pro Plan
- **Product Name:** `PromptForge Pro`
- **Description:** `Advanced prompt generation with 1000 prompts/month and 500 exports/month`
- **Features:**
  - 1000 prompts per month
  - 500 exports per month
  - PDF, JSON, and ZIP export formats
  - Advanced analytics and testing
  - Priority support

#### Enterprise Plan
- **Product Name:** `PromptForge Enterprise`
- **Description:** `Unlimited enterprise-grade prompt generation with API access`
- **Features:**
  - Unlimited prompts and exports
  - All export formats (PDF, JSON, ZIP, TXT, MD)
  - Enterprise API access
  - Advanced analytics and monitoring
  - Dedicated support
  - Custom integrations

### 2. Create Price Plans

For each paid product, create both monthly and annual pricing:

#### Creator Plan Prices
- **Monthly:** $19/month
- **Annual:** $190/year (2 months free)

#### Pro Plan Prices
- **Monthly:** $49/month
- **Annual:** $490/year (2 months free)

#### Enterprise Plan Prices
- **Monthly:** $199/month
- **Annual:** $1990/year (2 months free)

### 3. Configure Price Settings

For each price:
- **Billing Model:** Standard pricing
- **Billing Period:** Monthly or Yearly
- **Price:** Set the amount in your preferred currency
- **Trial Period:** Optional (e.g., 7 days)
- **Metadata:**
  - `plan_type`: `creator`, `pro`, or `enterprise`
  - `billing_cycle`: `monthly` or `annual`

## 🔗 Webhook Configuration

### 1. Create Webhook Endpoint

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. **Endpoint URL:** `https://yourdomain.com/api/webhooks/stripe`
4. **Events to send:**
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.trial_will_end`

### 2. Get Webhook Signing Secret

After creating the webhook:
1. Click on the webhook endpoint
2. Go to "Signing secret"
3. Click "Reveal" to get the `whsec_...` secret
4. Add this to your environment variables as `STRIPE_WEBHOOK_SECRET`

## 📊 Database Schema

### Required Tables

The following tables must exist in your Supabase database:

```sql
-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  plan_code TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User entitlements table
CREATE TABLE user_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  plan_code TEXT NOT NULL DEFAULT 'free',
  can_export_pdf BOOLEAN DEFAULT FALSE,
  can_export_json BOOLEAN DEFAULT FALSE,
  can_export_bundle_zip BOOLEAN DEFAULT FALSE,
  can_use_gpt_test_real BOOLEAN DEFAULT FALSE,
  max_prompts_per_month INTEGER DEFAULT 10,
  max_exports_per_month INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API usage tracking
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  requests_count INTEGER DEFAULT 0,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enterprise usage tracking
CREATE TABLE enterprise_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  request_data JSONB,
  response_data JSONB,
  execution_time_ms INTEGER,
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_usage ENABLE ROW LEVEL SECURITY;

-- Subscriptions: Users can only see their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (user_id = auth.jwt() ->> 'email');

-- User entitlements: Users can only see their own entitlements
CREATE POLICY "Users can view own entitlements" ON user_entitlements
  FOR SELECT USING (user_id = auth.jwt() ->> 'email');

-- Customers: Users can only see their own customer record
CREATE POLICY "Users can view own customer record" ON customers
  FOR SELECT USING (email = auth.jwt() ->> 'email');

-- API usage: Users can only see their own usage
CREATE POLICY "Users can view own API usage" ON api_usage
  FOR SELECT USING (user_id = auth.jwt() ->> 'email');

-- Enterprise usage: Users can only see their own usage
CREATE POLICY "Users can view own enterprise usage" ON enterprise_usage
  FOR SELECT USING (user_id = auth.jwt() ->> 'email');
```

## 🧪 Testing Setup

### 1. Test Mode vs Live Mode

- **Development/Testing:** Use test keys (`sk_test_...`, `pk_test_...`)
- **Production:** Use live keys (`sk_live_...`, `pk_live_...`)

### 2. Test Cards

Use these test card numbers:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **Insufficient Funds:** `4000 0000 0000 9995`

### 3. Test Webhook Endpoint

For local testing, use Stripe CLI:
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# This will give you a webhook signing secret for local testing
```

## 🚀 Production Deployment

### 1. Environment Variables

Ensure these are set in your production environment:
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CREATOR_MONTHLY_PRICE_ID=price_...
STRIPE_CREATOR_ANNUAL_PRICE_ID=price_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_ANNUAL_PRICE_ID=price_...
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=price_...
STRIPE_ENTERPRISE_ANNUAL_PRICE_ID=price_...
```

### 2. Webhook URL

Update your webhook endpoint URL to your production domain:
```
https://yourdomain.com/api/webhooks/stripe
```

### 3. Database Migration

Run the database schema creation scripts in your production Supabase instance.

## 🔍 Monitoring & Troubleshooting

### 1. Stripe Dashboard

Monitor in [Stripe Dashboard](https://dashboard.stripe.com):
- **Webhooks:** Delivery status and retry attempts
- **Subscriptions:** Active subscriptions and churn
- **Payments:** Successful and failed payments
- **Customers:** Customer creation and updates

### 2. Application Logs

Check your application logs for:
- Webhook processing errors
- Database operation failures
- API rate limit issues

### 3. Common Issues

- **Webhook signature verification failed:** Check webhook secret
- **Database connection errors:** Verify Supabase credentials
- **Rate limiting:** Check API usage limits
- **Subscription not updating:** Verify webhook events are configured

## 📋 Setup Checklist

- [ ] Create Stripe products (Creator, Pro, Enterprise)
- [ ] Set up monthly and annual pricing
- [ ] Configure webhook endpoint
- [ ] Get webhook signing secret
- [ ] Set environment variables
- [ ] Create database tables
- [ ] Configure RLS policies
- [ ] Test webhook locally
- [ ] Deploy to production
- [ ] Test end-to-end flow
- [ ] Monitor webhook delivery
- [ ] Verify subscription updates

## 🆘 Support

- **Stripe Support:** [support.stripe.com](https://support.stripe.com)
- **Stripe Documentation:** [stripe.com/docs](https://stripe.com/docs)
- **Webhook Testing:** Use Stripe CLI for local testing
- **Logs:** Check both Stripe Dashboard and application logs
