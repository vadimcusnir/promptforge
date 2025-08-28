#!/bin/bash

# PromptForge v3 - Pre-commit Hooks Setup Script
# Sets up automated PII scanning and security checks before commits

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
GIT_DIR="$PROJECT_DIR/.git"

echo "🔧 Setting up pre-commit hooks for PromptForge v3..."

# Check if we're in a git repository
if [ ! -d "$GIT_DIR" ]; then
    echo "❌ Not a git repository. Please run this from the project root."
    exit 1
fi

# Create hooks directory if it doesn't exist
HOOKS_DIR="$GIT_DIR/hooks"
mkdir -p "$HOOKS_DIR"

# Create pre-commit hook
PRE_COMMIT_HOOK="$HOOKS_DIR/pre-commit"
echo "📝 Creating pre-commit hook..."

cat > "$PRE_COMMIT_HOOK" << 'EOF'
#!/bin/bash

# PromptForge v3 - Pre-commit Hook
# Runs security checks before allowing commits

set -e

echo "🔍 Running pre-commit security checks..."

# Get the project directory
PROJECT_DIR="$(git rev-parse --show-toplevel)"
cd "$PROJECT_DIR"

# Run enhanced PII analysis
if [ -f "scripts/enhanced-pii-report.js" ]; then
    echo "   📊 Running PII analysis..."
    if node scripts/enhanced-pii-report.js --ci; then
        echo "   ✅ PII analysis passed"
    else
        echo "   ❌ PII analysis failed - commit blocked"
        echo "   Please fix PII issues before committing"
        exit 1
    fi
else
    echo "   ⚠️  PII analysis script not found"
fi

# Run configuration check
if [ -f "scripts/check-config.js" ]; then
    echo "   ⚙️  Checking configuration..."
    if node scripts/check-config.js; then
        echo "   ✅ Configuration check passed"
    else
        echo "   ❌ Configuration check failed - commit blocked"
        echo "   Please fix configuration issues before committing"
        exit 1
    fi
else
    echo "   ⚠️  Configuration check script not found"
fi

# Run type checking
if [ -f "package.json" ] && grep -q "type-check" package.json; then
    echo "   🔍 Running type check..."
    if pnpm run type-check; then
        echo "   ✅ Type check passed"
    else
        echo "   ❌ Type check failed - commit blocked"
        echo "   Please fix TypeScript errors before committing"
        exit 1
    fi
else
    echo "   ⚠️  Type check script not found"
fi

# Run linting
if [ -f "package.json" ] && grep -q "lint" package.json; then
    echo "   🧹 Running linting..."
    if pnpm run lint; then
        echo "   ✅ Linting passed"
    else
        echo "   ❌ Linting failed - commit blocked"
        echo "   Please fix linting errors before committing"
        exit 1
    fi
else
    echo "   ⚠️  Linting script not found"
fi

echo "✅ All pre-commit checks passed!"
echo "🚀 Proceeding with commit..."
EOF

# Make the hook executable
chmod +x "$PRE_COMMIT_HOOK"

# Create commit-msg hook for additional validation
COMMIT_MSG_HOOK="$HOOKS_DIR/commit-msg"
echo "📝 Creating commit-msg hook..."

cat > "$COMMIT_MSG_HOOK" << 'EOF'
#!/bin/bash

# PromptForge v3 - Commit Message Hook
# Validates commit message format

set -e

COMMIT_MSG_FILE="$1"
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Check commit message format
if ! echo "$COMMIT_MSG" | grep -qE "^(feat|fix|docs|style|refactor|test|chore|security|perf|ci|build|revert)(\(.+\))?: .+"; then
    echo "❌ Invalid commit message format"
    echo "   Expected format: type(scope): description"
    echo "   Types: feat, fix, docs, style, refactor, test, chore, security, perf, ci, build, revert"
    echo "   Example: feat(auth): add OAuth2 authentication"
    echo "   Example: security(pii): fix sensitive data exposure"
    echo "   Example: fix(backup): resolve backup script export issues"
    exit 1
