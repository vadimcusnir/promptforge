#!/bin/bash

# PromptForge CI/CD Setup Script
# This script helps configure the CI/CD environment and validates the setup

set -e

echo "🚀 PromptForge CI/CD Setup Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "success")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "error")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "warning")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "info")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
    esac
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d ".github/workflows" ]; then
    print_status "error" "This script must be run from the project root directory"
    exit 1
fi

print_status "success" "Project structure validated"

# Check Node.js version
NODE_VERSION=$(node --version)
print_status "info" "Node.js version: $NODE_VERSION"

# Check pnpm
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    print_status "success" "pnpm version: $PNPM_VERSION"
else
    print_status "error" "pnpm is not installed. Please install pnpm first."
    exit 1
fi

# Check if .env.local exists
if [ -f ".env.local" ]; then
    print_status "success" ".env.local file found"
    
    # Check for required environment variables
    # Use grep to extract values instead of sourcing to avoid execution issues
    SUPABASE_URL=$(grep "^SUPABASE_URL=" .env.local | cut -d'=' -f2- | tr -d '"' | tr -d "'" || echo "")
    SUPABASE_SERVICE_ROLE_KEY=$(grep "^SUPABASE_SERVICE_ROLE_KEY=" .env.local | cut -d'=' -f2- | tr -d '"' | tr -d "'" || echo "")
    SUPABASE_ANON_KEY=$(grep "^SUPABASE_ANON_KEY=" .env.local | cut -d'=' -f2- | tr -d '"' | tr -d "'" || echo "")
    OPENAI_API_KEY=$(grep "^OPENAI_API_KEY=" .env.local | cut -d'=' -f2- | tr -d '"' | tr -d "'" || echo "")
    STRIPE_SECRET=$(grep "^STRIPE_SECRET=" .env.local | cut -d'=' -f2- | tr -d '"' | tr -d "'" || echo "")
    
    # Check Supabase configuration
    if [ -n "$SUPABASE_URL" ] && [ "$SUPABASE_URL" != "https://your-project.supabase.co" ]; then
        print_status "success" "SUPABASE_URL is configured"
    else
        print_status "warning" "SUPABASE_URL needs to be configured"
    fi
    
    if [ -n "$SUPABASE_SERVICE_ROLE_KEY" ] && [ "$SUPABASE_SERVICE_ROLE_KEY" != "your_service_role_key_here" ]; then
        print_status "success" "SUPABASE_SERVICE_ROLE_KEY is configured"
    else
        print_status "warning" "SUPABASE_SERVICE_ROLE_KEY needs to be configured"
    fi
    
    if [ -n "$SUPABASE_ANON_KEY" ] && [ "$SUPABASE_ANON_KEY" != "your_anon_key_here" ]; then
        print_status "success" "SUPABASE_ANON_KEY is configured"
    else
        print_status "warning" "SUPABASE_ANON_KEY needs to be configured"
    fi
    
    # Check OpenAI configuration
    if [ -n "$OPENAI_API_KEY" ] && [ "$OPENAI_API_KEY" != "your_openai_api_key_here" ]; then
        print_status "success" "OPENAI_API_KEY is configured"
    else
        print_status "warning" "OPENAI_API_KEY needs to be configured"
    fi
    
    # Check Stripe configuration
    if [ -n "$STRIPE_SECRET" ] && [ "$STRIPE_SECRET" != "your_stripe_secret_key_here" ]; then
        print_status "success" "STRIPE_SECRET is configured"
    else
        print_status "warning" "STRIPE_SECRET needs to be configured"
    fi
    
else
    print_status "warning" ".env.local file not found. Creating from template..."
    if [ -f "env.example" ]; then
        cp env.example .env.local
        print_status "success" "Created .env.local from env.example"
        print_status "info" "Please edit .env.local with your actual credentials"
    else
        print_status "error" "env.example not found. Please create .env.local manually"
    fi
fi

# Check GitHub Actions workflows
echo ""
print_status "info" "Checking GitHub Actions workflows..."

WORKFLOW_FILES=(
    ".github/workflows/ci-cd.yml"
    ".github/workflows/database-migrations.yml"
    ".github/workflows/deploy.yml"
    ".github/workflows/dependency-management.yml"
    ".github/workflows/quick-checks.yml"
    ".github/workflows/security.yml"
)

for workflow in "${WORKFLOW_FILES[@]}"; do
    if [ -f "$workflow" ]; then
        print_status "success" "Found: $workflow"
    else
        print_status "error" "Missing: $workflow"
    fi
done

# Check if workflows are properly configured
echo ""
print_status "info" "Validating workflow configurations..."

# Check for Vercel credentials in workflows
if grep -q "riCE7PWBxBmCvexa8yHW2ARt" .github/workflows/ci-cd.yml; then
    print_status "success" "Vercel credentials found in ci-cd.yml"
else
    print_status "warning" "Vercel credentials not found in ci-cd.yml"
fi

if grep -q "riCE7PWBxBmCvexa8yHW2ARt" .github/workflows/deploy.yml; then
    print_status "success" "Vercel credentials found in deploy.yml"
else
    print_status "warning" "Vercel credentials not found in deploy.yml"
fi

# Check package.json scripts
echo ""
print_status "info" "Checking package.json scripts..."

REQUIRED_SCRIPTS=("build" "test" "lint" "dev" "start")
for script in "${REQUIRED_SCRIPTS[@]}"; do
    if grep -q "\"$script\":" package.json; then
        print_status "success" "Script '$script' found"
    else
        print_status "warning" "Script '$script' missing"
    fi
done

# Check for test configuration
if [ -f "jest.config.js" ]; then
    print_status "success" "Jest configuration found"
else
    print_status "warning" "Jest configuration missing"
fi

if [ -f "playwright.config.ts" ]; then
    print_status "success" "Playwright configuration found"
else
    print_status "warning" "Playwright configuration missing"
fi

# Check for Supabase migrations
if [ -d "supabase/migrations" ]; then
    MIGRATION_COUNT=$(ls supabase/migrations/*.sql 2>/dev/null | wc -l)
    print_status "success" "Found $MIGRATION_COUNT migration files"
else
    print_status "warning" "Supabase migrations directory not found"
fi

# Test build process
echo ""
print_status "info" "Testing build process..."

if pnpm run build > /dev/null 2>&1; then
    print_status "success" "Build test passed"
else
    print_status "error" "Build test failed. Please check for errors above."
fi

# Test linting
echo ""
print_status "info" "Testing linting..."

if pnpm run lint > /dev/null 2>&1; then
    print_status "success" "Lint test passed"
else
    print_status "warning" "Lint test failed. Some issues found."
fi

# Summary
echo ""
echo "=================================="
print_status "info" "CI/CD Setup Summary"
echo "=================================="

print_status "info" "Next steps:"
echo "1. Configure your .env.local with actual credentials"
echo "2. Set up GitHub repository secrets if needed"
echo "3. Push to develop branch to test staging deployment"
echo "4. Push to main branch to test production deployment"
echo "5. Monitor GitHub Actions for any issues"

echo ""
print_status "info" "For Supabase migrations:"
echo "1. Get your Supabase project URL and keys"
echo "2. Add SUPABASE_STAGING_URL and SUPABASE_PRODUCTION_URL to secrets"
echo "3. Uncomment migration commands in database-migrations.yml"

echo ""
print_status "success" "Setup script completed!"
print_status "info" "Check the output above for any warnings or errors that need attention."
