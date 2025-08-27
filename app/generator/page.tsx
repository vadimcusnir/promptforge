"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Settings,
  Zap,
  TestTube,
  History,
  Download,
  Search,
  Filter,
  Lock,
  Copy,
  CheckCircle,
  AlertCircle,
  Info,
  RefreshCw,
} from "lucide-react"
import { EntitlementGate } from "@/components/entitlement-gate"
import { useEntitlements } from "@/hooks/use-entitlements"
import { useAnalytics } from "@/hooks/use-analytics"
import { default7D, paramOptions, type Params7D } from "@/lib/default-params"
import { COMPLETE_MODULES_CATALOG } from "@/lib/modules"
import { PromptForm } from "@/components/generator/PromptForm"
import { ExportModal } from "@/components/export-modal"
import { generatePrompt, createPromptRun, simulateGptResponse, PromptRun } from "@/utils/promptCompiler"
import { FormData } from "@/utils/parseInputSchema"
import { LoadingSpinner, LoadingState } from "@/components/loading-spinner"
import { 
  NoPromptsEmptyState, 
  NoTestsEmptyState, 
  NoHistoryEmptyState,
  ErrorEmptyState 
} from "@/components/ui/empty-state"
import { Skeleton, SkeletonCard, SkeletonButton, SkeletonInput } from "@/components/ui/skeleton"

// Legacy interface for backward compatibility
interface GeneratedPrompt {
  id: string
  content: string
  module: string
  params: Params7D
  timestamp: string
  hash: string
  scores?: {
    structure: number
    clarity: number
    kpi_compliance: number
    executability: number
  }
}

