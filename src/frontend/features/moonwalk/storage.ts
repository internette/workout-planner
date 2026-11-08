// What Moonwalk keeps in this browser, per account: the map squares earlier sessions passed through (hashed, see
// track.ts), so new streets can be told from familiar ones. The sessions being tracked are kept beside the clock
// (Planner.tsx).

let account = 'local';
export const setMoonwalkAccount = (email: string | null | undefined) => {
  if ((email || 'local') === account) return;
  account = email || 'local';
  cache = null;
  taken = null;
};
export const tracksKey = () => 'moonshot.moonwalk.' + account;
const cellsKey = () => 'moonshot.moonwalkCells.' + account;
// The most squares kept: about 2,000 miles of streets. The oldest go first.
const MAX_CELLS = 20000;

let cache: Set<string> | null = null;
export function knownCells(): Set<string> {
  if (cache) return cache;
  try {
    const kept = JSON.parse(window.localStorage.getItem(cellsKey()) || '[]');
    cache = new Set(Array.isArray(kept) ? kept.filter((c) => typeof c === 'string') : []);
  } catch {
    cache = new Set();
  }
  return cache;
}

/** Once a session is finished, the squares it passed through are familiar from then on. */
export function rememberCells(cells: string[]) {
  const all = knownCells();
  cells.forEach((c) => all.add(c));
  const list = Array.from(all).slice(-MAX_CELLS);
  cache = new Set(list);
  try {
    window.localStorage.setItem(cellsKey(), JSON.stringify(list));
  } catch {
    // No storage: every street stays new on this device.
  }
}

// The glimmers collected today, so one picked up doesn't show again, even on a second session the same day.
const glimmersKey = () => 'moonshot.glimmers.' + account;
let taken: { day: number; keys: string[] } | null = null;
export function takenGlimmers(day: number): Set<string> {
  if (!taken || taken.day !== day) {
    try {
      const kept = JSON.parse(window.localStorage.getItem(glimmersKey()) || 'null');
      taken = kept && kept.day === day && Array.isArray(kept.keys) ? kept : { day, keys: [] };
    } catch {
      taken = { day, keys: [] };
    }
  }
  return new Set(taken!.keys);
}
export function takeGlimmer(day: number, key: string) {
  const keys = Array.from(takenGlimmers(day)).concat([key]);
  taken = { day, keys };
  try {
    window.localStorage.setItem(glimmersKey(), JSON.stringify(taken));
  } catch {
    // No storage: it's still saved, and only shows again after a reload.
  }
}
