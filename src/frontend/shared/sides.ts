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

// Exercises done one side at a time, going by the name: one-arm and single-leg moves, lunges, kickbacks, the
// anti-rotation presses and chops, and the like. Only these offer a second copy for the other side once they're in
// a workout; a Push-up is in it once.
const ONE_SIDED = /\b(single|one)[- ](arm|leg)\b|\blunges?\b|kickbacks?\b|abductions?\b|\bstep-?ups?\b|split squat|bulgarian|pistol|side plank|suitcase|unilateral|pallof|woodchop/i;

/** Whether an exercise is done a side at a time: already labeled with a side, or named like it. */
export const oneSided = (name: string) => !!splitSide(name).side || ONE_SIDED.test(name);
