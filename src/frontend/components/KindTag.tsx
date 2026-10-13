import type { ReactNode } from 'react';
import { Text } from '@moonshot/design-system/typography';

/** What kind of workout something is, when it isn't a plain one: a warm-up, a stretch or yoga. */
export type WorkoutKind = 'warmup' | 'stretch' | 'yoga';

/** What a workout, session or row is marked as: a warm-up, and (apart from that) a stretch or yoga. None for a plain
 * workout. A warm-up can be any kind, so there can be two: a warm-up stretch. */
export const kindOf = (x?: { warmup?: boolean; stretch?: boolean; yoga?: boolean } | null): WorkoutKind[] =>
  [x?.warmup && 'warmup', x?.stretch ? 'stretch' : x?.yoga ? 'yoga' : null].filter(Boolean) as WorkoutKind[];

const LABEL: Record<WorkoutKind, string> = { warmup: 'Warm-up', stretch: 'Stretch', yoga: 'Yoga' };

/** What kind of workout a session is, named as "What kind of workout?" names it, after "Warm-up · " when it's one:
 * "Lifting", "Warm-up · Stretching". */
export const typeLabelOf = (x: { warmup?: boolean; stretch?: boolean; yoga?: boolean; ride?: unknown }) =>
  (x.warmup ? 'Warm-up · ' : '') + (x.ride ? 'Cycling' : x.stretch ? 'Stretching' : x.yoga ? 'Yoga' : 'Lifting');

// Marks a warm-up, a stretch or yoga ("Warm-up · Stretch" for both): a small label above its name, or beside it
// (inline) where a row has no room above. Nothing for a plain workout.
/** The small label above (or beside) a workout's name, in the accent color: what KindTag and SessionTags both draw. */
export function TagLabel({ inline, children }: { inline?: boolean; children: ReactNode }) {
  return (
    <>
      {/* A real space, so it isn't read run together with the words before it. */}
      {inline ? ' ' : null}
      <Text
        variant="micro"
        as="span"
        tone="accent"
        style={
          inline
            ? { display: 'inline-block', marginLeft: '4px', verticalAlign: 'middle' }
            : { display: 'block', marginBottom: '3px' }
        }
      >
        {children}
      </Text>
    </>
  );
}

export function KindTag({ kind, inline }: { kind: WorkoutKind[] | null; inline?: boolean }) {
  if (!kind || !kind.length) return null;
  return <TagLabel inline={inline}>{kind.map((k) => LABEL[k]).join(' · ')}</TagLabel>;
}
