import { colors } from '@moonshot/design-system/colors';

export const ACCENT = 'var(--color-pink)';
export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const MON3 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
// How long a workout is when nothing says otherwise.
export const LIFT_MINUTES = 50;
export const RIDE_MINUTES = 45;
export const DOW1 = ['S','M','T','W','T','F','S'];
export const DOW3 = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
export const DOWFULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
// The body regions an exercise can target. A workout's own target areas are the union of its exercises'.
export const TARGET_AREAS = ['Core', 'Arms', 'Back', 'Legs', 'Chest', 'Shoulders'];
// What an exercise can need, in groups, in the order the app lists them. An exercise with none is bodyweight.
export const EQUIPMENT_GROUPS: { label: string; items: string[] }[] = [
  { label: 'Free weights', items: ['Dumbbells', 'Barbell', 'EZ bar', 'Kettlebell', 'Weight plate'] },
  { label: 'Stations', items: ['Cable machine', 'Lat pulldown / row', 'Pull-up bar', 'Squat rack', 'Glute-ham developer'] },
  { label: 'Machines', items: ['Leg press', 'Leg extension / curl', 'Chest press', 'Pec deck', 'Shoulder press', 'Preacher curl'] },
  { label: 'Other', items: ['Bench', 'Plyo box', 'Resistance band', 'Stability ball'] },
];
export const EQUIPMENT = EQUIPMENT_GROUPS.flatMap((g) => g.items);

