import { NextRequest, NextResponse } from 'next/server'
import { exportPolicy } from '@/lib/security/export-policy'
import { telemetry } from '@/lib/observability/telemetry'
import { z } from 'zod'

// Request validation schema
const ExportValidationSchema = z.object({
  orgId: z.string().uuid(),
  userId: z.string().uuid(),
  runId: z.string().uuid(),
  format: z.enum(['txt', 'md', 'json', 'pdf', 'zip']),
  score: z.object({
    overall: z.number().min(0).max(100),
    breakdown: z.record(z.number()).optional()
  }),
  plan: z.enum(['pilot', 'pro', 'enterprise']),
  isTrial: z.boolean(),
  content: z.string().min(1),
  metadata: z.record(z.any()).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request schema
    const validation = ExportValidationSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validation.error.errors
        },
        { status: 400 }
      )
    }

    const exportRequest = validation.data

    // Emit telemetry event
    const traceId = telemetry.generateTraceId()
    await telemetry.emitEvent({
      org_id: exportRequest.orgId,
      user_id: exportRequest.userId,
      event_type: 'export_performed',
      module_id: exportRequest.metadata?.moduleId,
      trace_id: traceId,
      plan: exportRequest.plan,
      status: 'success',
      metadata: {
        format: exportRequest.format,
        score: exportRequest.score.overall,
        isTrial: exportRequest.isTrial
      }
    })

    // Validate against export policy
    const policyResult = await exportPolicy.validateExportRequest(exportRequest)

    if (!policyResult.allowed) {
      // Emit blocked export event
      await telemetry.emitEvent({
        org_id: exportRequest.orgId,
        user_id: exportRequest.userId,
        event_type: 'module_run_blocked',
        trace_id: traceId,
        plan: exportRequest.plan,
        status: 'error',
        metadata: {
          reason: policyResult.reason,
          errorCode: policyResult.errorCode,
          format: exportRequest.format,
          score: exportRequest.score.overall
        }
      })

      return NextResponse.json(
        {
          allowed: false,
          reason: policyResult.reason,
          errorCode: policyResult.errorCode
        },
        { status: 422 }
      )
    }

    // Return successful validation with manifest and watermark
    return NextResponse.json({
      allowed: true,
      manifest: policyResult.manifest,
      watermark: policyResult.watermark,
      traceId
    })

  } catch (error) {
    console.error('Export validation failed:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Export validation failed'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const orgId = url.searchParams.get('orgId')
    const format = url.searchParams.get('format') as 'txt' | 'md' | 'json' | 'pdf' | 'zip'

    if (!orgId) {
      return NextResponse.json(
        { error: 'orgId parameter required' },
        { status: 400 }
      )
    }

    if (format) {
      // Get minimum score for specific format
      const minScore = exportPolicy.getMinimumScore(format)
      return NextResponse.json({
        format,
        minimumScore: minScore,
        allowed: true
      })
    } else {
      // Get export statistics for organization
      const stats = await exportPolicy.getExportStatistics(orgId)
      return NextResponse.json(stats)
    }

  } catch (error) {
    console.error('Export policy query failed:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to query export policy'
      },
      { status: 500 }
    )
  }
}
