import { Button } from '@moonshot/design-system/buttons';
import { Dialog } from '@moonshot/design-system/dialog';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Asks what to do with a running session’s clock when leaving it. */
export function LeaveWorkoutDialog({ v }: { v: PlannerVals }) {
  return (
    <Dialog
      open={!!v.pausePromptOpen}
      onClose={v.keepGoing}
      title="Leave your workout?"
      description="The timer can keep counting while you're elsewhere, or wait for you. Either way, pick up from the day card."
      actions={
        <>
          <Button type="neutral" ghost size="md" onClick={v.confirmPause}>
            Pause timer
          </Button>
          <Button type="primary" size="md" onClick={v.leaveRunning}>
            Keep it running
          </Button>
        </>
      }
    />
  );
}
