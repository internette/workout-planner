// Which charm today's picker recommends: from what's planned today and whether a boss fight is on. During a fight,
// boss charms come first (rank is held at the boss, so damage can't wait but XP can). With no fight on, XP and walk
// charms come first. Each rule lists charms in order, and the first one held is recommended.
import { charmByKey, type Effect } from './charms';

export type Kind = 'lift' | 'run' | 'ride' | 'stretch' | 'yoga';
export type Day = {
  sessions: { kind: Kind; sets: number }[];
  fight: { name: string; hpLeft: number; hp: number; daysLeft: number; glassed: boolean; bannered: boolean } | null;
  /** What finishing today's plan would deal, without a charm. */
  planDamage: number;
  /** Yesterday had something planned, wasn't finished, and isn't covered. */
  yesterdayMissed: boolean;
  /** The streak a ward would keep: the days before yesterday's miss. */
  streakBefore: number;
  /** Days this week, before today, that were missed and aren't covered. */
  missedThisWeek: number;
  hour: number;
};
export type Pick = { key: string; reason: string };

const name = (key: string) => charmByKey(key)!.name;

/** Every charm worth using today, best first, each with why. */
export function recommendations(day: Day): Pick[] {
  const { sessions, fight } = day;
  const out: Pick[] = [];
  const add = (key: string, reason: string) => {
    if (!out.some((p) => p.key === key)) out.push({ key, reason });
  };
  const boss = fight ? 'the ' + fight.name : '';
  const left = fight ? fight.hpLeft.toLocaleString('en-US') + ' HP left' : '';
  const lifts = sessions.filter((s) => s.kind === 'lift');
  const sets = lifts.reduce((n, s) => n + s.sets, 0);
  const walks = sessions.some((s) => s.kind === 'run' || s.kind === 'ride');
  // A finished workout lands 50, or 150 with an Echo Bell: would that win today's fight?
  const bellWins = !!fight && fight.hpLeft <= day.planDamage + 100 * sessions.length;
  const walkWins = !!fight && fight.hpLeft <= day.planDamage + 100;

  // Checked first, any day.
  if (day.yesterdayMissed && day.streakBefore >= 3) {
    add('streak-ward', 'Yesterday wasn’t finished. A Streak Ward keeps your ' + day.streakBefore + '-day streak, and it counts as today’s charm.');
    add('second-wind', 'Yesterday wasn’t finished. A Second Wind mends your ' + day.streakBefore + '-day streak.');
  }
  if (fight && fight.daysLeft <= 2 && fight.hpLeft > fight.hp / 3 && !fight.glassed)
    add('hourglass', 'The ' + fight.name + ' gets away ' + (fight.daysLeft <= 1 ? 'after today' : 'in 2 days') + ' with ' + left + '. 3 more days to finish it.');
  if (day.missedThisWeek >= 2) {
    add('bookmark-ribbon', day.missedThisWeek + ' days missed this week. Missed days in the 7 days from today won’t break your streak.');
    add('moon-shift', day.missedThisWeek + ' days missed this week. Finish a workout today and the latest counts as moved.');
  }

  const sparkWhy = fight ? 'Hits ' + boss + ' for 100 now. It has ' + left + '.' : '';
  if (!sessions.length) {
    if (fight) add('comet-spark', 'Rest day, so ' + sparkWhy.charAt(0).toLowerCase() + sparkWhy.slice(1) + ' The fight keeps moving.');
    return out;
  }

  if (sessions.length >= 2) {
    if (fight) {
      if (lifts.length) add('iron-edge', sessions.length + ' workouts today with ' + sets + ' sets, and ' + boss + ' has ' + left + '. That’s +' + sets * 10 + ' damage.');
      add('echo-bell', sessions.length + ' workouts today, so ' + sessions.length + ' finishing blows of 150. That’s +' + sessions.length * 100 + ' damage.');
    }
    add('sun-draught', sessions.length + ' workouts today, and each earns half again its XP.');
    add('twin-moon', 'Doubles the XP of today’s first finished workout.');
  }

  const kind = sessions[0].kind;
  if (fight) {
    if (kind === 'lift' && sets >= 12) add('iron-edge', 'Lifting day with ' + sets + ' sets, and ' + boss + ' has ' + left + '. That’s +' + sets * 10 + ' damage.');
    if (bellWins) add('echo-bell', 'A 150 finishing blow could win the fight today: ' + boss + ' has ' + left + '.');
    if (walks && walkWins) add('trophy-banner', 'This ' + (kind === 'ride' ? 'ride' : 'walk') + ' could win the fight. Raise it and the win drops a Rare as well as the Lunar.');
    if (kind !== 'lift') add('echo-bell', 'A ' + (kind === 'run' ? 'walk' : kind === 'ride' ? 'ride' : 'session') + ' only lands the finishing blow. Today it lands 150 instead of 50.');
    add('comet-spark', sparkWhy);
    add('echo-bell', 'Finishing today’s workout hits ' + boss + ' for 150 instead of 50.');
  } else {
    if (kind === 'lift') {
      add('twin-moon', 'Lifting day with no boss fight, so XP comes first. Doubles today’s first finished workout.');
      add('moon-shift', 'Rather do it another day? Finish a workout later this week and today counts as moved.');
    } else if (kind === 'run' || kind === 'ride') {
      const what = kind === 'ride' ? 'Ride' : 'Walk';
      add('star-compass', what + ' day with no boss fight, so it leans toward Finds. Points to the nearest Rare glimmer.');
      if (day.hour >= 9 && day.hour < 16) add('dusk-veil', 'It’s midday, when Lantern Street and Dawn Meadow don’t turn up. Today they do.');
      add('seed-star', what + ' day with no boss fight. Today’s pouch starts with 2 stars, so a short one still opens a decent pouch.');
      add('lure-lantern', what + ' day with no boss fight. Twice the glimmers on today’s map.');
      add('wide-net', what + ' day with no boss fight. Collect glimmers from 80 m away.');
      add('lucky-pebble', what + ' day with no boss fight. Today’s pouch has a Bright or better.');
    }
    add('twin-moon', 'Doubles the XP of today’s first finished workout.');
  }
  // Walk charms still help on any Run/Walk or Cycling day, fight or not.
  if (walks) ['star-compass', 'seed-star', 'lure-lantern', 'wide-net', 'lucky-pebble'].forEach((k) => add(k, charmByKey(k)!.what + ' on today’s ' + (kind === 'ride' ? 'ride' : 'walk') + '.'));
  // Only lifting sets hit the boss, so Iron Edge is never offered without a lifting session.
  return out.filter((p) => p.key !== 'iron-edge' || lifts.length > 0);
}

