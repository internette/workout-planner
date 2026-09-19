import { colors } from '@/components/ui/colors';
import { iconSvg } from '../icons';
import * as db from '@/lib/plannerData';
import type { Ctx } from '../types';

// Arsenal: the exercise library, its search and the add-exercise form.
export function arsenalVals(ctx: Ctx) {
  const { logic, st, EX, arsenalNames } = ctx;

  // ---- exercise count (shown in the header when the exercises view is open)
  const exerciseNames = {};
  Object.keys(EX).forEach((k) => EX[k].forEach((e) => (exerciseNames[e.name] = 1)));
  Object.keys(st.extra || {}).forEach((k) => (st.extra[k] || []).forEach((e) => (exerciseNames[e.name] = 1)));
  logic.model.library.forEach((e) => (exerciseNames[e.name] = 1));
  const exerciseCount = Object.keys(exerciseNames).length + ' exercises';

  // ---- saved workouts
  const view = st.arsenalView === 'workouts' ? 'workouts' : 'exercises';
  const q = (st.arsenalQ || '').trim().toLowerCase();
  const workouts = logic.model.workouts;
  const hits = workouts.filter(
    (w) => !q || w.name.toLowerCase().includes(q) || w.exercises.some((n) => n.toLowerCase().includes(q)),
  );
  const savedWorkouts = hits.map((w) => ({
    name: w.name,
    svg: iconSvg(w.icon || (w.kind === 'ride' ? 'bike' : 'h'), w.iconColor || colors.pink),
    meta:
      w.kind === 'ride'
        ? ['Ride', w.ride && w.ride.dist ? w.ride.dist + ' mi' : '', w.ride && w.ride.zone, w.time]
            .filter(Boolean)
            .join(' · ')
        : w.exercises.length + (w.exercises.length === 1 ? ' exercise' : ' exercises') + ' · ' + w.time,
    exercises:
      w.kind === 'ride' || !w.exercises.length
        ? ''
        : w.exercises.slice(0, 3).join(', ') +
          (w.exercises.length > 3 ? ' +' + (w.exercises.length - 3) + ' more' : ''),
    areas: w.areas,
    open: () => logic.nav({ screen: 'template', templateId: w.id }),
  }));

  // ---- one exercise, read-only: its numbers, and the saved workouts that include it
  const openExercise = (name) => logic.nav({ screen: 'exercise', exerciseName: name });
  const findExercise = (name) => {
    for (const w of Object.keys(EX)) {
      const hit = (EX[w] || []).find((e) => e.name === name);
      if (hit) return hit;
    }
    return logic.model.library.find((e) => e.name === name) || null;
  };
  const chosenExercise = st.screen === 'exercise' ? findExercise(st.exerciseName) : null;
  const exercise = chosenExercise
    ? {
        name: chosenExercise.name,
        svg: iconSvg(chosenExercise.i),
        sets: chosenExercise.sets,
        weight: chosenExercise.weight,
        rest: chosenExercise.rest,
        usedIn: workouts
          .filter((w) => w.exercises.includes(chosenExercise.name))
          .map((w) => ({ name: w.name, open: () => logic.nav({ screen: 'template', templateId: w.id }) })),
      }
    : null;

  // ---- one saved workout, read-only: no date, no completion
  const chosen = st.screen === 'template' ? workouts.find((w) => w.id === st.templateId) : null;
  const template = chosen
    ? {
        name: chosen.name,
        svg: iconSvg(chosen.icon || (chosen.kind === 'ride' ? 'bike' : 'h'), chosen.iconColor || colors.pink),
        time: chosen.time,
        areas: chosen.areas,
        isRide: chosen.kind === 'ride',
        rideStats: chosen.ride
          ? [
              { label: 'DISTANCE', value: chosen.ride.dist ? chosen.ride.dist + ' mi' : '—' },
              { label: 'DURATION', value: chosen.time },
              { label: 'ELEVATION', value: chosen.ride.elev ? chosen.ride.elev + ' ft' : '—' },
              { label: 'EFFORT', value: chosen.ride.zone },
            ]
          : [],
        exercises: (EX[chosen.name] || []).map((e) => ({
          name: e.name,
          svg: iconSvg(e.i),
          detail: e.sets + ' · ' + e.weight + ' · ' + e.rest + ' rest',
        })),
      }
    : null;

  return {
    exercise,
    template,
    arsenalView: view,
    setArsenalView: (next) => logic.s({ arsenalView: next, arsenalAdd: false }),
    showArsenalWorkouts: view === 'workouts',
    showArsenalExercises: view === 'exercises',
    arsenalCount:
      view === 'workouts'
        ? workouts.length + (workouts.length === 1 ? ' workout' : ' workouts')
        : exerciseCount,
    arsenalIntro:
      view === 'workouts'
        ? "Every workout you've saved, ready to add to your plan."
        : "Every exercise you've called on, grouped by the workout it belongs to.",
    arsenalSearchPlaceholder: view === 'workouts' ? 'Search workouts' : 'Search exercises',
    savedWorkouts,
    noSavedWorkouts: workouts.length === 0,
    noWorkoutMatches: workouts.length > 0 && !!q && hits.length === 0,
    noWorkoutMatchNote: 'No workout matches “' + (st.arsenalQ || '').trim() + '”.',
    arsenalAddOpen: !!st.arsenalAdd,
    openArsenalAdd: () => logic.s({ arsenalAdd: true }),
    closeArsenalAdd: () => logic.s({ arsenalAdd: false, dName: '', dSets: '', dWeight: '', dRest: '' }),
    commitArsenal: () => {
      const nm = (st.dName || '').trim();
      if (!nm) return;
      const item = {
        name: nm,
        sets: st.dSets || '3 × 10',
        weight: st.dWeight || '—',
        rest: st.dRest || '60 sec',
        i: st.dIcon || 'h',
      };
      logic.save(() => db.addLibraryExercise(item), {
        arsenalAdd: false,
        dName: '',
        dSets: '',
        dWeight: '',
        dRest: '',
        dIcon: 'h',
      });
    },
    movesCount: exerciseCount,
    arsenalQuery: st.arsenalQ || '',
    noMatches:
      !!(st.arsenalQ || '').trim() &&
      !arsenalNames.some((n) => n.toLowerCase().indexOf((st.arsenalQ || '').trim().toLowerCase()) > -1),
    noMatchNote: 'No exercise matches “' + (st.arsenalQ || '').trim() + '”.',
    hasQuery: !!(st.arsenalQ || '').trim(),
    setArsenalQuery: (e) => logic.s({ arsenalQ: e.target.value }),
    clearArsenalQuery: () => logic.s({ arsenalQ: '' }),
    moveGroups: (() => {
      const q = (st.arsenalQ || '').trim().toLowerCase();
      const groups = [];
      const push = (label, items) => {
        const hit = items.filter((e) => !q || e.name.toLowerCase().indexOf(q) > -1);
        if (hit.length)
          groups.push({
            label: label.toUpperCase(),
            count: hit.length + (hit.length === 1 ? ' exercise' : ' exercises'),
            items: hit,
          });
      };
      Object.keys(EX).forEach((w) => {
        push(
          w,
          (EX[w] || []).map((e) => ({
            name: e.name,
            svg: iconSvg(e.i),
            detail: e.sets + ' · ' + e.weight,
            open: () => openExercise(e.name),
          })),
        );
      });
      push(
        'Unassigned',
        logic.model.library.map((e) => ({
          name: e.name,
          svg: iconSvg(e.i),
          detail: e.sets + ' · ' + e.weight,
          open: () => openExercise(e.name),
        })),
      );
      return groups;
    })(),
  };
}
