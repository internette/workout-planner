import { RANK_XP, RANKS } from '@/frontend/shared/constants';
import { idOf } from '@/frontend/shared/helpers';
import { setsIn } from '@/frontend/features/session/sets';
import type { CalendarCtx } from '@/frontend/features/planner/store/types';
import type { Entry } from '@/frontend/data/plannerData';
import { BOSS_COUNT, BOSS_DAYS, BOSS_XP, FINISH_DAMAGE, SET_DAMAGE, bossHp, bossRank } from './bosses';

/** The boss being fought now: which one, how hurt it is, and how long is left this week. */
export type BossFight = {
  k: number;
  hp: number;
  dealt: number;
  daysLeft: number;
  /** How many weeks it has got away so far, and with how much left the last time. */
  escapes: number;
  lastLeft: number;
};
export type BossWin = { k: number; days: number; escapes: number; day: number };

// The rank a total of XP reaches, before any boss holds it back.
const rankOfXp = (xp: number) => {
  let r = 0;
  while (r < RANK_XP.length - 1 && xp >= RANK_XP[r]) r++;
  return r;
};

/**
 * XP, rank and boss battles, replayed from every session in date order. Nothing is stored: like XP, a fight is worked
 * out again from the ticks each time, so it is the same on every device. `awards` is XP won on a day besides the
 * sessions' own (weekly challenges), oldest first; like any XP it counts while a boss holds the rank.
 */
export function bossStage(ctx: CalendarCtx, awards: { day: number; xp: number }[] = []) {
  const { logic, st, Y, TODAY_M, TODAY_D, instList, isDoneEntry, doneCountAt } = ctx;
  const dayNum = (m: number, d: number) => Math.round(Date.UTC(Y, m, d) / 864e5);
  const today = dayNum(TODAY_M, TODAY_D);
  const xpOf = (av: Entry) => (av.ride ? 0 : doneCountAt(av) * 10) + (isDoneEntry(av) ? 50 : 0);
  // Each ticked exercise hits for its sets (as the session has them), and a finished workout adds the finishing blow.
  const damageOf = (av: Entry) => {
    const id = idOf(av);
    const ticked = (st.done || {})[id] || [];
    const sets = av.ride
      ? 0
      : instList(av.exKey, id)
          .filter((e) => ticked.includes(e.name))
          .reduce((n, e) => n + setsIn({ sets: ((st.fields || {})[id + '|' + e.name] || {}).sets ?? e.sets }), 0);
    return sets * SET_DAMAGE + (isDoneEntry(av) ? FINISH_DAMAGE : 0);
  };
  const ordered = logic.model.entries
    .map((x) => ({ day: dayNum(x.m, x.d), av: x.av }))
    .sort((a, b) => a.day - b.day);
  let xp = 0;
  const wins: BossWin[] = [];
  // XP and rank after each session up to today, for the achievements that are worked out from them.
  const log: { day: number; xp: number; rank: number }[] = [];
  type Fight = { k: number; start: number; first: number; dealt: number; escapes: number; lastLeft: number };
  // Kept in a box so the helpers below can change it.
  const now: { fight: Fight | null } = { fight: null };
  // A week gone by without a win: it gets away, and the next week starts it at full strength.
  const roll = (day: number) => {
    const fight = now.fight;
    while (fight && day >= fight.start + BOSS_DAYS) {
      fight.escapes++;
      fight.lastLeft = bossHp(fight.k) - fight.dealt;
      fight.start += BOSS_DAYS;
      fight.dealt = 0;
    }
  };
  const spawn = (day: number) => {
    const k = wins.length;
    if (!now.fight && k < BOSS_COUNT && rankOfXp(xp) >= bossRank(k)) now.fight = { k, start: day, first: day, dealt: 0, escapes: 0, lastLeft: 0 };
  };
  // XP won on days before `day`: counted, and a boss it reaches appears.
  let ai = 0;
  const award = (before: number) => {
    let any = false;
    while (ai < awards.length && awards[ai].day < before && awards[ai].day <= today) {
      roll(awards[ai].day);
      xp += awards[ai].xp;
      spawn(awards[ai].day);
      any = true;
      ai++;
    }
    if (any) {
      const held = now.fight;
      log.push({ day: awards[ai - 1].day, xp, rank: held ? Math.min(rankOfXp(xp), bossRank(held.k)) : rankOfXp(xp) });
    }
  };
  for (const { day, av } of ordered) {
    award(day);
    const gain = xpOf(av);
    // Sessions still ahead count toward XP, but a fight only happens up to today.
    if (day > today) {
      xp += gain;
      continue;
    }
    roll(day);
    xp += gain;
    const fight = now.fight;
    if (fight) {
      fight.dealt += damageOf(av);
      if (fight.dealt >= bossHp(fight.k)) {
        wins.push({ k: fight.k, days: day - fight.first + 1, escapes: fight.escapes, day });
        xp += BOSS_XP;
        now.fight = null;
      }
    }
    spawn(day);
    const held = now.fight;
    log.push({ day, xp, rank: held ? Math.min(rankOfXp(xp), bossRank(held.k)) : rankOfXp(xp) });
  }
  award(today + 1);
  roll(today);
  // A boss still standing holds the rank at its own.
  const f = now.fight;
  const derivedRank = f ? Math.min(rankOfXp(xp), bossRank(f.k)) : rankOfXp(xp);
  const bossFight: BossFight | null = f
    ? { k: f.k, hp: bossHp(f.k), dealt: f.dealt, daysLeft: f.start + BOSS_DAYS - today, escapes: f.escapes, lastLeft: f.lastLeft }
    : null;
  // Held at a boss with the XP for the next rank already earned.
  const bossBlocks = !!f && rankOfXp(xp) > bossRank(f.k);
  // Today's sessions not done yet, as damage: what finishing today would deal.
  const todayPlan = logic.model.entries
    .filter((x) => x.m === TODAY_M && x.d === TODAY_D && !isDoneEntry(x.av))
    .reduce((n, x) => {
      if (x.av.ride) return n + FINISH_DAMAGE;
      const id = idOf(x.av);
      const ticked = (st.done || {})[id] || [];
      const left = instList(x.av.exKey, id).filter((e) => !ticked.includes(e.name));
      return n + left.reduce((s, e) => s + setsIn(e) * SET_DAMAGE, 0) + FINISH_DAMAGE;
    }, 0);
  return { xpTotal: xp, derivedRank, bossFight, bossWins: wins, bossBlocks, bossTodayPlan: todayPlan, rankCount: RANKS.length, xpLog: log };
}
