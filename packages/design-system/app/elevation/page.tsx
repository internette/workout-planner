import { elevations, glow, rings } from '../../src/elevation';
import { Button } from '../../src/buttons';
import { DocPage, h2, note } from '../docs';

export const metadata = { title: 'Elevation — Design system' };

const row: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, padding: '28px 24px', background: 'var(--color-canvas)', borderRadius: 'var(--radius-lg)', boxShadow: 'inset 0 0 0 1px var(--color-line)' };
const meta: React.CSSProperties = { fontSize: 'var(--text-sm)', color: 'var(--color-muted)', lineHeight: 'var(--leading-base)' };

export default function ElevationPage() {
  return (
    <DocPage title="Elevation">
      <p style={{ ...note, marginTop: 8 }}>
        The shadows the interface casts, as CSS variables. Nothing else in the app should cast a shadow of its own:
        write <code>box-shadow: var(--elevation-raised)</code>, not the values. <code>Card</code>, <code>Chip</code>,{' '}
        <code>SegmentedControl</code>, <code>TextField</code> and <code>Button</code> already use them.
      </p>

      <h2 id="steps" style={h2}>Steps</h2>
      <p style={note}>Four steps: from a quiet tray to a floating dialog, and a bar along the bottom of the screen, which casts its shadow upward.</p>
      <div style={row}>
        {Object.entries(elevations).map(([name, { value, use }]) => (
          <div key={name} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: 18, boxShadow: `var(--elevation-${name})` }}>
            <strong style={{ fontSize: 'var(--text-base)' }}>{name}</strong>
            <div style={meta}>var(--elevation-{name})</div>
            <div style={{ ...meta, color: 'var(--color-slate)', marginTop: 6 }}>{use}</div>
            <code style={{ ...meta, display: 'block', marginTop: 8, wordBreak: 'break-word' }}>{value}</code>
          </div>
        ))}
      </div>

      <h2 id="rings" style={h2}>Rings</h2>
      <p style={note}>
        A line drawn inside an edge, as an inset shadow, so nothing moves when it comes and goes: the outline of an empty
        control, the accent round the selected card or tile, today on the calendar, a card of destructive settings.
        Write <code>box-shadow: var(--ring-outline)</code>.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {Object.entries(rings).map(([name, { value, use }]) => (
          <div key={name} style={{ flex: '1 1 200px', maxWidth: 260 }}>
            <div style={{ height: 56, borderRadius: 'var(--radius-md)', background: 'var(--color-surface)', boxShadow: value }} />
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink)', fontWeight: 600, marginTop: 8 }}>--ring-{name.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-slate)', marginTop: 4 }}>{use}</div>
          </div>
        ))}
      </div>

      <h2 id="glow" style={h2}>Glow</h2>
      <p style={note}>
        A pink halo for the primary button, through its <code>glow</code> prop. Use it for one call to action on an
        otherwise empty surface, such as a landing page or an empty state. Never on a screen with several buttons.
      </p>
      <div style={{ ...row, alignItems: 'center' }}>
        <div>
          <Button type="primary" size="lg" glow>Step through</Button>
        </div>
        <div>
          <strong style={{ fontSize: 'var(--text-base)' }}>primary</strong>
          <div style={meta}>var(--glow-primary)</div>
          <div style={{ ...meta, color: 'var(--color-slate)', marginTop: 6 }}>{glow.primary.use}</div>
          <code style={{ ...meta, display: 'block', marginTop: 8 }}>{glow.primary.value}</code>
        </div>
      </div>
    </DocPage>
  );
}
