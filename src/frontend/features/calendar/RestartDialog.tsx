import { Button } from '@moonshot/design-system/buttons';
import { Dialog } from '@moonshot/design-system/dialog';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Asks before starting a session over. */
export function RestartDialog({ v }: { v: PlannerVals }) {
  return (
    <Dialog
      open={!!v.restartPromptOpen}
      onClose={v.cancelRestart}
      title={v.restartPromptTitle ?? 'Start this workout over?'}
      description={v.restartPromptBody}
      actions={
        <>
          <Button type="neutral" ghost size="md" onClick={v.cancelRestart}>
            Keep going
          </Button>
          <Button type="danger" size="md" onClick={v.confirmRestart}>
            Start over
          </Button>
        </>
      }
    />
  );
}
