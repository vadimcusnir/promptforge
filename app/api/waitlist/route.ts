import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Only create client if environment variables are available
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 })
    }

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
