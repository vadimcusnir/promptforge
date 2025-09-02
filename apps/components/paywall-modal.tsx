"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Crown, Zap, Building } from "lucide-react"
import { PLANS } from "@/lib/entitlements"

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
  feature: string
  requiredPlan: string
  onUpgrade: (plan: string) => void
}

export function PaywallModal({ isOpen, onClose, feature, requiredPlan, onUpgrade }: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(requiredPlan)
  const plan = PLANS[selectedPlan]

  const planIcons = {
    creator: Crown,
    pro: Zap,
    enterprise: Building,
  }

  const Icon = planIcons[selectedPlan as keyof typeof planIcons] || Crown

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-black/95 border border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gold-400 flex items-center justify-center gap-2">
            <Icon className="w-6 h-6" />
            Upgrade Required
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-300 mb-2">
              <span className="font-semibold text-gold-400">{feature}</span> requires a {plan.name} plan
            </p>
            <p className="text-sm text-gray-400">Unlock this feature and more with an upgrade</p>
          </div>

          <Card className="bg-gray-900/50 border-gold-400/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg text-gold-400 flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  {plan.name}
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">${plan.price_monthly}</div>
                  <div className="text-sm text-gray-400">per month</div>
                </div>
              </div>

              <ul className="space-y-2">
                {plan.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              Maybe Later
            </Button>
            <Button
              onClick={() => onUpgrade(selectedPlan)}
              className="flex-1 bg-gold-400 hover:bg-gold-500 text-black font-semibold"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
