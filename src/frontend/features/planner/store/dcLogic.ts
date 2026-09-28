// Base class for PlannerLogic. Mirrors the design runtime's DCLogic: a plain object (not a React
// component) that owns its state. setState merges immediately, so handlers that fire several updates
// in a row see each other's writes, then asks the host component to re-render.
export interface LogicHost {
  forceUpdate(): void;
}

export class DCLogic {
  state: any = {};
  /** Set by the host component while it is mounted. */
  __host?: LogicHost;

  setState(update: any) {
    const patch = typeof update === 'function' ? update(this.state) : update;
    this.state = { ...this.state, ...patch };
    this.__host?.forceUpdate();
  }

  forceUpdate() {
    this.__host?.forceUpdate();
  }

  renderVals(): any {
    return {};
  }
}
