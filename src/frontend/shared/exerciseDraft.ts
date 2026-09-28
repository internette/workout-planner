import { EQUIPMENT, EQUIPMENT_GROUPS, TARGET_AREAS } from './constants';
import { countsOk, joinSetsReps, withLb, withSec } from './helpers';

// The new-exercise form, used by the editor's "Create new" and the Spellbook's "New exercise". Its fields live in
// planner state as dName, dSets, dReps, dWeight, dRest, dIcon, dAreas, dEquip and dEquipOpen.

// Opening the form: real values in its boxes (3 × 10, 60 sec rest), what it saves if left alone, rather than grey
// examples that look like values. Weight starts empty: none is saved unless one is typed.
export const draftOpened = (st) => ({ dSets: st.dSets || '3', dReps: st.dReps || '10', dRest: st.dRest || '60' });

// Closing or saving it: the next one starts empty.
export const DRAFT_CLEARED = {
  dName: '',
  dSets: '',
  dReps: '',
  dWeight: '',
  dRest: '',
  dIcon: 'h',
  dAreas: [],
  dEquip: [],
  dEquipOpen: false,
};

// Equipment is only asked for once the database has it at all.
export const equipmentKnown = (model) => model.builtins.some((e) => e.equipment !== undefined);

// The exercise in `list` that already has the draft's name, if any.
export const draftClash = (st, list) => {
  const name = (st.dName || '').trim().toLowerCase();
  return name ? list.find((e) => e.name.trim().toLowerCase() === name) || null : null;
};

// Why the draft can't be saved yet, or '' when it can. A name clash says so on the field itself, so it gives no hint
// here (but still blocks saving).
export const draftHint = (st) =>
  !(st.dName || '').trim()
    ? 'Name it to save it.'
    : !countsOk(st.dSets, st.dReps)
      ? 'Sets and reps need to be at least 1.'
      : !(st.dAreas || []).length
        ? 'Pick at least one target area.'
        : '';
export const draftReady = (st, clash) => !clash && !draftHint(st);

// An exercise as a workout holds it: just what it's made of, without its id or where it came from. Equipment is left
// out until the database has it.
export const plainExercise = (e) => ({
  name: e.name,
  sets: e.sets,
  weight: e.weight,
  rest: e.rest,
  i: e.i,
  areas: e.areas || [],
  ...(e.equipment !== undefined ? { equipment: e.equipment } : {}),
});

// The exercise the draft describes.
export const draftItem = (st, model) => ({
  name: (st.dName || '').trim(),
  sets: joinSetsReps(st.dSets, st.dReps) || '3 × 10',
  weight: withLb(st.dWeight) || '—',
  rest: withSec(st.dRest) || '60 sec',
  i: st.dIcon || 'h',
  areas: st.dAreas || [],
  ...(equipmentKnown(model) ? { equipment: st.dEquip || [] } : {}),
});

// A toggle per target area, given the ones picked; `set` gets the new list.
export const areaToggles = (picked, set) =>
  TARGET_AREAS.map((name) => {
    const on = picked.includes(name);
    return { name, on, toggle: () => set(on ? picked.filter((a) => a !== name) : picked.concat([name])) };
  });

// The equipment list in its groups, a toggle each, given what's picked; `set` gets the new list, kept in the list's
// order so the same picks compare equal however they were made.
export const equipmentToggles = (picked, set) =>
  EQUIPMENT_GROUPS.map((g) => ({
    label: g.label,
    items: g.items.map((name) => {
      const on = picked.includes(name);
      return { name, on, toggle: () => set(EQUIPMENT.filter((x) => (x === name ? !on : picked.includes(x)))) };
    }),
  }));
