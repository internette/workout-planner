// What exercises need, as far as it's known. An exercise's equipment can be unknown: never set (null), or missing
// because the database has no equipment yet. Exercises from before the equipment list started out with none at all,
// which reads as bodyweight, so one with none that's done with pounds counts as unknown too: Bench Press at 95 lb isn't
// bodyweight.
import { EQUIPMENT } from './constants';

type Kit = { equipment?: string[] | null; weight?: string };

/** What an exercise needs, or null when that isn't known. */
export const kitOf = (e: Kit): string[] | null =>
  e.equipment == null || (!e.equipment.length && /\d/.test(e.weight || '')) ? null : e.equipment;

/** Everything a list of exercises needs, in the app's order, and whether that's all of it (every exercise known). */
export const kitOfAll = (list: Kit[]) => {
  const kits = list.map(kitOf);
  return { need: EQUIPMENT.filter((x) => kits.some((k) => k?.includes(x))), complete: kits.every((k) => k !== null) };
};

/**
 * A short line for a program's equipment: what it needs ("Dumbbells, Bench", or "4 pieces of equipment"), "No
 * equipment" when every exercise is known to need none, or null when nothing it needs is known.
 */
export const kitChip = (k: { need: string[]; complete: boolean }) =>
  k.need.length ? (k.need.length <= 2 ? k.need.join(', ') : k.need.length + ' pieces of equipment') : k.complete ? 'No equipment' : null;
