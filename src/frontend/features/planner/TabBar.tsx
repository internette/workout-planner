import { css } from '@/frontend/features/planner/viewHelpers';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { NAV } from './nav';

/** The navigation on phones: the five places, along the bottom. */
export function TabBar({ v }: { v: PlannerVals }) {
  return (
    <nav aria-label="Main" data-tabbar style={css(v.tabbarStyle)}>
      {v.nav.map((n) => {
        const { label, href, Icon } = NAV[n.id];
        return (
          <a key={n.id} href={href} onClick={v.navGo(n.go, n.id)} aria-current={n.current} style={css(n.tab)}>
            <Icon color={n.tabInk} size={22} />
            <span className="mlabel" style={css(n.tabLabel)}>
              {label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
