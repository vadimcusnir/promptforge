"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff
} from 'lucide-react'

interface SecurityEvent {
  id: string
  eventType: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  metadata: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt: string
  resolved: boolean
}

interface SecurityAuditLogProps {
  userId?: string
  limit?: number
}

export function SecurityAuditLog({ userId, limit = 50 }: SecurityAuditLogProps) {
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all')
  const [showMetadata, setShowMetadata] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadSecurityEvents()
  }, [userId, limit])

  const loadSecurityEvents = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        limit: limit.toString(),
        ...(userId && { userId }),
        ...(severityFilter !== 'all' && { severity: severityFilter }),
        ...(eventTypeFilter !== 'all' && { eventType: eventTypeFilter })
      })

      const response = await fetch(`/api/auth/security-events?${params}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to load security events')
      }

      const data = await response.json()
      setEvents(data.events || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load security events')
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4" />
      case 'high': return <AlertTriangle className="h-4 w-4" />
      case 'medium': return <Clock className="h-4 w-4" />
      case 'low': return <CheckCircle className="h-4 w-4" />
      default: return <CheckCircle className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getRelativeTime = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const exportEvents = () => {
    const csvContent = [
      ['Timestamp', 'Event Type', 'Severity', 'Description', 'IP Address', 'Resolved'].join(','),
      ...events.map(event => [
        formatDate(event.createdAt),
        event.eventType,
        event.severity,
        `"${event.description}"`,
        event.ipAddress || '',
        event.resolved ? 'Yes' : 'No'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `security-audit-log-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = searchTerm === '' || 
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.ipAddress && event.ipAddress.includes(searchTerm))
    
    return matchesSearch
  })

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Security Audit Log</CardTitle>
          <CardDescription>Loading security events...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Security Audit Log</CardTitle>
          <CardDescription>Error loading security events</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
          <Button onClick={loadSecurityEvents} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Security Audit Log</CardTitle>
            <CardDescription>
              Review security events and activities for your account
            </CardDescription>
          </div>
          <Button variant="outline" onClick={exportEvents}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
              <SelectItem value="password_reset">Password Reset</SelectItem>
              <SelectItem value="mfa">MFA</SelectItem>
              <SelectItem value="anomaly">Anomaly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadSecurityEvents}>
            <Filter className="h-4 w-4 mr-2" />
            Apply
          </Button>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No security events found</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getSeverityIcon(event.severity)}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{event.description}</p>
                        <Badge variant={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                        {event.resolved && (
                          <Badge variant="secondary">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Resolved
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.eventType} • {getRelativeTime(event.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMetadata({
                      ...showMetadata,
                      [event.id]: !showMetadata[event.id]
                    })}
                  >
                    {showMetadata[event.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {showMetadata[event.id] && (
                  <div className="bg-muted p-3 rounded-lg space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Timestamp:</span> {formatDate(event.createdAt)}
                      </div>
                      {event.ipAddress && (
                        <div>
                          <span className="font-medium">IP Address:</span> {event.ipAddress}
                        </div>
                      )}
                      {event.userAgent && (
                        <div className="md:col-span-2">
                          <span className="font-medium">User Agent:</span> {event.userAgent}
                        </div>
                      )}
                    </div>
                    {Object.keys(event.metadata).length > 0 && (
                      <div>
                        <span className="font-medium">Metadata:</span>
                        <pre className="text-xs bg-background p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(event.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
