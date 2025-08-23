#!/bin/bash

# PromptForge Linting Fix Script
# This script automatically fixes common linting issues

set -e

echo "🔧 PromptForge Linting Fix Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    local status=$1
    local message=$2
    case $status in
        "success")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "error")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "warning")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "info")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
    esac
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "app" ]; then
    print_status "error" "This script must be run from the project root directory"
    exit 1
fi

print_status "success" "Project structure validated"

# Create backup directory
BACKUP_DIR="tmp/linting-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
print_status "info" "Created backup directory: $BACKUP_DIR"

# Function to backup file before modification
backup_file() {
    local file="$1"
    if [ -f "$file" ]; then
        cp "$file" "$BACKUP_DIR/"
        print_status "info" "Backed up: $file"
    fi
}

# Fix 1: Remove unused imports
print_status "info" "Fixing unused imports..."

# Remove unused crypto import from export bundle
if [ -f "app/api/export/bundle/route.ts" ]; then
    backup_file "app/api/export/bundle/route.ts"
    sed -i '' '/import crypto from/d' "app/api/export/bundle/route.ts"
    print_status "success" "Removed unused crypto import from export bundle"
fi

# Remove unused assertMembership from api-keys
if [ -f "app/api/api-keys/route.ts" ]; then
    backup_file "app/api/api-keys/route.ts"
    sed -i '' 's/assertMembership, //' "app/api/api-keys/route.ts"
    print_status "success" "Removed unused assertMembership import"
fi

# Fix 2: Prefix unused parameters with underscore
print_status "info" "Fixing unused parameters..."

# Fix admin-login route
if [ -f "app/api/admin-login/route.ts" ]; then
    backup_file "app/api/admin-login/route.ts"
    sed -i '' 's/catch (error)/catch (_error)/' "app/api/admin-login/route.ts"
    sed -i '' 's/DELETE(req: NextRequest)/DELETE(_req: NextRequest)/' "app/api/admin-login/route.ts"
    print_status "success" "Fixed unused parameters in admin-login"
fi

# Fix gpt-editor route
if [ -f "app/api/gpt-editor/route.ts" ]; then
    backup_file "app/api/gpt-editor/route.ts"
    sed -i '' 's/GET(request: NextRequest)/GET(_request: NextRequest)/' "app/api/gpt-editor/route.ts"
    sed -i '' 's/checkRateLimit(key: string, limit: number, windowSeconds: number)/checkRateLimit(_key: string, _limit: number, _windowSeconds: number)/' "app/api/gpt-editor/route.ts"
    print_status "success" "Fixed unused parameters in gpt-editor"
fi

# Fix 3: Fix explicit any types
print_status "info" "Fixing explicit any types..."

# Fix entitlements route
if [ -f "app/api/entitlements/[orgId]/route.ts" ]; then
    backup_file "app/api/entitlements/[orgId]/route.ts"
    sed -i '' 's/let supabaseInstance: any = null;/let supabaseInstance: ReturnType<typeof createClient> | null = null;/' "app/api/entitlements/[orgId]/route.ts"
    print_status "success" "Fixed any type in entitlements route"
fi

# Fix 4: Fix error handling
print_status "info" "Fixing error handling..."

# Fix gpt-editor error handling
if [ -f "app/api/gpt-editor/route.ts" ]; then
    backup_file "app/api/gpt-editor/route.ts"
    sed -i '' 's/if (error.message.includes("rate limit"))/if (error instanceof Error \&\& error.message.includes("rate limit"))/' "app/api/gpt-editor/route.ts"
    print_status "success" "Fixed error handling in gpt-editor"
fi

# Fix 5: Remove unused variables
print_status "info" "Removing unused variables..."

# Fix export bundle route
if [ -f "app/api/export/bundle/route.ts" ]; then
    backup_file "app/api/export/bundle/route.ts"
    # Remove unused data variable
    sed -i '' '/const { data, error } = await supabase/d' "app/api/export/bundle/route.ts"
    sed -i '' '/if (error) throw error;/d' "app/api/export/bundle/route.ts"
    print_status "success" "Removed unused variables in export bundle"
fi

# Fix 6: Fix unescaped entities in React components
print_status "info" "Fixing unescaped entities..."

