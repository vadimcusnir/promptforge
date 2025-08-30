export interface SecurityConfig {
  rateLimits: {
    login: { maxAttempts: number; windowMinutes: number; blockDurationMinutes: number }
    passwordReset: { maxAttempts: number; windowMinutes: number; blockDurationMinutes: number }
    mfa: { maxAttempts: number; windowMinutes: number; blockDurationMinutes: number }
    api: { maxAttempts: number; windowMinutes: number; blockDurationMinutes: number }
  }
  session: {
    maxConcurrentSessions: number
    sessionTimeoutMinutes: number
    refreshThresholdMinutes: number
  }
  mfa: {
    required: boolean
    backupCodesCount: number
    totpWindow: number
  }
  csrf: {
    enabled: boolean
    tokenExpiryMinutes: number
    skipPaths: string[]
  }
  anomalyDetection: {
    enabled: boolean
    rules: {
      multipleFailedLogins: { enabled: boolean; threshold: number; windowMinutes: number }
      unusualLocation: { enabled: boolean; maxLocations: number; windowHours: number }
      rapidApiCalls: { enabled: boolean; threshold: number; windowMinutes: number }
      concurrentSessions: { enabled: boolean; maxSessions: number }
    }
  }
  email: {
    verificationExpiryMinutes: number
    passwordResetExpiryMinutes: number
    mfaRecoveryExpiryMinutes: number
  }
  deviceFingerprinting: {
    enabled: boolean
    trustThreshold: number
    maxDevices: number
  }
}

export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  rateLimits: {
    login: {
      maxAttempts: 5,
      windowMinutes: 15,
      blockDurationMinutes: 60
    },
    passwordReset: {
      maxAttempts: 3,
      windowMinutes: 60,
      blockDurationMinutes: 120
    },
    mfa: {
      maxAttempts: 3,
      windowMinutes: 5,
      blockDurationMinutes: 30
    },
    api: {
      maxAttempts: 100,
      windowMinutes: 15,
      blockDurationMinutes: 60
    }
  },
  session: {
    maxConcurrentSessions: 5,
    sessionTimeoutMinutes: 7 * 24 * 60, // 7 days
    refreshThresholdMinutes: 24 * 60 // 24 hours
  },
  mfa: {
    required: false,
    backupCodesCount: 10,
    totpWindow: 1
  },
  csrf: {
    enabled: true,
    tokenExpiryMinutes: 30,
    skipPaths: [
      '/api/auth/login',
      '/api/auth/signup',
      '/api/auth/refresh',
      '/api/auth/forgot-password'
    ]
  },
  anomalyDetection: {
    enabled: true,
    rules: {
      multipleFailedLogins: {
        enabled: true,
        threshold: 5,
        windowMinutes: 15
      },
      unusualLocation: {
        enabled: true,
        maxLocations: 3,
        windowHours: 24
      },
      rapidApiCalls: {
        enabled: true,
        threshold: 100,
        windowMinutes: 5
      },
      concurrentSessions: {
        enabled: true,
        maxSessions: 5
      }
    }
  },
  email: {
    verificationExpiryMinutes: 24 * 60, // 24 hours
    passwordResetExpiryMinutes: 60, // 1 hour
    mfaRecoveryExpiryMinutes: 30 // 30 minutes
  },
  deviceFingerprinting: {
    enabled: true,
    trustThreshold: 0.8,
    maxDevices: 10
  }
}

export class SecurityConfigManager {
  private config: SecurityConfig

  constructor(config?: Partial<SecurityConfig>) {
    this.config = { ...DEFAULT_SECURITY_CONFIG, ...config }
  }

  getConfig(): SecurityConfig {
    return this.config
  }

  updateConfig(updates: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...updates }
  }

  getRateLimitConfig(action: string) {
    const rateLimits = this.config.rateLimits
    switch (action) {
      case 'login':
        return rateLimits.login
      case 'password_reset':
        return rateLimits.passwordReset
      case 'mfa':
        return rateLimits.mfa
      case 'api':
      default:
        return rateLimits.api
    }
  }

  isCSRFRequired(path: string): boolean {
    if (!this.config.csrf.enabled) return false
    return !this.config.csrf.skipPaths.some(skipPath => path.includes(skipPath))
  }

  getSessionConfig() {
    return this.config.session
  }

  getMFAConfig() {
    return this.config.mfa
  }

  getEmailConfig() {
    return this.config.email
  }

  getAnomalyDetectionConfig() {
    return this.config.anomalyDetection
  }

  getDeviceFingerprintingConfig() {
    return this.config.deviceFingerprinting
  }
}

// Global security config instance
export const securityConfig = new SecurityConfigManager()
