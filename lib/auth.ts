// lib/auth.ts
import { cookies } from "next/headers";

export type SessionUser = {
  id?: string;
  email?: string;
  role?: "admin" | "member";
};

export async function getUserFromCookies(): Promise<SessionUser> {
  // Simple & robust: read a "pf_role" cookie set at login (admin|member)
  // Integrate with Supabase/NextAuth as needed.
  const cookieStore = await cookies();
  const pfRole = cookieStore.get("pf_role")?.value ?? "member";
  const userId = cookieStore.get("pf_uid")?.value ?? undefined;
  const email = cookieStore.get("pf_email")?.value ?? undefined;
  return { id: userId, email, role: pfRole === "admin" ? "admin" : "member" };
}

export async function isAdmin(): Promise<boolean> {
  const user = await getUserFromCookies();
  return user.role === "admin";
}
