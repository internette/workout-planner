import { redirect } from 'next/navigation';
import { LandingPage } from '@/components/auth/LandingPage';
import { AUTH0_CONFIGURED, getAuth0 } from '@/lib/auth0';

export const metadata = { title: 'Ritual — Sign in' };
export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: { searchParams: { error?: string } }) {
  // Someone already signed in has no use for the front door.
  const auth0 = getAuth0();
  if (auth0 && (await auth0.getSession())) redirect('/');
  return <LandingPage configured={AUTH0_CONFIGURED} returned={searchParams.error} />;
}
