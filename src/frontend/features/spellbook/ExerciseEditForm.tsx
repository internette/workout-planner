import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import { FormActions } from '@/frontend/components/FormActions';
import { ExerciseFields } from '@/frontend/components/ExerciseFields';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Editing an exercise: its fields and saving. */
export function ExerciseEditForm({ v }: { v: PlannerVals }) {
  return (
    <>
      <Card style={{ marginTop: '18px' }}>
        <ExerciseFields
          name={v.exerciseEdit.name}
          onName={v.exerciseEdit.setName}
          nameError={v.exerciseEdit.nameError}
          sets={v.exerciseEdit.sets}
          reps={v.exerciseEdit.reps}
          weight={v.exerciseEdit.weight}
          rest={v.exerciseEdit.rest}
          onSets={v.exerciseEdit.setSets}
          onReps={v.exerciseEdit.setReps}
          onWeight={v.exerciseEdit.setWeight}
          onRest={v.exerciseEdit.setRest}
          areas={v.exerciseEdit.areas ?? []}
          equipment={v.exerciseEdit.equipmentGroups ? { id: 'exercise-equipment', open: v.exerciseEdit.equipmentOpen, onToggle: v.exerciseEdit.toggleEquipment, summary: v.exerciseEdit.equipmentSummary, groups: v.exerciseEdit.equipmentGroups } : null}
          icon={v.exerciseEdit.icons}
        />
      </Card>
      <FormActions>
        {v.exerciseEdit.saveHint ? (
          <Text variant="body" tone="muted" as="p" style={{ margin: '0 auto 0 0', flex: '1 1 200px' }}>
            {v.exerciseEdit.saveHint}
          </Text>
        ) : null}
        <Button type="neutral" ghost size="lg" onClick={v.exerciseEdit.cancel}>
          Cancel
        </Button>
        <Button
          type="primary"
          size="lg"
          disabled={!v.exerciseEdit.canSave}
          onClick={v.exerciseEdit.save}
        >
          {v.exerciseEdit.saveLabel}
        </Button>
      </FormActions>
    </>
  );
}
