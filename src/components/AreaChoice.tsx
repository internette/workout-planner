import type { CSSProperties } from 'react';
import { Chip } from '@moonshot/design-system/chip';
import { Label } from '@moonshot/design-system/text-field';

export interface AreaChoiceProps {
  /** Every target area, with whether it's picked and how to change that. */
  areas: { name: string; on: boolean; toggle: () => void }[];
  /** Spacing around the "Target areas" label. */
  labelStyle?: CSSProperties;
}

/** Picking an exercise's target areas: the label, then one chip per area to turn on or off. */
export function AreaChoice({ areas, labelStyle = { margin: '16px 0 8px' } }: AreaChoiceProps) {
  return (
    <>
      <Label style={labelStyle}>Target areas</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {areas.map((a) => (
          <Chip key={a.name} tone="choice" size="md" selected={a.on} onClick={a.toggle}>
            {a.name}
          </Chip>
        ))}
      </div>
    </>
  );
}
