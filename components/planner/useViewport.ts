import { useSyncExternalStore } from 'react';
import { breakpoints } from '@/components/ui/spacing';

export type Viewport = 'narrow' | 'tablet' | 'wide';

// The planner lays out differently below the mobile breakpoint and between it and the rail breakpoint. The .02 keeps a
// width of exactly 720 out of the narrow layout, as `min-width: 720px` would.
const NARROW = `(max-width: ${breakpoints.mobile - 0.02}px)`;
const TABLET = `(max-width: ${breakpoints.rail - 0.02}px)`;

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
