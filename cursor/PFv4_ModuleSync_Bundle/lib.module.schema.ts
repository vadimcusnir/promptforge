// lib/module.schema.ts
import { z } from "zod";

export const PlanEnum = z.enum(["free","creator","pro","enterprise"]);
export type Plan = z.infer<typeof PlanEnum>;

export const VectorEnum = z.enum([
  "strategic","rhetoric","content","analytics","branding","crisis","cognitive"
]);
export type Vector = z.infer<typeof VectorEnum>;

export const DifficultyScale = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]);
export type Difficulty = z.infer<typeof DifficultyScale>;

export const ModuleSchema = z.object({
  id: z.string().regex(/^M\d{2}$/),
  title: z.string(),            // canonical title (may include ™ where brand requires)
  slug: z.string(),             // for routes /modules/[slug]
  summary: z.string().min(1),
  vectors: z.array(VectorEnum).min(1),
  difficulty: DifficultyScale,  // canonical = numeric; UI derives labels
  minPlan: PlanEnum,            // gate threshold; frontend & API enforce >=
  tags: z.array(z.string()).default([]),
  outputs: z.array(z.string()).default([]),     // e.g., [".txt",".md",".json",".pdf"]
  spec: z.object({
    inputs: z.record(z.any()).default({}),      // input schema (lightweight for UI; full spec server-side)
    kpis: z.array(z.string()).default([]),
    constraints: z.array(z.string()).default([]),
  }).default({ inputs: {}, kpis: [], constraints: []}),
  version: z.string().default("4.0.0"),
  deprecated: z.boolean().default(false)
});

export type Module = z.infer<typeof ModuleSchema>;

export const CatalogSchema = z.array(ModuleSchema).superRefine((arr, ctx) => {
  const ids = new Set<string>();
  if (arr.length !== 50) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Catalog must contain exactly 50 modules; received ${arr.length}`
    });
  }
  arr.forEach(m => {
    if (ids.has(m.id)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Duplicate module id: ${m.id}` });
    } else {
      ids.add(m.id);
    }
  });
});
