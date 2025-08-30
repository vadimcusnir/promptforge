import { NextRequest, NextResponse } from 'next/server'
import { SecurityMonitor } from '@/lib/auth/security-monitor'
import { SessionManager } from '@/lib/auth/session-manager'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const securityMonitor = new SecurityMonitor()
  const sessionManager = new SessionManager()

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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const severity = searchParams.get('severity')
    const eventType = searchParams.get('eventType')
    const userId = searchParams.get('userId') || session.userId

    // Get security events
    const events = await securityMonitor.getUserSecurityEvents(
      userId,
      limit,
      severity || undefined
    )

    // Filter by event type if specified
    const filteredEvents = eventType 
      ? events.filter(event => event.eventType.includes(eventType))
      : events

    return NextResponse.json({
      success: true,
      events: filteredEvents.map(event => ({
        id: event.id,
        eventType: event.eventType,
        severity: event.severity,
        description: event.description,
        metadata: event.metadata,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        createdAt: event.createdAt.toISOString(),
        resolved: event.resolved
      }))
    })

  } catch (error) {
    console.error('Security events error:', error)
    return NextResponse.json(
      { error: 'Failed to get security events' },
      { status: 500 }
    )
  }
}
