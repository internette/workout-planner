import type { Ctx } from './types';
import { baseStage } from './stages/base';
import { entriesStage } from './stages/entries';
import { calendarStage } from './stages/calendar';
import { statsStage } from './stages/stats';
import { workoutStage } from './stages/workout';

// Runs the stages in order; each one adds the values it derives to the shared context.
export function buildContext(logic: any): Ctx {
  const ctx: Ctx = { logic };
  for (const stage of [baseStage, entriesStage, calendarStage, statsStage, workoutStage]) {
    Object.assign(ctx, stage(ctx));
  }
  return ctx;
}
