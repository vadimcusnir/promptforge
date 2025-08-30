import React from "react";

export function PremiumGate({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export const PREMIUM_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
} as const;