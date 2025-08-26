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
}

export default function ModulesPage() {
  const [activeModule, setActiveModule] = useState<Module | null>(null)

  const modules = [
    {
      id: "M01",
      name: "SOP Forge",
      vector: "Strategic",
      description: "Generate comprehensive standard operating procedures",
      locked: false,
    },
    {
      id: "M07",
      name: "Risk Reversal",
      vector: "Strategic",
      description: "Identify and mitigate potential risks",
      locked: false,
    },
    { id: "M11", name: "Funnel Nota", vector: "Rhetoric", description: "Optimize conversion funnels", locked: true },
    {
      id: "M12",
      name: "Visibility Diag",
      vector: "Strategic",
      description: "Analyze market visibility strategies",
      locked: false,
    },
    {
      id: "M13",
      name: "Pricing Psych",
      vector: "Rhetoric",
      description: "Psychological pricing strategies",
      locked: true,
    },
    { id: "M22", name: "Lead Gen", vector: "Content", description: "Generate high-quality leads", locked: true },
    { id: "M24", name: "Personal PR", vector: "Content", description: "Personal brand public relations", locked: true },
    { id: "M32", name: "Cohort Test", vector: "Analytics", description: "Analyze user cohort behavior", locked: true },
    { id: "M35", name: "Content Heat", vector: "Branding", description: "Content performance analysis", locked: true },
    { id: "M40", name: "Crisis Mgmt", vector: "Crisis", description: "Crisis management protocols", locked: true },
    { id: "M45", name: "Learning Path", vector: "Cognitive", description: "Educational pathway design", locked: true },
    {
      id: "M50",
      name: "Brand Voice",
      vector: "Branding",
      description: "Consistent brand voice development",
      locked: true,
    },
  ]

  const vectors = ["Strategic", "Rhetoric", "Content", "Analytics", "Branding", "Crisis", "Cognitive"]

  const handleSpecificationClick = (module: Module) => {
    setActiveModule(module)
  }

  const handleUseInGenerator = (moduleId: string) => {
    window.location.href = `/generator?module=${moduleId}`
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
                  <Input placeholder="Search modules..." className="pl-10 bg-black/50 border-gray-700" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Vector</label>
                  <Select>
                    <SelectTrigger className="bg-black/50 border-gray-700">
                      <SelectValue placeholder="All vectors" />
                    </SelectTrigger>
                    <SelectContent>
                      {vectors.map((vector) => (
                        <SelectItem key={vector} value={vector.toLowerCase()}>
                          {vector}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Access Level</label>
                  <Select>
                    <SelectTrigger className="bg-black/50 border-gray-700">
                      <SelectValue placeholder="All modules" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="locked">Locked</SelectItem>
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
              {modules.map((module) => (
                <Card
                  key={module.id}
                  className={`glass-card transition-all duration-200 ${
                    module.locked ? "opacity-75" : "hover:border-yellow-400/50"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-yellow-400">{module.id}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSpecificationClick(module)}
                          className="text-xs text-gray-400 hover:text-yellow-400 p-1"
                          title="Detalii modul complet"
                        >
                          <Info className="w-3 h-3 mr-1" />
                          Specifications →
                        </Button>
                        {module.locked && <Lock className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>
                    <CardTitle className="font-serif text-lg">{module.name}</CardTitle>
                    <Badge variant="outline" className="w-fit">
                      {module.vector}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400 mb-4">{module.description}</CardDescription>

                    {module.locked ? (
                      <Button variant="outline" className="w-full bg-transparent" disabled>
                        <Lock className="w-4 h-4 mr-2" />
                        Upgrade Required
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

            <div className="mt-8 text-center">
              <p className="text-gray-400 mb-4">Showing 12 of 50 modules</p>
              <Button variant="outline" className="border-gray-700 bg-transparent">
                Load More Modules
              </Button>
            </div>
          </div>
        </div>
      </div>

      {activeModule && <ModuleOverlay module={activeModule} onClose={() => setActiveModule(null)} />}
    </div>
  )
}
