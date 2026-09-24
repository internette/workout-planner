import { breakpoints, layout, space } from '@/components/ui/spacing';
import { DocPage, h2, note } from '../docs';

export const metadata = { title: 'Spacing — Design system' };

const table: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' };
// The table's card. On a narrow screen the table scrolls sideways inside it instead of widening the page.
const tableScroll: React.CSSProperties = { overflowX: 'auto', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--elevation-raised)' };
const cell: React.CSSProperties = { padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid rgba(35,42,69,.07)', fontSize: 'var(--text-base)', verticalAlign: 'middle' };
const muted: React.CSSProperties = { ...cell, color: 'var(--color-muted)' };

export default function SpacingPage() {
  return (
    <DocPage title="Spacing">
      <p style={{ ...note, marginTop: 8 }}>
        The padding and gaps the interface uses: seven steps on an even 4px grid, so step <em>n</em> is <em>n</em> × 4px. Write{' '}
        <code>padding: var(--space-6)</code>, not <code>24px</code>. <code>Card</code>, <code>Button</code>, <code>Chip</code>{' '}
        and the other components already use them, so a design that follows them lines up.
      </p>

      <h2 id="scale" style={h2}>Scale</h2>
      <p style={note}>The bar is the step at its real width.</p>
      <div style={tableScroll} tabIndex={0} role="region" aria-label="Scale table, scrolls sideways">
        <table style={table}>
        <tbody>
          {Object.entries(space).map(([step, { value, use }]) => (
            <tr key={step}>
              <td style={{ ...cell, fontWeight: 600, whiteSpace: 'nowrap' }}>--space-{step}</td>
              <td style={cell}>{value}</td>
              <td style={{ ...cell, width: 160 }}><div style={{ width: `var(--space-${step})`, height: 12, borderRadius: 'var(--radius-full)', background: 'var(--color-pink)' }} /></td>
              <td style={muted}>{use}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <h2 id="layout" style={h2}>Layout</h2>
      <p style={note}>Measures for the page itself. The page gutter is step 7.</p>
      <div style={tableScroll} tabIndex={0} role="region" aria-label="Layout table, scrolls sideways">
        <table style={table}>
        <tbody>
          {Object.entries(layout).map(([name, { value, use }]) => (
            <tr key={name}>
              <td style={{ ...cell, fontWeight: 600, whiteSpace: 'nowrap' }}>{name}</td>
              <td style={cell}>{value}</td>
              <td style={muted}>{use}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <h2 id="breakpoints" style={h2}>Breakpoints</h2>
      <p style={note}>
        Where the layout changes. A media query cannot read a CSS variable, so these are numbers in{' '}
        <code>@/components/ui/spacing</code>, not variables.
      </p>
      <div style={tableScroll} tabIndex={0} role="region" aria-label="Breakpoints table, scrolls sideways">
        <table style={table}>
        <tbody>
          {Object.entries(breakpoints).map(([name, px]) => (
            <tr key={name}>
              <td style={{ ...cell, fontWeight: 600 }}>{name}</td>
              <td style={cell}>{px}px</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </DocPage>
  );
}
