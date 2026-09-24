'use client';

import React, { useEffect, useReducer, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { PlannerLogic } from './planner/PlannerLogic';
import { useViewport } from './planner/useViewport';
import { pathForState, stateForPath } from './planner/routes';
import { exerciseDraftDirty, workoutDraftDirty } from './planner/helpers';
import { logoutUrl, type Account } from '@/lib/auth';
import { useWindowEvent } from './ui/useWindowEvent';
import { PlannerView } from './PlannerView';
import { StatusScreen } from './planner/StatusScreen';
import { InstallPrompt } from './planner/InstallPrompt';
import { useInstallPrompt } from './planner/useInstallPrompt';
import { RankUp } from './planner/RankUp';

// How long the plan may take before the loading screen says so.
const SLOW_AFTER_MS = 8000;

export default function Planner({ account = null }: { account?: Account | null }) {
  const pathname = usePathname();
  const [logic] = useState(() => {
    const l = new PlannerLogic();
    // Open on the screen the address names, such as /spellbook or /spellbook/workouts/<id>. The calendar address
    // opens on today's Day view.
    const opens = stateForPath(pathname);
    if (opens) l.state = { ...l.state, ...opens };
    return l;
  });
  const [, rerender] = useReducer((n: number) => n + 1, 0);
  logic.viewport = useViewport();
  // Signing out is a trip to the server's logout route, which ends the session and returns to the front door.
  logic.auth = { account, signOut: () => window.location.assign(logoutUrl()) };

  // Back from the logout trip can restore this page as it was left, mid sign-out. Put the dialog away.
  useWindowEvent('pageshow', (e) => {
    if (e.persisted) logic.setState({ signOutOpen: false, signingOut: false });
  });

  // Workout timers are kept in this browser, per account, so a reload (or the phone dropping the page) picks up where
  // the clock was. A running one is stored by when it started, so it has kept counting in the meantime.
  const timersKey = 'moonshot.timers.' + (account?.email || 'local');

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(timersKey) || 'null');
      if (saved && typeof saved === 'object') logic.setState({ workoutTimer: saved });
    } catch {
      // Unreadable or unavailable storage: start without saved timers.
    }
  }, [logic, timersKey]);

  // The logic object owns the state; it asks this component to re-render whenever that changes.
  useEffect(() => {
    logic.__host = { forceUpdate: rerender };
    logic.load();
    return () => {
      logic.__host = undefined;
    };
  }, [logic]);

  // Browser history follows the planner's own. Every screen opened with logic.nav() — a session, an editor, a Spellbook
  // page, the Chronicle's entry form — is a browser history entry, stamped with how deep it is (the length of the
  // planner's history). Browser Back and Forward then step through the same screens as the app's Back arrow, and an
  // editor with unsaved changes asks first, the same "Keep your changes?", instead of losing them.
  // A browser move the planner asked for itself (history.go) is in flight until this time. Browsers don't always
  // report one with a popstate (not one started from inside another popstate), so it's a short time, not an event.
  const movingUntil = useRef(0);
  const go = (n: number) => {
    movingUntil.current = Date.now() + 400;
    window.history.go(n);
    window.setTimeout(() => {
      movingUntil.current = 0;
      logic.forceUpdate();
    }, 420);
  };
  const stampOf = () => (window.history.state && window.history.state.moonshot) || 0;
  const depthOf = () => (logic.state.hist || []).length;
  // The address the planner last put in the bar. Anything else there is the browser's doing (Back, Forward), which the
  // popstate handler deals with; until it has, the screen isn't pushed back over it.
  const lastPath = useRef('');
  const stamp = () => {
    const path = pathForState(logic.state) || window.location.pathname;
    window.history.replaceState({ ...window.history.state, moonshot: depthOf() }, '', path);
    lastPath.current = path;
  };
  const push = (path: string) => {
    window.history.pushState({ moonshot: depthOf() }, '', path);
    lastPath.current = path;
  };
  // This page load starts the planner's history afresh; whatever the browser kept from before is just earlier pages.
  useEffect(() => {
    stamp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // After every change: a deeper history pushes an entry, a shallower one (the app's Back) steps the browser back to
  // match, and the same depth keeps the address in step with the screen.
  useEffect(() => {
    if (Date.now() < movingUntil.current || window.location.pathname !== lastPath.current) return;
    const depth = depthOf();
    const cur = stampOf();
    const path = pathForState(logic.state) || window.location.pathname;
    // Moving to another tab (a different first part of the address) is an entry of its own too, so Back returns to
    // the tab you came from; within a tab the address just follows the screen.
    const section = (p: string) => p.split('/')[1] || '';
    if (depth > cur) push(path);
    else if (depth < cur) go(depth - cur);
    else if (path !== window.location.pathname) {
      if (section(path) !== section(window.location.pathname)) push(path);
      else stamp();
    }
  });
  useWindowEvent('popstate', (e) => {
    // The planner's own step back (after its Back, or a delete) lands on an entry that may still hold a screen that's
    // gone; the planner is already where it should be, so that entry just takes its address.
    const ours = Date.now() < movingUntil.current;
    movingUntil.current = 0;
    const target = (e.state && e.state.moonshot) || 0;
    const st = logic.state;
    const cur = depthOf();
    // Landed where the planner already is: the browser catching up with the app's own Back, or going forward again
    // after a Back that asked first.
    if (target === cur) {
      const opens = stateForPath(window.location.pathname);
      if (!ours && opens && pathForState(st) && pathForState(st) !== window.location.pathname) logic.setState({ ...opens, monthOpen: false });
      stamp();
      return;
    }
    if (target < cur) {
      // Back. Unsaved changes ask first; the browser goes forward again meanwhile, so nothing has moved yet.
      const dirtyWorkout = st.screen === 'edit' && workoutDraftDirty(st);
      const dirtyExercise = exerciseDraftDirty(st);
      if (dirtyWorkout || dirtyExercise) {
        go(cur - target);
        if (dirtyWorkout) logic.setState({ leaveOpen: true, pendingNav: null });
        else
          logic.setState({
            confirm: {
              kind: 'leaveExercise',
              title: 'Discard your changes?',
              body: 'You’ve edited this exercise. Leaving now throws those changes away.',
              label: 'Discard changes',
            },
          });
        return;
      }
      for (let i = cur; i > target; i--) logic.back();
    } else {
      // Forward: the screen that address belongs to.
      const opens = stateForPath(window.location.pathname);
      if (opens) logic.nav({ ...opens, monthOpen: false });
    }
    stamp();
  });
  // Closing or reloading the tab with unsaved changes asks the browser's own "Leave site?".
  useWindowEvent('beforeunload', (e) => {
    const st = logic.state;
    if ((st.screen === 'edit' && workoutDraftDirty(st)) || exerciseDraftDirty(st)) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  // A new screen opens at its top. Without this the window keeps the last screen's scroll, and you can land in
  // the middle of a long list with its heading (and anything it says about where you are) out of view.
  // Focus moves with it, so keyboard and screen-reader users land on the new screen rather than on the page behind:
  // back to the control that opened this screen when returning with Back, otherwise to the screen's heading.
  const screen = logic.state.screen;
  const firstScreen = useRef(true);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (firstScreen.current) {
      firstScreen.current = false;
      return;
    }
    const wanted = logic.focusBack;
    logic.focusBack = null;
    const id = requestAnimationFrame(() => {
      if (document.querySelector('dialog[open]')) return;
      const nameOf = (el: Element) => el.getAttribute('aria-label') || (el.textContent || '').trim().slice(0, 80);
      const opener = wanted
        ? Array.from(document.querySelectorAll<HTMLElement>('main button, main a, nav a, nav button')).find(
            (el) => nameOf(el) === wanted,
          )
        : null;
      if (opener) return opener.focus();
      const heading = document.querySelector<HTMLElement>('main h1');
      if (!heading) return;
      if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [screen, logic]);

  // Keyboard focus never sits hidden under the phone tab bar: whatever takes focus behind it is scrolled up clear of
  // it. (Browsers scroll a focused element into the window, but not out from under something fixed on top of it.)
  useWindowEvent('focusin', (e) => {
    const bar = document.querySelector<HTMLElement>('[data-tabbar]');
    const el = e.target as HTMLElement | null;
    if (!bar || !el || bar.contains(el) || bar.offsetHeight === 0 || !el.getBoundingClientRect) return;
    // After the browser's own scroll-into-view, which runs once this event has been handled.
    requestAnimationFrame(() => {
      const limit = bar.getBoundingClientRect().top - 12;
      const r = el.getBoundingClientRect();
      if (r.bottom > limit) window.scrollBy({ top: Math.min(r.bottom - limit, r.top - 16), behavior: 'instant' });
    });
  });

  // Escape on a full-screen view does what its Back button does, unless something on top of it (a dialog, a popover,
  // the exercise picker) or a text field has the key.
  useWindowEvent('keydown', (e) => {
    if (e.key !== 'Escape' || e.defaultPrevented || !(logic.state.hist || []).length) return;
    if (document.querySelector('dialog[open]')) return;
    try {
      if (document.querySelector(':popover-open')) return;
    } catch {
      // A browser without the popover API has no open popovers to worry about.
    }
    // The editor's exercise picker closes first, even from its search field, and focus goes back to "Add exercise".
    if (logic.state.addOpen && document.querySelector('[data-add-exercise-panel]')) {
      e.preventDefault();
      logic.setState({ addOpen: false });
      document.querySelector<HTMLElement>('[data-add-exercise]')?.focus();
      return;
    }
    const t = e.target as HTMLElement | null;
    if (t && (t.closest('input, textarea, select, [contenteditable="true"]'))) return;
    const back = Array.from(document.querySelectorAll<HTMLButtonElement>('main button')).find(
      (b) => b.getAttribute('aria-label') === 'Back' || (!b.getAttribute('aria-label') && (b.textContent || '').trim() === 'Back'),
    );
    if (back) {
      e.preventDefault();
      back.click();
    }
  });

  const { status, loadError } = logic;
  const [slow, setSlow] = useState(false);
  // A load that has not finished after a while says so, and offers to try again.
  useEffect(() => {
    if (status !== 'loading') return setSlow(false);
    const timer = setTimeout(() => setSlow(true), SLOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, [status]);

  // Offers to install the app on a phone, once the plan has loaded.
  const installPrompt = useInstallPrompt(status === 'ready');

  const timers = logic.state.workoutTimer;
  useEffect(() => {
    try {
      if (timers && Object.keys(timers).length) window.localStorage.setItem(timersKey, JSON.stringify(timers));
      else window.localStorage.removeItem(timersKey);
    } catch {
      // Storage can be unavailable (private windows, blocked site data); the timer then lasts until a reload.
    }
  }, [timers, timersKey]);

  // A running workout stopwatch needs the screen to tick even though nothing else in state is changing.
  const anyTimerRunning = Object.values(logic.state.workoutTimer || {}).some((t: any) => t && t.runningSince);
  useEffect(() => {
    if (!anyTimerRunning) return;
    const id = setInterval(() => logic.forceUpdate(), 1000);
    return () => clearInterval(id);
  }, [anyTimerRunning, logic]);

  // The rank-up transformation plays the first time a new rank is reached. The highest rank already celebrated is
  // kept per account in this browser. With nothing kept yet (a first visit, another device) the current rank is
  // recorded quietly rather than celebrated, and a rank that drops and is earned back doesn't play again.
  const view = status === 'ready' ? logic.renderVals() : null;
  const rank: number | null = view ? view.rankIndex : null;
  const [rankUp, setRankUp] = useState<number | null>(null);
  useEffect(() => {
    if (rank == null) return;
    const key = 'moonshot.rankSeen.' + (account?.email || 'local');
    try {
      const seen = window.localStorage.getItem(key);
      if (seen != null && rank <= Number(seen)) return;
      window.localStorage.setItem(key, String(rank));
      if (seen != null) setRankUp(rank);
    } catch {
      // Storage can be unavailable (private windows, blocked site data); then there's just no celebration.
    }
  }, [rank, account?.email]);

  const retry = () => {
    logic.status = 'loading';
    setSlow(false);
    rerender();
    logic.load();
  };

  if (status === 'loading') return <StatusScreen kind={slow ? 'slow' : 'loading'} onRetry={retry} />;
  if (status === 'error') {
    return <StatusScreen kind="error" detail={loadError} onRetry={retry} onSignOut={account ? logic.auth.signOut : undefined} />;
  }
  return (
    <>
      <PlannerView v={view ?? logic.renderVals()} />
      <RankUp
        open={rankUp != null && rankUp === rank}
        name={view?.rankName ?? ''}
        step={view?.rankStepLabel ?? ''}
        next={view?.rankNext ?? ''}
        gem={view?.rankGemFill ?? 'var(--gradient-gem)'}
        onClose={() => setRankUp(null)}
      />
      <InstallPrompt
        open={installPrompt.open}
        notice={installPrompt.notice}
        onInstall={installPrompt.install}
        onNotNow={installPrompt.notNow}
      />
    </>
  );
}
