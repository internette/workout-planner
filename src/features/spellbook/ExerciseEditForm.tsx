import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { IconChoiceGroup } from '@moonshot/design-system/icon-choice-group';
import { Label, TextField } from '@moonshot/design-system/text-field';
import { Text } from '@moonshot/design-system/typography';
import { AreaChoice } from '@/components/AreaChoice';
import { EquipmentPicker } from '@/components/EquipmentPicker';
import { FormActions } from '@/components/FormActions';
import { SetsFields } from '@/components/SetsFields';
import type { PlannerVals } from '@/features/planner/store/types';

/** Editing an exercise: its fields and saving. */
export function ExerciseEditForm({ v }: { v: PlannerVals }) {
  return (
    <>
      <Card style={{ marginTop: '18px' }}>
        <TextField
          label="Name"
          value={v.exerciseEdit.name}
          onChange={v.exerciseEdit.setName}
          placeholder="e.g. Bulgarian Split Squat"
          error={v.exerciseEdit.nameError || undefined}
        />
        <SetsFields
          sets={v.exerciseEdit.sets}
          reps={v.exerciseEdit.reps}
          weight={v.exerciseEdit.weight}
          rest={v.exerciseEdit.rest}
          onSets={v.exerciseEdit.setSets}
          onReps={v.exerciseEdit.setReps}
          onWeight={v.exerciseEdit.setWeight}
          onRest={v.exerciseEdit.setRest}
        />
        <AreaChoice areas={v.exerciseEdit.areas ?? []} />
        {v.exerciseEdit.equipmentGroups ? (
          <EquipmentPicker
            id="exercise-equipment"
            open={v.exerciseEdit.equipmentOpen}
            onToggle={v.exerciseEdit.toggleEquipment}
            summary={v.exerciseEdit.equipmentSummary}
            groups={v.exerciseEdit.equipmentGroups}
          />
        ) : null}
        <Label style={{ margin: '16px 0 8px' }}>Icon</Label>
        <IconChoiceGroup label="Icon" columns={4} {...v.exerciseEdit.icons} />
      </Card>
      <FormActions>
        {v.exerciseEdit.saveHint ? (
          <Text variant="caption" tone="muted" as="p" style={{ margin: '0 auto 0 0', flex: '1 1 200px' }}>
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
