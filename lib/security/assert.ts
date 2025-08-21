import { db } from "@/lib/db";
import { headers } from "next/headers";

export async function assertMembership(orgId?: string) {
  const h = headers();
  const userId = h.get("x-user-id");
  if (!orgId || !userId) throw new Error("UNAUTHENTICATED");
  const ok = await db.isMember(orgId, userId);
  if (!ok) throw new Error("FORBIDDEN");
}

export async function assertEntitlement(orgId: string, flag: string) {
  const has = await db.effectiveEntitlement(orgId, flag); // funcția SQL din Supabase
  if (!has) {
    const e = new Error("ENTITLEMENT_REQUIRED");
    (e as any).flag = flag;
    throw e;
  }
}
