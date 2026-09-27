import type { ChangeEventHandler } from 'react';
import { TextField } from '@moonshot/design-system/text-field';

type OnChange = ChangeEventHandler<HTMLInputElement>;

export interface SetsFieldsProps {
  sets: string;
  reps: string;
  /** Pounds. Empty for bodyweight. */
  weight: string;
  /** Seconds. */
  rest: string;
  onSets: OnChange;
  onReps: OnChange;
  onWeight: OnChange;
  onRest: OnChange;
}

/** An exercise's sets, reps, weight and rest, as one row of fields that wraps on a narrow screen, with example values
 * in the empty ones. Used by both "New exercise" forms, the exercise editor and the exercises in the workout editor. */
export function SetsFields({ sets, reps, weight, rest, onSets, onReps, onWeight, onRest }: SetsFieldsProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
      <TextField
        label="Sets"
        containerStyle={{ flex: '1 1 90px', minWidth: '0' }}
        value={sets}
        onChange={onSets}
        placeholder="3"
        inputMode="numeric"
      />
      <TextField
        label="Reps"
        containerStyle={{ flex: '1 1 90px', minWidth: '0' }}
        value={reps}
        onChange={onReps}
        placeholder="10"
        inputMode="numeric"
      />
      <TextField
        label="Weight"
        suffix="lb"
        containerStyle={{ flex: '1 1 110px', minWidth: '0' }}
        value={weight}
        onChange={onWeight}
        placeholder="Optional"
        inputMode="decimal"
      />
      <TextField
        label="Rest"
        suffix="sec"
        containerStyle={{ flex: '1 1 110px', minWidth: '0' }}
        value={rest}
        onChange={onRest}
        placeholder="60"
        inputMode="numeric"
      />
    </div>
  );
}
