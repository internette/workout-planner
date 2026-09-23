import { QUESTS, TOKENS } from './constants';

export const questFor = seed => QUESTS[Math.abs(Math.round(seed)) % QUESTS.length];
export const questSeed = (day, month) => questFor(day * 3 + month);
export const tokenFor = seed => TOKENS[Math.abs(Math.round(seed)) % TOKENS.length];
export const CAT = n => n.indexOf('Push')>-1 ? 'Push' : n.indexOf('Pull')>-1 ? 'Pull' : n.indexOf('Leg')>-1 ? 'Legs' : 'Core';
export const idOf = av => (av && av.id) || 'unknown';
// Seconds to a stopwatch readout: "12:34", or "1:02:34" past an hour.
export const formatElapsed = totalSec => {
  const sec = Math.max(0, Math.floor(totalSec));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad2 = n => String(n).padStart(2, '0');
  return (h ? h + ':' + pad2(m) : String(m)) + ':' + pad2(s);
};
export const isoOf = dt => dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2,'0') + '-' + String(dt.getDate()).padStart(2,'0');

// "1 entry" vs "3 entries" (or exercise/exercises, session/sessions, ...) without repeating the count === 1 check
// at every call site. Pass the plural form only when it isn't just the singular plus "s".
export const plural = (n, singular, pluralForm = '') => n + ' ' + (n === 1 ? singular : pluralForm || singular + 's');

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

// Digits only, for a field that should never hold anything else (sets, reps, and the number inside "90 sec").
export const digitsOnly = text => (text || '').replace(/[^0-9]/g, '');

// Rest is a plain number of seconds everywhere else ("90 sec" in the database, in lists, in the export), but the
// box itself only needs the number. These convert at the edges, the same way sets/reps do.
export const restDigits = text => digitsOnly(text);
export const withSec = digits => (digits ? digits + ' sec' : '');

// A number that may have a decimal point (weight, in pounds), nothing else.
export const numericOnly = text => (text || '').replace(/[^0-9.]/g, '');
// Weight is always pounds now; the box holds the bare number and this puts the unit back for storage/display.
export const withLb = digits => (digits ? digits + ' lb' : '');

// Whether the create/edit workout screen has anything typed or toggled that a plain screen change would throw away.
// Only meaningful while actually on that screen: these same keys can be left over (never cleared) after an old visit,
// so a caller must also check the screen is 'edit' before treating this as "there's a draft in the way".
export const workoutDraftDirty = st => !!(
  st.renames || st.fields || st.removed || st.newName ||
  st.rDist || st.rElev || st.rHrs || st.rMins ||
  st.aDist || st.aElev || st.aHrs || st.aMins ||
  st.repeat || st.icons || st.iconColors || st.notes ||
  (st.extra && Object.keys(st.extra).some(k => (st.extra[k] || []).length))
);
