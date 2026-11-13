// Moonwalk on screen: the card on a Run/Walk or Cycling session that tracks it by GPS, the pouch it opens when it's
// finished, and the Starbook on Profile. Only Run/Walk and Cycling sessions collect.
import type { Ctx } from '../planner/store/types';
import type { PlannerLogic } from '../planner/store/PlannerLogic';
import { FINDS, FIND_COUNT, PER_SET, RARITIES, SETS, rarityOf, type Moment } from './catalog';
import { drawPouch } from './pouch';
import { addFix, milesText, newTrack, starMiles, starsOf, toNextStar, MAX_STARS, type Fix, type Track } from './track';
import { knownCells, rememberCells, takeGlimmer, takenGlimmers } from './storage';
import { COMPASS_M, NET_REACH_M, REACH_M, glimmerDay, glimmersNear, metersTo } from './glimmers';
import { todayEffect } from './effects';
import type { Effect } from './charms';
import * as db from '@/frontend/data/plannerData';

const look = (rarity: (typeof RARITIES)[number]['key']) => {
  const c = rarityOf(rarity).color;
  return { tint: `var(--color-${c}-tint)`, deep: c === 'slate' ? 'var(--color-slate)' : `var(--color-${c}-deep)`, fill: `var(--color-${c})` };
};

/** One more GPS fix for a session being tracked. Called by useMoonwalk, outside a render. */
export function trackFix(logic: PlannerLogic, id: string, f: Fix) {
  const t = (logic.state.moonwalk || {})[id];
  if (!t) return;
  const known = knownCells();
  const next = addFix(t, f, (c) => known.has(c));
  if (next !== t) logic.s({ moonwalk: { ...logic.state.moonwalk, [id]: next } });
  collectNear(logic, id, next, todayEffect(logic.model));
}

// What glimmers are drawn from: only what stays the same along the way, so they don't move mid-walk.
// A Dusk Veil today lets night and dawn sets turn up whatever the hour.
const glimmerMoment = (t: Track, fx: Effect | null): Moment => {
  const now = new Date();
  return { hour: now.getHours(), month: now.getMonth(), miles: 0, ride: t.ride, newShare: 0, bossFight: !!t.boss, veil: fx === 'veil' };
};

/** The glimmers around the session's last fix that are still there today. A Lure Lantern today doubles them, and
 * `ring` looks further out (for a Star Compass). */
export function glimmersFor(t: Track, fx: Effect | null, ring?: number) {
  if (!t.last) return [];
  const day = glimmerDay();
  const gone = takenGlimmers(day);
  return glimmersNear(t.last.lat, t.last.lon, day, glimmerMoment(t, fx), { lure: fx === 'lure', ring }).filter((g) => !gone.has(g.key));
}
/** How close to walk to a glimmer to collect it: further with a Wide Net today. */
const reachOf = (fx: Effect | null) => (fx === 'net' ? NET_REACH_M : REACH_M);
/** Stars in a session's pouch: a Seed Star today adds 2. */
export const pouchStars = (t: Track, fx: Effect | null) => Math.min(MAX_STARS, starsOf(t) + (fx === 'seed' ? 2 : 0));

// Walking within reach of a glimmer picks it up: it's saved to the session, and the card says what it was.
function collectNear(logic: PlannerLogic, id: string, t: Track, fx: Effect | null) {
  const model = logic.model;
  if (!t.last || !model || !model.moonwalkReady || t.last.acc > 40) return;
  const here = t.last;
  const day = glimmerDay();
  glimmersFor(t, fx)
    .filter((g) => metersTo(here, g) <= reachOf(fx))
    .forEach((g) => {
      takeGlimmer(day, g.key);
      const isNew = !model.found.some((r) => r.findId === g.findId);
      try {
        navigator.vibrate?.(80);
      } catch {
        // No vibration here: the card still says it.
      }
      logic.s({ mwFound: { findId: g.findId, isNew, at: Date.now() } });
      void logic.save(() => db.saveGlimmer(id, g.findId, g.slot));
    });
}
export function trackError(logic: PlannerLogic, id: string, error: string) {
  const t = (logic.state.moonwalk || {})[id];
  if (t && t.error !== error) logic.s({ moonwalk: { ...logic.state.moonwalk, [id]: { ...t, error } } });
}

