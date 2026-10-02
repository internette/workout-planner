'use client';

import { useState } from 'react';
import { Badge } from '../../src/badge';
import { Button } from '../../src/buttons';
import { Card } from '../../src/card';
import { Chip } from '../../src/chip';
import { ACCENTS, type Accent } from '../../src/colors/themes';
import { ExerciseIcon, Repeat } from '../../src/icons';
import { IconTile } from '../../src/icon-tile';
import { ProgressBar } from '../../src/progress-bar';
import { Select } from '../../src/select';
import { StarRating } from '../../src/rating';
import { Text } from '../../src/typography';
import { DocPage, h2, note } from '../docs';

const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 };

// The same few components in one theme: the panel carries data-accent and data-theme, as <html> does in the app.
function Preview({ accent, dark }: { accent: string; dark: boolean }) {
  return (
    <div
      data-theme={dark ? 'dark' : 'light'}
      data-accent={accent === 'pink' ? undefined : accent}
      style={{
        padding: 16,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-canvas)',
        color: 'var(--color-ink)',
        boxShadow: 'inset 0 0 0 1px var(--color-line)',
      }}
    >
      <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--gradient-gem-tint)' }}>
        <Text variant="micro" as="div" tone="slateDeep">
          TODAY&apos;S QUEST
        </Text>
        <Text variant="subheading" as="div" tone="ink" style={{ marginTop: 3 }}>
          Break the illusion
        </Text>
      </div>
      <Card pad="sm" style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconTile size="sm">
            <ExerciseIcon name="h" color="var(--color-pink)" />
          </IconTile>
          <div style={{ minWidth: 0, flex: 1 }}>
            <Text variant="subheading" as="div" tone="ink">
              Upper Push
            </Text>
            <Text variant="body" as="div" tone="muted">
              4 exercises · ~50 min
            </Text>
          </div>
          <Badge tone="soft">Done</Badge>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
          <ProgressBar value={75} label="Exercises done" style={{ flex: 1 }} />
          <Text variant="figure" tone="slate">
            3 of 4
          </Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
          <StarRating readOnly value={4} />
          <Text variant="strong" weight="semibold" tone="accent">
            Hard
          </Text>
        </div>
      </Card>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        <Chip>Chest</Chip>
        <Chip tone="accent" icon={<Repeat size={13} />}>
          Weekly series
        </Chip>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginTop: 14 }}>
        <Button type="primary" size="sm">
          Finish workout
        </Button>
        <Button type="secondary" size="sm">
          Edit
        </Button>
        <Button type="neutral" link size="sm">
          Cancel
        </Button>
      </div>
    </div>
  );
}

const Dot = ({ color }: { color: string }) => (
  <span aria-hidden style={{ width: 18, height: 18, flex: 'none', borderRadius: 'var(--radius-full)', background: color }} />
);

export default function ThemesPage() {
  const [accent, setAccent] = useState<Accent>('pink');
  return (
    <DocPage title="Themes">
      <p style={{ ...note, marginTop: 8 }}>
        Five colors, each with a light and a dark theme, picked on Profile → Settings. Every theme uses the same
        variables, so a component written with them (<code>var(--color-pink)</code>, not a hex) follows whichever is
        set. The theme is set on <code>&lt;html&gt;</code> as <code>data-accent</code> (left out for pink) and{' '}
        <code>data-theme=&quot;dark&quot;</code>; the previews below set the same attributes on themselves. The rest of
        this site stays light pink.
      </p>

      <h2 id="light-and-dark" style={h2}>Light and dark</h2>
      <p style={note}>
        The color runs through everything written in pink: buttons, rings, the selected tab, soft fills, the gem
        gradient, and the Happy mood and first rank tiers. The page background leans toward it. In dark, each color has
        its own surfaces and text, tinted toward it (pink&apos;s is Plum dusk); the color is lighter, and text on it is
        the dark surface color.
      </p>
      <Select<Accent>
        label="Color"
        options={ACCENTS.map((a) => ({ value: a.name, label: a.label, icon: <Dot color={a.swatch} /> }))}
        value={accent}
        onChange={setAccent}
        style={{ maxWidth: 280, marginBottom: 16 }}
      />
      <div style={grid}>
        {[false, true].map((dark) => (
          <div key={String(dark)}>
            <Text variant="strong" weight="semibold" as="h3" tone="ink" style={{ margin: '0 0 8px' }}>
              {dark ? 'Dark' : 'Light'}
            </Text>
            <Preview accent={accent} dark={dark} />
          </div>
        ))}
      </div>
    </DocPage>
  );
}
