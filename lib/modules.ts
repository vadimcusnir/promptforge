// ============================================================================
// PROMPTFORGE MODULE SYSTEM - 50 Industrial Modules
// ============================================================================

export interface Module7DConfig {
  domain: string;
  scale: string;
  urgency: string;
  complexity: string;
  resources: string;
  application: string;
  output: string;
}

export interface Module {
  id: string;
  name: string;
  description: string;
  vectors: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimated_tokens: number;
  input_schema: Record<string, any>;
  output_template: string;
  guardrails: {
    policy: string[];
    safety: string[];
    compliance: string[];
  };
  kpi: {
    clarity: number;
    specificity: number;
    actionability: number;
    overall: number;
  };
  sample_output: string;
  is_active: boolean;
  requires_plan: 'pilot' | 'pro' | 'enterprise';
}

export const MODULES_CATALOG: Record<string, Module> = {
  // ============================================================================
  // STRATEGIC VECTOR - M01-M10
  // ============================================================================
  
  M01: {
    id: "M01",
    name: "SOP Forge",
    description: "Standard Operating Procedure generator for process documentation",
    vectors: ["strategic"],
    difficulty: 2,
    estimated_tokens: 800,
    input_schema: {
      process_name: "string",
      department: "string",
      complexity_level: "basic|intermediate|advanced",
      compliance_requirements: "string[]"
    },
    output_template: "SOP_TEMPLATE",
    guardrails: {
      policy: ["No sensitive information", "Compliance with industry standards"],
      safety: ["Process validation required", "Risk assessment needed"],
      compliance: ["ISO standards", "Industry regulations"]
    },
    kpi: { clarity: 85, specificity: 90, actionability: 88, overall: 88 },
    sample_output: "Standard Operating Procedure for Customer Onboarding...",
    is_active: true,
    requires_plan: "pilot"
  },

  M02: {
    id: "M02",
    name: "Risk Assessment Matrix",
    description: "Comprehensive risk evaluation and mitigation framework",
    vectors: ["strategic"],
    difficulty: 3,
    estimated_tokens: 1200,
    input_schema: {
      project_scope: "string",
      risk_categories: "string[]",
      impact_levels: "low|medium|high|critical",
      timeframe: "string"
    },
    output_template: "RISK_MATRIX_TEMPLATE",
    guardrails: {
      policy: ["Risk validation required", "Stakeholder approval needed"],
      safety: ["Mitigation strategies required", "Contingency planning"],
      compliance: ["Risk management standards", "Regulatory requirements"]
    },
    kpi: { clarity: 88, specificity: 92, actionability: 90, overall: 90 },
    sample_output: "Risk Assessment Matrix for New Product Launch...",
    is_active: true,
    requires_plan: "pilot"
  },

  M03: {
    id: "M03",
    name: "Strategic Planning Framework",
    description: "Multi-year strategic planning with OKR methodology",
    vectors: ["strategic"],
    difficulty: 4,
    estimated_tokens: 1500,
    input_schema: {
      organization_size: "startup|sme|enterprise",
      industry: "string",
      planning_horizon: "1|3|5|10",
      strategic_focus: "string[]"
    },
    output_template: "STRATEGIC_PLAN_TEMPLATE",
    guardrails: {
      policy: ["Executive approval required", "Board review needed"],
      safety: ["Resource allocation validation", "Timeline feasibility"],
      compliance: ["Corporate governance", "Regulatory compliance"]
    },
    kpi: { clarity: 90, specificity: 94, actionability: 92, overall: 92 },
    sample_output: "Strategic Planning Framework 2024-2029...",
    is_active: true,
    requires_plan: "pro"
  },

  // ============================================================================
  // CONTENT VECTOR - M11-M20
  // ============================================================================
  
  M11: {
    id: "M11",
    name: "Content Strategy Blueprint",
    description: "Comprehensive content marketing strategy and editorial calendar",
    vectors: ["content"],
    difficulty: 3,
    estimated_tokens: 1000,
    input_schema: {
      target_audience: "string",
      content_goals: "string[]",
      distribution_channels: "string[]",
      content_types: "string[]"
    },
    output_template: "CONTENT_STRATEGY_TEMPLATE",
    guardrails: {
      policy: ["Brand voice consistency", "Content quality standards"],
      safety: ["Copyright compliance", "Fact verification"],
      compliance: ["Marketing regulations", "Data privacy"]
    },
    kpi: { clarity: 87, specificity: 89, actionability: 86, overall: 87 },
    sample_output: "Content Strategy Blueprint for B2B SaaS...",
    is_active: true,
    requires_plan: "pilot"
  },

  M12: {
    id: "M12",
    name: "Brand Voice Guidelines",
    description: "Comprehensive brand voice and tone of voice documentation",
    vectors: ["content"],
    difficulty: 2,
    estimated_tokens: 900,
    input_schema: {
      brand_personality: "string[]",
      target_demographics: "string",
      industry_context: "string",
      communication_goals: "string[]"
    },
    output_template: "BRAND_VOICE_TEMPLATE",
    guardrails: {
      policy: ["Brand consistency", "Voice alignment"],
      safety: ["Cultural sensitivity", "Inclusive language"],
      compliance: ["Brand guidelines", "Marketing standards"]
    },
    kpi: { clarity: 89, specificity: 91, actionability: 87, overall: 89 },
    sample_output: "Brand Voice Guidelines for Tech Startup...",
    is_active: true,
    requires_plan: "pilot"
  },

  // ============================================================================
  // TECHNICAL VECTOR - M21-M30
  // ============================================================================
  
  M21: {
    id: "M21",
    name: "API Documentation Generator",
    description: "Comprehensive API documentation with examples and testing",
    vectors: ["technical"],
    difficulty: 3,
    estimated_tokens: 1100,
    input_schema: {
      api_type: "rest|graphql|grpc",
      authentication_method: "string",
      endpoint_count: "number",
      target_developers: "string"
    },
    output_template: "API_DOCS_TEMPLATE",
    guardrails: {
      policy: ["Security best practices", "Documentation standards"],
      safety: ["Authentication details", "Rate limiting info"],
      compliance: ["API standards", "Security compliance"]
    },
    kpi: { clarity: 90, specificity: 93, actionability: 89, overall: 91 },
    sample_output: "API Documentation for E-commerce Platform...",
    is_active: true,
    requires_plan: "pro"
  },

  M22: {
    id: "M22",
    name: "System Architecture Blueprint",
    description: "Technical architecture documentation with scalability considerations",
    vectors: ["technical"],
    difficulty: 4,
    estimated_tokens: 1400,
    input_schema: {
      system_complexity: "simple|moderate|complex",
      scalability_requirements: "string",
      technology_stack: "string[]",
      integration_needs: "string[]"
    },
    output_template: "ARCHITECTURE_TEMPLATE",
    guardrails: {
      policy: ["Technical standards", "Best practices"],
      safety: ["Security architecture", "Performance requirements"],
      compliance: ["Technical compliance", "Industry standards"]
    },
    kpi: { clarity: 88, specificity: 94, actionability: 90, overall: 91 },
    sample_output: "System Architecture Blueprint for Microservices...",
    is_active: true,
    requires_plan: "pro"
  },

  // ============================================================================
  // SALES VECTOR - M31-M40
  // ============================================================================
  
  M31: {
    id: "M31",
    name: "Sales Process Optimization",
    description: "Sales funnel optimization and conversion rate improvement",
    vectors: ["sales"],
    difficulty: 3,
    estimated_tokens: 1000,
    input_schema: {
      sales_cycle_length: "string",
      conversion_rates: "string",
      target_market: "string",
      sales_methodology: "string"
    },
    output_template: "SALES_PROCESS_TEMPLATE",
    guardrails: {
      policy: ["Sales ethics", "Customer focus"],
      safety: ["Data privacy", "Customer consent"],
      compliance: ["Sales regulations", "Industry standards"]
    },
    kpi: { clarity: 86, specificity: 88, actionability: 87, overall: 87 },
    sample_output: "Sales Process Optimization for B2B...",
    is_active: true,
    requires_plan: "pro"
  },

  M32: {
    id: "M32",
    name: "Customer Journey Mapping",
    description: "End-to-end customer experience mapping and optimization",
    vectors: ["sales"],
    difficulty: 3,
    estimated_tokens: 1200,
    input_schema: {
      customer_segments: "string[]",
      touchpoints: "string[]",
      pain_points: "string[]",
      improvement_goals: "string[]"
    },
    output_template: "CUSTOMER_JOURNEY_TEMPLATE",
    guardrails: {
      policy: ["Customer-centric approach", "Privacy protection"],
      safety: ["Data security", "Customer feedback"],
      compliance: ["Privacy regulations", "Customer rights"]
    },
    kpi: { clarity: 89, specificity: 91, actionability: 88, overall: 89 },
    sample_output: "Customer Journey Mapping for E-commerce...",
    is_active: true,
    requires_plan: "pro"
  },

  // ============================================================================
  // OPERATIONAL VECTOR - M41-M50
  // ============================================================================
  
  M41: {
    id: "M41",
    name: "Process Automation Blueprint",
    description: "Business process automation strategy and implementation plan",
    vectors: ["operational"],
    difficulty: 4,
    estimated_tokens: 1300,
    input_schema: {
      process_complexity: "string",
      automation_goals: "string[]",
      technology_constraints: "string[]",
      roi_expectations: "string"
    },
    output_template: "AUTOMATION_TEMPLATE",
    guardrails: {
      policy: ["Efficiency focus", "Quality maintenance"],
      safety: ["Process validation", "Error handling"],
      compliance: ["Operational standards", "Quality assurance"]
    },
    kpi: { clarity: 87, specificity: 92, actionability: 89, overall: 89 },
    sample_output: "Process Automation Blueprint for Manufacturing...",
    is_active: true,
    requires_plan: "enterprise"
  },

  M50: {
    id: "M50",
    name: "Quality Management System",
    description: "Comprehensive quality management and continuous improvement",
    vectors: ["operational"],
    difficulty: 5,
    estimated_tokens: 1600,
    input_schema: {
      industry_standards: "string[]",
      quality_metrics: "string[]",
      improvement_focus: "string[]",
      compliance_requirements: "string[]"
    },
    output_template: "QUALITY_MANAGEMENT_TEMPLATE",
    guardrails: {
      policy: ["Quality standards", "Continuous improvement"],
      safety: ["Risk management", "Process validation"],
      compliance: ["Industry standards", "Regulatory compliance"]
    },
    kpi: { clarity: 91, specificity: 95, actionability: 93, overall: 93 },
    sample_output: "Quality Management System for Healthcare...",
    is_active: true,
    requires_plan: "enterprise"
  }
};

