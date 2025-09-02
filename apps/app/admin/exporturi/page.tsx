"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Download,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Archive,
  RefreshCw,
  AlertTriangle,
  Shield,
  Clock,
  Trash2,
  ExternalLink,
  BarChart3,
  TrendingUp,
  Target,
} from "lucide-react"

const qualityMetrics = {
  passRate: { current: 87.3, target: 80, trend: 2.9 },
  avgClarity: { current: 89.2, target: 85, trend: 1.5 },
  avgExecution: { current: 91.4, target: 85, trend: 3.2 },
  avgAmbiguity: { current: 15.7, target: 20, trend: -2.1 },
  avgBusinessFit: { current: 88.6, target: 75, trend: 4.3 },
  repairCandidates: 23,

  // Quality distribution by module
  moduleQuality: [
    {
      moduleId: "M01",
      runs: 2847,
      passRate: 92.1,
      clarity: 91.2,
      execution: 93.4,
      ambiguity: 12.3,
      businessFit: 90.8,
      needsRepair: false,
    },
    {
      moduleId: "M05",
      runs: 1234,
      passRate: 76.3,
      clarity: 78.9,
      execution: 82.1,
      ambiguity: 24.5,
      businessFit: 71.2,
      needsRepair: true,
    },
    {
      moduleId: "M12",
      runs: 1890,
      passRate: 89.7,
      clarity: 87.3,
      execution: 91.2,
      ambiguity: 16.8,
      businessFit: 88.9,
      needsRepair: false,
    },
    {
      moduleId: "M23",
      runs: 1567,
      passRate: 85.4,
      clarity: 86.7,
      execution: 89.1,
      ambiguity: 18.2,
      businessFit: 84.3,
      needsRepair: false,
    },
    {
      moduleId: "M34",
      runs: 987,
      passRate: 74.2,
      clarity: 76.8,
      execution: 79.3,
      ambiguity: 26.1,
      businessFit: 69.7,
      needsRepair: true,
    },
  ],

  // Quality by plan
  planQuality: [
    { plan: "Free", passRate: 82.1, avgScore: 84.3, runs: 3456 },
    { plan: "Creator", passRate: 85.7, avgScore: 87.2, runs: 2890 },
    { plan: "Pro", passRate: 89.4, avgScore: 90.1, runs: 4567 },
    { plan: "Enterprise", passRate: 92.3, avgScore: 93.2, runs: 1234 },
  ],

  // Quality alerts
  alerts: [
    {
      type: "critical",
      module: "M05",
      metric: "Pass Rate",
      value: 76.3,
      threshold: 80,
      message: "Below target threshold",
    },
    {
      type: "warning",
      module: "M34",
      metric: "Ambiguity",
      value: 26.1,
      threshold: 20,
      message: "Above ambiguity threshold",
    },
    {
      type: "info",
      module: "M01",
      metric: "Business Fit",
      value: 90.8,
      threshold: 75,
      message: "Excellent performance",
    },
  ],
}

const integrityMetrics = {
  manifestCoverage: { current: 98.7, target: 100, trend: 1.2 },
  checksumCoverage: { current: 99.1, target: 100, trend: 0.8 },
  watermarkCompliance: { current: 94.3, target: 95, trend: -0.5 },
  avgBundleSize: 2.4,

  // Integrity by format
  formatIntegrity: [
    { format: "txt", bundles: 2340, integrity: 99.8, avgSize: "1.2 KB", watermarkRequired: false },
    { format: "md", bundles: 1890, integrity: 99.5, avgSize: "1.8 KB", watermarkRequired: false },
    { format: "pdf", bundles: 890, integrity: 97.2, avgSize: "2.4 MB", watermarkRequired: true },
    { format: "json", bundles: 456, integrity: 99.9, avgSize: "0.8 KB", watermarkRequired: false },
    { format: "zip", bundles: 102, integrity: 96.1, avgSize: "3.2 MB", watermarkRequired: true },
  ],

  // Integrity alerts
  integrityAlerts: [
    { type: "critical", format: "PDF", issue: "Missing manifest", count: 12, impact: "Download blocked" },
    { type: "warning", format: "ZIP", issue: "Checksum mismatch", count: 4, impact: "Verification failed" },
    { type: "info", format: "TXT", issue: "Size anomaly", count: 2, impact: "Performance impact" },
  ],
}

