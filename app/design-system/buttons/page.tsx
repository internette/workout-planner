import { Button, IconButton } from '@/components/ui/buttons';
import { ChevronLeft, ChevronRight, Close, Pencil, Plus } from '@/components/ui/icons';

export const metadata = { title: 'Buttons — Design system' };

const h2: React.CSSProperties = { fontSize: 'var(--text-2xl)', margin: '40px 0 4px' };
const note: React.CSSProperties = {
  margin: '0 0 16px',
  color: 'var(--color-muted)',
  fontSize: 'var(--text-base)',
  lineHeight: 'var(--leading-relaxed)',
};
const row: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 14,
  padding: '18px 20px',
  background: 'var(--color-white)',
  borderRadius: 18,
};
const label: React.CSSProperties = { width: 90, fontSize: 'var(--text-sm)', color: 'var(--color-muted)' };
const stack: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 10 };

const sizes = ['xs', 'sm', 'md', 'lg'] as const;

export default function ButtonsPage() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '24px 24px 80px' }}>
      <h1 style={{ margin: 0, fontSize: 'var(--text-5xl)' }}>Buttons</h1>
      <p style={{ ...note, marginTop: 8 }}>
        <code>Button</code> for actions with a text label, <code>IconButton</code> for icon-only controls.
        Both come from <code>@/components/ui/buttons</code>. Hover over any of them to see the hover state. The native HTML <code>type</code> (submit, reset) is passed as <code>htmlType</code>, since <code>type</code> here is the design type.
      </p>

      <h2 style={h2}>Hierarchy</h2>
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

      <h2 style={h2}>Types</h2>
      <p style={note}>
        <code>type</code> picks the colour and role; <code>ghost</code> drops the fill. Sizes go across: xs,
        sm, md, lg.
      </p>
      <div style={stack}>
        {(
          [
            ['primary', { type: 'primary' }],
            ['primary ghost', { type: 'primary', ghost: true }],
            ['secondary', { type: 'secondary' }],
            ['secondary ghost', { type: 'secondary', ghost: true }],
            ['neutral', { type: 'neutral' }],
            ['neutral ghost', { type: 'neutral', ghost: true }],
            ['danger', { type: 'danger' }],
            ['danger ghost', { type: 'danger', ghost: true }],
            ['dashed', { type: 'dashed' }],
          ] as const
        ).map(([name, props]) => (
          <div key={name} style={row}>
            <span style={label}>{name}</span>
            {sizes.map((size) => (
              <Button key={size} size={size} {...props}>
                {size === 'xs' ? 'Back' : 'Save workout'}
              </Button>
            ))}
          </div>
        ))}
      </div>

      <h2 style={h2}>With an icon</h2>
      <p style={note}>Icons sit before the label; the gap adjusts to the size.</p>
      <div style={row}>
        <Button type="primary" size="sm">
          <Plus size={16} color="var(--color-white)" />
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

      <h2 style={h2}>Glow and full width</h2>
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

      <h2 style={h2}>Disabled</h2>
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

      <h2 style={h2}>Icon buttons</h2>
      <p style={note}>
        A <code>label</code> is required: it names the button for screen readers and shows as a tooltip.
      </p>
      <div style={stack}>
        {(
          [
            ['default', { tone: 'default' }],
            ['danger', { tone: 'danger' }],
            ['circle', { circle: true }],
          ] as const
        ).map(([name, props]) => (
          <div key={name} style={row}>
            <span style={label}>{name}</span>
            {sizes.map((size) => (
              <IconButton key={size} label={`Close (${size})`} size={size} {...props}>
                <Close size={size === 'xs' ? 14 : 16} color="var(--color-muted)" />
              </IconButton>
            ))}
          </div>
        ))}
        <div style={row}>
          <span style={label}>inverse</span>
          <span
            style={{ display: 'inline-flex', padding: 10, borderRadius: 14, background: 'var(--color-pink)' }}
          >
            <IconButton label="Remove" size="xs" tone="inverse">
              <Close size={13} color="var(--color-white)" />
            </IconButton>
          </span>
        </div>
        <div style={row}>
          <span style={label}>navigation</span>
          <IconButton label="Previous" size="md">
            <ChevronLeft size={17} color="var(--color-muted)" />
          </IconButton>
          <IconButton label="Next" size="md">
            <ChevronRight size={17} color="var(--color-muted)" />
          </IconButton>
        </div>
      </div>
    </main>
  );
}
