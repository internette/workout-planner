'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from './AuthProvider';
import { LandingPage } from './LandingPage';

function Welcome() {
  const { status } = useAuth();
  const router = useRouter();
  // Someone already signed in has no use for the front door.
  useEffect(() => {
    if (status === 'signedIn') router.replace('/');
  }, [status, router]);
  if (status === 'signedIn') return null;
  return <LandingPage />;
}

/** The landing page on its own address, whether or not the planner requires sign-in. */
export function WelcomePage() {
  return (
    <AuthProvider>
      <Welcome />
    </AuthProvider>
  );
}
