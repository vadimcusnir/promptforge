import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        { name: "Modules M01, M10, M18", included: true },
        { name: "Export txt", included: true },
        { name: "Local history", included: true },
        { name: "Community support", included: true },
        { name: "Export md", included: false },
        { name: "Live Test Engine", included: false },
        { name: "Cloud history", included: false },
        { name: "API access", included: false },
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Creator",
      price: "$19",
      period: "month",
      description: "For content creators and solopreneurs",
      features: [
        { name: "All modules", included: true },
        { name: "Export txt, md", included: true },
        { name: "Local history", included: true },
        { name: "Community support", included: true },
        { name: "Export pdf, json", included: false },
        { name: "Live Test Engine", included: false },
        { name: "Cloud history", included: false },
        { name: "API access", included: false },
      ],
      cta: "Start Creator",
      popular: false,
    },
    {
      name: "Pro",
      price: "$49",
      period: "month",
      description: "For professionals and teams",
      features: [
        { name: "All modules", included: true },
        { name: "Export pdf, json", included: true },
        { name: "Live Test Engine", included: true },
        { name: "Cloud history", included: true },
        { name: "Evaluator", included: true },
        { name: "Priority support", included: true },
        { name: "API access", included: false },
        { name: "White-label", included: false },
      ],
      cta: "Start Pro Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$299",
      period: "month",
      description: "For organizations at scale",
      features: [
        { name: "Everything in Pro", included: true },
        { name: "API access", included: true },
        { name: "Bundle.zip exports", included: true },
        { name: "White-label options", included: true },
        { name: "5 seats included", included: true },
        { name: "Custom integrations", included: true },
        { name: "Dedicated support", included: true },
        { name: "SLA guarantee", included: true },
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen pattern-bg text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-serif mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-400 mb-8">Scale from pilot to enterprise with clear upgrade paths</p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-gray-400">Monthly</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" />
              <div className="w-12 h-6 bg-gray-700 rounded-full cursor-pointer"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
            </div>
            <span className="text-white">Annual</span>
            <Badge className="bg-yellow-600 text-black">Save 20%</Badge>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`glass-card relative ${plan.popular ? "border-yellow-400 scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-yellow-600 text-black">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="font-serif text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-gray-400">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold font-serif">{plan.price}</span>
                  <span className="text-gray-400">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? "text-white" : "text-gray-500"}`}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-yellow-600 hover:bg-yellow-700 text-black"
                      : "bg-transparent border border-gray-700 hover:border-yellow-400"
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold font-serif mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="glass-card text-left">
              <CardHeader>
                <CardTitle className="font-serif text-lg">What's included in the free plan?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  The free plan includes access to 3 core modules (M01, M10, M18), basic text exports, and local history
                  storage. Perfect for trying out the platform.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card text-left">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Can I upgrade or downgrade anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take
                  effect at the next billing cycle.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card text-left">
              <CardHeader>
                <CardTitle className="font-serif text-lg">
                  What's the difference between simulated and live testing?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Simulated testing uses our internal algorithms to score prompts. Live testing uses actual GPT models
                  for more accurate evaluation (Pro+ only).
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card text-left">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Do you offer enterprise discounts?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Yes, we offer volume discounts for teams of 10+ users and custom pricing for large organizations.
                  Contact our sales team for details.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
