// app/api/toggle-coming-soon/route.ts
import { NextRequest, NextResponse } from 'next/server';

function isAdmin(req: NextRequest) {
  return req.cookies.get('pf_role')?.value === 'admin';
}

export async function POST(req: NextRequest) {
  // Optional: require admin
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const on = body?.on ?? true; // if nothing sent => turn on

  const res = NextResponse.json({ ok: true, coming_soon: on ? 'on' : 'off' });
  res.cookies.set('coming_soon', on ? 'on' : 'off', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}

// GET endpoint to check current status
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  const comingSoonCookie = req.cookies.get('coming_soon')?.value === 'on';
  const comingSoonEnv = process.env.COMING_SOON === 'true';

  return NextResponse.json({
    coming_soon_env: comingSoonEnv,
    coming_soon_cookie: comingSoonCookie,
    active: comingSoonEnv || comingSoonCookie,
  });
}
