import { useSyncExternalStore } from 'react';

export type Viewport = 'narrow' | 'tablet' | 'wide';

// The planner lays out differently below 720px and between 720px and 1020px.
const NARROW = '(max-width: 719.98px)';
const TABLET = '(max-width: 1019.98px)';

function subscribe(onChange: () => void) {
  const queries = [window.matchMedia(NARROW), window.matchMedia(TABLET)];
  queries.forEach((q) => q.addEventListener('change', onChange));
  return () => queries.forEach((q) => q.removeEventListener('change', onChange));
}

function snapshot(): Viewport {
  if (window.matchMedia(NARROW).matches) return 'narrow';
  return window.matchMedia(TABLET).matches ? 'tablet' : 'wide';
}

/** Which layout the window calls for. Only re-renders when a breakpoint is crossed, not on every resize. */
export function useViewport(): Viewport {
  return useSyncExternalStore(subscribe, snapshot, () => 'wide');
}
