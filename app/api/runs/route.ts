import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

// Rate limiting: 100 requests per minute per user
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // 500 unique users per interval
})

const RunsQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  sort: z.enum(['created_at', 'score', 'duration_ms', 'user_name']).optional().default('created_at'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  module: z.string().optional(),
  status: z.enum(['success', 'failed', 'partial']).optional(),
  min_score: z.string().optional(),
  max_score: z.string().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  user_id: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip ?? '127.0.0.1'
    const { success } = await limiter.check(100, ip)
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url)
    const query = RunsQuerySchema.parse(Object.fromEntries(searchParams))
    
    const page = parseInt(query.page)
    const limit = Math.min(parseInt(query.limit), 100) // Max 100 per page
    const offset = (page - 1) * limit

    // Get user from Supabase
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Build query with RLS (Row Level Security)
    let query_builder = supabase
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
      .eq('user_id', user.id) // RLS: Only show user's own runs
      .order(query.sort, { ascending: query.order === 'asc' })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (query.module) {
      query_builder = query_builder.ilike('modules.name', `%${query.module}%`)
    }

    if (query.status) {
      query_builder = query_builder.eq('status', query.status)
    }

    if (query.min_score) {
      query_builder = query_builder.gte('score', parseFloat(query.min_score))
    }

    if (query.max_score) {
      query_builder = query_builder.lte('score', parseFloat(query.max_score))
    }

    if (query.date_from) {
      query_builder = query_builder.gte('created_at', query.date_from)
    }

    if (query.date_to) {
      query_builder = query_builder.lte('created_at', query.date_to)
    }

    if (query.user_id) {
      query_builder = query_builder.eq('user_id', query.user_id)
    }

    // Execute query
    const { data: runs, error, count } = await query_builder

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch runs' },
        { status: 500 }
      )
    }

    // Transform data for frontend
    const transformedRuns = runs?.map(run => ({
      id: run.id,
      prompt: run.prompt,
      response: run.response,
      score: run.score,
      created_at: run.created_at,
      updated_at: run.updated_at,
      duration_ms: run.duration_ms,
      status: run.status,
      error_message: run.error_message,
      metadata: run.metadata,
      user_id: run.user_id,
      user_name: run.profiles?.full_name || run.profiles?.email || 'Unknown',
      module_id: run.module_id,
      module_name: run.modules?.name || 'Unknown',
      module_category: run.modules?.category || 'Unknown'
    })) || []

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('runs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    return NextResponse.json({
      success: true,
      data: {
        runs: transformedRuns,
        pagination: {
          page,
          limit,
          total: totalCount || 0,
          pages: Math.ceil((totalCount || 0) / limit)
        }
      }
    })

  } catch (error) {
    console.error('API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for POST requests (more restrictive)
    const ip = request.ip ?? '127.0.0.1'
    const { success } = await limiter.check(10, ip) // 10 requests per minute
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Get user from Supabase
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const RunCreateSchema = z.object({
      prompt: z.string().min(1).max(10000),
      module_id: z.string().uuid().optional(),
      metadata: z.record(z.any()).optional(),
    })

    const { prompt, module_id, metadata } = RunCreateSchema.parse(body)

    // Create new run
    const { data: run, error } = await supabase
      .from('runs')
      .insert({
        prompt,
        module_id,
        user_id: user.id,
        metadata: metadata || {},
        status: 'pending'
      })
      .select(`
        id,
        prompt,
        created_at,
        status,
        user_id,
        module_id,
        modules!inner(
          id,
          name,
          category
        )
      `)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create run' },
        { status: 500 }
      )
    }

    // TODO: Trigger actual prompt execution (this would be async)
    // For now, we'll simulate a successful run
    const simulatedResult = {
      response: 'This is a simulated response. In production, this would be the actual AI response.',
      score: Math.random() * 100,
      duration_ms: Math.floor(Math.random() * 5000) + 1000,
      status: 'success' as const
    }

    // Update the run with results
    const { data: updatedRun, error: updateError } = await supabase
      .from('runs')
      .update({
        response: simulatedResult.response,
        score: simulatedResult.score,
        duration_ms: simulatedResult.duration_ms,
        status: simulatedResult.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', run.id)
      .select(`
        id,
        prompt,
        response,
        score,
        created_at,
        updated_at,
        duration_ms,
        status,
        metadata,
        user_id,
        module_id,
        modules!inner(
          id,
          name,
          category
        )
      `)
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update run' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        run: {
          id: updatedRun.id,
          prompt: updatedRun.prompt,
          response: updatedRun.response,
          score: updatedRun.score,
          created_at: updatedRun.created_at,
          updated_at: updatedRun.updated_at,
          duration_ms: updatedRun.duration_ms,
          status: updatedRun.status,
          metadata: updatedRun.metadata,
          user_id: updatedRun.user_id,
          module_id: updatedRun.module_id,
          module_name: updatedRun.modules?.name || 'Unknown',
          module_category: updatedRun.modules?.category || 'Unknown'
        }
      }
    })

  } catch (error) {
    console.error('API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
