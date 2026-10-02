import { Button, IconButton } from '../../src/buttons';
import { ChevronDown, ChevronLeft, ChevronRight, Close, Info, Pencil, Plus, Trash } from '../../src/icons';
import { DocPage, h2, note } from '../docs';
import { ButtonTypes } from './ButtonTypes';

export const metadata = { title: 'Buttons — Design system' };

const row: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 14,
  padding: '18px 20px',
  background: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
};
const label: React.CSSProperties = { width: 90, fontSize: 'var(--text-sm)', color: 'var(--color-muted)' };
const h3: React.CSSProperties = { margin: '24px 0 6px', fontSize: 'var(--text-lg)' };
const stack: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 10 };


export default function ButtonsPage() {
  return (
    <DocPage title="Buttons">
      <p style={{ ...note, marginTop: 8 }}>
        <code>Button</code> for actions with a text label, <code>IconButton</code> for icon-only controls, and <code>Button link</code> for an action written as text.
        Both come from <code>@moonshot/design-system/buttons</code>. Hover over any of them to see the hover state. The native HTML <code>type</code> (submit, reset) is passed as <code>htmlType</code>, since <code>type</code> here is the design type.
      </p>

      <h2 id="hierarchy" style={h2}>Hierarchy</h2>
      <p style={note}>
        Use one <strong>primary</strong> per screen or dialog. <strong>Secondary</strong> is a real
        alternative that sits beside it. <strong>Ghost</strong> is the quiet third tier: cancel, back,
        dismiss.
      </p>
      <div style={row}>
        <Button type="secondary" size="lg">
          Edit workout
        </Button>
        <Button type="primary" size="lg">
          Finish workout &amp; log it
        </Button>
        <Button type="neutral" ghost size="lg">
          Cancel
        </Button>
        <Button type="danger" ghost size="md">
          Delete workout
        </Button>
      </div>

      <h2 id="types" style={h2}>Types</h2>
      <p style={note}>
        <code>type</code> picks the color and role; <code>ghost</code> drops the fill. Pick one to see it at each
        size: xs, sm, md, lg.
      </p>
      <ButtonTypes rowStyle={row} />

      <h2 id="with-an-icon" style={h2}>With an icon</h2>
      <p style={note}>Icons sit before the label; the gap adjusts to the size.</p>
      <div style={row}>
        <Button type="primary" size="sm">
          <Plus size={16} color="var(--color-surface)" />
          Add workout
        </Button>
        <Button type="neutral" ghost size="lg">
          <Pencil size={17} />
          Edit workout
        </Button>
        <Button type="dashed" size="md">
          <Plus size={17} />
          Add exercise
        </Button>
      </div>

      <h2 id="glow-and-full-width" style={h2}>Glow and full width</h2>
      <div style={{ ...row, flexDirection: 'column', alignItems: 'stretch' }}>
        <div>
          <Button type="primary" size="lg" glow>
            Add workout
          </Button>
        </div>
        <Button type="primary" size="lg" fullWidth>
          Finish workout &amp; log it
        </Button>
        <Button type="dashed" size="lg" fullWidth>
          <Plus size={17} />
          Add exercise
        </Button>
      </div>

      <h2 id="link" style={h2}>Link</h2>
      <p style={note}>
        <code>link</code> draws just the text, with no padding and no fill, underlined on hover and keyboard focus. Use
        it for an action inside a sentence, or a quiet one that shouldn&apos;t look like a button, like &ldquo;+ 2
        more&rdquo; under a list. The tap area is still 44px. The color comes from <code>type</code>: primary (and
        secondary) take the deep accent, neutral the muted grey in a lighter weight, danger red. <code>size</code> sets
        the text size.
      </p>
      <div style={{ ...row, flexDirection: 'column', alignItems: 'flex-start', gap: 18 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-base)', color: 'var(--color-muted)' }}>
          First time here?
          <Button type="primary" link size="sm">
            Begin your ritual
          </Button>
        </span>
        <Button type="neutral" link size="sm">
          + 2 more
          <ChevronDown size={15} strokeWidth={2.2} />
        </Button>
        <Button type="danger" link size="sm">
          Remove from this week
        </Button>
      </div>

      <h2 id="disabled" style={h2}>Disabled</h2>
      <div style={row}>
        <Button type="primary" disabled>
          Save workout
        </Button>
        <Button type="danger" disabled>
          Delete
        </Button>
        <Button type="neutral" ghost disabled>
          Cancel
        </Button>
      </div>

      <h2 id="icon-buttons" style={h2}>Icon buttons</h2>
      <p style={note}>
        <code>IconButton</code> is an icon with no text. <code>label</code> is required: it is the button&apos;s name
        for screen readers (pass <code>title</code> as well for a tooltip). The icon inside sets its own color and
        size, usually muted. It has no fill until it is hovered or has keyboard focus, and its tap area is 44px at
        every size.
      </p>

      <h3 style={h3}>Sizes</h3>
      <div style={stack}>
        {(
          [
            ['xs', 24, 'Inside a field: clearing a search', <IconButton key="x" label="Clear search" size="xs"><Close size={14} strokeWidth={2.2} color="var(--color-muted)" /></IconButton>],
            ['sm', 34, 'In a row or banner: removing an exercise, dismissing a notice', <IconButton key="x" label="Dismiss" size="sm"><Close size={14} strokeWidth={2.2} color="var(--color-muted)" /></IconButton>],
            ['md', 36, 'Stepping and closing: previous and next, a dialog’s close', <span key="x" style={{ display: 'flex', gap: 6 }}><IconButton label="Previous week" size="md"><ChevronLeft size={17} strokeWidth={2.2} color="var(--color-slate)" /></IconButton><IconButton label="Next week" size="md"><ChevronRight size={17} strokeWidth={2.2} color="var(--color-slate)" /></IconButton></span>],
            ['lg', 44, 'A row’s main action: adding an exercise from the list', <IconButton key="x" label="Add Back Squat to workout" size="lg" style={{ background: 'var(--color-surface)', boxShadow: 'inset 0 0 0 1px var(--color-line)' }}><Plus size={18} strokeWidth={2.4} color="var(--color-pink-deep)" /></IconButton>],
          ] as const
        ).map(([size, px, use, example]) => (
          <div key={size} style={row}>
            <span style={label}>
              <code>{size}</code> · {px}px
            </span>
            <span style={{ width: 96, display: 'flex' }}>{example}</span>
            <span style={{ flex: '1 1 200px', fontSize: 'var(--text-base)', color: 'var(--color-slate)' }}>{use}</span>
          </div>
        ))}
      </div>

      <h3 style={h3}>Circle</h3>
      <p style={note}>
        <code>circle</code> rounds the hover wash, for a round icon such as the info button beside the XP bar.
      </p>
      <div style={row}>
        <IconButton label="How XP works" size="md" circle>
          <Info size={16} color="var(--color-muted)" />
        </IconButton>
      </div>

      <h3 style={h3}>Tones</h3>
      <p style={note}>
        <code>tone</code> sets only the hover wash; the icon&apos;s color is yours to set. Hover or tab onto each to see
        it: grey for <strong>default</strong>, red for <strong>danger</strong> (give it a red icon), and a light wash
        for <strong>inverse</strong>, on a colored fill.
      </p>
      <div style={row}>
        <IconButton label="Close" size="md">
          <Close size={16} strokeWidth={2.2} color="var(--color-muted)" />
        </IconButton>
        <IconButton label="Delete" size="md" tone="danger">
          <Trash size={16} color="var(--color-danger)" />
        </IconButton>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 4px 4px 12px', borderRadius: 'var(--radius-full)', background: 'var(--color-pink)', color: 'var(--color-surface)', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)' }}>
          Weekly
          <IconButton label="End this series" size="xs" tone="inverse" circle>
            <Close size={13} strokeWidth={2.4} color="var(--color-surface)" />
          </IconButton>
        </span>
      </div>
    </DocPage>
  );
}
