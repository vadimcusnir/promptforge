export const ruleset = {};

export interface ValidationResult {
  valid: boolean;
  isValid?: boolean;
  errors?: string[];
  normalized?: {
    domain: string;
    application: string;
    output_format: string;
    scale: string;
    urgency: string;
    complexity: string;
    resources: string;
  };
  signature?: string;
}

export const validate7D = (params?: any): ValidationResult => {
  if (!params) {
    return { valid: true, isValid: true, errors: [], normalized: {} as any, signature: '' };
  }
  
  return {
    valid: true,
    isValid: true,
    errors: [],
    normalized: {
      domain: params.domain || 'general',
      application: params.application || 'web',
      output_format: params.output_format || 'text',
      scale: params.scale || 'medium',
      urgency: params.urgency || 'normal',
      complexity: params.complexity || 'medium',
      resources: params.resources || 'standard'
    },
    signature: 'mock-signature'
  };
};

export const getEnums = () => ({
  domain: ['general', 'technical', 'creative', 'business', 'academic'],
  application: ['web', 'mobile', 'desktop', 'api'],
  output_format: ['text', 'json', 'html', 'markdown'],
  scale: ['small', 'medium', 'large', 'enterprise'],
  urgency: ['low', 'normal', 'high', 'critical'],
  complexity: ['simple', 'medium', 'complex', 'expert'],
  resources: ['minimal', 'standard', 'extended', 'unlimited']
});

export const getDomainDefaults = (domain?: string) => {
  const defaults = {
    saas: {
      scale: 'medium',
      application: 'web',
      output_format: 'text',
      urgency: 'normal',
      complexity: 'medium',
      resources: 'standard'
    },
    general: {
      scale: 'small',
      application: 'web',
      output_format: 'text',
      urgency: 'normal',
      complexity: 'simple',
      resources: 'minimal'
    }
  };
  
  return domain ? defaults[domain as keyof typeof defaults] || defaults.general : defaults.general;
};

// Mock Domain type
export type Domain = 'general' | 'technical' | 'creative' | 'business' | 'academic';
