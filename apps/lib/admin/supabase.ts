import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createAdminClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

export async function checkAdminRole(userId: string, orgId: string): Promise<boolean> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("org_members")
    .select("role")
    .eq("user_id", userId)
    .eq("org_id", orgId)
    .single()

  if (error || !data) return false

  return ["owner", "admin"].includes(data.role)
}

export async function getOrgMembers(orgId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("org_members")
    .select(`
      *,
      users:user_id (
        id,
        email,
        full_name
      )
    `)
    .eq("org_id", orgId)

  if (error) throw error
  return data
}
