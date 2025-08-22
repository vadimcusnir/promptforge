"use client"

import { Motion } from "@/components/Motion"
import { CheckCircle, Circle, ArrowRight } from "lucide-react"

interface WorkflowStepsProps {
  currentStep: "configure" | "generate" | "test" | "export"
  isGenerating?: boolean
  isTesting?: boolean
}

const WORKFLOW_STEPS = [
  { key: "configure", label: "7D Config", description: "Configure parameters" },
  { key: "generate", label: "Generate", description: "Create prompt" },
  { key: "test", label: "Test", description: "Score quality" },
  { key: "export", label: "Export", description: "Download ready" }
] as const

export function WorkflowSteps({ currentStep, isGenerating, isTesting }: WorkflowStepsProps) {
  const getStepStatus = (stepKey: string) => {
    const steps = ["configure", "generate", "test", "export"]
    const currentIndex = steps.indexOf(currentStep)
    const stepIndex = steps.indexOf(stepKey)
    
    if (stepIndex < currentIndex) return "completed"
    if (stepIndex === currentIndex) {
      if (stepKey === "generate" && isGenerating) return "loading"
      if (stepKey === "test" && isTesting) return "loading"
      return "active"
    }
    return "pending"
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center gap-4">
        {WORKFLOW_STEPS.map((step, index) => {
          const status = getStepStatus(step.key)
          const isActive = status === "active"
          const isCompleted = status === "completed"
          const isLoading = status === "loading"
          
          return (
            <div key={step.key} className="flex items-center gap-4">
              <Motion
                intent="explain"
                className={`flex flex-col items-center gap-2 transition-all duration-300 ${
                  isActive ? "step-enter-active" : ""
                } ${
                  isCompleted ? "opacity-75" : isActive ? "opacity-100" : "opacity-50"
                }`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  isCompleted 
                    ? "bg-green-600 border-green-600 text-white" 
                    : isActive 
                      ? "bg-blue-600 border-blue-600 text-white" 
                      : "border-gray-400 text-gray-400"
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isLoading ? (
                    <Motion
                      intent="state" 
                      className="loading w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                    />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>
                
                <div className="text-center">
                  <div className={`text-sm font-medium ${
                    isActive ? "text-blue-400" : isCompleted ? "text-green-400" : "text-gray-400"
                  }`}>
                    {step.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {step.description}
                  </div>
                </div>
              </Motion>
              
              {index < WORKFLOW_STEPS.length - 1 && (
                <ArrowRight className={`w-4 h-4 ${
                  getStepStatus(WORKFLOW_STEPS[index + 1].key) === "completed" 
                    ? "text-green-400" 
                    : "text-gray-400"
                }`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
