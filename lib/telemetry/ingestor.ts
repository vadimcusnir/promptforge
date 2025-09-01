import { createClient } from '@/lib/supabase/server'
import { TelemetryEvent, EventSchemas, EventPriorities, SamplingRates } from './event-taxonomy'
import { v4 as uuidv4 } from 'uuid'

export class TelemetryIngestor {
  private supabase = createClient()
  private batchSize = 100
  private batchTimeout = 5000 // 5 seconds
  private eventBatch: TelemetryEvent[] = []
  private batchTimer?: NodeJS.Timeout

  constructor() {
    // Start batch processing timer
    this.startBatchTimer()
  }

  // Main method to ingest events
  async ingest(event: TelemetryEvent): Promise<void> {
    try {
      // Validate event structure
      const validationResult = this.validateEvent(event)
      if (!validationResult.valid) {
        console.error('Invalid telemetry event:', validationResult.errors)
        return
      }

      // Apply sampling based on plan and event type
      if (!this.shouldSample(event)) {
        return
      }

      // Add to batch
      this.eventBatch.push(event)

      // Process batch if it's full
      if (this.eventBatch.length >= this.batchSize) {
        await this.processBatch()
      }

    } catch (error) {
      console.error('Telemetry ingestion error:', error)
    }
  }

  // Validate event against schema
  private validateEvent(event: TelemetryEvent): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    const schema = EventSchemas[event.event_type as keyof typeof EventSchemas]

    if (!schema) {
      errors.push(`Unknown event type: ${event.event_type}`)
      return { valid: false, errors }
    }

    // Check required fields
    for (const field of schema.required) {
      if (!(field in event) || event[field as keyof TelemetryEvent] === undefined) {
        errors.push(`Missing required field: ${field}`)
      }
    }

    // Check for PII in metadata
    if (event.metadata) {
      const piiFields = ['email', 'phone', 'address', 'ssn', 'credit_card']
      for (const field of piiFields) {
        if (JSON.stringify(event.metadata).toLowerCase().includes(field)) {
          errors.push(`PII detected in metadata: ${field}`)
        }
      }
    }

