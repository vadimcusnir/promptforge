"use client";

import { useState, useEffect } from 'react'
import { Module } from '@/lib/modules'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Filter, Download } from 'lucide-react'
import { analytics } from '@/lib/analytics'

export function ModuleBrowser() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedModules, setSelectedModules] = useState<string[]>([])

  const categories = ['all', 'content', 'analysis', 'optimization', 'integration']

  useEffect(() => {
    fetchModules()
  }, [])

  const fetchModules = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      if (searchQuery) {
        params.append('search', searchQuery)
      }

      const response = await fetch(`/api/modules?${params}`)
      const data = await response.json()
      setModules(data.modules || [])
    } catch (error) {
      console.error('Error fetching modules:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchModules()
  }, [selectedCategory, searchQuery])

  const handleModuleSelect = (moduleId: string) => {
    setSelectedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const handleExport = async (format: string) => {
    if (selectedModules.length === 0) {
      alert('Please select at least one module to export')
      return
    }

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format,
          moduleIds: selectedModules,
          metadata: {
            title: 'PromptForge Module Export',
            description: `Exported ${selectedModules.length} modules`,
            author: 'PromptForge User',
          },
        }),
      })

      const data = await response.json()
      
      if (data.data) {
        // Create download link
        const blob = new Blob([Buffer.from(data.data, 'base64')], { 
          type: data.mimeType 
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = data.filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400'
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400'
      case 'advanced': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-pf-text-muted">Loading modules...</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-pf-text mb-4">Module Browser</h1>
        <p className="text-pf-text-muted text-lg">
          Browse and export from our collection of 50+ prompt modules
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pf-text-muted w-4 h-4" />
          <Input
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-pf-black border-pf-text-muted/30 text-pf-text"
          />
        </div>
        <div className="flex gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-gold-industrial text-pf-black'
                  : 'bg-pf-surface text-pf-text-muted hover:text-pf-text'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Export Controls */}
      {selectedModules.length > 0 && (
        <div className="mb-6 p-4 bg-pf-surface border border-pf-text-muted/30 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-pf-text">
              {selectedModules.length} module(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('pdf')}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={() => handleExport('json')}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                JSON
              </button>
              <button
                onClick={() => handleExport('md')}
                className="px-4 py-2 bg-green-500/20 text-green-400 rounded-md hover:bg-green-500/30 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Markdown
              </button>
              <button
                onClick={() => handleExport('zip')}
                className="px-4 py-2 bg-gold-industrial/20 text-gold-industrial rounded-md hover:bg-gold-industrial/30 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Bundle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modules Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map(module => (
          <Card
            key={module.id}
            className={`bg-pf-surface border-pf-text-muted/30 cursor-pointer transition-all hover:border-gold-industrial/50 ${
              selectedModules.includes(module.id) ? 'border-gold-industrial' : ''
            }`}
            onClick={() => handleModuleSelect(module.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-pf-text text-lg">{module.name}</CardTitle>
                  <Badge className={`mt-2 ${getDifficultyColor(module.difficulty)}`}>
                    {module.difficulty}
                  </Badge>
                </div>
                <input
                  type="checkbox"
                  checked={selectedModules.includes(module.id)}
                  onChange={() => handleModuleSelect(module.id)}
                  className="w-4 h-4 text-gold-industrial"
                />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-pf-text-muted mb-4">
                {module.description}
              </CardDescription>
              <div className="flex flex-wrap gap-1">
                {module.tags.map(tag => (
                  <Badge key={tag} className="bg-pf-black text-pf-text-muted text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {modules.length === 0 && (
        <div className="text-center py-12">
          <p className="text-pf-text-muted">No modules found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
