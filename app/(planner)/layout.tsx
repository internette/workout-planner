import { redirect } from 'next/navigation';
import PlannerLoader from '@/components/PlannerLoader';
import { AUTH_REQUIRED, providerName, type Account } from '@/lib/auth';
import { getAuth0 } from '@/lib/auth0';

export const dynamic = 'force-dynamic';

// One planner for all five nav addresses. It lives in the layout, so moving between them keeps it mounted (and its
// data loaded) instead of starting over. The pages themselves render nothing; the address only says which screen.
// The middleware already sends a signed-out visitor to /welcome; this checks again, so the planner never renders
// for someone who is not signed in, and tells Profile who is signed in, so it can offer a sign-out.
export default async function PlannerLayout({ children }: { children: React.ReactNode }) {
  const auth0 = getAuth0();
  const session = auth0 ? await auth0.getSession() : null;
  if (AUTH_REQUIRED && !session) redirect('/welcome');
  const account: Account | null = session
    ? { email: session.user.email ?? null, provider: providerName(session.user.sub) }
    : null;
  return (
    <>
      <PlannerLoader account={account} />
      {children}
    </>
  );
}
