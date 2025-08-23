#!/bin/bash

# PromptForge Supabase Setup Script
# This script helps set up the complete database schema

set -e

echo "🚀 PromptForge Supabase Setup"
echo "================================"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found. Please create it first with your Supabase credentials."
    exit 1
fi

# Load environment variables
export $(grep -v '^#' .env.local | xargs)

# Check required environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Missing required environment variables:"
    echo "   - SUPABASE_URL"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    exit 1
fi

echo "✅ Environment variables loaded"
echo "   Supabase URL: ${SUPABASE_URL}"
echo "   Service Role: ${SUPABASE_SERVICE_ROLE_KEY:0:20}..."

# Extract project ID from URL
PROJECT_ID=$(echo $SUPABASE_URL | sed 's|https://\([^.]*\)\.supabase\.co.*|\1|')
echo "   Project ID: $PROJECT_ID"

echo ""
echo "📋 Migration Instructions:"
echo "=========================="
echo ""
echo "1. Open your Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/$PROJECT_ID"
echo ""
echo "2. Go to SQL Editor (left sidebar)"
echo ""
echo "3. Run the following SQL commands in order:"
echo ""

# Check if migrations directory exists
if [ -d "supabase/migrations" ]; then
    echo "   a) First, check current status:"
    echo "      Copy and paste the contents of: supabase/migrations/CHECK_INSTALLATION_STATUS.sql"
    echo ""
    echo "   b) Run all migrations:"
    echo "      Copy and paste the contents of: supabase/migrations/run_all_migrations.sql"
    echo ""
    echo "   c) Verify installation:"
    echo "      SELECT * FROM run_all_qa_tests();"
    echo ""
else
    echo "   ❌ Migrations directory not found"
fi

echo ""
echo "4. Alternative: Run individual migrations in order:"
echo "   - 001_init_extensions_and_functions.sql"
echo "   - 002_orgs_members.sql"
echo "   - 003_billing_entitlements.sql"
echo "   - 004_catalog_engine.sql"
echo "   - 005_history_telemetry_scores.sql"
echo "   - 006_module_versioning.sql"
echo "   - 007_performance_indices.sql"
echo "   - 008_seed_data.sql"
echo "   - 009_qa_testing.sql"
echo ""

echo "5. After running migrations, verify:"
echo "   - All tables are created (orgs, plans, entitlements, modules, runs, etc.)"
echo "   - Functions are working (pf_apply_plan_entitlements, etc.)"
echo "   - Sample data is seeded"
echo ""

echo "🔍 Quick Status Check:"
echo "======================"

# Try to check if we can connect and see what's already there
if command -v psql &> /dev/null; then
    echo "Attempting to check current database status..."
    if [ ! -z "$POSTGRES_URL" ]; then
        echo "Using POSTGRES_URL for connection..."
        # This will fail gracefully if connection issues
        psql "$POSTGRES_URL" -c "SELECT 'Connection successful' as status;" 2>/dev/null || echo "   ❌ Direct connection failed - use Supabase dashboard instead"
    else
        echo "   ❌ POSTGRES_URL not set - use Supabase dashboard instead"
    fi
else
    echo "   ❌ psql not installed - use Supabase dashboard instead"
fi

echo ""
echo "📚 Migration Files Available:"
echo "=============================="
if [ -d "supabase/migrations" ]; then
    ls -la supabase/migrations/*.sql | head -10
    echo ""
    echo "Total migration files: $(ls supabase/migrations/*.sql | wc -l)"
else
    echo "   ❌ No migrations directory found"
fi

echo ""
echo "✅ Setup script completed!"
echo "   Next: Follow the migration instructions above using your Supabase dashboard"
echo ""
echo "🔗 Useful Links:"
echo "   - Supabase Dashboard: https://supabase.com/dashboard/project/$PROJECT_ID"
echo "   - SQL Editor: https://supabase.com/dashboard/project/$PROJECT_ID/sql"
echo "   - Database: https://supabase.com/dashboard/project/$PROJECT_ID/database"
