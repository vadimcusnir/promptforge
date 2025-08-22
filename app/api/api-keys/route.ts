// PromptForge v3 - API Keys Management
// Creare, listare și management API keys pentru Enterprise

import { NextRequest, NextResponse } from 'next/server';
import { publicAPIManager, type APIScope } from '@/lib/api-public';
import { validateSACFHeaders, assertMembership, assertRole, handleSecurityError } from '@/lib/security/assert';

// GET - Listează API keys pentru organizație
export async function GET(req: NextRequest) {
  try {
    const { orgId } = await validateSACFHeaders();
    const userId = req.headers.get('x-user-id') || 'dev-user';

    // Verifică că este admin
    await assertRole(orgId, userId, 'admin');

    // În development mode, returnează mock data
    if (process.env.SUPABASE_URL?.includes('dev-placeholder')) {
      return NextResponse.json({
        orgId,
        api_keys: [
          {
            id: 'dev-key-1',
            name: 'Development Key',
            key_prefix: 'pk_dev_**',
            scopes: ['prompts:generate', 'prompts:test'],
            rate_limit_rpm: 100,
            monthly_request_limit: 10000,
            requests_used_this_month: 150,
            last_used_at: new Date(Date.now() - 86400000).toISOString(),
            is_active: true,
            created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
            created_by: 'dev-user'
          }
        ],
        summary: {
          total_keys: 1,
          active_keys: 1,
          total_requests_this_month: 150,
          available_scopes: [
            'prompts:generate', 'prompts:test', 'prompts:score', 
            'exports:bundle', 'history:read', 'history:write',
            'analytics:read', 'presets:read', 'admin:manage'
          ]
        }
      });
    }

    // TODO: Query real data from Supabase
    return NextResponse.json({
      orgId,
      api_keys: [],
      summary: {
        total_keys: 0,
        active_keys: 0,
        total_requests_this_month: 0,
        available_scopes: [
          'prompts:generate', 'prompts:test', 'prompts:score', 
          'exports:bundle', 'history:read', 'history:write',
          'analytics:read', 'presets:read', 'admin:manage'
        ]
      }
    });

  } catch (error) {
    console.error('API Keys GET error:', error);
    return handleSecurityError(error);
  }
}

// POST - Creează API key nou
export async function POST(req: NextRequest) {
  try {
    const { orgId } = await validateSACFHeaders();
    const userId = req.headers.get('x-user-id') || 'dev-user';
    const body = await req.json();

    // Verifică că este admin
    await assertRole(orgId, userId, 'admin');

    const { name, scopes, rate_limit_rpm, monthly_limit, expires_at } = body;

    // Validări
    if (!name || !scopes || !Array.isArray(scopes)) {
      return NextResponse.json(
        { error: 'MISSING_PARAMETERS', message: 'name and scopes array are required' },
        { status: 400 }
      );
    }

    if (scopes.length === 0) {
      return NextResponse.json(
        { error: 'INVALID_PARAMETERS', message: 'At least one scope is required' },
        { status: 400 }
      );
    }

    // Verifică scopes valide
    const validScopes: APIScope[] = [
      'prompts:generate', 'prompts:test', 'prompts:score', 
      'exports:bundle', 'history:read', 'history:write',
      'analytics:read', 'presets:read', 'admin:manage'
    ];

    const invalidScopes = scopes.filter((scope: string) => !validScopes.includes(scope as APIScope));
    if (invalidScopes.length > 0) {
      return NextResponse.json(
        { 
          error: 'INVALID_SCOPES', 
          message: 'Invalid scopes provided',
          details: { invalid: invalidScopes, valid: validScopes }
        },
        { status: 400 }
      );
    }

    // Verifică entitlements pentru API access
    // Admin:manage scope necesită Enterprise
    if (scopes.includes('admin:manage')) {
      // TODO: Check hasAPI entitlement
      // Pentru development, permitem totul
    }

    try {
      // Creează API key
      const { apiKey, keyData } = await publicAPIManager.createAPIKey({
        orgId,
        name,
        scopes: scopes as APIScope[],
        rateLimitRpm: rate_limit_rpm || 60,
        monthlyLimit: monthly_limit || 10000,
        expiresAt: expires_at,
        createdBy: userId
      });

      // Return response cu key-ul (doar o dată!)
      return NextResponse.json({
        success: true,
        message: 'API key created successfully',
        api_key: apiKey, // Doar aici se returnează key-ul complet
        key_data: {
          id: keyData.id,
          name: keyData.name,
          key_prefix: keyData.key_prefix + '****',
          scopes: keyData.scopes,
          rate_limit_rpm: keyData.rate_limit_rpm,
          monthly_request_limit: keyData.monthly_request_limit,
          expires_at: keyData.expires_at,
          created_at: keyData.created_at
        },
        warning: 'Save this API key securely. It will not be shown again.'
      });

    } catch (error) {
      return NextResponse.json(
        { 
          error: 'CREATION_FAILED', 
          message: error instanceof Error ? error.message : 'Failed to create API key'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API Keys POST error:', error);
    return handleSecurityError(error);
  }
}

// DELETE - Revoke API key
export async function DELETE(req: NextRequest) {
  try {
    const { orgId } = await validateSACFHeaders();
    const userId = req.headers.get('x-user-id') || 'dev-user';
    const url = new URL(req.url);
    const keyId = url.searchParams.get('keyId');

    // Verifică că este admin
    await assertRole(orgId, userId, 'admin');

    if (!keyId) {
      return NextResponse.json(
        { error: 'MISSING_PARAMETERS', message: 'keyId query parameter is required' },
        { status: 400 }
      );
    }

    try {
      await publicAPIManager.revokeAPIKey(keyId, orgId);

      return NextResponse.json({
        success: true,
        message: 'API key revoked successfully',
        key_id: keyId
      });

    } catch (error) {
      return NextResponse.json(
        { 
          error: 'REVOCATION_FAILED', 
          message: error instanceof Error ? error.message : 'Failed to revoke API key'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('API Keys DELETE error:', error);
    return handleSecurityError(error);
  }
}
