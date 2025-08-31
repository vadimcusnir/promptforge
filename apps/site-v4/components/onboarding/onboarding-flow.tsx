"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Play,
  Target,
  Brain,
  Layers,
  Eye,
  Database,
  Lightbulb,
  Zap,
  Star,
  Rocket,
  BookOpen,
  Settings,
  Users,
  Trophy,
} from "lucide-react"

const ONBOARDING_STEPS = [
  { id: "welcome", title: "Welcome to PromptForge™", icon: Rocket },
  { id: "framework", title: "The 7D Framework", icon: Target },
  { id: "modules", title: "Choose Your Module", icon: Layers },
  { id: "parameters", title: "Configure Parameters", icon: Settings },
  { id: "generate", title: "Generate Your First Prompt", icon: Zap },
  { id: "complete", title: "Mission Complete", icon: Trophy },
]

const SEVEN_D_DIMENSIONS = [
  {
    id: "domain",
    name: "Domain",
    icon: Target,
    description: "The industry or field context",
    examples: ["Finance", "E-commerce", "Education", "SaaS"],
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/30",
  },
  {
    id: "scale",
    name: "Scale",
    icon: Users,
    description: "The scope of implementation",
    examples: ["Solo", "Team", "Organization", "Market"],
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/30",
  },
  {
    id: "urgency",
    name: "Urgency",
    icon: Zap,
    description: "Time sensitivity level",
    examples: ["Low", "Normal", "High", "Crisis"],
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/30",
  },
  {
    id: "complexity",
    name: "Complexity",
    icon: Brain,
    description: "Technical difficulty level",
    examples: ["Low", "Medium", "High"],
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/30",
  },
  {
    id: "resources",
    name: "Resources",
    icon: Database,
    description: "Available resources and constraints",
    examples: ["Minimal", "Standard", "Extended"],
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/30",
  },
  {
    id: "application",
    name: "Application",
    icon: Layers,
    description: "Use case category",
    examples: ["Content Ops", "Sales Ops", "Product Ops", "Research"],
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
    borderColor: "border-pink-400/30",
  },
  {
    id: "output",
    name: "Output",
    icon: Eye,
    description: "Desired result format",
    examples: ["Text", "SOP", "Plan", "Bundle"],
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderColor: "border-orange-400/30",
  },
]

const STARTER_MODULES = [
  {
    id: "M01",
    name: "Strategic Framework Generator",
    description: "Perfect for beginners - creates structured strategic plans",
    difficulty: "Beginner",
    estimatedTime: "3-5 min",
    category: "Strategy",
    score: 89,
    icon: Target,
  },
  {
    id: "M03",
    name: "Content Strategy Builder",
    description: "Build comprehensive content strategies with ease",
    difficulty: "Beginner",
    estimatedTime: "4-6 min",
    category: "Content",
    score: 87,
    icon: Layers,
  },
  {
    id: "M12",
    name: "Brand Visibility Diagnostic",
    description: "Analyze and improve your brand presence",
    difficulty: "Beginner",
    estimatedTime: "3-5 min",
    category: "Branding",
    score: 85,
    icon: Eye,
  },
]

