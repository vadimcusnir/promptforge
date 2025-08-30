"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Lock, ArrowRight, Info, Clock, Tag, Building, AlertCircle } from "lucide-react"
import ModuleOverlay from "@/components/modules/ModuleOverlay"
import { useEntitlements } from "@/hooks/use-entitlements"
import Link from "next/link"

interface Module {
  id: string
  module_code: string
  name: string
  description: string
  category: string
  domain_slug: string
  complexity: string
  estimated_time_minutes: number
  tags: string[]
  template_prompt: string
  example_output: string
  best_practices: string[]
  domain_info?: {
    name: string
    industry: string
  }
}

export default function ModulesClient() {
  const [activeModule, setActiveModule] = useState<Module | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [filteredModules, setFilteredModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDomain, setSelectedDomain] = useState("")
  const [selectedComplexity, setSelectedComplexity] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  
  const { hasEntitlement } = useEntitlements()

  // Fetch modules from API
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setError(null)
        const response = await fetch('/api/modules?limit=100')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data?.modules) {
            setModules(data.data.modules)
            setFilteredModules(data.data.modules)
          } else {
            throw new Error('Invalid response format from API')
          }
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        console.error('Error fetching modules:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch modules')
        // Set fallback modules for demo purposes
        setModules([
          {
            id: "demo-1",
            module_code: "M01",
            name: "Strategic Business Planning",
            description: "Generate comprehensive business strategies using the 7D parameter engine",
            category: "business",
            domain_slug: "business",
            complexity: "intermediate",
            estimated_time_minutes: 15,
            tags: ["strategy", "planning", "business"],
            template_prompt: "Create a strategic business plan for...",
            example_output: "Strategic business plan with clear objectives...",
            best_practices: ["Define clear objectives", "Include measurable KPIs"]
          }
        ])
        setFilteredModules([
          {
            id: "demo-1",
            module_code: "M01",
            name: "Strategic Business Planning",
            description: "Generate comprehensive business strategies using the 7D parameter engine",
            category: "business",
            domain_slug: "business",
            complexity: "intermediate",
            estimated_time_minutes: 15,
            tags: ["strategy", "planning", "business"],
            template_prompt: "Create a strategic business plan for...",
            example_output: "Strategic business plan with clear objectives...",
            best_practices: ["Define clear objectives", "Include measurable KPIs"]
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchModules()
  }, [])

  // Filter modules based on search and filters
  useEffect(() => {
    let filtered = modules

    if (searchTerm) {
      filtered = filtered.filter(module =>
        module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    if (selectedDomain) {
      filtered = filtered.filter(module => module.domain_slug === selectedDomain)
    }

    if (selectedComplexity) {
      filtered = filtered.filter(module => module.complexity === selectedComplexity)
    }

    if (selectedCategory) {
      filtered = filtered.filter(module => module.category === selectedCategory)
    }

    setFilteredModules(filtered)
  }, [modules, searchTerm, selectedDomain, selectedComplexity, selectedCategory])

  // Get unique values for filters
  const domains = [...new Set(modules.map(m => m.domain_slug))]
  const categories = [...new Set(modules.map(m => m.category))]
  const complexities = ['beginner', 'intermediate', 'advanced', 'expert']

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-500'
      case 'intermediate': return 'bg-blue-500'
      case 'advanced': return 'bg-orange-500'
      case 'expert': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getDomainColor = (domain: string) => {
    switch (domain) {
      case 'fintech': return 'bg-blue-600'
      case 'edutech': return 'bg-green-600'
      case 'saas': return 'bg-purple-600'
      case 'healthtech': return 'bg-red-600'
      case 'manufacturing': return 'bg-yellow-600'
      default: return 'bg-gray-600'
    }
  }

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Filters */}
      <div className="lg:col-span-1">
        <Card className="bg-zinc-900/80 border border-zinc-700">
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <Filter className="w-5 h-5 text-yellow-400" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search modules..." 
                className="pl-10 bg-black/50 border-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Domain</label>
              <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                <SelectTrigger className="bg-black/50 border-gray-700">
                  <SelectValue placeholder="All domains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All domains</SelectItem>
                  {domains.map(domain => (
                    <SelectItem key={domain} value={domain}>
                      {domain.charAt(0).toUpperCase() + domain.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-black/50 border-gray-700">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Complexity</label>
              <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
                <SelectTrigger className="bg-black/50 border-gray-700">
                  <SelectValue placeholder="All complexities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All complexities</SelectItem>
                  {complexities.map(complexity => (
                    <SelectItem key={complexity} value={complexity}>
                      {complexity.charAt(0).toUpperCase() + complexity.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Modules Grid */}
      <div className="lg:col-span-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
            <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
            <p className="text-lg mb-2">{error}</p>
            <p>Please try again later or check your network connection.</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-400">
                Showing {filteredModules.length} of {modules.length} modules
              </p>
              {filteredModules.length === 0 && (
                <p className="text-orange-400">No modules match your filters</p>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredModules.map((module) => (
                <Card
                  key={module.id}
                  className="bg-zinc-900/80 border border-zinc-700 transition-all duration-200 hover:border-yellow-400/50"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-yellow-400">{module.module_code}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveModule(module)}
                          className="text-xs text-gray-400 hover:text-yellow-400 p-1"
                          title="Module specifications"
                        >
                          <Info className="w-3 h-3 mr-1" />
                          Details →
                        </Button>
                      </div>
                    </div>
                    <CardTitle className="font-serif text-lg">{module.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getComplexityColor(module.complexity)} text-white text-xs`}>
                        {module.complexity}
                      </Badge>
                      <Badge className={`${getDomainColor(module.domain_slug)} text-white text-xs`}>
                        {module.domain_slug}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400 mb-3">{module.description}</CardDescription>
                    
                    <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {module.estimated_time_minutes} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {module.category}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {module.tags.slice(0, 3).map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs border-gray-600 text-gray-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {module.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                          +{module.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <Button
                      className="w-full bg-yellow-600 hover:bg-yellow-700"
                      onClick={() => window.location.href = `/generator?module=${module.module_code}`}
                    >
                      Use in Generator
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {activeModule && <ModuleOverlay module={activeModule} onClose={() => setActiveModule(null)} />}
    </div>
  )
}
