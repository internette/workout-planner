'use client';

import { useEffect, useState } from 'react';
import { useWindowEvent } from '@moonshot/design-system/useWindowEvent';
import { openInstallDialog, setInstallOffer } from './installOffer';

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
// `v: 2` marks an answer saved since installing stopped writing `never` too. Before, an install saved the same
// `{ never: true }` as "Don't ask me again", so a removed app was never offered again; an unmarked `never` is read as
// unanswered, once (it is rewritten as unanswered), and whatever is answered then is kept for good.
type Choice = { never?: boolean; until?: number; v?: 2 };
const saveChoice = (key: string, choice: Choice) => {
  try {
    localStorage.setItem(key, JSON.stringify({ ...choice, v: 2 }));
  } catch {
    /* blocked: the choice lasts until the page closes */
  }
};
const readChoice = (key: string): Choice => {
  let choice: Choice;
  try {
    choice = JSON.parse(localStorage.getItem(key) ?? '{}') as Choice;
  } catch {
    return {};
  }
  if (key === KEY && choice.never && !choice.v) {
    saveChoice(key, {});
    return {};
  }
  return choice;
};
const alreadyAnswered = (key: string) => {
  const { never, until = 0 } = readChoice(key);
  return !!never || until > Date.now();
};
/** Whether the app was installed on this device before (so, if it can be installed now, it has been removed). */
export const wasInstalled = () => {
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
    if (isInstalled()) return;
    // Kept for the button in Profile → Settings, which offers it whatever was answered here.
    setInstallOffer(event);
    // A desktop browser keeps its own behaviour. On a phone the browser's bar is held back: we ask once, in our own way,
    // and someone who said no does not get the browser's version either.
    if (!isMobile()) return;
    event.preventDefault();
    const removed = wasInstalled();
    if (alreadyAnswered(removed ? REINSTALL_KEY : KEY)) return;
    setKind(removed ? 'reinstall' : 'install');
    setAvailable(true);
  });

  // Installed, from here or the browser's menu: remembered, so a removal later is noticed. The prompt's answers stay as
  // they are, except that a "not now" for adding it back is over.
  useWindowEvent('appinstalled', () => {
    markInstalled();
    if (!readChoice(REINSTALL_KEY).never) saveChoice(REINSTALL_KEY, {});
    setInstallOffer(null);
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
      setOpen(false);
      setAvailable(false);
      const outcome = await openInstallDialog();
      // Installed: nothing more to ask until it's removed again, unless they said never.
      if (outcome === 'accepted') saveChoice(key, dontAsk ? { never: true } : {});
      else saveChoice(key, dontAsk ? { never: true } : { until: Date.now() + SNOOZE_MS });
    },
  };
}
