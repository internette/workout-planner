'use client';

import { useEffect, useRef, useState } from 'react';
import { useWindowEvent } from '@moonshot/design-system/useWindowEvent';

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
/** The same answers, for being asked to add the app back once it has been removed. */
const REINSTALL_KEY = 'moonshot.reinstall-prompt';
/** Set once the app has been installed on this device (or opened as the installed app). */
const INSTALLED_KEY = 'moonshot.installed';
/** After "Not now", how long before it may ask again. */
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;
/** How long after the plan has loaded the prompt waits, so it does not land on top of the first screen. */
const SHOW_AFTER_MS = 3000;
/** How long the "we won't ask again" note stays. */
const NOTICE_MS = 6000;

// What the person told us, kept in the browser. `never` is the toggle: once set it is never cleared here, so the prompt
// stays gone for good. Storage can be blocked (private windows), and then it simply asks each visit.
type Choice = { never?: boolean; until?: number };
const readChoice = (key: string): Choice => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '{}') as Choice;
  } catch {
    return {};
  }
};
const saveChoice = (key: string, choice: Choice) => {
  try {
    localStorage.setItem(key, JSON.stringify(choice));
  } catch {
    /* blocked: the choice lasts until the page closes */
  }
};
const alreadyAnswered = (key: string) => {
  const { never, until = 0 } = readChoice(key);
  return !!never || until > Date.now();
};
const wasInstalled = () => {
  try {
    return !!localStorage.getItem(INSTALLED_KEY);
  } catch {
    return false;
  }
};
const markInstalled = () => {
  try {
    localStorage.setItem(INSTALLED_KEY, String(Date.now()));
  } catch {
    /* blocked: a later removal just can't be noticed */
  }
};

const isMobile = () =>
  window.matchMedia('(pointer: coarse) and (hover: none)').matches ||
  (navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData?.mobile === true;
const isInstalled = () => window.matchMedia('(display-mode: standalone)').matches;

/**
 * Offers to install the app, once, on a phone's browser. `ready` says the plan has loaded. The browser only fires its
 * install event where installing is possible (Chrome and Edge on Android; iPhone Safari has none), so nowhere else is
 * anyone asked. A "don't ask again" is final.
 *
 * Once installed, it's never offered again as new. But the browser only offers to install a site that isn't installed,
 * so its offer on a phone where the app was installed before means it has since been removed: then it asks whether to
 * add it back, with its own "don't ask again". (iPhone gives no way to tell: its installed app keeps separate storage.)
 */
export function useInstallPrompt(ready: boolean) {
  const offer = useRef<InstallEvent | null>(null);
  const [available, setAvailable] = useState(false);
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState(false);
  // 'reinstall' when the app was installed here before and has been removed.
  const [kind, setKind] = useState<'install' | 'reinstall'>('install');
  const key = kind === 'reinstall' ? REINSTALL_KEY : KEY;

  // Opened as the installed app: remember it, so a removal later can be noticed.
  useEffect(() => {
    if (isInstalled()) markInstalled();
  }, []);

  useWindowEvent('beforeinstallprompt', (event) => {
    // A desktop browser keeps its own behaviour. On a phone the browser's bar is held back: we ask once, in our own way,
    // and someone who said no does not get the browser's version either.
    if (!isMobile() || isInstalled()) return;
    event.preventDefault();
    const removed = wasInstalled();
    if (alreadyAnswered(removed ? REINSTALL_KEY : KEY)) return;
    offer.current = event;
    setKind(removed ? 'reinstall' : 'install');
    setAvailable(true);
  });

  useWindowEvent('appinstalled', () => {
    saveChoice(KEY, { never: true });
    markInstalled();
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
    saveChoice(key, dontAsk ? { never: true } : { until: Date.now() + SNOOZE_MS });
    offer.current = null;
    setAvailable(false);
    setOpen(false);
  };

  return {
    open,
    notice,
    kind,
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
        // Added back: nothing more to ask until it's removed again, unless they said never.
        if (outcome === 'accepted') saveChoice(key, dontAsk ? { never: true } : {});
        else saveChoice(key, dontAsk ? { never: true } : { until: Date.now() + SNOOZE_MS });
      } catch {
        saveChoice(key, dontAsk ? { never: true } : { until: Date.now() + SNOOZE_MS });
      }
    },
  };
}
