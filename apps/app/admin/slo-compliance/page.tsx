"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Search,
  TrendingUp,
  Shield,
  Eye,
  FileText,
  Users,
  Database,
  XCircle,
  AlertCircle,
  Timer,
  Zap,
} from "lucide-react"

interface SLOMetrics {
  uptime_percentage: number
  p95_latency: number
  error_budget_remaining: number
  mttr_minutes: number
  incidents_resolved_24h: number
  services: Array<{
    name: string
    uptime: number
    latency: number
    error_rate: number
    status: "healthy" | "degraded" | "down"
  }>
  sli_trends: Array<{
    timestamp: string
    uptime: number
    latency: number
    error_rate: number
  }>
  error_budget_burn: Array<{
    service: string
    budget_remaining: number
    burn_rate: number
    projected_exhaustion: string
  }>
  recent_incidents: Array<{
    id: string
    title: string
    severity: "critical" | "high" | "medium" | "low"
    status: "investigating" | "identified" | "monitoring" | "resolved"
    started_at: string
    resolved_at?: string
    mttr?: number
  }>
}

interface ComplianceMetrics {
  dsr_requests_30d: number
  dsr_export_requests: number
  dsr_erase_requests: number
  avg_dsr_response_time: number
  consent_rate: number
  retention_violations: number
  data_breach_incidents: number
  dsr_timeline: Array<{
    id: string
    type: "export" | "erase"
    org: string
    status: "pending" | "processing" | "completed" | "failed"
    requested_at: string
    completed_at?: string
    response_time?: number
  }>
  retention_violations: Array<{
    org: string
    data_type: string
    violation_type: string
    records_affected: number
    detected_at: string
  }>
  consent_audit: Array<{
    org: string
    consent_type: string
    granted: number
    revoked: number
    rate: number
    last_updated: string
  }>
}

