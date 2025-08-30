import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Signup schema
const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(1, 'Full name is required'),
  acceptMarketing: z.boolean().optional().default(false)
})

// Lazy Supabase client creation
async function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // Return mock client for build-time operations
    return {
      auth: {
        signUp: () => Promise.resolve({ data: { user: null, session: null }, error: { message: 'Mock client' } }),
        admin: {
          createUser: () => Promise.resolve({ data: { user: null }, error: { message: 'Mock client' } }),
          deleteUser: () => Promise.resolve({ error: null })
        }
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Mock client' } })
          })
        }),
        insert: () => Promise.resolve({ error: null })
      })
    } as {
      auth: {
        signUp: (_credentials: { email: string; password: string }) => Promise<{
          data: { user: null; session: null };
          error: { message: string }
        }>;
        admin: {
          createUser: () => Promise<{ data: { user: null }; error: { message: string } }>;
          deleteUser: () => Promise<{ error: null }>
        }
      };
      from: (_table: string) => {
        select: (_columns: string) => {
          eq: (_column: string, _value: string) => {
            single: () => Promise<{ data: null; error: { message: string } }>
          }
        };
        insert: (_data: Record<string, unknown>) => Promise<{ error: null }>
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
  try {
    const body = await request.json()
    
    // Validate request body
    const { email, password, fullName, acceptMarketing } = signupSchema.parse(body)

    // Create Supabase client with service role for user creation
    const supabase = await getSupabase()

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Create user in Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for now
      user_metadata: {
        full_name: fullName,
        accept_marketing: acceptMarketing
      }
    })

    if (authError || !user) {
      console.error('Auth user creation error:', authError)
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    // Create user profile in public.users table
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        full_name: fullName,
        plan: 'pilot', // Default to pilot plan
        credits_remaining: 10, // Default credits
        accept_marketing: acceptMarketing,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      
      // Try to clean up the auth user if profile creation fails
      try {
        await supabase.auth.admin.deleteUser(user.id)
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user:', cleanupError)
      }
      
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      )
    }

    // Create user preferences (optional - don't fail signup if this fails)
    try {
      await supabase
        .from('user_preferences')
        .insert({
          user_id: user.id,
          default_vectors: ['strategic', 'content'],
          export_preferences: { default_format: 'md' },
          ui_preferences: { theme: 'dark' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
    } catch (preferencesError) {
      console.warn('Failed to create user preferences:', preferencesError)
      // Don't fail signup for preferences error
    }



    // Send welcome email (if configured)
    if (process.env.ENABLE_WELCOME_EMAIL === 'true') {
      try {
        // This would integrate with your email service
        console.log('Welcome email would be sent to:', email)
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError)
        // Don't fail signup for email error
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      userId: user.id,
      email: user.email
    })

  } catch (error) {
    console.error('Signup error:', error)
    
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
