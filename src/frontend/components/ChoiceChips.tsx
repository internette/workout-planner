import { Chip } from '@moonshot/design-system/chip';
import { ChipRow } from './ChipRow';

/** One of a few options, as choice chips that wrap onto another line when there isn't room (a segmented control would
 * cut off the last): a workout's kind, or which kinds the Spellbook shows. Each says whether it's the one chosen. */
export function ChoiceChips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label}>
      <ChipRow>
        {options.map((o) => (
          <Chip key={o.value} tone="choice" size="md" selected={o.value === value} onClick={() => onChange(o.value)}>
            {o.label}
          </Chip>
        ))}
      </ChipRow>
    </div>
  );
}
