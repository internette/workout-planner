// The signed-in person's ID token, which Supabase verifies (row-level security).
// The session lives in a cookie the page cannot read, so the token comes from our own route. It is kept in memory
// until a minute before it expires.

import { safeReturnTo } from '@/shared/auth';

const EARLY = 60_000;
let cached: { token: string; expiresAt: number } | null = null;
let inFlight: Promise<string | null> | null = null;

// The session ended while the page was open (it expired and couldn't be refreshed, or was ended elsewhere).
let signedOut = false;
const listeners = new Set<() => void>();

/** The session has ended: nothing can be saved until the person signs in again. */
export const isSignedOut = () => signedOut;

/** Calls `fn` when the session ends. A page that listens says so in place, rather than being sent to the front door
 * mid-workout or mid-edit; with nobody listening, the page goes to the front door, which brings the person back here
 * once they've signed in. Returns a function that stops listening. */
export function onSignedOut(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** The front door, set to come back to this page once signed in. */
export const welcomeHere = () =>
  '/welcome?returnTo=' + encodeURIComponent(safeReturnTo(window.location.pathname + window.location.search));

async function fetchIdToken(): Promise<string | null> {
  const res = await fetch('/api/token', { cache: 'no-store' });
  if (!res.ok) {
    cached = null;
    if (res.status === 401) {
      const first = !signedOut;
      signedOut = true;
      if (!listeners.size) window.location.assign(welcomeHere());
      else if (first) listeners.forEach((fn) => fn());
      // A request without the token would go as nobody, and row-level security would answer it with nothing: a plan
      // that looks empty. Failing it keeps what's on screen, and ticks wait to be saved.
      throw new Error('Signed out');
    }
    return null;
  }
  const { idToken, expiresAt } = (await res.json()) as { idToken: string; expiresAt: number };
  cached = { token: idToken, expiresAt };
  signedOut = false;
  return idToken;
}

/** The signed-in person's ID token, which Supabase accepts, or null when nobody is signed in. Throws once the session
 * has ended (see onSignedOut). */
export async function getIdToken(): Promise<string | null> {
  if (cached && cached.expiresAt - Date.now() > EARLY) return cached.token;
  inFlight ??= fetchIdToken().finally(() => {
    inFlight = null;
  });
  return inFlight;
}
