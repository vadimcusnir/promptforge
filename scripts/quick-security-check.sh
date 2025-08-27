#!/bin/bash

# Quick Security Check Script for PromptForge v3
# Tests security headers and basic security measures using curl

set -e

# Configuration
BASE_URL="${BASE_URL:-http://localhost:3000}"
API_ENDPOINT="${API_ENDPOINT:-/api/gpt-editor}"

echo "🔒 PromptForge v3 Quick Security Check"
echo "======================================="
echo "Base URL: $BASE_URL"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}✅ PASS${NC} $message"
    elif [ "$status" = "FAIL" ]; then
        echo -e "${RED}❌ FAIL${NC} $message"
    else
        echo -e "${YELLOW}⚠️  WARN${NC} $message"
    fi
}

# Test 1: Security Headers
echo "1. Testing Security Headers..."
echo "   Checking response headers..."

HEADERS=$(curl -s -I "$BASE_URL" | grep -i -E '^(Content-Security-Policy|Strict-Transport-Security|X-Frame-Options|X-Content-Type-Options|Referrer-Policy|Permissions-Policy|X-Permitted-Cross-Domain-Policies|X-Download-Options|X-XSS-Protection)')

if echo "$HEADERS" | grep -qi "Content-Security-Policy"; then
    print_status "PASS" "Content Security Policy header present"
else
    print_status "FAIL" "Content Security Policy header missing"
fi

if echo "$HEADERS" | grep -qi "X-Frame-Options.*DENY"; then
    print_status "PASS" "X-Frame-Options: DENY header present"
else
    print_status "FAIL" "X-Frame-Options: DENY header missing or incorrect"
fi

if echo "$HEADERS" | grep -qi "X-Content-Type-Options.*nosniff"; then
    print_status "PASS" "X-Content-Type-Options: nosniff header present"
else
    print_status "FAIL" "X-Content-Type-Options: nosniff header missing or incorrect"
fi

if echo "$HEADERS" | grep -qi "Referrer-Policy"; then
    print_status "PASS" "Referrer-Policy header present"
else
    print_status "FAIL" "Referrer-Policy header missing"
fi

# Test 2: Rate Limiting (Basic Test)
echo ""
echo "2. Testing Rate Limiting..."
echo "   Making multiple requests to trigger rate limiting..."

# Make 15 requests to trigger rate limiting
for i in {1..15}; do
    RESPONSE=$(curl -s -w "%{http_code}" -o /dev/null -X POST "$BASE_URL$API_ENDPOINT" \
        -H "Content-Type: application/json" \
        -H "x-user-id: test-user" \
        -d '{"content":"test","instruction":"test","orgId":"00000000-0000-0000-0000-000000000000","userId":"test-user"}')
    
    if [ "$RESPONSE" = "429" ]; then
        print_status "PASS" "Rate limiting triggered after $i requests"
        break
    fi
    
    if [ $i -eq 15 ]; then
        print_status "WARN" "Rate limiting may not be working (15 requests made without 429 response)"
    fi
done

# Test 3: Environment Variable Exposure
echo ""
echo "3. Testing Environment Variable Exposure..."
echo "   Checking for sensitive environment variables in response..."

# Get the HTML content and check for sensitive patterns
HTML_CONTENT=$(curl -s "$BASE_URL")

SENSITIVE_VARS=(
    "SUPABASE_SERVICE_ROLE_KEY"
    "STRIPE_SECRET_KEY"
    "STRIPE_WEBHOOK_SECRET"
    "SENDGRID_API_KEY"
    "JWT_SECRET"
    "ENCRYPTION_KEY"
)

EXPOSED_VARS=()
for var in "${SENSITIVE_VARS[@]}"; do
    if echo "$HTML_CONTENT" | grep -q "$var"; then
        EXPOSED_VARS+=("$var")
    fi
done

if [ ${#EXPOSED_VARS[@]} -eq 0 ]; then
    print_status "PASS" "No sensitive environment variables exposed in client bundle"
else
    print_status "FAIL" "CRITICAL: Sensitive variables exposed: ${EXPOSED_VARS[*]}"
fi

# Test 4: CORS Configuration
echo ""
echo "4. Testing CORS Configuration..."
echo "   Checking CORS headers with malicious origin..."

CORS_RESPONSE=$(curl -s -I -H "Origin: https://malicious-site.com" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type" \
    "$BASE_URL")

CORS_ORIGIN=$(echo "$CORS_RESPONSE" | grep -i "Access-Control-Allow-Origin" | head -1)

if [ -z "$CORS_ORIGIN" ]; then
    print_status "PASS" "CORS headers not present (good for security)"
elif echo "$CORS_ORIGIN" | grep -q "\*"; then
    print_status "FAIL" "CORS is too permissive (Access-Control-Allow-Origin: *)"
elif echo "$CORS_ORIGIN" | grep -q "malicious-site.com"; then
    print_status "FAIL" "CORS allows malicious origin"
else
    print_status "PASS" "CORS is properly restricted"
fi

# Test 5: HTTPS Enforcement (if applicable)
echo ""
echo "5. Testing HTTPS Enforcement..."

if [[ "$BASE_URL" == https://* ]]; then
    echo "   Testing HTTP to HTTPS redirect..."
    
    HTTP_URL=$(echo "$BASE_URL" | sed 's/https:/http:/')
    REDIRECT_RESPONSE=$(curl -s -I "$HTTP_URL" | grep -E "^(HTTP|Location)")
    
    if echo "$REDIRECT_RESPONSE" | grep -q "301\|302"; then
        if echo "$REDIRECT_RESPONSE" | grep -q "Location.*https://"; then
            print_status "PASS" "HTTP to HTTPS redirect is working"
        else
            print_status "FAIL" "HTTP redirects but not to HTTPS"
        fi
    else
        print_status "WARN" "No HTTP to HTTPS redirect detected"
    fi
else
    print_status "WARN" "Skipping HTTPS test (not using HTTPS)"
fi

# Test 6: Security Headers in API Responses
echo ""
echo "6. Testing API Security Headers..."
echo "   Checking security headers in API responses..."

API_HEADERS=$(curl -s -I "$BASE_URL$API_ENDPOINT" | grep -E '^(X-Content-Type-Options|X-Frame-Options|Referrer-Policy)')

if echo "$API_HEADERS" | grep -q "X-Content-Type-Options: nosniff"; then
    print_status "PASS" "API X-Content-Type-Options header present"
else
    print_status "FAIL" "API X-Content-Type-Options header missing"
fi

if echo "$API_HEADERS" | grep -q "X-Frame-Options: DENY"; then
    print_status "PASS" "API X-Frame-Options header present"
else
    print_status "FAIL" "API X-Frame-Options header missing"
fi

# Summary
echo ""
echo "📋 Security Check Summary"
echo "========================"
echo ""
echo "Run 'npm run security-test' for comprehensive testing"
echo "Run 'npm run security-check' for this quick check"
echo ""
echo "For production deployment, ensure:"
echo "- All environment variables are properly set"
echo "- HTTPS is enabled and enforced"
echo "- Rate limiting is configured appropriately"
echo "- Security headers are present on all routes"
echo ""
echo "🔒 Security is everyone's responsibility!"
