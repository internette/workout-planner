// Glimmers: Finds set down on the map, for a Run/Walk or Cycling session to walk up to. They're worked out on the
// phone from a coarse grid and the date, so everyone near the same spot on the same day sees the same ones, and no
// server needs to know where anyone is. Each grid square holds at most one, and they move to new spots each day.
// Rare and Lunar Finds turn up far more on glimmers than in the pouch.
import { FINDS, type Moment, type Rarity } from './catalog';
import { drawOne, rng } from './pouch';
import { milesBetween } from './track';

// A grid square: about 280 m north to south.
const GRID_DEG = 0.0025;
// The chance a square holds a glimmer today.
const FILL = 0.6;
/** How close to walk to collect one, in meters. A Wide Net makes it 80. */
export const REACH_M = 30;
export const NET_REACH_M = 80;
/** How far a Star Compass looks for a Rare glimmer: half a mile. */
export const COMPASS_M = 805;
const GLIMMER_ODDS: Record<Rarity, number> = { common: 0.45, bright: 0.33, rare: 0.18, lunar: 0.04 };

export type Glimmer = { key: string; slot: number; lat: number; lon: number; findId: number; rarity: Rarity };

/** Today's date as the glimmers know it: local, so they move at midnight. */
export const glimmerDay = (d = new Date()) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();

/** The glimmers in the squares around a spot: 3 × 3 squares on foot, 5 × 5 on a bike. `m` picks their sets, so it
 * should only hold what doesn't change along the way (the hour, the month, a boss fight). A Lure Lantern (`lure`)
 * sets a second glimmer down wherever one could be, so there are twice as many. `ring` looks further out. */
export function glimmersNear(lat: number, lon: number, day: number, m: Moment, opts: { lure?: boolean; ring?: number } = {}): Glimmer[] {
  const ring = opts.ring ?? (m.ride ? 2 : 1);
  const cy = Math.floor(lat / GRID_DEG);
  // Squares are as wide as they are tall, on the ground.
  const lonDeg = GRID_DEG / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
  const cx = Math.floor(lon / lonDeg);
  const out: Glimmer[] = [];
  for (let y = cy - ring; y <= cy + ring; y++)
    for (let x = cx - ring; x <= cx + ring; x++)
      for (const extra of opts.lure ? ['', ':lure'] : ['']) {
        const key = day + ':' + y + ':' + x + extra;
        const rand = rng(key);
        if (rand() > FILL) continue;
        // Somewhere inside the square, not on its edge.
        const gLat = (y + 0.15 + 0.7 * rand()) * GRID_DEG;
        const gLon = (x + 0.15 + 0.7 * rand()) * lonDeg;
        const findId = drawOne(rand, m, GLIMMER_ODDS);
        // Its number among the session's Finds: from the key, so the same glimmer is only saved once.
        let h = 0;
        for (let i = 0; i < key.length; i++) h = (Math.imul(h, 31) + key.charCodeAt(i)) | 0;
        out.push({ key, slot: 1000 + (Math.abs(h) % 30000), lat: gLat, lon: gLon, findId, rarity: FINDS[findId].rarity });
      }
  return out;
}

/** Meters from a spot to a glimmer. */
export const metersTo = (from: { lat: number; lon: number }, g: { lat: number; lon: number }) => milesBetween(from, g) * 1609.34;
