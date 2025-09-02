export interface TelemetryEvent {
  event: "open" | "run" | "export" | "legacy_redirect"
  module_id?: string
  user_id?: string
  session_id: string
  timestamp: number
  metadata?: Record<string, any>
}

export class TelemetryTracker {
  private static instance: TelemetryTracker
  private events: TelemetryEvent[] = []
  private sessionId: string

  private constructor() {
    this.sessionId = this.generateSessionId()
  }

  static getInstance(): TelemetryTracker {
    if (!TelemetryTracker.instance) {
      TelemetryTracker.instance = new TelemetryTracker()
    }
    return TelemetryTracker.instance
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  track(event: Omit<TelemetryEvent, "session_id" | "timestamp">): void {
    const telemetryEvent: TelemetryEvent = {
      ...event,
      session_id: this.sessionId,
      timestamp: Date.now(),
    }

    this.events.push(telemetryEvent)

    // Send to analytics endpoint
    if (typeof window !== "undefined") {
      fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telemetryEvent),
      }).catch(console.error)
    }

    // Log for debugging
    console.log("[v0] Telemetry event:", telemetryEvent)
  }

  getEvents(): TelemetryEvent[] {
    return [...this.events]
  }

  clearEvents(): void {
    this.events = []
  }
}

export function trackEvent(eventName: string, properties?: Record<string, any>): void {
  const tracker = TelemetryTracker.getInstance()

  // Map generic event names to telemetry event types
  let eventType: TelemetryEvent["event"]

  switch (eventName) {
    case "page_view":
    case "footer_link_click":
    case "cta_click":
    case "deep_scroll":
    case "web_vital":
      eventType = "open"
      break
    case "module_run":
    case "generator_run":
      eventType = "run"
      break
    case "export_prompt":
    case "download_bundle":
      eventType = "export"
      break
    default:
      eventType = "open"
  }

  tracker.track({
    event: eventType,
    module_id: properties?.module_id,
    user_id: properties?.user_id,
    metadata: {
      event_name: eventName,
      ...properties,
    },
  })
}

// Convenience functions for common events
export const telemetry = {
  trackOpen: (module_id?: string, metadata?: Record<string, any>) => {
    TelemetryTracker.getInstance().track({
      event: "open",
      module_id,
      metadata,
    })
  },

  trackRun: (module_id: string, metadata?: Record<string, any>) => {
    TelemetryTracker.getInstance().track({
      event: "run",
      module_id,
      metadata,
    })
  },

  trackExport: (module_id: string, format: string, metadata?: Record<string, any>) => {
    TelemetryTracker.getInstance().track({
      event: "export",
      module_id,
      metadata: { format, ...metadata },
    })
  },

  trackLegacyRedirect: (from: string, to: string) => {
    TelemetryTracker.getInstance().track({
      event: "legacy_redirect",
      metadata: { from, to },
    })
  },
}
