'use client';

import { useState } from 'react';
import { OptionCard, OptionGroup } from '@/components/ui/option-card';
import { DocPage, h2, note } from '../docs';

const panel: React.CSSProperties = { padding: 20, background: 'var(--color-white)', borderRadius: 18, boxShadow: '0 4px 14px rgba(35,42,69,.07)', maxWidth: 440 };

export default function OptionCardPage() {
  const [save, setSave] = useState('update');
  const [pace, setPace] = useState('steady');
  const [also, setAlso] = useState(true);

  return (
    <DocPage title="Option card">
      <p style={{ ...note, marginTop: 8 }}>
        A card for one answer to a question. Import <code>OptionCard</code> and <code>OptionGroup</code> from{' '}
        <code>@/components/ui/option-card</code>. Use it when a choice needs a sentence of explanation each, so the
        user can compare the outcomes before committing. For short labels, use a segmented control or chips instead.
      </p>

      <h2 id="single-choice" style={h2}>Single choice</h2>
      <p style={note}>
        Give every card in a group the same <code>name</code>, and wrap them in an <code>OptionGroup</code> with a{' '}
        <code>label</code> for screen readers. Each card has a <code>title</code> and a one-line{' '}
        <code>description</code> of what choosing it does. The parent owns <code>checked</code> and gets the card&apos;s{' '}
        <code>value</code> in <code>onChange</code>.
      </p>
      <div style={panel}>
        <OptionGroup label="How to save your changes">
          <OptionCard
            name="save"
            value="update"
            checked={save === 'update'}
            onChange={setSave}
            title="Update this workout"
            description="Upcoming sessions use your changes. Past sessions keep the old version."
          />
          <OptionCard
            name="save"
            value="new"
            checked={save === 'new'}
            onChange={setSave}
            title="Save as a new workout"
            description="“Upper Body Push” and its sessions stay as they are."
          />
        </OptionGroup>
      </div>

      <h2 id="states" style={h2}>States</h2>
      <p style={note}>
        Unselected cards sit on the canvas colour and darken on hover; the selected one is pink with a filled dot.
        Keyboard focus adds a ring. <code>disabled</code> dims a card and stops it being chosen.
      </p>
      <div style={panel}>
        <OptionGroup label="Pace">
          <OptionCard name="pace" value="easy" checked={pace === 'easy'} onChange={setPace} title="Easy" description="Recovery days between sessions." />
          <OptionCard name="pace" value="steady" checked={pace === 'steady'} onChange={setPace} title="Steady" description="A session every other day." />
          <OptionCard name="pace" value="hard" checked={pace === 'hard'} onChange={setPace} title="Hard" description="Back to back, no rest." disabled />
        </OptionGroup>
      </div>

      <h2 id="with-extra-controls" style={h2}>With extra controls</h2>
      <p style={note}>
        Controls that only make sense for one option go inside it as <code>children</code>. They show while the card
        is selected and hide otherwise, so they need no label saying which option they belong to.
      </p>
      <div style={panel}>
        <OptionGroup label="How to save your changes">
          <OptionCard
            name="save2"
            value="update"
            checked={save === 'update'}
            onChange={setSave}
            title="Update this workout"
            description="Past sessions keep the old version."
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={also} onChange={() => setAlso((a) => !a)} style={{ width: 18, height: 18, margin: 0, accentColor: 'var(--color-pink)' }} />
              Also update 2 upcoming sessions
            </label>
          </OptionCard>
          <OptionCard
            name="save2"
            value="new"
            checked={save === 'new'}
            onChange={setSave}
            title="Save as a new workout"
            description="The original and its sessions stay as they are."
          />
        </OptionGroup>
      </div>

      <h2 id="behaviour" style={h2}>Behaviour</h2>
      <ul style={{ ...note, paddingLeft: 20 }}>
        <li>
          Each card is a native radio button, so Tab lands on the group, the arrow keys move between cards and select
          them, and a press anywhere on a card selects it.
        </li>
        <li>Nothing is selected for you: pass <code>checked</code> for whichever option should start selected.</li>
      </ul>
    </DocPage>
  );
}
