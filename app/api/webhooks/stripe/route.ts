import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { z } from 'zod'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Lazy Supabase client creation
async function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // Return mock client for build-time operations
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: null })
          })
        }),
        insert: () => Promise.resolve({ error: null })
      })
    } as any
  }
  
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil'
})

// Initialize Supabase - will be created when needed

// Webhook event schema
const webhookEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.any()
  }),
  created: z.number()
})

// Subscription schema for upsert
const subscriptionSchema = z.object({
  id: z.string(),
  org_id: z.string().uuid(),
  stripe_customer_id: z.string(),
  stripe_subscription_id: z.string(),
  plan_code: z.enum(['pilot', 'pro', 'enterprise']),
  status: z.enum(['active', 'canceled', 'paused', 'past_due', 'unpaid']),
  seats: z.number().min(1),
  trial_end: z.string().nullable(),
  current_period_start: z.string(),
  current_period_end: z.string(),
  created_at: z.string(),
  updated_at: z.string()
})

export async function POST(request: NextRequest) {
  // Initialize Supabase client
  const supabase = await getSupabase()
  
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('❌ Missing Stripe signature')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('❌ Invalid signature:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Validate event structure
    const validation = webhookEventSchema.safeParse(event)
    if (!validation.success) {
      console.error('❌ Invalid event structure:', validation.error)
      return NextResponse.json(
        { error: 'Invalid event structure' },
        { status: 400 }
      )
    }

    console.log(`📨 Processing Stripe webhook: ${event.type} (ID: ${event.id})`)

    // Check idempotency - prevent duplicate processing
    const { data: existingEvent } = await supabase
      .from('webhook_events')
      .select('id')
      .eq('stripe_event_id', event.id)
      .single()

    if (existingEvent) {
      console.log(`✅ Event ${event.id} already processed, skipping`)
      return NextResponse.json({ received: true })
    }

    // Process webhook based on event type
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, supabase)
        break
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription, supabase)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, supabase)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, supabase)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice, supabase)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice, supabase)
        break
      
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`)
    }

    // Record webhook event for idempotency
    await supabase
      .from('webhook_events')
      .insert({
        stripe_event_id: event.id,
        event_type: event.type,
        processed_at: new Date().toISOString(),
        status: 'success'
      })

    console.log(`✅ Successfully processed webhook: ${event.type}`)
    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('💥 Webhook processing error:', error)
    
    // Record failed webhook event
    try {
      await supabase
        .from('webhook_events')
        .insert({
          stripe_event_id: 'unknown',
          event_type: 'error',
          processed_at: new Date().toISOString(),
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        })
    } catch (dbError) {
      console.error('Failed to record webhook error:', dbError)
    }
    
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Handle checkout completion
async function handleCheckoutCompleted(session: Stripe.Checkout.Session, supabase: any) {
  console.log(`🛒 Processing checkout completion for session ${session.id}`)
  
  if (!session.subscription || !session.customer) {
    console.log('⚠️ Session missing subscription or customer')
    return
  }

  const subscription = await stripe.subscriptions.retrieve(
    typeof session.subscription === 'string' ? session.subscription : session.subscription.id
  )
  
  const customerId = typeof session.customer === 'string' ? session.customer : session.customer.id
  await processSubscription(subscription, customerId, supabase)
}

// Handle subscription creation
async function handleSubscriptionCreated(subscription: Stripe.Subscription, supabase: any) {
  console.log(`🆕 Processing subscription creation: ${subscription.id}`)
  
  if (typeof subscription.customer === 'string') {
    await processSubscription(subscription, subscription.customer, supabase)
  } else {
    await processSubscription(subscription, subscription.customer.id, supabase)
  }
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription: Stripe.Subscription, supabase: any) {
  console.log(`🔄 Processing subscription update: ${subscription.id}`)
  
  if (typeof subscription.customer === 'string') {
    await processSubscription(subscription, subscription.customer, supabase)
  } else {
    await processSubscription(subscription, subscription.customer.id, supabase)
  }
}

// Handle subscription deletion
async function handleSubscriptionDeleted(subscription: Stripe.Subscription, supabase: any) {
  console.log(`🗑️ Processing subscription deletion: ${subscription.id}`)
  
  // Update subscription status to canceled
  await supabase
    .from('subscriptions')
    .update({ 
      status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)
  
  // Apply pilot plan entitlements (downgrade to free)
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('org_id')
    .eq('stripe_subscription_id', subscription.id)
    .single()
  
  if (sub?.org_id) {
    await applyPlanEntitlements(sub.org_id, 'pilot', supabase)
    console.log(`✅ Downgraded org ${sub.org_id} to pilot plan`)
  }
}

// Handle successful payment
async function handlePaymentSucceeded(invoice: Stripe.Invoice, supabase: any) {
  console.log(`💳 Processing successful payment for invoice ${invoice.id}`)
  
  // Check if invoice has subscription ID
  const subscriptionId = (invoice as any).subscription
  if (subscriptionId && typeof subscriptionId === 'string') {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    
    if (typeof subscription.customer === 'string') {
      await processSubscription(subscription, subscription.customer, supabase)
    } else {
      await processSubscription(subscription, subscription.customer.id, supabase)
    }
  }
}

// Handle failed payment
async function handlePaymentFailed(invoice: Stripe.Invoice, supabase: any) {
  console.log(`❌ Processing failed payment for invoice ${invoice.id}`)
  
  // Check if invoice has subscription ID
  const subscriptionId = (invoice as any).subscription
  if (subscriptionId && typeof subscriptionId === 'string') {
    // Update subscription status to past_due
    await supabase
      .from('subscriptions')
      .update({ 
        status: 'past_due',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscriptionId)
  }
}

// Process subscription and apply entitlements
async function processSubscription(subscription: Stripe.Subscription, customerId: string, supabase: any) {
  try {
    // Get plan code from subscription
    const planCode = await getPlanCodeFromSubscription(subscription)
    if (!planCode) {
      console.error('❌ Could not determine plan code from subscription')
      return
    }

    // Get organization ID from customer metadata
    const customer = await stripe.customers.retrieve(customerId)
    if (customer.deleted) {
      console.error('❌ Customer deleted')
      return
    }

    const orgId = customer.metadata?.org_id
    if (!orgId) {
      console.error('❌ Customer missing org_id metadata')
      return
    }

    console.log(`🔧 Processing subscription for org ${orgId}, plan: ${planCode}`)

    // Prepare subscription data
    const subscriptionData = {
      id: subscription.id,
      org_id: orgId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      plan_code: planCode,
      status: subscription.status,
      seats: subscription.items.data[0]?.quantity || 1,
      trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
      current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
      current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Validate subscription data
    const validation = subscriptionSchema.safeParse(subscriptionData)
    if (!validation.success) {
      console.error('❌ Invalid subscription data:', validation.error)
      return
    }

    // Upsert subscription
    const { error: upsertError } = await supabase
      .from('subscriptions')
      .upsert(subscriptionData, { onConflict: 'id' })

    if (upsertError) {
      console.error('❌ Failed to upsert subscription:', upsertError)
      return
    }

    console.log(`✅ Subscription upserted successfully for org ${orgId}`)

    // Apply plan entitlements using RPC function
    await applyPlanEntitlements(orgId, planCode, supabase)
    
    console.log(`✅ Entitlements applied for org ${orgId}, plan: ${planCode}`)

  } catch (error) {
    console.error('❌ Error processing subscription:', error)
    throw error
  }
}

// Get plan code from subscription
async function getPlanCodeFromSubscription(subscription: Stripe.Subscription): Promise<string | null> {
  try {
    const price = subscription.items.data[0]?.price
    if (!price) return null

    const product = await stripe.products.retrieve(
      typeof price.product === 'string' ? price.product : price.product.id
    )
    
    const planCode = product.metadata?.plan_code
    if (planCode && ['pilot', 'pro', 'enterprise'].includes(planCode)) {
      return planCode
    }

    // Fallback: try to determine from price lookup_key
    if (price.lookup_key) {
      const lookupKey = price.lookup_key.toLowerCase()
      if (lookupKey.includes('pilot')) return 'pilot'
      if (lookupKey.includes('pro')) return 'pro'
      if (lookupKey.includes('enterprise')) return 'enterprise'
    }

    console.warn(`⚠️ Could not determine plan code for subscription ${subscription.id}`)
    return null

  } catch (error) {
    console.error('❌ Error getting plan code from subscription:', error)
    return null
  }
}

// Apply plan entitlements using RPC function
async function applyPlanEntitlements(orgId: string, planCode: string, supabase: any): Promise<void> {
  try {
    console.log(`🔧 Applying entitlements for org ${orgId}, plan: ${planCode}`)
    
    const { error } = await supabase.rpc('pf_apply_plan_entitlements', {
      p_org_id: orgId,
      p_plan_code: planCode
    })
    
    if (error) {
      console.error('❌ Error calling pf_apply_plan_entitlements:', error)
      throw new Error(`Failed to apply plan entitlements: ${error.message}`)
    }
    
    console.log(`✅ Entitlements applied successfully for org ${orgId}, plan: ${planCode}`)
  } catch (error) {
    console.error('❌ Error applying plan entitlements:', error)
    throw error
  }
}
