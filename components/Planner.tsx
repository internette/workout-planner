'use client';

import React, { useEffect, useReducer, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { PlannerLogic } from './planner/PlannerLogic';
import { useViewport } from './planner/useViewport';
import { pathForScreen, screenForPath } from './planner/routes';
import { logoutUrl, type Account } from '@/lib/auth';
import { useWindowEvent } from './ui/useWindowEvent';
import { PlannerView } from './PlannerView';

const centered: React.CSSProperties = {
  minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  gap: 14, padding: 24, textAlign: 'center', color: 'var(--color-muted)',
};

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
    if (screen && pathForScreen(logic.state.screen) !== pathname) logic.setState({ screen, monthOpen: false });
    screenPath.current = pathForScreen(logic.state.screen);
  }, [pathname, logic]);

  // Screen to address: when the screen moves to another nav item, push that item's address, so Back returns to where
  // you were. Only a change of the screen's own address counts: while the address is changing under us (Back), it
  // differs from the screen's for a moment, and pushing then would undo the Back. Screens inside a flow have no
  // address of their own, so they leave it alone.
  useEffect(() => {
    const path = pathForScreen(logic.state.screen);
    if (!path || path === screenPath.current) return;
    screenPath.current = path;
    if (path !== window.location.pathname) {
      seenPath.current = path;
      window.history.pushState(null, '', path);
    }
  });

  const retry = () => {
    logic.status = 'loading';
    rerender();
    logic.load();
  };

  const { status, loadError } = logic;
  if (status === 'loading') return <div style={centered} role="status">Loading your plan…</div>;
  if (status === 'error') {
    return (
      <div style={centered} role="alert">
        <h1 style={{ margin: 0, color: 'var(--color-ink)', fontSize: 'var(--text-3xl)' }}>Couldn&apos;t reach your plan</h1>
        <p style={{ margin: 0, maxWidth: 420, fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)' }}>{loadError}</p>
        <button onClick={retry} style={{ padding: '12px 22px', border: 'none', borderRadius: 14, background: 'var(--color-pink)', color: 'var(--color-white)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>
          Try again
        </button>
      </div>
    );
  }
  return <PlannerView v={logic.renderVals()} />;
}
