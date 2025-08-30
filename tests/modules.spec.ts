import { describe, it, expect } from 'vitest'
import { validateModuleCatalog, ModuleCatalog, getDifficultyLabel, getPlanDisplayName, canUserAccessModule, getAvailableOutputs } from '../lib/module.schema'
import catalogData from '../lib/modules.catalog.json'

describe('Module Catalog Validation', () => {
  it('should validate the complete module catalog', () => {
    expect(() => validateModuleCatalog(catalogData)).not.toThrow()
  })
  
  it('should contain exactly 50 modules', () => {
    const catalog = validateModuleCatalog(catalogData)
    const moduleCount = Object.keys(catalog.modules).length
    expect(moduleCount).toBe(50)
  })
  
  it('should have sequential module IDs from M01 to M50', () => {
    const catalog = validateModuleCatalog(catalogData)
    const moduleIds = Object.keys(catalog.modules).sort()
    const expectedIds = Array.from({length: 50}, (_, i) => `M${String(i + 1).padStart(2, '0')}`)
    expect(moduleIds).toEqual(expectedIds)
  })
  
  it('should have unique module IDs', () => {
    const catalog = validateModuleCatalog(catalogData)
    const moduleIds = Object.keys(catalog.modules)
    const uniqueIds = new Set(moduleIds)
    expect(uniqueIds.size).toBe(moduleIds.length)
  })
  
  it('should have valid module structure for each module', () => {
    const catalog = validateModuleCatalog(catalogData)
    
    Object.values(catalog.modules).forEach((module) => {
      // Check required fields
      expect(module.id).toMatch(/^M\d{2}$/)
      expect(module.title).toBeTruthy()
      expect(module.slug).toMatch(/^[a-z0-9-]+$/)
      expect(module.summary).toBeTruthy()
      expect(module.vectors).toBeInstanceOf(Array)
      expect(module.vectors.length).toBeGreaterThan(0)
      expect(module.vectors.length).toBeLessThanOrEqual(3)
      expect(module.difficulty).toBeGreaterThanOrEqual(1)
      expect(module.difficulty).toBeLessThanOrEqual(5)
      expect(['free', 'creator', 'pro', 'enterprise']).toContain(module.minPlan)
      expect(module.tags).toBeInstanceOf(Array)
      expect(module.outputs).toBeInstanceOf(Array)
      expect(module.outputs.length).toBeGreaterThan(0)
      expect(module.version).toMatch(/^\d+\.\d+\.\d+$/)
      expect(typeof module.deprecated).toBe('boolean')
    })
  })
  
  it('should have valid vectors for each module', () => {
    const catalog = validateModuleCatalog(catalogData)
    const validVectors = ['strategic', 'rhetoric', 'content', 'analytics', 'branding', 'crisis', 'cognitive']
    
    Object.values(catalog.modules).forEach((module) => {
      module.vectors.forEach((vector) => {
        expect(validVectors).toContain(vector)
      })
    })
  })
  
  it('should have valid outputs for each module', () => {
    const catalog = validateModuleCatalog(catalogData)
    const validOutputs = ['txt', 'md', 'pdf', 'json', 'zip']
    
    Object.values(catalog.modules).forEach((module) => {
      module.outputs.forEach((output) => {
        expect(validOutputs).toContain(output)
      })
    })
  })
  
  it('should have valid KPI structure for each module', () => {
    const catalog = validateModuleCatalog(catalogData)
    
    Object.values(catalog.modules).forEach((module) => {
      expect(module.spec.kpis.clarity_min).toBeGreaterThanOrEqual(0)
      expect(module.spec.kpis.clarity_min).toBeLessThanOrEqual(100)
      expect(module.spec.kpis.execution_min).toBeGreaterThanOrEqual(0)
      expect(module.spec.kpis.execution_min).toBeLessThanOrEqual(100)
      expect(module.spec.kpis.business_fit_min).toBeGreaterThanOrEqual(0)
      expect(module.spec.kpis.business_fit_min).toBeLessThanOrEqual(100)
    })
  })
  
  it('should have consistent version across all modules', () => {
    const catalog = validateModuleCatalog(catalogData)
    const versions = new Set(Object.values(catalog.modules).map(m => m.version))
    expect(versions.size).toBe(1)
  })
  
  it('should have catalog version matching module versions', () => {
    const catalog = validateModuleCatalog(catalogData)
    const moduleVersion = Object.values(catalog.modules)[0].version
    expect(catalog.version).toBe(moduleVersion)
  })
})

