import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  acceptMarketing: z.boolean().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const { email, password, fullName, acceptMarketing } = signupSchema.parse(body)

    // Create Supabase client with service role for user creation
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
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
        accept_marketing: acceptMarketing || false
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

    // Create user preferences
    const { error: preferencesError } = await supabase
      .from('user_preferences')
      .insert({
        user_id: user.id,
        default_vectors: ['strategic', 'content'],
        export_preferences: { default_format: 'md' },
        ui_preferences: { theme: 'dark' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (preferencesError) {
      console.error('Preferences creation error:', preferencesError)
      // Don't fail the signup for preferences error
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