fi

# Check for security-related keywords in commit message
if echo "$COMMIT_MSG" | grep -qi "password\|secret\|key\|token\|credential\|api_key"; then
    echo "⚠️  Warning: Commit message contains potentially sensitive keywords"
    echo "   Please ensure no real secrets are included in commit messages"
    echo "   Consider using: [REDACTED] or [REMOVED] instead"
fi

echo "✅ Commit message validation passed"
EOF

# Make the hook executable
chmod +x "$COMMIT_MSG_HOOK"

# Create post-commit hook for backup verification
POST_COMMIT_HOOK="$HOOKS_DIR/post-commit"
echo "📝 Creating post-commit hook..."

cat > "$POST_COMMIT_HOOK" << 'EOF'
#!/bin/bash

# PromptForge v3 - Post-commit Hook
# Runs after successful commit

set -e

PROJECT_DIR="$(git rev-parse --show-toplevel)"
cd "$PROJECT_DIR"

echo "🔍 Post-commit verification..."

# Check if backup script exists and run verification
if [ -f "scripts/supabase-backup.js" ]; then
    echo "   📊 Verifying backup system..."
    if node scripts/supabase-backup.js list > /dev/null 2>&1; then
        echo "   ✅ Backup system is functional"
    else
        echo "   ⚠️  Backup system may have issues"
    fi
fi

# Run a quick security check
if [ -f "scripts/quick-security-check.sh" ]; then
    echo "   🔒 Running quick security check..."
    if bash scripts/quick-security-check.sh > /dev/null 2>&1; then
        echo "   ✅ Security check passed"
    else
        echo "   ⚠️  Security check had issues"
    fi
fi

echo "✅ Post-commit verification completed"
EOF

# Make the hook executable
chmod +x "$POST_COMMIT_HOOK"

# Create a hook management script
HOOK_MANAGER="$PROJECT_DIR/scripts/manage-hooks.sh"
echo "📝 Creating hook management script..."

cat > "$HOOK_MANAGER" << 'EOF'
#!/bin/bash

# PromptForge v3 - Hook Management Script
# Manages git hooks for the project

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
GIT_DIR="$PROJECT_DIR/.git"
HOOKS_DIR="$GIT_DIR/hooks"

