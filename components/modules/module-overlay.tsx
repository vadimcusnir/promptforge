"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { useAnalytics } from '@/hooks/use-analytics'
import { useStripeCheckout } from '@/hooks/use-stripe-checkout'
import { EntitlementGate } from '@/components/entitlement-gate'
import { 
  Zap, 
  Target, 
  Brain, 
  BarChart3, 
  Shield, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  Clock,
  Award,
  Sparkles
} from 'lucide-react'

interface ModuleDefinition {
  id: string
  name: string
  description: string
  category: string
  vector: string
  complexity: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  useCases: string[]
  features: string[]
  requirements: string[]
  examples: string[]
  pricing: {
    free: boolean
    creator: boolean
    pro: boolean
    enterprise: boolean
  }
  stats: {
    usageCount: number
    avgScore: number
    successRate: number
  }
}

interface ModuleOverlayProps {
  module: ModuleDefinition
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  trigger?: React.ReactNode
}

export function ModuleOverlay({ 
  module, 
  isOpen, 
  onOpenChange, 
  trigger 
}: ModuleOverlayProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'creator' | 'pro' | 'enterprise'>('free')
  const { toast } = useToast()
  const analytics = useAnalytics()
  const { createCheckoutSession, isLoading } = useStripeCheckout()

  useEffect(() => {
    if (isOpen) {
      analytics.moduleView(module.id, module.name)
    }
  }, [isOpen, module.id, module.name, analytics])

  const handleUpgrade = async (plan: string) => {
    try {
      analytics.planSelected(plan, plan as any, false)
      
      const priceId = getPriceId(plan)
      if (priceId) {
        await createCheckoutSession({
          planId: priceId,
          isAnnual: false,
          userId: undefined
        })
      } else {
        throw new Error('Price ID not found for plan')
      }
    } catch (error) {
      console.error('Upgrade error:', error)
      toast({
        title: "Upgrade failed",
        description: "Please try again or contact support",
        variant: "destructive"
      })
    }
  }

  const getPriceId = (plan: string) => {
    const priceIds = {
      creator: process.env.NEXT_PUBLIC_STRIPE_CREATOR_PRICE_ID,
      pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
      enterprise: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID
    }
    return priceIds[plan as keyof typeof priceIds] || priceIds.pro
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getVectorIcon = (vector: string) => {
    switch (vector.toLowerCase()) {
      case 'strategic': return <Target className="w-4 h-4" />
      case 'rhetoric': return <Brain className="w-4 h-4" />
      case 'analytics': return <BarChart3 className="w-4 h-4" />
      case 'content': return <Sparkles className="w-4 h-4" />
      case 'branding': return <Star className="w-4 h-4" />
      case 'crisis': return <Shield className="w-4 h-4" />
      default: return <Zap className="w-4 h-4" />
    }
  }

  const getPlanFeatures = (plan: string) => {
    const allFeatures = [
      'Access to module',
      'Basic prompt generation',
      'Standard scoring',
      'Export to TXT',
      'Community support'
    ]

    const planFeatures = {
      free: allFeatures.slice(0, 3),
      creator: [...allFeatures.slice(0, 4), 'Advanced scoring', 'Export to MD', 'Priority support'],
      pro: [...allFeatures.slice(0, 4), 'Advanced scoring', 'Export to MD', 'Export to PDF', 'Export to JSON', 'Real GPT testing', 'Priority support'],
      enterprise: [...allFeatures.slice(0, 4), 'Advanced scoring', 'Export to MD', 'Export to PDF', 'Export to JSON', 'Export to ZIP', 'Real GPT testing', 'API access', 'Dedicated support', 'Custom integrations']
    }

    return planFeatures[plan as keyof typeof planFeatures] || planFeatures.free
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  {getVectorIcon(module.vector)}
                  {module.vector}
                </Badge>
                <Badge className={getComplexityColor(module.complexity)}>
                  {module.complexity}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {module.estimatedTime}
                </Badge>
              </div>
              
              <DialogTitle className="text-2xl font-bold text-left">
                {module.name}
              </DialogTitle>
              
              <DialogDescription className="text-left text-base">
                {module.description}
              </DialogDescription>
            </div>

            {/* Module Stats */}
            <div className="flex-shrink-0 text-right">
              <div className="space-y-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {module.stats.usageCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Uses</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">
                    {module.stats.avgScore}
                  </div>
                  <div className="text-xs text-gray-500">Avg Score</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">
                    {module.stats.successRate}%
                  </div>
                  <div className="text-xs text-gray-500">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Use Cases */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Use Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {module.useCases.map((useCase, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{useCase}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {module.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Success Rate</span>
                    <span>{module.stats.successRate}%</span>
                  </div>
                  <Progress value={module.stats.successRate} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Average Score</span>
                    <span>{module.stats.avgScore}/100</span>
                  </div>
                  <Progress value={module.stats.avgScore} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Usage Volume</span>
                    <span>{module.stats.usageCount.toLocaleString()}</span>
                  </div>
                  <Progress value={Math.min(module.stats.usageCount / 1000, 100)} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {module.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                      <Star className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-600" />
                  Example Outputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {module.examples.map((example, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-indigo-500">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Example {index + 1}
                      </div>
                      <div className="text-sm font-mono bg-white dark:bg-gray-900 p-3 rounded border">
                        {example}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            {/* Plan Selection */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(['free', 'creator', 'pro', 'enterprise'] as const).map((plan) => (
                <Card 
                  key={plan}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    selectedPlan === plan ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-lg capitalize">{plan}</CardTitle>
                    <div className="text-3xl font-bold">
                      {plan === 'free' ? '$0' : 
                       plan === 'creator' ? '$19' :
                       plan === 'pro' ? '$49' : '$299'}
                    </div>
                    <div className="text-sm text-gray-500">per month</div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {getPlanFeatures(plan).slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {getPlanFeatures(plan).length > 4 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{getPlanFeatures(plan).length - 4} more features
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Plan Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getPlanFeatures(selectedPlan).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Upgrade CTA */}
                {selectedPlan !== 'free' && (
                  <div className="mt-6 text-center">
                    <Button
                      onClick={() => handleUpgrade(selectedPlan)}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>Upgrade to {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      )}
                    </Button>
                    
                    <div className="mt-3 text-sm text-gray-500">
                      ✓ 30-day money-back guarantee
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
