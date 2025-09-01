import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const RunIdSchema = z.object({
  id: z.string().uuid()
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate run ID
    const { id } = RunIdSchema.parse(params)

    // Get user from Supabase
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch run with RLS
    const { data: run, error } = await supabase
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
          category,
          description
        ),
        profiles!inner(
          id,
          full_name,
          email
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id) // RLS: Only user's own runs
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Run not found' },
          { status: 404 }
        )
      }
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch run' },
        { status: 500 }
      )
    }

    // Transform data for frontend
    const transformedRun = {
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
      module_category: run.modules?.category || 'Unknown',
      module_description: run.modules?.description || ''
    }

    return NextResponse.json({
      success: true,
      data: { run: transformedRun }
    })

  } catch (error) {
    console.error('API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid run ID', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate run ID
    const { id } = RunIdSchema.parse(params)

    // Get user from Supabase
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Delete run with RLS
    const { error } = await supabase
      .from('runs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // RLS: Only user's own runs

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to delete run' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Run deleted successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid run ID', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
