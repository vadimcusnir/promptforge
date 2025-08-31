import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Check, 
  X, 
  Zap, 
  Crown, 
  Building2, 
  Star,
  ArrowRight,
  Shield,
  Clock,
  Users,
  Download,
  Code,
  FileText,
  BarChart3,
  Headphones,
  Globe,
  Lock,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  Rocket,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  CreditCard,
  Calendar,
  Infinity
} from 'lucide-react'

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState(null)

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started',
      price: { monthly: 0, annual: 0 },
      badge: null,
      features: [
        { name: 'Basic access to core modules', included: true },
        { name: 'Export .txt only', included: true },
        { name: '3 core modules (M01, M10, M18)', included: true },
        { name: 'Community support', included: true },
        { name: 'Basic 7D parameter engine', included: true },
        { name: 'Quality scoring', included: true },
        { name: 'Export .md and .json', included: false },
        { name: 'Advanced modules', included: false },
        { name: 'Test Engine Live', included: false },
        { name: 'PDF exports', included: false },
        { name: 'Cloud history', included: false },
        { name: 'Priority support', included: false }
      ],
      limits: {
        modules: '3 core modules',
        exports: '10 per month',
        history: 'Local only',
        support: 'Community'
      },
      cta: 'Start Free',
      popular: false
    },
    {
      id: 'creator',
      name: 'Creator',
      description: 'Enhanced capabilities for creators',
      price: { monthly: 29, annual: 290 },
      badge: 'Most Popular',
      features: [
        { name: 'All 50+ industrial modules', included: true },
        { name: 'Export .txt and .md', included: true },
        { name: 'Advanced 7D parameter engine', included: true },
        { name: 'Quality scoring & guardrails', included: true },
        { name: 'Generation history (30 days)', included: true },
        { name: 'Email support', included: true },
        { name: 'Custom parameter presets', included: true },
        { name: 'Module favorites', included: true },
        { name: 'Export .json and .pdf', included: false },
        { name: 'Test Engine Live', included: false },
        { name: 'Cloud sync', included: false },
        { name: 'API access', included: false }
      ],
      limits: {
        modules: 'All 50+ modules',
        exports: '500 per month',
        history: '30 days',
        support: 'Email'
      },
      cta: 'Start Creator',
      popular: true
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Advanced features for professionals',
      price: { monthly: 79, annual: 790 },
      badge: 'Best Value',
      features: [
        { name: 'Everything in Creator', included: true },
        { name: 'Export .txt, .md, .pdf, .json', included: true },
        { name: 'Test Engine Live (AI Score ≥ 80)', included: true },
        { name: 'Cloud history & sync', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Priority support', included: true },
        { name: 'Custom branding', included: true },
        { name: 'Team collaboration (5 seats)', included: true },
        { name: 'API access (1000 calls/month)', included: true },
        { name: 'White-label exports', included: false },
        { name: 'Enterprise SSO', included: false },
        { name: 'Dedicated support', included: false }
      ],
      limits: {
        modules: 'All modules + Pro features',
        exports: 'Unlimited',
        history: 'Unlimited cloud',
        support: 'Priority'
      },
      cta: 'Start Pro',
      popular: false
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Full enterprise-grade features',
      price: { monthly: 299, annual: 2990 },
      badge: 'Enterprise',
      features: [
        { name: 'Everything in Pro', included: true },
        { name: 'Export all formats + .zip bundles', included: true },
        { name: 'Full API access (unlimited)', included: true },
        { name: 'White-label platform', included: true },
        { name: 'Enterprise SSO & SAML', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'Custom integrations', included: true },
        { name: 'Unlimited team seats', included: true },
        { name: 'SLA guarantee (99.9%)', included: true },
        { name: 'On-premise deployment', included: true },
        { name: 'Custom modules development', included: true },
        { name: '24/7 phone support', included: true }
      ],
      limits: {
        modules: 'All + Custom modules',
        exports: 'Unlimited',
        history: 'Unlimited + audit trail',
        support: 'Dedicated + 24/7'
      },
      cta: 'Contact Sales',
      popular: false
    }
  ]

  const faqs = [
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes, upgrades and downgrades take effect immediately. When upgrading, you\'ll be charged the prorated amount for the remainder of your billing cycle. When downgrading, you\'ll receive account credit for the next billing cycle.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover) via Stripe. All payments are secure and encrypted. Enterprise customers can also pay via wire transfer or ACH.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! The Free plan includes basic features forever. Paid plans include a 14-day free trial with full access to all features. No credit card required for the free plan.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Absolutely. You can cancel your subscription at any time from your account settings. You\'ll keep access to paid features until the end of your current billing cycle. No cancellation fees.'
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'Your generated prompts and history remain accessible for 90 days after cancellation. You can export all your data at any time. After 90 days, data is permanently deleted for security.'
    },
    {
      question: 'Do you offer discounts for students or nonprofits?',
      answer: 'Yes! We offer 50% discounts for verified students and qualifying nonprofit organizations. Contact our support team with your credentials for approval.'
    }
  ]

  const getPrice = (plan) => {
    return isAnnual ? plan.price.annual : plan.price.monthly
  }

  const getSavings = (plan) => {
    if (plan.price.monthly === 0) return 0
    const annualMonthly = plan.price.annual / 12
    const savings = ((plan.price.monthly - annualMonthly) / plan.price.monthly) * 100
    return Math.round(savings)
  }

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 to-background">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient-primary">Choose Your Plan</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Unlock the full power of prompt engineering with flexible plans. Start free, scale as you grow.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-12">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-primary' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-primary"
              />
              <span className={`text-sm font-medium ${isAnnual ? 'text-primary' : 'text-muted-foreground'}`}>
                Annual
              </span>
              <Badge className="badge-primary ml-2">Save up to 17%</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`card-industrial relative ${
                  plan.popular ? 'ring-2 ring-primary scale-105 lg:scale-110' : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className={`${
                      plan.popular ? 'badge-primary' : 'badge-secondary'
                    } px-4 py-1`}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-4">
                      {plan.id === 'free' && <Zap className="w-8 h-8 text-primary" />}
                      {plan.id === 'creator' && <Star className="w-8 h-8 text-primary" />}
                      {plan.id === 'pro' && <Crown className="w-8 h-8 text-primary" />}
                      {plan.id === 'enterprise' && <Building2 className="w-8 h-8 text-primary" />}
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold">
                          ${getPrice(plan)}
                        </span>
                        {plan.price.monthly > 0 && (
                          <span className="text-muted-foreground ml-2">
                            /{isAnnual ? 'year' : 'month'}
                          </span>
                        )}
                      </div>
                      
                      {isAnnual && plan.price.monthly > 0 && (
                        <div className="text-sm text-muted-foreground mt-2">
                          ${Math.round(plan.price.annual / 12)}/month billed annually
                          <Badge variant="outline" className="ml-2 text-green-400 border-green-400">
                            Save {getSavings(plan)}%
                          </Badge>
                        </div>
                      )}
                    </div>

                    <Button 
                      className={`w-full ${
                        plan.popular ? 'btn-primary' : 'btn-outline'
                      }`}
                      size="lg"
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                      What's included
                    </h4>
                    
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          )}
                          <span className={`text-sm ${
                            feature.included ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Plan Limits */}
                    <div className="pt-6 border-t border-border">
                      <h5 className="font-medium text-sm mb-3">Plan Limits</h5>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Modules:</span>
                          <span className="font-medium">{plan.limits.modules}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Exports:</span>
                          <span className="font-medium">{plan.limits.exports}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>History:</span>
                          <span className="font-medium">{plan.limits.history}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Support:</span>
                          <span className="font-medium">{plan.limits.support}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="card-industrial">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/20 transition-colors"
                >
                  <h3 className="font-semibold pr-4">{faq.question}</h3>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                
                {expandedFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to <span className="text-gradient-primary">Forge Your Prompts</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of professionals using PromptForge to create industrial-grade prompts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-primary" size="lg">
              <Rocket className="w-4 h-4 mr-2" />
              Start Free Today
            </Button>
            <Link to="/generator">
              <Button className="btn-outline" size="lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Try Generator
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • 14-day free trial on paid plans • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  )
}

export default PricingPage

