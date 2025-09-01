'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useTelemetry } from '@/hooks/use-telemetry'
import { X, Zap, AlertTriangle, CheckCircle, Copy, RefreshCw, Download } from 'lucide-react'

interface TightenPromptDialogProps {
  isOpen: boolean
  onClose: () => void
  currentPrompt: string
  currentScore: number
  targetScore: number
  onApplySuggestion: (suggestion: string) => Promise<void>
  onRerunTest: () => Promise<void>
  onExport: () => Promise<void>
}

interface Suggestion {
  id: string
  type: 'clarity' | 'specificity' | 'context' | 'examples' | 'constraints'
  title: string
  description: string
  suggestion: string
  impact: 'high' | 'medium' | 'low'
  applied: boolean
}

const SUGGESTION_TYPES = {
  clarity: {
    title: 'Improve Clarity',
    description: 'Make the prompt clearer and more direct',
    icon: '👁️',
    color: 'text-blue-500'
  },
  specificity: {
    title: 'Add Specificity',
    description: 'Include more specific details and requirements',
    icon: '🎯',
    color: 'text-green-500'
  },
  context: {
    title: 'Provide Context',
    description: 'Add background information and context',
    icon: '📚',
    color: 'text-purple-500'
  },
  examples: {
    title: 'Include Examples',
    description: 'Add examples to guide the response',
    icon: '💡',
    color: 'text-yellow-500'
  },
  constraints: {
    title: 'Set Constraints',
    description: 'Define clear boundaries and limitations',
    icon: '🔒',
    color: 'text-red-500'
  }
}

