export interface PromptModule {
  id: number;
  name: string;
  description: string;
  requirements: string;
  spec: string;
  output: string;
  kpi: string;
  guardrails: string;
  vectors: number[];
  vector: number; // Required for the enhanced structure
  complexity: string; // Required for the enhanced structure
  domain: string; // Required for the enhanced structure
  defaultConfig: {
    scale: string;
    urgency: string;
    complexity: string;
    resources: string;
    application: string;
    output: string;
    outputFormat: string;
    vector: string;
  }; // Required for the enhanced structure
}

export interface SessionConfig {
  vector: string;
  domain: string;
  scale: string;
  urgency: string;
  resources: string;
  complexity: string;
  application: string;
  outputFormat: string;
  output: string; // Added to match SevenDConfig interface
}

export interface SevenDConfig {
  domain: string;
  scale: string;
  urgency: string;
  complexity: string;
  resources: string;
  application: string;
  output: string;
  outputFormat: string; // Added for backward compatibility
  vector: string; // Added to match SessionConfig interface
}

export interface GeneratedPrompt {
  id: string;
  moduleId: number;
  sevenDConfig: SevenDConfig;
  content: string;
  prompt: string; // Alias for content for backward compatibility
  config: SevenDConfig; // Alias for sevenDConfig for backward compatibility
  timestamp: Date;
  hash: string;
  tokens: number;
  tta: number;
  // Additional properties for backward compatibility
  moduleName?: string;
  vector?: number;
  sessionHash?: string;
  // Test scores (optional, populated after testing)
  validationScore?: number;
  kpiCompliance?: number;
  structureScore?: number;
  clarityScore?: number;
  // Run tracking
  runId?: string;
}

export interface TestResults {
  structureScore: number;
  kpiScore: number;
  clarityScore: number;
  output: string;
  validated: boolean;
}

export interface TestResult {
  id: string;
  promptId: string;
  scores: {
    clarity: number;
    execution: number;
    ambiguity: number;
    business_fit: number;
  };
  verdict: "PASS" | "PARTIAL" | "FAIL";
  recommendations: string[];
  timestamp: Date;
}

export interface PromptHistory {
  prompts: GeneratedPrompt[];
  maxEntries: number;
}

export interface HistoryEntry {
  id: string;
  moduleId: number;
  sevenDConfig: SevenDConfig;
  timestamp: Date;
  score?: number;
  verdict?: string;
  runId?: string;
}

export const VECTORS = {
  1: { name: "V1: Systems & Agents", color: "text-red-400", description: "AI agents, automation, and system orchestration" },
  2: { name: "V2: Marketing & Sales", color: "text-blue-400", description: "Customer acquisition, conversion, and retention" },
  3: { name: "V3: Content & Education", color: "text-green-400", description: "Knowledge transfer, learning, and content creation" },
  4: { name: "V4: Decisions & Cognitive", color: "text-yellow-400", description: "Strategic thinking, analysis, and decision-making" },
  5: { name: "V5: Semiotic Branding", color: "text-purple-400", description: "Brand identity, messaging, and visual communication" },
  6: { name: "V6: Data & Analytics", color: "text-cyan-400", description: "Insights, metrics, and data-driven decisions" },
  7: { name: "V7: Crisis & PR", color: "text-orange-400", description: "Risk management, communication, and reputation" },
} as const;

// Glitch Protocol Types
export interface GlitchTelemetry {
  count: number;
  run_times: number[];
  hover_replays: number;
  disabled_by_reduced_motion: boolean;
}

// Global window type extension
declare global {
  interface Window {
    glitchTelemetry?: GlitchTelemetry;
  }
}
