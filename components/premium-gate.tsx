"use client";

import type React from "react";
import { PremiumGate, PREMIUM_TIERS } from "@/lib/premium-features";
import { getBrandMessage, getContextualCTA } from "@/lib/brand-messaging";
import {
  IndustrialButton,
  IndustrialCard,
  IndustrialBadge,
} from "@/components/industrial-ui";
import { Crown, Zap, Lock, TrendingUp, Shield, Sparkles } from "lucide-react";

interface PremiumGateProps {
  feature: string;
  onUpgrade?: () => void;
  children?: React.ReactNode;
}

export function PremiumGateComponent({
  feature,
  onUpgrade,
  children,
}: PremiumGateProps) {
  const gate = PremiumGate.getInstance();
  const currentTier = gate.getCurrentTier();
  const stats = gate.getUsageStats();
  const upgradeMessage = getBrandMessage("upgrade_urgency", currentTier.id);

  return (
    <div className="space-y-6">
      {/* Usage Stats */}
      <IndustrialCard className="p-6 bg-slate-900/50 border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">
            Current Plan: {currentTier.name}
          </h3>
          <IndustrialBadge variant="info" className="animate-pulse">
            Active
          </IndustrialBadge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Monthly Operations</span>
              <span className="text-white">
                {stats.runs.used} /{" "}
                {stats.runs.limit === -1 ? "∞" : stats.runs.limit}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(stats.runs.percentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">GPT Optimizations</span>
              <span className="text-white">
                {stats.gptOptimizations.used} /{" "}
                {stats.gptOptimizations.limit === -1
                  ? "∞"
                  : stats.gptOptimizations.limit}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-400 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(stats.gptOptimizations.percentage, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </IndustrialCard>

      {/* Premium Feature Gate */}
      <IndustrialCard
        variant="elevated"
        className="p-8 bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-slate-700/50 backdrop-blur-sm"
      >
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full">
              <Lock className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-3xl font-bold text-white">
              Unlock Professional-Grade Capabilities
            </h3>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              {feature} requires advanced enterprise features to deliver maximum
              performance and reliability
            </p>
            {upgradeMessage && (
              <p className="text-sm text-amber-300 font-medium">
                {upgradeMessage.secondary}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PREMIUM_TIERS.map((tier) => (
              <IndustrialCard
                key={tier.id}
                className={`p-6 transition-all duration-300 ${
                  tier.id === currentTier.id
                    ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-400/50 ring-2 ring-blue-400/30"
                    : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/70"
                }`}
              >
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    {tier.id === "free" && (
                      <Zap className="w-8 h-8 text-slate-400" />
                    )}
                    {tier.id === "pro" && (
                      <Crown className="w-8 h-8 text-amber-400" />
                    )}
                    {tier.id === "enterprise" && (
                      <Shield className="w-8 h-8 text-purple-400" />
                    )}
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white">
                      {tier.name}
                    </h4>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <span className="text-3xl font-black text-white">
                        ${tier.price}
                      </span>
                      <div className="text-left">
                        <div className="text-sm text-slate-400">/month</div>
                        {tier.price > 0 && (
                          <div className="text-xs text-green-400">30% off</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2 text-sm text-slate-300">
                    {tier.features.slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <IndustrialButton
                      variant={
                        tier.id === currentTier.id ? "secondary" : "primary"
                      }
                      size="md"
                      className="w-full"
                      onClick={() => {
                        if (tier.id !== currentTier.id) {
                          gate.upgradeTier(tier.id);
                          onUpgrade?.();
                        }
                      }}
                      disabled={tier.id === currentTier.id}
                    >
                      {tier.id === currentTier.id ? (
                        <>
                          <Crown className="w-4 h-4 mr-2" />
                          Current Plan
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          {getContextualCTA(currentTier.id, "upgrade")}
                        </>
                      )}
                    </IndustrialButton>
                  </div>
                </div>
              </IndustrialCard>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-700/50">
            <div className="flex items-center justify-center gap-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-400" />
                30-day money-back guarantee
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Proven ROI in 30 days
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                No setup fees
              </div>
            </div>
          </div>
        </div>
      </IndustrialCard>

      {children}
    </div>
  );
}
