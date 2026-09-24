import { durations, easings } from '@/components/ui/motion';
import { Button } from '@/components/ui/buttons';
import { DocPage, h2, note } from '../docs';

export const metadata = { title: 'Motion — Design system' };

const table: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' };
// The table's card. On a narrow screen the table scrolls sideways inside it instead of widening the page.
const tableScroll: React.CSSProperties = { overflowX: 'auto', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--elevation-raised)' };
const cell: React.CSSProperties = { padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid rgba(35,42,69,.07)', fontSize: 'var(--text-base)' };
const muted: React.CSSProperties = { ...cell, color: 'var(--color-muted)' };

export default function MotionPage() {
  return (
    <DocPage title="Motion">
      <p style={{ ...note, marginTop: 8 }}>
        How long things take, and how they ease. Write <code>transition: background-color var(--dur-state) var(--ease-standard)</code>.
        Hover over the buttons below: their colour changes use exactly these. Everything switches off for people who ask for
        reduced motion (see <code>planner.css</code>).
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', marginTop: 16 }}>
        <Button type="neutral" ghost size="md">Neutral ghost</Button>
        <Button type="danger" ghost size="md">Danger ghost</Button>
        <Button type="primary" size="md">Primary</Button>
      </div>

      <h2 id="durations" style={h2}>Durations</h2>
      <div style={tableScroll} tabIndex={0} role="region" aria-label="Table, scrolls sideways">
        <table style={table}>
        <tbody>
          {Object.entries(durations).map(([name, { value, use }]) => (
            <tr key={name}>
              <td style={{ ...cell, fontWeight: 600, whiteSpace: 'nowrap' }}>--dur-{name}</td>
              <td style={cell}>{value}</td>
              <td style={muted}>{use}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <h2 id="easings" style={h2}>Easings</h2>
      <div style={tableScroll} tabIndex={0} role="region" aria-label="Table, scrolls sideways">
        <table style={table}>
        <tbody>
          {Object.entries(easings).map(([name, { value, use }]) => (
            <tr key={name}>
              <td style={{ ...cell, fontWeight: 600, whiteSpace: 'nowrap' }}>--ease-{name}</td>
              <td style={cell}>{value}</td>
              <td style={muted}>{use}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </DocPage>
  );
}
