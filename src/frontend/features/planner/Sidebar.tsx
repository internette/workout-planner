import type { CSSProperties } from 'react';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { NAV } from './nav';

// The card the places sit in: down the side on a wide screen, a row across the top on a tablet.
const SIDEBAR: Record<'tablet' | 'wide', CSSProperties> = {
  tablet: { flex: '1 1 100%', width: '100%', position: 'relative', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2)', boxShadow: 'var(--elevation-raised)' },
  wide: { flex: '0 1 208px', minWidth: '180px', position: 'relative', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4h) var(--space-3h)', boxShadow: 'var(--elevation-raised)' },
};

// A place: lit in the accent tint where the person is.
const item = (on: boolean, tablet: boolean): CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-3)',
  padding: tablet ? '11px 16px' : 'var(--space-3)',
  flex: tablet ? 'none' : undefined,
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-base)',
  textAlign: 'left',
  textDecoration: 'none',
  cursor: 'pointer',
  background: on ? 'var(--color-pink-tint)' : 'none',
  color: on ? 'var(--color-pink-deep)' : 'var(--color-muted)',
  fontWeight: on ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
});

/** The navigation on wide screens: the five places, down the side (across the top on a tablet). */
export function Sidebar({ v }: { v: PlannerVals }) {
  if (v.layout === 'narrow') return null;
  const tablet = v.layout === 'tablet';
  return (
    <nav aria-label="Main" style={SIDEBAR[v.layout]}>
      <div style={{ display: 'flex', flexDirection: tablet ? 'row' : 'column', gap: 'var(--space-1)' }}>
        {v.nav.map((n) => {
          const { label, href, Icon } = NAV[n.id];
          return (
            <a key={n.id} href={href} onClick={v.navGo(n.go, n.id)} aria-current={n.current} style={item(n.on, tablet)}>
              <Icon color={n.on ? 'var(--color-pink)' : 'var(--color-muted)'} size={18} />
              {label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
