'use client';

import { useEffect } from 'react';

/**
 * Registers the pass-through worker in public/sw.js, which is what lets Chrome offer to install the app. Production
 * only: in development a worker sits between the page and the dev server, and the install prompt is not wanted there.
 */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  }, []);
  return null;
}
