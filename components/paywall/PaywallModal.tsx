"use client";
import { X, Zap, Building } from "lucide-react";
import { PREMIUM_TIERS } from "@/lib/premium-features";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: string;
}

export function PaywallModal({ isOpen, onClose, trigger }: PaywallModalProps) {
  if (!isOpen) return null;

  const getTriggerMessage = (trigger: string) => {
    switch (trigger) {
      case "test":
        return "Real test scoring requires Pro plan. Get detailed analysis and optimization recommendations.";
      case "export-json":
        return "JSON export with metadata requires Pro plan. Export structured data for integrations.";
      case "export-pdf":
        return "PDF reports require Pro plan. Generate professional documentation.";
      case "export-zip":
        return "Bundle exports require Enterprise plan. Get complete packages with assets.";
      default:
        return "This feature requires a premium plan. Upgrade to unlock advanced capabilities.";
    }
  };

  const getRecommendedPlan = (trigger: string) => {
    if (trigger.includes("zip") || trigger.includes("enterprise")) {
      return PREMIUM_TIERS[2]; // Enterprise
    }
    return PREMIUM_TIERS[1]; // Pro
  };

  const recommendedPlan = getRecommendedPlan(trigger);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-secondary border border-lead-gray/30 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-sans">
              Upgrade Required
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-lead-gray/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-gold-industrial/10 border border-gold-industrial/20 rounded-lg">
            <p className="text-gold-industrial">{getTriggerMessage(trigger)}</p>
          </div>

          <div className="grid gap-4">
            {PREMIUM_TIERS.slice(1).map((tier) => (
              <div
                key={tier.id}
                className={`p-6 rounded-lg border transition-all ${
                  tier.id === recommendedPlan.id
                    ? "border-gold-industrial bg-gold-industrial/5"
                    : "border-lead-gray/30 bg-black/20"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {tier.id === "pro" ? (
                      <Zap className="w-6 h-6 text-gold-industrial" />
                    ) : (
                      <Building className="w-6 h-6 text-gold-industrial" />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold">{tier.name}</h3>
                      <p className="text-lead-gray">${tier.price}/month</p>
                    </div>
                  </div>
                  {tier.id === recommendedPlan.id && (
                    <div className="px-3 py-1 bg-gold-industrial text-black text-sm font-medium rounded-full">
                      Recommended
                    </div>
                  )}
                </div>

                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-gold-industrial rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-lg font-medium transition-all ${
                    tier.id === recommendedPlan.id
                      ? "bg-gold-industrial text-black hover:bg-gold-industrial/90"
                      : "bg-lead-gray/20 text-white hover:bg-lead-gray/30"
                  }`}
                >
                  Choose {tier.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
