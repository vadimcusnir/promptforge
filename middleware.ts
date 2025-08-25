// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const COMING_SOON_ENV = process.env.COMING_SOON === "true";
const BLOCKED_LOCALES = [
  "ro",
  "ru",
  "fr",
  "de",
  "es",
  "it",
  "pt",
  "uk",
  "zh",
  "ja",
  "tr",
  "pl",
];

// Routes we always allow (assets, api, coming-soon, auth etc.)
const PUBLIC_ALLOW = [
  "/coming-soon",
  "/demo-bundle",
  "/api",
  "/favicon",
  "/og",
  "/_next",
  "/public",
  "/assets",
  "/robots.txt",
  "/sitemap.xml",
  "/glitch-keywords.js",
  "/forge_v3_logo",
];

const gatedRoutes: Record<string, string> = {
  "/api/gpt-test": "canUseGptTestReal",
  "/api/export/bundle": "canExportPDF",
  "/api/run": "hasAPI",
};

function pathAllowed(pathname: string) {
  return PUBLIC_ALLOW.some((p) => pathname === p || pathname.startsWith(p));
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;

  // English-only routing logic (preserve existing functionality)
  const [, maybeLocale, ...rest] = url.pathname.split("/");
  if (BLOCKED_LOCALES.includes(maybeLocale)) {
    url.pathname = "/" + rest.join("/");
    return NextResponse.redirect(url);
  }

  // ?lang=ro -> force en
  const qLang = url.searchParams.get("lang");
  if (qLang && qLang !== "en") {
    url.searchParams.set("lang", "en");
    return NextResponse.redirect(url);
  }

  // Coming Soon System - CHECK FIRST and handle ALL non-public paths
  // Runtime toggle via cookie (set with /api/toggle-coming-soon)
  const comingSoonCookie = req.cookies.get("coming_soon")?.value === "on";
  const COMING_SOON = COMING_SOON_ENV || comingSoonCookie;

  if (COMING_SOON) {
    // Bypass for admin (cookie "pf_role=admin" set at auth)
    const role = req.cookies.get("pf_role")?.value ?? "member";
    const isAdmin = role === "admin";

    // If not admin and not already on coming-soon page, redirect
    if (!isAdmin && pathname !== "/coming-soon") {
      const comingSoonUrl = req.nextUrl.clone();
      comingSoonUrl.pathname = "/coming-soon";
      // Optional: keep original destination as query for analytics
      comingSoonUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(comingSoonUrl);
    }
  }

  // Allow public + static + /coming-soon + /api
  if (pathAllowed(pathname)) {
    // Add security headers for all responses
    const response = NextResponse.next();
    response.headers.set("Content-Language", "en");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=()",
    );

    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' vercel.live",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "font-src 'self' fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self' https://*.supabase.co https://api.openai.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    response.headers.set("Content-Security-Policy", csp);
    return response;
  }

  // If we get here, the path is not public and Coming Soon is not active
  // This handles all other routes including the homepage when Coming Soon is off

  // Existing gated routes logic (preserve existing functionality)
  const entry = Object.entries(gatedRoutes).find(([path]) =>
    url.pathname.startsWith(path),
  );
  if (!entry) {
    const res = NextResponse.next();
    res.headers.set("Content-Language", "en");
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("X-Frame-Options", "DENY");
    res.headers.set("X-XSS-Protection", "1; mode=block");
    res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    res.headers.set(
      "Permissions-Policy",
      "geolocation=(), microphone=(), camera=()",
    );
    return res;
  }

  // Enhanced kill switch - check ENV variable only
  if (process.env.AGENTS_ENABLED === "false") {
    return new NextResponse(
      JSON.stringify({
        error: "AGENTS_DISABLED",
        message: "Agent execution has been disabled by kill-switch",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 503,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "300",
        },
      },
    );
  }

  // Required headers validation (SACF)
  if (!req.headers.get("x-org-id")) {
    return new NextResponse(
      JSON.stringify({ 
        error: "MISSING_HEADERS", 
        message: "x-org-id header is required",
        required_headers: ["x-org-id", "x-run-id"]
      }), 
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  // x-run-id este opțional pentru entitlements, dar obligatoriu pentru operații
  if (!req.headers.get("x-run-id") && !url.pathname.includes('/entitlements')) {
    return new NextResponse(
      JSON.stringify({ 
        error: "MISSING_HEADERS", 
        message: "x-run-id header is required for this operation" 
      }), 
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  const res = NextResponse.next();
  res.headers.set("Content-Language", "en");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()",
  );
  return res;
}

export const config = {
  matcher: [
    // Match all routes except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
