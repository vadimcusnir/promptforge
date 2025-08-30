import { createClient } from '@supabase/supabase-js'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'

// MFA Configuration
const MFA_CONFIG = {
  ISSUER: 'PromptForge',
  ALGORITHM: 'sha1',
  DIGITS: 6,
  PERIOD: 30,
  WINDOW: 1,
  BACKUP_CODES_COUNT: 10
}

export interface MFASetup {
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
}

export interface MFAStatus {
  totpEnabled: boolean
  smsEnabled: boolean
  emailEnabled: boolean
  backupCodes: string[]
  lastUsed?: string
}

export interface MFAAttempt {
  id: string
  userId: string
  method: 'totp' | 'backup_code' | 'sms' | 'email'
  success: boolean
  ipAddress: string
  userAgent: string
  created_at: string
}

export class MFAManager {
  private supabase: any | null = null

  private getSupabase() {
    if (!this.supabase) {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        this.supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY
        )
      } else {
        // Mock client for build time
        this.supabase = {
          from: () => ({
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: null, error: null })
              })
            }),
            insert: () => Promise.resolve({ data: null, error: null }),
            update: () => ({
              eq: () => Promise.resolve({ data: null, error: null })
            })
          })
        }
      }
    }
    return this.supabase
  }

  // Generate MFA setup for user
  async generateMFASetup(userId: string, userEmail: string): Promise<MFASetup> {
    const secret = authenticator.generateSecret()
    const backupCodes = this.generateBackupCodes()

    // Generate QR code URL
    const otpAuthUrl = authenticator.keyuri(
      userEmail,
      MFA_CONFIG.ISSUER,
      secret
    )
    
    const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl)

    // Store secret and backup codes in database
    await this.getSupabase()
      .from('user_mfa')
      .insert({
        user_id: userId,
        secret: secret,
        backup_codes: backupCodes,
        is_enabled: false,
        created_at: new Date().toISOString()
      })

    return {
      secret,
      qrCodeUrl,
      backupCodes
    }
  }

  // Verify and enable TOTP
  async verifyAndEnableTOTP(userId: string, token: string): Promise<boolean> {
    const { data: mfaData, error } = await this.getSupabase()
      .from('user_mfa')
      .select('secret, backup_codes')
      .eq('user_id', userId)
      .eq('is_enabled', false)
      .single()

    if (error || !mfaData) {
      return false
    }

    // Verify the token
    const isValid = authenticator.verify({
      token,
      secret: mfaData.secret
    })

    if (isValid) {
      // Enable MFA
      await this.getSupabase()
        .from('user_mfa')
        .update({ 
          is_enabled: true,
          last_used: new Date().toISOString()
        })
        .eq('user_id', userId)
    }

    return isValid
  }

  // Verify TOTP token
  async verifyTOTP(userId: string, token: string): Promise<boolean> {
    const { data: mfaData, error } = await this.getSupabase()
      .from('user_mfa')
      .select('secret')
      .eq('user_id', userId)
      .eq('is_enabled', true)
      .single()

    if (error || !mfaData) {
      return false
    }

    // Verify TOTP token
    const isValid = authenticator.verify({
      token,
      secret: mfaData.secret
    })

    if (isValid) {
      // Update last used
      await this.getSupabase()
        .from('user_mfa')
        .update({ last_used: new Date().toISOString() })
        .eq('user_id', userId)
    }

    return isValid
  }

  // Verify backup code
  async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    const { data: mfaData, error } = await this.getSupabase()
      .from('user_mfa')
      .select('backup_codes')
      .eq('user_id', userId)
      .eq('is_enabled', true)
      .single()

    if (error || !mfaData) {
      return false
    }

    const backupCodeIndex = mfaData.backup_codes.indexOf(code)
    if (backupCodeIndex !== -1) {
      // Remove used backup code
      const updatedBackupCodes = mfaData.backup_codes.filter((_: string, index: number) => index !== backupCodeIndex)
      
      await this.getSupabase()
        .from('user_mfa')
        .update({ 
          backup_codes: updatedBackupCodes,
          last_used: new Date().toISOString()
        })
        .eq('user_id', userId)

      return true
    }

    return false
  }

  // Check if MFA is enabled
  async isMFAEnabled(userId: string): Promise<boolean> {
    const { data, error } = await this.getSupabase()
      .from('user_mfa')
      .select('is_enabled')
      .eq('user_id', userId)
      .single()

    return !error && data?.is_enabled === true
  }

  // Get MFA status
  async getMFAStatus(userId: string): Promise<MFAStatus> {
    const { data, error } = await this.getSupabase()
      .from('user_mfa')
      .select('is_enabled, backup_codes, last_used')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return {
        totpEnabled: false,
        smsEnabled: false,
        emailEnabled: false,
        backupCodes: []
      }
    }

    return {
      totpEnabled: data.is_enabled,
      smsEnabled: false, // Not implemented yet
      emailEnabled: false, // Not implemented yet
      backupCodes: data.backup_codes || [],
      lastUsed: data.last_used
    }
  }

  // Disable MFA
  async disableMFA(userId: string): Promise<boolean> {
    const { error } = await this.getSupabase()
      .from('user_mfa')
      .update({ is_enabled: false })
      .eq('user_id', userId)

    return !error
  }

  // Regenerate backup codes
  async regenerateBackupCodes(userId: string): Promise<string[]> {
    const newBackupCodes = this.generateBackupCodes()

    await this.getSupabase()
      .from('user_mfa')
      .update({ backup_codes: newBackupCodes })
      .eq('user_id', userId)

    return newBackupCodes
  }

  // Get MFA attempts
  async getMFAAttempts(userId: string, limit: number = 10): Promise<MFAAttempt[]> {
    const { data, error } = await this.getSupabase()
      .from('mfa_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching MFA attempts:', error)
      return []
    }

    return data || []
  }

  // Log MFA attempt
  async logMFAAttempt(
    userId: string,
    method: 'totp' | 'backup_code' | 'sms' | 'email',
    success: boolean,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    await this.getSupabase()
      .from('mfa_attempts')
      .insert({
        user_id: userId,
        method,
        success,
        ip_address: ipAddress,
        user_agent: userAgent,
        created_at: new Date().toISOString()
      })
  }

  // Check if MFA is required for user
  async isMFARequired(userId: string): Promise<boolean> {
    return await this.isMFAEnabled(userId)
  }

  // Initialize MFA setup
  async initializeMFA(userId: string, userEmail: string): Promise<string> {
    const setup = await this.generateMFASetup(userId, userEmail)
    return setup.secret
  }

  // Generate backup codes
  private generateBackupCodes(): string[] {
    const codes: string[] = []
    for (let i = 0; i < MFA_CONFIG.BACKUP_CODES_COUNT; i++) {
      codes.push(this.generateBackupCode())
    }
    return codes
  }

  // Generate single backup code
  private generateBackupCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}

// Export singleton instance
export const mfaManager = new MFAManager()