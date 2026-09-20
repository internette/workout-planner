import { colors } from '@/components/ui/colors';
import { iconSvg } from '../icons';
import { EXERCISE_ICON_NAMES } from '@/components/ui/icons';
import * as db from '@/lib/plannerData';
import { isoOf } from '../helpers';
import { optStyle } from '../styles';
import type { Ctx } from '../types';

// Arsenal: the exercise library, its search and the add-exercise form.
export function arsenalVals(ctx: Ctx) {
  const { logic, st, EX, Y, TODAY_M, TODAY_D, arsenalNames } = ctx;

  // ---- exercise count (shown in the header when the exercises view is open)
  const exerciseNames = {};
  Object.keys(EX).forEach((k) => EX[k].forEach((e) => (exerciseNames[e.name] = 1)));
  Object.keys(st.extra || {}).forEach((k) => (st.extra[k] || []).forEach((e) => (exerciseNames[e.name] = 1)));
  logic.model.library.forEach((e) => (exerciseNames[e.name] = 1));
  const exerciseCount = Object.keys(exerciseNames).length + ' exercises';

  // ---- edits to a saved workout never rewrite sessions that are already done. If sessions are still ahead
  // (from today on, not completed), ask whether they should follow the edit; past and completed ones never do.
  const todayIso = isoOf(new Date(Y, TODAY_M, TODAY_D));
  // When the edit becomes a new workout, the screen moves on to that copy (and to its copy of the exercise).
  const applyEdit = (edit, mode, updateUpcoming, patch) =>
    logic.save(
      () => db.updateWorkoutTemplate(edit, { mode, updateUpcoming, todayIso }),
      (r) => ({
        ...patch,
        ...(r.created ? { templateId: r.workoutId } : {}),
        ...(r.created && patch.screen === 'exercise' ? { exerciseId: r.exerciseIds[edit.exercises.update[0]?.id] } : {}),
        // The workout being edited was left alone; its draft belongs to it, so open the copy read-only instead.
        ...(r.created && patch.screen === 'templateEdit' ? { screen: 'template', tplDraft: null } : {}),
        tplConfirm: null,
      }),
    );
  const askThenApply = async (edit, name, patch, exercise = '') => {
    try {
      const count = await db.countUpcoming(edit.workoutId, todayIso);
      if (count === 0) return applyEdit(edit, 'update', true, patch);
      logic.s({
        tplConfirm: {
          count,
          name,
          exercise,
          choice: 'update',
          upcoming: true,
          apply: (mode, updateUpcoming) => applyEdit(edit, mode, updateUpcoming, patch),
        },
      });
    } catch (e) {
      logic.s({ saveError: e instanceof Error ? e.message : String(e) });
    }
  };
  const confirm = st.tplConfirm;

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

  // ---- one exercise: a read-only view, and an editor for that one row
  const openExercise = (id) => logic.nav({ screen: 'exercise', exerciseId: id });
  const findExercise = (id) => {
    for (const w of Object.keys(EX)) {
      const hit = (EX[w] || []).find((e) => e.id === id);
      if (hit) return { ex: hit, workout: workouts.find((x) => x.name === w) || null };
    }
    const lib = logic.model.library.find((e) => e.id === id);
    return lib ? { ex: lib, workout: null } : null;
  };
  const onExerciseScreen = st.screen === 'exercise' || st.screen === 'exerciseEdit';
  const found = onExerciseScreen ? findExercise(st.exerciseId) : null;
  const exercise = found
    ? {
        name: found.ex.name,
        svg: iconSvg(found.ex.i),
        sets: found.ex.sets,
        weight: found.ex.weight,
        rest: found.ex.rest,
        usedIn: workouts
          .filter((w) => w.exercises.includes(found.ex.name))
          .map((w) => ({ name: w.name, open: () => logic.nav({ screen: 'template', templateId: w.id }) })),
        edit: () =>
          logic.s({
            screen: 'exerciseEdit',
            exFrom: null,
            exDraft: {
              name: found.ex.name,
              sets: found.ex.sets,
              weight: found.ex.weight,
              rest: found.ex.rest,
              i: found.ex.i,
            },
          }),
      }
    : null;
  // Set when the exercise editor was opened from the workout editor, so it returns there.
  const exFrom = st.exFrom || null;
  const exDraft = st.exDraft || { name: '', sets: '', weight: '', rest: '', i: 'h' };
  const setExDraft = (field) => (e) => logic.s({ exDraft: { ...exDraft, [field]: e.target.value } });
  const exerciseEdit = {
    name: exDraft.name,
    sets: exDraft.sets,
    weight: exDraft.weight,
    rest: exDraft.rest,
    setName: setExDraft('name'),
    setSets: setExDraft('sets'),
    setWeight: setExDraft('weight'),
    setRest: setExDraft('rest'),
    icons: EXERCISE_ICON_NAMES.map((name) => ({
      svg: iconSvg(name),
      pick: () => logic.s({ exDraft: { ...exDraft, i: name } }),
      style: optStyle(exDraft.i === name),
    })),
    canSave: !!exDraft.name.trim(),
    cancel: () => logic.s({ screen: exFrom ? 'templateEdit' : 'exercise', exDraft: null, exFrom: null }),
    save: () => {
      if (!found || !exDraft.name.trim()) return;
      const patch = {
        name: exDraft.name.trim(),
        sets: exDraft.sets,
        weight: exDraft.weight,
        rest: exDraft.rest,
        i: exDraft.i,
      };
      const after = { screen: exFrom ? 'templateEdit' : 'exercise', exDraft: null, exFrom: null };
      if (!found.workout) {
        logic.save(() => db.updateExerciseRow({ kind: 'library', id: found.ex.id }, patch), after);
        return;
      }
      askThenApply(
        {
          entryId: '',
          workoutId: found.workout.id,
          exercises: { update: [{ id: found.ex.id, patch }], removeIds: [], add: [] },
          repeatDates: [],
        },
        found.workout.name,
        after,
        found.ex.name,
      );
    },
  };

  // ---- one saved workout, read-only: no date, no completion
  const onTemplateScreen = st.screen === 'template' || st.screen === 'templateEdit';
  const chosen = onTemplateScreen ? workouts.find((w) => w.id === st.templateId) : null;
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
        edit: () =>
          logic.s({
            screen: 'templateEdit',
            tplDraft: {
              name: chosen.name,
              areas: [...chosen.areas],
              dist: chosen.ride ? chosen.ride.dist : '',
              elev: chosen.ride ? chosen.ride.elev : '',
              hrs: Math.floor(chosen.minutes / 60) ? String(Math.floor(chosen.minutes / 60)) : '',
              mins: chosen.minutes % 60 ? String(chosen.minutes % 60) : '',
              zone: chosen.ride ? chosen.ride.zone : 'Endurance',
              rows: (EX[chosen.name] || []).map((e) => ({
                key: e.id,
                id: e.id,
                name: e.name,
                sets: e.sets,
                weight: e.weight,
                rest: e.rest,
                i: e.i,
                removed: false,
              })),
            },
          }),
      }
    : null;

  // ---- the saved-workout editor: a draft that is written to the database on save
  const draft = st.tplDraft;
  const patchDraft = (patch) => logic.s({ tplDraft: { ...draft, ...patch } });
  const digits = (n) => (e) => patchDraft({ [n]: e.target.value.replace(/[^0-9.]/g, '') });
  const whole =
    (n, max?, len = 2) =>
    (e) => {
      const v = e.target.value.replace(/[^0-9]/g, '').slice(0, len);
      patchDraft({ [n]: v === '' || max == null ? v : String(Math.min(max, Number(v))) });
    };
  const patchRow = (key, patch) =>
    patchDraft({ rows: draft.rows.map((r) => (r.key === key ? { ...r, ...patch } : r)) });
  const templateEdit =
    chosen && draft
      ? {
          isRide: chosen.kind === 'ride',
          name: draft.name,
          setName: (e) => patchDraft({ name: e.target.value }),
          areas: ['Core', 'Arms', 'Back', 'Legs'].map((a) => ({
            name: a,
            on: draft.areas.includes(a),
            toggle: () =>
              patchDraft({
                areas: draft.areas.includes(a) ? draft.areas.filter((x) => x !== a) : [...draft.areas, a],
              }),
          })),
          dist: draft.dist,
          elev: draft.elev,
          hrs: draft.hrs,
          mins: draft.mins,
          zone: draft.zone,
          setDist: digits('dist'),
          setElev: whole('elev', undefined, 6),
          setHrs: whole('hrs'),
          setMins: whole('mins', 59),
          setZone: (zone) => patchDraft({ zone }),
          // Exercises already in the workout are a list; each opens the exercise editor. Not-yet-saved ones have fields.
          rows: draft.rows
            .filter((r) => r.id && !r.removed)
            .map((r) => {
              const live = (EX[chosen.name] || []).find((e) => e.id === r.id);
              if (!live) return null;
              return {
                key: r.key,
                name: live.name,
                svg: iconSvg(live.i),
                detail: live.sets + ' · ' + live.weight + ' · ' + live.rest + ' rest',
                edit: () =>
                  logic.s({
                    screen: 'exerciseEdit',
                    exerciseId: live.id,
                    exFrom: 'templateEdit',
                    exDraft: { name: live.name, sets: live.sets, weight: live.weight, rest: live.rest, i: live.i },
                  }),
                remove: () => patchRow(r.key, { removed: true }),
              };
            })
            .filter(Boolean),
          newRows: draft.rows
            .filter((r) => !r.id && !r.removed)
            .map((r) => ({
              key: r.key,
              name: r.name,
              sets: r.sets,
              weight: r.weight,
              rest: r.rest,
              setName: (e) => patchRow(r.key, { name: e.target.value }),
              setSets: (e) => patchRow(r.key, { sets: e.target.value }),
              setWeight: (e) => patchRow(r.key, { weight: e.target.value }),
              setRest: (e) => patchRow(r.key, { rest: e.target.value }),
              remove: () => patchDraft({ rows: draft.rows.filter((x) => x.key !== r.key) }),
            })),
          addRow: () =>
            patchDraft({
              rows: [
                ...draft.rows,
                {
                  key: 'new-' + Date.now(),
                  id: null,
                  name: '',
                  sets: '3 × 10',
                  weight: '',
                  rest: '60 sec',
                  i: 'h',
                  removed: false,
                },
              ],
            }),
          canSave: !!draft.name.trim(),
          cancel: () => logic.s({ screen: 'template', tplDraft: null }),
          save: () => {
            if (!draft.name.trim()) return;
            const minutes = Number(draft.hrs || 0) * 60 + Number(draft.mins || 0);
            askThenApply(
              {
                entryId: '',
                workoutId: chosen.id,
                name: draft.name,
                areas: chosen.kind === 'ride' ? undefined : draft.areas,
                ride:
                  chosen.kind === 'ride'
                    ? { dist: draft.dist, elev: draft.elev, zone: draft.zone, minutes }
                    : null,
                exercises: {
                  update: [],
                  removeIds: draft.rows.filter((r) => r.id && r.removed).map((r) => r.id),
                  add: draft.rows
                    .filter((r) => !r.id && !r.removed && r.name.trim())
                    .map((r) => ({
                      name: r.name.trim(),
                      sets: r.sets,
                      weight: r.weight,
                      rest: r.rest,
                      i: r.i,
                    })),
                },
                repeatDates: [],
              },
              chosen.name,
              { screen: 'template', tplDraft: null },
            );
          },
        }
      : null;

  return {
    tplConfirmOpen: !!confirm,
    tplConfirmTitle: 'How should this change be saved?',
    // The name of what is being edited, once. The options and the checkbox carry the rest.
    tplConfirmBody: confirm
      ? confirm.exercise
        ? 'Editing “' + confirm.exercise + '” in “' + confirm.name + '”.'
        : 'Editing “' + confirm.name + '”.'
      : '',
    tplConfirmChoice: confirm?.choice === 'new' ? 'new' : 'update',
    tplConfirmSetChoice: (value) => confirm && logic.s({ tplConfirm: { ...confirm, choice: value } }),
    tplConfirmOptions: confirm
      ? [
          {
            value: 'update',
            title: confirm.exercise ? 'Update this exercise' : 'Update this workout',
            description: 'Past sessions keep the old version.',
          },
          {
            value: 'new',
            title: confirm.exercise ? 'Save as a new exercise' : 'Save as a new workout',
            description: confirm.exercise
              ? 'Saved in a copy of the workout. The original stays as it is.'
              : 'The original and its sessions stay as they are.',
          },
        ]
      : [],
    // Shown inside the Update option only.
    tplConfirmUpcoming: !!confirm?.upcoming,
    tplConfirmToggleUpcoming: () => confirm && logic.s({ tplConfirm: { ...confirm, upcoming: !confirm.upcoming } }),
    tplConfirmUpcomingLabel: confirm
      ? 'Also update ' + confirm.count + (confirm.count === 1 ? ' upcoming session' : ' upcoming sessions')
      : '',
    tplConfirmCancel: () => logic.s({ tplConfirm: null }),
    tplConfirmSave: () => {
      logic.s({ tplConfirm: null });
      if (confirm) confirm.apply(confirm.choice === 'new' ? 'new' : 'update', !!confirm.upcoming);
    },
    exercise,
    exerciseEdit,
    template,
    templateEdit,
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
            open: () => openExercise(e.id),
          })),
        );
      });
      push(
        'Unassigned',
        logic.model.library.map((e) => ({
          name: e.name,
          svg: iconSvg(e.i),
          detail: e.sets + ' · ' + e.weight,
          open: () => openExercise(e.id),
        })),
      );
      return groups;
    })(),
  };
}
