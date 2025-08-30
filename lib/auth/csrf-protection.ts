import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'
import { randomBytes, createHash, timingSafeEqual } from 'crypto'

export interface CSRFToken {
  token: string
  expiresAt: Date
}

export class CSRFProtection {
  private supabase: any
  private readonly TOKEN_LENGTH = 32
  private readonly TOKEN_EXPIRY_MINUTES = 30

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  /**
   * Generate a new CSRF token for a user
   */
  async generateToken(userId: string): Promise<CSRFToken> {
    const token = randomBytes(this.TOKEN_LENGTH).toString('hex')
    const tokenHash = this.hashToken(token)
    const expiresAt = new Date(Date.now() + this.TOKEN_EXPIRY_MINUTES * 60 * 1000)

    // Store token hash in database
    const { error } = await this.supabase
      .from('csrf_tokens')
      .insert({
        user_id: userId,
        token_hash: tokenHash,
        expires_at: expiresAt.toISOString(),
      })

    if (error) {
      throw new Error(`Failed to generate CSRF token: ${error.message}`)
    }

    return {
      token,
      expiresAt,
    }
  }

  /**
   * Validate a CSRF token
   */
  async validateToken(userId: string, token: string): Promise<boolean> {
    if (!token || token.length !== this.TOKEN_LENGTH * 2) {
      return false
    }

    const tokenHash = this.hashToken(token)

    // Find valid token in database
    const { data, error } = await this.supabase
      .from('csrf_tokens')
      .select('*')
      .eq('user_id', userId)
      .eq('token_hash', tokenHash)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !data) {
      return false
    }

    // Mark token as used
    await this.supabase
      .from('csrf_tokens')
      .update({ used: true })
      .eq('id', data.id)

    return true
  }

  /**
   * Get CSRF token from request headers
   */
  getTokenFromRequest(request: NextRequest): string | null {
    // Check X-CSRF-Token header first
    const headerToken = request.headers.get('x-csrf-token')
    if (headerToken) {
      return headerToken
    }

    // Check X-Requested-With header (for AJAX requests)
    const requestedWith = request.headers.get('x-requested-with')
    if (requestedWith === 'XMLHttpRequest') {
      // For AJAX requests, we might accept a different token source
      return request.headers.get('x-csrf-token') || null
    }

    return null
  }

  /**
   * Validate CSRF token from request
   */
  async validateRequest(request: NextRequest, userId: string): Promise<boolean> {
    // Skip CSRF validation for GET, HEAD, OPTIONS requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      return true
    }

    // Skip CSRF validation for API routes that use proper authentication
    const pathname = request.nextUrl.pathname
    if (pathname.startsWith('/api/auth/') && 
        ['login', 'signup', 'refresh'].some(endpoint => pathname.includes(endpoint))) {
      return true
    }

    const token = this.getTokenFromRequest(request)
    if (!token) {
      return false
    }

    return await this.validateToken(userId, token)
  }

  /**
   * Clean up expired CSRF tokens
   */
  async cleanupExpiredTokens(): Promise<void> {
    await this.supabase
      .from('csrf_tokens')
      .delete()
      .lt('expires_at', new Date().toISOString())
  }

  /**
   * Hash token for secure storage
   */
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex')
  }

  /**
   * Generate CSRF token for client-side use
   */
  async getClientToken(userId: string): Promise<string> {
    const { token } = await this.generateToken(userId)
    return token
  }
}

/**
 * Middleware to add CSRF protection to API routes
 */
export function withCSRFProtection(handler: Function) {
  return async (request: NextRequest, context: any) => {
    const csrfProtection = new CSRFProtection()
    
    // Extract user ID from request (assuming it's available in context or headers)
    const userId = context?.userId || request.headers.get('x-user-id')
    
    if (userId) {
      const isValid = await csrfProtection.validateRequest(request, userId)
      if (!isValid) {
        return new Response(
          JSON.stringify({ error: 'CSRF token validation failed' }),
          { 
            status: 403,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
    }

    return handler(request, context)
  }
}

/**
 * Generate CSRF token endpoint handler
 */
export async function generateCSRFTokenHandler(request: NextRequest) {
  try {
    const csrfProtection = new CSRFProtection()
    
    // Get user ID from authenticated session
    const userId = request.headers.get('x-user-id')
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const { token, expiresAt } = await csrfProtection.generateToken(userId)
    
    return new Response(
      JSON.stringify({ 
        token,
        expiresAt: expiresAt.toISOString()
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    )
  } catch (error) {
    console.error('CSRF token generation error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate CSRF token' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
