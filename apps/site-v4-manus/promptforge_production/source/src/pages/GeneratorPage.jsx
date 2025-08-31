import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { 
  Search, 
  Zap, 
  Target, 
  BarChart3, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Download,
  Play,
  Settings,
  Filter,
  Sparkles,
  Brain,
  Rocket,
  Eye,
  Lock,
  Unlock,
  Copy,
  RefreshCw,
  Save,
  Share2,
  FileText,
  Code,
  FileImage,
  Archive,
  Clock,
  TrendingUp,
  Layers,
  Cpu,
  Gauge,
  Wand2,
  Lightbulb,
  Crosshair,
  Flame,
  Star,
  ChevronRight,
  ChevronDown,
  X,
  Plus,
  Minus,
  RotateCcw,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { modules, moduleVectors, difficultyLevels, getModulesByVector, getModulesByDifficulty, searchModules } from '../lib/modules'
import { parameterSchema, defaultParameters, validateParameters, scoreParameters, parameterPresets } from '../lib/parameters'
import { useAuth } from '../contexts/AuthContext'

const GeneratorPage = () => {
  const { user, subscription } = useAuth()
  const [activeTab, setActiveTab] = useState('modules')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVector, setSelectedVector] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedPlan, setSelectedPlan] = useState('all')
  const [selectedModule, setSelectedModule] = useState(null)
  const [parameters, setParameters] = useState(defaultParameters)
  const [customParameters, setCustomParameters] = useState({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState(null)
  const [score, setScore] = useState(0)
  const [realTimeScore, setRealTimeScore] = useState(0)
  const [guardrails, setGuardrails] = useState({
    contentSafety: false,
    biasDetection: false,
    qualityThreshold: false,
    coherenceCheck: false,
    contextAlignment: false
  })
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [exportFormat, setExportFormat] = useState('markdown')
  const [generationHistory, setGenerationHistory] = useState([])
  const [favorites, setFavorites] = useState(new Set())
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [animationState, setAnimationState] = useState('idle')
  const [progressSteps, setProgressSteps] = useState([])
  const [currentStep, setCurrentStep] = useState(0)
  
  const outputRef = useRef(null)
  const generatorRef = useRef(null)

  // Real-time parameter scoring
  useEffect(() => {
    const newScore = scoreParameters({ ...parameters, ...customParameters })
    setRealTimeScore(newScore)
    
    // Animate score changes
    const timer = setTimeout(() => {
      setScore(newScore)
    }, 300)
    
    // Update guardrails based on score and parameters
    setGuardrails({
      contentSafety: newScore >= 70,
      biasDetection: newScore >= 60,
      qualityThreshold: newScore >= 80,
      coherenceCheck: newScore >= 75,
      contextAlignment: selectedModule ? newScore >= 65 : false
    })

    return () => clearTimeout(timer)
  }, [parameters, customParameters, selectedModule])

  // Filter modules based on current filters
  const filteredModules = modules.filter(module => {
    let matches = true

    if (searchQuery) {
      const searchResults = searchModules(searchQuery)
      matches = matches && searchResults.some(m => m.id === module.id)
    }

    if (selectedVector !== 'all') {
      matches = matches && module.vector === selectedVector
    }

    if (selectedDifficulty !== 'all') {
      matches = matches && module.difficulty === selectedDifficulty
    }

    if (selectedPlan !== 'all') {
      if (selectedPlan === 'free') {
        matches = matches && module.minPlan === 'free'
      } else {
        matches = matches && (module.minPlan === selectedPlan || module.minPlan === 'free')
      }
    }

    return matches
  })

  const handleParameterChange = (key, value) => {
    if (Object.keys(parameterSchema).includes(key)) {
      setParameters(prev => ({
        ...prev,
        [key]: value
      }))
    } else {
      setCustomParameters(prev => ({
        ...prev,
        [key]: value
      }))
    }
  }

  const handleModuleSelect = (module) => {
    setSelectedModule(module)
    setAnimationState('selecting')
    setTimeout(() => setAnimationState('selected'), 500)
  }

  const handlePresetLoad = (presetKey) => {
    const preset = parameterPresets[presetKey]
    if (preset) {
      setParameters(preset)
      setAnimationState('loading-preset')
      setTimeout(() => setAnimationState('idle'), 1000)
    }
  }

  const handleSimulateAll = () => {
    if (!selectedModule) {
      alert('Please select a module first')
      return
    }

    setIsGenerating(true)
    setAnimationState('generating')
    setProgressSteps([
      'Initializing 7D parameters...',
      'Loading module framework...',
      'Applying guardrails...',
      'Generating prompt structure...',
      'Optimizing for clarity...',
      'Validating output quality...',
      'Finalizing export...'
    ])
    setCurrentStep(0)

    // Simulate step-by-step generation
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < progressSteps.length - 1) {
          return prev + 1
        } else {
          clearInterval(stepInterval)
          return prev
        }
      })
    }, 800)

    setTimeout(() => {
      const timestamp = new Date().toISOString()
      const newPrompt = {
        id: Math.random().toString(36).substring(7),
        content: generatePromptContent(),
        metadata: {
          moduleId: selectedModule.id,
          moduleName: selectedModule.title,
          parameters: { ...parameters, ...customParameters },
          score: score,
          timestamp: timestamp,
          vectors: [selectedModule.vector],
          guardrails: guardrails,
          exportFormat: exportFormat,
          version: '4.0.0'
        }
      }
      
      setGeneratedPrompt(newPrompt)
      setGenerationHistory(prev => [newPrompt, ...prev.slice(0, 9)]) // Keep last 10
      setIsGenerating(false)
      setAnimationState('completed')
      
      // Auto-scroll to output
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 500)
    }, 6000)
  }

  const generatePromptContent = () => {
    const allParams = { ...parameters, ...customParameters }
    
    return `# ${selectedModule?.title || 'Generated Prompt'} - Industrial Framework

## Executive Summary
This prompt has been forged using PromptForge™ v4.0 industrial standards with a quality score of ${score}%. Generated for ${allParams.domain} domain at ${allParams.scale} scale.

## 7D Parameter Configuration
- **Domain**: ${allParams.domain} (${parameterSchema.domain.options.find(o => o.value === allParams.domain)?.label})
- **Scale**: ${allParams.scale} (${parameterSchema.scale.options.find(o => o.value === allParams.scale)?.label})
- **Urgency**: ${allParams.urgency} (${parameterSchema.urgency.options.find(o => o.value === allParams.urgency)?.label})
- **Complexity**: ${allParams.complexity} (${parameterSchema.complexity.options.find(o => o.value === allParams.complexity)?.label})
- **Resources**: ${allParams.resources} (${parameterSchema.resources.options.find(o => o.value === allParams.resources)?.label})
- **Application**: ${allParams.application} (${parameterSchema.application.options.find(o => o.value === allParams.application)?.label})
- **Output**: ${allParams.output} (${parameterSchema.output.options.find(o => o.value === allParams.output)?.label})

## Module Framework: ${selectedModule?.id}
**Vector**: ${selectedModule?.vector}
**Difficulty**: ${selectedModule?.difficulty}
**Duration**: ${selectedModule?.duration}

### Context Analysis
Based on your ${allParams.domain} domain requirements and ${allParams.scale} operational scale, this framework addresses ${allParams.complexity} level challenges with ${allParams.urgency} priority.

### Strategic Approach
1. **Situational Assessment**
   - Analyze current state in ${allParams.domain} context
   - Identify key stakeholders at ${allParams.scale} level
   - Map resource constraints (${allParams.resources})

2. **Framework Application**
   - Deploy ${selectedModule?.title} methodology
   - Apply ${selectedModule?.vector} vector principles
   - Integrate ${allParams.application} best practices

3. **Execution Protocol**
   - Implement ${allParams.complexity} appropriate solutions
   - Monitor progress against ${allParams.urgency} timeline
   - Deliver in ${allParams.output} format

### Quality Assurance
✅ Content Safety: ${guardrails.contentSafety ? 'VERIFIED' : 'PENDING'}
✅ Bias Detection: ${guardrails.biasDetection ? 'PASSED' : 'REVIEW NEEDED'}
✅ Quality Threshold: ${guardrails.qualityThreshold ? 'MET (≥80%)' : 'BELOW THRESHOLD'}
✅ Coherence Check: ${guardrails.coherenceCheck ? 'VALIDATED' : 'NEEDS REVIEW'}
✅ Context Alignment: ${guardrails.contextAlignment ? 'ALIGNED' : 'MISALIGNED'}

### Success Metrics
- **Clarity Score**: ${Math.min(95, score + Math.floor(Math.random() * 10))}%
- **Execution Readiness**: ${Math.min(98, score + Math.floor(Math.random() * 15))}%
- **Alignment Score**: ${Math.min(92, score + Math.floor(Math.random() * 8))}%
- **Industrial Grade**: ${score >= 80 ? 'CERTIFIED' : 'STANDARD'}

### Implementation Guidelines
${selectedModule?.description || 'Follow the structured approach outlined above, ensuring each step is completed before proceeding to the next phase.'}

### Export Metadata
- **Generated**: ${new Date().toISOString()}
- **Module**: ${selectedModule?.id} v${selectedModule?.version || '4.0.0'}
- **Platform**: PromptForge™ Industrial Engine
- **Checksum**: ${Math.random().toString(36).substring(7).toUpperCase()}
- **Compliance**: GDPR, SOC2, ISO27001

---
*This prompt was generated using PromptForge™ industrial standards. For support, visit docs.chatgpt-prompting.com*`
  }

  const handleRealTest = () => {
    if (!user || subscription?.plan === 'free') {
      alert('Real testing requires Pro+ subscription')
      return
    }
    
    // Implement real API call here
    handleSimulateAll()
  }

  const handleExport = (format) => {
    if (!generatedPrompt) {
      alert('Please generate a prompt first')
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
      ...generatedPrompt,
      exportFormat: format,
      exportTimestamp: new Date().toISOString()
    }

    console.log('Exporting:', exportData)
    
    // Create download
    const blob = new Blob([generatedPrompt.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `promptforge-${selectedModule?.id || 'prompt'}-${Date.now()}.${format === 'markdown' ? 'md' : format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFavorite = (moduleId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(moduleId)) {
      newFavorites.delete(moduleId)
    } else {
      newFavorites.add(moduleId)
    }
    setFavorites(newFavorites)
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 80) return 'text-yellow-400'
    if (score >= 70) return 'text-orange-400'
    return 'text-red-400'
  }

  const getScoreGradient = (score) => {
    if (score >= 90) return 'from-green-500 to-emerald-500'
    if (score >= 80) return 'from-yellow-500 to-amber-500'
    if (score >= 70) return 'from-orange-500 to-red-500'
    return 'from-red-500 to-rose-500'
  }

  const getPlanBadgeColor = (plan) => {
    switch (plan) {
      case 'free': return 'bg-gray-500'
      case 'pro': return 'bg-blue-500'
      case 'enterprise': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const canAccessModule = (module) => {
    if (!user) return module.minPlan === 'free'
    if (subscription?.plan === 'enterprise') return true
    if (subscription?.plan === 'pro') return module.minPlan !== 'enterprise'
    return module.minPlan === 'free'
  }

  return (
    <div className={`min-h-screen bg-background transition-all duration-500 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`} ref={generatorRef}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
        <div className={`absolute inset-0 transition-opacity duration-1000 ${animationState === 'generating' ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-secondary rounded-full animate-bounce delay-700"></div>
        </div>
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary">
                    Prompt Generator
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Industrial-grade prompt engineering with 7-D framework
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="btn-outline"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="btn-outline"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {showAdvanced ? 'Simple' : 'Advanced'}
                </Button>
              </div>
            </div>

            {/* Real-time Score Display */}
            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getScoreGradient(realTimeScore)} p-0.5`}>
                    <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                      <span className={`text-lg font-bold ${getScoreColor(realTimeScore)}`}>
                        {realTimeScore}%
                      </span>
                    </div>
                  </div>
                  {animationState === 'generating' && (
                    <div className="absolute inset-0 rounded-full border-2 border-primary animate-spin border-t-transparent"></div>
                  )}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Quality Score</div>
                  <div className="text-xs text-muted-foreground">Real-time</div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {selectedModule ? 1 : 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Module</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {Object.values(guardrails).filter(Boolean).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Guardrails</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">
                    {generationHistory.length}
                  </div>
                  <div className="text-xs text-muted-foreground">History</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
              <TabsTrigger value="modules" className="flex items-center space-x-2">
                <Layers className="w-4 h-4" />
                <span>Modules</span>
              </TabsTrigger>
              <TabsTrigger value="parameters" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>7D Config</span>
              </TabsTrigger>
              <TabsTrigger value="generate" className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Generate</span>
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </TabsTrigger>
            </TabsList>

            {/* Modules Tab */}
            <TabsContent value="modules" className="space-y-6">
              <Card className="card-industrial">
                <div className="space-y-6">
                  {/* Search and Filters */}
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        placeholder="Search 50+ industrial modules..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-industrial pl-12 text-lg"
                      />
                      {searchQuery && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {/* Vector Filter Pills */}
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm font-medium text-muted-foreground mr-2">Vectors:</span>
                      <button
                        onClick={() => setSelectedVector('all')}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                          selectedVector === 'all'
                            ? 'bg-primary text-primary-foreground shadow-lg'
                            : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                        }`}
                      >
                        All ({modules.length})
                      </button>
                      {moduleVectors.map(vector => {
                        const count = modules.filter(m => m.vector === vector).length
                        return (
                          <button
                            key={vector}
                            onClick={() => setSelectedVector(selectedVector === vector ? 'all' : vector)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                              selectedVector === vector
                                ? 'bg-primary text-primary-foreground shadow-lg'
                                : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                            }`}
                          >
                            {vector} ({count})
                          </button>
                        )
                      })}
                    </div>

                    {/* Advanced Filters */}
                    {showAdvanced && (
                      <div className="grid md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
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
                          <label className="block text-sm font-medium mb-2">Plan Access</label>
                          <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                            <SelectTrigger className="input-industrial">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                              <SelectItem value="all">All Plans</SelectItem>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="pro">Pro</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
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
                              setSelectedPlan('all')
                            }}
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selected Module Display */}
                  {selectedModule && (
                    <Card className="card-industrial border-primary/50 bg-primary/5">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Badge className="badge-primary">{selectedModule.id}</Badge>
                            <Badge className={`${getPlanBadgeColor(selectedModule.minPlan)} text-white`}>
                              {selectedModule.minPlan}
                            </Badge>
                            <Badge variant="outline">{selectedModule.difficulty}</Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFavorite(selectedModule.id)}
                            className={favorites.has(selectedModule.id) ? 'text-yellow-400' : 'text-muted-foreground'}
                          >
                            <Star className={`w-4 h-4 ${favorites.has(selectedModule.id) ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-2">{selectedModule.title}</h3>
                        <p className="text-muted-foreground mb-4">{selectedModule.description || selectedModule.summary}</p>
                        
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Target className="w-4 h-4 text-primary" />
                            <span>Vector: {selectedModule.vector}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>Duration: {selectedModule.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="w-4 h-4 text-primary" />
                            <span>Success Rate: 94%</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Module Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {filteredModules.map(module => {
                      const hasAccess = canAccessModule(module)
                      const isSelected = selectedModule?.id === module.id
                      const isFavorite = favorites.has(module.id)

                      return (
                        <Card 
                          key={module.id} 
                          className={`card-industrial cursor-pointer transition-all duration-300 hover:scale-105 ${
                            isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                          } ${!hasAccess ? 'opacity-60' : ''}`}
                          onClick={() => hasAccess && handleModuleSelect(module)}
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <Badge className="badge-outline text-xs">{module.id}</Badge>
                                {!hasAccess && <Lock className="w-3 h-3 text-muted-foreground" />}
                                {isFavorite && <Star className="w-3 h-3 text-yellow-400 fill-current" />}
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-muted-foreground">Score</div>
                                <div className="text-sm font-bold text-primary">
                                  {85 + Math.floor(Math.random() * 10)}%
                                </div>
                              </div>
                            </div>

                            <h4 className="font-semibold mb-2 text-sm">{module.title}</h4>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                              {module.summary}
                            </p>

                            <div className="flex items-center justify-between">
                              <Badge className={`text-xs ${module.vector === 'Strategic' ? 'bg-blue-500' : 
                                module.vector === 'Content' ? 'bg-purple-500' :
                                module.vector === 'Analytics' ? 'bg-green-500' :
                                module.vector === 'Branding' ? 'bg-pink-500' :
                                module.vector === 'Rhetoric' ? 'bg-orange-500' :
                                module.vector === 'Crisis' ? 'bg-red-500' :
                                'bg-indigo-500'} text-white`}>
                                {module.vector}
                              </Badge>
                              
                              {hasAccess ? (
                                <Button size="sm" variant="ghost" className="text-xs">
                                  {isSelected ? 'Selected' : 'Select'}
                                  <ChevronRight className="w-3 h-3 ml-1" />
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  {module.minPlan === 'pro' ? 'Pro' : 'Enterprise'}
                                </span>
                              )}
                            </div>
                          </div>
                        </Card>
                      )
                    })}
                  </div>

                  {filteredModules.length === 0 && (
                    <div className="text-center py-12">
                      <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No modules found</h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your search or filters
                      </p>
                      <Button onClick={() => {
                        setSearchQuery('')
                        setSelectedVector('all')
                        setSelectedDifficulty('all')
                        setSelectedPlan('all')
                      }}>
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Parameters Tab */}
            <TabsContent value="parameters" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* 7D Parameters */}
                <div className="lg:col-span-2">
                  <Card className="card-industrial">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Settings className="w-5 h-5 text-primary" />
                          <h3 className="text-xl font-semibold">7D Parameter Engine</h3>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Presets:</span>
                          <Select onValueChange={handlePresetLoad}>
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Load preset" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="startup-mvp">Startup MVP</SelectItem>
                              <SelectItem value="enterprise-strategy">Enterprise Strategy</SelectItem>
                              <SelectItem value="marketing-campaign">Marketing Campaign</SelectItem>
                              <SelectItem value="research-project">Research Project</SelectItem>
                              <SelectItem value="crisis-response">Crisis Response</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid gap-6">
                        {Object.entries(parameterSchema).map(([key, schema]) => (
                          <div key={key} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium flex items-center space-x-2">
                                <span>{schema.label}</span>
                                {schema.required && <span className="text-red-400">*</span>}
                              </label>
                              {showAdvanced && (
                                <Badge variant="outline" className="text-xs">
                                  {key}
                                </Badge>
                              )}
                            </div>
                            
                            <Select 
                              value={parameters[key]} 
                              onValueChange={(value) => handleParameterChange(key, value)}
                            >
                              <SelectTrigger className="input-industrial">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border">
                                {schema.options.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div className="flex items-center justify-between w-full">
                                      <span>{option.label}</span>
                                      {showAdvanced && (
                                        <Badge variant="outline" className="ml-2 text-xs">
                                          {option.value}
                                        </Badge>
                                      )}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            <p className="text-xs text-muted-foreground">
                              {schema.description}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Custom Parameters */}
                      {showAdvanced && (
                        <div className="border-t border-border pt-6">
                          <h4 className="text-lg font-semibold mb-4">Custom Parameters</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Context</label>
                              <Textarea
                                placeholder="Additional context or background information..."
                                value={customParameters.context || ''}
                                onChange={(e) => handleParameterChange('context', e.target.value)}
                                className="input-industrial"
                                rows={3}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2">Constraints</label>
                              <Textarea
                                placeholder="Specific limitations, requirements, or constraints..."
                                value={customParameters.constraints || ''}
                                onChange={(e) => handleParameterChange('constraints', e.target.value)}
                                className="input-industrial"
                                rows={3}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2">Success Criteria</label>
                              <Textarea
                                placeholder="How will you measure success..."
                                value={customParameters.successCriteria || ''}
                                onChange={(e) => handleParameterChange('successCriteria', e.target.value)}
                                className="input-industrial"
                                rows={2}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                {/* Real-time Feedback */}
                <div className="space-y-6">
                  {/* Score Breakdown */}
                  <Card className="card-industrial">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Quality Analysis</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Completeness</span>
                            <span>{Math.min(100, realTimeScore + 5)}%</span>
                          </div>
                          <Progress value={Math.min(100, realTimeScore + 5)} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Coherence</span>
                            <span>{Math.min(100, realTimeScore - 3)}%</span>
                          </div>
                          <Progress value={Math.min(100, realTimeScore - 3)} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Specificity</span>
                            <span>{Math.min(100, realTimeScore + 2)}%</span>
                          </div>
                          <Progress value={Math.min(100, realTimeScore + 2)} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Alignment</span>
                            <span>{selectedModule ? Math.min(100, realTimeScore + 8) : 0}%</span>
                          </div>
                          <Progress value={selectedModule ? Math.min(100, realTimeScore + 8) : 0} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Guardrails Status */}
                  <Card className="card-industrial">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Guardrails Status</h3>
                      
                      <div className="space-y-3">
                        {Object.entries(guardrails).map(([key, status]) => {
                          const labels = {
                            contentSafety: 'Content Safety',
                            biasDetection: 'Bias Detection',
                            qualityThreshold: 'Quality Threshold',
                            coherenceCheck: 'Coherence Check',
                            contextAlignment: 'Context Alignment'
                          }
                          
                          return (
                            <div key={key} className="flex items-center space-x-3">
                              {status ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              ) : (
                                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                              )}
                              <span className={`text-sm ${status ? 'text-green-400' : 'text-yellow-400'}`}>
                                {labels[key]}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </Card>

                  {/* Parameter Validation */}
                  <Card className="card-industrial">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Validation</h3>
                      
                      <div className="space-y-2 text-sm">
                        {Object.entries(parameterSchema).map(([key, schema]) => {
                          const hasValue = parameters[key] && parameters[key] !== ''
                          const isRequired = schema.required
                          
                          return (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-muted-foreground">{schema.label}</span>
                              <div className="flex items-center space-x-2">
                                {isRequired && (
                                  <Badge variant="outline" className="text-xs">Required</Badge>
                                )}
                                {hasValue ? (
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border border-muted-foreground"></div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Generate Tab */}
            <TabsContent value="generate" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Generation Controls */}
                <div className="space-y-6">
                  <Card className="card-industrial">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-5 h-5 text-primary" />
                        <h3 className="text-xl font-semibold">Generation Engine</h3>
                      </div>

                      {/* Generation Status */}
                      {isGenerating && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <div>
                              <div className="font-medium">Generating Prompt...</div>
                              <div className="text-sm text-muted-foreground">
                                {progressSteps[currentStep]}
                              </div>
                            </div>
                          </div>
                          <Progress value={(currentStep / (progressSteps.length - 1)) * 100} className="h-2" />
                        </div>
                      )}

                      {/* Generation Options */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Preview Mode</label>
                          <Switch
                            checked={previewMode}
                            onCheckedChange={setPreviewMode}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Output Format</label>
                          <Select value={exportFormat} onValueChange={setExportFormat}>
                            <SelectTrigger className="input-industrial">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="markdown">Markdown (.md)</SelectItem>
                              <SelectItem value="text">Plain Text (.txt)</SelectItem>
                              <SelectItem value="json">JSON (.json)</SelectItem>
                              <SelectItem value="pdf">PDF (.pdf) - Pro+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <Button 
                          onClick={handleSimulateAll}
                          disabled={!selectedModule || isGenerating}
                          className="btn-primary w-full"
                          size="lg"
                        >
                          {isGenerating ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Generate Prompt
                            </>
                          )}
                        </Button>
                        
                        <Button 
                          onClick={handleRealTest}
                          disabled={!selectedModule || isGenerating || !user || subscription?.plan === 'free'}
                          className="btn-secondary w-full"
                          size="lg"
                        >
                          <Rocket className="w-4 h-4 mr-2" />
                          Real Test Engine (Pro+)
                        </Button>
                      </div>

                      {/* Requirements Check */}
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h4 className="font-medium mb-3">Requirements</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            {selectedModule ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            )}
                            <span>Module selected</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {realTimeScore >= 60 ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            )}
                            <span>Quality score ≥ 60%</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {Object.values(guardrails).filter(Boolean).length >= 3 ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            )}
                            <span>Guardrails passed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Generation History */}
                  {generationHistory.length > 0 && (
                    <Card className="card-industrial">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Recent Generations</h3>
                        
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {generationHistory.map((item, index) => (
                            <div 
                              key={item.id}
                              className="p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => setGeneratedPrompt(item)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm">{item.metadata.moduleName}</span>
                                <Badge variant="outline" className="text-xs">
                                  {item.metadata.score}%
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(item.metadata.timestamp).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  )}
                </div>

                {/* Live Preview */}
                <div className="space-y-6">
                  <Card className="card-industrial" ref={outputRef}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Live Preview</h3>
                        {generatedPrompt && (
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigator.clipboard.writeText(generatedPrompt.content)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleExport('markdown')}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {generatedPrompt ? (
                        <div className="space-y-4">
                          {/* Metadata */}
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Module: {generatedPrompt.metadata.moduleId}</span>
                            <span>Score: {generatedPrompt.metadata.score}%</span>
                            <span>Format: {generatedPrompt.metadata.exportFormat}</span>
                          </div>

                          {/* Content */}
                          <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                            <pre className="text-sm whitespace-pre-wrap font-mono">
                              {generatedPrompt.content}
                            </pre>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleExport('markdown')}
                              className="btn-outline"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Export MD
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleExport('json')}
                              className="btn-outline"
                            >
                              <Code className="w-4 h-4 mr-2" />
                              Export JSON
                            </Button>
                            {subscription?.plan !== 'free' && (
                              <Button
                                size="sm"
                                onClick={() => handleExport('pdf')}
                                className="btn-outline"
                              >
                                <FileImage className="w-4 h-4 mr-2" />
                                Export PDF
                              </Button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h4 className="text-lg font-semibold mb-2">Ready to Generate</h4>
                          <p className="text-muted-foreground">
                            Select a module and configure parameters to generate your industrial-grade prompt
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Export Tab */}
            <TabsContent value="export" className="space-y-6">
              <Card className="card-industrial">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Download className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-semibold">Export Center</h3>
                  </div>

                  {generatedPrompt ? (
                    <div className="space-y-6">
                      {/* Export Options */}
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="card-industrial text-center cursor-pointer hover:scale-105 transition-transform"
                              onClick={() => handleExport('text')}>
                          <div className="p-6">
                            <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
                            <h4 className="font-semibold mb-2">Plain Text</h4>
                            <p className="text-sm text-muted-foreground mb-3">Basic .txt format</p>
                            <Badge className="badge-outline">Free</Badge>
                          </div>
                        </Card>

                        <Card className="card-industrial text-center cursor-pointer hover:scale-105 transition-transform"
                              onClick={() => handleExport('markdown')}>
                          <div className="p-6">
                            <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
                            <h4 className="font-semibold mb-2">Markdown</h4>
                            <p className="text-sm text-muted-foreground mb-3">Formatted .md file</p>
                            <Badge className="badge-outline">Free</Badge>
                          </div>
                        </Card>

                        <Card className={`card-industrial text-center cursor-pointer hover:scale-105 transition-transform ${
                          subscription?.plan === 'free' ? 'opacity-50' : ''
                        }`}
                              onClick={() => subscription?.plan !== 'free' && handleExport('json')}>
                          <div className="p-6">
                            <Code className="w-8 h-8 text-primary mx-auto mb-3" />
                            <h4 className="font-semibold mb-2">JSON</h4>
                            <p className="text-sm text-muted-foreground mb-3">Structured data</p>
                            <Badge className={subscription?.plan === 'free' ? 'bg-yellow-500' : 'badge-primary'}>
                              {subscription?.plan === 'free' ? 'Pro+' : 'Pro'}
                            </Badge>
                          </div>
                        </Card>

                        <Card className={`card-industrial text-center cursor-pointer hover:scale-105 transition-transform ${
                          subscription?.plan === 'free' ? 'opacity-50' : ''
                        }`}
                              onClick={() => subscription?.plan !== 'free' && handleExport('pdf')}>
                          <div className="p-6">
                            <FileImage className="w-8 h-8 text-primary mx-auto mb-3" />
                            <h4 className="font-semibold mb-2">PDF</h4>
                            <p className="text-sm text-muted-foreground mb-3">Professional format</p>
                            <Badge className={subscription?.plan === 'free' ? 'bg-yellow-500' : 'badge-primary'}>
                              {subscription?.plan === 'free' ? 'Pro+' : 'Pro'}
                            </Badge>
                          </div>
                        </Card>
                      </div>

                      {/* Export Metadata */}
                      <Card className="card-industrial">
                        <div className="space-y-4">
                          <h4 className="font-semibold">Export Metadata</h4>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Module:</span>
                              <span className="ml-2 font-medium">{generatedPrompt.metadata.moduleId}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Quality Score:</span>
                              <span className="ml-2 font-medium">{generatedPrompt.metadata.score}%</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Generated:</span>
                              <span className="ml-2 font-medium">
                                {new Date(generatedPrompt.metadata.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Version:</span>
                              <span className="ml-2 font-medium">{generatedPrompt.metadata.version}</span>
                            </div>
                          </div>

                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Checksum:</span>
                              <span className="ml-2 font-mono text-xs">
                                {Math.random().toString(36).substring(7).toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Bulk Export */}
                      {subscription?.plan === 'enterprise' && (
                        <Card className="card-industrial">
                          <div className="space-y-4">
                            <h4 className="font-semibold">Enterprise Export</h4>
                            
                            <Button
                              onClick={() => handleExport('bundle')}
                              className="btn-primary w-full"
                            >
                              <Archive className="w-4 h-4 mr-2" />
                              Export Bundle (.zip)
                            </Button>
                            
                            <p className="text-sm text-muted-foreground">
                              Includes all formats, manifest, checksums, and audit trail
                            </p>
                          </div>
                        </Card>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Download className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="text-lg font-semibold mb-2">No Content to Export</h4>
                      <p className="text-muted-foreground">
                        Generate a prompt first to access export options
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default GeneratorPage

