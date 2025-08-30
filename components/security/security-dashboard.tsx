'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Smartphone, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Eye,
  Trash2,
  RefreshCw,
  Lock,
  Unlock
} from 'lucide-react';

interface SecuritySummary {
  mfaEnabled: boolean;
  activeSessions: number;
  recentAnomalies: number;
  trustedDevices: number;
  lastSecurityEvent?: string;
}

interface Session {
  id: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  location?: {
    country?: string;
    city?: string;
  };
  deviceInfo?: {
    type: string;
    os?: string;
    browser?: string;
  };
  isActive: boolean;
  lastActivity: string;
  createdAt: string;
}

interface MFAStatus {
  isEnabled: boolean;
  backupCodesRemaining: number;
  lastUsed?: string;
}

export function SecurityDashboard() {
  const [securitySummary, setSecuritySummary] = useState<SecuritySummary | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [mfaStatus, setMfaStatus] = useState<MFAStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load security summary, sessions, and MFA status in parallel
      const [summaryRes, sessionsRes, mfaRes] = await Promise.all([
        fetch('/api/auth/security/summary', { credentials: 'include' }),
        fetch('/api/auth/sessions?active=true', { credentials: 'include' }),
        fetch('/api/auth/mfa/status', { credentials: 'include' })
      ]);

      if (summaryRes.ok) {
        const summaryData = await summaryRes.json();
        setSecuritySummary(summaryData.data);
      }

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData.data);
      }

      if (mfaRes.ok) {
        const mfaData = await mfaRes.json();
        setMfaStatus(mfaData.data);
      }
    } catch (err) {
      setError('Failed to load security data');
      console.error('Security data load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/auth/sessions?sessionId=${sessionId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setSessions(sessions.filter(s => s.sessionId !== sessionId));
      }
    } catch (err) {
      console.error('Failed to terminate session:', err);
    }
  };

  const terminateAllSessions = async () => {
    try {
      const response = await fetch('/api/auth/sessions?all=true', {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setSessions([]);
      }
    } catch (err) {
      console.error('Failed to terminate all sessions:', err);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Smartphone className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">MFA Status</p>
                <div className="flex items-center gap-2 mt-1">
                  {mfaStatus?.isEnabled ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-2xl font-bold">
                    {mfaStatus?.isEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              <Shield className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold">{securitySummary?.activeSessions || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recent Anomalies</p>
                <p className="text-2xl font-bold">{securitySummary?.recentAnomalies || 0}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Trusted Devices</p>
                <p className="text-2xl font-bold">{securitySummary?.trustedDevices || 0}</p>
              </div>
              <Smartphone className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage your active login sessions across devices
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadSecurityData}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              {sessions.length > 1 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={terminateAllSessions}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Terminate All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No active sessions found
            </p>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {getDeviceIcon(session.deviceInfo?.type || 'desktop')}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {session.deviceInfo?.browser || 'Unknown Browser'} on{' '}
                          {session.deviceInfo?.os || 'Unknown OS'}
                        </p>
                        <Badge variant="secondary">
                          {session.deviceInfo?.type || 'desktop'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {session.location?.city && session.location?.country
                            ? `${session.location.city}, ${session.location.country}`
                            : session.ipAddress}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(session.lastActivity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={session.isActive ? 'default' : 'secondary'}>
                      {session.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {session.isActive && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => terminateSession(session.sessionId)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* MFA Status */}
      {mfaStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Multi-Factor Authentication</CardTitle>
            <CardDescription>
              Secure your account with an additional layer of protection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {mfaStatus.isEnabled ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500" />
                )}
                <div>
                  <p className="font-medium">
                    {mfaStatus.isEnabled ? 'MFA is enabled' : 'MFA is disabled'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {mfaStatus.isEnabled
                      ? `${mfaStatus.backupCodesRemaining} backup codes remaining`
                      : 'Enable MFA to secure your account'}
                  </p>
                </div>
              </div>
              <Button variant={mfaStatus.isEnabled ? 'outline' : 'default'}>
                {mfaStatus.isEnabled ? (
                  <>
                    <Unlock className="w-4 h-4 mr-2" />
                    Manage MFA
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Enable MFA
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}