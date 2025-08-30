// app/api/admin-login/route.ts
import { NextRequest, NextResponse } from "next/server";

// Simple admin login for testing - replace with proper auth later
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "promptforge2024";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const res = NextResponse.json({
      ok: true,
      message: "Admin login successful",
      role: "admin",
    });

    // Set admin cookies
    res.cookies.set("pf_role", "admin", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    res.cookies.set("pf_uid", "admin-001", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    res.cookies.set("pf_email", "admin@promptforge.com", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

// Logout endpoint
export async function DELETE(_req: NextRequest) {
  const res = NextResponse.json({ ok: true, message: "Logged out" });

  // Clear admin cookies
  res.cookies.set("pf_role", "", { maxAge: 0, path: "/" });
  res.cookies.set("pf_uid", "", { maxAge: 0, path: "/" });
  res.cookies.set("pf_email", "", { maxAge: 0, path: "/" });

  return res;
}
