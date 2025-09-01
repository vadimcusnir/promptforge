import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Adăugăm interfața pentru erori custom
interface CustomError extends Error {
  code: string;
  flag?: string;
  required?: string;
  actual?: string;
}

// Plan mapping for entitlements
const PLAN_ENTITLEMENTS = {
  creator: {
    max_prompts_per_month: 100,
    max_exports_per_month: 50,
    canExportJSON: false,
    canExportPDF: false,
    canExportBundleZip: false,
    can_use_gpt_test_real: false,
  },
  pro: {
    max_prompts_per_month: 1000,
    max_exports_per_month: 500,
    canExportJSON: true,
    canExportPDF: true,
    canExportBundleZip: true,
    can_use_gpt_test_real: true,
  },
  enterprise: {
    max_prompts_per_month: -1, // Unlimited
    max_exports_per_month: -1, // Unlimited
    canExportJSON: true,
    canExportPDF: true,
    canExportBundleZip: true,
    can_use_gpt_test_real: true,
  },
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const planId = subscription.metadata.plan_id;
  const userId = subscription.metadata.supabase_user_id;
  const billingCycle = subscription.metadata.billing_cycle;

  if (!planId || !userId) {
    console.error("Missing metadata in subscription:", subscription.metadata);
    return;
  }

  const entitlements = PLAN_ENTITLEMENTS[planId as keyof typeof PLAN_ENTITLEMENTS];
  if (!entitlements) {
    console.error("Unknown plan:", planId);
    return;
  }

  // Update or create subscription record
  await supabase.from("subscriptions").upsert({
    user_id: userId,
    stripe_subscription_id: subscription.id,
    plan_code: planId,
    status: subscription.status,
    billing_cycle: billingCycle,
    current_period_start: new Date(subscription.start_date * 1000).toISOString(),
    current_period_end: new Date(subscription.billing_cycle_anchor * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Update user entitlements
  await supabase.from("user_entitlements").upsert({
    user_id: userId,
    plan_code: planId,
    ...entitlements,
    updated_at: new Date().toISOString(),
  });

  console.log(`Subscription created for user ${userId} with plan ${planId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.supabase_user_id;
  const planId = subscription.metadata.plan_id;

  if (!userId || !planId) {
    console.error("Missing metadata in subscription update:", subscription.metadata);
    return;
  }

  // Update subscription status
  await supabase
    .from("subscriptions")
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.start_date * 1000).toISOString(),
      current_period_end: new Date(subscription.billing_cycle_anchor * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  // If plan changed, update entitlements
  if (subscription.status === "active") {
    const entitlements = PLAN_ENTITLEMENTS[planId as keyof typeof PLAN_ENTITLEMENTS];
    if (entitlements) {
      await supabase
        .from("user_entitlements")
        .update({
          plan_code: planId,
          ...entitlements,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
    }
  }

  console.log(`Subscription updated for user ${userId}: ${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.supabase_user_id;

  if (!userId) {
    console.error("Missing user ID in subscription deletion:", subscription.metadata);
    return;
  }

  // Mark subscription as cancelled
  await supabase
    .from("subscriptions")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  // Reset user to free plan entitlements
  await supabase
    .from("user_entitlements")
    .update({
      plan_code: "free",
      max_prompts_per_month: 10,
      max_exports_per_month: 5,
      canExportJSON: false,
      canExportPDF: false,
      canExportBundleZip: false,
      can_use_gpt_test_real: false,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  console.log(`Subscription cancelled for user ${userId}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const subscriptionId = invoice.subscription as string;
    if (!subscriptionId) {
      console.log("No subscription ID found in invoice");
      return;
    }

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata.supabase_user_id;
    const planId = subscription.metadata.plan_id;
    const isTrial = subscription.metadata.trial === 'true';

    if (!userId || !planId) {
      console.error("Missing metadata in payment succeeded:", subscription.metadata);
      return;
    }

    // If this is a trial conversion (first payment after trial), remove watermark
    if (isTrial && subscription.status === 'active') {
      console.log(`Trial converted to paid for user ${userId}, removing watermark`);
      
      // Update user entitlements to remove watermark
      await supabase
        .from("user_entitlements")
        .update({
          watermark: false,
          trial_converted: true,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      // Log conversion event
      console.log('Trial converted:', {
        event: 'trial_converted',
        userId,
        planId,
        subscriptionId,
        timestamp: new Date().toISOString()
      });
    }

    // Update subscription status
    await supabase
      .from("subscriptions")
      .update({
        status: subscription.status,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscriptionId);

    console.log(`Payment succeeded for user ${userId}, subscription ${subscriptionId}`);
  } catch (error) {
    console.error("Error handling payment succeeded:", error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const subscriptionId = invoice.subscription as string;
    if (!subscriptionId) {
      console.log("No subscription ID found in failed invoice");
      return;
    }

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = subscription.metadata.supabase_user_id;
    const planId = subscription.metadata.plan_id;

    if (!userId || !planId) {
      console.error("Missing metadata in payment failed:", subscription.metadata);
      return;
    }

    // If trial payment fails, degrade to Creator plan
    if (subscription.metadata.trial === 'true') {
      console.log(`Trial payment failed for user ${userId}, degrading to Creator plan`);
      
      // Update user to Creator plan entitlements
      const creatorEntitlements = PLAN_ENTITLEMENTS.creator;
      await supabase
        .from("user_entitlements")
        .update({
          plan_code: "creator",
          ...creatorEntitlements,
          trial_failed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      // Log trial failure event
      console.log('Trial payment failed:', {
        event: 'trial_payment_failed',
        userId,
        planId,
        subscriptionId,
        timestamp: new Date().toISOString()
      });
    }

    // Update subscription status
    await supabase
      .from("subscriptions")
      .update({
        status: subscription.status,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscriptionId);

    console.log(`Payment failed for user ${userId}, subscription ${subscriptionId}`);
  } catch (error) {
    console.error("Error handling payment failed:", error);
  }
}
