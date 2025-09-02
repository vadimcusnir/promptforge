"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Zap, Users, FileText, TrendingUp, Lock } from "lucide-react"
import { UpgradeFlowManager, type ConversionTrigger, type UserStats, getUpgradeUrl } from "@/lib/upgrade-flow"

interface ConversionTriggersProps {
  userStats: UserStats
  onDismiss?: (triggerId: string) => void
}

export default function ConversionTriggers({ userStats, onDismiss }: ConversionTriggersProps) {
  const [upgradeManager] = useState(() => new UpgradeFlowManager(userStats))
  const [activeTrigger, setActiveTrigger] = useState<ConversionTrigger | null>(null)
  const [dismissed, setDismissed] = useState<string[]>([])

  useEffect(() => {
    const trigger = upgradeManager.getTopTrigger()
    if (trigger && !dismissed.includes(trigger.id)) {
      setActiveTrigger(trigger)
      upgradeManager.trackConversionEvent(trigger.id, "shown")
    }
  }, [upgradeManager, dismissed])

  const handleUpgradeClick = (trigger: ConversionTrigger) => {
    upgradeManager.trackConversionEvent(trigger.id, "clicked")
    const upgradeUrl = getUpgradeUrl(trigger.targetPlan, trigger.id)
    window.location.href = upgradeUrl
  }

  const handleDismiss = (trigger: ConversionTrigger) => {
    upgradeManager.trackConversionEvent(trigger.id, "dismissed")
    setDismissed((prev) => [...prev, trigger.id])
    setActiveTrigger(null)
    onDismiss?.(trigger.id)
  }

  const getIcon = (triggerId: string) => {
    switch (triggerId) {
      case "usage_limit":
        return <TrendingUp className="w-5 h-5" />
      case "locked_feature":
        return <Lock className="w-5 h-5" />
      case "power_user":
        return <Zap className="w-5 h-5" />
      case "collaboration":
        return <Users className="w-5 h-5" />
      case "professional_use":
        return <FileText className="w-5 h-5" />
      default:
        return <Zap className="w-5 h-5" />
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-900 text-red-300"
      case "medium":
        return "bg-yellow-900 text-yellow-300"
      case "low":
        return "bg-blue-900 text-blue-300"
      default:
        return "bg-gray-900 text-gray-300"
    }
  }

  if (!activeTrigger) return null

  return (
    <Card className="glass-card border-yellow-400/50 bg-gradient-to-r from-yellow-900/20 to-orange-900/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-yellow-400">{getIcon(activeTrigger.id)}</div>
            <div>
              <CardTitle className="text-lg font-serif text-yellow-400">Upgrade Opportunity</CardTitle>
              <Badge className={`text-xs ${getUrgencyColor(activeTrigger.urgency)}`}>
                {activeTrigger.urgency.toUpperCase()} PRIORITY
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDismiss(activeTrigger)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-300 mb-4 text-base">{activeTrigger.message}</CardDescription>
        <div className="flex gap-3">
          <Button
            onClick={() => handleUpgradeClick(activeTrigger)}
            className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
          >
            {activeTrigger.cta}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDismiss(activeTrigger)}
            className="border-gray-600 text-gray-300 hover:text-white"
          >
            Maybe Later
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Hook for tracking user behavior and triggering upgrades
export function useConversionTracking() {
  const [userStats, setUserStats] = useState<UserStats>({
    promptsUsed: 0,
    lockedFeatureAttempts: 0,
    sessionPrompts: 0,
    hasSharedPrompt: false,
    hasExportedPrompt: false,
    daysActive: 1,
    planType: "free",
  })

  const trackPromptUsage = () => {
    setUserStats((prev) => ({
      ...prev,
      promptsUsed: prev.promptsUsed + 1,
      sessionPrompts: prev.sessionPrompts + 1,
    }))
  }

  const trackLockedFeatureAttempt = () => {
    setUserStats((prev) => ({
      ...prev,
      lockedFeatureAttempts: prev.lockedFeatureAttempts + 1,
    }))
  }

  const trackShare = () => {
    setUserStats((prev) => ({
      ...prev,
      hasSharedPrompt: true,
    }))
  }

  const trackExport = () => {
    setUserStats((prev) => ({
      ...prev,
      hasExportedPrompt: true,
    }))
  }

  return {
    userStats,
    trackPromptUsage,
    trackLockedFeatureAttempt,
    trackShare,
    trackExport,
  }
}
