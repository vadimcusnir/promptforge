# PromptForge v3 - API Smoke Tests

Comprehensive testing suite for critical API endpoints to ensure functionality and security compliance.

## 🎯 Test Coverage

The smoke tests cover the following critical API endpoints:

### 1. Entitlements API (`/api/entitlements`)
- **Method**: GET
- **Purpose**: Retrieve organization entitlements and feature flags
- **Expected**: 200 + flags object
- **Security**: PII validation, org membership validation

### 2. GPT Editor API (`/api/gpt-editor`)
- **Method**: POST
- **Purpose**: Optimize prompts using AI
- **Expected**: 200 + promptEdited response
- **Security**: PII validation, rate limiting, org validation

### 3. GPT Test API (`/api/gpt-test`)
- **Method**: POST
- **Purpose**: Test prompts with GPT models (Pro entitlement required for real testing)
- **Expected**: 200 + verdict response
- **Security**: PII validation, entitlement gating, org validation

### 4. Export Bundle API (`/api/export/bundle`)
- **Method**: POST
- **Purpose**: Export prompt bundles (currently disabled during launch)
- **Expected**: 503 + LAUNCH_MODE code
- **Security**: PII validation, auth required

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Access to staging environment
- Valid authentication token
- Organization ID

### Installation
```bash
# Navigate to scripts directory
cd scripts

# Make scripts executable
chmod +x smoke-test-api.sh
chmod +x api-smoke-tests.js
```

### Running Tests

#### Option 1: Node.js Script (Recommended)
```bash
# Basic test against localhost
node api-smoke-tests.js

# Test against staging with environment variables
STAGING_URL=https://staging.example.com \
AUTH_TOKEN=your_token_here \
ORG_ID=your_org_uuid \
node api-smoke-tests.js

# Using config file
source smoke-test-config.env && node api-smoke-tests.js
```

#### Option 2: Bash Script
```bash
# Basic test
./smoke-test-api.sh

# Test with parameters
./smoke-test-api.sh https://staging.example.com your_token your_org_uuid
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `STAGING_URL` | Base URL for the staging environment | No | `http://localhost:3000` |
| `AUTH_TOKEN` | Authentication token for API requests | Yes* | - |
| `ORG_ID` | Organization ID for testing | Yes* | - |
| `VERBOSE` | Enable verbose output | No | `false` |
| `TIMEOUT` | Request timeout in milliseconds | No | `10000` |

*Required for most tests to pass

### Configuration File
Copy `smoke-test-config.env` and fill in your values:

```bash
cp smoke-test-config.env .env.smoke
# Edit .env.smoke with your actual values
source .env.smoke && node api-smoke-tests.js
```

## 🔍 Test Details

### Authentication
All endpoints require valid authentication via Bearer token in the Authorization header.

### PII Detection
Tests automatically scan responses for potential PII patterns:
- Email addresses
- Phone numbers
- Physical addresses
- SSNs
- Credit card numbers
- Passwords
- API keys
- Secrets

### Response Validation
Each test validates:
- HTTP status codes
- Response structure
- Success indicators
- Error handling
- Security headers

## 📊 Expected Results

### Success Criteria
- ✅ All endpoints return expected status codes
- ✅ No PII detected in responses
- ✅ Proper authentication enforcement
- ✅ Correct response structures

### Current Status
- **Entitlements**: 200 + flags (when authenticated)
- **GPT Editor**: 200 + promptEdited (when authenticated)
- **GPT Test**: 200 + verdict (when authenticated, mock mode)
- **Export Bundle**: 503 + LAUNCH_MODE (intentionally disabled)

## 🚨 Troubleshooting

### Common Issues

#### Authentication Errors
```bash
# Ensure AUTH_TOKEN is valid and not expired
# Check if token has proper permissions
```

#### Organization Access Denied
```bash
# Verify ORG_ID is correct
# Ensure user has access to the organization
```

#### Network Timeouts
```bash
# Increase TIMEOUT value
# Check network connectivity to staging
# Verify staging environment is accessible
```

#### PII Detection False Positives
```bash
# Review response content
# Check if patterns are legitimate (e.g., test data)
# Adjust PII patterns if needed
```

### Debug Mode
Enable verbose output for detailed debugging:

```bash
VERBOSE=true node api-smoke-tests.js
```

## 🔒 Security Considerations

### Data Protection
- Tests use mock data to avoid exposing real information
- PII scanning prevents accidental data leaks
- Authentication tokens are masked in output

### Environment Isolation
- Tests run against staging, not production
- No destructive operations performed
- Rate limiting respected

## 📈 Integration

### CI/CD Pipeline
Add to your deployment pipeline:

```yaml
# GitHub Actions example
- name: Run API Smoke Tests
  run: |
    cd scripts
    STAGING_URL=${{ secrets.STAGING_URL }} \
    AUTH_TOKEN=${{ secrets.AUTH_TOKEN }} \
    ORG_ID=${{ secrets.ORG_ID }} \
    node api-smoke-tests.js
```

### Pre-deployment Checks
Run tests before deploying to production:

```bash
# Pre-deployment validation
./scripts/smoke-test-api.sh $STAGING_URL $AUTH_TOKEN $ORG_ID
```

## 📝 Test Customization

### Adding New Tests
1. Create test function in `api-smoke-tests.js`
2. Add to `runTests()` function
3. Update `results.total` counter
4. Follow existing pattern for consistency

### Modifying PII Patterns
Edit the `checkPII()` function to add/remove patterns:

```javascript
const piiPatterns = [
  /email/i,
  /phone/i,
  // Add your custom patterns here
];
```

## 🤝 Contributing

When adding new tests or modifying existing ones:

1. Follow the established testing pattern
2. Include proper error handling
3. Add PII validation
4. Update documentation
5. Test against staging environment

## 📞 Support

For issues with the smoke tests:

1. Check the troubleshooting section
2. Enable verbose mode for detailed logs
3. Verify configuration values
4. Test individual endpoints manually
5. Review API documentation for changes

---

**Note**: These tests are designed for staging environments. Never run against production without proper authorization and consideration for production data.
