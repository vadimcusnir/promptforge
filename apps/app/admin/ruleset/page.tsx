"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Settings, FileText, History, Upload, CheckCircle, AlertTriangle, Eye, Download, RefreshCw } from "lucide-react"

// Mock ruleset data
const mockActiveRuleset = {
  version: "v2.1.3",
  checksum: "sha256:abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567",
  deployedAt: "2024-01-15T10:30:00Z",
  deployedBy: "admin@promptforge.com",
  status: "active",
  content: `# PromptForge Ruleset v2.1.3
# Configuration for prompt generation and validation

modules:
  enabled: 50
  categories:
    - strategic
    - operational
    - creative
    - analytical
    - technical
    - social
    - hybrid

parameters:
  7d_system:
    domain:
      required: true
      validation: enum
      values: [business, technical, creative, academic, personal]
    scale:
      required: true
      validation: enum
      values: [individual, team, department, organization, enterprise]
    urgency:
      required: true
      validation: enum
      values: [low, medium, high, critical]
    complexity:
      required: true
      validation: enum
      values: [simple, moderate, complex, expert]
    resources:
      required: true
      validation: enum
      values: [minimal, standard, extensive, unlimited]
    application:
      required: true
      validation: enum
      values: [analysis, creation, optimization, automation, strategy]
    output:
      required: true
      validation: enum
      values: [text, structured, visual, interactive, executable]

validation:
  prompt_length:
    min: 10
    max: 10000
  quality_threshold: 0.8
  safety_checks: true

rate_limits:
  free_tier: 10
  creator_tier: 100
  pro_tier: 1000
  enterprise_tier: unlimited

export_formats:
  txt: always_available
  md: creator_plus
  pdf: pro_plus
  json: pro_plus
  zip: enterprise_only`,
}

const mockRulesetHistory = [
  {
    version: "v2.1.3",
    checksum: "sha256:abc123...pqr678",
    deployedAt: "2024-01-15T10:30:00Z",
    deployedBy: "admin@promptforge.com",
    status: "active",
    changes: "Updated rate limits for enterprise tier",
  },
  {
    version: "v2.1.2",
    checksum: "sha256:def456...stu901",
    deployedAt: "2024-01-10T14:20:00Z",
    deployedBy: "admin@promptforge.com",
    status: "archived",
    changes: "Added new validation rules for 7D parameters",
  },
  {
    version: "v2.1.1",
    checksum: "sha256:ghi789...vwx234",
    deployedAt: "2024-01-05T09:15:00Z",
    deployedBy: "system@promptforge.com",
    status: "archived",
    changes: "Fixed export format restrictions",
  },
  {
    version: "v2.1.0",
    checksum: "sha256:jkl012...yz567",
    deployedAt: "2024-01-01T00:00:00Z",
    deployedBy: "admin@promptforge.com",
    status: "archived",
    changes: "Major update: Added hybrid module category",
  },
]

const mockOverrides = [
  {
    id: "override_1234567890",
    runId: "run_abc123def456",
    moduleId: "M01",
    userId: "user_123",
    overrideType: "rate_limit",
    originalValue: "10 requests/hour",
    overrideValue: "50 requests/hour",
    reason: "Premium user exception",
    appliedAt: "2024-01-15T12:30:00Z",
    appliedBy: "admin@promptforge.com",
  },
  {
    id: "override_0987654321",
    runId: "run_def456ghi789",
    moduleId: "M23",
    userId: "user_456",
    overrideType: "export_format",
    originalValue: "txt only",
    overrideValue: "pdf enabled",
    reason: "Beta testing participant",
    appliedAt: "2024-01-14T16:45:00Z",
    appliedBy: "admin@promptforge.com",
  },
]

