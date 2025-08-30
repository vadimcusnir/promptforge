import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sessionManager } from '@/lib/auth/session-manager'
import { securityMonitor } from '@/lib/auth/security-monitor'
import { mfaManager } from '@/lib/auth/mfa-manager'
import { DeviceFingerprintCollector } from '@/lib/auth/device-fingerprint'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Login schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  mfaToken: z.string().optional(),
  deviceFingerprint: z.object({
    userAgent: z.string(),
    screenResolution: z.string(),
    timezone: z.string(),
    language: z.string(),
    platform: z.string(),
    cookieEnabled: z.boolean(),
    doNotTrack: z.string(),
  }).optional()
})

// Lazy Supabase client creation
async function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    // Return mock client for build-time operations
    return {
      auth: {
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Mock client' } })
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Mock client' } })
          })
        })
      })
    } as {
      auth: {
        signInWithPassword: (_credentials: { email: string; password: string }) => Promise<{
          data: { user: null; session: null };
          error: { message: string }
        }>
      };
      from: (_table: string) => {
        select: (_columns: string) => {
          eq: (_column: string, _value: string) => {
            single: () => Promise<{ data: null; error: { message: string } }>
          }
        }
      }
    }
  }
  
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const { email, password, mfaToken, deviceFingerprint } = loginSchema.parse(body)

    // Check rate limits
    const clientIP = securityMonitor.getClientIP(request)
    const isAllowed = await securityMonitor.checkRateLimit(clientIP, 'login')
    
    if (!isAllowed) {
      await securityMonitor.logSecurityEvent(
        'login_failed',
        'high',
        'Rate limit exceeded for login attempt',
        { email, ip: clientIP },
        request
      )
      
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Create Supabase client with service role for authentication
    const supabase = await getSupabase()

    // Authenticate user
    const { data: { user, session }, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !user || !session) {
      await securityMonitor.logSecurityEvent(
        'login_failed',
        'medium',
        'Invalid credentials provided',
        { email, error: authError?.message },
        request
      )
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if MFA is required
    const mfaRequired = await mfaManager.isMFARequired(user.id)
    
    if (mfaRequired && !mfaToken) {
      // Return MFA required response
      return NextResponse.json(
        { 
          error: 'MFA required',
          mfaRequired: true,
          userId: user.id
        },
        { status: 200 }
      )
    }

    // Verify MFA token if provided
    if (mfaRequired && mfaToken) {
      const mfaValid = await mfaManager.verifyTOTP(user.id, mfaToken) || 
                      await mfaManager.verifyBackupCode(user.id, mfaToken)
      
      if (!mfaValid) {
        await securityMonitor.logSecurityEvent(
          'mfa_failed',
          'high',
          'Invalid MFA token provided',
          { userId: user.id },
          request
        )
        
        return NextResponse.json(
          { error: 'Invalid MFA token' },
          { status: 401 }
        )
      }
    }

    // Check session limits
    await sessionManager.checkSessionLimits(user.id, 5)

    // Create new session
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Parse device info from fingerprint
    const deviceInfo = deviceFingerprint ? {
      type: DeviceFingerprintCollector.getDeviceType(deviceFingerprint.userAgent),
      browser: DeviceFingerprintCollector.getBrowserInfo(deviceFingerprint.userAgent).name,
      os: DeviceFingerprintCollector.getOSInfo(deviceFingerprint.userAgent).name
    } : undefined

    const sessionData = await sessionManager.createSession(
      user.id,
      clientIP,
      userAgent,
      undefined, // location
      deviceInfo
    )

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      )
    }

    // Log successful login
    await securityMonitor.logSecurityEvent(
      'login_success',
      'low',
      'User logged in successfully',
      { userId: user.id, mfaUsed: mfaRequired },
      request,
      user.id,
      sessionData.id
    )

    // Create response with user data
    const response = NextResponse.json({
      id: user.id,
      email: user.email,
      plan: profile?.plan || 'pilot',
      isAnnual: profile?.subscription_status === 'active',
      subscriptionId: profile?.stripe_subscription_id,
      trialEndsAt: profile?.trial_ends_at,
      creditsRemaining: profile?.credits_remaining || 0,
      mfaRequired: false
    })

    // Set secure httpOnly cookies with session token
    response.cookies.set('session_token', sessionData.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    
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
