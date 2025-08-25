# Production Deployment Checklist

This guide covers the complete production deployment process for PromptForge v3.

## 🚀 Pre-Deployment Checklist

### Environment Variables
- [ ] **Supabase Configuration**
  - [ ] `SUPABASE_URL` - Production Supabase project URL
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` - Service role key for server operations
  - [ ] `SUPABASE_ANON_KEY` - Anonymous key for client operations

- [ ] **Stripe Configuration**
  - [ ] `STRIPE_SECRET_KEY` - Live secret key (sk_live_...)
  - [ ] `STRIPE_WEBHOOK_SECRET` - Webhook signing secret (whsec_...)
  - [ ] `STRIPE_CREATOR_MONTHLY_PRICE_ID` - Creator plan monthly price ID
  - [ ] `STRIPE_CREATOR_ANNUAL_PRICE_ID` - Creator plan annual price ID
  - [ ] `STRIPE_PRO_MONTHLY_PRICE_ID` - Pro plan monthly price ID
  - [ ] `STRIPE_PRO_ANNUAL_PRICE_ID` - Pro plan annual price ID
  - [ ] `STRIPE_ENTERPRISE_MONTHLY_PRICE_ID` - Enterprise plan monthly price ID
  - [ ] `STRIPE_ENTERPRISE_ANNUAL_PRICE_ID` - Enterprise plan annual price ID

- [ ] **OpenAI Configuration**
  - [ ] `OPENAI_API_KEY` - Production OpenAI API key

- [ ] **Application Configuration**
  - [ ] `NEXT_PUBLIC_APP_URL` - Production application URL (https://yourdomain.com)
  - [ ] `STRIPE_SUCCESS_URL` - Success redirect URL
  - [ ] `STRIPE_CANCEL_URL` - Cancel redirect URL
  - [ ] `NEXT_PUBLIC_SITE_NAME` - Application name
  - [ ] `EXPORT_WATERMARK_TRIAL` - Trial user watermark text

### Stripe Setup
- [ ] **Products Created**
  - [ ] PromptForge Creator plan
  - [ ] PromptForge Pro plan
  - [ ] PromptForge Enterprise plan

- [ ] **Pricing Configured**
  - [ ] Monthly prices set for all plans
  - [ ] Annual prices set for all plans
  - [ ] Price IDs copied to environment variables

- [ ] **Webhook Configuration**
  - [ ] Webhook endpoint created: `https://yourdomain.com/api/webhooks/stripe`
  - [ ] Events configured:
    - [ ] `customer.subscription.created`
    - [ ] `customer.subscription.updated`
    - [ ] `customer.subscription.deleted`
    - [ ] `invoice.payment_succeeded`
    - [ ] `invoice.payment_failed`
    - [ ] `customer.subscription.trial_will_end`
  - [ ] Webhook signing secret obtained and configured

### Database Setup
- [ ] **Supabase Production Instance**
  - [ ] Production project created
  - [ ] Database schema migrated
  - [ ] RLS policies configured
  - [ ] Required tables created:
    - [ ] `subscriptions`
    - [ ] `user_entitlements`
    - [ ] `customers`
    - [ ] `api_usage`
    - [ ] `enterprise_usage`

- [ ] **Database Security**
  - [ ] Row Level Security enabled on all tables
  - [ ] RLS policies tested
  - [ ] Service role key has necessary permissions
  - [ ] Anonymous key restricted to public operations

## 🏗️ Deployment Process

### 1. Code Preparation
- [ ] **Final Testing**
  - [ ] `pnpm type-check` passes with no errors
  - [ ] `pnpm lint` passes with no critical errors
  - [ ] `pnpm build` completes successfully
  - [ ] All tests pass (if applicable)

- [ ] **Environment Validation**
  - [ ] Run `pnpm run env:check` locally
  - [ ] Verify all required variables are set
  - [ ] Check for placeholder values

### 2. Platform Deployment

#### Vercel Deployment
- [ ] **Project Configuration**
  - [ ] Vercel project created and linked
  - [ ] Git repository connected
  - [ ] Build settings configured

- [ ] **Environment Variables**
  - [ ] All required variables set in Vercel dashboard
  - [ ] Variables assigned to Production environment
  - [ ] Variables assigned to Preview environment (if needed)

- [ ] **Deploy**
  - [ ] Push to main branch triggers deployment
  - [ ] Build completes successfully
  - [ ] Application accessible at production URL

#### Alternative Platforms
- [ ] **Railway/Render/Heroku**
  - [ ] Platform account configured
  - [ ] Environment variables set
  - [ ] Build and deployment successful

### 3. Post-Deployment Verification

#### Application Health
- [ ] **Basic Functionality**
  - [ ] Homepage loads correctly
  - [ ] Navigation works
  - [ ] Authentication pages accessible

