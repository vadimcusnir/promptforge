import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getUserFromCookies } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Plan configuration
const PLANS = {
  creator: {
    monthly: {
      priceId: process.env.STRIPE_CREATOR_MONTHLY_PRICE_ID,
      amount: 1900, // $19.00
    },
    annual: {
      priceId: process.env.STRIPE_CREATOR_ANNUAL_PRICE_ID,
      amount: 19000, // $190.00
    },
  },
  pro: {
    monthly: {
      priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
      amount: 4900, // $49.00
    },
    annual: {
      priceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
      amount: 49000, // $490.00
    },
  },
  enterprise: {
    monthly: {
      priceId: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
      amount: 19900, // $199.00
    },
    annual: {
      priceId: process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID,
      amount: 199000, // $1990.00
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId, billingCycle, successUrl, cancelUrl } = body;

    if (!planId || !billingCycle || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (planId === "free") {
      return NextResponse.json(
        { error: "Cannot create checkout for free plan" },
        { status: 400 }
      );
    }

    const plan = PLANS[planId as keyof typeof PLANS];
    if (!plan) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    const billingConfig = plan[billingCycle as keyof typeof plan];
    if (!billingConfig) {
      return NextResponse.json(
        { error: "Invalid billing cycle" },
        { status: 400 }
      );
    }

    // Check if user already has a subscription
    const { data: existingSubscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.email)
      .eq("status", "active")
      .single();

    if (existingSubscription) {
      return NextResponse.json(
        { error: "User already has an active subscription" },
        { status: 400 }
      );
    }

    // Create or get customer
    let customer;
    const { data: existingCustomer } = await supabase
      .from("customers")
      .select("stripe_customer_id")
      .eq("email", user.email)
      .single();

    if (existingCustomer?.stripe_customer_id) {
      customer = await stripe.customers.retrieve(existingCustomer.stripe_customer_id);
    } else {
      customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.email,
        },
      });

      // Store customer in Supabase
      await supabase.from("customers").upsert({
        email: user.email,
        stripe_customer_id: customer.id,
        created_at: new Date().toISOString(),
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price: billingConfig.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        metadata: {
          plan_id: planId,
          billing_cycle: billingCycle,
          supabase_user_id: user.email,
        },
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        plan_id: planId,
        billing_cycle: billingCycle,
        supabase_user_id: user.email,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromCookies();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's current subscription status
    const { data: subscription } = await supabase
      .from("subscriptions")
      .select(`
        *,
        plans (
          name,
          features
        )
      `)
      .eq("user_id", user.email)
      .eq("status", "active")
      .single();

    if (!subscription) {
      return NextResponse.json({
        hasSubscription: false,
        plan: "free",
        features: [],
      });
    }

    return NextResponse.json({
      hasSubscription: true,
      plan: subscription.plan_code,
      features: subscription.plans?.features || [],
      status: subscription.status,
      current_period_end: subscription.current_period_end,
    });
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
