/**
 * Rate Limiting Utility for API Routes
 * Provides in-memory rate limiting with configurable limits and window sizes
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string; // Custom error message
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Check if a request is within rate limits
   */
  check(key: string, config: RateLimitConfig): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.store[key];

    if (!entry || now > entry.resetTime) {
      // First request or window expired
      this.store[key] = {
        count: 1,
        resetTime: now + config.windowMs
      };
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: now + config.windowMs
      };
    }

    if (entry.count >= config.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      };
    }

    // Increment counter
    entry.count++;
    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  /**
   * Destroy the rate limiter and cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store = {};
  }
}

// Create a singleton instance
const rateLimiter = new RateLimiter();

/**
 * Rate limiting middleware for API routes
 */
export function createRateLimit(config: RateLimitConfig) {
  return function rateLimitMiddleware(identifier: string) {
    const result = rateLimiter.check(identifier, config);
    
    if (!result.allowed) {
      throw new Error(config.message || 'Rate limit exceeded');
    }
    
    return result;
  };
}

/**
 * Predefined rate limit configurations
 */
export const RATE_LIMITS = {
  // Strict limits for AI operations
  AI_OPERATIONS: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    message: 'Too many AI operations. Please wait before trying again.'
  },
  
  // Moderate limits for general API usage
  API_GENERAL: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
    message: 'Too many requests. Please wait before trying again.'
  },
  
  // Strict limits for authentication attempts
  AUTH_ATTEMPTS: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: 'Too many authentication attempts. Please wait before trying again.'
  },
  
  // Limits for export operations
  EXPORT_OPERATIONS: {
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 3,
    message: 'Too many export attempts. Please wait before trying again.'
  }
};

/**
 * Get client identifier for rate limiting
 */
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  // Use the first available IP header, fallback to a default
  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
  
  // For authenticated users, combine IP with user ID for better rate limiting
  const userId = request.headers.get('x-user-id') || 'anonymous';
  
  return `${ip}:${userId}`;
}

export default rateLimiter;
