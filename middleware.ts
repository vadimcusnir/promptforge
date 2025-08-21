import { NextResponse } from "next/server"
import { AgentWatchWorker } from "@/lib/observability/agent-watch"

const gatedRoutes: Record<string,string> = {
  "/api/gpt-test": "canUseGptTestReal",
  "/api/export/bundle": "canExportPDF",  // verifici în route și formatul
  "/api/run": "hasAPI"
};

export function middleware(req: Request) {
  const url = new URL(req.url);
  const entry = Object.entries(gatedRoutes).find(([path]) => url.pathname.startsWith(path));
  if (!entry) return NextResponse.next();

  // Enhanced kill switch - check both ENV and SSOT configuration
  if (!AgentWatchWorker.areAgentsEnabled()) {
    return new NextResponse(
      JSON.stringify({ 
        error: "AGENTS_DISABLED", 
        message: "Agent execution has been disabled by kill-switch",
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '300' // Suggest retry after 5 minutes
        }
      }
    );
  }

  // Check for degradation mode
  const agentWatch = AgentWatchWorker.getInstance();
  const summary = agentWatch.getMetricsSummary();
  if (summary.degradationMode && url.pathname.includes("gpt-test")) {
    return new NextResponse(
      JSON.stringify({ 
        error: "DEGRADATION_MODE", 
        message: "System in degradation mode - live testing disabled",
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'X-Degradation-Mode': 'true'
        }
      }
    );
  }

  // Required headers validation
  if (!req.headers.get("x-org-id")) {
    return new NextResponse(JSON.stringify({ error: "MISSING_ORG" }), { status: 400 });
  }

  if (!req.headers.get("x-run-id")) {
    return new NextResponse(JSON.stringify({ error: "MISSING_RUN_ID" }), { status: 400 });
  }

  return NextResponse.next();
}
