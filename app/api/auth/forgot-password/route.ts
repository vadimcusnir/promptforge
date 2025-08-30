import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { EmailVerificationManager } from '@/lib/auth/email-verification'
import { SecurityMonitor } from '@/lib/auth/security-monitor'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Forgot password schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format')
})

// Lazy Supabase client creation
async function _getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // Return mock client for build-time operations
    return {
      auth: {
        resetPasswordForEmail: () => Promise.resolve({ data: {}, error: null })
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Mock client' } })
          })
        })
      })
    } as unknown
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
    const { email } = forgotPasswordSchema.parse(body)

    // Check rate limits
    const clientIP = securityMonitor.getClientIP(request)
    const isAllowed = await securityMonitor.checkRateLimit(clientIP, 'password_reset')
    
    if (!isAllowed) {
      await securityMonitor.logSecurityEvent(
        'password_reset_failed',
        'high',
        'Rate limit exceeded for password reset attempt',
        { email, ip: clientIP },
        request
      )
      
      return NextResponse.json(
        { error: 'Too many password reset attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Send password reset email using our custom system
    const emailSent = await emailVerification.sendPasswordResetEmail(email)

    if (!emailSent) {
      await securityMonitor.logSecurityEvent(
        'password_reset_failed',
        'medium',
        'Failed to send password reset email',
        { email },
        request
      )
      
      return NextResponse.json(
        { error: 'Failed to send password reset email' },
        { status: 500 }
      )
    }

    // Log successful request
    await securityMonitor.logSecurityEvent(
      'password_reset_requested',
      'low',
      'Password reset email sent',
      { email },
      request
    )

    // Always return success message for security (don't reveal if user exists)
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    
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