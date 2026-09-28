import { Button } from '@moonshot/design-system/buttons';
import { Dialog } from '@moonshot/design-system/dialog';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Asks before signing out. */
export function SignOutDialog({ v }: { v: PlannerVals }) {
  return (
    <Dialog
      open={!!v.signOutOpen}
      onClose={v.closeSignOut}
      title="Sign out?"
      description="Your plan, streak and chronicle stay exactly as they are. Sign back in with the same account and everything is where you left it."
      actions={
        <>
          <Button type="neutral" ghost size="md" onClick={v.closeSignOut} disabled={!!v.signingOut}>
            Stay signed in
          </Button>
          <Button type="danger" ghost size="md" onClick={v.confirmSignOut} disabled={!!v.signingOut}>
            {v.signingOut ? 'Signing out…' : 'Sign out'}
          </Button>
        </>
      }
    />
  );
}
