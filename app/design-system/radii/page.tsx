import { radii } from '@/components/ui/radii';
import { DocPage, h2, note } from '../docs';

export const metadata = { title: 'Radii — Design system' };

const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 };
const meta: React.CSSProperties = { fontSize: 'var(--text-sm)', color: 'var(--color-muted)', lineHeight: 'var(--leading-snug)' };

export default function RadiiPage() {
  return (
    <DocPage title="Radii">
      <p style={{ ...note, marginTop: 8 }}>
        The corner radii the interface uses: five sizes on an even 4px step, and one for anything round. Write{' '}
        <code>border-radius: var(--radius-lg)</code>, not <code>20px</code>. A smaller control takes a smaller radius, so its
        corners stay in proportion to its size.
      </p>

      <h2 id="scale" style={h2}>Scale</h2>
      <p style={note}>Smallest first. The box shows each corner at its real size.</p>
      <div style={grid}>
        {Object.entries(radii).map(([name, { value, use }]) => (
          <div key={name} style={{ padding: 16, background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--elevation-raised)' }}>
            <div style={{ height: 56, background: 'var(--color-pink-tint)', boxShadow: 'inset 0 0 0 2px var(--color-pink)', borderRadius: `var(--radius-${name.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())})` }} />
            <div style={{ marginTop: 12, fontWeight: 600 }}>{name}</div>
            <div style={meta}>{value}</div>
            <div style={{ ...meta, color: 'var(--color-slate)', marginTop: 4 }}>{use}</div>
          </div>
        ))}
      </div>
    </DocPage>
  );
}
