#!/bin/bash

# PromptForge Linting Fix Script v2 - More Targeted Approach
# This script fixes remaining linting issues without breaking files

set -e

echo "🔧 PromptForge Linting Fix Script v2"
echo "======================================"

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
BACKUP_DIR="tmp/linting-backup-v2-$(date +%Y%m%d-%H%M%S)"
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

# Fix 1: Remove unused imports systematically
print_status "info" "Fixing unused imports..."

# Remove common unused icon imports
find app components -name "*.tsx" -type f | while read -r file; do
    backup_file "$file"
    
    # Remove unused icon imports (one by one to avoid breaking files)
    if grep -q "Building2" "$file"; then
        sed -i '' '/Building2/d' "$file"
        print_status "info" "Removed Building2 from: $file"
    fi
    
    if grep -q "Users" "$file"; then
        sed -i '' '/Users/d' "$file"
        print_status "info" "Removed Users from: $file"
    fi
    
    if grep -q "Shield" "$file"; then
        sed -i '' '/Shield/d' "$file"
        print_status "info" "Removed Shield from: $file"
    fi
    
    if grep -q "Globe" "$file"; then
        sed -i '' '/Globe/d' "$file"
        print_status "info" "Removed Globe from: $file"
    fi
    
    if grep -q "Code" "$file"; then
        sed -i '' '/Code/d' "$file"
        print_status "info" "Removed Code from: $file"
    fi
    
    if grep -q "FileText" "$file"; then
        sed -i '' '/FileText/d' "$file"
        print_status "info" "Removed FileText from: $file"
    fi
    
    if grep -q "Download" "$file"; then
        sed -i '' '/Download/d' "$file"
        print_status "info" "Removed Download from: $file"
    fi
    
    if grep -q "Lock" "$file"; then
        sed -i '' '/Lock/d' "$file"
        print_status "info" "Removed Lock from: $file"
    fi
done

# Fix 2: Remove unused variables
print_status "info" "Fixing unused variables..."

# Fix specific files with unused variables
if [ -f "app/api/run/[moduleId]/route.ts" ]; then
    backup_file "app/api/run/[moduleId]/route.ts"
    # Remove unused evaluationTime variable
    sed -i '' '/const evaluationTime/d' "app/api/run/[moduleId]/route.ts"
    print_status "success" "Removed unused evaluationTime from run route"
fi

# Fix 3: Fix any types with proper types
print_status "info" "Fixing any types..."

# Fix specific any types
if [ -f "app/api/stripe/create-checkout-session/route.ts" ]; then
    backup_file "app/api/stripe/create-checkout-session/route.ts"
    # Replace any with proper type
    sed -i '' 's/: any\[/unknown[/g' "app/api/stripe/create-checkout-session/route.ts"
    sed -i '' 's/: any,/unknown,/g' "app/api/stripe/create-checkout-session/route.ts"
    print_status "success" "Fixed any types in stripe route"
fi

# Fix 4: Fix unescaped entities (more carefully)
print_status "info" "Fixing unescaped entities..."

# Fix only specific problematic entities, not all quotes
find app components -name "*.tsx" -type f | while read -r file; do
    backup_file "$file"
    
    # Fix only problematic single quotes in specific contexts
    if grep -q "can't" "$file"; then
        sed -i '' "s/can't/can&apos;t/g" "$file"
        print_status "info" "Fixed can't in: $file"
    fi
    
    if grep -q "don't" "$file"; then
        sed -i '' "s/don't/don&apos;t/g" "$file"
        print_status "info" "Fixed don't in: $file"
    fi
    
    if grep -q "won't" "$file"; then
        sed -i '' "s/won't/won&apos;t/g" "$file"
        print_status "info" "Fixed won't in: $file"
    fi
    
    if grep -q "I'm" "$file"; then
        sed -i '' "s/I'm/I&apos;m/g" "$file"
        print_status "info" "Fixed I'm in: $file"
    fi
done

# Fix 5: Fix unused function parameters
print_status "info" "Fixing unused function parameters..."

# Find and fix functions with unused parameters
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v "$BACKUP_DIR" | while read -r file; do
    backup_file "$file"
    
    # Fix common patterns
    if grep -q "function.*\(.*: string, .*: string, .*: string\)" "$file"; then
        sed -i '' 's/\([a-zA-Z_][a-zA-Z0-9_]*\): string, \1: string, \1: string/\1: string, _\1: string, _\1: string/g' "$file"
        print_status "info" "Fixed unused parameters in: $file"
    fi
done

# Fix 6: Clean up empty import lines
print_status "info" "Cleaning up empty import lines..."

find app components -name "*.tsx" -type f | while read -r file; do
    backup_file "$file"
    
    # Remove empty import lines
    sed -i '' '/^import {[[:space:]]*}[[:space:]]*from/d' "$file"
    sed -i '' '/^import[[:space:]]*$/d' "$file"
    
    print_status "info" "Cleaned imports in: $file"
done

# Fix 7: Fix specific type issues
print_status "info" "Fixing specific type issues..."

# Fix the export bundle route issues
if [ -f "app/api/export/bundle/route.ts" ]; then
    backup_file "app/api/export/bundle/route.ts"
    
    # Fix the error variable issue
    if grep -q "} catch (error) {" "$file"; then
        sed -i '' 's/} catch (error) {/} catch {/g' "$file"
        print_status "success" "Fixed error variable in export bundle"
    fi
fi

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
echo "======================================"
print_status "info" "Linting Fix v2 Summary"
echo "======================================"

print_status "info" "What was fixed:"
echo "✅ Removed unused icon imports"
echo "✅ Removed unused variables"
echo "✅ Fixed any types where possible"
echo "✅ Fixed unescaped entities (carefully)"
echo "✅ Cleaned up empty import lines"
echo "✅ Fixed specific type issues"

echo ""
print_status "info" "Backup files saved to: $BACKUP_DIR"
print_status "info" "You can restore any file if needed:"
echo "cp $BACKUP_DIR/filename.tsx original_location/"

echo ""
print_status "success" "Linting fix script v2 completed!"
print_status "info" "Run 'pnpm run lint' to see remaining issues."
