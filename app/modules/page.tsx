"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Lock, Zap, Clock, Target } from "lucide-react"
import { ForgeGlyphInteractive } from "@/components/forge/ForgeGlyphInteractive"
import Link from "next/link"

interface Module {
  id: string
  name: string
  description: string
  vector: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  requiresPro: boolean
}

const modules: Module[] = [
  { id: "M01", name: "SOP Forge", description: "Standard Operating Procedure generation", vector: "Strategic", difficulty: "Beginner", duration: "2-3 min", requiresPro: false },
  { id: "M10", name: "Risk Assessment", description: "Comprehensive risk evaluation framework", vector: "Strategic", difficulty: "Intermediate", duration: "3-4 min", requiresPro: false },
  { id: "M18", name: "Process Optimization", description: "Workflow efficiency enhancement", vector: "Strategic", difficulty: "Beginner", duration: "2-3 min", requiresPro: false },
  { id: "M11", name: "Funnel Optimization", description: "Conversion funnel analysis and improvement", vector: "Rhetoric", difficulty: "Intermediate", duration: "4-5 min", requiresPro: true },
  { id: "M12", name: "Visibility Diagnostics", description: "Brand visibility assessment", vector: "Strategic", difficulty: "Advanced", duration: "5-6 min", requiresPro: true },
  { id: "M13", name: "Pricing Psychology", description: "Psychological pricing strategies", vector: "Rhetoric", difficulty: "Intermediate", duration: "3-4 min", requiresPro: true },
  { id: "M22", name: "Lead Generation", description: "Advanced lead generation strategies", vector: "Content", difficulty: "Advanced", duration: "4-5 min", requiresPro: true },
  { id: "M24", name: "Personal PR", description: "Personal brand development", vector: "Content", difficulty: "Intermediate", duration: "3-4 min", requiresPro: true },
  { id: "M32", name: "Cohort Testing", description: "User cohort analysis framework", vector: "Analytics", difficulty: "Advanced", duration: "5-6 min", requiresPro: true },
  { id: "M35", name: "Content Heat Mapping", description: "Content performance visualization", vector: "Branding", difficulty: "Intermediate", duration: "4-5 min", requiresPro: true },
  { id: "M40", name: "Crisis Management", description: "Crisis response protocols", vector: "Crisis", difficulty: "Advanced", duration: "6-7 min", requiresPro: true },
  { id: "M45", name: "Learning Path Design", description: "Educational pathway creation", vector: "Cognitive", difficulty: "Advanced", duration: "5-6 min", requiresPro: true },
  { id: "M50", name: "Brand Voice Architecture", description: "Comprehensive brand voice system", vector: "Branding", difficulty: "Advanced", duration: "6-7 min", requiresPro: true },
]

