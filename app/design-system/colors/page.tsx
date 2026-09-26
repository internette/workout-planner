import { colorGroups, cssVarName, gradients, overlays } from '@/components/ui/colors';
import { DocPage } from '../docs';

export const metadata = { title: 'Colors — Design system' };

// A line under a group's heading, where the group needs more than each swatch's own note.
const groupNotes: Record<string, string> = {
  Pink: 'One pink, in steps on the same hue: pink is the primary colour (buttons, selection, marks), pinkHover is one step darker, and pinkDeep two steps darker for pink text. pinkTint and pinkMuted are its light backgrounds.',
};

export default function ColorsPage() {
  return (
    <DocPage title="Colors">
      <p style={{ margin: '8px 0 32px', color: 'var(--color-muted)', lineHeight: 'var(--leading-relaxed)' }}>
        Every colour is a CSS variable on <code>:root</code>, for example <code>var(--color-pink)</code>. Import{' '}
        <code>colors</code> from <code>@/components/ui/colors</code> only where a real hex string is needed.
      </p>
      {Object.entries(colorGroups).map(([group, swatches]) => (
        <section key={group} style={{ marginBottom: 36 }}>
          <h2 id={group.toLowerCase()} style={{ fontSize: 'var(--text-2xl)', scrollMarginTop: 'var(--ds-anchor-offset)' }}>{group}</h2>
          {groupNotes[group] ? (
            <p style={{ margin: '0 0 16px', maxWidth: 640, color: 'var(--color-muted)', lineHeight: 'var(--leading-relaxed)' }}>
              {groupNotes[group]}
            </p>
          ) : null}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {Object.entries(swatches).map(([name, { hex, use }]) => (
              <div
                key={name}
                style={{
                  background: 'var(--color-white)', borderRadius: 'var(--radius-md)', overflow: 'hidden',
                  boxShadow: '0 4px 14px var(--color-line)',
                }}
              >
                <div
                  style={{
                    height: 64, background: `var(${cssVarName(name)})`,
                    borderBottom: '1px solid var(--color-line)',
                  }}
                />
                <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <strong style={{ fontSize: 'var(--text-base)' }}>{name}</strong>
                  <code style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>{hex}</code>
                  <code style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>var({cssVarName(name)})</code>
                  <span style={{ fontSize: 'var(--text-md)', color: 'var(--color-slate)', lineHeight: 'var(--leading-snug)' }}>{use}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
      <section style={{ marginBottom: 36 }}>
        <h2 id="gradients-and-overlays" style={{ fontSize: 'var(--text-2xl)', scrollMarginTop: 'var(--ds-anchor-offset)' }}>Gradients and overlays</h2>
        <p style={{ margin: '0 0 16px', color: 'var(--color-muted)', lineHeight: 'var(--leading-relaxed)' }}>
          Composites built from the palette, also CSS variables. Write <code>var(--gradient-gem)</code>, not the
          gradient itself.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {[
            ...Object.entries(gradients).map(([name, { value, use }]) => ({ name, variable: `--gradient-${name}`, value, use, swatch: `var(--gradient-${name})` })),
            ...Object.entries(overlays).map(([name, { value, use }]) => ({ name, variable: `--${name}`, value, use, swatch: `linear-gradient(0deg, var(--${name}), var(--${name})), var(--color-canvas)` })),
          ].map(({ name, variable, value, use, swatch }) => (
            <div key={name} style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--elevation-raised)' }}>
              <div style={{ height: 64, background: swatch, borderBottom: '1px solid var(--color-line)' }} />
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <strong style={{ fontSize: 'var(--text-base)' }}>{name}</strong>
                <code style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>var({variable})</code>
                <span style={{ fontSize: 'var(--text-md)', color: 'var(--color-slate)', lineHeight: 'var(--leading-snug)' }}>{use}</span>
                <code style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', wordBreak: 'break-word' }}>{value}</code>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DocPage>
  );
}
