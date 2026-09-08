'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    __vgAnalyticsLoaded?: boolean;
  }
}

function injectScript(attrs: Record<string, string>) {
  const script = document.createElement('script');
  for (const [key, value] of Object.entries(attrs)) {
    script.setAttribute(key, value);
  }
  document.head.appendChild(script);
}

/**
 * Loads analytics scripts exactly once per real browser session/tab -
 * never on client-side route navigation, no matter how many times this
 * component itself gets mounted/remounted by Next.js.
 *
 * Why this exists instead of just using next/script's strategy=
 * "afterInteractive": that strategy is *supposed* to guarantee a script
 * only loads once for the whole app lifetime, but under this app's
 * experimental `cacheComponents` config, it appears to re-execute the
 * script during client-side navigations (e.g. clicking a link to another
 * page). Plausible's own script captures `document.currentScript` at the
 * top of its file to read its own data-domain/data-api attributes - on a
 * second, Next-triggered re-execution, that reference isn't reliable, and
 * it silently falls back to building a broken tracking URL instead of
 * failing loudly. Re-running the script twice would also double-register
 * all its internal click/scroll/engagement event listeners, silently
 * inflating those metrics even when the URL happens to be right.
 *
 * A plain `window` flag survives React remounts and Next's internal
 * re-invocations - the only thing that resets it is an actual full page
 * reload, which is exactly the "run once" behavior we want.
 */
export default function AnalyticsScripts() {
  useEffect(() => {
    if (window.__vgAnalyticsLoaded) return;
    window.__vgAnalyticsLoaded = true;

    // Self-hosted Plausible-style analytics, proxied through this domain's
    // own /js and /vg paths (see next.config.ts rewrites) instead of
    // loading directly from stats.nozfragrances.com, so ad blockers see a
    // same-origin request instead of a third-party analytics domain with
    // a tracking-shaped filename.
    injectScript({
      src: '/js/vg-insights.js',
      'data-domain': 'nozfragrances.com',
      'data-api': '/vg/events',
    });

    // Umami Analytics (cloud) - not proxied yet. cloud.umami.is is a known
    // analytics domain and commonly blocklisted by name, so this one is
    // very likely still silently blocked by ad blockers the same way
    // Plausible was before its fix. Left as direct-load for now.
    injectScript({
      src: 'https://cloud.umami.is/script.js',
      'data-website-id': '26c905b8-4b5f-4133-8e08-d03512494514',
    });
  }, []);

  return null;
}