// ============================================================================
// MODULE UTILITY FUNCTIONS
// ============================================================================

export function getModuleById(id: string): Module | undefined {
  return MODULES_CATALOG[id];
}

export function getModulesByVector(vector: string): Module[] {
  return Object.values(MODULES_CATALOG).filter(
    module => module.vectors.includes(vector)
  );
}

export function getModulesByPlan(plan: string): Module[] {
  return Object.values(MODULES_CATALOG).filter(
    module => module.requires_plan === plan || 
              (plan === 'pro' && module.requires_plan === 'pilot') ||
              (plan === 'enterprise')
  );
}

export function getModulesByDifficulty(difficulty: number): Module[] {
  return Object.values(MODULES_CATALOG).filter(
    module => module.difficulty <= difficulty
  );
}

export function searchModules(query: string): Module[] {
  const searchTerm = query.toLowerCase();
  return Object.values(MODULES_CATALOG).filter(
    module => 
      module.name.toLowerCase().includes(searchTerm) ||
      module.description.toLowerCase().includes(searchTerm) ||
      module.vectors.some(vector => vector.toLowerCase().includes(searchTerm))
  );
}

// ============================================================================
// MODULE VALIDATION
// ============================================================================

export function validateModuleConfig(moduleId: string, config: Module7DConfig): boolean {
  const module = getModuleById(moduleId);
  if (!module) return false;

  // Validate 7D configuration
  const requiredFields = ['domain', 'scale', 'urgency', 'complexity', 'resources', 'application', 'output'];
  return requiredFields.every(field => config[field as keyof Module7DConfig]);
}

export function estimateModuleTokens(moduleId: string, config: Module7DConfig): number {
  const module = getModuleById(moduleId);
  if (!module) return 0;

  // Base tokens + complexity multiplier
  let baseTokens = module.estimated_tokens;
  
  if (config.complexity === 'complex') baseTokens *= 1.3;
  if (config.complexity === 'expert') baseTokens *= 1.6;
  
  if (config.scale === 'enterprise') baseTokens *= 1.2;
  if (config.scale === 'organization') baseTokens *= 1.1;
  
  return Math.round(baseTokens);
}

// ============================================================================
// MODULE CATALOG EXPORTS
// ============================================================================

export const MODULE_VECTORS = [
  'strategic',
  'content', 
  'technical',
  'sales',
  'operational',
  'creative',
  'analytical'
] as const;

export const MODULE_DIFFICULTIES = [1, 2, 3, 4, 5] as const;

export const MODULE_PLANS = ['pilot', 'pro', 'enterprise'] as const;

export default MODULES_CATALOG;
