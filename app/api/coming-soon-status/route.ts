// app/api/coming-soon-status/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Check both environment variable and cookie
  const comingSoonEnv = process.env.COMING_SOON === "true";
  const comingSoonCookie = req.cookies.get("coming_soon")?.value === "on";
  
  const isActive = comingSoonEnv || comingSoonCookie;
  
  return NextResponse.json({ 
    active: isActive,
    source: comingSoonEnv ? "env" : comingSoonCookie ? "cookie" : "none"
  });
}
