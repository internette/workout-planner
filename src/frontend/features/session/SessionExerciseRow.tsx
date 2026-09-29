import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import { DoneTick } from '@/frontend/components/DoneTick';
import { IconSquare } from '@/frontend/components/IconSquare';
import { SetPips } from '@/frontend/components/SetPips';

/** An exercise on the session page, with its tick, and on today's session how far through its sets it is. */
export function SessionExerciseRow({ exercise }: { exercise: any }) {
  return (
    <Card
      pad="sm"
      style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '13px' }}
    >
      <IconSquare>{exercise?.icoSvg}</IconSquare>
      <span style={{ minWidth: '0', flex: '1 1 auto' }}>
        <Text
          variant="cardTitle"
          tone={exercise?.nameDone ? 'muted' : 'ink'}
          style={{ display: 'block', textDecoration: exercise?.nameDone ? 'line-through' : undefined }}
        >
          {exercise?.name}
        </Text>
        <Text
          variant="caption"
          tone="muted"
          style={{ display: 'block', marginTop: '3px' }}
        >
          {exercise?.detail}
        </Text>
      </span>
      {exercise?.showTick ? (
        <DoneTick done={!!exercise?.isDone} onToggle={exercise?.toggleDone} label={exercise?.doneAria ?? ''} />
      ) : null}
      {exercise?.showSets ? (
        <div style={{ flex: '1 1 100%', display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: 'calc(34px + 13px)' }}>
          <SetPips pips={exercise.setPips as boolean[]} />
          <Text variant="caption" tone="slate" style={{ flex: '1 1 auto', fontVariantNumeric: 'tabular-nums' }}>
            {exercise.setsLabel}
          </Text>
        </div>
      ) : null}
    </Card>
  );
}
