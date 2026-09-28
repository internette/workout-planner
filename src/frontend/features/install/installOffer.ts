'use client';

import { useSyncExternalStore } from 'react';

// Chrome's install event. It is not in the DOM types.
export interface InstallEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
declare global {
  interface WindowEventMap {
    beforeinstallprompt: InstallEvent;
    appinstalled: Event;
  }
}

// The browser's offer to install the app, kept while it's good for one install dialog. The install sheet and the
// button in Profile → Settings both use it; each offer opens the browser's dialog once, so whoever uses it clears it.
let offer: InstallEvent | null = null;
const listeners = new Set<() => void>();

export const getInstallOffer = () => offer;
export function setInstallOffer(next: InstallEvent | null) {
  offer = next;
  listeners.forEach((fn) => fn());
}

/** The offer, for a component to show an install button only while there is one. */
export function useInstallOffer() {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    getInstallOffer,
    () => null,
  );
}

/** Opens the browser's install dialog with the offer (once), and says whether it was accepted. */
export async function openInstallDialog(): Promise<'accepted' | 'dismissed' | null> {
  const event = offer;
  if (!event) return null;
  setInstallOffer(null);
  try {
    await event.prompt();
    return (await event.userChoice).outcome;
  } catch {
    return null;
  }
}
