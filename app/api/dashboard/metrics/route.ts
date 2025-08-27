import { NextRequest, NextResponse } from 'next/server';
import { getKPIMetrics } from '@/lib/telemetry';
import { requireAuth } from '@/lib/auth/server-auth';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(request);
    
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '7');

    // Validate days parameter
    if (days < 1 || days > 30) {
      return NextResponse.json(
        { error: 'Days must be between 1 and 30' },
        { status: 400 }
      );
    }

    // Use authenticated user's ID instead of orgId parameter
    const orgId = user.id;

    // Get KPI metrics from telemetry library
    const metrics = await getKPIMetrics(orgId, days);

    return NextResponse.json(metrics);

  } catch (error) {
    console.error('Dashboard metrics API error:', error);
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch dashboard metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
