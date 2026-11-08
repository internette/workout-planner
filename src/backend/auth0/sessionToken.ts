import 'server-only';
import type { Auth0Client } from '@auth0/nextjs-auth0/server';

// The expiry ("exp", in seconds) inside a JWT, as milliseconds. The ID token's own lifetime, not the access token's.
export const expiryOf = (jwt: string): number => {
  try {
    const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString());
    return typeof payload.exp === 'number' ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
};

type Token = { idToken: string; expiresAt: number };

// Auth0's answers that mean the sign-in itself is over: there is no refresh token, or Auth0 refused it (revoked,
// expired, or rotated away). Anything else (Auth0 slow or unreachable, a network blip) is passing, and must not sign
// the person out.
const isSignInOver = (e: unknown): boolean => {
  const err = e as { code?: string; cause?: { code?: string } } | null;
  return err?.code === 'missing_refresh_token' || err?.code === 'session_expired' || err?.cause?.code === 'invalid_grant';
};

/**
 * The signed-in person's ID token, renewed when it has gone or is about to. 'signed_out' when there is no session or
 * Auth0 refused to renew it; 'unavailable' when renewing failed for a passing reason, so the page can try again
 * instead of treating the person as signed out. Server only: a route handler can save the refreshed session cookie.
 */
export async function idTokenFor(auth0: Auth0Client): Promise<Token | 'signed_out' | 'unavailable'> {
  const session = await auth0.getSession();
  if (!session) return 'signed_out';
  let idToken = session.tokenSet.idToken;
  if (!idToken || expiryOf(idToken) - Date.now() < 60_000) {
    if (!session.tokenSet.refreshToken) {
      // Without one the session ends with the ID token (Auth0's default lifetime is 10 hours). Auth0 only issues it
      // when the application allows the Refresh Token grant (see the README).
      console.warn('The session has no refresh token, so its ID token cannot be renewed.');
    }
    try {
      await auth0.getAccessToken({ refresh: true });
      idToken = (await auth0.getSession())?.tokenSet.idToken ?? idToken;
    } catch (e) {
      console.error('Could not refresh the session:', e);
      if (!isSignInOver(e)) return 'unavailable';
    }
  }
  const expiresAt = idToken ? expiryOf(idToken) : 0;
  return idToken && expiresAt > Date.now() ? { idToken, expiresAt } : 'signed_out';
}

/** The signed-in person's ID token, renewed if need be, or null when it cannot be had right now. */
export async function freshIdToken(auth0: Auth0Client): Promise<Token | null> {
  const token = await idTokenFor(auth0);
  return typeof token === 'string' ? null : token;
}
