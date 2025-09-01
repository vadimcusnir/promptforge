import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, properties, timestamp } = body

    if (!event) {
      return NextResponse.json({
        success: false,
        error: 'MISSING_EVENT',
        message: 'Event name is required'
      }, { status: 400 })
    }

    // TODO: Get user from auth context
    const userId = 'user_123' // Placeholder - replace with actual auth
    const sessionId = request.headers.get('x-session-id') || 'anonymous'

    // Store analytics event
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        user_id: userId,
        session_id: sessionId,
        event_name: event,
        properties: properties || {},
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error storing analytics event:', error)
      // Don't fail the request if analytics storage fails
    }

    // Log important events to console for monitoring
    if (['checkout_started', 'checkout_completed', 'trial_started', 'trial_converted'].includes(event)) {
      console.log('Analytics Event:', {
        event,
        userId,
        sessionId,
        properties,
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully'
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'Failed to track event'
    }, { status: 500 })
  }
}