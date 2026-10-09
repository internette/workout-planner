import type { ChangeEventHandler } from 'react';
import { Chip, ChipGroup } from '@moonshot/design-system/chip';
import { Label, TextField } from '@moonshot/design-system/text-field';
import { Text } from '@moonshot/design-system/typography';
import { BAND_LEVELS, type BandLevel } from '@/frontend/shared/bands';

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
  /** For an exercise done with a resistance band: its level, in place of a weight in pounds. Picking the chosen level
   * again clears it. */
  band?: { level: BandLevel | null; onLevel: (level: BandLevel | null) => void } | null;
  /** Whether it takes a weight in pounds: not for bodyweight (no equipment) or a band on its own. Defaults to true. */
  weighted?: boolean;
}

/** An exercise's sets, reps, weight and rest, as one row of fields that wraps on a narrow screen, with example values
 * in the empty ones. Used by both "New exercise" forms, the exercise editor and the exercises in the workout editor. */
export function SetsFields({ sets, reps, weight, rest, onSets, onReps, onWeight, onRest, band, weighted = true }: SetsFieldsProps) {
  return (
    <>
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
      {!weighted ? null : (
        <TextField
          label="Weight"
          suffix="lb"
          containerStyle={{ flex: '1 1 110px', minWidth: '0' }}
          value={weight}
          onChange={onWeight}
          placeholder="Optional"
          inputMode="decimal"
        />
      )}
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
    {band ? (
      <>
        <Label style={{ margin: 'var(--space-4) 0 var(--space-2)' }}>Band</Label>
        <ChipGroup label="Band">
          {BAND_LEVELS.map((l) => (
            <Chip key={l} tone="choice" size="md" selected={band.level === l} onClick={() => band.onLevel(band.level === l ? null : l)}>
              {l}
            </Chip>
          ))}
        </ChipGroup>
      </>
    ) : null}
    {!weighted && !band ? (
      <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-2) 0 0' }}>
        Bodyweight, so there’s no weight to set.
      </Text>
    ) : null}
    </>
  );
}
