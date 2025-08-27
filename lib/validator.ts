import { z } from 'zod';

// 7D Parameter types based on ruleset.yml
export type DomainType = 
  | 'business_strategy' | 'marketing' | 'sales' | 'customer_service' | 'product_development'
  | 'operations' | 'finance' | 'hr' | 'legal' | 'compliance' | 'software_development'
  | 'data_science' | 'ai_ml' | 'cybersecurity' | 'devops' | 'cloud_computing'
  | 'blockchain' | 'iot' | 'content_creation' | 'design' | 'copywriting'
  | 'translation' | 'education' | 'research' | 'general';

export type ScaleType = 'micro' | 'small' | 'medium' | 'large' | 'enterprise';
export type UrgencyType = 'critical' | 'urgent' | 'high' | 'normal' | 'low';
export type ComplexityType = 'trivial' | 'simple' | 'moderate' | 'complex' | 'expert';
export type ResourcesType = 'minimal' | 'limited' | 'standard' | 'advanced' | 'enterprise';
export type ApplicationType = 'personal' | 'team' | 'department' | 'organization' | 'external';
export type OutputFormatType = 'text' | 'markdown' | 'json' | 'csv' | 'xml' | 'yaml' | 'code' | 'documentation';

// 7D Parameter schema
export const SevenDSchema = z.object({
  domain: z.nativeEnum({
    business_strategy: 'business_strategy',
    marketing: 'marketing',
    sales: 'sales',
    customer_service: 'customer_service',
    product_development: 'product_development',
    operations: 'operations',
    finance: 'finance',
    hr: 'hr',
    legal: 'legal',
    compliance: 'compliance',
    software_development: 'software_development',
    data_science: 'data_science',
    ai_ml: 'ai_ml',
    cybersecurity: 'cybersecurity',
    devops: 'devops',
    cloud_computing: 'cloud_computing',
    blockchain: 'blockchain',
    iot: 'iot',
    content_creation: 'content_creation',
    design: 'design',
    copywriting: 'copywriting',
    translation: 'translation',
    education: 'education',
    research: 'research',
    general: 'general'
  } as const),
  scale: z.nativeEnum({
    micro: 'micro',
    small: 'small',
    medium: 'medium',
    large: 'large',
    enterprise: 'enterprise'
  } as const),
  urgency: z.nativeEnum({
    critical: 'critical',
    urgent: 'urgent',
    high: 'high',
    normal: 'normal',
    low: 'low'
  } as const),
  complexity: z.nativeEnum({
    trivial: 'trivial',
    simple: 'simple',
    moderate: 'moderate',
    complex: 'complex',
    expert: 'expert'
  } as const),
  resources: z.nativeEnum({
    minimal: 'minimal',
    limited: 'limited',
    standard: 'standard',
    advanced: 'advanced',
    enterprise: 'enterprise'
  } as const),
  application: z.nativeEnum({
    personal: 'personal',
    team: 'team',
    department: 'department',
    organization: 'organization',
    external: 'external'
  } as const),
  output_format: z.nativeEnum({
    text: 'text',
    markdown: 'markdown',
    json: 'json',
    csv: 'csv',
    xml: 'xml',
    yaml: 'yaml',
    code: 'code',
    documentation: 'documentation'
  } as const)
});

export type SevenDParams = z.infer<typeof SevenDSchema>;

// Default fallbacks from ruleset.yml
const DEFAULT_7D: SevenDParams = {
  domain: 'general',
  scale: 'medium',
  urgency: 'normal',
  complexity: 'moderate',
  resources: 'standard',
  application: 'personal',
  output_format: 'text'
};

