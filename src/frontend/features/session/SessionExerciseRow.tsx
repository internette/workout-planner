import { IconTile } from '@moonshot/design-system/icon-tile';
import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import { DoneTick } from '@/frontend/components/DoneTick';
import { SetPips } from '@/frontend/components/SetPips';
import { ExerciseName } from '@/frontend/components/ExerciseName';

/** An exercise on the session page, with its tick, and on today's session how far through its sets it is. */
export function SessionExerciseRow({ exercise }: { exercise: any }) {
  return (
    <Card
      pad="sm"
      style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3)' }}
    >
      <IconTile as="span" size="xs" variant="flat">{exercise?.icoSvg}</IconTile>
      <span style={{ minWidth: '0', flex: '1 1 auto' }}>
        <ExerciseName name={exercise?.name ?? ''} done={!!exercise?.nameDone} />
        <Text
          variant="body"
          tone="muted"
          style={{ display: 'block', marginTop: 'var(--space-1)' }}
        >
          {exercise?.detail}
        </Text>
      </span>
      {exercise?.showTick ? (
        <DoneTick done={!!exercise?.isDone} onToggle={exercise?.toggleDone} label={exercise?.doneAria ?? ''} />
      ) : null}
      {exercise?.showSets ? (
        <div style={{ flex: '1 1 100%', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', paddingLeft: 'calc(34px + var(--space-3))' }}>
          <SetPips pips={exercise.setPips as boolean[]} />
          <Text variant="body" tone="slate" style={{ flex: '1 1 auto', fontVariantNumeric: 'tabular-nums' }}>
            {exercise.setsLabel}
          </Text>
        </div>
      ) : null}
    </Card>
  );
}