/** What a finished session's pouch holds: its Finds, and which are new to the Starbook. */
export function pouchOf(id: string, t: Track, found: { findId: number }[], bossFight: boolean, fx: Effect | null = null) {
  const now = new Date();
  const m: Moment = {
    hour: now.getHours(),
    month: now.getMonth(),
    miles: t.miles,
    ride: t.ride,
    newShare: t.miles ? t.newMiles / t.miles : 0,
    bossFight,
    veil: fx === 'veil',
  };
  const ids = drawPouch(id, pouchStars(t, fx), m, fx === 'lucky');
  const had = new Set(found.map((r) => r.findId));
  return ids.map((fid) => {
    const isNew = !had.has(fid);
    had.add(fid);
    return { id: fid, isNew };
  });
}

/** Saves a finished session's pouch, if it was tracked, and says what's in it. The track goes once it's saved. */
export async function openPouch(logic: PlannerLogic, id: string, bossFight: boolean) {
  const t = (logic.state.moonwalk || {})[id];
  const model = logic.model;
  if (!t || !model || !model.moonwalkReady) return null;
  const finds = pouchOf(id, t, model.found, bossFight, todayEffect(model));
  await db.savePouch(id, finds.map((f) => f.id));
  rememberCells(t.cells);
  return { entryId: id, finds, miles: t.miles, ride: t.ride };
}