/** Why a held charm can't be used today, or '' if it can. */
export function cantUse(effect: Effect, day: Day, extra: { brightOrRare: boolean; ringable: boolean; windThisMonth: boolean; wishable: boolean }): string {
  const f = day.fight;
  switch (effect) {
    case 'ward':
      return day.yesterdayMissed ? '' : 'Only for a day you missed yesterday.';
    case 'wind':
      return !day.yesterdayMissed ? 'Only the day after your streak breaks.' : extra.windThisMonth ? 'Once a month, and this month’s is used.' : '';
    case 'shift':
      return day.missedThisWeek ? '' : 'No missed days this week to cover.';
    case 'spark':
    case 'banner':
      return f ? (effect === 'banner' && f.bannered ? 'Already raised in this fight.' : '') : 'Only during a boss fight.';
    case 'glass':
      return !f ? 'Only during a boss fight.' : f.glassed ? 'One per boss, and this one has had it.' : '';
    case 'edge':
      return day.sessions.some((s) => s.kind === 'lift') ? '' : 'Only lifting sets hit harder, and nothing is lifting today.';
    case 'mirror':
      return extra.brightOrRare ? '' : 'Needs a Bright or Rare in your satchel to copy.';
    case 'ring':
      return extra.ringable ? '' : 'Needs 3 Common or 3 Bright in your satchel.';
    case 'wish':
      return extra.wishable ? '' : 'Every Common, Bright and Rare is found.';
    default:
      return '';
  }
}

export { name as charmName };
