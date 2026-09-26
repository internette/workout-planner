'use client';

import { useState } from 'react';
import { Chip } from '@/components/ui/chip';
import { Popover } from '@/components/ui/popover';
import { Text } from '@/components/ui/typography';
import { Calendar } from '@/components/ui/icons';
import { DocPage, h2, note } from '../docs';

const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 24, padding: '18px 20px', background: 'var(--color-canvas)', borderRadius: 'var(--radius-lg)', boxShadow: 'inset 0 0 0 1px var(--color-line)' };

const Panel = ({ children }: { children: string }) => (
  <Text variant="body" tone="ink" as="div">
    {children}
  </Text>
);

export default function PopoverPage() {
  const [start, setStart] = useState(false);
  const [center, setCenter] = useState(false);
  const [padded, setPadded] = useState(false);

  return (
    <DocPage title="Popover">
      <p style={{ ...note, marginTop: 8 }}>
        A small floating card anchored under a trigger, built on the native <code>popover</code> attribute. Import it
        from <code>@/components/ui/popover</code>. Put the trigger inside it as <code>children</code>, and the panel as{' '}
        <code>content</code>. The parent owns <code>open</code>, so the trigger toggles it, and <code>onClose</code> is
        called when the browser dismisses the panel.
      </p>

      <h2 id="anchored" style={h2}>Anchored</h2>
      <p style={note}>
        <code>width</code> and <code>top</code> (the gap under the trigger area) are required. By default the
        panel&apos;s left edge lines up with the trigger&apos;s.
      </p>
      <div style={row}>
        <Popover open={start} onClose={() => setStart(false)} width={240} top={44} content={<Panel>Aligned to the start.</Panel>}>
          <Chip icon={<Calendar color="var(--color-muted)" size={15} />} onClick={() => setStart((o) => !o)}>
            Thu, Sep 17
          </Chip>
        </Popover>
      </div>

      <h2 id="centered" style={h2}>Centred</h2>
      <p style={note}>
        <code>align=&quot;center&quot;</code> centres the panel under a wider trigger, like the month picker.
      </p>
      <div style={{ ...row, justifyContent: 'center' }}>
        <Popover open={center} onClose={() => setCenter(false)} width={260} top={44} align="center" content={<Panel>Centred under the trigger.</Panel>}>
          <Chip size="md" onClick={() => setCenter((o) => !o)}>
            September ▾
          </Chip>
        </Popover>
      </div>

      <h2 id="padding" style={h2}>Padding</h2>
      <p style={note}>
        <code>pad</code> is one of the Card steps: xs (14px, the default), sm or md.
      </p>
      <div style={row}>
        <Popover open={padded} onClose={() => setPadded(false)} width={260} top={44} pad="md" content={<Panel>Roomier, for text.</Panel>}>
          <Chip onClick={() => setPadded((o) => !o)}>pad=&quot;md&quot;</Chip>
        </Popover>
      </div>

      <h2 id="behaviour" style={h2}>Behaviour</h2>
      <ul style={{ ...note, paddingLeft: 20 }}>
        <li>
          The panel is shown in the browser&apos;s top layer, so no parent&apos;s <code>overflow</code> or{' '}
          <code>z-index</code> can clip or hide it. It is placed against the window, follows its trigger when the page
          scrolls, and stays inside the window edges.
        </li>
        <li>
          Escape and a press outside dismiss it, and only one popover is open at a time. <code>onClose</code> is called
          for each, and it is up to the parent to set <code>open</code> to false.
        </li>
        <li>
          A press on the trigger while it is open closes it and nothing more, so the trigger can toggle it without
          the panel bouncing back open.
        </li>
        <li>
          Use <code>as=&quot;span&quot;</code> for the wrapper inside inline content, and <code>style</code> to lay
          out what the wrapper contains.
        </li>
        <li>Needs the Popover API: Chrome 114, Safari 17 or Firefox 125 and later.</li>
      </ul>
    </DocPage>
  );
}
