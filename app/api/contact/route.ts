import { NextRequest, NextResponse } from "next/server";

interface ContactFormData {
  name: string;
  email: string;
  domain: string;
  intention: string;
  message: string;
  acceptTerms: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validation
    if (!body.name || !body.email || !body.domain || !body.intention || !body.message) {
      return NextResponse.json(
        { error: "Toate câmpurile sunt obligatorii" },
        { status: 400 }
      );
    }

    if (!body.acceptTerms) {
      return NextResponse.json(
        { error: "Trebuie să accepți termenii" },
        { status: 400 }
      );
    }

    if (body.message.length < 150) {
      return NextResponse.json(
        { error: "Mesajul trebuie să aibă cel puțin 150 de caractere" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Adresa de email nu este validă" },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Log the contact request
    // 4. Trigger any automated responses

    // For now, we'll just log and return success
    console.log("Contact form submission:", {
      name: body.name,
      email: body.email,
      domain: body.domain,
      intention: body.intention,
      messageLength: body.message.length,
      timestamp: new Date().toISOString(),
    });

    // TODO: Implement actual contact handling logic
    // - Save to Supabase contacts table
    // - Send email notification to admin
    // - Trigger automated response system

    return NextResponse.json(
      { 
        success: true, 
        message: "Semnalul a fost primit cu succes",
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Contact form error:", error);
    
    return NextResponse.json(
      { 
        error: "Eroare internă la procesarea semnalului",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
