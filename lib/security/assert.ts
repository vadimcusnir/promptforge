// PromptForge v3 - SACF Security Assertions
// Assert membership, entitlements și validări de securitate

import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

// SACF - Development mode fallback pentru testing
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dev-placeholder.supabase.co';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dev-placeholder';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// Verifică dacă utilizatorul este membru al organizației
export async function assertMembership(orgId?: string, userId?: string) {
  const h = await headers();
  
  // Folosește parametrii dacă sunt furnizați, altfel încearcă din headers
  const finalOrgId = orgId || h.get('x-org-id');
  const finalUserId = userId || h.get('x-user-id');
  
  if (!finalOrgId || !finalUserId) {
    const error = new Error('UNAUTHENTICATED: Missing orgId or userId');
    (error as any).code = 'UNAUTHENTICATED';
    throw error;
  }

  try {
    const { data, error } = await supabase
      .from('org_members')
      .select('role')
      .eq('org_id', finalOrgId)
      .eq('user_id', finalUserId)
      .single();

    if (error || !data) {
      const forbiddenError = new Error('FORBIDDEN: User is not a member of this organization');
      (forbiddenError as any).code = 'FORBIDDEN';
      throw forbiddenError;
    }

    return data.role;
  } catch (error) {
    if (error instanceof Error && (error as any).code) {
      throw error;
    }
    
    const dbError = new Error('DATABASE_ERROR: Failed to verify membership');
    (dbError as any).code = 'DATABASE_ERROR';
    throw dbError;
  }
}

// Verifică entitlement specific pentru organizație
export async function assertEntitlement(orgId: string, flag: string) {
  try {
    const { data, error } = await supabase
      .from('entitlements_effective_org')
      .select('value')
      .eq('org_id', orgId)
      .eq('flag', flag)
      .single();

    if (error || !data || !data.value) {
      const entitlementError = new Error(`ENTITLEMENT_REQUIRED: Missing flag '${flag}'`);
      (entitlementError as any).code = 'ENTITLEMENT_REQUIRED';
      (entitlementError as any).flag = flag;
      throw entitlementError;
    }

    return true;
  } catch (error) {
    if (error instanceof Error && (error as any).code === 'ENTITLEMENT_REQUIRED') {
      throw error;
    }
    
    const dbError = new Error(`DATABASE_ERROR: Failed to verify entitlement '${flag}'`);
    (dbError as any).code = 'DATABASE_ERROR';
    throw dbError;
  }
}

// Verifică rol minim necesar (owner > admin > member)
export async function assertRole(orgId: string, userId: string, minRole: 'owner' | 'admin' | 'member') {
  const roleHierarchy = { owner: 3, admin: 2, member: 1 };
  
  try {
    const userRole = await assertMembership(orgId, userId);
    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy];
    const minLevel = roleHierarchy[minRole];

    if (userLevel < minLevel) {
      const roleError = new Error(`INSUFFICIENT_ROLE: Requires ${minRole}, has ${userRole}`);
      (roleError as any).code = 'INSUFFICIENT_ROLE';
      (roleError as any).required = minRole;
      (roleError as any).actual = userRole;
      throw roleError;
    }

    return userRole;
  } catch (error) {
    throw error;
  }
}

// Verifică dacă run-ul aparține organizației
export async function assertRunOwnership(runId: string, orgId: string) {
  try {
    const { data, error } = await supabase
      .from('runs')
      .select('org_id, status')
      .eq('id', runId)
      .single();

    if (error || !data) {
      const notFoundError = new Error('RUN_NOT_FOUND: Run does not exist');
      (notFoundError as any).code = 'RUN_NOT_FOUND';
      throw notFoundError;
    }

    if (data.org_id !== orgId) {
      const accessError = new Error('ACCESS_DENIED: Run belongs to different organization');
      (accessError as any).code = 'ACCESS_DENIED';
      throw accessError;
    }

    return data;
  } catch (error) {
    if (error instanceof Error && (error as any).code) {
      throw error;
    }
    
    const dbError = new Error('DATABASE_ERROR: Failed to verify run ownership');
    (dbError as any).code = 'DATABASE_ERROR';
    throw dbError;
  }
}

