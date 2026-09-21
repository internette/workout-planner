'use client';

import { useEffect, useRef, useState } from 'react';
import { useWindowEvent } from '@/components/ui/useWindowEvent';

// Chrome's install event. It is not in the DOM types.
interface InstallEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
declare global {
  interface WindowEventMap {
    beforeinstallprompt: InstallEvent;
    appinstalled: Event;
  }
}

const KEY = 'moonshot.install-prompt';
/** After "Not now", how long before it may ask again. */
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;
/** How long after the plan has loaded the prompt waits, so it does not land on top of the first screen. */
const SHOW_AFTER_MS = 3000;
/** How long the "we won't ask again" note stays. */
const NOTICE_MS = 6000;

// What the person told us, kept in the browser. `never` is the toggle: once set it is never cleared here, so the prompt
// stays gone for good. Storage can be blocked (private windows), and then it simply asks each visit.
type Choice = { never?: boolean; until?: number };
const readChoice = (): Choice => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as Choice;
  } catch {
    return {};
  }
};
const saveChoice = (choice: Choice) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(choice));
  } catch {
    /* blocked: the choice lasts until the page closes */
  }
};
const alreadyAnswered = () => {
  const { never, until = 0 } = readChoice();
  return !!never || until > Date.now();
};

const isMobile = () =>
  window.matchMedia('(pointer: coarse) and (hover: none)').matches ||
  (navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData?.mobile === true;
const isInstalled = () => window.matchMedia('(display-mode: standalone)').matches;

/**
 * Offers to install the app, once, on a phone's browser. `ready` says the plan has loaded. The browser only fires its
 * install event where installing is possible (Chrome and Edge on Android; iPhone Safari has none), so nowhere else is
 * anyone asked. A "don't ask again" is final.
 */
export function useInstallPrompt(ready: boolean) {
  const offer = useRef<InstallEvent | null>(null);
  const [available, setAvailable] = useState(false);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState(false);

  useWindowEvent('beforeinstallprompt', (event) => {
    // A desktop browser keeps its own behaviour. On a phone the browser's bar is held back: we ask once, in our own way,
    // and someone who said no does not get the browser's version either.
    if (!isMobile() || isInstalled()) return;
    event.preventDefault();
    if (alreadyAnswered()) return;
    offer.current = event;
    setAvailable(true);
  });

  useWindowEvent('appinstalled', () => {
    saveChoice({ never: true });
    offer.current = null;
    setAvailable(false);
    setOpen(false);
  });

  useEffect(() => {
    if (!available || !ready) return;
    const timer = setTimeout(() => setOpen(true), SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, [available, ready]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(false), NOTICE_MS);
    return () => clearTimeout(timer);
  }, [notice]);

  const finish = (dontAsk: boolean) => {
    saveChoice(dontAsk ? { never: true } : { until: Date.now() + SNOOZE_MS });
    offer.current = null;
    setAvailable(false);
    setOpen(false);
  };

  return {
    open,
    notice,
    /** Not now. With the toggle on it is final, and a note says where to find it later. */
    notNow: (dontAsk: boolean) => {
      finish(dontAsk);
      setNotice(dontAsk);
    },
    /** Hands over to the browser's own install dialog. Cancelling there counts as Not now, and the toggle still counts. */
    install: async (dontAsk: boolean) => {
      const event = offer.current;
      if (!event) return;
      offer.current = null;
      setOpen(false);
      setAvailable(false);
      try {
        await event.prompt();
        const { outcome } = await event.userChoice;
        saveChoice(outcome === 'accepted' || dontAsk ? { never: true } : { until: Date.now() + SNOOZE_MS });
      } catch {
        saveChoice(dontAsk ? { never: true } : { until: Date.now() + SNOOZE_MS });
      }
    },
  };
}
