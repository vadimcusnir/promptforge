import { NextRequest, NextResponse } from 'next/server';
import { alertSystem } from '@/lib/observability';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status'); // active, acknowledged, resolved
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let incidents =
      status === 'active' ? alertSystem.getActiveIncidents() : alertSystem.getActiveIncidents(); // Would filter by status in production

    // Apply limit
    incidents = incidents.slice(0, limit);

    return NextResponse.json({
      incidents,
      total: incidents.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] Failed to get incidents:', error);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, incident_id, user_id, notes } = body;

    if (!incident_id) {
      return NextResponse.json({ error: 'incident_id required' }, { status: 400 });
    }

    let result = false;

    switch (action) {
      case 'acknowledge':
        if (!user_id) {
          return NextResponse.json(
            { error: 'user_id required for acknowledgment' },
            { status: 400 }
          );
        }
        result = alertSystem.acknowledgeIncident(incident_id, user_id);
        break;

      case 'resolve':
        if (!user_id) {
          return NextResponse.json({ error: 'user_id required for resolution' }, { status: 400 });
        }
        result = alertSystem.resolveIncident(incident_id, user_id, notes);
        break;

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    if (!result) {
      return NextResponse.json(
        {
          error: 'Failed to perform action - incident not found or invalid state',
        },
        { status: 404 }
      );
    }

    const updatedIncident = alertSystem.getIncident(incident_id);

    return NextResponse.json({
      status: 'success',
      action,
      incident: updatedIncident,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[API] Failed to process incident action:', error);

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
