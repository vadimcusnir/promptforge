// app/api/waitlist/route.ts
import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create supabase client only if environment variables are available
function getSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

  if (!supabaseUrl || !supabaseServiceRole) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceRole);
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Waitlist service temporarily unavailable." },
        { status: 503 },
      );
    }

    const { email, name, org_id } = await req.json();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    // Upsert-like behavior with unique(email)
    const { error } = await supabase
      .from("waitlist_signups")
      .insert([
        {
          email: String(email).toLowerCase().trim(),
          name: name?.trim() || null,
        },
      ]);

    // If duplicate, treat as success (idempotent UX)
    if (error && !String(error.message || "").includes("duplicate key")) {
      return NextResponse.json(
        { error: "Database error.", detail: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Bad request.", detail: e?.message },
      { status: 400 },
    );
  }
}
