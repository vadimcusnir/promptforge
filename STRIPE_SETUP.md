# Stripe Integration & Enterprise API Setup

## Overview

This guide covers setting up the complete pricing and Stripe integration for PromptForge, including the Enterprise API endpoint.

## 1. Stripe Configuration

### Environment Variables Required

Add these to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # or sk_live_... for production
STRIPE_PUBLISHABLE_KEY=pk_test_... # or pk_live_... for production
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs for Plans
STRIPE_CREATOR_MONTHLY_PRICE_ID=price_...
STRIPE_CREATOR_ANNUAL_PRICE_ID=price_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_ANNUAL_PRICE_ID=price_...
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=price_...
STRIPE_ENTERPRISE_ANNUAL_PRICE_ID=price_...
```

### Setting Up Stripe Products & Prices

1. **Create Products in Stripe Dashboard:**
   - Creator Plan
   - Pro Plan  
   - Enterprise Plan

2. **Create Prices for Each Plan:**
   - Monthly prices (recurring)
   - Annual prices (recurring with 20% discount)

3. **Copy Price IDs:**
   - Use the price IDs in your environment variables

## 2. Stripe Webhook Setup

### Webhook Endpoint
```
https://yourdomain.com/api/webhooks/stripe
```

### Events to Listen For
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### Webhook Secret
- Generate in Stripe Dashboard
- Add to `STRIPE_WEBHOOK_SECRET` environment variable

## 3. Database Schema

### Required Tables

#### `subscriptions`
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  plan_code TEXT NOT NULL,
  status TEXT NOT NULL,
  billing_cycle TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `user_entitlements`
```sql
CREATE TABLE user_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  plan_tier TEXT NOT NULL DEFAULT 'free',
  monthlyRunsRemaining INTEGER NOT NULL DEFAULT 10,
  monthlyGPTOptimizationsRemaining INTEGER NOT NULL DEFAULT 0,
  monthlyExportsRemaining INTEGER NOT NULL DEFAULT 5,
  canExportJSON BOOLEAN NOT NULL DEFAULT FALSE,
  canExportPDF BOOLEAN NOT NULL DEFAULT FALSE,
  canExportBundleZip BOOLEAN NOT NULL DEFAULT FALSE,
  hasCloudHistory BOOLEAN NOT NULL DEFAULT FALSE,
  hasAdvancedAnalytics BOOLEAN NOT NULL DEFAULT FALSE,
  hasCustomModules BOOLEAN NOT NULL DEFAULT FALSE,
  hasTeamCollaboration BOOLEAN NOT NULL DEFAULT FALSE,
  hasPrioritySupport BOOLEAN NOT NULL DEFAULT FALSE,
  maxTeamMembers INTEGER NOT NULL DEFAULT 1,
  maxCustomModules INTEGER NOT NULL DEFAULT 0,
  maxStorageGB INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `customers`
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `api_usage`
```sql
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  requests_count INTEGER NOT NULL DEFAULT 1,
  plan_tier TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `enterprise_usage`
```sql
CREATE TABLE enterprise_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  seven_d_config JSONB,
  custom_parameters JSONB,
  telemetry JSONB,
  prompt_length INTEGER,
  tokens INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. Enterprise API

### Endpoint
```
POST /api/run/{moduleId}
```

### Access Control
- **Enterprise Plan Only**: This endpoint is restricted to users with Enterprise subscriptions
- **Rate Limiting**: 10,000 requests per hour for Enterprise users
- **Enhanced Features**: Includes telemetry, artifacts, and custom parameters

### Request Format
```json
{
  "sevenDConfig": {
    "domain": "saas",
    "scale": "enterprise",
    "urgency": "planned",
    "complexity": "expert",
    "resources": "enterprise_budget",
    "application": "strategy_design",
    "output": "structured"
  },
  "customParameters": {
    "industry": "technology",
    "audience": "executives",
    "tone": "professional"
  },
  "telemetry": {
    "sessionId": "session_123",
    "clientInfo": "enterprise_dashboard",
    "userAgent": "enterprise-client/1.0"
  }
}
```

### Response Format
```json
{
  "success": true,
  "data": {
    "prompt": { /* Generated prompt data */ },
    "module": { /* Module information */ },
    "sevenDConfig": { /* 7-D configuration used */ },
    "customParameters": { /* Custom parameters */ },
    "telemetry": {
      "sessionId": "session_123",
      "timestamp": "2024-01-01T00:00:00Z",
      "usageId": "ent_1234567890_abc123"
    },
    "artifacts": {
      "promptHash": "sha256_hash",
      "configHash": "sha256_hash",
      "metadataHash": "sha256_hash"
    },
    "rateLimit": {
      "remaining": 9999,
      "resetTime": "2024-01-01T01:00:00Z"
    }
  }
}
```

## 5. Testing

### Test Stripe Webhooks
1. Use Stripe CLI for local testing:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

2. Test subscription creation:
   ```bash
   stripe trigger customer.subscription.created
   ```

### Test Enterprise API
1. Create an Enterprise user account
2. Test the `/api/run/{moduleId}` endpoint
3. Verify rate limiting and entitlements

## 6. Production Deployment

### Environment Variables
- Use production Stripe keys (`sk_live_`, `pk_live_`)
- Set production webhook endpoint
- Configure production database

### Monitoring
- Monitor webhook delivery in Stripe Dashboard
- Track API usage and rate limiting
- Monitor subscription lifecycle events

### Security
- Validate webhook signatures
- Implement proper rate limiting
- Secure API endpoints with authentication

## 7. Troubleshooting

### Common Issues
1. **Webhook signature verification fails**
   - Check `STRIPE_WEBHOOK_SECRET` environment variable
   - Verify webhook endpoint URL

2. **Subscription not created in database**
   - Check webhook delivery in Stripe Dashboard
   - Verify database connection and permissions

3. **Rate limiting not working**
   - Check `api_usage` table exists
   - Verify user entitlements are properly set

### Debug Logs
- Check server logs for webhook processing
- Monitor Stripe Dashboard for webhook delivery status
- Verify database operations in Supabase logs
