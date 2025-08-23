import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { getProductByPriceId } from '@/lib/stripe/products';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Webhook secret from Stripe
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Function to apply plan entitlements
async function applyPlanEntitlements(orgId: string, productId: string) {
  try {
    console.log(`Applying entitlements for org ${orgId}, product ${productId}`);

    // Get product details
    const product = getProductByPriceId(productId);
    if (!product) {
      console.error(`Product ${productId} not found`);
      return false;
    }

    // Clear existing entitlements
    const { error: clearError } = await supabase.from('entitlements').delete().eq('org_id', orgId);

    if (clearError) {
      console.error('Error clearing entitlements:', clearError);
      return false;
    }

    // Apply new entitlements
    const entitlementsToInsert = product.entitlements.map(entitlement => ({
      org_id: orgId,
      flag: entitlement,
      value: true,
      applied_at: new Date().toISOString(),
      source: 'stripe_subscription',
      product_id: productId,
    }));

    const { error: insertError } = await supabase.from('entitlements').insert(entitlementsToInsert);

    if (insertError) {
      console.error('Error inserting entitlements:', insertError);
      return false;
    }

    // Call the pf_apply_plan_entitlements function
    const { error: functionError } = await supabase.rpc('pf_apply_plan_entitlements', {
      p_org_id: orgId,
      p_plan_type: productId,
      p_entitlements: product.entitlements,
    });

    if (functionError) {
      console.error('Error calling pf_apply_plan_entitlements:', functionError);
      return false;
    }

    console.log(`Successfully applied entitlements for org ${orgId}, product ${productId}`);
    return true;
  } catch (error) {
    console.error('Error applying plan entitlements:', error);
    return false;
  }
}

// Function to remove plan entitlements
async function removePlanEntitlements(orgId: string) {
  try {
    console.log(`Removing entitlements for org ${orgId}`);

    // Clear all entitlements
    const { error } = await supabase.from('entitlements').delete().eq('org_id', orgId);

    if (error) {
      console.error('Error removing entitlements:', error);
      return false;
    }

    // Reset to basic plan
    const basicEntitlements = ['canUseBasicModules', 'canExportBasic'];

    const entitlementsToInsert = basicEntitlements.map(entitlement => ({
      org_id: orgId,
      flag: entitlement,
      value: true,
      applied_at: new Date().toISOString(),
      source: 'stripe_cancellation',
      product_id: 'pilot',
    }));

    const { error: insertError } = await supabase.from('entitlements').insert(entitlementsToInsert);

    if (insertError) {
      console.error('Error inserting basic entitlements:', insertError);
      return false;
    }

    console.log(`Successfully reset entitlements for org ${orgId} to basic plan`);
    return true;
  } catch (error) {
    console.error('Error removing plan entitlements:', error);
    return false;
  }
}

// Function to update subscription status
async function updateSubscriptionStatus(
  orgId: string,
  subscriptionId: string,
  status: string,
  productId?: string
) {
  try {
    const subscriptionData = {
      org_id: orgId,
      stripe_subscription_id: subscriptionId,
      status: status,
      product_id: productId,
      updated_at: new Date().toISOString(),
    };

    // Upsert subscription record
    const { error } = await supabase.from('subscriptions').upsert(subscriptionData, {
      onConflict: 'org_id',
    });

    if (error) {
      console.error('Error updating subscription status:', error);
      return false;
    }

    console.log(`Updated subscription status for org ${orgId}: ${status}`);
    return true;
  } catch (error) {
    console.error('Error updating subscription status:', error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('No Stripe signature found');
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log(`Processing Stripe webhook: ${event.type}`);

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;

        if (subscription.status === 'active' || subscription.status === 'trialing') {
          // Get the price ID from the subscription
          const priceId = subscription.items.data[0]?.price.id;
          if (!priceId) {
            console.error('No price ID found in subscription');
            break;
          }

          // Find the product by price ID
          const product = getProductByPriceId(priceId);
          if (!product) {
            console.error(`Product not found for price ID: ${priceId}`);
            break;
          }

          // Get org ID from metadata or customer ID
          const orgId = subscription.metadata.org_id || (subscription.customer as string);

          // Update subscription status
          await updateSubscriptionStatus(orgId, subscription.id, subscription.status, product.id);

          // Apply entitlements
          await applyPlanEntitlements(orgId, product.id);
        }
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        const deletedOrgId =
          deletedSubscription.metadata.org_id || (deletedSubscription.customer as string);

        // Update subscription status
        await updateSubscriptionStatus(deletedOrgId, deletedSubscription.id, 'canceled');

        // Remove entitlements and reset to basic plan
        await removePlanEntitlements(deletedOrgId);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          console.log(`Payment succeeded for subscription: ${invoice.subscription}`);
          // Payment succeeded - subscription remains active
        }
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        if (failedInvoice.subscription) {
          console.log(`Payment failed for subscription: ${failedInvoice.subscription}`);

          // Get org ID from subscription
          const subscription = await stripe.subscriptions.retrieve(
            failedInvoice.subscription as string
          );
          const failedOrgId = subscription.metadata.org_id || (subscription.customer as string);

          // Update subscription status
          await updateSubscriptionStatus(failedOrgId, subscription.id, 'past_due');
        }
        break;

      case 'customer.subscription.trial_will_end':
        const trialSubscription = event.data.object as Stripe.Subscription;
        console.log(`Trial ending for subscription: ${trialSubscription.id}`);
        // Send notification about trial ending
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
