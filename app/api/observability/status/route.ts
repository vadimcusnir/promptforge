import { NextRequest, NextResponse } from "next/server";
import { getSystemStatus } from "@/lib/observability";

export async function GET(request: NextRequest) {
  try {
    // Check if request has proper authorization (in production)
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - Bearer token required" },
        { status: 401 },
      );
    }

    // Get comprehensive system status
    const status = getSystemStatus();

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      ...status,
    });
  } catch (error) {
    console.error("[API] Failed to get observability status:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case "trigger_kill_switch":
        const { reason } = params;
        if (!reason) {
          return NextResponse.json(
            { error: "Reason required for kill-switch activation" },
            { status: 400 },
          );
        }

        const { agentWatch } = await import("@/lib/observability");
        agentWatch.triggerKillSwitch(reason);

        return NextResponse.json({
          status: "kill_switch_activated",
          reason,
          timestamp: new Date().toISOString(),
        });

      case "enable_degradation_mode":
        const { agentWatch: aw } = await import("@/lib/observability");
        aw.enableDegradationMode();

        return NextResponse.json({
          status: "degradation_mode_enabled",
          timestamp: new Date().toISOString(),
        });

      case "disable_degradation_mode":
        const { agentWatch: aw2 } = await import("@/lib/observability");
        aw2.disableDegradationMode();

        return NextResponse.json({
          status: "degradation_mode_disabled",
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("[API] Failed to process observability action:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
