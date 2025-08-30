import { NextRequest, NextResponse } from 'next/server';
import { redirectTelemetry } from '@/lib/redirect-telemetry-edge';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check authentication for admin access
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // For now, allow any authenticated user to view redirect analytics
    // In production, you might want to restrict this to admin users only
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'summary';

    if (reportType === 'summary') {
      const stats = await redirectTelemetry.getRedirectStats();
      return NextResponse.json({
        success: true,
        data: stats
      });
    } else if (reportType === 'full') {
      const report = await redirectTelemetry.generateReport();
      return NextResponse.json({
        success: true,
        data: report
      });
    } else if (reportType === 'legacy-share') {
      const legacyShare = await redirectTelemetry.getLegacyRedirectShare();
      return NextResponse.json({
        success: true,
        data: {
          legacyRedirectShare: legacyShare,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid report type. Use: summary, full, or legacy-share' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Failed to fetch redirect analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication for admin access
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, legacySlug } = body;

    if (action === 'track' && legacySlug) {
      // Manually track a redirect (for testing purposes)
      await redirectTelemetry.trackRedirect(legacySlug);
      
      return NextResponse.json({
        success: true,
        message: `Redirect tracked for ${legacySlug}`
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use: track with legacySlug' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Failed to process redirect analytics request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
