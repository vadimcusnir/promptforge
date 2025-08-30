import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Event tracking schema
const eventSchema = z.object({
  event: z.string().min(1, 'Event name is required'),
  properties: z.record(z.any()).optional(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  timestamp: z.number().optional()
})

// Lazy Supabase client creation
async function getSupabase() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // Return mock client for build-time operations
    return {
      from: () => ({
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, properties, timestamp, url, userId } = body

    // Validate required fields
    if (!event) {
      return NextResponse.json(
        { error: 'Event name is required' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await getSupabase()

    // Store event in analytics table
    const { error: insertError } = await supabase
      .from('analytics_events')
      .insert({
        event_name: event,
        properties: properties || {},
        timestamp: timestamp || new Date().toISOString(),
        url: url || '',
        user_id: userId || null,
        session_id: request.headers.get('x-session-id') || null,
        user_agent: request.headers.get('user-agent') || null,
        ip_address: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || null
      })

    if (insertError) {
      console.error('Failed to insert analytics event:', insertError)
      // Don't fail the request if analytics storage fails
    }

    // Forward to external analytics services if configured
    if (process.env.MIXPANEL_TOKEN) {
      try {
        await fetch('https://api.mixpanel.com/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event,
            properties: {
              ...properties,
              token: process.env.MIXPANEL_TOKEN,
              time: timestamp || Date.now(),
              distinct_id: userId || 'anonymous'
            }
          })
        })
      } catch (error) {
        console.warn('Failed to forward to Mixpanel:', error)
      }
    }

    // Return success
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
