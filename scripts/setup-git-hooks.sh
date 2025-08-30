#!/bin/bash

# Setup Git Hooks for PromptForge Frontend Recovery
echo "🔧 Setting up Git hooks for frontend recovery protection..."

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy pre-push hook
cp .githooks/pre-push .git/hooks/pre-push
chmod +x .git/hooks/pre-push

echo "✅ Git hooks installed successfully!"
echo ""
echo "🛡️  Frontend recovery protection is now active:"
echo "  - Pre-push hook will run guard checks"
echo "  - Duplicate components will be blocked"
echo "  - Conflicting CSS patterns will be detected"
echo "  - TypeScript errors will prevent push"
echo ""
echo "To run guard checks manually: ./scripts/guard-against-regressions.sh"