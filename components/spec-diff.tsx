"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEntitlements } from '@/hooks/use-entitlements'
import { EntitlementGate } from './entitlement-gate'
import { CheckCircle, XCircle, AlertTriangle, Info, Zap, Lock } from 'lucide-react'

interface SpecRequirement {
  id: string
  name: string
  description: string
  category: 'required' | 'recommended' | 'optional'
  status: 'met' | 'partial' | 'missing'
  details?: string
  impact: 'high' | 'medium' | 'low'
}

interface SpecDiffProps {
  content: {
    text: string;
    metadata?: Record<string, unknown>;
    version?: string;
    timestamp?: string;
  }
  orgId?: string
  className?: string
}

// Mock SPEC requirements - in real app this would come from API
const specRequirements: SpecRequirement[] = [
  {
    id: 'domain-specificity',
    name: 'Domain Specificity',
    description: 'Content should be specific to the target domain',
    category: 'required',
    status: 'met',
    details: 'Content shows strong domain knowledge',
    impact: 'high'
  },
  {
    id: 'actionable-steps',
    name: 'Actionable Steps',
    description: 'Include clear, actionable steps',
    category: 'required',
    status: 'partial',
    details: 'Some steps are vague or unclear',
    impact: 'high'
  },
  {
    id: 'resource-allocation',
    name: 'Resource Allocation',
    description: 'Specify required resources and timelines',
    category: 'recommended',
    status: 'missing',
    details: 'No resource allocation information provided',
    impact: 'medium'
  },
  {
    id: 'risk-assessment',
    name: 'Risk Assessment',
    description: 'Identify potential risks and mitigation strategies',
    category: 'optional',
    status: 'missing',
    details: 'Risk assessment not included',
    impact: 'low'
  },
  {
    id: 'success-metrics',
    name: 'Success Metrics',
    description: 'Define measurable success criteria',
    category: 'recommended',
    status: 'partial',
    details: 'Some metrics defined but not comprehensive',
    impact: 'medium'
  }
]

export function SpecDiff({ content, orgId, className = '' }: SpecDiffProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const { hasEntitlement } = useEntitlements(orgId)

  const categories = useMemo(() => {
    const cats = ['all', ...new Set(specRequirements.map(r => r.category))]
    return cats.map(cat => ({
      id: cat,
      name: cat === 'all' ? 'All Requirements' : cat.charAt(0).toUpperCase() + cat.slice(1),
      count: cat === 'all' ? specRequirements.length : specRequirements.filter(r => r.category === cat).length
    }))
  }, [])

  const filteredRequirements = useMemo(() => {
    if (selectedCategory === 'all') return specRequirements
    return specRequirements.filter(r => r.category === selectedCategory)
  }, [selectedCategory])

  const complianceScore = useMemo(() => {
    const total = specRequirements.length
    const met = specRequirements.filter(r => r.status === 'met').length
    const partial = specRequirements.filter(r => r.status === 'partial').length
    
    return Math.round(((met + partial * 0.5) / total) * 100)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'met':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'partial':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'missing':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'met':
        return <Badge variant="default" className="bg-green-100 text-green-800">Met</Badge>
      case 'partial':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Partial</Badge>
      case 'missing':
        return <Badge variant="destructive">Missing</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">High Impact</Badge>
      case 'medium':
        return <Badge variant="secondary" className="text-xs">Medium Impact</Badge>
      case 'low':
        return <Badge variant="outline" className="text-xs">Low Impact</Badge>
      default:
        return <Badge variant="outline" className="text-xs">Unknown</Badge>
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          SPEC Compliance Analysis
        </CardTitle>
        <CardDescription>
          Compare your content against industry SPEC requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Compliance Score */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Compliance</span>
            <span className="text-2xl font-bold text-gray-900">{complianceScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${complianceScore}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                {category.name}
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="space-y-4">
              <div className="space-y-3">
                {filteredRequirements.map((requirement) => (
                  <div
                    key={requirement.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(requirement.status)}
                        <h4 className="font-medium text-gray-900">{requirement.name}</h4>
                        {getStatusBadge(requirement.status)}
                        {getImpactBadge(requirement.impact)}
                      </div>
                      <Badge 
                        variant={requirement.category === 'required' ? 'destructive' : 
                                requirement.category === 'recommended' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {requirement.category}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{requirement.description}</p>
                    
                    {requirement.details && (
                      <div className="text-sm text-gray-700 bg-gray-100 p-2 rounded">
                        {requirement.details}
                      </div>
                    )}

                    {/* Action buttons for missing requirements */}
                    {requirement.status === 'missing' && (
                      <div className="mt-3 flex gap-2">
                        <EntitlementGate
                          flag="canUseGptTestReal"
                          orgId={orgId}
                          showPaywall={true}
                          featureName="AI-Powered SPEC Analysis"
                          planRequired="pro"
                        >
                          <Button size="sm" variant="outline">
                            <Zap className="h-4 w-4 mr-2" />
                            AI Fix
                          </Button>
                        </EntitlementGate>
                        
                        <Button size="sm" variant="outline">
                          <Info className="h-4 w-4 mr-2" />
                          Learn More
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Upgrade banner for advanced features */}
        {!hasEntitlement('canUseGptTestReal') && (
          <div className="mt-6 p-4 border border-orange-200 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <h4 className="font-medium text-orange-900">Unlock AI-Powered SPEC Analysis</h4>
                <p className="text-sm text-orange-700">
                  Upgrade to Pro to get AI-powered suggestions for improving SPEC compliance.
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-orange-300 text-orange-700">
                Upgrade to Pro
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
