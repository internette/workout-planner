import type { Exercise } from '@/frontend/data/plannerData';
import type { Mood } from '@moonshot/design-system/icons';

// The planner's UI state: which screen is open, what's selected, and every form and panel's contents until they are
// saved. PlannerLogic holds it; the models read it as `st`. Maps keyed by "list key" belong to the workout being edited
// (a session's id, "tpl:<id>" for a saved workout, "__draft" for a new one), and "<list key>|<exercise name>" to one
// exercise in it.

export type Screen =
  | 'day'
  | 'rest'
  | 'edit'
  | 'detail'
  | 'diary'
  | 'diaryList'
  | 'newEntry'
  | 'saved'
  | 'summary'
  | 'profile'
  | 'settings'
  | 'arsenal'
  | 'template'
  | 'exercise'
  | 'exerciseEdit';

export type CalendarView = 'Day' | 'Week' | 'Month';

/** A screen as Back returns to it. */
export type HistoryEntry = Partial<PlannerState>;

/** An exercise being edited on its own page: sets and reps in two boxes, the rest as shown. */
export interface ExerciseDraft {
  name: string;
  sets: string;
  reps: string;
  weight: string;
  band?: string;
  rest: string;
  i: string;
  areas: string[];
  equipment?: string[];
}

/** A question the planner asks before doing something (delete, end a series, discard changes...). */
export interface ConfirmState {
  kind: string;
  title: string;
  body: string;
  label: string;
  cancelLabel?: string;
  /** The answer that keeps things as they are is the main button (leaving without saving is not a loss). */
  safe?: boolean;
  /** A switch in the dialog for part of what yes does, such as also removing a workout's upcoming sessions. */
  option?: { label: string; on: boolean };
  /** Its own action, run on yes, for a question that isn't one of the kinds the planner knows. */
  then?: () => void;
  // What the question is about, by kind.
  id?: string;
  day?: string;
  sid?: string;
  days?: number[]; // a weekly series' weekdays, for ending it
  name?: string;
  after?: Screen;
  /** How many sessions are still ahead (deleting a saved workout). */
  ahead?: number;
}

/** The Finish dialog: what a session actually took, as typed. */
export interface FinishState {
  wasRunning: boolean;
  correcting: boolean;
  ride: boolean;
  hrs: string;
  mins: string;
  dist: string;
  elev: string;
  /** Opened from the running clock (its time filled in), rather than to correct a time already logged. */
  fromTimer?: boolean;
}

/** How to save an edit to a saved workout or exercise: update it (and maybe its upcoming sessions), or save it as
 * new. A caller can bring its own `body` and `options` (the calendar does, for an edit to one session). */
export interface TemplateConfirm {
  /** Upcoming sessions the update could also change. */
  count: number;
  /** The workout's name (for an exercise, the workout it's in, if any). */
  name: string;
  /** How many sessions the workout has on the calendar. */
  sessions?: number;
  choice: 'update' | 'new';
  upcoming: boolean;
  /** The name for "Save as a new workout", while it's being typed. */
  copyName?: string;
  /** Editing an exercise: its name. */
  exercise?: string;
  /** Editing an exercise saved on its own: how many workouts hold their own copy of it. */
  copies?: number;
  body?: string;
  options?: { value: 'update' | 'new'; title: string; description: string }[];
  apply: (choice: 'update' | 'new', upcoming: boolean, copyName?: string) => void;
}

/** A rest counting down between sets: for which session, after which exercise, and when it ends. */
export interface RestState {
  id: string;
  after: string;
  endsAt: number;
  total: number;
}

export interface PlannerState {
  // Where the planner is
  screen: Screen;
  hist?: HistoryEntry[];
  seg: CalendarView;
  month: string;
  yOff: number;
  day: number;
  monthOpen: boolean;
  pickYOff?: number | null;
  entryId?: string | null;
  templateId?: string | null;
  exerciseId?: string | null;

