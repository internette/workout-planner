import { RANKS } from '@/frontend/shared/constants';
import { BOSS_COUNT, bossName } from '@/frontend/features/boss/bosses';

// The 2000 achievements. Each family counts one thing (workouts finished, sets, miles ridden...) and has a ladder of
// tiers along it: the first is easy, the last is for a lifetime. Nothing about them is stored: derive.ts replays every
// session to find how far each count has got, and the day each tier was reached.

/** What a family counts: a key into the counts derive.ts keeps. */
export type Stat = string;

export type Group = 'workouts' | 'sets' | 'streaks' | 'distance' | 'time' | 'calendar' | 'chronicle' | 'ranks' | 'bosses';

/** The groups, in the order the achievements screen offers them. */
export const GROUPS: { key: Group; label: string }[] = [
  { key: 'workouts', label: 'Workouts' },
  { key: 'sets', label: 'Sets' },
  { key: 'streaks', label: 'Streaks' },
  { key: 'distance', label: 'Distance' },
  { key: 'time', label: 'Time' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'chronicle', label: 'Chronicle' },
  { key: 'ranks', label: 'Ranks' },
  { key: 'bosses', label: 'Bosses' },
];

export type Family = {
  key: string;
  group: Group;
  /** Its name in the list ("Lifting"). */
  title: string;
  stat: Stat;
  /** The count each tier needs, lowest first. */
  ladder: number[];
  /** A tier's name, and what it asks for. */
  name: (n: number, i: number) => string;
  how: (n: number) => string;
};

export type Achievement = { id: string; family: Family; tier: number; need: number; name: string; how: string };

const fmt = (n: number) => n.toLocaleString('en-US');
const times = (n: number, one: string, many = one + 's') => fmt(n) + ' ' + (n === 1 ? one : many);

// Round numbers people would choose: every number to 10, then 12, 12.5, 15, 17.5, 20 … of each power of ten. A long
// ladder over a short range takes every tenth step instead, and a very short range every whole number.
const COARSE = [1, 1.2, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 7.5, 8, 9];
const FINE = Array.from({ length: 90 }, (_, i) => 1 + i / 10);
const roundNumbers = (first: number, last: number, mantissas: number[]) => {
  const out = new Set<number>();
  for (let i = first; i <= Math.min(last, 10); i++) out.add(i);
  for (let p = 10; p <= last; p *= 10) {
    for (const m of mantissas) {
      const v = Math.round(m * p * 1e6) / 1e6;
      if (Number.isInteger(v) && v >= first && v <= last) out.add(v);
    }
  }
  return [...out].sort((a, b) => a - b);
};

/** `n` round numbers from `first` to `last`, spread so each step is a little bigger than the one before. */
export function ladder(first: number, last: number, n: number): number[] {
  let pool = roundNumbers(first, last, COARSE);
  if (pool.length < n) pool = roundNumbers(first, last, FINE);
  if (pool.length < n) pool = Array.from({ length: last - first + 1 }, (_, i) => first + i);
  return Array.from({ length: n }, (_, i) => pool[Math.round((i * (pool.length - 1)) / Math.max(1, n - 1))]);
}
const upTo = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

const counted = (key: string, group: Group, title: string, stat: Stat, steps: number[], stem: string, how: (n: number) => string, unit = ''): Family => ({
  key,
  group,
  title,
  stat,
  ladder: steps,
  name: (n) => stem + ' ' + fmt(n) + unit,
  how,
});

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const MOODS = [
  { mood: 'Happy', stem: 'Sunny side' },
  { mood: 'Neutral', stem: 'Even keel' },
  { mood: 'Sad', stem: 'Rainy day' },
  { mood: 'Mad', stem: 'Thundercloud' },
];
const RPE_WORDS = ['Easy', 'Steady', 'Solid', 'Hard', 'All out'];

