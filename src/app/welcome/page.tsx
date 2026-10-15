import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LandingPage } from '@/frontend/features/auth/LandingPage';
import { AUTH0_CONFIGURED, getAuth0 } from '@/backend/auth0/client';
import { expiryOf } from '@/backend/auth0/sessionToken';
import { safeReturnTo } from '@/shared/auth';

export const metadata = { title: 'Moonshot — Sign in' };
export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: { searchParams: { error?: string; returnTo?: string } }) {
  // Where to go once signed in: the page that sent them here (see the middleware), else the planner.
  const returnTo = safeReturnTo(searchParams.returnTo);
  // Someone already signed in has no use for the front door. Signed in means a session whose ID token still works:
  // one that has run out, and can't be renewed, is signed out as far as the planner is concerned (its token route
  // answers 401 and sends it here), so sending it straight back would go round in a loop. Renewing it isn't tried
  // here, since a page can't save the renewed cookie; signing in again takes a tap.
  const auth0 = getAuth0();
  const idToken = auth0 ? (await auth0.getSession())?.tokenSet.idToken : null;
  if (idToken && expiryOf(idToken) > Date.now() + 60_000) redirect(returnTo);
  // Set by the delete-account route, and gone after a minute.
  const deleted = cookies().get('moonshot_deleted')?.value === '1';
  return <LandingPage configured={AUTH0_CONFIGURED} returned={searchParams.error} deleted={deleted} returnTo={returnTo} />;
}
