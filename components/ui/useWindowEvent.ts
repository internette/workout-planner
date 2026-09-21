'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';

/**
 * Listens for a window event for as long as the component is mounted. For events React has no prop for (scroll,
 * resize, pageshow, keys pressed anywhere). The handler can change every render without the listener being
 * re-added, so pass an inline function freely. To listen only some of the time, mount the component only then.
 */
export function useWindowEvent<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  { capture, passive }: { capture?: boolean; passive?: boolean } = {},
) {
  const latest = useRef(handler);
  useLayoutEffect(() => {
    latest.current = handler;
  });
  useEffect(() => {
    const on = (event: WindowEventMap[K]) => latest.current(event);
    window.addEventListener(type, on, { capture, passive });
    return () => window.removeEventListener(type, on, { capture });
  }, [type, capture, passive]);
}
