import { NextResponse } from 'next/server';

export async function POST() {
  // Temporarily disabled for P0 launch
  return NextResponse.json(
    { 
      error: 'Leads not available during launch phase',
      code: 'LAUNCH_MODE'
    },
    { status: 503 }
  );
}

export async function GET() {
  // Temporarily disabled for P0 launch
  return NextResponse.json(
    { 
      error: 'Leads not available during launch phase',
      code: 'LAUNCH_MODE'
    },
    { status: 503 }
  );
}
