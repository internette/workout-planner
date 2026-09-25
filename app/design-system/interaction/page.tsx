import { focus, hovers } from '@/components/ui/interaction';
import { DocPage, h2, note } from '../docs';

export const metadata = { title: 'Interaction — Design system' };

const table: React.CSSProperties = { width: '100%', borderCollapse: 'collapse' };
// The table's card. On a narrow screen the table scrolls sideways inside it instead of widening the page.
const tableScroll: React.CSSProperties = { overflowX: 'auto', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--elevation-raised)' };
const cell: React.CSSProperties = { padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid rgba(35,42,69,.07)', fontSize: 'var(--text-base)', verticalAlign: 'middle' };
const muted: React.CSSProperties = { ...cell, color: 'var(--color-muted)' };
const demoBtn: React.CSSProperties = {
  border: 'none',
  background: 'var(--color-white)',
  borderRadius: 'var(--radius-sm)',
  padding: '8px 14px',
  font: 'inherit',
  fontWeight: 600,
  color: 'var(--color-ink)',
  cursor: 'pointer',
  boxShadow: 'inset 0 0 0 1px var(--color-divider)',
};
const panel: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 32, padding: '28px 24px', background: 'var(--color-canvas)', borderRadius: 18 };
const list: React.CSSProperties = { ...note, margin: '8px 0 0', paddingLeft: 20 };

// The hover classes in app/planner.css, for controls styled inline (they beat inline styles).
const hoverClasses = [
  { name: 'hv1', does: 'The neutral wash, var(--hover-neutral)', use: 'Quiet text buttons: the calendar’s month name, a day card’s “more” toggle, an exercise row in the Spellbook' },
  { name: 'hv3', does: 'Deep pink text on a faint wash (rgba(35,42,69,.04))', use: 'A name that is also a link, like a day card’s workout name' },
  { name: 'hv6', does: 'Darkens whatever is there by 3%', use: 'A control with a gradient or picture of its own: the rank badge on Profile' },
  { name: 'hv7', does: 'The pink tint, var(--color-pink-tint)', use: 'Rows in a list card: Progress’s week, the Chronicle’s session picker' },
];

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

      <h3 id="hover-classes" style={{ fontSize: 'var(--text-xl)', margin: '28px 0 4px' }}>Hover classes</h3>
      <p style={note}>
        For a control styled inline, add one of these classes from <code>app/planner.css</code> rather than a hover
        handler. They&apos;re <code>!important</code>, so they win over the inline background. Hover each example to
        see it.
      </p>
      <div style={tableScroll} tabIndex={0} role="region" aria-label="Hover classes table, scrolls sideways">
        <table style={table}>
          <tbody>
            {hoverClasses.map((h) => (
              <tr key={h.name}>
                <td style={{ ...cell, fontWeight: 600, whiteSpace: 'nowrap' }}>.{h.name}</td>
                <td style={{ ...cell, width: 110 }}>
                  <button type="button" className={h.name} style={{ ...demoBtn, background: h.name === 'hv6' ? 'var(--gradient-gem-tint)' : demoBtn.background }}>
                    Hover
                  </button>
                </td>
                <td style={cell}>{h.does}</td>
                <td style={muted}>{h.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="focus" style={h2}>Focus</h2>
      <p style={note}>One ring for everything that can take keyboard focus. Never remove it without putting an equivalent in its place.</p>
      <div style={panel}>
        <div style={{ padding: '12px 22px', borderRadius: 'var(--radius-md)', background: 'var(--color-white)', outline: 'var(--focus-ring)', outlineOffset: 'var(--focus-offset)' }}>Focused</div>
        <div>
          {Object.entries(focus).map(([name, { value, use }]) => (
            <div key={name} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', lineHeight: 'var(--leading-snug)', marginBottom: 6 }}>
              <strong style={{ color: 'var(--color-ink)' }}>--focus-{name}</strong> <code>{value}</code> — {use}
            </div>
          ))}
        </div>
      </div>

      <h2 id="tap-targets" style={h2}>Tap targets</h2>
      <p style={note}>
        Everything you can tap answers to at least 44 × 44px, however small it&apos;s drawn. Add the <code>hit</code>{' '}
        class to a control drawn smaller: an invisible <code>::after</code> centred on it grows the tap area to 44px
        without moving anything. Segmented control options and the rating stars have it built in.
      </p>
      <div style={panel}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44 }}>
          <span aria-hidden style={{ position: 'absolute', inset: 0, border: '1.5px dashed var(--color-pink)', borderRadius: 8 }} />
          <span style={{ width: 24, height: 24, borderRadius: 7, background: 'var(--color-white)', boxShadow: 'inset 0 0 0 1px var(--color-divider)' }} />
        </div>
        <p style={{ ...note, margin: 0, maxWidth: 420 }}>
          A 24px control with <code>className=&quot;hit&quot;</code>: the dashed square is the 44px it answers to.
          Keep 44px between neighbouring targets so their areas don&apos;t overlap.
        </p>
      </div>

      <h2 id="screen-readers" style={h2}>Screen readers</h2>
      <p style={note}>
        <code>sr-only</code> hides text on screen and keeps it for screen readers: a heading for a view that shows its
        title another way, a hint a control points to with <code>aria-describedby</code> (&ldquo;Drag to reorder, or use
        the up and down arrow keys&rdquo;), or a <code>role=&quot;status&quot;</code> line that reads out what just
        changed. Something that moves in a list, or appears after an action, is announced in words.
      </p>

      <h2 id="forced-colours" style={h2}>Forced colours</h2>
      <p style={note}>
        Windows High Contrast and other forced-colour modes drop backgrounds and shadows, which is how this interface
        draws buttons and selection. <code>app/planner.css</code> puts them back in system colours:
      </p>
      <ul style={list}>
        <li>Every button, tab and radio gets a 1px <code>ButtonText</code> outline, drawn inside so nothing moves.</li>
        <li>
          Whatever is pressed, selected, checked or the current page gets a 3px <code>Highlight</code> outline, and
          focus a 3px <code>Highlight</code> ring.
        </li>
        <li>
          Where colour is the meaning, keep it: wrap it in <code>fc-keep</code>. The mood faces use it, so Happy stays
          pink and Mad stays red.
        </li>
        <li>
          Rating stars can&apos;t keep their gradient, so a star inside <code>data-star</code> or <code>fc-star</code>{' '}
          fills with the text colour when it has <code>data-on</code>, and greyed text colour when it doesn&apos;t.
        </li>
      </ul>
      <p style={note}>
        To check a screen, turn on forced colours in Chrome&apos;s DevTools (Rendering → Emulate CSS media feature
        forced-colors).
      </p>
    </DocPage>
  );
}