export default function AdminRuleset() {
  const [activeTab, setActiveTab] = useState("current")
  const [searchTerm, setSearchTerm] = useState("")
  const [showRulesetContent, setShowRulesetContent] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<any>(null)

  const filteredOverrides = mockOverrides.filter(
    (override) =>
      override.runId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      override.moduleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      override.userId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-900 text-green-300",
      archived: "bg-gray-700 text-gray-300",
      pending: "bg-yellow-900 text-yellow-300",
    }
    return variants[status as keyof typeof variants] || variants.archived
  }

  const getOverrideTypeBadge = (type: string) => {
    const variants = {
      rate_limit: "bg-blue-900 text-blue-300",
      export_format: "bg-purple-900 text-purple-300",
      validation: "bg-orange-900 text-orange-300",
      feature_access: "bg-green-900 text-green-300",
    }
    return variants[type as keyof typeof variants] || variants.rate_limit
  }

  const handlePromoteVersion = (version: string) => {
    // Simulate version promotion
    console.log(`Promoting version ${version} to active`)
  }

  const handleViewRuleset = (version: any) => {
    setSelectedVersion(version)
    setShowRulesetContent(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#CDA434] mb-2">Ruleset Management</h1>
        <p className="text-gray-400">Manage system rules, configurations, and overrides</p>
      </div>

      {/* Active Ruleset Overview */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#CDA434] flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Active Ruleset
            </CardTitle>
            <Badge className={getStatusBadge(mockActiveRuleset.status)}>
              <CheckCircle className="h-3 w-3 mr-1" />
              {mockActiveRuleset.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-400">Version</p>
              <p className="font-bold text-white">{mockActiveRuleset.version}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Deployed At</p>
              <p className="text-white">{new Date(mockActiveRuleset.deployedAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Deployed By</p>
              <p className="text-white">{mockActiveRuleset.deployedBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Checksum</p>
              <code className="text-xs font-mono text-gray-300">{mockActiveRuleset.checksum.substring(0, 16)}...</code>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => handleViewRuleset(mockActiveRuleset)}
              className="border-[#CDA434] text-[#CDA434] hover:bg-[#CDA434] hover:text-black"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Content
            </Button>
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent">
              <Upload className="h-4 w-4 mr-2" />
              Upload New Version
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg">
        <Button
          variant={activeTab === "current" ? "default" : "ghost"}
          onClick={() => setActiveTab("current")}
          className={activeTab === "current" ? "bg-[#CDA434] text-black" : "text-gray-300 hover:text-white"}
        >
          Current Rules
        </Button>
        <Button
          variant={activeTab === "history" ? "default" : "ghost"}
          onClick={() => setActiveTab("history")}
          className={activeTab === "history" ? "bg-[#CDA434] text-black" : "text-gray-300 hover:text-white"}
        >
          Version History
        </Button>
        <Button
          variant={activeTab === "overrides" ? "default" : "ghost"}
          onClick={() => setActiveTab("overrides")}
          className={activeTab === "overrides" ? "bg-[#CDA434] text-black" : "text-gray-300 hover:text-white"}
        >
          Runtime Overrides
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === "current" && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#CDA434]">Current Configuration</CardTitle>
            <CardDescription className="text-gray-400">Active rules and parameters for the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-white mb-3">Modules</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Enabled:</span>
                    <span className="text-white">50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Categories:</span>
                    <span className="text-white">7</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">Validation</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quality Threshold:</span>
                    <span className="text-white">0.8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Safety Checks:</span>
                    <span className="text-green-400">Enabled</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-3">Rate Limits</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Free:</span>
                    <span className="text-white">10/hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pro:</span>
                    <span className="text-white">1000/hour</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "history" && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#CDA434] flex items-center">
              <History className="h-5 w-5 mr-2" />
              Version History
            </CardTitle>
            <CardDescription className="text-gray-400">
              Previous ruleset versions and deployment history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRulesetHistory.map((version) => (
                <div
                  key={version.version}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium text-white">{version.version}</h3>
                      <Badge className={getStatusBadge(version.status)}>{version.status}</Badge>
                    </div>
                    <p className="text-gray-400 mb-2">{version.changes}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>Deployed by {version.deployedBy}</span>
                      <span>{new Date(version.deployedAt).toLocaleDateString()}</span>
                      <code className="text-xs">{version.checksum}</code>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewRuleset(version)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {version.status !== "active" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePromoteVersion(version.version)}
                        className="text-gray-400 hover:text-[#CDA434]"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "overrides" && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#CDA434] flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Runtime Overrides
              </CardTitle>
              <Input
                placeholder="Search overrides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 bg-gray-800 border-gray-700"
              />
            </div>
            <CardDescription className="text-gray-400">
              Active rule overrides applied to specific runs or users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOverrides.map((override) => (
                <div key={override.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge className={getOverrideTypeBadge(override.overrideType)}>
                          {override.overrideType.replace("_", " ").toUpperCase()}
                        </Badge>
                        <code className="text-sm font-mono text-[#CDA434]">{override.runId}</code>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Original Value:</p>
                          <p className="text-white">{override.originalValue}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Override Value:</p>
                          <p className="text-green-400">{override.overrideValue}</p>
                        </div>
                      </div>
                      <p className="text-gray-400 mt-2">Reason: {override.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center space-x-4">
                      <span>Module: {override.moduleId}</span>
                      <span>User: {override.userId}</span>
                      <span>Applied by: {override.appliedBy}</span>
                    </div>
                    <span>{new Date(override.appliedAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ruleset Content Modal */}
      {showRulesetContent && selectedVersion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-gray-800 w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-[#CDA434] flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Ruleset Content - {selectedVersion.version}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-800 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">
                {mockActiveRuleset.content}
              </pre>
              <div className="flex justify-end space-x-4 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowRulesetContent(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Close
                </Button>
                <Button className="bg-[#CDA434] text-black hover:bg-[#CDA434]/90">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
