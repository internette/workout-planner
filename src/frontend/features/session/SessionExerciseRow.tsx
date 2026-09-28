import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import { DoneTick } from '@/frontend/components/DoneTick';
import { IconSquare } from '@/frontend/components/IconSquare';

/** An exercise on the session page, with its tick, and on today's session its sets. */
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
          {/* One dot a set, filled once done. The words beside it say the same for a screen reader. */}
          <span aria-hidden="true" style={{ display: 'flex', gap: '5px' }}>
            {(exercise.setPips as boolean[]).map((on, i) => (
              <span
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: 'var(--radius-full)',
                  background: on ? 'var(--color-accent)' : 'none',
                  boxShadow: on ? 'none' : 'inset 0 0 0 1.5px var(--color-outline)',
                }}
              />
            ))}
          </span>
          <Text variant="caption" tone="slate" style={{ flex: '1 1 auto', fontVariantNumeric: 'tabular-nums' }}>
            {exercise.setsLabel}
          </Text>
          <Button type="secondary" size="sm" onClick={exercise.doneSet} aria-label={exercise.doneSetAria}>
            Done set
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
