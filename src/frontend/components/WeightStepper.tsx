import { IconButton } from '@moonshot/design-system/buttons';
import { Minus, Plus } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';

export interface WeightStep {
  /** Pounds a tap changes it by: 5, or 10 for a machine or cable. */
  step: number;
  less: () => void;
  more: () => void;
  /** Whose weight, for screen readers: "Bench Press". */
  name: string;
}

/** − a step, then + a step: the buttons either side of a weight in Edit. */
export function StepButton({ dir, s, size = 'md' }: { dir: 1 | -1; s: WeightStep; size?: 'md' | 'lg' }) {
  const more = dir === 1;
  return (
    <IconButton
      circle
      size={size}
      label={(more ? s.step + ' lb more on ' : s.step + ' lb less on ') + s.name}
      onClick={more ? s.more : s.less}
      style={{ background: more ? 'var(--color-pink)' : 'var(--color-pink-tint)' }}
    >
      {more ? <Plus color="var(--color-surface)" size={16} strokeWidth={2.4} /> : <Minus color="var(--color-pink-deep)" size={16} strokeWidth={2.4} />}
    </IconButton>
  );
}

/** A closed exercise's weight in Edit, with − and + beside it, so it can go up without opening the exercise. */
export function WeightStepper({ weight, s }: { weight: string; s: WeightStep }) {
  return (
    <span
      role="group"
      aria-label={s.name + ' weight'}
      style={{ display: 'inline-flex', alignItems: 'center', flex: 'none', background: 'var(--color-canvas)', borderRadius: 'var(--radius-full)', padding: '2px' }}
    >
      <StepButton dir={-1} s={s} />
      {/* Read out as it changes, so a screen reader hears the new weight after each tap. */}
      <Text variant="body" weight="semibold" aria-live="polite" style={{ minWidth: '56px', textAlign: 'center', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
        {weight} lb
      </Text>
      <StepButton dir={1} s={s} />
    </span>
  );
}
