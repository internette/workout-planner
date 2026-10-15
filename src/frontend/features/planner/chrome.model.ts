import { EX_DRAFT_CLEARED, HOME_OF } from '@/frontend/shared/constants';
import { exerciseDraftDirty, idOf, isoOf, monDay, monthPatch, noticePatch, workoutDraftDirty } from '@/frontend/shared/helpers';
import { NAV_IDS, type NavId } from './navIds';
import * as db from '@/frontend/data/plannerData';
import type { Ctx } from './store/types';
import type { ConfirmState, Screen } from './store/state';
import { leaveRunningWorkout } from '../session/leave';
import { newSetup } from '../setup/model';
import { signInName } from '@/shared/auth';

// Shell: sidebar, tab bar, screen flags, navigation shortcuts, confirm dialog and error banner.
export function chromeVals(ctx: Ctx) {
  const {
    logic,
    narrow,
    tablet,
    st,
    calActive,
    inChronicle,
    Y,
    srcAct,
    mi,
    selDay,
    selDate,
    creating,
    TODAY_M,
    TODAY_D,
    timerRunning,
    nameOf,
  } = ctx;
  const arsenalActive =
    ['arsenal', 'template', 'exercise', 'exerciseEdit'].includes(st.screen) ||
    (st.screen === 'edit' && ((!!st.creating && st.newFrom === 'arsenal') || !!st.editTemplate));
  const goDay = () => logic.s({ screen: 'day', ...monthPatch(TODAY_M), day: TODAY_D, monthOpen: false, seg: 'Day', creating: false });
  const goDiaryList = () => logic.nav({ screen: 'diaryList', monthOpen: false });
  const goArsenal = () => logic.nav({ screen: 'arsenal', monthOpen: false, arsenalPick: null });
  const goSummary = () => logic.nav({ screen: 'summary', monthOpen: false });
  const goProfile = () => logic.nav({ screen: 'profile', monthOpen: false });
  const goSettings = () => logic.nav({ screen: 'settings', monthOpen: false });
  // The five places, in the sidebar's and the tab bar's order: whether each is where the person is, and how to go.
  const navOn: Record<NavId, boolean> = {
    day: calActive,
    diaryList: inChronicle,
    arsenal: arsenalActive,
    summary: st.screen === 'summary',
    // Settings is Profile's page: Profile stays lit while it's open.
    profile: st.screen === 'profile' || st.screen === 'settings' || st.screen === 'programRuns' || st.screen === 'programRun',
  };
  const navGoTo: Record<NavId, () => void> = { day: goDay, diaryList: goDiaryList, arsenal: goArsenal, summary: goSummary, profile: goProfile };
  return {
    goDiaryList,
    goArsenal,
    goSummary,
    goSettings,
    nav: NAV_IDS.map((id) => ({
      id,
      current: navOn[id] ? ('page' as const) : false,
      go: navGoTo[id],
      on: navOn[id],
    })),
    // The sidebar on wide screens (a row of places on a tablet), the tab bar on a phone.
    layout: narrow ? ('narrow' as const) : tablet ? ('tablet' as const) : ('wide' as const),
    isDiaryList: st.screen === 'diaryList',
    isProfile: st.screen === 'profile',
    isSettings: st.screen === 'settings',
    isSummary: st.screen === 'summary',
    isSaved: st.screen === 'saved',
    isNewEntry: st.screen === 'newEntry',
    announce: st.announce || '',
    // The confirmation for this screen, if there is one.
    notice: st.notice && st.notice.screen === st.screen ? st.notice.text : '',
    dismissNotice: () => logic.s({ notice: null }),
    saveError: st.saveError || '',
    dismissError: () => logic.s({ saveError: null }),
    // A nav item is a link, so it can open in a new tab. A plain click goes there without a page load. `dest` is
    // which nav item this is ('day', 'arsenal', ...); if there's a workout draft in the way, the click is held and
    // asks first, the same "Keep your changes?" the screen's own Back arrow already uses — the tab is going nowhere.
    navGo: (go, dest) => (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      if (st.screen === 'edit' && workoutDraftDirty(st)) return logic.s({ leaveOpen: true, pendingNav: dest });
      // An exercise or Chronicle entry being changed asks the same way before the tab takes it away.
      const exDirty = exerciseDraftDirty(st);
      const entryVals = logic.renderVals();
      if (exDirty || entryVals.entryDirty)
        return logic.s({
          confirm: {
            kind: 'leaveDraft',
            title: 'Discard your changes?',
            body: exDirty
              ? 'You’ve edited this exercise. Leaving now throws those changes away.'
              : entryVals.entryLeaveBody,
            label: 'Discard changes',
            then: () => {
              logic.s({ ...EX_DRAFT_CLEARED, diaryEdit: false, entryNote: null });
              go();
            },
          },
        });
      // A workout still being built, waiting underneath: opened the Spellbook from it, or an exercise's details from
      // its Add exercise list. If it has anything in it, go back to it and ask there, the same "Keep your
      // changes?"; otherwise just let it go. Either way picking ends and the person's own Spellbook filter returns.
      const draftBelow = st.screen !== 'edit' && (st.hist || []).some((h) => h.screen === 'edit');
      if (draftBelow || st.arsenalPick) {
        const endPick = st.arsenalPick ? { arsenalPick: null, arsenalAreas: st.arsenalPick.prevAreas || [] } : {};
        if (workoutDraftDirty(st))
          return logic.backTo('edit', { ...endPick, leaveOpen: true, pendingNav: dest });
        logic.s({ ...endPick, creating: false });
      }
      // Leaving the workout detail screen while its stopwatch is running asks first, same as its own Back arrow.
      if (st.screen === 'detail' && timerRunning) return leaveRunningWorkout(ctx, go);
      go();
    },
    // Signing out asks first. Once confirmed the page is on its way to the server, so the dialog stays up, inert,
    // rather than letting the person press it twice or close it half way.
    // The app's tour: from Settings, straight to its first stop, on the calendar's Day view for today where its first
    // stops are.
    tourStep: st.tour ?? null,
    setTourStep: (n: number) => logic.s({ tour: n }),
    startTour: () => {
      goDay();
      logic.s({ tour: 1 });
    },
    // "Customize your experience", from the tour's welcome or Settings, starting from what they said last time.
    startSetup: () => logic.s({ tour: null, setup: newSetup(logic.model.profile, signInName(logic.auth.account)) }),
    canSignOut: !!logic.auth.account,
    accountEmail: logic.auth.account?.email ?? '',
    accountProvider: logic.auth.account?.provider ?? '',
    signOutOpen: !!st.signOutOpen,
    signingOut: !!st.signingOut,
    openSignOut: () => logic.s({ signOutOpen: true }),
    closeSignOut: () => {
      if (!st.signingOut) logic.s({ signOutOpen: false });
    },
    confirmSignOut: () => {
      if (st.signingOut) return;
      logic.s({ signingOut: true });
      logic.auth.signOut();
    },
    // The browser dismisses a popover on its own (Escape, outside press) and may report it after another one has
    // opened, so each closes only itself.
    closeMonth: () => logic.s({ monthOpen: false, pickYOff: null }),
    closeIcons: () => logic.s({ iconsOpen: false }),
    closeXp: () => logic.s({ xpInfo: false }),
    closeDate: () => logic.s({ dateOpen: false }),
    confirmOpen: !!st.confirm,
    confirmTitle: st.confirm?.title,
    confirmBody: st.confirm?.body,
    confirmLabel: st.confirm?.label,
    confirmCancelLabel: st.confirm?.cancelLabel || 'Keep it',
    confirmSafe: !!st.confirm?.safe,
    confirmOption: st.confirm?.option
      ? {
          label: st.confirm.option.label,
          on: st.confirm.option.on,
          set: (on: boolean) => logic.s({ confirm: { ...st.confirm, option: { ...st.confirm.option, on } } }),
        }
      : null,
    confirmCancel: () => logic.s({ confirm: null }),
    confirmRun: () => {
      const c: Partial<ConfirmState> = st.confirm || {};
      logic.s({ confirm: null });
      // A confirm can carry its own action (leaving a Chronicle entry being edited, say).
      if (typeof c.then === 'function') return c.then();
      if (c.kind === 'workout') {
        // Its timer goes with it.
        const id = idOf(srcAct);
        const timers = Object.assign({}, st.workoutTimer);
        delete timers[id];
        // Back to the day it was on, past the session's own pages (and their history entries), which are gone now.
        // The notice waits for the delete to land: if it fails, the reload brings the session back with the error.
        const gone = noticePatch('“' + nameOf(srcAct.name) + '” removed from ' + monDay(selDate) + '.', 'day');
        logic.s({ workoutTimer: timers, creating: false });
        if ((st.hist || []).some((h) => h.screen === 'day')) logic.backTo('day', { screen: 'day', entryId: null });
        else logic.s({ screen: 'day', seg: 'Day', entryId: null, hist: [] });
        logic.save(() => db.deletePlanEntries([id]), gone);
      }
      if (c.kind === 'unfinish') {
        logic.s({ rideDone: Object.assign({}, st.rideDone, { [c.id]: false }) });
        logic.save(() => db.reopenSession(c.id), noticePatch('Marked not done.', 'detail'));
      }
      if (c.kind === 'entry') {
        // Deleted while reading it: back to the Chronicle's list, past the entry (and the picker it came from).
        if (c.after === 'diaryList') {
          if ((st.hist || []).some((h) => h.screen === 'diaryList')) logic.backTo('diaryList', { screen: 'diaryList' });
          else logic.s({ screen: 'diaryList', hist: [] });
          logic.save(() => db.deleteDiary(c.day), noticePatch('Entry deleted.', 'diaryList'));
        } else logic.save(() => db.deleteDiary(c.day), noticePatch('Entry deleted.', st.screen));
      }
      if (c.kind === 'series')
        logic.save(() => db.endSeries(c.sid, isoOf(new Date(Y, mi, selDay)), ctx.isoToday, c.days || []), {
          ...noticePatch('Weekly series ended. Its repeats still ahead are off the calendar.', 'detail'),
        });
      // Deleting from the Spellbook goes back to the list it was opened from, which then no longer shows it. The
      // notice waits for the delete to land: if it fails, the reload puts the item back with the error.
      const toList = (arsenalView) => {
        const h = st.hist || [];
        if (h.length && h[h.length - 1].screen === 'arsenal') logic.back();
        else logic.s({ screen: 'arsenal' });
        logic.s({ arsenalView });
      };
      if (c.kind === 'archiveWorkout') {
        const keep = !!c.option && !c.option.on;
        toList('workouts');
        // Kept, its upcoming sessions stay on the calendar: the notice says so.
        const text = keep
          ? '“' + c.name + '” deleted. ' + (c.ahead === 1 ? 'Its upcoming session stays' : 'Its upcoming sessions stay') + ' on your calendar.'
          : '“' + c.name + '” deleted.';
        logic.saveOnce('archive', () => db.archiveWorkout(c.id, isoOf(new Date()), !keep), noticePatch(text, 'arsenal'));
      }
      // Browser Back from the exercise editor with changes: confirmed, so go back without them.
      if (c.kind === 'leaveExercise') {
        logic.s(EX_DRAFT_CLEARED);
        logic.back();
      }
      if (c.kind === 'deleteExercise') {
        toList('exercises');
        logic.saveOnce('archive', () => db.deleteLibraryExercise(c.id), noticePatch('“' + c.name + '” deleted.', 'arsenal'));
      }
    },
    isArsenal: st.screen === 'arsenal',
    isTemplate: st.screen === 'template',
    isExercise: st.screen === 'exercise',
    isExerciseEdit: st.screen === 'exerciseEdit',
    goBack: () => logic.back(),
    // Back is named for where it goes: the screen before this one ("Calendar", "Spellbook", a workout's name), or
    // the calendar when there's nothing before it (a page opened from a link).
    backLabel: (() => {
      const prev = (st.hist || [])[(st.hist || []).length - 1];
      if (!prev)
        return HOME_OF[st.screen] === 'arsenal'
          ? 'Spellbook'
          : HOME_OF[st.screen] === 'diaryList'
            ? 'Chronicle'
            : HOME_OF[st.screen] === 'profile'
              ? 'Profile'
              : 'Calendar';
      const w =
        st.templateId &&
        (logic.model.workouts.find((x) => x.id === st.templateId) ||
          (logic.model.builtinWorkouts || []).find((x) => x.id === st.templateId));
      // A program, the person's own or built-in.
      const prog =
        st.programId &&
        ((logic.model.programs || []).find((x) => x.id === st.programId) ||
          (logic.model.builtinPrograms || []).find((x) => 'builtin:' + x.id === st.programId));
      // One of the person's own exercises, a built-in, or one inside a saved workout.
      const ex =
        st.exerciseId &&
        (logic.model.library.concat(logic.model.builtins).find((x) => x.id === st.exerciseId) ||
          Object.values(logic.model.EXV).flat().find((x) => x.id === st.exerciseId));
      const names: Partial<Record<Screen, string>> = {
        day: 'Calendar',
        rest: 'Calendar',
        detail: srcAct ? nameOf(srcAct.name) : 'Session',
        arsenal: 'Spellbook',
        template: w ? w.name : 'Workout',
        exercise: ex ? ex.name : 'Exercise',
        exerciseEdit: ex ? ex.name : 'Exercise',
        program: prog ? prog.name : 'Program',
        programEdit: prog ? prog.name : 'Program',
        programScan: 'What it found',
        edit: 'Editor',
        diary: 'Entry',
        diaryList: 'Chronicle',
        newEntry: 'New entry',
        summary: 'Progress',
        profile: 'Profile',
        settings: 'Settings',
        programRuns: 'Your programs',
        programRun: 'Program',
      };
      return names[prev.screen] || 'Back';
    })(),
    isCal: st.screen === 'day' || st.screen === 'rest',
    isEdit: st.screen === 'edit' && !(creating && !st.newType) && !st.retype,
    isDiary: st.screen === 'diary',
    isDetail: st.screen === 'detail',
  };
}
