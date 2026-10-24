import { Eyebrow } from '@moonshot/design-system/typography';

/** What kind of workout something is, when it isn't a plain one: a warm-up, a stretch or yoga. */
export type WorkoutKind = 'warmup' | 'stretch' | 'yoga';

/** What a workout, session or row is marked as: a warm-up, and (apart from that) a stretch or yoga. None for a plain
 * workout. A warm-up can be any kind, so there can be two: a warm-up stretch. */
export const kindOf = (x?: { warmup?: boolean; stretch?: boolean; yoga?: boolean } | null): WorkoutKind[] =>
  [x?.warmup && 'warmup', x?.stretch ? 'stretch' : x?.yoga ? 'yoga' : null].filter(Boolean) as WorkoutKind[];

const LABEL: Record<WorkoutKind, string> = { warmup: 'Warm-up', stretch: 'Stretch', yoga: 'Yoga' };

/** What kind of workout a session is, named as "What kind of workout?" names it, after "Warm-up · " when it's one:
 * "Lifting", "Warm-up · Stretching". */
export const typeLabelOf = (x: { warmup?: boolean; stretch?: boolean; yoga?: boolean; ride?: { run?: boolean } | null }) =>
  (x.warmup ? 'Warm-up · ' : '') +
  (x.ride ? (x.ride.run ? 'Run/Walk' : 'Cycling') : x.stretch ? 'Stretching' : x.yoga ? 'Yoga' : 'Lifting');

// Marks a warm-up, a stretch or yoga ("Warm-up · Stretch" for both): an eyebrow above its name, or beside it
// (inline) where a row has no room above. Nothing for a plain workout.
export function KindTag({ kind, inline }: { kind: WorkoutKind[] | null; inline?: boolean }) {
  if (!kind || !kind.length) return null;
  return <Eyebrow inline={inline}>{kind.map((k) => LABEL[k]).join(' · ')}</Eyebrow>;
}
