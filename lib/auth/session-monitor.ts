import { createClient } from '@supabase/supabase-js'

export interface SessionInfo {
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

export interface SessionMetrics {
  totalSessions: number
  activeSessions: number
  suspiciousSessions: number
  recentLogins: SessionInfo[]
  deviceTypes: Record<string, number>
  locations: Record<string, number>
}

export class SessionMonitor {
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
                order: () => ({
                  limit: () => Promise.resolve({ data: [], error: null })
                }),
                single: () => Promise.resolve({ data: null, error: null })
              }),
              gte: () => ({
                order: () => ({
                  limit: () => Promise.resolve({ data: [], error: null })
                })
              })
            }),
            update: () => ({
              eq: () => Promise.resolve({ data: null, error: null })
            }),
            delete: () => ({
              eq: () => Promise.resolve({ data: null, error: null })
            })
          })
        }
      }
    }
    return this.supabase
  }

  // Create new session
  async createSession(
    userId: string,
    sessionId: string,
    ipAddress: string,
    userAgent: string,
    location?: SessionInfo['location'],
    deviceInfo?: SessionInfo['deviceInfo']
  ): Promise<void> {
    const sessionData = {
      user_id: userId,
      session_id: sessionId,
      ip_address: ipAddress,
      user_agent: userAgent,
      location: location || null,
      device_info: deviceInfo || null,
      is_active: true,
      last_activity: new Date().toISOString(),
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    }

    await this.getSupabase()
      .from('user_sessions')
      .insert(sessionData)
  }

  // Update session activity
  async updateSessionActivity(sessionId: string): Promise<void> {
    await this.getSupabase()
      .from('user_sessions')
      .update({ 
        last_activity: new Date().toISOString() 
      })
      .eq('session_id', sessionId)
      .eq('is_active', true)
  }

  // Get user sessions
  async getUserSessions(userId: string, limit: number = 10): Promise<SessionInfo[]> {
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
  async getActiveSessions(userId: string): Promise<SessionInfo[]> {
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

  // Terminate session
  async terminateSession(sessionId: string, userId?: string): Promise<boolean> {
    const query = this.getSupabase()
      .from('user_sessions')
      .update({ is_active: false })
      .eq('session_id', sessionId)

    if (userId) {
      query.eq('user_id', userId)
    }

    const { error } = await query

    return !error
  }

  // Terminate all sessions for user
  async terminateAllSessions(userId: string, exceptSessionId?: string): Promise<number> {
    const query = this.getSupabase()
      .from('user_sessions')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('is_active', true)

    if (exceptSessionId) {
      query.neq('session_id', exceptSessionId)
    }

    const { data, error } = await query.select('id')

    if (error) {
      console.error('Error terminating sessions:', error)
      return 0
    }

    return data?.length || 0
  }

  // Get session metrics
  async getSessionMetrics(userId: string, days: number = 30): Promise<SessionMetrics> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

    const { data: sessions, error } = await this.getSupabase()
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', since)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching session metrics:', error)
      return this.getDefaultMetrics()
    }

    const activeSessions = sessions?.filter((s: any) => s.is_active && new Date(s.expires_at) > new Date()) || []
    const suspiciousSessions = this.detectSuspiciousSessions(sessions || [])

    // Calculate device types
    const deviceTypes: Record<string, number> = {}
    sessions?.forEach((session: any) => {
      const deviceType = session.device_info?.type || 'unknown'
      deviceTypes[deviceType] = (deviceTypes[deviceType] || 0) + 1
    })

    // Calculate locations
    const locations: Record<string, number> = {}
    sessions?.forEach((session: any) => {
      const location = session.location?.country || 'unknown'
      locations[location] = (locations[location] || 0) + 1
    })

    return {
      totalSessions: sessions?.length || 0,
      activeSessions: activeSessions.length,
      suspiciousSessions: suspiciousSessions.length,
      recentLogins: sessions?.slice(0, 5).map(this.mapSessionData) || [],
      deviceTypes,
      locations
    }
  }

  // Detect suspicious sessions
  private detectSuspiciousSessions(sessions: any[]): any[] {
    const suspicious: any[] = []
    const now = new Date()

    sessions.forEach(session => {
      // Check for sessions from unusual locations
      const recentSessions = sessions.filter(s => 
        s.id !== session.id && 
        new Date(s.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      )

      const sameLocation = recentSessions.filter(s => 
        s.location?.country === session.location?.country
      )

      // If less than 50% of recent sessions are from the same country, flag as suspicious
      if (recentSessions.length > 2 && sameLocation.length / recentSessions.length < 0.5) {
        suspicious.push(session)
      }

      // Check for unusual device types
      const sameDeviceType = recentSessions.filter(s => 
        s.device_info?.type === session.device_info?.type
      )

      if (recentSessions.length > 3 && sameDeviceType.length === 0) {
        suspicious.push(session)
      }

      // Check for rapid successive logins
      const rapidLogins = recentSessions.filter(s => 
        Math.abs(new Date(s.created_at).getTime() - new Date(session.created_at).getTime()) < 5 * 60 * 1000 // 5 minutes
      )

      if (rapidLogins.length > 3) {
        suspicious.push(session)
      }
    })

    return suspicious
  }

  // Map database session data to SessionInfo
  private mapSessionData = (data: any): SessionInfo => ({
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

  // Get default metrics
  private getDefaultMetrics(): SessionMetrics {
    return {
      totalSessions: 0,
      activeSessions: 0,
      suspiciousSessions: 0,
      recentLogins: [],
      deviceTypes: {},
      locations: {}
    }
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
}

// Export singleton instance
export const sessionMonitor = new SessionMonitor()

// Clean up expired sessions every hour
setInterval(() => {
  sessionMonitor.cleanupExpiredSessions()
}, 60 * 60 * 1000)