export function TightenPromptDialog({
  isOpen,
  onClose,
  currentPrompt,
  currentScore,
  targetScore,
  onApplySuggestion,
  onRerunTest,
  onExport
}: TightenPromptDialogProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null)
  const [improvedPrompt, setImprovedPrompt] = useState(currentPrompt)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [isRerunning, setIsRerunning] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const { trackTightenPromptClick, trackUserAction } = useTelemetry()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Generate suggestions based on current prompt and score
  useEffect(() => {
    if (isOpen && currentPrompt) {
      generateSuggestions()
    }
  }, [isOpen, currentPrompt, currentScore])

  const generateSuggestions = useCallback(async () => {
    setIsGenerating(true)
    trackUserAction('suggestions_generated', { 
      current_score: currentScore, 
      target_score: targetScore 
    })

    try {
      // Simulate AI-powered suggestion generation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newSuggestions: Suggestion[] = [
        {
          id: 'clarity-1',
          type: 'clarity',
          title: 'Improve Clarity',
          description: 'Make the prompt clearer and more direct',
          suggestion: 'Break down complex instructions into clear, actionable steps. Use bullet points or numbered lists to organize requirements.',
          impact: 'high',
          applied: false
        },
        {
          id: 'specificity-1',
          type: 'specificity',
          title: 'Add Specificity',
          description: 'Include more specific details and requirements',
          suggestion: 'Specify exact output format, length requirements, and any specific terminology to use.',
          impact: 'high',
          applied: false
        },
        {
          id: 'context-1',
          type: 'context',
          title: 'Provide Context',
          description: 'Add background information and context',
          suggestion: 'Include relevant background information, target audience, and the purpose of the task.',
          impact: 'medium',
          applied: false
        },
        {
          id: 'examples-1',
          type: 'examples',
          title: 'Include Examples',
          description: 'Add examples to guide the response',
          suggestion: 'Provide 1-2 concrete examples of the desired output format and style.',
          impact: 'high',
          applied: false
        },
        {
          id: 'constraints-1',
          type: 'constraints',
          title: 'Set Constraints',
          description: 'Define clear boundaries and limitations',
          suggestion: 'Specify what should NOT be included and any limitations on the response.',
          impact: 'medium',
          applied: false
        }
      ]

      setSuggestions(newSuggestions)
    } catch (error) {
      console.error('Failed to generate suggestions:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [currentPrompt, currentScore, targetScore, trackUserAction])

  const handleSuggestionClick = useCallback((suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion)
    trackUserAction('suggestion_selected', { 
      suggestion_type: suggestion.type,
      impact: suggestion.impact
    })
  }, [trackUserAction])

  const handleApplySuggestion = useCallback(async () => {
    if (!selectedSuggestion) return

    setIsApplying(true)
    trackUserAction('suggestion_applied', { 
      suggestion_type: selectedSuggestion.type,
      impact: selectedSuggestion.impact
    })

    try {
      // Simulate applying the suggestion to improve the prompt
      const improved = await onApplySuggestion(selectedSuggestion.suggestion)
      setImprovedPrompt(improved)
      
      // Mark suggestion as applied
      setSuggestions(prev => prev.map(s => 
        s.id === selectedSuggestion.id ? { ...s, applied: true } : s
      ))
      
      setSelectedSuggestion(null)
    } catch (error) {
      console.error('Failed to apply suggestion:', error)
    } finally {
      setIsApplying(false)
    }
  }, [selectedSuggestion, onApplySuggestion, trackUserAction])

  const handleRerunTest = useCallback(async () => {
    setIsRerunning(true)
    trackUserAction('rerun_test_from_dialog', { 
      improved_prompt: improvedPrompt !== currentPrompt
    })

    try {
      await onRerunTest()
      onClose()
    } catch (error) {
      console.error('Failed to rerun test:', error)
    } finally {
      setIsRerunning(false)
    }
  }, [improvedPrompt, currentPrompt, onRerunTest, onClose, trackUserAction])

  const handleExport = useCallback(async () => {
    setIsExporting(true)
    trackUserAction('export_from_dialog', { 
      improved_prompt: improvedPrompt !== currentPrompt
    })

    try {
      await onExport()
      onClose()
    } catch (error) {
      console.error('Failed to export:', error)
    } finally {
      setIsExporting(false)
    }
  }, [improvedPrompt, currentPrompt, onExport, onClose, trackUserAction])

  const handleCopyText = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(label)
      setTimeout(() => setCopiedText(null), 2000)
      trackUserAction('text_copied', { label })
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }, [trackUserAction])

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500 bg-red-500/20'
      case 'medium': return 'text-yellow-500 bg-yellow-500/20'
      case 'low': return 'text-green-500 bg-green-500/20'
      default: return 'text-gray-500 bg-gray-500/20'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <Zap className="h-6 w-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-white">Tighten & Re-test</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Left Panel - Suggestions */}
          <div className="w-1/3 border-r border-gray-800 overflow-y-auto">
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-white mb-2">Current Score</h3>
                <div className="flex items-center space-x-3">
                  <span className={`text-2xl font-bold ${getScoreColor(currentScore)}`}>
                    {currentScore.toFixed(1)}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="text-2xl font-bold text-green-500">
                    {targetScore}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Target: {targetScore} (Export threshold)
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-medium text-white mb-3">Improvement Suggestions</h3>
                {isGenerating ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-800 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {suggestions.map((suggestion) => {
                      const typeInfo = SUGGESTION_TYPES[suggestion.type]
                      return (
                        <div
                          key={suggestion.id}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedSuggestion?.id === suggestion.id
                              ? 'bg-blue-500/20 border border-blue-500'
                              : 'bg-gray-800 hover:bg-gray-700'
                          } ${suggestion.applied ? 'opacity-50' : ''}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{typeInfo.icon}</span>
                              <span className="font-medium text-white text-sm">
                                {suggestion.title}
                              </span>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactColor(suggestion.impact)}`}>
                              {suggestion.impact}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">
                            {suggestion.description}
                          </p>
                          {suggestion.applied && (
                            <div className="flex items-center space-x-1 mt-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span className="text-xs text-green-500">Applied</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Prompt Editor */}
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Prompt Editor</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopyText(currentPrompt, 'original')}
                    className="flex items-center space-x-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy Original</span>
                  </button>
                  <button
                    onClick={() => handleCopyText(improvedPrompt, 'improved')}
                    className="flex items-center space-x-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy Improved</span>
                  </button>
                </div>
              </div>

              {selectedSuggestion && (
                <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{selectedSuggestion.title}</h4>
                    <button
                      onClick={handleApplySuggestion}
                      disabled={isApplying}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
                    >
                      {isApplying ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <Zap className="h-3 w-3" />
                      )}
                      <span>{isApplying ? 'Applying...' : 'Apply'}</span>
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">
                    {selectedSuggestion.description}
                  </p>
                  <p className="text-sm text-blue-300">
                    {selectedSuggestion.suggestion}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Original Prompt
                  </label>
                  <textarea
                    value={currentPrompt}
                    readOnly
                    className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Improved Prompt
                  </label>
                  <textarea
                    ref={textareaRef}
                    value={improvedPrompt}
                    onChange={(e) => setImprovedPrompt(e.target.value)}
                    className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your improved prompt will appear here..."
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleRerunTest}
                    disabled={isRerunning}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    {isRerunning ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    <span>{isRerunning ? 'Testing...' : 'Re-run Test'}</span>
                  </button>

                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    {isExporting ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    <span>{isExporting ? 'Exporting...' : 'Export'}</span>
                  </button>
                </div>

                <div className="text-sm text-gray-400">
                  {improvedPrompt !== currentPrompt ? 'Prompt modified' : 'No changes'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
