# 🔐 Configuration Management & Security Guide

## Overview

This guide covers the secure management of configuration files, environment variables, and secrets for PromptForge v3. It ensures that sensitive data is never committed to version control while maintaining a secure development workflow.

## 🚨 Security Principles

### 1. Never Commit Secrets
- ❌ **NEVER** commit `.env.local` files
- ❌ **NEVER** commit API keys, passwords, or tokens
- ❌ **NEVER** commit database credentials
- ❌ **NEVER** commit private keys or certificates

### 2. Use Environment Variables
- ✅ Store secrets in environment variables
- ✅ Use `.env.local` for local development
- ✅ Use `.env.local.example` for templates
- ✅ Use platform-specific environment management in production

### 3. Implement Security Scans
- ✅ Pre-commit hooks scan for sensitive data
- ✅ Automated CI/CD security checks
- ✅ Regular security audits
- ✅ PII detection and sanitization

## 📁 File Structure

```
promptforge/
├── .env.local.example          # Template with fictional values
├── .env.local                  # Local configuration (gitignored)
├── .gitignore                  # Excludes sensitive files
├── .git/hooks/                 # Security hooks
│   ├── pre-commit             # Scans commits for secrets
│   ├── commit-msg             # Checks commit messages
│   └── post-commit            # Logs commit activity
└── scripts/
    ├── setup-git-hooks.sh     # Installs security hooks
    ├── check-config.js         # Validates configuration
    └── security-scan.js        # Comprehensive security scan
```

## 🔧 Setup Instructions

### 1. Initial Configuration

```bash
# Copy the example configuration file
cp env.local.example .env.local

# Edit with your actual values
nano .env.local

# Verify configuration
node scripts/check-config.js
```

### 2. Install Security Hooks

```bash
# Make the setup script executable
chmod +x scripts/setup-git-hooks.sh

# Install git security hooks
./scripts/setup-git-hooks.sh
```

### 3. Verify Setup

```bash
# Check if hooks are installed
ls -la .git/hooks/

# Test configuration validation
node scripts/check-config.js

# Run security scan
node scripts/security-scan.js
```

## 🔒 Environment Variables

### Required Variables

#### Stripe Configuration
```bash
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

#### Supabase Configuration
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ_your_key_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ_your_key_here
```

#### NextAuth Configuration
```bash
NEXTAUTH_SECRET=your_32_character_random_string
NEXTAUTH_URL=http://localhost:3000
```

#### Application Configuration
```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development
```

### Optional Variables

#### Email Configuration (SendGrid)
```bash
SENDGRID_API_KEY=SG.your_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=PromptForge
```

#### Analytics Configuration
```bash
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
MIXPANEL_TOKEN=mp_your_token_here
```

#### Feature Flags
```bash
ENABLE_AB_TESTING=true
ENABLE_ANALYTICS=true
ENABLE_EMAIL_NOTIFICATIONS=true
```

## 🛡️ Security Hooks

### Pre-commit Hook

The pre-commit hook automatically scans staged files for:

- **API Keys**: Stripe, SendGrid, AWS, etc.
- **JWT Tokens**: Authentication tokens
- **Database URLs**: Connection strings with passwords
- **Private Keys**: RSA, DSA, EC private keys
- **Hardcoded Secrets**: Secrets embedded in code

### Commit-msg Hook

The commit-msg hook checks commit messages for:

- **Sensitive Patterns**: API key patterns, secret keywords
- **Long Messages**: Potentially containing sensitive data
- **Security Keywords**: Password, secret, key, token references

### Post-commit Hook

The post-commit hook provides:

- **Commit Logging**: Records all commit activity
- **Audit Trail**: Maintains security audit logs
- **Notifications**: Optional security alerts

## 🔍 Security Scanning

### Automated Scans

```bash
# Pre-commit security scan (automatic)
git commit -m "Your commit message"

# Manual security scan
node scripts/security-scan.js

# Configuration validation
node scripts/check-config.js

# PII detection
node scripts/intelligent-pii-scan.js
```

### CI/CD Security

The GitHub Actions workflow includes:

- **Automated Security Scans**: On every push/PR
- **Configuration Validation**: Environment variable checks
- **Secret Detection**: Automated secret scanning
- **Security Reports**: Detailed security analysis

