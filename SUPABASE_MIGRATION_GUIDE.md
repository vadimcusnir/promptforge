# PromptForge Supabase Migration Guide

## 🚀 Quick Start

Your environment is already configured with Supabase credentials in `.env.local`. Now you need to run the database migrations to create all the required tables and functions.

## 📋 Prerequisites

✅ **Environment Variables** - Already configured in `.env.local`

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for admin operations
- `SUPABASE_ANON_KEY` - Anonymous key for client operations

✅ **Supabase Project** - Already created at: `https://siebamncfgfgbzorkiwo.supabase.co`

## 🔧 Migration Methods

### Method 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/siebamncfgfgbzorkiwo
   - Navigate to **SQL Editor** (left sidebar)

2. **Check Current Status**

   ```sql
   -- Copy and paste the contents of:
   -- supabase/migrations/CHECK_INSTALLATION_STATUS.sql
   ```

3. **Run All Migrations**

   ```sql
   -- Copy and paste the contents of:
   -- supabase/migrations/run_all_migrations.sql
   ```

4. **Verify Installation**
   ```sql
   SELECT * FROM run_all_qa_tests();
   ```

### Method 2: Individual Migrations

If you prefer to run migrations one by one, execute these in order:

1. **001_init_extensions_and_functions.sql** - Extensions & utilities
2. **002_orgs_members.sql** - Organizations & membership
3. **003_billing_entitlements.sql** - Plans, billing & feature flags
4. **004_catalog_engine.sql** - Modules, domains & parameters
5. **005_history_telemetry_scores.sql** - History, runs & scoring
6. **006_module_versioning.sql** - Module versioning system
7. **007_performance_indices.sql** - Critical performance indices
8. **008_seed_data.sql** - Initial data & demo content
9. **009_qa_testing.sql** - QA & verification functions

### Method 3: Automated Script

Use the provided Node.js script:

```bash
# Install dependencies if needed
npm install dotenv @supabase/supabase-js

# Run migrations
node scripts/migrate-supabase.js

# Check status only
node scripts/migrate-supabase.js status

# Verify installation
node scripts/migrate-supabase.js verify
```

## 🗄️ Database Schema Overview

### Core Tables

| Table           | Purpose            | Key Features                               |
| --------------- | ------------------ | ------------------------------------------ |
| `orgs`          | Organizations      | Multi-tenant isolation, slug-based routing |
| `org_members`   | Membership & roles | Owner/admin/member roles with RLS          |
| `plans`         | Subscription plans | Pilot, Pro, Enterprise with feature flags  |
| `entitlements`  | Feature gating     | Atomic flags with OR logic aggregation     |
| `modules`       | 7D Engine modules  | M01-M50 catalog with vectors & specs       |
| `domains`       | Industrial domains | CORE 25 profiles with jargon & compliance  |
| `runs`          | Generation history | Complete audit trail with telemetry        |
| `prompt_scores` | Quality scoring    | 5-dimension rubric (≥80 for export)        |
| `bundles`       | Export packages    | Multi-format with checksums & licensing    |

### Key Functions

- `pf_apply_plan_entitlements(org_id, plan_code)` - Apply plan features
- `run_meets_export_threshold(run_id)` - Check export eligibility
- `get_org_run_stats(org_id, days)` - Analytics & reporting
- `run_all_qa_tests()` - Complete system verification

## 🔒 Security Features

- **Row Level Security (RLS)** on all tables
- **Multi-tenant isolation** guaranteed at database level
- **Last owner protection** (cannot delete/demote last owner)
- **Service role separation** (client vs admin operations)
- **Audit trails** with checksums and licensing

## 📊 Performance Features

- **O(1) entitlement lookups** via compound indices
- **Critical indices** for dashboard queries
- **Partial indices** for common filter patterns
- **Query performance monitoring** functions

## 🧪 Verification & Testing

After running migrations, verify everything works:

```sql
-- Run complete QA test suite
SELECT * FROM run_all_qa_tests();

-- Check table counts
SELECT
    schemaname,
    tablename,
    n_tup_ins as rows_inserted
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Verify key functions exist
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_type = 'FUNCTION'
ORDER BY routine_name;
```

## 🚨 Troubleshooting

### Common Issues

1. **"Function not found" errors**
   - Ensure migrations ran in correct order
   - Check for SQL syntax errors in migration files

2. **"Permission denied" errors**
   - Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
   - Check if RLS policies are properly configured

3. **"Table already exists" errors**
   - Some migrations are idempotent
   - This is usually not a problem

4. **Connection issues**
   - Verify `SUPABASE_URL` is correct
   - Check if project is active and accessible

### Rollback

If you need to start over:

```sql
-- ⚠️ WARNING: This destroys all data!
-- Copy and paste the contents of:
-- supabase/migrations/000_rollback_all.sql
```

## 🔗 Useful Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/siebamncfgfgbzorkiwo
- **SQL Editor**: https://supabase.com/dashboard/project/siebamncfgfgbzorkiwo/sql
- **Database**: https://supabase.com/dashboard/project/siebamncfgfgbzorkiwo/database
- **API Docs**: https://supabase.com/dashboard/project/siebamncfgfgbzorkiwo/api

## 📝 Next Steps

After successful migration:

1. **Test the application** - Verify all features work
2. **Check entitlements** - Ensure feature gating works
3. **Test exports** - Verify bundle generation
4. **Monitor performance** - Check query performance
5. **Set up monitoring** - Configure alerts and logging

## 🆘 Support

If you encounter issues:

1. Check the QA test results: `SELECT * FROM run_all_qa_tests();`
2. Verify data integrity: `SELECT * FROM qa_verification_summary;`
3. Review performance: `SELECT * FROM qa_performance_check;`
4. Check migration logs in Supabase dashboard

---

**Note**: This migration creates a production-ready database with enterprise-grade security, performance, and scalability features. All tables include proper constraints, indices, and RLS policies.
