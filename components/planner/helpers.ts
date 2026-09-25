import { MONTHS, QUESTS } from './constants';

// Months are counted from January of the current year and carry on past it: 12 is next January, -1 last December.
// new Date(year, m, d) already reads them that way. mod12 turns one back into a place in MONTHS, and monthPatch into
// the state that shows it (a month name, plus how many years away from this one).
export const mod12 = m => ((m % 12) + 12) % 12;
export const monthPatch = m => ({ month: MONTHS[mod12(m)], yOff: Math.floor(m / 12) });

export const questFor = seed => QUESTS[Math.abs(Math.round(seed)) % QUESTS.length];
export const questSeed = (day, month) => questFor(day * 3 + month);
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
// An exercise in one line: "4 × 8 · 95 lb", "3 × 12 · bodyweight", or just "3 sets" when there's no weight to
// show — never a dangling "· —". With rest: "… · 90 sec rest".
export const exLine = (e, withRest = false) =>
  [
    e.sets && e.sets !== '—' ? e.sets : '',
    e.weight && e.weight !== '—' ? (e.weight === 'body' ? 'bodyweight' : e.weight) : '',
    withRest && e.rest && e.rest !== '—' ? e.rest + ' rest' : '',
  ]
    .filter(Boolean)
    .join(' · ');
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
  // Reps with the sets cleared while editing ("× 8"): keep the reps.
  const repsOnly = t.match(/^[×xX*]\s*(\d+)/);
  if (repsOnly) return { sets: '', reps: repsOnly[1] };
  const setsOnly = t.match(/^(\d+)/);
  return { sets: setsOnly ? setsOnly[1] : '', reps: '' };
};
// An exercise needs at least one set of at least one rep.
export const countsOk = (sets, reps) => Number(sets) >= 1 && Number(reps) >= 1;
export const setsRepsOk = text => {
  const p = splitSetsReps(text);
  return countsOk(p.sets, p.reps);
};
export const joinSetsReps = (sets, reps) => {
  const s = (sets || '').trim();
  const r = (reps || '').trim();
  return s && r ? s + ' × ' + r : s || (r ? '× ' + r : '');
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

// Whether the exercise editor holds a change to the exercise it opened with.
export const exerciseDraftDirty = st =>
  st.screen === 'exerciseEdit' && !!st.exDraft && !!st.exDraftOrig && JSON.stringify(st.exDraft) !== JSON.stringify(st.exDraftOrig);

// Whether the create/edit workout screen has anything typed or toggled that a plain screen change would throw away.
// Only meaningful while actually on that screen: these same keys can be left over (never cleared) after an old visit,
// so a caller must also check the screen is 'edit' before treating this as "there's a draft in the way".
export const workoutDraftDirty = st => !!(
  st.renames || st.fields || st.removed || st.newName ||
  st.rDist || st.rElev || st.rHrs || st.rMins ||
  st.aDist || st.aElev || st.aHrs || st.aMins ||
  st.repeat || st.icons || st.iconColors || st.notes ||
  // A session moved to another day in the editor.
  (st.editKey && st.editKey !== (MONTHS.indexOf(st.month) + 12 * (st.yOff || 0)) + '-' + st.day) ||
  (st.extra && Object.keys(st.extra).some(k => (st.extra[k] || []).length))
);

// A confirmation shown at the top of one screen (and read out), e.g. after a save or a delete. It belongs to that
// screen: moving to another clears it.
export const noticePatch = (text, screen) => ({ notice: { text, screen }, announce: text });
