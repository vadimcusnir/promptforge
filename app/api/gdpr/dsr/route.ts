import { NextRequest, NextResponse } from 'next/server'
import { gdprCompliance } from '@/lib/compliance/gdpr'
import { z } from 'zod'

// DSR request validation schema
const DSRRequestSchema = z.object({
  userId: z.string().uuid(),
  requestType: z.enum(['export', 'rectification', 'erasure', 'restriction', 'portability']),
  description: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request schema
    const validation = DSRRequestSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validation.error.errors
        },
        { status: 400 }
      )
    }

    const { userId, requestType, description } = validation.data

    // Create DSR request
    const requestId = await gdprCompliance.createDSRRequest(
      userId,
      requestType,
      description
    )

    return NextResponse.json({
      requestId,
      status: 'pending',
      message: 'DSR request created successfully. You will receive a response within 7 days.',
      estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    })

  } catch (error) {
    console.error('DSR request creation failed:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to create DSR request'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const requestId = url.searchParams.get('requestId')
    const userId = url.searchParams.get('userId')

    if (requestId) {
      // Get specific DSR request status
      const dsrRequest = await gdprCompliance.getDSRRequestStatus(requestId)
      
      if (!dsrRequest) {
        return NextResponse.json(
          { error: 'DSR request not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(dsrRequest)
    } else if (userId) {
      // Get all DSR requests for user (admin only)
      const pendingRequests = await gdprCompliance.getPendingDSRRequests()
      const userRequests = pendingRequests.filter(req => req.user_id === userId)
      
      return NextResponse.json({
        requests: userRequests,
        total: userRequests.length
      })
    } else {
      return NextResponse.json(
        { error: 'requestId or userId parameter required' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('DSR request query failed:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to query DSR requests'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { requestId, status, responseData, rejectionReason } = body

    if (!requestId || !status) {
      return NextResponse.json(
        { error: 'requestId and status are required' },
        { status: 400 }
      )
    }

    // Update DSR request status (admin only)
    await gdprCompliance.updateDSRRequestStatus(
      requestId,
      status,
      responseData,
      rejectionReason
    )

    return NextResponse.json({
      message: 'DSR request status updated successfully',
      requestId,
      status
    })

  } catch (error) {
    console.error('DSR request update failed:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to update DSR request'
      },
      { status: 500 }
    )
  }
}
