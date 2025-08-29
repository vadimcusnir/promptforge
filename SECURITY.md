# 🔒 PromptForge v3 Security Documentation

## Overview

This document outlines the comprehensive security measures implemented in PromptForge v3, including security headers, rate limiting, environment variable management, and testing procedures.

## Security Headers

### Content Security Policy (CSP)
- **Purpose**: Prevents XSS attacks and controls resource loading
- **Configuration**: Restricts script, style, and resource sources to trusted domains
- **Implementation**: Configured in `next.config.mjs`

```javascript
"Content-Security-Policy": [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https: blob:",
  "connect-src 'self' https://api.openai.com https://*.supabase.co https://api.stripe.com",
  "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests"
].join('; ')
```

### HTTP Strict Transport Security (HSTS)
- **Purpose**: Forces HTTPS connections and prevents protocol downgrade attacks
- **Configuration**: `max-age=31536000; includeSubDomains; preload`
- **Duration**: 1 year with subdomain coverage

### X-Frame-Options
- **Purpose**: Prevents clickjacking attacks
- **Value**: `DENY` (no embedding allowed)

### X-Content-Type-Options
- **Purpose**: Prevents MIME type sniffing
- **Value**: `nosniff`

### Referrer Policy
- **Purpose**: Controls referrer information in requests
- **Value**: `strict-origin-when-cross-origin`

### Permissions Policy
- **Purpose**: Restricts browser features and APIs
- **Restricted**: camera, microphone, geolocation, payment, USB, sensors

### Additional Security Headers
- `X-Permitted-Cross-Domain-Policies: none`
- `X-Download-Options: noopen`
- `X-XSS-Protection: 1; mode=block`

## Rate Limiting

### Implementation
- **Location**: `lib/rate-limit.ts`
- **Type**: In-memory rate limiting with automatic cleanup
- **Storage**: Per-client tracking with configurable windows

### Rate Limit Configurations

#### AI Operations (GPT Editor, Test, Run)
- **Window**: 1 minute
- **Limit**: 10 requests
- **Routes**: `/api/gpt-editor`, `/api/gpt-test`, `/api/run`

#### General API Usage
- **Window**: 1 minute
- **Limit**: 30 requests
- **Routes**: All other API endpoints

#### Authentication Attempts
- **Window**: 15 minutes
- **Limit**: 5 requests
- **Routes**: `/api/auth`, `/api/login`

#### Export Operations
- **Window**: 5 minutes
- **Limit**: 3 requests
- **Routes**: `/api/export`

### Rate Limiting Headers
API responses include rate limiting information:
- `X-RateLimit-Limit`: Maximum requests per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Reset time for the current window

## Environment Variable Security

### Server-Side Only Variables
These variables are NEVER exposed to the client:
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SENDGRID_API_KEY`
- `JWT_SECRET`
- `ENCRYPTION_KEY`

### Client-Safe Variables
Only variables prefixed with `NEXT_PUBLIC_` are exposed:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_BASE_URL`

### Validation
- **Server-side**: `validateServerEnv()` function
- **Client-side**: `validateClientEnv()` function
- **Exposure check**: `validateNoSensitiveKeysExposed()`

## API Security

### Input Validation
- **Schema**: Zod validation for all API endpoints
- **Length limits**: Content (10,000 chars), Instructions (1,000 chars)
- **Type checking**: UUID validation for organization and user IDs

### Authentication
- **Headers**: `x-user-id` header validation
- **Entitlements**: Server-side entitlement checking
- **Rate limiting**: Per-user rate limiting

### CORS Configuration
- **Origin**: Restricted to same origin
- **Methods**: Limited to necessary HTTP methods
- **Headers**: Restricted to required headers

## Testing and Validation

### Quick Security Check
```bash
# Run basic security tests
npm run security:check

# Test specific endpoint headers
npm run security:headers

# Validate environment variables
npm run security:validate
```

### Comprehensive Security Testing
```bash
# Run full security test suite
npm run security:test
```

### Manual Testing with curl
```bash
# Test security headers
curl -I http://localhost:3000

# Test rate limiting
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/gpt-editor \
    -H "Content-Type: application/json" \
    -H "x-user-id: test-user" \
    -d '{"content":"test","instruction":"test","orgId":"00000000-0000-0000-0000-000000000000","userId":"test-user"}'
done

# Test CORS
curl -H "Origin: https://malicious-site.com" \
  -H "Access-Control-Request-Method: POST" \
  -I http://localhost:3000
```

## Security Checklist

### Pre-Deployment
- [ ] All security headers are present
- [ ] Rate limiting is configured and tested
- [ ] Environment variables are properly set
- [ ] No sensitive keys are exposed to client
- [ ] Input validation is implemented
- [ ] Authentication is enforced
- [ ] CORS is properly configured

### Production Deployment
- [ ] HTTPS is enabled and enforced
- [ ] Security headers are verified
- [ ] Rate limiting is tested under load
- [ ] Environment variables are secure
- [ ] Monitoring and alerting are configured

### Ongoing Security
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning
- [ ] Rate limiting effectiveness monitoring
- [ ] Security header validation
- [ ] Environment variable exposure checks

## Security Best Practices

### Development
1. **Never commit sensitive keys** to version control
2. **Use environment variables** for all configuration
3. **Validate all inputs** with proper schemas
4. **Implement rate limiting** on all API endpoints
5. **Test security measures** before deployment

### Production
1. **Enable HTTPS** and enforce HSTS
2. **Monitor rate limiting** effectiveness
3. **Regular security scans** and updates
4. **Log security events** for monitoring
5. **Backup and recovery** procedures

### Incident Response
1. **Immediate rate limiting** for suspicious activity
2. **Log analysis** for security events
3. **Environment variable** rotation if compromised
4. **Security header** verification
5. **User notification** if necessary

## Security Tools

### Built-in Tools
- `lib/security.ts`: Environment variable validation
- `lib/rate-limit.ts`: Rate limiting implementation
- `scripts/test-security.js`: Comprehensive security testing
- `scripts/quick-security-check.sh`: Quick security validation

### External Tools
- **OWASP ZAP**: Web application security testing
- **Burp Suite**: Security testing and analysis
- **Security Headers**: Online security header checker
- **Mozilla Observatory**: Security configuration analysis

## Compliance

### Standards
- **OWASP Top 10**: Protection against common vulnerabilities
- **CSP Level 3**: Content Security Policy implementation
- **HSTS**: HTTP Strict Transport Security
- **GDPR**: Data protection and privacy

### Monitoring
- **Security headers**: Continuous validation
- **Rate limiting**: Effectiveness monitoring
- **Environment variables**: Exposure detection
- **API security**: Input validation and authentication

## Support and Reporting

### Security Issues
- **Report**: Create a security issue in the repository
- **Response**: 24-hour initial response time
- **Updates**: Regular security updates and patches

### Security Questions
- **Documentation**: This security guide
- **Testing**: Built-in security testing tools
- **Community**: Security-focused discussions

---

**Remember**: Security is everyone's responsibility. Regular testing, monitoring, and updates are essential for maintaining a secure application.

**Last Updated**: $(date)
**Version**: 1.0.0
