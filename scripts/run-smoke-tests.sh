#!/bin/bash

# PromptForge v3 - Smoke Test Runner
# Simple wrapper to run smoke tests with configuration

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/smoke-test-config.env"

echo "🚀 PromptForge v3 Smoke Test Runner"
echo "===================================="

# Check if config file exists
if [[ -f "$CONFIG_FILE" ]]; then
    echo "📁 Found configuration file: $CONFIG_FILE"
    echo "   Loading configuration..."
    source "$CONFIG_FILE"
    
    # Check required variables
    if [[ -z "$AUTH_TOKEN" ]]; then
        echo "❌ AUTH_TOKEN not set in configuration"
        exit 1
    fi
    
    if [[ -z "$ORG_ID" ]]; then
        echo "❌ ORG_ID not set in configuration"
        exit 1
    fi
    
    echo "✅ Configuration loaded successfully"
    echo "   Staging URL: ${STAGING_URL:-http://localhost:3000}"
    echo "   Auth Token: ${AUTH_TOKEN:0:20}..."
    echo "   Org ID: ${ORG_ID}"
    echo ""
    
    # Run the Node.js tests
    echo "🧪 Running smoke tests..."
    cd "$SCRIPT_DIR"
    node api-smoke-tests.js
    
else
    echo "❌ Configuration file not found: $CONFIG_FILE"
    echo ""
    echo "Please create the configuration file with your staging environment details:"
    echo "cp smoke-test-config.env .env.smoke"
    echo "edit .env.smoke with your values"
    echo ""
    echo "Or run with environment variables:"
    echo "STAGING_URL=https://staging.example.com \\"
    echo "AUTH_TOKEN=your_token \\"
    echo "ORG_ID=your_org_uuid \\"
    echo "node api-smoke-tests.js"
    exit 1
fi
