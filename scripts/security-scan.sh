#!/bin/bash

# =============================================================================
# Security Scan Script for PromptForge v3
# =============================================================================
# 
# This script runs comprehensive security checks including:
# - PII detection
# - Secret scanning
# - Environment file validation
# - Git hooks verification
#
# Usage: ./scripts/security-scan.sh
# =============================================================================

set -e

echo "🔒 Running comprehensive security scan..."

# Get the directory of the git repository
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# Check if git hooks are properly set up
echo "🔧 Checking git hooks setup..."
if [ -f ".git/hooks/pre-commit" ]; then
    echo "✅ Pre-commit hook found"
else
    echo "❌ Pre-commit hook missing"
    echo "   Run: ./scripts/setup-git-hooks.sh"
fi

# Check for .env files that might contain secrets
echo "🔍 Checking for environment files..."
ENV_FILES=$(find . -name ".env*" -not -path "./node_modules/*" -not -path "./.git/*")
if [ -n "$ENV_FILES" ]; then
    echo "⚠️  Environment files found:"
    echo "$ENV_FILES"
    echo ""
    echo "   Ensure these are not committed to version control."
    echo "   Use .env.local for actual values (already in .gitignore)."
else
    echo "✅ No environment files found"
fi

# Run the enhanced PII detection script
echo "🔍 Running PII detection scan..."
if node scripts/enhanced-pii-detection.js; then
    echo "✅ PII detection scan passed"
else
    echo "❌ PII detection scan failed!"
    echo "   Please fix all security issues."
    exit 1
fi

# Check for common security anti-patterns
echo "🔍 Checking for security anti-patterns..."

# Check for hardcoded credentials
HARDCODED_CREDS=$(grep -r -i "password.*=.*['\"][^'\"]*['\"]" . --exclude-dir=node_modules --exclude-dir=.git --exclude=*.log --exclude=*.backup 2>/dev/null || true)
if [ -n "$HARDCODED_CREDS" ]; then
    echo "⚠️  Potential hardcoded credentials found:"
    echo "$HARDCODED_CREDS"
fi

# Check for console.log statements in production code
CONSOLE_LOGS=$(grep -r "console\.log" app/ components/ lib/ --exclude-dir=node_modules 2>/dev/null || true)
if [ -n "$CONSOLE_LOGS" ]; then
    echo "⚠️  Console.log statements found in production code:"
    echo "$CONSOLE_LOGS"
fi

# Check for TODO comments that might indicate incomplete security
SECURITY_TODOS=$(grep -r -i "TODO.*security\|TODO.*auth\|TODO.*password\|TODO.*secret" . --exclude-dir=node_modules --exclude-dir=.git 2>/dev/null || true)
if [ -n "$SECURITY_TODOS" ]; then
    echo "⚠️  Security-related TODO comments found:"
    echo "$SECURITY_TODOS"
fi

echo ""
echo "✅ Security scan completed successfully!"
echo ""
echo "💡 Recommendations:"
echo "   1. Run this scan before every commit"
echo "   2. Keep .env.local updated with real values"
echo "   3. Never commit real API keys or secrets"
echo "   4. Use [EXAMPLE_PLACEHOLDER_...] format for documentation"
echo "   5. Review security findings regularly"