    return { valid: errors.length === 0, errors }
  }

  // Determine if event should be sampled
  private shouldSample(event: TelemetryEvent): boolean {
    const plan = event.plan || 'pilot'
    const eventType = event.event_type

    // Always sample critical events
    if (EventPriorities.critical.includes(eventType)) {
      return true
    }

    // Get sampling rate for this event type and plan
    const planSampling = SamplingRates[plan as keyof typeof SamplingRates]
    if (!planSampling) {
      return true // Default to sampling if plan not found
    }

    const samplingRate = planSampling[eventType as keyof typeof planSampling] || 1.0
    return Math.random() < samplingRate
  }

  // Process batch of events
  private async processBatch(): Promise<void> {
    if (this.eventBatch.length === 0) return

    const batch = [...this.eventBatch]
    this.eventBatch = []

    try {
      // Prepare events for database insertion
      const eventsToInsert = batch.map(event => ({
        id: uuidv4(),
        event_type: event.event_type,
        user_id: event.user_id,
        org_id: event.org_id,
        session_id: event.session_id,
        trace_id: event.trace_id,
        plan: event.plan,
        event_data: event,
        metadata: event.metadata || {},
        created_at: new Date().toISOString()
      }))

      // Insert into telemetry_events table
      const { error } = await this.supabase
        .from('telemetry_events')
        .insert(eventsToInsert)

      if (error) {
        console.error('Failed to insert telemetry events:', error)
        // Could implement retry logic or dead letter queue here
      } else {
        console.log(`Ingested ${eventsToInsert.length} telemetry events`)
      }

      // Process high-priority events immediately
      const highPriorityEvents = batch.filter(event => 
        EventPriorities.high.includes(event.event_type) || 
        EventPriorities.critical.includes(event.event_type)
      )

      for (const event of highPriorityEvents) {
        await this.processHighPriorityEvent(event)
      }

    } catch (error) {
      console.error('Batch processing error:', error)
    }
  }

  // Process high-priority events (alerts, real-time metrics)
  private async processHighPriorityEvent(event: TelemetryEvent): Promise<void> {
    try {
      switch (event.event_type) {
        case 'module_run_blocked':
          await this.handleModuleRunBlocked(event as any)
          break
        case 'checkout_paid':
          await this.handleCheckoutPaid(event as any)
          break
        case 'security_event':
          await this.handleSecurityEvent(event as any)
          break
        case 'export_performed':
          await this.handleExportPerformed(event as any)
          break
      }
    } catch (error) {
      console.error(`Error processing high-priority event ${event.event_type}:`, error)
    }
  }

  // Handle module run blocked events
  private async handleModuleRunBlocked(event: any): Promise<void> {
    // Update daily usage metrics
    await this.supabase.rpc('increment_daily_usage', {
      p_org_id: event.org_id,
      p_date: new Date().toISOString().split('T')[0],
      p_runs_blocked: 1
    })

    // Log to audit trail
    await this.supabase.rpc('insert_audit_record', {
      p_org_id: event.org_id,
      p_actor_id: event.user_id,
      p_entity_type: 'run',
      p_entity_id: event.run_id,
      p_action: 'blocked',
      p_record_json: {
        reason: event.reason,
        score_total: event.score_total,
        threshold: event.threshold
      },
      p_metadata: {
        source: 'telemetry',
        event_type: 'module_run_blocked'
      }
    })
  }

  // Handle checkout paid events
  private async handleCheckoutPaid(event: any): Promise<void> {
    // Update revenue metrics
    await this.supabase.rpc('increment_daily_usage', {
      p_org_id: event.org_id,
      p_date: new Date().toISOString().split('T')[0],
      p_revenue_cents: event.amount_cents
    })

    // Log to audit trail
    await this.supabase.rpc('insert_audit_record', {
      p_org_id: event.org_id,
      p_actor_id: event.user_id,
      p_entity_type: 'subscription',
      p_entity_id: event.user_id,
      p_action: 'payment_completed',
      p_record_json: {
        plan: event.plan,
        amount_cents: event.amount_cents,
        currency: event.currency,
        payment_method: event.payment_method
      },
      p_metadata: {
        source: 'telemetry',
        event_type: 'checkout_paid'
      }
    })
  }

  // Handle security events
  private async handleSecurityEvent(event: any): Promise<void> {
    // Log to audit trail with high priority
    await this.supabase.rpc('insert_audit_record', {
      p_org_id: event.org_id,
      p_actor_id: event.user_id,
      p_entity_type: 'security',
      p_entity_id: uuidv4(),
      p_action: event.security_type,
      p_record_json: {
        severity: event.severity,
        ip_address: event.ip_address,
        user_agent: event.user_agent,
        details: event.details
      },
      p_metadata: {
        source: 'telemetry',
        event_type: 'security_event',
        priority: 'high'
      }
    })

    // Could trigger alerts for critical security events
    if (event.severity === 'critical') {
      // Implement alerting logic here
      console.warn('Critical security event detected:', event)
    }
  }

  // Handle export performed events
  private async handleExportPerformed(event: any): Promise<void> {
    // Update daily usage metrics
    await this.supabase.rpc('increment_daily_usage', {
      p_org_id: event.org_id,
      p_date: new Date().toISOString().split('T')[0],
      p_exports_count: 1
    })

    // Log to audit trail
    await this.supabase.rpc('insert_audit_record', {
      p_org_id: event.org_id,
      p_actor_id: event.user_id,
      p_entity_type: 'export',
      p_entity_id: event.run_id,
      p_action: 'exported',
      p_record_json: {
        format: event.format,
        file_size: event.file_size,
        checksum: event.checksum,
        watermark_applied: event.watermark_applied
      },
      p_metadata: {
        source: 'telemetry',
        event_type: 'export_performed'
      }
    })
  }

  // Start batch processing timer
  private startBatchTimer(): void {
    this.batchTimer = setInterval(async () => {
      if (this.eventBatch.length > 0) {
        await this.processBatch()
      }
    }, this.batchTimeout)
  }

  // Stop batch processing timer
  public stop(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer)
      this.batchTimer = undefined
    }
  }

  // Force process remaining events
  public async flush(): Promise<void> {
    await this.processBatch()
  }
}

