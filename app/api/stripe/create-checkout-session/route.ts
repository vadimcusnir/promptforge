import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getProductById } from '@/lib/stripe/products';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, orgId, userId, successUrl, cancelUrl } = body;

    // Validate required fields
    if (!productId || !orgId || !successUrl || !cancelUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get product details
    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // For free products (Pilot), don't create checkout session
    if (product.monthlyPrice === 0) {
      return NextResponse.json(
        {
          error: 'Free products do not require checkout',
          product: product,
        },
        { status: 400 }
      );
    }

    // For Enterprise, redirect to contact form
    if (productId === 'enterprise') {
      return NextResponse.json(
        {
          error: 'Enterprise plans require custom pricing',
          redirectTo: '/contact?plan=enterprise',
        },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: product.priceId, // This should be the actual Stripe price ID
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        org_id: orgId,
        user_id: userId,
        product_id: productId,
      },
      subscription_data: {
        metadata: {
          org_id: orgId,
          product_id: productId,
        },
        trial_period_days: productId === 'pro' ? 14 : 7, // Trial period based on plan
      },
      customer_email: body.customerEmail, // Optional: pre-fill customer email
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      tax_id_collection: {
        enabled: true,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      product: {
        id: product.id,
        name: product.name,
        price: product.monthlyPrice,
      },
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
