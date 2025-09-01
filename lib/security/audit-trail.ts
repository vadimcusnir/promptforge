// Tamper-evident audit trail system for PromptForge
// Implements HMAC-signed audit logs with chain integrity verification

import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Audit event types
export type AuditEventType = 
  | 'authentication'
  | 'role_change'
  | 'organization_update'
  | 'billing_change'
  | 'content_publish'
  | 'export_performed'
  | 'webhook_received'
  | 'policy_denied'
  | 'security_event'
  | 'api_access'
  | 'data_access'
  | 'configuration_change'

// Audit record interface
export interface AuditRecord {
  id?: string
  org_id: string
  actor_id?: string
  entity_type: string
  entity_id?: string
  action: string
  record_json?: Record<string, any>
  prev_hash?: string
  hash?: string
  metadata?: Record<string, any>
  created_at?: string
}

// Security event details
export interface SecurityEvent {
  event_type: 'honeypot_access' | 'injection_attempt' | 'rate_limit_exceeded' | 'unauthorized_access'
  severity: 'low' | 'medium' | 'high' | 'critical'
  details: Record<string, any>
  ip_address?: string
  user_agent?: string
  path?: string
  method?: string
}

class AuditTrail {
  private readonly hmacSecret: string

  constructor() {
    this.hmacSecret = process.env.AUDIT_HMAC_SECRET || 'default-secret-change-in-production'
  }

  // Generate HMAC signature for audit record
  private generateHMAC(data: string): string {
    return crypto.createHmac('sha256', this.hmacSecret).update(data).digest('hex')
  }

  // Create canonical string for hashing
  private createCanonicalString(record: Omit<AuditRecord, 'id' | 'hash' | 'created_at'>): string {
    return JSON.stringify({
      org_id: record.org_id,
      actor_id: record.actor_id || '',
      entity_type: record.entity_type,
      entity_id: record.entity_id || '',
      action: record.action,
      record_json: record.record_json || {},
      prev_hash: record.prev_hash || '',
      metadata: record.metadata || {}
    })
  }

  // Insert audit record with tamper-evident hash chain
  async insertAuditRecord(record: Omit<AuditRecord, 'id' | 'hash' | 'created_at'>): Promise<string> {
    try {
      // Get the hash of the most recent audit record for this org
      const { data: lastRecord } = await supabase
        .from('audits')
        .select('hash')
        .eq('org_id', record.org_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      const prevHash = lastRecord?.hash || ''

      // Create canonical string and generate hash
      const canonicalString = this.createCanonicalString({ ...record, prev_hash: prevHash })
      const hash = this.generateHMAC(canonicalString)

      // Insert audit record
      const { data, error } = await supabase
        .from('audits')
        .insert({
          ...record,
          prev_hash: prevHash,
          hash
        })
        .select('id')
        .single()

      if (error) {
        console.error('Failed to insert audit record:', error)
        throw error
      }

      return data.id
    } catch (error) {
      console.error('Audit trail insertion failed:', error)
      throw error
    }
  }

  // Log security events
  async logSecurityEvent(event: SecurityEvent, request?: Request): Promise<void> {
    const auditRecord: Omit<AuditRecord, 'id' | 'hash' | 'created_at'> = {
      org_id: 'system', // System-wide security events
      entity_type: 'security_event',
      action: event.event_type,
      record_json: {
        severity: event.severity,
        details: event.details,
        ip_address: event.ip_address || request?.headers.get('x-forwarded-for'),
        user_agent: event.user_agent || request?.headers.get('user-agent'),
        path: event.path || new URL(request?.url || '').pathname,
        method: event.method || request?.method
      },
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'middleware'
      }
    }

    await this.insertAuditRecord(auditRecord)
  }

  // Log authentication events
  async logAuthentication(
    orgId: string,
    userId: string,
    action: 'login' | 'logout' | 'mfa_setup' | 'password_reset',
    details: Record<string, any> = {}
  ): Promise<void> {
    const auditRecord: Omit<AuditRecord, 'id' | 'hash' | 'created_at'> = {
      org_id: orgId,
      actor_id: userId,
      entity_type: 'authentication',
      action,
      record_json: details,
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'auth_system'
      }
    }

