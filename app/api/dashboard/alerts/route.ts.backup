import { NextRequest, NextResponse } from 'next/server';
import { checkSLACompliance } from '@/lib/telemetry';
import { requireAuth } from '@/lib/auth/server-auth';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(request);
    
    // Use authenticated user's ID instead of orgId parameter
    const orgId = user.id;

    // Check SLA compliance and get alerts
    const compliance = await checkSLACompliance(orgId);

    return NextResponse.json({
      compliant: compliance.compliant,
      alerts: compliance.alerts,
      timestamp: new Date().toISOString(),
      userId: user.id
    });

  } catch (error) {
    console.error('Dashboard alerts API error:', error);
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to check SLA compliance',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
