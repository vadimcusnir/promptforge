import { NextRequest, NextResponse } from 'next/server'
import { sessionManager } from '@/lib/auth/session-manager'
import { mfaManager } from '@/lib/auth/mfa-manager'
import { securityMonitor } from '@/lib/auth/security-monitor'
import { authenticateUser } from '@/lib/auth/server-auth'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const { user, error } = await authenticateUser(request)
    if (error || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get security data in parallel
    const [activeSessions, mfaStatus, securityMetrics] = await Promise.all([
      sessionManager.getActiveSessions(user.id),
      mfaManager.getMFAStatus(user.id),
      securityMonitor.getSecurityMetrics(user.id, 24)
    ])

    const summary = {
      mfaEnabled: mfaStatus.totpEnabled,
      activeSessions: activeSessions.length,
      recentAnomalies: securityMetrics.suspiciousActivity,
      trustedDevices: 0, // TODO: Implement device trust logic
      lastSecurityEvent: securityMetrics.recentEvents[0]?.createdAt
    }

    return NextResponse.json({
      success: true,
      data: summary
    })

  } catch (error) {
    console.error('Security summary error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