describe('Module Utility Functions', () => {
  it('should return correct difficulty labels', () => {
    expect(getDifficultyLabel(1)).toBe('Beginner')
    expect(getDifficultyLabel(2)).toBe('Beginner+')
    expect(getDifficultyLabel(3)).toBe('Intermediate')
    expect(getDifficultyLabel(4)).toBe('Advanced')
    expect(getDifficultyLabel(5)).toBe('Expert')
  })
  
  it('should return correct plan display names', () => {
    expect(getPlanDisplayName('free')).toBe('Free')
    expect(getPlanDisplayName('creator')).toBe('Creator')
    expect(getPlanDisplayName('pro')).toBe('Pro')
    expect(getPlanDisplayName('enterprise')).toBe('Enterprise')
  })
  
  it('should correctly validate user access to modules', () => {
    // Free user can only access free modules
    expect(canUserAccessModule('free', 'free')).toBe(true)
    expect(canUserAccessModule('free', 'creator')).toBe(false)
    expect(canUserAccessModule('free', 'pro')).toBe(false)
    expect(canUserAccessModule('free', 'enterprise')).toBe(false)
    
    // Creator user can access free and creator modules
    expect(canUserAccessModule('creator', 'free')).toBe(true)
    expect(canUserAccessModule('creator', 'creator')).toBe(true)
    expect(canUserAccessModule('creator', 'pro')).toBe(false)
    expect(canUserAccessModule('creator', 'enterprise')).toBe(false)
    
    // Pro user can access free, creator, and pro modules
    expect(canUserAccessModule('pro', 'free')).toBe(true)
    expect(canUserAccessModule('pro', 'creator')).toBe(true)
    expect(canUserAccessModule('pro', 'pro')).toBe(true)
    expect(canUserAccessModule('pro', 'enterprise')).toBe(false)
    
    // Enterprise user can access all modules
    expect(canUserAccessModule('enterprise', 'free')).toBe(true)
    expect(canUserAccessModule('enterprise', 'creator')).toBe(true)
    expect(canUserAccessModule('enterprise', 'pro')).toBe(true)
    expect(canUserAccessModule('enterprise', 'enterprise')).toBe(true)
  })
  
  it('should return correct available outputs for each plan', () => {
    expect(getAvailableOutputs('free')).toEqual(['txt'])
    expect(getAvailableOutputs('creator')).toEqual(['txt', 'md'])
    expect(getAvailableOutputs('pro')).toEqual(['txt', 'md', 'pdf', 'json'])
    expect(getAvailableOutputs('enterprise')).toEqual(['txt', 'md', 'pdf', 'json', 'zip'])
  })
})

describe('Module Distribution', () => {
  it('should have reasonable distribution of modules across plans', () => {
    const catalog = validateModuleCatalog(catalogData)
    const planCounts = { free: 0, creator: 0, pro: 0, enterprise: 0 }
    
    Object.values(catalog.modules).forEach((module) => {
      planCounts[module.minPlan as keyof typeof planCounts]++
    })
    
    // At least some modules should be available at each tier
    expect(planCounts.free).toBeGreaterThan(0)
    expect(planCounts.creator).toBeGreaterThan(0)
    expect(planCounts.pro).toBeGreaterThan(0)
    expect(planCounts.enterprise).toBeGreaterThan(0)
    
    // Free should have the fewest modules (except enterprise which is premium)
    expect(planCounts.free).toBeLessThan(planCounts.creator)
    expect(planCounts.free).toBeLessThan(planCounts.pro)
    expect(planCounts.creator).toBeLessThan(planCounts.pro)
  })
  
  it('should have reasonable distribution of modules across vectors', () => {
    const catalog = validateModuleCatalog(catalogData)
    const vectorCounts: Record<string, number> = {}
    
    Object.values(catalog.modules).forEach((module) => {
      module.vectors.forEach((vector) => {
        vectorCounts[vector] = (vectorCounts[vector] || 0) + 1
      })
    })
    
    // Each vector should have at least some modules
    const validVectors = ['strategic', 'rhetoric', 'content', 'analytics', 'branding', 'crisis', 'cognitive']
    validVectors.forEach((vector) => {
      expect(vectorCounts[vector] || 0).toBeGreaterThan(0)
    })
  })
  
  it('should have reasonable distribution of modules across difficulties', () => {
    const catalog = validateModuleCatalog(catalogData)
    const difficultyCounts: Record<number, number> = {}
    
    Object.values(catalog.modules).forEach((module) => {
      difficultyCounts[module.difficulty] = (difficultyCounts[module.difficulty] || 0) + 1
    })
    
    // Each difficulty level should have at least some modules
    for (let i = 1; i <= 5; i++) {
      expect(difficultyCounts[i] || 0).toBeGreaterThan(0)
    }
  })
})
