// app/api/modules/route.ts
import { NextResponse } from "next/server";
import { CatalogSchema, Module } from "@/lib/module.schema";
import catalog from "@/lib/modules.catalog.json";

const validate = () => {
  const parsed = CatalogSchema.safeParse(catalog);
  if (!parsed.success) {
    const err = parsed.error.issues.map(i => i.message).join("; ");
    return { ok: false, error: err };
  }
  return { ok: true, data: catalog as Module[] };
};

export async function GET() {
  const v = validate();
  if (!v.ok) return NextResponse.json({ status: "error", error: v.error }, { status: 500 });

  // TODO: read user/org entitlements from session to apply plan gates per user
  // For public endpoint, we return catalog with fields necessary for listing.
  const payload = v.data.map(m => ({
    id: m.id,
    title: m.title,
    slug: m.slug,
    summary: m.summary,
    vectors: m.vectors,
    difficulty: m.difficulty,
    minPlan: m.minPlan,
    tags: m.tags,
    outputs: m.outputs,
    version: m.version,
  }));

  return NextResponse.json({ status: "ok", modules: payload });
}
