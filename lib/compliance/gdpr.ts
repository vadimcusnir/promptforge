// GDPR compliance system for PromptForge
// Implements Data Subject Rights (DSR) and consent management

import { createClient } from '@supabase/supabase-js'
import { auditTrail } from '../security/audit-trail'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type DSRType = 'export' | 'rectification' | 'erasure' | 'restriction' | 'portability'
export type ConsentType = 'analytics' | 'marketing' | 'functional' | 'necessary'

export interface ConsentRecord {
  id?: string
  user_id: string
  consent_type: ConsentType
  granted: boolean
  version: string
  ip_address?: string
  user_agent?: string
  timestamp: string
  expires_at?: string
}

export interface DSRRequest {
  id?: string
  user_id: string
  request_type: DSRType
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  description?: string
  requested_at: string
  completed_at?: string
  response_data?: any
  rejection_reason?: string
}

export interface UserDataExport {
  personal_data: {
    id: string
    email: string
    full_name?: string
    created_at: string
    updated_at: string
    plan: string
  }
  prompt_runs: Array<{
    id: string
    module_id: string
    created_at: string
    status: string
    ai_score?: number
  }>
  exports: Array<{
    id: string
    format: string
    created_at: string
    download_count: number
  }>
  consent_history: ConsentRecord[]
  audit_logs: Array<{
    action: string
    timestamp: string
    details: any
  }>
}

