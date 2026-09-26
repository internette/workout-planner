import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/buttons';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { ACCENTS } from '@/components/ui/colors/themes';
import { ExerciseIcon, Repeat } from '@/components/ui/icons';
import { IconTile } from '@/components/ui/icon-tile';
import { ProgressBar } from '@/components/ui/progress-bar';
import { StarRating } from '@/components/ui/rating';
import { Text } from '@/components/ui/typography';
import { DocPage, h2, note } from '../docs';

export const metadata = { title: 'Themes — Design system' };

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
        <Text variant="itemTitle" as="div" tone="ink" style={{ marginTop: 3 }}>
          Break the illusion
        </Text>
      </div>
      <Card pad="sm" style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconTile size="sm">
            <ExerciseIcon name="h" color="var(--color-accent)" />
          </IconTile>
          <div style={{ minWidth: 0, flex: 1 }}>
            <Text variant="itemTitle" as="div" tone="ink">
              Upper Push
            </Text>
            <Text variant="caption" as="div" tone="muted">
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
          <Text variant="label" weight="semibold" tone="accent">
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

export default function ThemesPage() {
  return (
    <DocPage title="Themes">
      <p style={{ ...note, marginTop: 8 }}>
        Five colours, each with a light and a dark theme, picked on Profile → Settings. Every theme uses the same
        variables, so a component written with them (<code>var(--color-accent)</code>, not a hex) follows whichever is
        set. The theme is set on <code>&lt;html&gt;</code> as <code>data-accent</code> (left out for pink) and{' '}
        <code>data-theme=&quot;dark&quot;</code>; the panels below set the same attributes on themselves. The rest of
        this site stays light pink.
      </p>

      <h2 id="light" style={h2}>Light</h2>
      <p style={note}>
        The colour runs through the accent (buttons, rings, the selected tab), its tint (soft fills) and the page
        background. The gem gradient starts from it; in teal it runs to pink instead, so it doesn&apos;t start and end
        on the same colour.
      </p>
      <div style={grid}>
        {ACCENTS.map((a) => (
          <div key={a.name}>
            <Text variant="label" weight="semibold" as="h3" tone="ink" style={{ margin: '0 0 8px' }}>
              {a.label}
            </Text>
            <Preview accent={a.name} dark={false} />
          </div>
        ))}
      </div>

      <h2 id="dark" style={h2}>Dark</h2>
      <p style={note}>
        Pink&apos;s dark theme is Plum dusk; each other colour has its own dark surfaces and text, tinted toward it. The
        accent is lighter than in light, and text on it is the dark surface colour. Mood colours and the rank gems stay
        the same in every theme.
      </p>
      <div style={grid}>
        {ACCENTS.map((a) => (
          <div key={a.name}>
            <Text variant="label" weight="semibold" as="h3" tone="ink" style={{ margin: '0 0 8px' }}>
              {a.label}
            </Text>
            <Preview accent={a.name} dark />
          </div>
        ))}
      </div>
    </DocPage>
  );
}
