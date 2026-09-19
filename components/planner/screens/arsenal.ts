import { MONTHS, MON3, DOW3 } from '../constants';
import { colors } from '@/components/ui/colors';
import { iconSvg } from '../icons';
import * as db from '@/lib/plannerData';
import type { Ctx } from '../types';

// Arsenal: the exercise library, its search and the add-exercise form.
export function arsenalVals(ctx: Ctx) {
  const { logic, st, EX, Y, arsenalNames, firstEntry, nameOf } = ctx;

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
  const dayLabel = ({ m, d }) => {
    const dt = new Date(Y, m, d);
    return (
      DOW3[dt.getDay()].charAt(0) + DOW3[dt.getDay()].slice(1, 3).toLowerCase() + ', ' + MON3[m] + ' ' + d
    );
  };
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
    when: w.next ? 'Next · ' + dayLabel(w.next) : w.open ? 'Last · ' + dayLabel(w.open) : 'Not scheduled',
    open: w.open
      ? () => logic.nav({ screen: 'detail', creating: false, month: MONTHS[w.open.m], day: w.open.d })
      : null,
  }));

  return {
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
        ? "Every workout you've saved. Open one to see when it's next on your plan."
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
      const rowStyle = (clickable) =>
        'display:flex;flex-wrap:wrap;align-items:center;gap:14px;padding:16px 20px;background:var(--color-white);border-radius:18px;box-shadow:0 4px 14px rgba(35,42,69,.07)' +
        (clickable ? ';cursor:pointer' : '');
      Object.keys(EX).forEach((w) => {
        const firstDay = firstEntry(w);
        push(
          w,
          (EX[w] || []).map((e) => ({
            name: e.name,
            svg: iconSvg(e.i),
            detail: e.sets + ' · ' + e.weight,
            open: firstDay
              ? () =>
                  logic.nav({ screen: 'detail', creating: false, month: MONTHS[firstDay.m], day: firstDay.d })
              : null,
            rowStyle: rowStyle(!!firstDay),
          })),
        );
      });
      push(
        'Unassigned',
        logic.model.library.map((e) => ({
          name: e.name,
          svg: iconSvg(e.i),
          detail: e.sets + ' · ' + e.weight,
          open: null,
          rowStyle: rowStyle(false),
        })),
      );
      return groups;
    })(),
    moveLibrary: (() => {
      const seen = {};
      Object.keys(EX).forEach((k) =>
        EX[k].forEach((e) => {
          if (!seen[e.name])
            seen[e.name] = { name: e.name, i: e.i, sets: e.sets, weight: e.weight, used: [] };
          seen[e.name].used.push(k);
        }),
      );
      Object.keys(st.extra || {}).forEach((k) =>
        (st.extra[k] || []).forEach((e) => {
          if (!seen[e.name])
            seen[e.name] = { name: e.name, i: e.i, sets: e.sets, weight: e.weight, used: [] };
          let label = 'Arsenal only';
          if (k === '__draft') label = 'New workout';
          else {
            const src = logic.model.entries.find((x) => x.av.id === k);
            label = src ? nameOf(src.av.name) : 'Arsenal only';
          }
          if (seen[e.name].used.indexOf(label) === -1) seen[e.name].used.push(label);
        }),
      );
      logic.model.library.forEach((e) => {
        if (!seen[e.name]) seen[e.name] = { name: e.name, i: e.i, sets: e.sets, weight: e.weight, used: [] };
      });
      const q = (st.arsenalQ || '').trim().toLowerCase();
      return Object.keys(seen)
        .filter((n) => !q || n.toLowerCase().indexOf(q) > -1)
        .map((n) => {
          const owners = seen[n].used;
          const firstDay = owners.length ? firstEntry(owners[0]) : null;
          return {
            name: n,
            svg: iconSvg(seen[n].i),
            detail: seen[n].sets + ' · ' + seen[n].weight,
            used: !owners.length
              ? 'Arsenal only'
              : owners.length === 1
                ? owners[0]
                : owners.length + ' workouts',
            open: firstDay
              ? () =>
                  logic.nav({ screen: 'detail', creating: false, month: MONTHS[firstDay.m], day: firstDay.d })
              : null,
            rowStyle:
              'display:flex;flex-wrap:wrap;align-items:center;gap:14px;padding:16px 20px;background:var(--color-white);border-radius:18px;box-shadow:0 4px 14px rgba(35,42,69,.07)' +
              (firstDay ? ';cursor:pointer' : ''),
          };
        });
    })(),
  };
}
