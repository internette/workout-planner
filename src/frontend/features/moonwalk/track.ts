// Moonwalk's GPS tracking, as pure functions: a Run/Walk or Cycling session's distance from the fixes the phone gives,
// and the pouch stars that distance earns.
//
// A web app only hears from GPS while it's open on screen. With the phone locked or in a pocket the fixes stop, and
// the next one comes when the app is open again. The gap between them counts as a straight line, capped at what the
// session could have covered at its top speed in that time, so a pocketed walk still counts, a little short.
//
// No route is kept. The walk keeps its last fix (to measure the next step from), and coarse map squares it passed
// through, as short hashes, to tell new streets from familiar ones.

export type Fix = { lat: number; lon: number; acc: number; t: number };

export type Track = {
  ride: boolean; // cycling: a star every mile instead of every quarter mile, and a higher top speed
  miles: number; // how far, by GPS
  credit: number; // miles toward stars: new streets count double
  newMiles: number; // of `miles`, on squares never passed through before
  last: Fix | null;
  cells: string[]; // squares passed through this session, hashed
  fixes: number;
  error?: string;
  boss?: boolean; // a boss fight was on when it started, for which sets glimmers favor
};

export const newTrack = (ride: boolean): Track => ({ ride, miles: 0, credit: 0, newMiles: 0, last: null, cells: [], fixes: 0 });

/** Miles per pouch star. */
export const starMiles = (ride: boolean) => (ride ? 1 : 0.25);
/** The most stars a pouch holds. */
export const MAX_STARS = 12;
export const starsOf = (t: Track) => Math.min(MAX_STARS, Math.floor(t.credit / starMiles(t.ride) + 1e-9));
/** Miles to the next star, or null at the most. */
export const toNextStar = (t: Track) => {
  if (starsOf(t) >= MAX_STARS) return null;
  const per = starMiles(t.ride);
  return per - (t.credit % per);
};

// Fastest believable speed, in miles an hour. Anything quicker (a car, a bus, a GPS jump) only counts up to it.
const TOP_MPH = { walk: 12, ride: 30 };
// Fixes less sure than this are skipped, and steps shorter than the fix's own error are noise.
const WORST_ACCURACY_M = 50;
const MIN_STEP_M = 8;
// The squares that tell new streets from old: about 150 m across.
const CELL_DEG = 0.0014;

const R_MILES = 3958.8;
const rad = (d: number) => (d * Math.PI) / 180;
export function milesBetween(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R_MILES * Math.asin(Math.min(1, Math.sqrt(h)));
}

// A square's id, hashed (FNV-1a), so what's kept isn't a readable place.
export function cellOf(f: { lat: number; lon: number }) {
  const key = Math.floor(f.lat / CELL_DEG) + ':' + Math.floor(f.lon / CELL_DEG);
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

/**
 * The track with one more fix. `known` says whether a square was passed through on an earlier session. Returns the
 * track unchanged for a fix too unsure to use.
 */
export function addFix(t: Track, f: Fix, known: (cell: string) => boolean): Track {
  if (!(f.acc <= WORST_ACCURACY_M)) return t;
  const cell = cellOf(f);
  const cells = t.cells.includes(cell) ? t.cells : t.cells.concat([cell]);
  if (!t.last) return { ...t, last: f, cells, fixes: t.fixes + 1 };
  const dt = Math.max(0, (f.t - t.last.t) / 3600000);
  const raw = milesBetween(t.last, f);
  // A step within the two fixes' own error is the GPS drifting while standing still: wait for a real move.
  if (raw * 1609.34 < Math.max(MIN_STEP_M, Math.min(f.acc, t.last.acc))) return { ...t, cells, fixes: t.fixes + 1 };
  const step = Math.min(raw, dt * (t.ride ? TOP_MPH.ride : TOP_MPH.walk));
  // New streets: a square no earlier session passed through.
  const fresh = !known(cell);
  return {
    ...t,
    miles: t.miles + step,
    credit: t.credit + step * (fresh ? 2 : 1),
    newMiles: t.newMiles + (fresh ? step : 0),
    last: f,
    cells,
    fixes: t.fixes + 1,
    error: undefined,
  };
}

/** A distance as the app writes it: "1.42". */
export const milesText = (mi: number) => (Math.round(mi * 100) / 100).toFixed(2);
