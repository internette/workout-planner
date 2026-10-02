'use client';

import { useState } from 'react';
import { Button, type ButtonProps } from '../../src/buttons';
import { Select } from '../../src/select';

// Every type, with and without ghost, in the order they're listed in the dropdown.
const TYPES = [
  ['primary', { type: 'primary' }],
  ['primary ghost', { type: 'primary', ghost: true }],
  ['secondary', { type: 'secondary' }],
  ['secondary ghost', { type: 'secondary', ghost: true }],
  ['neutral', { type: 'neutral' }],
  ['neutral ghost', { type: 'neutral', ghost: true }],
  ['danger', { type: 'danger' }],
  ['danger ghost', { type: 'danger', ghost: true }],
  ['dashed', { type: 'dashed' }],
] as const;
type Name = (typeof TYPES)[number][0];

const sizes = ['xs', 'sm', 'md', 'lg'] as const;

/** The Types example: pick a type, and see it at every size. */
export function ButtonTypes({ rowStyle }: { rowStyle: React.CSSProperties }) {
  const [name, setName] = useState<Name>('primary');
  const props = TYPES.find(([n]) => n === name)![1] as Pick<ButtonProps, 'type' | 'ghost'>;
  return (
    <>
      <Select<Name>
        label="Type"
        options={TYPES.map(([n]) => ({ value: n, label: n }))}
        value={name}
        onChange={setName}
        style={{ maxWidth: 280, marginBottom: 12 }}
      />
      <div style={rowStyle}>
        {sizes.map((size) => (
          <Button key={size} size={size} {...props}>
            {size === 'xs' ? 'Back' : 'Save workout'}
          </Button>
        ))}
        <code style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
          {`type="${props.type}"${props.ghost ? ' ghost' : ''}`}
        </code>
      </div>
    </>
  );
}
