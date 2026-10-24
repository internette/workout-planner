import { MON3 } from '@/frontend/shared/constants';
import { idOf, plural } from '@/frontend/shared/helpers';
import type { Ctx } from '../planner/store/types';
import { CHALLENGE_BONUS, CHALLENGE_XP, weekOf, type Challenge, type ChallengeWeek } from './derive';

const WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dateOf = (day: number) => new Date(day * 864e5);
const fmt = (n: number) => n.toLocaleString('en-US');

/** What a challenge asks, in full ("32 sets of Legs") and in a word or two for a list of weeks ("Legs"). */
const nameOf = (c: Challenge) => {
  switch (c.kind) {
    case 'area':
      return { name: plural(c.target, 'set') + ' of ' + c.area, short: c.area || '' };
    case 'sets':
      return { name: plural(c.target, 'set') + ' in all', short: c.target + ' sets' };
    case 'run':
      return { name: plural(c.target, 'mile') + ' of Run/Walk', short: 'Run/Walk' };
    case 'ride':
      return { name: 'Ride ' + plural(c.target, 'mile'), short: 'Ride ' + c.target + ' mi' };
    case 'workouts':
      return { name: 'Finish ' + plural(c.target, 'workout'), short: c.target + ' workouts' };
    case 'days':
      return { name: 'Work out on ' + plural(c.target, 'day'), short: c.target + ' days' };
    case 'calm':
      return { name: plural(c.target, 'yoga or stretching session'), short: c.target === 1 ? 'Yoga' : c.target + ' yoga' };
  }
};

// Weekly challenges on screen: the card on the Day view, the ones a session feeds, the week-cleared ceremony, and the
// weeks gone by on Progress.
export function challengeVals(ctx: Ctx) {
  const { challengeWeeks, challengeWeek: w, challengeToday: today, st, mi, selDay, TODAY_M, TODAY_D, actFor, instList } = ctx;
  const onToday = mi === TODAY_M && selDay === TODAY_D;
  const unit = (c: Challenge) => (c.kind === 'run' || c.kind === 'ride' ? ' mi' : '');
  const row = (c: Challenge, i: number, list: Challenge[]) => {
    const cleared = c.clearedOn != null;
    const { name } = nameOf(c);
    const left = Math.max(0, Math.round((c.target - c.done) * 10) / 10);
    return {
      key: c.kind + (c.area || '') + i,
      name,
      cleared,
      pct: Math.min(100, Math.round((c.done / Math.max(c.target, 0.1)) * 100)),
      count: cleared ? 'Done' : fmt(c.done) + ' / ' + fmt(c.target) + unit(c),
      note: cleared
        ? '+' + CHALLENGE_XP + ' XP earned ' + (c.clearedOn === today ? 'today' : WEEKDAY[dateOf(c.clearedOn!).getUTCDay()])
        : '+' + CHALLENGE_XP + ' XP · ' + fmt(left) + (unit(c) || (c.kind === 'area' || c.kind === 'sets' ? ' sets' : '')) + ' to go',
      valueText: cleared ? name + ', done' : fmt(c.done) + ' of ' + fmt(c.target) + unit(c),
      last: i === list.length - 1,
    };
  };
  const daysLeft = w ? w.start + 6 - today + 1 : 0;
  const card = w && w.list.length
    ? {
        rows: w.list.map(row),
        ends: daysLeft === 1 ? 'Ends today' : 'Ends Sat · ' + plural(daysLeft, 'day'),
        footer:
          w.list.length < 3
            ? 'Plan more this week and more challenges join in.'
            : w.full
              ? 'All three cleared: +' + w.xp + ' XP this week.'
              : 'Clear all three for a ' + CHALLENGE_BONUS + ' XP bonus. ' + w.cleared + ' of 3 so far.',
      }
    : null;

  // The challenges the open session counts toward: its body areas and sets for a lift, its miles for a run or ride,
  // and the workouts, days and yoga it adds to.
  const session = st.screen === 'detail' && onToday ? actFor(selDay) : null;
  const feeds = (c: Challenge) => {
    if (!session || c.clearedOn != null) return false;
    if (c.kind === 'run' || c.kind === 'ride') return !!session.ride && !!session.ride.run === (c.kind === 'run');
    if (c.kind === 'calm') return session.yoga || session.stretch;
    if (c.kind === 'sets') return !session.ride;
    if (c.kind === 'area') return !session.ride && instList(session.exKey, idOf(session)).some((e) => (e.areas || []).includes(c.area || ''));
    return true;
  };
  const sessionRows = w && session ? w.list.filter(feeds) : [];

  // Weeks gone by, newest first, and how many in a row (back from last week, or this one once it's full) were full.
  const past = challengeWeeks.filter((x) => x.list.length > 0);
  let inARow = 0;
  for (let i = past.length - 1; i >= 0; i--) {
    const x = past[i];
    if (x === w && !x.full) continue;
    // A week with nothing planned doesn't break the run.
    if (!x.full) break;
    inARow++;
  }
  const weekLabel = (x: ChallengeWeek) => {
    if (x.start === weekOf(today)) return 'This week';
    const d = dateOf(x.start);
    return MON3[d.getUTCMonth()] + ' ' + d.getUTCDate();
  };
  const lastFull = [...past].reverse().find((x) => x.full) ?? null;
  return {
    challengeCard: card,
    challengesOnDay: !!card && (st.screen === 'day' || st.screen === 'rest') && onToday,
    challengesOnSession: sessionRows.length > 0,
    challengeSessionRows: sessionRows.map(row),
    challengeStats: {
      has: past.length > 0,
      cleared: fmt(past.reduce((n, x) => n + x.cleared, 0)),
      full: fmt(past.filter((x) => x.full).length),
      xp: fmt(past.reduce((n, x) => n + x.xp, 0)),
      aside: inARow > 1 ? inARow + ' full weeks in a row' : inARow === 1 ? 'Last full week: ' + weekLabel(lastFull!) : '',
      weeks: past
        .slice(-6)
        .reverse()
        .map((x, i, all) => ({
          key: x.start,
          label: weekLabel(x),
          what: x.list.map((c) => nameOf(c).short).join(', '),
          dots: x.list.map((c, j) => ({ key: j, on: c.clearedOn != null })),
          aria: x.cleared + ' of ' + x.list.length + ' cleared',
          last: i === all.length - 1,
        })),
    },
    // For the week-cleared ceremony (in Planner.tsx), played once a week.
    challengeFullKey: lastFull ? lastFull.start : null,
    challengeFull: lastFull
      ? {
          eyebrow: 'Week of ' + MON3[dateOf(lastFull.start).getUTCMonth()] + ' ' + dateOf(lastFull.start).getUTCDate(),
          line: (() => {
            const spare = lastFull.start + 6 - Math.max(...lastFull.list.map((c) => c.clearedOn!));
            return spare > 1 ? 'All three challenges, with ' + spare + ' days to spare.' : spare === 1 ? 'All three challenges, with a day to spare.' : 'All three challenges, right at the wire.';
          })(),
          rows: lastFull.list.map((c, i) => ({ key: i, name: nameOf(c).name, xp: '+' + CHALLENGE_XP + ' XP' })),
          bonus: '+' + CHALLENGE_BONUS + ' XP',
          total: fmt(lastFull.xp) + ' XP this week',
        }
      : null,
  };
}
