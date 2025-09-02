"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Lock, ArrowRight, Info } from "lucide-react"
import ModuleOverlay from "@/components/modules/ModuleOverlay"

interface Module {
  id: string
  name: string
  vector: string
  description: string
  locked: boolean
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  plan: "free" | "creator" | "pro" | "enterprise"
  tags: string[]
}

export default function ModulesPage() {
  const [activeModule, setActiveModule] = useState<Module | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVector, setSelectedVector] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [selectedModules, setSelectedModules] = useState<string[]>([])

  const modules = [
    {
      id: "M01",
      name: "Strategic Framework",
      vector: "Strategic",
      description: "Generate comprehensive strategic frameworks for business planning",
      locked: false,
      difficulty: "Intermediate" as const,
      duration: "15-20 min",
      plan: "free" as const,
      tags: ["Strategy", "Planning", "Framework"],
    },
    {
      id: "M07",
      name: "Content Engine",
      vector: "Content",
      description: "Advanced content generation with semantic optimization",
      locked: false,
      difficulty: "Advanced" as const,
      duration: "10-15 min",
      plan: "creator" as const,
      tags: ["Content", "SEO", "Marketing"],
    },
    {
      id: "M11",
      name: "Crisis Management",
      vector: "Crisis",
      description: "Crisis response protocols and communication strategies",
      locked: false,
      difficulty: "Advanced" as const,
      duration: "20-25 min",
      plan: "pro" as const,
      tags: ["Crisis", "Response", "Communication"],
    },
    {
      id: "M12",
      name: "Visibility Diag",
      vector: "Strategic",
      description: "Analyze market visibility strategies",
      locked: false,
      difficulty: "Beginner" as const,
      duration: "8-12 min",
      plan: "free" as const,
      tags: ["Analysis", "Market", "Visibility"],
    },
    {
      id: "M13",
      name: "Pricing Psych",
      vector: "Rhetoric",
      description: "Psychological pricing strategies",
      locked: true,
      difficulty: "Advanced" as const,
      duration: "12-18 min",
      plan: "pro" as const,
      tags: ["Pricing", "Psychology", "Strategy"],
    },
    {
      id: "M22",
      name: "Lead Gen",
      vector: "Content",
      description: "Generate high-quality leads",
      locked: true,
      difficulty: "Advanced" as const,
      duration: "15-20 min",
      plan: "enterprise" as const,
      tags: ["Lead", "Generation", "Marketing"],
    },
    {
      id: "M24",
      name: "Personal PR",
      vector: "Content",
      description: "Personal brand public relations",
      locked: true,
      difficulty: "Intermediate" as const,
      duration: "10-15 min",
      plan: "creator" as const,
      tags: ["PR", "Personal", "Brand"],
    },
    {
      id: "M32",
      name: "Cohort Test",
      vector: "Analytics",
      description: "Analyze user cohort behavior",
      locked: true,
      difficulty: "Beginner" as const,
      duration: "8-12 min",
      plan: "free" as const,
      tags: ["Analytics", "Cohort", "Behavior"],
    },
    {
      id: "M35",
      name: "Content Heat",
      vector: "Branding",
      description: "Content performance analysis",
      locked: true,
      difficulty: "Intermediate" as const,
      duration: "10-15 min",
      plan: "creator" as const,
      tags: ["Content", "Heat", "Analysis"],
    },
    {
      id: "M40",
      name: "Crisis Mgmt",
      vector: "Crisis",
      description: "Crisis management protocols",
      locked: true,
      difficulty: "Advanced" as const,
      duration: "20-25 min",
      plan: "pro" as const,
      tags: ["Crisis", "Management", "Protocols"],
    },
    {
      id: "M45",
      name: "Learning Path",
      vector: "Cognitive",
      description: "Educational pathway design",
      locked: true,
      difficulty: "Intermediate" as const,
      duration: "10-15 min",
      plan: "creator" as const,
      tags: ["Learning", "Path", "Design"],
    },
    {
      id: "M50",
      name: "Brand Voice",
      vector: "Branding",
      description: "Consistent brand voice development",
      locked: true,
      difficulty: "Advanced" as const,
      duration: "15-20 min",
      plan: "enterprise" as const,
      tags: ["Brand", "Voice", "Development"],
    },
  ]

  const vectors = ["Strategic", "Rhetoric", "Content", "Analytics", "Branding", "Crisis", "Cognitive"]
  const difficulties = ["Beginner", "Intermediate", "Advanced"]

  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesVector = selectedVector === "all" || module.vector === selectedVector
    const matchesDifficulty = selectedDifficulty === "all" || module.difficulty === selectedDifficulty
    return matchesSearch && matchesVector && matchesDifficulty
  })

  const stats = {
    totalModules: modules.length,
    totalVectors: vectors.length,
    freeModules: modules.filter((m) => m.plan === "free").length,
    successRate: "98.7%",
  }

  const handleSpecificationClick = (module: Module) => {
    setActiveModule(module)
  }

  const handleUseInGenerator = (moduleId: string) => {
    window.location.href = `/generator?module=${moduleId}`
  }

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  return (
    <div className="min-h-screen pattern-bg text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-serif mb-4">50 Operational Modules. 7 Vectors. Zero Improvisation.</h1>
          <p className="text-xl text-gray-400">Industrial-grade prompt modules for professional workflows</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters */}
          <div className="lg:col-span-1">
            <Card className="glass-card">
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

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Vector</label>
                  <Select value={selectedVector} onValueChange={setSelectedVector}>
                    <SelectTrigger className="bg-black/50 border-gray-700">
                      <SelectValue placeholder="All vectors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All vectors</SelectItem>
                      {vectors.map((vector) => (
                        <SelectItem key={vector} value={vector}>
                          {vector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Difficulty</label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="bg-black/50 border-gray-700">
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All levels</SelectItem>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <h4 className="font-medium mb-2">Vector Distribution</h4>
                  <div className="space-y-1 text-sm">
                    {vectors.map((vector) => {
                      const count = modules.filter((m) => m.vector === vector).length
                      return (
                        <div key={vector} className="flex justify-between">
                          <span className="text-gray-400">{vector}</span>
                          <span className="text-yellow-400">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Module Grid */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredModules.map((module) => (
                <Card
                  key={module.id}
                  className={`glass-card transition-all duration-200 ${
                    module.locked ? "opacity-75" : "hover:border-yellow-400/50"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedModules.includes(module.id)}
                          onChange={() => handleModuleSelect(module.id)}
                          className="w-4 h-4 text-yellow-400 bg-black border-gray-600 rounded focus:ring-yellow-400"
                        />
                        <span className="font-mono text-sm text-yellow-400">{module.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSpecificationClick(module)}
                          className="text-xs text-gray-400 hover:text-yellow-400 p-1"
                        >
                          <Info className="w-3 h-3 mr-1" />
                          Specifications →
                        </Button>
                        {module.locked && <Lock className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>
                    <CardTitle className="font-serif text-lg">{module.name}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="w-fit">
                        {module.vector}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          module.difficulty === "Beginner"
                            ? "bg-green-900 text-green-300"
                            : module.difficulty === "Intermediate"
                              ? "bg-yellow-900 text-yellow-300"
                              : "bg-red-900 text-red-300"
                        }`}
                      >
                        {module.difficulty}
                      </Badge>
                      <span className="text-xs text-gray-400">{module.duration}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {module.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400 mb-4">{module.description}</CardDescription>

                    {module.locked ? (
                      <Button variant="outline" className="w-full bg-transparent" disabled>
                        <Lock className="w-4 h-4 mr-2" />
                        {module.plan === "pro"
                          ? "Pro Required"
                          : module.plan === "enterprise"
                            ? "Enterprise Required"
                            : "Upgrade Required"}
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-yellow-600 hover:bg-yellow-700"
                        onClick={() => handleUseInGenerator(module.id)}
                      >
                        Use in Generator
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="glass-card text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-yellow-400">{stats.totalModules}</div>
                  <div className="text-sm text-gray-400">Total Modules</div>
                </CardContent>
              </Card>
              <Card className="glass-card text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-yellow-400">{stats.totalVectors}</div>
                  <div className="text-sm text-gray-400">Vectors</div>
                </CardContent>
              </Card>
              <Card className="glass-card text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-yellow-400">{stats.freeModules}</div>
                  <div className="text-sm text-gray-400">Free Modules</div>
                </CardContent>
              </Card>
              <Card className="glass-card text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-yellow-400">{stats.successRate}</div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-400 mb-4">
                Showing {filteredModules.length} of {modules.length} modules
              </p>
              {selectedModules.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">{selectedModules.length} modules selected</p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" className="border-gray-700 bg-transparent">
                      Export Selected (.md)
                    </Button>
                    <Button variant="outline" className="border-gray-700 bg-transparent">
                      Export Selected (.json)
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {activeModule && <ModuleOverlay module={activeModule} onClose={() => setActiveModule(null)} />}
    </div>
  )
}
