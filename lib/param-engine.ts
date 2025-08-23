import { z } from "zod";

// 7D Parameter types
export interface Parameters7D {
  domain: string;
  scale: string;
  urgency: string;
  complexity: string;
  resources: string;
  application: string;
  output_format: string;
}

export interface NormalizedParams extends Parameters7D {
  context?: string;
  specific_requirements?: string;
}

// Parameter validation schemas
const DomainSchema = z.enum([
  "saas", "fintech", "ecommerce", "consulting", "education", 
  "healthcare", "legal", "marketing", "media", "real_estate",
  "hr", "ngo", "government", "web3", "aiml", "cybersecurity",
  "manufacturing", "logistics", "travel", "gaming", 
  "fashion", "beauty", "spiritual", "architecture", "agriculture"
]);

const ScaleSchema = z.enum(["personal_brand", "solo", "startup", "boutique_agency", "smb", "corporate", "enterprise"]);
const UrgencySchema = z.enum(["low", "planned", "sprint", "pilot", "crisis"]);
const ComplexitySchema = z.enum(["foundational", "standard", "advanced", "expert"]);
const ResourcesSchema = z.enum(["minimal", "solo", "lean_team", "agency_stack", "full_stack_org", "enterprise_budget"]);
const ApplicationSchema = z.enum(["training", "audit", "implementation", "strategy_design", "crisis_response", "experimentation", "documentation"]);
const OutputFormatSchema = z.enum(["txt", "md", "checklist", "spec", "playbook", "json", "yaml", "diagram", "bundle"]);

// Complete 7D schema
export const Parameters7DSchema = z.object({
  domain: DomainSchema,
  scale: ScaleSchema,
  urgency: UrgencySchema,
  complexity: ComplexitySchema,
  resources: ResourcesSchema,
  application: ApplicationSchema,
  output_format: OutputFormatSchema,
  context: z.string().max(5000).optional(),
  specific_requirements: z.string().max(2000).optional()
});

/**
 * Validate and normalize 7D parameters
 */
export async function validateParams7D(input: any, moduleId: string): Promise<NormalizedParams> {
  // Parse and validate input
  const validated = Parameters7DSchema.parse(input);
  
  // Apply domain-specific rules
  const normalized = await applyDomainRules(validated, moduleId);
  
  // Validate parameter combinations
  validateParameterCombinations(normalized);
  
  return normalized;
}

/**
 * Apply domain-specific parameter rules
 */
async function applyDomainRules(params: Parameters7D, moduleId: string): Promise<NormalizedParams> {
  const normalized = { ...params };
  
  // Domain-specific adjustments
  switch (params.domain) {
    case "enterprise":
      // Enterprise domains require higher complexity
      if (params.complexity === "foundational") {
        normalized.complexity = "standard";
      }
      break;
    case "startup":
      // Startups typically have limited resources
      if (params.resources === "enterprise_budget") {
        normalized.resources = "full_stack_org";
      }
      break;
    case "crisis":
      // Crisis applications require high urgency
      if (params.urgency === "low") {
        normalized.urgency = "crisis";
      }
      break;
  }
  
  return normalized;
}

/**
 * Validate parameter combinations for consistency
 */
function validateParameterCombinations(params: NormalizedParams): void {
  // Complexity vs Resources validation
  if (params.complexity === "expert" && params.resources === "minimal") {
    throw new Error("Expert complexity requires adequate resources");
  }
  
  // Scale vs Resources validation
  if (params.scale === "enterprise" && params.resources === "solo") {
    throw new Error("Enterprise scale requires team resources");
  }
  
  // Urgency vs Application validation
  if (params.urgency === "crisis" && params.application === "training") {
    throw new Error("Crisis urgency requires immediate application types");
  }
}

/**
 * Get default parameters for a domain
 */
export function getDefaultParams(domain: string): Partial<Parameters7D> {
  const defaults: Record<string, Partial<Parameters7D>> = {
    saas: {
      scale: "startup",
      complexity: "standard",
      application: "implementation"
    },
    fintech: {
      scale: "smb",
      complexity: "advanced",
      application: "strategy_design"
    },
    ecommerce: {
      scale: "startup",
      complexity: "standard",
      application: "implementation"
    }
  };
  
  return defaults[domain] || {};
}

/**
 * Calculate parameter compatibility score
 */
export function calculateCompatibilityScore(params: NormalizedParams): number {
  let score = 0;
  
  // Complexity alignment
  if (params.complexity === "expert" && params.resources === "enterprise_budget") score += 20;
  if (params.complexity === "foundational" && params.resources === "minimal") score += 20;
  
  // Scale alignment
  if (params.scale === "enterprise" && params.resources === "full_stack_org") score += 20;
  if (params.scale === "solo" && params.resources === "solo") score += 20;
  
  // Urgency alignment
  if (params.urgency === "crisis" && params.application === "crisis_response") score += 20;
  if (params.urgency === "low" && params.application === "training") score += 20;
  
  return Math.min(score, 100);
}
