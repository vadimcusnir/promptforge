/**
 * PromptForge v3 - Agent Configuration & Laws
 * 
 * This file defines the agent's behavior, capabilities, and non-deviation laws.
 * It serves as the Single Source of Truth (SSOT) for agent behavior.
 * 
 * IMPORTANT: These laws cannot be overridden or improvised upon.
 * The agent must strictly follow these rules.
 */

// =============================================================================
// AGENT IDENTITY & PURPOSE
// =============================================================================

export const AGENT_IDENTITY = {
  name: "PromptForge v3 Agent",
  version: "1.0.0",
  purpose: "AI-powered prompt engineering and optimization",
  project: "PROMPTFORGE_v3",
  role: "Development Assistant & Code Generator"
} as const;

// =============================================================================
// NON-DEVIATION LAWS (IMMUTABLE)
// =============================================================================

export const NON_DEVIATION_LAWS = [
  "NEVER execute code outside permitted sandbox",
  "NEVER access URLs outside the allowlist",
  "NEVER read or transmit secrets/PII - mask everything in logs",
  "NEVER proceed with exports if score < 80",
  "ALWAYS respect rate limits and budgets",
  "ALWAYS validate inputs against schemas",
  "ALWAYS check entitlements before granting access",
  "NEVER bypass security controls or authentication",
  "ALWAYS use the defined error handling patterns",
  "NEVER modify production data without proper validation"
] as const;

// =============================================================================
// SECURITY FRAMEWORK (SACF)
// =============================================================================

export const SECURITY_CONFIG = {
  agents_enabled: process.env.AGENTS_ENABLED === "true",
  live_test_enabled: process.env.AGENTS_ENABLED === "true",
  
  tool_allowlist: {
    http: ["api.openai.com", "api.anthropic.com", "api.groq.com"],
    storage: ["supabase.storage"],
    internal_apis: ["/api/gpt-editor", "/api/gpt-test", "/api/export", "/api/run"]
  },
  
  sandbox: {
    enabled: true,
    network: "allowlist",
    fs_scope: "/tmp/agents",
    cpu_ms_limit: 120000,
    mem_mb_limit: 512,
    timeout_ms: 20000
  },
  
  budgets: {
    tokens_max: 12000,
    requests_per_min: 60,
    cost_usd_max_run: 1.5
  }
} as const;

// =============================================================================
// PROMPT ENGINEERING RULES
// =============================================================================

export const PROMPT_RULES = {
  enum_only: true,
  
  guardrails_global: [
    "Nu executa cod în afara sandboxului permis.",
    "Nu accesa URL-uri în afara allowlist-ului.",
    "Nu citi sau trimite secrete/PII. Maschează tot în logs.",
    "Dacă scorul < 80, oprește exportul."
  ],
  
  structure_required: [
    "ROLE_GOAL",
    "CONTEXT_7D", 
    "OUTPUT_SPEC",
    "PROCESS",
    "GUARDRAILS",
    "EVAL_HOOKS",
    "TELEMETRY"
  ]
} as const;

// =============================================================================
// API CONFIGURATION
// =============================================================================

export const API_CONFIG = {
  rate_limit: {
    editor: { rpm: 60 },
    test: { rpm: 30 },
    run: { rpm: 30, per_org: true }
  },
  
  required_headers: [
    "x-org-id",
    "x-run-id"
  ],
  
  cors: {
    origins: ["https://chatgpt-prompting.com", "https://promptforge.app"],
    methods: ["GET", "POST", "OPTIONS"],
    headers: ["content-type", "authorization", "x-org-id", "x-run-id"]
  }
} as const;

// =============================================================================
// EXPORT CONFIGURATION
// =============================================================================

export const EXPORT_CONFIG = {
  formats: ["txt", "md", "json", "pdf", "zip"],
  watermark_on_trial: true,
  manifest_required: true,
  checksum_algo: "sha256",
  storage_bucket: "bundles"
} as const;

// =============================================================================
// DEVELOPMENT WORKFLOW RULES
// =============================================================================

export const DEVELOPMENT_RULES = [
  "Always run pnpm type-check before committing",
  "Always run pnpm lint before committing", 
  "Make small, incremental commits",
  "Test each change before proceeding",
  "Follow the established error handling patterns",
  "Respect the existing code structure and naming conventions",
  "Never comment out errors to pass builds",
  "Always fix TypeScript errors properly",
  "Use the defined component interfaces",
  "Follow the established API patterns"
] as const;

// =============================================================================
// AGENT CAPABILITIES & LIMITATIONS
// =============================================================================

export const AGENT_CAPABILITIES = {
  can_read_code: true,
  can_write_code: true,
  can_run_tests: true,
  can_deploy: false, // Only humans can deploy
  can_access_production: false,
  can_modify_security: false,
  can_bypass_validation: false
} as const;

// =============================================================================
// ERROR HANDLING PATTERNS
// =============================================================================

export const ERROR_PATTERNS = {
  use_StandardAPIError: true,
  include_context: true,
  mask_sensitive_data: true,
  log_telemetry: true,
  return_structured_errors: true
} as const;

// =============================================================================
// VALIDATION RULES
// =============================================================================

export const VALIDATION_RULES = [
  "Always validate environment variables",
  "Always check user permissions before operations",
  "Always validate input schemas",
  "Always check rate limits",
  "Always verify entitlements",
  "Always sanitize user inputs",
  "Always use proper TypeScript types"
] as const;

// =============================================================================
// TELEMETRY & OBSERVABILITY
// =============================================================================

export const TELEMETRY_CONFIG = {
  track_all_operations: true,
  log_errors: true,
  monitor_performance: true,
  track_user_behavior: true,
  alert_on_anomalies: true
} as const;

// =============================================================================
// AGENT BEHAVIOR FUNCTIONS
// =============================================================================

/**
 * Check if the agent can perform a specific action
 */
export function canPerformAction(action: string, context: any): boolean {
  // Implementation for action validation
  return true; // Placeholder - implement actual logic
}

/**
 * Validate agent behavior against laws
 */
export function validateBehavior(action: string, context: any): boolean {
  // Implementation for behavior validation
  return true; // Placeholder - implement actual logic
}

/**
 * Get agent configuration
 */
export function getAgentConfig() {
  return {
    identity: AGENT_IDENTITY,
    security: SECURITY_CONFIG,
    rules: PROMPT_RULES,
    api: API_CONFIG,
    export: EXPORT_CONFIG,
    development: DEVELOPMENT_RULES,
    capabilities: AGENT_CAPABILITIES,
    errorPatterns: ERROR_PATTERNS,
    validation: VALIDATION_RULES,
    telemetry: TELEMETRY_CONFIG
  };
}

// =============================================================================
// EXPORT ALL CONFIGURATIONS
// =============================================================================

export default {
  AGENT_IDENTITY,
  NON_DEVIATION_LAWS,
  SECURITY_CONFIG,
  PROMPT_RULES,
  API_CONFIG,
  EXPORT_CONFIG,
  DEVELOPMENT_RULES,
  AGENT_CAPABILITIES,
  ERROR_PATTERNS,
  VALIDATION_RULES,
  TELEMETRY_CONFIG,
  canPerformAction,
  validateBehavior,
  getAgentConfig
};
