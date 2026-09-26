import { Card } from '@/components/ui/card';
import { ExerciseIcon, Bike } from '@/components/ui/icons';
import { IconTile, IconTileButton } from '@/components/ui/icon-tile';
import { Text } from '@/components/ui/typography';
import { DocPage, h2, note } from '../docs';

export const metadata = { title: 'Icon tile — Design system' };

const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 14 };

export default function IconTilePage() {
  return (
    <DocPage title="Icon tile">
      <p style={{ ...note, marginTop: 8 }}>
        A workout&apos;s or exercise&apos;s icon on a pale pink tile, with a white rim and a soft pink glow. Import it
        from <code>@/components/ui/icon-tile</code> and put the icon inside, drawn at about 19–22px.
      </p>

      <h2 id="sizes" style={h2}>Sizes</h2>
      <p style={note}>
        <code>size=&quot;md&quot;</code> (46px, the default) beside a page&apos;s title: a session, a saved workout, an
        exercise. <code>size=&quot;sm&quot;</code> (40px) beside a row&apos;s or card&apos;s title: a day&apos;s
        workouts, a workout&apos;s exercises. It&apos;s a div; <code>as=&quot;span&quot;</code> inside inline content.
      </p>
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={row}>
            <IconTile>
              <ExerciseIcon name="h" size={22} color="var(--color-pink)" />
            </IconTile>
            <div>
              <Text variant="eyebrow" as="div" tone="slate">
                FRI, SEP 25
              </Text>
              <Text variant="title" as="div" tone="ink" style={{ marginTop: 3 }}>
                Upper Push
              </Text>
            </div>
          </div>
          <div style={row}>
            <IconTile size="sm">
              <Bike size={20} color="var(--color-pink)" />
            </IconTile>
            <div>
              <Text variant="heading" as="div" tone="ink">
                Evening Ride
              </Text>
              <Text variant="caption" as="div" tone="muted">
                14 mi · 1 h
              </Text>
            </div>
          </div>
        </div>
      </Card>

      <h2 id="as-a-button" style={h2}>As a button</h2>
      <p style={note}>
        <code>IconTileButton</code> is the same tile as a button, for choosing the icon: in the workout editor it
        opens the icon picker, for the workout (md) and for each exercise (sm). It needs an <code>aria-label</code>{' '}
        that says what it chooses, since it only shows the icon. Add the <code>hit</code> class at sm for a 44px tap
        area.
      </p>
      <Card>
        <div style={row}>
          <IconTileButton aria-label="Choose workout icon">
            <ExerciseIcon name="d" size={22} color="var(--color-pink)" />
          </IconTileButton>
          <IconTileButton size="sm" className="hit" aria-label="Choose icon for Bench Press">
            <ExerciseIcon name="h" size={19} color="var(--color-pink)" />
          </IconTileButton>
          <Text variant="caption" tone="muted">
            Buttons open a picker in the app; here they do nothing.
          </Text>
        </div>
      </Card>
    </DocPage>
  );
}
