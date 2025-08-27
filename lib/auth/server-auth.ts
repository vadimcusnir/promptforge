import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export interface AuthenticatedUser {
  id: string
  email: string
  plan: 'pilot' | 'pro' | 'enterprise'
  creditsRemaining: number
  trialEndsAt?: string
}

export interface AuthResult {
  user: AuthenticatedUser | null
  error: string | null
}

/**
 * Authenticate user from request headers
 * Only use this in server-side API routes
 */
export async function authenticateUser(request: NextRequest): Promise<AuthResult> {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        user: null,
        error: 'Authorization header required'
      }
    }

    const token = authHeader.substring(7)

    // Create Supabase client with service role for token validation
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Verify JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return {
        user: null,
        error: 'Invalid or expired token'
      }
    }

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('plan, credits_remaining, trial_ends_at')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile fetch error:', profileError)
      return {
        user: null,
        error: 'Failed to fetch user profile'
      }
    }

    return {
      user: {
        id: user.id,
        email: user.email || '',
        plan: profile?.plan || 'pilot',
        creditsRemaining: profile?.credits_remaining || 0,
        trialEndsAt: profile?.trial_ends_at
      },
      error: null
    }

  } catch (error) {
    console.error('Authentication error:', error)
    return {
      user: null,
      error: 'Internal server error'
    }
  }
}

/**
 * Require authentication - throws error if user not authenticated
 */
export async function requireAuth(request: NextRequest): Promise<AuthenticatedUser> {
  const { user, error } = await authenticateUser(request)
  
  if (error || !user) {
    throw new Error(error || 'Authentication required')
  }
  
  return user
}

/**
 * Check if user has specific plan access
 */
export function hasPlanAccess(user: AuthenticatedUser, requiredPlan: 'pilot' | 'pro' | 'enterprise'): boolean {
  const planHierarchy = { pilot: 1, pro: 2, enterprise: 3 }
  return planHierarchy[user.plan] >= planHierarchy[requiredPlan]
}
