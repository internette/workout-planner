import { redirect } from 'next/navigation';
import PlannerLoader from '@/components/PlannerLoader';
import { AUTH_REQUIRED } from '@/lib/auth';
import { getAuth0 } from '@/lib/auth0';

export const dynamic = 'force-dynamic';

// The middleware already sends a signed-out visitor to /welcome; this checks again, so the planner never renders
// for someone who is not signed in, and tells Profile whether to offer a sign-out.
export default async function Page() {
  const auth0 = getAuth0();
  const signedIn = !!(auth0 && (await auth0.getSession()));
  if (AUTH_REQUIRED && !signedIn) redirect('/welcome');
  return <PlannerLoader signedIn={signedIn} />;
}
