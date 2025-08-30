import { NextRequest, NextResponse } from 'next/server'
import { MFAManager } from '@/lib/auth/mfa-manager'
import { SessionManager } from '@/lib/auth/session-manager'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const mfaManager = new MFAManager()
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

    // Get MFA status
    const mfaStatus = await mfaManager.getMFAStatus(session.userId)
    const mfaAttempts = await mfaManager.getMFAAttempts(session.userId, 10)

    return NextResponse.json({
      success: true,
      mfa: {
        totpEnabled: mfaStatus.totpEnabled,
        smsEnabled: mfaStatus.smsEnabled,
        emailEnabled: mfaStatus.emailEnabled,
        backupCodesCount: mfaStatus.backupCodes.length,
      },
      recentAttempts: mfaAttempts.map(attempt => ({
        method: attempt.method,
        success: attempt.success,
        createdAt: attempt.created_at,
      })),
    })

  } catch (error) {
    console.error('MFA status error:', error)
    return NextResponse.json(
      { error: 'Failed to get MFA status' },
      { status: 500 }
    )
  }
}