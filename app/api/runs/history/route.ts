import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth'
import { validateOrgMembership } from '@/lib/auth'
import { getEffectiveEntitlements } from '@/lib/entitlements'

// Force dynamic rendering and prevent static generation
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'

// Query schema
const querySchema = z.object({
  orgId: z.string().uuid(),
  module: z.string().optional(),
  domain: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  status: z.string().optional(),
  limit: z.string().transform(val => parseInt(val, 10)).optional(),
  offset: z.string().transform(val => parseInt(val, 10)).optional()
})

export async function GET(request: NextRequest) {
  try {
    // Validate authentication
    const user = await requireAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url)
    const query = Object.fromEntries(searchParams.entries())
    const validation = querySchema.safeParse(query)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validation.error },
        { status: 400 }
      )
    }

    const { orgId, module, domain, dateFrom, dateTo, status, limit = 100, offset = 0 } = validation.data

    // Validate organization membership
    await validateOrgMembership(user.id, orgId)

    // Check cloud history entitlement
    const entitlements = await getEffectiveEntitlements(user.id, orgId)
    if (!entitlements.features.canExportHistory) {
      return NextResponse.json(
        { 
          error: 'ENTITLEMENT_REQUIRED',
          message: 'Cloud history requires Pro plan or higher',
          upsell: 'pro_needed',
          code: 'CLOUD_HISTORY_REQUIRED'
        },
        { status: 403 }
      )
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Build query for runs with prompt history
    let queryBuilder = supabase
      .from('runs')
      .select(`
        id,
        org_id,
        user_id,
        module_id,
        parameter_set_id,
        status,
        started_at,
        completed_at,
        duration_ms,
        input_data,
        output_data,
        error_message,
        metadata,
        created_at,
        updated_at,
        modules!inner(
          id,
          name,
          description,
          domain
        ),
        parameter_sets!inner(
          id,
          domain,
          scale,
          urgency,
          complexity,
          resources,
          application,
          output_format
        ),
        prompt_history!inner(
          id,
          prompt_text,
          prompt_hash,
          seven_d_params
        )
      `)
      .eq('org_id', orgId)
      .order('started_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (module) {
      queryBuilder = queryBuilder.ilike('modules.name', `%${module}%`)
    }

    if (domain) {
      queryBuilder = queryBuilder.eq('parameter_sets.domain', domain)
    }

    if (dateFrom) {
      queryBuilder = queryBuilder.gte('started_at', dateFrom)
    }

    if (dateTo) {
      queryBuilder = queryBuilder.lte('started_at', dateTo)
    }

    if (status) {
      queryBuilder = queryBuilder.eq('status', status)
    }

    // Execute query
    const { data: runs, error, count } = await queryBuilder

    if (error) {
      console.error('Error fetching run history:', error)
      return NextResponse.json(
        { error: 'Failed to fetch run history' },
        { status: 500 }
      )
    }

    // Transform data to match frontend interface
    const transformedRuns = runs?.map(run => ({
      id: run.id,
      runId: run.id,
      moduleId: run.module_id,
      moduleName: run.modules?.[0]?.name || 'Unknown Module',
              domain: run.parameter_sets?.[0]?.domain || 'unknown',
        scale: run.parameter_sets?.[0]?.scale || 'unknown',
        urgency: run.parameter_sets?.[0]?.urgency || 'unknown',
        complexity: run.parameter_sets?.[0]?.complexity || 'unknown',
        resources: run.parameter_sets?.[0]?.resources || 'unknown',
        application: run.parameter_sets?.[0]?.application || 'unknown',
        outputFormat: run.parameter_sets?.[0]?.output_format || 'unknown',
              promptText: run.prompt_history?.[0]?.prompt_text || '',
      outputText: run.output_data?.output || run.output_data?.result || '',
      score: run.output_data?.score,
      status: run.status,
      startedAt: run.started_at,
      completedAt: run.completed_at,
      durationMs: run.duration_ms,
      metadata: run.metadata || {}
    })) || []

    return NextResponse.json({
      runs: transformedRuns,
      total: count || transformedRuns.length,
      limit,
      offset,
      hasMore: transformedRuns.length === limit
    })

  } catch (error) {
    console.error('Run history API error:', error)
    
    if (error instanceof Error && error.message.includes('ENTITLEMENT_REQUIRED')) {
      return NextResponse.json(
        { 
          error: 'ENTITLEMENT_REQUIRED',
          message: 'Cloud history requires Pro plan or higher',
          upsell: 'pro_needed'
        },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
