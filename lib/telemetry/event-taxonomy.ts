// Unified telemetry event taxonomy for PromptForge
// Maps to SSOT (ruleset.yml) and provides consistent event structure

export interface BaseEvent {
  event_id: string
  event_type: string
  timestamp: string
  user_id?: string
  org_id?: string
  session_id?: string
  trace_id?: string
  plan?: 'pilot' | 'pro' | 'enterprise'
  metadata?: Record<string, any>
}

// Module Events
export interface ModuleOpenEvent extends BaseEvent {
  event_type: 'module_open'
  module_id: string // M01, M02, etc.
  module_name: string
  source: 'homepage' | 'search' | 'direct_link' | 'recommendation'
}

export interface ModuleRunRequestedEvent extends BaseEvent {
  event_type: 'module_run_requested'
  module_id: string
  domain: string
  scale: string
  urgency: string
  complexity: string
  output_format: string
  inputs_count: number
}

export interface ModuleRunStartedEvent extends BaseEvent {
  event_type: 'module_run_started'
  run_id: string
  module_id: string
  model: string
  estimated_tokens: number
}

export interface ModuleRunScoredEvent extends BaseEvent {
  event_type: 'module_run_scored'
  run_id: string
  module_id: string
  score_total: number
  score_clarity: number
  score_execution: number
  score_ambiguity: number
  score_business_fit: number
  passed_threshold: boolean
}

export interface ModuleRunSucceededEvent extends BaseEvent {
  event_type: 'module_run_succeeded'
  run_id: string
  module_id: string
  duration_ms: number
  tokens_in: number
  tokens_out: number
  cost_cents: number
  output_size: number
}

export interface ModuleRunBlockedEvent extends BaseEvent {
  event_type: 'module_run_blocked'
  run_id: string
  module_id: string
  reason: 'score_too_low' | 'entitlement_required' | 'rate_limit' | 'validation_error'
  score_total?: number
  threshold: number
}

// Export Events
export interface ExportPerformedEvent extends BaseEvent {
  event_type: 'export_performed'
  run_id: string
  module_id: string
  format: 'txt' | 'md' | 'pdf' | 'json' | 'zip'
  file_size: number
  checksum: string
  watermark_applied: boolean
}

// Legacy Redirect Events
export interface LegacyRedirectHitEvent extends BaseEvent {
  event_type: 'legacy_redirect_hit'
  old_slug: string
  new_slug: string
  redirect_type: 'module' | 'generator'
  user_agent: string
}

// Pricing and Conversion Events
export interface PricingViewEvent extends BaseEvent {
  event_type: 'pricing_view'
  source: 'homepage' | 'upgrade_prompt' | 'paywall' | 'direct'
  current_plan?: string
  viewed_plan?: string
}

export interface CheckoutStartedEvent extends BaseEvent {
  event_type: 'checkout_started'
  plan: 'pro' | 'enterprise'
  source: 'pricing_page' | 'upgrade_prompt' | 'paywall'
  trial_eligible: boolean
}

export interface CheckoutPaidEvent extends BaseEvent {
  event_type: 'checkout_paid'
  plan: 'pro' | 'enterprise'
  amount_cents: number
  currency: string
  payment_method: string
  trial_converted: boolean
}

export interface TrialStartedEvent extends BaseEvent {
  event_type: 'trial_started'
  plan: 'pro' | 'enterprise'
  source: 'signup' | 'upgrade_prompt'
  trial_days: number
}

export interface TrialConvertedEvent extends BaseEvent {
  event_type: 'trial_converted'
  plan: 'pro' | 'enterprise'
  trial_duration_days: number
  conversion_reason: 'automatic' | 'manual_upgrade'
}

// Web Vitals Events
export interface WebVitalsEvent extends BaseEvent {
  event_type: 'web_vitals'
  metric: 'LCP' | 'INP' | 'CLS' | 'FID' | 'TTFB'
  value: number
  page: string
  route: string
  device_type: 'mobile' | 'tablet' | 'desktop'
  connection_type?: string
}

// Security Events
export interface SecurityEvent extends BaseEvent {
  event_type: 'security_event'
  security_type: 'honeypot_access' | 'waf_blocked' | 'rate_limit_hit' | 'schema_validation_failed'
  severity: 'low' | 'medium' | 'high' | 'critical'
  ip_address: string
  user_agent: string
  details: Record<string, any>
}

// API Events
export interface APIEvent extends BaseEvent {
  event_type: 'api_request'
  endpoint: string
  method: string
  status_code: number
  duration_ms: number
  response_size: number
  error_type?: string
}

