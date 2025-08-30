"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap, Shield, Lock } from "lucide-react";
import { useEntitlements, type Entitlements } from "@/hooks/use-entitlements";
import { PlanType } from "@/lib/entitlements/types";

interface BadgePlanProps {
  plan: PlanType;
  showIcon?: boolean;
  showUpgrade?: boolean;
  className?: string;
}

export function BadgePlan({ 
  plan, 
  showIcon = true, 
  showUpgrade = false, 
  className = "" 
}: BadgePlanProps) {
  const { getRequiredPlan } = useEntitlements();
  const currentPlan = getRequiredPlan('canUseGptTestReal') || 'pilot';
  
  const planConfig = {
    pilot: {
      name: "Free",
      icon: Zap,
      color: "bg-slate-600 text-white",
      borderColor: "border-slate-500",
      iconColor: "text-slate-400"
    },
    pro: {
      name: "Pro",
      icon: Crown,
      color: "bg-amber-600 text-white",
      borderColor: "border-amber-500",
      iconColor: "text-amber-400"
    },
    enterprise: {
      name: "Enterprise",
      icon: Shield,
      color: "bg-purple-600 text-white",
      borderColor: "border-purple-500",
      iconColor: "text-purple-400"
    }
  };

  const config = planConfig[plan];
  const Icon = config.icon;
  const isCurrentPlan = currentPlan === plan;
  const needsUpgrade = showUpgrade && plan !== 'pilot';

  return (
    <Badge 
      className={`
        ${config.color} 
        ${config.borderColor} 
        ${isCurrentPlan ? 'ring-2 ring-opacity-50' : ''}
        ${needsUpgrade ? 'opacity-60' : ''}
        ${className}
        flex items-center gap-1 px-2 py-1 text-xs font-medium
      `}
      variant="outline"
    >
      {showIcon && (
        <Icon className={`w-3 h-3 ${config.iconColor}`} />
      )}
      {config.name}
      {isCurrentPlan && (
        <span className="ml-1 text-xs opacity-75">(current)</span>
      )}
      {needsUpgrade && (
        <Lock className="w-3 h-3 ml-1" />
      )}
    </Badge>
  );
}

interface PlanGateProps {
  requiredPlan: PlanType;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

export function PlanGate({ 
  requiredPlan, 
  children, 
  fallback,
  showUpgradePrompt = true 
}: PlanGateProps) {
  const { hasEntitlement } = useEntitlements();
  
  // Map plan to feature flag for checking
  const featureMap: Record<PlanType, keyof Entitlements> = {
    'pilot': 'canAccessModule',
    'pro': 'canUseGptTestReal',
    'enterprise': 'hasAPI'
  };
  
  const featureFlag = featureMap[requiredPlan];
  const hasAccess = featureFlag ? hasEntitlement(featureFlag) : requiredPlan === 'pilot';
  
  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
        <div className="text-center p-4">
          <Lock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <p className="text-sm text-white font-medium">
            {requiredPlan === 'pro' ? 'Pro' : 'Enterprise'} Plan Required
          </p>
          <BadgePlan plan={requiredPlan} className="mt-2" />
        </div>
      </div>
    </div>
  );
}
