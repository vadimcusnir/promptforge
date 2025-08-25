# Database Migration & End-to-End Testing Guide

This guide covers running the production database migrations and performing comprehensive end-to-end testing for PromptForge v3.

## 🗄️ Database Migration

### 1. Production Database Setup

#### Prerequisites
- ✅ Supabase production project created
- ✅ Environment variables configured
- ✅ Database access credentials ready

#### Migration Steps

1. **Access Supabase Dashboard**
   - Go to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your production project
   - Navigate to SQL Editor

2. **Run Production Migration**
   ```sql
   -- Copy and paste the entire content of:
   -- supabase/migrations/011_production_schema.sql
   ```

3. **Verify Migration Success**
   - Check for success messages in the SQL output
   - Verify tables are created in the Table Editor
   - Confirm RLS policies are enabled

#### Expected Tables Created
- `users` - User profiles and authentication
- `customers` - Stripe customer records
- `subscriptions` - User subscription data
- `user_entitlements` - Feature access control
- `api_usage` - API rate limiting
- `enterprise_usage` - Enterprise API tracking
- `prompt_history` - User prompt generation history
- `export_bundles` - Export file bundles

#### Expected Indexes
- Performance indexes on all major lookup fields
- Composite indexes for complex queries
- Full-text search indexes where applicable

#### Security Features
- Row Level Security (RLS) enabled on all tables
- User isolation policies
- Secure access controls

### 2. Migration Verification

#### Check Table Creation
```sql
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

#### Verify RLS Policies
```sql
-- Check policies on key tables
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

#### Test Data Isolation
```sql
-- Verify users can only see their own data
-- This should be tested with actual user authentication
```

## 🧪 End-to-End Testing

### 1. Test Environment Setup

#### Run Environment Check
```bash
# Verify all environment variables are set
pnpm run env:check

# Expected: All required variables show ✅ SET
```

#### Run End-to-End Tests
```bash
# Execute comprehensive testing
pnpm run test:e2e

# Expected: All tests pass with ✅ status
```

### 2. Test Scenarios

#### User Registration & Authentication
- [ ] User can register with email/password
- [ ] User can log in successfully
- [ ] User session persists across page reloads
- [ ] User can log out

#### Plan Selection & Billing
- [ ] User can view pricing page
- [ ] User can select a plan (Creator/Pro/Enterprise)
- [ ] Stripe checkout initiates correctly
- [ ] Payment processing works
- [ ] User entitlements update after payment

#### Core Functionality
- [ ] Generator page loads with 7-D configurator
- [ ] Module selection works (M01-M50)
- [ ] Prompt generation executes successfully
- [ ] Test engine functions properly
- [ ] Export options display correctly

#### Entitlement Gating
- [ ] Free users limited to TXT exports
- [ ] Creator users can export MD
- [ ] Pro users can export PDF, JSON, ZIP
- [ ] Enterprise users have full access

#### Export Pipeline
- [ ] TXT export generates correctly
- [ ] MD export includes formatting
- [ ] PDF export creates valid file
- [ ] JSON export contains structured data
- [ ] ZIP bundles include all formats

#### Enterprise API
- [ ] API endpoint accessible
- [ ] Authentication required
- [ ] Rate limiting enforced
- [ ] Entitlement checks working
- [ ] Usage tracking operational

### 3. Manual Testing Checklist

#### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Device Testing
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

#### User Journey Testing
1. **New User Flow**
   - Visit homepage
   - Click "Get Started"
   - Register account
   - Select plan
   - Complete payment
   - Access dashboard

2. **Existing User Flow**
   - Login to account
   - Navigate to generator
   - Configure 7-D parameters
   - Select module
   - Generate prompt
   - Test prompt
   - Export in various formats

3. **Upgrade Flow**
   - Login with free account
   - Attempt premium feature
   - See upgrade prompt
   - Complete upgrade
   - Verify new features accessible

### 4. API Testing

#### Test API Endpoints
```bash
# Test entitlements endpoint
curl -X GET "https://chatgpt-prompting.com/api/entitlements" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test export endpoint
curl -X POST "https://chatgpt-prompting.com/api/export" \
  -H "Content-Type: application/json" \
  -d '{"format": "txt", "content": "test"}'

# Test Enterprise API
curl -X POST "https://chatgpt-prompting.com/api/run/M01" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"sevenDConfig": {...}}'
```

#### Verify Webhook Processing
1. **Stripe Webhook Testing**
   - Use Stripe CLI for local testing
   - Monitor webhook delivery in Stripe Dashboard
   - Check database updates after webhook events

2. **Webhook Events to Test**
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## 🔍 Testing Tools

### 1. Automated Testing
```bash
# Run all tests
pnpm run test:e2e

# Check environment
pnpm run env:check

# Type checking
pnpm run type-check

# Linting
pnpm run lint
```

### 2. Manual Testing Tools
- **Browser DevTools** - Console, Network, Performance
- **Stripe CLI** - Webhook testing
- **Postman/Insomnia** - API testing
- **Lighthouse** - Performance testing

### 3. Monitoring Tools
- **Supabase Dashboard** - Database monitoring
- **Stripe Dashboard** - Payment monitoring
- **Vercel Analytics** - Performance monitoring
- **Application Logs** - Error tracking

## 🚨 Common Issues & Solutions

### Database Migration Issues
1. **Permission Denied**
   - Ensure service role key has necessary permissions
   - Check database user roles

2. **Table Already Exists**
   - Migration uses `CREATE TABLE IF NOT EXISTS`
   - Safe to run multiple times

3. **RLS Policy Errors**
   - Verify auth.jwt() function availability
   - Check policy syntax

### Testing Issues
1. **Environment Variables Missing**
   - Run `pnpm run env:check`
   - Set missing variables in hosting platform

2. **API Endpoints Unavailable**
   - Check application deployment status
   - Verify endpoint URLs

3. **Stripe Integration Failures**
   - Verify API keys are correct
   - Check webhook endpoint configuration

## 📊 Success Criteria

### Migration Success
- ✅ All tables created successfully
- ✅ Indexes built for performance
- ✅ RLS policies enabled
- ✅ Functions and triggers working
- ✅ Seed data inserted

### Testing Success
- ✅ All automated tests pass
- ✅ Manual testing scenarios complete
- ✅ User journey functional end-to-end
- ✅ Entitlement gating working
- ✅ Export pipeline operational
- ✅ Enterprise API functional

### Production Readiness
- ✅ Environment configured
- ✅ Database migrated
- ✅ All tests passing
- ✅ Performance acceptable
- ✅ Security verified
- ✅ Monitoring configured

## 🚀 Go-Live Checklist

- [ ] Database migration completed successfully
- [ ] All end-to-end tests passing
- [ ] Manual testing completed
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] Monitoring and alerting configured
- [ ] Support documentation updated
- [ ] Team trained on new features
- [ ] Rollback plan prepared
- [ ] Production deployment scheduled

---

**Remember:** Always test in a staging environment first, and have a rollback plan ready before going live. Monitor closely after deployment and be prepared to address any issues quickly.
