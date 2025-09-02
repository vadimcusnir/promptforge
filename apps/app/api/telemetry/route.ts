import { type NextRequest, NextResponse } from "next/server"
import type { TelemetryEvent } from "@/lib/telemetry"

export async function POST(request: NextRequest) {
  try {
    const event: TelemetryEvent = await request.json()

    // Validate event structure
    if (!event.event || !event.session_id || !event.timestamp) {
      return NextResponse.json({ error: "Invalid event structure" }, { status: 400 })
    }

    // In production, this would send to your analytics service
    // For now, we'll log and store in memory/database
    console.log("[Telemetry]", {
      event: event.event,
      module_id: event.module_id,
      session_id: event.session_id,
      timestamp: new Date(event.timestamp).toISOString(),
      metadata: event.metadata,
    })

    // TODO: Store in Supabase or analytics service
    // await supabase.from('telemetry_events').insert(event)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Telemetry Error]", error)
    return NextResponse.json({ error: "Failed to process event" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Telemetry endpoint active",
    endpoints: {
      events: "POST /api/telemetry",
      health: "GET /api/telemetry",
    },
  })
}
