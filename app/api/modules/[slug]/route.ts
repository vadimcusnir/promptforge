import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Path parameters schema
const pathSchema = z.object({
  slug: z.string().min(1)
})

// Legacy slug mappings for module redirects - kept for potential future use
// const LEGACY_SLUG_MAPPINGS: Record<string, string> = {
//   'risk-and-trust-reversal': 'trust-reversal-protocol',
//   'crisis-communication': 'crisis-communication-playbook',
//   'social-media-calendar': 'social-content-grid',
//   'content-calendar-optimizer': 'social-content-grid', // M14 fusion
//   'landing-page-optimizer': 'landing-page-alchemist',
//   'influencer-partnership-framework': 'influence-partnership-frame',
//   'content-performance-analyzer': 'content-analytics-dashboard',
//   'content-personalization-engine': 'momentum-campaign-builder',
//   'database-design-optimizer': 'data-schema-optimizer',
//   'microservices-architecture': 'microservices-grid',
//   'security-architecture-framework': 'security-fortress-frame',
//   'performance-optimization-engine': 'performance-engine',
//   'container-orchestration-strategy': 'orchestration-matrix',
//   'cloud-infrastructure-architect': 'cloud-infra-map',
//   'sales-process-optimizer': 'sales-flow-architect',
//   'sales-operations-framework': 'sales-flow-architect', // M31 fusion
//   'sales-enablement-framework': 'enablement-frame',
//   'sales-intelligence-framework': 'negotiation-dynamics',
//   'quality-management-system': 'quality-system-map',
//   'supply-chain-optimizer': 'supply-flow-optimizer',
//   'change-management-framework': 'change-force-field',
//   'executive-prompt-report': 'executive-prompt-dossier'
// }

// Function to generate current slug from module name
function generateCurrentSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/™/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    // Parse path parameters
    const params = await context.params
    const { slug } = pathSchema.parse(params)

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn('Supabase not configured, returning 404')
      return NextResponse.json(
        { success: false, error: 'Module not found' },
        { status: 404 }
      )
    }

    // Import Supabase client only when needed
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // First, try to find module by current slug (generated from name)
    let { data: module, error } = await supabase
      .from('modules')
      .select('*')
      .eq('is_active', true)
      .single()

    // If not found by current slug, try to find by legacy slug
    if (error || !module) {
      const { data: modules, error: legacyError } = await supabase
        .from('modules')
        .select('*')
        .eq('is_active', true)
        .contains('legacy_slugs', [slug])

      if (legacyError || !modules || modules.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Module not found' },
          { status: 404 }
        )
      }

      module = modules[0]
    }

    // Check if the requested slug matches the current slug or is a legacy slug
    const currentSlug = generateCurrentSlug(module.name)
    const isLegacySlug = module.legacy_slugs?.includes(slug) || false
    const isCurrentSlug = currentSlug === slug

    if (!isCurrentSlug && !isLegacySlug) {
      return NextResponse.json(
        { success: false, error: 'Module not found' },
        { status: 404 }
      )
    }

    // If it's a legacy slug, add redirect information to response
    const responseData = {
      ...module,
      current_slug: currentSlug,
      is_legacy_slug: isLegacySlug,
      redirect_info: isLegacySlug ? {
        legacy_slug: slug,
        current_slug: currentSlug,
        redirect_url: `/modules/${currentSlug}`
      } : null
    }

    // Get domain configuration
    const { data: domain } = await supabase
      .from('domain_configs')
      .select('*')
      .eq('slug', module.domain_slug)
      .single()

    // Enrich module with domain information
    const enrichedModule = {
      ...responseData,
      domain_info: domain || null
    }

    return NextResponse.json({
      success: true,
      data: enrichedModule
    })

  } catch (error) {
    console.error('Module slug API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid slug parameter', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
