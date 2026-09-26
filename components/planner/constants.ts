import { colors } from '@/components/ui/colors';

export const PINK = 'var(--color-pink)';
export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const MON3 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
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
export const ICON_COLORS = [colors.pink, colors.periwinkle, colors.teal, colors.slate, colors.coral];
// What the icon and colour choices are called, for screen readers.
export const ICON_COLOR_NAMES = ['Pink', 'Periwinkle', 'Teal', 'Slate', 'Coral'];
export const ICON_NAMES: Record<string, string> = { h: 'Dumbbell', v: 'Upright dumbbell', d: 'Small dumbbell', bike: 'Bike' };
export const RANK_STEPS = [3,6,10,15,21,28,36,45,55,66,78,91,105,120,136,153,171,190,210,240];
export const RANKS = [
  { name:'First spark', next:'Novice', pill:'background:var(--color-pink-tint);color:var(--color-pink-deep)', gem:'var(--color-pink)' },
  { name:'Novice guardian', next:'Moonlit', pill:'background:var(--color-pink-tint);color:var(--color-pink-deep)', gem:'var(--color-pink)' },
  { name:'Moonlit apprentice', next:'Starlit', pill:'background:var(--color-pink-tint);color:var(--color-pink-deep)', gem:'var(--color-pink)' },
  { name:'Starlit apprentice', next:'Dawn', pill:'background:var(--color-pink-tint);color:var(--color-pink-deep)', gem:'var(--color-pink)' },
  { name:'Dawn guardian', next:'Twilight', pill:'background:var(--color-pink-tint);color:var(--color-pink-deep)', gem:'var(--color-pink)' },
  { name:'Twilight guardian', next:'Prism', pill:'background:var(--color-periwinkle-tint);color:var(--color-periwinkle-deep)', gem:'var(--color-periwinkle)' },
  { name:'Prism adept', next:'Tidecaller', pill:'background:var(--color-periwinkle-tint);color:var(--color-periwinkle-deep)', gem:'var(--color-periwinkle)' },
  { name:'Tidecaller adept', next:'Emberwing', pill:'background:var(--color-periwinkle-tint);color:var(--color-periwinkle-deep)', gem:'var(--color-periwinkle)' },
  { name:'Emberwing adept', next:'Stormveil', pill:'background:var(--color-periwinkle-tint);color:var(--color-periwinkle-deep)', gem:'var(--color-periwinkle)' },
  { name:'Stormveil knight', next:'Auroral', pill:'background:var(--color-periwinkle-tint);color:var(--color-periwinkle-deep)', gem:'var(--color-periwinkle)' },
  { name:'Auroral knight', next:'Solstice', pill:'background:var(--color-teal-tint);color:var(--color-teal-deep)', gem:'var(--color-teal)' },
  { name:'Solstice knight', next:'Mirrorheart', pill:'background:var(--color-teal-tint);color:var(--color-teal-deep)', gem:'var(--color-teal)' },
  { name:'Mirrorheart warden', next:'Nightbloom', pill:'background:var(--color-teal-tint);color:var(--color-teal-deep)', gem:'var(--color-teal)' },
  { name:'Nightbloom warden', next:'Cometfall', pill:'background:var(--color-teal-tint);color:var(--color-teal-deep)', gem:'var(--color-teal)' },
  { name:'Cometfall warden', next:'Eclipse', pill:'background:var(--color-teal-tint);color:var(--color-teal-deep)', gem:'var(--color-teal)' },
  { name:'Eclipse paragon', next:'Halcyon', pill:'background:var(--color-slate-tint);color:var(--color-slate-deep)', gem:'var(--color-slate)' },
  { name:'Halcyon paragon', next:'Radiant', pill:'background:var(--color-slate-tint);color:var(--color-slate-deep)', gem:'var(--color-slate)' },
  { name:'Radiant paragon', next:'Celestial', pill:'background:var(--color-slate-tint);color:var(--color-slate-deep)', gem:'var(--color-slate)' },
  { name:'Celestial champion', next:'Eternal', pill:'background:var(--color-slate-tint);color:var(--color-slate-deep)', gem:'var(--color-slate)' },
  { name:'Eternal sovereign', next:'the next season', pill:'background:var(--gradient-gem);color:var(--color-on-accent);box-shadow:0 2px 8px color-mix(in srgb, var(--color-pink) 35%, transparent)', gem:'var(--color-white)' },
];

// Overlay state the edit screens accumulate; once a save lands in the database it is dropped.
export const EDIT_OVERLAYS = { renames:null, fields:null, removed:null, icons:null, iconColors:null, exIcons:null,
  extra:null, repeat:false, rDist:null, rElev:null, rHrs:null, rMins:null, rZone:null,
  aDist:null, aElev:null, aHrs:null, aMins:null, editKey:null, editId:null, pendingNav:null, notes:null, editDone:null,
  logDone:null, exOrder:null, warmups:null };

// Where Back goes from a screen with nothing before it: its section's own page (the calendar otherwise).
export const HOME_OF: Record<string, string> = {
  template: 'arsenal',
  exercise: 'arsenal',
  exerciseEdit: 'arsenal',
  diary: 'diaryList',
  newEntry: 'diaryList',
};
