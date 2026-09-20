'use client';

import React, { useEffect, useReducer, useState } from 'react';
import { PlannerLogic } from './planner/PlannerLogic';
import { useViewport } from './planner/useViewport';
import { PlannerView } from './PlannerView';

const centered: React.CSSProperties = {
  minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  gap: 14, padding: 24, textAlign: 'center', color: 'var(--color-muted)',
};

export default function Planner() {
  const [logic] = useState(() => new PlannerLogic());
  const [, rerender] = useReducer((n: number) => n + 1, 0);
  logic.viewport = useViewport();

  // The logic object owns the state; it asks this component to re-render whenever that changes.
  useEffect(() => {
    logic.__host = { forceUpdate: rerender };
    logic.load();
    return () => {
      logic.__host = undefined;
    };
  }, [logic]);

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
        <h1 style={{ margin: 0, color: 'var(--color-ink)', fontSize: 'var(--text-3xl)' }}>Couldn't reach your plan</h1>
        <p style={{ margin: 0, maxWidth: 420, fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)' }}>{loadError}</p>
        <button onClick={retry} style={{ padding: '12px 22px', border: 'none', borderRadius: 14, background: 'var(--color-pink)', color: 'var(--color-white)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>
          Try again
        </button>
      </div>
    );
  }
  return <PlannerView v={logic.renderVals()} />;
}
