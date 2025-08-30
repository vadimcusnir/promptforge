"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Lock, Zap, Clock, Target } from "lucide-react"
import { ForgeGlyphInteractive } from "@/components/forge/ForgeGlyphInteractive"

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

  const filteredModules = useMemo(() => {
    return modules.filter(module => 
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with Forge Glyph */}
      <div className="border-b border-gray-800 bg-black/95 backdrop-blur">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center mb-6">
            <ForgeGlyphInteractive 
              status="ready" 
              size="lg"
              onGlitch={() => console.log("Modules page glyph glitch")}
            />
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
              50 Industrial Modules
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
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

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredModules.length} of {modules.length} modules
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredModules.map((module) => (
              <Card
                key={module.id}
              className="bg-zinc-900/80 border border-zinc-700 hover:border-yellow-600/50 transition-all duration-300 cursor-pointer group"
              >
              <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                  <div className="text-yellow-500 font-mono font-bold text-lg">
                    {module.id}
                  </div>
                  {module.requiresPro && (
                    <Lock className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
                <CardTitle className="text-lg font-serif text-white group-hover:text-yellow-400 transition-colors">
                  {module.name}
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm">
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
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{module.duration}</span>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={`w-full mt-4 ${
                      module.requiresPro
                        ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 hover:bg-yellow-600/30'
                        : 'bg-yellow-600 hover:bg-yellow-700 text-black font-semibold'
                    }`}
                    disabled={module.requiresPro}
                  >
                    {module.requiresPro ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Pro Required
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                      Use in Generator
                      </>
                    )}
                  </Button>
                </div>
                </CardContent>
              </Card>
            ))}
          </div>
      </div>
    </div>
  )
}