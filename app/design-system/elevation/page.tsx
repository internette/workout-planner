import { elevations, glow } from '@/components/ui/elevation';
import { Button } from '@/components/ui/buttons';
import { DocPage, h2, note } from '../docs';

export const metadata = { title: 'Elevation — Design system' };

const row: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, padding: '28px 24px', background: 'var(--color-canvas)', borderRadius: 18, boxShadow: 'inset 0 0 0 1px rgba(35,42,69,.07)' };
const meta: React.CSSProperties = { fontSize: 'var(--text-sm)', color: 'var(--color-muted)', lineHeight: 'var(--leading-snug)' };

export default function ElevationPage() {
  return (
    <DocPage title="Elevation">
      <p style={{ ...note, marginTop: 8 }}>
        The shadows the interface casts, as CSS variables. Nothing else in the app should cast a shadow of its own:
        write <code>box-shadow: var(--elevation-raised)</code>, not the values. <code>Card</code>, <code>Chip</code>,{' '}
        <code>SegmentedControl</code>, <code>TextField</code> and <code>Button</code> already use them.
      </p>

      <h2 id="steps" style={h2}>Steps</h2>
      <p style={note}>Three steps, from a quiet tray to a floating dialog.</p>
      <div style={row}>
        {Object.entries(elevations).map(([name, { value, use }]) => (
          <div key={name} style={{ background: 'var(--color-white)', borderRadius: 16, padding: 18, boxShadow: `var(--elevation-${name})` }}>
            <strong style={{ fontSize: 'var(--text-base)' }}>{name}</strong>
            <div style={meta}>var(--elevation-{name})</div>
            <div style={{ ...meta, color: 'var(--color-slate)', marginTop: 6 }}>{use}</div>
            <code style={{ ...meta, display: 'block', marginTop: 8, wordBreak: 'break-word' }}>{value}</code>
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
