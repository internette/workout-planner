import type { ChangeEventHandler, CSSProperties } from 'react';
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
  /** Example values in the empty fields ("3", "10", "Optional", "60"). On by default. */
  placeholders?: boolean;
  style?: CSSProperties;
}

/** An exercise's sets, reps, weight and rest, as one row of fields that wraps on a narrow screen. Used by both
 * "New exercise" forms, the exercise editor and the exercises in the workout editor. */
export function SetsFields({ sets, reps, weight, rest, onSets, onReps, onWeight, onRest, placeholders = true, style }: SetsFieldsProps) {
  const hint = (text: string) => (placeholders ? text : undefined);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '14px', ...style }}>
      <TextField
        label="Sets"
        containerStyle={{ flex: '1 1 90px', minWidth: '0' }}
        value={sets}
        onChange={onSets}
        placeholder={hint('3')}
        inputMode="numeric"
      />
      <TextField
        label="Reps"
        containerStyle={{ flex: '1 1 90px', minWidth: '0' }}
        value={reps}
        onChange={onReps}
        placeholder={hint('10')}
        inputMode="numeric"
      />
      <TextField
        label="Weight"
        suffix="lb"
        containerStyle={{ flex: '1 1 110px', minWidth: '0' }}
        value={weight}
        onChange={onWeight}
        placeholder={hint('Optional')}
        inputMode="decimal"
      />
      <TextField
        label="Rest"
        suffix="sec"
        containerStyle={{ flex: '1 1 110px', minWidth: '0' }}
        value={rest}
        onChange={onRest}
        placeholder={hint('60')}
        inputMode="numeric"
      />
    </div>
  );
}
