// What one page leaves in this tab for the planner to open on: the calendar's view and day, and a notice to show there.
// Kept in sessionStorage, so it's this tab's alone and gone when it closes.

import { MONTHS } from './constants';

/** The calendar's view and day, kept for a reload (see PlannerLogic). */
export const CALENDAR_KEY = 'moonshot.calendar';
/** A notice for the planner to show once when it next loads, and the screen it's for. */
export const NOTICE_KEY = 'moonshot.notice';

/** Opens the planner: on the calendar's Week view of `day`, or on the Spellbook without one, saying `notice` there. */
export function openPlanner(day: Date | null, notice: string) {
  try {
    if (day)
      window.sessionStorage.setItem(
        CALENDAR_KEY,
        JSON.stringify({ seg: 'Week', month: MONTHS[day.getMonth()], yOff: day.getFullYear() - new Date().getFullYear(), day: day.getDate(), at: Date.now() }),
      );
    window.sessionStorage.setItem(NOTICE_KEY, JSON.stringify({ text: notice, screen: day ? 'day' : 'arsenal' }));
  } catch {
    // No storage: the planner opens as it would, without the notice.
  }
  window.location.assign(day ? '/calendar' : '/spellbook');
}
