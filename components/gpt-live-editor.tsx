"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Zap, 
  Play, 
  Brain, 
  Target,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Lock,
  RefreshCw
} from 'lucide-react'
import { EntitlementGate, EntitlementGateButton } from '@/components/entitlement-gate'
import { useEntitlements } from '@/hooks/use-entitlements'
import { useToast } from '@/hooks/use-toast'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Skeleton, SkeletonCard, SkeletonText } from '@/components/ui/skeleton'
import { 
  NoPromptsEmptyState, 
  NoTestsEmptyState, 
  ErrorEmptyState 
} from '@/components/ui/empty-state'

interface SevenDParams {
  domain?: string
  scale?: string
  urgency?: string
  complexity?: string
  resources?: string
  application?: string
  outputFormat?: string
}

interface TestResult {
  response: string
  model: string
  scores: {
    clarity: number
    specificity: number
    completeness: number
    relevance: number
    overall: number
  }
  breakdown: {
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
  }
  verdict: 'pass' | 'fail' | 'needs_improvement'
  tightenedPrompt?: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  latency: number
  testType: string
}

interface EditorResult {
  editedPrompt: string
  scores: {
    clarity: number
    specificity: number
    completeness: number
    overall: number
  }
  suggestions: string[]
}

export function GptLiveEditor({ orgId }: { orgId: string }) {
  const [activeTab, setActiveTab] = useState<'editor' | 'test'>('editor')
  const [prompt, setPrompt] = useState('')
  const [sevenD, setSevenD] = useState<SevenDParams>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [editorResult, setEditorResult] = useState<EditorResult | null>(null)
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [testType, setTestType] = useState<'mock' | 'real'>('mock')
  const [autoTighten, setAutoTighten] = useState(false)
  const [editorError, setEditorError] = useState<string | null>(null)
  const [testError, setTestError] = useState<string | null>(null)
  
  const { hasEntitlement } = useEntitlements(orgId)
  const { toast } = useToast()

  const handleEditorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim() || prompt.length < 64) {
      toast({
        title: "Prompt too short",
        description: "Please enter a prompt with at least 64 characters",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)
    setEditorError(null)
    
    try {
      const response = await fetch('/api/gpt-editor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          sevenD,
          orgId
        })
      })

      if (!response.ok) {
        if (response.status === 403) {
          const errorData = await response.json()
          if (errorData.error === 'ENTITLEMENT_REQUIRED') {
            setEditorError('Pro plan required for AI prompt optimization')
            toast({
              title: "Pro plan required",
              description: "AI prompt optimization requires Pro plan or higher",
              variant: "destructive"
            })
            return
          }
        }
        throw new Error(`Editor failed: ${response.status}`)
      }

      const data = await response.json()
      setEditorResult(data)
      
      toast({
        title: "Prompt optimized!",
        description: `Score: ${data.scores.overall}/100`,
      })
    } catch (error) {
      console.error('Editor error:', error)
      setEditorError('Failed to optimize prompt. Please try again.')
      toast({
        title: "Optimization failed",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt to test",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)
    setTestError(null)
    
    try {
      const response = await fetch('/api/gpt-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          testType,
          sevenD,
          orgId,
          options: {
            autoTighten
          }
        })
      })

      if (!response.ok) {
        if (response.status === 403) {
          const errorData = await response.json()
          if (errorData.error === 'ENTITLEMENT_REQUIRED') {
            setTestError('Pro plan required for real GPT testing')
            toast({
              title: "Pro plan required",
              description: "Real GPT testing requires Pro plan or higher",
              variant: "destructive"
            })
            return
          }
        }
        throw new Error(`Test failed: ${response.status}`)
      }

      const data = await response.json()
      setTestResult(data.result)
      
      toast({
        title: "Test completed!",
        description: `Score: ${data.result.scores.overall}/100 - ${data.result.verdict.toUpperCase()}`,
      })
    } catch (error) {
      console.error('Test error:', error)
      setTestError('Failed to run test. Please try again.')
      toast({
        title: "Test failed",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const retryEditor = () => {
    setEditorError(null)
    handleEditorSubmit({ preventDefault: () => {} } as React.FormEvent)
  }

  const retryTest = () => {
    setTestError(null)
    handleTestSubmit({ preventDefault: () => {} } as React.FormEvent)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'pass': return 'bg-green-100 text-green-800 border-green-200'
      case 'needs_improvement': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'fail': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">GPT Live Editor & Test</h2>
        <p className="text-gray-600">
          Optimize your prompts and test them with AI-powered analysis
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'editor' | 'test')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Prompt Editor
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Prompt Test
          </TabsTrigger>
        </TabsList>

        {/* Editor Tab */}
        <TabsContent value="editor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI Prompt Optimizer
                <Badge variant="secondary" className="ml-auto">Free</Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Get AI-powered suggestions to improve your prompt quality and structure
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditorSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Your Prompt</Label>
                  <Textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt here (minimum 64 characters)..."
                    className="min-h-32"
                    required
                  />
                  <div className="text-xs text-gray-500">
                    {prompt.length}/64 characters minimum
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing || prompt.length < 64}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Optimize Prompt
                    </>
                  )}
                </Button>
              </form>

              {/* Error State */}
              {editorError && (
                <ErrorEmptyState
                  title="Optimization Failed"
                  description={editorError}
                  action={{
                    label: "Retry",
                    onClick: retryEditor,
                    icon: RefreshCw
                  }}
                />
              )}

              {/* Results */}
              {editorResult && !editorError && (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(editorResult.scores.overall)}`}>
                        {editorResult.scores.overall}
                      </div>
                      <div className="text-sm text-gray-600">Overall Score</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Clarity</span>
                        <span className={getScoreColor(editorResult.scores.clarity)}>
                          {editorResult.scores.clarity}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Specificity</span>
                        <span className={getScoreColor(editorResult.scores.specificity)}>
                          {editorResult.scores.specificity}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Completeness</span>
                        <span className={getScoreColor(editorResult.scores.completeness)}>
                          {editorResult.scores.completeness}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Optimized Prompt</h4>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{editorResult.editedPrompt}</p>
                    </div>
                  </div>

                  {editorResult.suggestions.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Suggestions</h4>
                      <ul className="space-y-2">
                        {editorResult.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Empty State */}
              {!editorResult && !editorError && !isProcessing && (
                <NoPromptsEmptyState
                  title="No prompt to optimize"
                  description="Enter a prompt above to get AI-powered optimization suggestions"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Tab */}
        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Prompt Testing
                <Badge variant="secondary" className="ml-auto">
                  {testType === 'real' ? 'Pro' : 'Free'}
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">
                Test your prompts with AI analysis and get detailed feedback
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTestSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="test-prompt">Prompt to Test</Label>
                  <Textarea
                    id="test-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter the prompt you want to test..."
                    className="min-h-32"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Test Type</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={testType === 'mock' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTestType('mock')}
                      >
                        Mock Test
                      </Button>
                      <EntitlementGateButton
                        flag="canUseGptTestReal"
                        featureName="Real GPT Testing"
                        planRequired="pro"
                        variant={testType === 'real' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTestType('real')}
                      >
                        Real Test
                      </EntitlementGateButton>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Options</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="auto-tighten"
                        checked={autoTighten}
                        onChange={(e) => setAutoTighten(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="auto-tighten" className="text-sm">
                        Auto-tighten prompt
                      </Label>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing || !prompt.trim()}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Test
                    </>
                  )}
                </Button>
              </form>

              {/* Error State */}
              {testError && (
                <ErrorEmptyState
                  title="Test Failed"
                  description={testError}
                  action={{
                    label: "Retry",
                    onClick: retryTest,
                    icon: RefreshCw
                  }}
                />
              )}

              {/* Results */}
              {testResult && !testError && (
                <div className="mt-6 space-y-6">
                  {/* Score Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(testResult.scores.overall)}`}>
                        {testResult.scores.overall}
                      </div>
                      <div className="text-sm text-gray-600">Overall</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-xl font-semibold ${getScoreColor(testResult.scores.clarity)}`}>
                        {testResult.scores.clarity}
                      </div>
                      <div className="text-xs text-gray-600">Clarity</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-xl font-semibold ${getScoreColor(testResult.scores.specificity)}`}>
                        {testResult.scores.specificity}
                      </div>
                      <div className="text-xs text-gray-600">Specificity</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-xl font-semibold ${getScoreColor(testResult.scores.completeness)}`}>
                        {testResult.scores.completeness}
                      </div>
                      <div className="text-xs text-gray-600">Completeness</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-xl font-semibold ${getScoreColor(testResult.scores.relevance)}`}>
                        {testResult.scores.relevance}
                      </div>
                      <div className="text-xs text-gray-600">Relevance</div>
                    </div>
                  </div>

                  {/* Verdict */}
                  <div className="text-center">
                    <Badge className={`px-4 py-2 text-lg ${getVerdictColor(testResult.verdict)}`}>
                      {testResult.verdict.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium">Strengths</h4>
                      <ul className="space-y-2">
                        {testResult.breakdown.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Areas for Improvement</h4>
                      <ul className="space-y-2">
                        {testResult.breakdown.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {testResult.breakdown.recommendations.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Recommendations</h4>
                      <ul className="space-y-2">
                        {testResult.breakdown.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Usage Stats */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Test Details</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Model:</span>
                        <div className="font-medium">{testResult.model}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Latency:</span>
                        <div className="font-medium">{testResult.latency}ms</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Tokens:</span>
                        <div className="font-medium">{testResult.usage.totalTokens}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <div className="font-medium capitalize">{testResult.testType}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!testResult && !testError && !isProcessing && (
                <NoTestsEmptyState
                  title="No test results yet"
                  description="Enter a prompt and run a test to see detailed analysis"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