## 🚨 Common Security Issues

### 1. Accidental Secret Commits

**Problem**: API keys committed to repository
```bash
# ❌ DON'T DO THIS
STRIPE_SECRET_KEY=sk_live_1234567890abcdef
```

**Solution**: Use environment variables
```bash
# ✅ DO THIS
STRIPE_SECRET_KEY=process.env.STRIPE_SECRET_KEY
```

### 2. Hardcoded Credentials

**Problem**: Database passwords in code
```typescript
// ❌ DON'T DO THIS
const dbUrl = "postgresql://user:password@localhost/db"
```

**Solution**: Use environment variables
```typescript
// ✅ DO THIS
const dbUrl = process.env.DATABASE_URL
```

### 3. Environment File Commits

**Problem**: `.env.local` committed to repository
```bash
# ❌ DON'T DO THIS
git add .env.local
git commit -m "Add environment configuration"
```

**Solution**: Use `.env.local.example` template
```bash
# ✅ DO THIS
cp env.local.example .env.local
# Edit .env.local with real values
# .env.local is already in .gitignore
```

## 🔧 Troubleshooting

### Hook Not Working

```bash
# Check if hooks are executable
ls -la .git/hooks/

# Reinstall hooks
./scripts/setup-git-hooks.sh

# Check git version
git --version
```

### Configuration Validation Fails

```bash
# Check if .env.local exists
ls -la .env.local

# Copy example file
cp env.local.example .env.local

# Edit with real values
nano .env.local

# Run validation again
node scripts/check-config.js
```

### Security Scan Issues

```bash
# Check for sensitive data
grep -r "sk_live_" . --exclude-dir=node_modules
grep -r "eyJ" . --exclude-dir=node_modules

# Remove sensitive data
git reset HEAD~1  # Undo last commit if needed

# Clean working directory
git clean -fd
```

## 📋 Best Practices

### 1. Development Workflow

```bash
# 1. Always start with example file
cp env.local.example .env.local

# 2. Edit with real values
nano .env.local

# 3. Verify configuration
node scripts/check-config.js

# 4. Commit changes (hooks will scan automatically)
git add .
git commit -m "Your commit message"
```

### 2. Production Deployment

```bash
# 1. Use platform environment variables
# Vercel, Netlify, Railway, etc.

# 2. Never commit production secrets
# Use secrets management services

# 3. Rotate secrets regularly
# Monthly or quarterly rotation

# 4. Monitor for exposed secrets
# Use automated scanning tools
```

### 3. Team Collaboration

```bash
# 1. Share env.local.example updates
git add env.local.example
git commit -m "Update environment template"

# 2. Document new environment variables
# Update this documentation

# 3. Review security hooks
# Ensure team members have hooks installed

# 4. Regular security training
# Educate team on security practices
```

## 🔄 Maintenance

### Regular Tasks

- **Monthly**: Review and rotate secrets
- **Quarterly**: Update security hooks
- **Semi-annually**: Security audit and review
- **Annually**: Comprehensive security assessment

### Monitoring

- **Commit Logs**: Review for security issues
- **Security Scans**: Monitor automated scan results
- **Environment Variables**: Audit for unused variables
- **Access Control**: Review repository access

## 📚 Additional Resources

### Documentation

- [Environment Variables Guide](https://nextjs.org/docs/basic-features/environment-variables)
- [Git Hooks Documentation](https://git-scm.com/docs/githooks)
- [Security Best Practices](https://owasp.org/www-project-top-ten/)

### Tools

- **git-secrets**: AWS git-secrets tool
- **truffleHog**: Secret scanning tool
- **detect-secrets**: Yelp's secret detection tool
- **pre-commit**: Framework for git hooks

### Support

- **GitHub Issues**: Report security issues
- **Security Team**: Contact for critical issues
- **Documentation**: This guide and related docs
- **Community**: Developer community forums

---

**🔒 Remember: Security is everyone's responsibility!**

- Never commit secrets
- Always use environment variables
- Keep security hooks updated
- Report security issues immediately
- Stay informed about security best practices

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: PromptForge Security Team
