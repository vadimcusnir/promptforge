import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const errorData = await request.json()
    
    // Validate required fields
    if (!errorData.error || !errorData.timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Log error for monitoring
    console.error('Client Error Report:', {
      message: errorData.error,
      stack: errorData.stack,
      componentStack: errorData.componentStack,
      errorId: errorData.errorId,
      segment: errorData.segment,
      context: errorData.context,
      timestamp: errorData.timestamp,
      userAgent: errorData.userAgent,
      url: errorData.url,
    })

    // In production, you would send this to your error monitoring service
    // Examples: Sentry, LogRocket, Bugsnag, etc.
    
    // For now, we'll just log it and return success
    // You can integrate with your preferred error monitoring service here
    
    return NextResponse.json({ 
      success: true, 
      errorId: errorData.errorId || `ERR_${Date.now()}` 
    })
    
  } catch (error) {
    console.error('Error in error reporting endpoint:', error)
    
    return NextResponse.json(
      { error: 'Failed to process error report' },
      { status: 500 }
    )
  }
}
