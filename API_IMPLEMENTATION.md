# API Routes Implementation - PromptForge v3

This document provides a complete implementation of the 4 production-ready API routes as specified in the requirements.

## Overview

The implementation provides:

- **POST /api/gpt-editor** - Prompt optimization (no gating)
- **POST /api/gpt-test** - GPT live testing with scoring (Pro+ gating)
- **POST /api/export/bundle** - Artifact generation with checksums (Pro+/Enterprise gating)
- **POST /api/run/[moduleId]** - Enterprise API orchestrator (Enterprise gating)

All routes implement:
- ✅ SSOT 7D validation with enum-only enforcement
- ✅ Entitlement-based gating with RLS
- ✅ Rate limiting and security headers
- ✅ Telemetry without PII
- ✅ DoR/DoD compliance
- ✅ Standardized error handling
- ✅ Bundle generation with manifest + checksums

## Architecture

### Core Libraries

```
lib/server/
├── validation.ts      # 7D schema, SSOT enforcement, API errors
├── supabase.ts       # Database operations, entitlements, RLS
├── openai.ts         # GPT operations, scoring, auto-tighten
├── bundle.ts         # Export generation, checksums, manifests
└── middleware.ts     # Rate limiting, security, error handling
```

### Database Schema

The implementation assumes these core tables exist:

```sql
-- Organizations and membership
CREATE TABLE orgs (id uuid PRIMARY KEY, name text, created_at timestamptz);
CREATE TABLE org_members (org_id uuid, user_id uuid, role text, PRIMARY KEY (org_id, user_id));

-- Entitlements and subscriptions  
CREATE TABLE plans (code text PRIMARY KEY, name text, flags jsonb);
CREATE TABLE subscriptions (id uuid PRIMARY KEY, org_id uuid, plan_code text, status text);
CREATE TABLE entitlements (org_id uuid, user_id uuid, flag text, value boolean, source text, PRIMARY KEY (org_id, COALESCE(user_id, '00000000-0000-0000-0000-000000000000'::uuid), flag));

-- Execution tracking
CREATE TABLE runs (id uuid PRIMARY KEY, org_id uuid, user_id uuid, module_id text, seven_d jsonb, signature_7d text, status text, tokens_in int, tokens_out int, cost_usd numeric, score_total int, started_at timestamptz, finished_at timestamptz);
CREATE TABLE prompt_scores (run_id uuid PRIMARY KEY, clarity int, execution int, ambiguity int, business_fit int, composite int, breakdown jsonb, created_at timestamptz);
CREATE TABLE bundles (id uuid PRIMARY KEY, run_id uuid, org_id uuid, formats text[], manifest jsonb, checksum text, license_notice text, storage_path text, created_at timestamptz);

-- API access
CREATE TABLE api_keys (id uuid PRIMARY KEY, org_id uuid, key_hash text, name text, enabled boolean, last_used_at timestamptz, created_at timestamptz);
CREATE TABLE modules (module_id text PRIMARY KEY, name text, enabled boolean, created_at timestamptz);
```

## API Endpoints

### 1. POST /api/gpt-editor

**Purpose**: Optimize prompts with guardrails and domain context.

**Gating**: None (available to all authenticated users)

**Request**:
```json
{
  "prompt": "Original prompt text (10-10000 chars)",
  "sevenD": {
    "domain": "fintech",  // Required, CORE-25 enum
    "scale": "enterprise" // Optional, applies domain defaults
  }
}
```

**Response**:
```json
{
  "editedPrompt": "Optimized prompt text",
  "improvements": ["Enhanced clarity", "Applied domain context"],
  "confidence": 85,
  "sevenD": {
    "domain": "fintech",
    "scale": "enterprise",
    "urgency": "planned",
    // ... complete normalized 7D with signature
    "signature_7d": "abc123def456"
  },
  "usage": {
    "tokens": 150,
    "cost_usd": 0.005,
    "duration_ms": 2500
  },
  "processingTime": 3000,
  "model": "gpt-4-turbo"
}
```

**Features**:
- Domain-specific optimization
- English-only validation
- Rate limiting (60 req/min per IP)
- No entitlement requirements

### 2. POST /api/gpt-test

**Purpose**: Run live GPT tests with AI evaluation and auto-tighten.