export default function OnboardingFlow({ onComplete }: { onComplete?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedModule, setSelectedModule] = useState(null)
  const [sevenDParams, setSevenDParams] = useState({})
  const [contextInput, setContextInput] = useState("")
  const [hoveredDimension, setHoveredDimension] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)

  const currentStepData = ONBOARDING_STEPS[currentStep]
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulate generation process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setGenerationProgress(i)
    }

    setIsGenerating(false)
    handleNext()
  }

  const handleComplete = () => {
    if (onComplete) {
      onComplete()
    }
  }

  const renderWelcomeStep = () => (
    <div className="text-center space-y-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-12">
          <Rocket className="w-16 h-16 text-primary mx-auto mb-6 floating" />
          <h1 className="text-4xl font-bold text-foreground font-mono mb-4 neon-text">Welcome to PromptForge™</h1>
          <p className="text-xl text-muted-foreground font-mono mb-8">
            Your operational prompt engine. Let's build your first industrial-grade prompt.
          </p>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <Target className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground font-mono">50</div>
              <div className="text-sm text-muted-foreground font-mono">Modules</div>
            </div>
            <div className="text-center">
              <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground font-mono">&lt;60s</div>
              <div className="text-sm text-muted-foreground font-mono">Time-to-Artifact</div>
            </div>
            <div className="text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground font-mono">≥80</div>
              <div className="text-sm text-muted-foreground font-mono">AI Score</div>
            </div>
          </div>
          <Button
            onClick={handleNext}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-lg px-8 py-3"
          >
            Begin Journey
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )

  const renderFrameworkStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Target className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-foreground font-mono mb-4">The 7D Framework</h2>
        <p className="text-lg text-muted-foreground font-mono">
          Seven dimensions that define every prompt's context and requirements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SEVEN_D_DIMENSIONS.map((dimension, index) => {
          const Icon = dimension.icon
          const isHovered = hoveredDimension === dimension.id

          return (
            <Card
              key={dimension.id}
              className={`bg-card/80 backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
                isHovered
                  ? `${dimension.borderColor} ${dimension.bgColor} scale-105`
                  : "border-border hover:border-primary/50"
              }`}
              onMouseEnter={() => setHoveredDimension(dimension.id)}
              onMouseLeave={() => setHoveredDimension(null)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${dimension.bgColor} ${dimension.borderColor} border`}>
                    <Icon className={`w-5 h-5 ${dimension.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-foreground font-mono text-lg">{dimension.name}</CardTitle>
                    <Badge variant="outline" className="border-border text-muted-foreground font-mono text-xs">
                      {index + 1}/7
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground font-mono mb-3">
                  {dimension.description}
                </CardDescription>
                {isHovered && (
                  <div className="space-y-2">
                    <div className="text-xs font-mono text-muted-foreground">Examples:</div>
                    <div className="flex flex-wrap gap-1">
                      {dimension.examples.map((example) => (
                        <Badge
                          key={example}
                          variant="secondary"
                          className="bg-muted text-muted-foreground font-mono text-xs"
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="text-center">
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6 mb-6">
          <Lightbulb className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <p className="text-sm font-mono text-muted-foreground">
            <strong className="text-foreground">Pro Tip:</strong> The 7D Framework ensures every prompt is contextually
            precise and industrially repeatable.
          </p>
        </div>
        <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono">
          Choose Your Module
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )

  const renderModulesStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Layers className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-foreground font-mono mb-4">Choose Your First Module</h2>
        <p className="text-lg text-muted-foreground font-mono">Start with one of these beginner-friendly modules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STARTER_MODULES.map((module) => {
          const Icon = module.icon
          const isSelected = selectedModule?.id === module.id

          return (
            <Card
              key={module.id}
              className={`bg-card/80 backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
                isSelected ? "border-primary bg-primary/5 scale-105" : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedModule(module)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="border-primary text-primary font-mono">
                    {module.id}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-sm font-mono text-muted-foreground">{module.score}</span>
                  </div>
                </div>
                <CardTitle className="text-foreground font-mono text-lg flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  {module.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground font-mono mb-4">{module.description}</CardDescription>
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span>{module.difficulty}</span>
                  <span>{module.estimatedTime}</span>
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    {module.category}
                  </Badge>
                </div>
                {isSelected && (
                  <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-primary inline mr-2" />
                    <span className="text-sm font-mono text-primary">Selected</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="text-center">
        <Button
          onClick={handleNext}
          disabled={!selectedModule}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono disabled:opacity-50"
        >
          Configure Parameters
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )

  const renderParametersStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Settings className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-foreground font-mono mb-4">Configure 7D Parameters</h2>
        <p className="text-lg text-muted-foreground font-mono">Set the context for your {selectedModule?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">Domain</label>
            <Select
              value={sevenDParams.domain}
              onValueChange={(value) => setSevenDParams({ ...sevenDParams, domain: value })}
            >
              <SelectTrigger className="bg-input border-border text-foreground font-mono">
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="saas">SaaS</SelectItem>
                <SelectItem value="ecom">E-commerce</SelectItem>
                <SelectItem value="edu">Education</SelectItem>
                <SelectItem value="fin">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">Scale</label>
            <Select
              value={sevenDParams.scale}
              onValueChange={(value) => setSevenDParams({ ...sevenDParams, scale: value })}
            >
              <SelectTrigger className="bg-input border-border text-foreground font-mono">
                <SelectValue placeholder="Select scale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solo">Solo</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="org">Organization</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">Urgency</label>
            <Select
              value={sevenDParams.urgency}
              onValueChange={(value) => setSevenDParams({ ...sevenDParams, urgency: value })}
            >
              <SelectTrigger className="bg-input border-border text-foreground font-mono">
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">Output Format</label>
            <Select
              value={sevenDParams.output}
              onValueChange={(value) => setSevenDParams({ ...sevenDParams, output: value })}
            >
              <SelectTrigger className="bg-input border-border text-foreground font-mono">
                <SelectValue placeholder="Select output" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="sop">SOP</SelectItem>
                <SelectItem value="plan">Plan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-mono text-muted-foreground mb-2 block">Context & Requirements</label>
            <Textarea
              placeholder="Describe your specific context and requirements..."
              className="bg-input border-border text-foreground placeholder:text-muted-foreground font-mono min-h-[200px] resize-none"
              value={contextInput}
              onChange={(e) => setContextInput(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={handleNext}
          disabled={!sevenDParams.domain || !contextInput}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono disabled:opacity-50"
        >
          Generate Prompt
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )

  const renderGenerateStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-foreground font-mono mb-4">Generate Your First Prompt</h2>
        <p className="text-lg text-muted-foreground font-mono">Ready to create your industrial-grade prompt</p>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border border-border">
        <CardHeader>
          <CardTitle className="text-foreground font-mono flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Prompt Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/20 border border-border rounded-lg p-4 font-mono text-sm">
            <div className="text-primary mb-2"># {selectedModule?.name}</div>
            <div className="text-muted-foreground mb-2">## Context</div>
            <div className="text-foreground mb-4">{contextInput}</div>
            <div className="text-muted-foreground mb-2">## Parameters</div>
            <div className="text-foreground">
              Domain: {sevenDParams.domain} | Scale: {sevenDParams.scale} | Urgency: {sevenDParams.urgency}
            </div>
          </div>
        </CardContent>
      </Card>

      {isGenerating && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm font-mono">
            <span className="text-muted-foreground">Generating...</span>
            <span className="text-primary">{generationProgress}%</span>
          </div>
          <Progress value={generationProgress} className="h-2" />
        </div>
      )}

      <div className="text-center">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-lg px-8 py-3"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
              Generating...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Generate Now
            </>
          )}
        </Button>
      </div>
    </div>
  )

  const renderCompleteStep = () => (
    <div className="text-center space-y-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-12">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6 floating" />
          <h1 className="text-4xl font-bold text-foreground font-mono mb-4 neon-text">Mission Complete!</h1>
          <p className="text-xl text-muted-foreground font-mono mb-8">
            You've successfully generated your first industrial-grade prompt with PromptForge™
          </p>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground font-mono">7D Framework</div>
              <div className="text-sm text-muted-foreground font-mono">Mastered</div>
            </div>
            <div className="text-center">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground font-mono">First Module</div>
              <div className="text-sm text-muted-foreground font-mono">Completed</div>
            </div>
            <div className="text-center">
              <Rocket className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-lg font-bold text-foreground font-mono">Ready to Scale</div>
              <div className="text-sm text-muted-foreground font-mono">49 More Modules</div>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleComplete}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-lg px-8 py-3 mr-4"
            >
              <Target className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Button>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted font-mono bg-transparent">
              <BookOpen className="w-4 h-4 mr-2" />
              Explore All Modules
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStepData.id) {
      case "welcome":
        return renderWelcomeStep()
      case "framework":
        return renderFrameworkStep()
      case "modules":
        return renderModulesStep()
      case "parameters":
        return renderParametersStep()
      case "generate":
        return renderGenerateStep()
      case "complete":
        return renderCompleteStep()
      default:
        return renderWelcomeStep()
    }
  }

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Progress Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground font-mono">PromptForge™ Onboarding</h1>
              <Badge className="bg-primary/20 text-primary border-primary/30 font-mono">
                Step {currentStep + 1} of {ONBOARDING_STEPS.length}
              </Badge>
            </div>
            <div className="text-sm font-mono text-muted-foreground">{Math.round(progress)}% Complete</div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            {ONBOARDING_STEPS.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      isActive
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : isCompleted
                          ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30"
                          : "bg-muted/20 text-muted-foreground border border-border"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    <span className="text-sm font-mono hidden md:block">{step.title}</span>
                  </div>
                  {index < ONBOARDING_STEPS.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground mx-2" />}
                </div>
              )
            })}
          </div>

          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">{renderCurrentStep()}</div>
      </div>

      {/* Navigation Footer */}
      {currentStep > 0 && currentStep < ONBOARDING_STEPS.length - 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t border-border p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="border-border text-foreground hover:bg-muted font-mono bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <div className="text-sm font-mono text-muted-foreground">{currentStepData.title}</div>
            <div className="w-24"></div> {/* Spacer for balance */}
          </div>
        </div>
      )}
    </div>
  )
}
