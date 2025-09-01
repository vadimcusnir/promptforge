import { NextRequest, NextResponse } from 'next/server';
import { PLANS, PlanType, BillingCycle } from '@/lib/plans';
import Stripe from 'stripe';

// Stripe Price IDs mapping
const STRIPE_PRICE_IDS: Record<string, string> = {
  'CREATOR_MONTHLY': process.env.STRIPE_CREATOR_MONTHLY_PRICE_ID || 'price_creator_monthly',
  'CREATOR_ANNUAL': process.env.STRIPE_CREATOR_ANNUAL_PRICE_ID || 'price_creator_annual',
  'PRO_MONTHLY': process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
  'PRO_ANNUAL': process.env.STRIPE_PRO_ANNUAL_PRICE_ID || 'price_pro_annual',
  'ENTERPRISE_MONTHLY': process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || 'price_enterprise_monthly',
  'ENTERPRISE_ANNUAL': process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID || 'price_enterprise_annual',
};

function getStripePriceId(planId: PlanType, billingCycle: BillingCycle): string | null {
  if (planId === 'FREE') return null;
  
  const key = `${planId}_${billingCycle.toUpperCase()}`;
  return STRIPE_PRICE_IDS[key] || null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, billingCycle, successUrl, cancelUrl } = body;

    // Validate plan
    if (!PLANS[planId as PlanType]) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_PLAN',
        message: 'Invalid plan selected'
      }, { status: 400 });
    }

    // Validate billing cycle
    if (!['monthly', 'annual'].includes(billingCycle)) {
      return NextResponse.json({
        success: false,
        error: 'INVALID_BILLING_CYCLE',
        message: 'Invalid billing cycle'
      }, { status: 400 });
    }

    // TODO: Get user from auth context
    const userId = 'user_123'; // Placeholder
    const userEmail = 'user@example.com'; // Placeholder

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-06-20',
    });

    // Get Stripe price ID for the plan
    const priceId = getStripePriceId(planId, billingCycle);
    
    if (!priceId) {
      return NextResponse.json({
        success: false,
        error: 'PRICE_NOT_FOUND',
        message: 'Price not found for the selected plan'
      }, { status: 400 });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
      metadata: {
        userId,
        planId,
        billingCycle
      },
      // Enable trial for Pro plan with watermark
      subscription_data: planId === 'PRO' ? {
        trial_period_days: 7,
        metadata: {
          trial: 'true',
          planId,
          watermark: 'true' // Trial exports will be watermarked
        }
      } : undefined,
      // Allow promotion codes
      allow_promotion_codes: true,
      // Collect billing address
      billing_address_collection: 'required',
      // Enable tax calculation
      automatic_tax: {
        enabled: true,
      }
    });

    const checkoutUrl = session.url;

    // Log telemetry
    console.log('Checkout started:', {
      event: 'checkout_started',
      userId,
      planId,
      billingCycle,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      checkout_url: checkoutUrl
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({
      success: false,
      error: 'CHECKOUT_FAILED',
      message: 'Failed to create checkout session'
    }, { status: 500 });
  }
} 
