import { colorGroups, cssVarName, gradients, overlays, translucents } from '../../src/colors';
import { DocPage } from '../docs';

export const metadata = { title: 'Colors — Design system' };

/** A group's heading id: "Lines and controls" -> "lines-and-controls". */
const groupId = (title: string) => title.toLowerCase().replace(/\s+/g, '-');

// A line under a group's heading, where the group needs more than each swatch's own note.
const groupNotes: Record<string, string> = {
  Accent: 'The theme’s colour, which changes with Profile → Settings → Colour: pink by default. Use it for anything that means “the app’s colour”; for pink that must stay pink, use Brand.',
  'On colour': 'What sits on a coloured fill. In the light teal, periwinkle and coral themes the accent is light, so onAccent turns dark.',
  Brand: 'Colours that stay themselves in every theme: the moods, the rank tiers, the gem and the sparkles. Each has a tint for a badge and a deep shade for text on it.',
};

export default function ColorsPage() {
  return (
    <DocPage title="Colors">
      <p style={{ margin: '8px 0 32px', color: 'var(--color-muted)', lineHeight: 'var(--leading-base)' }}>
        Every colour is a CSS variable on <code>:root</code>, for example <code>var(--color-pink)</code>. Import{' '}
        <code>colors</code> from <code>@moonshot/design-system/colors</code> only where a real hex string is needed.
      </p>
      {Object.entries(colorGroups).map(([group, swatches]) => (
        <section key={group} style={{ marginBottom: 36 }}>
          <h2 id={groupId(group)} style={{ fontSize: 'var(--text-xl)', scrollMarginTop: 'var(--ds-anchor-offset)' }}>{group}</h2>
          {groupNotes[group] ? (
            <p style={{ margin: '0 0 16px', maxWidth: 640, color: 'var(--color-muted)', lineHeight: 'var(--leading-base)' }}>
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
                  <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-slate)', lineHeight: 'var(--leading-base)' }}>{use}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
      <section style={{ marginBottom: 36 }}>
        <h2 id="effects" style={{ fontSize: 'var(--text-xl)', scrollMarginTop: 'var(--ds-anchor-offset)' }}>Effects</h2>
        <p style={{ margin: '0 0 16px', color: 'var(--color-muted)', lineHeight: 'var(--leading-base)' }}>
          See-through colours, gradients and the dialog backdrop, built from the palette and also CSS variables. Write{' '}
          <code>var(--gradient-gem)</code>, not the gradient itself.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {[
            ...Object.entries(translucents).map(([name, { value, use }]) => ({ name, variable: cssVarName(name), value, use, swatch: `linear-gradient(0deg, var(${cssVarName(name)}), var(${cssVarName(name)})), var(--color-canvas)` })),
            ...Object.entries(gradients).map(([name, { value, use }]) => ({ name, variable: `--gradient-${name}`, value, use, swatch: `var(--gradient-${name})` })),
            ...Object.entries(overlays).map(([name, { value, use }]) => ({ name, variable: `--${name}`, value, use, swatch: `linear-gradient(0deg, var(--${name}), var(--${name})), var(--color-canvas)` })),
          ].map(({ name, variable, value, use, swatch }) => (
            <div key={name} style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--elevation-raised)' }}>
              <div style={{ height: 64, background: swatch, borderBottom: '1px solid var(--color-line)' }} />
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <strong style={{ fontSize: 'var(--text-base)' }}>{name}</strong>
                <code style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>var({variable})</code>
                <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-slate)', lineHeight: 'var(--leading-base)' }}>{use}</span>
                <code style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', wordBreak: 'break-word' }}>{value}</code>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DocPage>
  );
}
