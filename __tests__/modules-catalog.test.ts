import { validateModuleCatalog, isModuleCatalogValid } from '@/lib/modules/validation';

describe('Module Catalog Validation', () => {
  it('should validate the module catalog structure', () => {
    expect(() => validateModuleCatalog()).not.toThrow();
  });

  it('should return true for valid catalog', () => {
    expect(isModuleCatalogValid()).toBe(true);
  });

  it('should contain exactly 50 modules', () => {
    const { catalogData } = require('@/lib/modules');
    expect(Object.keys(catalogData.modules)).toHaveLength(50);
  });

  it('should have unique module IDs', () => {
    const { catalogData } = require('@/lib/modules');
    const moduleIds = Object.values(catalogData.modules).map((m: any) => m.id);
    const uniqueIds = new Set(moduleIds);
    expect(moduleIds).toHaveLength(uniqueIds.size);
  });

  it('should have modules M01 through M50', () => {
    const { catalogData } = require('@/lib/modules');
    const expectedIds = Array.from({ length: 50 }, (_, i) => `M${String(i + 1).padStart(2, '0')}`);
    const actualIds = Object.keys(catalogData.modules);
    
    expectedIds.forEach(expectedId => {
      expect(actualIds).toContain(expectedId);
    });
  });

  it('should have valid vector values', () => {
    const { catalogData } = require('@/lib/modules');
    const validVectors = ['strategic', 'operations', 'branding', 'content', 'analytics', 'sales', 'technical', 'crisis_management'];
    
    Object.values(catalogData.modules).forEach((module: any) => {
      module.vectors.forEach((vector: string) => {
        expect(validVectors).toContain(vector);
      });
    });
  });

  it('should have valid difficulty values (1-5)', () => {
    const { catalogData } = require('@/lib/modules');
    
    Object.values(catalogData.modules).forEach((module: any) => {
      expect(module.difficulty).toBeGreaterThanOrEqual(1);
      expect(module.difficulty).toBeLessThanOrEqual(5);
      expect(Number.isInteger(module.difficulty)).toBe(true);
    });
  });

  it('should have valid plan values', () => {
    const { catalogData } = require('@/lib/modules');
    const validPlans = ['FREE', 'CREATOR', 'PRO', 'ENTERPRISE'];
    
    Object.values(catalogData.modules).forEach((module: any) => {
      expect(validPlans).toContain(module.minPlan);
    });
  });
});
