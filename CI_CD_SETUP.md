# CI/CD Setup & Workflows

This document describes the complete CI/CD pipeline setup for the PromptForge project, including GitHub Actions workflows, deployment strategies, and database migration handling.

## 🚀 Overview

The CI/CD pipeline consists of several interconnected workflows that ensure code quality, security, and reliable deployments across different environments.

## 📁 Workflow Files

### 1. `ci-cd.yml` - Main CI/CD Pipeline

**Purpose**: Comprehensive pipeline that handles the entire development lifecycle
**Triggers**: Push to main/develop/staging, PRs, manual dispatch

**Jobs**:

- **install-deps**: Dependency installation with caching
- **lint**: Code quality checks (ESLint, TypeScript, formatting)
- **test**: Unit and integration tests with Jest
- **test-e2e**: End-to-end tests with Playwright
- **build**: Application build and artifact generation
- **db-migrations**: Database migration validation
- **security**: Security audits and vulnerability scanning
- **deploy-staging**: Staging environment deployment
- **deploy-production**: Production environment deployment

### 2. `database-migrations.yml` - Database Management

**Purpose**: Handles database migrations, validation, and deployment
**Triggers**: Push to main/staging/develop, PRs, manual dispatch

**Jobs**:

- **validate-migrations**: Migration file validation and syntax checking
- **run-migrations-staging**: Staging database migrations
- **run-migrations-production**: Production database migrations

### 3. `deploy.yml` - Deployment Pipeline

**Purpose**: Dedicated deployment workflow with pre-deployment checks
**Triggers**: Push to main/staging/develop, PRs, manual dispatch

**Jobs**:

- **pre-deploy**: Pre-deployment validation (lint, test, build)
- **deploy-staging**: Staging deployment
- **deploy-production**: Production deployment
- **post-deploy**: Post-deployment tasks and reporting

### 4. `dependency-management.yml` - Dependency Management

**Purpose**: Automated dependency updates, security audits, and SBOM generation
**Triggers**: Weekly schedule, manual dispatch, PRs

**Jobs**:

- **security-audit**: Security vulnerability scanning
- **update-dependencies**: Automated dependency updates
- **lockfile-check**: Lockfile integrity verification
- **generate-sbom**: Software Bill of Materials generation

### 5. `security.yml` - Security Workflow (Existing)

**Purpose**: Comprehensive security scanning and analysis
**Triggers**: Push to main/develop, PRs, weekly schedule

## 🔧 Configuration

### Environment Variables

```bash
NODE_VERSION=20.18.0
PNPM_VERSION=9.15.0
```

### Required Secrets

```bash
# Vercel Deployment
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id

# Supabase Database
SUPABASE_ACCESS_TOKEN=your_supabase_token
SUPABASE_STAGING_URL=your_staging_db_url
SUPABASE_PRODUCTION_URL=your_production_db_url

# Production URLs for health checks
PRODUCTION_URL=your_production_url
```

### Branch Strategy

- **main**: Production deployments
- **staging**: Staging deployments and testing
- **develop**: Development and feature testing

## 🚀 Deployment Flow

### 1. Development Flow

```
Feature Branch → develop → staging → main → production
```

### 2. Automated Triggers

- **Push to develop**: Triggers staging deployment
- **Push to main**: Triggers production deployment
- **PR to main/staging**: Runs full CI pipeline
- **Weekly schedule**: Security audits and dependency updates

### 3. Manual Triggers

- **Workflow dispatch**: Manual deployment to any environment
- **Database migrations**: Manual migration execution
- **Dependency updates**: Manual dependency management

## 🗄️ Database Migrations

### Migration Strategy

1. **Validation**: All migrations are validated before execution
2. **Staging First**: Migrations run on staging before production
3. **Rollback Support**: Built-in rollback mechanisms
4. **Version Control**: All migrations are version-controlled

### Migration Files Location

