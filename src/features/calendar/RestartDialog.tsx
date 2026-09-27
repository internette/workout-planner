import { Button } from '@moonshot/design-system/buttons';
import { Dialog } from '@moonshot/design-system/dialog';
import type { PlannerVals } from '@/features/planner/store/types';

/** Asks before starting a session over. */
export function RestartDialog({ v }: { v: PlannerVals }) {
  return (
    <Dialog
      open={!!v.restartPromptOpen}
      onClose={v.cancelRestart}
      title="Restart this workout?"
      description={v.restartPromptBody}
      actions={
        <>
          <Button type="neutral" ghost size="md" onClick={v.cancelRestart}>
            Keep my progress
          </Button>
          <Button type="danger" size="md" onClick={v.confirmRestart}>
            Restart
          </Button>
        </>
      }
    />
  );
}
