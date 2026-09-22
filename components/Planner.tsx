'use client';

import React, { useEffect, useReducer, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { PlannerLogic } from './planner/PlannerLogic';
import { useViewport } from './planner/useViewport';
import { pathForState, screenForPath } from './planner/routes';
import { logoutUrl, type Account } from '@/lib/auth';
import { useWindowEvent } from './ui/useWindowEvent';
import { PlannerView } from './PlannerView';
import { StatusScreen } from './planner/StatusScreen';
import { InstallPrompt } from './planner/InstallPrompt';
import { useInstallPrompt } from './planner/useInstallPrompt';

// How long the plan may take before the loading screen says so.
const SLOW_AFTER_MS = 8000;

export default function Planner({ account = null }: { account?: Account | null }) {
  const pathname = usePathname();
  const [logic] = useState(() => {
    const l = new PlannerLogic();
    // Open on the screen the address names, such as /arsenal. The calendar address opens on today's Day view.
    const screen = screenForPath(pathname);
    if (screen) l.state = { ...l.state, screen };
    return l;
  });
  const [, rerender] = useReducer((n: number) => n + 1, 0);
  const seenPath = useRef(pathname);
  // The address the current screen belongs to, as of the last time the screen or the address changed it.
  const screenPath = useRef<string | null>(null);
  logic.viewport = useViewport();
  // Signing out is a trip to the server's logout route, which ends the session and returns to the front door.
  logic.auth = { account, signOut: () => window.location.assign(logoutUrl()) };

  // Back from the logout trip can restore this page as it was left, mid sign-out. Put the dialog away.
  useWindowEvent('pageshow', (e) => {
    if (e.persisted) logic.setState({ signOutOpen: false, signingOut: false });
  });

  // The logic object owns the state; it asks this component to re-render whenever that changes.
  useEffect(() => {
    logic.__host = { forceUpdate: rerender };
    logic.load();
    return () => {
      logic.__host = undefined;
    };
  }, [logic]);

  // Address to screen: Back and Forward, or a link, changed the address to one the screen is not on.
  useEffect(() => {
    if (seenPath.current === pathname) return;
    seenPath.current = pathname;
    const screen = screenForPath(pathname);
    if (screen && pathForState(logic.state) !== pathname) logic.setState({ screen, monthOpen: false });
    screenPath.current = pathForState(logic.state);
  }, [pathname, logic]);

  // Screen to address: when the screen moves to another nav item, push that item's address, so Back returns to where
  // you were. Only a change of the screen's own address counts: while the address is changing under us (Back), it
  // differs from the screen's for a moment, and pushing then would undo the Back. Screens inside a flow have no
  // address of their own, so they leave it alone.
  useEffect(() => {
    const path = pathForState(logic.state);
    if (!path || path === screenPath.current) return;
    screenPath.current = path;
    if (path !== window.location.pathname) {
      seenPath.current = path;
      window.history.pushState(null, '', path);
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
      <PlannerView v={logic.renderVals()} />
      <InstallPrompt
        open={installPrompt.open}
        notice={installPrompt.notice}
        onInstall={installPrompt.install}
        onNotNow={installPrompt.notNow}
      />
    </>
  );
}
