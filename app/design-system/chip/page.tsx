'use client';

import { useState } from 'react';
import { Chip } from '@/components/ui/chip';
import { Calendar, Clock, Close, Repeat } from '@/components/ui/icons';
import { IconButton } from '@/components/ui/buttons';

const h2: React.CSSProperties = { fontSize: 'var(--text-2xl)', margin: '40px 0 4px' };
const note: React.CSSProperties = { margin: '0 0 16px', color: 'var(--color-muted)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)' };
const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, padding: '18px 20px', background: 'var(--color-canvas)', borderRadius: 18, boxShadow: 'inset 0 0 0 1px rgba(35,42,69,.07)' };

const zones = ['Recovery', 'Endurance', 'Tempo', 'Intervals'];
const areas = ['Core', 'Arms', 'Back', 'Legs'];

export default function ChipPage() {
  const [zone, setZone] = useState('Endurance');
  const [picked, setPicked] = useState<string[]>(['Core', 'Legs']);
  const toggle = (a: string) => setPicked((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]));

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '12px 0 80px' }}>
      <h1 style={{ margin: 0, fontSize: 'var(--text-5xl)' }}>Chip</h1>
      <p style={{ ...note, marginTop: 8 }}>
        A small pill for a fact, a tag or a choice. Import it from <code>@/components/ui/chip</code>. Give it an{' '}
        <code>onClick</code> (or use the choice tone) and it becomes a button; otherwise it is a plain label.
      </p>

      <h2 style={h2}>Info</h2>
      <p style={note}>
        White, for a fact about what is on screen: a date, a duration, a tag. With an <code>onClick</code> it lifts on
        hover.
      </p>
      <div style={row}>
        <Chip icon={<Clock color="var(--color-muted)" size={15} />}>~50 min</Chip>
        <Chip>Legs</Chip>
        <Chip icon={<Calendar color="var(--color-muted)" size={15} />} onClick={() => undefined}>
          Thu, Sep 17
        </Chip>
      </div>

      <h2 style={h2}>Accent</h2>
      <p style={note}>Solid pink, for something that is switched on. A trailing slot holds a small action.</p>
      <div style={row}>
        <Chip tone="accent" icon={<Repeat color="var(--color-white)" size={15} />}>
          Weekly
        </Chip>
        <Chip
          tone="accent"
          icon={<Repeat color="var(--color-white)" size={15} />}
          trailing={
            <IconButton label="End this series" size="xs" tone="inverse">
              <Close color="rgba(255,255,255,0.85)" strokeWidth={2.2} size={13} />
            </IconButton>
          }
        >
          Weekly series
        </Chip>
      </div>

      <h2 style={h2}>Choice</h2>
      <p style={note}>
        A selectable option, pink when <code>selected</code> and exposed with <code>aria-pressed</code>. Use it one
        at a time for a single choice, or several at once for a multi-select. Unselected choices are canvas-coloured,
        so place them on a white card.
      </p>
      <div style={{ ...row, flexDirection: 'column', alignItems: 'flex-start', background: 'var(--color-white)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {zones.map((z) => (
            <Chip key={z} tone="choice" size="md" selected={zone === z} onClick={() => setZone(z)}>
              {z}
            </Chip>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {areas.map((a) => (
            <Chip key={a} tone="choice" size="md" selected={picked.includes(a)} onClick={() => toggle(a)}>
              {a}
            </Chip>
          ))}
        </div>
      </div>

      <h2 style={h2}>Sizes</h2>
      <div style={row}>
        <Chip>sm</Chip>
        <Chip size="md">md</Chip>
      </div>
    </main>
  );
}
