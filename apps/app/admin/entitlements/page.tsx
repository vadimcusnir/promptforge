"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Search, Package, Settings, CheckCircle, XCircle, Save, AlertTriangle, Download } from "lucide-react"

// Mock entitlements data
const mockEntitlements = {
  plans: ["Free", "Creator", "Pro", "Enterprise"],
  features: [
    {
      category: "Core Access",
      features: [
        {
          key: "modules_basic",
          name: "Basic Modules (M01, M10, M18)",
          free: true,
          creator: true,
          pro: true,
          enterprise: true,
        },
        { key: "modules_all", name: "All 50 Modules", free: false, creator: true, pro: true, enterprise: true },
        { key: "live_testing", name: "Live GPT Testing", free: false, creator: false, pro: true, enterprise: true },
        {
          key: "simulation_testing",
          name: "Simulation Testing",
          free: true,
          creator: true,
          pro: true,
          enterprise: true,
        },
      ],
    },
    {
      category: "Export Options",
      features: [
        { key: "export_txt", name: "Text Export", free: true, creator: true, pro: true, enterprise: true },
        { key: "export_md", name: "Markdown Export", free: false, creator: true, pro: true, enterprise: true },
        { key: "export_pdf", name: "PDF Export", free: false, creator: false, pro: true, enterprise: true },
        { key: "export_json", name: "JSON Export", free: false, creator: false, pro: true, enterprise: true },
        { key: "export_bundle", name: "Bundle ZIP Export", free: false, creator: false, pro: false, enterprise: true },
      ],
    },
    {
      category: "API & Integration",
      features: [
        { key: "api_access", name: "API Access", free: false, creator: false, pro: false, enterprise: true },
        { key: "webhooks", name: "Webhooks", free: false, creator: false, pro: false, enterprise: true },
        { key: "white_label", name: "White Label", free: false, creator: false, pro: false, enterprise: true },
        { key: "sso", name: "Single Sign-On", free: false, creator: false, pro: false, enterprise: true },
      ],
    },
    {
      category: "Support & Collaboration",
      features: [
        { key: "support_community", name: "Community Support", free: true, creator: true, pro: true, enterprise: true },
        { key: "support_email", name: "Email Support", free: false, creator: true, pro: true, enterprise: true },
        { key: "support_priority", name: "Priority Support", free: false, creator: false, pro: true, enterprise: true },
        {
          key: "support_dedicated",
          name: "Dedicated Support",
          free: false,
          creator: false,
          pro: false,
          enterprise: true,
        },
        { key: "team_seats", name: "Team Seats", free: false, creator: false, pro: true, enterprise: true },
      ],
    },
  ],
  industryPacks: [
    { id: "marketing", name: "Marketing Pack", description: "Advanced marketing modules and templates", enabled: true },
    {
      id: "development",
      name: "Development Pack",
      description: "Code generation and technical documentation",
      enabled: false,
    },
    { id: "finance", name: "Finance Pack", description: "Financial analysis and reporting tools", enabled: true },
    {
      id: "healthcare",
      name: "Healthcare Pack",
      description: "Medical and healthcare-specific modules",
      enabled: false,
    },
  ],
  orgOverrides: {
    live_testing: true,
    export_pdf: true,
    priority_support: false,
  },
}

