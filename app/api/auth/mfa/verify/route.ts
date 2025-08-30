import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { MFAManager } from '@/lib/auth/mfa-manager'
import { SessionManager } from '@/lib/auth/session-manager'
import { SecurityMonitor } from '@/lib/auth/security-monitor'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Verify MFA schema
const verifyMFASchema = z.object({
  token: z.string().min(1, 'Token is required'),
  enable: z.boolean().optional().default(false)
})

export async function POST(request: NextRequest) {
  const mfaManager = new MFAManager()
  const sessionManager = new SessionManager()
  const securityMonitor = new SecurityMonitor()

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

    const body = await request.json()
    const { token, enable } = verifyMFASchema.parse(body)

    let isValid = false
    let backupCodes: string[] = []

    if (enable) {
      // Verify and enable MFA
      isValid = await mfaManager.verifyAndEnableTOTP(session.userId, token)
      if (isValid) {
        const mfaStatus = await mfaManager.getMFAStatus(session.userId)
        backupCodes = mfaStatus.backupCodes
      }
    } else {
      // Just verify token for authentication
      isValid = await mfaManager.verifyTOTP(session.userId, token) ||
                await mfaManager.verifyBackupCode(session.userId, token)
    }

    if (!isValid) {
      // Log failed attempt
      await securityMonitor.logSecurityEvent(
        'mfa_failed',
        'medium',
        'Invalid MFA token provided',
        { userId: session.userId, enable },
        request,
        session.userId,
        session.id
      )

      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Log successful verification
    await securityMonitor.logSecurityEvent(
      enable ? 'mfa_enabled' : 'mfa_success',
      'low',
      enable ? 'MFA enabled successfully' : 'MFA verified successfully',
      { userId: session.userId },
      request,
      session.userId,
      session.id
    )

    return NextResponse.json({
      success: true,
      message: enable ? 'MFA enabled successfully' : 'Token verified',
      backupCodes: enable ? backupCodes : undefined,
    })

  } catch (error) {
    console.error('MFA verification error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to verify MFA token' },
      { status: 500 }
    )
  }
}