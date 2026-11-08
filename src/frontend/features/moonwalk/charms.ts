// Moonwalk's 20 charms: one-time helps crafted from Finds in the satchel, one a day. Each is in one of three tiers by
// how its recipe is found: Everyday recipes turn up whole, Hidden ones in three pages, and a Legendary one is picked
// after finishing a set of the Starbook. No recipe is known at the start.
import type { Rarity } from './catalog';

export type Tier = 'everyday' | 'hidden' | 'legendary';
export const TIERS: { key: Tier; label: string }[] = [
  { key: 'everyday', label: 'Everyday' },
  { key: 'hidden', label: 'Hidden' },
  { key: 'legendary', label: 'Legendary' },
];
/** Pages a Hidden recipe is torn into. */
export const PAGES = 3;

// What a charm does, for the derive stages that apply it and for the picker that recommends it.
export type Effect =
  | 'twin' // double one workout's XP
  | 'sun' // +50% XP on every workout that day
  | 'ward' // cover yesterday, if it was missed, for the streak
  | 'wind' // mend a streak that broke yesterday (once a month)
  | 'shift' // cover a missed day this week, once a workout is finished on the day it's used
  | 'ribbon' // cover every missed day for 7 days from the day it's used
  | 'spark' // 100 damage to the boss now, never the final 100
  | 'edge' // sets hit for 20 that day
  | 'bell' // the finishing blow lands for 150 that day
  | 'glass' // the boss stays 3 more days
  | 'banner' // the next boss win also drops a Rare
  | 'lure' // twice the glimmers that day
  | 'compass' // points to the nearest Rare glimmer that day
  | 'net' // collect from 80 m that day
  | 'seed' // that day's pouch starts with 2 stars
  | 'lucky' // that day's pouch has a Bright or better
  | 'veil' // night and dawn sets turn up at any hour that day
  | 'mirror' // copy a Bright or Rare in the satchel
  | 'ring' // trade 3 of a tier for 1 of the next
  | 'wish'; // pick a missing Find (not a Lunar)

export type Group = 'training' | 'boss' | 'walking';
export const GROUPS: { key: Group; label: string }[] = [
  { key: 'training', label: 'Training' },
  { key: 'boss', label: 'Boss battles' },
  { key: 'walking', label: 'Walking and Finds' },
];

export type Cost = {
  finds?: Partial<Record<Rarity, number>>;
  // Commons from one set, by the set's key.
  setCommons?: { set: string; n: number }[];
  charms?: string[];
};

export type Charm = {
  key: string;
  name: string;
  what: string;
  note: string;
  tier: Tier;
  group: Group;
  effect: Effect;
  cost: Cost;
  // Works right away when used (rather than on what's done that day), so it can't be changed after.
  now?: boolean;
  // The color it's drawn in.
  color: 'pink' | 'periwinkle' | 'teal' | 'gold' | 'peach' | 'slate';
};