export const QUESTS = [
  { title:'Hold the barrier', note:'Hold your ground to the very end. Nothing gets past you.',
    done:'The barrier held. Nothing got through.' },
  { title:'Drive back the shadow', note:'Each push drives it further out of the city.',
    done:'The shadow is out of the city.' },
  { title:'Reach the next gate', note:'It only opens for someone who finishes what they started.',
    done:'You reached the gate. The way is open.' },
  { title:'Answer the call', note:'Someone out there is counting on you showing up.',
    done:'You answered. They\'re safe because you showed up.' },
  { title:'Restore the broken sigil', note:'Everything you finish sets a shard back in place. See it through.',
    done:'Another piece of the sigil is whole again.' },
  { title:'Escort the light home', note:'It\'s a long road. Stay with it to the end and the light gets home.',
    done:'The light made it home.' },
  { title:'Break the illusion', note:'The hardest part is the one telling you it\'s impossible.',
    done:'The illusion broke. It was never impossible.' },
  { title:'Wake the sleeping ally', note:'They\'re listening for you. Don\'t stop halfway.',
    done:'Your ally is awake and back at your side.' },
  { title:'Climb toward the palace', note:'One finished session, one more floor behind you.',
    done:'Another floor cleared. The palace is closer.' },
  { title:'Seal the rift', note:'Close it the only way it closes: finish everything on the plan.',
    done:'The rift is sealed.' },
];
export const ICON_COLORS = [colors.pink, colors.periwinkle, colors.teal, colors.slate, colors.peach];
// What the icon and color choices are called, for screen readers.
export const ICON_COLOR_NAMES = ['Pink', 'Periwinkle', 'Teal', 'Slate', 'Peach'];
export const ICON_NAMES: Record<string, string> = {
  h: 'Dumbbell',
  v: 'Upright dumbbell',
  d: 'Small dumbbell',
  bike: 'Bike',
  flower: 'Lotus flower',
  lunge: 'Lunge',
  run: 'Runner',
};
// The XP each rank after the first is reached at, the last being the top rank's own bar. Each step costs a fixed share
// more than the one before (exponential): the first 300 XP (about three sessions), each next one RANK_GROWTH times
// the last through the first nineteen steps (up to 46,400 XP, where the old twenty-rank ladder topped out), then
// RANK_GROWTH_LATE times the last, so the 180 ranks above keep getting steeper without running off to the trillions.
// Rounded to 50.
export const RANK_GROWTH = 1.2;
export const RANK_GROWTH_LATE = 1.01;
const RANK_STEP = (k: number) => (k < 19 ? 300 * RANK_GROWTH ** k : 300 * RANK_GROWTH ** 18 * RANK_GROWTH_LATE ** (k - 18));
// Above Celestial champion, 180 more ranks before Eternal sovereign, in tiers of five that share a title. The tiers walk
// every brand color in turn (pink, periwinkle, teal, peach, gold, then slate), six times round. Each name's first word is
// what the rank before it calls it in "On to …".
const RANK_TIER_COLORS = ['pink', 'periwinkle', 'teal', 'peach', 'gold', 'slate'];
const RANK_TIER_TITLES = [
  'herald', 'sentinel', 'vanguard', 'ranger', 'oracle', 'mystic',
  'conjurer', 'luminary', 'templar', 'oathkeeper', 'paladin', 'crusader',
  'seer', 'marshal', 'sage', 'arbiter', 'magus', 'archon',
  'seraph', 'lancer', 'valkyrie', 'hierophant', 'archmage', 'elder',
  'virtuoso', 'exemplar', 'avatar', 'hero', 'legend', 'regent',
  'monarch', 'titan', 'ascendant', 'demigod', 'immortal', 'sovereign',
];
const RANK_TIER_NAMES = [
  'Crescent', 'Dewdrop', 'Petal', 'Ribbon', 'Lantern',
  'Moonbeam', 'Bluebell', 'Glimmer', 'Wishing', 'Nightjar',
  'Seafoam', 'Riverglass', 'Frostfern', 'Mistral', 'Brightwater',
  'Sunpetal', 'Coral', 'Apricot', 'Hearthglow', 'Kindled',
  'Goldleaf', 'Honeycomb', 'Marigold', 'Gilded', 'Sunspire',
  'Duskwind', 'Ironbloom', 'Stoneheart', 'Moonstone', 'Ashen',
  'Blossom', 'Cherrybrook', 'Rosewind', 'Heartsong', 'Peony',
  'Skyward', 'Lavender', 'Nightingale', 'Starwell', 'Bluemoon',
  'Tidewater', 'Lagoon', 'Glacier', 'Seaglass', 'Pearlshell',
  'Sunset', 'Flamelily', 'Rosegold', 'Duskfire', 'Bonfire',
  'Sunburst', 'Goldcrest', 'Saffron', 'Lionheart', 'Crowned',
  'Granite', 'Thunder', 'Cloudpiercer', 'Obsidian', 'Ravenwing',
  'Camellia', 'Sweetbriar', 'Lovebird', 'Rosethorn', 'Wildrose',
  'Starfall', 'Moonwell', 'Dreamweave', 'Skylark', 'Nightsong',
  'Coralreef', 'Wavecrest', 'Rainfall', 'Moonpool', 'Icebound',
  'Embertide', 'Amberfall', 'Sunkissed', 'Firefly', 'Hearthstone',
  'Sunfire', 'Goldenhour', 'Brightcrown', 'Honeylight', 'Dawnfire',
  'Stormcloud', 'Ironclad', 'Shadowmere', 'Flint', 'Galeforce',
  'Rosefall', 'Cherryfire', 'Heartlight', 'Rosemoon', 'Petalstorm',
  'Lunaris', 'Moonrise', 'Starlight', 'Nebula', 'Dreamshore',
  'Abyssal', 'Riptide', 'Frostfire', 'Tidebound', 'Maelstrom',
  'Sunflare', 'Kindlewing', 'Apricity', 'Phoenix', 'Wildfire',
  'Solaris', 'Goldenstar', 'Sunforged', 'Gildwing', 'Lionsmane',
  'Thundercrown', 'Stormforged', 'Silverstorm', 'Steelheart', 'Moonshadow',
  'Roseheart', 'Starblossom', 'Lovesong', 'Heartflame', 'Rosecrown',
  'Moonsong', 'Stardust', 'Skyforged', 'Constellation', 'Moonveil',
  'Starsea', 'Oceanheart', 'Glacial', 'Tidecrown', 'Deepwater',
  'Sunrise', 'Embercrown', 'Flameheart', 'Sunwake', 'Dawnstar',
  'Goldenheart', 'Sunlit', 'Starforged', 'Goldwing', 'Sunshard',
  'Tempest', 'Stormbringer', 'Cragborn', 'Nightfall', 'Ironstar',
  'Lovelight', 'Rosestar', 'Heartbound', 'Sakura', 'Rosedawn',
  'Starcrown', 'Moonheart', 'Starhaven', 'Starward', 'Nightcrown',
  'Tidesong', 'Seaborn', 'Aquamarine', 'Wavebreaker', 'Oceancrown',
  'Sunsoul', 'Firecrown', 'Brightflame', 'Sunheart', 'Phoenixfire',
  'Goldsoul', 'Suncrown', 'Starcrest', 'Aureate', 'Sunthrone',
  'Moonlord', 'Stormcrown', 'Evernight', 'Everlight', 'Ageless',
].map((word, i) => word + ' ' + RANK_TIER_TITLES[Math.floor(i / 5)]);
const tierLook = (color: string) => ({
  // Slate has no deep shade: its own color is the text on its tint, as for the original slate tier.
  pill: { background: `var(--color-${color}-tint)`, color: color === 'slate' ? 'var(--color-slate)' : `var(--color-${color}-deep)` },
  gem: `var(--color-${color})`,
});
type Rank = { name: string; next: string; pill: Record<string, string>; gem: string };
export const RANKS: Rank[] = [
  { name:'First spark', next:'Novice', pill:{ background:'var(--color-pink-tint)', color:'var(--color-pink-deep)' }, gem:'var(--color-pink)' },
  { name:'Novice guardian', next:'Moonlit', pill:{ background:'var(--color-pink-tint)', color:'var(--color-pink-deep)' }, gem:'var(--color-pink)' },
  { name:'Moonlit apprentice', next:'Starlit', pill:{ background:'var(--color-pink-tint)', color:'var(--color-pink-deep)' }, gem:'var(--color-pink)' },
  { name:'Starlit apprentice', next:'Dawn', pill:{ background:'var(--color-pink-tint)', color:'var(--color-pink-deep)' }, gem:'var(--color-pink)' },
  { name:'Dawn guardian', next:'Twilight', pill:{ background:'var(--color-pink-tint)', color:'var(--color-pink-deep)' }, gem:'var(--color-pink)' },
  { name:'Twilight guardian', next:'Prism', pill:{ background:'var(--color-periwinkle-tint)', color:'var(--color-periwinkle-deep)' }, gem:'var(--color-periwinkle)' },
  { name:'Prism adept', next:'Tidecaller', pill:{ background:'var(--color-periwinkle-tint)', color:'var(--color-periwinkle-deep)' }, gem:'var(--color-periwinkle)' },
  { name:'Tidecaller adept', next:'Emberwing', pill:{ background:'var(--color-periwinkle-tint)', color:'var(--color-periwinkle-deep)' }, gem:'var(--color-periwinkle)' },
  { name:'Emberwing adept', next:'Stormveil', pill:{ background:'var(--color-periwinkle-tint)', color:'var(--color-periwinkle-deep)' }, gem:'var(--color-periwinkle)' },
  { name:'Stormveil knight', next:'Auroral', pill:{ background:'var(--color-periwinkle-tint)', color:'var(--color-periwinkle-deep)' }, gem:'var(--color-periwinkle)' },
  { name:'Auroral knight', next:'Solstice', pill:{ background:'var(--color-teal-tint)', color:'var(--color-teal-deep)' }, gem:'var(--color-teal)' },
  { name:'Solstice knight', next:'Mirrorheart', pill:{ background:'var(--color-teal-tint)', color:'var(--color-teal-deep)' }, gem:'var(--color-teal)' },
  { name:'Mirrorheart warden', next:'Nightbloom', pill:{ background:'var(--color-teal-tint)', color:'var(--color-teal-deep)' }, gem:'var(--color-teal)' },
  { name:'Nightbloom warden', next:'Cometfall', pill:{ background:'var(--color-teal-tint)', color:'var(--color-teal-deep)' }, gem:'var(--color-teal)' },
  { name:'Cometfall warden', next:'Eclipse', pill:{ background:'var(--color-teal-tint)', color:'var(--color-teal-deep)' }, gem:'var(--color-teal)' },
  { name:'Eclipse paragon', next:'Halcyon', pill:{ background:'var(--color-slate-tint)', color:'var(--color-slate)' }, gem:'var(--color-slate)' },
  { name:'Halcyon paragon', next:'Radiant', pill:{ background:'var(--color-slate-tint)', color:'var(--color-slate)' }, gem:'var(--color-slate)' },
  { name:'Radiant paragon', next:'Celestial', pill:{ background:'var(--color-slate-tint)', color:'var(--color-slate)' }, gem:'var(--color-slate)' },
  { name:'Celestial champion', next:'Crescent', pill:{ background:'var(--color-slate-tint)', color:'var(--color-slate)' }, gem:'var(--color-slate)' },
  ...RANK_TIER_NAMES.map((name, i) => ({
    name,
    next: (RANK_TIER_NAMES[i + 1] ?? 'Eternal').split(' ')[0],
    ...tierLook(RANK_TIER_COLORS[Math.floor(i / 5) % RANK_TIER_COLORS.length]),
  })),
  { name:'Eternal sovereign', next:'the next season', pill:{ background:'var(--gradient-gem)', color:'var(--color-surface)', boxShadow:'0 2px 8px color-mix(in srgb, var(--color-pink) var(--alpha-4), transparent)' }, gem:'white' },
];
export const RANK_XP = RANKS.map((_, i) =>
  Math.round(Array.from({ length: i + 1 }, (_, k) => RANK_STEP(k)).reduce((a, b) => a + b, 0) / 50) * 50,
);

