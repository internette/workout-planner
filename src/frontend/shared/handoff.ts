// What one page leaves in this tab for the planner to open on: the calendar's view and day, and a notice to show there.
// Kept in sessionStorage, so it's this tab's alone and gone when it closes.

/** The calendar's view and day, kept for a reload (see PlannerLogic). */
export const CALENDAR_KEY = 'moonshot.calendar';
/** A notice for the planner to show once when it next loads, and the screen it's for. */
export const NOTICE_KEY = 'moonshot.notice';

/** Opens one of the person's programs (its page), saying `notice` there. */
export function openProgram(id: string, notice: string) {
  try {
    window.sessionStorage.setItem(NOTICE_KEY, JSON.stringify({ text: notice, screen: 'program' }));
  } catch {
    // No storage: the page opens without the notice.
  }
  window.location.assign('/spellbook/programs/' + encodeURIComponent(id));
}
