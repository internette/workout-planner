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

/** Adding an exercise to the Spellbook. */
export function NewExerciseCard({ v }: { v: PlannerVals }) {
  return (
    <>
      <Card elevation="overlay" id="new-exercise" data-arsenal-add style={{ marginTop: '18px' }}>
        <Text variant="cardTitle" style={{ display: 'block' }}>
          New exercise
        </Text>
        <TextField
          label="Exercise name"
          containerStyle={{ marginTop: '16px' }}
          value={v.draftName ?? ''}
          onChange={v.setName}
          onKeyDown={v.commitOnEnter}
          placeholder="e.g. Bulgarian Split Squat"
          error={v.draftNameError || undefined}
        />
        <SetsFields
          sets={v.draftSets ?? ''}
          reps={v.draftReps ?? ''}
          weight={v.draftWeight ?? ''}
          rest={v.draftRest ?? ''}
          onSets={v.setSets}
          onReps={v.setReps}
          onWeight={v.setWeight}
          onRest={v.setRest}
        />
        <AreaChoice areas={v.draftAreas ?? []} />
        {v.draftEquipment ? (
          <EquipmentPicker
            id="new-exercise-equipment"
            open={v.draftEquipment.open}
            onToggle={v.draftEquipment.toggle}
            summary={v.draftEquipment.summary}
            groups={v.draftEquipment.groups}
          />
        ) : null}
        <Label style={{ margin: '16px 0 8px' }}>Icon</Label>
        <IconChoiceGroup label="Icon" columns={5} {...v.iconGrid} />
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
