import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout session completed:', session.id);
  
  const { userId, planId, billingCycle } = session.metadata || {};
  
  // TODO: Update user subscription in database
  // await updateUserSubscription(userId, {
  //   planId,
  //   billingCycle,
  //   stripeCustomerId: session.customer,
  //   stripeSubscriptionId: session.subscription,
  //   status: 'active'
  // });

  // Log telemetry
  console.log('Checkout completed:', {
    event: 'checkout_completed',
    userId,
    planId,
    billingCycle,
    sessionId: session.id,
    timestamp: new Date().toISOString()
  });
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log('Invoice paid:', invoice.id);
  
  const subscription = invoice.subscription as string;
  
  // TODO: Update subscription status in database
  // await updateSubscriptionStatus(subscription, 'active');
  
  // Remove trial watermark if this was the first paid invoice
  if (invoice.billing_reason === 'subscription_cycle') {
    // TODO: Remove watermark from user exports
    console.log('Removing trial watermark for subscription:', subscription);
  }

  // Log telemetry
  console.log('Invoice paid:', {
    event: 'invoice_paid',
    subscriptionId: subscription,
    amount: invoice.amount_paid,
    timestamp: new Date().toISOString()
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  
  // TODO: Update subscription in database
  // await updateSubscription(subscription.id, {
  //   status: subscription.status,
  //   currentPeriodStart: new Date(subscription.current_period_start * 1000),
  //   currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  //   planId: subscription.metadata?.planId
  // });

  // Log telemetry
  console.log('Subscription updated:', {
    event: 'subscription_updated',
    subscriptionId: subscription.id,
    status: subscription.status,
    timestamp: new Date().toISOString()
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id);
  
  const subscription = invoice.subscription as string;
  
  // TODO: Update subscription status in database
  // await updateSubscriptionStatus(subscription, 'past_due');
  
  // TODO: Send payment failure notification to user
  // await sendPaymentFailureNotification(invoice.customer_email);

  // Log telemetry
  console.log('Invoice payment failed:', {
    event: 'invoice_payment_failed',
    subscriptionId: subscription,
    amount: invoice.amount_due,
    timestamp: new Date().toISOString()
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  // TODO: Update subscription status in database
  // await updateSubscriptionStatus(subscription.id, 'canceled');
  
  // TODO: Downgrade user to free plan
  // await downgradeUserToFree(subscription.metadata?.userId);

  // Log telemetry
  console.log('Subscription deleted:', {
    event: 'subscription_deleted',
    subscriptionId: subscription.id,
    timestamp: new Date().toISOString()
  });
}
