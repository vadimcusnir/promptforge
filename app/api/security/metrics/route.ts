import { NextResponse } from 'next/server'
import { securityMonitor } from '@/lib/security/security-monitor'

export async function GET() {
  try {
    // Get security metrics for the last 24 hours
    const metrics = await securityMonitor.getSecurityMetrics(24)
    
    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching security metrics:', error)
    return NextResponse.json(
      { error: 'FAILED_TO_FETCH_METRICS', message: 'Failed to fetch security metrics' },
      { status: 500 }
    )
  }
}

// Prevent other HTTP methods
export async function POST() {
  return NextResponse.json(
    { error: 'METHOD_NOT_ALLOWED', message: 'Only GET requests are allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'METHOD_NOT_ALLOWED', message: 'Only GET requests are allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'METHOD_NOT_ALLOWED', message: 'Only GET requests are allowed' },
    { status: 405 }
  )
}
