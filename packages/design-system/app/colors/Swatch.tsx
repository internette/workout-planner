import type { CSSProperties, ReactNode } from 'react';

const code: CSSProperties = { fontSize: 'var(--text-sm)', color: 'var(--color-muted)', wordBreak: 'break-word' };

/** A color's card on the Colors page: the swatch, its name, a few lines of values, and what it's for. */
export function Swatch({ name, swatch, lines, use }: { name: string; swatch: ReactNode; lines: string[]; use: string }) {
  return (
    <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--elevation-raised)' }}>
      {typeof swatch === 'string' ? <div style={{ height: 64, background: swatch, borderBottom: '1px solid var(--color-line)' }} /> : swatch}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <strong style={{ fontSize: 'var(--text-base)' }}>{name}</strong>
        {lines.map((l) => (
          <code key={l} style={code}>
            {l}
          </code>
        ))}
        <span style={{ fontSize: 'var(--text-base)', color: 'var(--color-slate)', lineHeight: 'var(--leading-base)' }}>{use}</span>
      </div>
    </div>
  );
}
