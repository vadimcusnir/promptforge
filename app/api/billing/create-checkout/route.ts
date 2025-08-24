import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { createClient } from '@supabase/supabase-js';
import { getProductByPlanCode } from '@/lib/billing/stripe-config';

// Initialize clients only when needed
let stripeInstance: Stripe | null = null;
let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    const STRIPE_SECRET = process.env.STRIPE_SECRET;
    if (!STRIPE_SECRET) {
      throw new Error('STRIPE_SECRET environment variable is required');
    }
    stripeInstance = new Stripe(STRIPE_SECRET, {
      apiVersion: '2023-10-16',
    });
  }
  return stripeInstance;
}

function getSupabase() {
  if (!supabaseInstance) {
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE environment variables are required');
    }
    
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabaseInstance;
}

interface CreateCheckoutRequest {
  orgId: string;
  planCode: 'pilot' | 'pro' | 'enterprise';
  billingCycle: 'monthly' | 'annual';
  successUrl: string;
  cancelUrl: string;
  seats?: number;
}

/**
 * Create Stripe Checkout Session
 * Handles subscription creation and upgrades
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Get current session
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateCheckoutRequest = await req.json();
    const { orgId, planCode, billingCycle, successUrl, cancelUrl, seats = 1 } = body;

    // Validate request
    if (!orgId || !planCode || !billingCycle) {
      return NextResponse.json({ 
        error: 'Missing required fields: orgId, planCode, billingCycle' 
      }, { status: 400 });
    }

    if (planCode === 'pilot') {
      return NextResponse.json({ 
        error: 'Cannot create checkout for pilot plan' 
      }, { status: 400 });
    }

    // Verify user is admin of the organization
    const { data: membership, error: memberError } = await getSupabase()
      .from('org_members')
      .select('role')
      .eq('org_id', orgId)
      .eq('user_id', session.user.id)
      .single();

    if (memberError || !membership || !['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json({ 
        error: 'Not authorized to manage billing for this organization' 
      }, { status: 403 });
    }

    // Get Stripe product configuration
    const product = getProductByPlanCode(planCode);
    if (!product) {
      return NextResponse.json({ 
        error: `Unknown plan: ${planCode}` 
      }, { status: 400 });
    }

    const priceId = billingCycle === 'annual' ? product.prices.annual : product.prices.monthly;
    if (!priceId) {
      return NextResponse.json({ 
        error: `No ${billingCycle} price configured for ${planCode}` 
      }, { status: 400 });
    }

    // Check for existing subscription
    const { data: existingSubscription } = await getSupabase()
      .from('subscriptions')
      .select('stripe_customer_id, stripe_subscription_id, plan_code, status')
      .eq('org_id', orgId)
      .single();

    let customerId = existingSubscription?.stripe_customer_id;

    // Create or retrieve Stripe customer
    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: session.user.email!,
        metadata: {
          org_id: orgId,
          user_id: session.user.id,
        },
      });
      customerId = customer.id;
    }

    // Determine checkout mode
    const isUpgrade = existingSubscription && 
      existingSubscription.status === 'active' && 
      existingSubscription.stripe_subscription_id;

    if (isUpgrade) {
      // For upgrades, we'll create a new subscription and cancel the old one
      // This is simpler than prorating, but you could implement prorating here
      
      const checkoutSession = await getStripe().checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        line_items: [
          {
            price: priceId,
            quantity: seats,
          },
        ],
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: {
          org_id: orgId,
          user_id: session.user.id,
          plan_code: planCode,
          billing_cycle: billingCycle,
          seats: seats.toString(),
          upgrade_from: existingSubscription.plan_code,
          old_subscription_id: existingSubscription.stripe_subscription_id,
        },
        subscription_data: {
          metadata: {
            org_id: orgId,
            plan_code: planCode,
          },
        },
        allow_promotion_codes: true,
        billing_address_collection: 'auto',
        tax_id_collection: {
          enabled: true,
        },
      });

      return NextResponse.json({ url: checkoutSession.url });
    } else {
      // New subscription
      const checkoutSession = await getStripe().checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        line_items: [
          {
            price: priceId,
            quantity: seats,
          },
        ],
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl,
        metadata: {
          org_id: orgId,
          user_id: session.user.id,
          plan_code: planCode,
          billing_cycle: billingCycle,
          seats: seats.toString(),
        },
        subscription_data: {
          metadata: {
            org_id: orgId,
            plan_code: planCode,
          },
          trial_period_days: planCode === 'pro' ? 14 : undefined, // 14-day trial for Pro
        },
        allow_promotion_codes: true,
        billing_address_collection: 'auto',
        tax_id_collection: {
          enabled: true,
        },
      });

      return NextResponse.json({ url: checkoutSession.url });
    }

  } catch (error) {
    console.error('[Billing Checkout] Error:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get current subscription info
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get('org_id');

    if (!orgId) {
      return NextResponse.json({ error: 'org_id required' }, { status: 400 });
    }

    // Verify user is member of the organization
    const { data: membership, error: memberError } = await getSupabase()
      .from('org_members')
      .select('role')
      .eq('org_id', orgId)
      .eq('user_id', session.user.id)
      .single();

    if (memberError || !membership) {
      return NextResponse.json({ 
        error: 'Not a member of this organization' 
      }, { status: 403 });
    }

    // Get subscription info
    const { data: subscription, error: subError } = await getSupabase()
      .from('subscriptions')
      .select('*')
      .eq('org_id', orgId)
      .single();

    if (subError && subError.code !== 'PGRST116') { // Not found is OK
      console.error('[Billing Info] Error fetching subscription:', subError);
      return NextResponse.json({ 
        error: 'Failed to fetch subscription' 
      }, { status: 500 });
    }

    return NextResponse.json({
      subscription: subscription || null,
      canManageBilling: ['owner', 'admin'].includes(membership.role),
    });

  } catch (error) {
    console.error('[Billing Info] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
