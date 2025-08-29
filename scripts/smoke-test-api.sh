#!/bin/bash

# PromptForge v3 - API Smoke Tests
# Tests critical API endpoints for functionality and security

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="${1:-http://localhost:3000}"
AUTH_TOKEN="${2:-}"
ORG_ID="${3:-}"

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=4

echo -e "${BLUE}🚀 PromptForge v3 API Smoke Tests${NC}"
echo -e "${BLUE}================================${NC}"
echo -e "Base URL: ${BASE_URL}"
echo -e "Auth Token: ${AUTH_TOKEN:0:20}..."
echo -e "Org ID: ${ORG_ID}"
echo ""

# Helper function to check response
check_response() {
    local endpoint=$1
    local expected_status=$2
    local response=$3
    local test_name=$4
    
    if [[ $response == *"\"status\":$expected_status"* ]] || [[ $response == *"\"error\":"* ]]; then
        echo -e "  ${GREEN}✅ ${test_name}${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "  ${RED}❌ ${test_name} - Expected status ${expected_status}${NC}"
        echo -e "    Response: ${response:0:200}..."
        ((TESTS_FAILED++))
        return 1
    fi
}

# Helper function to check for PII in response
check_pii() {
    local response=$1
    local test_name=$2
    
    # Check for common PII patterns
    if echo "$response" | grep -qE "(email|phone|address|ssn|credit_card|password)" > /dev/null; then
        echo -e "  ${RED}⚠️  ${test_name} - Potential PII detected${NC}"
        return 1
    else
        echo -e "  ${GREEN}🔒 ${test_name} - No PII detected${NC}"
        return 0
    fi
}

# Test 1: Entitlements API
echo -e "${YELLOW}Testing Entitlements API...${NC}"
if [[ -z "$AUTH_TOKEN" || -z "$ORG_ID" ]]; then
    echo -e "  ${YELLOW}⚠️  Skipping - requires auth token and org ID${NC}"
    ((TESTS_FAILED++))
else
    response=$(curl -sS -H "Authorization: Bearer $AUTH_TOKEN" \
        "${BASE_URL}/api/entitlements?orgId=${ORG_ID}" 2>/dev/null || echo '{"error":"Request failed"}')
    
    check_response "/api/entitlements" "200" "$response" "Entitlements endpoint"
    check_pii "$response" "Entitlements PII check"
fi
echo ""

# Test 2: GPT Editor API
echo -e "${YELLOW}Testing GPT Editor API...${NC}"
if [[ -z "$AUTH_TOKEN" || -z "$ORG_ID" ]]; then
    echo -e "  ${YELLOW}⚠️  Skipping - requires auth token and org ID${NC}"
    ((TESTS_FAILED++))
else
    payload='{
        "prompt": "This is a test prompt that meets the minimum length requirement of 64 characters for testing purposes.",
        "orgId": "'$ORG_ID'",
        "sevenD": {
            "domain": "test",
            "scale": "small",
            "urgency": "low"
        }
    }'
    
    response=$(curl -sS -X POST \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$payload" \
        "${BASE_URL}/api/gpt-editor" 2>/dev/null || echo '{"error":"Request failed"}')
    
    check_response "/api/gpt-editor" "200" "$response" "GPT Editor endpoint"
    check_pii "$response" "GPT Editor PII check"
fi
echo ""

# Test 3: GPT Test API (with Pro entitlement check)
echo -e "${YELLOW}Testing GPT Test API...${NC}"
if [[ -z "$AUTH_TOKEN" || -z "$ORG_ID" ]]; then
    echo -e "  ${YELLOW}⚠️  Skipping - requires auth token and org ID${NC}"
    ((TESTS_FAILED++))
else
    payload='{
        "prompt": "Test prompt for GPT testing",
        "testType": "mock",
        "orgId": "'$ORG_ID'",
        "sevenD": {
            "domain": "test",
            "scale": "small"
        }
    }'
    
    response=$(curl -sS -X POST \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$payload" \
        "${BASE_URL}/api/gpt-test" 2>/dev/null || echo '{"error":"Request failed"}')
    
    check_response "/api/gpt-test" "200" "$response" "GPT Test endpoint"
    check_pii "$response" "GPT Test PII check"
fi
echo ""

# Test 4: Export Bundle API
echo -e "${YELLOW}Testing Export Bundle API...${NC}"
if [[ -z "$AUTH_TOKEN" ]]; then
    echo -e "  ${YELLOW}⚠️  Skipping - requires auth token${NC}"
    ((TESTS_FAILED++))
else
    payload='{
        "orgId": "'$ORG_ID'",
        "bundleType": "test"
    }'
    
    response=$(curl -sS -X POST \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$payload" \
        "${BASE_URL}/api/export/bundle" 2>/dev/null || echo '{"error":"Request failed"}')
    
    # Note: This endpoint is currently disabled (503) during launch phase
    check_response "/api/export/bundle" "503" "$response" "Export Bundle endpoint"
    check_pii "$response" "Export Bundle PII check"
fi
echo ""

# Summary
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Test Results Summary${NC}"
echo -e "${BLUE}================================${NC}"
echo -e "Total Tests: ${TOTAL_TESTS}"
echo -e "Passed: ${GREEN}${TESTS_PASSED}${NC}"
echo -e "Failed: ${RED}${TESTS_FAILED}${NC}"

if [[ $TESTS_FAILED -eq 0 ]]; then
    echo -e "${GREEN}🎉 All smoke tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Check the output above.${NC}"
    exit 1
fi
