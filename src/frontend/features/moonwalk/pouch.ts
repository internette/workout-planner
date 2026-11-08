// The pouch: what a finished Run/Walk or Cycling session turns up, one Find per star. The draw is seeded by the
// session, so drawing it again (a save retried, a second device) gives the same Finds.
import { FINDS, PER_SET, RARITIES, SETS, type Moment, type Rarity } from './catalog';

// A small seeded random number generator (mulberry32).
function rng(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The chance of each rarity per star. A longer session tips them up a little. Rare and Lunar Finds are mostly for
 * glimmers on the map. In the pouch they're a treat. */
export function rarityOdds(miles: number, ride: boolean): Record<Rarity, number> {
  const long = miles >= (ride ? 8 : 2);
  return long ? { common: 0.66, bright: 0.26, rare: 0.075, lunar: 0.005 } : { common: 0.72, bright: 0.23, rare: 0.048, lunar: 0.002 };
}

// How much more a set whose moment fits turns up than one that doesn't. Wayfarer always fits.
const FIT_WEIGHT = 6;
const MISS_WEIGHT = 1;

const pick = <T,>(items: T[], weights: number[], r: number) => {
  const total = weights.reduce((a, b) => a + b, 0);
  let x = r * total;
  for (let i = 0; i < items.length; i++) {
    x -= weights[i];
    if (x <= 0) return items[i];
  }
  return items[items.length - 1];
};

/** The Finds for `stars` stars, by id. */
export function drawPouch(seed: string, stars: number, m: Moment): number[] {
  const rand = rng(seed);
  const odds = rarityOdds(m.miles, m.ride);
  const setWeights = SETS.map((s) => (s.fits(m) ? FIT_WEIGHT : MISS_WEIGHT));
  const out: number[] = [];
  for (let i = 0; i < stars; i++) {
    const rarity = pick(RARITIES.map((r) => r.key), RARITIES.map((r) => odds[r.key]), rand());
    const set = pick(SETS.map((_, k) => k), setWeights, rand());
    const inSet = FINDS.slice(set * PER_SET, (set + 1) * PER_SET).filter((f) => f.rarity === rarity);
    out.push(inSet[Math.floor(rand() * inSet.length)].id);
  }
  return out;
}
