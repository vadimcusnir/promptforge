// ============================================================================
// PROMPTFORGE v3.1 - CANONICAL MODULE SCHEMA
// Single Source of Truth (SSOT) for all module definitions
// ============================================================================

import { z } from 'zod'

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export const MODULE_VECTORS = [
  'strategic',
  'rhetoric', 
  'content',
  'analytics',
  'branding',
  'crisis',
  'cognitive'
] as const

export const MODULE_PLANS = [
  'free',
  'creator', 
  'pro',
  'enterprise'
] as const

export const MODULE_DIFFICULTY = [1, 2, 3, 4, 5] as const

export const MODULE_OUTPUTS = [
  'txt',
  'md', 
  'pdf',
  'json',
  'zip'
] as const

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

const ModuleVectorSchema = z.enum(MODULE_VECTORS)
const ModulePlanSchema = z.enum(MODULE_PLANS)
const ModuleDifficultySchema = z.number().min(1).max(5)
const ModuleOutputSchema = z.enum(MODULE_OUTPUTS)

const ModuleSpecSchema = z.object({
  inputs: z.record(z.any()).describe('Input schema for the module'),
  kpis: z.object({
    clarity_min: z.number().min(0).max(100),
    execution_min: z.number().min(0).max(100),
    business_fit_min: z.number().min(0).max(100),
    custom_metrics: z.record(z.any()).optional()
  }),
  constraints: z.array(z.string()).optional()
})

const ModuleSchema = z.object({
  id: z.string().regex(/^M\d{2}$/, 'Module ID must be M01-M50 format'),
  title: z.string().min(1).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  summary: z.string().min(10).max(500),
  vectors: z.array(ModuleVectorSchema).min(1).max(3),
  difficulty: ModuleDifficultySchema,
  minPlan: ModulePlanSchema,
  tags: z.array(z.string()).max(10),
  outputs: z.array(ModuleOutputSchema).min(1),
  spec: ModuleSpecSchema,
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be semver format'),
  deprecated: z.boolean().default(false)
})

const ModuleCatalogSchema = z.object({
  version: z.string(),
  modules: z.record(ModuleSchema).refine(
    (modules) => Object.keys(modules).length === 50,
    'Catalog must contain exactly 50 modules'
  ).refine(
    (modules) => {
      const ids = Object.keys(modules)
      const expectedIds = Array.from({length: 50}, (_, i) => `M${String(i + 1).padStart(2, '0')}`)
      return JSON.stringify(ids.sort()) === JSON.stringify(expectedIds.sort())
    },
    'Module IDs must be M01-M50 in sequence'
  )
})

// ============================================================================
// TYPESCRIPT TYPES
// ============================================================================

export type ModuleVector = z.infer<typeof ModuleVectorSchema>
export type ModulePlan = z.infer<typeof ModulePlanSchema>
export type ModuleDifficulty = z.infer<typeof ModuleDifficultySchema>
export type ModuleOutput = z.infer<typeof ModuleOutputSchema>
export type ModuleSpec = z.infer<typeof ModuleSpecSchema>
export type Module = z.infer<typeof ModuleSchema>
export type ModuleCatalog = z.infer<typeof ModuleCatalogSchema>

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export function validateModule(module: unknown): Module {
  return ModuleSchema.parse(module)
}

export function validateModuleCatalog(catalog: unknown): ModuleCatalog {
  return ModuleCatalogSchema.parse(catalog)
}

export function getDifficultyLabel(difficulty: ModuleDifficulty): string {
  const labels: Record<number, string> = {
    1: 'Beginner',
    2: 'Beginner+', 
    3: 'Intermediate',
    4: 'Advanced',
    5: 'Expert'
  }
  return labels[difficulty]
}

export function getPlanDisplayName(plan: ModulePlan): string {
  const names = {
    free: 'Free',
    creator: 'Creator',
    pro: 'Pro', 
    enterprise: 'Enterprise'
  }
  return names[plan]
}

export function canUserAccessModule(userPlan: ModulePlan, moduleMinPlan: ModulePlan): boolean {
  const planHierarchy = {
    free: 0,
    creator: 1,
    pro: 2,
    enterprise: 3
  }
  return planHierarchy[userPlan] >= planHierarchy[moduleMinPlan]
}

export function getAvailableOutputs(userPlan: ModulePlan): ModuleOutput[] {
  const outputsByPlan: Record<ModulePlan, ModuleOutput[]> = {
    free: ['txt'],
    creator: ['txt', 'md'],
    pro: ['txt', 'md', 'pdf', 'json'],
    enterprise: ['txt', 'md', 'pdf', 'json', 'zip']
  }
  return outputsByPlan[userPlan]
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  ModuleSchema,
  ModuleCatalogSchema,
  ModuleVectorSchema,
  ModulePlanSchema,
  ModuleDifficultySchema,
  ModuleOutputSchema,
  ModuleSpecSchema
}
