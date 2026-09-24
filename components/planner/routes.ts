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
const ARSENAL = ['arsenal', 'template', 'exercise', 'exerciseEdit'];

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

type RouteState = {
  screen: string;
  creating?: boolean;
  newFrom?: string | null;
  templateId?: string | null;
  exerciseId?: string | null;
  editTemplate?: string | null;
};

// The Spellbook's own pages: a saved workout, and an exercise. Back and Forward step through them, and a reload or a
// link opens the same one.
const workoutPath = (id: string) => TAB_PATHS.arsenal + '/workouts/' + encodeURIComponent(id);
const exercisePath = (id: string) => TAB_PATHS.arsenal + '/exercises/' + encodeURIComponent(id);

/**
 * The address the planner's current state belongs to. The same as pathForScreen, except that the Spellbook's own
 * flows stay under /spellbook: a saved workout or exercise has its own address (editing one keeps it), and creating a
 * workout from the Spellbook stays at /spellbook, since it is the Spellbook's flow, not the calendar's.
 */
export function pathForState(state: RouteState): string | null {
  if (state.screen === 'edit' && state.editTemplate) return workoutPath(state.editTemplate);
  if (state.screen === 'edit' && state.creating && state.newFrom === 'arsenal') return TAB_PATHS.arsenal;
  if (state.screen === 'template' && state.templateId) return workoutPath(state.templateId);
  if ((state.screen === 'exercise' || state.screen === 'exerciseEdit') && state.exerciseId)
    return exercisePath(state.exerciseId);
  return pathForScreen(state.screen);
}

/** What an address opens: its screen, and for a Spellbook page, which workout or exercise. */
export function stateForPath(path: string): Record<string, string> | null {
  const m = /^\/spellbook\/(workouts|exercises)\/([^/]+)\/?$/.exec(path);
  if (m) {
    const id = decodeURIComponent(m[2]);
    return m[1] === 'workouts' ? { screen: 'template', templateId: id } : { screen: 'exercise', exerciseId: id };
  }
  const screen = screenForPath(path);
  return screen ? { screen } : null;
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
