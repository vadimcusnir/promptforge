import { z } from "zod";
import { createHash } from "crypto";
import { StandardAPIError as APIError } from "./errors";

/**
 * 7D Validation Schema - SSOT (Single Source of Truth)
 * Based on CORE 25 domains and strict enum validation
 */

// CORE 25 domains from ruleset
export const SEVEND_DOMAINS = [
  "saas",
  "fintech",
  "ecommerce",
  "education",
  "healthcare",
  "legal",
  "marketing",
  "media",
  "real_estate",
  "government",
  "energy",
  "transportation",
  "logistics",
  "manufacturing",
  "retail",
  "travel",
  "hospitality",
  "gaming",
  "entertainment",
  "telecom",
  "insurance",
  "banking",
  "crypto_web3",
  "nonprofit",
  "agriculture",
] as const;

export const SEVEND_SCALES = [
  "personal_brand",
  "solo",
  "startup",
  "boutique_agency",
  "smb",
  "corporate",
  "enterprise",
] as const;
export const SEVEND_URGENCIES = [
  "low",
  "planned",
  "sprint",
  "pilot",
  "crisis",
] as const;
export const SEVEND_COMPLEXITIES = [
  "foundational",
  "standard",
  "advanced",
  "expert",
] as const;
export const SEVEND_RESOURCES = [
  "minimal",
  "solo",
  "lean_team",
  "agency_stack",
  "full_stack_org",
  "enterprise_budget",
] as const;
export const SEVEND_APPLICATIONS = [
  "training",
  "audit",
  "implementation",
  "strategy_design",
  "crisis_response",
  "experimentation",
  "documentation",
] as const;
export const SEVEND_OUTPUT_FORMATS = [
  "txt",
  "md",
  "checklist",
  "spec",
  "playbook",
  "json",
  "yaml",
  "diagram",
  "bundle",
] as const;

export type SevenDDomain = (typeof SEVEND_DOMAINS)[number];
export type SevenDScale = (typeof SEVEND_SCALES)[number];
export type SevenDUrgency = (typeof SEVEND_URGENCIES)[number];
export type SevenDComplexity = (typeof SEVEND_COMPLEXITIES)[number];
export type SevenDResources = (typeof SEVEND_RESOURCES)[number];
export type SevenDApplication = (typeof SEVEND_APPLICATIONS)[number];
export type SevenDOutputFormat = (typeof SEVEND_OUTPUT_FORMATS)[number];

export interface SevenDConfig {
  domain: SevenDDomain;
  scale: SevenDScale;
  urgency: SevenDUrgency;
  complexity: SevenDComplexity;
  resources: SevenDResources;
  application: SevenDApplication;
  output_format: SevenDOutputFormat;
}

export interface SevenDConfigWithSignature extends SevenDConfig {
  signature_7d: string;
}

// Zod schemas for strict validation
export const SevenDSchema = z.object({
  domain: z.enum(SEVEND_DOMAINS),
  scale: z.enum(SEVEND_SCALES),
  urgency: z.enum(SEVEND_URGENCIES),
  complexity: z.enum(SEVEND_COMPLEXITIES),
  resources: z.enum(SEVEND_RESOURCES),
  application: z.enum(SEVEND_APPLICATIONS),
  output_format: z.enum(SEVEND_OUTPUT_FORMATS),
});

// Domain fallbacks (from ruleset specifications)
export const DOMAIN_DEFAULTS: Record<
  SevenDDomain,
  Omit<SevenDConfig, "domain">
