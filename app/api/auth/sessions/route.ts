import { NextRequest, NextResponse } from 'next/server'
import { sessionMonitor } from '@/lib/auth/session-monitor'
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

    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const activeOnly = url.searchParams.get('active') === 'true'

    // Get user sessions
    const sessions = activeOnly 
      ? await sessionMonitor.getActiveSessions(user.id)
      : await sessionMonitor.getUserSessions(user.id, limit)

    return NextResponse.json({
      success: true,
      data: sessions
    })

  } catch (error) {
    console.error('Sessions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const { user, error } = await authenticateUser(request)
    if (error || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const sessionId = url.searchParams.get('sessionId')
    const terminateAll = url.searchParams.get('all') === 'true'

    if (terminateAll) {
      // Terminate all sessions except current one
      const currentSessionId = request.cookies.get('session_id')?.value
      const terminatedCount = await sessionMonitor.terminateAllSessions(user.id, currentSessionId)
      
      return NextResponse.json({
        success: true,
        message: `Terminated ${terminatedCount} sessions`,
        terminatedCount
      })
    } else if (sessionId) {
      // Terminate specific session
      const success = await sessionMonitor.terminateSession(sessionId, user.id)
      
      if (success) {
        return NextResponse.json({
          success: true,
          message: 'Session terminated successfully'
        })
      } else {
        return NextResponse.json(
          { error: 'Failed to terminate session' },
          { status: 400 }
        )
      }
    } else {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Session termination error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
