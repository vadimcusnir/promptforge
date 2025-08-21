#!/bin/bash

set -e

echo "🔒 Setting up PromptForge Security Configuration..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running from project root
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Installing dependencies..."
pnpm install

print_status "Setting up Husky..."
npx husky install

print_status "Creating Husky hooks directory..."
mkdir -p .husky

print_status "Setting up pre-commit hook..."
npx husky add .husky/pre-commit "#!/usr/bin/env sh
. \"\$(dirname -- \"\$0\")/_/husky.sh\"

# Run lint-staged for code quality
npx lint-staged

# Secret pattern detection
echo \"🔍 Checking for secrets...\"

# Define secret patterns
SECRET_PATTERNS=(
  \"sk-[a-zA-Z0-9]{48}\"
  \"xoxb-[0-9]{11}-[0-9]{12}-[a-zA-Z0-9]{24}\"
  \"xoxp-[0-9]{11}-[0-9]{12}-[a-zA-Z0-9]{24}\"
  \"AIza[0-9A-Za-z\\\\-_]{35}\"
  \"AKIA[0-9A-Z]{16}\"
  \"[0-9a-f]{32}\"
  \"ghp_[A-Za-z0-9]{36}\"
  \"ghs_[A-Za-z0-9]{36}\"
  \"gho_[A-Za-z0-9]{36}\"
  \"github_pat_[A-Za-z0-9]{22}_[A-Za-z0-9]{59}\"
  \"-----BEGIN [A-Z ]+-----\"
  \"password[\\\"'\\s]*[:=][\\\"'\\s]*[^\\s\\\"']{8,}\"
  \"secret[\\\"'\\s]*[:=][\\\"'\\s]*[^\\s\\\"']{8,}\"
  \"token[\\\"'\\s]*[:=][\\\"'\\s]*[^\\s\\\"']{16,}\"
)

# Check staged files for secret patterns
STAGED_FILES=\$(git diff --cached --name-only --diff-filter=ACM)

if [ -n \"\$STAGED_FILES\" ]; then
  for pattern in \"\${SECRET_PATTERNS[@]}\"; do
    if echo \"\$STAGED_FILES\" | xargs grep -l -i -E \"\$pattern\" 2>/dev/null; then
      echo \"❌ Potential secret detected with pattern: \$pattern\"
      echo \"🚫 Commit rejected. Please remove secrets before committing.\"
      echo \"💡 Consider using environment variables or encrypted secrets.\"
      exit 1
    fi
  done
fi

echo \"✅ No secrets detected\""

print_status "Setting up commit-msg hook..."
npx husky add .husky/commit-msg "npx --no-install commitlint --edit \$1"

print_status "Making hooks executable..."
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg

print_status "Setting up Git configuration..."
if ! git config --get user.signingkey > /dev/null 2>&1; then
    print_warning "GPG signing key not configured. Please run:"
    echo "  git config --global user.signingkey YOUR_KEY_ID"
    echo "  git config --global commit.gpgsign true"
    echo ""
    echo "See .github/GPG_SETUP.md for detailed instructions"
else
    print_success "GPG signing key already configured"
fi

if ! git config --get commit.template > /dev/null 2>&1; then
    print_status "Setting up commit message template..."
    git config commit.template .gitmessage
    print_success "Commit message template configured"
fi

print_status "Running initial security audit..."
pnpm audit --audit-level=moderate || print_warning "Some audit issues found. Run 'pnpm audit fix' to resolve."

print_status "Running security linting..."
pnpm run lint:security || print_warning "Some security linting issues found. Please review and fix."

print_status "Generating SBOM..."
pnpm run sbom

print_success "Security setup completed successfully!"

echo ""
echo "📋 Next Steps:"
echo "1. Set up GPG signing (see .github/GPG_SETUP.md)"
echo "2. Configure GitHub repository settings:"
echo "   - Enable branch protection rules"
echo "   - Require signed commits"
echo "   - Enable security alerts"
echo "   - Configure Dependabot"
echo "3. Review and customize security policies in SECURITY.md"
echo "4. Run 'pnpm audit' regularly to check for vulnerabilities"
echo "5. Monitor GitHub Security tab for alerts"

echo ""
print_success "🔒 Your project is now secured with comprehensive security measures!"
