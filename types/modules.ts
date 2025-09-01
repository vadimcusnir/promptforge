export type PlanType = 'FREE' | 'CREATOR' | 'PRO' | 'ENTERPRISE';

export interface SevenDParams {
  domain: string;
  scale: 'individual' | 'team' | 'organization' | 'enterprise';
  urgency: 'low' | 'normal' | 'high' | 'critical';
  complexity: 'simple' | 'medium' | 'complex' | 'expert';
  resources: 'minimal' | 'standard' | 'extended' | 'unlimited';
  application: 'prompt_engineering' | 'content_creation' | 'analysis' | 'strategy' | 'crisis_management';
  output: 'text' | 'markdown' | 'json' | 'bundle';
}

export interface Module {
  id: string;
  title: string;
  slug: string;
  summary: string;
  vectors: string[];
  difficulty: number; // 1-5
  minPlan: PlanType;
  tags: string[];
  outputs: string[];
  version: string;
  deprecated?: boolean;
  sevenDDefaults?: Partial<SevenDParams>;
}

export interface FilterState {
  search: string;
  vectors: string[];
  difficulty: number | null;
  plan: PlanType | 'all';
}

export interface ModuleRun {
  id: string;
  moduleId: string;
  sevenDParams: SevenDParams;
  prompt: string;
  score: {
    quality: number;
    risk: number;
    cost: number;
    overall: number;
  };
  runType: 'simulate' | 'live';
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  cost?: number;
  tokens?: number;
}

export interface ModuleExport {
  id: string;
  runId: string;
  format: string;
  filename: string;
  checksum: string;
  size: number;
  createdAt: string;
  expiresAt: string;
  downloadUrl: string;
}

export interface ModuleOverlayState {
  isOpen: boolean;
  activeTab: 'overview' | 'inputs' | 'outputs' | 'kpis' | 'guardrails' | 'actions';
  sevenDParams: SevenDParams;
  isRunning: boolean;
  runResult?: ModuleRun;
  error?: string;
}