// Singleton instance
export const telemetryIngestor = new TelemetryIngestor()

// Helper function to create and send events
export async function trackEvent(event: Omit<TelemetryEvent, 'event_id' | 'timestamp'>): Promise<void> {
  const fullEvent: TelemetryEvent = {
    ...event,
    event_id: uuidv4(),
    timestamp: new Date().toISOString()
  }

  await telemetryIngestor.ingest(fullEvent)
}

// Convenience functions for common events
export const telemetry = {
  moduleOpen: (data: Omit<TelemetryEvent, 'event_type' | 'event_id' | 'timestamp'> & { module_id: string; module_name: string; source: string }) =>
    trackEvent({ ...data, event_type: 'module_open' }),

  moduleRunRequested: (data: Omit<TelemetryEvent, 'event_type' | 'event_id' | 'timestamp'> & { module_id: string; domain: string; scale: string; urgency: string; complexity: string; output_format: string }) =>
    trackEvent({ ...data, event_type: 'module_run_requested' }),

  moduleRunStarted: (data: Omit<TelemetryEvent, 'event_type' | 'event_id' | 'timestamp'> & { run_id: string; module_id: string; model: string }) =>
    trackEvent({ ...data, event_type: 'module_run_started' }),

  moduleRunSucceeded: (data: Omit<TelemetryEvent, 'event_type' | 'event_id' | 'timestamp'> & { run_id: string; module_id: string; duration_ms: number; tokens_in: number; tokens_out: number; cost_cents: number }) =>
    trackEvent({ ...data, event_type: 'module_run_succeeded' }),

  moduleRunBlocked: (data: Omit<TelemetryEvent, 'event_type' | 'event_id' | 'timestamp'> & { run_id: string; module_id: string; reason: string; threshold: number }) =>
    trackEvent({ ...data, event_type: 'module_run_blocked' }),

  exportPerformed: (data: Omit<TelemetryEvent, 'event_type' | 'event_id' | 'timestamp'> & { run_id: string; module_id: string; format: string; file_size: number; checksum: string }) =>
    trackEvent({ ...data, event_type: 'export_performed' }),

  legacyRedirectHit: (data: Omit<TelemetryEvent, 'event_type' | 'event_id' | 'timestamp'> & { old_slug: string; new_slug: string; redirect_type: string; user_agent: string }) =>
    trackEvent({ ...data, event_type: 'legacy_redirect_hit' }),

  pricingView: (data: Omit<TelemetryEvent, 'event_type' | 'event_id' | 'timestamp'> & { source: string }) =>
    trackEvent({ ...data, event_type: 'pricing_view' }),

  checkoutStarted: (data: Omit<TelemetryEvent, 'event_type' | 'event_id' | 'timestamp'> & { plan: string; source: string }) =>
    trackEvent({ ...data, event_type: 'checkout_started' }),

  checkoutPaid: (data: Omit<TelemetryEvent, 'event_type' | 'event_id' | 'timestamp'> & { plan: string; amount_cents: number; currency: string; payment_method: string }) =>
    trackEvent({ ...data, event_type: 'checkout_paid' }),

  webVitals: (data: Omit<TelemetryEvent, 'event_type' | 'event_id' | 'timestamp'> & { metric: string; value: number; page: string; route: string; device_type: string }) =>
    trackEvent({ ...data, event_type: 'web_vitals' }),

  securityEvent: (data: Omit<TelemetryEvent, 'event_type' | 'event_id' | 'timestamp'> & { security_type: string; severity: string; ip_address: string; user_agent: string; details: Record<string, any> }) =>
    trackEvent({ ...data, event_type: 'security_event' })
}
