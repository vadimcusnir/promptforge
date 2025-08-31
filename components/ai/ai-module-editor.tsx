"use client";

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Wand2, 
  Brain, 
  Zap, 
  Download, 
  Share2, 
  Users, 
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface AIGenerationResult {
  success: boolean
  result?: string
  error?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model: string
}

export function AIModuleEditor() {
  const [inputs, setInputs] = useState({
    topic: '',
    requirements: '',
    tone: 'Professional',
    length: '500 words',
    audience: 'General'
  })
  
  const [generatedContent, setGeneratedContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationResult, setGenerationResult] = useState<AIGenerationResult | null>(null)
  const [optimizationGoals, setOptimizationGoals] = useState<string[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizedContent, setOptimizedContent] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AIGenerationResult | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGenerationResult(null)
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleId: 'M01', // Content Generator
          inputs,
          model: 'gpt-4',
          temperature: 0.7,
        }),
      })

      const result: AIGenerationResult = await response.json()
      setGenerationResult(result)
      
      if (result.success && result.result) {
        setGeneratedContent(result.result)
      }
    } catch (error) {
      console.error('Generation error:', error)
      setGenerationResult({
        success: false,
        error: 'Failed to generate content',
        model: 'gpt-4'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleOptimize = async () => {
    if (!generatedContent) return
    
    setIsOptimizing(true)
    
    try {
      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: generatedContent,
          optimizationGoals: optimizationGoals.length > 0 ? optimizationGoals : ['Clarity', 'Specificity', 'Engagement'],
        }),
      })

      const result: AIGenerationResult = await response.json()
      
      if (result.success && result.result) {
        setOptimizedContent(result.result)
      }
    } catch (error) {
      console.error('Optimization error:', error)
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleAnalyze = async () => {
    if (!generatedContent) return
    
    setIsAnalyzing(true)
    setAnalysisResult(null)
    
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: generatedContent,
        }),
      })

      const result: AIGenerationResult = await response.json()
      setAnalysisResult(result)
    } catch (error) {
      console.error('Analysis error:', error)
      setAnalysisResult({
        success: false,
        error: 'Failed to analyze content',
        model: 'gpt-4'
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const toggleOptimizationGoal = (goal: string) => {
    setOptimizationGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    )
  }

  const optimizationOptions = [
    'Clarity', 'Specificity', 'Engagement', 'SEO', 'Readability', 
    'Call-to-Action', 'Emotional Impact', 'Technical Accuracy'
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-pf-text mb-4">
          AI-Powered Module Editor
        </h1>
        <p className="text-pf-text-muted text-lg">
          Generate, optimize, and analyze prompts with advanced AI capabilities
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="space-y-6">
          <Card className="bg-pf-surface border-pf-text-muted/30">
            <CardHeader>
              <CardTitle className="text-pf-text flex items-center gap-2">
                <Brain className="w-5 h-5 text-gold-industrial" />
                Content Generation
              </CardTitle>
              <CardDescription className="text-pf-text-muted">
                Configure your content requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-pf-text text-sm font-medium mb-2 block">
                  Topic
                </label>
                <Input
                  value={inputs.topic}
                  onChange={(e) => setInputs(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="Enter your topic..."
                  className="bg-pf-black border-pf-text-muted/30 text-pf-text"
                />
              </div>
              
              <div>
                <label className="text-pf-text text-sm font-medium mb-2 block">
                  Requirements
                </label>
                <Input
                  value={inputs.requirements}
                  onChange={(e) => setInputs(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="Specific requirements..."
                  className="bg-pf-black border-pf-text-muted/30 text-pf-text"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-pf-text text-sm font-medium mb-2 block">
                    Tone
                  </label>
                  <select
                    value={inputs.tone}
                    onChange={(e) => setInputs(prev => ({ ...prev, tone: e.target.value }))}
                    className="w-full px-3 py-2 bg-pf-black border border-pf-text-muted/30 text-pf-text rounded-md"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Casual">Casual</option>
                    <option value="Friendly">Friendly</option>
                    <option value="Formal">Formal</option>
                    <option value="Creative">Creative</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-pf-text text-sm font-medium mb-2 block">
                    Length
                  </label>
                  <select
                    value={inputs.length}
                    onChange={(e) => setInputs(prev => ({ ...prev, length: e.target.value }))}
                    className="w-full px-3 py-2 bg-pf-black border border-pf-text-muted/30 text-pf-text rounded-md"
                  >
                    <option value="200 words">200 words</option>
                    <option value="500 words">500 words</option>
                    <option value="1000 words">1000 words</option>
                    <option value="2000 words">2000 words</option>
                  </select>
                </div>
              </div>
              
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !inputs.topic}
                className="w-full bg-gold-industrial text-pf-black hover:bg-gold-industrial-dark"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Optimization Panel */}
          {generatedContent && (
            <Card className="bg-pf-surface border-pf-text-muted/30">
              <CardHeader>
                <CardTitle className="text-pf-text flex items-center gap-2">
                  <Zap className="w-5 h-5 text-gold-industrial" />
                  Optimization
                </CardTitle>
                <CardDescription className="text-pf-text-muted">
                  Improve your generated content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-pf-text text-sm font-medium mb-2 block">
                    Optimization Goals
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {optimizationOptions.map((goal) => (
                      <Badge
                        key={goal}
                        className={`cursor-pointer transition-all ${
                          optimizationGoals.includes(goal)
                            ? 'bg-gold-industrial text-pf-black'
                            : 'bg-pf-black text-pf-text-muted hover:bg-pf-text-muted/20'
                        }`}
                        onClick={() => toggleOptimizationGoal(goal)}
                      >
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                    className="flex-1 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                  >
                    {isOptimizing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Optimize
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Analyze
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Output Panel */}
        <div className="space-y-6">
          {/* Generated Content */}
          {generatedContent && (
            <Card className="bg-pf-surface border-pf-text-muted/30">
              <CardHeader>
                <CardTitle className="text-pf-text flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Generated Content
                </CardTitle>
                {generationResult?.usage && (
                  <div className="flex gap-4 text-sm text-pf-text-muted">
                    <span>Tokens: {generationResult.usage.totalTokens}</span>
                    <span>Model: {generationResult.model}</span>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="bg-pf-black p-4 rounded-lg border border-pf-text-muted/30">
                  <pre className="text-pf-text whitespace-pre-wrap font-mono text-sm">
                    {generatedContent}
                  </pre>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => navigator.clipboard.writeText(generatedContent)}
                    className="bg-pf-text-muted/20 text-pf-text-muted hover:bg-pf-text-muted/30"
                  >
                    Copy
                  </Button>
                  <Button
                    onClick={() => {
                      const blob = new Blob([generatedContent], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'generated-content.txt'
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    className="bg-pf-text-muted/20 text-pf-text-muted hover:bg-pf-text-muted/30"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Optimized Content */}
          {optimizedContent && (
            <Card className="bg-pf-surface border-pf-text-muted/30">
              <CardHeader>
                <CardTitle className="text-pf-text flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  Optimized Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-pf-black p-4 rounded-lg border border-pf-text-muted/30">
                  <pre className="text-pf-text whitespace-pre-wrap font-mono text-sm">
                    {optimizedContent}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <Card className="bg-pf-surface border-pf-text-muted/30">
              <CardHeader>
                <CardTitle className="text-pf-text flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  Content Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-pf-black p-4 rounded-lg border border-pf-text-muted/30">
                  <pre className="text-pf-text whitespace-pre-wrap font-mono text-sm">
                    {analysisResult.success ? analysisResult.result : analysisResult.error}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {generationResult && !generationResult.success && (
            <Card className="bg-red-500/10 border-red-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Generation Failed</span>
                </div>
                <p className="text-red-300 mt-2">{generationResult.error}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