function GeneratorPage() {
  const { hasEntitlement } = useEntitlements()
  const { toast } = useToast()
  const analytics = useAnalytics()
  const searchParams = useSearchParams()
  const [selectedModule, setSelectedModule] = useState("M01")
  const [params7D, setParams7D] = useState<Params7D>(default7D)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [isExporting] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null)
  const [history, setHistory] = useState<GeneratedPrompt[]>([])
  const [currentPromptRun, setCurrentPromptRun] = useState<PromptRun | null>(null)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [historyError, setHistoryError] = useState<string | null>(null)
  
  interface TestResults {
    type: "live" | "simulation"
    scores: {
      structure: number
      clarity: number
      kpi_compliance: number
      executability: number
    }
    timestamp: string
  }

  const [testResults, setTestResults] = useState<TestResults | null>(null)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoadingHistory(true)
        setHistoryError(null)
        
        const savedHistory = localStorage.getItem("promptforge_history")
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory))
        }
      } catch (error) {
        console.error('Failed to load history:', error)
        setHistoryError('Failed to load generation history')
        toast({
          title: "History Load Error",
          description: "Could not load your generation history",
          variant: "destructive",
        })
      } finally {
        setIsLoadingHistory(false)
      }
    }

    loadHistory()
  }, [toast])

  useEffect(() => {
    const urlParams: Partial<Params7D> = {}

    // Extract 7D parameters from URL
    Object.keys(default7D).forEach((key) => {
      const value = searchParams.get(key)
      if (value) {
        urlParams[key as keyof Params7D] = value
      }
    })

    // Extract module from URL
    const moduleParam = searchParams.get("module")
    if (moduleParam) {
      setSelectedModule(moduleParam)
    }

    // Merge URL params with defaults
    setParams7D({ ...default7D, ...urlParams })
  }, [searchParams])

  const updateParam = (key: keyof Params7D, value: string) => {
    setParams7D((prev) => ({ ...prev, [key]: value }))
  }

  // New handler for dynamic form submission
  const handleFormSubmit = async (formData: FormData) => {
    if (!currentModule) return
    
    setIsGenerating(true)
    try {
      // Generate prompt using the new compiler
      generatePrompt(currentModule, formData)
      
      // Create prompt run
      const promptRun = createPromptRun(currentModule, formData, userPlan)
      setCurrentPromptRun(promptRun)
      
      // Create legacy prompt for backward compatibility
      const prompt: GeneratedPrompt = {
        id: promptRun.id,
        content: promptRun.prompt,
        module: promptRun.moduleId,
        params: { ...params7D },
        timestamp: promptRun.timestamp,
        hash: promptRun.hash,
      }
      
      setGeneratedPrompt(prompt)

      // Save to history
      const newHistory = [prompt, ...history.slice(0, 9)]
      setHistory(newHistory)
      localStorage.setItem("promptforge_history", JSON.stringify(newHistory))

      toast({
        title: "Prompt Generated Successfully",
        description: `Run ID: ${promptRun.id}`,
        duration: 3000,
      })
    } catch (error) {
      console.error('Generation error:', error)
      toast({
        title: "Generation Failed",
        description: "Please try again",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleTest = async (type: "live" | "simulation") => {
    if (!generatedPrompt) {
      toast({
        title: "No Prompt to Test",
        description: "Generate a prompt first",
        variant: "destructive",
      })
      return
    }

    setIsTesting(true)
    try {
      if (type === "simulation") {
        // Use the new simulation function
        const result = await simulateGptResponse(generatedPrompt.content)
        
        if (result.scores) {
          setTestResults({
            type,
            scores: result.scores,
            timestamp: new Date().toISOString(),
          })
        }

        // Update current prompt run with scores
        if (currentPromptRun && result.scores) {
          const updatedRun = {
            ...currentPromptRun,
            scores: result.scores,
            tokensUsed: result.tokensUsed,
            cost: result.cost
          }
          setCurrentPromptRun(updatedRun)
        }

        toast({
          title: "Simulation Test Complete",
          description: `Average score: ${result.scores ? Math.round(Object.values(result.scores).reduce((a, b) => a + b, 0) / 4) : 'N/A'}`,
        })
      } else {
        // Live test - would call actual API
        await new Promise((resolve) => setTimeout(resolve, 3000))

        const scores = {
          structure: Math.floor(Math.random() * 20) + 80,
          clarity: Math.floor(Math.random() * 20) + 80,
          kpi_compliance: Math.floor(Math.random() * 20) + 70,
          executability: Math.floor(Math.random() * 20) + 85,
        }

        setTestResults({
          type,
          scores,
          timestamp: new Date().toISOString(),
        })

        toast({
          title: "Live GPT Test Complete",
          description: `Average score: ${Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 4)}`,
        })
      }
    } catch (error) {
      console.error('Test error:', error)
      toast({
        title: "Test Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
    }
  }

  const handleCopy = async () => {
    if (!generatedPrompt) return

    try {
      await navigator.clipboard.writeText(generatedPrompt.content)
      toast({
        title: "Copied to Clipboard",
        description: "Prompt copied successfully",
      })
    } catch (error) {
      console.error('Copy error:', error)
      toast({
        title: "Copy Failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const retryHistoryLoad = () => {
    setHistoryError(null)
    setIsLoadingHistory(true)
    // Reload history
    const savedHistory = localStorage.getItem("promptforge_history")
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (error) {
        setHistoryError('Failed to parse history data')
      }
    }
    setIsLoadingHistory(false)
  }

  // Get available modules from the catalog
  const availableModules = Object.values(COMPLETE_MODULES_CATALOG).filter(module => module.is_active)
  
  // Legacy modules array for backward compatibility
  const modules = [
    { id: "M01", name: "SOP Forge", vector: "Strategic", moduleNumber: 1, plan: "free" },
    { id: "M07", name: "Risk Reversal", vector: "Strategic", moduleNumber: 7, plan: "creator" },
    { id: "M10", name: "Funnel Nota", vector: "Rhetoric", moduleNumber: 10, plan: "free" },
    { id: "M11", name: "Visibility Diag", vector: "Strategic", moduleNumber: 11, plan: "creator" },
    { id: "M12", name: "Pricing Psych", vector: "Rhetoric", moduleNumber: 12, plan: "creator" },
    { id: "M18", name: "Content Audit", vector: "Content", moduleNumber: 18, plan: "free" },
    { id: "M25", name: "Brand Voice", vector: "Branding", moduleNumber: 25, plan: "creator" },
    { id: "M35", name: "Crisis Comm", vector: "Crisis", moduleNumber: 35, plan: "pro" },
    { id: "M45", name: "Analytics Deep", vector: "Analytics", moduleNumber: 45, plan: "creator" },
  ]

  const userPlan = "free" // Default plan for now
  const freeModules = ["M01", "M10", "M18"]
  
  // Get current selected module definition
  const currentModule = availableModules.find(m => m.id === selectedModule) || availableModules[0]

  // Loading skeleton for module selection
  const ModuleSelectionSkeleton = () => (
    <Card className="bg-zinc-900/80 border border-zinc-700">
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        <SkeletonInput />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2 max-h-96">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} className="p-3" />
          ))}
        </div>
      </CardContent>
    </Card>
  )

  // Loading skeleton for main content
  const MainContentSkeleton = () => (
    <div className="space-y-6">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )

  return (
    <div className="min-h-screen pattern-bg text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-serif mb-4">Prompt Generator</h1>
          <p className="text-xl text-gray-400">Configure, generate, and export industrial-grade prompts</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Panel - Module Selection */}
          <div className="lg:col-span-1">
            <Card className="bg-zinc-900/80 border border-zinc-700">
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  <Filter className="w-5 h-5 text-yellow-400" />
                  Module Library
                </CardTitle>
                <CardDescription>Select from 50 operational modules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input placeholder="Search modules..." className="pl-10 bg-black/50 border-gray-700" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-300">Filter by Vector</Label>
                  <Select>
                    <SelectTrigger className="bg-black/50 border-gray-700">
                      <SelectValue placeholder="All vectors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strategic">Strategic</SelectItem>
                      <SelectItem value="rhetoric">Rhetoric</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                      <SelectItem value="branding">Branding</SelectItem>
                      <SelectItem value="crisis">Crisis</SelectItem>
                      <SelectItem value="cognitive">Cognitive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {modules.map((module) => {
                    const isLocked = userPlan === "free" && !freeModules.includes(module.id)
                    const requiredPlan = module.plan

                    return (
                      <div key={module.id}>
                        {isLocked ? (
                          <EntitlementGate
                            flag="canUseAllModules"
                            featureName={`Module ${module.id}`}
                            planRequired="pro"
                          >
                            <Card className="cursor-not-allowed opacity-50 border-gray-600">
                              <CardContent className="p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-mono text-sm text-gray-500">{module.id}</span>
                                  <div className="flex items-center gap-2">
                                    <Lock className="w-3 h-3 text-gray-500" />
                                    <Badge variant="secondary" className="text-xs">
                                      {requiredPlan === "creator" ? "Creator+" : "Pro+"}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="font-medium text-sm mb-1 text-gray-500">{module.name}</div>
                                <Badge variant="outline" className="text-xs text-gray-500">
                                  {module.vector}
                                </Badge>
                              </CardContent>
                            </Card>
                          </EntitlementGate>
                        ) : (
                          <Card
                            className={`cursor-pointer transition-colors hover:border-yellow-400/50 ${
                              selectedModule === module.id ? "border-yellow-400" : ""
                            }`}
                            onClick={() => setSelectedModule(module.id)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-mono text-sm text-yellow-400">{module.id}</span>
                                {selectedModule === module.id && (
                                  <Badge className="text-xs bg-yellow-400 text-black">Active</Badge>
                                )}
                              </div>
                              <div className="font-medium text-sm mb-1">{module.name}</div>
                              <Badge variant="outline" className="text-xs">
                                {module.vector}
                              </Badge>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="config" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-black/50">
                <TabsTrigger
                  value="config"
                  className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  7D Config
                </TabsTrigger>
                <TabsTrigger
                  value="generator"
                  className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Generator
                </TabsTrigger>
                <TabsTrigger value="test" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Engine
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                >
                  <History className="w-4 h-4 mr-2" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="config">
                <Card className="bg-zinc-900/80 border border-zinc-700">
                  <CardHeader>
                    <CardTitle className="font-serif">7D Parameter Configuration</CardTitle>
                    <CardDescription>Configure the seven dimensions for optimal prompt generation</CardDescription>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-6">
                    {Object.entries(paramOptions).map(([key, options]) => (
                      <div key={key} className="space-y-2">
                        <Label className="capitalize">{key}</Label>
                        <Select
                          value={params7D[key as keyof Params7D]}
                          onValueChange={(value) => updateParam(key as keyof Params7D, value)}
                        >
                          <SelectTrigger className="bg-black/50 border-gray-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {options.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="generator">
                <div className="space-y-6">
                  {/* Dynamic Form */}
                  <PromptForm 
                    module={currentModule.id}
                    onSubmit={(prompt: string) => {
                      // Convert string prompt to FormData for the new system
                      const formData: FormData = {
                        prompt,
                        moduleId: currentModule.id,
                        // Add other required fields as needed
                      }
                      handleFormSubmit(formData)
                    }}
                    isSubmitting={isGenerating}
                  />

                  {/* Generated Prompt Display */}
                  {generatedPrompt && (
                    <Card className="bg-zinc-900/80 border border-zinc-700">
                      <CardHeader>
                        <CardTitle className="font-serif">Generated Prompt</CardTitle>
                        <CardDescription>
                          Your industrial-grade prompt ready for use
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="bg-black/50 border border-gray-700 rounded-lg p-4 min-h-96">
                          <div className="text-sm whitespace-pre-wrap">
                            {generatedPrompt.content}
                          </div>
                        </div>

                        {/* Prompt Metadata */}
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-400 space-y-1">
                            <div>Run ID: #{generatedPrompt.hash}</div>
                            <div>Generated: {new Date(generatedPrompt.timestamp).toLocaleString()}</div>
                            {currentPromptRun && (
                              <>
                                <div>Module: {currentPromptRun.moduleId}</div>
                                {currentPromptRun.tokensUsed && (
                                  <div>Tokens: {currentPromptRun.tokensUsed.toLocaleString()}</div>
                                )}
                                {currentPromptRun.cost && (
                                  <div>Cost: ${currentPromptRun.cost.toFixed(4)}</div>
                                )}
                              </>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleCopy}>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </Button>
                            
                            {currentPromptRun && (
                              <ExportModal 
                                promptRun={currentPromptRun}
                                userPlan={userPlan}
                                trigger={
                                  <Button variant="outline" size="sm">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                  </Button>
                                }
                              />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="test">
                <Card className="bg-zinc-900/80 border border-zinc-700">
                  <CardHeader>
                    <CardTitle className="font-serif">Test Engine</CardTitle>
                    <CardDescription>Validate prompt quality with simulated or live testing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="h-20 flex-col bg-transparent"
                        onClick={() => handleTest("simulation")}
                        disabled={isTesting || !generatedPrompt}
                      >
                        {isTesting ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <TestTube className="w-6 h-6 mb-2" />
                        )}
                        <span>{isTesting ? "Testing..." : "Simulate Test"}</span>
                        <span className="text-xs text-gray-400">Available on all plans</span>
                      </Button>
                      <EntitlementGate flag="canUseGptTestReal" featureName="Live GPT Testing" planRequired="pro">
                        <Button
                          variant="outline"
                          className="h-20 flex-col bg-transparent"
                          onClick={() => {
                            analytics.gptTestReal(selectedModule || 'unknown', { 
                              testType: 'live',
                              moduleId: selectedModule,
                              hasPrompt: !!generatedPrompt
                            })
                            handleTest("live")
                          }}
                          disabled={isTesting || !generatedPrompt}
                        >
                          {isTesting ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <Zap className="w-6 h-6 mb-2" />
                          )}
                          <span>{isTesting ? "Testing..." : "Live GPT Test"}</span>
                          <span className="text-xs text-gray-400">Real AI validation</span>
                        </Button>
                      </EntitlementGate>
                    </div>

                    <div className="bg-black/50 border border-gray-700 rounded-lg p-4">
                      <h4 className="font-medium mb-4">Test Results</h4>
                      {testResults ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            {testResults.type === "live" ? "Live GPT Test" : "Simulation Test"} completed
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-yellow-400">{testResults.scores.structure}</div>
                              <div className="text-sm text-gray-400">Structure</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-yellow-400">{testResults.scores.clarity}</div>
                              <div className="text-sm text-gray-400">Clarity</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-yellow-400">
                                {testResults.scores.kpi_compliance}
                              </div>
                              <div className="text-sm text-gray-400">KPI Compliance</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-yellow-400">
                                {testResults.scores.executability}
                              </div>
                              <div className="text-sm text-gray-400">Executability</div>
                            </div>
                          </div>
                          
                          {/* Additional Test Information */}
                          {currentPromptRun && (
                            <div className="border-t border-gray-700 pt-4">
                              <h5 className="font-medium mb-2">Test Details</h5>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Test Type:</span>
                                  <div className="font-medium">{testResults.type === "live" ? "Live GPT" : "Simulation"}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Run ID:</span>
                                  <div className="font-mono text-xs">{currentPromptRun.id}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Module:</span>
                                  <div className="font-medium">{currentPromptRun.moduleId}</div>
                                </div>
                                {currentPromptRun.tokensUsed && (
                                  <div>
                                    <span className="text-gray-500">Tokens Used:</span>
                                    <div className="font-medium">{currentPromptRun.tokensUsed.toLocaleString()}</div>
                                  </div>
                                )}
                                {currentPromptRun.cost && (
                                  <div>
                                    <span className="text-gray-500">Cost:</span>
                                    <div className="font-medium">${currentPromptRun.cost.toFixed(4)}</div>
                                  </div>
                                )}
                                <div>
                                  <span className="text-gray-500">Timestamp:</span>
                                  <div className="text-xs">{new Date(testResults.timestamp).toLocaleString()}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <NoTestsEmptyState
                          title="No test results yet"
                          description="Generate a prompt and run a test to see results"
                          action={{
                            label: "Generate Prompt",
                            onClick: () => {
                              const generatorTab = document.querySelector('[value="generator"]') as HTMLElement
                              if (generatorTab) generatorTab.click()
                            },
                            variant: "outline"
                          }}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card className="bg-zinc-900/80 border border-zinc-700">
                  <CardHeader>
                    <CardTitle className="font-serif">Generation History</CardTitle>
                    <CardDescription>View and manage your previous prompt generations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingHistory ? (
                      <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <SkeletonCard key={i} className="bg-black/30 border-gray-700" />
                        ))}
                      </div>
                    ) : historyError ? (
                      <ErrorEmptyState
                        title="Failed to Load History"
                        description={historyError}
                        action={{
                          label: "Retry",
                          onClick: retryHistoryLoad,
                          icon: RefreshCw
                        }}
                      />
                    ) : history.length > 0 ? (
                      <div className="space-y-4">
                        {history.map((prompt) => (
                          <Card key={prompt.id} className="bg-black/30 border-gray-700">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {prompt.module}
                                  </Badge>
                                  <span className="text-sm text-gray-400">#{prompt.hash}</span>
                                </div>
                                <span className="text-xs text-gray-400">
                                  {new Date(prompt.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                                {prompt.content.substring(0, 150)}...
                              </p>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setGeneratedPrompt(prompt)}>
                                  Load
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigator.clipboard.writeText(prompt.content)}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // Find the corresponding prompt run
                                    const run = history.find(h => h.id === prompt.id)
                                    if (run) {
                                      // Convert legacy prompt to prompt run format
                                      const promptRun: PromptRun = {
                                        id: run.id,
                                        moduleId: run.module,
                                        prompt: run.content,
                                        inputValues: {},
                                        timestamp: run.timestamp,
                                        hash: run.hash,
                                        plan: userPlan
                                      }
                                      setCurrentPromptRun(promptRun)
                                    }
                                  }}
                                >
                                  <Info className="w-3 h-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                                              <NoHistoryEmptyState
                          title="No generation history yet"
                          description="Start generating prompts to see your history here"
                          action={{
                            label: "Generate First Prompt",
                            onClick: () => {
                              const generatorTab = document.querySelector('[value="generator"]') as HTMLElement
                              if (generatorTab) generatorTab.click()
                            },
                            variant: "outline"
                          }}
                        />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

function GeneratorPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-slate-400 mt-4">Loading generator...</p>
        </div>
      </div>
    }>
      <GeneratorPage />
    </Suspense>
  );
}

export default GeneratorPageWrapper;
