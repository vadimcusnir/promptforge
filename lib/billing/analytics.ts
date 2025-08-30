/**
 * Payment Analytics and Monitoring System
 * Tracks payment events, metrics, and provides insights
 */

import { z } from 'zod'

// Payment event types
export const PAYMENT_EVENT_TYPES = {
  CHECKOUT_STARTED: 'checkout_started',
  CHECKOUT_COMPLETED: 'checkout_completed',
  CHECKOUT_FAILED: 'checkout_failed',
  SUBSCRIPTION_CREATED: 'subscription_created',
  SUBSCRIPTION_UPDATED: 'subscription_updated',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  PAYMENT_SUCCEEDED: 'payment_succeeded',
  PAYMENT_FAILED: 'payment_failed',
  TRIAL_STARTED: 'trial_started',
  TRIAL_ENDED: 'trial_ended',
  PLAN_UPGRADED: 'plan_upgraded',
  PLAN_DOWNGRADED: 'plan_downgraded',
  REFUND_PROCESSED: 'refund_processed',
  CHARGEBACK_RECEIVED: 'chargeback_received'
} as const

export type PaymentEventType = typeof PAYMENT_EVENT_TYPES[keyof typeof PAYMENT_EVENT_TYPES]

// Payment event schema
export const paymentEventSchema = z.object({
  id: z.string().uuid(),
  eventType: z.nativeEnum(PAYMENT_EVENT_TYPES),
  userId: z.string().uuid(),
  orgId: z.string().uuid(),
  planId: z.string(),
  amount: z.number().optional(),
  currency: z.string().default('USD'),
  stripeEventId: z.string().optional(),
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  timestamp: z.string().datetime(),
  sessionId: z.string().optional(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional()
})

export type PaymentEvent = z.infer<typeof paymentEventSchema>

// Payment metrics schema
export const paymentMetricsSchema = z.object({
  date: z.string().date(),
  totalRevenue: z.number(),
  newSubscriptions: z.number(),
  cancelledSubscriptions: z.number(),
  activeSubscriptions: z.number(),
  churnRate: z.number(),
  mrr: z.number(), // Monthly Recurring Revenue
  arr: z.number(), // Annual Recurring Revenue
  averageRevenuePerUser: z.number(),
  conversionRate: z.number(),
  planBreakdown: z.record(z.object({
    count: z.number(),
    revenue: z.number()
  }))
})

export type PaymentMetrics = z.infer<typeof paymentMetricsSchema>

/**
 * Payment Analytics Service
 */
export class PaymentAnalyticsService {
  private supabase: any

  constructor(supabase: any) {
    this.supabase = supabase
  }

  /**
   * Track a payment event
   */
  async trackEvent(event: Omit<PaymentEvent, 'id' | 'timestamp'>): Promise<void> {
    try {
      const paymentEvent: PaymentEvent = {
        ...event,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString()
      }

      // Validate event
      const validatedEvent = paymentEventSchema.parse(paymentEvent)

      // Store in database
      const { error } = await this.supabase
        .from('payment_events')
        .insert(validatedEvent)

      if (error) {
        console.error('Failed to track payment event:', error)
        throw error
      }

      console.log(`📊 Payment event tracked: ${event.eventType} for user ${event.userId}`)
    } catch (error) {
      console.error('Error tracking payment event:', error)
      throw error
    }
  }

  /**
   * Get payment metrics for a date range
   */
  async getMetrics(startDate: string, endDate: string): Promise<PaymentMetrics[]> {
    try {
      const { data, error } = await this.supabase
        .from('payment_events')
        .select('*')
        .gte('timestamp', startDate)
        .lte('timestamp', endDate)
        .order('timestamp', { ascending: true })

      if (error) {
        console.error('Failed to get payment metrics:', error)
        throw error
      }

      // Process data into daily metrics
      const metricsMap = new Map<string, PaymentMetrics>()

      data?.forEach((event: PaymentEvent) => {
        const date = event.timestamp.split('T')[0]
        
        if (!metricsMap.has(date)) {
          metricsMap.set(date, {
            date,
            totalRevenue: 0,
            newSubscriptions: 0,
            cancelledSubscriptions: 0,
            activeSubscriptions: 0,
            churnRate: 0,
            mrr: 0,
            arr: 0,
            averageRevenuePerUser: 0,
            conversionRate: 0,
            planBreakdown: {}
          })
        }

        const metrics = metricsMap.get(date)!
        
        // Update metrics based on event type
        switch (event.eventType) {
          case PAYMENT_EVENT_TYPES.PAYMENT_SUCCEEDED:
            metrics.totalRevenue += event.amount || 0
            break
          case PAYMENT_EVENT_TYPES.SUBSCRIPTION_CREATED:
            metrics.newSubscriptions++
            break
          case PAYMENT_EVENT_TYPES.SUBSCRIPTION_CANCELLED:
            metrics.cancelledSubscriptions++
            break
        }
      })

      return Array.from(metricsMap.values())
    } catch (error) {
      console.error('Error getting payment metrics:', error)
      throw error
    }
  }

  /**
   * Get conversion funnel data
   */
  async getConversionFunnel(startDate: string, endDate: string) {
    try {
      const { data, error } = await this.supabase
        .from('payment_events')
        .select('eventType, userId, planId')
        .gte('timestamp', startDate)
        .lte('timestamp', endDate)
        .in('eventType', [
          PAYMENT_EVENT_TYPES.CHECKOUT_STARTED,
          PAYMENT_EVENT_TYPES.CHECKOUT_COMPLETED,
          PAYMENT_EVENT_TYPES.SUBSCRIPTION_CREATED
        ])

      if (error) {
        console.error('Failed to get conversion funnel:', error)
        throw error
      }

      const funnel = {
        checkoutStarted: new Set<string>(),
        checkoutCompleted: new Set<string>(),
        subscriptionCreated: new Set<string>()
      }

      data?.forEach((event: any) => {
        switch (event.eventType) {
          case PAYMENT_EVENT_TYPES.CHECKOUT_STARTED:
            funnel.checkoutStarted.add(event.userId)
            break
          case PAYMENT_EVENT_TYPES.CHECKOUT_COMPLETED:
            funnel.checkoutCompleted.add(event.userId)
            break
          case PAYMENT_EVENT_TYPES.SUBSCRIPTION_CREATED:
            funnel.subscriptionCreated.add(event.userId)
            break
        }
      })

      return {
        checkoutStarted: funnel.checkoutStarted.size,
        checkoutCompleted: funnel.checkoutCompleted.size,
        subscriptionCreated: funnel.subscriptionCreated.size,
        checkoutToCompletedRate: funnel.checkoutStarted.size > 0 
          ? (funnel.checkoutCompleted.size / funnel.checkoutStarted.size) * 100 
          : 0,
        completedToSubscriptionRate: funnel.checkoutCompleted.size > 0 
          ? (funnel.subscriptionCreated.size / funnel.checkoutCompleted.size) * 100 
          : 0,
        overallConversionRate: funnel.checkoutStarted.size > 0 
          ? (funnel.subscriptionCreated.size / funnel.checkoutStarted.size) * 100 
          : 0
      }
    } catch (error) {
      console.error('Error getting conversion funnel:', error)
      throw error
    }
  }

  /**
   * Get plan performance metrics
   */
  async getPlanPerformance(startDate: string, endDate: string) {
    try {
      const { data, error } = await this.supabase
        .from('payment_events')
        .select('planId, eventType, amount')
        .gte('timestamp', startDate)
        .lte('timestamp', endDate)
        .in('eventType', [
          PAYMENT_EVENT_TYPES.SUBSCRIPTION_CREATED,
          PAYMENT_EVENT_TYPES.PAYMENT_SUCCEEDED
        ])

      if (error) {
        console.error('Failed to get plan performance:', error)
        throw error
      }

      const planStats = new Map<string, {
        subscriptions: number,
        revenue: number,
        avgRevenue: number
      }>()

      data?.forEach((event: any) => {
        if (!planStats.has(event.planId)) {
          planStats.set(event.planId, {
            subscriptions: 0,
            revenue: 0,
            avgRevenue: 0
          })
        }

        const stats = planStats.get(event.planId)!
        
        if (event.eventType === PAYMENT_EVENT_TYPES.SUBSCRIPTION_CREATED) {
          stats.subscriptions++
        } else if (event.eventType === PAYMENT_EVENT_TYPES.PAYMENT_SUCCEEDED) {
          stats.revenue += event.amount || 0
        }
      })

      // Calculate average revenue per subscription
      planStats.forEach((stats, planId) => {
        stats.avgRevenue = stats.subscriptions > 0 ? stats.revenue / stats.subscriptions : 0
      })

      return Object.fromEntries(planStats)
    } catch (error) {
      console.error('Error getting plan performance:', error)
      throw error
    }
  }

  /**
   * Get churn analysis
   */
  async getChurnAnalysis(startDate: string, endDate: string) {
    try {
      const { data, error } = await this.supabase
        .from('payment_events')
        .select('userId, eventType, timestamp, planId')
        .gte('timestamp', startDate)
        .lte('timestamp', endDate)
        .in('eventType', [
          PAYMENT_EVENT_TYPES.SUBSCRIPTION_CREATED,
          PAYMENT_EVENT_TYPES.SUBSCRIPTION_CANCELLED
        ])
        .order('timestamp', { ascending: true })

      if (error) {
        console.error('Failed to get churn analysis:', error)
        throw error
      }

      const userLifecycle = new Map<string, {
        created: string | null,
        cancelled: string | null,
        planId: string | null
      }>()

      data?.forEach((event: any) => {
        if (!userLifecycle.has(event.userId)) {
          userLifecycle.set(event.userId, {
            created: null,
            cancelled: null,
            planId: null
          })
        }

        const lifecycle = userLifecycle.get(event.userId)!
        
        if (event.eventType === PAYMENT_EVENT_TYPES.SUBSCRIPTION_CREATED) {
          lifecycle.created = event.timestamp
          lifecycle.planId = event.planId
        } else if (event.eventType === PAYMENT_EVENT_TYPES.SUBSCRIPTION_CANCELLED) {
          lifecycle.cancelled = event.timestamp
        }
      })

      const churnedUsers = Array.from(userLifecycle.values()).filter(
        lifecycle => lifecycle.created && lifecycle.cancelled
      )

      const totalUsers = userLifecycle.size
      const churnedCount = churnedUsers.length
      const churnRate = totalUsers > 0 ? (churnedCount / totalUsers) * 100 : 0

      // Calculate average customer lifetime
      const lifetimes = churnedUsers.map(user => {
        const created = new Date(user.created!)
        const cancelled = new Date(user.cancelled!)
        return cancelled.getTime() - created.getTime()
      })

      const avgLifetime = lifetimes.length > 0 
        ? lifetimes.reduce((sum, lifetime) => sum + lifetime, 0) / lifetimes.length 
        : 0

      return {
        totalUsers,
        churnedUsers: churnedCount,
        churnRate,
        avgLifetimeDays: avgLifetime / (1000 * 60 * 60 * 24),
        churnByPlan: this.calculateChurnByPlan(churnedUsers)
      }
    } catch (error) {
      console.error('Error getting churn analysis:', error)
      throw error
    }
  }

  private calculateChurnByPlan(churnedUsers: any[]) {
    const churnByPlan = new Map<string, number>()
    
    churnedUsers.forEach(user => {
      if (user.planId) {
        churnByPlan.set(user.planId, (churnByPlan.get(user.planId) || 0) + 1)
      }
    })

    return Object.fromEntries(churnByPlan)
  }
}

/**
 * Helper functions for tracking common payment events
 */
export const trackPaymentEvent = {
  checkoutStarted: (userId: string, orgId: string, planId: string, sessionId?: string) => ({
    eventType: PAYMENT_EVENT_TYPES.CHECKOUT_STARTED,
    userId,
    orgId,
    planId,
    sessionId
  }),

  checkoutCompleted: (userId: string, orgId: string, planId: string, amount: number, sessionId?: string) => ({
    eventType: PAYMENT_EVENT_TYPES.CHECKOUT_COMPLETED,
    userId,
    orgId,
    planId,
    amount,
    sessionId
  }),

  subscriptionCreated: (userId: string, orgId: string, planId: string, stripeSubscriptionId: string) => ({
    eventType: PAYMENT_EVENT_TYPES.SUBSCRIPTION_CREATED,
    userId,
    orgId,
    planId,
    stripeSubscriptionId
  }),

  paymentSucceeded: (userId: string, orgId: string, planId: string, amount: number, stripeEventId: string) => ({
    eventType: PAYMENT_EVENT_TYPES.PAYMENT_SUCCEEDED,
    userId,
    orgId,
    planId,
    amount,
    stripeEventId
  }),

  subscriptionCancelled: (userId: string, orgId: string, planId: string, stripeSubscriptionId: string) => ({
    eventType: PAYMENT_EVENT_TYPES.SUBSCRIPTION_CANCELLED,
    userId,
    orgId,
    planId,
    stripeSubscriptionId
  })
}
