import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { headers } from 'next/headers';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log('Webhook event received:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

/**
 * Handle successful checkout completion
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);

  if (session.mode === 'subscription' && session.subscription) {
    // The subscription will be handled by the subscription.created event
    // This is just for logging and any immediate actions
    console.log('Subscription created from checkout:', session.subscription);
  }
}

/**
 * Handle new subscription creation
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);

  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get customer details
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    if (customer.deleted) {
      console.error('Customer deleted, cannot process subscription');
      return;
    }

    const customerData = customer as Stripe.Customer;
    const userId = customerData.metadata.user_id;
    const orgId = customerData.metadata.org_id;
    const planCode = subscription.metadata.plan_code;
    const billingCycle = subscription.metadata.billing_cycle;

    if (!userId || !orgId || !planCode) {
      console.error('Missing metadata for subscription:', subscription.id);
      return;
    }

    // Create subscription record
    await supabase.from('subscriptions').insert({
      id: subscription.id,
      org_id: orgId,
      user_id: userId,
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      plan_code: planCode,
      billing_cycle: billingCycle,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      trial_start: subscription.trial_start
        ? new Date(subscription.trial_start * 1000).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Update organization plan
    await supabase
      .from('orgs')
      .update({
        plan: planCode,
        plan_expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', orgId);

    // Set entitlements based on plan
    await setPlanEntitlements(orgId, planCode);

    console.log('Subscription created successfully for org:', orgId);
  } catch (error) {
    console.error('Error handling subscription creation:', error);
  }
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);

  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Update subscription record
    await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);

    // Update organization plan expiry
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('org_id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (subData) {
      await supabase
        .from('orgs')
        .update({
          plan_expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', subData.org_id);
    }

    console.log('Subscription updated successfully');
  } catch (error) {
    console.error('Error handling subscription update:', error);
  }
}

/**
 * Handle subscription deletion
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);

  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Get subscription details
    const { data: subData } = await supabase
      .from('subscriptions')
      .select('org_id')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (subData) {
      // Downgrade organization to free plan
      await supabase
        .from('orgs')
        .update({
          plan: 'free',
          plan_expires_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', subData.org_id);

      // Remove all entitlements
      await supabase.from('org_entitlements').delete().eq('org_id', subData.org_id);

      // Update subscription status
      await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);
    }

    console.log('Subscription deleted successfully');
  } catch (error) {
    console.error('Error handling subscription deletion:', error);
  }
}

/**
 * Handle successful invoice payment
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Invoice payment succeeded:', invoice.id);

  if (invoice.subscription) {
    // Update subscription status if needed
    await handleSubscriptionUpdated({
      id: invoice.subscription as string,
      status: 'active',
      current_period_start: invoice.period_start,
      current_period_end: invoice.period_end,
    } as Stripe.Subscription);
  }
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id);

  try {
    const supabase = createRouteHandlerClient({ cookies });

    if (invoice.subscription) {
      // Update subscription status
      await supabase
        .from('subscriptions')
        .update({
          status: 'past_due',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', invoice.subscription as string);
    }

    console.log('Invoice payment failure handled');
  } catch (error) {
    console.error('Error handling invoice payment failure:', error);
  }
}

/**
 * Handle trial ending soon
 */
async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  console.log('Trial will end soon:', subscription.id);

  // You can implement trial ending notifications here
  // For example, send email to user about trial ending
}

/**
 * Set entitlements based on plan code
 */
async function setPlanEntitlements(orgId: string, planCode: string) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Define entitlements for each plan
    const planEntitlements: Record<string, string[]> = {
      pilot: ['canUseBasicModules', 'canExportTxt', 'canExportMarkdown', 'canUseBasicAnalytics'],
      creator: [
        'canUseBasicModules',
        'canUseAdvancedModules',
        'canExportTxt',
        'canExportMarkdown',
        'canExportJson',
        'canExportCsv',
        'canUseGptEditor',
        'canUseAdvancedAnalytics',
      ],
      pro: [
        'canUseBasicModules',
        'canUseAdvancedModules',
        'canUseCustomDomains',
        'canExportTxt',
        'canExportMarkdown',
        'canExportJson',
        'canExportCsv',
        'canExportPdf',
        'canUseGptEditor',
        'canUseGptTestReal',
        'canUseApi',
        'canUseTeamCollaboration',
        'canUseAdvancedAnalytics',
      ],
      enterprise: [
        'canUseBasicModules',
        'canUseAdvancedModules',
        'canUseCustomDomains',
        'canExportTxt',
        'canExportMarkdown',
        'canExportJson',
        'canExportCsv',
        'canExportPdf',
        'canExportDocx',
        'canExportBundle',
        'canUseGptEditor',
        'canUseGptTestReal',
        'canUseApi',
        'canUseTeamCollaboration',
        'canUseAdvancedAnalytics',
        'canUseWhiteLabel',
        'canUseCustomIntegrations',
        'canUseSla',
      ],
    };

    const entitlements = planEntitlements[planCode] || [];

    // Remove existing entitlements
    await supabase.from('org_entitlements').delete().eq('org_id', orgId);

    // Add new entitlements
    if (entitlements.length > 0) {
      const entitlementRecords = entitlements.map(flag => ({
        org_id: orgId,
        feature_flag: flag,
        is_enabled: true,
        expires_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      await supabase.from('org_entitlements').insert(entitlementRecords);
    }

    console.log(`Entitlements set for plan ${planCode}:`, entitlements);
  } catch (error) {
    console.error('Error setting plan entitlements:', error);
  }
}
