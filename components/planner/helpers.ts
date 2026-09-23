import { QUESTS, TOKENS } from './constants';

export const questFor = seed => QUESTS[Math.abs(Math.round(seed)) % QUESTS.length];
export const questSeed = (day, month) => questFor(day * 3 + month);
export const tokenFor = seed => TOKENS[Math.abs(Math.round(seed)) % TOKENS.length];
export const CAT = n => n.indexOf('Push')>-1 ? 'Push' : n.indexOf('Pull')>-1 ? 'Pull' : n.indexOf('Leg')>-1 ? 'Legs' : 'Core';
export const idOf = av => (av && av.id) || 'unknown';
export const isoOf = dt => dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2,'0') + '-' + String(dt.getDate()).padStart(2,'0');

// An exercise's sets and reps are two separate inputs on screen, but one field everywhere else: the database column,
// the "4 × 8" shown in lists, and lib/plannerData.ts's own parser all expect one string. These two convert at the
// edges, so the rest of the app never has to know the box was split in two.
export const splitSetsReps = text => {
  const t = (text || '').trim();
  if (!t || t === '—') return { sets: '', reps: '' };
  const both = t.match(/^(\d+)\s*[×xX*]\s*(\d+)/);
  if (both) return { sets: both[1], reps: both[2] };
  const setsOnly = t.match(/^(\d+)/);
  return { sets: setsOnly ? setsOnly[1] : '', reps: '' };
};
export const joinSetsReps = (sets, reps) => {
  const s = (sets || '').trim();
  const r = (reps || '').trim();
  return s && r ? s + ' × ' + r : s || r;
};

// Whether the create/edit workout screen has anything typed or toggled that a plain screen change would throw away.
// Only meaningful while actually on that screen: these same keys can be left over (never cleared) after an old visit,
// so a caller must also check the screen is 'edit' before treating this as "there's a draft in the way".
export const workoutDraftDirty = st => !!(
  st.renames || st.fields || st.removed || st.areas || st.newName ||
  st.rDist || st.rElev || st.rHrs || st.rMins ||
  st.aDist || st.aElev || st.aHrs || st.aMins ||
  st.repeat || st.icons || st.iconColors ||
  (st.extra && Object.keys(st.extra).some(k => (st.extra[k] || []).length))
);
