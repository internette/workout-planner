// Each nav item has its own address. The planner stays mounted as you move between them, so the address follows the
// screen, and the screen follows the address when you use Back and Forward or open a link.

export const TAB_PATHS = {
  calendar: '/calendar',
  chronicle: '/chronicle',
  arsenal: '/spellbook',
  progress: '/progress',
  profile: '/profile',
} as const;

const CALENDAR = ['day', 'rest', 'edit', 'detail'];
const ARSENAL = ['arsenal', 'template', 'templateEdit', 'exercise', 'exerciseEdit'];

/**
 * The address a screen belongs to, or null for screens inside a flow (the entry form, the picker) that keep the
 * address of wherever they were opened from.
 */
export function pathForScreen(screen: string): string | null {
  if (CALENDAR.includes(screen)) return TAB_PATHS.calendar;
  if (screen === 'diaryList') return TAB_PATHS.chronicle;
  if (ARSENAL.includes(screen)) return TAB_PATHS.arsenal;
  if (screen === 'summary') return TAB_PATHS.progress;
  if (screen === 'profile') return TAB_PATHS.profile;
  return null;
}

/**
 * The address the planner's current state belongs to. The same as pathForScreen, except that creating a workout from the
 * Spellbook (the 'arsenal' screen) stays under /spellbook: it is the Spellbook's flow, not the calendar's.
 */
export function pathForState(state: { screen: string; creating?: boolean; newFrom?: string | null }): string | null {
  if (state.screen === 'edit' && state.creating && state.newFrom === 'arsenal') return TAB_PATHS.arsenal;
  return pathForScreen(state.screen);
}

/** The screen an address opens. The calendar opens on the Day view. */
export function screenForPath(path: string): string | null {
  switch (path) {
    case TAB_PATHS.calendar:
      return 'day';
    case TAB_PATHS.chronicle:
      return 'diaryList';
    case TAB_PATHS.arsenal:
      return 'arsenal';
    case TAB_PATHS.progress:
      return 'summary';
    case TAB_PATHS.profile:
      return 'profile';
    default:
      return null;
  }
}
