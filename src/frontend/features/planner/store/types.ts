// The bag of derived values that the context stages build up and the screen builders read from.
// It is deliberately loose: the values are the design's own ad-hoc shapes.
export type Ctx = Record<string, any>;

/** Everything the view reads: every screen's values and handlers, as PlannerLogic.renderVals() builds them. */
export type PlannerVals = ReturnType<import('./PlannerLogic').PlannerLogic['renderVals']>;
