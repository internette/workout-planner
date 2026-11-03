import { Dumbbell, DumbbellUpright } from '../../src/icons';
import { Card } from '../../src/card';
import { WeekStrip } from '../../src/week-strip';
import { DocPage, h2, note } from '../docs';

export const metadata = { title: 'Week strip — Design system' };

const NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const plan: (string | null)[] = [null, 'h', null, 'v', null, 'h', null];
const icon = (name: string) => (name === 'v' ? <DumbbellUpright color="var(--color-pink)" size={16} /> : <Dumbbell color="var(--color-pink)" size={16} />);

export default function WeekStripPage() {
  const days = plan.map((p, i) => ({ letter: NAMES[i][0], label: NAMES[i] + ': ' + (p ? 'a workout' : 'rest'), icon: p ? icon(p) : undefined }));
  return (
    <DocPage title="Week strip">
      <p style={{ ...note, marginTop: 8 }}>
        A week at a glance: a tile per day, tinted with an icon on the days that have something on them. Import it from{' '}
        <code>@moonshot/design-system/week-strip</code> and give it seven <code>days</code>, each a <code>letter</code>, a{' '}
        <code>label</code> for screen readers and, on a day with something on it, an <code>icon</code>.
      </p>

      <h2 id="days" style={h2}>Days</h2>
      <p style={note}>
        A day with something on it is <code>--color-pink-tint</code> with its icon (the first, when there are several); a
        rest day is <code>--color-day-rest</code>, a faint tile that shows on a card and on the page. Seven tiles across at
        any width: each shrinks rather than wrapping. A program&apos;s page shows one per block.
      </p>
      <Card pad="md" style={{ maxWidth: 420 }}>
        <WeekStrip days={days} />
      </Card>

      <h2 id="flagged" style={h2}>Two on a day</h2>
      <p style={note}>
        A day can hold more than one icon: they sit side by side. <code>flag</code> rings a day in{' '}
        <code>--color-pink</code> to call it out, as the Start sheet does for a day two programs share. Say so in its{' '}
        <code>label</code> too (&ldquo;Tuesday: Lower Body Machines and Front Splits Workout&rdquo;), since the ring is only seen.
      </p>
      <Card pad="md" style={{ maxWidth: 420 }}>
        <WeekStrip
          days={days.map((d, i) =>
            i === 3 ? { ...d, label: NAMES[i] + ': two workouts', icon: <>{icon('v')}{icon('h')}</>, flag: true } : d,
          )}
        />
      </Card>

      <h2 id="accessibility" style={h2}>Accessibility</h2>
      <p style={note}>
        Each day is an image to a screen reader, read by its <code>label</code>: &ldquo;Monday: Band Upper Body&rdquo;,
        &ldquo;Tuesday: rest&rdquo;. The letters and icons are hidden from it. In forced colors each tile is outlined, and a ringed one gets a thicker outline in the highlight color.
      </p>
    </DocPage>
  );
}
