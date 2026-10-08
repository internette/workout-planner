// An exercise done on each side is in a workout twice, as "<name> · Left" and "<name> · Right". The side is part of
// its name, so everything that tells exercises apart by name (their order, ticks, sets done, edits, and what's saved)
// treats the two as the separate exercises they are; screens show the side as a chip under the name.
export type Side = 'Left' | 'Right';

const SEP = ' · ';
const SIDES: Side[] = ['Left', 'Right'];

/** "Single-Arm Press · Left" → the name and its side; a name with no side comes back as it is. */
export function splitSide(name: string): { base: string; side: Side | null } {
  const at = name.lastIndexOf(SEP);
  const side = at > 0 ? (name.slice(at + SEP.length) as Side) : null;
  return side && SIDES.includes(side) ? { base: name.slice(0, at), side } : { base: name, side: null };
}

export const withSide = (base: string, side: Side) => base + SEP + side;

export const otherSide = (side: Side): Side => (side === 'Left' ? 'Right' : 'Left');
