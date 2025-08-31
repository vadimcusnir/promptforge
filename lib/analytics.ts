import { supabase } from './supabase'

export interface AnalyticsEvent {
  event_type: string
  user_id?: string
  session_id: string
  properties: Record<string, any>
  timestamp: string
}

export interface UserMetrics {
  total_sessions: number
  modules_used: number
  exports_created: number
  time_spent: number
  last_active: string
}

class Analytics {
  private sessionId: string
  private userId?: string

  constructor() {
    this.sessionId = this.generateSessionId()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  setUserId(userId: string) {
    this.userId = userId
  }

  async track(eventType: string, properties: Record<string, any> = {}) {
    const event: AnalyticsEvent = {
      event_type: eventType,
      user_id: this.userId,
      session_id: this.sessionId,
      properties,
      timestamp: new Date().toISOString(),
    }

    try {
      // Only store in Supabase if we have a valid client
      if (supabase) {
        const { error } = await supabase
          .from('analytics_events')
          .insert([event])

        if (error) {
          console.error('Analytics tracking error:', error)
        }
      }
    } catch (error) {
      console.error('Analytics tracking error:', error)
    }

    // Always log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event)
    }
  }

  async trackPageView(page: string) {
    await this.track('page_view', { page })
  }

  async trackModuleUse(moduleId: string, moduleName: string) {
    await this.track('module_used', { module_id: moduleId, module_name: moduleName })
  }

  async trackExport(format: string, moduleCount: number) {
    await this.track('export_created', { format, module_count: moduleCount })
  }

  async trackUserAction(action: string, details: Record<string, any> = {}) {
    await this.track('user_action', { action, ...details })
  }

  async getUserMetrics(userId: string): Promise<UserMetrics | null> {
    try {
      // Only fetch from Supabase if we have a valid client
      if (supabase) {
        const { data, error } = await supabase
          .from('user_metrics')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (error) {
          console.error('Error fetching user metrics:', error)
          return null
        }

        return data
      }
      
      // Return mock data for demo
      return {
        total_sessions: 1,
        modules_used: 0,
        exports_created: 0,
        time_spent: 0,
        last_active: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Error fetching user metrics:', error)
      return null
    }
  }

  async getModuleUsageStats(): Promise<Record<string, number>> {
    try {
      // Only fetch from Supabase if we have a valid client
      if (supabase) {
        const { data, error } = await supabase
          .from('analytics_events')
          .select('properties')
          .eq('event_type', 'module_used')

        if (error) {
          console.error('Error fetching module stats:', error)
          return {}
        }

        const stats: Record<string, number> = {}
        data?.forEach(event => {
          const moduleId = event.properties?.module_id
          if (moduleId) {
            stats[moduleId] = (stats[moduleId] || 0) + 1
          }
        })

        return stats
      }
      
      // Return mock data for demo
      return {
        'M01': 5,
        'M02': 3,
        'M03': 2,
      }
    } catch (error) {
      console.error('Error fetching module stats:', error)
      return {}
    }
  }
}

export const analytics = new Analytics()
