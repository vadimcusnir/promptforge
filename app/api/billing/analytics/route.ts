import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireAuth } from "@/lib/auth/server-auth"
import { PaymentAnalyticsService } from "@/lib/billing/analytics"
import { RATE_LIMITS } from "@/lib/rate-limit"

// Request validation schema
const analyticsQuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  metric: z.enum(['overview', 'funnel', 'plans', 'churn']).default('overview')
})

// Rate limiting for analytics requests
const analyticsLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20, // 20 requests per minute
  message: 'Rate limit exceeded. Please try again later.'
})

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = analyticsLimiter.check(request)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: rateLimitResult.message || 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    // Require authentication
    const user = await requireAuth(request)
    
    // Get and validate query parameters
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const metric = searchParams.get('metric') || 'overview'
    
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate query parameters are required' },
        { status: 400 }
      )
    }
    
    // Validate query parameters
    const { startDate: validatedStartDate, endDate: validatedEndDate, metric: validatedMetric } = 
      analyticsQuerySchema.parse({ startDate, endDate, metric })
    
    // Initialize analytics service
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const analyticsService = new PaymentAnalyticsService(supabase)
    
    let data: any
    
    // Get requested metric
    switch (validatedMetric) {
      case 'overview':
        data = await analyticsService.getMetrics(validatedStartDate, validatedEndDate)
        break
      case 'funnel':
        data = await analyticsService.getConversionFunnel(validatedStartDate, validatedEndDate)
        break
      case 'plans':
        data = await analyticsService.getPlanPerformance(validatedStartDate, validatedEndDate)
        break
      case 'churn':
        data = await analyticsService.getChurnAnalysis(validatedStartDate, validatedEndDate)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid metric type' },
          { status: 400 }
        )
    }
    
    console.log(`📊 Analytics data retrieved for user ${user.id}, metric: ${validatedMetric}`)
    
    return NextResponse.json({
      success: true,
      metric: validatedMetric,
      startDate: validatedStartDate,
      endDate: validatedEndDate,
      data,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Payment analytics API error:', error)
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to retrieve analytics data' },
      { status: 500 }
    )
  }
}
