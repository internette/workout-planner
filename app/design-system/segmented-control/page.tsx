'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { DocPage, h2, note } from '../docs';

const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 18, padding: '18px 20px', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)' };

const views = [
  { value: 'Day', label: 'Day' },
  { value: 'Week', label: 'Week' },
  { value: 'Month', label: 'Month' },
];
const caption: React.CSSProperties = { fontSize: 'var(--text-sm)', color: 'var(--color-muted)' };
const kinds = [
  { value: 'all', label: 'All' },
  { value: 'main', label: 'Main workouts' },
  { value: 'warmups', label: 'Warm-ups' },
];
const scopes = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: '30 days' },
  { value: 'range', label: 'Range' },
];

export default function SegmentedControlPage() {
  const [view, setView] = useState('Day');
  const [scope, setScope] = useState('all');
  const [compactScope, setCompactScope] = useState('all');
  const [kind, setKind] = useState('all');
  const [narrow, setNarrow] = useState('Day');
  const [mode, setMode] = useState('lib');

  return (
    <DocPage title="Segmented control">
      <p style={{ ...note, marginTop: 8 }}>
        A row of mutually exclusive options in one tray. Import it from{' '}
        <code>@/components/ui/segmented-control</code>. The arrow keys, Home and End move the selection.
      </p>

      <h2 id="brand-medium" style={h2}>Brand, medium</h2>
      <p style={note}>
        The default, for switching a whole view. <code>semantics=&quot;tabs&quot;</code> exposes it as tabs; use{' '}
        <code>equalWidth</code> to give every option the same width.
      </p>
      <div style={row}>
        <SegmentedControl label="Calendar view" semantics="tabs" equalWidth options={views} value={view} onChange={setView} />
        <SegmentedControl label="Calendar view, sized to labels" semantics="tabs" options={views} value={view} onChange={setView} />
      </div>

      <h2 id="brand-small" style={h2}>Brand, small</h2>
      <p style={note}>
        <code>size=&quot;sm&quot;</code> for filters. Add <code>wrap</code> to let the options flow onto a second line.
      </p>
      <div style={row}>
        <SegmentedControl label="Show entries from" size="sm" wrap options={scopes} value={scope} onChange={setScope} />
      </div>

      <h2 id="compact" style={h2}>Compact</h2>
      <p style={note}>
        <code>compact</code> trims each option&apos;s side padding to 10px (from 16px small, 20px medium), so more options
        fit on a line on a phone. The height and the 44px tap area stay the same. The
        Chronicle&apos;s date filter uses it with <code>size=&quot;sm&quot;</code> and <code>wrap</code>, and the
        Spellbook&apos;s workout filter with <code>size=&quot;sm&quot;</code>.
      </p>
      <div style={{ ...row, flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
        <span style={caption}>Default</span>
        <SegmentedControl label="Show entries from, default" size="sm" wrap options={scopes} value={scope} onChange={setScope} />
        <span style={{ ...caption, marginTop: 10 }}>compact</span>
        <SegmentedControl label="Show entries from, compact" size="sm" compact wrap options={scopes} value={compactScope} onChange={setCompactScope} />
        <span style={{ ...caption, marginTop: 10 }}>compact, as the Spellbook&apos;s workout filter</span>
        <SegmentedControl label="Show" size="sm" compact options={kinds} value={kind} onChange={setKind} />
      </div>

      <h2 id="quiet" style={h2}>Quiet</h2>
      <p style={note}>
        <code>tone=&quot;quiet&quot;</code> is a canvas tray with a white selection, for placing inside a card.
      </p>
      <Card pad="md">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
          <strong style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)' }}>Add exercise</strong>
          <SegmentedControl
            label="Add exercise from"
            size="sm"
            tone="quiet"
            options={[
              { value: 'lib', label: 'From Spellbook' },
              { value: 'new', label: 'Create new' },
            ]}
            value={mode}
            onChange={setMode}
            style={{ marginLeft: 'auto' }}
          />
        </div>
      </Card>

      <h2 id="full-width" style={h2}>Full width</h2>
      <p style={note}>
        <code>fullWidth</code> stretches the tray to its container, as on a narrow screen.
      </p>
      <SegmentedControl label="Calendar view, full width" semantics="tabs" equalWidth fullWidth options={views} value={narrow} onChange={setNarrow} />
    </DocPage>
  );
}
