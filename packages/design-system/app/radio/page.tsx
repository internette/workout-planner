'use client';

import { useState } from 'react';
import { RadioGroup } from '../../src/radio';
import { DocPage, h2, note } from '../docs';

const panel: React.CSSProperties = { padding: 20, background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 14px var(--color-line)', maxWidth: 440 };

export default function RadioPage() {
  const [leave, setLeave] = useState<'ask' | 'run' | 'pause'>('ask');
  const [units, setUnits] = useState<'lb' | 'kg'>('lb');

  return (
    <DocPage title="Radio group">
      <p style={{ ...note, marginTop: 8 }}>
        One choice from a short list, stacked: a round button and a label on each line, drawn like a checkbox. Import{' '}
        <code>RadioGroup</code> from <code>@moonshot/design-system/radio</code>. Use it in settings and forms where the
        options are a few words each. When each option needs a sentence to compare, use option cards; for two or three
        words side by side, a segmented control.
      </p>

      <h2 id="radio-group" style={h2}>Radio group</h2>
      <p style={note}>
        Give it a <code>label</code>, shown above the options and read out as the group&apos;s name, and its{' '}
        <code>options</code>, each a <code>value</code> and a <code>label</code>. The parent owns <code>value</code> and
        gets the picked one in <code>onChange</code>.
      </p>
      <div style={panel}>
        <RadioGroup<'ask' | 'run' | 'pause'>
          label="When you leave a workout"
          value={leave}
          onChange={setLeave}
          options={[
            { value: 'ask', label: 'Ask me each time' },
            { value: 'run', label: 'Keep the timer running' },
            { value: 'pause', label: 'Pause the timer' },
          ]}
        />
      </div>

      <h2 id="with-descriptions" style={h2}>With descriptions</h2>
      <p style={note}>
        An option can have a <code>description</code>, under its label and lined up with it. It&apos;s read out with
        the option but isn&apos;t part of what you press.
      </p>
      <div style={panel}>
        <RadioGroup<'lb' | 'kg'>
          label="Weights in"
          value={units}
          onChange={setUnits}
          options={[
            { value: 'lb', label: 'Pounds', description: 'As the built-in exercises are written.' },
            { value: 'kg', label: 'Kilograms' },
          ]}
        />
      </div>

      <h2 id="behaviour" style={h2}>Behaviour</h2>
      <ul style={{ ...note, paddingLeft: 20 }}>
        <li>
          Each option is a native radio button, so Tab lands on the group, the arrow keys move the choice, and a press
          anywhere on the line picks it. Every line is at least 44px tall to tap.
        </li>
        <li><code>disabled</code> dims the whole group and stops it changing.</li>
      </ul>
    </DocPage>
  );
}
