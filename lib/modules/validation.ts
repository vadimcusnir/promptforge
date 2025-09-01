import { z } from 'zod';
import { catalogData } from '../modules';

// Define the exact vectors that should be available
const VALID_VECTORS = [
  'strategic', 'operations', 'branding', 'content', 'analytics', 'sales', 'technical', 'crisis_management'
] as const;

// Define the exact plans
const VALID_PLANS = ['FREE', 'CREATOR', 'PRO', 'ENTERPRISE'] as const;

// Module schema validation
const ModuleSchema = z.object({
  id: z.string().regex(/^M\d{2}$/, 'Module ID must be in format M01-M50'),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  summary: z.string().min(1, 'Summary is required'),
  vectors: z.array(z.enum(VALID_VECTORS)).min(1, 'At least one vector is required'),
  difficulty: z.number().int().min(1).max(5, 'Difficulty must be between 1-5'),
  minPlan: z.enum(VALID_PLANS),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  outputs: z.array(z.string()).min(1, 'At least one output format is required'),
  version: z.string().min(1, 'Version is required'),
  deprecated: z.boolean().optional(),
  sevenDDefaults: z.object({
    domain: z.string().optional(),
    scale: z.enum(['individual', 'team', 'organization', 'enterprise']).optional(),
    urgency: z.enum(['low', 'normal', 'high', 'critical']).optional(),
    complexity: z.enum(['simple', 'medium', 'complex', 'expert']).optional(),
    resources: z.enum(['minimal', 'standard', 'extended', 'unlimited']).optional(),
    application: z.enum(['prompt_engineering', 'content_creation', 'analysis', 'strategy', 'crisis_management']).optional(),
    output: z.enum(['text', 'markdown', 'json', 'bundle']).optional(),
  }).optional(),
});

// Catalog validation schema
const CatalogSchema = z.object({
  version: z.string().min(1, 'Catalog version is required'),
  modules: z.record(z.string(), ModuleSchema)
    .refine(
      (modules) => Object.keys(modules).length === 50,
      'Catalog must contain exactly 50 modules'
    )
    .refine(
      (modules) => {
        const ids = Object.keys(modules);
        const uniqueIds = new Set(ids);
        return ids.length === uniqueIds.size;
      },
      'Module IDs must be unique'
    )
    .refine(
      (modules) => {
        const ids = Object.keys(modules);
        const expectedIds = Array.from({ length: 50 }, (_, i) => `M${String(i + 1).padStart(2, '0')}`);
        return expectedIds.every(id => ids.includes(id));
      },
      'Catalog must contain modules M01 through M50'
    )
});

// Validation function that throws on failure (for CI)
export function validateModuleCatalog(): void {
  try {
    const result = CatalogSchema.safeParse(catalogData);
    
    if (!result.success) {
      console.error('❌ Module catalog validation failed:');
      result.error.errors.forEach(error => {
        console.error(`  - ${error.path.join('.')}: ${error.message}`);
      });
      throw new Error(`Module catalog validation failed: ${result.error.errors.length} errors found`);
    }
    
    console.log('✅ Module catalog validation passed');
    console.log(`📊 Catalog contains ${Object.keys(catalogData.modules).length} modules`);
    
    // Additional validation: check for duplicate IDs in the actual data
    const moduleIds = Object.values(catalogData.modules).map(m => m.id);
    const uniqueIds = new Set(moduleIds);
    if (moduleIds.length !== uniqueIds.size) {
      throw new Error('Duplicate module IDs found in catalog data');
    }
    
  } catch (error) {
    console.error('🚨 CRITICAL: Module catalog validation failed');
    throw error;
  }
}

// Safe validation function that returns boolean (for runtime checks)
export function isModuleCatalogValid(): boolean {
  try {
    validateModuleCatalog();
    return true;
  } catch {
    return false;
  }
}

// Export the schemas for use in other parts of the application
export { ModuleSchema, CatalogSchema, VALID_VECTORS, VALID_PLANS };
