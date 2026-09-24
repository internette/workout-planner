import { focus, hovers } from '@/components/ui/interaction';
import { DocPage, h2, note } from '../docs';

export const metadata = { title: 'Interaction — Design system' };

const table: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' };
// The table's card. On a narrow screen the table scrolls sideways inside it instead of widening the page.
const tableScroll: React.CSSProperties = { overflowX: 'auto', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--elevation-raised)' };
const cell: React.CSSProperties = { padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid rgba(35,42,69,.07)', fontSize: 'var(--text-base)', verticalAlign: 'middle' };
const muted: React.CSSProperties = { ...cell, color: 'var(--color-muted)' };

export default function InteractionPage() {
  return (
    <DocPage title="Interaction">
      <p style={{ ...note, marginTop: 8 }}>
        How controls answer a pointer and a keyboard: the tints a control takes on hover, and the one focus ring every control
        shares. Write <code>background: var(--hover-neutral)</code> and <code>outline: var(--focus-ring)</code>.
      </p>

      <h2 id="hover" style={h2}>Hover</h2>
      <p style={note}>Each wash is a tint laid over the control&apos;s own background. Shown on white, and on the dark surface for the inverse one.</p>
      <div style={tableScroll} tabIndex={0} role="region" aria-label="Hover table, scrolls sideways">
        <table style={table}>
        <tbody>
          {Object.entries(hovers).map(([name, { value, use }]) => (
            <tr key={name}>
              <td style={{ ...cell, fontWeight: 600, whiteSpace: 'nowrap' }}>--hover-{name.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())}</td>
              <td style={{ ...cell, width: 80 }}>
                <div style={{ width: 48, height: 32, borderRadius: 'var(--radius-sm)', background: name === 'inverse' ? 'var(--color-ink)' : 'var(--color-white)', boxShadow: 'inset 0 0 0 1px var(--color-divider)' }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: 'var(--radius-sm)', background: `var(--hover-${name.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())})` }} />
                </div>
              </td>
              <td style={cell}><code>{value}</code></td>
              <td style={muted}>{use}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <h2 id="focus" style={h2}>Focus</h2>
      <p style={note}>One ring for everything that can take keyboard focus. Never remove it without putting an equivalent in its place.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 32, padding: '28px 24px', background: 'var(--color-canvas)', borderRadius: 18 }}>
        <div style={{ padding: '12px 22px', borderRadius: 'var(--radius-md)', background: 'var(--color-white)', outline: 'var(--focus-ring)', outlineOffset: 'var(--focus-offset)' }}>Focused</div>
        <div>
          {Object.entries(focus).map(([name, { value, use }]) => (
            <div key={name} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', lineHeight: 'var(--leading-snug)', marginBottom: 6 }}>
              <strong style={{ color: 'var(--color-ink)' }}>--focus-{name}</strong> <code>{value}</code> — {use}
            </div>
          ))}
        </div>
      </div>
    </DocPage>
  );
}
