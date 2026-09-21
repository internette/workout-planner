import { NextResponse } from 'next/server';
import { getAuth0 } from '@/lib/auth0';
import { freshIdToken } from '@/lib/sessionToken';

export const dynamic = 'force-dynamic';

const noStore = { 'Cache-Control': 'no-store' };

/**
 * The signed-in person's ID token, for the browser to send to Supabase. Supabase verifies it against Auth0 and
 * uses its claims for row-level security. The session cookie stays unreadable to the page; only this token leaves.
 */
export async function GET() {
  const auth0 = getAuth0();
  const token = auth0 ? await freshIdToken(auth0) : null;
  if (!token) return NextResponse.json({ error: 'signed_out' }, { status: 401, headers: noStore });
  return NextResponse.json(token, { headers: noStore });
}