case "$1" in
    "status")
        echo "🔍 Git Hooks Status:"
        echo "===================="
        
        if [ -f "$HOOKS_DIR/pre-commit" ]; then
            echo "✅ Pre-commit hook: Active"
        else
            echo "❌ Pre-commit hook: Missing"
        fi
        
        if [ -f "$HOOKS_DIR/commit-msg" ]; then
            echo "✅ Commit-msg hook: Active"
        else
            echo "❌ Commit-msg hook: Missing"
        fi
        
        if [ -f "$HOOKS_DIR/post-commit" ]; then
            echo "✅ Post-commit hook: Active"
        else
            echo "❌ Post-commit hook: Missing"
        fi
        ;;
        
    "disable")
        echo "🔒 Disabling git hooks..."
        
        if [ -f "$HOOKS_DIR/pre-commit" ]; then
            mv "$HOOKS_DIR/pre-commit" "$HOOKS_DIR/pre-commit.disabled"
            echo "   Pre-commit hook disabled"
        fi
        
        if [ -f "$HOOKS_DIR/commit-msg" ]; then
            mv "$HOOKS_DIR/commit-msg" "$HOOKS_DIR/commit-msg.disabled"
            echo "   Commit-msg hook disabled"
        fi
        
        if [ -f "$HOOKS_DIR/post-commit" ]; then
            mv "$HOOKS_DIR/post-commit" "$HOOKS_DIR/post-commit.disabled"
            echo "   Post-commit hook disabled"
        fi
        
        echo "✅ All hooks disabled"
        ;;
        
    "enable")
        echo "🔓 Re-enabling git hooks..."
        
        if [ -f "$HOOKS_DIR/pre-commit.disabled" ]; then
            mv "$HOOKS_DIR/pre-commit.disabled" "$HOOKS_DIR/pre-commit"
            chmod +x "$HOOKS_DIR/pre-commit"
            echo "   Pre-commit hook enabled"
        fi
        
        if [ -f "$HOOKS_DIR/commit-msg.disabled" ]; then
            mv "$HOOKS_DIR/commit-msg.disabled" "$HOOKS_DIR/commit-msg"
            chmod +x "$HOOKS_DIR/commit-msg"
            echo "   Commit-msg hook enabled"
        fi
        
        if [ -f "$HOOKS_DIR/post-commit.disabled" ]; then
            mv "$HOOKS_DIR/post-commit.disabled" "$HOOKS_DIR/post-commit"
            chmod +x "$HOOKS_DIR/post-commit"
            echo "   Post-commit hook enabled"
        fi
        
        echo "✅ All hooks enabled"
        ;;
        
    "test")
        echo "🧪 Testing git hooks..."
        
        # Test pre-commit hook
        if [ -f "$HOOKS_DIR/pre-commit" ]; then
            echo "   Testing pre-commit hook..."
            if bash "$HOOKS_DIR/pre-commit" > /dev/null 2>&1; then
                echo "   ✅ Pre-commit hook test passed"
            else
                echo "   ❌ Pre-commit hook test failed"
            fi
        fi
        
        # Test commit-msg hook
        if [ -f "$HOOKS_DIR/commit-msg" ]; then
            echo "   Testing commit-msg hook..."
            echo "feat(auth): add OAuth2 authentication" > /tmp/test-commit-msg
            if bash "$HOOKS_DIR/commit-msg" /tmp/test-commit-msg > /dev/null 2>&1; then
                echo "   ✅ Commit-msg hook test passed"
            else
                echo "   ❌ Commit-msg hook test failed"
            fi
            rm -f /tmp/test-commit-msg
        fi
        
        echo "✅ Hook testing completed"
        ;;
        
    *)
        echo "🔧 PromptForge v3 - Hook Management"
        echo "Usage: $0 {status|disable|enable|test}"
        echo ""
        echo "Commands:"
        echo "  status   - Show current hook status"
        echo "  disable  - Disable all hooks temporarily"
        echo "  enable   - Re-enable all hooks"
        echo "  test     - Test hook functionality"
        echo ""
        echo "Note: Hooks are automatically run on git operations"
        echo "      Use 'disable' if you need to bypass checks temporarily"
        ;;
esac
EOF

# Make the management script executable
chmod +x "$HOOK_MANAGER"

echo ""
echo "✅ Pre-commit hooks setup completed successfully!"
echo ""
echo "📋 What was configured:"
echo "   ✅ Pre-commit hook: Runs PII analysis, config check, type check, and linting"
echo "   ✅ Commit-msg hook: Validates commit message format"
echo "   ✅ Post-commit hook: Verifies backup system and runs security checks"
echo "   ✅ Hook management script: scripts/manage-hooks.sh"
echo ""
echo "🚀 Usage:"
echo "   # Check hook status"
echo "   ./scripts/manage-hooks.sh status"
echo ""
echo "   # Test hooks"
echo "   ./scripts/manage-hooks.sh test"
echo ""
echo "   # Temporarily disable hooks (for emergency fixes)"
echo "   ./scripts/manage-hooks.sh disable"
echo ""
echo "   # Re-enable hooks"
echo "   ./scripts/manage-hooks.sh enable"
echo ""
echo "⚠️  Important:"
echo "   - Hooks will run automatically on every commit"
echo "   - Commits will be blocked if security issues are found"
echo "   - Use 'disable' only when absolutely necessary"
echo "   - Re-enable hooks after emergency fixes"
echo ""
echo "🔒 Security features:"
echo "   - PII scanning before every commit"
echo "   - Configuration validation"
echo "   - Type checking and linting"
echo "   - Commit message format validation"
echo "   - Post-commit verification"
