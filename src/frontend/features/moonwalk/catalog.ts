// Moonwalk's collection: the Finds a Run/Walk or Cycling session can turn up, kept in the Starbook. 12 sets of 27,
// 324 in all. Each set has 16 Common, 6 Bright, 4 Rare and 1 Lunar, in that order. The Finds themselves are designed
// later. Until then each has a placeholder name and is drawn by its rarity's shape (FindGlyph).
//
// A set turns up more when its moment fits the walk: the time of day, the season, a long walk, new streets or a boss
// fight. Nothing here needs a map service: the phone knows all of it.

export type Rarity = 'common' | 'bright' | 'rare' | 'lunar';

export const RARITIES: { key: Rarity; label: string; color: 'slate' | 'teal' | 'periwinkle' | 'gold'; perSet: number }[] = [
  { key: 'common', label: 'Common', color: 'slate', perSet: 16 },
  { key: 'bright', label: 'Bright', color: 'teal', perSet: 6 },
  { key: 'rare', label: 'Rare', color: 'periwinkle', perSet: 4 },
  { key: 'lunar', label: 'Lunar', color: 'gold', perSet: 1 },
];
export const PER_SET = RARITIES.reduce((n, r) => n + r.perSet, 0);

/** What a walk is like, for which sets it favors. */
export type Moment = {
  hour: number; // 0–23, local time
  month: number; // 0–11
  miles: number; // how far the session went
  ride: boolean; // cycling, not a run or walk
  newShare: number; // the share of its distance on streets never walked before, 0–1
  bossFight: boolean;
};

export type FindSet = { key: string; name: string; hint: string; fits: (m: Moment) => boolean };

const winter = (m: Moment) => m.month === 11 || m.month <= 1;

export const SETS: FindSet[] = [
  { key: 'wayfarer', name: 'Wayfarer', hint: 'Turns up on any walk or ride', fits: () => true },
  { key: 'dawn', name: 'Dawn Meadow', hint: 'Out before 9 am', fits: (m) => m.hour >= 4 && m.hour < 9 },
  { key: 'sunlit', name: 'Sunlit Path', hint: 'Out in the middle of the day', fits: (m) => m.hour >= 9 && m.hour < 16 },
  { key: 'dusk', name: 'Dusk Garden', hint: 'Out in the late afternoon', fits: (m) => m.hour >= 16 && m.hour < 19 },
  { key: 'lantern', name: 'Lantern Street', hint: 'Out after dark', fits: (m) => m.hour >= 19 || m.hour < 4 },
  { key: 'frost', name: 'Frost Hollow', hint: 'December to February', fits: winter },
  { key: 'bloom', name: 'Bloom Field', hint: 'March to May', fits: (m) => m.month >= 2 && m.month <= 4 },
  { key: 'ember', name: 'Ember Path', hint: 'June to August', fits: (m) => m.month >= 5 && m.month <= 7 },
  { key: 'harvest', name: 'Harvest Lane', hint: 'September to November', fits: (m) => m.month >= 8 && m.month <= 10 },
  { key: 'long', name: 'Long Road', hint: 'Walks over 3 mi, rides over 10 mi', fits: (m) => m.miles >= (m.ride ? 10 : 3) },
  { key: 'uncharted', name: 'Uncharted', hint: 'Streets you’ve never walked', fits: (m) => m.newShare >= 0.25 },
  { key: 'comet', name: 'Comet Field', hint: 'While a boss fight is on', fits: (m) => m.bossFight },
];

export type Find = { id: number; set: number; no: number; rarity: Rarity; name: string };

/** Every Find, by id: set by set, and in each set its Commons, Brights, Rares, then its Lunar. */
export const FINDS: Find[] = SETS.flatMap((s, set) => {
  let no = 0;
  return RARITIES.flatMap((r) =>
    Array.from({ length: r.perSet }, () => {
      no++;
      return { id: set * PER_SET + no - 1, set, no, rarity: r.key, name: s.name + ' No. ' + String(no).padStart(2, '0') };
    }),
  );
});
export const FIND_COUNT = FINDS.length;

export const rarityOf = (k: Rarity) => RARITIES.find((r) => r.key === k)!;
