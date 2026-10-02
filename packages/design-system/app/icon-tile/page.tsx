import { Card } from '../../src/card';
import { ExerciseIcon, Bike } from '../../src/icons';
import { IconTile, IconTileButton } from '../../src/icon-tile';
import { Text } from '../../src/typography';
import { DocPage, h2, note } from '../docs';

export const metadata = { title: 'Icon tile — Design system' };

const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 14 };

export default function IconTilePage() {
  return (
    <DocPage title="Icon tile">
      <p style={{ ...note, marginTop: 8 }}>
        A workout&apos;s or exercise&apos;s icon on a pale pink tile, with a white rim and a soft pink glow. Import it
        from <code>@moonshot/design-system/icon-tile</code> and put the icon inside, drawn at about 19–22px.
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

      <h2 id="flat" style={h2}>Flat, in a list</h2>
      <p style={note}>
        <code>variant=&quot;flat&quot;</code> drops the rim and glow, for the start of a row in a list, where a stack
        of raised tiles would be busy. <code>xs</code> (34px) is the list size. <code>compact</code> shrinks a tile to
        34px on the narrowest phones, to leave its title more room.
      </p>
      <Card>
        <div style={row}>
          <IconTile as="span" size="xs" variant="flat">
            <ExerciseIcon name="h" size={19} color="var(--color-pink)" />
          </IconTile>
          <IconTile as="span" size="sm" variant="flat">
            <Bike size={20} color="var(--color-pink)" />
          </IconTile>
          <Text variant="caption" tone="muted">
            xs and sm, flat
          </Text>
        </div>
      </Card>

      <h2 id="as-a-button" style={h2}>As a button</h2>
      <p style={note}>
        <code>IconTileButton</code> is the same tile as a button, for choosing the icon: in the workout editor it
        opens the icon picker, for the workout (md) and for each exercise (sm). It needs an <code>aria-label</code>{' '}
        that says what it chooses, since it only shows the icon. Its tap area is 44px at any size.
      </p>
      <Card>
        <div style={row}>
          <IconTileButton aria-label="Choose workout icon">
            <ExerciseIcon name="d" size={22} color="var(--color-pink)" />
          </IconTileButton>
          <IconTileButton size="sm" aria-label="Choose icon for Bench Press">
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
