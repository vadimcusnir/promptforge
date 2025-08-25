import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { POST } from '@/app/api/webhooks/stripe/route';

// Mock dependencies
vi.mock('stripe');
vi.mock('@supabase/supabase-js');
vi.mock('@/lib/billing/stripe-config');

const mockSupabaseClient = {
  from: vi.fn(() => ({
    upsert: vi.fn(() => ({ error: null as null | Error })),
    select: vi.fn(() => ({ 
      eq: vi.fn(() => ({ 
        single: vi.fn(() => ({ data: { org_id: 'test-org-id' }, error: null }))
      }))
    })),
  })),
  rpc: vi.fn(() => ({ error: null })),
};

const mockStripe = {
  webhooks: {
    constructEvent: vi.fn(),
  },
};

// Mock environment variables
const originalEnv = process.env;
beforeEach(() => {
  process.env = {
    ...originalEnv,
    STRIPE_SECRET: 'sk_test_123',
    STRIPE_WEBHOOK_SECRET: 'whsec_test_123',
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_SERVICE_ROLE: 'service_role_key',
  };

  vi.mocked(Stripe).mockImplementation(() => mockStripe as any);
  vi.doMock('@supabase/supabase-js', () => ({
    createClient: vi.fn(() => mockSupabaseClient),
  }));
  vi.doMock('@/lib/billing/stripe-config', () => ({
    mapPriceToPlanCode: vi.fn((priceId: string) => {
      const priceMap: Record<string, string> = {
        'price_pro_monthly': 'pro',
        'price_enterprise_monthly': 'enterprise',
      };
      return priceMap[priceId] || null;
    }),
    validateStripeEnvironment: vi.fn(),
  }));
});

afterEach(() => {
  process.env = originalEnv;
  vi.clearAllMocks();
});

