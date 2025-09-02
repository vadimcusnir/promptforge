export interface Entitlement {
  flag: string
  value: boolean | number | string
  source: "plan" | "addon" | "trial"
  expires_at?: string
}

export interface Plan {
  id: string
  name: string
  price_monthly: number
  price_annual: number
  features: string[]
  entitlements: Record<string, boolean | number>
}

export const PLANS: Record<string, Plan> = {
  free: {
    id: "free",
    name: "Free",
    price_monthly: 0,
    price_annual: 0,
    features: ["10 monthly prompts", "Basic exports (.txt, .md)", "Module library (M01, M10, M18)", "Local history"],
    entitlements: {
      canAccessModule: 3, // Only 3 modules
      canExportTxt: true,
      canExportMd: true,
      canExportPdf: false,
      canExportJson: false,
      canExportBundle: false,
      canUseGptTestReal: false,
      hasAPI: false,
      monthlyPrompts: 10,
    },
  },
  creator: {
    id: "creator",
    name: "Creator",
    price_monthly: 19,
    price_annual: 190,
    features: ["All modules (M01-M40)", "Advanced exports (.txt, .md, .pdf)", "Cloud history", "Priority support"],
    entitlements: {
      canAccessModule: 40,
      canExportTxt: true,
      canExportMd: true,
      canExportPdf: true,
      canExportJson: false,
      canExportBundle: false,
      canUseGptTestReal: false,
      hasAPI: false,
      monthlyPrompts: 100,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    price_monthly: 49,
    price_annual: 490,
    features: [
      "All modules (M01-M50)",
      "Live GPT testing",
      "All exports (.txt, .md, .pdf, .json)",
      "Advanced analytics",
      "Team collaboration",
    ],
    entitlements: {
      canAccessModule: 50,
      canExportTxt: true,
      canExportMd: true,
      canExportPdf: true,
      canExportJson: true,
      canExportBundle: false,
      canUseGptTestReal: true,
      hasAPI: false,
      monthlyPrompts: 500,
    },
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price_monthly: 299,
    price_annual: 2990,
    features: [
      "All modules",
      "Full API access",
      "Bundle exports (.zip)",
      "White-label options",
      "Custom integrations",
      "Dedicated support",
    ],
    entitlements: {
      canAccessModule: 50,
      canExportTxt: true,
      canExportMd: true,
      canExportPdf: true,
      canExportJson: true,
      canExportBundle: true,
      canUseGptTestReal: true,
      hasAPI: true,
      monthlyPrompts: -1, // Unlimited
    },
  },
}

export function getEntitlementValue(plan: string, flag: string): boolean | number {
  const planData = PLANS[plan] || PLANS.free
  return planData.entitlements[flag] ?? false
}

export function hasEntitlement(plan: string, flag: string): boolean {
  const value = getEntitlementValue(plan, flag)
  return typeof value === "boolean" ? value : value > 0
}
