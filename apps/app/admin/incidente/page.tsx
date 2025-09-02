"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  AlertTriangle,
  Search,
  RefreshCw,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Server,
  FileText,
  Plus,
  Bell,
  Activity,
  Database,
  Upload,
  Users,
} from "lucide-react"

const mockIncidents = [
  {
    id: "inc_1234567890",
    title: "API Rate Limit Exceeded",
    description: "Multiple users hitting rate limits on /api/run endpoint",
    severity: "high",
    status: "investigating",
    type: "api",
    createdAt: "2024-01-15T14:20:00Z",
    updatedAt: "2024-01-15T14:25:00Z",
    resolvedAt: null,
    affectedUsers: 23,
    slaTimer: "00:35:12",
    assignee: "DevOps Team",
    postMortemUrl: null,
    updates: [{ timestamp: "2024-01-15T14:25:00Z", message: "Investigating root cause", author: "DevOps Team" }],
  },
  {
    id: "inc_0987654321",
    title: "Stripe Webhook Failure",
    description: "Subscription webhook failing to process payment updates",
    severity: "medium",
    status: "resolved",
    type: "webhook",
    createdAt: "2024-01-14T16:45:00Z",
    updatedAt: "2024-01-14T17:30:00Z",
    resolvedAt: "2024-01-14T17:30:00Z",
    affectedUsers: 5,
    slaTimer: "00:00:00",
    assignee: "Backend Team",
    postMortemUrl: "http://example.com/postmortem/0987654321",
    updates: [],
  },
  {
    id: "inc_1122334455",
    title: "Database Connection Pool Exhausted",
    description: "High load causing database connection timeouts",
    severity: "critical",
    status: "resolved",
    type: "database",
    createdAt: "2024-01-13T12:30:00Z",
    updatedAt: "2024-01-13T13:15:00Z",
    resolvedAt: "2024-01-13T13:15:00Z",
    affectedUsers: 156,
    slaTimer: "00:00:00",
    assignee: "Infrastructure Team",
    postMortemUrl: "http://example.com/postmortem/1122334455",
    updates: [],
  },
  {
    id: "inc_5566778899",
    title: "Export Generation Timeout",
    description: "PDF exports timing out for large prompts",
    severity: "low",
    status: "monitoring",
    type: "export",
    createdAt: "2024-01-12T09:15:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    resolvedAt: null,
    affectedUsers: 8,
    slaTimer: "02:15:30",
    assignee: "Product Team",
    postMortemUrl: null,
    updates: [],
  },
]

const mockHealthMetrics = {
  api: {
    uptime: 99.97,
    responseTime: 245,
    errorRate: 0.03,
    requestsPerMinute: 1250,
    status: "healthy",
  },
  database: {
    latency: 12,
    connectionPool: 85,
    queryTime: 45,
    status: "healthy",
  },
  exports: {
    successRate: 98.7,
    queueDepth: 3,
    avgProcessingTime: 2.3,
    status: "healthy",
  },
  webhooks: {
    stripeSuccess: 99.2,
    exportSuccess: 98.7,
    avgResponseTime: 180,
    status: "degraded",
  },
}

const mockWebhookHealth = [
  {
    id: "stripe_subscription",
    name: "Stripe Subscriptions",
    status: "healthy",
    lastSuccess: "2024-01-15T14:18:00Z",
    lastFailure: "2024-01-14T16:45:00Z",
    successRate: 99.2,
    avgResponseTime: "245ms",
  },
  {
    id: "stripe_invoice",
    name: "Stripe Invoices",
    status: "degraded",
    lastSuccess: "2024-01-15T13:45:00Z",
    lastFailure: "2024-01-15T14:10:00Z",
    successRate: 87.5,
    avgResponseTime: "1.2s",
  },
  {
    id: "export_complete",
    name: "Export Completion",
    status: "healthy",
    lastSuccess: "2024-01-15T14:19:00Z",
    lastFailure: "2024-01-12T08:30:00Z",
    successRate: 98.7,
    avgResponseTime: "180ms",
  },
]

