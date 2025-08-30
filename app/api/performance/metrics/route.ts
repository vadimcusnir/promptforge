import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const metricData = await request.json()
    
    // Validate required fields
    if (!metricData.name || typeof metricData.value !== 'number') {
      return NextResponse.json(
        { error: 'Missing required fields: name and value' },
        { status: 400 }
      )
    }

    // Log performance metric
    console.log('Performance Metric:', {
      name: metricData.name,
      value: metricData.value,
      timestamp: metricData.timestamp,
      url: metricData.url,
      userAgent: metricData.userAgent,
    })

    // In production, you would send this to your analytics/monitoring service
    // Examples: Google Analytics, Mixpanel, DataDog, New Relic, etc.
    
    // For now, we'll just log it and return success
    // You can integrate with your preferred analytics service here
    
    return NextResponse.json({ 
      success: true,
      metric: metricData.name,
      value: metricData.value
    })
    
  } catch (error) {
    console.error('Error in performance metrics endpoint:', error)
    
    return NextResponse.json(
      { error: 'Failed to process performance metric' },
      { status: 500 }
    )
  }
}
