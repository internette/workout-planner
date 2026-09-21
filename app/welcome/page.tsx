import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LandingPage } from '@/components/auth/LandingPage';
import { AUTH0_CONFIGURED, getAuth0 } from '@/lib/auth0';

export const metadata = { title: 'Moonshot — Sign in' };
export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: { searchParams: { error?: string } }) {
  // Someone already signed in has no use for the front door.
  const auth0 = getAuth0();
  if (auth0 && (await auth0.getSession())) redirect('/calendar');
  // Set by the delete-account route, and gone after a minute.
  const deleted = cookies().get('moonshot_deleted')?.value === '1';
  return <LandingPage configured={AUTH0_CONFIGURED} returned={searchParams.error} deleted={deleted} />;
}
