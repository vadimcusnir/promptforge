import { NextRequest, NextResponse } from 'next/server'
import { mfaManager } from '@/lib/auth/mfa-manager'
import { sessionManager } from '@/lib/auth/session-manager'
import { securityMonitor } from '@/lib/auth/security-monitor'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
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

    // Get user email from request body or session
    const body = await request.json()
    const userEmail = body.email || session.userId // You might need to fetch email from user table

    // Initialize MFA
    const mfaSetup = await mfaManager.generateMFASetup(session.userId, userEmail)

    // Log security event
    await securityMonitor.logSecurityEvent(
      'mfa_initialized',
      'medium',
      'MFA initialization started',
      { userId: session.userId },
      request,
      session.userId,
      session.id
    )

    return NextResponse.json({
      success: true,
      data: mfaSetup
    })

  } catch (error) {
    console.error('MFA initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize MFA' },
      { status: 500 }
    )
  }
}
