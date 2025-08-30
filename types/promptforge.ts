// PromptForge type definitions
export interface PromptModule {
  id: number;
  name: string;
  description: string;
  vectors: number[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  domain?: string;
  complexity?: string;
  defaultConfig?: SevenDConfig;
  requirements?: string;
  spec?: string;
  output?: string;
  kpi?: string;
  guardrails?: string;
}

export interface GeneratedPrompt {
  id: string;
  content: string;
  module: PromptModule;
  timestamp: Date;
  score?: number;
  metadata?: Record<string, any>;
  moduleId?: number;
  moduleName?: string;
  sevenDConfig?: SevenDConfig;
  sessionHash?: string;
  validationScore?: number;
  kpiCompliance?: number;
  structureScore?: number;
  clarityScore?: number;
  hash?: string;
}

export interface TestResult {
  id: string;
  promptId: string;
  scores: {
    clarity: number;
    specificity: number;
    completeness: number;
    effectiveness: number;
    execution?: number;
    ambiguity?: number;
    business_fit?: number;
  };
  verdict?: 'PASS' | 'PARTIAL' | 'FAIL';
  recommendations: string[];
  timestamp: Date;
}

export interface HistoryEntry {
  id: string;
  prompt: GeneratedPrompt;
  testResult?: TestResult;
  timestamp: Date;
  tags: string[];
  moduleId?: number;
  moduleName?: string;
  vector?: number;
  type?: string;
  content?: string;
  score?: number;
  config?: {
    domain?: string;
    scale?: string;
    urgency?: string;
  };
  metadata?: {
    validationScore?: number;
    kpiCompliance?: number;
    structureScore?: number;
    clarityScore?: number;
  };
}

export interface SevenDConfig {
  domain: string;
  difficulty: string;
  vector: string;
  context: string;
  constraints: string;
  output: string;
  examples: string;
}

export interface SessionConfig {
  module: PromptModule;
  sevenD: SevenDConfig;
  customizations?: Record<string, any>;
}

export interface VECTOR {
  id: number;
  name: string;
  description: string;
  color: string;
}

export const VECTORS: VECTOR[] = [
  {
    id: 1,
    name: 'Clarity',
    description: 'Clear and understandable prompts',
    color: '#3B82F6',
  },
  {
    id: 2,
    name: 'Specificity',
    description: 'Specific and detailed instructions',
    color: '#10B981',
  },
  {
    id: 3,
    name: 'Completeness',
    description: 'Complete and comprehensive prompts',
    color: '#F59E0B',
  },
  {
    id: 4,
    name: 'Effectiveness',
    description: 'Effective and actionable prompts',
    color: '#EF4444',
  },
];
