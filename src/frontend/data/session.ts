// The signed-in person's ID token, which Supabase verifies (row-level security).
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
