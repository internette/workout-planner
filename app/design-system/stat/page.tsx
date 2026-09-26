import { Card } from '@/components/ui/card';
import { Stat } from '@/components/ui/stat';
import { DocPage, h2, note } from '../docs';

export const metadata = { title: 'Stat — Design system' };

const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: 26 };
const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 };
const caption: React.CSSProperties = { fontSize: 'var(--text-sm)', color: 'var(--color-muted)', margin: '0 0 12px' };

export default function StatPage() {
  return (
    <DocPage title="Stat">
      <p style={{ ...note, marginTop: 8 }}>
        A labelled figure: a small capitals label with the value under it. Import it from{' '}
        <code>@/components/ui/stat</code>. It takes a <code>label</code> and a <code>value</code>, and optionally a{' '}
        <code>unit</code> after the value and a <code>note</code> under it.
      </p>

      <h2 id="sizes" style={h2}>Sizes</h2>
      <p style={note}>
        The size sets the value&apos;s text style. <code>sm</code> (itemTitle) for a row of several, like a ride plan;{' '}
        <code>md</code> (cardTitle, the default) inside a card, like a ride&apos;s stats or a mood; <code>lg</code>{' '}
        (subheading) for an exercise&apos;s numbers; <code>xl</code> (heading) for a page&apos;s headline figures.
      </p>
      <Card>
        <p style={caption}>sm</p>
        <div style={row}>
          <Stat size="sm" label="DISTANCE" value="14 mi" />
          <Stat size="sm" label="DURATION" value="1 h" />
          <Stat size="sm" label="ELEVATION" value="600 ft" />
          <Stat size="sm" label="TARGET EFFORT" value="Endurance" />
        </div>
        <p style={{ ...caption, marginTop: 24 }}>md</p>
        <div style={row}>
          <Stat label="DISTANCE" value="12.5 mi" />
          <Stat label="MOOD" value="Happy" />
        </div>
        <p style={{ ...caption, marginTop: 24 }}>lg</p>
        <div style={row}>
          <Stat size="lg" label="SETS × REPS" value="4 × 8" />
          <Stat size="lg" label="WEIGHT" value="95 lb" />
          <Stat size="lg" label="REST" value="90 sec" />
        </div>
      </Card>

      <h2 id="units-and-notes" style={h2}>Units and notes</h2>
      <p style={note}>
        A <code>unit</code> sits after the value on its baseline, smaller and muted. Pass one to every stat in a row,
        even an empty one, so they line up. A <code>note</code> goes under the value: what it&apos;s out of, or over
        what time. Profile&apos;s figures use both, at <code>xl</code>, one to a card with{' '}
        <code>labelTone=&quot;muted&quot;</code>.
      </p>
      <div style={grid}>
        <Card pad="sm">
          <Stat size="xl" labelTone="muted" label="SESSIONS DONE" value="18" unit="of 24" note="This year" />
        </Card>
        <Card pad="sm">
          <Stat size="xl" labelTone="muted" label="CURRENT STREAK" value="3" unit="days" note="Training days" />
        </Card>
        <Card pad="sm">
          <Stat label="DISTANCE" value="12.5 mi" note="of 14 mi planned" />
        </Card>
      </div>
    </DocPage>
  );
}