```
supabase/migrations/
├── 0001_base.sql
├── 0002_rls.sql
├── 0003_views.sql
├── 0004_indexes.sql
├── 0005_seed_data.sql
└── ...
```

### Migration Execution

```bash
# Staging
supabase db push --db-url $SUPABASE_STAGING_URL

# Production
supabase db push --db-url $SUPABASE_PRODUCTION_URL
```

## 🧪 Testing Strategy

### Test Types

1. **Unit Tests**: Jest-based component and function tests
2. **Integration Tests**: API endpoint and service tests
3. **E2E Tests**: Playwright-based user journey tests
4. **Security Tests**: Vulnerability scanning and SAST

### Test Commands

```bash
# Unit tests
pnpm run test

# Coverage report
pnpm run test:coverage

# E2E tests
pnpm run test:e2e

# Security tests
pnpm run security:full
```

## 🔒 Security Measures

### Security Workflows

1. **CodeQL Analysis**: Static code analysis
2. **Dependency Auditing**: npm audit and vulnerability scanning
3. **Secret Scanning**: TruffleHog integration
4. **SBOM Generation**: Software Bill of Materials
5. **ESLint Security**: Security-focused linting rules

### Security Commands

```bash
# Security audit
pnpm run audit

# Security linting
pnpm run lint:security

# SBOM generation
pnpm run sbom
```

## 📊 Monitoring & Observability

### Artifacts Generated

- Build artifacts (`.next/` directory)
- Test coverage reports
- Security audit reports
- SBOM files (JSON/XML)
- Playwright test reports

### Retention Policy

- Build artifacts: 7 days
- Test reports: 30 days
- SBOM files: 90 days
- Security reports: 30 days

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures

```bash
# Check Node.js version
node --version

# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check for TypeScript errors
npx tsc --noEmit
```

#### 2. Test Failures

```bash
# Run tests locally
pnpm run test

# Check test configuration
cat jest.config.js

# Run specific test file
pnpm run test -- path/to/test.spec.ts
```

#### 3. Deployment Issues

```bash
# Check Vercel configuration
vercel --version

# Verify environment variables
echo $VERCEL_TOKEN

# Check deployment status
vercel ls
```

#### 4. Database Migration Issues

```bash
# Check Supabase CLI
supabase --version

# Validate migration files
ls -la supabase/migrations/

# Test migration locally
supabase start
supabase db reset
```

### Debug Commands

```bash
# Check workflow status
gh run list

# View workflow logs
gh run view <run-id>

# Rerun failed workflow
gh run rerun <run-id>
```

## 📈 Performance Optimization

### Caching Strategy

1. **pnpm Store**: Global package cache
2. **Node Modules**: Local dependency cache
3. **Build Artifacts**: Next.js build cache
4. **Test Results**: Jest cache

### Parallel Execution

- Tests run in parallel across Node.js versions
- Security scans run independently
- Database operations are sequential for safety

## 🔄 Maintenance

### Weekly Tasks

- Security audits (automated)
- Dependency updates (automated)
- SBOM generation (automated)
- Performance monitoring

### Monthly Tasks

- Review and update workflow configurations
- Update GitHub Actions versions
- Review security policies
- Performance optimization

### Quarterly Tasks

- Major dependency updates
- Security policy reviews
- Infrastructure optimization
- Team training and documentation updates

## 📚 Additional Resources

### Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Migrations](https://supabase.com/docs/guides/cli/migrations)
- [Playwright Testing](https://playwright.dev/docs/intro)

### Tools

- **GitHub Actions**: CI/CD platform
- **Vercel**: Deployment platform
- **Supabase**: Database platform
- **Playwright**: E2E testing
- **Jest**: Unit testing
- **ESLint**: Code quality
- **CodeQL**: Security analysis

### Support

- GitHub Issues for workflow problems
- Team chat for deployment issues
- Documentation for configuration questions
- Security team for vulnerability reports

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Maintainer**: DevOps Team
