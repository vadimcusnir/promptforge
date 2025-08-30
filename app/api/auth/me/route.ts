import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Lazy Supabase client creation
async function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    // Return mock client for build-time operations
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Mock client' } })
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
        getUser: (_jwt?: string) => Promise<{
          data: { user: null };
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

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // Create Supabase client with service role for token validation
    const supabase = await getSupabase()

    // Verify JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
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

    // Return user data without sensitive information
    return NextResponse.json({
      id: user.id,
      email: user.email,
      plan: profile?.plan || 'pilot',
      isAnnual: profile?.subscription_status === 'active',
      subscriptionId: profile?.stripe_subscription_id,
      trialEndsAt: profile?.trial_ends_at,
      creditsRemaining: profile?.credits_remaining || 0
    })

  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
