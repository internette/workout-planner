import { Chip, ChipGroup } from '@moonshot/design-system/chip';
import { Label } from '@moonshot/design-system/text-field';

export interface AreaChoiceProps {
  /** Every target area, with whether it's picked and how to change that. */
  areas: { name: string; on: boolean; toggle: () => void }[];
}

/** Picking an exercise's target areas: the label, then one chip per area to turn on or off. */
export function AreaChoice({ areas }: AreaChoiceProps) {
  return (
    <>
      <Label style={{ margin: 'var(--space-4) 0 var(--space-2)' }}>Target areas</Label>
      <ChipGroup>
        {areas.map((a) => (
          <Chip key={a.name} tone="choice" size="md" selected={a.on} onClick={a.toggle}>
            {a.name}
          </Chip>
        ))}
      </ChipGroup>
    </>
  );
}
