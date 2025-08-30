import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { mfaManager } from '@/lib/auth/mfa'
import { authenticateUser } from '@/lib/auth/server-auth'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// MFA enable schema
const mfaEnableSchema = z.object({
  token: z.string().min(6, 'Token must be at least 6 characters').max(6, 'Token must be 6 characters')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const { token } = mfaEnableSchema.parse(body)

    // Authenticate user
    const { user, error } = await authenticateUser(request)
    if (error || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify and enable MFA
    const isValid = await mfaManager.verifyAndEnableMFA(user.id, token)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid MFA token' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'MFA has been enabled successfully'
    })

  } catch (error) {
    console.error('MFA enable error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
