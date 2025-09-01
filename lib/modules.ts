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
  difficulty: string;
  plan: string;
}

export interface ModuleRun {
  id: string;
  moduleId: string;
  sevenDParams: SevenDParams;
  runType: 'simulate' | 'live';
  status: 'pending' | 'running' | 'completed' | 'failed';
  scores?: {
    quality: number;
    risk: number;
    cost: number;
    overall: number;
  };
  result?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface ModuleExport {
  id: string;
  moduleId: string;
  runId: string;
  format: 'txt' | 'md' | 'pdf' | 'json' | 'zip';
  filename: string;
  checksum: string;
  watermark?: string;
  createdAt: Date;
}

export interface ModuleOverlayState {
  isOpen: boolean;
  selectedModule: Module | null;
  sevenDParams: SevenDParams;
  activeTab: 'overview' | 'inputs' | 'outputs' | 'kpis' | 'guardrails' | 'actions';
}

// PromptForge v4 Complete Modules Catalog
export const catalogData: {
  version: string;
  modules: Record<string, Module>;
} = {
  version: "4.0.0",
  modules: {
    'M01': {
      id: 'M01',
      title: 'SOP FORGE™',
      slug: 'sop-forge',
      summary: 'Codifică proceduri & standarde. Output: SOP-uri acționabile (PDF/JSON). KPI: adoptare SOP, timp mediu de execuție.',
      vectors: ['strategic', 'operations'],
      difficulty: 2,
      minPlan: 'FREE' as PlanType,
      tags: ['procedures', 'standards', 'operations'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'operations',
        scale: 'team',
        urgency: 'normal',
        complexity: 'medium',
        resources: 'standard',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M02': {
      id: 'M02',
      title: 'LATENT MAP™',
      slug: 'latent-map',
      summary: 'Hartă de sens/strategie (teme, tensiuni). Output: schemă priorități + vectori semantici.',
      vectors: ['strategic', 'analysis'],
      difficulty: 3,
      minPlan: 'FREE' as PlanType,
      tags: ['strategy', 'mapping', 'priorities'],
      outputs: ['json', 'pdf'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'strategy',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'medium',
        resources: 'standard',
        application: 'strategy',
        output: 'json'
      }
    },
    'M03': {
      id: 'M03',
      title: 'SEVEN-TO-ONE™',
      slug: 'seven-to-one',
      summary: 'Comprimă 7 idei → 1 afirmație vandabilă. Teză centrală + 3 alternative.',
      vectors: ['strategic', 'branding'],
      difficulty: 2,
      minPlan: 'FREE' as PlanType,
      tags: ['positioning', 'messaging', 'brand'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'branding',
        scale: 'team',
        urgency: 'normal',
        complexity: 'medium',
        resources: 'standard',
        application: 'strategy',
        output: 'json'
      }
    },
    'M04': {
      id: 'M04',
      title: 'SEMIOTIC DICTIONARY 8VULTUS™',
      slug: 'semiotic-dictionary-8vultus',
      summary: 'Lexicon vizual-retoric. Output: tokens de brand (Map/Frame/Grid).',
      vectors: ['branding', 'content'],
      difficulty: 4,
      minPlan: 'CREATOR',
      tags: ['semiotics', 'visual', 'brand-tokens'],
      outputs: ['zip', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'branding',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'complex',
        resources: 'extended',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M05': {
      id: 'M05',
      title: 'ORAKON MEMORY GRID™',
      slug: 'orakon-memory-grid',
      summary: 'Memorie operațională (ce reținem/uităm). Output: reguli de retenție context.',
      vectors: ['operations', 'analysis'],
      difficulty: 3,
      minPlan: 'FREE' as PlanType,
      tags: ['memory', 'operations', 'retention'],
      outputs: ['json', 'pdf'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'operations',
        scale: 'team',
        urgency: 'normal',
        complexity: 'medium',
        resources: 'standard',
        application: 'analysis',
        output: 'json'
      }
    },
    'M06': {
      id: 'M06',
      title: 'AGENTIC GPT SALES™',
      slug: 'agentic-gpt-sales',
      summary: 'Scenarii tactice de vânzare cu GPT. Output: play-uri + scripturi.',
      vectors: ['sales', 'content'],
      difficulty: 3,
      minPlan: 'CREATOR',
      tags: ['sales', 'gpt', 'scripts', 'plays'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'sales',
        scale: 'team',
        urgency: 'normal',
        complexity: 'medium',
        resources: 'standard',
        application: 'content_creation',
        output: 'bundle'
      }
    },
    'M07': {
      id: 'M07',
      title: 'TRUST REVERSAL PROTOCOL™',
      slug: 'trust-reversal-protocol',
      summary: 'Inversează riscul perceput. Output: garanții, reversări, probe.',
      vectors: ['strategic', 'branding'],
      difficulty: 4,
      minPlan: 'CREATOR',
      tags: ['trust', 'risk', 'guarantees'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'branding',
        scale: 'organization',
        urgency: 'high',
        complexity: 'complex',
        resources: 'extended',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M08': {
      id: 'M08',
      title: 'STATUS-TIER LOYALTY™',
      slug: 'status-tier-loyalty',
      summary: 'Sistem de loialitate bazat pe status și tier-uri pentru retenția clienților.',
      vectors: ['branding', 'content'],
      difficulty: 3,
      minPlan: 'FREE' as PlanType,
      tags: ['loyalty', 'tiers', 'retention'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'branding',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'medium',
        resources: 'standard',
        application: 'strategy',
        output: 'json'
      }
    },
    'M09': {
      id: 'M09',
      title: 'AUTHORITY POSITIONING™',
      slug: 'authority-positioning',
      summary: 'Poziționare publică. Output: claim + mapare canale.',
      vectors: ['strategic', 'branding'],
      difficulty: 3,
      minPlan: 'FREE' as PlanType,
      tags: ['authority', 'positioning', 'channels'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'branding',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'medium',
        resources: 'standard',
        application: 'strategy',
        output: 'json'
      }
    },
    'M10': {
      id: 'M10',
      title: 'CRISIS COMMUNICATION PLAYBOOK™',
      slug: 'crisis-communication-playbook',
      summary: 'Răspuns la criză (24–72h). Output: mesaje, timeline, Q&A.',
      vectors: ['strategic', 'crisis_management'],
      difficulty: 5,
      minPlan: 'PRO',
      tags: ['crisis', 'communication', 'playbook'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'crisis_management',
        scale: 'enterprise',
        urgency: 'critical',
        complexity: 'expert',
        resources: 'unlimited',
        application: 'crisis_management',
        output: 'bundle'
      }
    },
    'M11': {
      id: 'M11',
      title: 'VIRAL CONTENT ENGINE™',
      slug: 'viral-content-engine',
      summary: 'Idei cu potențial de viralizare. Output: 20–50 hook-uri validate. KPI: CTR, share-rate.',
      vectors: ['content', 'branding'],
      difficulty: 3,
      minPlan: 'CREATOR',
      tags: ['viral', 'hooks', 'content'],
      outputs: ['json', 'pdf'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'content',
        scale: 'team',
        urgency: 'normal',
        complexity: 'medium',
        resources: 'standard',
        application: 'content_creation',
        output: 'json'
      }
    },
    'M12': {
      id: 'M12',
      title: 'BRAND VOICE CODEX™',
      slug: 'brand-voice-codex',
      summary: 'Ghid de voce & stil. Output: codex + exemple. KPI: consistență.',
      vectors: ['branding', 'content'],
      difficulty: 3,
      minPlan: 'FREE',
      tags: ['voice', 'style', 'brand'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'branding',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'medium',
        resources: 'standard',
        application: 'content_creation',
        output: 'bundle'
      }
    },
    'M13': {
      id: 'M13',
      title: 'EMAIL SEQUENCE ARCHITECT™',
      slug: 'email-sequence-architect',
      summary: 'Secvențe email. Output: 5–9 mesaje + A/B. KPI: open, reply, sales.',
      vectors: ['content', 'sales'],
      difficulty: 3,
      minPlan: 'CREATOR',
      tags: ['email', 'sequences', 'sales'],
      outputs: ['json', 'pdf'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'content',
        scale: 'team',
        urgency: 'normal',
        complexity: 'medium',
        resources: 'standard',
        application: 'content_creation',
        output: 'bundle'
      }
    },
    'M14': {
      id: 'M14',
      title: 'SOCIAL CONTENT GRID™',
      slug: 'social-content-grid',
      summary: 'Grilă socială (fuziune calendare). Output: calendar 7–30 zile. KPI: post-throughput, engagement.',
      vectors: ['content', 'branding'],
      difficulty: 2,
      minPlan: 'FREE' as PlanType,
      tags: ['social', 'calendar', 'content'],
      outputs: ['json', 'pdf'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'content',
        scale: 'team',
        urgency: 'normal',
        complexity: 'simple',
        resources: 'standard',
        application: 'content_creation',
        output: 'json'
      }
    },
    'M15': {
      id: 'M15',
      title: 'LANDING PAGE ALCHEMIST™',
      slug: 'landing-page-alchemist',
      summary: 'Pagini care convertesc. Output: draft + blocuri. KPI: CVR.',
      vectors: ['content', 'branding'],
      difficulty: 3,
      minPlan: 'CREATOR',
      tags: ['landing-page', 'conversion', 'copy'],
      outputs: ['json', 'pdf'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'content',
        scale: 'team',
        urgency: 'normal',
        complexity: 'medium',
        resources: 'standard',
        application: 'content_creation',
        output: 'bundle'
      }
    },
    'M16': {
      id: 'M16',
      title: 'CONTENT REPURPOSING ENGINE™',
      slug: 'content-repurposing-engine',
      summary: 'Reciclați 1→N formate. Output: bundle multi-canal. KPI: cost/post.',
      vectors: ['content', 'analytics'],
      difficulty: 3,
      minPlan: 'FREE' as PlanType,
      tags: ['repurposing', 'multi-channel', 'content'],
      outputs: ['zip', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'content',
        scale: 'team',
        urgency: 'normal',
        complexity: 'medium',
        resources: 'standard',
        application: 'content_creation',
        output: 'bundle'
      }
    },
    'M17': {
      id: 'M17',
      title: 'INFLUENCE PARTNERSHIP FRAME™',
      slug: 'influence-partnership-frame',
      summary: 'Colaborări/ambasadori. Output: pitch+deal-sheet.',
      vectors: ['branding', 'content'],
      difficulty: 4,
      minPlan: 'CREATOR',
      tags: ['partnerships', 'influence', 'ambassadors'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'branding',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'complex',
        resources: 'extended',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M18': {
      id: 'M18',
      title: 'CONTENT ANALYTICS DASHBOARD™',
      slug: 'content-analytics-dashboard',
      summary: 'Citire performanță. Output: rapoarte & acțiuni.',
      vectors: ['content', 'analytics'],
      difficulty: 3,
      minPlan: 'CREATOR',
      tags: ['analytics', 'dashboard', 'content'],
      outputs: ['json', 'pdf'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'content',
        scale: 'team',
        urgency: 'normal',
        complexity: 'medium',
        resources: 'standard',
        application: 'analysis',
        output: 'json'
      }
    },
    'M19': {
      id: 'M19',
      title: 'AUDIENCE SEGMENT PERSONALIZER™',
      slug: 'audience-segment-personalizer',
      summary: 'Mesaje pe segmente. Output: variații ICP. KPI: CVR pe segment.',
      vectors: ['content', 'branding'],
      difficulty: 4,
      minPlan: 'CREATOR',
      tags: ['segmentation', 'personalization', 'icp'],
      outputs: ['json', 'zip'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'content',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'complex',
        resources: 'extended',
        application: 'content_creation',
        output: 'bundle'
      }
    },
    'M20': {
      id: 'M20',
      title: 'MOMENTUM CAMPAIGN BUILDER™',
      slug: 'momentum-campaign-builder',
      summary: 'Campanii scurte cu inerție. Output: play de 7–14 zile. KPI: lift pe funnel.',
      vectors: ['content', 'branding'],
      difficulty: 4,
      minPlan: 'CREATOR',
      tags: ['campaigns', 'momentum', 'funnel'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'content',
        scale: 'organization',
        urgency: 'high',
        complexity: 'complex',
        resources: 'extended',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M21': {
      id: 'M21',
      title: 'API DOCS GENERATOR™',
      slug: 'api-docs-generator',
      summary: 'Contracte API din schema. Output: docs + examples.',
      vectors: ['technical', 'operations'],
      difficulty: 3,
      minPlan: 'CREATOR',
      tags: ['api', 'documentation', 'contracts'],
      outputs: ['json', 'zip'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'technical',
        scale: 'team',
        urgency: 'normal',
        complexity: 'medium',
        resources: 'standard',
        application: 'analysis',
        output: 'bundle'
      }
    },
    'M22': {
      id: 'M22',
      title: 'SYSTEM BLUEPRINT™',
      slug: 'system-blueprint',
      summary: 'Diagrame high-level. Output: C4-ish + checklists.',
      vectors: ['technical', 'operations'],
      difficulty: 4,
      minPlan: 'CREATOR',
      tags: ['architecture', 'diagrams', 'blueprint'],
      outputs: ['pdf', 'zip'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'technical',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'complex',
        resources: 'extended',
        application: 'analysis',
        output: 'bundle'
      }
    },
    'M23': {
      id: 'M23',
      title: 'DEVOPS PIPELINE ARCHITECT™',
      slug: 'devops-pipeline-architect',
      summary: 'CI/CD + approvals + canary. Output: pipelines & policies.',
      vectors: ['technical', 'operations'],
      difficulty: 5,
      minPlan: 'PRO',
      tags: ['devops', 'ci-cd', 'pipelines'],
      outputs: ['json', 'zip'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'technical',
        scale: 'enterprise',
        urgency: 'high',
        complexity: 'expert',
        resources: 'unlimited',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M24': {
      id: 'M24',
      title: 'DATA SCHEMA OPTIMIZER™',
      slug: 'data-schema-optimizer',
      summary: 'Modele DB, indici. Output: migrații & teste.',
      vectors: ['technical', 'operations'],
      difficulty: 4,
      minPlan: 'PRO',
      tags: ['database', 'schema', 'optimization'],
      outputs: ['json', 'zip'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'technical',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'complex',
        resources: 'extended',
        application: 'analysis',
        output: 'bundle'
      }
    },
    'M25': {
      id: 'M25',
      title: 'MICROSERVICES GRID™',
      slug: 'microservices-grid',
      summary: 'Granulație & mesaje. Output: hartă servicii.',
      vectors: ['technical', 'operations'],
      difficulty: 5,
      minPlan: 'PRO',
      tags: ['microservices', 'architecture', 'grid'],
      outputs: ['json', 'zip'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'technical',
        scale: 'enterprise',
        urgency: 'normal',
        complexity: 'expert',
        resources: 'unlimited',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M26': {
      id: 'M26',
      title: 'SECURITY FORTRESS FRAME™',
      slug: 'security-fortress-frame',
      summary: 'Controale & threat model. Output: checklist securitate.',
      vectors: ['technical', 'operations'],
      difficulty: 5,
      minPlan: 'PRO',
      tags: ['security', 'threat-model', 'controls'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'technical',
        scale: 'enterprise',
        urgency: 'high',
        complexity: 'expert',
        resources: 'unlimited',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M27': {
      id: 'M27',
      title: 'PERFORMANCE ENGINE™',
      slug: 'performance-engine',
      summary: 'Profilare & optimizări. Output: bugete perf (LCP/TTFB).',
      vectors: ['technical', 'operations'],
      difficulty: 4,
      minPlan: 'PRO',
      tags: ['performance', 'optimization', 'metrics'],
      outputs: ['json', 'pdf'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'technical',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'complex',
        resources: 'extended',
        application: 'analysis',
        output: 'bundle'
      }
    },
    'M28': {
      id: 'M28',
      title: 'API GATEWAY DESIGNER™',
      slug: 'api-gateway-designer',
      summary: 'Routing + RL + authz. Output: config gateway.',
      vectors: ['technical', 'operations'],
      difficulty: 4,
      minPlan: 'PRO',
      tags: ['api-gateway', 'routing', 'security'],
      outputs: ['json', 'zip'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'technical',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'complex',
        resources: 'extended',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M29': {
      id: 'M29',
      title: 'ORCHESTRATION MATRIX™',
      slug: 'orchestration-matrix',
      summary: 'Orchestrare containere/queue. Output: topologii & SLO.',
      vectors: ['technical', 'operations'],
      difficulty: 5,
      minPlan: 'PRO',
      tags: ['orchestration', 'containers', 'slo'],
      outputs: ['json', 'zip'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'technical',
        scale: 'enterprise',
        urgency: 'normal',
        complexity: 'expert',
        resources: 'unlimited',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M30': {
      id: 'M30',
      title: 'CLOUD INFRA MAP™',
      slug: 'cloud-infra-map',
      summary: 'Hartă infrastructură. Output: IaC blocks + cost guardrails.',
      vectors: ['technical', 'operations'],
      difficulty: 4,
      minPlan: 'PRO',
      tags: ['cloud', 'infrastructure', 'iac'],
      outputs: ['json', 'zip'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'technical',
        scale: 'enterprise',
        urgency: 'normal',
        complexity: 'complex',
        resources: 'extended',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M31': {
      id: 'M31',
      title: 'SALES FLOW ARCHITECT™',
      slug: 'sales-flow-architect',
      summary: 'Pipeline standard & SLA. Output: playbook operare. KPI: win-rate, cycle time.',
      vectors: ['sales', 'operations'],
      difficulty: 3,
      minPlan: 'CREATOR',
      tags: ['sales', 'pipeline', 'sla'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'sales',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'medium',
        resources: 'standard',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M32': {
      id: 'M32',
      title: 'CUSTOMER JOURNEY MAPPER™',
      slug: 'customer-journey-mapper',
      summary: 'Journey map + puncte „aha". Output: gaps & fix-uri.',
      vectors: ['sales', 'branding'],
      difficulty: 3,
      minPlan: 'CREATOR',
      tags: ['journey', 'mapping', 'gaps'],
      outputs: ['json', 'pdf'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'sales',
        scale: 'team',
        urgency: 'normal',
        complexity: 'medium',
        resources: 'standard',
        application: 'analysis',
        output: 'bundle'
      }
    },
    'M33': {
      id: 'M33',
      title: 'ENABLEMENT FRAME™',
      slug: 'enablement-frame',
      summary: 'Kit vânzare (decks, talk tracks). Output: enablement pack.',
      vectors: ['sales', 'content'],
      difficulty: 3,
      minPlan: 'CREATOR',
      tags: ['enablement', 'sales', 'decks'],
      outputs: ['zip', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'sales',
        scale: 'team',
        urgency: 'normal',
        complexity: 'medium',
        resources: 'standard',
        application: 'content_creation',
        output: 'bundle'
      }
    },
    'M34': {
      id: 'M34',
      title: 'ACCOUNT-BASED STRATEGY™',
      slug: 'account-based-strategy',
      summary: 'Target list & plays. Output: ABM plan. KPI: meetings/booked.',
      vectors: ['sales', 'strategy'],
      difficulty: 4,
      minPlan: 'CREATOR',
      tags: ['abm', 'strategy', 'targeting'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'sales',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'complex',
        resources: 'extended',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M35': {
      id: 'M35',
      title: 'FORECAST ENGINE™',
      slug: 'forecast-engine',
      summary: 'Proiecții & scenarii. Output: forecast tabelat + range.',
      vectors: ['sales', 'analytics'],
      difficulty: 4,
      minPlan: 'PRO',
      tags: ['forecasting', 'projections', 'scenarios'],
      outputs: ['json', 'xls'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'sales',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'complex',
        resources: 'extended',
        application: 'analysis',
        output: 'json'
      }
    },
    'M36': {
      id: 'M36',
      title: 'COMPENSATION DESIGNER™',
      slug: 'compensation-designer',
      summary: 'Scheme bonus/commissions. Output: scheme & simulări.',
      vectors: ['sales', 'operations'],
      difficulty: 4,
      minPlan: 'PRO',
      tags: ['compensation', 'bonus', 'commissions'],
      outputs: ['json', 'pdf'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'sales',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'complex',
        resources: 'extended',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M37': {
      id: 'M37',
      title: 'CUSTOMER SUCCESS PLAYBOOK™',
      slug: 'customer-success-playbook',
      summary: 'Onboarding, QBR, risc churn. Output: CS rituals. KPI: NRR/GRR.',
      vectors: ['sales', 'operations'],
      difficulty: 3,
      minPlan: 'CREATOR',
      tags: ['customer-success', 'onboarding', 'churn'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'sales',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'medium',
        resources: 'standard',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M38': {
      id: 'M38',
      title: 'PARTNER ECOSYSTEM GRID™',
      slug: 'partner-ecosystem-grid',
      summary: 'Parteneri & roluri. Output: matrix + offer splits.',
      vectors: ['sales', 'strategy'],
      difficulty: 4,
      minPlan: 'CREATOR',
      tags: ['partners', 'ecosystem', 'matrix'],
      outputs: ['json', 'pdf'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'sales',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'complex',
        resources: 'extended',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M39': {
      id: 'M39',
      title: 'INTELLIGENCE ENGINE™',
      slug: 'intelligence-engine',
      summary: 'Intel concurență/ofertă. Output: battlecards.',
      vectors: ['sales', 'analysis'],
      difficulty: 4,
      minPlan: 'CREATOR',
      tags: ['intelligence', 'competition', 'battlecards'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'sales',
        scale: 'team',
        urgency: 'normal',
        complexity: 'complex',
        resources: 'extended',
        application: 'analysis',
        output: 'bundle'
      }
    },
    'M40': {
      id: 'M40',
      title: 'NEGOTIATION DYNAMICS™',
      slug: 'negotiation-dynamics',
      summary: 'Tactici & concesii. Output: play de negociere. KPI: discount median.',
      vectors: ['sales', 'strategy'],
      difficulty: 4,
      minPlan: 'PRO',
      tags: ['negotiation', 'tactics', 'concessions'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'sales',
        scale: 'team',
        urgency: 'high',
        complexity: 'complex',
        resources: 'extended',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M41': {
      id: 'M41',
      title: 'PROCESS AUTOMATION BLUEPRINT™',
      slug: 'process-automation-blueprint',
      summary: 'Hărți & triggeri. Output: play-uri Make/Zapier/n8n.',
      vectors: ['operations', 'technical'],
      difficulty: 4,
      minPlan: 'PRO',
      tags: ['automation', 'processes', 'triggers'],
      outputs: ['json', 'zip'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'operations',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'complex',
        resources: 'extended',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M42': {
      id: 'M42',
      title: 'QUALITY SYSTEM MAP™',
      slug: 'quality-system-map',
      summary: 'Controale calitate. Output: QC gates + checklists.',
      vectors: ['operations', 'analysis'],
      difficulty: 3,
      minPlan: 'CREATOR',
      tags: ['quality', 'qc', 'checklists'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'operations',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'medium',
        resources: 'standard',
        application: 'analysis',
        output: 'bundle'
      }
    },
    'M43': {
      id: 'M43',
      title: 'SUPPLY FLOW OPTIMIZER™',
      slug: 'supply-flow-optimizer',
      summary: 'Flux furnizori/resurse. Output: WIP limits + SLA.',
      vectors: ['operations', 'analysis'],
      difficulty: 4,
      minPlan: 'PRO',
      tags: ['supply', 'flow', 'optimization'],
      outputs: ['json', 'pdf'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'operations',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'complex',
        resources: 'extended',
        application: 'analysis',
        output: 'bundle'
      }
    },
    'M44': {
      id: 'M44',
      title: 'PORTFOLIO MANAGER™',
      slug: 'portfolio-manager',
      summary: 'Portofoliu proiecte. Output: scoring & prioritizare.',
      vectors: ['operations', 'strategy'],
      difficulty: 4,
      minPlan: 'PRO',
      tags: ['portfolio', 'scoring', 'prioritization'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'operations',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'complex',
        resources: 'extended',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M45': {
      id: 'M45',
      title: 'CHANGE FORCE FIELD™',
      slug: 'change-force-field',
      summary: 'Schimbare cu rezistențe. Output: plan schimbare.',
      vectors: ['operations', 'strategy'],
      difficulty: 5,
      minPlan: 'PRO',
      tags: ['change', 'resistance', 'planning'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'operations',
        scale: 'enterprise',
        urgency: 'high',
        complexity: 'expert',
        resources: 'unlimited',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M46': {
      id: 'M46',
      title: 'CREATIVE STRATEGY ENGINE™',
      slug: 'creative-strategy-engine',
      summary: 'Strategii creative. Output: creative packs.',
      vectors: ['branding', 'content'],
      difficulty: 4,
      minPlan: 'CREATOR',
      tags: ['creative', 'strategy', 'packs'],
      outputs: ['zip', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'branding',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'complex',
        resources: 'extended',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M47': {
      id: 'M47',
      title: 'PROMPT SYSTEM ARCHITECT™',
      slug: 'prompt-system-architect',
      summary: 'Arhitectură prompts. Output: librărie & standarde.',
      vectors: ['technical', 'operations'],
      difficulty: 4,
      minPlan: 'PRO',
      tags: ['prompts', 'architecture', 'standards'],
      outputs: ['json', 'zip'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'technical',
        scale: 'organization',
        urgency: 'normal',
        complexity: 'complex',
        resources: 'extended',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M48': {
      id: 'M48',
      title: 'FRACTAL IDENTITY MAP™',
      slug: 'fractal-identity-map',
      summary: 'Identitate multi-strat. Output: tokens & glyph maps.',
      vectors: ['branding', 'strategy'],
      difficulty: 5,
      minPlan: 'ENTERPRISE',
      tags: ['identity', 'fractal', 'tokens'],
      outputs: ['zip', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'branding',
        scale: 'enterprise',
        urgency: 'normal',
        complexity: 'expert',
        resources: 'unlimited',
        application: 'strategy',
        output: 'bundle'
      }
    },
    'M49': {
      id: 'M49',
      title: 'EXECUTIVE PROMPT DOSSIER™',
      slug: 'executive-prompt-dossier',
      summary: 'Rapoarte executive. Output: dossier periodic.',
      vectors: ['strategy', 'analysis'],
      difficulty: 4,
      minPlan: 'ENTERPRISE',
      tags: ['executive', 'reports', 'dossier'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'strategy',
        scale: 'enterprise',
        urgency: 'normal',
        complexity: 'complex',
        resources: 'unlimited',
        application: 'analysis',
        output: 'bundle'
      }
    },
    'M50': {
      id: 'M50',
      title: 'PROMPT LICENSING MANAGER™',
      slug: 'prompt-licensing-manager',
      summary: 'Licențiere, planuri, IP. Output: terms & enforcement.',
      vectors: ['operations', 'strategy'],
      difficulty: 5,
      minPlan: 'ENTERPRISE',
      tags: ['licensing', 'ip', 'terms'],
      outputs: ['pdf', 'json'],
      version: '4.0.0',
      sevenDDefaults: {
        domain: 'operations',
        scale: 'enterprise',
        urgency: 'normal',
        complexity: 'expert',
        resources: 'unlimited',
        application: 'strategy',
        output: 'bundle'
      }
    }
  }
};

// Export all modules as an array
export const allModules: Module[] = Object.values(catalogData.modules);

// Export individual modules
export const {
  M01, M02, M03, M04, M05, M06, M07, M08, M09, M10,
  M11, M12, M13, M14, M15, M16, M17, M18, M19, M20,
  M21, M22, M23, M24, M25, M26, M27, M28, M29, M30,
  M31, M32, M33, M34, M35, M36, M37, M38, M39, M40,
  M41, M42, M43, M44, M45, M46, M47, M48, M49, M50
} = catalogData.modules;

// Helper functions
export function getModuleById(id: string): Module | undefined {
  return catalogData.modules[id as keyof typeof catalogData.modules];
}

export function getModulesByVector(vector: string): Module[] {
  return allModules.filter(module => module.vectors.includes(vector));
}

export function getModulesByPlan(plan: PlanType): Module[] {
  return allModules.filter(module => module.minPlan === plan);
}

export function getModulesByDifficulty(difficulty: number): Module[] {
  return allModules.filter(module => module.difficulty === difficulty);
}

export function searchModules(query: string): Module[] {
  const lowercaseQuery = query.toLowerCase();
  return allModules.filter(module => 
    module.title.toLowerCase().includes(lowercaseQuery) ||
    module.summary.toLowerCase().includes(lowercaseQuery) ||
    module.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}