export default function ModulesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVectors, setSelectedVectors] = useState<string[]>([])
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
  const [selectedDurations, setSelectedDurations] = useState<string[]>([])

  const filteredModules = useMemo(() => {
    return modules.filter(module => {
      const matchesSearch = 
        module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.id.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesVector = selectedVectors.length === 0 || selectedVectors.includes(module.vector)
      const matchesDifficulty = selectedDifficulties.length === 0 || selectedDifficulties.includes(module.difficulty)
      const matchesDuration = selectedDurations.length === 0 || selectedDurations.includes(module.duration)
      
      return matchesSearch && matchesVector && matchesDifficulty && matchesDuration
    })
  }, [searchTerm, selectedVectors, selectedDifficulties, selectedDurations])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Advanced': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getVectorColor = (vector: string) => {
    const colors: Record<string, string> = {
      'Strategic': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Rhetoric': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Content': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Analytics': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Branding': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'Crisis': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Cognitive': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    }
    return colors[vector] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  // Get unique values for filters
  const uniqueVectors = [...new Set(modules.map(m => m.vector))].sort()
  const uniqueDifficulties = [...new Set(modules.map(m => m.difficulty))].sort()
  const uniqueDurations = [...new Set(modules.map(m => m.duration))].sort()

  // Filter toggle functions
  const toggleVector = (vector: string) => {
    setSelectedVectors(prev => 
      prev.includes(vector) 
        ? prev.filter(v => v !== vector)
        : [...prev, vector]
    )
  }

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulties(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    )
  }

  const toggleDuration = (duration: string) => {
    setSelectedDurations(prev => 
      prev.includes(duration) 
        ? prev.filter(d => d !== duration)
        : [...prev, duration]
    )
  }

  const clearAllFilters = () => {
    setSelectedVectors([])
    setSelectedDifficulties([])
    setSelectedDurations([])
    setSearchTerm("")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with Forge Glyph */}
      <div className="border-b border-border bg-bg-primary">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center mb-6">
            <ForgeGlyphInteractive 
              status="ready" 
              size="lg"
              onGlitch={() => console.log("Modules page glyph glitch")}
            />
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-fg-primary">
              50 Industrial Modules
            </h1>
            <p className="text-xl text-fg-secondary max-w-3xl mx-auto">
              Organized across 7 semantic vectors for maximum precision.
              Each module is a ritual of prompt engineering.
            </p>
          </div>
        </div>
      </div>

      {/* Search Controls */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-lg p-6 mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="text-fg-secondary font-medium">Filters:</span>
            
            {/* Vector Filters */}
            <div className="flex flex-wrap gap-2">
              {uniqueVectors.map(vector => (
                <button
                  key={vector}
                  onClick={() => toggleVector(vector)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedVectors.includes(vector)
                      ? `${getVectorColor(vector)} ring-2 ring-accent/50`
                      : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  {vector}
                </button>
              ))}
            </div>

            {/* Difficulty Filters */}
            <div className="flex flex-wrap gap-2">
              {uniqueDifficulties.map(difficulty => (
                <button
                  key={difficulty}
                  onClick={() => toggleDifficulty(difficulty)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedDifficulties.includes(difficulty)
                      ? `${getDifficultyColor(difficulty)} ring-2 ring-accent/50`
                      : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>

            {/* Duration Filters */}
            <div className="flex flex-wrap gap-2">
              {uniqueDurations.map(duration => (
                <button
                  key={duration}
                  onClick={() => toggleDuration(duration)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedDurations.includes(duration)
                      ? 'bg-accent/20 text-accent border border-accent/30 ring-2 ring-accent/50'
                      : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:border-zinc-600'
                  }`}
                >
                  <Clock className="w-3 h-3 inline mr-1" />
                  {duration}
                </button>
              ))}
            </div>

            {/* Clear All */}
            {(selectedVectors.length > 0 || selectedDifficulties.length > 0 || selectedDurations.length > 0 || searchTerm) && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-1 rounded-full text-sm font-medium bg-zinc-700 text-zinc-300 border border-zinc-600 hover:bg-zinc-600 hover:text-white transition-all duration-200"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-fg-secondary">
            Showing {filteredModules.length} of {modules.length} modules
            {(selectedVectors.length > 0 || selectedDifficulties.length > 0 || selectedDurations.length > 0) && (
              <span className="text-accent ml-2">
                (filtered)
              </span>
            )}
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModules.map((module) => (
              <Card
                key={module.id}
              className="relative bg-card border border-border hover:border-accent/50 transition-all duration-300 cursor-pointer group"
              >
              <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                  <div className="text-accent font-mono font-bold text-lg">
                    {module.id}
                  </div>
                  {module.requiresPro && (
                    <div className="absolute top-2 right-2 bg-accent text-accent-contrast text-xs px-2 py-1 rounded font-medium">
                      Pro Required
                    </div>
                  )}
                  {module.requiresPro && (
                    <Lock className="w-4 h-4 text-accent" />
                  )}
                </div>
                <CardTitle className="text-lg font-serif text-fg-primary group-hover:text-accent transition-colors">
                  {module.name}
                </CardTitle>
                <CardDescription className="text-fg-secondary text-sm">
                  {module.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <Badge className={`text-xs ${getVectorColor(module.vector)}`}>
                      {module.vector}
                    </Badge>
                    <Badge className={`text-xs ${getDifficultyColor(module.difficulty)}`}>
                      {module.difficulty}
                    </Badge>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-2 text-sm text-fg-secondary">
                    <Clock className="w-4 h-4" />
                    <span>{module.duration}</span>
                  </div>

                  {/* CTA Button */}
                  {module.requiresPro ? (
                    <Link href="/pricing" className="w-full">
                      <Button
                        className="w-full mt-4 bg-accent/20 text-accent border border-accent/30 hover:bg-accent/30 transition-all duration-200"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Pro Required
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      className="w-full mt-4 bg-accent hover:bg-accent-hover text-accent-contrast font-semibold transition-all duration-200"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Use in Generator
                    </Button>
                  )}
                </div>
                </CardContent>
              </Card>
            ))}
          </div>
      </div>
    </div>
  )
}