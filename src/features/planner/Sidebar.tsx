import { BarChart, Calendar, Quill, SpellCards, User } from '@moonshot/design-system/icons';
import { css } from '@/features/planner/viewHelpers';
import type { PlannerVals } from '@/features/planner/store/types';

/** The navigation on wide screens: the five places, down the side. */
export function Sidebar({ v }: { v: PlannerVals }) {
  return (
    <nav aria-label="Main" style={css(v.sidebarStyle)}>
      <div style={css(v.navListStyle)}>
        <a href="/calendar" onClick={v.navGo(v.goDay, 'day')} aria-current={v.navCalOn} style={css(v.navCal)}>
          <Calendar color={v.navCalInk} size={18} />
          {'Calendar '}
        </a>
        <a href="/chronicle" onClick={v.navGo(v.goDiaryList, 'diaryList')} aria-current={v.navDiaryOn} style={css(v.navDiary)}>
          <Quill color={v.navDiaryInk} size={18} />
          {'Chronicle '}
        </a>
        <a href="/spellbook" onClick={v.navGo(v.goArsenal, 'arsenal')} aria-current={v.navArsenalOn} style={css(v.navArsenal)}>
          <SpellCards color={v.navArsenalInk} size={18} />
          {'Spellbook '}
        </a>
        <a href="/progress" onClick={v.navGo(v.goSummary, 'summary')} aria-current={v.navSummaryOn} style={css(v.navSummary)}>
          <BarChart color={v.navSummaryInk} strokeWidth={2.2} size={18} />
          {'Progress '}
        </a>
        <a href="/profile" onClick={v.navGo(v.goProfile, 'profile')} aria-current={v.navProfileOn} style={css(v.navProfile)}>
          <User color={v.navProfileInk} size={18} />
          {'Profile '}
        </a>
      </div>
    </nav>
  );
}
