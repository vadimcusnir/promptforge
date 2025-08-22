import { NextResponse } from "next/server";

/**
 * Standardized API Error System
 * Ensures consistent error responses across all API routes
 */

export const API_ERROR_CODES = {
  // 400 - Bad Request
  INVALID_7D_ENUM: {
    code: 400,
    message: "Invalid 7D enum value",
    type: "INVALID_7D_ENUM"
  },
  MISSING_OUTPUT_FORMAT: {
    code: 400,
    message: "Missing required output_format",
    type: "MISSING_OUTPUT_FORMAT"
  },
  INVALID_REQUEST_FORMAT: {
    code: 400,
    message: "Invalid request format",
    type: "INVALID_REQUEST_FORMAT"
  },
  
  // 401 - Unauthorized
  UNAUTHENTICATED: {
    code: 401,
    message: "Missing or invalid authentication",
    type: "UNAUTHENTICATED"
  },
  INVALID_API_KEY: {
    code: 401,
    message: "Invalid or disabled API key",
    type: "UNAUTHENTICATED"
  },
  MISSING_AUTH_HEADER: {
    code: 401,
    message: "Authentication required",
    type: "UNAUTHENTICATED"
  },
  
  // 403 - Forbidden
  ENTITLEMENT_REQUIRED: {
    code: 403,
    message: "Insufficient permissions",
    type: "ENTITLEMENT_REQUIRED"
  },
  PLAN_UPGRADE_REQUIRED: {
    code: 403,
    message: "Plan upgrade required",
    type: "ENTITLEMENT_REQUIRED"
  },
  
  // 404 - Not Found
  MODULE_NOT_FOUND: {
    code: 404,
    message: "Module not found or disabled",
    type: "MODULE_NOT_FOUND"
  },
  RUN_NOT_FOUND: {
    code: 404,
    message: "Run not found",
    type: "MODULE_NOT_FOUND"
  },
  RESOURCE_NOT_FOUND: {
    code: 404,
    message: "Resource not found",
    type: "MODULE_NOT_FOUND"
  },
  
  // 409 - Conflict
  RULESET_CONFLICT: {
    code: 409,
    message: "Ruleset validation failed",
    type: "RULESET_CONFLICT"
  },
  
  // 422 - Unprocessable Entity
  INPUT_SCHEMA_MISMATCH: {
    code: 422,
    message: "Input validation failed",
    type: "INPUT_SCHEMA_MISMATCH"
  },
  SEVEND_SIGNATURE_MISMATCH: {
    code: 422,
    message: "7D signature mismatch",
    type: "INPUT_SCHEMA_MISMATCH"
  },
  INVALID_CONTENT_LANGUAGE: {
    code: 422,
    message: "Content must be in English only",
    type: "INPUT_SCHEMA_MISMATCH"
  },
  SCORE_BELOW_THRESHOLD: {
    code: 422,
    message: "Score below minimum threshold",
    type: "INPUT_SCHEMA_MISMATCH"
  },
  
  // 429 - Too Many Requests
  RATE_LIMITED: {
    code: 429,
    message: "Rate limit exceeded",
    type: "RATE_LIMITED"
  },
  
  // 500 - Internal Server Error
  INTERNAL_RUN_ERROR: {
    code: 500,
    message: "Internal execution error",
    type: "INTERNAL_RUN_ERROR"
  },
  OPENAI_API_ERROR: {
    code: 503,
    message: "OpenAI service temporarily unavailable",
    type: "INTERNAL_RUN_ERROR"
  },
  DATABASE_ERROR: {
    code: 500,
    message: "Database operation failed",
    type: "INTERNAL_RUN_ERROR"
  },
} as const;

export type APIErrorCode = keyof typeof API_ERROR_CODES;

/**
 * Standardized API Error class
 */
export class StandardAPIError extends Error {
  public readonly code: number;
  public readonly type: string;
  public readonly details?: any;
  public readonly apiCode: APIErrorCode;