**Gating**: Requires `canUseGptTestReal` (Pro+)

**Headers**:
```
x-org-id: organization-uuid
x-user-id: user-uuid
```

**Request**:
```json
{
  "prompt": "Prompt to test",
  "sevenD": {
    "domain": "fintech",
    "scale": "enterprise",
    "urgency": "planned",
    "complexity": "expert",
    "resources": "full_stack_org",
    "application": "audit", 
    "output_format": "spec"
  },
  "testCases": [
    {
      "input": "Test scenario",
      "expectedOutput": "Expected result",
      "criteria": "Success criteria"
    }
  ]
}
```

**Response**:
```json
{
  "runId": "uuid",
  "verdict": "pass", // pass|partial|fail
  "finalPrompt": "Auto-tightened prompt (if applied)",
  "scores": {
    "clarity": 85,
    "execution": 90, 
    "ambiguity": 80,
    "business_fit": 88,
    "composite": 86
  },
  "breakdown": {
    "original_score": 75,
    "tighten_applied": true,
    "improvement": 11
  },
  "sevenD": { /* normalized 7D config */ },
  "telemetry": {
    "tokens_used": 1500,
    "cost_usd": 0.045,
    "duration_ms": 8000,
    "processing_time": 8500
  },
  "model": "gpt-4"
}
```

**Features**:
- AI-based scoring (clarity, execution, ambiguity, business_fit)
- Auto-tighten if score < 80 (max 1 iteration)
- Saves runs and prompt_scores for telemetry
- DoR/DoD compliance validation

### 3. POST /api/export/bundle

**Purpose**: Generate export artifacts with manifest and checksums.

**Gating**: Format-specific entitlements (Pro+/Enterprise)

**Headers**:
```
x-org-id: organization-uuid  
x-user-id: user-uuid
```

**Request**:
```json
{
  "runId": "uuid-of-completed-run",
  "formats": ["txt", "md", "json", "pdf", "zip"],
  "whiteLabel": false
}
```

