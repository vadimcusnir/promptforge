import { NextRequest, NextResponse } from "next/server"
import { AgentWatchWorker } from "@/lib/observability/agent-watch"

const BLOCKED_LOCALES = ['ro','ru','fr','de','es','it','pt','uk','zh','ja','tr','pl'];

const gatedRoutes: Record<string,string> = {
  "/api/gpt-test": "canUseGptTestReal",
  "/api/export/bundle": "canExportPDF",  // verifici în route și formatul
  "/api/run": "hasAPI"
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // English-only routing logic
  // /ro/..., /fr/... -> redirecționează fără segmentul de limbă
  const [, maybeLocale, ...rest] = url.pathname.split('/');
  if (BLOCKED_LOCALES.includes(maybeLocale)) {
    url.pathname = '/' + rest.join('/');
    return NextResponse.redirect(url);
  }

  // ?lang=ro -> forțează en
  const qLang = url.searchParams.get('lang');
  if (qLang && qLang !== 'en') {
    url.searchParams.set('lang', 'en');
    return NextResponse.redirect(url);
  }

  // Existing gated routes logic
  const entry = Object.entries(gatedRoutes).find(([path]) => url.pathname.startsWith(path));
  if (!entry) {
    const res = NextResponse.next();
    res.headers.set('Content-Language', 'en');
    return res;
  }

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

  const res = NextResponse.next();
  res.headers.set('Content-Language', 'en');
  return res;
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|assets|public).*)'],
};
