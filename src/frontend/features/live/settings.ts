// Whether the session in progress shows outside the page: as a notification (on unless turned off; the browser asks
// the first time a workout starts), and as the lock screen's player (off unless turned on: it plays silent audio,
// which stops other music). Both are chosen in Profile → Settings and kept in this browser.

export type LiveSettings = { notify: boolean; player: boolean };

const KEYS = { notify: 'moonshot.live.notify', player: 'moonshot.live.player' } as const;
const EVENT = 'moonshot-live-settings';

export function liveSettings(): LiveSettings {
  try {
    return { notify: localStorage.getItem(KEYS.notify) !== '0', player: localStorage.getItem(KEYS.player) === '1' };
  } catch {
    return { notify: true, player: false };
  }
}

export function setLiveSetting(key: keyof LiveSettings, on: boolean) {
  try {
    localStorage.setItem(KEYS[key], on ? '1' : '0');
  } catch {
    // Storage blocked: the choice lasts until the page closes.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { [key]: on } }));
}

/** Calls back whenever either setting changes on this page. */
export function onLiveSettings(fn: (s: Partial<LiveSettings>) => void) {
  const handler = (e: Event) => fn((e as CustomEvent<Partial<LiveSettings>>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}

/** Notifications can be shown here: the browser has them, and a service worker to show them from. */
export const canNotify = () => typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;

/** The lock screen's player can be used here. */
export const canPlayer = () => typeof navigator !== 'undefined' && 'mediaSession' in navigator;
