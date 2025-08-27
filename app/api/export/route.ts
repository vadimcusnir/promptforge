import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth/server-auth'
import { validateOrgMembership } from '@/lib/billing/entitlements'
import { getEffectiveEntitlements } from '@/lib/billing/entitlements'
import { ENTITLEMENT_ERROR_CODES } from '@/lib/entitlements/types'

// Export request schema
const exportRequestSchema = z.object({
  format: z.enum(['txt', 'md', 'json', 'pdf', 'bundle']),
  content: z.string().min(1, 'Content is required'),
  filename: z.string().optional(),
  orgId: z.string().uuid('Valid organization ID required')
})

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(request)
    
    // Parse request body
    const body = await request.json()
    const validation = exportRequestSchema.safeParse(body)
    
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

    const { format, content, filename, orgId } = validation.data
    
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
    
    // Check entitlements based on export format
    let hasPermission = false
    let requiredPlan = 'pilot'
    
    switch (format) {
      case 'txt':
      case 'md':
        hasPermission = true // Basic formats always allowed
        break
      case 'json':
        hasPermission = entitlements.canExportJSON === true
        requiredPlan = 'pro'
        break
      case 'pdf':
        hasPermission = entitlements.canExportPDF === true
        requiredPlan = 'pro'
        break
      case 'bundle':
        hasPermission = entitlements.canExportBundleZip === true
        requiredPlan = 'enterprise'
        break
      default:
        hasPermission = false
    }

    if (!hasPermission) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ENTITLEMENT_REQUIRED',
          message: `${format.toUpperCase()} export requires ${requiredPlan} plan or higher`,
          code: ENTITLEMENT_ERROR_CODES.ENTITLEMENT_REQUIRED,
          requiredPlan,
          currentPlan: 'pilot' // This would come from user's actual plan
        },
        { status: 403 }
      )
    }

    // Process the export based on format
    const exportResult = await processExport(format, content, filename)
    
    // Set appropriate headers for download
    const headers = new Headers()
    headers.set('Content-Type', getContentType(format))
    headers.set('Content-Disposition', `attachment; filename="${exportResult.filename}"`)
    
    return new NextResponse(exportResult.content, {
      status: 200,
      headers
    })

  } catch (error) {
    console.error('Export API error:', error)
    
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
      { success: false, error: 'Failed to process export' },
      { status: 500 }
    )
  }
}

// Process export based on format
async function processExport(
  format: string, 
  content: string, 
  filename?: string
): Promise<{ content: string; filename: string }> {
  const baseFilename = filename || `export-${Date.now()}`
  
  switch (format) {
    case 'txt':
      return {
        content,
        filename: `${baseFilename}.txt`
      }
    
    case 'md':
      return {
        content: `# Export\n\n${content}`,
        filename: `${baseFilename}.md`
      }
    
    case 'json':
      return {
        content: JSON.stringify({ content, exportedAt: new Date().toISOString() }, null, 2),
        filename: `${baseFilename}.json`
      }
    
    case 'pdf':
      // In production, this would use a PDF library like puppeteer or jsPDF
      return {
        content: `PDF content would be generated here for: ${content}`,
        filename: `${baseFilename}.pdf`
      }
    
    case 'bundle':
      // In production, this would create a ZIP file with multiple formats
      return {
        content: `Bundle export would be generated here for: ${content}`,
        filename: `${baseFilename}.zip`
      }
    
    default:
      throw new Error(`Unsupported export format: ${format}`)
  }
}

// Get content type for export format
function getContentType(format: string): string {
  switch (format) {
    case 'txt':
      return 'text/plain'
    case 'md':
      return 'text/markdown'
    case 'json':
      return 'application/json'
    case 'pdf':
      return 'application/pdf'
    case 'bundle':
      return 'application/zip'
    default:
      return 'text/plain'
  }
}
