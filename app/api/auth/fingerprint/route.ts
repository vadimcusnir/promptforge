import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { DeviceFingerprintCollector } from '@/lib/auth/device-fingerprint'
import { authenticateUser } from '@/lib/auth/server-auth'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Fingerprint schema
const fingerprintSchema = z.object({
  components: z.object({
    userAgent: z.string(),
    screenResolution: z.string(),
    timezone: z.string(),
    language: z.string(),
    platform: z.string(),
    cookieEnabled: z.boolean(),
    doNotTrack: z.boolean(),
    hardwareConcurrency: z.number(),
    deviceMemory: z.number().optional(),
    colorDepth: z.number(),
    pixelRatio: z.number(),
    touchSupport: z.boolean(),
    webglVendor: z.string().optional(),
    webglRenderer: z.string().optional()
  })
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const { components } = fingerprintSchema.parse(body)

    // Authenticate user
    const { user, error } = await authenticateUser(request)
    if (error || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Generate device fingerprint
    const fingerprint = JSON.stringify(components)
    
    // Parse device information
    const deviceType = DeviceFingerprintCollector.getDeviceType(components.userAgent)
    const browserInfo = DeviceFingerprintCollector.getBrowserInfo(components.userAgent)
    const osInfo = DeviceFingerprintCollector.getOSInfo(components.userAgent)
    
    const deviceInfo = {
      type: deviceType,
      browser: browserInfo.name,
      os: osInfo.name
    }

    // Store fingerprint (this would integrate with your database)
    // For now, we'll just return success

    return NextResponse.json({
      success: true,
      fingerprint,
      deviceInfo
    })

  } catch (error) {
    console.error('Fingerprint error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