- [ ] **Core Features**
  - [ ] Generator page loads
  - [ ] Module selection works
  - [ ] 7-D configuration functional
  - [ ] Export options available

#### API Endpoints
- [ ] **Stripe Integration**
  - [ ] `/api/billing/create-checkout` responds correctly
  - [ ] Webhook endpoint accessible
  - [ ] Checkout flow works end-to-end

- [ ] **Core APIs**
  - [ ] `/api/entitlements` returns user permissions
  - [ ] `/api/export` handles export requests
  - [ ] `/api/run/[moduleId]` accessible for Enterprise users

#### Database Operations
- [ ] **User Management**
  - [ ] User registration works
  - [ ] User login functional
  - [ ] User entitlements properly set

- [ ] **Subscription Flow**
  - [ ] Stripe checkout creates subscription
  - [ ] Webhook updates database
  - [ ] User entitlements updated correctly

## 🔍 Monitoring & Testing

### 1. Stripe Dashboard
- [ ] **Webhook Monitoring**
  - [ ] Webhook delivery status
  - [ ] Failed webhook attempts
  - [ ] Webhook response times

- [ ] **Subscription Monitoring**
  - [ ] Active subscriptions count
  - [ ] Subscription lifecycle events
  - [ ] Payment success/failure rates

### 2. Application Monitoring
- [ ] **Performance**
  - [ ] Page load times
  - [ ] API response times
  - [ ] Error rates

- [ ] **User Experience**
  - [ ] Checkout completion rate
  - [ ] User conversion funnel
  - [ ] Support ticket volume

### 3. Database Monitoring
- [ ] **Supabase Dashboard**
  - [ ] Database performance
  - [ ] Query execution times
  - [ ] Storage usage

- [ ] **Security**
  - [ ] RLS policy effectiveness
  - [ ] Unauthorized access attempts
  - [ ] Data isolation between users

## 🚨 Troubleshooting

### Common Deployment Issues

1. **Environment Variables Not Set**
   - Check Vercel dashboard
   - Verify variable names match exactly
   - Restart deployment after adding variables

2. **Database Connection Failed**
   - Verify Supabase credentials
   - Check network connectivity
   - Verify RLS policies

3. **Stripe Webhook Failures**
   - Check webhook endpoint URL
   - Verify webhook secret
   - Monitor webhook delivery logs

4. **Build Failures**
   - Check TypeScript compilation
   - Verify all dependencies installed
   - Check for syntax errors

### Rollback Plan
- [ ] **Immediate Rollback**
  - [ ] Revert to previous deployment
  - [ ] Disable problematic features
  - [ ] Communicate with users

- [ ] **Investigation**
  - [ ] Review application logs
  - [ ] Check monitoring dashboards
  - [ ] Identify root cause

- [ ] **Fix and Redeploy**
  - [ ] Apply necessary fixes
  - [ ] Test locally
  - [ ] Redeploy with fixes

## 📋 Final Verification

### End-to-End Testing
- [ ] **User Journey**
  - [ ] User visits pricing page
  - [ ] User selects plan and subscribes
  - [ ] Stripe checkout completes
  - [ ] User redirected to dashboard
  - [ ] User entitlements updated
  - [ ] User can access paid features

- [ ] **Export Pipeline**
  - [ ] Free users get .txt exports
  - [ ] Creator users get .md exports
  - [ ] Pro/Enterprise users get all formats
  - [ ] Bundles include manifest and checksum

- [ ] **Enterprise API**
  - [ ] API endpoint accessible
  - [ ] Rate limiting functional
  - [ ] Entitlement checks working
  - [ ] Usage tracking operational

### Performance Validation
- [ ] **Load Testing**
  - [ ] Application handles expected load
  - [ ] Database queries optimized
  - [ ] API response times acceptable

- [ ] **Security Validation**
  - [ ] RLS policies enforced
  - [ ] API endpoints secured
  - [ ] User data isolated

## 🎉 Go-Live Checklist

- [ ] All environment variables configured
- [ ] Stripe products and webhooks set up
- [ ] Database schema migrated and tested
- [ ] Application deployed and accessible
- [ ] Core functionality verified
- [ ] Payment flow tested end-to-end
- [ ] Monitoring and alerting configured
- [ ] Support documentation updated
- [ ] Team notified of deployment
- [ ] Users can access new features

## 📞 Support Contacts

- **Development Team:** [team-email]
- **DevOps/Infrastructure:** [devops-email]
- **Stripe Support:** [support.stripe.com](https://support.stripe.com)
- **Supabase Support:** [supabase.com/support](https://supabase.com/support)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)

---

**Remember:** Always test in a staging environment before deploying to production. Monitor closely after deployment and be prepared to rollback if issues arise.
