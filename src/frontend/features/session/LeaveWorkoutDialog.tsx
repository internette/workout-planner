import { Button } from '@moonshot/design-system/buttons';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { Dialog } from '@moonshot/design-system/dialog';
import { useState } from 'react';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { setLeaveChoice } from '@/frontend/features/live/settings';

/** Asks what to do with a running session’s clock when leaving it. */
export function LeaveWorkoutDialog({ v }: { v: PlannerVals }) {
  const [remember, setRemember] = useState(false);
  // With "Don't ask again" ticked, the button pressed is the answer from now on.
  const answer = (choice: 'run' | 'pause', act?: () => void) => () => {
    if (remember) setLeaveChoice(choice);
    setRemember(false);
    act?.();
  };
  return (
    <Dialog
      open={!!v.pausePromptOpen}
      onClose={v.keepGoing}
      title="Leave your workout?"
      description="The timer can keep counting while you're elsewhere, or wait for you. Either way, pick up from the day card."
      actions={
        <>
          <Button type="neutral" ghost size="md" onClick={answer('pause', v.confirmPause)}>
            Pause timer
          </Button>
          <Button type="primary" size="md" onClick={answer('run', v.leaveRunning)}>
            Keep it running
          </Button>
        </>
      }
    >
      <div style={{ marginTop: 'var(--space-4)' }}>
        <Checkbox checked={remember} onChange={setRemember} description="Change it in Settings, under During a workout.">
          Don’t ask again
        </Checkbox>
      </div>
    </Dialog>
  );
}
