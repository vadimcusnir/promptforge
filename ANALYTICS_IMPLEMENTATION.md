# 📊 Analytics & Observability Implementation

## Overview

PromptForge v3 now includes a comprehensive analytics and observability system that tracks user behavior, product usage, and system performance. This system is designed to provide insights for Product-Led Growth (PLG) and operational monitoring.

## 🎯 Key Features

### 1. Google Analytics 4 (GA4)
- **Pageview Tracking**: Automatic tracking of all page visits
- **Event Tracking**: Custom events for user interactions
- **User Journey**: Complete user flow analysis
- **Conversion Tracking**: Funnel analysis for pricing and checkout

### 2. Sentry Error Reporting
- **Error Capture**: Automatic error detection and reporting
- **Performance Monitoring**: Transaction and span tracking
- **Session Replay**: User session recording for debugging
- **Release Tracking**: Version-based error correlation

### 3. PLG Event Tracking
- **Landing Page Events**: CTA clicks, scroll depth, time on page
- **Pricing Events**: Plan views, selections, billing toggles
- **Checkout Events**: Start, completion, abandonment tracking
- **Feature Gates**: Entitlement and score-based access tracking
- **Paywall Events**: View and interaction tracking

### 4. Internal Analytics API
- **Event Storage**: Database storage for all analytics events
- **Pageview Storage**: Complete page visit history
- **External Forwarding**: Integration with Mixpanel and other services
- **Real-time Processing**: Immediate event availability

## 🚀 Implementation Details

### Environment Variables

```bash
# Analytics & Observability
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://your_sentry_dsn_here
NEXT_PUBLIC_APP_VERSION=1.0.0
MIXPANEL_TOKEN=your_mixpanel_token_here
```

### Core Components

#### 1. AnalyticsProvider (`components/analytics-provider.tsx`)
- Provides analytics context throughout the app
- Handles pageview tracking on route changes
- Manages GA4 and internal API calls

#### 2. ErrorBoundary (`components/error-boundary.tsx`)
- Catches React errors and reports to Sentry
- Provides user-friendly error messages
- Includes development debugging information

#### 3. Enhanced Analytics Hook (`hooks/use-analytics.ts`)
- PLG event tracking methods
- Legacy pricing analytics compatibility
- Automatic scroll depth and time tracking

#### 4. Telemetry SDK (`components/telemetry-sdk.tsx`)
- Pre-built components for common tracking needs
- Export and GPT test tracking wrappers
- Easy integration into existing components

### API Endpoints

#### `/api/analytics/track`
- **Method**: POST
- **Purpose**: Track custom analytics events
- **Payload**:
```json
{
  "event": "event_name",
  "properties": {},
  "timestamp": [EXAMPLE_phone: [EXAMPLE_PHONE_[EXAMPLE_PHONE_555-123-4567]]]789,
  "url": "current_url",
  "userId": "user_id"
}
```

#### `/api/analytics/pageview`
- **Method**: POST
- **Purpose**: Track page views
- **Payload**:
```json
{
  "url": "page_url",
  "title": "page_title",
  "timestamp": [EXAMPLE_phone: [EXAMPLE_PHONE_[EXAMPLE_PHONE_555-123-4567]]]789,
  "referrer": "referrer_url"
}
```

## 📈 PLG Events Implementation

### Landing Page Events
```typescript
analytics.landingCtaClick('hero_cta', 'above_fold')
analytics.landingCtaClick('feature_cta', 'below_fold')
```

### Pricing Events
```typescript
analytics.pricingView('pricing_page')
analytics.planSelected('pro_monthly', 'pro', false)
analytics.planSelected('enterprise_yearly', 'enterprise', true)
```

### Checkout Events
```typescript
analytics.checkoutStarted('pro_monthly', 'pro', false, 'user_123')
analytics.checkoutCompleted('pro_monthly', 'pro', 49, false, 'user_123')
```

### Gate Events
```typescript
analytics.gateHit('export_pdf', 'plan')
analytics.gateHit('gpt_test_real', 'entitlement')
analytics.gateHit('api_access', 'score')
```

### Paywall Events
```typescript
analytics.paywallViewed('export_pdf', 'pro')
analytics.paywallCtaClick('export_pdf', 'pro', 'upgrade')
analytics.paywallCtaClick('export_pdf', 'pro', 'close')
```

### Feature Usage Events
```typescript
analytics.gptTestReal('customer_service', { tone: 'professional', length: 'medium' })
analytics.exportPDF('customer_service', { watermark: true, metadata: true })
analytics.exportJSON('customer_service', { pretty: true, schema: true })
analytics.exportBundle('customer_service', { compression: true, password: false })
analytics.apiUsage('/api/generate', { module: 'customer_service', params: {} })
```

## 🔧 Integration Guide

### 1. Basic Event Tracking
```typescript
import { useAnalytics } from '@/hooks/use-analytics'

function MyComponent() {
  const analytics = useAnalytics()
  
  const handleClick = () => {
    analytics.landingCtaClick('demo_button', 'sidebar')
    // ... rest of click handler
  }
  
  return <button onClick={handleClick}>Try Demo</button>
}
```

### 2. Export Tracking
```typescript
import { TelemetryExport } from '@/components/telemetry-sdk'

<TelemetryExport 
  format="pdf" 
  moduleId="customer_service"
  options={{ watermark: true }}
  onExport={handleExport}
>
  <Button>Export PDF</Button>
</TelemetryExport>
```

