'use client';

import React from 'react';
import { PlannerLogic } from './planner/PlannerLogic';
import { PlannerView } from './PlannerView';

const centered: React.CSSProperties = {
  minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  gap: 14, padding: 24, textAlign: 'center', color: 'var(--color-muted)',
};

export default class Planner extends React.Component {
  private logic: PlannerLogic;

  constructor(props: {}) {
    super(props);
    this.logic = new PlannerLogic(props);
    this.logic.__host = this;
  }

  componentDidMount() {
    this.logic.componentDidMount();
  }

  componentDidUpdate() {
    this.logic.props = this.props;
    this.logic.componentDidUpdate();
  }

  componentWillUnmount() {
    this.logic.componentWillUnmount();
  }

  retry = () => {
    this.logic.status = 'loading';
    this.forceUpdate();
    this.logic.load();
  };

  render() {
    const { status, loadError } = this.logic;
    if (status === 'loading') return <div style={centered} role="status">Loading your plan…</div>;
    if (status === 'error') {
      return (
        <div style={centered} role="alert">
          <h1 style={{ margin: 0, color: 'var(--color-ink)', fontSize: 'var(--text-3xl)' }}>Couldn't reach your plan</h1>
          <p style={{ margin: 0, maxWidth: 420, fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)' }}>{loadError}</p>
          <button onClick={this.retry} style={{ padding: '12px 22px', border: 'none', borderRadius: 14, background: 'var(--color-pink)', color: 'var(--color-white)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}>
            Try again
          </button>
        </div>
      );
    }
    return <PlannerView v={this.logic.renderVals()} />;
  }
}
