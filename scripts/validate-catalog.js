const { catalogData } = require('../lib/modules.ts');

function validateModuleCatalog() {
  console.log('🔍 Validating module catalog...');
  
  // Check if we have exactly 50 modules
  const moduleCount = Object.keys(catalogData.modules).length;
  if (moduleCount !== 50) {
    throw new Error(`Expected 50 modules, found ${moduleCount}`);
  }
  
  // Check for unique IDs
  const moduleIds = Object.values(catalogData.modules).map(m => m.id);
  const uniqueIds = new Set(moduleIds);
  if (moduleIds.length !== uniqueIds.size) {
    throw new Error('Duplicate module IDs found');
  }
  
  // Check for M01-M50
  const expectedIds = Array.from({ length: 50 }, (_, i) => `M${String(i + 1).padStart(2, '0')}`);
  const actualIds = Object.keys(catalogData.modules);
  
  for (const expectedId of expectedIds) {
    if (!actualIds.includes(expectedId)) {
      throw new Error(`Missing module ${expectedId}`);
    }
  }
  
  // Check vectors
  const validVectors = ['strategic', 'operations', 'branding', 'content', 'analytics', 'sales', 'technical', 'crisis_management'];
  
  for (const module of Object.values(catalogData.modules)) {
    for (const vector of module.vectors) {
      if (!validVectors.includes(vector)) {
        throw new Error(`Invalid vector "${vector}" in module ${module.id}`);
      }
    }
  }
  
  // Check difficulties
  for (const module of Object.values(catalogData.modules)) {
    if (module.difficulty < 1 || module.difficulty > 5 || !Number.isInteger(module.difficulty)) {
      throw new Error(`Invalid difficulty ${module.difficulty} in module ${module.id}`);
    }
  }
  
  // Check plans
  const validPlans = ['FREE', 'CREATOR', 'PRO', 'ENTERPRISE'];
  for (const module of Object.values(catalogData.modules)) {
    if (!validPlans.includes(module.minPlan)) {
      throw new Error(`Invalid plan "${module.minPlan}" in module ${module.id}`);
    }
  }
  
  console.log('✅ Module catalog validation passed');
  console.log(`📊 Catalog contains ${moduleCount} modules`);
  console.log(`🔢 Version: ${catalogData.version}`);
}

try {
  validateModuleCatalog();
} catch (error) {
  console.error('❌ Validation failed:', error.message);
  process.exit(1);
}
