import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, title, timestamp, referrer } = body

    // Validate required fields
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Create Supabase client with anon key for client requests
    // Service role should only be used for server-side operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Store pageview in analytics table
    const { error: insertError } = await supabase
      .from('analytics_pageviews')
      .insert({
        url,
        title: title || '',
        timestamp: timestamp || new Date().toISOString(),
        referrer: referrer || '',
        session_id: request.headers.get('x-session-id') || null,
        user_agent: request.headers.get('user-agent') || null,
        ip_address: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || null
      })

    if (insertError) {
      console.error('Failed to insert pageview:', insertError)
      // Don't fail the request if analytics storage fails
    }

    // Forward to external analytics services if configured
    if (process.env.MIXPANEL_TOKEN) {
      try {
        await fetch('https://api.mixpanel.com/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'Page View',
            properties: {
              token: process.env.MIXPANEL_TOKEN,
              time: timestamp || Date.now(),
              url,
              title: title || '',
              referrer: referrer || '',
              distinct_id: 'anonymous'
            }
          })
        })
      } catch (error) {
        console.warn('Failed to forward pageview to Mixpanel:', error)
      }
    }

    // Return success
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Pageview tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
