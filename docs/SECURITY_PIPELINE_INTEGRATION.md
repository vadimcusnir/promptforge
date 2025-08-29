# 🔒 Security Pipeline Integration

⚠️ **SECURITY WARNING**: This documentation contains EXAMPLE data only!
- All sensitive data has been anonymized
- DO NOT use in production without proper sanitization
- This is documentation/example code only

## Overview

The Security Pipeline Integration automates security checks, PII detection, secret scanning, and performance testing in the CI/CD process. This ensures that all code changes are thoroughly vetted for security vulnerabilities before deployment.

## 🎯 Security Jobs

### 1. **PII Scan (`pii-scan`)**

**Purpose**: Detects Personal Identifiable Information (PII) in the codebase

**Script**: `scripts/test-pii-detection.js`

**What it scans for**:
- 🚨 **Critical Issues** (will fail the job):
  - Social Security Numbers (SSN)
  - Credit Card Numbers
  - API Keys (`sk_`, `pk_`, `AIza`, `ghp_`, `gho_`)
  - Private Keys (RSA, etc.)
  - AWS Credentials (`AKIA`)

- ⚠️ **Warning Issues** (won't fail the job):
  - Email addresses
  - Phone numbers
  - IP addresses
  - JWT tokens
  - Database connection strings

**Allowed Patterns**:
- `test@example.com` - Test email addresses
- `000-0000000` - Test phone numbers
- `sk_test_...` - Test Stripe keys
- `pk_test_...` - Test publishable keys

**Job Behavior**:
- ✅ **Passes**: No critical PII detected
- ❌ **Fails**: Critical PII found (blocks deployment)

### 2. **Secret Scan (`secret-scan`)**

**Purpose**: Detects accidentally committed secrets using git-secrets

**Tools**: 
- `git-secrets` (AWS tool)
- Custom security scanner

**What it scans for**:
- Live Stripe keys (`sk_live_`, `pk_live_`)
- Webhook secrets (`whsec_`)
- SendGrid API keys (`SG.`)
- AWS access keys (`AKIA`)
- JWT tokens (`eyJ...`)
- Database passwords
- Environment variables with real values

**Configuration**:
```bash
# Custom patterns added
git-secrets --add 'sk_live_[a-zA-Z0-9]{24,}'
git-secrets --add 'pk_live_[a-zA-Z0-9]{24,}'
git-secrets --add 'whsec_[a-zA-Z0-9]{32,}'
git-secrets --add 'SG\.[a-zA-Z0-9_-]{32,}'
git-secrets --add 'AKIA[0-9A-Z]{16}'
git-secrets --add 'eyJ[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,}'
```

**Job Behavior**:
- ✅ **Passes**: No secrets detected
- ❌ **Fails**: Secrets found (blocks deployment)

### 3. **Backup Test (`backup-test`)**

**Purpose**: Tests backup system functionality in a safe environment

**Script**: `scripts/supabase-backup.js`

**What it tests**:
- Backup script loading and dependencies
- Backup creation (with mock data)
- Backup verification
- Script functionality

**Safety Measures**:
- Uses test database configuration
- Mock environment variables
- No real database connections
- Test backup directory

**Environment Variables**:
```bash
export SUPABASE_URL="https://test-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="test-key-not-real"
export SUPABASE_ANON_KEY="test-anon-key-not-real"
export BACKUP_DIR="./test-backups"
```

**Job Behavior**:
- ✅ **Passes**: Backup scripts work correctly
- ⚠️ **Warning**: Expected failures in test environment
- ❌ **Fails**: Script not found or critical errors

### 4. **Lighthouse Performance Test (`lighthouse`)**

**Purpose**: Tests application performance and accessibility

**Tool**: Lighthouse CI (`@lhci/cli`)

**What it tests**:
- **Performance Metrics**:
  - First Contentful Paint (FCP) < 2000ms
  - Largest Contentful Paint (LCP) < 2500ms
  - Cumulative Layout Shift (CLS) < 0.1
  - Total Blocking Time (TBT) < 300ms

- **Quality Scores**:
  - Performance: ≥ 80%
  - Accessibility: ≥ 90%
  - Best Practices: ≥ 80%
  - SEO: ≥ 80%

**Navigation Duplication Check**:
```bash
# Check for single Header component
grep -r "role=\"banner\"" .next/ | wc -l | grep -q "1"

# Check for single Footer component  
grep -r "role=\"contentinfo\"" .next/ | wc -l | grep -q "1"
```

**Job Behavior**:
- ✅ **Passes**: All metrics meet thresholds
- ⚠️ **Warning**: Some metrics below threshold
- ❌ **Fails**: Critical accessibility issues or navigation duplication

## 🔄 Job Dependencies

### **Sequential Flow**:
```
lint-typecheck → [pii-scan, secret-scan, backup-test] → unit-tests → lighthouse → build → security-audit → deploy
```

### **Parallel Jobs**:
- `pii-scan`, `secret-scan`, `backup-test` run in parallel after `lint-typecheck`
- All security jobs must pass before `build` can start
- `build` must complete before `security-audit`

### **Deployment Gates**:
- **Preview Deployments**: Require `build` + `security-audit`
- **Production Deployments**: Require `build` + `security-audit` + main branch

## 🚨 Failure Handling

### **Critical Failures** (Block Deployment):
1. **PII Scan**: Critical PII detected
2. **Secret Scan**: Secrets found in code
3. **Navigation Duplication**: Multiple Header/Footer components
4. **Build Failures**: Application won't compile
5. **Security Audit**: High-severity vulnerabilities

### **Warning Failures** (Allow Deployment with Warning):
1. **Performance Issues**: Below threshold but not critical
2. **Non-critical PII**: Test patterns, example data
3. **Backup Test Warnings**: Expected in test environment
4. **Security Warnings**: Low-severity issues

### **Recovery Actions**:
1. **Immediate**: Remove critical PII/secrets
2. **Review**: Check warning patterns
3. **Fix**: Address performance issues
4. **Retest**: Re-run failed jobs

## 🛠️ Configuration

### **Environment Variables**:
```bash
# Required for deployment
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id

# Test environment (auto-set)
SUPABASE_URL=https://test-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=test-key-not-real
SUPABASE_ANON_KEY=test-anon-key-not-real
```

### **Lighthouse Configuration**:
```javascript
// .lighthouserc.js (auto-generated)
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage'
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', {minScore: 0.8}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['warn', {minScore: 0.8}],
        'categories:seo': ['warn', {minScore: 0.8}],
        'first-contentful-paint': ['warn', {'maxNumericValue': 2000}],
        'largest-contentful-paint': ['warn', {'maxNumericValue': 2500}],
        'cumulative-layout-shift': ['warn', {'maxNumericValue': 0.1}],
        'total-blocking-time': ['warn', {'maxNumericValue': 300}]
      }
    }
  }
}
```

## 📊 Monitoring & Reporting

### **Artifacts Generated**:
- `security-report.json`: Comprehensive security scan results
- `backup-test-results/`: Backup test output
- `lighthouse-results/`: Performance test results
- `build-files/`: Application build artifacts

### **Metrics Tracked**:
- **Security**: PII detection rate, secret exposure
- **Performance**: Core Web Vitals, Lighthouse scores
- **Quality**: Build success rate, test coverage
- **Compliance**: Security policy adherence

### **Notifications**:
- **PR Comments**: Preview deployment URLs
- **Job Status**: Pass/fail notifications
- **Security Alerts**: Critical issue notifications
- **Performance Reports**: Lighthouse score summaries

## 🔧 Troubleshooting

### **Common Issues**:

#### 1. **PII Scan Failing**:
```bash
# Check for false positives
node scripts/test-pii-detection.js

# Review detected patterns
# Ensure test data uses allowed patterns
```

#### 2. **Secret Scan Failing**:
```bash
# Check git history for secrets
git log --all --full-history -- "**/*"

# Remove secrets from history
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch file-with-secret' --prune-empty --tag-name-filter cat -- --all
```

#### 3. **Backup Test Warnings**:
```bash
# Check script dependencies
node -e "require('./scripts/supabase-backup.js')"

# Verify test environment
echo $SUPABASE_URL
echo $BACKUP_DIR
```

#### 4. **Lighthouse Performance Issues**:
```bash
# Run locally
npm install -g @lhci/cli
lhci autorun

# Check specific metrics
# Review bundle size, image optimization, etc.
```

### **Debug Mode**:
```bash
# Enable verbose logging
export DEBUG=*
export CI_DEBUG=true

# Run specific job locally
# Simulate CI environment
```

## 📋 Best Practices

### **Development Workflow**:
1. **Pre-commit**: Run security checks locally
2. **Branch Protection**: Require security checks to pass
3. **Code Review**: Security-focused review process
4. **Testing**: Include security tests in development

### **Security Guidelines**:
1. **Never commit secrets**: Use environment variables
2. **Use test data**: Follow allowed pattern guidelines
3. **Regular audits**: Schedule security reviews
4. **Dependency updates**: Keep packages current

### **Performance Guidelines**:
1. **Monitor Core Web Vitals**: Track LCP, CLS, FID
2. **Optimize images**: Use WebP, proper sizing
3. **Bundle analysis**: Regular size audits
4. **Caching strategy**: Implement proper caching

## 🚀 Future Enhancements

### **Planned Features**:
- **Dependency vulnerability scanning**: Automated CVE detection
- **Container security**: Docker image scanning
- **Infrastructure as Code**: Terraform security checks
- **Compliance reporting**: SOC2, GDPR compliance checks

### **Integration Opportunities**:
- **Slack notifications**: Security alert integration
- **Jira tickets**: Automatic issue creation
- **Security dashboards**: Real-time monitoring
- **Compliance automation**: Policy enforcement

---

**🔒 Remember**: Security is everyone's responsibility. The pipeline provides automated checks, but human review and best practices are essential for maintaining a secure codebase.
