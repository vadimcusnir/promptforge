import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'

export interface Session {
  id: string
  userId: string
  sessionId: string
  ipAddress: string
  userAgent: string
  location?: {
    country?: string
    city?: string
    region?: string
  }
  deviceInfo?: {
    type: 'desktop' | 'mobile' | 'tablet'
    os?: string
    browser?: string
  }
  isActive: boolean
  lastActivity: string
  createdAt: string
  expiresAt: string
}

export class SessionManager {
  private supabase: any | null = null

  private getSupabase() {
    if (!this.supabase) {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        this.supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        )
      } else {
        // Mock client for build time
        this.supabase = {
          from: () => ({
            insert: () => Promise.resolve({ data: null, error: null }),
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: null, error: null })
              })
            }),
            update: () => ({
              eq: () => Promise.resolve({ data: null, error: null })
            })
          })
        }
      }
    }
    return this.supabase
  }

  // Generate session ID
  generateSessionId(): string {
    return randomBytes(32).toString('hex')
  }

  // Create new session
  async createSession(
    userId: string,
    ipAddress: string,
    userAgent: string,
    location?: Session['location'],
    deviceInfo?: Session['deviceInfo']
  ): Promise<Session> {
    const sessionId = this.generateSessionId()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const sessionData = {
      user_id: userId,
      session_id: sessionId,
      ip_address: ipAddress,
      user_agent: userAgent,
      location: location || null,
      device_info: deviceInfo || null,
      is_active: true,
      last_activity: now.toISOString(),
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString()
    }

    const { data, error } = await this.getSupabase()
      .from('user_sessions')
      .insert(sessionData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create session: ${error.message}`)
    }

    return this.mapSessionData(data)
  }

  // Get session by session ID
  async getSession(sessionId: string): Promise<Session | null> {
    const { data, error } = await this.getSupabase()
      .from('user_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())
      .single()

    if (error || !data) {
      return null
    }

    return this.mapSessionData(data)
  }

  // Update session activity
  async updateSessionActivity(sessionId: string): Promise<boolean> {
    const { error } = await this.getSupabase()
      .from('user_sessions')
      .update({ 
        last_activity: new Date().toISOString() 
      })
      .eq('session_id', sessionId)
      .eq('is_active', true)

    return !error
  }

  // Terminate session
  async terminateSession(sessionId: string, userId?: string): Promise<boolean> {
    let query = this.getSupabase()
      .from('user_sessions')
      .update({ is_active: false })
      .eq('session_id', sessionId)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { error } = await query

    return !error
  }

  // Terminate all sessions for user
  async terminateAllSessions(userId: string, exceptSessionId?: string): Promise<number> {
    let query = this.getSupabase()
      .from('user_sessions')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('is_active', true)

    if (exceptSessionId) {
      query = query.neq('session_id', exceptSessionId)
    }

    const { data, error } = await query.select('id')

    if (error) {
      console.error('Error terminating sessions:', error)
      return 0
    }

    return data?.length || 0
  }

  // Get user sessions
  async getUserSessions(userId: string, limit: number = 10): Promise<Session[]> {
    const { data, error } = await this.getSupabase()
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('last_activity', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching user sessions:', error)
      return []
    }

    return data?.map(this.mapSessionData) || []
  }

  // Get active sessions for user
  async getActiveSessions(userId: string): Promise<Session[]> {
    const { data, error } = await this.getSupabase()
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())
      .order('last_activity', { ascending: false })

    if (error) {
      console.error('Error fetching active sessions:', error)
      return []
    }

    return data?.map(this.mapSessionData) || []
  }

  // Clean up expired sessions
  async cleanupExpiredSessions(): Promise<number> {
    const { data, error } = await this.getSupabase()
      .from('user_sessions')
      .update({ is_active: false })
      .lt('expires_at', new Date().toISOString())
      .eq('is_active', true)
      .select('id')

    if (error) {
      console.error('Error cleaning up expired sessions:', error)
      return 0
    }

    return data?.length || 0
  }

  // Check session limits
  async checkSessionLimits(userId: string, maxSessions: number): Promise<void> {
    const activeSessions = await this.getActiveSessions(userId)
    
    if (activeSessions.length >= maxSessions) {
      // Terminate oldest sessions
      const sessionsToTerminate = activeSessions
        .sort((a, b) => new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime())
        .slice(0, activeSessions.length - maxSessions + 1)
      
      for (const session of sessionsToTerminate) {
        await this.terminateSession(session.sessionId, userId)
      }
    }
  }

  // Invalidate session
  async invalidateSession(sessionId: string, userId?: string): Promise<boolean> {
    return await this.terminateSession(sessionId, userId)
  }

  // Map database session data to Session interface
  private mapSessionData = (data: any): Session => ({
    id: data.id,
    userId: data.user_id,
    sessionId: data.session_id,
    ipAddress: data.ip_address,
    userAgent: data.user_agent,
    location: data.location,
    deviceInfo: data.device_info,
    isActive: data.is_active,
    lastActivity: data.last_activity,
    createdAt: data.created_at,
    expiresAt: data.expires_at
  })
}

// Export singleton instance
export const sessionManager = new SessionManager()

// Clean up expired sessions every hour
setInterval(() => {
  sessionManager.cleanupExpiredSessions()
}, 60 * 60 * 1000)