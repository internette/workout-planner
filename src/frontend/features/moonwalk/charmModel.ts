// Charms on screen: today's charm on the day view (recommended and preselected, changeable until it starts working),
// the picker that changes it, the Charm Table under Profile where charms are crafted, and the My charms card.
import type { Ctx } from '../planner/store/types';
import { idOf } from '@/frontend/shared/helpers';
import { setsIn } from '@/frontend/features/session/sets';
import { bossName } from '@/frontend/features/boss/bosses';
import * as db from '@/frontend/data/plannerData';
import type { FoundRow } from '@/frontend/data/plannerData';
import { FINDS, PER_SET, RARITIES, SETS, rarityOf, type Rarity } from './catalog';
import { CHARMS, GROUPS, MAX_WARDS, PAGES, TIERS, charmByKey, type Charm, type Cost } from './charms';
import { coveredDays, isoOfDayNum, usesByDay } from './effects';
import { recipeState } from './recipes';
import { cantUse, recommendations, type Day, type Kind } from './recommend';
import { rng } from './pouch';

const colorOf = (c: Charm) => ({
  tint: `var(--color-${c.color}-tint)`,
  deep: c.color === 'slate' ? 'var(--color-slate)' : `var(--color-${c.color}-deep)`,
  fill: `var(--color-${c.color})`,
});
const setIxOf = (key: string) => SETS.findIndex((s) => s.key === key);

/** What a cost asks for, in words: "3 Common, 1 Bright" or "Twin Moon, 4 Bright, 2 Rare". */
export function costText(cost: Cost) {
  const parts: string[] = [];
  (cost.charms || []).forEach((k) => parts.push(charmByKey(k)!.name));
  (cost.setCommons || []).forEach((s) => parts.push(s.n + ' ' + SETS[setIxOf(s.set)].name + ' Common'));
  RARITIES.forEach((r) => {
    const n = cost.finds?.[r.key];
    if (n) parts.push(n + ' ' + r.label);
  });
  return parts.join(', ');
}

/**
 * The satchel rows and held charms a cost would spend, oldest first, or what's still missing. A set's Commons are
 * taken first, so the plain Commons come from what's left.
 */
export function spendFor(cost: Cost, satchel: FoundRow[], held: { id: string; charm: string }[]) {
  const taken = new Set<string>();
  const missing: string[] = [];
  const takeRows = (n: number, ok: (r: FoundRow) => boolean, label: string) => {
    const rows = satchel.filter((r) => !taken.has(r.id) && ok(r)).slice(0, n);
    rows.forEach((r) => taken.add(r.id));
    if (rows.length < n) missing.push(n - rows.length + ' more ' + label);
  };
  (cost.setCommons || []).forEach((s) => {
    const k = setIxOf(s.set);
    takeRows(s.n, (r) => FINDS[r.findId].set === k && FINDS[r.findId].rarity === 'common', SETS[k].name + ' Common');
  });
  RARITIES.forEach((r) => {
    const n = cost.finds?.[r.key];
    if (n) takeRows(n, (row) => FINDS[row.findId].rarity === r.key, r.label);
  });
  const charms: string[] = [];
  (cost.charms || []).forEach((k) => {
    const row = held.find((h) => h.charm === k && !charms.includes(h.id));
    if (row) charms.push(row.id);
    else missing.push('a ' + charmByKey(k)!.name);
  });
  return { finds: Array.from(taken), charms, missing };
}