export const FAMILIES: Family[] = [
  // Workouts
  counted('done', 'workouts', 'Workouts', 'done', ladder(1, 20000, 60), 'Moonrise', (n) => 'Finish ' + times(n, 'workout')),
  counted('lift', 'workouts', 'Lifting', 'lift', ladder(1, 5000, 40), 'Iron', (n) => 'Finish ' + times(n, 'lifting session')),
  counted('ride', 'workouts', 'Cycling', 'ride', ladder(1, 5000, 40), 'Open road', (n) => 'Finish ' + times(n, 'ride')),
  counted('run', 'workouts', 'Run/Walk', 'run', ladder(1, 5000, 40), 'Stride', (n) => 'Finish ' + times(n, 'run or walk', 'runs or walks')),
  counted('yoga', 'workouts', 'Yoga', 'yoga', ladder(1, 5000, 40), 'Lotus', (n) => 'Finish ' + times(n, 'yoga flow')),
  counted('stretch', 'workouts', 'Stretching', 'stretch', ladder(1, 5000, 40), 'Willow', (n) => 'Finish ' + times(n, 'stretch', 'stretches')),
  counted('doubles', 'workouts', 'Double days', 'doubles', ladder(1, 2000, 30), 'Double up', (n) => 'Finish two or more workouts in a day, ' + times(n, 'time')),
  counted('comebacks', 'workouts', 'Comebacks', 'comebacks', ladder(1, 200, 20), 'Comeback', (n) => 'Come back after a week or more off, ' + times(n, 'time')),
  // Sets
  counted('sets', 'sets', 'Sets', 'sets', ladder(10, 500000, 60), 'Set stacker', (n) => 'Do ' + times(n, 'set')),
  counted('ticks', 'sets', 'Exercises done', 'ticks', ladder(5, 200000, 60), 'Checkmark', (n) => 'Tick off ' + times(n, 'exercise')),
  counted('distinct', 'sets', 'Variety', 'distinct', ladder(1, 500, 40), 'Collector', (n) => 'Do ' + times(n, 'different exercise')),
  counted('maxSets', 'sets', 'Big sessions', 'maxSets', ladder(10, 60, 20), 'Marathon session', (n) => 'Do ' + times(n, 'set') + ' in one session'),
  counted('maxTicks', 'sets', 'Full cards', 'maxTicks', ladder(3, 30, 20), 'Full card', (n) => 'Tick off ' + times(n, 'exercise') + ' in one session'),
  counted('heaviest', 'sets', 'Heaviest lift', 'heaviest', ladder(10, 1000, 50), 'Heavy lifter', (n) => 'Lift ' + fmt(n) + ' lb in a ticked exercise', ' lb'),
  // Streaks
  counted('streak', 'streaks', 'Streaks', 'streak', ladder(2, 1000, 40), 'Flame', (n) => 'Do everything planned ' + fmt(n) + ' planned days in a row'),
  counted('perfectWeeks', 'streaks', 'Perfect weeks', 'perfectWeeks', ladder(1, 1000, 50), 'Clean sweep', (n) => 'Finish every session in a week, ' + times(n, 'week')),
  counted('quests', 'streaks', 'Quests', 'quests', ladder(1, 10000, 50), 'Questkeeper', (n) => 'Clear ' + times(n, 'daily quest')),
  // Distance
  counted('rideMi', 'distance', 'Miles ridden', 'rideMi', ladder(5, 100000, 50), 'Long haul', (n) => 'Ride ' + fmt(n) + ' mi in all', ' mi'),
  counted('runMi', 'distance', 'Miles on foot', 'runMi', ladder(1, 25000, 50), 'Footfall', (n) => 'Run or walk ' + fmt(n) + ' mi in all', ' mi'),
  counted('rideLong', 'distance', 'Longest ride', 'rideLong', ladder(5, 300, 30), 'Far rider', (n) => 'Ride ' + fmt(n) + ' mi in one go', ' mi'),
  counted('runLong', 'distance', 'Longest run/walk', 'runLong', ladder(1, 100, 30), 'Far strider', (n) => 'Run or walk ' + fmt(n) + ' mi in one go', ' mi'),
  counted('elev', 'distance', 'Climbing', 'elev', ladder(100, 1000000, 40), 'Summit', (n) => 'Climb ' + fmt(n) + ' ft in all', ' ft'),
  // Time
  counted('minutes', 'time', 'Time trained', 'minutes', ladder(30, 1000000, 80), 'Hourglass', (n) => 'Train for ' + times(n, 'minute') + ' in all'),
  counted('longestMin', 'time', 'Longest session', 'longestMin', ladder(30, 600, 30), 'Endurance', (n) => 'Train for ' + times(n, 'minute') + ' in one session'),
  // Calendar
  ...WEEKDAYS.map((day, i) =>
    counted('wd' + i, 'calendar', day + 's', 'wd' + i, ladder(1, 2000, 20), day + ' regular', (n) => 'Finish ' + times(n, 'workout') + ' on a ' + day),
  ),
  ...MONTHS.map((month, i) =>
    counted('mo' + i, 'calendar', month, 'mo' + i, ladder(1, 1000, 10), month + ' glow', (n) => 'Finish ' + times(n, 'workout') + ' in ' + month),
  ),
  counted('activeMonths', 'calendar', 'Active months', 'activeMonths', ladder(1, 240, 40), 'Moon cycle', (n) => 'Work out in ' + times(n, 'month')),
  counted('bestWeek', 'calendar', 'Busiest week', 'bestWeek', ladder(2, 21, 20), 'Busy week', (n) => 'Finish ' + times(n, 'workout') + ' in one week'),
  counted('bestMonth', 'calendar', 'Busiest month', 'bestMonth', ladder(4, 80, 30), 'Big month', (n) => 'Finish ' + times(n, 'workout') + ' in one month'),
  counted('programs', 'calendar', 'Programs', 'programs', ladder(1, 100, 20), 'Graduate', (n) => 'See ' + times(n, 'program') + ' through to the end'),
  // Chronicle
  counted('notes', 'chronicle', 'Entries', 'notes', ladder(1, 5000, 50), 'Chronicler', (n) => 'Write ' + times(n, 'Chronicle entry', 'Chronicle entries')),
  ...MOODS.map(({ mood, stem }) =>
    counted('mood' + mood, 'chronicle', mood + ' days', 'mood' + mood, ladder(1, 2000, 25), stem, (n) => 'Log ' + times(n, 'entry', 'entries') + ' feeling ' + mood.toLowerCase()),
  ),
  ...RPE_WORDS.map((word, i) =>
    counted('rpe' + (i + 1), 'chronicle', word + ' efforts', 'rpe' + (i + 1), ladder(1, 1000, 10), word + ' effort', (n) => 'Log ' + times(n, 'session') + ' as ' + word.toLowerCase()),
  ),
  // Ranks
  counted('xp', 'ranks', 'XP', 'xp', ladder(100, 4000000, 100), 'Stardust', (n) => 'Earn ' + fmt(n) + ' XP', ' XP'),
  {
    key: 'rank',
    group: 'ranks',
    title: 'Ranks',
    stat: 'rank',
    ladder: upTo(RANKS.length),
    name: (n) => RANKS[n - 1].name,
    how: (n) => 'Reach rank ' + n,
  },
  // Bosses
  {
    key: 'bosses',
    group: 'bosses',
    title: 'Bosses felled',
    stat: 'bosses',
    ladder: upTo(BOSS_COUNT),
    name: (n) => bossName(n - 1).replace(/^The /, '') + ' felled',
    how: (n) => 'Beat the rank ' + n * 5 + ' boss',
  },
  counted('clean', 'bosses', 'Clean kills', 'clean', upTo(BOSS_COUNT), 'Clean kill', (n) => 'Beat ' + times(n, 'boss', 'bosses') + ' before they get away'),
  counted('swift', 'bosses', 'Swift wins', 'swift', upTo(BOSS_COUNT), 'Swift blade', (n) => 'Beat ' + times(n, 'boss', 'bosses') + ' within 3 days'),
];

export const ACHIEVEMENTS: Achievement[] = FAMILIES.flatMap((family) =>
  family.ladder.map((need, tier) => ({ id: family.key + '.' + tier, family, tier, need, name: family.name(need, tier), how: family.how(need) })),
);

/** The six brand colors, low tiers to high, ending on gold. */
const TIER_COLORS = ['pink', 'periwinkle', 'teal', 'peach', 'slate', 'gold'];
export const tierColor = (a: Achievement) => TIER_COLORS[Math.min(TIER_COLORS.length - 1, Math.floor((a.tier / a.family.ladder.length) * TIER_COLORS.length))];
