"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
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
  Mic,
  MicOff,
  Move,
  Plus,
  X,
  Lightbulb,
} from "lucide-react"
import { EntitlementGate } from "@/components/entitlement-gate"
import { useEntitlements } from "@/hooks/use-entitlements"
import { default7D, paramOptions, type Params7D } from "@/lib/default-params"

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

interface PromptBlock {
  id: string
  type: "step" | "guardrail" | "export"
  content: string
  order: number
}

export default function GeneratorPage() {
  const { checkEntitlement, getEntitlement } = useEntitlements()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [selectedModule, setSelectedModule] = useState("M01")
  const [params7D, setParams7D] = useState<Params7D>(default7D)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null)
  const [history, setHistory] = useState<GeneratedPrompt[]>([])
  const [testResults, setTestResults] = useState<any>(null)
  const [promptBlocks, setPromptBlocks] = useState<PromptBlock[]>([])
  const [autoCompleteInput, setAutoCompleteInput] = useState("")
  const [autoCompleteSuggestions, setAutoCompleteSuggestions] = useState<string[]>([])
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])

  useEffect(() => {
    setPromptBlocks([
      { id: "step1", type: "step", content: "Define the objective and context", order: 1 },
      { id: "guardrail1", type: "guardrail", content: "Ensure output follows specified format", order: 2 },
      { id: "export1", type: "export", content: "Export as structured document", order: 3 },
    ])
  }, [])

  useEffect(() => {
    const savedHistory = localStorage.getItem("promptforge_history")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

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

  const handleAutoComplete = (input: string) => {
    setAutoCompleteInput(input)

    if (input.length < 2) {
      setAutoCompleteSuggestions([])
      return
    }

    // Context-aware suggestions based on current module and domain
    const suggestions = [
      `Analyze ${params7D.domain} market trends for ${input}`,
      `Create ${params7D.scale} strategy for ${input}`,
      `Develop ${params7D.complexity} approach to ${input}`,
      `Implement ${input} with ${params7D.resources} resources`,
      `Generate ${params7D.output} format for ${input}`,
    ].slice(0, 5)

    setAutoCompleteSuggestions(suggestions)
  }

  const startRecording = async () => {
    if (!checkEntitlement("canUseVoiceToPrompt")) {
      toast({
        title: "Voice-to-Prompt Locked",
        description: "Upgrade to Pro to use voice input",
        variant: "destructive",
      })
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        setAudioChunks((prev) => [...prev, event.data])
      }

      mediaRecorder.onstop = () => {
        // Simulate transcription
        setTimeout(() => {
          const transcribedText =
            "Create a comprehensive marketing strategy for e-commerce platform targeting millennials"
          setAutoCompleteInput(transcribedText)
          toast({
            title: "Voice Transcribed",
            description: "Audio converted to text successfully",
          })
        }, 1000)
      }

      mediaRecorder.start()
      setIsRecording(true)

      toast({
        title: "Recording Started",
        description: "Speak your prompt requirements",
      })
    } catch (error) {
      toast({
        title: "Recording Failed",
        description: "Please check microphone permissions",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setAudioChunks([])
    }
  }

  const handleDragStart = (blockId: string) => {
    setDraggedBlock(blockId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetOrder: number) => {
    e.preventDefault()
    if (!draggedBlock) return

    const draggedBlockData = promptBlocks.find((block) => block.id === draggedBlock)
    if (!draggedBlockData) return

    const updatedBlocks = promptBlocks.map((block) => {
      if (block.id === draggedBlock) {
        return { ...block, order: targetOrder }
      } else if (block.order >= targetOrder) {
        return { ...block, order: block.order + 1 }
      }
      return block
    })

    setPromptBlocks(updatedBlocks.sort((a, b) => a.order - b.order))
    setDraggedBlock(null)
  }

  const addPromptBlock = (type: "step" | "guardrail" | "export") => {
    if (!checkEntitlement("canUseDragDrop")) {
      toast({
        title: "Drag & Drop Locked",
        description: "Upgrade to Creator+ to use drag & drop builder",
        variant: "destructive",
      })
      return
    }

    const newBlock: PromptBlock = {
      id: `${type}_${Date.now()}`,
      type,
      content: `New ${type}`,
      order: promptBlocks.length + 1,
    }
    setPromptBlocks([...promptBlocks, newBlock])
  }

  const removePromptBlock = (blockId: string) => {
    setPromptBlocks(promptBlocks.filter((block) => block.id !== blockId))
  }

  const updatePromptBlock = (blockId: string, content: string) => {
    setPromptBlocks(promptBlocks.map((block) => (block.id === blockId ? { ...block, content } : block)))
  }

  // ... existing code for handleGenerate, handleTest, handleExport, handleCopy ...

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const blocksContent = promptBlocks
        .sort((a, b) => a.order - b.order)
        .map((block) => `## ${block.type.toUpperCase()}: ${block.content}`)
        .join("\n\n")

      const prompt: GeneratedPrompt = {
        id: `run_${Date.now()}`,
        content: `# ${modules.find((m) => m.id === selectedModule)?.name} Prompt

## Context
Domain: ${params7D.domain}
Scale: ${params7D.scale}
Urgency: ${params7D.urgency}

${blocksContent}

## 7D Configuration
- Domain: ${params7D.domain}
- Scale: ${params7D.scale}
- Urgency: ${params7D.urgency}
- Complexity: ${params7D.complexity}
- Resources: ${params7D.resources}
- Application: ${params7D.application}
- Output: ${params7D.output}

---
Generated by PromptForge™ Core Engine | Module: ${selectedModule} | Hash: ${Math.random().toString(36).substring(7)}`,
        module: selectedModule,
        params: { ...params7D },
        timestamp: new Date().toISOString(),
        hash: Math.random().toString(36).substring(7),
      }

      setGeneratedPrompt(prompt)

      // Save to history
      const newHistory = [prompt, ...history.slice(0, 9)] // Keep last 10
      setHistory(newHistory)
      localStorage.setItem("promptforge_history", JSON.stringify(newHistory))

      toast({
        title: "Prompt Generated Successfully",
        description: `Run ID: ${prompt.id}`,
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleTest = async (type: "simulate" | "live") => {
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
        title: `${type === "live" ? "Live GPT" : "Simulation"} Test Complete`,
        description: `Average score: ${Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 4)}`,
      })
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
    }
  }

  const handleExport = async (format: "txt" | "md" | "pdf" | "json" | "zip") => {
    if (!generatedPrompt) {
      toast({
        title: "No Prompt to Export",
        description: "Generate a prompt first",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate file download
      const blob = new Blob([generatedPrompt.content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `prompt_${generatedPrompt.hash}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Export Successful",
        description: `Prompt exported as ${format.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
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
      toast({
        title: "Copy Failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const modules = [
    { id: "M01", name: "Strategic Framework", vector: "Strategic", level: "Advanced", moduleNumber: 1, plan: "free" },
    { id: "M07", name: "Risk Reversal", vector: "Strategic", level: "Expert", moduleNumber: 7, plan: "creator" },
    { id: "M10", name: "Content Engine", vector: "Content", level: "Intermediate", moduleNumber: 10, plan: "free" },
    { id: "M11", name: "Visibility Diag", vector: "Strategic", level: "Advanced", moduleNumber: 11, plan: "creator" },
    { id: "M12", name: "Pricing Psych", vector: "Rhetoric", level: "Expert", moduleNumber: 12, plan: "creator" },
    { id: "M18", name: "Crisis Management", vector: "Crisis", level: "Expert", moduleNumber: 18, plan: "free" },
    { id: "M25", name: "Brand Voice", vector: "Branding", level: "Intermediate", moduleNumber: 25, plan: "creator" },
    { id: "M35", name: "Crisis Comm", vector: "Crisis", level: "Advanced", moduleNumber: 35, plan: "pro" },
    { id: "M45", name: "Analytics Deep", vector: "Analytics", level: "Expert", moduleNumber: 45, plan: "pro" },
  ]

  const userPlan = (getEntitlement("plan") as string) || "free"
  const freeModules = ["M01", "M10", "M18"]

  const getSetParametersCount = () => {
    return Object.values(params7D).filter((value) => value && value !== "").length
  }

  const copyRunId = async (runId: string) => {
    try {
      await navigator.clipboard.writeText(runId)
      toast({
        title: "Run ID Copied",
        description: `${runId} copied to clipboard`,
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen pattern-bg text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-serif mb-4">Core Engine with 3 Essential Functions</h1>
          <p className="text-xl text-gray-400">
            Build prompts in &lt;60s with Smart Auto-Complete, Drag&Drop Builder, and Voice-to-Prompt
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Panel - Quick Actions Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-serif text-lg">3 Core Functions</CardTitle>
                <CardDescription>Essential prompt building tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Smart Auto-Complete</Label>
                  <div className="relative">
                    <Input
                      placeholder="Start typing for suggestions..."
                      value={autoCompleteInput}
                      onChange={(e) => handleAutoComplete(e.target.value)}
                      className="bg-black/50 border-gray-700"
                    />
                    <Lightbulb className="absolute right-3 top-3 w-4 h-4 text-yellow-400" />
                  </div>
                  {autoCompleteSuggestions.length > 0 && (
                    <div className="bg-black/80 border border-gray-700 rounded-md p-2 space-y-1">
                      {autoCompleteSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          className="w-full text-left text-sm p-2 hover:bg-gray-700 rounded"
                          onClick={() => setAutoCompleteInput(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Voice-to-Prompt</Label>
                  <EntitlementGate flag="canUseVoiceToPrompt" requiredPlan="pro" feature="Voice Input">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={userPlan === "free" || userPlan === "creator"}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-4 h-4 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4 mr-2" />
                          {userPlan === "free" || userPlan === "creator" ? (
                            <>
                              <Lock className="w-3 h-3 mr-1" />
                              Voice Input (Pro+)
                            </>
                          ) : (
                            "Start Voice Input"
                          )}
                        </>
                      )}
                    </Button>
                  </EntitlementGate>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Drag & Drop Blocks</Label>
                  <EntitlementGate flag="canUseDragDrop" requiredPlan="creator" feature="Drag & Drop Builder">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addPromptBlock("step")}
                        disabled={userPlan === "free"}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Step
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addPromptBlock("guardrail")}
                        disabled={userPlan === "free"}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Guard
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addPromptBlock("export")}
                        disabled={userPlan === "free"}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </EntitlementGate>
                </div>
              </CardContent>
            </Card>

            {/* ... existing code for Status card ... */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm text-gray-400">Selected Module</Label>
                  <div className="font-mono text-yellow-400">{selectedModule}</div>
                  <div className="text-sm text-gray-300">{modules.find((m) => m.id === selectedModule)?.name}</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-400">Parameters Set</Label>
                  <div className="text-lg font-bold">{getSetParametersCount()}/7</div>
                </div>
                <div>
                  <Label className="text-sm text-gray-400">Last Run</Label>
                  <div className="text-sm text-gray-300">
                    {generatedPrompt ? new Date(generatedPrompt.timestamp).toLocaleString() : "Never"}
                  </div>
                </div>
                {generatedPrompt && (
                  <div>
                    <Label className="text-sm text-gray-400">Run ID</Label>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{generatedPrompt.id}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyRunId(generatedPrompt.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ... existing code for Module Library ... */}
            <Card className="glass-card">
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
                            flag="canAccessModule"
                            requiredPlan={requiredPlan}
                            feature={`Module ${module.id}`}
                            showLock={true}
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
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs text-gray-500">
                                    {module.vector}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs text-gray-500">
                                    {module.level}
                                  </Badge>
                                </div>
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
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {module.vector}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {module.level}
                                </Badge>
                              </div>
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

          {/* Main Content - Prompt Builder Canvas */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="builder" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-black/50">
                <TabsTrigger
                  value="builder"
                  className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                >
                  <Move className="w-4 h-4 mr-2" />
                  Builder
                </TabsTrigger>
                <TabsTrigger
                  value="config"
                  className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  7D Config
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

              <TabsContent value="builder">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="font-serif">Drag & Drop Prompt Builder</CardTitle>
                    <CardDescription>Build your prompt by arranging blocks in the canvas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Canvas Area */}
                      <div className="space-y-4">
                        <Label className="text-lg font-medium">Prompt Canvas</Label>
                        <div className="bg-black/50 border-2 border-dashed border-gray-600 rounded-lg p-4 min-h-96">
                          {promptBlocks.length > 0 ? (
                            <div className="space-y-3">
                              {promptBlocks
                                .sort((a, b) => a.order - b.order)
                                .map((block, index) => (
                                  <div
                                    key={block.id}
                                    draggable={checkEntitlement("canUseDragDrop")}
                                    onDragStart={() => handleDragStart(block.id)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, index)}
                                    className={`p-3 rounded border ${
                                      block.type === "step"
                                        ? "border-blue-500 bg-blue-500/10"
                                        : block.type === "guardrail"
                                          ? "border-orange-500 bg-orange-500/10"
                                          : "border-green-500 bg-green-500/10"
                                    } ${checkEntitlement("canUseDragDrop") ? "cursor-move" : "cursor-default"}`}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <Badge variant="outline" className="text-xs">
                                        {block.type.toUpperCase()}
                                      </Badge>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removePromptBlock(block.id)}
                                        className="h-6 w-6 p-0"
                                      >
                                        <X className="w-3 h-3" />
                                      </Button>
                                    </div>
                                    <Textarea
                                      value={block.content}
                                      onChange={(e) => updatePromptBlock(block.id, e.target.value)}
                                      className="bg-transparent border-none p-0 resize-none"
                                      rows={2}
                                    />
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="text-center py-12 text-gray-400">
                              <Move className="w-12 h-12 mx-auto mb-4 opacity-50" />
                              <p>Drag blocks here to build your prompt</p>
                              <p className="text-sm">Use the Quick Actions sidebar to add blocks</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Generated Output */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-lg font-medium">Generated Prompt</Label>
                          <Button
                            className="bg-yellow-600 hover:bg-yellow-700"
                            onClick={handleGenerate}
                            disabled={isGenerating}
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            {isGenerating ? "Generating..." : "Generate"}
                          </Button>
                        </div>
                        <div className="bg-black/50 border border-gray-700 rounded-lg p-4 min-h-96">
                          <div className="text-sm whitespace-pre-wrap">
                            {generatedPrompt?.content || "Generated prompt will appear here..."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ... existing code for other tabs ... */}
              <TabsContent value="config">
                <Card className="glass-card">
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

              <TabsContent value="test">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="font-serif">Test Engine</CardTitle>
                    <CardDescription>Validate prompt quality with simulated or live testing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        className="h-20 flex-col bg-transparent"
                        onClick={() => handleTest("simulate")}
                        disabled={isTesting || !generatedPrompt}
                      >
                        <TestTube className="w-6 h-6 mb-2" />
                        <span>{isTesting ? "Testing..." : "Simulate Test"}</span>
                        <span className="text-xs text-gray-400">Available on all plans</span>
                      </Button>
                      <EntitlementGate flag="canUseGptTestReal" requiredPlan="pro" feature="Live GPT Testing">
                        <Button
                          variant="outline"
                          className="h-20 flex-col bg-transparent"
                          onClick={() => handleTest("live")}
                          disabled={isTesting || !generatedPrompt}
                        >
                          <Zap className="w-6 h-6 mb-2" />
                          <span>{isTesting ? "Testing..." : "Run Real Test"}</span>
                          <span className="text-xs text-gray-400">Real tests require Pro+ plan</span>
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
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>No test results yet</p>
                          <p className="text-sm">Generate a prompt and run a test to see results</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="font-serif">Generation History</CardTitle>
                    <CardDescription>View and manage your previous prompt generations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {history.length > 0 ? (
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
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-400">
                        <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No generation history yet</p>
                        <p className="text-sm">Start generating prompts to see your history here</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {generatedPrompt && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-700 p-4">
            <div className="container mx-auto flex items-center justify-between">
              <div className="text-sm text-gray-400">Ready to export: {generatedPrompt.hash}</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <EntitlementGate flag="canExportTxt" requiredPlan="free" feature="TXT Export">
                  <Button variant="outline" size="sm" onClick={() => handleExport("txt")} disabled={isExporting}>
                    <Download className="w-4 h-4 mr-2" />
                    TXT
                  </Button>
                </EntitlementGate>
                <EntitlementGate flag="canExportMd" requiredPlan="creator" feature="MD Export">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("md")}
                    disabled={isExporting || userPlan === "free"}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {userPlan === "free" ? <Lock className="w-3 h-3 mr-1" /> : null}
                    MD
                  </Button>
                </EntitlementGate>
                <EntitlementGate flag="canExportPdf" requiredPlan="pro" feature="PDF Export">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("pdf")}
                    disabled={isExporting || userPlan === "free" || userPlan === "creator"}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {userPlan === "free" || userPlan === "creator" ? <Lock className="w-3 h-3 mr-1" /> : null}
                    PDF
                  </Button>
                </EntitlementGate>
                <EntitlementGate flag="canExportJson" requiredPlan="pro" feature="JSON Export">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("json")}
                    disabled={isExporting || userPlan === "free" || userPlan === "creator"}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {userPlan === "free" || userPlan === "creator" ? <Lock className="w-3 h-3 mr-1" /> : null}
                    JSON
                  </Button>
                </EntitlementGate>
                <EntitlementGate flag="canExportBundle" requiredPlan="enterprise" feature="Bundle Export">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("zip")}
                    disabled={isExporting || userPlan !== "enterprise"}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {userPlan !== "enterprise" ? <Lock className="w-3 h-3 mr-1" /> : null}
                    ZIP
                  </Button>
                </EntitlementGate>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
