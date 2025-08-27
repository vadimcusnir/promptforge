'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Users, 
  Lock, 
  Eye,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface SecurityEvent {
  id: string
  timestamp: string
  event_type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  fingerprint: string
  ip_address?: string
  pathname: string
  method: string
  blocked: boolean
  response_code: number
}

interface SecurityMetrics {
  total_events: number
  blocked_requests: number
  threat_level: 'low' | 'medium' | 'high' | 'critical'
  recent_events: SecurityEvent[]
  top_threats: Record<string, number>
  rate_limit_violations: number
  injection_attempts: number
}

export function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/security/metrics')
      if (!response.ok) throw new Error('Failed to fetch security metrics')
      
      const data = await response.json()
      setMetrics(data)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-yellow-500 text-black'
      case 'low': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <Eye className="h-4 w-4 text-gray-500" />
    }
  }

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'threat_detected': 'Threat Detected',
      'rate_limit_exceeded': 'Rate Limit Exceeded',
      'injection_attempt': 'Injection Attempt',
      'honeypot_accessed': 'Honeypot Accessed',
      'suspicious_activity': 'Suspicious Activity'
    }
    return labels[type] || type
  }

  if (loading && !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading security metrics...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading security metrics: {error}
          <Button variant="outline" size="sm" className="ml-2" onClick={fetchMetrics}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!metrics) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Security Dashboard
          </h2>
          <p className="text-gray-600">
            Real-time threat monitoring and security metrics
            {lastUpdated && (
              <span className="ml-2 text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <Button onClick={fetchMetrics} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Threat Level Alert */}
      {metrics.threat_level !== 'low' && (
        <Alert className={`border-2 ${
          metrics.threat_level === 'critical' ? 'border-red-500 bg-red-50' :
          metrics.threat_level === 'high' ? 'border-orange-500 bg-orange-50' :
          'border-yellow-500 bg-yellow-50'
        }`}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="font-semibold">
            {metrics.threat_level === 'critical' ? '🚨 CRITICAL THREAT LEVEL' :
             metrics.threat_level === 'high' ? '🔴 HIGH THREAT LEVEL' :
             '🟡 MEDIUM THREAT LEVEL'}
            {' '} - Immediate attention required
          </AlertDescription>
        </Alert>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total_events}</div>
            <p className="text-xs text-muted-foreground">
              Security events in last 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Requests</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.blocked_requests}</div>
            <p className="text-xs text-muted-foreground">
              Malicious requests blocked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limit Violations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.rate_limit_violations}</div>
            <p className="text-xs text-muted-foreground">
              Rate limit exceeded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Injection Attempts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.injection_attempts}</div>
            <p className="text-xs text-muted-foreground">
              Prompt injection detected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Threat Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Current Threat Level
          </CardTitle>
          <CardDescription>
            Overall security posture assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge className={`text-lg px-4 py-2 ${getThreatLevelColor(metrics.threat_level)}`}>
              {metrics.threat_level.toUpperCase()}
            </Badge>
            <div className="text-sm text-gray-600">
              {metrics.threat_level === 'critical' && 'Immediate response required'}
              {metrics.threat_level === 'high' && 'High alert - investigate threats'}
              {metrics.threat_level === 'medium' && 'Moderate risk - monitor closely'}
              {metrics.threat_level === 'low' && 'Normal operations - all clear'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>
            Latest security incidents and alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.recent_events.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>No security events in the last 24 hours</p>
                <p className="text-sm">All systems operating normally</p>
              </div>
            ) : (
              metrics.recent_events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getSeverityIcon(event.severity)}
                    <div>
                      <div className="font-medium">{getEventTypeLabel(event.event_type)}</div>
                      <div className="text-sm text-gray-600">
                        {event.method} {event.pathname}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={event.blocked ? 'destructive' : 'secondary'}>
                      {event.blocked ? 'BLOCKED' : 'ALLOWED'}
                    </Badge>
                    <Badge variant="outline">
                      {event.response_code}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Threats */}
      {Object.keys(metrics.top_threats).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Threat Categories</CardTitle>
            <CardDescription>
              Most frequent security incidents by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(metrics.top_threats)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([threat, count]) => (
                  <div key={threat} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{threat}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
