import { NextResponse } from 'next/server';
import { getAuth0 } from '@/lib/auth0';

export const dynamic = 'force-dynamic';

const noStore = { 'Cache-Control': 'no-store' };

// The expiry ("exp", in seconds) inside a JWT. The ID token's own lifetime, not the access token's.
const expiryOf = (jwt: string): number => {
  try {
    const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString());
    return typeof payload.exp === 'number' ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
};

/**
 * The signed-in person's ID token, for the browser to send to Supabase. Supabase verifies it against Auth0 and
 * uses its claims for row-level security. The session cookie stays unreadable to the page; only this token leaves.
 */
export async function GET() {
  const auth0 = getAuth0();
  const session = auth0 ? await auth0.getSession() : null;
  if (!auth0 || !session) return NextResponse.json({ error: 'signed_out' }, { status: 401, headers: noStore });

  let idToken = session.tokenSet.idToken;
  // Renew it when it has gone, or is about to. A route handler can save the refreshed session cookie.
  if (!idToken || expiryOf(idToken) - Date.now() < 60_000) {
    try {
      await auth0.getAccessToken({ refresh: true });
      idToken = (await auth0.getSession())?.tokenSet.idToken ?? idToken;
    } catch (e) {
      console.error('Could not refresh the session:', e);
    }
  }
  const expiresAt = idToken ? expiryOf(idToken) : 0;
  if (!idToken || expiresAt <= Date.now()) {
    return NextResponse.json({ error: 'signed_out' }, { status: 401, headers: noStore });
  }
  return NextResponse.json({ idToken, expiresAt }, { headers: noStore });
}