// Verifică scorul pentru export
export async function assertExportEligible(runId: string, minScore: number = 80) {
  try {
    const { data, error } = await supabase
      .from('prompt_scores')
      .select('overall_score')
      .eq('run_id', runId)
      .single();

    if (error || !data) {
      const noScoreError = new Error('NO_SCORE: Run has not been scored yet');
      (noScoreError as any).code = 'NO_SCORE';
      throw noScoreError;
    }

    if (data.overall_score < minScore) {
      const lowScoreError = new Error(`SCORE_TOO_LOW: Score ${data.overall_score} is below minimum ${minScore}`);
      (lowScoreError as any).code = 'SCORE_TOO_LOW';
      (lowScoreError as any).score = data.overall_score;
      (lowScoreError as any).minimum = minScore;
      throw lowScoreError;
    }

    return data.overall_score;
  } catch (error) {
    if (error instanceof Error && (error as any).code) {
      throw error;
    }
    
    const dbError = new Error('DATABASE_ERROR: Failed to verify export eligibility');
    (dbError as any).code = 'DATABASE_ERROR';
    throw dbError;
  }
}

// Wrapper pentru error handling consistent
export function handleSecurityError(error: unknown): Response {
  if (error instanceof Error) {
    const code = (error as any).code;
    
    switch (code) {
      case 'UNAUTHENTICATED':
        return Response.json(
          { error: 'UNAUTHENTICATED', message: 'Authentication required' },
          { status: 401 }
        );
        
      case 'FORBIDDEN':
      case 'ACCESS_DENIED':
      case 'INSUFFICIENT_ROLE':
        return Response.json(
          { 
            error: code, 
            message: error.message,
            ...(code === 'INSUFFICIENT_ROLE' && {
              required: (error as any).required,
              actual: (error as any).actual
            })
          },
          { status: 403 }
        );
        
      case 'ENTITLEMENT_REQUIRED':
        return Response.json(
          { 
            error: 'ENTITLEMENT_REQUIRED', 
            message: error.message,
            flag: (error as any).flag,
            upsell: (error as any).flag?.includes('API') || (error as any).flag?.includes('Zip') 
              ? 'enterprise_needed' 
              : 'pro_needed'
          },
          { status: 403 }
        );
        
      case 'RUN_NOT_FOUND':
        return Response.json(
          { error: 'NOT_FOUND', message: error.message },
          { status: 404 }
        );
        
      case 'SCORE_TOO_LOW':
        return Response.json(
          { 
            error: 'SCORE_TOO_LOW', 
            message: error.message,
            score: (error as any).score,
            minimum: (error as any).minimum
          },
          { status: 400 }
        );
        
      case 'NO_SCORE':
        return Response.json(
          { error: 'NO_SCORE', message: error.message },
          { status: 400 }
        );
        
      case 'DATABASE_ERROR':
        console.error('Database error:', error);
        return Response.json(
          { error: 'INTERNAL_ERROR', message: 'Database operation failed' },
          { status: 500 }
        );
        
      default:
        console.error('Unknown security error:', error);
        return Response.json(
          { error: 'INTERNAL_ERROR', message: 'Security check failed' },
          { status: 500 }
        );
    }
  }
  
  console.error('Unknown error type:', error);
  return Response.json(
    { error: 'INTERNAL_ERROR', message: 'Unknown error occurred' },
    { status: 500 }
  );
}

// Validează headers SACF
export async function validateSACFHeaders(): Promise<{ orgId: string; runId?: string }> {
  const h = await headers();
  const orgId = h.get('x-org-id');
  const runId = h.get('x-run-id');
  
  if (!orgId) {
    const error = new Error('MISSING_HEADERS: x-org-id header is required');
    (error as any).code = 'MISSING_HEADERS';
    throw error;
  }
  
  return { orgId, runId: runId || undefined };
}