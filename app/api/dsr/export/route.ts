import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// DSR Export Request Schema
const DSRExportSchema = z.object({
  request_type: z.enum(['export', 'portability']),
  data_types: z.array(z.enum(['profile', 'runs', 'exports', 'telemetry', 'audit'])).optional(),
  format: z.enum(['json', 'csv', 'zip']).default('json'),
  include_metadata: z.boolean().default(true)
})

// Data Subject Request Export Handler
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request
    const body = await request.json()
    const validatedData = DSRExportSchema.parse(body)
    
    // Get authenticated user
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's organization
    const { data: membership } = await supabase
      .from('memberships')
      .select('org_id')
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Organization not found' },
        { status: 404 }
      )
    }

    // Create DSR request record
    const { data: dsrRequest, error: dsrError } = await supabase
      .from('dsr_requests')
      .insert({
        user_id: user.id,
        org_id: membership.org_id,
        request_type: validatedData.request_type,
        status: 'processing',
        requested_data_types: validatedData.data_types,
        requested_format: validatedData.format,
        metadata: {
          include_metadata: validatedData.include_metadata,
          requested_at: new Date().toISOString(),
          ip_address: request.headers.get('x-forwarded-for') || 'unknown'
        }
      })
      .select()
      .single()

    if (dsrError) {
      console.error('DSR request creation failed:', dsrError)
      return NextResponse.json(
        { error: 'INTERNAL_ERROR', message: 'Failed to create DSR request' },
        { status: 500 }
      )
    }

    // Log DSR request for audit trail
    await supabase.rpc('insert_audit_record', {
      p_org_id: membership.org_id,
      p_actor_id: user.id,
      p_entity_type: 'dsr_request',
      p_entity_id: dsrRequest.id,
      p_action: 'created',
      p_record_json: {
        request_type: validatedData.request_type,
        data_types: validatedData.data_types,
        format: validatedData.format
      },
      p_metadata: {
        source: 'api',
        endpoint: '/api/dsr/export'
      }
    })

    // Process DSR request asynchronously
    await processDSRRequest(dsrRequest.id, user.id, membership.org_id, validatedData)

    return NextResponse.json({
      success: true,
      message: 'DSR request submitted successfully',
      request_id: dsrRequest.id,
      estimated_completion: '7 days',
      status_url: `/api/dsr/status/${dsrRequest.id}`
    })

  } catch (error) {
    console.error('DSR export error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Invalid request format', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to process DSR request' },
      { status: 500 }
    )
  }
}

// Process DSR request asynchronously
async function processDSRRequest(
  requestId: string, 
  userId: string, 
  orgId: string, 
  requestData: z.infer<typeof DSRExportSchema>
) {
  const supabase = createClient()
  
  try {
    // Collect user data based on requested types
    const userData: any = {
      request_id: requestId,
      user_id: userId,
      org_id: orgId,
      generated_at: new Date().toISOString(),
      data_types: requestData.data_types || ['profile', 'runs', 'exports', 'telemetry'],
      format: requestData.format
    }

    // Get user profile data
    if (!requestData.data_types || requestData.data_types.includes('profile')) {
      const { data: profile } = await supabase
        .from('users')
        .select('id, email, created_at, last_sign_in_at')
        .eq('id', userId)
        .single()
      
      userData.profile = profile
    }

    // Get runs data
    if (!requestData.data_types || requestData.data_types.includes('runs')) {
      const { data: runs } = await supabase
        .from('runs')
        .select('*')
        .eq('user_id', userId)
        .eq('org_id', orgId)
      
      userData.runs = runs || []
    }

    // Get exports data
    if (!requestData.data_types || requestData.data_types.includes('exports')) {
      const { data: exports } = await supabase
        .from('exports')
        .select('*')
        .eq('user_id', userId)
        .eq('org_id', orgId)
      
      userData.exports = exports || []
    }

    // Get telemetry data (anonymized)
    if (!requestData.data_types || requestData.data_types.includes('telemetry')) {
      const { data: telemetry } = await supabase
        .from('telemetry_events')
        .select('event_type, module_id, created_at, metadata')
        .eq('user_id', userId)
        .eq('org_id', orgId)
      
      userData.telemetry = telemetry || []
    }

    // Get audit data (user-related only)
    if (!requestData.data_types || requestData.data_types.includes('audit')) {
      const { data: audit } = await supabase
        .from('audits')
        .select('entity_type, action, created_at, metadata')
        .eq('actor_id', userId)
        .eq('org_id', orgId)
      
      userData.audit = audit || []
    }

    // Generate data package
    const dataPackage = {
      ...userData,
      checksum: await generateChecksum(userData),
      license_notice: '© PROMPTFORGE v3 — Data Subject Request Export'
    }

    // Store the data package
    const { data: storageResult, error: storageError } = await supabase
      .from('dsr_data_packages')
      .insert({
        request_id: requestId,
        user_id: userId,
        org_id: orgId,
        data_package: dataPackage,
        format: requestData.format,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      })
      .select()
      .single()

    if (storageError) {
      throw new Error(`Storage failed: ${storageError.message}`)
    }

    // Update DSR request status
    await supabase
      .from('dsr_requests')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        data_package_id: storageResult.id
      })
      .eq('id', requestId)

    // Log completion for audit trail
    await supabase.rpc('insert_audit_record', {
      p_org_id: orgId,
      p_actor_id: userId,
      p_entity_type: 'dsr_request',
      p_entity_id: requestId,
      p_action: 'completed',
      p_record_json: {
        data_package_id: storageResult.id,
        data_types: requestData.data_types,
        format: requestData.format
      },
      p_metadata: {
        source: 'background_processor'
      }
    })

  } catch (error) {
    console.error('DSR processing error:', error)
    
    // Update DSR request status to failed
    await supabase
      .from('dsr_requests')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        completed_at: new Date().toISOString()
      })
      .eq('id', requestId)
  }
}

// Generate checksum for data integrity
async function generateChecksum(data: any): Promise<string> {
  const encoder = new TextEncoder()
  const dataString = JSON.stringify(data, Object.keys(data).sort())
  const dataBuffer = encoder.encode(dataString)
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
