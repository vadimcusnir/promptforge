import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Waitlist schema
const waitlistSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required'),
  company: z.string().optional(),
  role: z.string().optional(),
  source: z.string().optional()
})

// Lazy Supabase client creation
  async function getSupabase() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Return mock client for build-time operations
      return {
        from: () => ({
          insert: () => ({
            select: () => Promise.resolve({ data: null, error: null })
          })
        })
      } as unknown
    }
    
    const { createClient } = await import('@supabase/supabase-js')
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  }

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabase() as any

    const { name, email } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("waitlist_signups")
      .insert([
        {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "This email is already on our waitlist" }, { status: 409 })
      }

      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to join waitlist. Please try again." }, { status: 500 })
    }

    return NextResponse.json({ message: "Successfully joined waitlist", data }, { status: 201 })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
