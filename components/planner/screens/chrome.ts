import { idOf, isoOf, monthPatch, workoutDraftDirty } from '../helpers';
import { mLabel, mTab, tab } from '../styles';
import * as db from '@/lib/plannerData';
import type { Ctx } from '../types';

// Shell: sidebar, tab bar, screen flags, navigation shortcuts, confirm dialog and error banner.
export function chromeVals(ctx: Ctx) {
  const {
    logic,
    narrow,
    tablet,
    onCal,
    st,
    navExtra,
    calActive,
    Y,
    srcAct,
    mi,
    selDay,
    creating,
    TODAY_M,
    TODAY_D,
    timerRunning,
  } = ctx;
  const arsenalActive =
    ['arsenal', 'template', 'templateEdit', 'exercise', 'exerciseEdit'].includes(st.screen) ||
    (st.screen === 'edit' && !!st.creating && st.newFrom === 'arsenal');
  return {
    topTabsStyle: narrow ? 'display:none' : 'display:flex;flex-wrap:wrap;gap:6px;padding:18px 28px 0',
    sidebarStyle: narrow
      ? 'display:none'
      : tablet
        ? 'flex:1 1 100%;width:100%;position:relative;background:var(--color-white);border-radius:18px;padding:8px;box-shadow:0 4px 14px rgba(35,42,69,.07)'
        : 'flex:0 1 208px;min-width:180px;position:relative;background:var(--color-white);border-radius:22px;padding:18px 14px;box-shadow:0 4px 14px rgba(35,42,69,.07)',
    navListStyle: tablet
      ? 'display:flex;flex-direction:row;gap:4px'
      : 'display:flex;flex-direction:column;gap:4px',
    pageStyle: 'min-height:100vh;padding:0 0 ' + (narrow ? '108px' : '64px'),
    tabbarStyle: narrow
      ? 'position:fixed;left:0;right:0;bottom:0;z-index:50;display:flex;align-items:center;gap:2px;padding:8px 6px calc(8px + env(safe-area-inset-bottom));background:rgba(255,255,255,.94);backdrop-filter:blur(14px);border-top:1px solid rgba(35,42,69,.07);box-shadow:0 -4px 14px rgba(35,42,69,.07)'
      : 'display:none',
    mTabCal: mTab(onCal),
    mTabDiary: mTab(st.screen === 'diaryList'),
    mTabSummary: mTab(st.screen === 'summary'),
    mTabArsenal: mTab(arsenalActive),
    mArsenalColor: arsenalActive ? 'var(--color-pink-deep)' : 'var(--color-muted)',
    mArsenalLabel: mLabel(arsenalActive),
    mCalColor: onCal ? 'var(--color-pink-deep)' : 'var(--color-muted)',
    mDiaryColor: st.screen === 'diaryList' ? 'var(--color-pink-deep)' : 'var(--color-muted)',
    mSummaryColor: st.screen === 'summary' ? 'var(--color-pink-deep)' : 'var(--color-muted)',
    mTabProfile: mTab(st.screen === 'profile'),
    mProfileColor: st.screen === 'profile' ? 'var(--color-pink-deep)' : 'var(--color-muted)',
    mProfileLabel: mLabel(st.screen === 'profile'),
    mCalLabel: mLabel(onCal),
    mDiaryLabel: mLabel(st.screen === 'diaryList'),
    mSummaryLabel: mLabel(st.screen === 'summary'),
    isDiaryList: st.screen === 'diaryList',
    isProfile: st.screen === 'profile',
    goProfile: () => logic.nav({ screen: 'profile', monthOpen: false }),
    tabProfile: tab(st.screen === 'profile'),
    navProfile:
      'display:flex;align-items:center;gap:11px;padding:11px 13px;border:none;border-radius:14px;font-size:var(--text-base);text-align:left;cursor:pointer;' +
      (st.screen === 'profile'
        ? 'background:var(--color-pink-tint);color:var(--color-pink-deep);font-weight:var(--font-weight-semibold)'
        : 'background:none;color:var(--color-muted);font-weight:var(--font-weight-medium)') +
      navExtra,
    navProfileInk: st.screen === 'profile' ? 'var(--color-pink)' : 'var(--color-subtle)',
    isSummary: st.screen === 'summary',
    isSaved: st.screen === 'saved',
    goSummary: () => logic.nav({ screen: 'summary', monthOpen: false }),
    tabSummary: tab(st.screen === 'summary'),
    goDiaryList: () => logic.nav({ screen: 'diaryList', monthOpen: false }),
    isNewEntry: st.screen === 'newEntry',
    navCal:
      'display:flex;align-items:center;gap:11px;padding:11px 13px;border:none;border-radius:14px;font-size:var(--text-base);text-align:left;cursor:pointer;' +
      (calActive
        ? 'background:var(--color-pink-tint);color:var(--color-pink-deep);font-weight:var(--font-weight-semibold)'
        : 'background:none;color:var(--color-muted);font-weight:var(--font-weight-medium)') +
      navExtra,
    navDiary:
      'display:flex;align-items:center;gap:11px;padding:11px 13px;border:none;border-radius:14px;font-size:var(--text-base);text-align:left;cursor:pointer;' +
      (st.screen === 'diaryList'
        ? 'background:var(--color-pink-tint);color:var(--color-pink-deep);font-weight:var(--font-weight-semibold)'
        : 'background:none;color:var(--color-muted);font-weight:var(--font-weight-medium)') +
      navExtra,
    navCalInk: calActive ? 'var(--color-pink)' : 'var(--color-subtle)',
    navDiaryInk: st.screen === 'diaryList' ? 'var(--color-pink)' : 'var(--color-subtle)',
    navSummary:
      'display:flex;align-items:center;gap:11px;padding:11px 13px;border:none;border-radius:14px;font-size:var(--text-base);text-align:left;cursor:pointer;' +
      (st.screen === 'summary'
        ? 'background:var(--color-pink-tint);color:var(--color-pink-deep);font-weight:var(--font-weight-semibold)'
        : 'background:none;color:var(--color-muted);font-weight:var(--font-weight-medium)') +
      navExtra,
    navSummaryInk: st.screen === 'summary' ? 'var(--color-pink)' : 'var(--color-subtle)',
    announce: st.announce || '',
    saveError: st.saveError || '',
    dismissError: () => logic.s({ saveError: null }),
    // A nav item is a link, so it can open in a new tab. A plain click goes there without a page load. `dest` is
    // which nav item this is ('day', 'arsenal', ...); if there's a workout draft in the way, the click is held and
    // asks first, the same "Keep your changes?" the screen's own Back arrow already uses — the tab is going nowhere.
    navGo: (go, dest) => (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      if (st.screen === 'edit' && workoutDraftDirty(st)) return logic.s({ leaveOpen: true, pendingNav: dest });
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
      if (st.screen === 'detail' && timerRunning) return logic.s({ pausePrompt: { proceed: go } });
      go();
    },
    // Signing out asks first. Once confirmed the page is on its way to the server, so the dialog stays up, inert,
    // rather than letting the person press it twice or close it half way.
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
    closeMonth: () => logic.s({ monthOpen: false }),
    closeIcons: () => logic.s({ iconsOpen: false }),
    closeXp: () => logic.s({ xpInfo: false }),
    closeDate: () => logic.s({ dateOpen: false }),
    confirmOpen: !!st.confirm,
    confirmTitle: (st.confirm || {}).title,
    confirmBody: (st.confirm || {}).body,
    confirmLabel: (st.confirm || {}).label,
    confirmCancel: () => logic.s({ confirm: null }),
    confirmRun: () => {
      const c = st.confirm || {};
      logic.s({ confirm: null });
      if (c.kind === 'workout')
        logic.save(() => db.deletePlanEntries([idOf(srcAct)]), { screen: 'day', creating: false });
      if (c.kind === 'entry') logic.save(() => db.deleteDiary(c.day), { screen: c.after || st.screen });
      if (c.kind === 'series') logic.save(() => db.endSeries(c.sid, isoOf(new Date(Y, mi, selDay))));
      // Deleting from the Spellbook goes back to the list it was opened from, which then no longer shows it.
      const toList = (arsenalView) => {
        const h = st.hist || [];
        if (h.length && h[h.length - 1].screen === 'arsenal') logic.back();
        else logic.s({ screen: 'arsenal' });
        logic.s({ arsenalView });
      };
      if (c.kind === 'archiveWorkout') {
        toList('workouts');
        logic.saveOnce('archive', () => db.archiveWorkout(c.id, isoOf(new Date())));
      }
      if (c.kind === 'deleteExercise') {
        toList('exercises');
        logic.saveOnce('archive', () => db.deleteLibraryExercise(c.id));
      }
    },
    isArsenal: st.screen === 'arsenal',
    isTemplate: st.screen === 'template',
    isExercise: st.screen === 'exercise',
    isTemplateEdit: st.screen === 'templateEdit',
    isExerciseEdit: st.screen === 'exerciseEdit',
    canGoBack: (st.hist || []).length > 0,
    goBack: () => logic.back(),
    goArsenal: () => logic.nav({ screen: 'arsenal', monthOpen: false, arsenalPick: null }),
    navArsenal:
      'display:flex;align-items:center;gap:11px;padding:11px 13px;border:none;border-radius:14px;font-size:var(--text-base);text-align:left;cursor:pointer;' +
      (arsenalActive
        ? 'background:var(--color-pink-tint);color:var(--color-pink-deep);font-weight:var(--font-weight-semibold)'
        : 'background:none;color:var(--color-muted);font-weight:var(--font-weight-medium)') +
      navExtra,
    navArsenalInk: arsenalActive ? 'var(--color-pink)' : 'var(--color-subtle)',
    isCal: st.screen === 'day' || st.screen === 'rest',
    isEdit: st.screen === 'edit' && !(creating && !st.newType),
    isDiary: st.screen === 'diary',
    goDay: () =>
      logic.s({
        screen: 'day',
        ...monthPatch(TODAY_M),
        day: TODAY_D,
        monthOpen: false,
        seg: 'Day',
        creating: false,
      }),
    isDetail: st.screen === 'detail',
    goRest: () =>
      logic.s({ screen: 'rest', ...monthPatch(TODAY_M), day: TODAY_D, monthOpen: false, seg: 'Day' }),
    tabDay: tab(st.screen === 'day'),
    tabEdit: tab(st.screen === 'edit'),
    tabDiary: tab(st.screen === 'diary'),
    tabRest: tab(st.screen === 'rest'),
    navCalOn: calActive ? 'page' : false,
    navDiaryOn: st.screen === 'diaryList' ? 'page' : false,
    navArsenalOn: arsenalActive ? 'page' : false,
    navSummaryOn: st.screen === 'summary' ? 'page' : false,
    navProfileOn: st.screen === 'profile' ? 'page' : false,
  };
}