// Mock export data
const mockExports = [
  {
    id: "bundle_1234567890",
    runId: "run_abc123def456",
    formats: ["txt", "md", "pdf"],
    checksumValid: true,
    exportedAt: "2024-01-15T14:20:00Z",
    size: "2.4 MB",
    sizeBytes: 2516582,
    licenseNotice: "Standard License",
    userId: "user_123",
    orgId: "org_promptforge",
    moduleId: "M01",
    status: "completed",
    downloadCount: 3,
    expiresAt: "2024-02-15T14:20:00Z",
    signedUrl: "https://cdn.promptforge.com/exports/bundle_1234567890.zip?signature=abc123",
    integrityScore: 100,
    lastVerified: "2024-01-15T15:00:00Z",
  },
  {
    id: "bundle_0987654321",
    runId: "run_def456ghi789",
    formats: ["json", "zip"],
    checksumValid: true,
    exportedAt: "2024-01-14T16:45:00Z",
    size: "1.8 MB",
    sizeBytes: 1887437,
    licenseNotice: "Enterprise License",
    userId: "user_456",
    orgId: "org_promptforge",
    moduleId: "M12",
    status: "completed",
    downloadCount: 1,
    expiresAt: "2024-02-14T16:45:00Z",
    signedUrl: "https://cdn.promptforge.com/exports/bundle_0987654321.zip?signature=def456",
    integrityScore: 100,
    lastVerified: "2024-01-14T17:00:00Z",
  },
  {
    id: "bundle_1122334455",
    runId: "run_ghi789jkl012",
    formats: ["txt"],
    checksumValid: false,
    exportedAt: "2024-01-13T12:30:00Z",
    size: "0.5 MB",
    sizeBytes: 524288,
    licenseNotice: "Standard License",
    userId: "user_789",
    orgId: "org_promptforge",
    moduleId: "M05",
    status: "corrupted",
    downloadCount: 0,
    expiresAt: "2024-02-13T12:30:00Z",
    signedUrl: null,
    integrityScore: 45,
    lastVerified: "2024-01-13T13:00:00Z",
  },
  {
    id: "bundle_5566778899",
    runId: "run_jkl012mno345",
    formats: ["md", "pdf", "json"],
    checksumValid: true,
    exportedAt: "2024-01-12T09:15:00Z",
    size: "3.2 MB",
    sizeBytes: 3355443,
    licenseNotice: "Pro License",
    userId: "user_012",
    orgId: "org_promptforge",
    moduleId: "M23",
    status: "completed",
    downloadCount: 7,
    expiresAt: "2024-02-12T09:15:00Z",
    signedUrl: "https://cdn.promptforge.com/exports/bundle_5566778899.zip?signature=ghi789",
    integrityScore: 98,
    lastVerified: "2024-01-12T10:00:00Z",
  },
]

const mockManifest = {
  bundle_id: "bundle_1234567890",
  created_at: "2024-01-15T14:20:00Z",
  run_id: "run_abc123def456",
  module_id: "M01",
  user_id: "user_123",
  org_id: "org_promptforge",
  files: [
    {
      name: "prompt.txt",
      size: "1.2 KB",
      sizeBytes: 1228,
      checksum: "sha256:abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567",
    },
    {
      name: "prompt.md",
      size: "1.5 KB",
      sizeBytes: 1536,
      checksum: "sha256:def456ghi789jkl012mno345pqr678stu901vwx234yz567abc123",
    },
    {
      name: "prompt.pdf",
      size: "2.4 MB",
      sizeBytes: 2516582,
      checksum: "sha256:ghi789jkl012mno345pqr678stu901vwx234yz567abc123def456",
    },
    {
      name: "metadata.json",
      size: "0.8 KB",
      sizeBytes: 819,
      checksum: "sha256:jkl012mno345pqr678stu901vwx234yz567abc123def456ghi789",
    },
  ],
  total_size: "2.4 MB",
  total_size_bytes: 2516582,
  license: "Standard License",
  watermark: false,
  integrity_checks: {
    checksum_verified: true,
    file_count_match: true,
    size_match: true,
    license_embedded: true,
  },
}

