"use client";

export interface PremiumTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  limits: {
    monthlyRuns: number;
    exportFormats: string[];
    historyRetention: number; // days
    gptOptimizations: number;
    concurrentSessions: number;
  };
}

export const PREMIUM_TIERS: PremiumTier[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: ["Basic prompt generation", "Limited history", "Standard export"],
    limits: {
      monthlyRuns: 10,
      exportFormats: ["txt"],
      historyRetention: 7,
      gptOptimizations: 0,
      concurrentSessions: 1,
    },
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    features: [
      "Unlimited prompts",
      "GPT optimization",
      "Advanced exports",
      "Priority support",
    ],
    limits: {
      monthlyRuns: 1000,
      exportFormats: ["txt", "json", "csv", "pdf"],
      historyRetention: 90,
      gptOptimizations: 100,
      concurrentSessions: 3,
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    features: [
      "Everything in Pro",
      "Custom modules",
      "API access",
      "White-label",
      "SLA",
    ],
    limits: {
      monthlyRuns: -1, // unlimited
      exportFormats: ["txt", "json", "csv", "pdf", "docx", "bundle"],
      historyRetention: 365,
      gptOptimizations: -1, // unlimited
      concurrentSessions: 10,
    },
  },
];

export interface UserEntitlements {
  tier: string;
  runsUsed: number;
  gptOptimizationsUsed: number;
  activeSessions: number;
  lastReset: Date;
}

export class PremiumGate {
  private static instance: PremiumGate;
  private entitlements: UserEntitlements;

  private constructor() {
    this.entitlements = this.loadEntitlements();
  }

  static getInstance(): PremiumGate {
    if (!PremiumGate.instance) {
      PremiumGate.instance = new PremiumGate();
    }
    return PremiumGate.instance;
  }

  private loadEntitlements(): UserEntitlements {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("promptforge_entitlements");
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          lastReset: new Date(parsed.lastReset),
        };
      }
    }
    return {
      tier: "free",
      runsUsed: 0,
      gptOptimizationsUsed: 0,
      activeSessions: 1,
      lastReset: new Date(),
    };
  }

  private saveEntitlements(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "promptforge_entitlements",
        JSON.stringify(this.entitlements),
      );
    }
  }

  getCurrentTier(): PremiumTier {
    return (
      PREMIUM_TIERS.find((t) => t.id === this.entitlements.tier) ||
      PREMIUM_TIERS[0]
    );
  }

  canGeneratePrompt(): { allowed: boolean; reason?: string } {
    const tier = this.getCurrentTier();

    // Check monthly runs limit
    if (
      tier.limits.monthlyRuns !== -1 &&
      this.entitlements.runsUsed >= tier.limits.monthlyRuns
    ) {
      return {
        allowed: false,
        reason: `Monthly limit of ${tier.limits.monthlyRuns} runs exceeded. Upgrade to continue.`,
      };
    }

    // Check concurrent sessions
    if (this.entitlements.activeSessions > tier.limits.concurrentSessions) {
      return {
        allowed: false,
        reason: `Maximum ${tier.limits.concurrentSessions} concurrent sessions allowed.`,
      };
    }

    return { allowed: true };
  }

  canUseGPTOptimization(): { allowed: boolean; reason?: string } {
    const tier = this.getCurrentTier();

    if (tier.limits.gptOptimizations === 0) {
      return {
        allowed: false,
        reason: "GPT optimization requires Pro or Enterprise plan.",
      };
    }

    if (
      tier.limits.gptOptimizations !== -1 &&
      this.entitlements.gptOptimizationsUsed >= tier.limits.gptOptimizations
    ) {
      return {
        allowed: false,
        reason: `Monthly GPT optimization limit of ${tier.limits.gptOptimizations} exceeded.`,
      };
    }

    return { allowed: true };
  }

  canExportFormat(format: string): boolean {
    const tier = this.getCurrentTier();
    return tier.limits.exportFormats.includes(format);
  }

  consumeRun(): void {
    this.entitlements.runsUsed++;
    this.saveEntitlements();
  }

  consumeGPTOptimization(): void {
    this.entitlements.gptOptimizationsUsed++;
    this.saveEntitlements();
  }

  getUsageStats() {
    const tier = this.getCurrentTier();
    return {
      runs: {
        used: this.entitlements.runsUsed,
        limit: tier.limits.monthlyRuns,
        percentage:
          tier.limits.monthlyRuns === -1
            ? 0
            : (this.entitlements.runsUsed / tier.limits.monthlyRuns) * 100,
      },
      gptOptimizations: {
        used: this.entitlements.gptOptimizationsUsed,
        limit: tier.limits.gptOptimizations,
        percentage:
          tier.limits.gptOptimizations === -1
            ? 0
            : (this.entitlements.gptOptimizationsUsed /
                tier.limits.gptOptimizations) *
              100,
      },
    };
  }

  upgradeTier(tierId: string): void {
    this.entitlements.tier = tierId;
    this.saveEntitlements();
  }
}

import { useState, useEffect } from "react";

export function usePremiumFeatures() {
  const [premiumGate] = useState(() => PremiumGate.getInstance());
  const [tier, setTier] = useState<PremiumTier>(() =>
    premiumGate.getCurrentTier(),
  );
  const [usageStats, setUsageStats] = useState(() =>
    premiumGate.getUsageStats(),
  );

  useEffect(() => {
    // Update tier and usage stats when component mounts
    setTier(premiumGate.getCurrentTier());
    setUsageStats(premiumGate.getUsageStats());
  }, [premiumGate]);

  const canGeneratePrompt = () => premiumGate.canGeneratePrompt();
  const canUseGPTOptimization = () => premiumGate.canUseGPTOptimization();
  const canExportFormat = (format: string) =>
    premiumGate.canExportFormat(format);
  const canAccessCloudHistory = tier.id !== "free";

  const consumeRun = () => {
    premiumGate.consumeRun();
    setUsageStats(premiumGate.getUsageStats());
  };

  const consumeGPTOptimization = () => {
    premiumGate.consumeGPTOptimization();
    setUsageStats(premiumGate.getUsageStats());
  };

  const upgradeTier = (tierId: string) => {
    premiumGate.upgradeTier(tierId);
    setTier(premiumGate.getCurrentTier());
    setUsageStats(premiumGate.getUsageStats());
  };

  return {
    tier: tier.name,
    tierId: tier.id,
    tierData: tier,
    usageStats,
    canGeneratePrompt,
    canUseGPTOptimization,
    canExportFormat,
    canAccessCloudHistory,
    consumeRun,
    consumeGPTOptimization,
    upgradeTier,
  };
}
