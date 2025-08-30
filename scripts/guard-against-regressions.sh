#!/bin/bash

# PromptForge Frontend Recovery Guard Script
# Prevents regressions by checking for common issues

set -e

echo "🛡️  PromptForge Frontend Recovery Guard"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check for duplicate components
echo "🔍 Checking for duplicate components..."
DUPLICATE_HEADERS=$(find components -name "*header*" -o -name "*Header*" | wc -l)
if [ "$DUPLICATE_HEADERS" -gt 1 ]; then
    echo -e "${RED}❌ Found $DUPLICATE_HEADERS header components. Only one should exist.${NC}"
    find components -name "*header*" -o -name "*Header*"
    exit 1
fi

# Check for conflicting CSS patterns
echo "🔍 Checking for conflicting CSS patterns..."
CONFLICTING_PATTERNS=$(grep -r "bg-bg\|text-text" app/ components/ 2>/dev/null | wc -l || echo "0")
if [ "$CONFLICTING_PATTERNS" -gt 0 ]; then
    echo -e "${RED}❌ Found $CONFLICTING_PATTERNS conflicting CSS patterns (bg-bg, text-text)${NC}"
    grep -r "bg-bg\|text-text" app/ components/ 2>/dev/null || true
    exit 1
fi

# Check for case sensitivity issues in imports
echo "🔍 Checking for case sensitivity issues..."
CASE_ISSUES=$(find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | grep -v .next | grep -v scripts/guard-against-regressions.sh | xargs grep -l "from.*@/components/header" 2>/dev/null | wc -l || echo "0")
if [ "$CASE_ISSUES" -gt 0 ]; then
    echo -e "${RED}❌ Found $CASE_ISSUES case sensitivity issues in imports${NC}"
    find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | grep -v .next | grep -v scripts/guard-against-regressions.sh | xargs grep -l "from.*@/components/header" 2>/dev/null || true
    exit 1
fi

# Check globals.css size (should be reasonable)
echo "🔍 Checking globals.css size..."
CSS_SIZE=$(wc -l < app/globals.css 2>/dev/null || echo "0")
if [ "$CSS_SIZE" -gt 500 ]; then
    echo -e "${YELLOW}⚠️  globals.css is $CSS_SIZE lines (consider keeping under 500)${NC}"
fi

# Check for missing critical files
echo "🔍 Checking for missing critical files..."
MISSING_FILES=0
for file in "components/Header.tsx" "app/globals.css" "types/promptforge.ts"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Missing critical file: $file${NC}"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

if [ "$MISSING_FILES" -gt 0 ]; then
    echo -e "${RED}❌ Found $MISSING_FILES missing critical files${NC}"
    exit 1
fi

# Run type check
echo "🔍 Running TypeScript type check..."
if ! pnpm type-check > /dev/null 2>&1; then
    echo -e "${RED}❌ TypeScript type check failed${NC}"
    echo "Run 'pnpm type-check' to see details"
    exit 1
fi

# Run lint check
echo "🔍 Running ESLint check..."
if ! pnpm lint > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  ESLint found issues (non-blocking)${NC}"
    echo "Run 'pnpm lint' to see details"
fi

echo -e "${GREEN}✅ All guard checks passed!${NC}"
echo "Frontend is in a clean state and ready for deployment."
