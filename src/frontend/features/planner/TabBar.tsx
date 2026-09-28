import { BarChart, Calendar, Quill, SpellCards, User } from '@moonshot/design-system/icons';
import { css } from '@/frontend/features/planner/viewHelpers';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** The navigation on phones: the five places, along the bottom. */
export function TabBar({ v }: { v: PlannerVals }) {
  return (
    <nav aria-label="Main" data-tabbar style={css(v.tabbarStyle)}>
      <a href="/calendar" onClick={v.navGo(v.goDay, 'day')} aria-current={v.navCalOn} style={css(v.mTabCal)}>
        <Calendar color={v.mCalColor} size={22} />
        <span className="mlabel" style={css(v.mCalLabel)}>
          Calendar
        </span>
      </a>
      <a href="/chronicle" onClick={v.navGo(v.goDiaryList, 'diaryList')} aria-current={v.navDiaryOn} style={css(v.mTabDiary)}>
        <Quill color={v.mDiaryColor} size={22} />
        <span className="mlabel" style={css(v.mDiaryLabel)}>
          Chronicle
        </span>
      </a>
      <a href="/spellbook" onClick={v.navGo(v.goArsenal, 'arsenal')} aria-current={v.navArsenalOn} style={css(v.mTabArsenal)}>
        <SpellCards color={v.mArsenalColor} size={22} />
        <span className="mlabel" style={css(v.mArsenalLabel)}>
          Spellbook
        </span>
      </a>
      <a href="/progress" onClick={v.navGo(v.goSummary, 'summary')} aria-current={v.navSummaryOn} style={css(v.mTabSummary)}>
        <BarChart color={v.mSummaryColor} size={22} />
        <span className="mlabel" style={css(v.mSummaryLabel)}>
          Progress
        </span>
      </a>
      <a href="/profile" onClick={v.navGo(v.goProfile, 'profile')} aria-current={v.navProfileOn} style={css(v.mTabProfile)}>
        <User color={v.mProfileColor} size={22} />
        <span className="mlabel" style={css(v.mProfileLabel)}>
          Profile
        </span>
      </a>
    </nav>
  );
}
