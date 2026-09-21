// Sign-in settings that are safe to use in the browser. The server's Auth0 client is in lib/auth0.ts.

export type Provider = 'google' | 'apple';

/**
 * Whether the planner needs a signed-in user. Off by default, so the app keeps working locally until Auth0 and
 * Supabase are set up and the per-user migration has been run (see the README).
 */
export const AUTH_REQUIRED = process.env.NEXT_PUBLIC_AUTH_REQUIRED === 'true';

/** The Auth0 connection names for each provider. Auth0 calls Google's "google-oauth2". */
export const CONNECTION: Record<Provider, string> = { google: 'google-oauth2', apple: 'apple' };

/** Where a provider button goes. The server route sends the person to Auth0 and back to the planner. */
export const loginUrl = (provider: Provider) =>
  `/auth/login?connection=${encodeURIComponent(CONNECTION[provider])}&returnTo=${encodeURIComponent('/')}`;

export const LOGOUT_URL = `/auth/logout?returnTo=${encodeURIComponent('/welcome')}`;

// ---- the ID token Supabase verifies
// The session lives in a cookie the page cannot read, so the token comes from our own route. It is kept in memory
// until a minute before it expires.

const EARLY = 60_000;
let cached: { token: string; expiresAt: number } | null = null;
let inFlight: Promise<string | null> | null = null;

async function fetchIdToken(): Promise<string | null> {
  const res = await fetch('/api/token', { cache: 'no-store' });
  if (!res.ok) {
    cached = null;
    // The session is gone, so the planner has nothing to show. Back to the front door.
    if (res.status === 401) window.location.assign('/welcome');
    return null;
  }
  const { idToken, expiresAt } = (await res.json()) as { idToken: string; expiresAt: number };
  cached = { token: idToken, expiresAt };
  return idToken;
}

/** The signed-in person's ID token, which Supabase accepts, or null when nobody is signed in. */
export async function getIdToken(): Promise<string | null> {
  if (cached && cached.expiresAt - Date.now() > EARLY) return cached.token;
  inFlight ??= fetchIdToken().finally(() => {
    inFlight = null;
  });
  return inFlight;
}
