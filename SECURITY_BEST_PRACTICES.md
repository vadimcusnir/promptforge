# 🔒 Security Best Practices for PromptForge v3

## ⚠️ CRITICAL SECURITY REQUIREMENTS

**NEVER commit real API keys, secrets, or sensitive configuration to version control!**

This document outlines the security measures implemented to prevent PII and secret exposure in PromptForge v3.

## 🚨 Immediate Actions Required

### 1. Environment Variables Security
- ✅ Use `.env.local` for actual values (already in `.gitignore`)
- ✅ Use `[EXAMPLE_PLACEHOLDER_...]` format for documentation
- ❌ NEVER commit `.env` files with real values
- ❌ NEVER use real API keys in README files

### 2. API Key Patterns to Avoid
```bash
# ❌ NEVER use these patterns in committed files:
[EXAMPLE_PLACEHOLDER_sk_live_...]
[EXAMPLE_PLACEHOLDER_pk_live_...]
whsec_1234567890abcdef...
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ✅ Use these safe patterns instead:
[EXAMPLE_PLACEHOLDER_sk_live_...]
[EXAMPLE_PLACEHOLDER_pk_live_...]
[EXAMPLE_PLACEHOLDER_whsec_...]
[EXAMPLE_PLACEHOLDER_eyJ...]
```

## 🛡️ Security Tools Implemented

### 1. Enhanced PII Detection Script
```bash
# Run comprehensive security scan
pnpm run security:scan

# Run comprehensive security check
pnpm run security:comprehensive
```

**Features:**
- Detects API keys, secrets, and sensitive patterns
- Identifies email addresses, phone numbers, credit cards
- Scans for hardcoded credentials
- Provides severity-based reporting

### 2. Git Hooks for Automated Security
```bash
# Set up automated security scanning
pnpm run security:hooks
```

**What it does:**
- Pre-commit hook: Blocks commits with security issues
- Post-commit hook: Logs successful commits for audit
- Automatic PII detection before every commit
- Environment file validation

### 3. Security Scan Scripts
```bash
# Quick security scan
node scripts/enhanced-pii-detection.js

# Comprehensive security check
./scripts/security-scan.sh

# Git hooks setup
./scripts/setup-git-hooks.sh
```

## 📋 Security Checklist

### Before Every Commit
- [ ] Run `pnpm run security:scan`
- [ ] Ensure no real API keys are present
- [ ] Verify `.env.local` is not staged
- [ ] Check for hardcoded credentials
- [ ] Review PII detection results

### Before Every Push
- [ ] Run `pnpm run security:comprehensive`
- [ ] Verify all security issues are resolved
- [ ] Check git hooks are working
- [ ] Review commit history for sensitive data

### Weekly Security Review
- [ ] Run full security scan
- [ ] Review environment variables
- [ ] Check for new security patterns
- [ ] Update security documentation

## 🔍 What Gets Scanned

### Critical Security Issues (Block Commit)
- Stripe API keys (`sk_live_`, `pk_live_`, etc.)
- Supabase keys (`eyJ...`)
- SendGrid API keys (`SG.`)
- Database URLs with credentials
- JWT secrets
- Credit card numbers

### High Priority Issues (Review Required)
- Email addresses (excluding examples)
- Phone numbers (excluding examples)
- Sensitive API endpoints
- Hardcoded passwords

### Medium Priority Issues (Monitor)
- UUIDs (excluding examples)
- Large files (>10MB)
- Console.log statements in production code

## 🚫 Files Never to Commit

```bash
# Environment files
.env
.env.local
.env.production
.env.staging
.env.development

# Configuration files with secrets
stripe-config.env
supabase-config.env
sendgrid-config.env

# Log files
*.log
logs/

# Backup files
*.backup
*.bak
*.old
```

## ✅ Safe Documentation Patterns

### Environment Variables
```bash
# ✅ Safe for documentation
STRIPE_SECRET_KEY=[EXAMPLE_PLACEHOLDER_sk_live_...]
SUPABASE_URL=[EXAMPLE_PLACEHOLDER_https://your-project.supabase.co]
SENDGRID_API_KEY=[EXAMPLE_PLACEHOLDER_SG...]

# ❌ Never use real values
STRIPE_SECRET_KEY=[EXAMPLE_PLACEHOLDER_sk_live_...]
SUPABASE_URL=https://real-project.supabase.co
SENDGRID_API_KEY=SG.real_key_here
```

### API Examples
```bash
# ✅ Safe for documentation
curl -X POST "https://yourdomain.com/api/webhooks/stripe"

# ❌ Never use real domains
curl -X POST "https://real-domain.com/api/webhooks/stripe"
```

## 🚨 Emergency Response

### If Secrets Are Accidentally Committed

1. **Immediate Actions:**
   ```bash
   # Revoke exposed secrets immediately
   # Rotate API keys
   # Check for unauthorized access
   ```

2. **Git History Cleanup:**
   ```bash
   # Remove from git history (if not pushed)
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch path/to/file' \
     --prune-empty --tag-name-filter cat -- --all
   ```

3. **Notification:**
   - Notify security team
   - Update affected services
   - Monitor for suspicious activity

## 🔧 Security Configuration

### .gitignore Entries
```gitignore
# Environment files
.env*
!.env.example
!.env.template

# Logs
logs/
*.log

# Backup files
*.backup
*.bak
*.old

# Configuration with secrets
*config.env
```

### Pre-commit Hook Configuration
```bash
# The pre-commit hook automatically:
# - Scans for PII and secrets
# - Validates environment files
# - Checks for large files
# - Blocks commits with security issues
```

## 📚 Security Resources

### Documentation
- [Stripe Security Best Practices](https://stripe.com/docs/security)
- [Supabase Security Guide](https://supabase.com/docs/guides/security)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)

### Tools
- [GitGuardian](https://gitguardian.com/) - Secret detection
- [TruffleHog](https://github.com/trufflesecurity/truffleHog) - Secret scanning
- [Bandit](https://bandit.readthedocs.io/) - Security linter

## 🎯 Security Goals

### Short Term (1-2 weeks)
- [ ] All team members use git hooks
- [ ] No critical security findings in scans
- [ ] Environment variables properly secured

### Medium Term (1-2 months)
- [ ] Automated security scanning in CI/CD
- [ ] Regular security audits
- [ ] Security training for team

### Long Term (3-6 months)
- [ ] Advanced threat detection
- [ ] Security compliance certification
- [ ] Penetration testing

## 📞 Security Contacts

- **Security Lead**: [Your Name]
- **Emergency Contact**: [Emergency Contact]
- **Security Email**: security@yourdomain.com

## 🔄 Updates

This document is updated regularly. Last updated: $(date)

---

**Remember: Security is everyone's responsibility. When in doubt, ask before committing!**
