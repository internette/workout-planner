import { DisclosureChevron } from '@moonshot/design-system/disclosure';
import { type ReactNode } from 'react';
import { Button, Pressable } from '@moonshot/design-system/buttons';
import { Badge } from '@moonshot/design-system/badge';
import { Card } from '@moonshot/design-system/card';
import { Checkbox } from '@moonshot/design-system/checkbox';
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {handle}
        <Pressable
          onClick={exercise?.toggleExpand}
          aria-expanded={!!exercise?.expanded}
          hit
          style={{
            flex: '1',
            minWidth: '0',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
        >
          {/* The name fills the row, so every chevron lines up in one column beside the tick and ✕. */}
          <span style={{ flex: '1', minWidth: '0' }}>
            <ExerciseName name={exercise?.name ?? ''} done={!!exercise?.nameDone} />
            {/* Added while editing: it isn't in the workout until Save. */}
            {exercise?.isNew ? (
              <Badge tone="soft" style={{ marginTop: 'var(--space-1)', marginLeft: 'var(--space-1)', padding: 'var(--space-1) var(--space-2)' }}>
                New
              </Badge>
            ) : null}
            {!exercise?.expanded ? (
              <Text variant="body" tone="muted" style={{ display: 'block', marginTop: 'var(--space-1)' }}>
                {exercise?.detail}
              </Text>
            ) : null}
          </span>
          <DisclosureChevron open={!!exercise?.expanded} />
        </Pressable>
        {exercise?.showTick ? (
          <DoneTick done={!!exercise?.isDone} onToggle={exercise?.toggleDone} label={exercise?.doneAria ?? ''} />
        ) : null}
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
        band={exercise?.band}
        weighted={exercise?.weighted}
      />
      {/* Both sides keep the same sets, weight and rest unless switched off here. */}
      {exercise?.showSync ? (
        <div style={{ marginTop: 'var(--space-4)' }}>
          <Checkbox switch checked={!!exercise?.synced} onChange={exercise?.setSynced}>
            Same for both sides
          </Checkbox>
        </div>
      ) : null}
      <AreaChoice areas={exercise?.areas ?? []} />
      {/* Its icon and removing it, with the rest of its settings: the closed row keeps its room for the details. */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-line)' }}>
        <IconPicker
            size="sm"
            open={!!exercise?.open}
            onToggle={exercise?.toggle}
            onClose={exercise?.close}
            current={t(exercise?.icoSvg)}
            label={exercise?.iconAria ?? ''}
            icons={exercise?.icons}
          />
        <Text variant="body" tone="muted">Icon</Text>
        <span style={{ marginLeft: 'auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
          {exercise?.removeSideLabel ? (
            <Button type="neutral" ghost size="sm" onClick={exercise?.removeSide}>
              {exercise.removeSideLabel}
            </Button>
          ) : null}
          <Button type="danger" ghost size="sm" onClick={exercise?.remove} aria-label={exercise?.removeAria}>
            <Close color="var(--color-danger)" size={16} />
            {exercise?.removeLabel}
          </Button>
        </span>
      </div>
      </>
      ) : null}
    </Card>
  );
}
