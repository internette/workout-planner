// Sign-in settings that are safe to use in the browser. The server's Auth0 client is in lib/auth0.ts.

export type Provider = 'google' | 'apple';

/**
 * Whether the planner needs a signed-in user. On unless NEXT_PUBLIC_AUTH_REQUIRED=false, so a visitor who is not
 * signed in always lands on the front door. Set it to false only to work locally before Auth0 is set up.
 */
export const AUTH_REQUIRED = process.env.NEXT_PUBLIC_AUTH_REQUIRED !== 'false';

/** The Auth0 connection names for each provider. Auth0 calls Google's "google-oauth2". */
export const CONNECTION: Record<Provider, string> = { google: 'google-oauth2', apple: 'apple' };

/** Where a provider button goes. The server route sends the person to Auth0 and back to the planner. */
export const loginUrl = (provider: Provider) =>
  `/auth/login?connection=${encodeURIComponent(CONNECTION[provider])}&returnTo=${encodeURIComponent('/calendar')}`;

/** Who is signed in, as far as Profile needs to say. Each part is null when the session lacks it. */
export interface Account {
  name: string | null;
  email: string | null;
  /** The provider's photo of them, an https address. */
  picture: string | null;
  /** When the account was created, as an ISO date. Auth0 records it; the Action in the README puts it in the token. */
  createdAt: string | null;
  /** The provider the session used, as a person would say it: "Google" or "Apple". */
  provider: string | null;
}

/**
 * What to call them. Apple can hide the name and Auth0 then fills it with the email, so a name that is just the email
 * does not count; the part of the email before the @ is the next best thing.
 */
export const displayName = (a: Account | null): string => {
  const named = a?.name && a.name !== a.email ? a.name.trim() : '';
  return named || a?.email?.split('@')[0] || 'You';
};

/** What each provider is called on screen. */
export const PROVIDER_NAME: Record<Provider, string> = { google: 'Google', apple: 'Apple' };

/** "google-oauth2|1234" -> "Google". Auth0 user ids begin with the connection that made them. */
export const providerName = (sub?: string | null): string | null => {
  const connection = sub?.split('|')[0];
  const provider = (Object.keys(CONNECTION) as Provider[]).find((p) => CONNECTION[p] === connection);
  return provider ? PROVIDER_NAME[provider] : null;
};

// Auth0 only accepts an absolute post-logout address (and it must be listed under Allowed Logout URLs).
export const logoutUrl = () =>
  `/auth/logout?returnTo=${encodeURIComponent(`${window.location.origin}/welcome`)}`;

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