export const CHARMS: Charm[] = [
  // Training
  { key: 'moon-shift', name: 'Moon Shift', what: 'Cover a missed day this week', note: 'Finish a workout today and a day you missed earlier this week counts as moved, not missed.', tier: 'everyday', group: 'training', effect: 'shift', cost: { finds: { common: 5, bright: 1 } }, color: 'periwinkle' },
  { key: 'twin-moon', name: 'Twin Moon', what: 'Double XP for one workout', note: 'Today’s first finished workout earns double XP. Any workout type counts.', tier: 'hidden', group: 'training', effect: 'twin', cost: { finds: { common: 8, bright: 2 } }, color: 'pink' },
  { key: 'streak-ward', name: 'Streak Ward', what: 'A skipped day keeps your streak', note: 'Covers yesterday if it went unfinished. That day doesn’t add to the streak, but it doesn’t break it either. Hold up to 2.', tier: 'hidden', group: 'training', effect: 'ward', cost: { finds: { common: 8, bright: 3, rare: 1 } }, color: 'periwinkle' },
  { key: 'sun-draught', name: 'Sun Draught', what: '+50% XP on every workout today', note: 'Made for two-a-day sessions, and built from a Twin Moon.', tier: 'legendary', group: 'training', effect: 'sun', cost: { charms: ['twin-moon'], finds: { bright: 4, rare: 2 } }, color: 'gold' },
  { key: 'second-wind', name: 'Second Wind', what: 'Mend a streak that broke yesterday', note: 'For when your ward wasn’t enough. Works only the day after the break, and once a month.', tier: 'legendary', group: 'training', effect: 'wind', cost: { charms: ['streak-ward'], finds: { rare: 3, lunar: 1 } }, color: 'teal' },
  { key: 'bookmark-ribbon', name: 'Bookmark Ribbon', what: 'Pause your streak for up to 7 days', note: 'For travel or sick days. Planned days you miss in the 7 days from today don’t break your streak.', tier: 'legendary', group: 'training', effect: 'ribbon', cost: { finds: { bright: 4, rare: 3, lunar: 1 } }, color: 'pink' },
  // Boss battles
  { key: 'comet-spark', name: 'Comet Spark', what: 'Hit the boss for 100', note: 'Lands right away. It can’t land the last 100, so a workout still has to finish the fight.', tier: 'everyday', group: 'boss', effect: 'spark', cost: { finds: { common: 3, bright: 1 } }, now: true, color: 'teal' },
  { key: 'iron-edge', name: 'Iron Edge', what: 'Sets hit for 20 instead of 10', note: 'For today’s workouts. A heavy lifting day can take a third of a boss’s health.', tier: 'hidden', group: 'boss', effect: 'edge', cost: { finds: { common: 6, bright: 3 } }, color: 'slate' },
  { key: 'echo-bell', name: 'Echo Bell', what: 'Finishing blow lands for 150', note: 'Finishing a workout normally hits for 50. Today it hits for 150.', tier: 'hidden', group: 'boss', effect: 'bell', cost: { finds: { common: 6, bright: 2, rare: 1 } }, color: 'gold' },
  { key: 'hourglass', name: 'Hourglass', what: 'The boss stays 3 more days', note: 'So a rough week doesn’t reset the fight to full health. One per boss.', tier: 'legendary', group: 'boss', effect: 'glass', cost: { finds: { bright: 5, rare: 3 } }, now: true, color: 'gold' },
  { key: 'trophy-banner', name: 'Trophy Banner', what: 'Next boss win drops an extra Rare', note: 'Raise it during a fight. When you win, you get the boss’s Lunar plus a Rare.', tier: 'legendary', group: 'boss', effect: 'banner', cost: { charms: ['comet-spark', 'echo-bell'], finds: { rare: 2 } }, now: true, color: 'pink' },
  // Walking and Finds
  { key: 'lure-lantern', name: 'Lure Lantern', what: 'Twice the glimmers today', note: 'The cheap one, for spending spare Commons.', tier: 'everyday', group: 'walking', effect: 'lure', cost: { finds: { common: 5 } }, color: 'peach' },
  { key: 'wide-net', name: 'Wide Net', what: 'Collect from 80 m away, not 30', note: 'For today’s walks and rides. Handy on busy roads and in parks with no paths.', tier: 'everyday', group: 'walking', effect: 'net', cost: { finds: { common: 4 } }, color: 'periwinkle' },
  { key: 'seed-star', name: 'Seed Star', what: 'Today’s pouch starts with 2 stars', note: 'A short walk still opens a decent pouch.', tier: 'everyday', group: 'walking', effect: 'seed', cost: { finds: { common: 5, bright: 1 } }, color: 'gold' },
  { key: 'lucky-pebble', name: 'Lucky Pebble', what: 'Today’s pouch has a Bright or better', note: 'One Find in today’s pouch is Bright, Rare or Lunar.', tier: 'everyday', group: 'walking', effect: 'lucky', cost: { finds: { common: 6 } }, color: 'teal' },
  { key: 'alchemist-ring', name: 'Alchemist Ring', what: 'Trade 3 of a tier for 1 of the next', note: '3 Common become a Bright, or 3 Bright become a Rare. Never a Lunar.', tier: 'everyday', group: 'walking', effect: 'ring', cost: { finds: { common: 2 } }, now: true, color: 'gold' },
  { key: 'star-compass', name: 'Star Compass', what: 'Points to the nearest Rare glimmer', note: 'Today, the map points to a Rare glimmer within half a mile, if there is one.', tier: 'hidden', group: 'walking', effect: 'compass', cost: { finds: { common: 6, bright: 3 } }, color: 'teal' },
  { key: 'dusk-veil', name: 'Dusk Veil', what: 'Night and dawn sets at any hour', note: 'Today, Lantern Street and Dawn Meadow turn up whatever the time.', tier: 'hidden', group: 'walking', effect: 'veil', cost: { setCommons: [{ set: 'lantern', n: 4 }, { set: 'dawn', n: 4 }], finds: { bright: 2 } }, color: 'periwinkle' },
  { key: 'mirror-shard', name: 'Mirror Shard', what: 'Copy a Bright or Rare in your satchel', note: 'Copies a satchel Find you need for a recipe. Never a Lunar.', tier: 'hidden', group: 'walking', effect: 'mirror', cost: { finds: { common: 10, rare: 1 } }, now: true, color: 'slate' },
  { key: 'wish-star', name: 'Wish Star', what: 'Pick one missing Find', note: 'Fills one missing Common, Bright or Rare in the set you choose. A Lunar still has to be found.', tier: 'legendary', group: 'walking', effect: 'wish', cost: { finds: { bright: 6, rare: 4, lunar: 1 } }, now: true, color: 'gold' },
];

export const charmByKey = (key: string) => CHARMS.find((c) => c.key === key);
/** The most Streak Wards held at once. */
export const MAX_WARDS = 2;
