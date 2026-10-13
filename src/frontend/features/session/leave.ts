import { leaveChoice } from '@/frontend/features/live/settings';
import type { Ctx } from '../planner/store/types';

// Leaving a workout's page while its clock runs: the nav bar, the screen's Back arrow and the browser's Back all come
// here. It asks, unless an answer was given once ("Don't ask again" in the question, or Settings → During a workout).

/** The clock of the session on screen, paused where it stands. */
export const pausedClock = ({ st, timerKey, timerElapsedSec }: Pick<Ctx, 'st' | 'timerKey' | 'timerElapsedSec'>) => ({
  workoutTimer: Object.assign({}, st.workoutTimer, { [timerKey]: { elapsed: timerElapsedSec, runningSince: null } }),
});

/** Leaves (calls `proceed`) as the person chose: after asking, with the clock running, or with it paused. */
export function leaveRunningWorkout(ctx: Pick<Ctx, 'logic' | 'st' | 'timerKey' | 'timerElapsedSec'>, proceed: () => void) {
  const choice = leaveChoice();
  if (choice === 'ask') return ctx.logic.s({ pausePrompt: { proceed } });
  if (choice === 'pause') ctx.logic.s(pausedClock(ctx));
  proceed();
}
