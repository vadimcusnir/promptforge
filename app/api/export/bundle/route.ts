import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  // Temporarily disabled for P0 launch
  return NextResponse.json(
    { 
      error: 'Export bundle not available during launch phase',
      code: 'LAUNCH_MODE'
    },
    { status: 503 }
  );
}
