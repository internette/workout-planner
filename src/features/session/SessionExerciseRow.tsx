import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import { DoneTick } from '@/components/DoneTick';
import { IconSquare } from '@/components/IconSquare';

/** An exercise on the session page, with its tick. */
export function SessionExerciseRow({ exercise }: { exercise: any }) {
  return (
    <Card
      pad="sm"
      style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '13px' }}
    >
      <IconSquare>{exercise?.icoSvg}</IconSquare>
      <span style={{ minWidth: '0' }}>
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
    </Card>
  );
}
