# Contributing to PromptForge

Thank you for your interest in contributing to PromptForge! This document provides guidelines and instructions for contributors.

## 🚀 Quick Start

1. **Fork and clone** the repository
2. **Install dependencies**: `pnpm install`
3. **Set up environment**: Copy `env.example` to `.env.local` and configure
4. **Run tests**: `pnpm test`
5. **Start development**: `pnpm dev`

## 📋 Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database (local or Supabase)
- Stripe account (for billing features)
- SendGrid account (for email features)

## 🔧 Development Setup

### Environment Configuration

```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your actual values
nano .env.local
```

**Required variables:**
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook secret

### Database Setup

```bash
# Run database migrations
pnpm run migrate

# Or manually
node scripts/migrate.js

# Apply unified schema
node scripts/apply-unified-schema.js
```

## 🧪 Testing

### Run All Tests
```bash
pnpm test
```

### Run Specific Test Suites
```bash
# Unit tests
pnpm test:unit

# Integration tests
pnpm test:integration

# E2E tests
pnpm test:e2e
```

### Test Configuration
```bash
# Test configuration validation
node scripts/check-config.js

# Run PII detection
node scripts/intelligent-pii-scan.js

# Test security features
node scripts/test-security.js
```

## 🔒 Security and PII Management

### PII Detection and Cleanup

PromptForge includes automated tools to detect and clean Personally Identifiable Information (PII):

```bash
# Scan for PII issues
node scripts/intelligent-pii-scan.js

# Clean up identified PII
node scripts/cleanup-pii.js

# Comprehensive security scan
node scripts/security-scan.js
```

**Generated Reports:**
- `pii-scan-report.json`: Detailed PII detection results
- `pii-cleanup-report.json`: Cleanup operation summary
- `security-scan-report.json`: Security vulnerabilities

### CI Integration

These scripts are designed for CI/CD integration:

```yaml
# Example GitHub Actions workflow
- name: Security Scan
  run: node scripts/intelligent-pii-scan.js

- name: PII Cleanup
  run: node scripts/cleanup-pii.js

- name: Configuration Check
  run: node scripts/check-config.js
```

## 🗄️ Database Schema Changes

When modifying the database schema:

### 1. Create New Migration

```bash
# Create new migration file
touch supabase/migrations/$(date +%Y%m%d%H%M%S)_description.sql

# Or use Supabase CLI
supabase migration new description
```

### 2. Update Scripts

After schema changes, update these scripts:

- `scripts/apply-unified-schema.js`: Add new migration files
- `scripts/check-config.js`: Update required table checks
- `scripts/migrate.js`: Add new migration entries

### 3. Test Migration

```bash
# Test migration locally
node scripts/migrate.js

# Verify configuration
node scripts/check-config.js

# Test PII detection with new schema
node scripts/intelligent-pii-scan.js
```

### 4. Update Tests

```bash
# Update test data
node scripts/seed-demo.js

# Run tests to ensure compatibility
pnpm test
```

## 🎯 Entitlements and Feature Flags

When modifying entitlements:

### 1. Update Entitlements Configuration

```typescript
// lib/entitlements/types.ts
export const ENTITLEMENT_FLAGS = {
  canExportPDF: { score: 80, plans: ['pro', 'enterprise'] },
  canExportJSON: { score: 80, plans: ['pro', 'enterprise'] },
  canUseGptTestReal: { score: 80, plans: ['enterprise'] },
  canExportBundleZip: { score: 80, plans: ['enterprise'] }
};
```

### 2. Update Scripts

```bash
# Update entitlements test
node scripts/test-entitlements.js

# Verify configuration
node scripts/check-config.js
```

### 3. Test Entitlements

```bash
# Test entitlements system
pnpm test:entitlements

# Verify feature gating
node scripts/test-export-pipeline.js
```

## 📧 Email and SendGrid Configuration

### SendGrid Setup

```bash
# Configure SendGrid
node scripts/setup-sendgrid.js

# Test email delivery
node scripts/test-email-notifications.js
```

### Email Templates

Templates are generated in `sendgrid-template-*.html` files. Update these when modifying email content.

## 🔄 Backup and Recovery

### Database Backups

```bash
# Create backup
node scripts/supabase-backup.js

# Setup automated backups
bash scripts/setup-backup-cron.sh
```

### Recovery Procedures

```bash
# Restore from backup
node scripts/restore-backup.js

# Verify data integrity
node scripts/verify-fixes.js
```

## 🚀 Deployment

### Pre-deployment Checks

```bash
# Run all checks
node scripts/test-all.js

# Security validation
node scripts/test-security-lockdown.js

# Configuration validation
node scripts/check-config.js
```

### Production Deployment

```bash
# Deploy to production
bash scripts/deploy-production.sh

# Verify deployment
node scripts/verify-fixes.js
```

## 📝 Code Quality

### Linting and Type Checking

```bash
# Lint code
pnpm lint

# Type check
pnpm type-check

# Fix linting issues
pnpm lint:fix
```

### Pre-commit Hooks

```bash
# Setup pre-commit hooks
bash scripts/setup-pre-commit-hooks.sh

# Manual pre-commit check
bash scripts/setup-git-hooks.sh
```

## 🐛 Troubleshooting

### Common Issues

1. **Environment Variables Missing**
   ```bash
   node scripts/check-config.js
   ```

2. **Database Connection Issues**
   ```bash
   node scripts/migrate.js
   ```

3. **PII Detection False Positives**
   ```bash
   node scripts/intelligent-pii-scan.js
   # Review and update SAFE_PATTERNS if needed
   ```

4. **Test Failures**
   ```bash
   pnpm test --verbose
   node scripts/test-all.js
   ```

### Getting Help

- Check existing issues on GitHub
- Review test output and error logs
- Run diagnostic scripts: `node scripts/check-config.js`
- Consult the security documentation: `docs/SECURITY.md`

## 📚 Additional Resources

- **Security Guidelines**: `docs/SECURITY_BEST_PRACTICES.md`
- **Deployment Guide**: `DEPLOYMENT_CHECKLIST.md`
- **API Documentation**: `docs/`
- **Testing Guide**: `__tests__/README.md`

## 🤝 Contribution Guidelines

1. **Follow the existing code style** and patterns
2. **Write tests** for new functionality
3. **Update documentation** when changing APIs
4. **Run all tests** before submitting PRs
5. **Use conventional commit messages**
6. **Keep changes focused** and well-documented

## 📄 License

By contributing to PromptForge, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to PromptForge! 🚀
