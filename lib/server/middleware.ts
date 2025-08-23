import { NextRequest, NextResponse } from 'next/server';
import { APIError } from './validation';

/**
 * API Middleware utilities for rate limiting, security headers, and error handling
 */

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator: (req: NextRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting middleware
 */
export function rateLimit(config: RateLimitConfig) {
  return async (
    req: NextRequest
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> => {
    const key = config.keyGenerator(req);
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Clean up expired entries
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k);
      }
    }

    const current = rateLimitStore.get(key);

    if (!current || current.resetTime < now) {
      // New window
      const resetTime = now + config.windowMs;
      rateLimitStore.set(key, { count: 1, resetTime });
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime,
      };
    }

    if (current.count >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime,
      };
    }

    current.count++;
    return {
      allowed: true,
      remaining: config.maxRequests - current.count,
      resetTime: current.resetTime,
    };
  };
}

/**
 * Standard rate limiters
 */
export const rateLimiters = {
  gptEditor: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
    keyGenerator: req => req.headers.get('x-forwarded-for') || 'unknown',
  }),

  gptTest: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
    keyGenerator: req => req.headers.get('x-org-id') || 'unknown',
  }),

  export: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
    keyGenerator: req => req.headers.get('x-org-id') || 'unknown',
  }),

  apiRun: rateLimit({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
    keyGenerator: req => {
      // Rate limit by API key hash
      const apiKey = req.headers.get('x-pf-key');
      if (!apiKey) return 'no-key';

      const crypto = require('crypto');
      return crypto.createHash('sha256').update(apiKey).digest('hex').substring(0, 16);
    },
  }),
};

/**
 * Security headers middleware
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // API-specific security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // CORS headers for API routes
  response.headers.set('Access-Control-Allow-Origin', 'https://chatgpt-prompting.com');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, x-org-id, x-user-id, x-pf-key'
  );
  response.headers.set('Access-Control-Max-Age', '86400');

  // Prevent caching of API responses
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}

/**
 * Error response helper
 */
export function errorResponse(error: APIError | Error | string, status?: number): NextResponse {
  let errorData: any;
  let statusCode = status || 500;

  if (error instanceof APIError) {
    errorData = {
      error: error.apiCode,
      message: error.message,
      details: error.details,
    };
    statusCode = error.code;
  } else if (error instanceof Error) {
    errorData = {
      error: 'INTERNAL_RUN_ERROR',
      message: error.message,
    };
  } else {
    errorData = {
      error: 'INTERNAL_RUN_ERROR',
      message: error,
    };
  }

  const response = NextResponse.json(errorData, { status: statusCode });
  return addSecurityHeaders(response);
}

/**
 * Success response helper
 */
export function successResponse(data: any, status: number = 200): NextResponse {
  const response = NextResponse.json(data, { status });
  return addSecurityHeaders(response);
}

/**
 * Validate required headers
 */
export function validateHeaders(req: NextRequest, required: string[]): string[] {
  const missing: string[] = [];

  for (const header of required) {
    if (!req.headers.get(header)) {
      missing.push(header);
    }
  }

  return missing;
}

/**
 * Extract authentication context from headers
 */
export function getAuthContext(req: NextRequest): {
  orgId: string | null;
  userId: string | null;
  apiKey: string | null;
} {
  return {
    orgId: req.headers.get('x-org-id'),
    userId: req.headers.get('x-user-id'),
    apiKey: req.headers.get('x-pf-key'),
  };
}

/**
 * Validate JSON request body
 */
export async function validateJsonBody(req: NextRequest): Promise<any> {
  try {
    return await req.json();
  } catch (error) {
    throw new APIError('INPUT_SCHEMA_MISMATCH', 'Invalid JSON body');
  }
}

/**
 * Request logger middleware
 */
export function logRequest(
  req: NextRequest,
  context: { method: string; path: string; startTime: number }
): void {
  const { method, path, startTime } = context;
  const duration = Date.now() - startTime;
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const orgId = req.headers.get('x-org-id') || 'anonymous';

  console.log(`[API] ${method} ${path} - ${duration}ms - ${ip} - ${orgId} - ${userAgent}`);
}

/**
 * API wrapper with common middleware
 */
export function withMiddleware<T extends any[]>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse>,
  options: {
    rateLimit?: (
      req: NextRequest
    ) => Promise<{ allowed: boolean; remaining: number; resetTime: number }>;
    requireAuth?: boolean;
    requiredHeaders?: string[];
    logRequests?: boolean;
  } = {}
) {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    const startTime = Date.now();

    try {
      // Rate limiting
      if (options.rateLimit) {
        const rateCheck = await options.rateLimit(req);
        if (!rateCheck.allowed) {
          const response = NextResponse.json(
            {
              error: 'RATE_LIMITED',
              message: 'Rate limit exceeded',
              resetTime: rateCheck.resetTime,
            },
            {
              status: 429,
              headers: {
                'X-RateLimit-Limit': '30',
                'X-RateLimit-Remaining': rateCheck.remaining.toString(),
                'X-RateLimit-Reset': Math.ceil(rateCheck.resetTime / 1000).toString(),
              },
            }
          );
          return addSecurityHeaders(response);
        }
      }

      // Header validation
      if (options.requiredHeaders) {
        const missing = validateHeaders(req, options.requiredHeaders);
        if (missing.length > 0) {
          return errorResponse(
            new APIError('UNAUTHENTICATED', `Missing required headers: ${missing.join(', ')}`)
          );
        }
      }

      // Authentication check
      if (options.requireAuth) {
        const { orgId, userId, apiKey } = getAuthContext(req);
        if (!orgId && !apiKey) {
          return errorResponse(new APIError('UNAUTHENTICATED', 'Authentication required'));
        }
      }

      // Execute handler
      const response = await handler(req, ...args);

      // Add security headers
      const secureResponse = addSecurityHeaders(response);

      // Log request
      if (options.logRequests !== false) {
        logRequest(req, {
          method: req.method,
          path: req.nextUrl.pathname,
          startTime,
        });
      }

      return secureResponse;
    } catch (error) {
      console.error(`[API] Error in ${req.method} ${req.nextUrl.pathname}:`, error);

      // Log error request
      if (options.logRequests !== false) {
        logRequest(req, {
          method: req.method,
          path: req.nextUrl.pathname,
          startTime,
        });
      }

      return errorResponse(error instanceof Error ? error : new Error(String(error)));
    }
  };
}

/**
 * CORS preflight handler
 */
export function corsHandler(req: NextRequest): NextResponse {
  const response = new NextResponse(null, { status: 200 });

  response.headers.set('Access-Control-Allow-Origin', 'https://chatgpt-prompting.com');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, x-org-id, x-user-id, x-pf-key'
  );
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}
