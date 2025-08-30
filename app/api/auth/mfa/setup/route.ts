import { NextRequest, NextResponse } from 'next/server'
import { mfaManager } from '@/lib/auth/mfa'
import { authenticateUser } from '@/lib/auth/server-auth'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { user, error } = await authenticateUser(request)
    if (error || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if MFA is already enabled
    const isEnabled = await mfaManager.isMFAEnabled(user.id)
    if (isEnabled) {
      return NextResponse.json(
        { error: 'MFA is already enabled for this account' },
        { status: 400 }
      )
    }

    // Generate MFA setup
    const mfaSetup = await mfaManager.generateMFASetup(user.id, user.email)

    return NextResponse.json({
      success: true,
      data: mfaSetup
    })

  } catch (error) {
    console.error('MFA setup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
