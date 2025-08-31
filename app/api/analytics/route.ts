import { NextRequest, NextResponse } from 'next/server'
import { analytics } from '@/lib/analytics'
import { z } from 'zod'
// Force dynamic rendering
export const dynamic = 'force-dynamic'

const AnalyticsEventSchema = z.object({
  event_type: z.string(),
  properties: z.record(z.any()).optional(),
})
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_type, properties } = AnalyticsEventSchema.parse(body)
    await analytics.track(event_type, properties || {})
    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    if (userId) {
      const metrics = await analytics.getUserMetrics(userId)
      return NextResponse.json({ metrics })
    const moduleStats = await analytics.getModuleUsageStats()
    return NextResponse.json({ moduleStats })
