// Going heavier (or lighter) a step at a time, from Edit. A machine's stack and a cable go up 10 lb at a time; free
// weights, and anything whose equipment isn't known, 5 lb.
import { EQUIPMENT_GROUPS } from './constants';

const BY_TENS = new Set([
  ...(EQUIPMENT_GROUPS.find((g) => g.label === 'Machines')?.items || []),
  'Cable machine',
  'Lat pulldown / row',
]);

/** How many pounds one tap of − or + changes an exercise's weight by. */
export const weightStep = (e: { equipment?: string[] | null }) => ((e.equipment || []).some((x) => BY_TENS.has(x)) ? 10 : 5);

/** A weight in pounds ("95"), a step up (1) or down (-1): "100". Never below nothing, which is no weight (""). */
export function stepWeight(pounds: string, dir: 1 | -1, step: number): string {
  const next = Math.max(0, (parseFloat(pounds) || 0) + dir * step);
  return next ? String(Math.round(next * 100) / 100) : '';
}
