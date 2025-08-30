'use client'

import { useState, useEffect } from 'react'
import { NavBar } from '@/components/ui/navbar'
import { FilterBar } from '@/components/ui/filter-bar'
import { ModuleCard } from '@/components/ui/module-card'
import { ModuleOverlay } from '@/components/ui/module-overlay'

interface Module {
  id: string
  title: string
  vectors: string[]
  difficulty: 1 | 2 | 3 | 4 | 5
  minPlan: 'free' | 'creator' | 'pro' | 'enterprise'
  summary: string
  overview: string
  inputs: string[]
  outputs: string[]
  kpis: string[]
  guardrails: string[]
}

export default function GeneratorPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [filteredModules, setFilteredModules] = useState<Module[]>([])
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const [currentPlan] = useState<'free' | 'creator' | 'pro' | 'enterprise'>('free')
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVectors, setSelectedVectors] = useState<string[]>([])
  const [maxDifficulty, setMaxDifficulty] = useState(5)
  const [selectedPlan, setSelectedPlan] = useState('all')

  // Load modules
  useEffect(() => {
    const loadModules = async () => {
      try {
        const response = await fetch('/api/modules')
        if (response.ok) {
          const data = await response.json()
          setModules(data.modules || [])
          setFilteredModules(data.modules || [])
        }
      } catch (error) {
        console.error('Failed to load modules:', error)
        // Fallback to demo data
        setModules(getDemoModules())
        setFilteredModules(getDemoModules())
      }
    }

    loadModules()
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = modules

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(module =>
        module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.vectors.some(vector => vector.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Vectors filter
    if (selectedVectors.length > 0) {
      filtered = filtered.filter(module =>
        selectedVectors.some(vector => module.vectors.includes(vector))
      )
    }

    // Difficulty filter
    filtered = filtered.filter(module => module.difficulty <= maxDifficulty)

    // Plan filter
    if (selectedPlan !== 'all') {
      filtered = filtered.filter(module => module.minPlan === selectedPlan)
    }

    setFilteredModules(filtered)
  }, [modules, searchQuery, selectedVectors, maxDifficulty, selectedPlan])

  const handleModuleView = (module: Module) => {
    setSelectedModule(module)
    setIsOverlayOpen(true)
  }

  const handleSimulate = () => {
    console.log('Simulating module:', selectedModule?.id)
    // TODO: Implement simulation
  }

  const handleRunRealTest = () => {
    console.log('Running real test for module:', selectedModule?.id)
    // TODO: Implement real test
  }

  const handleExport = (format: string) => {
    console.log('Exporting module:', selectedModule?.id, 'format:', format)
    // TODO: Implement export
  }

  return (
    <div className="min-h-screen bg-bg">
      <NavBar plan={currentPlan} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="font-display text-lg font-semibold text-text mb-4">
                Filters
              </h2>
              <FilterBar
                onSearchChange={setSearchQuery}
                onVectorsChange={setSelectedVectors}
                onDifficultyChange={setMaxDifficulty}
                onPlanChange={setSelectedPlan}
              />
            </div>
          </div>

          {/* Modules Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-display text-2xl font-semibold text-text">
                Module Generator
              </h1>
              <div className="text-sm text-textMuted font-ui">
                {filteredModules.length} of {modules.length} modules
              </div>
            </div>

            {filteredModules.length === 0 ? (
              <div className="text-center py-12">
                <div className="rune-executable rune-loading w-12 h-12 mx-auto mb-4">
                  <div className="star-8 w-8 h-8" />
                </div>
                <p className="text-textMuted font-ui">
                  No modules found matching your filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredModules.map((module) => (
                  <ModuleCard
                    key={module.id}
                    {...module}
                    currentPlan={currentPlan}
                    onView={() => handleModuleView(module)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Module Overlay */}
      {selectedModule && (
        <ModuleOverlay
          isOpen={isOverlayOpen}
          onClose={() => setIsOverlayOpen(false)}
          module={selectedModule}
          currentPlan={currentPlan}
          onSimulate={handleSimulate}
          onRunRealTest={handleRunRealTest}
          onExport={handleExport}
        />
      )}
    </div>
  )
}

// Demo data fallback
function getDemoModules(): Module[] {
  return [
    {
      id: 'M001',
      title: 'Content Optimization',
      vectors: ['prompt', 'context', 'output'],
      difficulty: 2,
      minPlan: 'free',
      summary: 'Optimize content for better engagement and readability',
      overview: 'This module helps optimize content by analyzing structure, tone, and engagement factors.',
      inputs: ['Content text', 'Target audience', 'Optimization goals'],
      outputs: ['Optimized content', 'Engagement metrics', 'Improvement suggestions'],
      kpis: ['Readability score', 'Engagement rate', 'Conversion rate'],
      guardrails: ['Content appropriateness', 'Brand voice consistency', 'Factual accuracy']
    },
    {
      id: 'M002',
      title: 'Technical Documentation',
      vectors: ['prompt', 'context', 'output', 'guardrails'],
      difficulty: 4,
      minPlan: 'creator',
      summary: 'Generate comprehensive technical documentation',
      overview: 'Creates detailed technical documentation with code examples and API references.',
      inputs: ['Code repository', 'API specifications', 'User requirements'],
      outputs: ['API docs', 'Code comments', 'User guides'],
      kpis: ['Documentation coverage', 'Code clarity', 'User satisfaction'],
      guardrails: ['Technical accuracy', 'Security compliance', 'Version control']
    },
    {
      id: 'M003',
      title: 'Marketing Copy Generator',
      vectors: ['prompt', 'context', 'output', 'metrics', 'feedback'],
      difficulty: 3,
      minPlan: 'pro',
      summary: 'Generate high-converting marketing copy',
      overview: 'Creates compelling marketing copy with A/B testing capabilities and performance tracking.',
      inputs: ['Product details', 'Target market', 'Campaign goals'],
      outputs: ['Ad copy', 'Email campaigns', 'Landing pages'],
      kpis: ['Click-through rate', 'Conversion rate', 'ROI'],
      guardrails: ['Regulatory compliance', 'Brand guidelines', 'Truth in advertising']
    }
  ]
}