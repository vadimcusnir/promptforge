import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/server-auth';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(request);
    
    // For P0 launch, return mock trends data
    const trends = {
      dates: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
      passRates: [95, 96, 94, 97, 95],
      avgScores: [85, 86, 84, 87, 85],
      avgTTAs: [78, 76, 79, 75, 77],
      runCounts: [150, 160, 145, 170, 155]
    };

    return NextResponse.json({
      success: true,
      trends,
      message: 'Trends available during launch phase',
      userId: user.id
    });

  } catch (error) {
    console.error('Dashboard trends API error:', error);
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch trends',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}