### 3. GPT Test Tracking
```typescript
import { TelemetryGptTest } from '@/components/telemetry-sdk'

<TelemetryGptTest 
  moduleId="customer_service"
  params={{ tone: 'professional' }}
  onTest={handleGptTest}
>
  <Button>Test with Real GPT</Button>
</TelemetryGptTest>
```

### 4. Feature Gate Tracking
```typescript
import { useAnalytics } from '@/hooks/use-analytics'

function ExportButton() {
  const analytics = useAnalytics()
  const { hasEntitlement } = useEntitlements()
  
  const handleClick = () => {
    if (!hasEntitlement('canExportPDF')) {
      analytics.gateHit('export_pdf', 'plan')
      // Show paywall
      return
    }
    
    // Proceed with export
    analytics.exportPDF('module_id', {})
  }
  
  return <button onClick={handleClick}>Export PDF</button>
}
```

## 🧪 Testing

### 1. Run Test Script
```bash
node scripts/test-analytics.js
```

### 2. Browser Testing
1. Open browser developer tools
2. Navigate to Network tab
3. Perform actions (clicks, navigation, etc.)
4. Verify GA4 events and API calls

### 3. Sentry Testing
1. Trigger an error (e.g., undefined function call)
2. Check Sentry dashboard for error report
3. Verify error context and stack trace

### 4. Analytics Dashboard
1. Check GA4 Real-Time reports
2. Verify events appear in GA4
3. Check internal analytics database

## 📊 Data Flow

```
User Action → Component → Analytics Hook → AnalyticsProvider → GA4 + Internal API
     ↓
Page Change → Router → AnalyticsProvider → Pageview Tracking
     ↓
Error Occurrence → ErrorBoundary → Sentry → Error Dashboard
     ↓
Export/Feature → Telemetry SDK → Analytics Hook → Event Tracking
```

## 🔒 Privacy & Compliance

### Data Collection
- **No PII**: User IDs are hashed, emails are not tracked
- **Consent**: Analytics respect user privacy preferences
- **GDPR**: Compliant data handling and storage

### Data Retention
- **Analytics Events**: 12 months retention
- **Pageviews**: 6 months retention
- **Error Reports**: 3 months retention

### Data Export
- **User Data**: Available for download
- **Analytics**: Exportable in JSON format
- **Deletion**: Right to be forgotten supported

## 🚀 Production Deployment

### 0. Quick Setup Checklist
```bash
# 1. Set environment variables
cp env.template .env.local
# Edit .env.local with your actual values

# 2. Install dependencies
pnpm install

# 3. Run database migration
supabase db push

# 4. Test the setup
pnpm test:analytics:quick

# 5. Start development server
pnpm dev
```

### 1. Environment Setup
```bash
# Set production environment variables
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-PRODUCTION_ID
NEXT_PUBLIC_SENTRY_DSN=https://production_sentry_dsn
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 2. Database Migration
```sql
-- Create analytics tables
CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  event_name TEXT NOT NULL,
  properties JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  url TEXT,
  user_id TEXT,
  session_id TEXT,
  user_agent TEXT,
  ip_address INET
);

CREATE TABLE analytics_pageviews (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  referrer TEXT,
  session_id TEXT,
  user_agent TEXT,
  ip_address INET
);
```

### 3. Monitoring Setup
- **Sentry Alerts**: Error rate thresholds
- **GA4 Goals**: Conversion tracking setup
- **Performance Monitoring**: Core Web Vitals tracking

## 📈 Metrics & KPIs

### User Engagement
- **Page Views**: Total and unique page visits
- **Session Duration**: Average time on site
- **Bounce Rate**: Single-page sessions
- **Scroll Depth**: Content engagement

### Conversion Funnel
- **Landing → Pricing**: CTA click-through rate
- **Pricing → Checkout**: Plan selection rate
- **Checkout → Completion**: Conversion rate
- **Feature Adoption**: Export and API usage

### Product Usage
- **Module Usage**: Most popular prompt modules
- **Export Patterns**: Format preferences
- **GPT Testing**: Real vs. simulated usage
- **API Consumption**: Endpoint usage patterns

### Error Monitoring
- **Error Rate**: Percentage of failed requests
- **Performance**: Response time percentiles
- **User Impact**: Errors affecting user experience
- **Release Quality**: Error rate by version

## 🔮 Future Enhancements

### 1. Advanced Analytics
- **Cohort Analysis**: User behavior over time
- **A/B Testing**: Feature experiment tracking
- **Predictive Analytics**: Churn prediction models
- **Real-time Dashboards**: Live user activity

### 2. Enhanced Observability
- **Distributed Tracing**: Request flow visualization
- **Log Aggregation**: Centralized log management
- **Performance Profiling**: Detailed performance metrics
- **Alert Management**: Intelligent alerting system

### 3. Integration Expansion
- **Customer Data Platforms**: Segment, RudderStack
- **Business Intelligence**: Tableau, Power BI
- **Marketing Automation**: HubSpot, Marketo
- **Customer Success**: Intercom, Gainsight

## 📚 Resources

### Documentation
- [GA4 Developer Guide](https://developers.google.com/analytics/devguides/collection/ga4)
- [Sentry Documentation](https://docs.sentry.io/)
- [Product-Led Growth Framework](https://productled.com/)

### Tools
- [GA4 Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmopdfljkiccdipdladhgkkcpeahni)
- [Sentry Performance](https://sentry.io/for/performance/)
- [Mixpanel Analytics](https://mixpanel.com/)

### Best Practices
- [Analytics Implementation Guide](https://analytics.google.com/analytics/academy/)
- [Error Monitoring Best Practices](https://sentry.io/for/error-monitoring/)
- [PLG Metrics Framework](https://www.productled.org/metrics)
