import { RANKS } from '@/frontend/shared/constants';

// Boss battles: every fifth rank (5, 10 … 200) a boss stands in the way, and the rank after it stays locked until
// the boss is beaten. Each set ticked hits it for 10, and a finished workout lands a finishing blow. A boss not
// beaten in a week gets away and comes back at full strength for another week.

export const BOSS_NAMES = [
  'The Hollow Moon',
  'The Storm Wyrm',
  'The Comet Hound',
  'The Eclipse Maw',
  'The Radiant Golem',
  'The Crescent Tyrant',
  'The Tide Leviathan',
  'The Ember Seraph',
  'The Frost Chimera',
  'The Dusk Basilisk',
  'The Prism Sphinx',
  'The Thorn Colossus',
  'The Nebula Kraken',
  'The Ash Phoenix',
  'The Mirror Wraith',
  'The Gale Griffin',
  'The Obsidian Hydra',
  'The Aurora Stag',
  'The Iron Manticore',
  'The Velvet Shade',
  'The Quartz Titan',
  'The Cinder Drake',
  'The Silent Owl',
  'The Rift Serpent',
  'The Halo Warden',
  'The Bramble King',
  'The Starfall Bear',
  'The Lantern Witch',
  'The Abyss Eel',
  'The Gilded Lion',
  'The Thunder Ram',
  'The Shroud Moth',
  'The Coral Dragon',
  'The Solar Djinn',
  'The Glacier Wolf',
  'The Void Heron',
  'The Twin Gorgons',
  'The Night Mare',
  'The Dawn Leviathan',
  'The Last Eclipse',
] as const;

/** Every boss sits at a rank (an index into RANKS): the 5th, the 10th, and so on. */
export const BOSS_EVERY = 5;
export const BOSS_COUNT = Math.floor(RANKS.length / BOSS_EVERY);
export const bossRank = (k: number) => k * BOSS_EVERY + BOSS_EVERY - 1;
/** About three workouts for the first; each one after has a little more. */
export const bossHp = (k: number) => 600 + 25 * k;
/** Days to beat a boss before it gets away. */
export const BOSS_DAYS = 7;
/** What a set hits for, and a finished workout's finishing blow. */
export const SET_DAMAGE = 10;
export const FINISH_DAMAGE = 50;
/** Bonus XP for beating a boss. */
export const BOSS_XP = 250;

export const bossName = (k: number) => BOSS_NAMES[k] ?? 'The Nameless One';
