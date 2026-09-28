import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import { FormActions } from '@/frontend/components/FormActions';
import { ExerciseFields } from '@/frontend/components/ExerciseFields';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Adding an exercise to the Spellbook. */
export function NewExerciseCard({ v }: { v: PlannerVals }) {
  return (
    <>
      <Card elevation="overlay" id="new-exercise" data-arsenal-add style={{ marginTop: '16px' }}>
        <Text variant="cardTitle" style={{ display: 'block' }}>
          New exercise
        </Text>
        <div style={{ marginTop: 'var(--space-4)' }}>
          <ExerciseFields
            name={v.draftName ?? ''}
            onName={v.setName}
            nameError={v.draftNameError}
            onNameKeyDown={v.commitOnEnter}
            sets={v.draftSets ?? ''}
            reps={v.draftReps ?? ''}
            weight={v.draftWeight ?? ''}
            rest={v.draftRest ?? ''}
            onSets={v.setSets}
            onReps={v.setReps}
            onWeight={v.setWeight}
            onRest={v.setRest}
            areas={v.draftAreas ?? []}
            equipment={v.draftEquipment ? { id: 'new-exercise-equipment', open: v.draftEquipment.open, onToggle: v.draftEquipment.toggle, summary: v.draftEquipment.summary, groups: v.draftEquipment.groups } : null}
            icon={v.iconGrid}
          />
        </div>
        <FormActions compact>
          {v.draftHint ? (
            <Text variant="caption" tone="muted" as="p" style={{ margin: '0 auto 0 0', flex: '1 1 200px' }}>
              {v.draftHint}
            </Text>
          ) : null}
          <Button type="neutral" ghost size="lg" onClick={v.closeArsenalAdd}>
            Cancel
          </Button>
          <Button
            type="primary"
            size="lg"
            disabled={v.commitDisabled}
            onClick={v.commitArsenal}
          >
            Add to Spellbook
          </Button>
        </FormActions>
      </Card>
    </>
  );
}
