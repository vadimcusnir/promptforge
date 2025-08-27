"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface PromptFormProps {
  module: string
  onSubmit?: (prompt: string) => void
  isSubmitting?: boolean
}

export function PromptForm({ module, onSubmit, isSubmitting = false }: PromptFormProps) {
  const [prompt, setPrompt] = useState("")
  const [errors, setErrors] = useState<string[]>([])
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [score, setScore] = useState(0)
  const [verdict, setVerdict] = useState<"pass" | "fail">("fail")
  const [showResults, setShowResults] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      setErrors(['Please enter a prompt'])
      return
    }

    try {
      // Mock API call for now since we're in coming-soon mode
      const mockResponse = {
        data: {
          output: `Generated prompt for module ${module}:\n\n${prompt}\n\nThis is a mock response while the site is in coming-soon mode.`,
          score: 85,
          verdict: "pass" as const
        }
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      setGeneratedPrompt(mockResponse.data.output)
      setScore(mockResponse.data.score)
      setVerdict(mockResponse.data.verdict)
      setShowResults(true)
      setErrors([])

      if (onSubmit) {
        onSubmit(prompt)
      }
    } catch (error) {
      setErrors(['An error occurred while generating the prompt'])
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prompt" className="text-white">
            Enter your prompt
          </Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to generate..."
            className="min-h-32 bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500/20"
            required
          />
        </div>

        {errors.length > 0 && (
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            ))}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || !prompt.trim()}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
        >
          {isSubmitting ? "Generating..." : "Generate Prompt"}
        </Button>
      </form>

      {showResults && (
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Generated Prompt</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={verdict === "pass" ? "default" : "destructive"}>
                  {verdict === "pass" ? "PASS" : "FAIL"}
                </Badge>
                <Badge variant="outline">Score: {score}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {verdict === "pass" ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="text-gray-300">
                  {verdict === "pass" 
                    ? "Prompt meets quality standards" 
                    : "Prompt needs improvement"
                  }
                </span>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <pre className="text-white whitespace-pre-wrap text-sm">{generatedPrompt}</pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
