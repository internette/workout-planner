import { colorGroups, cssVarName, gradients, overlays } from '@/components/ui/colors';

export const metadata = { title: 'Colors — Design system' };

export default function ColorsPage() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '12px 0 80px' }}>
      <h1 style={{ margin: 0, fontSize: 'var(--text-5xl)' }}>Colors</h1>
      <p style={{ margin: '8px 0 32px', color: 'var(--color-muted)', lineHeight: 'var(--leading-relaxed)' }}>
        Every colour is a CSS variable on <code>:root</code>, for example <code>var(--color-pink)</code>. Import{' '}
        <code>colors</code> from <code>@/components/ui/colors</code> only where a real hex string is needed.
      </p>
      {Object.entries(colorGroups).map(([group, swatches]) => (
        <section key={group} style={{ marginBottom: 36 }}>
          <h2 id={group.toLowerCase()} style={{ fontSize: 'var(--text-2xl)', scrollMarginTop: 16 }}>{group}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {Object.entries(swatches).map(([name, { hex, use }]) => (
              <div
                key={name}
                style={{
                  background: 'var(--color-white)', borderRadius: 16, overflow: 'hidden',
                  boxShadow: '0 4px 14px rgba(35,42,69,.07)',
                }}
              >
                <div
                  style={{
                    height: 64, background: `var(${cssVarName(name)})`,
                    borderBottom: '1px solid rgba(35,42,69,.07)',
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
        <h2 id="gradients-and-overlays" style={{ fontSize: 'var(--text-2xl)', scrollMarginTop: 16 }}>Gradients and overlays</h2>
        <p style={{ margin: '0 0 16px', color: 'var(--color-muted)', lineHeight: 'var(--leading-relaxed)' }}>
          Composites built from the palette, also CSS variables. Write <code>var(--gradient-gem)</code>, not the
          gradient itself.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {[
            ...Object.entries(gradients).map(([name, { value, use }]) => ({ name, variable: `--gradient-${name}`, value, use, swatch: `var(--gradient-${name})` })),
            ...Object.entries(overlays).map(([name, { value, use }]) => ({ name, variable: `--${name}`, value, use, swatch: `linear-gradient(0deg, var(--${name}), var(--${name})), var(--color-canvas)` })),
          ].map(({ name, variable, value, use, swatch }) => (
            <div key={name} style={{ background: 'var(--color-white)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--elevation-raised)' }}>
              <div style={{ height: 64, background: swatch, borderBottom: '1px solid rgba(35,42,69,.07)' }} />
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
    </main>
  );
}
