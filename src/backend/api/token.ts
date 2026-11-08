import 'server-only';
import { NextResponse } from 'next/server';
import { getAuth0 } from '@/backend/auth0/client';
import { idTokenFor } from '@/backend/auth0/sessionToken';

const noStore = { 'Cache-Control': 'no-store' };

/**
 * The signed-in person's ID token, for the browser to send to Supabase. Supabase verifies it against Auth0 and
 * uses its claims for row-level security. The session cookie stays unreadable to the page; only this token leaves.
 * 401 means signed out. 503 means the token could not be renewed just now (Auth0 slow or unreachable): the page tries
 * again later rather than signing the person out.
 */
export async function GET() {
  const auth0 = getAuth0();
  const token = auth0 ? await idTokenFor(auth0) : 'signed_out';
  if (token === 'signed_out') return NextResponse.json({ error: 'signed_out' }, { status: 401, headers: noStore });
  if (token === 'unavailable') return NextResponse.json({ error: 'try_again' }, { status: 503, headers: noStore });
  return NextResponse.json(token, { headers: noStore });
}