export default function SLOCompliancePage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [sloMetrics, setSloMetrics] = useState<SLOMetrics | null>(null)
  const [complianceMetrics, setComplianceMetrics] = useState<ComplianceMetrics | null>(null)
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedService, setSelectedService] = useState("all")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadMetrics()
  }, [timeRange, selectedService, selectedRegion])

  const loadMetrics = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSloMetrics({
        uptime_percentage: 99.97,
        p95_latency: 185,
        error_budget_remaining: 87.3,
        mttr_minutes: 12,
        incidents_resolved_24h: 3,
        services: [
          { name: "API Gateway", uptime: 99.98, latency: 145, error_rate: 0.02, status: "healthy" },
          { name: "Database", uptime: 99.99, latency: 85, error_rate: 0.01, status: "healthy" },
          { name: "CDN", uptime: 99.95, latency: 220, error_rate: 0.05, status: "degraded" },
          { name: "Auth Service", uptime: 99.97, latency: 165, error_rate: 0.03, status: "healthy" },
          { name: "Export Service", uptime: 99.92, latency: 340, error_rate: 0.08, status: "degraded" },
        ],
        sli_trends: [
          { timestamp: "2024-01-15T00:00:00Z", uptime: 99.98, latency: 180, error_rate: 0.02 },
          { timestamp: "2024-01-15T06:00:00Z", uptime: 99.96, latency: 195, error_rate: 0.04 },
          { timestamp: "2024-01-15T12:00:00Z", uptime: 99.97, latency: 175, error_rate: 0.03 },
          { timestamp: "2024-01-15T18:00:00Z", uptime: 99.98, latency: 185, error_rate: 0.02 },
        ],
        error_budget_burn: [
          { service: "API Gateway", budget_remaining: 92.1, burn_rate: 0.8, projected_exhaustion: "45 days" },
          { service: "CDN", budget_remaining: 78.5, burn_rate: 2.1, projected_exhaustion: "18 days" },
          { service: "Export Service", budget_remaining: 71.2, burn_rate: 2.8, projected_exhaustion: "12 days" },
        ],
        recent_incidents: [
          {
            id: "INC-001",
            title: "CDN latency spike",
            severity: "medium",
            status: "resolved",
            started_at: "2024-01-15T10:30:00Z",
            resolved_at: "2024-01-15T10:45:00Z",
            mttr: 15,
          },
          {
            id: "INC-002",
            title: "Database connection timeout",
            severity: "high",
            status: "resolved",
            started_at: "2024-01-15T08:20:00Z",
            resolved_at: "2024-01-15T08:35:00Z",
            mttr: 15,
          },
          {
            id: "INC-003",
            title: "Export service degradation",
            severity: "medium",
            status: "monitoring",
            started_at: "2024-01-15T11:00:00Z",
          },
        ],
      })

      setComplianceMetrics({
        dsr_requests_30d: 47,
        dsr_export_requests: 32,
        dsr_erase_requests: 15,
        avg_dsr_response_time: 4.2,
        consent_rate: 94.7,
        retention_violations: 2,
        data_breach_incidents: 0,
        dsr_timeline: [
          {
            id: "DSR-001",
            type: "export",
            org: "acme-corp",
            status: "completed",
            requested_at: "2024-01-15T09:00:00Z",
            completed_at: "2024-01-15T11:30:00Z",
            response_time: 2.5,
          },
          {
            id: "DSR-002",
            type: "erase",
            org: "tech-startup",
            status: "processing",
            requested_at: "2024-01-15T10:15:00Z",
          },
          {
            id: "DSR-003",
            type: "export",
            org: "enterprise-co",
            status: "completed",
            requested_at: "2024-01-14T14:20:00Z",
            completed_at: "2024-01-15T08:45:00Z",
            response_time: 18.4,
          },
          { id: "DSR-004", type: "erase", org: "small-biz", status: "pending", requested_at: "2024-01-15T11:45:00Z" },
        ],
        retention_violations: [
          {
            org: "legacy-org",
            data_type: "user_sessions",
            violation_type: "Exceeded 90-day retention",
            records_affected: 1247,
            detected_at: "2024-01-15T08:00:00Z",
          },
          {
            org: "old-client",
            data_type: "export_logs",
            violation_type: "Missing deletion policy",
            records_affected: 89,
            detected_at: "2024-01-14T16:30:00Z",
          },
        ],
        consent_audit: [
          {
            org: "acme-corp",
            consent_type: "Analytics",
            granted: 1247,
            revoked: 23,
            rate: 98.2,
            last_updated: "2024-01-15T10:00:00Z",
          },
          {
            org: "tech-startup",
            consent_type: "Marketing",
            granted: 567,
            revoked: 45,
            rate: 92.6,
            last_updated: "2024-01-15T09:30:00Z",
          },
          {
            org: "enterprise-co",
            consent_type: "Functional",
            granted: 2134,
            revoked: 12,
            rate: 99.4,
            last_updated: "2024-01-15T11:15:00Z",
          },
        ],
      })
    } catch (error) {
      toast({
        title: "Failed to Load Metrics",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async (type: "slo" | "compliance", format: "csv" | "pdf") => {
    try {
      // Simulate export
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Export Complete",
        description: `${type.toUpperCase()} report exported as ${format.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const processIncident = async (incidentId: string, action: "acknowledge" | "resolve") => {
    try {
      // Simulate incident processing
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast({
        title: `Incident ${action === "acknowledge" ? "Acknowledged" : "Resolved"}`,
        description: `Incident ${incidentId} has been ${action}d`,
      })
      loadMetrics()
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const processDSR = async (dsrId: string, action: "approve" | "reject") => {
    try {
      // Simulate DSR processing
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast({
        title: `DSR ${action === "approve" ? "Approved" : "Rejected"}`,
        description: `DSR request ${dsrId} has been ${action}d`,
      })
      loadMetrics()
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05010A] text-white p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-[#CDA434]" />
              <p className="text-gray-400">Loading SLO and compliance metrics...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#05010A] text-white p-6">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">SLO Status & Compliance Reporting</h1>
            <p className="text-gray-400">Monitor service level objectives and GDPR compliance metrics</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => exportReport("slo", "csv")}
              className="border-[#CDA434] text-[#CDA434] hover:bg-[#CDA434] hover:text-black"
            >
              <Download className="w-4 h-4 mr-2" />
              Export SLO
            </Button>
            <Button
              variant="outline"
              onClick={() => exportReport("compliance", "pdf")}
              className="border-[#CDA434] text-[#CDA434] hover:bg-[#CDA434] hover:text-black"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Compliance
            </Button>
            <Button onClick={loadMetrics} className="bg-[#CDA434] text-black hover:bg-[#8B7355]">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-black/50 border-gray-800">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm text-gray-400 mb-2 block">Time Range</Label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="bg-black/50 border-gray-700 focus:ring-[#00FF7F]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">Last 24 hours</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-gray-400 mb-2 block">Service</Label>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="bg-black/50 border-gray-700 focus:ring-[#00FF7F]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="api">API Gateway</SelectItem>
                    <SelectItem value="db">Database</SelectItem>
                    <SelectItem value="cdn">CDN</SelectItem>
                    <SelectItem value="auth">Auth Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-gray-400 mb-2 block">Region</Label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="bg-black/50 border-gray-700 focus:ring-[#00FF7F]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="us-east">US East</SelectItem>
                    <SelectItem value="us-west">US West</SelectItem>
                    <SelectItem value="eu-west">EU West</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm text-gray-400 mb-2 block">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search incidents, DSRs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-black/50 border-gray-700 focus:ring-[#00FF7F]"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="slo-status" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-black/50">
            <TabsTrigger value="slo-status" className="data-[state=active]:bg-[#CDA434] data-[state=active]:text-black">
              <Activity className="w-4 h-4 mr-2" />
              SLO Status
            </TabsTrigger>
            <TabsTrigger value="compliance" className="data-[state=active]:bg-[#CDA434] data-[state=active]:text-black">
              <Shield className="w-4 h-4 mr-2" />
              Compliance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="slo-status" className="space-y-6">
            {/* SLO Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="bg-black/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Uptime</p>
                      <p className="text-2xl font-bold text-[#CDA434]">{sloMetrics?.uptime_percentage}%</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-[#CDA434]" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-green-400">Target: ≥99.9%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">P95 Latency</p>
                      <p className="text-2xl font-bold text-[#CDA434]">{sloMetrics?.p95_latency}ms</p>
                    </div>
                    <Clock className="w-8 h-8 text-[#CDA434]" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-green-400">Target: &lt;300ms</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Error Budget</p>
                      <p className="text-2xl font-bold text-[#CDA434]">{sloMetrics?.error_budget_remaining}%</p>
                    </div>
                    <Zap className="w-8 h-8 text-[#CDA434]" />
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-[#CDA434] h-2 rounded-full"
                        style={{ width: `${sloMetrics?.error_budget_remaining}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">MTTR</p>
                      <p className="text-2xl font-bold text-[#CDA434]">{sloMetrics?.mttr_minutes}m</p>
                    </div>
                    <Timer className="w-8 h-8 text-[#CDA434]" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-green-400">Target: &lt;15m</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Incidents (24h)</p>
                      <p className="text-2xl font-bold text-[#CDA434]">{sloMetrics?.incidents_resolved_24h}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-[#CDA434]" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400">All resolved</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Status */}
            <Card className="bg-black/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-[#CDA434]">Service Status</CardTitle>
                <CardDescription>Real-time status of all services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sloMetrics?.services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {service.status === "healthy" && <CheckCircle className="w-5 h-5 text-green-400" />}
                          {service.status === "degraded" && <AlertTriangle className="w-5 h-5 text-orange-400" />}
                          {service.status === "down" && <XCircle className="w-5 h-5 text-red-400" />}
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              service.status === "healthy"
                                ? "text-green-400 border-green-400"
                                : service.status === "degraded"
                                  ? "text-orange-400 border-orange-400"
                                  : "text-red-400 border-red-400"
                            }`}
                          >
                            {service.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-medium text-white">{service.name}</p>
                          <p className="text-xs text-gray-400">Uptime: {service.uptime}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="text-[#CDA434] font-medium">{service.latency}ms</p>
                          <p className="text-gray-400">Latency</p>
                        </div>
                        <div className="text-center">
                          <p className={`font-medium ${service.error_rate > 0.05 ? "text-red-400" : "text-green-400"}`}>
                            {service.error_rate}%
                          </p>
                          <p className="text-gray-400">Error Rate</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Error Budget Burn */}
            <Card className="bg-black/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Error Budget Burn Rate
                </CardTitle>
                <CardDescription>Services consuming error budget fastest</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sloMetrics?.error_budget_burn.map((budget, index) => (
                    <div key={index} className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{budget.service}</span>
                        <Badge variant="outline" className="text-orange-400 border-orange-400">
                          {budget.burn_rate}x burn rate
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>Budget remaining: {budget.budget_remaining}%</span>
                        <span>Exhaustion: {budget.projected_exhaustion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Incidents */}
            <Card className="bg-black/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Recent Incidents
                </CardTitle>
                <CardDescription>Latest incidents and their resolution status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sloMetrics?.recent_incidents.map((incident) => (
                    <div key={incident.id} className="p-4 bg-black/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={incident.severity === "critical" ? "destructive" : "outline"}
                            className="text-xs"
                          >
                            {incident.severity.toUpperCase()}
                          </Badge>
                          <span className="font-medium text-white">{incident.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {incident.status === "resolved" ? (
                            <Badge className="bg-green-600 text-white">RESOLVED</Badge>
                          ) : (
                            <Badge variant="outline" className="text-orange-400 border-orange-400">
                              {incident.status.toUpperCase()}
                            </Badge>
                          )}
                          {incident.status !== "resolved" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => processIncident(incident.id, "resolve")}
                              className="border-[#CDA434] text-[#CDA434] hover:bg-[#CDA434] hover:text-black"
                            >
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Started: {new Date(incident.started_at).toLocaleString()}</span>
                        {incident.mttr && <span>MTTR: {incident.mttr}m</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            {/* Compliance Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-black/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">DSR Requests (30d)</p>
                      <p className="text-2xl font-bold text-[#CDA434]">{complianceMetrics?.dsr_requests_30d}</p>
                    </div>
                    <FileText className="w-8 h-8 text-[#CDA434]" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-green-400">Export: {complianceMetrics?.dsr_export_requests}</span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="text-red-400">Erase: {complianceMetrics?.dsr_erase_requests}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Avg Response Time</p>
                      <p className="text-2xl font-bold text-[#CDA434]">{complianceMetrics?.avg_dsr_response_time}d</p>
                    </div>
                    <Clock className="w-8 h-8 text-[#CDA434]" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-green-400">Target: ≤7 days</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Consent Rate</p>
                      <p className="text-2xl font-bold text-[#CDA434]">{complianceMetrics?.consent_rate}%</p>
                    </div>
                    <Users className="w-8 h-8 text-[#CDA434]" />
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-400 h-2 rounded-full"
                        style={{ width: `${complianceMetrics?.consent_rate}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Data Breaches</p>
                      <p className="text-2xl font-bold text-green-400">{complianceMetrics?.data_breach_incidents}</p>
                    </div>
                    <Shield className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400">No incidents</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* DSR Timeline */}
            <Card className="bg-black/50 border-gray-800">
              <CardHeader>
                <CardTitle className="text-[#CDA434]">DSR Request Timeline</CardTitle>
                <CardDescription>Data Subject Rights requests and processing status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceMetrics?.dsr_timeline.map((dsr) => (
                    <div key={dsr.id} className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {dsr.status === "completed" && <CheckCircle className="w-4 h-4 text-green-400" />}
                          {dsr.status === "processing" && (
                            <RefreshCw className="w-4 h-4 text-orange-400 animate-spin" />
                          )}
                          {dsr.status === "pending" && <Clock className="w-4 h-4 text-gray-400" />}
                          {dsr.status === "failed" && <XCircle className="w-4 h-4 text-red-400" />}
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              dsr.type === "export" ? "text-blue-400 border-blue-400" : "text-red-400 border-red-400"
                            }`}
                          >
                            {dsr.type.toUpperCase()}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-white font-mono">{dsr.id}</p>
                          <p className="text-xs text-gray-400">
                            {dsr.org} • Requested: {new Date(dsr.requested_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        {dsr.response_time && <span>Response: {dsr.response_time}d</span>}
                        {dsr.status === "pending" && (
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => processDSR(dsr.id, "approve")}
                              className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => processDSR(dsr.id, "reject")}
                              className="border-red-400 text-red-400 hover:bg-red-400 hover:text-black"
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Retention Violations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Retention Violations
                  </CardTitle>
                  <CardDescription>Data retention policy violations requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {complianceMetrics?.retention_violations.map((violation, index) => (
                      <div key={index} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">{violation.org}</span>
                          <Badge variant="destructive">{violation.records_affected} records</Badge>
                        </div>
                        <div className="text-sm text-gray-300 mb-1">{violation.violation_type}</div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Data type: {violation.data_type}</span>
                          <span>Detected: {new Date(violation.detected_at).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Consent Audit Trail
                  </CardTitle>
                  <CardDescription>User consent tracking and compliance rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {complianceMetrics?.consent_audit.map((consent, index) => (
                      <div key={index} className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-white">{consent.org}</span>
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            {consent.rate}% rate
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-300 mb-1">{consent.consent_type} consent</div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>
                            Granted: {consent.granted} • Revoked: {consent.revoked}
                          </span>
                          <span>Updated: {new Date(consent.last_updated).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
