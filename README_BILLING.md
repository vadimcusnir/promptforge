# 🚀 PROMPTFORGE v3 - BILLING SYSTEM INTEGRATION

## 📋 **OVERVIEW**

PromptForge v3 includes a complete Stripe billing integration with automatic entitlement management. The system handles subscriptions, webhooks, and feature gating based on plan levels.

## 🏗️ **ARCHITECTURE**

### **Core Components**
- **Stripe Integration**: Products, prices, checkout sessions, webhooks
- **Database Layer**: Subscriptions, entitlements, webhook events tracking
- **API Endpoints**: Checkout, customer portal, entitlements retrieval
- **Entitlements Engine**: Automatic feature flag management based on plans

### **Plan Structure**
- **Pilot**: Free tier with basic features
- **Pro**: $49/month or $490/year with advanced features
- **Enterprise**: $299/month or $2990/year with full features + 5 seats

## 🔧 **SETUP & CONFIGURATION**

### **1. Environment Variables**

Create `.env.local` with the following variables:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_... # or sk_test_... for development
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook endpoint secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... # or pk_test_...

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application Configuration
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### **2. Stripe Dashboard Setup**

#### **Products & Prices**
Run the setup script to create products automatically:

```bash
# Set your Stripe secret key
export STRIPE_SECRET_KEY=sk_live_...

# Create products and prices
node scripts/create-stripe-products.js
```

This will create:
- PromptForge Pilot ($0/month)
- PromptForge Pro ($49/month, $490/year)
- PromptForge Enterprise ($299/month, $2990/year)

#### **Webhook Endpoint**
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.paused`
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook secret to your `.env.local`

### **3. Database Setup**

Run the migration to create required tables:

```bash
# Apply the Stripe billing migration
pnpm run migrate
```

This creates:
- `subscriptions` table for Stripe subscription data
- `webhook_events` table for idempotency tracking
- `entitlements` table for feature flags
- `entitlements_effective` view for current entitlements
- `pf_apply_plan_entitlements()` function for automatic entitlement management

## 🎯 **API ENDPOINTS**

### **Checkout API**
```http
POST /api/billing/checkout
Content-Type: application/json
x-user-id: user_uuid
x-user-email: user@example.com

{
  "orgId": "org_uuid",
  "planCode": "pro",
  "interval": "month"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "cs_123...",
  "url": "https://checkout.stripe.com/...",
  "planCode": "pro",
  "interval": "month",
  "orgId": "org_uuid"
}
```

### **Customer Portal API**
```http
POST /api/billing/portal
Content-Type: application/json
x-user-id: user_uuid

{
  "orgId": "org_uuid",
  "returnUrl": "https://yourdomain.com/billing"
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://billing.stripe.com/...",
  "orgId": "org_uuid"
}
```

### **Entitlements API**
```http
GET /api/entitlements?orgId=org_uuid
x-user-id: user_uuid
```

**Response:**
```json
{
  "success": true,
  "orgId": "org_uuid",
  "entitlements": {
    "canUseAllModules": true,
    "canExportPDF": true,
    "canExportJSON": true,
    "canUseGptTestReal": true,
    "hasAPI": false,
    "canExportBundleZip": false,
    "hasWhiteLabel": false,
    "hasSeatsGT1": false
  },
  "timestamp": "2024-12-20T10:00:00.000Z"
}
```

## 🔐 **ENTITLEMENTS & FEATURE GATING**

### **Plan Entitlements Matrix**

| Feature | Pilot | Pro | Enterprise |
|---------|-------|-----|------------|
| **Basic Features** |
| Use All Modules | ❌ | ✅ | ✅ |
| Export MD | ✅ | ✅ | ✅ |
| **Advanced Features** |
| Export PDF | ❌ | ✅ | ✅ |
| Export JSON | ❌ | ✅ | ✅ |
| GPT Test (Real) | ❌ | ✅ | ✅ |
| Cloud History | ❌ | ✅ | ✅ |
| Evaluator AI | ❌ | ✅ | ✅ |
| **Enterprise Features** |
| API Access | ❌ | ❌ | ✅ |
| Bundle Export (ZIP) | ❌ | ❌ | ✅ |
| White Label | ❌ | ❌ | ✅ |
| Multiple Seats | ❌ | ❌ | ✅ |

### **Feature Gating in UI**

```typescript
import { hasEntitlement } from '@/lib/billing/entitlements'

// Check if user can export PDF
const canExportPDF = await hasEntitlement(orgId, 'canExportPDF')

