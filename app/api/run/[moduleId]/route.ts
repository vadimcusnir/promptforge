import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth/server-auth'
import { validateOrgMembership } from '@/lib/billing/entitlements'
import { getEffectiveEntitlements } from '@/lib/billing/entitlements'
import { ENTITLEMENT_ERROR_CODES } from '@/lib/entitlements/types'

// Run request schema
const runRequestSchema = z.object({
  moduleId: z.string().min(1, 'Module ID is required'),
  orgId: z.string().uuid('Valid organization ID required'),
  parameters: z.record(z.any()).optional(),
  options: z.object({
    validateOnly: z.boolean().optional(),
    dryRun: z.boolean().optional()
  }).optional()
})

export async function POST(
  request: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    // Require authentication
    const user = await requireAuth(request)
    
    // Parse request body
    const body = await request.json()
    const validation = runRequestSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request data', 
          details: validation.error.errors 
        },
        { status: 400 }
      )
    }

    const { orgId, parameters, options } = validation.data
    const moduleId = params.moduleId
    
    // Validate organization membership
    const isMember = await validateOrgMembership(user.id, orgId)
    if (!isMember) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Access denied to organization',
          code: 'ACCESS_DENIED'
        },
        { status: 403 }
      )
    }

    // Get organization entitlements
    const entitlements = await getEffectiveEntitlements(orgId)
    
    // Check if user can access modules
    if (!entitlements.canAccessModule) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ENTITLEMENT_REQUIRED', 
          message: 'Module access requires Pilot plan or higher',
          code: ENTITLEMENT_ERROR_CODES.ENTITLEMENT_REQUIRED,
          requiredPlan: 'pilot',
          currentPlan: 'pilot' // This would come from user's actual plan
        },
        { status: 403 }
      )
    }

    // Check if user can access advanced modules (if applicable)
    if (moduleId.startsWith('ADV_') && !entitlements.canAccessAdvancedModules) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ENTITLEMENT_REQUIRED', 
          message: 'Advanced modules require Pro plan or higher',
          code: ENTITLEMENT_ERROR_CODES.ENTITLEMENT_REQUIRED,
          requiredPlan: 'pro',
          currentPlan: 'pilot' // This would come from user's actual plan
        },
        { status: 403 }
      )
    }

    // Process the module execution
    const result = await processModuleExecution(moduleId, parameters, options)
    
    return NextResponse.json({
      success: true,
      result: {
        moduleId,
        output: result.output,
        executionTime: result.executionTime,
        metadata: result.metadata
      }
    })

  } catch (error) {
    console.error('Module execution API error:', error)
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to execute module' },
      { status: 500 }
    )
  }
}

// Process module execution
async function processModuleExecution(
  moduleId: string,
  parameters?: Record<string, unknown>,
  options?: {
    validateOnly?: boolean;
    dryRun?: boolean;
  }
): Promise<{
  output: string;
  executionTime: number;
  metadata: Record<string, unknown>;
}> {
  const startTime = Date.now()
  
  // Simulate module execution
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const executionTime = Date.now() - startTime
  
  // Generate mock output based on module ID
  const output = generateMockOutput(moduleId, parameters)
  
  return {
    output,
    executionTime,
    metadata: {
      moduleId,
      parameters: parameters || {},
      options: options || {},
      executedAt: new Date().toISOString()
    }
  }
}

// Generate mock output for development
function generateMockOutput(moduleId: string, parameters?: Record<string, unknown>): string {
  const baseOutput = `Module ${moduleId} executed successfully with parameters: ${JSON.stringify(parameters || {})}`
  
  if (moduleId.startsWith('M01')) {
    return `Business Plan Generated:\n\n${baseOutput}\n\nThis is a simulated business plan output. In production, this would generate actual business plan content based on the provided parameters.`
  } else if (moduleId.startsWith('M02')) {
    return `Marketing Campaign Created:\n\n${baseOutput}\n\nThis is a simulated marketing campaign output. In production, this would create actual marketing strategies and content.`
  } else if (moduleId.startsWith('ADV_')) {
    return `Advanced Module Output:\n\n${baseOutput}\n\nThis is a simulated advanced module output. In production, this would provide sophisticated analysis and recommendations.`
  }
  
  return baseOutput
}
