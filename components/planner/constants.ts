export const PINK = '#E1699C';
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
export const PROFILE = { name:'Mika', since:'March 2026' };
export const ICON_COLORS = ['#E1699C','#7C8FC9','#5EC4D6','#5C6684','#F0A385'];
export const TOKENS = ['star shard','moon sigil','prism','wand charge','sun ember','comet fragment','dawn ribbon','tide pearl'];
export const RANK_STEPS = [3,6,10,15,21,28,36,45,55,66,78,91,105,120,136,153,171,190,210,240];
export const RANKS = [
  { name:'First spark', next:'Novice', pill:'background:#FCE8F1;color:#c4548a', gem:'#E1699C' },
  { name:'Novice guardian', next:'Moonlit', pill:'background:#FCE8F1;color:#c4548a', gem:'#E1699C' },
  { name:'Moonlit cadet', next:'Starlit', pill:'background:#FCE8F1;color:#c4548a', gem:'#E1699C' },
  { name:'Starlit cadet', next:'Dawn', pill:'background:#FCE8F1;color:#c4548a', gem:'#E1699C' },
  { name:'Dawn sentry', next:'Twilight', pill:'background:#FCE8F1;color:#c4548a', gem:'#E1699C' },
  { name:'Twilight sentry', next:'Prism', pill:'background:#E9EEF9;color:#4C5E96', gem:'#7C8FC9' },
  { name:'Prism adept', next:'Tidecaller', pill:'background:#E9EEF9;color:#4C5E96', gem:'#7C8FC9' },
  { name:'Tidecaller adept', next:'Emberwing', pill:'background:#E9EEF9;color:#4C5E96', gem:'#7C8FC9' },
  { name:'Emberwing adept', next:'Stormveil', pill:'background:#E9EEF9;color:#4C5E96', gem:'#7C8FC9' },
  { name:'Stormveil knight', next:'Auroral', pill:'background:#E9EEF9;color:#4C5E96', gem:'#7C8FC9' },
  { name:'Auroral knight', next:'Solstice', pill:'background:#E4F4F7;color:#2F7F8C', gem:'#5EC4D6' },
  { name:'Solstice knight', next:'Mirrorheart', pill:'background:#E4F4F7;color:#2F7F8C', gem:'#5EC4D6' },
  { name:'Mirrorheart warden', next:'Nightbloom', pill:'background:#E4F4F7;color:#2F7F8C', gem:'#5EC4D6' },
  { name:'Nightbloom warden', next:'Cometfall', pill:'background:#E4F4F7;color:#2F7F8C', gem:'#5EC4D6' },
  { name:'Cometfall warden', next:'Eclipse', pill:'background:#E4F4F7;color:#2F7F8C', gem:'#5EC4D6' },
  { name:'Eclipse paragon', next:'Halcyon', pill:'background:#EDEFF6;color:#4A5268', gem:'#5C6684' },
  { name:'Halcyon paragon', next:'Radiant', pill:'background:#EDEFF6;color:#4A5268', gem:'#5C6684' },
  { name:'Radiant paragon', next:'Celestial', pill:'background:#EDEFF6;color:#4A5268', gem:'#5C6684' },
  { name:'Celestial vanguard', next:'Eternal', pill:'background:#EDEFF6;color:#4A5268', gem:'#5C6684' },
  { name:'Eternal sovereign', next:'the next season', pill:'background:linear-gradient(135deg,#E1699C 0%,#7C8FC9 50%,#5EC4D6 100%);color:#fff;box-shadow:0 2px 8px rgba(225,105,156,.35)', gem:'#fff' },
];

// Overlay state the edit screens accumulate; once a save lands in the database it is dropped.
export const EDIT_OVERLAYS = { renames:null, fields:null, removed:null, areas:null, icons:null, iconColors:null, exIcons:null,
  extra:null, repeat:false, rDist:null, rElev:null, rHrs:null, rMins:null, rZone:null,
  aDist:null, aElev:null, aHrs:null, aMins:null, editKey:null };