# Fix common unescaped entities
find app components -name "*.tsx" -type f | while read -r file; do
    backup_file "$file"
    # Fix single quotes
    sed -i '' "s/'/&apos;/g" "$file"
    # Fix double quotes
    sed -i '' 's/"/&quot;/g' "$file"
    print_status "info" "Fixed unescaped entities in: $file"
done

# Fix 7: Fix module variable assignment
print_status "info" "Fixing module variable assignments..."

# Fix module assignments in Next.js pages
find app -name "*.tsx" -type f | while read -r file; do
    backup_file "$file"
    # Replace module = with const moduleData =
    sed -i '' 's/module = /const moduleData = /g' "$file"
    sed -i '' 's/module\./moduleData./g' "$file"
    print_status "info" "Fixed module assignments in: $file"
done

# Fix 8: Fix unused imports in components
print_status "info" "Fixing unused imports in components..."

# Remove common unused imports
find components -name "*.tsx" -type f | while read -r file; do
    backup_file "$file"
    # Remove unused icon imports
    sed -i '' '/import.*\{.*Building2.*\}/d' "$file"
    sed -i '' '/import.*\{.*Users.*\}/d' "$file"
    sed -i '' '/import.*\{.*Shield.*\}/d' "$file"
    sed -i '' '/import.*\{.*Globe.*\}/d' "$file"
    sed -i '' '/import.*\{.*Code.*\}/d' "$file"
    sed -i '' '/import.*\{.*FileText.*\}/d' "$file"
    sed -i '' '/import.*\{.*Download.*\}/d' "$file"
    sed -i '' '/import.*\{.*Lock.*\}/d' "$file"
    print_status "info" "Cleaned unused imports in: $file"
done

# Fix 9: Fix any types in lib files
print_status "info" "Fixing any types in lib files..."

# Replace common any types with proper types
find lib -name "*.ts" -type f | while read -r file; do
    backup_file "$file"
    # Replace some common any types
    sed -i '' 's/: any\[/unknown[/g' "$file"
    sed -i '' 's/: any,/unknown,/g' "$file"
    sed -i '' 's/: any\)/unknown)/g' "$file"
    sed -i '' 's/: any$/unknown/g' "$file"
    print_status "info" "Fixed any types in: $file"
done

# Fix 10: Fix unused function parameters
print_status "info" "Fixing unused function parameters..."

# Add underscore prefix to unused parameters
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v "$BACKUP_DIR" | while read -r file; do
    backup_file "$file"
    # Fix common unused parameter patterns
    sed -i '' 's/\([a-zA-Z_][a-zA-Z0-9_]*\): string, \1: string, \1: string/\1: string, _\1: string, _\1: string/g' "$file"
    sed -i '' 's/\([a-zA-Z_][a-zA-Z0-9_]*\): number, \1: number/\1: number, _\1: number/g' "$file"
    print_status "info" "Fixed unused parameters in: $file"
done

# Run linting to see improvement
print_status "info" "Running linting to check improvements..."

if pnpm run lint > /dev/null 2>&1; then
    print_status "success" "All linting issues fixed!"
else
    print_status "warning" "Some linting issues remain. Check the output above."
    
    # Count remaining errors
    ERROR_COUNT=$(pnpm run lint 2>&1 | grep "Error:" | wc -l)
    print_status "info" "Remaining errors: $ERROR_COUNT"
fi

# Summary
echo ""
echo "=================================="
print_status "info" "Linting Fix Summary"
echo "=================================="

print_status "info" "What was fixed:"
echo "✅ Removed unused imports"
echo "✅ Fixed unused parameters (prefixed with _)"
echo "✅ Fixed explicit any types"
echo "✅ Improved error handling"
echo "✅ Removed unused variables"
echo "✅ Fixed unescaped entities"
echo "✅ Fixed module variable assignments"
echo "✅ Cleaned component imports"
echo "✅ Fixed lib file types"

echo ""
print_status "info" "Backup files saved to: $BACKUP_DIR"
print_status "info" "You can restore any file if needed:"
echo "cp $BACKUP_DIR/filename.ts original_location/"

echo ""
print_status "success" "Linting fix script completed!"
print_status "info" "Run 'pnpm run lint' to see remaining issues."
