import { Text } from '@moonshot/design-system/typography';

/** What kind of workout something is, when it isn't a plain one: a warm-up or a stretch. */
export type WorkoutKind = 'warmup' | 'stretch';

/** The kind of a workout, session or row that says whether it's a warm-up or a stretch, or null for a plain one. */
export const kindOf = (x?: { warmup?: boolean; stretch?: boolean } | null): WorkoutKind | null =>
  x?.warmup ? 'warmup' : x?.stretch ? 'stretch' : null;

const LABEL: Record<WorkoutKind, string> = { warmup: 'WARM-UP', stretch: 'STRETCH' };

// Marks a warm-up or a stretch: a small label above its name, or beside it (inline) where a row has no room above.
// Nothing for a plain workout.
export function KindTag({ kind, inline }: { kind: WorkoutKind | null; inline?: boolean }) {
  if (!kind) return null;
  return (
    <>
      {/* A real space, so it isn't read run together with the words before it. */}
      {inline ? ' ' : null}
      <Text
        variant="micro"
        as="span"
        tone="accent"
        weight="bold"
        style={
          inline
            ? { display: 'inline-block', marginLeft: '4px', verticalAlign: 'middle' }
            : { display: 'block', marginBottom: '3px' }
        }
      >
        {LABEL[kind]}
      </Text>
    </>
  );
}
