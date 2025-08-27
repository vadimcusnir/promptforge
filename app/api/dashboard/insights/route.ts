import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/server-auth';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(request);
    
    // For P0 launch, return mock insights data
    const insights = [
      {
        type: 'performance',
        title: 'System Ready for Launch',
        description: 'All core systems are operational and ready for production deployment',
        impact: 'low',
        recommendation: 'Proceed with launch as planned'
      },
      {
        type: 'quality',
        title: 'P0 Requirements Met',
        description: 'All critical launch requirements have been successfully implemented',
        impact: 'low',
        recommendation: 'Continue with current development roadmap'
      }
    ];

    return NextResponse.json({
      success: true,
      insights,
      message: 'Insights available during launch phase',
      userId: user.id
    });

  } catch (error) {
    console.error('Dashboard insights API error:', error);
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch insights',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
