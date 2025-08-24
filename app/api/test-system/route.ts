// PromptForge v3 - System Test API
// Test complet: ruleset.yml → GPT Editor → GPT Test → Export Bundle

import { NextRequest, NextResponse } from 'next/server';
import { validate7D, getDomainDefaults, getEnums } from '@/lib/ruleset';

export async function GET() {
  try {
    // Test 1: Verifică ruleset.yml loading
    const enums = getEnums();
    const domains = enums.domain;
    
    if (!domains || domains.length < 20) {
      throw new Error('Ruleset loading failed - insufficient domains');
    }

    // Test 2: Verifică domain defaults
    const saasDomainDefaults = getDomainDefaults('saas');
    if (!saasDomainDefaults.scale || !saasDomainDefaults.output_format) {
      throw new Error('Domain defaults loading failed');
    }

    // Test 3: Verifică 7D validation
    const testSevenD = {
      domain: 'saas' as const,
      output_format: 'spec' as const
    };
    
    const validationResult = validate7D(testSevenD);
    if (!validationResult.isValid) {
      throw new Error(`7D validation failed: ${validationResult.errors.join(', ')}`);
    }

    // Test 4: Verifică că toate câmpurile au fost populate cu defaults
    const normalized = validationResult.normalized;
    const requiredFields = ['domain', 'scale', 'urgency', 'complexity', 'resources', 'application', 'output_format'];
    const missingFields = requiredFields.filter(field => !normalized[field as keyof typeof normalized]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing fields after normalization: ${missingFields.join(', ')}`);
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tests: {
        rulesetLoading: 'PASS',
        domainDefaults: 'PASS', 
        sevenDValidation: 'PASS',
        normalization: 'PASS'
      },
      data: {
        availableDomains: domains.length,
        sampleDomainDefaults: saasDomainDefaults,
        normalizedSevenD: normalized,
        signature: validationResult.signature
      },
      endpoints: {
        gptEditor: '/api/gpt-editor',
        gptTest: '/api/gpt-test',
        exportBundle: '/api/export/bundle',
        entitlements: '/api/entitlements/[orgId]'
      },
      nextSteps: [
        'Test /api/gpt-editor with prompt optimization',
        'Test /api/gpt-test with real GPT integration',
        'Test /api/export/bundle with all formats',
        'Verify entitlements gating works correctly'
      ]
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        suggestion: 'Check that ruleset.yml exists in project root and contains valid YAML'
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { testType, orgId } = body;

    if (testType === 'entitlements' && orgId) {
      // Test entitlements pentru o organizație specifică
      const response = await fetch(`${req.nextUrl.origin}/api/entitlements/${orgId}`);
      const entitlements = await response.json();

      return NextResponse.json({
        success: true,
        testType: 'entitlements',
        orgId,
        entitlements,
        capabilities: entitlements.capabilities,
        restrictions: entitlements.restrictions
      });
    }

    if (testType === 'gpt-editor') {
      // Test GPT Editor endpoint
      const testPrompt = "Create a marketing strategy for a SaaS product";
      const testSevenD = {
        domain: 'saas' as const,
        output_format: 'playbook' as const
      };

      // Simulăm un test call (fără a chema real GPT)
      const normalized = validate7D(testSevenD);

      return NextResponse.json({
        success: true,
        testType: 'gpt-editor',
        input: {
          prompt: testPrompt,
          sevenD: testSevenD
        },
        normalized7D: normalized.normalized,
        note: 'This is a dry run - add orgId, userId, moduleId for real test'
      });
    }

    return NextResponse.json(
      { error: 'Invalid test type. Supported: entitlements, gpt-editor' },
      { status: 400 }
    );

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Test failed'
      },
      { status: 500 }
    );
  }
}
