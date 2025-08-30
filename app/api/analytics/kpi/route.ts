import { NextRequest, NextResponse } from 'next/server';
import { kpiTracker } from '@/lib/kpi-tracking-edge';
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

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'dashboard';

    if (reportType === 'dashboard') {
      const dashboard = await kpiTracker.getDashboard();
      return NextResponse.json({
        success: true,
        data: dashboard
      });
    } else if (reportType === 'legacy-redirect-share') {
      const legacyShare = await kpiTracker.getLegacyRedirectShare();
      const redirectStats = await redirectTelemetry.getRedirectStats();
      
      return NextResponse.json({
        success: true,
        data: {
          legacyRedirectShare: legacyShare,
          redirectStats,
          timestamp: new Date().toISOString()
        }
      });
    } else if (reportType === 'report') {
      const report = await kpiTracker.generateReport();
      return NextResponse.json({
        success: true,
        data: report
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid report type. Use: dashboard, legacy-redirect-share, or report' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Failed to fetch KPI data:', error);
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
    const { action, metricId, value, metrics } = body;

    if (action === 'update-metric' && metricId && value !== undefined) {
      await kpiTracker.updateMetric(metricId, value);
      
      return NextResponse.json({
        success: true,
        message: `Metric ${metricId} updated to ${value}`
      });
    } else if (action === 'update-performance' && metrics) {
      await kpiTracker.updatePerformanceMetrics(metrics);
      
      return NextResponse.json({
        success: true,
        message: 'Performance metrics updated'
      });
    } else if (action === 'update-legacy-share' && value !== undefined) {
      await kpiTracker.updateLegacyRedirectShare(value);
      
      return NextResponse.json({
        success: true,
        message: `Legacy redirect share updated to ${value}%`
      });
    } else if (action === 'reset') {
      await kpiTracker.resetMetrics();
      
      return NextResponse.json({
        success: true,
        message: 'KPI metrics reset to defaults'
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use: update-metric, update-performance, update-legacy-share, or reset' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Failed to update KPI data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
