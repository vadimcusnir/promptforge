import { NextRequest, NextResponse } from "next/server";
import { executeGuarded } from "@/agent";
import { Params7D } from "@/lib/default-params";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { moduleId, params7d, plan, intent } = body;

    // Exemplu simplu fără executeGuarded
    return NextResponse.json({
      success: true,
      data: {
        moduleId,
        params7d,
        plan,
        intent: intent || "simulate",
        message: "Module execution ready (example endpoint)"
      }
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