describe('Stripe Webhook Handler', () => {
  const createMockRequest = (body: string, signature: string = 'valid_signature') => {
    return new NextRequest('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body,
      headers: {
        'stripe-signature': signature,
        'content-type': 'application/json',
      },
    });
  };

  const createMockSubscription = (overrides: Partial<Stripe.Subscription> = {}): Stripe.Subscription => ({
    id: 'sub_test123',
    object: 'subscription',
    customer: 'cus_test123',
    status: 'active',
    items: {
      object: 'list',
      data: [{
        id: 'si_test123',
        object: 'subscription_item',
        price: {
          id: 'price_pro_monthly',
          object: 'price',
        },
        quantity: 1,
      }],
      has_more: false,
      total_count: 1,
      url: '/v1/subscription_items',
    },
    metadata: {
      org_id: 'test-org-id',
    },
    trial_end: null,
    current_period_start: 1640995200, // 2022-01-01
    current_period_end: 1643673600,   // 2022-02-01
    cancel_at_period_end: false,
    ...overrides,
  } as Stripe.Subscription);

  describe('subscription.created', () => {
    it('should create subscription and apply entitlements', async () => {
      const subscription = createMockSubscription();
      const event: Stripe.Event = {
        id: 'evt_test123',
        object: 'event',
        type: 'customer.subscription.created',
        data: { object: subscription },
        created: Date.now(),
        livemode: false,
        pending_webhooks: 1,
        request: { id: null, idempotency_key: null },
        api_version: '2025-07-30.basil',
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(event);

      const request = createMockRequest(JSON.stringify(event));
      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('subscriptions');
      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('pf_apply_plan_entitlements', {
        org_uuid: 'test-org-id',
        plan_code_val: 'pro',
      });
    });

    it('should handle subscription with trial', async () => {
      const subscription = createMockSubscription({
        trial_end: Math.floor(Date.now() / 1000) + 86400 * 14, // 14 days from now
      });
      const event: Stripe.Event = {
        id: 'evt_test123',
        object: 'event',
        type: 'customer.subscription.created',
        data: { object: subscription },
        created: Date.now(),
        livemode: false,
        pending_webhooks: 1,
        request: { id: null, idempotency_key: null },
        api_version: '2025-07-30.basil',
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(event);

      const request = createMockRequest(JSON.stringify(event));
      const response = await POST(request);

      expect(response.status).toBe(200);
      
      // Verify trial_end was processed correctly
      const upsertCalls = mockSupabaseClient.from().upsert.mock.calls as any[][];
      expect(upsertCalls.length).toBeGreaterThan(0);
      const upsertCall = upsertCalls[0][0];
      expect(upsertCall.trial_end).toBeTruthy();
    });
  });

  describe('subscription.updated', () => {
    it('should update subscription and reapply entitlements', async () => {
      const subscription = createMockSubscription({
        items: {
          object: 'list',
          data: [{
            id: 'si_test123',
            object: 'subscription_item',
            price: {
              id: 'price_enterprise_monthly',
              object: 'price',
              active: true,
              billing_scheme: 'per_unit',
              created: Math.floor(Date.now() / 1000),
              currency: 'usd',
              livemode: false,
              lookup_key: null,
              metadata: {},
              nickname: null,
              product: 'prod_enterprise',
              recurring: {
                interval: 'month',
                interval_count: 1,
                usage_type: 'licensed',
              },
              tax_behavior: 'unspecified',
              type: 'recurring',
              unit_amount: 99900,
              unit_amount_decimal: '99900',
            } as any,
            quantity: 5, // Multi-seat
            billing_thresholds: null,
            created: Math.floor(Date.now() / 1000),
            current_period_end: Math.floor(Date.now() / 1000) + 86400 * 30,
            current_period_start: Math.floor(Date.now() / 1000),
            metadata: {},
            proration_behavior: 'create_prorations',
            quantity_metadata: {},
            tax_rates: [],
            unit_amount_decimal: '99900',
          } as any],
          has_more: false,
          url: '/v1/subscription_items',
        },
      });

      const event: Stripe.Event = {
        id: 'evt_test123',
        object: 'event',
        type: 'customer.subscription.updated',
        data: { object: subscription },
        created: Date.now(),
        livemode: false,
        pending_webhooks: 1,
        request: { id: null, idempotency_key: null },
        api_version: '2025-07-30.basil',
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(event);

      const request = createMockRequest(JSON.stringify(event));
      const response = await POST(request);

      expect(response.status).toBe(200);
      
      // Verify seats were updated
      const upsertCalls = mockSupabaseClient.from().upsert.mock.calls as any[][];
      expect(upsertCalls.length).toBeGreaterThan(0);
      const upsertCall = upsertCalls[0][0];
      expect(upsertCall.seats).toBe(5);
      expect(upsertCall.plan_code).toBe('enterprise');
    });
  });

  describe('subscription.deleted', () => {
    it('should mark subscription as canceled and apply fallback plan', async () => {
      const subscription = createMockSubscription({ status: 'canceled' });
      const event: Stripe.Event = {
        id: 'evt_test123',
        object: 'event',
        type: 'customer.subscription.deleted',
        data: { object: subscription },
        created: Date.now(),
        livemode: false,
        pending_webhooks: 1,
        request: { id: null, idempotency_key: null },
        api_version: '2025-07-30.basil',
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(event);

      const request = createMockRequest(JSON.stringify(event));
      const response = await POST(request);

      expect(response.status).toBe(200);
      
      // Should apply fallback plan (pilot)
      expect(mockSupabaseClient.rpc).toHaveBeenCalledWith('pf_apply_plan_entitlements', {
        org_uuid: 'test-org-id',
        plan_code_val: 'pilot',
      });
    });
  });

  describe('error handling', () => {
    it('should return 400 for invalid signature', async () => {
      mockStripe.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      const request = createMockRequest('{}', 'invalid_signature');
      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing signature', async () => {
      const request = new NextRequest('http://localhost:3000/api/webhooks/stripe', {
        method: 'POST',
        body: '{}',
        headers: {
          'content-type': 'application/json',
        },
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });

    it('should handle unknown price ID gracefully', async () => {
      const subscription = createMockSubscription({
        items: {
          object: 'list',
          data: [{
            id: 'si_test123',
            object: 'subscription_item',
            price: {
              id: 'price_unknown',
              object: 'price',
              active: true,
              billing_scheme: 'per_unit',
              created: Math.floor(Date.now() / 1000),
              currency: 'usd',
              livemode: false,
              lookup_key: null,
              metadata: {},
              nickname: null,
              product: 'prod_unknown',
              recurring: {
                interval: 'month',
                interval_count: 1,
                usage_type: 'licensed',
              },
              tax_behavior: 'unspecified',
              type: 'recurring',
              unit_amount: 1000,
              unit_amount_decimal: '1000',
            } as any,
            quantity: 1,
            billing_thresholds: null,
            created: Math.floor(Date.now() / 1000),
            current_period_end: Math.floor(Date.now() / 1000) + 86400 * 30,
            current_period_start: Math.floor(Date.now() / 1000),
            metadata: {},
            proration_behavior: 'create_prorations',
            quantity_metadata: {},
            tax_rates: [],
            unit_amount_decimal: '1000',
          } as any],
          has_more: false,
          url: '/v1/subscription_items',
        },
      });

      const event: Stripe.Event = {
        id: 'evt_test123',
        object: 'event',
        type: 'customer.subscription.created',
        data: { object: subscription },
        created: Date.now(),
        livemode: false,
        pending_webhooks: 1,
        request: { id: null, idempotency_key: null },
        api_version: '2025-07-30.basil',
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(event);

      const request = createMockRequest(JSON.stringify(event));
      const response = await POST(request);

      // Should still return 200 but log error
      expect(response.status).toBe(200);
      
      // Should not call database operations
      expect(mockSupabaseClient.from).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      // Mock database error
      mockSupabaseClient.from.mockReturnValue({
        upsert: vi.fn(() => ({ error: new Error('Database error') })),
        select: vi.fn(() => ({ 
          eq: vi.fn(() => ({ 
            single: vi.fn(() => ({ data: { org_id: 'test-org-id' }, error: null }))
          }))
        })),
      });

      const subscription = createMockSubscription();
      const event: Stripe.Event = {
        id: 'evt_test123',
        object: 'event',
        type: 'customer.subscription.created',
        data: { object: subscription },
        created: Date.now(),
        livemode: false,
        pending_webhooks: 1,
        request: { id: null, idempotency_key: null },
        api_version: '2025-07-30.basil',
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(event);

      const request = createMockRequest(JSON.stringify(event));
      const response = await POST(request);

      expect(response.status).toBe(500);
    });
  });

  describe('idempotency', () => {
    it('should handle duplicate events gracefully', async () => {
      const subscription = createMockSubscription();
      const event: Stripe.Event = {
        id: 'evt_test123', // Same event ID
        object: 'event',
        type: 'customer.subscription.created',
        data: { object: subscription },
        created: Date.now(),
        livemode: false,
        pending_webhooks: 1,
        request: { id: null, idempotency_key: null },
        api_version: '2025-07-30.basil',
      };

      mockStripe.webhooks.constructEvent.mockReturnValue(event);

      const request = createMockRequest(JSON.stringify(event));
      
      // First call
      const response1 = await POST(request);
      expect(response1.status).toBe(200);
      
      // Second call with same event (should be idempotent due to upsert)
      const response2 = await POST(request);
      expect(response2.status).toBe(200);
      
      // Database calls should work the same way due to upsert
      expect(mockSupabaseClient.from).toHaveBeenCalledTimes(2);
    });
  });
});
