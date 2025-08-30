import { NextRequest, NextResponse } from 'next/server'
import { securityMonitor } from '@/lib/auth/security-monitor'
import { sessionManager } from '@/lib/auth/session-manager'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get session token from cookies
    const sessionToken = request.cookies.get('session_token')?.value
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Validate session
    const session = await sessionManager.getSession(sessionToken)
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    // Get security dashboard data
    const dashboardData = await securityMonitor.getSecurityDashboard(session.userId)
    
    // Get user sessions
    const userSessions = await sessionManager.getUserSessions(session.userId)

    return NextResponse.json({
      success: true,
      dashboard: dashboardData,
      sessions: userSessions.map(session => ({
        id: session.id,
        deviceInfo: session.deviceInfo,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        isActive: session.isActive,
        lastActivity: session.lastActivity,
        expiresAt: session.expiresAt,
      })),
    })

  } catch (error) {
    console.error('Security dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to get security dashboard' },
      { status: 500 }
    )
  }
}
