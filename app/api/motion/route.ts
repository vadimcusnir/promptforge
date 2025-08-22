import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { on } = await req.json().catch(() => ({}));
    const motionValue = on ? "on" : "off";
    
    const res = NextResponse.json({ 
      ok: true, 
      motion: motionValue 
    });
    
    res.cookies.set("motion", motionValue, { 
      httpOnly: false, 
      sameSite: "lax", 
      path: "/" 
    });
    
    return res;
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Invalid request" }, 
      { status: 400 }
    );
  }
}
