import PlannerLoader from '@/components/PlannerLoader';
import { getAuth0 } from '@/lib/auth0';

export const dynamic = 'force-dynamic';

// The middleware sends a signed-out visitor to /welcome when sign-in is required. Here we only learn whether
// someone is signed in, so Profile can offer to sign out.
export default async function Page() {
  const auth0 = getAuth0();
  const signedIn = !!(auth0 && (await auth0.getSession()));
  return <PlannerLoader signedIn={signedIn} />;
}
