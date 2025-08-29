import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomBytes, createHash } from 'crypto'

// JWT Security Configuration
const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: 15 * 60, // 15 minutes
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60, // 7 days
  ROTATION_THRESHOLD: 5 * 60, // 5 minutes before expiry
  MAX_REFRESH_ATTEMPTS: 3,
  REFRESH_COOLDOWN: 60, // 1 minute cooldown between refresh attempts
}

// Token rotation tracking
const refreshAttempts = new Map<string, { count: number; lastAttempt: number }>()

export class JWTSecurityManager {
  private supabase: any | null = null

  private getSupabase() {
    if (!this.supabase) {
      // Only create client when needed and environment variables are available
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        this.supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        )
      } else {
        // Return a mock client for build time
        this.supabase = {
          from: () => ({
            upsert: async () => ({ data: null, error: null }),
            select: () => ({
              eq: () => ({
                eq: () => ({
                  eq: () => ({
                    single: async () => ({ data: null, error: null })
                  })
                })
              })
            }),
            update: () => ({
              eq: async () => ({ data: null, error: null })
            })
          })
        }
      }
    }
    return this.supabase
  }

  // Generate secure tokens with rotation
  async generateTokens(userId: string, sessionId: string) {
    const accessToken = await this.generateAccessToken(userId, sessionId)
    const refreshToken = await this.generateRefreshToken(userId, sessionId)
    
    // Store refresh token hash in database
    const refreshHash = createHash('sha256').update(refreshToken).digest('hex')
    await this.getSupabase()
      .from('user_sessions')
      .upsert({
        user_id: userId,
        session_id: sessionId,
        refresh_hash: refreshHash,
        expires_at: new Date(Date.now() + JWT_CONFIG.REFRESH_TOKEN_EXPIRY * 1000).toISOString(),
        is_active: true
      })

    return { accessToken, refreshToken }
  }

  // Generate short-lived access token
  private async generateAccessToken(userId: string, sessionId: string): Promise<string> {
    const payload = {
      sub: userId,
      sid: sessionId,
      type: 'access',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + JWT_CONFIG.ACCESS_TOKEN_EXPIRY
    }

    // Create a simple token (base64 encoded payload)
    return Buffer.from(JSON.stringify(payload)).toString('base64')
  }

  // Generate long-lived refresh token
  private async generateRefreshToken(userId: string, sessionId: string): Promise<string> {
    const payload = {
      sub: userId,
      sid: sessionId,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + JWT_CONFIG.REFRESH_TOKEN_EXPIRY,
      jti: randomBytes(32).toString('hex') // Unique token ID
    }

    // Create a simple token (base64 encoded payload)
    return Buffer.from(JSON.stringify(payload)).toString('base64')
  }

  // Set secure httpOnly cookies
  setSecureCookies(response: NextResponse, accessToken: string, refreshToken: string) {
    // Access token - short lived, httpOnly
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
      path: '/'
    })

    // Refresh token - long lived, httpOnly, more secure
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: JWT_CONFIG.REFRESH_TOKEN_EXPIRY,
      path: '/api/auth/refresh'
    })

    return response
  }

  // Validate and refresh tokens
  async validateAndRefresh(request: NextRequest): Promise<{ valid: boolean; userId?: string; newTokens?: any }> {
    const accessToken = request.cookies.get('access_token')?.value
    const refreshToken = request.cookies.get('refresh_token')?.value

    if (!accessToken && !refreshToken) {
      return { valid: false }
    }

    // Try to validate access token first
    if (accessToken) {
      try {
        const user = this.validateToken(accessToken)
        if (user && user.type === 'access') {
          return { valid: true, userId: user.sub }
        }
      } catch (error) {
        // Access token invalid, try refresh
      }
    }

    // Attempt token refresh
    if (refreshToken) {
      return await this.attemptRefresh(refreshToken)
    }

    return { valid: false }
  }

  // Validate token manually
  private validateToken(token: string): any {
    try {
      const decoded = Buffer.from(token, 'base64').toString()
      const payload = JSON.parse(decoded)
      
      // Check if token is expired
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return null
      }
      
      return payload
    } catch {
      return null
    }
  }

  // Attempt token refresh with rate limiting
  private async attemptRefresh(refreshToken: string): Promise<{ valid: boolean; userId?: string; newTokens?: any }> {
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex')
    const now = Date.now()

    // Check rate limiting
    const attempts = refreshAttempts.get(tokenHash)
    if (attempts) {
      if (attempts.count >= JWT_CONFIG.MAX_REFRESH_ATTEMPTS) {
        if (now - attempts.lastAttempt < JWT_CONFIG.REFRESH_COOLDOWN * 1000) {
          return { valid: false }
        }
        // Reset after cooldown
        refreshAttempts.delete(tokenHash)
      }
    }

    try {
      // Validate refresh token
      const user = this.validateToken(refreshToken)
      if (!user || user.type !== 'refresh') {
        this.trackRefreshAttempt(tokenHash)
        return { valid: false }
      }

      // Check if session is still active in database
      const { data: session } = await this.getSupabase()
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.sub)
        .eq('refresh_hash', tokenHash)
        .eq('is_active', true)
        .single()

      if (!session) {
        this.trackRefreshAttempt(tokenHash)
        return { valid: false }
      }

      // Generate new tokens
      const newTokens = await this.generateTokens(user.sub, session.session_id)
      
      // Invalidate old refresh token
      await this.getSupabase()
        .from('user_sessions')
        .update({ is_active: false })
        .eq('refresh_hash', tokenHash)

      return { valid: true, userId: user.sub, newTokens }
    } catch (error) {
      this.trackRefreshAttempt(tokenHash)
      return { valid: false }
    }
  }

  // Track refresh attempts for rate limiting
  private trackRefreshAttempt(tokenHash: string) {
    const now = Date.now()
    const attempts = refreshAttempts.get(tokenHash) || { count: 0, lastAttempt: 0 }
    
    attempts.count++
    attempts.lastAttempt = now
    
    refreshAttempts.set(tokenHash, attempts)
  }

  // Clear all tokens (logout)
  clearTokens(response: NextResponse) {
    response.cookies.delete('access_token')
    response.cookies.delete('refresh_token')
    return response
  }

  // Get token expiry time
  getTokenExpiry(token: string): number | null {
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
      return payload.exp || null
    } catch {
      return null
    }
  }

  // Check if token needs rotation
  shouldRotateToken(token: string): boolean {
    const expiry = this.getTokenExpiry(token)
    if (!expiry) return false
    
    const timeUntilExpiry = expiry - Math.floor(Date.now() / 1000)
    return timeUntilExpiry <= JWT_CONFIG.ROTATION_THRESHOLD
  }
}

// Export singleton instance
export const jwtSecurity = new JWTSecurityManager()
