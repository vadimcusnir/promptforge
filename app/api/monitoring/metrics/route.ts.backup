import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest) {
  // Temporarily disabled for P0 launch
  return NextResponse.json(
    { 
      error: 'Monitoring metrics not available during launch phase',
      code: 'LAUNCH_MODE'
    },
    { status: 503 }
  );
}
