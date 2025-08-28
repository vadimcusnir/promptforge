#!/bin/bash

# =============================================================================
# Git Hooks Setup Script for PromptForge v3
# =============================================================================
# 
# This script sets up git hooks to automatically scan for PII and secrets
# before each commit, preventing accidental exposure of sensitive information.
#
# Usage: ./scripts/setup-git-hooks.sh
# =============================================================================

set -e

echo "🔧 Setting up Git Hooks for Security Scanning..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: This script must be run from the root of a git repository"
    exit 1
fi

# Create .git/hooks directory if it doesn't exist
mkdir -p .git/hooks

# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# =============================================================================
# Pre-commit Hook for PromptForge v3
# =============================================================================
# 
# This hook runs security scans before each commit to prevent
# accidental exposure of PII and secrets.
# =============================================================================

set -e

echo "🔍 Running pre-commit security scan..."

# Get the directory of the git repository
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# Check if enhanced-pii-detection.js exists
if [ ! -f "scripts/enhanced-pii-detection.js" ]; then
    echo "❌ Error: scripts/enhanced-pii-detection.js not found"
    echo "   Please run: ./scripts/setup-git-hooks.sh"
    exit 1
fi

# Run the enhanced PII detection script
echo "   Scanning for PII and secrets..."
if node scripts/enhanced-pii-detection.js; then
    echo "✅ Security scan passed"
else
    echo ""
    echo "❌ Security scan failed!"
    echo "   Please fix all security issues before committing."
    echo "   Run manually: node scripts/enhanced-pii-detection.js"
    exit 1
fi

# Check for .env files that shouldn't be committed
echo "   Checking for sensitive environment files..."
ENV_FILES=$(git diff --cached --name-only | grep -E '\.env(\.|$)')
if [ -n "$ENV_FILES" ]; then
    echo "❌ Warning: Environment files detected in commit:"
    echo "$ENV_FILES"
    echo ""
    echo "   These files may contain sensitive information."
    echo "   Consider using .env.local instead (already in .gitignore)."
    echo ""
    read -p "   Continue with commit? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "   Commit cancelled."
        exit 1
    fi
fi

# Check for large files
echo "   Checking for large files..."
LARGE_FILES=$(git diff --cached --name-only | xargs -I {} sh -c 'if [ -f "{}" ]; then stat -f%z "{}" 2>/dev/null || stat -c%s "{}" 2>/dev/null; fi' | awk '$1 > 10485760')
if [ -n "$LARGE_FILES" ]; then
    echo "⚠️  Warning: Large files detected (>10MB)"
    echo "   Consider using git-lfs for large files."
fi

echo "✅ Pre-commit checks completed successfully"
EOF

# Make the pre-commit hook executable
chmod +x .git/hooks/pre-commit

# Create post-commit hook for logging
cat > .git/hooks/post-commit << 'EOF'
#!/bin/bash

# =============================================================================
# Post-commit Hook for PromptForge v3
# =============================================================================
# 
# This hook logs successful commits for audit purposes.
# =============================================================================

# Get commit information
COMMIT_HASH=$(git rev-parse HEAD)
COMMIT_AUTHOR=$(git log -1 --pretty=format:"%an <%ae>")
COMMIT_DATE=$(git log -1 --pretty=format:"%cd")
COMMIT_MESSAGE=$(git log -1 --pretty=format:"%s")

# Log the commit
echo "✅ Commit successful: $COMMIT_HASH"
echo "   Author: $COMMIT_AUTHOR"
echo "   Date: $COMMIT_DATE"
echo "   Message: $COMMIT_MESSAGE"

# Optional: Log to a file for audit purposes
if [ -d "logs" ]; then
    echo "[$(date)] Commit: $COMMIT_HASH | Author: $COMMIT_AUTHOR | Message: $COMMIT_MESSAGE" >> logs/git-commits.log
fi
EOF

# Make the post-commit hook executable
chmod +x .git/hooks/post-commit

# Create a security scan script that can be run manually
cat > scripts/security-scan.sh << 'EOF'
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
EOF

# Make the security scan script executable
chmod +x scripts/security-scan.sh

# Create a logs directory for audit purposes
mkdir -p logs

echo ""
echo "✅ Git hooks setup completed successfully!"
echo ""
echo "🔧 What was set up:"
echo "   - Pre-commit hook: Automatically scans for PII/secrets before commits"
echo "   - Post-commit hook: Logs successful commits for audit"
echo "   - Security scan script: Manual security scanning"
echo "   - Logs directory: For audit trail"
echo ""
echo "🚀 Next steps:"
echo "   1. Test the setup: git add . && git commit -m 'test'"
echo "   2. Run manual scan: ./scripts/security-scan.sh"
echo "   3. The hooks will now run automatically on every commit"
echo ""
echo "⚠️  Important:"
echo "   - The pre-commit hook will block commits with security issues"
echo "   - Always run security scans before pushing to remote"
echo "   - Keep .env.local updated with real values (never commit it)"
echo ""
