import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Search, 
  Filter, 
  Download, 
  FileText, 
  Code, 
  FileImage,
  Archive,
  Clock,
  Target,
  Zap,
  Lock,
  CheckCircle
} from 'lucide-react'
import { modules, moduleVectors, difficultyLevels, getModulesByVector, getModulesByDifficulty, searchModules } from '../lib/modules'
import { useAuth } from '../contexts/AuthContext'

const ModulesPage = () => {
  const { user, subscription } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVector, setSelectedVector] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedDuration, setSelectedDuration] = useState('all')
  const [selectedModules, setSelectedModules] = useState(new Set())
  const [showFilters, setShowFilters] = useState(false)

  // Filter modules based on current filters
  const filteredModules = modules.filter(module => {
    let matches = true

    // Search filter
    if (searchQuery) {
      const searchResults = searchModules(searchQuery)
      matches = matches && searchResults.some(m => m.id === module.id)
    }

    // Vector filter
    if (selectedVector !== 'all') {
      matches = matches && module.vector === selectedVector
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      matches = matches && module.difficulty === selectedDifficulty
    }

    // Duration filter
    if (selectedDuration !== 'all') {
      matches = matches && module.duration === selectedDuration
    }

    return matches
  })

  // Get vector counts
  const vectorCounts = moduleVectors.reduce((acc, vector) => {
    acc[vector] = modules.filter(m => m.vector === vector).length
    return acc
  }, {})

  const handleModuleSelect = (moduleId, checked) => {
    const newSelected = new Set(selectedModules)
    if (checked) {
      newSelected.add(moduleId)
    } else {
      newSelected.delete(moduleId)
    }
    setSelectedModules(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedModules.size === filteredModules.length) {
      setSelectedModules(new Set())
    } else {
      setSelectedModules(new Set(filteredModules.map(m => m.id)))
    }
  }

  const handleExport = (format) => {
    const selectedModuleData = modules.filter(m => selectedModules.has(m.id))
    
    if (selectedModuleData.length === 0) {
      alert('Please select at least one module to export')
      return
    }

    // Check plan permissions
    if (format === 'pdf' && subscription?.plan === 'free') {
      alert('PDF export requires Pro+ subscription')
      return
    }

    if (format === 'bundle' && subscription?.plan !== 'enterprise') {
      alert('Bundle export requires Enterprise subscription')
      return
    }

    // Simulate export
    const exportData = {
      modules: selectedModuleData,
      exportFormat: format,
      timestamp: new Date().toISOString(),
      checksum: Math.random().toString(36).substring(7)
    }

    console.log('Exporting:', exportData)
    alert(`Exporting ${selectedModuleData.length} modules as ${format.toUpperCase()}`)
  }

  const getDurationOptions = () => {
    const durations = [...new Set(modules.map(m => m.duration))].sort()
    return durations
  }

  const getVectorColor = (vector) => {
    const colors = {
      'Strategic': 'bg-blue-500',
      'Analytics': 'bg-green-500', 
      'Content': 'bg-purple-500',
      'Branding': 'bg-pink-500',
      'Rhetoric': 'bg-orange-500',
      'Crisis': 'bg-red-500',
      'Cognitive': 'bg-indigo-500'
    }
    return colors[vector] || 'bg-gray-500'
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400'
      case 'Intermediate': return 'text-yellow-400'
      case 'Advanced': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const canAccessModule = (module) => {
    if (!user) return module.minPlan === 'free'
    if (subscription?.plan === 'enterprise') return true
    if (subscription?.plan === 'pro') return module.minPlan !== 'enterprise'
    return module.minPlan === 'free'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/30 to-background">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient-primary">50 Industrial Modules</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Organized across 7 semantic vectors for maximum precision. Each module is a ritual of prompt engineering.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <Card className="card-industrial mb-8">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-industrial pl-12 text-lg"
              />
            </div>

            {/* Filter Toggles */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground mr-4">Filters:</span>
              
              {/* Vector Filters */}
              {moduleVectors.map(vector => (
                <button
                  key={vector}
                  onClick={() => setSelectedVector(selectedVector === vector ? 'all' : vector)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedVector === vector
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }`}
                >
                  {vector}
                  <span className="ml-1 text-xs opacity-75">{vectorCounts[vector]}</span>
                </button>
              ))}
            </div>

            {/* Advanced Filters */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="input-industrial">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All Levels</SelectItem>
                    {difficultyLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger className="input-industrial">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="all">All Durations</SelectItem>
                    {getDurationOptions().map(duration => (
                      <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  className="btn-outline w-full"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedVector('all')
                    setSelectedDifficulty('all')
                    setSelectedDuration('all')
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Results Header & Export Options */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-semibold">
              Showing {filteredModules.length} of {modules.length} modules
            </h2>
            <p className="text-muted-foreground">
              {selectedModules.size} selected
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={handleSelectAll}
              className="btn-outline"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {selectedModules.size === filteredModules.length ? 'Deselect All' : 'Select All'}
            </Button>

            <div className="flex space-x-2">
              <Button
                onClick={() => handleExport('markdown')}
                disabled={selectedModules.size === 0}
                className="btn-outline"
                size="sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Markdown
              </Button>

              <Button
                onClick={() => handleExport('json')}
                disabled={selectedModules.size === 0}
                className="btn-outline"
                size="sm"
              >
                <Code className="w-4 h-4 mr-2" />
                JSON
              </Button>

              <Button
                onClick={() => handleExport('pdf')}
                disabled={selectedModules.size === 0 || subscription?.plan === 'free'}
                className="btn-outline"
                size="sm"
              >
                <FileImage className="w-4 h-4 mr-2" />
                PDF
              </Button>

              <Button
                onClick={() => handleExport('bundle')}
                disabled={selectedModules.size === 0 || subscription?.plan !== 'enterprise'}
                className="btn-primary"
                size="sm"
              >
                <Archive className="w-4 h-4 mr-2" />
                Bundle (.zip)
              </Button>
            </div>
          </div>
        </div>

        {/* Module Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map(module => {
            const hasAccess = canAccessModule(module)
            const isSelected = selectedModules.has(module.id)

            return (
              <Card 
                key={module.id} 
                className={`card-industrial relative ${
                  isSelected ? 'ring-2 ring-primary' : ''
                } ${!hasAccess ? 'opacity-75' : ''}`}
              >
                {/* Selection Checkbox */}
                <div className="absolute top-4 right-4">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleModuleSelect(module.id, checked)}
                    disabled={!hasAccess}
                  />
                </div>

                {/* Module Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge className="badge-outline text-xs">{module.id}</Badge>
                      {!hasAccess && <Lock className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{module.summary}</p>
                </div>

                {/* Module Metadata */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={`${getVectorColor(module.vector)} text-white`}>
                      {module.vector}
                    </Badge>
                    <span className={`text-sm font-medium ${getDifficultyColor(module.difficulty)}`}>
                      {module.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{module.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>{module.minPlan}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {module.tags?.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Outputs */}
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-muted-foreground">Outputs:</span>
                    <div className="flex space-x-1">
                      {module.outputs?.map(output => (
                        <Badge key={output} className="badge-outline text-xs">
                          .{output}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-4 pt-4 border-t border-border">
                  {hasAccess ? (
                    <Button className="btn-primary w-full" size="sm">
                      <Zap className="w-4 h-4 mr-2" />
                      Use in Generator
                    </Button>
                  ) : (
                    <Button variant="outline" className="btn-outline w-full" size="sm" disabled>
                      <Lock className="w-4 h-4 mr-2" />
                      {module.minPlan === 'pro' ? 'Pro Required' : 'Enterprise Required'}
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {/* No Results */}
        {filteredModules.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No modules found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters.
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('')
                setSelectedVector('all')
                setSelectedDifficulty('all')
                setSelectedDuration('all')
              }}
              className="btn-primary"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Module Statistics */}
        <Card className="card-industrial mt-12">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-6">Module Statistics</h3>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{modules.length}</div>
                <div className="text-muted-foreground">Total Modules</div>
              </div>
              
              <div>
                <div className="text-3xl font-bold text-accent mb-2">{moduleVectors.length}</div>
                <div className="text-muted-foreground">Semantic Vectors</div>
              </div>
              
              <div>
                <div className="text-3xl font-bold text-secondary mb-2">
                  {modules.filter(m => m.minPlan === 'free').length}
                </div>
                <div className="text-muted-foreground">Free Modules</div>
              </div>
              
              <div>
                <div className="text-3xl font-bold text-primary mb-2">98.7%</div>
                <div className="text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ModulesPage

