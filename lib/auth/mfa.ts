import { createClient } from '@supabase/supabase-js'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'

// MFA Configuration
const MFA_CONFIG = {
  ISSUER: 'PromptForge',
  ALGORITHM: 'sha1',
  DIGITS: 6,
  PERIOD: 30,
  WINDOW: 1, // Allow 1 window of tolerance
  BACKUP_CODES_COUNT: 10
}

export interface MFASetup {
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
}

export interface MFAVerification {
  isValid: boolean
  isBackupCode: boolean
  remainingBackupCodes?: number
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
            }),
            delete: () => ({
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
        is_enabled: false, // Will be enabled after verification
        created_at: new Date().toISOString()
      })

    return {
      secret,
      qrCodeUrl,
      backupCodes
    }
  }

  // Verify MFA token and enable MFA
  async verifyAndEnableMFA(userId: string, token: string): Promise<boolean> {
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
        .update({ is_enabled: true })
        .eq('user_id', userId)
    }

    return isValid
  }

  // Verify MFA token for login
  async verifyMFAToken(userId: string, token: string): Promise<MFAVerification> {
    const { data: mfaData, error } = await this.getSupabase()
      .from('user_mfa')
      .select('secret, backup_codes')
      .eq('user_id', userId)
      .eq('is_enabled', true)
      .single()

    if (error || !mfaData) {
      return { isValid: false, isBackupCode: false }
    }

    // Check if it's a backup code
    const backupCodeIndex = mfaData.backup_codes.indexOf(token)
    if (backupCodeIndex !== -1) {
      // Remove used backup code
      const updatedBackupCodes = mfaData.backup_codes.filter((_: string, index: number) => index !== backupCodeIndex)
      
      await this.getSupabase()
        .from('user_mfa')
        .update({ backup_codes: updatedBackupCodes })
        .eq('user_id', userId)

      return {
        isValid: true,
        isBackupCode: true,
        remainingBackupCodes: updatedBackupCodes.length
      }
    }

    // Verify TOTP token
    const isValid = authenticator.verify({
      token,
      secret: mfaData.secret
    })

    return {
      isValid,
      isBackupCode: false,
      remainingBackupCodes: mfaData.backup_codes.length
    }
  }

  // Check if user has MFA enabled
  async isMFAEnabled(userId: string): Promise<boolean> {
    const { data, error } = await this.getSupabase()
      .from('user_mfa')
      .select('is_enabled')
      .eq('user_id', userId)
      .single()

    return !error && data?.is_enabled === true
  }

  // Disable MFA for user
  async disableMFA(userId: string, password: string): Promise<boolean> {
    // Verify password first (this would need to be implemented)
    // For now, we'll just disable MFA
    
    const { error } = await this.getSupabase()
      .from('user_mfa')
      .update({ is_enabled: false })
      .eq('user_id', userId)

    return !error
  }

  // Generate new backup codes
  async regenerateBackupCodes(userId: string): Promise<string[]> {
    const newBackupCodes = this.generateBackupCodes()

    await this.getSupabase()
      .from('user_mfa')
      .update({ backup_codes: newBackupCodes })
      .eq('user_id', userId)

    return newBackupCodes
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

  // Get MFA status for user
  async getMFAStatus(userId: string): Promise<{
    isEnabled: boolean
    backupCodesRemaining: number
    lastUsed?: string
  }> {
    const { data, error } = await this.getSupabase()
      .from('user_mfa')
      .select('is_enabled, backup_codes, last_used')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return {
        isEnabled: false,
        backupCodesRemaining: 0
      }
    }

    return {
      isEnabled: data.is_enabled,
      backupCodesRemaining: data.backup_codes?.length || 0,
      lastUsed: data.last_used
    }
  }
}

// Export singleton instance
export const mfaManager = new MFAManager()
