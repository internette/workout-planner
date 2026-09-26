import Link from 'next/link';
import { Button } from '@/components/ui/buttons';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Text } from '@/components/ui/typography';
import { DocPage, h2, note } from '../docs';

export const metadata = { title: 'Card — Design system' };

const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 };
const title: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--text-xl)' };
const body: React.CSSProperties = { margin: '6px 0 0', fontSize: 'var(--text-md)', color: 'var(--color-muted)', lineHeight: 'var(--leading-snug)' };
const row: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  width: '100%',
  minHeight: 60,
  padding: '12px 18px',
  border: 'none',
  background: 'none',
  fontFamily: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
};
// Rows as the Chronicle's "Which session are you writing about?" picker lists them.
const listGroups = [
  {
    label: 'THIS WEEK',
    rows: [
      { day: ['FRI', '25'], name: 'Upper Push', meta: '~50 min', status: 'In progress' },
      { day: ['TUE', '22'], name: 'Leg Day', meta: '~45 min', status: 'Partly done' },
    ],
  },
  { label: 'EARLIER', rows: [{ day: ['FRI', '11'], name: 'Evening Ride', meta: '14 mi · 1 h', status: 'Done' }] },
];

export default function CardPage() {
  return (
    <DocPage title="Card">
      <p style={{ ...note, marginTop: 8 }}>
        A white surface that sits above the page. Import it from <code>@/components/ui/card</code>. It takes layout
        props (<code>style</code>, <code>role</code>, <code>onClick</code>, and so on) like a normal element.
      </p>

      <h2 id="padding" style={h2}>Padding</h2>
      <p style={note}>
        <code>pad</code>: none, xs (16px), sm (20px), md (24px, the default) and lg (28px). Use none when the
        content brings its own padding, as a list&apos;s rows do.
      </p>
      <div style={grid}>
        {(['xs', 'sm', 'md', 'lg'] as const).map((pad) => (
          <Card key={pad} pad={pad}>
            <div style={title}>pad=&quot;{pad}&quot;</div>
            <p style={body}>Every session, one step closer.</p>
          </Card>
        ))}
      </div>

      <h2 id="elevation" style={h2}>Elevation</h2>
      <p style={note}>
        <code>raised</code> for cards on the page, <code>overlay</code> for dialogs, menus and popovers that float
        above it.
      </p>
      <div style={grid}>
        <Card>
          <div style={title}>raised</div>
          <p style={body}>Softer shadow, 20px corners.</p>
        </Card>
        <Card elevation="overlay">
          <div style={title}>overlay</div>
          <p style={body}>Deeper shadow, 24px corners.</p>
        </Card>
      </div>

      <h2 id="clickable" style={h2}>Clickable</h2>
      <p style={note}>
        A card that goes somewhere is a button: <code>as=&quot;button&quot;</code> with <code>interactive</code>. It
        resets the native button look and lifts on hover.
      </p>
      <div style={grid}>
        <Card as="button" interactive pad="sm" style={{ width: '100%' }}>
          <div style={title}>Read your chronicle</div>
          <p style={body}>3 entries so far</p>
        </Card>
        <Card as="button" interactive pad="sm" style={{ width: '100%' }}>
          <div style={title}>See your progress</div>
          <p style={body}>Streak, week and month totals</p>
        </Card>
      </div>

      <h2 id="as-a-list" style={h2}>As a list</h2>
      <p style={note}>
        Rows that each go somewhere share one card instead of one card each. Use <code>pad=&quot;none&quot;</code>{' '}
        with <code>overflow: hidden</code>, so the rows run edge to edge and their hover stays inside the corners. Each
        row is a full-width button at least 60px tall, with 12px 18px padding, a 1px{' '}
        <code>var(--color-line)</code> line above every row but the first, and the <code>hv7</code> hover wash.
        Related lists are grouped, each card under an eyebrow heading.
      </p>
      <div style={{ maxWidth: 620 }}>
        {listGroups.map((g) => (
          <div key={g.label} style={{ marginBottom: 16 }}>
            <Text variant="eyebrow" as="h3" tone="slate" style={{ margin: '0 4px 8px' }}>
              {g.label}
            </Text>
            <Card pad="none" style={{ overflow: 'hidden' }}>
              {g.rows.map((r, i) => (
                <button
                  key={r.name}
                  type="button"
                  className="hv7"
                  style={{ ...row, borderTop: i ? '1px solid var(--color-line)' : 'none' }}
                >
                  <Text variant="eyebrow" as="span" tone="slate" style={{ flex: 'none', width: 52, lineHeight: 1.35 }}>
                    {r.day[0]}
                    <br />
                    {r.day[1]}
                  </Text>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <Text variant="itemTitle" as="span" tone="ink" style={{ display: 'block' }}>
                      {r.name}
                    </Text>
                    <Text variant="caption" as="span" tone="muted" style={{ display: 'block', marginTop: 1 }}>
                      {r.meta}
                    </Text>
                  </span>
                  <Chip tone={r.status === 'Done' ? 'accent' : 'info'}>{r.status}</Chip>
                </button>
              ))}
            </Card>
          </div>
        ))}
      </div>

      <h2 id="as-a-section" style={h2}>As a section</h2>
      <p style={note}>
        <code>as</code> can be div (the default), section, aside, article, button or dialog. Pick the element that says
        what the card is: a region of the page is a section, a card that is clicked is a button.
      </p>
      <Card as="section" pad="lg">
        <div style={title}>Upper Body Push</div>
        <p style={body}>3 exercises · ~50 min</p>
        <div style={{ marginTop: 16 }}>
          <Button type="primary" size="md">
            Finish workout &amp; log it
          </Button>
        </div>
      </Card>

      <h2 id="as-a-dialog" style={h2}>As a dialog</h2>
      <p style={note}>
        <code>as=&quot;dialog&quot;</code> renders a native <code>&lt;dialog&gt;</code>, with{' '}
        <code>elevation=&quot;overlay&quot;</code> so it floats above the page. Don&apos;t build a modal from it
        directly: use <Link href="/design-system/dialog" style={{ color: 'var(--color-accent-deep)', fontWeight: 'var(--font-weight-semibold)' }}>
          Dialog
        </Link>, which is this card as a dialog, and adds opening it as
        a modal, moving focus in and back, closing on Escape or a press outside, and its title, text and buttons.
      </p>
    </DocPage>
  );
}
