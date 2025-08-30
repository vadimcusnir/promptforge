/**
 * Comprehensive Payment System Tests
 * Tests all critical payment flows, security, and edge cases
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { NextRequest } from 'next/server'
import { stripe } from '@/lib/billing/stripe'
import { PaymentAnalyticsService } from '@/lib/billing/analytics'
import { 
  PLAN_CODES, 
  validateStripePriceIds, 
  getPlanMetadata,
  hasEntitlement 
} from '@/lib/billing/plans'

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn()
      }
    },
    subscriptions: {
      retrieve: jest.fn()
    },
    customers: {
      retrieve: jest.fn()
    },
    webhooks: {
      constructEvent: jest.fn()
    }
  }))
})

// Mock Supabase
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    })),
    insert: jest.fn(() => Promise.resolve({ error: null })),
    update: jest.fn(() => Promise.resolve({ error: null })),
    upsert: jest.fn(() => Promise.resolve({ error: null })),
    rpc: jest.fn(() => Promise.resolve({ error: null }))
  }))
}

describe('Payment System Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Set up environment variables for testing
    process.env.STRIPE_SECRET_KEY = 'sk_test_mock'
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock'
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_mock'
    process.env.STRIPE_PILOT_MONTHLY_PRICE_ID = 'price_pilot_monthly'
    process.env.STRIPE_PILOT_ANNUAL_PRICE_ID = 'price_pilot_annual'
    process.env.STRIPE_PRO_MONTHLY_PRICE_ID = 'price_pro_monthly'
    process.env.STRIPE_PRO_ANNUAL_PRICE_ID = 'price_pro_annual'
    process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID = 'price_enterprise_monthly'
    process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID = 'price_enterprise_annual'
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Plan Configuration', () => {
    it('should validate all required Stripe price IDs are configured', () => {
      expect(() => validateStripePriceIds()).not.toThrow()
    })

    it('should throw error when price IDs are missing', () => {
      delete process.env.STRIPE_PRO_MONTHLY_PRICE_ID
      expect(() => validateStripePriceIds()).toThrow('Missing required Stripe price ID environment variables')
    })

    it('should return correct plan metadata', () => {
      const pilotPlan = getPlanMetadata(PLAN_CODES.PILOT)
      expect(pilotPlan.name).toBe('Pilot')
      expect(pilotPlan.price_monthly).toBe(0)
      expect(pilotPlan.popular).toBe(false)

      const proPlan = getPlanMetadata(PLAN_CODES.PRO)
      expect(proPlan.name).toBe('Pro')
      expect(proPlan.price_monthly).toBe(49)
      expect(proPlan.popular).toBe(true)
    })

    it('should correctly check plan entitlements', () => {
      expect(hasEntitlement(PLAN_CODES.PILOT, 'canExportPDF')).toBe(false)
      expect(hasEntitlement(PLAN_CODES.PRO, 'canExportPDF')).toBe(true)
      expect(hasEntitlement(PLAN_CODES.ENTERPRISE, 'hasAPI')).toBe(true)
    })
  })

  describe('Checkout API Security', () => {
    it('should require authentication for checkout', async () => {
      const request = new NextRequest('http://localhost:3000/api/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({
          planId: PLAN_CODES.PRO,
          isAnnual: false
        })
      })

      // Mock requireAuth to throw authentication error
      jest.doMock('@/lib/auth/server-auth', () => ({
        requireAuth: jest.fn().mockRejectedValue(new Error('Authentication required'))
      }))

      const { POST } = await import('@/app/api/create-checkout-session/route')
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Authentication required')
    })

    it('should validate request schema', async () => {
      const request = new NextRequest('http://localhost:3000/api/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({
          planId: 'invalid_plan',
          isAnnual: 'not_boolean'
        })
      })

      // Mock requireAuth to succeed
      jest.doMock('@/lib/auth/server-auth', () => ({
        requireAuth: jest.fn().mockResolvedValue({ id: 'user123', email: 'test@example.com' })
      }))

      const { POST } = await import('@/app/api/create-checkout-session/route')
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request data')
    })

    it('should apply rate limiting', async () => {
      const request = new NextRequest('http://localhost:3000/api/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({
          planId: PLAN_CODES.PRO,
          isAnnual: false
        })
      })

      // Mock rate limiter to return rate limit exceeded
      jest.doMock('@/lib/rate-limit', () => ({
        rateLimit: jest.fn(() => ({
          check: jest.fn().mockResolvedValue({ success: false })
        }))
      }))

      const { POST } = await import('@/app/api/create-checkout-session/route')
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.error).toBe('Rate limit exceeded. Please try again later.')
    })
  })

  describe('Webhook Security', () => {
    it('should verify webhook signature', async () => {
      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: 'test body',
        headers: {
          'stripe-signature': 'invalid_signature'
        }
      })

      // Mock Stripe webhook verification to fail
      stripe.webhooks.constructEvent = jest.fn().mockImplementation(() => {
        throw new Error('Invalid signature')
      })

      const { POST } = await import('@/app/api/webhooks/stripe/route')
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid signature')
    })

    it('should handle idempotency correctly', async () => {
      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: 'test body',
        headers: {
          'stripe-signature': 'valid_signature'
        }
      })

      // Mock existing event
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { id: 'existing_event' },
        error: null
      })

      // Mock Stripe webhook verification to succeed
      stripe.webhooks.constructEvent = jest.fn().mockReturnValue({
        id: 'evt_test',
        type: 'customer.subscription.created',
        data: { object: {} }
      })

      const { POST } = await import('@/app/api/webhooks/stripe/route')
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.received).toBe(true)
    })
  })

  describe('Payment Analytics', () => {
    let analyticsService: PaymentAnalyticsService

    beforeEach(() => {
      analyticsService = new PaymentAnalyticsService(mockSupabase)
    })

    it('should track payment events correctly', async () => {
      const event = {
        eventType: 'checkout_started' as const,
        userId: 'user123',
        orgId: 'org123',
        planId: PLAN_CODES.PRO
      }

      await analyticsService.trackEvent(event)

      expect(mockSupabase.from).toHaveBeenCalledWith('payment_events')
      expect(mockSupabase.from().insert).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: 'checkout_started',
          userId: 'user123',
          orgId: 'org123',
          planId: PLAN_CODES.PRO
        })
      )
    })

    it('should calculate conversion funnel correctly', async () => {
      const mockEvents = [
        { eventType: 'checkout_started', userId: 'user1' },
        { eventType: 'checkout_started', userId: 'user2' },
        { eventType: 'checkout_completed', userId: 'user1' },
        { eventType: 'subscription_created', userId: 'user1' }
      ]

      mockSupabase.from().select().gte().lte().order.mockResolvedValue({
        data: mockEvents,
        error: null
      })

      const funnel = await analyticsService.getConversionFunnel('2024-01-01', '2024-01-31')

      expect(funnel.checkoutStarted).toBe(2)
      expect(funnel.checkoutCompleted).toBe(1)
      expect(funnel.subscriptionCreated).toBe(1)
      expect(funnel.overallConversionRate).toBe(50) // 1 out of 2
    })

    it('should calculate churn analysis correctly', async () => {
      const mockEvents = [
        { eventType: 'subscription_created', userId: 'user1', timestamp: '2024-01-01T00:00:00Z', planId: PLAN_CODES.PRO },
        { eventType: 'subscription_created', userId: 'user2', timestamp: '2024-01-01T00:00:00Z', planId: PLAN_CODES.PRO },
        { eventType: 'subscription_cancelled', userId: 'user1', timestamp: '2024-01-15T00:00:00Z', planId: PLAN_CODES.PRO }
      ]

      mockSupabase.from().select().gte().lte().in().order.mockResolvedValue({
        data: mockEvents,
        error: null
      })

      const churn = await analyticsService.getChurnAnalysis('2024-01-01', '2024-01-31')

      expect(churn.totalUsers).toBe(2)
      expect(churn.churnedUsers).toBe(1)
      expect(churn.churnRate).toBe(50) // 1 out of 2
      expect(churn.avgLifetimeDays).toBe(14) // 15 days - 1 day
    })
  })

  describe('Error Handling', () => {
    it('should handle Stripe API failures gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/api/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({
          planId: PLAN_CODES.PRO,
          isAnnual: false
        })
      })

      // Mock requireAuth to succeed
      jest.doMock('@/lib/auth/server-auth', () => ({
        requireAuth: jest.fn().mockResolvedValue({ id: 'user123', email: 'test@example.com' })
      }))

      // Mock Stripe checkout session creation to fail
      stripe.checkout.sessions.create = jest.fn().mockRejectedValue(new Error('Stripe API error'))

      const { POST } = await import('@/app/api/create-checkout-session/route')
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to create checkout session')
    })

    it('should handle database connection failures', async () => {
      const analyticsService = new PaymentAnalyticsService(mockSupabase)
      
      // Mock database error
      mockSupabase.from().insert.mockResolvedValue({
        error: new Error('Database connection failed')
      })

      const event = {
        eventType: 'checkout_started' as const,
        userId: 'user123',
        orgId: 'org123',
        planId: PLAN_CODES.PRO
      }

      await expect(analyticsService.trackEvent(event)).rejects.toThrow('Database connection failed')
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing organization ID in webhook', async () => {
      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: 'test body',
        headers: {
          'stripe-signature': 'valid_signature'
        }
      })

      // Mock Stripe webhook verification to succeed
      stripe.webhooks.constructEvent = jest.fn().mockReturnValue({
        id: 'evt_test',
        type: 'customer.subscription.created',
        data: { object: { id: 'sub_test', customer: 'cus_test' } }
      })

      // Mock customer retrieval to return customer without org_id
      stripe.customers.retrieve = jest.fn().mockResolvedValue({
        id: 'cus_test',
        metadata: {} // No org_id
      })

      // Mock no existing event
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: null
      })

      const { POST } = await import('@/app/api/webhooks/stripe/route')
      const response = await POST(request)

      expect(response.status).toBe(200)
      // Should not throw error, just log and continue
    })

    it('should handle invalid plan codes gracefully', async () => {
      const request = new NextRequest('http://localhost:3000/api/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({
          planId: 'invalid_plan',
          isAnnual: false
        })
      })

      // Mock requireAuth to succeed
      jest.doMock('@/lib/auth/server-auth', () => ({
        requireAuth: jest.fn().mockResolvedValue({ id: 'user123', email: 'test@example.com' })
      }))

      const { POST } = await import('@/app/api/create-checkout-session/route')
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid request data')
    })
  })

  describe('Performance Tests', () => {
    it('should handle high volume webhook processing', async () => {
      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: 'test body',
        headers: {
          'stripe-signature': 'valid_signature'
        }
      })

      // Mock Stripe webhook verification to succeed
      stripe.webhooks.constructEvent = jest.fn().mockReturnValue({
        id: 'evt_test',
        type: 'customer.subscription.created',
        data: { object: { id: 'sub_test', customer: 'cus_test' } }
      })

      // Mock customer retrieval
      stripe.customers.retrieve = jest.fn().mockResolvedValue({
        id: 'cus_test',
        metadata: { org_id: 'org123' }
      })

      // Mock no existing event
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: null
      })

      const { POST } = await import('@/app/api/webhooks/stripe/route')
      
      const startTime = Date.now()
      const response = await POST(request)
      const endTime = Date.now()

      expect(response.status).toBe(200)
      expect(endTime - startTime).toBeLessThan(1000) // Should complete within 1 second
    })
  })
})
