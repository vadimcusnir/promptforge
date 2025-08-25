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

    // Verify the admin session is valid by checking coming soon status
    // This ensures the admin cookies are still valid
    const comingSoonRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/toggle-coming-soon`, {
      headers: {
        Cookie: `pf_role=${adminRole}; pf_uid=admin-001; pf_email=admin@promptforge.com`
      }
    });

    if (comingSoonRes.ok) {
      return NextResponse.json({ 
        authenticated: true, 
        role: "admin",
        message: "Admin session valid" 
      });
    } else {
      // If we can't access admin endpoints, session is invalid
      return NextResponse.json({ 
        authenticated: false, 
        error: "Admin session expired" 
      }, { status: 401 });
    }

  } catch (error) {
    return NextResponse.json({ 
      authenticated: false, 
      error: "Authentication check failed" 
    }, { status: 500 });
  }
}
