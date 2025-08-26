"use client";

import { ArrowUp, Shield, Crown, Zap, Users, CheckCircle } from "lucide-react";

export function EntitlementsSection() {
  const plans = [
    {
      name: "Free",
      price: "$0/month",
      description: "Perfect for getting started with PromptForge",
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/10"
    },
    {
      name: "Creator",
      price: "$19/month",
      description: "For content creators and individual professionals",
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/10"
    },
    {
      name: "Pro",
      price: "$49/month",
      description: "For teams and growing businesses",
      color: "text-[#d1a954]",
      borderColor: "border-[#d1a954]/30",
      bgColor: "bg-[#d1a954]/10"
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with custom needs",
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/10"
    }
  ];

  const features = [
    {
      name: "Module Access",
      free: "10 modules",
      creator: "25 modules",
      pro: "50 modules",
      enterprise: "50 modules + custom"
    },
    {
      name: "Test Modes",
      free: "Simulated only",
      creator: "Simulated only",
      pro: "Simulated + Live GPT",
      enterprise: "Simulated + Live GPT + Advanced"
    },
    {
      name: "Export Formats",
      free: ".txt, .md",
      creator: ".txt, .md",
      pro: ".txt, .md, .json, .pdf",
      enterprise: "All formats + .zip bundles"
    },
    {
      name: "API Access",
      free: "None",
      creator: "None",
      pro: "Read-only API",
      enterprise: "Full API + webhooks"
    },
    {
      name: "Rate Limits",
      free: "100/month",
      creator: "500/month",
      pro: "2,000/month",
      enterprise: "Unlimited"
    },
    {
      name: "Team Members",
      free: "1",
      creator: "1",
      pro: "5",
      enterprise: "Unlimited"
    },
    {
      name: "Priority Support",
      free: "Community",
      creator: "Email",
      pro: "Email + Chat",
      enterprise: "Dedicated manager"
    }
  ];

  return (
    <section id="entitlements" className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          <span className="text-[#d1a954]">Entitlements</span> & Plan Capabilities
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Understand how plan levels unlock different capabilities: from basic module access to 
          enterprise-grade features and unlimited API usage
        </p>
      </div>

      {/* Plan Overview */}
      <div className="bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#d1a954] rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-black" />
          </div>
          Plan Structure
        </h2>
        
        <div className="space-y-4 text-white/90 leading-relaxed">
          <p>
            PromptForge™ v3 uses a tiered entitlement system that scales with your needs. 
            Each plan level provides access to specific features, modules, and capabilities 
            while maintaining the core quality standards (score ≥80) across all tiers.
          </p>
          
          <p>
            Entitlements are managed centrally and cannot be modified via the UI. Changes 
            come from the plan management system (e.g., Stripe webhooks) to ensure security 
            and consistency.
          </p>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className={`bg-[#0e0e0e] border ${plan.borderColor} rounded-xl p-6 ${plan.bgColor}`}>
            <div className="text-center space-y-3">
              <h3 className={`text-xl font-bold ${plan.color}`}>{plan.name}</h3>
              <div className="text-2xl font-bold text-white">{plan.price}</div>
              <p className="text-white/70 text-sm">{plan.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Feature Comparison</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#5a5a5a]/30">
                <th className="text-left p-3 text-white/80 font-medium">Feature</th>
                <th className="text-center p-3 text-green-400 font-medium">Free</th>
                <th className="text-center p-3 text-blue-400 font-medium">Creator</th>
                <th className="text-center p-3 text-[#d1a954] font-medium">Pro</th>
                <th className="text-center p-3 text-purple-400 font-medium">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={feature.name} className={`border-b border-[#5a5a5a]/20 ${index % 2 === 0 ? 'bg-[#1a1a1a]/30' : ''}`}>
                  <td className="p-3 text-white font-medium">{feature.name}</td>
                  <td className="p-3 text-center text-white/80 text-sm">{feature.free}</td>
                  <td className="p-3 text-center text-white/80 text-sm">{feature.creator}</td>
                  <td className="p-3 text-center text-white/80 text-sm">{feature.pro}</td>
                  <td className="p-3 text-center text-white/80 text-sm">{feature.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Capabilities by Plan */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Key Capabilities by Plan</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className="bg-[#0e0e0e] border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-xl font-bold text-green-400">Free Plan</h3>
            </div>
            
            <div className="space-y-3 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Access to 10 core modules</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Simulated testing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Basic export formats</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Community support</span>
              </div>
            </div>
          </div>

          {/* Creator Plan */}
          <div className="bg-[#0e0e0e] border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-xl font-bold text-blue-400">Creator Plan</h3>
            </div>
            
            <div className="space-y-3 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span>Access to 25 modules</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span>Enhanced testing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span>Higher rate limits</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span>Email support</span>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-[#0e0e0e] border border-[#d1a954]/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#d1a954] rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-xl font-bold text-[#d1a954]">Pro Plan</h3>
            </div>
            
            <div className="space-y-3 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#d1a954]" />
                <span>Access to all 50 modules</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#d1a954]" />
                <span>Live GPT testing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#d1a954]" />
                <span>Advanced export formats</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#d1a954]" />
                <span>Team collaboration</span>
              </div>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-[#0e0e0e] border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-xl font-bold text-purple-400">Enterprise Plan</h3>
            </div>
            
            <div className="space-y-3 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                <span>Custom modules & features</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                <span>Full API access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                <span>Unlimited usage</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                <span>Dedicated support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Entitlement Management */}
      <div className="bg-[#0e0e0e] border border-[#5a5a5a]/30 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6">Entitlement Management</h2>
        
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-white text-lg">Centralized Control</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#d1a954] rounded-full mt-2" />
                  <div>
                    <p className="text-white/90 text-sm font-medium">Plan Management System</p>
                    <p className="text-white/60 text-xs">Entitlements managed via Stripe webhooks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#d1a954] rounded-full mt-2" />
                  <div>
                    <p className="text-white/90 text-sm font-medium">No UI Modification</p>
                    <p className="text-white/60 text-xs">Users cannot change their own entitlements</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#d1a954] rounded-full mt-2" />
                  <div>
                    <p className="text-white/90 text-sm font-medium">Automatic Updates</p>
                    <p className="text-white/60 text-xs">Changes reflect immediately across the system</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white text-lg">Security Features</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#d1a954] rounded-full mt-2" />
                  <div>
                    <p className="text-white/90 text-sm font-medium">API Validation</p>
                    <p className="text-white/60 text-xs">All endpoints check entitlements before proceeding</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#d1a954] rounded-full mt-2" />
                  <div>
                    <p className="text-white/90 text-sm font-medium">403 Responses</p>
                    <p className="text-white/60 text-xs">Unauthorized requests return "ENTITLEMENT_REQUIRED"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#d1a954] rounded-full mt-2" />
                  <div>
                    <p className="text-white/90 text-sm font-medium">Audit Logging</p>
                    <p className="text-white/60 text-xs">All entitlement checks are logged for security</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <div className="text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#d1a954]/20 border border-[#d1a954]/40 text-[#d1a954] rounded-lg hover:bg-[#d1a954]/30 transition-colors duration-200"
        >
          <ArrowUp className="w-4 h-4" />
          Back to Top
        </button>
      </div>
    </section>
  );
}
