'use client';

import { useState } from 'react';
import { Select } from '../../src/select';
import { DocPage, h2, note } from '../docs';

const row: React.CSSProperties = { padding: '18px 20px', background: 'var(--color-canvas)', borderRadius: 'var(--radius-lg)', boxShadow: 'inset 0 0 0 1px var(--color-line)' };

const Dot = ({ color }: { color: string }) => (
  <span aria-hidden style={{ width: 18, height: 18, flex: 'none', borderRadius: 'var(--radius-full)', background: color }} />
);

type Mood = 'happy' | 'calm' | 'sad';

export default function SelectPage() {
  const [unit, setUnit] = useState<'lb' | 'kg'>('lb');
  const [mood, setMood] = useState<Mood>('calm');

  return (
    <DocPage title="Select">
      <p style={{ ...note, marginTop: 8 }}>
        A dropdown for picking one of a few options, from <code>@moonshot/design-system/select</code>. The field shows
        the choice; pressing it opens the options as a list in a <code>Popover</code>. For two to four short options that
        fit on one line, use a <code>SegmentedControl</code> instead, so every choice is in view.
      </p>

      <h2 id="plain" style={h2}>Plain</h2>
      <p style={note}>
        <code>label</code> is the caption above the field and names it for screen readers. The parent owns{' '}
        <code>value</code> and sets it in <code>onChange</code>.
      </p>
      <div style={row}>
        <Select<'lb' | 'kg'>
          label="Weight unit"
          options={[
            { value: 'lb', label: 'Pounds' },
            { value: 'kg', label: 'Kilograms' },
          ]}
          value={unit}
          onChange={setUnit}
          style={{ maxWidth: 280 }}
        />
      </div>

      <h2 id="with-icons" style={h2}>With icons</h2>
      <p style={note}>
        An option&apos;s <code>icon</code> shows before its label, in the field and in the list: a color dot, a mood face.
      </p>
      <div style={row}>
        <Select<Mood>
          label="Mood"
          options={[
            { value: 'happy', label: 'Happy', icon: <Dot color="var(--color-pink)" /> },
            { value: 'calm', label: 'Calm', icon: <Dot color="var(--color-teal)" /> },
            { value: 'sad', label: 'Sad', icon: <Dot color="var(--color-periwinkle)" /> },
          ]}
          value={mood}
          onChange={setMood}
          style={{ maxWidth: 280 }}
        />
      </div>

      <h2 id="behaviour" style={h2}>Behaviour</h2>
      <p style={note}>
        Opening the list moves focus to the chosen option. The arrow keys, Home and End move through the list, Enter or
        Space picks and closes it, and Escape or a press outside closes it without a change. Focus returns to the field.
        Down or Up on the closed field opens it.
      </p>
    </DocPage>
  );
}
