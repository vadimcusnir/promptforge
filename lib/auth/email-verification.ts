import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'

export interface EmailVerificationToken {
  id: string
  userId: string
  email: string
  token: string
  type: 'password_reset' | 'email_verification' | 'mfa_recovery'
  expiresAt: Date
  used: boolean
  createdAt: Date
}

export class EmailVerificationManager {
  private supabase: any

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  /**
   * Generate email verification token
   */
  async generateToken(
    userId: string,
    email: string,
    type: 'password_reset' | 'email_verification' | 'mfa_recovery',
    expiresInMinutes: number = 60
  ): Promise<EmailVerificationToken> {
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000)

    const tokenData = {
      user_id: userId,
      email,
      token,
      type,
      expires_at: expiresAt.toISOString(),
      used: false,
      created_at: new Date().toISOString()
    }

    const { data, error } = await this.supabase
      .from('email_verification_tokens')
      .insert(tokenData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to generate verification token: ${error.message}`)
    }

    return this.mapTokenData(data)
  }

  /**
   * Verify email token
   */
  async verifyToken(
    token: string,
    type: 'password_reset' | 'email_verification' | 'mfa_recovery'
  ): Promise<EmailVerificationToken | null> {
    const { data, error } = await this.supabase
      .from('email_verification_tokens')
      .select('*')
      .eq('token', token)
      .eq('type', type)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !data) {
      return null
    }

    return this.mapTokenData(data)
  }

  /**
   * Mark token as used
   */
  async markTokenAsUsed(tokenId: string): Promise<void> {
    const { error } = await this.supabase
      .from('email_verification_tokens')
      .update({ used: true })
      .eq('id', tokenId)

    if (error) {
      throw new Error(`Failed to mark token as used: ${error.message}`)
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<boolean> {
    try {
      // Check if user exists
      const { data: user, error: userError } = await this.supabase
        .from('users')
        .select('id, email')
        .eq('email', email)
        .single()

      if (userError || !user) {
        // Don't reveal if user exists for security
        return true
      }

      // Generate reset token
      const tokenData = await this.generateToken(user.id, email, 'password_reset', 60)

      // Send email (implementation depends on your email service)
      await this.sendEmail({
        to: email,
        subject: 'Reset Your PromptForge Password',
        template: 'password-reset',
        data: {
          resetUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${tokenData.token}`,
          expiresIn: '1 hour'
        }
      })

      return true
    } catch (error) {
      console.error('Failed to send password reset email:', error)
      return false
    }
  }

  /**
   * Send email verification
   */
  async sendEmailVerification(userId: string, email: string): Promise<boolean> {
    try {
      const tokenData = await this.generateToken(userId, email, 'email_verification', 24 * 60) // 24 hours

      await this.sendEmail({
        to: email,
        subject: 'Verify Your PromptForge Email',
        template: 'email-verification',
        data: {
          verificationUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${tokenData.token}`,
          expiresIn: '24 hours'
        }
      })

      return true
    } catch (error) {
      console.error('Failed to send email verification:', error)
      return false
    }
  }

  /**
   * Send MFA recovery email
   */
  async sendMFARecoveryEmail(userId: string, email: string): Promise<boolean> {
    try {
      const tokenData = await this.generateToken(userId, email, 'mfa_recovery', 30) // 30 minutes

      await this.sendEmail({
        to: email,
        subject: 'MFA Recovery - PromptForge',
        template: 'mfa-recovery',
        data: {
          recoveryUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/mfa-recovery?token=${tokenData.token}`,
          expiresIn: '30 minutes'
        }
      })

      return true
    } catch (error) {
      console.error('Failed to send MFA recovery email:', error)
      return false
    }
  }

  /**
   * Clean up expired tokens
   */
  async cleanupExpiredTokens(): Promise<number> {
    const { data, error } = await this.supabase
      .from('email_verification_tokens')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id')

    if (error) {
      throw new Error(`Failed to cleanup expired tokens: ${error.message}`)
    }

    return data?.length || 0
  }

  /**
   * Get user's verification tokens
   */
  async getUserTokens(userId: string, type?: string): Promise<EmailVerificationToken[]> {
    let query = this.supabase
      .from('email_verification_tokens')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to get user tokens: ${error.message}`)
    }

    return data.map(this.mapTokenData)
  }

  /**
   * Send email using your email service
   */
  private async sendEmail(emailData: {
    to: string
    subject: string
    template: string
    data: Record<string, any>
  }): Promise<void> {
    // This is a placeholder - implement with your email service (SendGrid, AWS SES, etc.)
    console.log('Sending email:', emailData)
    
    // Example implementation with a hypothetical email service:
    /*
    const emailService = new EmailService()
    await emailService.send({
      to: emailData.to,
      subject: emailData.subject,
      template: emailData.template,
      data: emailData.data
    })
    */
  }

  /**
   * Map database token data to interface
   */
  private mapTokenData(data: any): EmailVerificationToken {
    return {
      id: data.id,
      userId: data.user_id,
      email: data.email,
      token: data.token,
      type: data.type,
      expiresAt: new Date(data.expires_at),
      used: data.used,
      createdAt: new Date(data.created_at)
    }
  }
}

/**
 * Email templates
 */
export const EMAIL_TEMPLATES = {
  'password-reset': {
    subject: 'Reset Your PromptForge Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password</h2>
        <p>You requested to reset your password for your PromptForge account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="{{resetUrl}}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        <p>This link will expire in {{expiresIn}}.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
      </div>
    `
  },
  'email-verification': {
    subject: 'Verify Your PromptForge Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Email Address</h2>
        <p>Please verify your email address to complete your PromptForge account setup.</p>
        <a href="{{verificationUrl}}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
        <p>This link will expire in {{expiresIn}}.</p>
      </div>
    `
  },
  'mfa-recovery': {
    subject: 'MFA Recovery - PromptForge',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>MFA Recovery</h2>
        <p>You requested to recover access to your PromptForge account.</p>
        <a href="{{recoveryUrl}}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Recover Account</a>
        <p>This link will expire in {{expiresIn}}.</p>
        <p>If you didn't request this recovery, please secure your account immediately.</p>
      </div>
    `
  }
}
