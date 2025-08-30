import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { EmailVerificationManager } from '@/lib/auth/email-verification'
import { SecurityMonitor } from '@/lib/auth/security-monitor'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Reset password schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password confirmation is required')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// Lazy Supabase client creation
async function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // Return mock client for build-time operations
    return {
      auth: {
        updateUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Mock client' } })
      }
    } as {
      auth: {
        updateUser: (_options: { password: string }) => Promise<{
          data: { user: null };
          error: { message: string }
        }>
      }
    }
  }
  
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function POST(request: NextRequest) {
  const emailVerification = new EmailVerificationManager()
  const securityMonitor = new SecurityMonitor()

  try {
    const body = await request.json()
    
    // Validate request body
    const { token, password } = resetPasswordSchema.parse(body)

    // Check rate limits
    const clientIP = securityMonitor.getClientIP(request)
    const isAllowed = await securityMonitor.checkRateLimit(clientIP, 'password_reset')
    
    if (!isAllowed) {
      await securityMonitor.logSecurityEvent(
        'password_reset_failed',
        'high',
        'Rate limit exceeded for password reset attempt',
        { ip: clientIP },
        request
      )
      
      return NextResponse.json(
        { error: 'Too many password reset attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Verify the reset token
    const tokenData = await emailVerification.verifyToken(token, 'password_reset')
    
    if (!tokenData) {
      await securityMonitor.logSecurityEvent(
        'password_reset_failed',
        'medium',
        'Invalid or expired password reset token',
        { token: token.substring(0, 8) + '...' },
        request
      )
      
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await getSupabase()

    // Update the user's password
    const { data: { user }, error: updateError } = await supabase.auth.updateUser({
      password: password
    })

    if (updateError || !user) {
      console.error('Password update error:', updateError)
      await securityMonitor.logSecurityEvent(
        'password_reset_failed',
        'medium',
        'Failed to update password',
        { userId: tokenData.userId, error: updateError?.message },
        request
      )
      
      return NextResponse.json(
        { error: 'Failed to reset password' },
        { status: 500 }
      )
    }

    // Mark token as used
    await emailVerification.markTokenAsUsed(tokenData.id)

    // Log successful password reset
    await securityMonitor.logSecurityEvent(
      'password_reset_success',
      'low',
      'Password reset successfully',
      { userId: tokenData.userId },
      request
    )

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    
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
