'use client';

import React from 'react';
import { PlannerLogic } from './planner/PlannerLogic';
import { PlannerView } from './PlannerView';

const centered: React.CSSProperties = {
  minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  gap: 14, padding: 24, textAlign: 'center', color: '#746E88',
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
          <h1 style={{ margin: 0, color: '#232A45', fontSize: 20 }}>Couldn't reach your plan</h1>
          <p style={{ margin: 0, maxWidth: 420, fontSize: 14, lineHeight: 1.6 }}>{loadError}</p>
          <button onClick={this.retry} style={{ padding: '12px 22px', border: 'none', borderRadius: 14, background: '#E1699C', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Try again
          </button>
        </div>
      );
    }
    return <PlannerView v={this.logic.renderVals()} />;
  }
}
