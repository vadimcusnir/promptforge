# PromptForge Database Migrations

Complete Supabase/Postgres database schema with RLS for the PromptForge application.

## Quick Start

1. **Set Environment Variables**:
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE=your-service-role-key
   ```

2. **Run All Migrations**:
   Execute `run_all_migrations.sql` in your Supabase SQL editor, or run each migration individually in order.

3. **Verify Installation**:
   ```sql
   SELECT * FROM run_all_qa_tests();
   ```

## Migration Files

| File | Description | Purpose |
|------|-------------|---------|
| `001_init_extensions_and_functions.sql` | Extensions & utilities | Foundation setup |
| `002_orgs_members.sql` | Organizations & membership | Multi-tenant isolation |
| `003_billing_entitlements.sql` | Plans, billing & feature flags | Monetization & gating |
| `004_catalog_engine.sql` | Modules, domains & parameters | 7D Engine core |
| `005_history_telemetry_scores.sql` | History, runs & scoring | Audit trail & quality |
| `006_module_versioning.sql` | Module versioning | Production rollback capability |
| `007_performance_indices.sql` | Critical indices | O(1) gating & performance |
| `008_seed_data.sql` | Initial data | Plans, modules & demo org |
| `009_qa_testing.sql` | QA & verification | Testing & validation |

## Architecture Overview

### Multi-Tenant Isolation
- **Organizations**: Complete tenant isolation via RLS
- **Membership**: Role-based access (owner/admin/member)
- **Data Isolation**: All queries filtered by organization membership

### Feature Gating (O(1) Performance)
- **Plans**: Pilot, Pro, Enterprise with canonical flags
- **Entitlements**: Atomic feature flags with OR logic aggregation
- **Sources**: Plan, addon, pack, license, manual
- **Views**: `entitlements_effective_org`, `entitlements_effective_user`

### 7D Engine Support
- **Modules**: M01-M50 catalog with vectors, specs, KPIs
- **Domains**: CORE 25 industrial profiles with jargon, compliance
- **Parameters**: Scale, urgency, complexity, resources, application

### Quality & Export System
- **Scoring**: 5-dimension rubric (clarity, execution, ambiguity, alignment, business_fit)
- **Threshold**: ≥80 overall score required for export
- **Bundles**: Multi-format exports with checksum & license
- **Audit Trail**: Complete history with telemetry

## Key Features

### Security & Compliance
- ✅ Row Level Security (RLS) on all tables
- ✅ Multi-tenant isolation guaranteed at DB level
- ✅ Last owner protection (cannot delete/demote last owner)
- ✅ Service role separation (client vs admin operations)
- ✅ Audit trails with checksums and licensing

### Performance
- ✅ O(1) entitlement lookups via compound indices
- ✅ Critical indices for dashboard queries
- ✅ Partial indices for common filter patterns
- ✅ Query performance monitoring functions

### Data Integrity
- ✅ Foreign key constraints with cascade rules
- ✅ Check constraints for data validation
- ✅ Enum types for controlled vocabularies
- ✅ JSON schema validation for flexible fields

### Operational Excellence
- ✅ Complete rollback capability
- ✅ Module versioning with semantic versioning
- ✅ Comprehensive QA test suite
- ✅ Performance monitoring and optimization

## Usage Examples

### Feature Gating
```sql
-- Check if org can export PDF
SELECT value FROM entitlements_effective_org 
WHERE org_id = 'your-org-id' AND flag = 'canExportPDF';

-- Check user-specific entitlement
SELECT value FROM entitlements_effective_user 
WHERE org_id = 'your-org-id' AND user_id = 'your-user-id' AND flag = 'hasAPI';
```

### Generate → Score → Bundle Workflow
```sql
-- 1. Create run
INSERT INTO runs (...) VALUES (...);

-- 2. Score the output (≥80 for export)
INSERT INTO prompt_scores (run_id, clarity, execution, ambiguity, alignment, business_fit)
VALUES ('run-id', 85, 88, 15, 90, 82);

-- 3. Check if meets export threshold
SELECT run_meets_export_threshold('run-id'); -- Returns true if ≥80

-- 4. Create bundle if threshold met
INSERT INTO bundles (run_id, formats, paths, checksum, license_notice)
VALUES ('run-id', ARRAY['markdown', 'pdf'], {...}, 'sha256:...', 'License text');
```

### Plan Management
```sql
-- Apply plan entitlements to organization
SELECT pf_apply_plan_entitlements('org-id', 'pro');

-- Upgrade subscription
UPDATE subscriptions SET plan_code = 'enterprise' WHERE org_id = 'org-id';
SELECT pf_apply_plan_entitlements('org-id', 'enterprise');
```

## QA & Testing

Run the complete test suite:
```sql
SELECT * FROM run_all_qa_tests();
```

Individual test categories:
- **RLS Isolation**: Verify tenant separation
- **Entitlements**: Test feature flag system
- **Scoring & Bundles**: Validate quality workflow
- **Performance**: Check critical indices
- **Data Integrity**: Verify seed data
- **Security**: Test last owner protection

## Performance Monitoring

```sql
-- Check index usage
SELECT * FROM qa_performance_check WHERE usage_status = 'UNUSED';

-- Monitor query performance
SELECT * FROM analyze_query_performance();

-- Get org statistics
SELECT * FROM get_org_run_stats('org-id', 30); -- Last 30 days
```

## Rollback

⚠️ **WARNING**: This destroys all data!

```sql
\i 000_rollback_all.sql
```

## Production Considerations

1. **Backup Strategy**: Regular backups before schema changes
2. **Index Monitoring**: Monitor `pg_stat_user_indexes` for unused indices
3. **RLS Performance**: Ensure auth context is properly set for optimal RLS performance
4. **Entitlement Caching**: Consider application-level caching for frequently checked flags
5. **Module Versioning**: Use semantic versioning for production module updates

## Environment Setup

Required extensions:
- `pgcrypto` (for hashing and random UUIDs)
- `uuid-ossp` (for UUID generation)

Required roles:
- `authenticated` (for regular users)
- `anon` (for public access, limited)
- `service_role` (for server-side operations)

## Support

For issues or questions about the database schema:
1. Check the QA test results: `SELECT * FROM run_all_qa_tests();`
2. Verify data integrity: `SELECT * FROM qa_verification_summary;`
3. Review performance: `SELECT * FROM qa_performance_check;`
