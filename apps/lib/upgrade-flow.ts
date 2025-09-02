// Upgrade Flow Logic for PromptForge
// Handles user journey from free starter to IDE with conversion triggers

export interface ConversionTrigger {
  id: string
  name: string
  condition: (userStats: UserStats) => boolean
  message: string
  urgency: "low" | "medium" | "high"
  cta: string
  targetPlan: "creator" | "pro" | "enterprise"
}

export interface UserStats {
  promptsUsed: number
  lockedFeatureAttempts: number
  sessionPrompts: number
  hasSharedPrompt: boolean
  hasExportedPrompt: boolean
  daysActive: number
  planType: "free" | "creator" | "pro" | "enterprise"
}

export const conversionTriggers: ConversionTrigger[] = [
  {
    id: "usage_limit",
    name: "Usage Limit Approaching",
    condition: (stats) => stats.promptsUsed >= 40 && stats.planType === "free",
    message: "You've used 40+ prompts this month. Upgrade to unlimited + AI optimization.",
    urgency: "high",
    cta: "Upgrade to Creator",
    targetPlan: "creator",
  },
  {
    id: "locked_feature",
    name: "Locked Feature Interest",
    condition: (stats) => stats.lockedFeatureAttempts >= 3,
    message: "Users like you get 40% better results with advanced features.",
    urgency: "medium",
    cta: "Try IDE Free for 7 Days",
    targetPlan: "pro",
  },
  {
    id: "power_user",
    name: "Power User Behavior",
    condition: (stats) => stats.sessionPrompts >= 5,
    message: "You're creating multiple prompts. Unlock batch processing and templates.",
    urgency: "medium",
    cta: "Upgrade to Pro",
    targetPlan: "pro",
  },
  {
    id: "collaboration",
    name: "Team Collaboration Need",
    condition: (stats) => stats.hasSharedPrompt,
    message: "Share prompts with your team and track performance together.",
    urgency: "low",
    cta: "Enable Team Features",
    targetPlan: "pro",
  },
  {
    id: "professional_use",
    name: "Professional Use Case",
    condition: (stats) => stats.hasExportedPrompt,
    message: "Export to PDF, get checksums, and maintain audit trails.",
    urgency: "medium",
    cta: "Upgrade for Professional Tools",
    targetPlan: "pro",
  },
]

export class UpgradeFlowManager {
  private userStats: UserStats

  constructor(userStats: UserStats) {
    this.userStats = userStats
  }

  getActiveTriggersForUser(): ConversionTrigger[] {
    return conversionTriggers
      .filter((trigger) => trigger.condition(this.userStats))
      .sort((a, b) => {
        const urgencyOrder = { high: 3, medium: 2, low: 1 }
        return urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
      })
  }

  shouldShowUpgradePrompt(): boolean {
    return this.getActiveTriggersForUser().length > 0
  }

  getTopTrigger(): ConversionTrigger | null {
    const triggers = this.getActiveTriggersForUser()
    return triggers.length > 0 ? triggers[0] : null
  }

  trackConversionEvent(triggerId: string, action: "shown" | "clicked" | "dismissed") {
    // Track conversion funnel events
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion_trigger", {
        trigger_id: triggerId,
        action: action,
        user_plan: this.userStats.planType,
      })
    }
  }
}

export const upgradeMessages = {
  welcome: {
    starter: "Welcome to Forge Starter! Create your first professional prompt.",
    creator: "Welcome to Creator! You now have access to all 50 modules.",
    pro: "Welcome to Pro! AI optimization and live testing are now enabled.",
    enterprise: "Welcome to Enterprise! Full API access and team features activated.",
  },
  valueReinforcement: {
    weekly: (improvement: number) => `Your prompts improved by ${improvement}% this week`,
    monthly: (timeSaved: number, improvement: number) =>
      `Time saved: ${timeSaved} hours, Results improved: ${improvement}%`,
    quarterly: (roi: number) => `ROI report: ${roi}x return on your investment`,
  },
}

export function getUpgradeUrl(targetPlan: string, source: string): string {
  const baseUrl = "/pricing"
  const params = new URLSearchParams({
    plan: targetPlan,
    source: source,
  })
  return `${baseUrl}?${params.toString()}`
}
