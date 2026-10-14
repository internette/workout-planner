import type { CSSProperties } from 'react';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { NAV } from './nav';

const BAR: CSSProperties = {
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-1)',
  padding: 'var(--space-2) var(--space-1) calc(var(--space-2) + env(safe-area-inset-bottom))',
  background: 'var(--color-surface-bar)',
  backdropFilter: 'blur(14px)',
  borderTop: '1px solid var(--color-line)',
  boxShadow: 'var(--elevation-bar)',
};

// A tab: its icon over its name, lit in the accent tint where the person is.
const tab = (on: boolean): CSSProperties => ({
  textDecoration: 'none',
  flex: 1,
  minWidth: 0,
  minHeight: '56px',
  padding: 'var(--space-2) var(--space-1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-1)',
  cursor: 'pointer',
  borderRadius: 'var(--radius-md)',
  background: on ? 'var(--color-pink-tint)' : 'none',
});
const label = (on: boolean): CSSProperties => ({
  whiteSpace: 'nowrap',
  fontSize: 'var(--text-sm)',
  fontWeight: on ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
  color: on ? 'var(--color-pink-deep)' : 'var(--color-muted)',
});

/** The navigation on phones: the five places, along the bottom. */
export function TabBar({ v }: { v: PlannerVals }) {
  if (v.layout !== 'narrow') return null;
  return (
    <nav aria-label="Main" data-tabbar style={BAR}>
      {v.nav.map((n) => {
        const { label: name, href, Icon } = NAV[n.id];
        return (
          <a key={n.id} href={href} onClick={v.navGo(n.go, n.id)} aria-current={n.current} style={tab(n.on)}>
            <Icon color={n.on ? 'var(--color-pink-deep)' : 'var(--color-muted)'} size={22} />
            <span style={label(n.on)}>{name}</span>
          </a>
        );
      })}
    </nav>
  );
}
