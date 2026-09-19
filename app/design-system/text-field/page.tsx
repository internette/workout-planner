'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label, TextArea, TextField } from '@/components/ui/text-field';
import { Search } from '@/components/ui/icons';

const h2: React.CSSProperties = { fontSize: 'var(--text-2xl)', margin: '40px 0 4px', scrollMarginTop: 16 };
const note: React.CSSProperties = { margin: '0 0 16px', color: 'var(--color-muted)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)' };
const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 12 };

export default function TextFieldPage() {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('Upper Body Push');
  const [query, setQuery] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '12px 0 80px' }}>
      <h1 style={{ margin: 0, fontSize: 'var(--text-5xl)' }}>Text field</h1>
      <p style={{ ...note, marginTop: 8 }}>
        <code>TextField</code>, <code>TextArea</code> and <code>Label</code> from{' '}
        <code>@/components/ui/text-field</code>. Pass any normal input props (<code>value</code>,{' '}
        <code>onChange</code>, <code>inputMode</code>, <code>placeholder</code>, and so on).
      </p>

      <h2 id="filled-with-a-label" style={h2}>Filled, with a label</h2>
      <p style={note}>
        The default. <code>label</code> wraps the field in a <code>&lt;label&gt;</code> and shows the caption above it;
        write it in normal case, it is uppercased for you. <code>labelNote</code> adds a quieter aside such as a unit.
      </p>
      <Card>
        <div style={row}>
          <TextField label="Sets × reps" placeholder="3 × 10" containerStyle={{ flex: '1 1 120px' }} />
          <TextField label="Weight" placeholder="45 lb" containerStyle={{ flex: '1 1 110px' }} />
          <TextField
            label="Distance"
            labelNote="(miles)"
            inputMode="decimal"
            placeholder="24.5"
            hint="Planned 30 mi"
            containerStyle={{ flex: '1 1 130px' }}
          />
        </div>
      </Card>

      <h2 id="suffix" style={h2}>Suffix</h2>
      <p style={note}>
        <code>suffix</code> puts a unit after the input inside the box. Use <code>Label</code> on its own as the heading
        for a group of fields.
      </p>
      <Card>
        <Label>Duration</Label>
        <div style={{ display: 'flex', gap: 8 }}>
          <TextField suffix="hr" inputMode="numeric" placeholder="1" containerStyle={{ flex: 1 }} />
          <TextField suffix="min" inputMode="numeric" placeholder="20" containerStyle={{ flex: 1 }} />
        </div>
      </Card>

      <h2 id="error-and-disabled" style={h2}>Error and disabled</h2>
      <Card>
        <div style={row}>
          <TextField
            label="Exercise name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={name.trim() ? undefined : 'Give the exercise a name.'}
            containerStyle={{ flex: '1 1 220px' }}
          />
          <TextField label="Locked" value="Read only" disabled onChange={() => undefined} containerStyle={{ flex: '1 1 220px' }} />
        </div>
      </Card>

      <h2 id="title" style={h2}>Title</h2>
      <p style={note}>
        <code>variant=&quot;title&quot;</code> is an editable heading with a dashed underline.
      </p>
      <TextField variant="title" aria-label="Workout name" value={title} onChange={(e) => setTitle(e.target.value)} />

      <h2 id="bare" style={h2}>Bare</h2>
      <p style={note}>
        <code>variant=&quot;bare&quot;</code> is just the input, for a container you style yourself, such as a search
        box. <code>size=&quot;sm&quot;</code> is the compact date-style text.
      </p>
      <Card pad="none" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 15 }}>
        <Search color="var(--color-subtle)" size={17} />
        <TextField variant="bare" aria-label="Search" placeholder="Search exercises" value={query} onChange={(e) => setQuery(e.target.value)} />
      </Card>

      <h2 id="text-area" style={h2}>Text area</h2>
      <p style={note}>A white raised surface for notes.</p>
      <TextArea rows={4} placeholder="Energy, soreness, what worked…" value={notes} onChange={(e) => setNotes(e.target.value)} />
    </main>
  );
}
