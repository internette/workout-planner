import { cache } from 'react';
import { ProgramPage } from '@/frontend/features/share/ProgramPage';
import { AUTH_REQUIRED, PROVIDERS } from '@/shared/auth';
import { getAuth0, AUTH0_CONFIGURED } from '@/backend/auth0/client';
import { isShareId, readProgram, type SharedProgram } from '@/frontend/shared/sharedProgram';

export const dynamic = 'force-dynamic';

// A shared program's page: public, so anyone with the link can see it (the middleware lets it through). It reads only
// that one program, with the anon key, through shared_program(), which can't list the others and counts the visit.
// Once per request: the title and the page share the one read.
const load = cache(async (id: string): Promise<{ name: string; program: SharedProgram } | null> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !isShareId(id)) return null;
  try {
    const res = await fetch(url + '/rest/v1/rpc/shared_program', {
      method: 'POST',
      headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ share_id: id }),
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const found = await res.json();
    const program = found ? readProgram(found.program) : null;
    const name = typeof found?.name === 'string' ? found.name.trim().slice(0, 80) : '';
    return program && name ? { name, program } : null;
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: { params: { id: string } }) {
  const found = await load(params.id);
  return { title: (found ? found.name : 'Shared program') + ' — Moonshot', robots: { index: false } };
}

export default async function Page({ params }: { params: { id: string } }) {
  const found = await load(params.id);
  // Signed in, it can be copied straight away; with sign-in off (working locally), everyone counts as signed in.
  const auth0 = getAuth0();
  const signedIn = !AUTH_REQUIRED || !!(auth0 && (await auth0.getSession()));
  return (
    <ProgramPage
      id={params.id}
      name={found?.name ?? null}
      program={found?.program ?? null}
      signedIn={signedIn}
      providers={AUTH0_CONFIGURED ? PROVIDERS : []}
    />
  );
}
