import { NextRequest, NextResponse } from 'next/server';

// Same upstream used by the next.config.ts script rewrite - kept as an env
// var for consistency, defaulting to the real Plausible instance.
const PLAUSIBLE_UPSTREAM = process.env.PLAUSIBLE_UPSTREAM_URL || 'https://stats.nozfragrances.com';

/**
 * Manually proxies Plausible event submissions, replacing what was a
 * next.config.ts `rewrites()` entry for this same path.
 *
 * Why this exists instead of a config rewrite: rewrites to an EXTERNAL
 * destination don't reliably forward non-GET requests in this app's
 * self-hosted "standalone" build - the GET rewrite for /js/vg-insights.js
 * works fine, but this POST endpoint's rewrite was silently not
 * intercepting the request at all. Instead, it fell through to this app's
 * own [country]/[locale] dynamic routing, which tried to interpret "vg" as
 * a country code, failed validation, and redirected to the store's actual
 * default locale while preserving the rest of the path - producing the
 * broken /in/en/vg/events 404 that broke tracking.
 *
 * A real Route Handler at an exact path is always matched by Next.js
 * before any dynamic segment, regardless of HTTP method, so this can't
 * suffer the same failure mode.
 */
export async function POST(req: NextRequest) {
  const body = await req.text();

  const upstreamRes = await fetch(`${PLAUSIBLE_UPSTREAM}/api/event`, {
    method: 'POST',
    headers: {
      'Content-Type': req.headers.get('content-type') || 'text/plain',
      'X-Forwarded-For': req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '',
      'User-Agent': req.headers.get('user-agent') || '',
    },
    body,
  });

  return new NextResponse(await upstreamRes.text(), {
    status: upstreamRes.status,
    headers: {
      'Content-Type': upstreamRes.headers.get('content-type') || 'text/plain',
    },
  });
}
