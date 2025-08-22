// lib/auth.ts
import { cookies } from "next/headers";

export type SessionUser = { id?: string; email?: string; role?: "admin" | "member" };

export function getUserFromCookies(): SessionUser {
  // Simple & robust: read a "pf_role" cookie set at login (admin|member)
  // Integrate with Supabase/NextAuth as needed.
  const pfRole = cookies().get("pf_role")?.value ?? "member";
  const userId = cookies().get("pf_uid")?.value ?? undefined;
  const email = cookies().get("pf_email")?.value ?? undefined;
  return { id: userId, email, role: pfRole === "admin" ? "admin" : "member" };
}

export function isAdmin() {
  return getUserFromCookies().role === "admin";
}