// Overlay state the edit screens accumulate; once a save lands in the database it is dropped.
export const EDIT_OVERLAYS = { renames:null, fields:null, removed:null, icons:null, iconColors:null, exIcons:null,
  extra:null, repeat:false, repeatDays:null, repeatWeeks:null, rDist:null, rElev:null, rHrs:null, rMins:null, rZone:null, rRun:null,
  aDist:null, aElev:null, aHrs:null, aMins:null, editKey:null, editId:null, pendingNav:null, notes:null, editDone:null,
  logDone:null, exOrder:null, exRenames:null, workoutKinds:null, warmups:null, retype:null,
  undoRemove:null, addNote:null, sideSplit:null };

// Leaves the new-workout form: nothing of it carried into the next one.
export const NEW_WORKOUT_CLEARED = { creating:false, newType:null, newName:'', newFrom:null, schedule:null };
// Leaves the exercise form without saving.
export const EX_DRAFT_CLEARED = { exDraft:null, exDraftOrig:null, exEditNav:false, exCopy:false };

// Where Back goes from a screen with nothing before it: its section's own page (the calendar otherwise).
export const HOME_OF: Record<string, 'arsenal' | 'diaryList' | 'profile'> = {
  settings: 'profile',
  template: 'arsenal',
  exercise: 'arsenal',
  exerciseEdit: 'arsenal',
  program: 'arsenal',
  programEdit: 'arsenal',
  programScan: 'arsenal',
  programRuns: 'profile',
  programRun: 'profile',
  diary: 'diaryList',
  newEntry: 'diaryList',
};