// Conditional rendering
{canExportPDF && (
  <Button onClick={handleExportPDF}>
    Export as PDF
  </Button>
)}
```

## 🔄 **WEBHOOK PROCESSING**

### **Supported Events**

1. **`customer.subscription.created`**
   - Creates subscription record
   - Applies plan entitlements
   - Logs plan change

2. **`customer.subscription.updated`**
   - Updates subscription record
   - Reapplies entitlements if plan changed
   - Logs plan change

3. **`customer.subscription.deleted`**
   - Updates subscription status
   - Applies pilot entitlements
   - Logs plan change

4. **`checkout.session.completed`**
   - Processes new subscriptions
   - Handles one-time payments

5. **`invoice.payment_succeeded`**
   - Updates subscription data
   - Handles successful payments

6. **`invoice.payment_failed`**
   - Updates subscription status
   - Handles failed payments

### **Idempotency**

The webhook handler includes idempotency protection:
- Tracks processed events in `webhook_events` table
- Skips duplicate events automatically
- Ensures data consistency

## 🧪 **TESTING**

### **Run Tests**
```bash
# Run all billing tests
pnpm test tests/billing.webhook.test.ts

# Run specific test suites
pnpm test --testNamePattern="Webhook Signature Verification"
```

### **Test Coverage**
- Webhook signature verification
- Event idempotency
- Subscription event handling
- Checkout session processing
- Invoice event processing
- Error handling and validation

### **Mock Data**
Tests include realistic Stripe webhook payloads for:
- Subscription creation/updates
- Checkout completion
- Invoice payments
- Error scenarios

## 📊 **MONITORING & LOGGING**

### **Webhook Logs**
- All webhook events are logged with timestamps
- Processing status and errors are tracked
- Event deduplication is monitored

### **Business Metrics**
- Plan changes are logged in `runs.telemetry`
- Subscription lifecycle events are tracked
- Entitlement changes are monitored

### **Performance Metrics**
- Webhook processing time
- Database operation latency
- Error rates and types

## 🚨 **ERROR HANDLING**

### **Common Error Scenarios**
1. **Invalid webhook signature**
   - Returns 400 with "Invalid signature"
   - Logs security violation

2. **Missing organization ID**
   - Returns 400 with "Could not extract org_id"
   - Logs data extraction failure

3. **Database errors**
   - Returns 500 with "Event processing failed"
   - Allows webhook retry

4. **Invalid plan codes**
   - Validated at multiple levels
   - Graceful fallback to pilot plan

### **Retry Logic**
- Failed webhooks are not marked as processed
- Stripe will retry failed deliveries
- Exponential backoff for repeated failures

## 🔒 **SECURITY FEATURES**

### **Authentication & Authorization**
- Webhook signature verification
- Organization membership validation
- RLS policies on all tables

### **Data Protection**
- No PII in logs
- Encrypted database connections
- Secure API key handling

### **Access Control**
- Service role for webhook processing
- User role for entitlement queries
- Organization-scoped data access

## 📈 **PERFORMANCE OPTIMIZATION**

### **Database Indexes**
- Optimized queries for entitlements
- Fast subscription lookups
- Efficient webhook event tracking

### **Caching Strategy**
- Entitlements cached at organization level
- Subscription data cached for quick access
- Webhook event deduplication

### **Async Processing**
- Non-blocking webhook handling
- Background entitlement updates
- Efficient database operations

## 🚀 **DEPLOYMENT**

### **Production Checklist**
- [ ] Environment variables configured
- [ ] Stripe products and prices created
- [ ] Webhook endpoint configured
- [ ] Database migration applied
- [ ] SSL certificates valid
- [ ] Monitoring configured

### **Health Checks**
```bash
# Test webhook endpoint
curl -X POST https://yourdomain.com/api/webhooks/stripe \
  -H "stripe-signature: test" \
  -d '{"test": true}'

# Test entitlements API
curl "https://yourdomain.com/api/entitlements?orgId=test" \
  -H "x-user-id: test"
```

## 🔧 **TROUBLESHOOTING**

### **Common Issues**

1. **Webhook signature verification fails**
   - Check `STRIPE_WEBHOOK_SECRET` in environment
   - Verify webhook endpoint URL
   - Check Stripe dashboard for secret

2. **Entitlements not updating**
   - Verify `pf_apply_plan_entitlements` function exists
   - Check database permissions
   - Review webhook event processing

3. **Checkout sessions not creating**
   - Verify Stripe API keys
   - Check product/price configuration
   - Review organization membership validation

### **Debug Mode**
Enable detailed logging by setting:
```bash
NODE_ENV=development
DEBUG=stripe:*,billing:*
```

## 📚 **ADDITIONAL RESOURCES**

### **Stripe Documentation**
- [Webhook Events](https://stripe.com/docs/webhooks)
- [Checkout Sessions](https://stripe.com/docs/payments/checkout)
- [Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)

### **Supabase Documentation**
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

### **Support**
For technical support or questions:
- Check the logs for detailed error messages
- Review the test suite for expected behavior
- Consult the Stripe dashboard for webhook delivery status

---

## ✨ **SUCCESS METRICS**

- **Webhook Success Rate**: ≥99% (7-day average)
- **Entitlement Sync Time**: <5 seconds
- **Checkout Completion**: <30 seconds
- **Zero Data Duplication**: 100% idempotent
- **Security Compliance**: 100% signature verification

**PromptForge v3 Billing System is production-ready and enterprise-grade!** 🚀
