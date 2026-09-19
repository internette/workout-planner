import { fontFamilies, fontSizes, fontWeights, leading, tracking } from '@/components/ui/typography';

export const metadata = { title: 'Typography — Design system' };

const row: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: '150px 1fr', gap: 20, alignItems: 'baseline', padding: '14px 0',
  borderBottom: '1px solid rgba(35,42,69,.07)',
};
const meta: React.CSSProperties = { fontSize: 'var(--text-sm)', color: 'var(--color-muted)', lineHeight: 'var(--leading-snug)' };
const h2: React.CSSProperties = { fontSize: 'var(--text-2xl)', margin: '40px 0 4px' };

export default function TypographyPage() {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '24px 24px 80px' }}>
      <h1 style={{ margin: 0, fontSize: 'var(--text-5xl)' }}>Typography</h1>
      <p style={{ margin: '8px 0 0', color: 'var(--color-muted)', lineHeight: 'var(--leading-relaxed)' }}>
        Two families, twelve sizes, four weights. Each token is a CSS variable, for example{' '}
        <code>var(--text-md)</code> or <code>var(--font-weight-bold)</code>.
      </p>

      <h2 style={h2}>Families</h2>
      {Object.entries(fontFamilies).map(([name, { value, use }]) => (
        <div key={name} style={row}>
          <div>
            <strong>{name}</strong>
            <div style={meta}>var(--font-{name})</div>
          </div>
          <div>
            <div style={{ fontFamily: `var(--font-${name})`, fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-weight-bold)' }}>
              The city is quiet
            </div>
            <div style={meta}>{value}</div>
            <div style={meta}>{use}</div>
          </div>
        </div>
      ))}

      <h2 style={h2}>Sizes</h2>
      {Object.entries(fontSizes).map(([name, { px, use }]) => (
        <div key={name} style={row}>
          <div>
            <strong>{name}</strong>
            <div style={meta}>
              {px}px · var(--text-{name})
            </div>
          </div>
          <div>
            <div style={{ fontSize: `var(--text-${name})`, lineHeight: 'var(--leading-snug)' }}>Every session, one step closer</div>
            <div style={meta}>{use}</div>
          </div>
        </div>
      ))}

      <h2 style={h2}>Weights</h2>
      {Object.entries(fontWeights).map(([name, { value, use }]) => (
        <div key={name} style={row}>
          <div>
            <strong>{name}</strong>
            <div style={meta}>
              {value} · var(--font-weight-{name})
            </div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: `var(--font-weight-${name})` }}>Rest is how the power comes back</div>
            <div style={meta}>{use}</div>
          </div>
        </div>
      ))}

      <h2 style={h2}>Tracking</h2>
      {Object.entries(tracking).map(([name, { value, use }]) => (
        <div key={name} style={row}>
          <div>
            <strong>{name}</strong>
            <div style={meta}>
              {value} · var(--tracking-{name})
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: `var(--tracking-${name})`,
                textTransform: name === 'wide' ? 'uppercase' : undefined,
              }}
            >
              Today&rsquo;s quest
            </div>
            <div style={meta}>{use}</div>
          </div>
        </div>
      ))}

      <h2 style={h2}>Leading</h2>
      {Object.entries(leading).map(([name, { value, use }]) => (
        <div key={name} style={row}>
          <div>
            <strong>{name}</strong>
            <div style={meta}>
              {value} · var(--leading-{name})
            </div>
          </div>
          <div>
            <p style={{ margin: 0, maxWidth: 420, lineHeight: `var(--leading-${name})`, fontSize: 'var(--text-base)' }}>
              No quest today. Rest is how the power comes back, or add a workout if you&rsquo;re feeling it.
            </p>
            <div style={meta}>{use}</div>
          </div>
        </div>
      ))}
    </main>
  );
}
