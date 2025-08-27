import { NextRequest, NextResponse } from 'next/server'
import { jwtSecurity } from '@/lib/auth/jwt-security'

export async function POST(request: NextRequest) {
  try {
    // Validate and refresh tokens
    const result = await jwtSecurity.validateAndRefresh(request)
    
    if (!result.valid) {
      return NextResponse.json(
        { error: 'INVALID_REFRESH_TOKEN', message: 'Refresh token is invalid or expired' },
        { status: 401 }
      )
    }

    if (!result.newTokens) {
      return NextResponse.json(
        { error: 'TOKEN_VALIDATION_FAILED', message: 'Token validation failed' },
        { status: 401 }
      )
    }

    // Create response with new tokens
    const response = NextResponse.json({
      success: true,
      message: 'Tokens refreshed successfully',
      userId: result.userId
    })

    // Set secure cookies with new tokens
    return jwtSecurity.setSecureCookies(
      response,
      result.newTokens.accessToken,
      result.newTokens.refreshToken
    )

  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'REFRESH_FAILED', message: 'Token refresh failed' },
      { status: 500 }
    )
  }
}

// Prevent GET requests to refresh endpoint
export async function GET() {
  return NextResponse.json(
    { error: 'METHOD_NOT_ALLOWED', message: 'Only POST requests are allowed' },
    { status: 405 }
  )
}
