/**
 * Security utilities for environment variable validation and secret management
 */

import { z } from 'zod'

// Schema for server-side only environment variables
const serverEnvSchema = z.object({
  // Database and API keys (NEVER expose to client)
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required'),
  SENDGRID_API_KEY: z.string().min(1, 'SENDGRID_API_KEY is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  ENCRYPTION_KEY: z.string().min(32, 'ENCRYPTION_KEY must be at least 32 characters'),
  
  // URLs and public keys (safe for client)
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required'),
  
  // Optional configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DEBUG: z.string().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
})

// Schema for client-side environment variables
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required'),
  NEXT_PUBLIC_BASE_URL: z.string().url('NEXT_PUBLIC_BASE_URL must be a valid URL'),
})

/**
 * Validate server-side environment variables
 * This should only be called on the server side
 */
export function validateServerEnv() {
  if (typeof window !== 'undefined') {
    throw new Error('validateServerEnv() cannot be called on the client side')
  }

  try {
    return serverEnvSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.'))
      throw new Error(`Missing or invalid environment variables: ${missingVars.join(', ')}`)
    }
    throw error
  }
}

/**
 * Validate client-side environment variables
 * This can be called on both client and server side
 */
export function validateClientEnv() {
  try {
    return clientEnvSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.'))
      throw new Error(`Missing or invalid client environment variables: ${missingVars.join(', ')}`)
    }
    throw error
  }
}

/**
 * Check if a key is safe to expose to the client
 */
export function isClientSafeKey(key: string): boolean {
  return key.startsWith('NEXT_PUBLIC_')
}

/**
 * Get all client-safe environment variables
 */
export function getClientSafeEnv() {
  const clientEnv: Record<string, string> = {}
  
  Object.keys(process.env).forEach(key => {
    if (isClientSafeKey(key)) {
      clientEnv[key] = process.env[key]!
    }
  })
  
  return clientEnv
}

/**
 * Sanitize environment variables for logging (remove sensitive values)
 */
export function sanitizeEnvForLogging(env: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {}
  
  Object.keys(env).forEach(key => {
    if (key.includes('SECRET') || key.includes('KEY') || key.includes('PASSWORD')) {
      sanitized[key] = '[REDACTED]'
    } else if (key.includes('URL') || key.includes('HOST')) {
      sanitized[key] = env[key]
    } else {
      sanitized[key] = env[key]
    }
  })
  
  return sanitized
}

/**
 * Validate that no sensitive keys are exposed to the client
 */
export function validateNoSensitiveKeysExposed() {
  if (typeof window === 'undefined') return // Server side, no risk
  
  const sensitiveKeys = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'SENDGRID_API_KEY',
    'JWT_SECRET',
    'ENCRYPTION_KEY'
  ]
  
  const exposedKeys = sensitiveKeys.filter(key => 
    (window as any)[key] !== undefined
  )
  
  if (exposedKeys.length > 0) {
    console.error('CRITICAL SECURITY ISSUE: Sensitive keys exposed to client:', exposedKeys)
    throw new Error(`Sensitive keys exposed to client: ${exposedKeys.join(', ')}`)
  }
}

/**
 * Initialize security validation
 */
export function initializeSecurity() {
  try {
    // Validate environment variables
    if (typeof window === 'undefined') {
      validateServerEnv()
    } else {
      validateClientEnv()
      validateNoSensitiveKeysExposed()
    }
    
    console.log('Security validation completed successfully')
  } catch (error) {
    console.error('Security validation failed:', error)
    throw error
  }
}