export function moonwalkVals(ctx: Ctx) {
  const { logic, st, selAct, selRide, rideDone, timerKey, timerRunning, timerState, bossFight } = ctx;
  const model = logic.model;
  const ready = !!model && model.moonwalkReady;
  const found = (model && model.found) || [];
  const tracks = st.moonwalk || {};
  const fx = todayEffect(model);

  // The session on screen: a Run/Walk or Cycling session today, not done yet.
  const id = selAct ? selAct.id : '';
  const track = id ? tracks[id] || null : null;
  const canCollect = ready && !!selAct && !!selRide && selAct.s === 't' && !rideDone;
  const ride = !!selRide && !selRide.run;
  const stars = track ? pouchStars(track, fx) : 0;
  const next = track ? toNextStar(track) : null;
  const status = !track
    ? ''
    : track.error
      ? track.error
      : !timerState
        ? 'Starts when you start the timer.'
        : !timerRunning
          ? 'Paused with the timer.'
          : !track.last
            ? 'Finding where you are…'
            : 'Collecting. Keep this screen open to count every step.';

  // A finished session whose pouch didn't save: it can be opened again.
  const unopened = ready && !!selAct && !!track && rideDone && starsOf(track) > 0;

  // The session being tracked right now, wherever the app is: the one whose clock is running.
  const watching = Object.keys(tracks).find((k) => (st.workoutTimer || {})[k]?.runningSince) || null;

  // The Starbook.
  const copies = new Map<number, number>();
  found.forEach((r) => copies.set(r.findId, (copies.get(r.findId) || 0) + 1));
  const stamped = copies.size;
  const setIx = Math.min(SETS.length - 1, Math.max(0, st.starbookSet ?? 0));
  const setFinds = FINDS.slice(setIx * PER_SET, (setIx + 1) * PER_SET);
  const tile = (fid: number) => {
    const f = FINDS[fid];
    const n = copies.get(fid) || 0;
    return { key: String(fid), name: n ? f.name : 'Not found yet', rarity: f.rarity, rarityLabel: rarityOf(f.rarity).label, found: n > 0, copies: n, ...look(f.rarity) };
  };
  const latest = found
    .slice(-3)
    .reverse()
    .map((r, i) => ({ ...tile(r.findId), key: r.findId + '-' + i, setName: SETS[FINDS[r.findId].set].name }));

  const pouch = st.pouch || null;
  // The map around the session being collected, and its glimmers, nearest first.
  const here = track && track.last && !track.error ? track.last : null;
  const glimmers = here && track
    ? glimmersFor(track, fx)
        .map((g) => ({ ...g, m: metersTo(here, g) }))
        .sort((a, b) => a.m - b.m)
    : [];
  const nearest = glimmers[0];
  // A Star Compass today: the nearest Rare glimmer within half a mile, and which way it is.
  const compass =
    here && track && fx === 'compass'
      ? glimmersFor(track, fx, 3)
          .filter((g) => g.rarity === 'rare')
          .map((g) => ({ ...g, m: metersTo(here, g) }))
          .filter((g) => g.m <= COMPASS_M)
          .sort((a, b) => a.m - b.m)[0] || null
      : null;
  const justFound = st.mwFound && Date.now() - st.mwFound.at < 6000 ? st.mwFound : null;
  return {
    mwMap: here
      ? {
          lat: here.lat,
          lon: here.lon,
          glimmers: glimmers
            .concat(compass && !glimmers.some((g) => g.key === compass.key) ? [compass] : [])
            .map((g) => ({ key: g.key, lat: g.lat, lon: g.lon, color: rarityOf(g.rarity).color, rarity: rarityOf(g.rarity).label, target: !!compass && g.key === compass.key })),
        }
      : null,
    mwNearby: !here
      ? ''
      : glimmers.length
        ? glimmers.length + (glimmers.length === 1 ? ' glimmer' : ' glimmers') + ' nearby. The nearest, ' + rarityOf(nearest.rarity).label + ', is ' + Math.round(nearest.m) + ' m away.'
        : 'No glimmers left nearby today. The pouch still fills as you go.',
    mwCompass:
      fx !== 'compass' || !here
        ? ''
        : compass
          ? 'Star Compass: a Rare glimmer is ' + Math.round(compass.m) + ' m to the ' + compassWay(here, compass) + '.'
          : 'Star Compass: no Rare glimmer within half a mile here. Keep going and it will look again.',
    mwCharmNote: fx === 'lure' ? 'Lure Lantern: twice the glimmers today.' : fx === 'net' ? 'Wide Net: collect from 80 m away today.' : fx === 'veil' ? 'Dusk Veil: Lantern Street and Dawn Meadow turn up today.' : fx === 'seed' ? 'Seed Star: today’s pouch starts with 2 stars.' : fx === 'lucky' ? 'Lucky Pebble: today’s pouch holds a Bright or better.' : '',
    mwJustFound: justFound
      ? { name: FINDS[justFound.findId].name, rarity: FINDS[justFound.findId].rarity, rarityLabel: rarityOf(FINDS[justFound.findId].rarity).label, isNew: justFound.isNew, ...look(FINDS[justFound.findId].rarity) }
      : null,
    // The card on the session.
    mwShow: canCollect || unopened,
    mwOn: !!track,
    mwRide: ride,
    mwStart: () => logic.s({ moonwalk: { ...tracks, [id]: { ...newTrack(ride), boss: !!bossFight } } }),
    // Stopping throws the track away: its miles and the stars in the pouch. With something to lose it asks first,
    // as "Start over" does; Finds already picked up from glimmers are saved and stay either way.
    mwStop: () => {
      const stop = () => logic.s({ moonwalk: dropTrack(logic, id) });
      if (!track || (stars === 0 && track.miles < 0.01)) return stop();
      const miles = milesText(track.miles) + ' mi';
      logic.s({
        confirm: {
          kind: 'moonwalkStop',
          title: 'Stop collecting?',
          body:
            (stars ? 'The ' + stars + (stars === 1 ? ' star' : ' stars') + ' in your pouch and the ' + miles + ' so far go.' : 'The ' + miles + ' so far won’t count.') +
            ' Finds you’ve picked up stay in your Starbook.',
          label: 'Stop collecting',
          cancelLabel: 'Keep collecting',
          then: stop,
        },
      });
    },
    mwMiles: track ? milesText(track.miles) : '0.00',
    mwStars: stars,
    mwMaxStars: MAX_STARS,
    mwNext: next == null ? 'The pouch is full' : milesText(next) + ' mi to the next star',
    mwPer: ride ? 'A star every mile' : 'A star every quarter mile',
    mwNewMiles: track && track.newMiles >= 0.01 ? milesText(track.newMiles) + ' mi on new streets, counted double' : '',
    mwStatus: status,
    mwError: !!track?.error,
    mwUnopened: unopened,
    mwOpen: () => logic.saveOnce('pouch', () => openPouch(logic, id, !!bossFight), (p: any) => (p ? { pouch: p, moonwalk: dropTrack(logic, id) } : {})),
    // For useMoonwalk: which session to follow.
    mwWatch: watching,
    mwTimerKey: timerKey,
    starMiles: starMiles(ride),

    // The pouch, opened.
    pouchOpen: !!pouch,
    pouchTitle: pouch ? (pouch.finds.length ? 'Your pouch opened' : 'Your pouch was empty') : '',
    pouchNote: pouch
      ? pouch.finds.length
        ? milesText(pouch.miles) + ' mi · ' + pouch.finds.length + (pouch.finds.length === 1 ? ' star' : ' stars') + ' · ' + pouch.finds.filter((f) => f.isNew).length + ' new to the Starbook'
        : 'Go a little further next time: ' + (pouch.ride ? 'a mile' : 'a quarter mile') + ' earns the first star.'
      : '',
    pouchFinds: pouch ? pouch.finds.map((f, i) => ({ ...tile(f.id), name: FINDS[f.id].name, key: f.id + '-' + i, isNew: f.isNew })) : [],
    closePouch: () => logic.s({ pouch: null }),
    pouchToStarbook: () => {
      const first = pouch && pouch.finds[0] ? FINDS[pouch.finds[0].id].set : 0;
      logic.s({ pouch: null });
      logic.nav({ screen: 'starbook', starbookSet: first, monthOpen: false });
    },

    // The Starbook.
    moonwalkReady: ready,
    isStarbook: st.screen === 'starbook',
    goStarbook: () => logic.nav({ screen: 'starbook', monthOpen: false }),
    sbLabel: stamped + ' of ' + FIND_COUNT,
    sbPct: (stamped / FIND_COUNT) * 100,
    sbLatest: latest,
    sbSets: SETS.map((s, k) => {
      const have = FINDS.slice(k * PER_SET, (k + 1) * PER_SET).filter((f) => copies.has(f.id)).length;
      return { key: s.key, label: s.name, on: k === setIx, have, pick: () => logic.s({ starbookSet: k }) };
    }),
    sbSetName: SETS[setIx].name,
    sbSetHint: SETS[setIx].hint,
    sbSetLabel: setFinds.filter((f) => copies.has(f.id)).length + ' of ' + PER_SET,
    sbTiles: setFinds.map((f) => tile(f.id)),
    sbRarities: RARITIES.map((r) => ({ key: r.key, label: r.label, per: r.perSet, ...look(r.key) })),
  };
}

// Which way a spot is from here, in words: north, northeast and so on.
const WAYS = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
function compassWay(from: { lat: number; lon: number }, to: { lat: number; lon: number }) {
  const dy = to.lat - from.lat;
  const dx = (to.lon - from.lon) * Math.cos((from.lat * Math.PI) / 180);
  const deg = ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;
  return WAYS[Math.round(deg / 45) % 8];
}

const dropTrack = (logic: PlannerLogic, id: string) => {
  const { [id]: _gone, ...rest } = logic.state.moonwalk || {};
  return rest;
};

export { dropTrack };
