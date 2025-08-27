import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Query parameters schema
const querySchema = z.object({
  domain: z.string().optional(),
  category: z.string().optional(),
  complexity: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0)
})

// Response schema
const moduleSchema = z.object({
  id: z.string(),
  module_code: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  domain_slug: z.string(),
  complexity: z.string(),
  estimated_time_minutes: z.number(),
  tags: z.array(z.string()),
  template_prompt: z.string(),
  example_output: z.string(),
  best_practices: z.array(z.string()),
  created_at: z.string(),
  updated_at: z.string()
})

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse({
      domain: searchParams.get('domain'),
      category: searchParams.get('category'),
      complexity: searchParams.get('complexity'),
      search: searchParams.get('search'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset')
    })

    // Build query
    let queryBuilder = supabase
      .from('modules')
      .select('*')
      .order('module_code', { ascending: true })

    // Apply filters
    if (query.domain) {
      queryBuilder = queryBuilder.eq('domain_slug', query.domain)
    }

    if (query.category) {
      queryBuilder = queryBuilder.eq('category', query.category)
    }

    if (query.complexity) {
      queryBuilder = queryBuilder.eq('complexity', query.complexity)
    }

    // Apply search
    if (query.search) {
      const searchTerm = query.search.toLowerCase()
      queryBuilder = queryBuilder.or(
        `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`
      )
    }

    // Apply pagination
    queryBuilder = queryBuilder
      .range(query.offset, query.offset + query.limit - 1)

    // Execute query
    const { data: modules, error, count } = await queryBuilder

    if (error) {
      console.error('Error fetching modules:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch modules' },
        { status: 500 }
      )
    }

    // Get total count for pagination
    let totalCount = count
    if (count === null) {
      const { count: total } = await supabase
        .from('modules')
        .select('*', { count: 'exact', head: true })
      totalCount = total
    }

    // Get domain configurations for additional context
    const { data: domains } = await supabase
      .from('domain_configs')
      .select('slug, name, industry')

    const domainMap = domains?.reduce((acc, domain) => {
      acc[domain.slug] = domain
      return acc
    }, {} as Record<string, { slug: string; name: string; industry: string }>) || {}

    // Enrich modules with domain information
    const enrichedModules = modules?.map(module => ({
      ...module,
      domain_info: domainMap[module.domain_slug] || null
    })) || []

    return NextResponse.json({
      success: true,
      data: {
        modules: enrichedModules,
        pagination: {
          total: totalCount || 0,
          limit: query.limit,
          offset: query.offset,
          has_more: (query.offset + query.limit) < (totalCount || 0)
        },
        filters: {
          applied: {
            domain: query.domain,
            category: query.category,
            complexity: query.complexity,
            search: query.search
          }
        }
      }
    })

  } catch (error) {
    console.error('Modules API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get specific module by code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { module_code } = body

    if (!module_code) {
      return NextResponse.json(
        { success: false, error: 'Module code is required' },
        { status: 400 }
      )
    }

    // Fetch specific module
    const { data: module, error } = await supabase
      .from('modules')
      .select('*')
      .eq('module_code', module_code)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Module not found' },
          { status: 404 }
        )
      }
      
      console.error('Error fetching module:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch module' },
        { status: 500 }
      )
    }

    // Get domain configuration
    const { data: domain } = await supabase
      .from('domain_configs')
      .select('*')
      .eq('slug', module.domain_slug)
      .single()

    // Enrich module with domain information
    const enrichedModule = {
      ...module,
      domain_info: domain || null
    }

    return NextResponse.json({
      success: true,
      data: enrichedModule
    })

  } catch (error) {
    console.error('Module detail API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
