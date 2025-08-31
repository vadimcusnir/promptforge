export type PlanType = 'FREE' | 'CREATOR' | 'PRO' | 'ENTERPRISE';

export interface FeatureFlag {
  key: string;
  description: string;
  enabled: boolean;
}

export interface Entitlement {
  key: string;
  description: string;
  plan: PlanType;
  enabled: boolean;
}

export interface PlanLimits {
  modules: number;
  exports: number;
  aiGenerations: number;
}

export interface PlanConfig {
  name: string;
  price: number;
  features: string[];
  limits: PlanLimits;
}
