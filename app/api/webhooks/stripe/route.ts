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

// Plan mapping for entitlements
const PLAN_ENTITLEMENTS = {
  creator: {
    monthlyRunsRemaining: 100,
    monthlyGPTOptimizationsRemaining: 50,
    monthlyExportsRemaining: 50,
    canExportJSON: true,
    canExportPDF: false,
    canExportBundleZip: false,
    hasCloudHistory: true,
    hasAdvancedAnalytics: false,
    hasCustomModules: false,
    hasTeamCollaboration: false,
    hasPrioritySupport: false,
    maxTeamMembers: 1,
    maxCustomModules: 0,
    maxStorageGB: 5,
  },
  pro: {
    monthlyRunsRemaining: 1000,
    monthlyGPTOptimizationsRemaining: 500,
    monthlyExportsRemaining: 500,
    canExportJSON: true,
    canExportPDF: true,
    canExportBundleZip: false,
    hasCloudHistory: true,
    hasAdvancedAnalytics: true,
    hasCustomModules: true,
    hasTeamCollaboration: true,
    hasPrioritySupport: false,
    maxTeamMembers: 5,
    maxCustomModules: 10,
    maxStorageGB: 25,
  },
  enterprise: {
    monthlyRunsRemaining: -1, // Unlimited
    monthlyGPTOptimizationsRemaining: -1, // Unlimited
    monthlyExportsRemaining: -1, // Unlimited
    canExportJSON: true,
    canExportPDF: true,
    canExportBundleZip: true,
    hasCloudHistory: true,
    hasAdvancedAnalytics: true,
    hasCustomModules: true,
    hasTeamCollaboration: true,
    hasPrioritySupport: true,
    maxTeamMembers: -1, // Unlimited
    maxCustomModules: -1, // Unlimited
    maxStorageGB: 100,
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
    stripe_customer_id: subscription.customer as string,
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
    plan_tier: planId,
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
          plan_tier: planId,
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
      plan_tier: "free",
      monthlyRunsRemaining: 10,
      monthlyGPTOptimizationsRemaining: 0,
      monthlyExportsRemaining: 5,
      canExportJSON: false,
      canExportPDF: false,
      canExportBundleZip: false,
      hasCloudHistory: false,
      hasAdvancedAnalytics: false,
      hasCustomModules: false,
      hasTeamCollaboration: false,
      hasPrioritySupport: false,
      maxTeamMembers: 1,
      maxCustomModules: 0,
      maxStorageGB: 1,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  console.log(`Subscription cancelled for user ${userId}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  // In newer Stripe versions, we need to get subscription ID from the subscription object
  // For now, we'll skip this handler until we can determine the correct approach
  console.log("Payment succeeded - subscription ID handling needs update for current Stripe version");
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // In newer Stripe versions, we need to get subscription ID from the subscription object
  // For now, we'll skip this handler until we can determine the correct approach
  console.log("Payment failed - subscription ID handling needs update for current Stripe version");
}
