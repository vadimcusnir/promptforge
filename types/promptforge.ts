export interface PromptModule {
  id: number
  name: string
  description: string
  requirements: string
  spec: string
  output: string
  kpi: string
  guardrails: string
  vectors: number[]
}

export interface SessionConfig {
  vector: string
  domain: string
  scale: string
  urgency: string
  resources: string
  complexity: string
  application: string
  outputFormat: string
}

export interface SevenDConfig {
  domain: string
  scale: string
  urgency: string
  complexity: string
  resources: string
  application: string
  output: string
}

export interface GeneratedPrompt {
  id: string
  moduleId: number
  sevenDConfig: SevenDConfig
  content: string
  timestamp: Date
  hash: string
  tokens: number
  tta: number
}

export interface TestResults {
  structureScore: number
  kpiScore: number
  clarityScore: number
  output: string
  validated: boolean
}

export interface TestResult {
  id: string
  promptId: string
  scores: {
    clarity: number
    execution: number
    ambiguity: number
    business_fit: number
  }
  verdict: "PASS" | "PARTIAL" | "FAIL"
  recommendations: string[]
  timestamp: Date
}

export interface PromptHistory {
  prompts: GeneratedPrompt[]
  maxEntries: number
}

export interface HistoryEntry {
  id: string
  moduleId: number
  sevenDConfig: SevenDConfig
  timestamp: Date
  score?: number
  verdict?: string
}

export const VECTORS = {
  1: { name: "V1: Systems & Agents", color: "text-red-400" },
  2: { name: "V2: Marketing & Sales", color: "text-blue-400" },
  3: { name: "V3: Content & Education", color: "text-green-400" },
  4: { name: "V4: Decisions & Cognitive", color: "text-yellow-400" },
  5: { name: "V5: Semiotic Branding", color: "text-purple-400" },
  6: { name: "V6: Data & Analytics", color: "text-cyan-400" },
  7: { name: "V7: Crisis & PR", color: "text-orange-400" },
} as const
