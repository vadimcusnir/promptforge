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
  private supabase: any

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  // Generate secure tokens with rotation
  async generateTokens(userId: string, sessionId: string) {
    const accessToken = await this.generateAccessToken(userId, sessionId)
    const refreshToken = await this.generateRefreshToken(userId, sessionId)
    
    // Store refresh token hash in database
    const refreshHash = createHash('sha256').update(refreshToken).digest('hex')
    await this.supabase
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

    return this.supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: userId,
      options: {
        data: payload
      }
    })
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

    return this.supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: userId,
      options: {
        data: payload
      }
    })
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
        const { data: { user }, error } = await this.supabase.auth.getUser(accessToken)
        if (!error && user) {
          return { valid: true, userId: user.id }
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
      const { data: { user }, error } = await this.supabase.auth.getUser(refreshToken)
      if (error || !user) {
        this.trackRefreshAttempt(tokenHash)
        return { valid: false }
      }

      // Check if session is still active in database
      const { data: session } = await this.supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('refresh_hash', tokenHash)
        .eq('is_active', true)
        .single()

      if (!session) {
        this.trackRefreshAttempt(tokenHash)
        return { valid: false }
      }

      // Generate new tokens
      const newTokens = await this.generateTokens(user.id, session.session_id)
      
      // Invalidate old refresh token
      await this.supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('refresh_hash', tokenHash)

      return { valid: true, userId: user.id, newTokens }
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
