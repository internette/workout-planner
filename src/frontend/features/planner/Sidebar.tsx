import { css } from '@/frontend/features/planner/viewHelpers';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { NAV } from './nav';

/** The navigation on wide screens: the five places, down the side. */
export function Sidebar({ v }: { v: PlannerVals }) {
  return (
    <nav aria-label="Main" style={css(v.sidebarStyle)}>
      <div style={css(v.navListStyle)}>
        {v.nav.map((n) => {
          const { label, href, Icon } = NAV[n.id];
          return (
            <a key={n.id} href={href} onClick={v.navGo(n.go, n.id)} aria-current={n.current} style={css(n.item)}>
              <Icon color={n.itemInk} size={18} />
              {label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
