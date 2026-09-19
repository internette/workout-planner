import { Button } from '@/components/ui/buttons';
import { Card } from '@/components/ui/card';

export const metadata = { title: 'Card — Design system' };

const h2: React.CSSProperties = { fontSize: 'var(--text-2xl)', margin: '40px 0 4px' };
const note: React.CSSProperties = { margin: '0 0 16px', color: 'var(--color-muted)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)' };
const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 };
const title: React.CSSProperties = { fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--text-xl)' };
const body: React.CSSProperties = { margin: '6px 0 0', fontSize: 'var(--text-md)', color: 'var(--color-muted)', lineHeight: 'var(--leading-snug)' };

export default function CardPage() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '12px 0 80px' }}>
      <h1 style={{ margin: 0, fontSize: 'var(--text-5xl)' }}>Card</h1>
      <p style={{ ...note, marginTop: 8 }}>
        A white surface that sits above the page. Import it from <code>@/components/ui/card</code>. It takes layout
        props (<code>style</code>, <code>role</code>, <code>onClick</code>, and so on) like a normal element.
      </p>

      <h2 style={h2}>Padding</h2>
      <p style={note}>
        <code>pad</code>: none, xs (14px), sm (18px 20px), md (22px, the default) and lg (26px).
      </p>
      <div style={grid}>
        {(['xs', 'sm', 'md', 'lg'] as const).map((pad) => (
          <Card key={pad} pad={pad}>
            <div style={title}>pad=&quot;{pad}&quot;</div>
            <p style={body}>Every session, one step closer.</p>
          </Card>
        ))}
      </div>

      <h2 style={h2}>Elevation</h2>
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
          <p style={body}>Deeper shadow, 22px corners.</p>
        </Card>
      </div>

      <h2 style={h2}>Clickable</h2>
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

      <h2 style={h2}>As a section</h2>
      <p style={note}>
        <code>as</code> can be div (the default), section, aside, article or button.
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
    </main>
  );
}
