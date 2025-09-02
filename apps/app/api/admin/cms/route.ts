import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient, checkAdminRole } from "@/lib/admin/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "blog"
    const status = searchParams.get("status")

    // Get session and check admin role
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In production, get orgId from session/context
    const orgId = "default-org"
    const hasAccess = await checkAdminRole(session.user.id, orgId)
    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    let query = supabase
      .from("posts")
      .select("*")
      .eq("org_id", orgId)
      .eq("type", type)
      .order("created_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    const { data: posts, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ posts })
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

    const { title, content, status, type, publishedAt, metadata } = body

    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        title,
        content,
        status: status || "draft",
        type: type || "blog",
        published_at: publishedAt,
        metadata,
        org_id: orgId,
        author_id: session.user.id,
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
      action: "cms_post_created",
      target: post.id,
      metadata: { title, type, status },
    })

    return NextResponse.json({ post })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
