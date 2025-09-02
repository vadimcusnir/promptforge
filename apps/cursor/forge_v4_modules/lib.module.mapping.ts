// lib/module.mapping.ts
// Legacy v3 → v4 canonical mapping
import { Vector, Plan, Difficulty } from "./module.schema";

export const mapCategoryV3ToV4 = (cats: string[] | string): Vector[] => {
  const list = Array.isArray(cats) ? cats : [cats];
  const norm = (s: string) => s.trim().toLowerCase();

  const map: Record<string, Vector> = {
    // v3 → v4
    "strategic": "strategic",
    "rhetoric": "rhetoric",
    "content": "content",
    "data": "analytics",
    "analytics": "analytics",
    "branding": "branding",
    "memetic": "branding",
    "crisis": "crisis",
    "cognitive": "cognitive",
  };

  const out: Vector[] = [];
  for (const c of list.map(norm)) {
    const v = map[c];
    if (v && !out.includes(v)) out.push(v);
  }
  return out.length ? out : ["strategic"]; // safe default
};

export const mapPlanV3ToV4 = (plan: string): Plan => {
  switch ((plan || "").toLowerCase()) {
    case "pilot": return "creator";    // pilot → Creator (v4 pricing model)
    case "pro": return "pro";
    case "enterprise": return "enterprise";
    default: return "free";
  }
};

export const mapDifficultyV3ToV4 = (level: number | string): Difficulty => {
  const n = typeof level === "string"
    ? ({ beginner:1, "beginner+":2, intermediate:3, advanced:4, expert:5 } as any)[level.toLowerCase()] ?? Number(level)
    : level;

  if (n <= 1) return 1;
  if (n === 2) return 2;
  if (n === 3) return 3;
  if (n === 4) return 4;
  return 5;
};

export const labelForDifficulty = (d: Difficulty): string => (
  {1:"Beginner",2:"Beginner+",3:"Intermediate",4:"Advanced",5:"Expert"}[d]
);
