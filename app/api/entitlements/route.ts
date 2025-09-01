import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // TODO: Get actual user plan from auth context
    // For now, return a mock user with 'CREATOR' plan
    const userPlan = 'CREATOR' as const;

    const planCapabilities = {
      'FREE': {
        canUseGptTestReal: false,
        canExportPDF: false,
        canExportJSON: false,
        canExportZIP: false,
        canExportBundleZip: false,
        availableExportFormats: ['txt']
      },
      'CREATOR': {
        canUseGptTestReal: false,
        canExportPDF: false,
        canExportJSON: false,
        canExportZIP: false,
        canExportBundleZip: false,
        availableExportFormats: ['txt', 'md']
      },
      'PRO': {
        canUseGptTestReal: true,
        canExportPDF: true,
        canExportJSON: true,
        canExportZIP: false,
        canExportBundleZip: false,
        availableExportFormats: ['txt', 'md', 'pdf', 'json']
      },
      'ENTERPRISE': {
        canUseGptTestReal: true,
        canExportPDF: true,
        canExportJSON: true,
        canExportZIP: true,
        canExportBundleZip: true,
        availableExportFormats: ['txt', 'md', 'pdf', 'json', 'zip']
      }
    };

    const capabilities = planCapabilities[userPlan];

    const entitlements = {
      plan: userPlan,
      ...capabilities,
      minExportScore: 80
    };

    return NextResponse.json({
      success: true,
      data: entitlements
    });

  } catch (error) {
    console.error('Failed to fetch entitlements:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch entitlements',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
