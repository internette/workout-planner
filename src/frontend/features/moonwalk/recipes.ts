// Which charm recipes are known: worked out from the Finds picked up, the bosses beaten and the sets finished, so
// nothing is stored but the Legendary picks. No recipe is known at the start.
//
// Everyday recipes turn up whole: the first pouch ever opened always holds one, then about 1 pouch in 5 and 1
// glimmer in 8. Hidden recipes come in 3 pages: about 1 in 4 Rare or Lunar glimmers, 1 in 10 pouches from a long
// session (2 mi on foot, 8 on a bike), and every boss beaten. A page goes to the Hidden recipe closest to whole.
// Each Starbook set finished lets one Legendary recipe be picked.
import { FINDS, PER_SET, SETS } from './catalog';
import { CHARMS, PAGES } from './charms';
import { rng } from './pouch';
import type { CharmRow, Entry, FoundRow } from '@/frontend/data/plannerData';

export type RecipeState = {
  known: Set<string>;
  pages: Record<string, number>;
  /** Sets with every Find found. */
  setsDone: number;
  /** Legendary recipes that can be picked now. */
  picksLeft: number;
};

const EVERYDAY = CHARMS.filter((c) => c.tier === 'everyday').map((c) => c.key);
const HIDDEN = CHARMS.filter((c) => c.tier === 'hidden').map((c) => c.key);

export function recipeState(found: FoundRow[], charms: CharmRow[], bossWinDays: { k: number; day: number }[], entries: { av: Entry }[]): RecipeState {
  const known = new Set<string>();
  const pages: Record<string, number> = {};
  const learn = (seed: string) => {
    const open = EVERYDAY.filter((k) => !known.has(k));
    if (open.length) known.add(open[Math.floor(rng(seed + ':which')() * open.length)]);
  };
  const page = (seed: string) => {
    const open = HIDDEN.filter((k) => (pages[k] || 0) < PAGES);
    if (!open.length) return;
    const most = Math.max(...open.map((k) => pages[k] || 0));
    const top = open.filter((k) => (pages[k] || 0) === most);
    const k = top[Math.floor(rng(seed + ':page')() * top.length)];
    pages[k] = (pages[k] || 0) + 1;
    if (pages[k] >= PAGES) known.add(k);
  };
  const byId = new Map(entries.map((x) => [x.av.id, x.av]));

  // Everything that can turn up a recipe, in the order it happened.
  type Ev = { t: number; kind: 'pouch' | 'glimmer' | 'boss'; seed: string; rare?: boolean; long?: boolean };
  const evs: Ev[] = [];
  const pouches = new Set<string>();
  found.forEach((r) => {
    const t = Date.parse(r.at) || 0;
    if (r.source === 'pouch' && r.entryId && !pouches.has(r.entryId)) {
      pouches.add(r.entryId);
      const av = byId.get(r.entryId);
      const miles = av && av.actual ? parseFloat(av.actual.dist) || 0 : 0;
      const ride = !!av && !!av.ride && !av.ride.run;
      evs.push({ t, kind: 'pouch', seed: r.entryId, long: miles >= (ride ? 8 : 2) });
    } else if (r.source === 'glimmer') {
      const rarity = FINDS[r.findId]?.rarity;
      evs.push({ t, kind: 'glimmer', seed: r.id, rare: rarity === 'rare' || rarity === 'lunar' });
    }
  });
  // A boss beaten counts at the end of its day.
  bossWinDays.forEach((w) => evs.push({ t: (w.day + 1) * 864e5 - 1, kind: 'boss', seed: 'boss' + w.k }));
  evs.sort((a, b) => a.t - b.t);

  let firstPouch = true;
  evs.forEach((e) => {
    if (e.kind === 'pouch') {
      if (firstPouch || rng(e.seed + ':recipe')() < 0.2) learn(e.seed);
      firstPouch = false;
      if (e.long && rng(e.seed + ':pages')() < 0.1) page(e.seed);
    } else if (e.kind === 'glimmer') {
      if (rng(e.seed + ':recipe')() < 1 / 8) learn(e.seed);
      if (e.rare && rng(e.seed + ':pages')() < 0.25) page(e.seed);
    } else page(e.seed);
  });

  // Legendary: one pick per set finished.
  const stamped = new Set(found.map((r) => r.findId));
  const setsDone = SETS.filter((_, k) => FINDS.slice(k * PER_SET, (k + 1) * PER_SET).every((f) => stamped.has(f.id))).length;
  const picked = charms.filter((c) => c.kind === 'recipe');
  picked.forEach((c) => known.add(c.charm));
  return { known, pages, setsDone, picksLeft: Math.max(0, setsDone - picked.length) };
}
