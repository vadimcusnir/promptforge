export { authenticateUser, requireAuth, hasPlanAccess, type AuthenticatedUser, type AuthResult } from './server-auth'

/**
 * Validate organization membership for a user
 */
export async function validateOrgMembership(userId: string, orgId?: string): Promise<boolean> {
  if (!userId || !orgId) {
    return false
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
      .from('org_members')
      .select('id')
      .eq('user_id', userId)
      .eq('org_id', orgId)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Organization membership validation error:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('Organization membership validation failed:', error)
    return false
  }
}

/**
 * Get user from request context
 */
export async function getUserFromContext(request: any): Promise<any> {
  try {
    const { authenticateUser } = await import('./server-auth')
    const { user, error } = await authenticateUser(request)
    
    if (error || !user) {
      return null
    }
    
    return user
  } catch (error) {
    console.error('Failed to get user from context:', error)
    return null
  }
}
