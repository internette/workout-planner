import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuth0 } from '@/lib/auth0';
import { deleteAuth0User, MANAGEMENT_CONFIGURED } from '@/lib/auth0Management';
import { freshIdToken } from '@/lib/sessionToken';

export const dynamic = 'force-dynamic';

// Everything a person owns, children before parents in case the tables reference each other.
const TABLES = ['diary_entries', 'plan_entries', 'workout_exercises', 'library_exercises', 'workouts'] as const;

const respond = (body: object, status: number) => NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

/**
 * Permanently deletes the signed-in person: their plan, workouts, exercises and diary from Supabase, then their sign-in
 * from Auth0. There is no way back. The data goes first, so a failure can never leave personal data behind with no
 * sign-in to reach it, and running it again after a failure is safe.
 */
export async function POST(request: Request) {
  const auth0 = getAuth0();
  const session = auth0 ? await auth0.getSession() : null;
  const token = auth0 ? await freshIdToken(auth0) : null;
  if (!session || !token) return respond({ error: 'signed_out' }, 401);

  // A typed confirmation, so a stray or forged request cannot delete anyone.
  const body = (await request.json().catch(() => null)) as { confirm?: string } | null;
  if (body?.confirm !== 'DELETE') return respond({ error: 'not_confirmed' }, 400);

  // Deleting only the data would leave their name and email with Auth0, so without the means to remove both, remove neither.
  if (!MANAGEMENT_CONFIGURED()) return respond({ error: 'not_configured' }, 503);

  const sub = session.user.sub;
  try {
    // The person's own token, so row-level security limits every delete to their rows, whatever is asked for here.
    const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      accessToken: async () => token.idToken,
      auth: { persistSession: false },
    });
    for (const table of TABLES) {
      const { error } = await db.from(table).delete().eq('user_id', sub);
      if (error) throw new Error(`${table}: ${error.message}`);
    }
  } catch (e) {
    console.error('Account deletion stopped while deleting data:', e instanceof Error ? e.message : e);
    return respond({ error: 'failed' }, 500);
  }

  try {
    await deleteAuth0User(sub);
  } catch (e) {
    console.error('Account deletion: data deleted, sign-in not:', e instanceof Error ? e.message : e);
    return respond({ error: 'sign_in_remains' }, 502);
  }

  // Tells the front door to say it, for a moment. Not a secret, and gone after a minute.
  const done = respond({ ok: true }, 200);
  done.cookies.set('moonshot_deleted', '1', { path: '/', maxAge: 60, sameSite: 'lax', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  return done;
}