  constructor(apiCode: APIErrorCode, details?: any, customMessage?: string) {
    const errorConfig = API_ERROR_CODES[apiCode];
    super(customMessage || errorConfig.message);
    
    this.name = 'StandardAPIError';
    this.apiCode = apiCode;
    this.code = errorConfig.code;
    this.type = errorConfig.type;
    this.details = details;
  }
}

/**
 * Create standardized error response
 */
export function createErrorResponse(
  apiCode: APIErrorCode,
  details?: any,
  customMessage?: string,
  additionalHeaders?: Record<string, string>
): NextResponse {
  const errorConfig = API_ERROR_CODES[apiCode];
  
  const errorBody = {
    error: errorConfig.type,
    message: customMessage || errorConfig.message,
    ...(details && { details }),
  };

  const headers = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Access-Control-Allow-Origin': 'https://chatgpt-prompting.com',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    ...additionalHeaders,
  };

  return NextResponse.json(errorBody, {
    status: errorConfig.code,
    headers,
  });
}

/**
 * Handle rate limit error with proper headers
 */
export function createRateLimitResponse(
  remaining: number,
  resetTime: number,
  customMessage?: string
): NextResponse {
  return createErrorResponse(
    'RATE_LIMITED',
    { remaining, resetTime },
    customMessage,
    {
      'X-RateLimit-Limit': '30',
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
    }
  );
}

/**
 * Handle validation errors from Zod
 */
export function createValidationErrorResponse(zodError: any): NextResponse {
  return createErrorResponse(
    'INPUT_SCHEMA_MISMATCH',
    {
      validation_errors: zodError.errors?.map((err: any) => ({
        field: err.path?.join('.'),
        message: err.message,
        code: err.code,
      })) || [],
    }
  );
}

/**
 * Handle entitlement errors with specific requirements
 */
export function createEntitlementErrorResponse(
  requiredEntitlements: string | string[],
  currentPlan?: string,
  customMessage?: string
): NextResponse {
  const entitlements = Array.isArray(requiredEntitlements) 
    ? requiredEntitlements 
    : [requiredEntitlements];

  return createErrorResponse(
    'ENTITLEMENT_REQUIRED',
    {
      required_entitlements: entitlements,
      current_plan: currentPlan,
    },
    customMessage
  );
}

/**
 * Handle 7D validation errors
 */
export function create7DErrorResponse(
  field: string,
  value?: any,
  allowedValues?: string[]
): NextResponse {
  return createErrorResponse(
    'INVALID_7D_ENUM',
    {
      invalid_field: field,
      invalid_value: value,
      allowed_values: allowedValues,
    },
    `Invalid 7D enum value for field: ${field}`
  );
}

/**
 * Success response helper with consistent headers
 */
export function createSuccessResponse(
  data: any,
  status: number = 200,
  additionalHeaders?: Record<string, string>
): NextResponse {
  const headers = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Access-Control-Allow-Origin': 'https://chatgpt-prompting.com',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    ...additionalHeaders,
  };

  return NextResponse.json(data, {
    status,
    headers,
  });
}

/**
 * CORS preflight response
 */
export function createCORSResponse(): NextResponse {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://chatgpt-prompting.com',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-org-id, x-user-id, x-pf-key',
      'Access-Control-Max-Age': '86400',
    },
  });
}

/**
 * Error handler wrapper for API routes
 */
export function withErrorHandler<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('[API] Unhandled error:', error);

      // Handle StandardAPIError
      if (error instanceof StandardAPIError) {
        return createErrorResponse(error.apiCode, error.details, error.message);
      }

      // Handle Zod validation errors
      if (error && typeof error === 'object' && 'issues' in error) {
        return createValidationErrorResponse(error);
      }

      // Handle OpenAI API errors
      if (error && typeof error === 'object' && 'status' in error) {
        return createErrorResponse('OPENAI_API_ERROR');
      }

      // Generic error fallback
      return createErrorResponse('INTERNAL_RUN_ERROR');
    }
  };
}
