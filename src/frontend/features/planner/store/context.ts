import type { PlannerLogic } from './PlannerLogic';
import { baseStage } from './derive/base';
import { entriesStage } from './derive/entries';
import { calendarStage } from '@/frontend/features/calendar/derive';
import { statsStage } from './derive/stats';
import { workoutStage } from '@/frontend/features/session/derive';

// Runs the stages in order; each one adds the values it derives to the shared context, and reads the ones the stages
// before it added.
export function buildContext(logic: PlannerLogic) {
  const start = { logic };
  const base = { ...start, ...baseStage(start) };
  const entries = { ...base, ...entriesStage(base) };
  const calendar = { ...entries, ...calendarStage(entries) };
  const stats = { ...calendar, ...statsStage(calendar) };
  return { ...stats, ...workoutStage(stats) };
}
