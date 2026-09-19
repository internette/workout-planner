// Base class for PlannerLogic. Mirrors the design runtime's DCLogic: a plain object (not a React
// component) that owns its state. setState merges immediately, so handlers that fire several updates
// in a row see each other's writes, then asks the host component to re-render.
export interface LogicHost {
  forceUpdate(cb?: () => void): void;
}

export class DCLogic {
  props: any;
  state: any = {};
  __host?: LogicHost;

  constructor(props: any) {
    this.props = props || {};
  }

  setState(update: any, cb?: () => void) {
    const patch = typeof update === 'function' ? update(this.state) : update;
    this.state = { ...this.state, ...patch };
    this.__host?.forceUpdate(cb);
  }

  forceUpdate() {
    this.__host?.forceUpdate();
  }

  componentDidMount() {}
  componentDidUpdate(_prevProps?: any) {}
  componentWillUnmount() {}

  renderVals(): any {
    return {};
  }
}