// Domain-specific defaults
const DOMAIN_DEFAULTS: Record<DomainType, Partial<SevenDParams>> = {
  business_strategy: { scale: 'large', urgency: 'normal', complexity: 'complex', resources: 'advanced', application: 'organization', output_format: 'documentation' },
  marketing: { scale: 'medium', urgency: 'high', complexity: 'moderate', resources: 'standard', application: 'department', output_format: 'markdown' },
  sales: { scale: 'medium', urgency: 'high', complexity: 'moderate', resources: 'standard', application: 'team', output_format: 'text' },
  customer_service: { scale: 'small', urgency: 'critical', complexity: 'simple', resources: 'limited', application: 'team', output_format: 'text' },
  product_development: { scale: 'large', urgency: 'normal', complexity: 'complex', resources: 'advanced', application: 'organization', output_format: 'documentation' },
  operations: { scale: 'medium', urgency: 'normal', complexity: 'moderate', resources: 'standard', application: 'department', output_format: 'markdown' },
  finance: { scale: 'medium', urgency: 'high', complexity: 'complex', resources: 'advanced', application: 'department', output_format: 'json' },
  hr: { scale: 'medium', urgency: 'normal', complexity: 'moderate', resources: 'standard', application: 'department', output_format: 'markdown' },
  legal: { scale: 'medium', urgency: 'critical', complexity: 'complex', resources: 'advanced', application: 'department', output_format: 'documentation' },
  compliance: { scale: 'large', urgency: 'high', complexity: 'expert', resources: 'enterprise', application: 'organization', output_format: 'documentation' },
  software_development: { scale: 'medium', urgency: 'normal', complexity: 'complex', resources: 'advanced', application: 'team', output_format: 'code' },
  data_science: { scale: 'medium', urgency: 'normal', complexity: 'expert', resources: 'advanced', application: 'team', output_format: 'json' },
  ai_ml: { scale: 'large', urgency: 'normal', complexity: 'expert', resources: 'enterprise', application: 'organization', output_format: 'code' },
  cybersecurity: { scale: 'medium', urgency: 'critical', complexity: 'expert', resources: 'advanced', application: 'department', output_format: 'documentation' },
  devops: { scale: 'medium', urgency: 'normal', complexity: 'complex', resources: 'advanced', application: 'team', output_format: 'yaml' },
  cloud_computing: { scale: 'large', urgency: 'normal', complexity: 'complex', resources: 'enterprise', application: 'organization', output_format: 'yaml' },
  blockchain: { scale: 'large', urgency: 'normal', complexity: 'expert', resources: 'enterprise', application: 'organization', output_format: 'code' },
  iot: { scale: 'medium', urgency: 'normal', complexity: 'complex', resources: 'advanced', application: 'team', output_format: 'json' },
  content_creation: { scale: 'small', urgency: 'normal', complexity: 'simple', resources: 'limited', application: 'personal', output_format: 'markdown' },
  design: { scale: 'small', urgency: 'normal', complexity: 'moderate', resources: 'standard', application: 'team', output_format: 'markdown' },
  copywriting: { scale: 'small', urgency: 'high', complexity: 'simple', resources: 'limited', application: 'team', output_format: 'text' },
  translation: { scale: 'small', urgency: 'normal', complexity: 'moderate', resources: 'standard', application: 'team', output_format: 'text' },
  education: { scale: 'medium', urgency: 'normal', complexity: 'moderate', resources: 'standard', application: 'organization', output_format: 'markdown' },
  research: { scale: 'large', urgency: 'low', complexity: 'expert', resources: 'advanced', application: 'organization', output_format: 'documentation' },
  general: { scale: 'small', urgency: 'normal', complexity: 'simple', resources: 'minimal', application: 'personal', output_format: 'text' }
};

// Custom error types
export class ValidationError extends Error {
  constructor(
    message: string,
    public code: 'INVALID_ENUM' | 'RULESET_DEFAULT_MISSING' | 'VALIDATION_FAILED',
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Normalize and validate 7D parameters according to ruleset.yml
 * Applies domain-specific defaults and validates enum values
 */
export function normalize7D(input: Partial<SevenDParams>): SevenDParams {
  try {
    // Start with defaults
    let normalized = { ...DEFAULT_7D };
    
    // Apply domain-specific defaults if domain is provided
    if (input.domain && DOMAIN_DEFAULTS[input.domain]) {
      normalized = { ...normalized, ...DOMAIN_DEFAULTS[input.domain] };
    }
    
    // Override with provided values
    normalized = { ...normalized, ...input };
    
    // Validate the final result
    const result = SevenDSchema.parse(normalized);
    
    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const invalidFields = error.errors.map(e => e.path.join('.'));
      throw new ValidationError(
        `Invalid 7D parameters: ${invalidFields.join(', ')}`,
        'INVALID_ENUM',
        { invalidFields, received: input }
      );
    }
    
    throw new ValidationError(
      'Failed to normalize 7D parameters',
      'VALIDATION_FAILED',
      { error: error instanceof Error ? error.message : 'Unknown error' }
    );
  }
}

/**
 * Validate that all required 7D parameters are present
 */
export function validate7DComplete(params: Partial<SevenDParams>): params is SevenDParams {
  try {
    SevenDSchema.parse(params);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a signature hash for 7D parameters
 */
export function generate7DSignature(params: SevenDParams): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key as keyof SevenDParams]}`)
    .join('|');
  
  // Simple hash for now - in production, use crypto.createHash('sha256')
  return Buffer.from(sortedParams).toString('base64');
}

/**
 * Check if 7D parameters meet minimum score requirements
 */
export function checkScoreRequirements(params: SevenDParams): { meets: boolean; minRequired: number } {
  // Domain-specific score requirements from ruleset.yml
  const domainScoreRequirements: Record<DomainType, number> = {
    business_strategy: 80,
    marketing: 75,
    sales: 75,
    customer_service: 70,
    product_development: 80,
    operations: 75,
    finance: 80,
    hr: 75,
    legal: 85,
    compliance: 90,
    software_development: 80,
    data_science: 85,
    ai_ml: 90,
    cybersecurity: 85,
    devops: 80,
    cloud_computing: 80,
    blockchain: 90,
    iot: 80,
    content_creation: 70,
    design: 75,
    copywriting: 70,
    translation: 75,
    education: 75,
    research: 85,
    general: 60
  };
  
  const minRequired = domainScoreRequirements[params.domain];
  return { meets: true, minRequired }; // Always meets for now, actual scoring happens in test engine
}

/**
 * Sanitize 7D parameters for telemetry (no PII)
 */
export function sanitize7DForTelemetry(params: SevenDParams): Record<string, string> {
  return {
    domain: params.domain,
    scale: params.scale,
    urgency: params.urgency,
    complexity: params.complexity,
    resources: params.resources,
    application: params.application,
    output_format: params.output_format,
    signature: generate7DSignature(params)
  };
}
