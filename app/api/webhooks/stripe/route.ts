import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { mapPriceToPlanCode, mapPriceToAddonCode, validateStripeEnvironment } from '@/lib/billing/stripe-config';

// Validate environment on module load
validateStripeEnvironment();

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: '2025-07-30.basil',
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Stripe Webhook Handler
 * Handles subscription lifecycle events and applies entitlements
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    console.error('[Stripe Webhook] Missing signature');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('[Stripe Webhook] Signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`[Stripe Webhook] Received event: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpsert(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('[Stripe Webhook] Error processing event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle checkout session completed
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log(`[Stripe Webhook] Checkout completed: ${session.id}`);

  if (session.mode === 'subscription' && session.subscription) {
    // Fetch the full subscription object
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    await handleSubscriptionUpsert(subscription);
  }

  // Handle one-time payments for add-ons
  if (session.mode === 'payment' && session.metadata?.addon_code) {
    await handleAddonPurchase(session);
  }
}

/**
 * Handle subscription creation/update
 */
async function handleSubscriptionUpsert(subscription: Stripe.Subscription) {
  console.log(`[Stripe Webhook] Processing subscription: ${subscription.id}`);

  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price?.id;
  
  if (!priceId) {
    console.error('[Stripe Webhook] No price ID found in subscription');
    return;
  }

  const planCode = mapPriceToPlanCode(priceId);
  if (!planCode) {
    console.error(`[Stripe Webhook] Unknown price ID: ${priceId}`);
    return;
  }

  const seats = subscription.items.data[0]?.quantity || 1;
  
  // Get org_id from subscription metadata or customer lookup
  const orgId = subscription.metadata?.org_id || await lookupOrgByCustomer(customerId);
  
  if (!orgId) {
    console.error(`[Stripe Webhook] No org_id found for customer: ${customerId}`);
    return;
  }

  console.log(`[Stripe Webhook] Upserting subscription for org: ${orgId}, plan: ${planCode}`);

  // 1. Upsert subscription
  const { error: subError } = await supabase
    .from('subscriptions')
    .upsert({
      org_id: orgId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      plan_code: planCode,
      status: subscription.status,
      seats,
      trial_end: subscription.trial_end 
        ? new Date(subscription.trial_end * 1000).toISOString() 
        : null,
      current_period_start: subscription.start_date
        ? new Date(subscription.start_date * 1000).toISOString()
        : null,
      current_period_end: subscription.billing_cycle_anchor
        ? new Date(subscription.billing_cycle_anchor * 1000).toISOString()
        : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
    }, {
      onConflict: 'stripe_subscription_id'
    });

  if (subError) {
    console.error('[Stripe Webhook] Error upserting subscription:', subError);
    throw subError;
  }

  // 2. Apply plan entitlements
  const { error: entError } = await supabase.rpc('pf_apply_plan_entitlements', {
    org_uuid: orgId,
    plan_code_val: planCode,
  });

  if (entError) {
    console.error('[Stripe Webhook] Error applying plan entitlements:', entError);
    throw entError;
  }

  console.log(`[Stripe Webhook] Successfully applied ${planCode} entitlements to org ${orgId}`);
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`[Stripe Webhook] Subscription deleted: ${subscription.id}`);

  const customerId = subscription.customer as string;
  const orgId = subscription.metadata?.org_id || await lookupOrgByCustomer(customerId);
  
  if (!orgId) {
    console.error(`[Stripe Webhook] No org_id found for deleted subscription: ${subscription.id}`);
    return;
  }

  // Update subscription status
  const { error: subError } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (subError) {
    console.error('[Stripe Webhook] Error updating canceled subscription:', subError);
    throw subError;
  }

  // Apply fallback plan (pilot) or remove entitlements
  const { error: entError } = await supabase.rpc('pf_apply_plan_entitlements', {
    org_uuid: orgId,
    plan_code_val: 'pilot', // Fallback to pilot plan
  });

  if (entError) {
    console.error('[Stripe Webhook] Error applying fallback entitlements:', entError);
    throw entError;
  }

  console.log(`[Stripe Webhook] Applied fallback entitlements to org ${orgId}`);
}