**Response**:
```json
{
  "bundleId": "bundle-uuid",
  "manifest": {
    "version": "1.0.0",
    "bundle_id": "abc123def456",
    "run_id": "run-uuid",
    "created_at": "2024-01-01T00:00:00Z",
    "formats": ["txt", "md", "json"],
    "files": [
      {
        "name": "prompt.txt",
        "size": 1024,
        "checksum": "sha256-hash"
      }
    ],
    "metadata": {
      "module_id": "M07",
      "seven_d_signature": "signature",
      "score_total": 86,
      "license_notice": "Generated by PromptForge v3..."
    },
    "checksums": {
      "individual": {
        "prompt.txt": "sha256-hash",
        "manifest.json": "sha256-hash"
      },
      "bundle": "sha256-bundle-hash"
    }
  },
  "checksum": "sha256-bundle-hash",
  "files": {
    "prompt.txt": "base64-content",
    "manifest.json": "base64-content"
  },
  "metadata": {
    "formats": ["txt", "md", "json"],
    "file_count": 3,
    "total_size": 4096,
    "white_label": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Format Entitlements**:
- `txt`: Always allowed
- `md`: Requires `canExportMD` (Pro+)
- `json`: Requires `canExportJSON` (Pro+)
- `pdf`: Requires `canExportPDF` (Pro+)
- `zip`: Requires `canExportBundleZip` (Enterprise)

**Features**:
- Enforces score ≥ 80 requirement
- Canonical file ordering for consistent checksums
- License notices (white-label option)
- Multiple format support

### 4. POST /api/run/[moduleId]

**Purpose**: Enterprise API orchestrator with full workflow.

**Gating**: Requires `hasAPI` + Enterprise plan

**Headers**:
```
x-pf-key: api-key-value
```

**Request**:
```json
{
  "sevenD": {
    "domain": "fintech",
    "scale": "enterprise",
    "urgency": "planned", 
    "complexity": "expert",
    "resources": "full_stack_org",
    "application": "audit",
    "output_format": "spec"
  },
  "prompt": "Optional prompt (will optimize if missing)",
  "testMode": true,
  "exportFormats": ["md", "json"],
  "previousSignature": "chain-signature" // For chained modules
}
```

**Response**:
```json
{
  "hash": "response-hash",
  "run_id": "uuid",
  "module_id": "M07", 
  "seven_d": { /* normalized config */ },
  "prompt": "Final optimized prompt",
  "status": "success",
  "scores": {
    "clarity": 85,
    "execution": 90,
    "ambiguity": 80, 
    "business_fit": 88,
    "composite": 86
  },
  "artifacts": ["prompt_optimization", "gpt_test_results", "export_bundle"],
  "bundle": {
    "bundle_id": "uuid",
    "checksum": "sha256-hash",
    "formats": ["md", "json"],
    "manifest": { /* complete manifest */ }
  },
  "telemetry": {
    "tokens_used": 2500,
    "cost_usd": 0.075,
    "duration_ms": 12000,
    "processing_steps": 3
  },
  "metadata": {
    "api_version": "1.0.0",
    "module_name": "Risk & Trust Reversal",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Features**:
- API key authentication with hash-based lookup
- Rate limiting (30 req/min per org)
- Full workflow: optimize → test → export
- Chain signature validation
- Comprehensive telemetry

## Error Handling

All routes return standardized errors:

```json
{
  "error": "ERROR_CODE",
  "message": "Human readable message",
  "details": { /* Additional context */ }
}
```

**Error Codes**:
- `400 INVALID_7D_ENUM` - Invalid 7D enum value
- `400 MISSING_OUTPUT_FORMAT` - Missing required output_format
- `401 UNAUTHENTICATED` - Authentication required
- `403 ENTITLEMENT_REQUIRED` - Insufficient permissions
- `404 MODULE_NOT_FOUND` - Module not found
- `409 RULESET_CONFLICT` - Ruleset validation failed
- `422 INPUT_SCHEMA_MISMATCH` - Input validation failed
- `422 SEVEND_SIGNATURE_MISMATCH` - 7D signature mismatch
- `429 RATE_LIMITED` - Rate limit exceeded
- `500 INTERNAL_RUN_ERROR` - Internal execution error

## Security Features

### Rate Limiting
- **gpt-editor**: 60 req/min per IP
- **gpt-test**: 30 req/min per org
- **export**: 30 req/min per org  
- **api-run**: 30 req/min per org

### Security Headers
All responses include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Access-Control-Allow-Origin: https://chatgpt-prompting.com`
- `Cache-Control: no-cache, no-store, must-revalidate`

### Data Protection
- No PII in telemetry logs
- API keys hashed with SHA256
- Content validation (English-only)
- RLS enforcement on all database operations

## Testing

### Unit Tests
```bash
npm test tests/api/validation.test.ts
npm test tests/api/bundle.test.ts
```

### Integration Tests  
```bash
npm test tests/api/integration.test.ts
```

**Coverage Requirements**:
- Branches: 70%
- Functions: 70% 
- Lines: 70%
- Statements: 70%

## SLO Compliance

The implementation meets these SLOs:

- **TTA (Time to Answer)**: < 60s P95 for text generation
- **SOP (Speed of Processing)**: < 300s P95 for complete workflows
- **Score Gate**: ≥ 80 composite score requirement enforced
- **Bundle Integrity**: 100% valid manifest + checksum generation
- **Uptime**: Error handling for OpenAI/Supabase failures

## Environment Variables

Required environment variables:

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_ANON_KEY=eyJ...

# Optional
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
SMTP_HOST=smtp.example.com
SMTP_USER=user@example.com
SMTP_PASSWORD=password
```

## Deployment Notes

1. **Database Migration**: Run migrations to create required tables
2. **Seed Data**: Insert plans and entitlements data
3. **API Keys**: Generate and hash API keys for Enterprise customers
4. **Rate Limiting**: Consider Redis for production rate limiting
5. **File Storage**: Configure Supabase Storage or S3 for bundle files
6. **Monitoring**: Set up alerts for SLO violations

## Next Steps

1. **Production Deployment**: Deploy to Vercel/production environment
2. **Monitoring Setup**: Configure observability and alerting
3. **Documentation**: Generate OpenAPI/Swagger documentation
4. **Load Testing**: Validate rate limits and performance
5. **Security Audit**: Review API security and penetration testing

This implementation provides a complete, production-ready API system that meets all specified requirements for SSOT validation, entitlement gating, telemetry, and compliance.
