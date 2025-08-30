import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Lazy Supabase client creation
async function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    // Return mock client for build-time operations
    return {
      auth: {
        admin: {
          signOut: () => Promise.resolve({ error: null })
        }
      }
    } as {
      auth: {
        admin: {
          signOut: () => Promise<{ error: null }>
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
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // Create Supabase client with service role for logout
    const supabase = await getSupabase()

    // Sign out user
    const { error: logoutError } = await supabase.auth.admin.signOut(token)

    if (logoutError) {
      console.error('Logout error:', logoutError)
      // Don't fail the request if logout fails on server side
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
