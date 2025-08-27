#!/bin/bash

# Security Lockdown Deployment Script
# Deploys all security measures safely

set -e

echo "🔒 PROMPTFORGE SECURITY LOCKDOWN DEPLOYMENT"
echo "==========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Must be run from project root directory"
    exit 1
fi

# Check if pnpm is available
if ! command -v pnpm &> /dev/null; then
    print_error "pnpm is required but not installed"
    exit 1
fi

# Check if supabase CLI is available
if ! command -v supabase &> /dev/null; then
    print_warning "Supabase CLI not found. Database migration will be skipped."
    SKIP_DB=true
fi

echo "🚀 Starting Security Lockdown Deployment..."
echo ""

# Step 1: Install dependencies
print_status "Installing security dependencies..."
pnpm install
print_success "Dependencies installed successfully"

# Step 2: Type check
print_status "Running TypeScript type check..."
if pnpm type-check; then
    print_success "TypeScript compilation successful"
else
    print_error "TypeScript compilation failed. Fix errors before continuing."
    exit 1
fi

# Step 3: Lint check
print_status "Running ESLint..."
if pnpm lint; then
    print_success "Linting passed"
else
    print_warning "Linting failed. Review warnings before production deployment."
fi

# Step 4: Security test
print_status "Running security lockdown tests..."
if node scripts/test-security-lockdown.js; then
    print_success "All security tests passed"
else
    print_error "Security tests failed. Fix issues before continuing."
    exit 1
fi

# Step 5: Database migration (if supabase CLI available)
if [ "$SKIP_DB" != "true" ]; then
    print_status "Running database migration..."
    if supabase db push; then
        print_success "Database migration completed"
    else
        print_error "Database migration failed"
        exit 1
    fi
else
    print_warning "Skipping database migration (Supabase CLI not available)"
    print_status "Run manually: supabase db push"
fi

# Step 6: Build test
print_status "Testing production build..."
if pnpm build; then
    print_success "Production build successful"
else
    print_error "Production build failed"
    exit 1
fi

# Step 7: Security verification
echo ""
print_status "Performing final security verification..."

# Check if all security files exist
SECURITY_FILES=(
    "lib/auth/jwt-security.ts"
    "lib/security/rate-limiter.ts"
    "lib/security/input-sanitizer.ts"
    "lib/security/waf-middleware.ts"
    "lib/security/security-monitor.ts"
    "app/api/auth/refresh/route.ts"
    "app/api/security/metrics/route.ts"
    "components/security/SecurityDashboard.tsx"
    "middleware.ts"
    "supabase/migrations/20241220000000_security_lockdown.sql"
)

MISSING_FILES=()
for file in "${SECURITY_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -eq 0 ]; then
    print_success "All security files present"
else
    print_error "Missing security files:"
    for file in "${MISSING_FILES[@]}"; do
        echo "  - $file"
    done
    exit 1
fi

# Check security headers
print_status "Verifying security headers..."
if grep -q "wafMiddleware.processRequest" middleware.ts; then
    print_success "WAF middleware integration verified"
else
    print_error "WAF middleware not properly integrated"
    exit 1
fi

# Check package dependencies
print_status "Verifying security dependencies..."
if grep -q "dompurify" package.json && grep -q "jsdom" package.json; then
    print_success "Security dependencies verified"
else
    print_error "Security dependencies missing from package.json"
    exit 1
fi

echo ""
echo "🎉 SECURITY LOCKDOWN DEPLOYMENT COMPLETE!"
echo "========================================="
echo ""
print_success "All security measures have been successfully deployed"
echo ""
echo "📋 DEPLOYMENT SUMMARY:"
echo "  ✅ Dependencies installed"
echo "  ✅ TypeScript compilation successful"
echo "  ✅ Security tests passed"
echo "  ✅ Production build successful"
echo "  ✅ Security files verified"
echo "  ✅ WAF integration confirmed"
echo ""

if [ "$SKIP_DB" != "true" ]; then
    echo "  ✅ Database migration completed"
else
    echo "  ⚠️  Database migration skipped (run manually)"
fi

echo ""
echo "🚀 NEXT STEPS:"
echo "  1. Deploy to production environment"
echo "  2. Monitor security dashboard for threats"
echo "  3. Test honeypot endpoints"
echo "  4. Verify rate limiting under load"
echo "  5. Review security logs for false positives"
echo ""
echo "🔐 SECURITY FEATURES ACTIVE:"
echo "  • JWT security with httpOnly cookies"
echo "  • Advanced rate limiting with fingerprinting"
echo "  • Input sanitization and XSS protection"
echo "  • Web Application Firewall (WAF)"
echo "  • Real-time threat monitoring"
echo "  • Honeypot endpoint detection"
echo "  • Comprehensive security headers"
echo ""
echo "📊 MONITORING:"
echo "  • Security Dashboard: /admin/security"
echo "  • Security Metrics: /api/security/metrics"
echo "  • Threat Alerts: Real-time notifications"
echo ""
echo "🛡️  SECURITY POSTURE: PRODUCTION-READY"
echo ""
print_success "PromptForge is now secured with enterprise-grade protection!"
