import { NextRequest, NextResponse } from 'next/server';
import { canExportFormat } from '@/lib/entitlements';
import { PlanType } from '@/lib/entitlements/types';

export async function POST(request: NextRequest) {
  try {
    const { plan, format, score, modules } = await request.json();

    // Validate required fields
    if (!plan || !format || !modules) {
      return NextResponse.json(
        { error: 'Missing required fields: plan, format, modules' },
        { status: 400 }
      );
    }

    // Check if plan is valid
    const validPlans: PlanType[] = ['FREE', 'CREATOR', 'PRO', 'ENTERPRISE'];
    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    // Check entitlements
    const canExport = canExportFormat(plan, format, score);
    
    if (!canExport) {
      return NextResponse.json(
        { 
          error: 'ENTITLEMENT_REQUIRED',
          message: `Export to ${format.toUpperCase()} not available for ${plan} plan`,
          requiredPlan: format === 'zip' ? 'PRO' : 'CREATOR'
        },
        { status: 403 }
      );
    }

    // Validate modules have required structure
    if (!Array.isArray(modules) || modules.length === 0) {
      return NextResponse.json(
        { error: 'Modules array is required and cannot be empty' },
        { status: 400 }
      );
    }

    // For ZIP exports, require manifest.json + checksum.sha256
    if (format === 'zip') {
      const hasManifest = modules.some(module => 
        module.id === 'manifest.json' || 
        module.files?.includes('manifest.json')
      );
      
      if (!hasManifest) {
        return NextResponse.json(
          { error: 'ZIP export requires manifest.json' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      canExport: true,
      format,
      plan,
      moduleCount: modules.length
    });

  } catch (error) {
    console.error('Export validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