// Union type for all events
export type TelemetryEvent = 
  | ModuleOpenEvent
  | ModuleRunRequestedEvent
  | ModuleRunStartedEvent
  | ModuleRunScoredEvent
  | ModuleRunSucceededEvent
  | ModuleRunBlockedEvent
  | ExportPerformedEvent
  | LegacyRedirectHitEvent
  | PricingViewEvent
  | CheckoutStartedEvent
  | CheckoutPaidEvent
  | TrialStartedEvent
  | TrialConvertedEvent
  | WebVitalsEvent
  | SecurityEvent
  | APIEvent

// Event validation schemas
export const EventSchemas = {
  module_open: {
    required: ['module_id', 'module_name', 'source'],
    optional: ['user_id', 'org_id', 'session_id', 'plan']
  },
  module_run_requested: {
    required: ['module_id', 'domain', 'scale', 'urgency', 'complexity', 'output_format'],
    optional: ['user_id', 'org_id', 'session_id', 'plan', 'inputs_count']
  },
  module_run_started: {
    required: ['run_id', 'module_id', 'model'],
    optional: ['user_id', 'org_id', 'session_id', 'plan', 'estimated_tokens']
  },
  module_run_scored: {
    required: ['run_id', 'module_id', 'score_total', 'score_clarity', 'score_execution', 'score_ambiguity', 'score_business_fit'],
    optional: ['user_id', 'org_id', 'session_id', 'plan', 'passed_threshold']
  },
  module_run_succeeded: {
    required: ['run_id', 'module_id', 'duration_ms', 'tokens_in', 'tokens_out', 'cost_cents'],
    optional: ['user_id', 'org_id', 'session_id', 'plan', 'output_size']
  },
  module_run_blocked: {
    required: ['run_id', 'module_id', 'reason', 'threshold'],
    optional: ['user_id', 'org_id', 'session_id', 'plan', 'score_total']
  },
  export_performed: {
    required: ['run_id', 'module_id', 'format', 'file_size', 'checksum'],
    optional: ['user_id', 'org_id', 'session_id', 'plan', 'watermark_applied']
  },
  legacy_redirect_hit: {
    required: ['old_slug', 'new_slug', 'redirect_type', 'user_agent'],
    optional: ['user_id', 'org_id', 'session_id', 'plan']
  },
  pricing_view: {
    required: ['source'],
    optional: ['user_id', 'org_id', 'session_id', 'plan', 'current_plan', 'viewed_plan']
  },
  checkout_started: {
    required: ['plan', 'source'],
    optional: ['user_id', 'org_id', 'session_id', 'trial_eligible']
  },
  checkout_paid: {
    required: ['plan', 'amount_cents', 'currency', 'payment_method'],
    optional: ['user_id', 'org_id', 'session_id', 'trial_converted']
  },
  trial_started: {
    required: ['plan', 'source', 'trial_days'],
    optional: ['user_id', 'org_id', 'session_id']
  },
  trial_converted: {
    required: ['plan', 'trial_duration_days', 'conversion_reason'],
    optional: ['user_id', 'org_id', 'session_id']
  },
  web_vitals: {
    required: ['metric', 'value', 'page', 'route', 'device_type'],
    optional: ['user_id', 'org_id', 'session_id', 'plan', 'connection_type']
  },
  security_event: {
    required: ['security_type', 'severity', 'ip_address', 'user_agent', 'details'],
    optional: ['user_id', 'org_id', 'session_id', 'plan']
  },
  api_request: {
    required: ['endpoint', 'method', 'status_code', 'duration_ms'],
    optional: ['user_id', 'org_id', 'session_id', 'plan', 'response_size', 'error_type']
  }
}

// Event priorities for processing
export const EventPriorities = {
  critical: ['security_event', 'module_run_blocked'],
  high: ['checkout_paid', 'trial_converted', 'export_performed'],
  medium: ['module_run_succeeded', 'module_run_scored', 'checkout_started'],
  low: ['module_open', 'pricing_view', 'web_vitals', 'api_request']
}

// Sampling rates by event type and plan
export const SamplingRates = {
  pilot: {
    module_open: 0.1, // 10%
    module_run_requested: 1.0, // 100%
    module_run_succeeded: 1.0, // 100%
    export_performed: 1.0, // 100%
    web_vitals: 0.05, // 5%
    api_request: 0.01 // 1%
  },
  pro: {
    module_open: 0.2, // 20%
    module_run_requested: 1.0, // 100%
    module_run_succeeded: 1.0, // 100%
    export_performed: 1.0, // 100%
    web_vitals: 0.1, // 10%
    api_request: 0.05 // 5%
  },
  enterprise: {
    module_open: 0.5, // 50%
    module_run_requested: 1.0, // 100%
    module_run_succeeded: 1.0, // 100%
    export_performed: 1.0, // 100%
    web_vitals: 0.2, // 20%
    api_request: 0.1 // 10%
  }
}