class GDPRCompliance {
  // Consent management
  async recordConsent(
    userId: string,
    consentType: ConsentType,
    granted: boolean,
    request?: Request
  ): Promise<void> {
    try {
      const consentRecord: Omit<ConsentRecord, 'id'> = {
        user_id: userId,
        consent_type: consentType,
        granted,
        version: '1.0',
        ip_address: request?.headers.get('x-forwarded-for'),
        user_agent: request?.headers.get('user-agent'),
        timestamp: new Date().toISOString(),
        expires_at: granted ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined
      }

      const { error } = await supabase
        .from('consent_records')
        .insert(consentRecord)

      if (error) {
        throw error
      }

      // Log consent change in audit trail
      await auditTrail.insertAuditRecord({
        org_id: 'system', // System-wide consent events
        actor_id: userId,
        entity_type: 'consent',
        action: granted ? 'consent_granted' : 'consent_withdrawn',
        record_json: {
          consent_type: consentType,
          version: consentRecord.version
        },
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'consent_management'
        }
      })
    } catch (error) {
      console.error('Failed to record consent:', error)
      throw error
    }
  }

  // Get user's current consent status
  async getConsentStatus(userId: string): Promise<Record<ConsentType, boolean>> {
    try {
      const { data, error } = await supabase
        .from('consent_records')
        .select('consent_type, granted, expires_at')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })

      if (error) {
        throw error
      }

      const consentStatus: Record<ConsentType, boolean> = {
        analytics: false,
        marketing: false,
        functional: false,
        necessary: true // Always true for necessary cookies
      }

      for (const record of data || []) {
        const isExpired = record.expires_at && new Date(record.expires_at) < new Date()
        if (!isExpired) {
          consentStatus[record.consent_type as ConsentType] = record.granted
        }
      }

      return consentStatus
    } catch (error) {
      console.error('Failed to get consent status:', error)
      throw error
    }
  }

  // Data Subject Rights (DSR) management
  async createDSRRequest(
    userId: string,
    requestType: DSRType,
    description?: string
  ): Promise<string> {
    try {
      const dsrRequest: Omit<DSRRequest, 'id'> = {
        user_id: userId,
        request_type: requestType,
        status: 'pending',
        description,
        requested_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('dsr_requests')
        .insert(dsrRequest)
        .select('id')
        .single()

      if (error) {
        throw error
      }

      // Log DSR request in audit trail
      await auditTrail.insertAuditRecord({
        org_id: 'system',
        actor_id: userId,
        entity_type: 'dsr_request',
        action: 'request_created',
        record_json: {
          request_type: requestType,
          description
        },
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'dsr_system'
        }
      })

      return data.id
    } catch (error) {
      console.error('Failed to create DSR request:', error)
      throw error
    }
  }

  // Process data export request (Right to Data Portability)
  async processDataExport(userId: string): Promise<UserDataExport> {
    try {
      // Get user's personal data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (userError) {
        throw userError
      }

      // Get user's prompt runs
      const { data: promptRuns, error: runsError } = await supabase
        .from('prompt_runs')
        .select('id, module_id, created_at, status, ai_score')
        .eq('user_id', userId)

      if (runsError) {
        throw runsError
      }

      // Get user's exports
      const { data: exports, error: exportsError } = await supabase
        .from('exports')
        .select('id, format, created_at, download_count')
        .eq('user_id', userId)

      if (exportsError) {
        throw exportsError
      }

      // Get consent history
      const { data: consentHistory, error: consentError } = await supabase
        .from('consent_records')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: true })

      if (consentError) {
        throw consentError
      }

      // Get audit logs for this user
      const { data: auditLogs, error: auditError } = await supabase
        .from('audits')
        .select('action, created_at, record_json')
        .eq('actor_id', userId)
        .order('created_at', { ascending: true })

      if (auditError) {
        throw auditError
      }

      const exportData: UserDataExport = {
        personal_data: {
          id: userData.id,
          email: userData.email,
          full_name: userData.full_name,
          created_at: userData.created_at,
          updated_at: userData.updated_at,
          plan: userData.plan
        },
        prompt_runs: promptRuns || [],
        exports: exports || [],
        consent_history: consentHistory || [],
        audit_logs: auditLogs || []
      }

      // Log successful export
      await auditTrail.insertAuditRecord({
        org_id: 'system',
        actor_id: userId,
        entity_type: 'data_export',
        action: 'export_completed',
        record_json: {
          record_count: {
            prompt_runs: promptRuns?.length || 0,
            exports: exports?.length || 0,
            consent_records: consentHistory?.length || 0,
            audit_logs: auditLogs?.length || 0
          }
        },
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'dsr_system'
        }
      })

      return exportData
    } catch (error) {
      console.error('Failed to process data export:', error)
      throw error
    }
  }

  // Process data erasure request (Right to be Forgotten)
  async processDataErasure(userId: string): Promise<void> {
    try {
      // Start transaction for data erasure
      const { error: transactionError } = await supabase.rpc('begin_transaction')
      if (transactionError) {
        throw transactionError
      }

      try {
        // Soft delete user data (mark as deleted but keep for legal obligations)
        const softDeleteData = {
          email: `deleted_${Date.now()}@deleted.local`,
          full_name: 'Deleted User',
          deleted_at: new Date().toISOString(),
          is_deleted: true
        }

        // Update user record
        const { error: userError } = await supabase
          .from('users')
          .update(softDeleteData)
          .eq('id', userId)

        if (userError) {
          throw userError
        }

        // Soft delete prompt runs
        const { error: runsError } = await supabase
          .from('prompt_runs')
          .update({ 
            status: 'deleted',
            deleted_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        if (runsError) {
          throw runsError
        }

        // Soft delete exports
        const { error: exportsError } = await supabase
          .from('exports')
          .update({ 
            deleted_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        if (exportsError) {
          throw exportsError
        }

        // Commit transaction
        const { error: commitError } = await supabase.rpc('commit_transaction')
        if (commitError) {
          throw commitError
        }

        // Log successful erasure
        await auditTrail.insertAuditRecord({
          org_id: 'system',
          actor_id: userId,
          entity_type: 'data_erasure',
          action: 'erasure_completed',
          record_json: {
            method: 'soft_delete',
            reason: 'user_request'
          },
          metadata: {
            timestamp: new Date().toISOString(),
            source: 'dsr_system'
          }
        })

      } catch (error) {
        // Rollback transaction on error
        await supabase.rpc('rollback_transaction')
        throw error
      }
    } catch (error) {
      console.error('Failed to process data erasure:', error)
      throw error
    }
  }

  // Get DSR request status
  async getDSRRequestStatus(requestId: string): Promise<DSRRequest | null> {
    try {
      const { data, error } = await supabase
        .from('dsr_requests')
        .select('*')
        .eq('id', requestId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // Not found
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Failed to get DSR request status:', error)
      throw error
    }
  }

  // Update DSR request status
  async updateDSRRequestStatus(
    requestId: string,
    status: DSRRequest['status'],
    responseData?: any,
    rejectionReason?: string
  ): Promise<void> {
    try {
      const updateData: Partial<DSRRequest> = {
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : undefined,
        response_data: responseData,
        rejection_reason: rejectionReason
      }

      const { error } = await supabase
        .from('dsr_requests')
        .update(updateData)
        .eq('id', requestId)

      if (error) {
        throw error
      }

      // Log status update
      await auditTrail.insertAuditRecord({
        org_id: 'system',
        entity_type: 'dsr_request',
        entity_id: requestId,
        action: 'status_updated',
        record_json: {
          new_status: status,
          response_data: responseData,
          rejection_reason: rejectionReason
        },
        metadata: {
          timestamp: new Date().toISOString(),
          source: 'dsr_system'
        }
      })
    } catch (error) {
      console.error('Failed to update DSR request status:', error)
      throw error
    }
  }

  // Get pending DSR requests (for admin processing)
  async getPendingDSRRequests(): Promise<DSRRequest[]> {
    try {
      const { data, error } = await supabase
        .from('dsr_requests')
        .select('*')
        .eq('status', 'pending')
        .order('requested_at', { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Failed to get pending DSR requests:', error)
      throw error
    }
  }
}

// Export singleton instance
export const gdprCompliance = new GDPRCompliance()

// Export types
export type { ConsentRecord, DSRRequest, UserDataExport, DSRType, ConsentType }