  // The workout editor
  creating?: boolean;
  editing?: boolean;
  editId?: string | null;
  editKey?: string | null;
  editTemplate?: string | null;
  newType?: 'lift' | 'cycle' | null;
  newName?: string;
  newFrom?: 'calendar' | 'arsenal' | null;
  schedule?: boolean | null;
  repeat: boolean;
  // The weekdays (0 = Sunday) it goes on from its day, when others than that day's own were picked.
  repeatDays?: number[] | null;
  // How many weeks it repeats for, when not the default.
  repeatWeeks?: number | null;
  logDone?: boolean | null;
  extra?: Record<string, Exercise[]> | null;
  removed?: Record<string, string[]> | null;
  renames?: Record<string, string> | null;
  fields?: Record<string, Record<string, string>> | null;
  icons?: Record<string, string> | null;
  iconColors?: Record<string, string | null> | null;
  exIcons?: Record<string, string> | null;
  notes?: Record<string, string> | null;
  workoutKinds?: Record<string, 'main' | 'stretch' | 'yoga'> | null;
  warmups?: Record<string, boolean> | null;
  // Back on "What kind of workout?" from the editor, to change its type.
  retype?: boolean | null;
  // The session page's Weekly series panel is open.
  seriesOpen?: boolean | null;
  exOrder?: Record<string, string[]> | null;
  // Saved exercises given a new name in the editor, by workout: a first one labeled Left when its other side is added.
  exRenames?: Record<string, Record<string, string>> | null;
  exExpanded?: Record<string, boolean>;
  exOpen?: string | null;
  editDone?: string[] | null;
  rDist?: string | null;
  rElev?: string | null;
  rHrs?: string | null;
  rMins?: string | null;
  rZone?: string | null;
  aDist?: string | null;
  aElev?: string | null;
  aHrs?: string | null;
  aMins?: string | null;
  pendingNav?: string | null;
  leaveOpen?: boolean;
  iconsOpen?: boolean;
  dateOpen?: boolean;
  pickM?: number | null;
  pickFocus?: number | null;
  // Adding exercises to it
  addOpen?: boolean;
  addMode?: 'lib' | 'new';
  pickQ?: string;
  pickAll?: boolean;
  pickAreas?: string[] | null;
  // The new-exercise form (shared with the Spellbook's; see shared/exerciseDraft.ts)
  dName?: string;
  dSets?: string;
  dReps?: string;
  dWeight?: string;
  dBand?: string;
  dRest?: string;
  dIcon?: string;
  dAreas?: string[];
  dEquip?: string[];
  dEquipOpen?: boolean;

  // Sessions
  done: Record<string, string[]>;
  rideDone: Record<string, boolean>;
  workoutTimer?: Record<string, { elapsed: number; runningSince: number | null }>;
  /** Sets done so far, per session and exercise (by name). Kept in this browser, like the clock. */
  setsDone?: Record<string, Record<string, number>>;
  /** The rest between sets, counting down. */
  rest?: RestState | null;
  finish?: FinishState | null;
  pausePrompt?: { proceed: () => void } | null;
  restartPrompt?: boolean;
  moreIds?: Record<string, boolean>;
  // The Day view's open card, when one was tapped open: the day (month * 100 + day) and its session.
  dayOpen?: { day: number; id: string } | null;

  // The Chronicle
  mood: Mood | null;
  rpe: number | null;
  entryNote?: string | null;
  entryMarkDone?: boolean;
  diaryFrom?: 'day' | 'list';
  diaryEdit?: boolean;
  diaryScope?: 'all' | 'week' | 'month' | 'range';
  rFrom?: string;
  rTo?: string;

  // The Spellbook
  arsenalQ?: string;
  arsenalView?: 'workouts' | 'exercises';
  arsenalKind?: string;
  arsenalAreas?: string[];
  arsenalEquip?: string[];
  // The Filter sheet: kind, target areas and equipment.
  arsenalFilterOpen?: boolean;
  equipGroupsOpen?: Record<string, boolean>;
  arsenalAdd?: boolean;
  arsenalPick?: { key: string; names: string[]; title: string; prevAreas: string[] } | null;
  addTo?: Exercise | null;
  exDraft?: ExerciseDraft | null;
  exDraftOrig?: ExerciseDraft | null;
  exEditNav?: boolean;
  exCopy?: boolean;
  exEquipOpen?: boolean;
  tplSchedule?: { date: string; repeat: boolean; logDone?: boolean; days?: number[] | null; weeks?: number | null } | null;
  tplScheduled?: { templateId: string; text: string; month: string; yOff: number; day: number; entryId: string | null } | null;
  tplConfirm?: TemplateConfirm | null;

  // Progress and profile
  barSel?: number | null;
  ranksOpen?: boolean;
  xpInfo?: boolean;
  signOutOpen?: boolean;
  signingOut?: boolean;

  // Messages
  notice?: { text: string; screen: Screen } | null;
  announce?: string;
  saveError?: string | null;
  confirm?: ConfirmState | null;
}
