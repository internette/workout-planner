import { MON3 } from '@/frontend/shared/constants';
import type { Ctx } from '../planner/store/types';
import { ACHIEVEMENTS, FAMILIES, GROUPS, tierColor, type Achievement } from './catalog';
import type { Unlock } from './derive';

const fmt = (n: number) => Math.floor(n).toLocaleString('en-US');

/** A tier's colors: its tint behind the star, and the deep shade the star is drawn in. */
const look = (a: Achievement) => {
  const c = tierColor(a);
  return { tint: `var(--color-${c}-tint)`, deep: c === 'slate' ? 'var(--color-slate)' : `var(--color-${c}-deep)`, fill: `var(--color-${c})` };
};

// Achievements on screen: the card on Profile, their own page, and the card that shows what a session unlocked.
export function achievementVals(ctx: Ctx) {
  const { logic, st, achievements, Y, TODAY_M, TODAY_D } = ctx;
  const { unlocks, counts, total } = achievements;
  const today = Math.round(Date.UTC(Y, TODAY_M, TODAY_D) / 864e5);
  const when = (day: number | null) => {
    if (day == null) return 'From the start';
    if (day === today) return 'Today';
    if (day === today - 1) return 'Yesterday';
    const d = new Date(day * 864e5);
    const thisYear = d.getUTCFullYear() === new Date(today * 864e5).getUTCFullYear();
    return MON3[d.getUTCMonth()] + ' ' + d.getUTCDate() + (thisYear ? '' : ', ' + d.getUTCFullYear());
  };
  const dayOf = new Map<number, number | null>();
  unlocks.forEach((u) => dayOf.set(u.ix, u.day));
  const row = (u: Unlock) => {
    const a = ACHIEVEMENTS[u.ix];
    return { key: a.id, name: a.name, how: a.how, when: when(u.day), ...look(a) };
  };
  const progressOf = (a: Achievement) => {
    const v = counts[a.family.stat] || 0;
    return { have: v, pct: Math.min(99, Math.floor((v / a.need) * 100)), label: fmt(v) + ' of ' + fmt(a.need) };
  };

  // Each family: how many of its tiers are earned, the last one earned, and the next one with how close it is.
  let ix = 0;
  const families = FAMILIES.map((f) => {
    const first = ix;
    ix += f.ladder.length;
    let earned = 0;
    while (earned < f.ladder.length && dayOf.has(first + earned)) earned++;
    const last = earned ? ACHIEVEMENTS[first + earned - 1] : null;
    const nextA = earned < f.ladder.length ? ACHIEVEMENTS[first + earned] : null;
    return {
      key: f.key,
      group: f.group,
      title: f.title,
      earned,
      of: f.ladder.length,
      label: earned + ' of ' + f.ladder.length,
      last: last ? { name: last.name, how: last.how, when: when(dayOf.get(first + earned - 1) ?? null), ...look(last) } : null,
      next: nextA ? { name: nextA.name, how: nextA.how, ...progressOf(nextA), ...look(nextA) } : null,
      nextA,
    };
  });
  // The next tier nearest to done, for Profile (ties go to the smaller goal). Families not started yet don't count.
  const closest = families
    .filter((f) => f.next && f.next.have > 0)
    .sort((a, b) => (b.next!.pct - a.next!.pct) || (a.nextA!.need - b.nextA!.need))[0];

  const group = GROUPS.some((g) => g.key === st.achGroup) ? st.achGroup : GROUPS[0].key;
  return {
    isAchievements: st.screen === 'achievements',
    goAchievements: () => logic.nav({ screen: 'achievements', monthOpen: false }),
    achLabel: unlocks.length.toLocaleString('en-US') + ' of ' + total.toLocaleString('en-US'),
    achPct: (unlocks.length / total) * 100,
    achLatest: unlocks.slice(-3).reverse().map(row),
    achClosest: closest ? { name: closest.next!.name, label: closest.next!.label } : null,
    achGroups: GROUPS.map((g) => {
      const fs = families.filter((f) => f.group === g.key);
      return {
        key: g.key,
        label: g.label,
        on: g.key === group,
        pick: () => logic.s({ achGroup: g.key }),
        earned: fs.reduce((n, f) => n + f.earned, 0),
        of: fs.reduce((n, f) => n + f.of, 0),
      };
    }),
    achFamilies: families.filter((f) => f.group === group).map(({ nextA: _n, ...f }) => f),
    // For the card after a session: how many are earned, and the ones earned since a count already seen.
    achCount: unlocks.length,
    achSince: (seen: number) => unlocks.slice(seen).map(row),
  };
}