/**
 * Handle trial will end notification
 */
async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  console.log(`[Stripe Webhook] Trial will end: ${subscription.id}`);
  
  // You can implement trial end notifications here
  // For example, send email to org admins about trial ending
}

/**
 * Handle payment failed
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`[Stripe Webhook] Payment failed: ${invoice.id}`);
  
  const subscriptionId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id;
  if (subscriptionId) {
    // Update subscription status if needed
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId);

    if (error) {
      console.error('[Stripe Webhook] Error updating payment failed subscription:', error);
    }
  }
}

/**
 * Handle payment succeeded
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`[Stripe Webhook] Payment succeeded: ${invoice.id}`);
  
  if (invoice.subscription) {
    // Ensure subscription is active
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', invoice.subscription as string);

    if (error) {
      console.error('[Stripe Webhook] Error updating payment succeeded subscription:', error);
    }
  }
}

/**
 * Handle add-on purchase (one-time payment)
 */
async function handleAddonPurchase(session: Stripe.Checkout.Session) {
  const addonCode = session.metadata?.addon_code;
  const orgId = session.metadata?.org_id;
  const userId = session.metadata?.user_id;

  if (!addonCode || !orgId) {
    console.error('[Stripe Webhook] Missing addon metadata in session');
    return;
  }

  console.log(`[Stripe Webhook] Processing addon purchase: ${addonCode} for org: ${orgId}`);

  // Insert user addon record
  const { error: addonError } = await supabase
    .from('user_addons')
    .upsert({
      org_id: orgId,
      user_id: userId || null,
      addon_code: addonCode,
      status: 'active',
      // Set expiry based on addon type (e.g., 1 year for industry packs)
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    }, {
      onConflict: 'org_id,user_id,addon_code'
    });

  if (addonError) {
    console.error('[Stripe Webhook] Error inserting addon:', addonError);
    throw addonError;
  }

  // Apply addon-specific entitlements
  await applyAddonEntitlements(orgId, userId, addonCode);
}

/**
 * Apply entitlements for specific add-ons
 */
async function applyAddonEntitlements(orgId: string, userId: string | null, addonCode: string) {
  const addonEntitlements: Record<string, Record<string, boolean>> = {
    evaluator_ai: {
      hasEvaluatorAI: true,
    },
    export_designer: {
      hasExportDesigner: true,
    },
    fintech_pack: {
      hasFinTechPack: true,
      hasIndustryTemplates: true,
    },
    edu_pack: {
      hasEduPack: true,
      hasIndustryTemplates: true,
    },
  };

  const entitlements = addonEntitlements[addonCode];
  if (!entitlements) {
    console.log(`[Stripe Webhook] No entitlements defined for addon: ${addonCode}`);
    return;
  }

  // Insert entitlements for this addon
  for (const [flag, value] of Object.entries(entitlements)) {
    const { error } = await supabase
      .from('entitlements')
      .upsert({
        org_id: orgId,
        user_id: userId,
        flag,
        value,
        source: 'addon',
        source_ref: addonCode,
      }, {
        onConflict: 'org_id,user_id,flag,source,source_ref'
      });

    if (error) {
      console.error('[Stripe Webhook] Error inserting addon entitlement:', error);
      throw error;
    }
  }

  console.log(`[Stripe Webhook] Applied ${addonCode} entitlements to org ${orgId}`);
}

/**
 * Lookup org_id by Stripe customer ID
 */
async function lookupOrgByCustomer(customerId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('org_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error || !data) {
    console.error('[Stripe Webhook] Could not find org for customer:', customerId);
    return null;
  }

  return data.org_id;
}
