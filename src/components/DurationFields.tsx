import type { ChangeEventHandler, FocusEventHandler } from 'react';
import { TextField } from '@moonshot/design-system/text-field';

export interface DurationFieldsProps {
  hours: string;
  minutes: string;
  onHours: ChangeEventHandler<HTMLInputElement>;
  onMinutes: ChangeEventHandler<HTMLInputElement>;
  /** e.g. rolling 90 minutes over into 1 hr 30. */
  onMinutesBlur?: FocusEventHandler<HTMLInputElement>;
  /** Names the fields for screen readers, e.g. "Duration" gives "Duration, hours". */
  name?: string;
  /** What the empty fields suggest, e.g. ["1", "20"]. */
  placeholders?: [string, string];
}

/** A length of time as two fields side by side, hours and minutes. Put a "Duration" label above it. */
export function DurationFields({ hours, minutes, onHours, onMinutes, onMinutesBlur, name = 'Duration', placeholders = ['0', '0'] }: DurationFieldsProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <TextField
        suffix="hr"
        containerStyle={{ flex: '1', minWidth: '0' }}
        aria-label={name + ', hours'}
        value={hours}
        onChange={onHours}
        inputMode="numeric"
        placeholder={placeholders[0]}
      />
      <TextField
        suffix="min"
        containerStyle={{ flex: '1', minWidth: '0' }}
        aria-label={name + ', minutes'}
        value={minutes}
        onChange={onMinutes}
        onBlur={onMinutesBlur}
        inputMode="numeric"
        placeholder={placeholders[1]}
      />
    </div>
  );
}
