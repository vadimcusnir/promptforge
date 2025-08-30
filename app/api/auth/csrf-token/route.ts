import { NextRequest, NextResponse } from 'next/server'
import { CSRFProtection } from '@/lib/auth/csrf-protection'
import { SessionManager } from '@/lib/auth/session-manager'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const csrfProtection = new CSRFProtection()
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

    // Generate CSRF token
    const { token, expiresAt } = await csrfProtection.generateToken(session.userId)

    return NextResponse.json({
      success: true,
      token,
      expiresAt: expiresAt.toISOString(),
    })

  } catch (error) {
    console.error('CSRF token generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}
