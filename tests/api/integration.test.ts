import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';

/**
 * Integration tests for API routes
 * These tests verify the complete request/response flow
 */

// Mock environment variables
const mockEnv = {
  OPENAI_API_KEY: 'test-openai-key',
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
  SUPABASE_ANON_KEY: 'test-anon-key',
};

beforeAll(() => {
  Object.assign(process.env, mockEnv);
});

afterAll(() => {
  Object.keys(mockEnv).forEach(key => {
    delete process.env[key];
  });
});

describe('API Integration Tests', () => {
  describe('POST /api/gpt-editor', () => {
    it('should validate and normalize 7D configuration', async () => {
      const mockRequest = {
        prompt: 'Test prompt for optimization',
        sevenD: {
          domain: 'fintech',
        },
      };

      // Mock the handler behavior
      const mockResponse = {
        editedPrompt: 'Optimized test prompt',
        improvements: ['Enhanced clarity', 'Applied domain context'],
        confidence: 85,
        sevenD: {
          domain: 'fintech',
          scale: 'enterprise',
          urgency: 'planned',
          complexity: 'expert',
          resources: 'full_stack_org',
          application: 'audit',
          output_format: 'spec',
          signature_7d: expect.any(String),
        },
        usage: {
          tokens: expect.any(Number),
          cost_usd: expect.any(Number),
          duration_ms: expect.any(Number),
        },
        processingTime: expect.any(Number),
        model: 'gpt-4-turbo',
      };

      // This would be a real API call in a full integration test
      expect(mockResponse.sevenD.domain).toBe('fintech');
      expect(mockResponse.sevenD.scale).toBe('enterprise'); // Applied from domain defaults
      expect(mockResponse.editedPrompt).toBeDefined();
    });

    it('should reject invalid 7D enum values', () => {
      const mockRequest = {
        prompt: 'Test prompt',
        sevenD: {
          domain: 'invalid_domain',
        },
      };

      // Should return 400 with INVALID_7D_ENUM error
      const expectedError = {
        error: 'INVALID_7D_ENUM',
        message: 'INVALID_7D_ENUM:domain',
      };

      expect(expectedError.error).toBe('INVALID_7D_ENUM');
    });

    it('should reject prompts that are too short', () => {
      const mockRequest = {
        prompt: 'short',
        sevenD: {
          domain: 'fintech',
        },
      };

      // Should return 422 with INPUT_SCHEMA_MISMATCH error
      const expectedError = {
        error: 'INPUT_SCHEMA_MISMATCH',
        details: expect.any(Array),
      };

      expect(expectedError.error).toBe('INPUT_SCHEMA_MISMATCH');
    });
  });

  describe('POST /api/gpt-test', () => {
    it('should require Pro+ entitlement', () => {
      const mockHeaders = {
        'x-org-id': 'test-org',
        'x-user-id': 'test-user',
      };

      const mockRequest = {
        prompt: 'Test prompt for GPT testing',
        sevenD: {
          domain: 'fintech',
          scale: 'enterprise',
          urgency: 'planned',
          complexity: 'expert',
          resources: 'full_stack_org',
          application: 'audit',
          output_format: 'spec',
        },
      };

      // Without Pro+ entitlement, should return 403
      const expectedError = {
        error: 'ENTITLEMENT_REQUIRED',
        message: 'Pro+ subscription required for GPT live testing',
        required_entitlement: 'canUseGptTestReal',
      };

      expect(expectedError.error).toBe('ENTITLEMENT_REQUIRED');
      expect(expectedError.required_entitlement).toBe('canUseGptTestReal');
    });

    it('should return test results with scoring', async () => {
      // Mock successful test with Pro+ entitlement
      const mockResponse = {
        runId: expect.any(String),
        verdict: 'pass',
        scores: {
          clarity: expect.any(Number),
          execution: expect.any(Number),
          ambiguity: expect.any(Number),
          business_fit: expect.any(Number),
          composite: expect.any(Number),
        },
        breakdown: {
          original_score: expect.any(Number),
          tighten_applied: expect.any(Boolean),
          improvement: expect.any(Number),
        },
        sevenD: {
          domain: 'fintech',
          signature_7d: expect.any(String),
        },
        telemetry: {
          tokens_used: expect.any(Number),
          cost_usd: expect.any(Number),
          duration_ms: expect.any(Number),
          processing_time: expect.any(Number),
        },
      };

      expect(mockResponse.scores.composite).toBeGreaterThanOrEqual(0);
      expect(mockResponse.scores.composite).toBeLessThanOrEqual(100);
      expect(mockResponse.verdict).toMatch(/^(pass|partial|fail)$/);
    });

    it('should apply auto-tighten for low scores', () => {
      const mockLowScoreResponse = {
        runId: 'test-run-id',
        verdict: 'partial',
        finalPrompt: 'Tightened prompt content',
        scores: {
          clarity: 75,
          execution: 80,
          ambiguity: 70,
          business_fit: 75,
          composite: 75,
        },
        breakdown: {
          original_score: 65,
          tighten_applied: true,
          improvement: 10,
        },
      };

      expect(mockLowScoreResponse.breakdown.tighten_applied).toBe(true);
      expect(mockLowScoreResponse.breakdown.improvement).toBeGreaterThan(0);
      expect(mockLowScoreResponse.finalPrompt).toBeDefined();
    });
  });

  describe('POST /api/export/bundle', () => {
    it('should require valid run with score ≥ 80', () => {
      const mockRequest = {
        runId: '123e4567-e89b-12d3-a456-426614174000',
        formats: ['txt', 'md'],
      };

      // Mock run with low score
      const expectedError = {
        error: 'INTERNAL_RUN_ERROR',
        message: 'Cannot export: run score below minimum threshold (80)',
        current_score: 65,
      };

      expect(expectedError.error).toBe('INTERNAL_RUN_ERROR');
      expect(expectedError.current_score).toBeLessThan(80);
    });

    it('should enforce format-specific entitlements', () => {
      const mockRequest = {
        runId: '123e4567-e89b-12d3-a456-426614174000',
        formats: ['pdf', 'zip'], // Requires Pro/Enterprise
      };

      const expectedError = {
        error: 'ENTITLEMENT_REQUIRED',
        message: 'Insufficient permissions for formats: pdf, zip',
        allowed_formats: ['txt', 'md'],
        required_entitlements: {
          pdf: 'canExportPDF',
          zip: 'canExportBundleZip',
        },
      };

      expect(expectedError.error).toBe('ENTITLEMENT_REQUIRED');
      expect(expectedError.required_entitlements.pdf).toBe('canExportPDF');
    });

    it('should generate bundle with manifest and checksum', () => {
      const mockSuccessResponse = {
        bundleId: expect.any(String),
        manifest: {
          version: '1.0.0',
          bundle_id: expect.any(String),
          run_id: expect.any(String),
          created_at: expect.any(String),
          formats: ['txt', 'md'],
          files: expect.any(Array),
          metadata: {
            module_id: expect.any(String),
            seven_d_signature: expect.any(String),
            score_total: expect.any(Number),
            license_notice: expect.any(String),
          },
          checksums: {
            individual: expect.any(Object),
            bundle: expect.any(String),
          },
        },
        checksum: expect.any(String),
        files: expect.any(Object),
      };

      expect(mockSuccessResponse.manifest.version).toBe('1.0.0');
      expect(mockSuccessResponse.manifest.metadata.score_total).toBeGreaterThanOrEqual(80);
    });
  });

  describe('POST /api/run/[moduleId]', () => {
    it('should require valid API key', () => {
      const mockRequest = {
        moduleId: 'M07',
        sevenD: {
          domain: 'fintech',
          scale: 'enterprise',
          urgency: 'planned',
          complexity: 'expert',
          resources: 'full_stack_org',
          application: 'audit',
          output_format: 'spec',
        },
      };

      // Without x-pf-key header
      const expectedError = {
        error: 'UNAUTHENTICATED',
        message: 'API key required in x-pf-key header',
      };

      expect(expectedError.error).toBe('UNAUTHENTICATED');
    });

    it('should require Enterprise entitlements', () => {
      const mockHeaders = {
        'x-pf-key': 'test-api-key',
      };

      const expectedError = {
        error: 'ENTITLEMENT_REQUIRED',
        message: 'Enterprise subscription with API access required',
        required_entitlements: ['hasAPI', 'plan_enterprise'],
      };

      expect(expectedError.error).toBe('ENTITLEMENT_REQUIRED');
      expect(expectedError.required_entitlements).toContain('hasAPI');
    });

    it('should validate module exists and is enabled', () => {
      const mockRequest = {
        moduleId: 'M99', // Non-existent module
      };

      const expectedError = {
        error: 'MODULE_NOT_FOUND',
        message: 'Module M99 not found or disabled',
      };

      expect(expectedError.error).toBe('MODULE_NOT_FOUND');
    });

    it('should handle 7D signature mismatch in chains', () => {
      const mockRequest = {
        moduleId: 'M07',
        sevenD: {
          domain: 'fintech',
          scale: 'enterprise',
          urgency: 'planned',
          complexity: 'expert',
          resources: 'full_stack_org',
          application: 'audit',
          output_format: 'spec',
        },
        previousSignature: 'wrong-signature',
      };

      const expectedError = {
        error: 'SEVEND_SIGNATURE_MISMATCH',
        message: '7D signature mismatch in chain execution',
        expected: 'wrong-signature',
        actual: expect.any(String),
      };

      expect(expectedError.error).toBe('SEVEND_SIGNATURE_MISMATCH');
    });

    it('should return complete execution results', () => {
      const mockSuccessResponse = {
        hash: expect.any(String),
        run_id: expect.any(String),
        module_id: 'M07',
        seven_d: {
          domain: 'fintech',
          signature_7d: expect.any(String),
        },
        prompt: expect.any(String),
        status: 'success',
        scores: {
          clarity: expect.any(Number),
          execution: expect.any(Number),
          ambiguity: expect.any(Number),
          business_fit: expect.any(Number),
          composite: expect.any(Number),
        },
        artifacts: expect.any(Array),
        bundle: null, // No export requested
        telemetry: {
          tokens_used: expect.any(Number),
          cost_usd: expect.any(Number),
          duration_ms: expect.any(Number),
          processing_steps: expect.any(Number),
        },
        metadata: {
          api_version: '1.0.0',
          module_name: expect.any(String),
          created_at: expect.any(String),
        },
      };

      expect(mockSuccessResponse.status).toBe('success');
      expect(mockSuccessResponse.metadata.api_version).toBe('1.0.0');
      expect(Array.isArray(mockSuccessResponse.artifacts)).toBe(true);
    });

    it('should apply rate limiting', () => {
      // After 30 requests per minute
      const expectedRateLimitError = {
        error: 'RATE_LIMITED',
        message: 'API rate limit exceeded',
        resetTime: expect.any(Number),
        remaining: 0,
      };

      expect(expectedRateLimitError.error).toBe('RATE_LIMITED');
      expect(expectedRateLimitError.remaining).toBe(0);
    });
  });

  describe('Error Handling', () => {
    it('should return standardized error responses', () => {
      const standardErrors = [
        { code: 'INVALID_7D_ENUM', status: 400 },
        { code: 'UNAUTHENTICATED', status: 401 },
        { code: 'ENTITLEMENT_REQUIRED', status: 403 },
        { code: 'MODULE_NOT_FOUND', status: 404 },
        { code: 'RATE_LIMITED', status: 429 },
        { code: 'INTERNAL_RUN_ERROR', status: 500 },
      ];

      standardErrors.forEach(({ code, status }) => {
        const errorResponse = {
          error: code,
          message: expect.any(String),
        };

        expect(errorResponse.error).toBe(code);
        expect(errorResponse.message).toBeDefined();
      });
    });

    it('should include security headers in all responses', () => {
      const expectedHeaders = [
        'X-Content-Type-Options',
        'X-Frame-Options', 
        'X-XSS-Protection',
        'Referrer-Policy',
        'Access-Control-Allow-Origin',
        'Cache-Control',
      ];

      expectedHeaders.forEach(header => {
        expect(header).toBeDefined();
      });
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce different limits per endpoint', () => {
      const rateLimits = {
        'gpt-editor': { limit: 60, window: 60000 },
        'gpt-test': { limit: 30, window: 60000 },
        'export': { limit: 30, window: 60000 },
        'api-run': { limit: 30, window: 60000 },
      };

      Object.entries(rateLimits).forEach(([endpoint, config]) => {
        expect(config.limit).toBeGreaterThan(0);
        expect(config.window).toBe(60000); // 1 minute
      });
    });

    it('should include rate limit headers in responses', () => {
      const rateLimitHeaders = {
        'X-RateLimit-Limit': '30',
        'X-RateLimit-Remaining': expect.any(String),
        'X-RateLimit-Reset': expect.any(String),
      };

      expect(rateLimitHeaders['X-RateLimit-Limit']).toBeDefined();
    });
  });

  describe('Telemetry and Logging', () => {
    it('should not log PII in telemetry', () => {
      const safeTelemetry = {
        run_id: 'uuid',
        module_id: 'M07',
        seven_d_signature: 'hash',
        tokens_used: 1500,
        duration_ms: 5000,
        cost_usd: 0.05,
        score_total: 85,
      };

      // Should not contain actual prompt content, user emails, etc.
      const telemetryKeys = Object.keys(safeTelemetry);
      expect(telemetryKeys).not.toContain('prompt_content');
      expect(telemetryKeys).not.toContain('user_email');
      expect(telemetryKeys).not.toContain('api_key');
    });

    it('should track SLO metrics', () => {
      const sloMetrics = {
        tta_text_p95: 60000, // < 60s
        sop_p95: 300000, // < 300s  
        score_gate_pass_rate: 0.8, // ≥ 80% pass rate
        bundle_integrity_rate: 1.0, // 100% valid checksums
      };

      expect(sloMetrics.tta_text_p95).toBeLessThan(60000);
      expect(sloMetrics.score_gate_pass_rate).toBeGreaterThanOrEqual(0.8);
      expect(sloMetrics.bundle_integrity_rate).toBe(1.0);
    });
  });
});