export default function AdminExporturi() {
  const [exports, setExports] = useState(mockExports)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [formatFilter, setFormatFilter] = useState("all")
  const [selectedExports, setSelectedExports] = useState<string[]>([])
  const [selectedExport, setSelectedExport] = useState<any>(null)
  const [showManifest, setShowManifest] = useState(false)
  const [verifyingChecksum, setVerifyingChecksum] = useState<string | null>(null)
  const [bulkOperationInProgress, setBulkOperationInProgress] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [activeTab, setActiveTab] = useState<"exports" | "quality" | "integrity">("exports")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("[v0] Admin export audit view tracked", {
        exportCount: exports.length,
        searchTerm,
        statusFilter,
        formatFilter,
        timestamp: new Date().toISOString(),
      })
    }
  }, [exports.length, searchTerm, statusFilter, formatFilter])

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date())
      // Simulate real-time updates
      setExports((prevExports) =>
        prevExports.map((exp) => {
          if (Math.random() < 0.1) {
            // 10% chance to update integrity score
            return {
              ...exp,
              integrityScore: Math.max(exp.integrityScore + (Math.random() - 0.5) * 10, 0),
              lastVerified: new Date().toISOString(),
            }
          }
          return exp
        }),
      )
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const filteredExports = exports.filter((exp) => {
    // Org-scoped security - only show exports from current org
    if (exp.orgId !== "org_promptforge") return false

    const matchesSearch =
      exp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.runId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.moduleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.userId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || exp.status === statusFilter
    const matchesFormat = formatFilter === "all" || exp.formats.includes(formatFilter)

    return matchesSearch && matchesStatus && matchesFormat
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-900 text-green-300",
      corrupted: "bg-red-900 text-red-300",
      expired: "bg-yellow-900 text-yellow-300",
      processing: "bg-blue-900 text-blue-300",
    }
    return variants[status as keyof typeof variants] || variants.completed
  }

  const getIntegrityColor = (score: number) => {
    if (score >= 95) return "text-green-400"
    if (score >= 80) return "text-yellow-400"
    return "text-red-400"
  }

  const getChecksumIcon = (valid: boolean) => {
    return valid ? <CheckCircle className="h-4 w-4 text-green-400" /> : <XCircle className="h-4 w-4 text-red-400" />
  }

  const handleVerifyChecksum = async (bundleId: string) => {
    setVerifyingChecksum(bundleId)

    try {
      // Simulate API call for checksum verification
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const isValid = Math.random() > 0.2 // 80% success rate
      const newIntegrityScore = isValid ? Math.floor(Math.random() * 5) + 95 : Math.floor(Math.random() * 50) + 20

      setExports(
        exports.map((exp) =>
          exp.id === bundleId
            ? {
                ...exp,
                checksumValid: isValid,
                integrityScore: newIntegrityScore,
                lastVerified: new Date().toISOString(),
                status: isValid ? "completed" : "corrupted",
              }
            : exp,
        ),
      )

      // Log admin action
      console.log("[v0] Checksum verification performed", {
        bundleId,
        result: isValid ? "valid" : "invalid",
        integrityScore: newIntegrityScore,
        verifiedBy: "current-admin",
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("[v0] Failed to verify checksum", error)
      alert("Failed to verify checksum. Please try again.")
    } finally {
      setVerifyingChecksum(null)
    }
  }

  const handleDownload = async (bundleId: string) => {
    const exportItem = exports.find((exp) => exp.id === bundleId)
    if (!exportItem) return

    if (!exportItem.checksumValid) {
      alert("Cannot download corrupted bundle. Please verify integrity first.")
      return
    }

    if (isExpired(exportItem.expiresAt)) {
      alert("This bundle has expired and is no longer available for download.")
      return
    }

    try {
      // Generate signed URL for secure download
      const signedUrl =
        exportItem.signedUrl || `https://cdn.promptforge.com/exports/${bundleId}.zip?signature=${Date.now()}`

      // Simulate download
      window.open(signedUrl, "_blank")

      setExports(exports.map((exp) => (exp.id === bundleId ? { ...exp, downloadCount: exp.downloadCount + 1 } : exp)))

      // Log admin action
      console.log("[v0] Bundle downloaded", {
        bundleId,
        userId: exportItem.userId,
        moduleId: exportItem.moduleId,
        size: exportItem.sizeBytes,
        downloadedBy: "current-admin",
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("[v0] Failed to download bundle", error)
      alert("Failed to download bundle. Please try again.")
    }
  }

  const handleBulkOperation = async (operation: string) => {
    if (selectedExports.length === 0) return

    const confirmed = window.confirm(
      `Are you sure you want to ${operation} ${selectedExports.length} selected bundle(s)?`,
    )
    if (!confirmed) return

    setBulkOperationInProgress(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (operation === "verify") {
        setExports(
          exports.map((exp) =>
            selectedExports.includes(exp.id)
              ? {
                  ...exp,
                  checksumValid: Math.random() > 0.1,
                  integrityScore: Math.floor(Math.random() * 20) + 80,
                  lastVerified: new Date().toISOString(),
                }
              : exp,
          ),
        )
      } else if (operation === "delete") {
        setExports(exports.filter((exp) => !selectedExports.includes(exp.id)))
      }

      setSelectedExports([])

      // Log admin action
      console.log("[v0] Bulk operation performed", {
        operation,
        bundleCount: selectedExports.length,
        bundleIds: selectedExports,
        performedBy: "current-admin",
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("[v0] Failed to perform bulk operation", error)
      alert("Failed to perform bulk operation. Please try again.")
    } finally {
      setBulkOperationInProgress(false)
    }
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleExportSelection = (bundleId: string, checked: boolean) => {
    if (checked) {
      setSelectedExports([...selectedExports, bundleId])
    } else {
      setSelectedExports(selectedExports.filter((id) => id !== bundleId))
    }
  }

  const selectAllExports = (checked: boolean) => {
    if (checked) {
      setSelectedExports(filteredExports.map((exp) => exp.id))
    } else {
      setSelectedExports([])
    }
  }

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`
  const formatChange = (value: number) => {
    const sign = value >= 0 ? "+" : ""
    return `${sign}${value.toFixed(1)}%`
  }

  const getChangeColor = (value: number) => {
    return value >= 0 ? "text-green-400" : "text-red-400"
  }

  const getQualityColor = (value: number, threshold: number, higherIsBetter = true) => {
    const isGood = higherIsBetter ? value >= threshold : value <= threshold
    if (isGood) return "text-green-400"
    if (Math.abs(value - threshold) <= threshold * 0.1) return "text-yellow-400"
    return "text-red-400"
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-red-500 bg-red-500/10"
      case "warning":
        return "border-yellow-500 bg-yellow-500/10"
      case "info":
        return "border-green-500 bg-green-500/10"
      default:
        return "border-gray-500 bg-gray-500/10"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#CDA434] mb-2">Quality & Export Integrity Monitoring</h1>
          <p className="text-gray-400">Monitor content quality, export integrity, and audit-grade compliance</p>
        </div>

        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <div className="text-sm text-gray-400">Last updated: {lastRefresh.toLocaleTimeString()}</div>
          {selectedExports.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkOperation("verify")}
                disabled={bulkOperationInProgress}
                className="border-gray-700 text-gray-300 hover:bg-gray-800 focus:ring-2 focus:ring-[#00FF7F]"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Verify Selected
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkOperation("delete")}
                disabled={bulkOperationInProgress}
                className="border-red-700 text-red-300 hover:bg-red-800 focus:ring-2 focus:ring-[#00FF7F]"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        <Button
          variant={activeTab === "exports" ? "default" : "ghost"}
          onClick={() => setActiveTab("exports")}
          className={`flex-1 ${activeTab === "exports" ? "bg-[#CDA434] text-black" : "text-gray-300 hover:text-white"} focus:ring-2 focus:ring-[#00FF7F]`}
        >
          <Archive className="h-4 w-4 mr-2" />
          Export Audit
        </Button>
        <Button
          variant={activeTab === "quality" ? "default" : "ghost"}
          onClick={() => setActiveTab("quality")}
          className={`flex-1 ${activeTab === "quality" ? "bg-[#CDA434] text-black" : "text-gray-300 hover:text-white"} focus:ring-2 focus:ring-[#00FF7F]`}
        >
          <Target className="h-4 w-4 mr-2" />
          Quality Monitoring
        </Button>
        <Button
          variant={activeTab === "integrity" ? "default" : "ghost"}
          onClick={() => setActiveTab("integrity")}
          className={`flex-1 ${activeTab === "integrity" ? "bg-[#CDA434] text-black" : "text-gray-300 hover:text-white"} focus:ring-2 focus:ring-[#00FF7F]`}
        >
          <Shield className="h-4 w-4 mr-2" />
          Integrity Monitoring
        </Button>
      </div>

      {activeTab === "quality" && (
        <div className="space-y-6">
          {/* Quality Alerts */}
          {qualityMetrics.alerts.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-[#CDA434]">Quality Alerts</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {qualityMetrics.alerts.map((alert, index) => (
                  <Card key={index} className={`bg-gray-900 border ${getAlertColor(alert.type)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-white">
                            {alert.module} - {alert.metric}
                          </h3>
                          <p className="text-sm text-gray-300 mt-1">{alert.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Current: {alert.value} | Threshold: {alert.threshold}
                          </p>
                        </div>
                        <AlertTriangle
                          className={`h-5 w-5 ${alert.type === "critical" ? "text-red-400" : alert.type === "warning" ? "text-yellow-400" : "text-green-400"}`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Quality Overview Metrics */}
          <div>
            <h2 className="text-xl font-semibold text-[#CDA434] mb-4">Quality Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Pass Rate</CardTitle>
                  <Target className="h-4 w-4 text-[#CDA434]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {formatPercentage(qualityMetrics.passRate.current)}
                  </div>
                  <p className={`text-xs ${getChangeColor(qualityMetrics.passRate.trend)}`}>
                    {formatChange(qualityMetrics.passRate.trend)} vs last period
                  </p>
                  <p
                    className={`text-xs ${getQualityColor(qualityMetrics.passRate.current, qualityMetrics.passRate.target)}`}
                  >
                    Target: ≥{formatPercentage(qualityMetrics.passRate.target)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Avg Clarity</CardTitle>
                  <BarChart3 className="h-4 w-4 text-[#CDA434]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {formatPercentage(qualityMetrics.avgClarity.current)}
                  </div>
                  <p className={`text-xs ${getChangeColor(qualityMetrics.avgClarity.trend)}`}>
                    {formatChange(qualityMetrics.avgClarity.trend)} vs last period
                  </p>
                  <p
                    className={`text-xs ${getQualityColor(qualityMetrics.avgClarity.current, qualityMetrics.avgClarity.target)}`}
                  >
                    Target: ≥{formatPercentage(qualityMetrics.avgClarity.target)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Avg Execution</CardTitle>
                  <CheckCircle className="h-4 w-4 text-[#CDA434]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {formatPercentage(qualityMetrics.avgExecution.current)}
                  </div>
                  <p className={`text-xs ${getChangeColor(qualityMetrics.avgExecution.trend)}`}>
                    {formatChange(qualityMetrics.avgExecution.trend)} vs last period
                  </p>
                  <p
                    className={`text-xs ${getQualityColor(qualityMetrics.avgExecution.current, qualityMetrics.avgExecution.target)}`}
                  >
                    Target: ≥{formatPercentage(qualityMetrics.avgExecution.target)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Avg Ambiguity</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-[#CDA434]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {formatPercentage(qualityMetrics.avgAmbiguity.current)}
                  </div>
                  <p className={`text-xs ${getChangeColor(qualityMetrics.avgAmbiguity.trend)}`}>
                    {formatChange(qualityMetrics.avgAmbiguity.trend)} vs last period
                  </p>
                  <p
                    className={`text-xs ${getQualityColor(qualityMetrics.avgAmbiguity.current, qualityMetrics.avgAmbiguity.target, false)}`}
                  >
                    Target: ≤{formatPercentage(qualityMetrics.avgAmbiguity.target)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Repair Candidates</CardTitle>
                  <RefreshCw className="h-4 w-4 text-[#CDA434]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{qualityMetrics.repairCandidates}</div>
                  <p className="text-xs text-gray-400">Modules below threshold</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Module Quality Performance */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-[#CDA434] flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Module Quality Performance
              </CardTitle>
              <CardDescription className="text-gray-400">
                Quality metrics by module with repair recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-300">Module</th>
                      <th className="text-right py-3 px-4 text-gray-300">Runs</th>
                      <th className="text-right py-3 px-4 text-gray-300">Pass Rate</th>
                      <th className="text-right py-3 px-4 text-gray-300">Clarity</th>
                      <th className="text-right py-3 px-4 text-gray-300">Execution</th>
                      <th className="text-right py-3 px-4 text-gray-300">Ambiguity</th>
                      <th className="text-right py-3 px-4 text-gray-300">Business Fit</th>
                      <th className="text-right py-3 px-4 text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qualityMetrics.moduleQuality.map((module, index) => (
                      <tr key={module.moduleId} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="border-[#CDA434] text-[#CDA434]">
                            {module.moduleId}
                          </Badge>
                        </td>
                        <td className="text-right py-3 px-4 text-white">{module.runs.toLocaleString()}</td>
                        <td className={`text-right py-3 px-4 font-medium ${getQualityColor(module.passRate, 80)}`}>
                          {formatPercentage(module.passRate)}
                        </td>
                        <td className={`text-right py-3 px-4 ${getQualityColor(module.clarity, 85)}`}>
                          {formatPercentage(module.clarity)}
                        </td>
                        <td className={`text-right py-3 px-4 ${getQualityColor(module.execution, 85)}`}>
                          {formatPercentage(module.execution)}
                        </td>
                        <td className={`text-right py-3 px-4 ${getQualityColor(module.ambiguity, 20, false)}`}>
                          {formatPercentage(module.ambiguity)}
                        </td>
                        <td className={`text-right py-3 px-4 ${getQualityColor(module.businessFit, 75)}`}>
                          {formatPercentage(module.businessFit)}
                        </td>
                        <td className="text-right py-3 px-4">
                          {module.needsRepair ? (
                            <Badge className="bg-red-900 text-red-300">Needs Repair</Badge>
                          ) : (
                            <Badge className="bg-green-900 text-green-300">Healthy</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quality by Plan */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-[#CDA434] flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Quality Performance by Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {qualityMetrics.planQuality.map((plan, index) => (
                  <div key={plan.plan} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-white">{plan.plan}</h3>
                      <Badge className="bg-gray-700 text-gray-300">{plan.runs.toLocaleString()} runs</Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Pass Rate:</span>
                        <span className={`font-medium ${getQualityColor(plan.passRate, 80)}`}>
                          {formatPercentage(plan.passRate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg Score:</span>
                        <span className="text-white font-medium">{formatPercentage(plan.avgScore)}</span>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Quality Level</span>
                      </div>
                      <Progress value={plan.avgScore} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "integrity" && (
        <div className="space-y-6">
          {/* Integrity Alerts */}
          {integrityMetrics.integrityAlerts.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-[#CDA434]">Integrity Alerts</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {integrityMetrics.integrityAlerts.map((alert, index) => (
                  <Card key={index} className={`bg-gray-900 border ${getAlertColor(alert.type)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-white">
                            {alert.format} - {alert.issue}
                          </h3>
                          <p className="text-sm text-gray-300 mt-1">{alert.count} affected bundles</p>
                          <p className="text-xs text-gray-400 mt-2">Impact: {alert.impact}</p>
                        </div>
                        <Shield
                          className={`h-5 w-5 ${alert.type === "critical" ? "text-red-400" : alert.type === "warning" ? "text-yellow-400" : "text-green-400"}`}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Integrity Overview Metrics */}
          <div>
            <h2 className="text-xl font-semibold text-[#CDA434] mb-4">Export Integrity Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Manifest Coverage</CardTitle>
                  <FileText className="h-4 w-4 text-[#CDA434]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {formatPercentage(integrityMetrics.manifestCoverage.current)}
                  </div>
                  <p className={`text-xs ${getChangeColor(integrityMetrics.manifestCoverage.trend)}`}>
                    {formatChange(integrityMetrics.manifestCoverage.trend)} vs last period
                  </p>
                  <p
                    className={`text-xs ${getQualityColor(integrityMetrics.manifestCoverage.current, integrityMetrics.manifestCoverage.target)}`}
                  >
                    Target: {formatPercentage(integrityMetrics.manifestCoverage.target)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Checksum Coverage</CardTitle>
                  <CheckCircle className="h-4 w-4 text-[#CDA434]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {formatPercentage(integrityMetrics.checksumCoverage.current)}
                  </div>
                  <p className={`text-xs ${getChangeColor(integrityMetrics.checksumCoverage.trend)}`}>
                    {formatChange(integrityMetrics.checksumCoverage.trend)} vs last period
                  </p>
                  <p
                    className={`text-xs ${getQualityColor(integrityMetrics.checksumCoverage.current, integrityMetrics.checksumCoverage.target)}`}
                  >
                    Target: {formatPercentage(integrityMetrics.checksumCoverage.target)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Watermark Compliance</CardTitle>
                  <Shield className="h-4 w-4 text-[#CDA434]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {formatPercentage(integrityMetrics.watermarkCompliance.current)}
                  </div>
                  <p className={`text-xs ${getChangeColor(integrityMetrics.watermarkCompliance.trend)}`}>
                    {formatChange(integrityMetrics.watermarkCompliance.trend)} vs last period
                  </p>
                  <p
                    className={`text-xs ${getQualityColor(integrityMetrics.watermarkCompliance.current, integrityMetrics.watermarkCompliance.target)}`}
                  >
                    Target: ≥{formatPercentage(integrityMetrics.watermarkCompliance.target)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Avg Bundle Size</CardTitle>
                  <Archive className="h-4 w-4 text-[#CDA434]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{integrityMetrics.avgBundleSize} MB</div>
                  <p className="text-xs text-gray-400">Average across all formats</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Format Integrity Performance */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-[#CDA434] flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Integrity by Export Format
              </CardTitle>
              <CardDescription className="text-gray-400">
                Audit-grade integrity metrics for each export format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {integrityMetrics.formatIntegrity.map((format, index) => (
                  <div key={format.format} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-white uppercase">{format.format}</h3>
                      <Badge className="bg-gray-700 text-gray-300">{format.bundles.toLocaleString()}</Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Integrity:</span>
                        <span className={`font-medium ${getQualityColor(format.integrity, 95)}`}>
                          {formatPercentage(format.integrity)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg Size:</span>
                        <span className="text-white font-medium">{format.avgSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Watermark:</span>
                        <Badge
                          className={
                            format.watermarkRequired ? "bg-yellow-900 text-yellow-300" : "bg-green-900 text-green-300"
                          }
                        >
                          {format.watermarkRequired ? "Required" : "Not Required"}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">Integrity Score</span>
                      </div>
                      <Progress value={format.integrity} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "exports" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by bundle ID, run ID, module, or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 focus:ring-2 focus:ring-[#00FF7F]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-gray-900 border-gray-700 focus:ring-2 focus:ring-[#00FF7F]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="corrupted">Corrupted</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
            <Select value={formatFilter} onValueChange={setFormatFilter}>
              <SelectTrigger className="w-32 bg-gray-900 border-gray-700 focus:ring-2 focus:ring-[#00FF7F]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="txt">TXT</SelectItem>
                <SelectItem value="md">MD</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="zip">ZIP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Exports</p>
                    <p className="text-2xl font-bold text-white">{exports.length}</p>
                  </div>
                  <Archive className="h-8 w-8 text-[#CDA434]" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Valid Checksums</p>
                    <p className="text-2xl font-bold text-green-400">{exports.filter((e) => e.checksumValid).length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Corrupted</p>
                    <p className="text-2xl font-bold text-red-400">{exports.filter((e) => !e.checksumValid).length}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Downloads</p>
                    <p className="text-2xl font-bold text-white">
                      {exports.reduce((sum, e) => sum + e.downloadCount, 0)}
                    </p>
                  </div>
                  <Download className="h-8 w-8 text-[#CDA434]" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Size</p>
                    <p className="text-2xl font-bold text-white">
                      {formatBytes(exports.reduce((sum, e) => sum + e.sizeBytes, 0))}
                    </p>
                  </div>
                  <Archive className="h-8 w-8 text-[#CDA434]" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#CDA434] flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Export Bundles ({filteredExports.length})
                </CardTitle>
                {selectedExports.length > 0 && (
                  <Badge className="bg-blue-900 text-blue-300">{selectedExports.length} selected</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4">
                        <Checkbox
                          checked={selectedExports.length === filteredExports.length && filteredExports.length > 0}
                          onCheckedChange={selectAllExports}
                          className="focus:ring-2 focus:ring-[#00FF7F]"
                        />
                      </th>
                      <th className="text-left py-3 px-4 text-gray-300">Bundle ID</th>
                      <th className="text-left py-3 px-4 text-gray-300">Run ID</th>
                      <th className="text-left py-3 px-4 text-gray-300">Module</th>
                      <th className="text-left py-3 px-4 text-gray-300">User</th>
                      <th className="text-left py-3 px-4 text-gray-300">Formats</th>
                      <th className="text-left py-3 px-4 text-gray-300">Size</th>
                      <th className="text-left py-3 px-4 text-gray-300">Integrity</th>
                      <th className="text-left py-3 px-4 text-gray-300">Status</th>
                      <th className="text-left py-3 px-4 text-gray-300">License</th>
                      <th className="text-left py-3 px-4 text-gray-300">Exported</th>
                      <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExports.map((exportItem) => (
                      <tr key={exportItem.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-3 px-4">
                          <Checkbox
                            checked={selectedExports.includes(exportItem.id)}
                            onCheckedChange={(checked) => handleExportSelection(exportItem.id, checked as boolean)}
                            className="focus:ring-2 focus:ring-[#00FF7F]"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <code className="text-sm font-mono text-[#CDA434]">{exportItem.id.substring(0, 16)}...</code>
                        </td>
                        <td className="py-3 px-4">
                          <code className="text-sm font-mono text-gray-300">
                            {exportItem.runId.substring(0, 12)}...
                          </code>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="border-[#CDA434] text-[#CDA434]">
                            {exportItem.moduleId}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <code className="text-sm font-mono text-gray-300">
                            {exportItem.userId.substring(0, 8)}...
                          </code>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {exportItem.formats.map((format) => (
                              <Badge key={format} className="bg-gray-700 text-gray-300 text-xs">
                                {format.toUpperCase()}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white">{exportItem.size}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {getChecksumIcon(exportItem.checksumValid)}
                            <span className={getIntegrityColor(exportItem.integrityScore)}>
                              {exportItem.integrityScore}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusBadge(exportItem.status)}>{exportItem.status}</Badge>
                          {isExpired(exportItem.expiresAt) && (
                            <Badge className="bg-yellow-900 text-yellow-300 ml-1">Expired</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-gray-700 text-gray-300 text-xs">{exportItem.licenseNotice}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-gray-400 text-sm">
                            <div>{new Date(exportItem.exportedAt).toLocaleDateString()}</div>
                            <div className="flex items-center text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {exportItem.downloadCount} downloads
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedExport(exportItem)
                                setShowManifest(true)
                              }}
                              className="text-gray-400 hover:text-white focus:ring-2 focus:ring-[#00FF7F]"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerifyChecksum(exportItem.id)}
                              disabled={verifyingChecksum === exportItem.id}
                              className="text-gray-400 hover:text-white focus:ring-2 focus:ring-[#00FF7F]"
                            >
                              {verifyingChecksum === exportItem.id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(exportItem.id)}
                              disabled={!exportItem.checksumValid || isExpired(exportItem.expiresAt)}
                              className="text-gray-400 hover:text-white disabled:opacity-50 focus:ring-2 focus:ring-[#00FF7F]"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            {exportItem.signedUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(exportItem.signedUrl, "_blank")}
                                className="text-gray-400 hover:text-white focus:ring-2 focus:ring-[#00FF7F]"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showManifest && selectedExport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-gray-800 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-[#CDA434] flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Bundle Manifest
              </CardTitle>
              <CardDescription className="text-gray-400">
                Detailed information about bundle {selectedExport.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!selectedExport.checksumValid && (
                <Alert className="border-red-600 bg-red-900/20">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">
                    This bundle has integrity issues. Download is disabled until verification passes.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-gray-400">Bundle ID</Label>
                  <code className="block text-sm font-mono text-white bg-gray-800 p-2 rounded mt-1">
                    {mockManifest.bundle_id}
                  </code>
                </div>
                <div>
                  <Label className="text-gray-400">Run ID</Label>
                  <code className="block text-sm font-mono text-white bg-gray-800 p-2 rounded mt-1">
                    {mockManifest.run_id}
                  </code>
                </div>
                <div>
                  <Label className="text-gray-400">Module</Label>
                  <Badge className="bg-[#CDA434] text-black mt-1">{mockManifest.module_id}</Badge>
                </div>
                <div>
                  <Label className="text-gray-400">User</Label>
                  <code className="block text-sm font-mono text-white bg-gray-800 p-2 rounded mt-1">
                    {mockManifest.user_id}
                  </code>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-gray-400">Total Size</Label>
                  <p className="text-white mt-1">{mockManifest.total_size}</p>
                </div>
                <div>
                  <Label className="text-gray-400">File Count</Label>
                  <p className="text-white mt-1">{mockManifest.files.length} files</p>
                </div>
                <div>
                  <Label className="text-gray-400">License</Label>
                  <Badge className="bg-gray-700 text-gray-300 mt-1">{mockManifest.license}</Badge>
                </div>
                <div>
                  <Label className="text-gray-400">Watermark</Label>
                  <Badge
                    className={mockManifest.watermark ? "bg-yellow-900 text-yellow-300" : "bg-green-900 text-green-300"}
                  >
                    {mockManifest.watermark ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-gray-400 mb-3 block">Integrity Checks</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(mockManifest.integrity_checks).map(([check, passed]) => (
                    <div key={check} className="flex items-center space-x-2">
                      {passed ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                      <span className="text-sm text-white capitalize">{check.replace("_", " ")}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-gray-400 mb-3 block">Files ({mockManifest.files.length})</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {mockManifest.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-white">{file.name}</p>
                        <p className="text-sm text-gray-400">
                          {file.size} ({formatBytes(file.sizeBytes)})
                        </p>
                      </div>
                      <div className="text-right">
                        <code className="text-xs font-mono text-gray-400 break-all">
                          {file.checksum.substring(0, 20)}...
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(file.checksum)}
                          className="ml-2 text-gray-400 hover:text-white focus:ring-2 focus:ring-[#00FF7F]"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowManifest(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 focus:ring-2 focus:ring-[#00FF7F]"
                >
                  Close
                </Button>
                <Button
                  className="bg-[#CDA434] text-black hover:bg-[#CDA434]/90 focus:ring-2 focus:ring-[#00FF7F]"
                  onClick={() => handleDownload(selectedExport.id)}
                  disabled={!selectedExport.checksumValid || isExpired(selectedExport.expiresAt)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Bundle
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
