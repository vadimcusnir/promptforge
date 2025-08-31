"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Download, FileText, Package } from "lucide-react"

export function ModuleBrowser() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedModules, setSelectedModules] = useState<string[]>([])

  const categories = ["Content", "Analysis", "Optimization", "Integration"]

  const modules = [
    {
      id: "1",
      title: "Strategic Framework Generator",
      description: "Build comprehensive frameworks for business planning and strategic decision-making.",
      difficulty: "Intermediate",
      tags: ["strategy", "planning", "framework"],
      category: "Analysis",
    },
    {
      id: "2",
      title: "Content Strategy Builder",
      description: "Design data-driven content strategies with performance KPIs and audience targeting.",
      difficulty: "Advanced",
      tags: ["content", "strategy", "kpi"],
      category: "Content",
    },
    {
      id: "3",
      title: "Crisis Communication Plan",
      description: "Develop comprehensive crisis communication strategies and response protocols.",
      difficulty: "Expert",
      tags: ["crisis", "communication", "response"],
      category: "Content",
    },
    {
      id: "4",
      title: "Performance Optimizer",
      description: "Analyze and optimize system performance with actionable recommendations.",
      difficulty: "Advanced",
      tags: ["performance", "optimization", "analysis"],
      category: "Optimization",
    },
  ]

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  const exportOptions = [
    { format: "PDF", icon: FileText },
    { format: "JSON", icon: FileText },
    { format: "Markdown", icon: FileText },
    { format: "Bundle (.zip)", icon: Package },
  ]

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4 font-mono">Module Browser</h2>
        <p className="text-slate-300 font-mono">Browse, filter, and export from our library of 50+ prompt modules.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by keyword"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 font-mono"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48 bg-slate-800 border-slate-600 text-white font-mono">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="font-mono">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Export Options */}
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="text-sm font-mono text-slate-400 mr-2">Export Options:</span>
        {exportOptions.map((option) => (
          <Button
            key={option.format}
            size="sm"
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-800 font-mono bg-transparent"
            disabled={selectedModules.length === 0}
          >
            <option.icon className="w-3 h-3 mr-1" />
            {option.format}
          </Button>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="space-y-4">
        {modules.map((module) => (
          <div
            key={module.id}
            className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-600"
          >
            <Checkbox
              checked={selectedModules.includes(module.id)}
              onCheckedChange={() => handleModuleSelect(module.id)}
              className="mt-1"
            />

            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-white font-mono">{module.title}</h3>
                <Badge variant="outline" className="border-slate-600 text-slate-400 font-mono text-xs">
                  {module.difficulty}
                </Badge>
              </div>

              <p className="text-slate-300 font-mono text-sm mb-3">{module.description}</p>

              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="border-emerald-400/30 text-emerald-400 bg-emerald-400/10 font-mono text-xs"
                >
                  {module.category}
                </Badge>
                {module.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-slate-600 text-slate-400 font-mono text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selection Summary */}
      {selectedModules.length > 0 && (
        <div className="mt-8 p-4 bg-emerald-900/20 border border-emerald-400/30 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-emerald-400 font-mono">
              {selectedModules.length} module{selectedModules.length !== 1 ? "s" : ""} selected
            </span>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono">
              <Download className="w-4 h-4 mr-2" />
              Export Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
