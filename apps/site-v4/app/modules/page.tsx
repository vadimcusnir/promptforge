"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, Play, Star } from "lucide-react"

const vectors = [
  "Content Creation",
  "Data Analysis",
  "Code Generation",
  "Strategic Planning",
  "Creative Writing",
  "Technical Documentation",
  "Market Research",
]

const modules = [
  {
    id: "M01",
    name: "Blog Post Generator",
    vector: "Content Creation",
    description: "Generate SEO-optimized blog posts with structured content and engaging headlines",
    parameters: 7,
    avgScore: 87,
    runs: 2847,
    tags: ["SEO", "Content", "Marketing"],
  },
  {
    id: "M02",
    name: "Code Review Assistant",
    vector: "Code Generation",
    description: "Analyze code quality, suggest improvements, and identify potential issues",
    parameters: 6,
    avgScore: 92,
    runs: 1923,
    tags: ["Code", "Review", "Quality"],
  },
  {
    id: "M03",
    name: "Market Analysis Engine",
    vector: "Market Research",
    description: "Comprehensive market analysis with competitor insights and trend identification",
    parameters: 8,
    avgScore: 89,
    runs: 1456,
    tags: ["Market", "Analysis", "Strategy"],
  },
  {
    id: "M04",
    name: "Technical Documentation Writer",
    vector: "Technical Documentation",
    description: "Create clear, comprehensive technical documentation with examples",
    parameters: 7,
    avgScore: 85,
    runs: 987,
    tags: ["Docs", "Technical", "Writing"],
  },
  {
    id: "M05",
    name: "Creative Story Builder",
    vector: "Creative Writing",
    description: "Generate compelling narratives with character development and plot structure",
    parameters: 9,
    avgScore: 91,
    runs: 2134,
    tags: ["Creative", "Story", "Narrative"],
  },
  {
    id: "M06",
    name: "Data Visualization Planner",
    vector: "Data Analysis",
    description: "Plan effective data visualizations with chart recommendations and insights",
    parameters: 6,
    avgScore: 88,
    runs: 1678,
    tags: ["Data", "Visualization", "Charts"],
  },
]

export default function ModulesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVector, setSelectedVector] = useState("all")
  const [sortBy, setSortBy] = useState("popularity")

  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesVector = selectedVector === "all" || module.vector === selectedVector
    return matchesSearch && matchesVector
  })

  const sortedModules = [...filteredModules].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return b.runs - a.runs
      case "score":
        return b.avgScore - a.avgScore
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 font-mono">
            Module <span className="text-emerald-400">Library</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Browse our collection of 50 industrial-grade modules across 7 vectors. Each module is battle-tested and
            optimized for consistent results.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search modules, descriptions, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400"
            />
          </div>
          <Select value={selectedVector} onValueChange={setSelectedVector}>
            <SelectTrigger className="w-full md:w-48 bg-slate-800/50 border-slate-700 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Vectors" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Vectors</SelectItem>
              {vectors.map((vector) => (
                <SelectItem key={vector} value={vector}>
                  {vector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48 bg-slate-800/50 border-slate-700 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="popularity">Most Popular</SelectItem>
              <SelectItem value="score">Highest Score</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400 font-mono">50</div>
              <div className="text-sm text-slate-400">Total Modules</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400 font-mono">7</div>
              <div className="text-sm text-slate-400">Vectors</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400 font-mono">89</div>
              <div className="text-sm text-slate-400">Avg Score</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-400 font-mono">12K+</div>
              <div className="text-sm text-slate-400">Total Runs</div>
            </CardContent>
          </Card>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedModules.map((module) => (
            <Card
              key={module.id}
              className="bg-slate-800/50 border-slate-700 hover:border-emerald-500/50 transition-all duration-300 group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white group-hover:text-emerald-400 transition-colors">
                      {module.name}
                    </CardTitle>
                    <CardDescription className="text-slate-400 mt-1">{module.vector}</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 font-mono">
                    {module.id}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 text-sm mb-4">{module.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {module.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-sm font-mono text-emerald-400">{module.parameters}</div>
                    <div className="text-xs text-slate-400">Parameters</div>
                  </div>
                  <div>
                    <div className="text-sm font-mono text-emerald-400 flex items-center justify-center">
                      <Star className="w-3 h-3 mr-1" />
                      {module.avgScore}
                    </div>
                    <div className="text-xs text-slate-400">Avg Score</div>
                  </div>
                  <div>
                    <div className="text-sm font-mono text-emerald-400">{module.runs.toLocaleString()}</div>
                    <div className="text-xs text-slate-400">Runs</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    <Play className="w-4 h-4 mr-2" />
                    Run Module
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg">No modules found matching your criteria</div>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedVector("all")
              }}
              variant="outline"
              className="mt-4 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
