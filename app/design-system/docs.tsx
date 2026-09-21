import type { CSSProperties, ReactNode } from 'react';

// What every page of the design-system site shares: the page frame with its title, and the section heading
// and intro paragraph styles. A page's own layouts (rows, grids, panels) stay in the page, since they differ.

/** The frame of a section's page: a centred column with the page title. */
export function DocPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '12px 0 80px' }}>
      <h1 style={{ margin: 0, fontSize: 'var(--text-5xl)' }}>{title}</h1>
      {children}
    </main>
  );
}

/** A section heading. Give it an id to get a link in the sidebar (see registry.ts). */
export const h2: CSSProperties = { fontSize: 'var(--text-2xl)', margin: '40px 0 4px', scrollMarginTop: 16 };

/** The muted paragraph that introduces a section. */
export const note: CSSProperties = {
  margin: '0 0 16px',
  color: 'var(--color-muted)',
  fontSize: 'var(--text-base)',
  lineHeight: 'var(--leading-relaxed)',
};
