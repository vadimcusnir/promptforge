import { describe, it, expect } from '@jest/globals';
import { 
  normalize7D, 
  generate7DSignature, 
  GPTEditorRequestSchema,
  GPTTestRequestSchema,
  ExportBundleRequestSchema,
  RunModuleRequestSchema,
  APIError,
  DOMAIN_DEFAULTS 
} from '../../lib/server/validation';

describe('7D Validation', () => {
  describe('normalize7D', () => {
    it('should normalize valid 7D configuration', () => {
      const input = {
        domain: 'fintech' as const,
        scale: 'enterprise' as const,
        urgency: 'planned' as const,
        complexity: 'expert' as const,
        resources: 'full_stack_org' as const,
        application: 'audit' as const,
        output_format: 'spec' as const,
      };

      const result = normalize7D(input);

      expect(result).toMatchObject(input);
      expect(result.signature_7d).toBeDefined();
      expect(result.signature_7d).toHaveLength(16);
    });

    it('should apply domain defaults for missing values', () => {
      const input = {
        domain: 'saas' as const,
      };

      const result = normalize7D(input);

      expect(result.domain).toBe('saas');
      expect(result.scale).toBe(DOMAIN_DEFAULTS.saas.scale);
      expect(result.urgency).toBe(DOMAIN_DEFAULTS.saas.urgency);
      expect(result.complexity).toBe(DOMAIN_DEFAULTS.saas.complexity);
      expect(result.resources).toBe(DOMAIN_DEFAULTS.saas.resources);
      expect(result.application).toBe(DOMAIN_DEFAULTS.saas.application);
      expect(result.output_format).toBe(DOMAIN_DEFAULTS.saas.output_format);
    });

    it('should throw error for missing domain', () => {
      expect(() => normalize7D({})).toThrow('MISSING_DOMAIN');
    });

    it('should throw error for invalid domain enum', () => {
      expect(() => normalize7D({ domain: 'invalid' as any })).toThrow('INVALID_7D_ENUM:domain');
    });

    it('should throw error for invalid scale enum', () => {
      expect(() => normalize7D({ 
        domain: 'saas',
        scale: 'invalid' as any 
      })).toThrow('INVALID_7D_ENUM:scale');
    });
  });

  describe('generate7DSignature', () => {
    it('should generate consistent signatures for same config', () => {
      const config = {
        domain: 'fintech' as const,
        scale: 'enterprise' as const,
        urgency: 'planned' as const,
        complexity: 'expert' as const,
        resources: 'full_stack_org' as const,
        application: 'audit' as const,
        output_format: 'spec' as const,
      };

      const sig1 = generate7DSignature(config);
      const sig2 = generate7DSignature(config);

      expect(sig1).toBe(sig2);
      expect(sig1).toHaveLength(16);
    });

    it('should generate different signatures for different configs', () => {
      const config1 = {
        domain: 'fintech' as const,
        scale: 'enterprise' as const,
        urgency: 'planned' as const,
        complexity: 'expert' as const,
        resources: 'full_stack_org' as const,
        application: 'audit' as const,
        output_format: 'spec' as const,
      };

      const config2 = {
        ...config1,
        domain: 'saas' as const,
      };

      const sig1 = generate7DSignature(config1);
      const sig2 = generate7DSignature(config2);

      expect(sig1).not.toBe(sig2);
    });
  });
});

describe('Request Schema Validation', () => {
  describe('GPTEditorRequestSchema', () => {
    it('should validate valid GPT editor request', () => {
      const request = {
        prompt: 'Test prompt for optimization',
        sevenD: {
          domain: 'fintech',
          scale: 'enterprise',
        },
      };

      const result = GPTEditorRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
    });

    it('should reject prompt that is too short', () => {
      const request = {
        prompt: 'short',
        sevenD: { domain: 'fintech' },
      };

      const result = GPTEditorRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    it('should reject missing domain', () => {
      const request = {
        prompt: 'Test prompt for optimization',
        sevenD: { scale: 'enterprise' },
      };

      const result = GPTEditorRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });
  });

  describe('GPTTestRequestSchema', () => {
    it('should validate valid GPT test request', () => {
      const request = {
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
        testCases: [
          {
            input: 'Test input',
            expectedOutput: 'Expected output',
            criteria: 'Test criteria',
          },
        ],
      };

      const result = GPTTestRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
    });

    it('should require complete 7D configuration', () => {
      const request = {
        prompt: 'Test prompt for GPT testing',
        sevenD: {
          domain: 'fintech',
          // Missing other required fields
        },
      };

      const result = GPTTestRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });
  });

  describe('ExportBundleRequestSchema', () => {
    it('should validate valid export request', () => {
      const request = {
        runId: '123e4567-e89b-12d3-a456-426614174000',
        formats: ['txt', 'md', 'json'],
        whiteLabel: false,
      };

      const result = ExportBundleRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID', () => {
      const request = {
        runId: 'invalid-uuid',
        formats: ['txt'],
      };

      const result = ExportBundleRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    it('should reject empty formats array', () => {
      const request = {
        runId: '123e4567-e89b-12d3-a456-426614174000',
        formats: [],
      };

      const result = ExportBundleRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });
  });

  describe('RunModuleRequestSchema', () => {
    it('should validate valid run module request', () => {
      const request = {
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
        prompt: 'Test prompt for module execution',
        testMode: true,
        exportFormats: ['md', 'json'],
      };

      const result = RunModuleRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
    });

    it('should reject invalid module ID format', () => {
      const request = {
        moduleId: 'INVALID',
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

      const result = RunModuleRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });
  });
});

describe('APIError', () => {
  it('should create API error with correct properties', () => {
    const error = new APIError('INVALID_7D_ENUM', { field: 'domain' });

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('APIError');
    expect(error.apiCode).toBe('INVALID_7D_ENUM');
    expect(error.code).toBe(400);
    expect(error.message).toBe('Invalid 7D enum value');
    expect(error.details).toEqual({ field: 'domain' });
  });

  it('should handle different error types', () => {
    const errors = [
      ['UNAUTHENTICATED', 401],
      ['ENTITLEMENT_REQUIRED', 403],
      ['MODULE_NOT_FOUND', 404],
      ['RATE_LIMITED', 429],
      ['INTERNAL_RUN_ERROR', 500],
    ] as const;

    errors.forEach(([apiCode, expectedCode]) => {
      const error = new APIError(apiCode);
      expect(error.code).toBe(expectedCode);
      expect(error.apiCode).toBe(apiCode);
    });
  });
});