export default function AdminEntitlements() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [orgOverrides, setOrgOverrides] = useState(mockEntitlements.orgOverrides)
  const [industryPacks, setIndustryPacks] = useState(mockEntitlements.industryPacks)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [orgOverrides, industryPacks])

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("[v0] Admin entitlements view tracked", { searchTerm, selectedCategory })
    }
  }, [searchTerm, selectedCategory])

  const filteredFeatures = mockEntitlements.features.filter((category) => {
    if (selectedCategory !== "all" && category.category !== selectedCategory) return false
    if (!searchTerm) return true
    return category.features.some((feature) => feature.name.toLowerCase().includes(searchTerm.toLowerCase()))
  })

  const handleOverrideToggle = (featureKey: string, enabled: boolean) => {
    // Guard rails for critical features
    if (featureKey === "api_access" && enabled) {
      const confirmed = window.confirm(
        "Enabling API access will grant full programmatic access to this organization. Are you sure?",
      )
      if (!confirmed) return
    }

    if (featureKey === "white_label" && !enabled) {
      const confirmed = window.confirm("Disabling white label may affect existing integrations. Continue?")
      if (!confirmed) return
    }

    setOrgOverrides((prev) => ({
      ...prev,
      [featureKey]: enabled,
    }))

    // Log the action
    console.log("[v0] Entitlement override changed", { featureKey, enabled, timestamp: new Date().toISOString() })
  }

  const handleIndustryPackToggle = (packId: string, enabled: boolean) => {
    const pack = industryPacks.find((p) => p.id === packId)

    if (enabled && pack) {
      // Show export requirements when enabling
      const exportRequirements = getPackExportRequirements(packId)
      if (exportRequirements.length > 0) {
        const confirmed = window.confirm(
          `Enabling ${pack.name} will enforce these export requirements:\n${exportRequirements.join("\n")}\n\nContinue?`,
        )
        if (!confirmed) return
      }
    }

    setIndustryPacks((prev) => prev.map((pack) => (pack.id === packId ? { ...pack, enabled } : pack)))

    // Log the action
    console.log("[v0] Industry pack toggled", { packId, enabled, timestamp: new Date().toISOString() })
  }

  const getPackExportRequirements = (packId: string): string[] => {
    const requirements: Record<string, string[]> = {
      marketing: ["• PDF exports must include attribution", "• JSON exports require license header"],
      development: ["• Code exports must include license notice", "• Bundle exports require checksum validation"],
      finance: ["• All exports require audit trail", "• PDF exports must be encrypted"],
      healthcare: ["• HIPAA compliance required for all exports", "• Data retention policies enforced"],
    }
    return requirements[packId] || []
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      // Create snapshot before saving
      const snapshot = {
        timestamp: new Date().toISOString(),
        orgOverrides: { ...orgOverrides },
        industryPacks: [...industryPacks],
        savedBy: "admin-user", // In real app, get from session
      }

      console.log("[v0] Creating entitlements snapshot", snapshot)

      // Simulate API call to save changes
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In real implementation, this would be an API call:
      // await fetch('/api/admin/entitlements', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ orgOverrides, industryPacks, snapshot })
      // })

      setLastSaved(new Date())
      setHasUnsavedChanges(false)

      console.log("[v0] Entitlements saved successfully", {
        overrideCount: Object.keys(orgOverrides).length,
        enabledPacks: industryPacks.filter((p) => p.enabled).length,
      })
    } catch (error) {
      console.error("[v0] Failed to save entitlements", error)
      alert("Failed to save changes. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportSnapshot = () => {
    const snapshot = {
      timestamp: new Date().toISOString(),
      orgOverrides,
      industryPacks,
      metadata: {
        totalOverrides: Object.keys(orgOverrides).length,
        enabledPacks: industryPacks.filter((p) => p.enabled).length,
        exportedBy: "admin-user",
      },
    }

    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `entitlements-snapshot-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    console.log("[v0] Entitlements snapshot exported", snapshot.metadata)
  }

  const getFeatureIcon = (enabled: boolean) => {
    return enabled ? <CheckCircle className="h-4 w-4 text-green-400" /> : <XCircle className="h-4 w-4 text-red-400" />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#CDA434] mb-2">Entitlements Management</h1>
          <p className="text-gray-400">Manage feature access and permissions across plans and organizations</p>
        </div>

        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          {lastSaved && <div className="text-sm text-gray-400">Last saved: {lastSaved.toLocaleTimeString()}</div>}
          <Button
            onClick={handleExportSnapshot}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 focus:ring-2 focus:ring-[#00FF7F] bg-transparent"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Snapshot
          </Button>
          <Button
            onClick={handleSaveChanges}
            disabled={!hasUnsavedChanges || isSaving}
            className="bg-[#CDA434] text-black hover:bg-[#CDA434]/90 focus:ring-2 focus:ring-[#00FF7F]"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {hasUnsavedChanges && (
        <Alert className="border-yellow-600 bg-yellow-900/20">
          <AlertTriangle className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-300">
            You have unsaved changes. Don't forget to save your modifications.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 focus:ring-2 focus:ring-[#00FF7F]"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48 bg-gray-900 border-gray-700 focus:ring-2 focus:ring-[#00FF7F]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all">All Categories</SelectItem>
            {mockEntitlements.features.map((category) => (
              <SelectItem key={category.category} value={category.category}>
                {category.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-[#CDA434] flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Industry Packs
          </CardTitle>
          <CardDescription className="text-gray-400">
            Enable or disable specialized feature packs for this organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {industryPacks.map((pack) => (
              <div
                key={pack.id}
                className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-white">{pack.name}</h3>
                    {pack.enabled && <Badge className="bg-green-900 text-green-300 text-xs">Active</Badge>}
                  </div>
                  <p className="text-sm text-gray-400">{pack.description}</p>
                  {pack.enabled && <div className="mt-2 text-xs text-yellow-300">Export requirements enforced</div>}
                </div>
                <Switch
                  checked={pack.enabled}
                  onCheckedChange={(enabled) => handleIndustryPackToggle(pack.id, enabled)}
                  className="data-[state=checked]:bg-[#CDA434] focus:ring-2 focus:ring-[#00FF7F]"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-[#CDA434] flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Feature Entitlements Matrix
          </CardTitle>
          <CardDescription className="text-gray-400">
            View and override feature access for this organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredFeatures.map((category) => (
              <div key={category.category}>
                <h3 className="text-lg font-semibold text-[#CDA434] mb-4">{category.category}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-300">Feature</th>
                        {mockEntitlements.plans.map((plan) => (
                          <th key={plan} className="text-center py-3 px-4 text-gray-300 min-w-20">
                            {plan}
                          </th>
                        ))}
                        <th className="text-center py-3 px-4 text-gray-300 min-w-24">Org Override</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.features.map((feature) => (
                        <tr key={feature.key} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-white">{feature.name}</span>
                              {orgOverrides[feature.key] !== undefined && (
                                <Badge variant="outline" className="text-xs border-[#CDA434] text-[#CDA434]">
                                  Override
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="text-center py-3 px-4">{getFeatureIcon(feature.free)}</td>
                          <td className="text-center py-3 px-4">{getFeatureIcon(feature.creator)}</td>
                          <td className="text-center py-3 px-4">{getFeatureIcon(feature.pro)}</td>
                          <td className="text-center py-3 px-4">{getFeatureIcon(feature.enterprise)}</td>
                          <td className="text-center py-3 px-4">
                            <Switch
                              checked={orgOverrides[feature.key] ?? false}
                              onCheckedChange={(enabled) => handleOverrideToggle(feature.key, enabled)}
                              className="data-[state=checked]:bg-[#CDA434] focus:ring-2 focus:ring-[#00FF7F]"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {Object.keys(orgOverrides).length > 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-[#CDA434] flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Active Overrides
            </CardTitle>
            <CardDescription className="text-gray-400">Current organization-level feature overrides</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(orgOverrides).map(([key, enabled]) => {
                const feature = mockEntitlements.features.flatMap((cat) => cat.features).find((f) => f.key === key)

                if (!feature) return null

                return (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {enabled ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                      <span className="text-white">{feature.name}</span>
                    </div>
                    <Badge className={enabled ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}>
                      {enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
