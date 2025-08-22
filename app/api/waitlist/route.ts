import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, source, utm_source, utm_medium, utm_campaign } = body

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Email este obligatoriu" },
        { status: 400 }
      )
    }

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Numele este obligatoriu" },
        { status: 400 }
      )
    }

    const cleanEmail = email.toLowerCase().trim()
    const cleanName = name.trim()

    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("waitlist_signups")
      .select("email")
      .eq("email", cleanEmail)
      .limit(1)

    if (checkError) {
      console.error("Database check error:", checkError)
      return NextResponse.json(
        { error: "Eroare la verificarea bazei de date" },
        { status: 500 }
      )
    }

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json(
        { error: "Acest email este deja înregistrat în lista de așteptare" },
        { status: 409 }
      )
    }

    // Insert new waitlist signup
    const { data, error } = await supabase
      .from("waitlist_signups")
      .insert([
        {
          email: cleanEmail,
          name: cleanName,
          source: source || "coming-soon",
          utm_source,
          utm_medium,
          utm_campaign,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Database insert error:", error)
      return NextResponse.json(
        { error: "Eroare la salvarea în baza de date" },
        { status: 500 }
      )
    }

    // Log success for monitoring
    console.log(`New waitlist signup: ${cleanEmail} (${cleanName})`)

    return NextResponse.json(
      { 
        success: true, 
        message: "Te-ai înscris cu succes în lista de așteptare!",
        data: data?.[0] 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Waitlist API error:", error)
    return NextResponse.json(
      { error: "Eroare internă de server" },
      { status: 500 }
    )
  }
}

// Handle GET requests (for health check or stats)
export async function GET() {
  try {
    // Get total waitlist count (without exposing emails)
    const { count, error } = await supabase
      .from("waitlist_signups")
      .select("*", { count: "exact", head: true })

    if (error) {
      console.error("Database count error:", error)
      return NextResponse.json(
        { error: "Eroare la obținerea statisticilor" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      totalSignups: count || 0,
      message: "Waitlist API is operational"
    })

  } catch (error) {
    console.error("Waitlist GET API error:", error)
    return NextResponse.json(
      { error: "Eroare internă de server" },
      { status: 500 }
    )
  }
}
