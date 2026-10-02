'use client';

import { useState } from 'react';
import { Button } from '../../src/buttons';
import { Select } from '../../src/select';

// Each type, and whether it has a ghost version (dashed is already unfilled).
const TYPES = [
  ['primary', true],
  ['secondary', true],
  ['neutral', true],
  ['danger', true],
  ['dashed', false],
] as const;
type Type = (typeof TYPES)[number][0];

const sizes = ['xs', 'sm', 'md', 'lg'] as const;
const label: React.CSSProperties = { width: 130, fontSize: 'var(--text-sm)', color: 'var(--color-muted)' };

/** The Types example: pick a type, and see it, and its ghost version, at every size. */
export function ButtonTypes({ rowStyle }: { rowStyle: React.CSSProperties }) {
  const [type, setType] = useState<Type>('primary');
  const hasGhost = TYPES.find(([t]) => t === type)![1];
  const versions = hasGhost ? [false, true] : [false];
  return (
    <>
      <Select<Type>
        label="Type"
        options={TYPES.map(([t]) => ({ value: t, label: t }))}
        value={type}
        onChange={setType}
        style={{ maxWidth: 280, marginBottom: 12 }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {versions.map((ghost) => (
          <div key={String(ghost)} style={rowStyle}>
            <code style={label}>{ghost ? `${type} ghost` : type}</code>
            {sizes.map((size) => (
              <Button key={size} size={size} type={type} ghost={ghost}>
                {size === 'xs' ? 'Back' : 'Save workout'}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
