// app/api/admin-verify/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Check if user has admin role cookie
    const adminRole = req.cookies.get("pf_role")?.value;
    
    if (adminRole !== "admin") {
      return NextResponse.json({ 
        authenticated: false, 
        error: "Not authenticated as admin" 
      }, { status: 401 });
    }

    // Check if we have the required admin cookies
    const adminUid = req.cookies.get("pf_uid")?.value;
    const adminEmail = req.cookies.get("pf_email")?.value;
    
    if (!adminUid || !adminEmail) {
      return NextResponse.json({ 
        authenticated: false, 
        error: "Incomplete admin session" 
      }, { status: 401 });
    }

    // Admin session is valid
    return NextResponse.json({ 
      authenticated: true, 
      role: "admin",
      message: "Admin session valid" 
    });

  } catch (error) {
    return NextResponse.json({ 
      authenticated: false, 
      error: "Authentication check failed" 
    }, { status: 500 });
  }
}
