import { NextRequest, NextResponse } from 'next/server'
import { SessionManager } from '@/lib/auth/session-manager'
import { SecurityMonitor } from '@/lib/auth/security-monitor'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const sessionManager = new SessionManager()
  const securityMonitor = new SecurityMonitor()

  try {
    // Get session token from cookies
    const sessionToken = request.cookies.get('session_token')?.value
    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 400 }
      )
    }

    // Get session data before invalidating
    const session = await sessionManager.getSession(sessionToken)
    
    // Invalidate the session
    await sessionManager.invalidateSession(sessionToken, session?.userId)

    // Log security event
    if (session) {
      await securityMonitor.logSecurityEvent(
        'logout',
        'low',
        'User logged out successfully',
        { userId: session.userId },
        request,
        session.userId,
        session.id
      )
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

    // Clear session cookie
    response.cookies.set('session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
}