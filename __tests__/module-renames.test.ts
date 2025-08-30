/**
 * Module Renames and Fusions Test Suite
 * Tests the module rename implementation including:
 * - Module name changes
 * - Legacy slug support
 * - Redirect functionality
 * - API compatibility
 */

import { COMPLETE_MODULES_CATALOG } from '@/lib/modules'

describe('Module Renames and Fusions', () => {
  describe('Module Name Changes', () => {
    test('M07 should be renamed to TRUST REVERSAL PROTOCOL™', () => {
      const module = COMPLETE_MODULES_CATALOG['M07']
      expect(module.name).toBe('TRUST REVERSAL PROTOCOL™')
      expect(module.legacy_slugs).toContain('risk-and-trust-reversal')
    })

    test('M10 should be renamed to CRISIS COMMUNICATION PLAYBOOK™', () => {
      const module = COMPLETE_MODULES_CATALOG['M10']
      expect(module.name).toBe('CRISIS COMMUNICATION PLAYBOOK™')
      expect(module.legacy_slugs).toContain('crisis-communication')
    })

    test('M14 should be renamed to SOCIAL CONTENT GRID™ (fusion)', () => {
      const module = COMPLETE_MODULES_CATALOG['M14']
      expect(module.name).toBe('SOCIAL CONTENT GRID™')
      expect(module.legacy_slugs).toContain('social-media-calendar')
      expect(module.legacy_slugs).toContain('content-calendar-optimizer')
    })

    test('M19 should be renamed to AUDIENCE SEGMENT PERSONALIZER™', () => {
      const module = COMPLETE_MODULES_CATALOG['M19']
      expect(module.name).toBe('AUDIENCE SEGMENT PERSONALIZER™')
      expect(module.legacy_slugs).toContain('content-calendar-optimizer')
    })

    test('M31 should be renamed to SALES FLOW ARCHITECT™ (fusion)', () => {
      const module = COMPLETE_MODULES_CATALOG['M31']
      expect(module.name).toBe('SALES FLOW ARCHITECT™')
      expect(module.legacy_slugs).toContain('sales-process-optimizer')
      expect(module.legacy_slugs).toContain('sales-operations-framework')
    })

    test('M37 should be renamed to CUSTOMER SUCCESS PLAYBOOK™', () => {
      const module = COMPLETE_MODULES_CATALOG['M37']
      expect(module.name).toBe('CUSTOMER SUCCESS PLAYBOOK™')
      expect(module.legacy_slugs).toContain('sales-operations-framework')
    })

    test('M40 should be renamed to NEGOTIATION DYNAMICS™', () => {
      const module = COMPLETE_MODULES_CATALOG['M40']
      expect(module.name).toBe('NEGOTIATION DYNAMICS™')
      expect(module.legacy_slugs).toContain('sales-intelligence-framework')
    })
  })

  describe('Legacy Slug Support', () => {
    test('All renamed modules should have legacy_slugs field', () => {
      const renamedModules = ['M07', 'M10', 'M14', 'M15', 'M17', 'M18', 'M19', 'M20', 'M24', 'M25', 'M26', 'M27', 'M29', 'M30', 'M31', 'M33', 'M37', 'M39', 'M40', 'M42', 'M43', 'M45', 'M49']
      
      renamedModules.forEach(moduleId => {
        const module = COMPLETE_MODULES_CATALOG[moduleId]
        expect(module.legacy_slugs).toBeDefined()
        expect(Array.isArray(module.legacy_slugs)).toBe(true)
        expect(module.legacy_slugs!.length).toBeGreaterThan(0)
      })
    })

    test('Legacy slugs should be unique across all modules', () => {
      const allLegacySlugs: string[] = []
      
      Object.values(COMPLETE_MODULES_CATALOG).forEach(module => {
        if (module.legacy_slugs) {
          allLegacySlugs.push(...module.legacy_slugs)
        }
      })
      
      const uniqueSlugs = new Set(allLegacySlugs)
      expect(uniqueSlugs.size).toBe(allLegacySlugs.length)
    })
  })

  describe('Module Structure Integrity', () => {
    test('All modules should maintain required fields', () => {
      Object.values(COMPLETE_MODULES_CATALOG).forEach(module => {
        expect(module.id).toBeDefined()
        expect(module.name).toBeDefined()
        expect(module.description).toBeDefined()
        expect(module.vectors).toBeDefined()
        expect(module.difficulty).toBeDefined()
        expect(module.estimated_tokens).toBeDefined()
        expect(module.requires_plan).toBeDefined()
        expect(module.purpose).toBeDefined()
        expect(module.input_schema).toBeDefined()
        expect(module.output_template).toBeDefined()
        expect(module.kpi).toBeDefined()
        expect(module.guardrails).toBeDefined()
        expect(module.sample_output).toBeDefined()
        expect(module.is_active).toBeDefined()
        expect(module.created_at).toBeDefined()
        expect(module.updated_at).toBeDefined()
      })
    })

    test('All modules should be active', () => {
      Object.values(COMPLETE_MODULES_CATALOG).forEach(module => {
        expect(module.is_active).toBe(true)
      })
    })

    test('Module IDs should be sequential M01-M50', () => {
      const moduleIds = Object.keys(COMPLETE_MODULES_CATALOG).sort()
      expect(moduleIds).toHaveLength(50)
      
      for (let i = 1; i <= 50; i++) {
        const expectedId = `M${i.toString().padStart(2, '0')}`
        expect(moduleIds).toContain(expectedId)
      }
    })
  })

  describe('Fusion Logic', () => {
    test('M14 fusion should combine social media and content calendar functionality', () => {
      const module = COMPLETE_MODULES_CATALOG['M14']
      expect(module.description).toContain('social media')
      expect(module.description).toContain('content calendar')
      expect(module.description).toContain('audience segmentation')
    })

    test('M31 fusion should combine sales process and operations', () => {
      const module = COMPLETE_MODULES_CATALOG['M31']
      expect(module.description).toContain('sales process')
      expect(module.description).toContain('operations framework')
      expect(module.description).toContain('conversion enhancement')
    })

    test('M19 should focus on audience segmentation after fusion', () => {
      const module = COMPLETE_MODULES_CATALOG['M19']
      expect(module.description).toContain('audience segmentation')
      expect(module.description).toContain('personalization')
      expect(module.description).not.toContain('calendar')
    })
  })

  describe('Slug Generation', () => {
    test('Current slugs should be generated correctly from module names', () => {
      const testCases = [
        { name: 'TRUST REVERSAL PROTOCOL™', expectedSlug: 'trust-reversal-protocol' },
        { name: 'CRISIS COMMUNICATION PLAYBOOK™', expectedSlug: 'crisis-communication-playbook' },
        { name: 'SOCIAL CONTENT GRID™', expectedSlug: 'social-content-grid' },
        { name: 'LANDING PAGE ALCHEMIST™', expectedSlug: 'landing-page-alchemist' },
        { name: 'INFLUENCE PARTNERSHIP FRAME™', expectedSlug: 'influence-partnership-frame' },
        { name: 'CONTENT ANALYTICS DASHBOARD™', expectedSlug: 'content-analytics-dashboard' },
        { name: 'AUDIENCE SEGMENT PERSONALIZER™', expectedSlug: 'audience-segment-personalizer' },
        { name: 'MOMENTUM CAMPAIGN BUILDER™', expectedSlug: 'momentum-campaign-builder' },
        { name: 'DATA SCHEMA OPTIMIZER™', expectedSlug: 'data-schema-optimizer' },
        { name: 'MICROSERVICES GRID™', expectedSlug: 'microservices-grid' },
        { name: 'SECURITY FORTRESS FRAME™', expectedSlug: 'security-fortress-frame' },
        { name: 'PERFORMANCE ENGINE™', expectedSlug: 'performance-engine' },
        { name: 'ORCHESTRATION MATRIX™', expectedSlug: 'orchestration-matrix' },
        { name: 'CLOUD INFRA MAP™', expectedSlug: 'cloud-infra-map' },
        { name: 'SALES FLOW ARCHITECT™', expectedSlug: 'sales-flow-architect' },
        { name: 'ENABLEMENT FRAME™', expectedSlug: 'enablement-frame' },
        { name: 'CUSTOMER SUCCESS PLAYBOOK™', expectedSlug: 'customer-success-playbook' },
        { name: 'INTELLIGENCE ENGINE™', expectedSlug: 'intelligence-engine' },
        { name: 'NEGOTIATION DYNAMICS™', expectedSlug: 'negotiation-dynamics' },
        { name: 'QUALITY SYSTEM MAP™', expectedSlug: 'quality-system-map' },
        { name: 'SUPPLY FLOW OPTIMIZER™', expectedSlug: 'supply-flow-optimizer' },
        { name: 'CHANGE FORCE FIELD™', expectedSlug: 'change-force-field' },
        { name: 'EXECUTIVE PROMPT DOSSIER™', expectedSlug: 'executive-prompt-dossier' }
      ]

      testCases.forEach(({ name, expectedSlug }) => {
        const generatedSlug = name
          .toLowerCase()
          .replace(/™/g, '')
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .trim()
        
        expect(generatedSlug).toBe(expectedSlug)
      })
    })
  })

  describe('Backward Compatibility', () => {
    test('All legacy slugs should map to correct new modules', () => {
      const legacyMappings = {
        'risk-and-trust-reversal': 'M07',
        'crisis-communication': 'M10',
        'social-media-calendar': 'M14',
        'content-calendar-optimizer': 'M14', // Fusion target
        'landing-page-optimizer': 'M15',
        'influencer-partnership-framework': 'M17',
        'content-performance-analyzer': 'M18',
        'content-personalization-engine': 'M20',
        'database-design-optimizer': 'M24',
        'microservices-architecture': 'M25',
        'security-architecture-framework': 'M26',
        'performance-optimization-engine': 'M27',
        'container-orchestration-strategy': 'M29',
        'cloud-infrastructure-architect': 'M30',
        'sales-process-optimizer': 'M31',
        'sales-operations-framework': 'M31', // Fusion target
        'sales-enablement-framework': 'M33',
        'sales-intelligence-framework': 'M40',
        'quality-management-system': 'M42',
        'supply-chain-optimizer': 'M43',
        'change-management-framework': 'M45',
        'executive-prompt-report': 'M49'
      }

      Object.entries(legacyMappings).forEach(([legacySlug, expectedModuleId]) => {
        const module = COMPLETE_MODULES_CATALOG[expectedModuleId]
        expect(module.legacy_slugs).toContain(legacySlug)
      })
    })
  })
})

describe('Module Rename Integration Tests', () => {
  describe('Middleware Redirect Logic', () => {
    test('Legacy slug mappings should be consistent with middleware', () => {
      const middlewareMappings = {
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
      }

      Object.entries(middlewareMappings).forEach(([legacySlug, newSlug]) => {
        // Find the module that has this legacy slug
        const moduleWithLegacySlug = Object.values(COMPLETE_MODULES_CATALOG).find(
          module => module.legacy_slugs?.includes(legacySlug)
        )
        
        expect(moduleWithLegacySlug).toBeDefined()
        
        // Generate current slug from module name
        const currentSlug = moduleWithLegacySlug!.name
          .toLowerCase()
          .replace(/™/g, '')
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .replace(/\s+/g, '-')
          .trim()
        
        expect(currentSlug).toBe(newSlug)
      })
    })
  })
})
