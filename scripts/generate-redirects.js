#!/usr/bin/env node

/**
 * Redirect Generation Script
 * Generates redirects.json from module registry and validates redirects
 */

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadModuleRegistry() {
  const registryPath = path.join(__dirname, '..', 'lib', 'modules.ts');
  
  if (!fs.existsSync(registryPath)) {
    log('❌ Module registry not found', 'red');
    return null;
  }
  
  try {
    const registryContent = fs.readFileSync(registryPath, 'utf8');
    
    // Extract module definitions from the registry
    const moduleMatches = registryContent.match(/export const \w+_MODULE[^}]+}/g);
    
    if (!moduleMatches) {
      log('⚠️  No modules found in registry', 'yellow');
      return [];
    }
    
    const modules = [];
    moduleMatches.forEach(match => {
      // Extract module ID and slug from the match
      const idMatch = match.match(/id:\s*['"`]([^'"`]+)['"`]/);
      const slugMatch = match.match(/slug:\s*['"`]([^'"`]+)['"`]/);
      
      if (idMatch && slugMatch) {
        modules.push({
          id: idMatch[1],
          slug: slugMatch[1]
        });
      }
    });
    
    log(`📋 Loaded ${modules.length} modules from registry`, 'blue');
    return modules;
    
  } catch (error) {
    log(`❌ Error loading module registry: ${error.message}`, 'red');
    return null;
  }
}

function loadExistingRedirects() {
  const redirectsPath = path.join(__dirname, '..', 'lib', 'redirects.json');
  
  if (!fs.existsSync(redirectsPath)) {
    log('⚠️  No existing redirects file found', 'yellow');
    return { redirects: [], analytics: { totalRedirects: 0, redirectsByType: {}, redirectsByDay: {}, topLegacySlugs: [], lastAnalyticsUpdate: null } };
  }
  
  try {
    const redirects = JSON.parse(fs.readFileSync(redirectsPath, 'utf8'));
    log(`📋 Loaded ${redirects.redirects.length} existing redirects`, 'blue');
    return redirects;
  } catch (error) {
    log(`❌ Error loading existing redirects: ${error.message}`, 'red');
    return { redirects: [], analytics: { totalRedirects: 0, redirectsByType: {}, redirectsByDay: {}, topLegacySlugs: [], lastAnalyticsUpdate: null } };
  }
}

function generateRedirectsFromRegistry(modules) {
  const redirects = [];
  
  // Define legacy slug mappings (these would come from your migration history)
  const legacyMappings = {
    'risk-and-trust-reversal': 'trust-reversal-protocol',
    'crisis-communication': 'crisis-communication-playbook',
    'social-media-calendar': 'social-content-grid',
    'content-calendar-optimizer': 'social-content-grid',
    'landing-page-optimizer': 'landing-page-alchemist',
    'influencer-partnership-framework': 'influence-partnership-frame',
    'content-performance-analyzer': 'content-analytics-dashboard',
    'content-personalization-engine': 'momentum-campaign-builder',
    'database-design-optimizer': 'data-schema-optimizer',
    'microservices-architecture': 'microservices-grid',
    'security-architecture-framework': 'security-fortress-frame',
    'performance-optimization-engine': 'performance-engine',
    'container-orchestration-strategy': 'orchestration-matrix',
    'cloud-infrastructure-architect': 'cloud-infra-map',
    'sales-process-optimizer': 'sales-flow-architect',
    'sales-operations-framework': 'sales-flow-architect',
    'sales-enablement-framework': 'enablement-frame',
    'sales-intelligence-framework': 'negotiation-dynamics',
    'quality-management-system': 'quality-system-map',
    'supply-chain-optimizer': 'supply-flow-optimizer',
    'change-management-framework': 'change-force-field',
    'executive-prompt-report': 'executive-prompt-dossier'
  };
  
  // Create redirect entries for legacy mappings
  Object.entries(legacyMappings).forEach(([legacySlug, currentSlug]) => {
    // Find the current module to get its ID
    const currentModule = modules.find(m => m.slug === currentSlug);
    
    if (currentModule) {
      redirects.push({
        id: `legacy-${legacySlug}`,
        legacySlug,
        currentSlug,
        currentModuleId: currentModule.id,
        type: 'module',
        status: 'active',
        createdAt: new Date().toISOString(),
        redirectCount: 0,
        lastRedirect: null,
        redirectType: '308', // Permanent redirect
        source: `/modules/${legacySlug}`,
        destination: `/modules/${currentSlug}`,
        queryParams: false,
        preserveQuery: false
      });
    }
  });
  
  log(`🔄 Generated ${redirects.length} redirect entries`, 'green');
  return redirects;
}

function mergeRedirects(existingRedirects, newRedirects) {
  const merged = [...existingRedirects];
  
  newRedirects.forEach(newRedirect => {
    const existingIndex = merged.findIndex(r => r.legacySlug === newRedirect.legacySlug);
    
    if (existingIndex >= 0) {
      // Update existing redirect
      merged[existingIndex] = {
        ...merged[existingIndex],
        ...newRedirect,
        redirectCount: merged[existingIndex].redirectCount, // Preserve existing count
        lastRedirect: merged[existingIndex].lastRedirect // Preserve existing last redirect
      };
      log(`🔄 Updated redirect: ${newRedirect.legacySlug} → ${newRedirect.currentSlug}`, 'yellow');
    } else {
      // Add new redirect
      merged.push(newRedirect);
      log(`➕ Added redirect: ${newRedirect.legacySlug} → ${newRedirect.currentSlug}`, 'green');
    }
  });
  
  return merged;
}

function updateAnalytics(redirects) {
  const analytics = {
    totalRedirects: redirects.reduce((sum, r) => sum + r.redirectCount, 0),
    redirectsByType: {},
    redirectsByDay: {},
    topLegacySlugs: [],
    lastAnalyticsUpdate: new Date().toISOString()
  };
  
  // Count redirects by type
  redirects.forEach(redirect => {
    analytics.redirectsByType[redirect.type] = (analytics.redirectsByType[redirect.type] || 0) + 1;
  });
  
  // Get top legacy slugs by redirect count
  analytics.topLegacySlugs = redirects
    .filter(r => r.redirectCount > 0)
    .sort((a, b) => b.redirectCount - a.redirectCount)
    .slice(0, 10)
    .map(r => ({
      slug: r.legacySlug,
      count: r.redirectCount,
      destination: r.currentSlug
    }));
  
  return analytics;
}

function saveRedirects(redirects, analytics) {
  const redirectsData = {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    redirects,
    analytics
  };
  
  const redirectsPath = path.join(__dirname, '..', 'lib', 'redirects.json');
  
  try {
    fs.writeFileSync(redirectsPath, JSON.stringify(redirectsData, null, 2));
    log(`💾 Saved ${redirects.length} redirects to ${redirectsPath}`, 'green');
    return true;
  } catch (error) {
    log(`❌ Error saving redirects: ${error.message}`, 'red');
    return false;
  }
}

function generateMiddlewareCode(redirects) {
  const middlewarePath = path.join(__dirname, '..', 'middleware.ts');
  
  // Read existing middleware
  let middlewareContent = '';
  if (fs.existsSync(middlewarePath)) {
    middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
  }
  
  // Generate the legacy slug mappings object
  const mappings = redirects
    .filter(r => r.type === 'module' && r.status === 'active')
    .reduce((acc, redirect) => {
      acc[redirect.legacySlug] = redirect.currentSlug;
      return acc;
    }, {});
  
  const mappingsCode = `const LEGACY_SLUG_MAPPINGS: Record<string, string> = ${JSON.stringify(mappings, null, 2)}`;
  
  // Update middleware with new mappings
  if (middlewareContent.includes('LEGACY_SLUG_MAPPINGS')) {
    // Replace existing mappings
    middlewareContent = middlewareContent.replace(
      /const LEGACY_SLUG_MAPPINGS: Record<string, string> = \{[\s\S]*?\}/,
      mappingsCode
    );
  } else {
    // Add mappings after imports
    const importEndIndex = middlewareContent.lastIndexOf('import');
    const nextLineIndex = middlewareContent.indexOf('\n', importEndIndex) + 1;
    middlewareContent = middlewareContent.slice(0, nextLineIndex) + 
                      '\n' + mappingsCode + '\n' + 
                      middlewareContent.slice(nextLineIndex);
  }
  
  try {
    fs.writeFileSync(middlewarePath, middlewareContent);
    log(`🔄 Updated middleware.ts with ${Object.keys(mappings).length} redirect mappings`, 'green');
    return true;
  } catch (error) {
    log(`❌ Error updating middleware: ${error.message}`, 'red');
    return false;
  }
}

function validateRedirects(redirects) {
  log('\n🔍 Validating redirects...', 'cyan');
  
  let validCount = 0;
  let invalidCount = 0;
  
  redirects.forEach(redirect => {
    const issues = [];
    
    // Check required fields
    if (!redirect.id) issues.push('Missing ID');
    if (!redirect.legacySlug) issues.push('Missing legacy slug');
    if (!redirect.currentSlug) issues.push('Missing current slug');
    if (!redirect.type) issues.push('Missing type');
    if (!redirect.status) issues.push('Missing status');
    
    // Check slug format
    if (redirect.legacySlug && !/^[a-z0-9-]+$/.test(redirect.legacySlug)) {
      issues.push('Invalid legacy slug format');
    }
    if (redirect.currentSlug && !/^[a-z0-9-]+$/.test(redirect.currentSlug)) {
      issues.push('Invalid current slug format');
    }
    
    // Check status
    if (redirect.status && !['active', 'inactive', 'deprecated'].includes(redirect.status)) {
      issues.push('Invalid status');
    }
    
    if (issues.length > 0) {
      log(`❌ Invalid redirect ${redirect.id}: ${issues.join(', ')}`, 'red');
      invalidCount++;
    } else {
      validCount++;
    }
  });
  
  log(`✅ Valid redirects: ${validCount}`, 'green');
  if (invalidCount > 0) {
    log(`❌ Invalid redirects: ${invalidCount}`, 'red');
  }
  
  return invalidCount === 0;
}

function main() {
  log('🚀 Starting Redirect Generation...', 'cyan');
  log('=' .repeat(50), 'cyan');
  
  // Load module registry
  const modules = loadModuleRegistry();
  if (!modules) {
    log('❌ Failed to load module registry', 'red');
    process.exit(1);
  }
  
  // Load existing redirects
  const existingData = loadExistingRedirects();
  
  // Generate new redirects
  const newRedirects = generateRedirectsFromRegistry(modules);
  
  // Merge with existing redirects
  const mergedRedirects = mergeRedirects(existingData.redirects, newRedirects);
  
  // Update analytics
  const analytics = updateAnalytics(mergedRedirects);
  
  // Validate redirects
  const isValid = validateRedirects(mergedRedirects);
  
  if (!isValid) {
    log('❌ Redirect validation failed', 'red');
    process.exit(1);
  }
  
  // Save redirects
  const saved = saveRedirects(mergedRedirects, analytics);
  
  if (!saved) {
    log('❌ Failed to save redirects', 'red');
    process.exit(1);
  }
  
  // Update middleware
  const middlewareUpdated = generateMiddlewareCode(mergedRedirects);
  
  if (!middlewareUpdated) {
    log('❌ Failed to update middleware', 'red');
    process.exit(1);
  }
  
  log('\n' + '=' .repeat(50), 'cyan');
  log('🎉 Redirect generation completed successfully!', 'green');
  log(`📊 Total redirects: ${mergedRedirects.length}`, 'blue');
  log(`🔄 Active redirects: ${mergedRedirects.filter(r => r.status === 'active').length}`, 'blue');
  log(`📈 Total redirect count: ${analytics.totalRedirects}`, 'blue');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  loadModuleRegistry,
  generateRedirectsFromRegistry,
  validateRedirects
};
