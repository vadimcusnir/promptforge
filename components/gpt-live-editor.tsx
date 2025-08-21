"use client"

import { useState, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { IndustrialCard, IndustrialButton, IndustrialBadge } from "@/components/industrial-ui"
import { GPTLiveEngine, type GPTLiveOptions, type GPTStreamChunk, type GPTLiveResult } from "@/lib/gpt-live"
import { PremiumGate } from "@/lib/premium-features"
import type { GeneratedPrompt } from "@/types/promptforge"
import { Bot, Square, Activity, TrendingUp, Copy, Download, Settings, Sparkles, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GPTLiveEditorProps {
  generatedPrompt: GeneratedPrompt | null
  onEditComplete?: (result: GPTLiveResult) => void
}

export function GPTLiveEditor({ generatedPrompt, onEditComplete }: GPTLiveEditorProps) {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [streamingContent, setStreamingContent] = useState<string>("")
  const [improvements, setImprovements] = useState<string[]>([])
  const [metrics, setMetrics] = useState<any>(null)
  const [result, setResult] = useState<GPTLiveResult | null>(null)
  const [progress, setProgress] = useState(0)
  const [options, setOptions] = useState<GPTLiveOptions>({
    focus: "comprehensive",
    tone: "professional",
    length: "detailed",
    streaming: true,
    model: "gpt-4o",
    temperature: 0.7,
    maxTokens: 4000,
  })

  const { toast } = useToast()
  const gptEngine = GPTLiveEngine.getInstance()
  const premiumGate = PremiumGate.getInstance()
  const sessionIdRef = useRef<string | null>(null)

  const handleOptimize = async () => {
    if (!generatedPrompt) {
      toast({
        title: "Error",
        description: "No prompt to optimize!",
        variant: "destructive",
      })
      return
    }

    // Check premium access
    const canUse = premiumGate.canUseGPTOptimization()
    if (!canUse.allowed) {
      toast({
        title: "Premium Feature",
        description: canUse.reason,
        variant: "destructive",
      })
      return
    }

    setIsOptimizing(true)
    setStreamingContent("")
    setImprovements([])
    setMetrics(null)
    setResult(null)
    setProgress(0)

    try {
      const optimizationResult = await gptEngine.optimizeWithStreaming(
        generatedPrompt.prompt,
        options,
        handleStreamChunk,
      )

      setResult(optimizationResult)
      onEditComplete?.(optimizationResult)
      premiumGate.consumeGPTOptimization()

      toast({
        title: "Live optimization complete!",
        description: `Confidence: ${optimizationResult.confidence}% | Model: ${optimizationResult.model}`,
      })
    } catch (error) {
      toast({
        title: "Optimization failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsOptimizing(false)
      setProgress(100)
    }
  }

  const handleStreamChunk = (chunk: GPTStreamChunk) => {
    switch (chunk.type) {
      case "start":
        setProgress(10)
        setStreamingContent(chunk.content || "")
        break
      case "content":
        setProgress((prev) => Math.min(prev + 20, 80))
        setStreamingContent(chunk.content || "")
        break
      case "improvement":
        if (chunk.improvement) {
          setImprovements((prev) => [...prev, chunk.improvement!])
        }
        setProgress((prev) => Math.min(prev + 15, 85))
        break
      case "metrics":
        setMetrics(chunk.metrics)
        setProgress(95)
        break
      case "complete":
        setProgress(100)
        setStreamingContent("Optimization complete!")
        break
      case "error":
        toast({
          title: "Streaming error",
          description: chunk.error,
          variant: "destructive",
        })
        break
    }
  }

  const handleCancel = () => {
    if (sessionIdRef.current) {
      gptEngine.cancelOptimization(sessionIdRef.current)
    }
    setIsOptimizing(false)
    setProgress(0)
    setStreamingContent("")
  }

  const handleCopy = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result.editedPrompt)
      toast({ title: "Copied!", description: "Optimized prompt copied to clipboard." })
    } catch (error) {
      toast({ title: "Copy failed", description: "Could not copy prompt.", variant: "destructive" })
    }
  }

  const handleDownload = () => {
    if (!result) return
    const blob = new Blob([result.editedPrompt], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `prompt_gpt_live_${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({ title: "Downloaded!", description: "Optimized prompt saved to file." })
  }

  return (
    <IndustrialCard variant="elevated" glow className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-400 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
            GPT Live Engine
          </h2>
        </div>
        {result && (
          <IndustrialBadge variant="success" className="neon-glow-green">
            <TrendingUp className="w-3 h-3 mr-1" />
            {result.confidence}% Confidence
          </IndustrialBadge>
        )}
      </div>

      <IndustrialCard className="p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Live Optimization Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-300">Model</label>
            <Select value={options.model} onValueChange={(value: any) => setOptions({ ...options, model: value })}>
              <SelectTrigger className="industrial-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">GPT-4o (Latest)</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-300">Focus</label>
            <Select value={options.focus} onValueChange={(value: any) => setOptions({ ...options, focus: value })}>
              <SelectTrigger className="industrial-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clarity">Clarity</SelectItem>
                <SelectItem value="structure">Structure</SelectItem>
                <SelectItem value="specificity">Specificity</SelectItem>
                <SelectItem value="comprehensive">Comprehensive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-300">Temperature</label>
            <div className="px-3">
              <Slider
                value={[options.temperature]}
                onValueChange={([value]) => setOptions({ ...options, temperature: value })}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Precise</span>
                <span>{options.temperature}</span>
                <span>Creative</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-300">Max Tokens</label>
            <Select
              value={options.maxTokens.toString()}
              onValueChange={(value) => setOptions({ ...options, maxTokens: Number.parseInt(value) })}
            >
              <SelectTrigger className="industrial-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2000">2K Tokens</SelectItem>
                <SelectItem value="4000">4K Tokens</SelectItem>
                <SelectItem value="8000">8K Tokens</SelectItem>
                <SelectItem value="16000">16K Tokens</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </IndustrialCard>

      <div className="flex gap-3 mb-6">
        <IndustrialButton
          variant="primary"
          onClick={handleOptimize}
          disabled={!generatedPrompt || isOptimizing}
          loading={isOptimizing}
        >
          {isOptimizing ? (
            <>
              <Activity className="w-4 h-4 mr-2 animate-pulse" />
              Live Optimizing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Start Live Optimization
            </>
          )}
        </IndustrialButton>

        {isOptimizing && (
          <IndustrialButton variant="danger" onClick={handleCancel}>
            <Square className="w-4 h-4 mr-2" />
            Cancel
          </IndustrialButton>
        )}

        {result && (
          <>
            <IndustrialButton variant="secondary" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </IndustrialButton>
            <IndustrialButton variant="secondary" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </IndustrialButton>
          </>
        )}
      </div>

      {isOptimizing && (
        <IndustrialCard className="p-6 mb-6 border-l-4 border-purple-400">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center animate-pulse">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-white">Live Processing Status</h4>
          </div>

          <Progress value={progress} className="mb-4 h-2" />

          <div className="space-y-3">
            <div className="text-sm text-slate-300">{streamingContent}</div>

            {improvements.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-semibold text-green-400">Live Improvements:</h5>
                {improvements.map((improvement, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm animate-fade-in">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-slate-300">{improvement}</span>
                  </div>
                ))}
              </div>
            )}

            {metrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {Object.entries(metrics).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-lg font-bold text-cyan-400">{value}%</div>
                    <div className="text-xs text-slate-400 capitalize">{key}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </IndustrialCard>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white">Original Prompt</h4>
            {generatedPrompt && (
              <IndustrialBadge variant="default">{generatedPrompt.prompt.length} chars</IndustrialBadge>
            )}
          </div>
          <Textarea
            value={generatedPrompt?.prompt || ""}
            placeholder="Original prompt will appear here..."
            className="min-h-[500px] font-mono text-sm industrial-input"
            readOnly
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white">GPT Live Optimized</h4>
            {result && (
              <div className="flex gap-2">
                <IndustrialBadge variant="success">{result.editedPrompt.length} chars</IndustrialBadge>
                <IndustrialBadge variant="info">
                  <Clock className="w-3 h-3 mr-1" />
                  {result.streamingTime}ms
                </IndustrialBadge>
              </div>
            )}
          </div>
          <Textarea
            value={result?.editedPrompt || ""}
            placeholder="Live optimized prompt will stream here..."
            className="min-h-[500px] font-mono text-sm industrial-input border-purple-400/50"
            readOnly
          />
        </div>
      </div>
    </IndustrialCard>
  )
}
