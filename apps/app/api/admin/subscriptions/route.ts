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

    // Get subscription data
    const { data: subscription, error } = await supabase.from("subscriptions").select("*").eq("org_id", orgId).single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ subscription })
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

    const { action, planId, priceId } = body

    // Handle subscription changes
    if (action === "change_plan") {
      // In production, this would integrate with Stripe
      const { data: updatedSubscription, error } = await supabase
        .from("subscriptions")
        .update({
          plan_id: planId,
          price_id: priceId,
          updated_at: new Date().toISOString(),
        })
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
        action: "subscription_changed",
        target: updatedSubscription.id,
        metadata: { planId, priceId },
      })

      return NextResponse.json({ subscription: updatedSubscription })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