> = {
  saas: {
    scale: "startup",
    urgency: "sprint",
    complexity: "standard",
    resources: "lean_team",
    application: "implementation",
    output_format: "md",
  },
  fintech: {
    scale: "enterprise",
    urgency: "planned",
    complexity: "expert",
    resources: "full_stack_org",
    application: "audit",
    output_format: "spec",
  },
  ecommerce: {
    scale: "smb",
    urgency: "sprint",
    complexity: "standard",
    resources: "agency_stack",
    application: "implementation",
    output_format: "md",
  },
  education: {
    scale: "smb",
    urgency: "planned",
    complexity: "standard",
    resources: "lean_team",
    application: "training",
    output_format: "md",
  },
  healthcare: {
    scale: "enterprise",
    urgency: "planned",
    complexity: "expert",
    resources: "full_stack_org",
    application: "audit",
    output_format: "spec",
  },
  legal: {
    scale: "enterprise",
    urgency: "planned",
    complexity: "expert",
    resources: "full_stack_org",
    application: "audit",
    output_format: "spec",
  },
  marketing: {
    scale: "boutique_agency",
    urgency: "sprint",
    complexity: "standard",
    resources: "agency_stack",
    application: "implementation",
    output_format: "md",
  },
  media: {
    scale: "smb",
    urgency: "sprint",
    complexity: "standard",
    resources: "agency_stack",
    application: "implementation",
    output_format: "md",
  },
  real_estate: {
    scale: "smb",
    urgency: "planned",
    complexity: "standard",
    resources: "lean_team",
    application: "implementation",
    output_format: "md",
  },
  government: {
    scale: "enterprise",
    urgency: "planned",
    complexity: "expert",
    resources: "full_stack_org",
    application: "audit",
    output_format: "spec",
  },
  energy: {
    scale: "enterprise",
    urgency: "planned",
    complexity: "expert",
    resources: "full_stack_org",
    application: "audit",
    output_format: "spec",
  },
  transportation: {
    scale: "corporate",
    urgency: "planned",
    complexity: "advanced",
    resources: "full_stack_org",
    application: "implementation",
    output_format: "spec",
  },
  logistics: {
    scale: "corporate",
    urgency: "planned",
    complexity: "advanced",
    resources: "full_stack_org",
    application: "implementation",
    output_format: "spec",
  },
  manufacturing: {
    scale: "corporate",
    urgency: "planned",
    complexity: "advanced",
    resources: "full_stack_org",
    application: "implementation",
    output_format: "spec",
  },
  retail: {
    scale: "smb",
    urgency: "sprint",
    complexity: "standard",
    resources: "agency_stack",
    application: "implementation",
    output_format: "md",
  },
  travel: {
    scale: "smb",
    urgency: "planned",
    complexity: "standard",
    resources: "lean_team",
    application: "implementation",
    output_format: "md",
  },
  hospitality: {
    scale: "smb",
    urgency: "planned",
    complexity: "standard",
    resources: "lean_team",
    application: "implementation",
    output_format: "md",
  },
  gaming: {
    scale: "startup",
    urgency: "sprint",
    complexity: "advanced",
    resources: "lean_team",
    application: "experimentation",
    output_format: "md",
  },
  entertainment: {
    scale: "smb",
    urgency: "sprint",
    complexity: "standard",
    resources: "agency_stack",
    application: "implementation",
    output_format: "md",
  },
  telecom: {
    scale: "enterprise",
    urgency: "planned",
    complexity: "expert",
    resources: "full_stack_org",
    application: "audit",
    output_format: "spec",
  },
  insurance: {
    scale: "enterprise",
    urgency: "planned",
    complexity: "expert",
    resources: "full_stack_org",
    application: "audit",
    output_format: "spec",
  },
  banking: {
    scale: "enterprise",
    urgency: "planned",
    complexity: "expert",
    resources: "full_stack_org",
    application: "audit",
    output_format: "spec",
  },
  crypto_web3: {
    scale: "startup",
    urgency: "pilot",
    complexity: "advanced",
    resources: "lean_team",
    application: "experimentation",
    output_format: "md",
  },
  nonprofit: {
    scale: "smb",
    urgency: "planned",
    complexity: "standard",
    resources: "lean_team",
    application: "documentation",
    output_format: "md",
  },
  agriculture: {
    scale: "smb",
    urgency: "planned",
    complexity: "standard",
    resources: "lean_team",
    application: "implementation",
    output_format: "md",
  },
};

/**
 * Normalize 7D configuration with domain defaults (SSOT enforcement)
 * Applies fallbacks and validates enum values strictly
 */
