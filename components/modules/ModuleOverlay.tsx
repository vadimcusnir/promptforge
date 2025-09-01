"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ArrowRight, Lock, Zap, Target, Settings, FileText, BarChart3, Shield, Unlock, Code } from "lucide-react"
import { Module, PlanType } from "@/lib/modules"

interface ModuleOverlayProps {
  module: Module
  isOpen: boolean
  onClose: () => void
  userPlan: PlanType
}

export default function ModuleOverlay({ module, isOpen, onClose, userPlan }: ModuleOverlayProps) {
  const handleUseInGenerator = () => {
    window.location.href = `/generator?module=${module.id}`
  }

  const handleUpgrade = () => {
    window.location.href = "/pricing"
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card border-gray-700">
        <CardHeader className="border-b border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-lg text-yellow-400">{module.id}</span>
                <Badge variant="outline" className="border-yellow-400/50 text-yellow-400">
                  Difficulty {module.difficulty} • {module.minPlan}
                </Badge>
              </div>
              <CardTitle className="text-2xl font-serif text-white">{module.title}</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Full Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Description</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {module.summary}
            </p>
          </div>

          {/* Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Purpose</h3>
            </div>
            <p className="text-gray-300">
              Professional module for optimizing workflows through the PromptForge 7-D Engine.
            </p>
          </div>

          {/* Input Schema */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Input Schema</h3>
            </div>
            <div className="bg-black/30 rounded-lg p-4 border border-gray-700">
              <code className="text-sm text-gray-300 font-mono">
                7-D Parameters: Domain, Scale, Urgency, Complexity, Resources, Application, Output
              </code>
            </div>
          </div>

          {/* Output */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Output</h3>
            </div>
            <p className="text-gray-300">
              Exportable formats: {module.outputs.join(', ')}
            </p>
          </div>

          {/* KPI */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">KPI</h3>
            </div>
            <p className="text-gray-300">
              Score ≥ 75 on clarity and execution. Processing time &lt; 90s.
            </p>
          </div>

          {/* Entitlements */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Unlock className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Entitlements</h3>
            </div>
            <p className="text-gray-300">
              Minimum plan required: {module.minPlan}. Available in all plans.
            </p>
          </div>

          {/* Guardrails */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Guardrails</h3>
            </div>
            <p className="text-gray-300">
              Respects compliance and confidentiality limits. Output is audited and traceable.
            </p>
          </div>

          {/* JSON Specification */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">JSON Specification</h3>
            </div>
            <div className="bg-black/30 rounded-lg p-4 border border-gray-700">
              <pre className="text-xs text-gray-300 font-mono overflow-x-auto">
{`{
  "module": {
    "id": "${module.id}",
    "title": "${module.title}",
    "slug": "${module.slug}",
    "summary": "${module.summary}",
    "vectors": ${JSON.stringify(module.vectors)},
    "difficulty": ${module.difficulty},
    "minPlan": "${module.minPlan}",
    "tags": ${JSON.stringify(module.tags)},
    "outputs": ${JSON.stringify(module.outputs)},
    "version": "${module.version}",
    "sevenDDefaults": ${JSON.stringify(module.sevenDDefaults || {}, null, 2)}
  }
}`}
              </pre>
            </div>
          </div>

          {/* Telemetry Note */}
          <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4">
            <p className="text-sm text-yellow-200">
              <Zap className="w-4 h-4 inline mr-2" />
              Only metadata (scores, timestamps, usage patterns) is logged for system optimization. Your prompt content is never stored.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-700">
            <Button
              onClick={handleUseInGenerator}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
            >
              Simulate
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={handleUseInGenerator}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Run Real Test
              <Zap className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:text-white bg-transparent"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
