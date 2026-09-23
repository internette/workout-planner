import { colors } from '@/components/ui/colors';

export const PINK = 'var(--color-pink)';
export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
export const MON3 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const DOW1 = ['S','M','T','W','T','F','S'];
export const DOW3 = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
export const DOWFULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export const QUESTS = [
  { title:'Hold the barrier', note:'Finish today\'s session and nothing gets through.',
    done:'The barrier held. Nothing got through.' },
  { title:'Drive back the shadow', note:'Every set you finish pushes it further out of the city.',
    done:'The shadow is out of the city.' },
  { title:'Reach the next gate', note:'Three sessions this week opens the way forward.',
    done:'You reached the gate. The way is open.' },
  { title:'Answer the call', note:'Someone out there is counting on you showing up today.',
    done:'You answered. They\'re safe because you showed up.' },
  { title:'Restore the broken sigil', note:'Log this workout to mend one more piece of it.',
    done:'Another piece of the sigil is whole again.' },
  { title:'Escort the light home', note:'Keep the streak alive and it arrives safely.',
    done:'The light made it home.' },
  { title:'Break the illusion', note:'The hard set is the one telling you it\'s impossible.',
    done:'The illusion broke. It was never impossible.' },
  { title:'Wake the sleeping ally', note:'Consistency this week brings them back to your side.',
    done:'Your ally is awake and back at your side.' },
  { title:'Climb toward the palace', note:'Each finished session is another floor cleared.',
    done:'Another floor cleared. The palace is closer.' },
  { title:'Seal the rift', note:'Two more sessions and it closes for good.',
    done:'The rift is sealed.' },
];
export const ICON_COLORS = [colors.pink, colors.periwinkle, colors.teal, colors.slate, colors.coral];
export const TOKENS = ['star shard','moon sigil','prism','wand charge','sun ember','comet fragment','dawn ribbon','tide pearl'];
export const RANK_STEPS = [3,6,10,15,21,28,36,45,55,66,78,91,105,120,136,153,171,190,210,240];
export const RANKS = [
  { name:'First spark', next:'Novice', pill:'background:var(--color-pink-tint);color:var(--color-pink-deep)', gem:'var(--color-pink)' },
  { name:'Novice guardian', next:'Moonlit', pill:'background:var(--color-pink-tint);color:var(--color-pink-deep)', gem:'var(--color-pink)' },
  { name:'Moonlit cadet', next:'Starlit', pill:'background:var(--color-pink-tint);color:var(--color-pink-deep)', gem:'var(--color-pink)' },
  { name:'Starlit cadet', next:'Dawn', pill:'background:var(--color-pink-tint);color:var(--color-pink-deep)', gem:'var(--color-pink)' },
  { name:'Dawn sentry', next:'Twilight', pill:'background:var(--color-pink-tint);color:var(--color-pink-deep)', gem:'var(--color-pink)' },
  { name:'Twilight sentry', next:'Prism', pill:'background:var(--color-periwinkle-tint);color:var(--color-periwinkle-deep)', gem:'var(--color-periwinkle)' },
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
  { name:'Celestial vanguard', next:'Eternal', pill:'background:var(--color-slate-tint);color:var(--color-slate-deep)', gem:'var(--color-slate)' },
  { name:'Eternal sovereign', next:'the next season', pill:'background:var(--gradient-gem);color:var(--color-white);box-shadow:0 2px 8px rgba(225,105,156,.35)', gem:'var(--color-white)' },
];

// Overlay state the edit screens accumulate; once a save lands in the database it is dropped.
export const EDIT_OVERLAYS = { renames:null, fields:null, removed:null, areas:null, icons:null, iconColors:null, exIcons:null,
  extra:null, repeat:false, rDist:null, rElev:null, rHrs:null, rMins:null, rZone:null,
  aDist:null, aElev:null, aHrs:null, aMins:null, editKey:null, pendingNav:null, notes:null };
