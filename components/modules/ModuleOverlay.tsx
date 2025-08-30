"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ArrowRight, Lock, Zap, Target, Settings, FileText, BarChart3, Shield, Unlock, Code } from "lucide-react"

interface Module {
  id: string
  module_code: string
  name: string
  description: string
  category: string
  domain_slug: string
  complexity: string
  estimated_time_minutes: number
  tags: string[]
  template_prompt: string
  example_output: string
  best_practices: string[]
  domain_info?: {
    name: string
    industry: string
  }
  fullDescription?: string
  purpose?: string
  inputSchema?: string
  output?: string
  kpi?: string
  entitlements?: string
  guardrails?: string
}

interface ModuleOverlayProps {
  module: Module
  onClose: () => void
}

export default function ModuleOverlay({ module, onClose }: ModuleOverlayProps) {
  const handleUseInGenerator = () => {
    window.location.href = `/generator?module=${module.id}`
  }

  const handleUpgrade = () => {
    window.location.href = "/pricing"
  }

  // Enhanced module data based on the specifications
  const getModuleDetails = (moduleId: string) => {
    const details: Record<string, Partial<Module>> = {
      M01: {
        fullDescription:
          "This module forges you to structure critical decisions through the 7-D Engine. Eliminate improvisation, obtain executable plans with optimized strategic vectors.",
        purpose: "Transforms vague context into actionable specifications for strategic planning.",
        inputSchema: "7-D Parameters (Domain, Scale, Urgency, Complexity, Resources, Application, Output).",
        output: "Exportable artifact: .txt / .md (Creator+), .pdf / .json (Pro+), bundle.zip (Enterprise).",
        kpi: "Score ≥ 80 on clarity and execution. TTA < 60s.",
        entitlements: "Full access: Pro+. Enterprise adds API and Bundle.",
        guardrails: "No unrealistic promises. Respects domain rules (compliance, KPI).",
      },
      M07: {
        fullDescription:
          "Advanced module for identifying and mitigating operational risks through 7-D vectorial analysis.",
        purpose: "Detects vulnerabilities and builds protection strategies.",
        inputSchema: "Risk context, 7-D parameters, alert thresholds.",
        output: "Structured risk report with mitigation plan (.txt, .pdf, .json).",
        kpi: "Detection accuracy ≥ 85%. Analysis time < 45s.",
        entitlements: "Available Creator+. Pro adds automatic alerting.",
        guardrails: "Respects confidentiality limits. Does not replace legal consultation.",
      },
    }
    return details[moduleId] || {}
  }

  const moduleDetails = getModuleDetails(module.id)

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
                <span className="font-mono text-lg text-yellow-400">{module.module_code}</span>
                <Badge variant="outline" className="border-yellow-400/50 text-yellow-400">
                  {module.complexity} • {module.domain_slug}
                </Badge>
              </div>
              <CardTitle className="text-2xl font-serif text-white">{module.name}</CardTitle>
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
              {moduleDetails.fullDescription ||
                `${module.description}. Professional module for optimizing workflows through the PromptForge 7-D Engine.`}
            </p>
          </div>

          {/* Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Purpose</h3>
            </div>
            <p className="text-gray-300">
              {moduleDetails.purpose ||
                "Optimizes operational processes through advanced structuring and intelligent automation."}
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
                {moduleDetails.inputSchema ||
                  "7-D Parameters: Domain, Scale, Urgency, Complexity, Resources, Application, Output"}
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
              {moduleDetails.output ||
                "Exportable artifact: .txt (Free), .md (Creator+), .pdf/.json (Pro+), bundle.zip (Enterprise)."}
            </p>
          </div>

          {/* KPI */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">KPI</h3>
            </div>
            <p className="text-gray-300">
              {moduleDetails.kpi || "Score ≥ 75 on clarity and execution. Processing time < 90s."}
            </p>
          </div>

          {/* Entitlements */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Unlock className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Entitlements</h3>
            </div>
            <p className="text-gray-300">
              {moduleDetails.entitlements || "Available in all plans. Pro+ adds advanced export and API access."}
            </p>
          </div>

          {/* Guardrails */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Guardrails</h3>
            </div>
            <p className="text-gray-300">
              {moduleDetails.guardrails ||
                "Respects compliance and confidentiality limits. Output is audited and traceable."}
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
    "id": "${module.module_code}",
    "name": "${module.name}",
    "category": "${module.category}",
    "domain": "${module.domain_slug}",
    "complexity": "${module.complexity}",
    "estimated_time_minutes": ${module.estimated_time_minutes},
    "tags": ${JSON.stringify(module.tags)},
    "vector": "${module.category === 'business' ? 'Strategic' : module.category === 'marketing' ? 'Rhetoric' : 'Content'}",
    "input_schema": {
      "domain": "string (business|marketing|sales|analytics)",
      "scale": "string (startup|smb|enterprise)",
      "urgency": "string (standard|high|critical)",
      "complexity": "string (basic|intermediate|advanced)",
      "resources": "string (limited|standard|unlimited)",
      "application": "string (content|strategy|analysis)",
      "output": "string (text|structured|visual)"
    },
    "output_format": {
      "txt": "always_available",
      "md": "creator_plus",
      "pdf": "pro_plus",
      "json": "pro_plus",
      "bundle_zip": "enterprise_only"
    },
    "scoring": {
      "threshold": 80,
      "criteria": ["clarity", "execution", "completeness"],
      "export_eligible": "score >= 80"
    },
    "entitlements": {
      "free": ["basic_usage", "txt_export"],
      "creator": ["all_modules", "md_export"],
      "pro": ["live_testing", "pdf_json_export"],
      "enterprise": ["api_access", "bundle_export", "white_label"]
    }
  }
}`}
              </pre>
            </div>
          </div>

          {/* Telemetry Note */}
          <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-4">
            <p className="text-sm text-yellow-200">
              <Zap className="w-4 h-4 inline mr-2" />
              Scores and exports are logged in Telemetry for audit and optimization.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-700">
            <Button
              onClick={handleUseInGenerator}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
            >
              Use in Generator
              <ArrowRight className="w-4 h-4 ml-2" />
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