export function normalize7D(
  input: Partial<SevenDConfig>,
): SevenDConfigWithSignature {
  if (!input.domain) {
    throw new Error("MISSING_DOMAIN");
  }

  if (!SEVEND_DOMAINS.includes(input.domain as SevenDDomain)) {
    throw new Error("INVALID_7D_ENUM:domain");
  }

  const domain = input.domain as SevenDDomain;
  const fallback = DOMAIN_DEFAULTS[domain];

  // Apply fallbacks for missing values
  const normalized: SevenDConfig = {
    domain,
    scale: input.scale || fallback.scale,
    urgency: input.urgency || fallback.urgency,
    complexity: input.complexity || fallback.complexity,
    resources: input.resources || fallback.resources,
    application: input.application || fallback.application,
    output_format: input.output_format || fallback.output_format,
  };

  // Strict validation with Zod (enum_only)
  const result = SevenDSchema.safeParse(normalized);
  if (!result.success) {
    const firstError = result.error.errors[0];
    throw new Error(`INVALID_7D_ENUM:${firstError.path[0]}`);
  }

  // Generate signature for consistency checks
  const signature = generate7DSignature(result.data);

  return {
    ...result.data,
    signature_7d: signature,
  };
}

/**
 * Generate canonical 7D signature for consistency validation
 */
export function generate7DSignature(config: SevenDConfig): string {
  const canonical = [
    config.domain,
    config.scale,
    config.urgency,
    config.complexity,
    config.resources,
    config.application,
    config.output_format,
  ].join("|");

  return createHash("sha256").update(canonical).digest("hex").substring(0, 16);
}

/**
 * API Request validation schemas
 */
export const GPTEditorRequestSchema = z.object({
  prompt: z.string().min(10).max(10000),
  sevenD: SevenDSchema.partial().refine((data) => data.domain, {
    message: "Domain is required",
  }),
});

export const GPTTestRequestSchema = z.object({
  prompt: z.string().min(10).max(10000),
  sevenD: SevenDSchema,
  testCases: z
    .array(
      z.object({
        input: z.string(),
        expectedOutput: z.string().optional(),
        criteria: z.string().optional(),
      }),
    )
    .optional(),
});

export const ExportBundleRequestSchema = z.object({
  runId: z.string().uuid(),
  formats: z.array(z.enum(["txt", "md", "json", "pdf", "zip"])).min(1),
  whiteLabel: z.boolean().optional().default(false),
});

export const RunModuleRequestSchema = z.object({
  moduleId: z.string().regex(/^M\d{2}$/),
  sevenD: SevenDSchema,
  prompt: z.string().min(10).max(10000).optional(),
  testMode: z.boolean().optional().default(false),
  exportFormats: z
    .array(z.enum(["txt", "md", "json", "pdf", "zip"]))
    .optional(),
});

// Legacy API errors - use lib/server/errors.ts for new implementations

/**
 * DoR/DoD validation helpers
 */
export interface DoRContext {
  sevenDValid: boolean;
  entitlementsValid: boolean;
  outputSpecLoaded: boolean;
  testsDefined: boolean;
}

export interface DoDContext {
  score: number;
  manifestPresent: boolean;
  checksumValid: boolean;
  telemetryClean: boolean; // no PII
}

export function assertDoR(context: DoRContext): void {
  if (!context.sevenDValid) {
    throw new APIError("INVALID_7D_ENUM");
  }
  if (!context.entitlementsValid) {
    throw new APIError("ENTITLEMENT_REQUIRED");
  }
  if (!context.outputSpecLoaded) {
    throw new APIError("INPUT_SCHEMA_MISMATCH", "output_spec not loaded");
  }
  if (!context.testsDefined) {
    throw new APIError("INPUT_SCHEMA_MISMATCH", "tests not defined");
  }
}

export function assertDoD(context: DoDContext): void {
  if (context.score < 80) {
    throw new APIError(
      "INTERNAL_RUN_ERROR",
      "Score below minimum threshold (80)",
    );
  }
  if (!context.manifestPresent) {
    throw new APIError("INTERNAL_RUN_ERROR", "Manifest missing");
  }
  if (!context.checksumValid) {
    throw new APIError("INTERNAL_RUN_ERROR", "Checksum validation failed");
  }
  if (!context.telemetryClean) {
    throw new APIError("INTERNAL_RUN_ERROR", "Telemetry contains PII");
  }
}
