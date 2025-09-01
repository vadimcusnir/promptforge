export type PlanType = 'FREE' | 'CREATOR' | 'PRO' | 'ENTERPRISE';
export type BillingCycle = 'monthly' | 'annual';

export interface PlanFeature {
  id: string;
  name: string;
  description: string;
  availableIn: PlanType[];
  highlight?: boolean; // For "aha moments"
}

export interface Plan {
  id: PlanType;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  popular?: boolean;
  trialDays?: number;
  exportFormats: string[];
  moduleAccess: 'subset' | 'all';
  liveTesting: boolean;
  apiAccess: boolean;
  teamSeats: boolean;
  rateLimits: string;
}

export const PLANS: Record<PlanType, Plan> = {
  FREE: {
    id: 'FREE',
    name: 'Free',
    description: 'Perfect for getting started with prompt engineering',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      '10 Core Modules',
      '.txt Export',
      'Basic Scoring',
      'Community Support'
    ],
    exportFormats: ['.txt'],
    moduleAccess: 'subset',
    liveTesting: false,
    apiAccess: false,
    teamSeats: false,
    rateLimits: '10 prompts/month'
  },
  CREATOR: {
    id: 'CREATOR',
    name: 'Creator',
    description: 'Ideal for content creators and freelancers',
    monthlyPrice: 29,
    annualPrice: 290, // 10× monthly
    features: [
      'All 50 Modules',
      '.txt + .md Export',
      'Advanced Scoring',
      'Cloud History',
      'Email Support'
    ],
    exportFormats: ['.txt', '.md'],
    moduleAccess: 'all',
    liveTesting: false,
    apiAccess: false,
    teamSeats: false,
    rateLimits: '100 prompts/month'
  },
  PRO: {
    id: 'PRO',
    name: 'Pro',
    description: 'Built for professional teams and agencies',
    monthlyPrice: 99,
    annualPrice: 990, // 10× monthly
    features: [
      'All 50 Modules',
      '.txt + .md + .pdf + .json',
      'Run Real Tests',
      'Cloud History',
      'Advanced Analytics',
      'Priority Support',
      '7-Day Free Trial'
    ],
    popular: true,
    trialDays: 7,
    exportFormats: ['.txt', '.md', '.pdf', '.json'],
    moduleAccess: 'all',
    liveTesting: true,
    apiAccess: false,
    teamSeats: false,
    rateLimits: '1000 prompts/month'
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    description: 'For large organizations with advanced needs',
    monthlyPrice: 299,
    annualPrice: 2990, // 10× monthly
    features: [
      'Everything in Pro',
      'API Access',
      'Bundle .zip Export',
      'Team Seats',
      'Custom Rate Limits',
      'Dedicated Account Manager',
      'SLA Guarantee'
    ],
    exportFormats: ['.txt', '.md', '.pdf', '.json', '.zip'],
    moduleAccess: 'all',
    liveTesting: true,
    apiAccess: true,
    teamSeats: true,
    rateLimits: 'Unlimited'
  }
};

export const PLAN_FEATURES: PlanFeature[] = [
  {
    id: 'modules',
    name: 'Module Access',
    description: 'Access to prompt engineering modules',
    availableIn: ['FREE', 'CREATOR', 'PRO', 'ENTERPRISE'],
    highlight: true
  },
  {
    id: 'txt_export',
    name: '.txt Export',
    description: 'Export prompts as plain text',
    availableIn: ['FREE', 'CREATOR', 'PRO', 'ENTERPRISE']
  },
  {
    id: 'md_export',
    name: '.md Export',
    description: 'Export prompts as formatted markdown',
    availableIn: ['CREATOR', 'PRO', 'ENTERPRISE']
  },
  {
    id: 'pdf_export',
    name: '.pdf Export',
    description: 'Export prompts as professional PDF documents',
    availableIn: ['PRO', 'ENTERPRISE'],
    highlight: true
  },
  {
    id: 'json_export',
    name: '.json Export',
    description: 'Export prompts with metadata and configuration',
    availableIn: ['PRO', 'ENTERPRISE'],
    highlight: true
  },
  {
    id: 'zip_export',
    name: '.zip Bundle Export',
    description: 'Export complete prompt packages with manifests',
    availableIn: ['ENTERPRISE']
  },
  {
    id: 'live_testing',
    name: 'Run Real Tests',
    description: 'Test prompts against real GPT models with quality scoring',
    availableIn: ['PRO', 'ENTERPRISE'],
    highlight: true
  },
  {
    id: 'cloud_history',
    name: 'Cloud History',
    description: 'Store and manage prompt history in the cloud',
    availableIn: ['CREATOR', 'PRO', 'ENTERPRISE']
  },
  {
    id: 'api_access',
    name: 'API Access',
    description: 'Access to high-performance API endpoints',
    availableIn: ['ENTERPRISE']
  },
  {
    id: 'team_seats',
    name: 'Team Seats',
    description: 'Collaborate with team members',
    availableIn: ['ENTERPRISE']
  },
  {
    id: 'custom_limits',
    name: 'Custom Rate Limits',
    description: 'Customizable API rate limits',
    availableIn: ['ENTERPRISE']
  }
];

// Helper functions
export function getPlanById(id: PlanType): Plan {
  return PLANS[id];
}

export function getAllPlans(): Plan[] {
  return Object.values(PLANS);
}

export function getPlanPrice(planId: PlanType, cycle: BillingCycle): number {
  const plan = PLANS[planId];
  return cycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;
}

export function getPlanSavings(planId: PlanType): number {
  const plan = PLANS[planId];
  if (plan.monthlyPrice === 0) return 0;
  return Math.round((plan.monthlyPrice * 12 - plan.annualPrice) / (plan.monthlyPrice * 12) * 100);
}

export function isFeatureAvailable(featureId: string, planId: PlanType): boolean {
  const feature = PLAN_FEATURES.find(f => f.id === featureId);
  return feature ? feature.availableIn.includes(planId) : false;
}

export function getPlanFeatures(planId: PlanType): PlanFeature[] {
  return PLAN_FEATURES.filter(feature => feature.availableIn.includes(planId));
}

export function getHighlightFeatures(planId: PlanType): PlanFeature[] {
  return PLAN_FEATURES.filter(feature => 
    feature.availableIn.includes(planId) && feature.highlight
  );
}
