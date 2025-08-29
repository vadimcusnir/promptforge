import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { cookies } from 'next/headers'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Login schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

// Lazy Supabase client creation
async function getSupabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
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
    } as any
  }
  
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const { email, password } = loginSchema.parse(body)

    // Create Supabase client with service role for authentication
    const supabase = await getSupabase()

    // Authenticate user
    const { data: { user, session }, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !user || !session) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

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

    // Return user data and session token
    return NextResponse.json({
      id: user.id,
      email: user.email,
      plan: profile?.plan || 'pilot',
      isAnnual: profile?.subscription_status === 'active',
      subscriptionId: profile?.stripe_subscription_id,
      trialEndsAt: profile?.trial_ends_at,
      creditsRemaining: profile?.credits_remaining || 0,
      accessToken: session.access_token,
      refreshToken: session.refresh_token
    })

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
