import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth/server-auth'
import { validateOrgMembership } from '@/lib/billing/entitlements'
import { aiCostTracker } from '@/lib/ai-cost-tracking'

const analyticsRequestSchema = z.object({
  orgId: z.string().uuid('Valid organization ID required'),
  days: z.number().min(1).max(365).default(30),
  type: z.enum(['org', 'user']).default('org')
})

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(request)
    
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId')
    const days = parseInt(searchParams.get('days') || '30')
    const type = searchParams.get('type') || 'org'
    
    // Validate request
    const validation = analyticsRequestSchema.safeParse({
      orgId,
      days,
      type
    })
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request parameters', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { orgId: validOrgId, days: validDays, type: validType } = validation.data

    // Validate organization membership
    const isMember = await validateOrgMembership(user.id, validOrgId)
    if (!isMember) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Access denied to organization',
          code: 'ACCESS_DENIED'
        },
        { status: 403 }
      )
    }

    // Get analytics data
    let analytics
    if (validType === 'org') {
      analytics = await aiCostTracker.getOrgUsageStats(validOrgId, validDays)
    } else {
      analytics = await aiCostTracker.getUserUsageStats(user.id, validDays)
    }

    return NextResponse.json({
      success: true,
      analytics: {
        ...analytics,
        period: {
          days: validDays,
          startDate: new Date(Date.now() - validDays * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString()
        },
        type: validType
      }
    })

  } catch (error) {
    console.error('AI Analytics API error:', error)
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(request)
    
    // Parse request body
    const body = await request.json()
    const { orgId, days = 30, type = 'org' } = body
    
    // Validate request
    const validation = analyticsRequestSchema.safeParse({
      orgId,
      days,
      type
    })
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { orgId: validOrgId, days: validDays, type: validType } = validation.data

    // Validate organization membership
    const isMember = await validateOrgMembership(user.id, validOrgId)
    if (!isMember) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Access denied to organization',
          code: 'ACCESS_DENIED'
        },
        { status: 403 }
      )
    }

    // Get analytics data
    let analytics
    if (validType === 'org') {
      analytics = await aiCostTracker.getOrgUsageStats(validOrgId, validDays)
    } else {
      analytics = await aiCostTracker.getUserUsageStats(user.id, validDays)
    }

    return NextResponse.json({
      success: true,
      analytics: {
        ...analytics,
        period: {
          days: validDays,
          startDate: new Date(Date.now() - validDays * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date().toISOString()
        },
        type: validType
      }
    })

  } catch (error) {
    console.error('AI Analytics API error:', error)
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
