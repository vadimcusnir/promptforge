import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient, checkAdminRole } from "@/lib/admin/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()

    // Get session and check admin role
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orgId = "default-org"
    const hasAccess = await checkAdminRole(session.user.id, orgId)
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get organization members
    const { data: members, error } = await supabase
      .from("org_members")
      .select(`
        *,
        users:user_id (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
      .eq("org_id", orgId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ members })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    // Get session and check admin role
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const orgId = "default-org"
    const hasAccess = await checkAdminRole(session.user.id, orgId)
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { action, email, role, userId } = body

    if (action === "invite") {
      // Create invitation
      const { data: invitation, error } = await supabase
        .from("invitations")
        .insert({
          email,
          role,
          org_id: orgId,
          invited_by: session.user.id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Log admin action
      await supabase.from("admin_actions").insert({
        user_id: session.user.id,
        org_id: orgId,
        action: "member_invited",
        target: invitation.id,
        metadata: { email, role },
      })

      return NextResponse.json({ invitation })
    }

    if (action === "update_role") {
      const { data: member, error } = await supabase
        .from("org_members")
        .update({ role })
        .eq("user_id", userId)
        .eq("org_id", orgId)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Log admin action
      await supabase.from("admin_actions").insert({
        user_id: session.user.id,
        org_id: orgId,
        action: "member_role_updated",
        target: userId,
        metadata: { role },
      })

      return NextResponse.json({ member })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
