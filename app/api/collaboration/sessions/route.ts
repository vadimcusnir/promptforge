import { NextRequest, NextResponse } from 'next/server'
import { realtimeService } from '@/lib/realtime'
import { z } from 'zod'

const CreateSessionSchema = z.object({
  ownerId: z.string(),
  moduleId: z.string(),
  name: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ownerId, moduleId, name } = CreateSessionSchema.parse(body)

    const session = realtimeService.createSession(ownerId, moduleId, name)

    return NextResponse.json({
      success: true,
      session,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (userId) {
      const userSessions = realtimeService.getUserSessions(userId)
      return NextResponse.json({
        success: true,
        sessions: userSessions,
      })
    }

    const demoSessions = realtimeService.getDemoSessions()
    return NextResponse.json({
      success: true,
      sessions: demoSessions,
    })
  } catch (error) {
    console.error('Session fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}
