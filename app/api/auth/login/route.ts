import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = LoginSchema.parse(body)

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Authentication service not available' },
        { status: 503 }
      )
    }

    // Demo mode - simulate successful login
    if (email === 'demo@example.com' && password === 'password') {
      return NextResponse.json({
        user: { id: 'demo-user', email: 'demo@example.com' },
        session: { access_token: 'mock-token' },
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
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
