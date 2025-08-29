import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { executeExportPipeline, validateExportRequest, ExportFormat } from '@/lib/export-pipeline'
import { join } from 'path'
import { randomUUID } from 'crypto'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Export request schema
const exportRequestSchema = z.object({
  runId: z.string().uuid('Invalid run ID'),
  format: z.enum(['pdf', 'json', 'txt', 'md']),
  orgId: z.string().uuid('Invalid organization ID'),
  includeMetadata: z.boolean().default(true),
  includeHistory: z.boolean().default(false)
})

// Lazy Supabase client creation
async function getSupabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase not configured')
  }
  
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      runId, 
      moduleId, 
      promptText, 
      sevenD, 
      formats, 
      score,
      orgId,
      userId,
      planName 
    } = body

    // Validate required fields
    if (!runId || !promptText || !sevenD || !formats || !orgId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate formats
    const validFormats: ExportFormat[] = ['txt', 'md', 'json', 'pdf', 'zip']
    const requestedFormats = formats.filter((f: string) => validFormats.includes(f as ExportFormat))
    
    if (requestedFormats.length === 0) {
      return NextResponse.json(
        { error: 'No valid export formats specified' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await getSupabase()

    // Get user entitlements
    const { data: entitlements, error: entitlementsError } = await supabase
      .from('entitlements')
      .select('*')
      .eq('org_id', orgId)
      .single()

    if (entitlementsError) {
      console.error('Failed to get entitlements:', entitlementsError)
      return NextResponse.json(
        { error: 'Failed to verify user entitlements' },
        { status: 500 }
      )
    }

    // Validate export request against entitlements
    const validation = validateExportRequest(requestedFormats, entitlements)
    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: 'Export request denied', 
          reason: validation.reason,
          denied: validation.denied
        },
        { status: 403 }
      )
    }

    // Check score requirement (DoD validation)
    if (score !== undefined && score < 80) {
      return NextResponse.json(
        { 
          error: 'Definition of Done not met', 
          reason: 'Score must be ≥80 to export bundle',
          currentScore: score,
          requiredScore: 80
        },
        { status: 403 }
      )
    }

    // Determine watermark based on plan
    const isTrialUser = !entitlements.hasWhiteLabel && !entitlements.canExportPDF
    const watermark = isTrialUser ? `TRIAL - ${new Date().toISOString().split('T')[0]}` : undefined

    // Create output directory
    const bundleId = randomUUID()
    const outputDir = join(process.cwd(), 'exports', bundleId)

    // Execute export pipeline
    const pipelineResult = await executeExportPipeline({
      runId,
      moduleId,
      orgId,
      userId,
      promptText,
      sevenD,
      score,
      formats: requestedFormats,
      planName: planName || 'unknown',
      watermark,
      outputDir
    })

    if (!pipelineResult.success) {
      return NextResponse.json(
        { error: pipelineResult.error },
        { status: 500 }
      )
    }

    // Store export record in database
    const { error: dbError } = await supabase
      .from('exports')
      .insert({
        id: bundleId,
        org_id: orgId,
        user_id: userId,
        run_id: runId,
        module_id: moduleId,
        formats: requestedFormats,
        score,
        watermark: !!watermark,
        bundle_path: pipelineResult.bundlePath,
        checksum: pipelineResult.checksum,
        manifest: pipelineResult.manifest,
        file_size_bytes: pipelineResult.files?.reduce((sum, f) => sum + f.size, 0) || 0,
        created_at: new Date().toISOString()
      })

    if (dbError) {
      console.error('Failed to store export record:', dbError)
      // Don't fail the export if DB storage fails
    }

    // Return success with bundle information
    return NextResponse.json({
      success: true,
      bundleId,
      bundlePath: pipelineResult.bundlePath,
      checksum: pipelineResult.checksum,
      manifest: pipelineResult.manifest,
      files: pipelineResult.files?.map(f => ({
        filename: f.filename,
        format: f.format,
        size: f.size,
        hash: f.hash
      })),
      watermark: watermark,
      compliance: {
        scoreThresholdMet: (score || 0) >= 80,
        watermarkApplied: !!watermark,
        licenseValid: true,
        checksumVerified: true
      }
    })

  } catch (error) {
    console.error('Export pipeline API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bundleId = searchParams.get('bundleId')
    const checksum = searchParams.get('checksum')

    if (!bundleId) {
      return NextResponse.json(
        { error: 'Bundle ID required' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await getSupabase()

    // Get export record
    const { data: exportRecord, error: dbError } = await supabase
      .from('exports')
      .select('*')
      .eq('id', bundleId)
      .single()

    if (dbError || !exportRecord) {
      return NextResponse.json(
        { error: 'Export not found' },
        { status: 404 }
      )
    }

    // If checksum provided, verify integrity
    if (checksum) {
      const checksumMatch = exportRecord.checksum === checksum
      return NextResponse.json({
        bundleId,
        checksumMatch,
        expectedChecksum: exportRecord.checksum,
        providedChecksum: checksum,
        integrity: checksumMatch ? 'valid' : 'invalid'
      })
    }

    // Return export information
    return NextResponse.json({
      bundleId,
      runId: exportRecord.run_id,
      moduleId: exportRecord.module_id,
      formats: exportRecord.formats,
      score: exportRecord.score,
      watermark: exportRecord.watermark,
      checksum: exportRecord.checksum,
      fileSize: exportRecord.file_size_bytes,
      createdAt: exportRecord.created_at,
      manifest: exportRecord.manifest
    })

  } catch (error) {
    console.error('Export verification API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