export function charmVals(ctx: Ctx) {
  const { logic, st, Y, TODAY_M, TODAY_D, mi, selDay, bossFight, bossWins, plannedByDay, dayComplete, bossTodayPlan, instList, isDoneEntry } = ctx;
  const model = logic.model;
  const ready = !!model && model.charmsReady && model.moonwalkReady;
  const dayNum = (m: number, d: number) => Math.round(Date.UTC(Y, m, d) / 864e5);
  const today = dayNum(TODAY_M, TODAY_D);
  const todayIso = isoOfDayNum(today);
  const rows = (model && model.charms) || [];
  const found = (model && model.found) || [];
  const satchel = found.filter((r) => !r.spent);
  const held = rows.filter((r) => r.kind === 'charm' && !r.used);
  const heldCount = (key: string) => held.filter((r) => r.charm === key).length;
  const uses = usesByDay(model);
  const todayUse = uses.get(today) || null;
  const todayCharm = todayUse ? charmByKey(todayUse.row.charm) || null : null;

  // What can turn up recipes: the Finds picked up, the bosses beaten and the sets finished.
  const recipes = recipeState(found, rows, bossWins, model ? model.entries : []);

  // Missed days, for the Streak Ward and Moon Shift: planned, not finished, and not already covered by a charm.
  const keyNum = (k: string) => {
    const [m, d] = k.split('|').map(Number);
    return dayNum(m, d);
  };
  const finishedOn = new Set(Object.keys(plannedByDay).filter((k) => dayComplete[k]).map(keyNum));
  const covered = coveredDays(uses, (n) => finishedOn.has(n));
  const missedDays = Object.keys(plannedByDay)
    .filter((k) => !dayComplete[k] && keyNum(k) < today && !covered.has(keyNum(k)))
    .map(keyNum);
  const yesterdayMissed = missedDays.includes(today - 1);
  // The streak a ward would keep: finished (or covered) planned days running back from the day before yesterday.
  const planned = Object.keys(plannedByDay)
    .map((k) => ({ n: keyNum(k), done: !!dayComplete[k] }))
    .filter((x) => x.n < today - 1)
    .sort((a, b) => b.n - a.n);
  let streakBefore = 0;
  for (const x of planned) {
    if (x.done) streakBefore++;
    else if (!covered.has(x.n)) break;
  }
  const weekStart = today - new Date(Y, TODAY_M, TODAY_D).getDay();
  const missedWeek = missedDays.filter((n) => n >= weekStart).sort((a, b) => b - a);

  // Today's plan, for the recommendation.
  const todays = model ? model.entries.filter((x) => x.m === TODAY_M && x.d === TODAY_D).map((x) => x.av) : [];
  const kindOf = (av: (typeof todays)[number]): Kind => (av.ride ? (av.ride.run ? 'run' : 'ride') : av.stretch ? 'stretch' : av.yoga ? 'yoga' : 'lift');
  const sessions = todays
    .filter((av) => !av.warmup)
    .map((av) => ({ kind: kindOf(av), sets: av.ride ? 0 : instList(av.exKey, idOf(av)).reduce((n, e) => n + setsIn(e), 0) }));
  const day: Day = {
    sessions,
    fight: bossFight
      ? { name: bossName(bossFight.k), hpLeft: bossFight.hp - bossFight.dealt, hp: bossFight.hp, daysLeft: bossFight.daysLeft, glassed: bossFight.glassed, bannered: bossFight.banner }
      : null,
    planDamage: bossTodayPlan,
    yesterdayMissed,
    streakBefore,
    missedThisWeek: missedWeek.length,
    hour: new Date().getHours(),
  };
  const monthIso = todayIso.slice(0, 7);
  const windThisMonth = rows.some((r) => r.charm === 'second-wind' && r.usedDay && r.usedDay.slice(0, 7) === monthIso);
  const brightOrRare = satchel.some((r) => FINDS[r.findId].rarity === 'bright' || FINDS[r.findId].rarity === 'rare');
  const tierCount = (k: Rarity) => satchel.filter((r) => FINDS[r.findId].rarity === k).length;
  const ringable = tierCount('common') >= 3 || tierCount('bright') >= 3;
  const stamped = new Set(found.map((r) => r.findId));
  const missingIn = (k: number) => FINDS.slice(k * PER_SET, (k + 1) * PER_SET).filter((f) => f.rarity !== 'lunar' && !stamped.has(f.id));
  const wishSets = SETS.map((_, k) => k).filter((k) => missingIn(k).length);
  const why = (c: Charm) => cantUse(c.effect, day, { brightOrRare, ringable, windThisMonth, wishable: wishSets.length > 0 });

  // The recommendation: the first charm held that's worth using today and can be.
  const recs = recommendations(day).filter((p) => heldCount(p.key) && !why(charmByKey(p.key)!));
  const declinedWard = st.charmSkip === todayIso;
  const rec = recs.find((p) => !(declinedWard && (p.key === 'streak-ward' || p.key === 'second-wind'))) || null;
  const heldKeys = CHARMS.filter((c) => heldCount(c.key)).map((c) => c.key);

  // A charm starts working once today's first set is ticked, a session's clock or walk starts, or one is finished.
  // Until then it can be changed. One that acts right away can't.
  const started = todays.some(
    (av) => isDoneEntry(av) || ((st.done || {})[idOf(av)] || []).length > 0 || !!(st.workoutTimer || {})[idOf(av)] || !!(st.moonwalk || {})[av.id],
  );
  const canChange = !!todayCharm && !todayCharm.now && !started;

  // The picker.
  const pick = st.charmPick || null;
  const pickKey = pick ? pick.key || rec?.key || heldKeys.find((k) => !why(charmByKey(k)!)) || null : null;
  const pickCharm = pickKey ? charmByKey(pickKey)! : null;
  const target = pick ? pick.target ?? null : null;
  const wishSet = pick && pick.set != null && wishSets.includes(pick.set) ? pick.set : wishSets[0] ?? 0;
  const setPick = (patch: Partial<NonNullable<typeof pick>>) => logic.s({ charmPick: { ...(pick || { key: null }), ...patch } });
  // What a charm that makes a Find spends and makes, from the target chosen.
  const made = (c: Charm, rowId: string): { spend: string[]; findId: number; source: 'craft' | 'wish' } | null => {
    if (c.effect === 'mirror') {
      const fid = target != null ? Number(target) : NaN;
      return Number.isFinite(fid) && satchel.some((r) => r.findId === fid) ? { spend: [], findId: fid, source: 'craft' } : null;
    }
    if (c.effect === 'ring') {
      const from: Rarity | null = target === 'common' || target === 'bright' ? target : null;
      if (!from || tierCount(from) < 3) return null;
      const to: Rarity = from === 'common' ? 'bright' : 'rare';
      const pool = FINDS.filter((f) => f.rarity === to);
      const spend = satchel.filter((r) => FINDS[r.findId].rarity === from).slice(0, 3).map((r) => r.id);
      return { spend, findId: pool[Math.floor(rng(rowId + ':ring')() * pool.length)].id, source: 'craft' };
    }
    if (c.effect === 'wish') {
      const fid = target != null ? Number(target) : NaN;
      return Number.isFinite(fid) && FINDS[fid] && FINDS[fid].rarity !== 'lunar' && !stamped.has(fid) ? { spend: [], findId: fid, source: 'wish' } : null;
    }
    return null;
  };
  const needsTarget = (c: Charm) => c.effect === 'mirror' || c.effect === 'ring' || c.effect === 'wish';
  // Uses a held charm as today's. A Streak Ward and a Second Wind cover yesterday, a Moon Shift the latest day
  // missed this week.
  const spendCharm = (key: string) => {
    const c = charmByKey(key);
    const row = held.find((r) => r.charm === key);
    if (!c || !row || why(c)) return;
    const usedFor = c.effect === 'ward' || c.effect === 'wind' ? isoOfDayNum(today - 1) : c.effect === 'shift' && missedWeek.length ? isoOfDayNum(missedWeek[0]) : null;
    const m = needsTarget(c) ? made(c, row.id) : null;
    if (needsTarget(c) && !m) return;
    const done = c.effect === 'mirror' || c.effect === 'ring' || c.effect === 'wish' ? ' and it’s in your satchel' : '';
    const text = c.name + ' is today’s charm' + (m ? ': ' + FINDS[m.findId].name + ' made' + done : '') + '.';
    void logic.saveOnce(
      'charm',
      () => (m ? db.applyMakingCharm(row.id, todayIso, m.spend, m.findId, m.source) : db.applyCharm(row.id, todayIso, usedFor)),
      { charmPick: null, notice: { text, screen: st.screen }, announce: text },
    );
  };

  const pickerList = heldKeys.map((k) => {
    const c = charmByKey(k)!;
    const r = recs.find((p) => p.key === k);
    const no = why(c);
    return {
      key: k,
      name: c.name,
      count: heldCount(k),
      what: c.what,
      note: no || (r ? r.reason : c.note),
      disabled: !!no,
      recommended: rec?.key === k,
      selected: pickKey === k,
      choose: () => setPick({ key: k, target: null }),
      ...colorOf(c),
    };
  });
  const targets =
    pickCharm && pickCharm.effect === 'mirror'
      ? Array.from(new Set(satchel.filter((r) => FINDS[r.findId].rarity === 'bright' || FINDS[r.findId].rarity === 'rare').map((r) => r.findId)))
          .sort((a, b) => a - b)
          .map((fid) => ({ key: String(fid), label: FINDS[fid].name + ' · ' + rarityOf(FINDS[fid].rarity).label, on: target === String(fid), choose: () => setPick({ target: String(fid) }) }))
      : pickCharm && pickCharm.effect === 'ring'
        ? (['common', 'bright'] as Rarity[])
            .filter((k) => tierCount(k) >= 3)
            .map((k) => ({ key: k, label: '3 ' + rarityOf(k).label + ' → 1 ' + (k === 'common' ? 'Bright' : 'Rare'), on: target === k, choose: () => setPick({ target: k }) }))
        : pickCharm && pickCharm.effect === 'wish'
          ? missingIn(wishSet).map((f) => ({ key: String(f.id), label: f.name + ' · ' + rarityOf(f.rarity).label, on: target === String(f.id), choose: () => setPick({ target: String(f.id) }) }))
          : [];

  // The Charm Table.
  const satchelCounts = RARITIES.map((r) => ({ key: r.key, label: r.label, n: tierCount(r.key), fill: `var(--color-${r.color})`, deep: r.color === 'slate' ? 'var(--color-slate)' : `var(--color-${r.color}-deep)` }));
  const wards = heldCount('streak-ward');
  const craftable = (c: Charm) => spendFor(c.cost, satchel, held);
  const recipeRow = (c: Charm) => {
    const known = recipes.known.has(c.key);
    const pages = recipes.pages[c.key] || 0;
    const s = craftable(c);
    const full = c.effect === 'ward' && wards >= MAX_WARDS;
    return {
      key: c.key,
      known,
      // A Hidden charm with no pages yet, or an Everyday one not found, is still a surprise.
      name: known || pages ? c.name : '???',
      what: known ? c.what : c.tier === 'hidden' ? (pages ? 'Recipe · ' + pages + ' of ' + PAGES + ' pages' : 'Rare glimmers, long walks and bosses drop pages') : 'Turns up in pouches and glimmers',
      cost: known ? costText(c.cost) : '',
      held: heldCount(c.key),
      pagePct: (pages / PAGES) * 100,
      pages,
      canCraft: known && !s.missing.length && !full && ready,
      need: full ? 'You hold ' + MAX_WARDS + ', the most.' : known && s.missing.length ? 'Need ' + s.missing.join(', ') + '.' : '',
      craft: () => {
        const sp = craftable(c);
        // Pressed while it can't be made (the button stays focusable): say what's missing.
        if (!known || !ready || sp.missing.length || full)
          return logic.s({ announce: full ? 'You hold ' + MAX_WARDS + ', the most.' : sp.missing.length ? 'Need ' + sp.missing.join(', ') + '.' : '' });
        void logic.saveOnce('craft', () => db.craftCharm(c.key, sp.finds, sp.charms), { notice: { text: 'Made a ' + c.name + '.', screen: 'charms' }, announce: 'Made a ' + c.name + '.' });
      },
      busy: logic.busy('craft'),
      ...colorOf(c),
    };
  };
  const legendary = CHARMS.filter((c) => c.tier === 'legendary');
  // The set closest to finished, for "Finish a set to pick one".
  const closest = SETS.map((s, k) => ({ name: s.name, have: FINDS.slice(k * PER_SET, (k + 1) * PER_SET).filter((f) => stamped.has(f.id)).length }))
    .filter((s) => s.have < PER_SET)
    .sort((a, b) => b.have - a.have)[0];

  // Boss loot: each boss beaten drops a Lunar (and a Rare with a Trophy Banner), saved once on the session that won.
  const loot = ready
    ? bossWins.flatMap((w) => {
        const set = w.k % SETS.length;
        const want = [{ findId: set * PER_SET + PER_SET - 1, slot: w.k }];
        if (w.banner) want.push({ findId: set * PER_SET + PER_SET - 2 - Math.floor(rng('banner' + w.k)() * 4), slot: 100 + w.k });
        return want
          .filter((x) => !found.some((r) => r.source === 'boss' && r.entryId === w.entryId && r.slot === x.slot))
          .map((x) => ({ ...x, entryId: w.entryId }));
      })
    : [];

  const onToday = mi === TODAY_M && selDay === TODAY_D;
  const tierOf = (c: Charm) => TIERS.find((t) => t.key === c.tier)!.label;
  const cpWhy = !pickCharm
    ? 'Pick a charm to use.'
    : why(pickCharm) ||
      (needsTarget(pickCharm) && !made(pickCharm, held.find((r) => r.charm === pickCharm.key)?.id || '')
        ? 'Pick a ' + (pickCharm.effect === 'mirror' ? 'Find to copy' : pickCharm.effect === 'ring' ? 'trade' : 'Find to fill') + ' first.'
        : '');
  return {
    charmsReady: ready,
    // Today's charm on the day view.
    tcShow: ready && onToday && (st.screen === 'day' || st.screen === 'rest') && (!!todayCharm || heldKeys.length > 0),
    tcUsed: todayCharm
      ? { key: todayCharm.key, name: todayCharm.name, what: todayCharm.what, note: todayCharm.note, ...colorOf(todayCharm) }
      : null,
    tcCanChange: canChange,
    tcChange: () =>
      todayUse && canChange
        ? logic.saveOnce('charm', () => db.unapplyCharm(todayUse.row.id), { charmPick: { key: todayUse.row.charm, target: null } })
        : undefined,
    tcRec: rec ? { ...rec, name: charmByKey(rec.key)!.name, what: charmByKey(rec.key)!.what, count: heldCount(rec.key), ...colorOf(charmByKey(rec.key)!) } : null,
    tcRest: !rec && !sessions.length ? 'Rest day, save your charm.' : !rec ? 'Nothing you hold fits today. You can still pick one.' : '',
    // Yesterday missed with a streak worth saving: the card asks first.
    tcWard: !todayCharm && !!rec && (rec.key === 'streak-ward' || rec.key === 'second-wind') ? { streak: streakBefore, held: heldCount(rec.key) } : null,
    tcWardNo: () => logic.s({ charmSkip: todayIso }),
    tcUse: () => (rec ? (needsTarget(charmByKey(rec.key)!) ? setPick({ key: rec.key }) : spendCharm(rec.key)) : undefined),
    tcOpen: () => logic.s({ charmPick: { key: null, target: null } }),
    tcBusy: logic.busy('charm'),

    // The picker.
    cpOpen: !!pick && ready,
    cpClose: () => logic.s({ charmPick: null }),
    cpList: pickerList,
    cpKey: pickKey,
    cpName: pickCharm ? pickCharm.name : '',
    cpTargetLabel: pickCharm ? (pickCharm.effect === 'mirror' ? 'Find to copy' : pickCharm.effect === 'ring' ? 'Trade' : pickCharm.effect === 'wish' ? 'Find to fill' : '') : '',
    cpTargets: targets,
    cpWishSets: pickCharm && pickCharm.effect === 'wish' ? wishSets.map((k) => ({ key: SETS[k].key, label: SETS[k].name, on: k === wishSet, choose: () => setPick({ set: k, target: null }) })) : [],
    cpCanUse: !cpWhy,
    // Why "Use" can't be pressed yet, said beside it (the button stays focusable, so it can be read).
    cpWhy,
    cpUse: () => {
      if (cpWhy) return logic.s({ announce: cpWhy });
      if (pickKey) spendCharm(pickKey);
    },
    cpNow: !!pickCharm && !!pickCharm.now,

    // The Charm Table.
    isCharms: st.screen === 'charms',
    goCharms: () => logic.nav({ screen: 'charms', monthOpen: false }),
    ctSatchel: satchelCounts,
    ctGroups: TIERS.map((t) => ({
      key: t.key,
      label: t.label,
      rows: CHARMS.filter((c) => c.tier === t.key && (t.key !== 'legendary' || recipes.known.has(c.key))).map(recipeRow),
    })),
    ctPicksLeft: recipes.picksLeft,
    ctPicks: recipes.picksLeft
      ? legendary
          .filter((c) => !recipes.known.has(c.key))
          .map((c) => ({ key: c.key, name: c.name, what: c.what, cost: costText(c.cost), // A pick is for good, so it asks first (the quiet answer is the main button).
            pick: () =>
              logic.s({
                confirm: {
                  kind: 'recipePick',
                  title: 'Pick the ' + c.name + ' recipe?',
                  body:
                    c.what + '. Crafting it costs ' + costText(c.cost) + '. A pick can’t be changed later' +
                    (recipes.picksLeft > 1 ? '; you’ll have ' + (recipes.picksLeft - 1) + ' more to make.' : '.'),
                  label: 'Pick ' + c.name,
                  cancelLabel: 'Not yet',
                  safe: true,
                  then: () => logic.saveOnce('recipe', () => db.pickRecipe(c.key), { notice: { text: 'The ' + c.name + ' recipe is on your table.', screen: 'charms' }, announce: 'The ' + c.name + ' recipe is on your table.' }),
                },
              }), ...colorOf(c) }))
      : [],
    ctLocked: legendary.every((c) => recipes.known.has(c.key))
      ? ''
      : recipes.picksLeft
        ? 'Pick one above.'
        : 'Locked. Finish a Starbook set to pick one' + (closest ? ' · ' + closest.name + ' ' + closest.have + '/' + PER_SET : '') + '.',
    ctToday: todayCharm ? todayCharm.name + ' is today’s charm.' : 'No charm used today yet.',

    // My charms, on Profile.
    mcHeld: heldKeys.map((k) => {
      const c = charmByKey(k)!;
      return { key: k, name: c.name, what: c.what, count: heldCount(k), tier: tierOf(c), group: GROUPS.find((g) => g.key === c.group)!.label, ...colorOf(c) };
    }),
    mcKnown: recipes.known.size + ' of ' + CHARMS.length + ' recipes',
    mcToday: todayCharm ? 'Today: ' + todayCharm.name : '',

    // For useCharmLoot: boss loot still to save.
    charmLootKey: loot.length ? loot.map((x) => x.entryId + ':' + x.slot).join(',') : '',
    charmLootSave: () =>
      logic.saveOnce('bossLoot', async () => {
        const by = new Map<string, { findId: number; slot: number }[]>();
        loot.forEach((x) => by.set(x.entryId, [...(by.get(x.entryId) || []), { findId: x.findId, slot: x.slot }]));
        for (const [entryId, list] of Array.from(by.entries())) await db.saveBossLoot(entryId, list);
      }),
  };
}
