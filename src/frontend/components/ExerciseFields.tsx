import type { ChangeEventHandler, KeyboardEventHandler } from 'react';
import { IconChoiceGroup, type IconChoiceOption } from '@moonshot/design-system/icon-choice-group';
import { Label, TextField } from '@moonshot/design-system/text-field';
import { AreaChoice, type AreaChoiceProps } from './AreaChoice';
import { EquipmentPicker, type EquipmentPickerProps } from './EquipmentPicker';
import { SetsFields, type SetsFieldsProps } from './SetsFields';

export interface ExerciseFieldsProps extends SetsFieldsProps {
  name: string;
  onName: ChangeEventHandler<HTMLInputElement>;
  /** Why the name can't be used, e.g. it's taken. */
  nameError?: string;
  /** e.g. Enter to add it. */
  onNameKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  areas: AreaChoiceProps['areas'];
  /** The equipment picker, where equipment is known (left out until the migration adds it). */
  equipment?: EquipmentPickerProps | null;
  icon: { value: string; onChange: (value: string) => void; options: IconChoiceOption<string>[] };
}

/** An exercise's fields, in one order everywhere: name, sets and reps, target areas, equipment, icon. The Spellbook's
 * "New exercise", the exercise editor and "Create new" in the workout editor all use it; each adds its own buttons. */
export function ExerciseFields({ name, onName, nameError, onNameKeyDown, areas, equipment, icon, ...sets }: ExerciseFieldsProps) {
  return (
    <>
      <TextField
        label="Exercise name"
        value={name}
        onChange={onName}
        onKeyDown={onNameKeyDown}
        placeholder="e.g. Bulgarian Split Squat"
        error={nameError || undefined}
      />
      <SetsFields {...sets} />
      <AreaChoice areas={areas} />
      {equipment ? <EquipmentPicker {...equipment} /> : null}
      <Label style={{ margin: 'var(--space-4) 0 var(--space-2)' }}>Icon</Label>
      <IconChoiceGroup label="Icon" columns={4} {...icon} />
    </>
  );
}
