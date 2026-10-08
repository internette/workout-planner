import { DisclosureChevron } from '@moonshot/design-system/disclosure';
import { type ReactNode } from 'react';
import { IconButton } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Close } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';
import { AreaChoice } from '@/frontend/components/AreaChoice';
import { DoneTick } from '@/frontend/components/DoneTick';
import { SetsFields } from '@/frontend/components/SetsFields';
import { IconPicker } from '@/frontend/components/IconPicker';
import { ExerciseName } from '@/frontend/components/ExerciseName';
import { t } from '@/frontend/features/planner/viewHelpers';

/** An exercise in the editor’s list: its icon, sets and target areas when opened, its tick, and removing it. `handle` is the drag handle from ReorderableList. */
export function EditorExerciseItem({ exercise, handle }: { exercise: any; handle: ReactNode }) {
  return (
    <Card pad="sm">
      <div style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
        {handle}
        <IconPicker
          size="sm"
          open={!!exercise?.open}
          onToggle={exercise?.toggle}
          onClose={exercise?.close}
          current={t(exercise?.icoSvg)}
          label={exercise?.iconAria ?? ''}
          icons={exercise?.icons}
        />
        <button
          type="button"
          onClick={exercise?.toggleExpand}
          aria-expanded={!!exercise?.expanded}
          className="hit"
          style={{
            flex: '1',
            minWidth: '0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: 'none',
            background: 'none',
            padding: '0',
            textAlign: 'left',
            font: 'inherit',
            color: 'inherit',
            cursor: 'pointer',
          }}
        >
          {/* The name fills the row, so every chevron lines up in one column beside the tick and ✕. */}
          <span style={{ flex: '1', minWidth: '0' }}>
            <ExerciseName name={exercise?.name ?? ''} done={!!exercise?.nameDone} />
            {!exercise?.expanded ? (
              <Text variant="body" tone="muted" style={{ display: 'block', marginTop: '3px' }}>
                {exercise?.detail}
              </Text>
            ) : null}
          </span>
          <DisclosureChevron open={!!exercise?.expanded} />
        </button>
        {exercise?.showTick ? (
          <DoneTick done={!!exercise?.isDone} onToggle={exercise?.toggleDone} label={exercise?.doneAria ?? ''} />
        ) : (
          <span style={{ marginLeft: 'auto' }} />
        )}
        <IconButton label={exercise?.removeAria} size="md" onClick={exercise?.remove}>
          <Close color="var(--color-muted)" size={19} />
        </IconButton>
      </div>
      {exercise?.expanded ? (
      <>
      <SetsFields
        sets={exercise?.sets ?? ''}
        reps={exercise?.reps ?? ''}
        weight={exercise?.weight ?? ''}
        rest={exercise?.rest ?? ''}
        onSets={exercise?.setSets}
        onReps={exercise?.setReps}
        onWeight={exercise?.setWeight}
        onRest={exercise?.setRest}
      />
      <AreaChoice areas={exercise?.areas ?? []} />
      </>
      ) : null}
    </Card>
  );
}
