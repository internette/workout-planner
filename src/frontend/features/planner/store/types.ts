import type { PlannerLogic } from './PlannerLogic';
import type { baseStage } from './derive/base';
import type { entriesStage } from './derive/entries';
import type { calendarStage } from '@/frontend/features/calendar/derive';
import type { statsStage } from './derive/stats';
import type { buildContext } from './context';

// The context the derive stages build up, one stage at a time (see context.ts): what each stage can read is what the
// stages before it added.
export type StartCtx = { logic: PlannerLogic };
export type BaseCtx = StartCtx & ReturnType<typeof baseStage>;
export type EntriesCtx = BaseCtx & ReturnType<typeof entriesStage>;
export type CalendarCtx = EntriesCtx & ReturnType<typeof calendarStage>;
export type StatsCtx = CalendarCtx & ReturnType<typeof statsStage>;
/** Everything the screens' models read: the whole context. */
export type Ctx = ReturnType<typeof buildContext>;

/** Everything the view reads: every screen's values and handlers, as PlannerLogic.renderVals() builds them. */
export type PlannerVals = ReturnType<PlannerLogic['renderVals']>;
