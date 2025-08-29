import { NextResponse } from 'next/server';

export async function GET() {
  const robots = `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /cursor/
Disallow: /supabase/
Disallow: /db/
Disallow: /scripts/
Disallow: /tests/
Disallow: /node_modules/
Disallow: /.env*
Disallow: /dashboard/
Disallow: /login/
Disallow: /signup/
Disallow: /logout/
Disallow: /auth/
Disallow: /webhooks/
Disallow: /monitoring/
Disallow: /security/
Disallow: /export/
Disallow: /gpt-editor/
Disallow: /gpt-test/
Disallow: /run-example/
Disallow: /runs/
Disallow: /entitlements/
Disallow: /billing/
Disallow: /analytics/
Disallow: /feedback/
Disallow: /leads/
Disallow: /waitlist/
Disallow: /community/join/

# Allow public pages
Allow: /generator
Allow: /modules
Allow: /pricing
Allow: /docs
Allow: /guides
Allow: /about
Allow: /contact
Allow: /blog
Allow: /launch
Allow: /community
Allow: /legal
Allow: /thankyou

# Sitemap
Sitemap: https://promptforge.ai/sitemap.xml`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
