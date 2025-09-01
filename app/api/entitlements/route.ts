import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // TODO: Get user from auth context
    const userId = 'user_123' // Placeholder - replace with actual auth
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'User not authenticated'
      }, { status: 401 })
    }

    // Get user's current subscription and entitlements
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (subError && subError.code !== 'PGRST116') {
      console.error('Error fetching subscription:', subError)
      return NextResponse.json({
        success: false,
        error: 'SUBSCRIPTION_ERROR',
        message: 'Failed to fetch subscription'
      }, { status: 500 })
    }

    // Get user entitlements
    const { data: entitlements, error: entError } = await supabase
      .from('user_entitlements')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (entError && entError.code !== 'PGRST116') {
      console.error('Error fetching entitlements:', entError)
      return NextResponse.json({
        success: false,
        error: 'ENTITLEMENTS_ERROR',
        message: 'Failed to fetch entitlements'
      }, { status: 500 })
    }

    // Default to free plan if no subscription
    const currentPlan = subscription?.plan_code || 'free'
    const isTrial = subscription?.trial_end && new Date(subscription.trial_end) > new Date()
    const hasWatermark = entitlements?.watermark || false

    // Calculate trial expiry
    const trialExpiry = subscription?.trial_end ? new Date(subscription.trial_end) : null
    const daysUntilTrialExpiry = trialExpiry 
      ? Math.ceil((trialExpiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      : null

    return NextResponse.json({
      success: true,
      data: {
        currentPlan,
        isTrial,
        hasWatermark,
        trialExpiry: trialExpiry?.toISOString() || null,
        daysUntilTrialExpiry,
        entitlements: entitlements || {
          canExportMD: true,
          canExportJSON: false,
          canExportPDF: false,
          canExportBundleZip: false,
          canUseGptTestReal: false,
          maxRunsPerDay: 10,
          maxTokensPerRun: 1000,
          canAccessAdvancedModules: false,
          canUseCustomPrompts: true,
          canExportHistory: false
        },
        subscription: subscription ? {
          id: subscription.id,
          status: subscription.status,
          billingCycle: subscription.billing_cycle,
          currentPeriodStart: subscription.current_period_start,
          currentPeriodEnd: subscription.current_period_end
        } : null
      }
    })

  } catch (error) {
    console.error('Entitlements API error:', error)
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Internal server error'
    }, { status: 500 })
  }
}