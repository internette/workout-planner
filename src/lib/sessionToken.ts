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

/**
 * The signed-in person's ID token, renewed when it has gone or is about to. Null when there is no session or it cannot
 * be renewed. Server only: a route handler can save the refreshed session cookie.
 */
export async function freshIdToken(auth0: Auth0Client): Promise<{ idToken: string; expiresAt: number } | null> {
  const session = await auth0.getSession();
  if (!session) return null;
  let idToken = session.tokenSet.idToken;
  if (!idToken || expiryOf(idToken) - Date.now() < 60_000) {
    try {
      await auth0.getAccessToken({ refresh: true });
      idToken = (await auth0.getSession())?.tokenSet.idToken ?? idToken;
    } catch (e) {
      console.error('Could not refresh the session:', e);
    }
  }
  const expiresAt = idToken ? expiryOf(idToken) : 0;
  return idToken && expiresAt > Date.now() ? { idToken, expiresAt } : null;
}