export default function AdminIncidente() {
  const [incidents, setIncidents] = useState(mockIncidents)
  const [searchTerm, setSearchTerm] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [healthMetrics, setHealthMetrics] = useState(mockHealthMetrics)
  const [newIncident, setNewIncident] = useState({
    title: "",
    description: "",
    severity: "medium",
    type: "api",
    assignee: "",
  })

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time health metrics updates
      setHealthMetrics((prev) => ({
        ...prev,
        api: {
          ...prev.api,
          responseTime: prev.api.responseTime + Math.random() * 10 - 5,
          requestsPerMinute: prev.api.requestsPerMinute + Math.random() * 100 - 50,
        },
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSeverity = severityFilter === "all" || incident.severity === severityFilter
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter
    const matchesType = typeFilter === "all" || incident.type === typeFilter

    return matchesSearch && matchesSeverity && matchesStatus && matchesType
  })

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: "bg-red-900 text-red-300",
      high: "bg-orange-900 text-orange-300",
      medium: "bg-yellow-900 text-yellow-300",
      low: "bg-blue-900 text-blue-300",
    }
    return variants[severity as keyof typeof variants] || variants.low
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      investigating: "bg-yellow-900 text-yellow-300",
      identified: "bg-orange-900 text-orange-300",
      monitoring: "bg-blue-900 text-blue-300",
      resolved: "bg-green-900 text-green-300",
    }
    return variants[status as keyof typeof variants] || variants.investigating
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "api":
        return <Zap className="h-4 w-4" />
      case "database":
        return <Server className="h-4 w-4" />
      case "webhook":
        return <RefreshCw className="h-4 w-4" />
      case "export":
        return <FileText className="h-4 w-4" />
      case "security":
        return <AlertTriangle className="h-4 w-4" />
      case "performance":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getWebhookStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "down":
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />
    }
  }

  const handleCreateIncident = async () => {
    const incident = {
      id: `inc_${Date.now()}`,
      ...newIncident,
      status: "investigating",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolvedAt: null,
      affectedUsers: 0,
      slaTimer: "00:00:00",
      postMortemUrl: null,
      updates: [],
    }

    setIncidents((prev) => [incident, ...prev])
    setIsCreateDialogOpen(false)
    setNewIncident({
      title: "",
      description: "",
      severity: "medium",
      type: "api",
      assignee: "",
    })

    console.log("[v0] Admin action: incident_created", {
      incidentId: incident.id,
      severity: incident.severity,
      type: incident.type,
    })

    // Simulate API call for audit logging
    try {
      await fetch("/api/admin/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "incident_created",
          resource: "incident",
          resourceId: incident.id,
          details: { severity: incident.severity, type: incident.type },
        }),
      })
    } catch (error) {
      console.error("Failed to log admin action:", error)
    }
  }

  const handleRetryWebhook = async (webhookId: string) => {
    console.log(`[v0] Retrying webhook: ${webhookId}`)

    try {
      const response = await fetch(`/api/admin/webhooks/${webhookId}/retry`, {
        method: "POST",
      })

      if (response.ok) {
        // Update webhook status optimistically
        setHealthMetrics((prev) => ({
          ...prev,
          webhooks: {
            ...prev.webhooks,
            status: "healthy",
          },
        }))
      }
    } catch (error) {
      console.error("Failed to retry webhook:", error)
    }
  }

  const handleCreatePostMortem = async (incidentId: string) => {
    console.log(`[v0] Creating post-mortem for incident: ${incidentId}`)

    try {
      const response = await fetch(`/api/admin/incidents/${incidentId}/postmortem`, {
        method: "POST",
      })

      if (response.ok) {
        const { url } = await response.json()
        // Update incident with post-mortem URL
        setIncidents((prev) => prev.map((inc) => (inc.id === incidentId ? { ...inc, postMortemUrl: url } : inc)))
      }
    } catch (error) {
      console.error("Failed to create post-mortem:", error)
    }
  }

  const getHealthStatus = (metric: string, value: number) => {
    switch (metric) {
      case "uptime":
        return value >= 99.9 ? "healthy" : value >= 99.0 ? "degraded" : "down"
      case "responseTime":
        return value <= 300 ? "healthy" : value <= 1000 ? "degraded" : "down"
      case "errorRate":
        return value <= 0.1 ? "healthy" : value <= 1.0 ? "degraded" : "down"
      default:
        return "healthy"
    }
  }

  const formatSlaTimer = (timer: string) => {
    return timer
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#CDA434] mb-2">Incident Management</h1>
          <p className="text-gray-400">Monitor system health, incidents, and SLA compliance</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#CDA434] text-black hover:bg-[#CDA434]/90 focus:ring-2 focus:ring-[#00FF7F] focus:ring-offset-2 focus:ring-offset-[#05010A]">
              <Plus className="h-4 w-4 mr-2" />
              Create Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-[#CDA434]">Create New Incident</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newIncident.title}
                  onChange={(e) => setNewIncident((prev) => ({ ...prev, title: e.target.value }))}
                  className="bg-gray-800 border-gray-700 focus:ring-[#00FF7F]"
                  placeholder="Brief description of the incident"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-white">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={newIncident.description}
                  onChange={(e) => setNewIncident((prev) => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-800 border-gray-700 focus:ring-[#00FF7F]"
                  placeholder="Detailed description of the incident"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="severity" className="text-white">
                    Severity
                  </Label>
                  <Select
                    value={newIncident.severity}
                    onValueChange={(value) => setNewIncident((prev) => ({ ...prev, severity: value }))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type" className="text-white">
                    Type
                  </Label>
                  <Select
                    value={newIncident.type}
                    onValueChange={(value) => setNewIncident((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="api">API</SelectItem>
                      <SelectItem value="database">Database</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                      <SelectItem value="export">Export</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="assignee" className="text-white">
                  Assignee
                </Label>
                <Input
                  id="assignee"
                  value={newIncident.assignee}
                  onChange={(e) => setNewIncident((prev) => ({ ...prev, assignee: e.target.value }))}
                  className="bg-gray-800 border-gray-700 focus:ring-[#00FF7F]"
                  placeholder="Team or person responsible"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateIncident}
                  className="bg-[#CDA434] text-black hover:bg-[#CDA434]/90 focus:ring-2 focus:ring-[#00FF7F]"
                  disabled={!newIncident.title || !newIncident.description}
                >
                  Create Incident
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Activity className="h-4 w-4 mr-1 text-green-400" />
                <p className="text-sm text-gray-400">API Uptime</p>
              </div>
              <p className="text-2xl font-bold text-green-400">{healthMetrics.api.uptime}%</p>
              <p className="text-xs text-gray-500">{Math.round(healthMetrics.api.responseTime)}ms avg</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Database className="h-4 w-4 mr-1 text-blue-400" />
                <p className="text-sm text-gray-400">DB Latency</p>
              </div>
              <p className="text-2xl font-bold text-white">{healthMetrics.database.latency}ms</p>
              <p className="text-xs text-gray-500">{healthMetrics.database.connectionPool}% pool</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Upload className="h-4 w-4 mr-1 text-purple-400" />
                <p className="text-sm text-gray-400">Export Success</p>
              </div>
              <p className="text-2xl font-bold text-purple-400">{healthMetrics.exports.successRate}%</p>
              <p className="text-xs text-gray-500">{healthMetrics.exports.queueDepth} in queue</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="h-4 w-4 mr-1 text-yellow-400" />
                <p className="text-sm text-gray-400">Error Rate</p>
              </div>
              <p className="text-2xl font-bold text-yellow-400">{healthMetrics.api.errorRate}%</p>
              <p className="text-xs text-gray-500">Last 24h</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Bell className="h-4 w-4 mr-1 text-orange-400" />
                <p className="text-sm text-gray-400">Active Incidents</p>
              </div>
              <p className="text-2xl font-bold text-white">{incidents.filter((i) => i.status !== "resolved").length}</p>
              <p className="text-xs text-gray-500">
                {incidents.filter((i) => i.severity === "critical").length} critical
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-4 w-4 mr-1 text-cyan-400" />
                <p className="text-sm text-gray-400">Affected Users</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {incidents.filter((i) => i.status !== "resolved").reduce((sum, i) => sum + i.affectedUsers, 0)}
              </p>
              <p className="text-xs text-gray-500">Currently impacted</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Webhook Health */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-[#CDA434] flex items-center">
            <RefreshCw className="h-5 w-5 mr-2" />
            Webhook Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockWebhookHealth.map((webhook) => (
              <div key={webhook.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white">{webhook.name}</h3>
                  {getWebhookStatusIcon(webhook.status)}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Success Rate</span>
                    <span className="text-white">{webhook.successRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Response</span>
                    <span className="text-white">{webhook.avgResponseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Success</span>
                    <span className="text-green-400">{new Date(webhook.lastSuccess).toLocaleTimeString()}</span>
                  </div>
                </div>
                {webhook.status === "degraded" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRetryWebhook(webhook.id)}
                    className="w-full mt-3 border-[#CDA434] text-[#CDA434] hover:bg-[#CDA434] hover:text-black"
                  >
                    Retry Webhook
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700"
          />
        </div>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-32 bg-gray-900 border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 bg-gray-900 border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="investigating">Investigating</SelectItem>
            <SelectItem value="identified">Identified</SelectItem>
            <SelectItem value="monitoring">Monitoring</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-32 bg-gray-900 border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="api">API</SelectItem>
            <SelectItem value="database">Database</SelectItem>
            <SelectItem value="webhook">Webhook</SelectItem>
            <SelectItem value="export">Export</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Incidents List */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-[#CDA434]">Recent Incidents ({filteredIncidents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getTypeIcon(incident.type)}
                      <h3 className="font-medium text-white">{incident.title}</h3>
                      <Badge className={getSeverityBadge(incident.severity)}>{incident.severity.toUpperCase()}</Badge>
                      <Badge className={getStatusBadge(incident.status)}>{incident.status}</Badge>
                    </div>
                    <p className="text-gray-400 mb-2">{incident.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>ID: {incident.id}</span>
                      <span>Affected: {incident.affectedUsers} users</span>
                      <span>Assignee: {incident.assignee}</span>
                      <span>Created: {new Date(incident.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {incident.status !== "resolved" && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-yellow-400" />
                        <span className="text-yellow-400 font-mono">{formatSlaTimer(incident.slaTimer)}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCreatePostMortem(incident.id)}
                        className="text-gray-400 hover:text-white focus:ring-2 focus:ring-[#00FF7F] focus:ring-offset-2 focus:ring-offset-gray-800"
                        disabled={!!incident.postMortemUrl}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        {incident.postMortemUrl ? "View Post-Mortem" : "Create Post-Mortem"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white focus:ring-2 focus:ring-[#00FF7F] focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