    await this.insertAuditRecord(auditRecord)
  }

  // Log export events
  async logExport(
    orgId: string,
    userId: string,
    exportId: string,
    format: string,
    score: number,
    details: Record<string, any> = {}
  ): Promise<void> {
    const auditRecord: Omit<AuditRecord, 'id' | 'hash' | 'created_at'> = {
      org_id: orgId,
      actor_id: userId,
      entity_type: 'export',
      entity_id: exportId,
      action: 'export_performed',
      record_json: {
        format,
        score,
        ...details
      },
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'export_system'
      }
    }

    await this.insertAuditRecord(auditRecord)
  }

  // Log API access
  async logApiAccess(
    orgId: string,
    userId: string,
    endpoint: string,
    method: string,
    statusCode: number,
    details: Record<string, any> = {}
  ): Promise<void> {
    const auditRecord: Omit<AuditRecord, 'id' | 'hash' | 'created_at'> = {
      org_id: orgId,
      actor_id: userId,
      entity_type: 'api_access',
      action: 'api_call',
      record_json: {
        endpoint,
        method,
        status_code: statusCode,
        ...details
      },
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'api_middleware'
      }
    }

    await this.insertAuditRecord(auditRecord)
  }

  // Verify audit chain integrity
  async verifyAuditChain(orgId: string): Promise<{
    isValid: boolean
    brokenRecords: Array<{ id: string; expectedHash: string; actualHash: string }>
  }> {
    try {
      const { data: records, error } = await supabase
        .from('audits')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: true })

      if (error) {
        throw error
      }

      const brokenRecords: Array<{ id: string; expectedHash: string; actualHash: string }> = []
      let prevHash = ''

      for (const record of records || []) {
        const canonicalString = this.createCanonicalString({
          org_id: record.org_id,
          actor_id: record.actor_id,
          entity_type: record.entity_type,
          entity_id: record.entity_id,
          action: record.action,
          record_json: record.record_json,
          prev_hash: prevHash,
          metadata: record.metadata
        })

        const expectedHash = this.generateHMAC(canonicalString)

        if (expectedHash !== record.hash) {
          brokenRecords.push({
            id: record.id,
            expectedHash,
            actualHash: record.hash
          })
        }

        prevHash = record.hash
      }

      return {
        isValid: brokenRecords.length === 0,
        brokenRecords
      }
    } catch (error) {
      console.error('Audit chain verification failed:', error)
      throw error
    }
  }

  // Export audit logs for compliance
  async exportAuditLogs(
    orgId: string,
    startDate?: Date,
    endDate?: Date,
    format: 'json' | 'csv' = 'json'
  ): Promise<string> {
    try {
      let query = supabase
        .from('audits')
        .select('*')
        .eq('org_id', orgId)

      if (startDate) {
        query = query.gte('created_at', startDate.toISOString())
      }

      if (endDate) {
        query = query.lte('created_at', endDate.toISOString())
      }

      const { data: records, error } = await query.order('created_at', { ascending: true })

      if (error) {
        throw error
      }

      if (format === 'json') {
        return JSON.stringify(records, null, 2)
      } else {
        // CSV format
        const headers = ['id', 'org_id', 'actor_id', 'entity_type', 'entity_id', 'action', 'created_at', 'hash']
        const csvRows = [headers.join(',')]

        for (const record of records || []) {
          const row = headers.map(header => {
            const value = record[header as keyof typeof record] || ''
            return `"${String(value).replace(/"/g, '""')}"`
          })
          csvRows.push(row.join(','))
        }

        return csvRows.join('\n')
      }
    } catch (error) {
      console.error('Audit log export failed:', error)
      throw error
    }
  }

  // Get audit statistics
  async getAuditStatistics(orgId: string, days: number = 30): Promise<{
    totalEvents: number
    eventsByType: Record<string, number>
    eventsByAction: Record<string, number>
    recentActivity: Array<{ date: string; count: number }>
  }> {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data: records, error } = await supabase
        .from('audits')
        .select('entity_type, action, created_at')
        .eq('org_id', orgId)
        .gte('created_at', startDate.toISOString())

      if (error) {
        throw error
      }

      const eventsByType: Record<string, number> = {}
      const eventsByAction: Record<string, number> = {}
      const recentActivity: Array<{ date: string; count: number }> = []

      for (const record of records || []) {
        // Count by entity type
        eventsByType[record.entity_type] = (eventsByType[record.entity_type] || 0) + 1
        
        // Count by action
        eventsByAction[record.action] = (eventsByAction[record.action] || 0) + 1

        // Count by date
        const date = record.created_at.split('T')[0]
        const existingDate = recentActivity.find(d => d.date === date)
        if (existingDate) {
          existingDate.count++
        } else {
          recentActivity.push({ date, count: 1 })
        }
      }

      return {
        totalEvents: records?.length || 0,
        eventsByType,
        eventsByAction,
        recentActivity: recentActivity.sort((a, b) => a.date.localeCompare(b.date))
      }
    } catch (error) {
      console.error('Audit statistics retrieval failed:', error)
      throw error
    }
  }
}

// Export singleton instance
export const auditTrail = new AuditTrail()

// Export types for use in other modules
export type { AuditRecord, SecurityEvent, AuditEventType }
