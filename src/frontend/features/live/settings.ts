// During a workout: whether the screen stays on (on unless turned off), and whether the session in progress shows
// outside the page: as a notification (on unless turned off; the browser asks the first time a workout starts), and as
// the lock screen's player (off unless turned on: it plays silent audio, which stops other music). All are chosen in
// Profile → Settings and kept in this browser. So is what leaving a workout's page does with its running clock: ask
// each time (unless told otherwise), keep it running, or pause it.

export type LiveSettings = { awake: boolean; notify: boolean; player: boolean };

const KEYS = { awake: 'moonshot.live.awake', notify: 'moonshot.live.notify', player: 'moonshot.live.player' } as const;
const EVENT = 'moonshot-live-settings';

export type LeaveChoice = 'ask' | 'run' | 'pause';
const LEAVE_KEY = 'moonshot.live.leave';

/** What leaving a workout with its clock running does: ask, or the answer given once ("Don't ask again", or Settings). */
export function leaveChoice(): LeaveChoice {
  try {
    const v = localStorage.getItem(LEAVE_KEY);
    return v === 'run' || v === 'pause' ? v : 'ask';
  } catch {
    return 'ask';
  }
}

export function setLeaveChoice(choice: LeaveChoice) {
  try {
    localStorage.setItem(LEAVE_KEY, choice);
  } catch {
    // Storage blocked: it asks again next time.
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { leave: choice } }));
}

export function liveSettings(): LiveSettings {
  try {
    return {
      awake: localStorage.getItem(KEYS.awake) !== '0',
      notify: localStorage.getItem(KEYS.notify) !== '0',
      player: localStorage.getItem(KEYS.player) === '1',
    };
  } catch {
    return { awake: true, notify: true, player: false };
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

/** Calls back whenever a setting changes on this page. */
export function onLiveSettings(fn: (s: Partial<LiveSettings> & { leave?: LeaveChoice }) => void) {
  const handler = (e: Event) => fn((e as CustomEvent<Partial<LiveSettings> & { leave?: LeaveChoice }>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}

/** Notifications can be shown here: the browser has them, and a service worker to show them from. */
export const canNotify = () => typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;

/** The lock screen's player can be used here. */
export const canPlayer = () => typeof navigator !== 'undefined' && 'mediaSession' in navigator;

/** The screen can be kept on here. An app added to an iPhone's or iPad's home screen before iOS 18.4 has the API but
 * it does nothing there, so it doesn't count. */
export const canWake = () => {
  if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return false;
  const ios = /\b(?:iPhone|iPad|iPod)\b.* OS (\d+)_(\d+)/.exec(navigator.userAgent);
  const homeScreen = typeof window !== 'undefined' && window.matchMedia?.('(display-mode: standalone)').matches;
  return !(ios && homeScreen && Number(ios[1]) * 100 + Number(ios[2]) < 1804);
};

/** Tells the phone how the page's sound sits with other apps' (Safari's Audio Session API, iOS 16.4 and later).
 * "ambient": it has none of its own to speak of, so music from other apps plays on, neither paused nor turned down.
 * "playback": the lock screen's player, which has to be what's playing. Elsewhere this does nothing. */
export function setAudioSession(type: 'ambient' | 'playback') {
  const session = typeof navigator !== 'undefined' ? (navigator as Navigator & { audioSession?: { type: string } }).audioSession : undefined;
  if (session) session.type = type;
}
