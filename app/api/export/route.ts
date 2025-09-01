import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'


// Rate limiting: 10 exports per minute per user
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // 500 unique users per interval
})

const ExportSchema = z.object({
  format: z.enum(['pdf', 'json', 'zip']),
  run_ids: z.array(z.string().uuid()).min(1).max(50), // Max 50 runs per export
  include_metadata: z.boolean().optional().default(true),
  include_prompts: z.boolean().optional().default(true),
  include_responses: z.boolean().optional().default(true),
  watermark: z.boolean().optional().default(false),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip ?? '127.0.0.1'
    const { success } = await limiter.check(10, ip) // 10 exports per minute
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before exporting again.' },
        { status: 429 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { format, run_ids, include_metadata, include_prompts, include_responses, watermark } = ExportSchema.parse(body)

    // Get user from Supabase
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check user entitlements
    const { data: entitlements, error: entitlementsError } = await supabase
      .from('user_entitlements')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (entitlementsError || !entitlements) {
      return NextResponse.json(
        { error: 'Failed to check user entitlements' },
        { status: 500 }
      )
    }

    // Check if user can export in the requested format
    const canExport = 
      (format === 'pdf' && entitlements.canExportPDF) ||
      (format === 'json' && entitlements.canExportJSON) ||
      (format === 'zip' && entitlements.canExportBundleZip)

    if (!canExport) {
      return NextResponse.json(
        { 
          error: 'Export not available',
          code: 'ENTITLEMENT_REQUIRED',
          required_plan: format === 'pdf' ? 'creator' : 'pro',
          current_plan: entitlements.plan_code
        },
        { status: 403 }
      )
    }

    // Fetch runs with RLS
    const { data: runs, error: runsError } = await supabase
      .from('runs')
      .select(`
        id,
        prompt,
        response,
        score,
        created_at,
        updated_at,
        duration_ms,
        status,
        error_message,
        metadata,
        user_id,
        module_id,
        modules!inner(
          id,
          name,
          category
        ),
        profiles!inner(
          id,
          full_name,
          email
        )
      `)
      .in('id', run_ids)
      .eq('user_id', user.id) // RLS: Only user's own runs
      .order('created_at', { ascending: false })

    if (runsError) {
      console.error('Database error:', runsError)
      return NextResponse.json(
        { error: 'Failed to fetch runs for export' },
        { status: 500 }
      )
    }

    if (!runs || runs.length === 0) {
      return NextResponse.json(
        { error: 'No runs found for export' },
        { status: 404 }
      )
    }

    // Check if all runs meet the score requirement (≥80 for exports)
    const lowScoreRuns = runs.filter(run => run.score < 80)
    if (lowScoreRuns.length > 0) {
      return NextResponse.json(
        { 
          error: 'Export blocked: Some runs have scores below 80',
          code: 'SCORE_TOO_LOW',
          low_score_runs: lowScoreRuns.map(run => ({
            id: run.id,
            score: run.score
          })),
          required_score: 80
        },
        { status: 403 }
      )
    }

    // Generate export data
    const exportData = {
      metadata: {
        exported_at: new Date().toISOString(),
        exported_by: user.id,
        format,
        run_count: runs.length,
        watermark: watermark || entitlements.watermark,
        version: '1.0'
      },
      runs: runs.map(run => ({
        id: run.id,
        prompt: include_prompts ? run.prompt : undefined,
        response: include_responses ? run.response : undefined,
        score: run.score,
        created_at: run.created_at,
        updated_at: run.updated_at,
        duration_ms: run.duration_ms,
        status: run.status,
        error_message: run.error_message,
        metadata: include_metadata ? run.metadata : undefined,
        module: {
          id: run.module_id,
          name: run.modules?.name,
          category: run.modules?.category
        },
        user: {
          id: run.user_id,
          name: run.profiles?.full_name || run.profiles?.email
        }
      }))
    }

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0]
    const filename = `promptforge-export-${timestamp}-${runs.length}runs.${format}`

    // For now, return the data as JSON (in production, you'd generate actual files)
    // In a real implementation, you would:
    // 1. Generate PDF using a library like puppeteer or jsPDF
    // 2. Create ZIP files using a library like jszip
    // 3. Store files in cloud storage (S3, etc.)
    // 4. Return signed download URLs

    let responseData: any
    let contentType: string

    switch (format) {
      case 'json':
        responseData = JSON.stringify(exportData, null, 2)
        contentType = 'application/json'
        break
      case 'pdf':
        // In production, generate actual PDF
        responseData = JSON.stringify({
          message: 'PDF export would be generated here',
          data: exportData,
          filename
        }, null, 2)
        contentType = 'application/json'
        break
      case 'zip':
        // In production, generate actual ZIP
        responseData = JSON.stringify({
          message: 'ZIP export would be generated here',
          data: exportData,
          filename
        }, null, 2)
        contentType = 'application/json'
        break
      default:
        throw new Error('Unsupported export format')
    }

    // Log export event for analytics
    console.log('Export completed:', {
      event: 'export_completed',
      user_id: user.id,
      format,
      run_count: runs.length,
      watermark: watermark || entitlements.watermark,
      timestamp: new Date().toISOString()
    })

    // Return the export data
    return new NextResponse(responseData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Export-Metadata': JSON.stringify({
          format,
          run_count: runs.length,
          watermark: watermark || entitlements.watermark,
          exported_at: new Date().toISOString()
        })
      }
    })

  } catch (error) {
    console.error('Export API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid export request', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}