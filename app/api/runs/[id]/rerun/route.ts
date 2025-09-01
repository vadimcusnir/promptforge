import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

// Rate limiting: 5 reruns per minute per user
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // 500 unique users per interval
})

const RerunSchema = z.object({
  id: z.string().uuid(),
  prompt: z.string().min(1).max(10000).optional(),
  metadata: z.record(z.any()).optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate limiting
    const ip = request.ip ?? '127.0.0.1'
    const { success } = await limiter.check(5, ip) // 5 reruns per minute
    if (!success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before rerunning.' },
        { status: 429 }
      )
    }

    // Validate run ID
    const { id } = RerunSchema.pick({ id: true }).parse(params)

    // Parse request body
    const body = await request.json()
    const { prompt, metadata } = RerunSchema.omit({ id: true }).parse(body)

    // Get user from Supabase
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch original run with RLS
    const { data: originalRun, error: fetchError } = await supabase
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
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id) // RLS: Only user's own runs
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Run not found' },
          { status: 404 }
        )
      }
      console.error('Database error:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch original run' },
        { status: 500 }
      )
    }

    // Use provided prompt or original prompt
    const runPrompt = prompt || originalRun.prompt
    const runMetadata = { ...originalRun.metadata, ...metadata }

    // Create new run based on original
    const { data: newRun, error: createError } = await supabase
      .from('runs')
      .insert({
        prompt: runPrompt,
        module_id: originalRun.module_id,
        user_id: user.id,
        metadata: runMetadata,
        status: 'pending',
        parent_run_id: originalRun.id // Track that this is a rerun
      })
      .select(`
        id,
        prompt,
        created_at,
        status,
        user_id,
        module_id,
        parent_run_id,
        modules!inner(
          id,
          name,
          category
        )
      `)
      .single()

    if (createError) {
      console.error('Database error:', createError)
      return NextResponse.json(
        { error: 'Failed to create rerun' },
        { status: 500 }
      )
    }

    // TODO: Trigger actual prompt execution (this would be async)
    // For now, we'll simulate a successful run with some variation
    const simulatedResult = {
      response: `This is a simulated rerun response. Original score: ${originalRun.score.toFixed(1)}. This response includes variations based on the prompt.`,
      score: Math.max(0, Math.min(100, originalRun.score + (Math.random() - 0.5) * 20)), // ±10 points variation
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
      .eq('id', newRun.id)
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
        parent_run_id,
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
        { error: 'Failed to update rerun' },
        { status: 500 }
      )
    }

    // Log rerun event for analytics
    console.log('Run rerun:', {
      event: 'run_rerun',
      user_id: user.id,
      original_run_id: originalRun.id,
      new_run_id: updatedRun.id,
      original_score: originalRun.score,
      new_score: updatedRun.score,
      timestamp: new Date().toISOString()
    })

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
          module_category: updatedRun.modules?.category || 'Unknown',
          parent_run_id: updatedRun.parent_run_id
        },
        original_run: {
          id: originalRun.id,
          score: originalRun.score
        }
      }
    })

  } catch (error) {
    console.error('API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
