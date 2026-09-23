import { colors } from '@/components/ui/colors';
import { EDIT_OVERLAYS, TARGET_AREAS } from '../constants';
import { iconSvg } from '../icons';
import { EXERCISE_ICON_NAMES } from '@/components/ui/icons';
import * as db from '@/lib/plannerData';
import { digitsOnly, isoOf, joinSetsReps, numericOnly, plural, restDigits, splitSetsReps, withLb, withSec } from '../helpers';
import { optStyle } from '../styles';
import type { Ctx } from '../types';

// Arsenal: the exercise library, its search and the add-exercise form.
export function arsenalVals(ctx: Ctx) {
  const { logic, st, EX, Y, TODAY_M, TODAY_D, narrow } = ctx;

  // ---- exercise count (shown in the header when the exercises view is open)
  // One per row in the list. Exercises are identified by id, so two with the same name are two exercises.
  const exerciseCount = plural(
    Object.keys(EX).reduce((n, k) => n + (EX[k] || []).length, 0) +
      logic.model.library.length +
      logic.model.builtins.length,
    'exercise',
  );

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
  // Target-area filter, shared by both tabs: keeps anything that targets at least one of the chosen areas.
  const areaFilter: string[] = st.arsenalAreas || [];
  const inAreas = (areas) => !areaFilter.length || (areas || []).some((a) => areaFilter.includes(a));
  const areaList = (list) =>
    list.length === 1 ? list[0] : list.slice(0, -1).join(', ') + ' or ' + list[list.length - 1];
  const noMatchText = (things) =>
    q && areaFilter.length
      ? 'No ' + things + ' match “' + (st.arsenalQ || '').trim() + '” for ' + areaList(areaFilter) + '.'
      : areaFilter.length
        ? 'No ' + things + ' target ' + areaList(areaFilter) + '.'
        : 'No ' + things + ' match “' + (st.arsenalQ || '').trim() + '”.';
  const workouts = logic.model.workouts;
  const hits = workouts.filter(
    (w) =>
      inAreas(w.areas) &&
      (!q || w.name.toLowerCase().includes(q) || w.exercises.some((n) => n.toLowerCase().includes(q))),
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
    const lib = logic.model.library.find((e) => e.id === id) || logic.model.builtins.find((e) => e.id === id);
    return lib ? { ex: lib, workout: null } : null;
  };
  const onExerciseScreen = st.screen === 'exercise' || st.screen === 'exerciseEdit';
  const found = onExerciseScreen ? findExercise(st.exerciseId) : null;
  const draftFrom = (ex, name) => ({
    name,
    ...splitSetsReps(ex.sets),
    weight: ex.weight,
    rest: ex.rest,
    i: ex.i,
    areas: ex.areas || [],
  });
  const exercise = found
    ? {
        name: found.ex.name,
        svg: iconSvg(found.ex.i),
        sets: found.ex.sets,
        weight: found.ex.weight,
        rest: found.ex.rest,
        areas: found.ex.areas || [],
        builtin: !!found.ex.builtin,
        // By id, not by name: a same-named exercise in the Unassigned group is not part of any workout.
        usedIn: found.workout
          ? [{ name: found.workout.name, open: () => logic.nav({ screen: 'template', templateId: found.workout.id }) }]
          : [],
        edit: () => logic.s({ screen: 'exerciseEdit', exFrom: null, exDraft: draftFrom(found.ex, found.ex.name) }),
        // A built-in can't be changed, so "change it" means: make it the person's own, then open that in the editor.
        copy: () =>
          logic.save(
            () => db.createLibraryExercise(found.ex),
            (r) => ({ screen: 'exerciseEdit', exerciseId: r.id, exFrom: null, exDraft: draftFrom(found.ex, r.name) }),
          ),
      }
    : null;
  // Set when the exercise editor was opened from the workout editor, so it returns there.
  const exFrom = st.exFrom || null;
  const exDraft = st.exDraft || { name: '', sets: '', reps: '', weight: '', rest: '', i: 'h', areas: [] };
  const setExDraft = (field) => (e) => logic.s({ exDraft: { ...exDraft, [field]: e.target.value } });
  // Saving an exercise always asks how: update it, or keep it and save the edit as a new exercise.
  // Updating can also carry on to the workout's upcoming sessions. Completed and past sessions never change.
  const askExerciseSave = async (patch) => {
    const after = { screen: exFrom ? 'templateEdit' : 'exercise', exDraft: null, exFrom: null };
    const workout = found.workout;
    try {
      const count = workout ? await db.countUpcoming(workout.id, todayIso) : 0;
      logic.s({
        tplConfirm: {
          exercise: found.ex.name,
          name: workout ? workout.name : '',
          count,
          choice: 'update',
          upcoming: true,
          apply: (choice, upcoming) => {
            if (choice === 'new') {
              // A new standalone exercise: the original and its workout stay exactly as they are.
              logic.save(() => db.createLibraryExercise(patch), (r) => ({
                screen: 'exercise',
                exerciseId: r.id,
                exDraft: null,
                exFrom: null,
                tplDraft: null,
                tplConfirm: null,
              }));
            } else if (workout) {
              applyEdit(
                {
                  entryId: '',
                  workoutId: workout.id,
                  exercises: { update: [{ id: found.ex.id, patch }], removeIds: [], add: [] },
                  repeatDates: [],
                },
                'update',
                upcoming,
                after,
              );
            } else {
              logic.save(() => db.updateExerciseRow({ kind: 'library', id: found.ex.id }, patch), {
                ...after,
                tplConfirm: null,
              });
            }
          },
        },
      });
    } catch (e) {
      logic.s({ saveError: e instanceof Error ? e.message : String(e) });
    }
  };
  const exerciseEdit = {
    name: exDraft.name,
    sets: exDraft.sets,
    reps: exDraft.reps,
    weight: numericOnly(exDraft.weight),
    rest: restDigits(exDraft.rest),
    setName: setExDraft('name'),
    setSets: (e) => logic.s({ exDraft: { ...exDraft, sets: digitsOnly(e.target.value) } }),
    setReps: (e) => logic.s({ exDraft: { ...exDraft, reps: digitsOnly(e.target.value) } }),
    setWeight: (e) => logic.s({ exDraft: { ...exDraft, weight: withLb(numericOnly(e.target.value)) } }),
    setRest: (e) => logic.s({ exDraft: { ...exDraft, rest: withSec(restDigits(e.target.value)) } }),
    areas: TARGET_AREAS.map((name) => {
      const on = (exDraft.areas || []).includes(name);
      return {
        name,
        on,
        toggle: () =>
          logic.s({
            exDraft: {
              ...exDraft,
              areas: on ? exDraft.areas.filter((a) => a !== name) : (exDraft.areas || []).concat([name]),
            },
          }),
      };
    }),
    icons: EXERCISE_ICON_NAMES.map((name) => ({
      svg: iconSvg(name),
      pick: () => logic.s({ exDraft: { ...exDraft, i: name } }),
      style: optStyle(exDraft.i === name),
    })),
    canSave: !!exDraft.name.trim() && (exDraft.areas || []).length > 0,
    cancel: () => logic.s({ screen: exFrom ? 'templateEdit' : 'exercise', exDraft: null, exFrom: null }),
    save: () => {
      if (!found || !exDraft.name.trim() || !(exDraft.areas || []).length) return;
      const patch = {
        name: exDraft.name.trim(),
        sets: joinSetsReps(exDraft.sets, exDraft.reps),
        weight: exDraft.weight,
        rest: exDraft.rest,
        i: exDraft.i,
        areas: exDraft.areas || [],
      };
      askExerciseSave(patch);
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
  // The workout's own target areas while editing: the union of its rows' areas, live — an existing row looks
  // up its current areas by id (kept fresh by whatever it's set to right now), a new row uses its own draft.
  const liveAreas =
    chosen && draft
      ? Array.from(
          new Set(
            draft.rows
              .filter((r) => !r.removed)
              .flatMap((r) => {
                if (!r.id) return r.areas || [];
                const live = (EX[chosen.name] || []).find((e) => e.id === r.id);
                return (live && live.areas) || [];
              }),
          ),
        )
      : [];
  const templateEdit =
    chosen && draft
      ? {
          isRide: chosen.kind === 'ride',
          name: draft.name,
          setName: (e) => patchDraft({ name: e.target.value }),
          // No longer picked by hand here either: the union of what's below, live as rows are added/removed —
          // not the saved workout's own areas, which wouldn't follow an edit still in progress.
          hasTargetAreas: liveAreas.length > 0,
          areaPills: liveAreas,
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
                    exDraft: {
                    name: live.name,
                    ...splitSetsReps(live.sets),
                    weight: live.weight,
                    rest: live.rest,
                    i: live.i,
                    areas: live.areas || [],
                  },
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
              reps: r.reps,
              weight: numericOnly(r.weight),
              rest: restDigits(r.rest),
              setName: (e) => patchRow(r.key, { name: e.target.value }),
              setSets: (e) => patchRow(r.key, { sets: digitsOnly(e.target.value) }),
              setReps: (e) => patchRow(r.key, { reps: digitsOnly(e.target.value) }),
              setWeight: (e) => patchRow(r.key, { weight: withLb(numericOnly(e.target.value)) }),
              setRest: (e) => patchRow(r.key, { rest: withSec(restDigits(e.target.value)) }),
              areas: TARGET_AREAS.map((name) => {
                const on = (r.areas || []).includes(name);
                return {
                  name,
                  on,
                  toggle: () =>
                    patchRow(r.key, { areas: on ? r.areas.filter((a) => a !== name) : (r.areas || []).concat([name]) }),
                };
              }),
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
                  sets: '3',
                  reps: '10',
                  weight: '',
                  rest: '60 sec',
                  i: 'h',
                  areas: [],
                  removed: false,
                },
              ],
            }),
          // A new row only counts once it has a name — but from that point on it needs a target area too,
          // same as everywhere else an exercise is added.
          canSave:
            !!draft.name.trim() &&
            !draft.rows.some((r) => !r.id && !r.removed && r.name.trim() && !(r.areas || []).length),
          cancel: () => logic.s({ screen: 'template', tplDraft: null }),
          save: () => {
            if (!draft.name.trim()) return;
            if (draft.rows.some((r) => !r.id && !r.removed && r.name.trim() && !(r.areas || []).length)) return;
            const minutes = Number(draft.hrs || 0) * 60 + Number(draft.mins || 0);
            askThenApply(
              {
                entryId: '',
                workoutId: chosen.id,
                name: draft.name,
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
                      sets: joinSetsReps(r.sets, r.reps),
                      weight: r.weight,
                      rest: r.rest,
                      i: r.i,
                      areas: r.areas || [],
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

  // ---- "Add to workout". Opened from a workout's "Summon the full Arsenal", it goes into that workout and returns
  // there; opened any other way, it starts a new workout with this exercise already in it.
  const pick = st.arsenalPick || null;
  const addToWorkout = (e) => {
    const ex = { name: e.name, sets: e.sets, weight: e.weight, rest: e.rest, i: e.i, areas: e.areas || [] };
    if (pick) {
      const gone = (st.removed || {})[pick.key] || [];
      // Taken out of this workout earlier in the edit: bring the original back rather than adding a second copy.
      const patch = gone.includes(e.name)
        ? { removed: { ...st.removed, [pick.key]: gone.filter((n) => n !== e.name) } }
        : { extra: { ...st.extra, [pick.key]: ((st.extra || {})[pick.key] || []).concat([ex]) } };
      return logic.backTo('edit', { ...patch, arsenalPick: null, arsenalAreas: pick.prevAreas || [] });
    }
    logic.nav({
      ...EDIT_OVERLAYS,
      screen: 'edit',
      editing: false,
      creating: true,
      addOpen: false,
      newName: '',
      newType: 'lift',
      newFrom: 'arsenal',
      schedule: false,
      arsenalPick: null,
      extra: { __draft: [ex] },
    });
  };

  // ---- the Exercises tab: the person's own groups, then the built-in catalog, narrowed by search and area filter
  const exerciseRow = (e) => ({
    name: e.name,
    svg: iconSvg(e.i),
    detail: e.sets + ' · ' + e.weight,
    open: () => openExercise(e.id),
    // Already in the workout being built: one of each, since a workout tracks its exercises by name.
    inWorkout: !!pick && pick.names.includes(e.name),
    add: () => addToWorkout(e),
  });
  const moveGroups = [];
  const pushGroup = (label, list) => {
    const hit = list.filter((e) => inAreas(e.areas) && (!q || e.name.toLowerCase().includes(q))).map(exerciseRow);
    if (hit.length) moveGroups.push({ label: label.toUpperCase(), count: plural(hit.length, 'exercise'), items: hit });
  };
  Object.keys(EX).forEach((w) => pushGroup(w, EX[w] || []));
  pushGroup('Unassigned', logic.model.library);
  // The shared starter catalog, after the person's own, grouped by each exercise's main target area.
  TARGET_AREAS.forEach((area) =>
    pushGroup('Built-in · ' + area, logic.model.builtins.filter((e) => (e.areas || [])[0] === area)),
  );

  return {
    tplConfirmOpen: !!confirm,
    tplConfirmTitle: 'How should this change be saved?',
    // For a workout, its name once (the options carry the rest). An exercise names itself in its own options.
    tplConfirmBody: confirm && !confirm.exercise ? 'Editing “' + confirm.name + '”.' : '',
    tplConfirmChoice: confirm?.choice === 'new' ? 'new' : 'update',
    tplConfirmSetChoice: (value) => confirm && logic.s({ tplConfirm: { ...confirm, choice: value } }),
    tplConfirmOptions: confirm
      ? [
          confirm.exercise
            ? {
                value: 'update',
                title: 'Update “' + confirm.exercise + '”',
                description: confirm.name
                  ? 'Changes the exercise in “' + confirm.name + '”.'
                  : 'Changes the exercise itself.',
              }
            : {
                value: 'update',
                title: 'Update this workout',
                description: 'Past sessions keep the old version.',
              },
          confirm.exercise
            ? {
                value: 'new',
                title: 'Save as a new exercise',
                description: confirm.name
                  ? '“' + confirm.exercise + '” in “' + confirm.name + '” stays exactly as it is.'
                  : 'Keeps the original as it is.',
              }
            : {
                value: 'new',
                title: 'Save as a new workout',
                description: 'The original and its sessions stay as they are.',
              },
        ]
      : [],
    // Inside the Update option only, and only when the exercise's workout has upcoming sessions.
    tplConfirmShowUpcoming: !!confirm && confirm.count > 0,
    tplConfirmUpcoming: !!confirm?.upcoming,
    tplConfirmToggleUpcoming: () => confirm && logic.s({ tplConfirm: { ...confirm, upcoming: !confirm.upcoming } }),
    tplConfirmUpcomingLabel: confirm
      ? confirm.exercise
        ? 'Also update ' +
          confirm.count +
          (confirm.count === 1 ? ' upcoming session' : ' upcoming sessions') +
          ' of “' +
          confirm.name +
          '”. Completed sessions never change.'
        : 'Also update ' + confirm.count + (confirm.count === 1 ? ' upcoming session' : ' upcoming sessions')
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
    // The "New" button shares a row with the Workouts/Exercises toggle. On a phone there's only room for "New",
    // and the toggle beside it already says which kind; screen readers still get the whole name.
    arsenalNewLabel: narrow ? 'New' : view === 'workouts' ? 'New workout' : 'New exercise',
    arsenalNewName: view === 'workouts' ? 'New workout' : 'New exercise',
    showArsenalExercises: view === 'exercises',
    arsenalCount:
      view === 'workouts'
        ? workouts.length + (workouts.length === 1 ? ' workout' : ' workouts')
        : exerciseCount,
    arsenalIntro:
      view === 'workouts'
        ? "Every workout you've saved, ready to add to your plan."
        : "Your exercises, grouped by the workout they belong to, then built-in ones you can add to any workout or copy to make your own.",
    arsenalSearchPlaceholder: view === 'workouts' ? 'Search workouts' : 'Search exercises',
    savedWorkouts,
    noSavedWorkouts: workouts.length === 0,
    noWorkoutMatches: workouts.length > 0 && (!!q || areaFilter.length > 0) && hits.length === 0,
    noWorkoutMatchNote: noMatchText('workouts'),
    arsenalAddOpen: !!st.arsenalAdd,
    openArsenalAdd: () => logic.s({ arsenalAdd: true }),
    closeArsenalAdd: () =>
      logic.s({ arsenalAdd: false, dName: '', dSets: '', dReps: '', dWeight: '', dRest: '', dAreas: [] }),
    commitArsenal: () => {
      const nm = (st.dName || '').trim();
      if (!nm || !(st.dAreas || []).length) return;
      const item = {
        name: nm,
        sets: joinSetsReps(st.dSets, st.dReps) || '3 × 10',
        weight: withLb(st.dWeight) || '—',
        rest: withSec(st.dRest) || '60 sec',
        i: st.dIcon || 'h',
        areas: st.dAreas || [],
      };
      logic.save(() => db.addLibraryExercise(item), {
        arsenalAdd: false,
        dName: '',
        dSets: '',
        dReps: '',
        dWeight: '',
        dRest: '',
        dIcon: 'h',
        dAreas: [],
      });
    },
    movesCount: exerciseCount,
    arsenalQuery: st.arsenalQ || '',
    noMatches: (!!q || areaFilter.length > 0) && moveGroups.length === 0,
    noMatchNote: noMatchText('exercises'),
    hasQuery: !!q,
    setArsenalQuery: (e) => logic.s({ arsenalQ: e.target.value }),
    clearArsenalQuery: () => logic.s({ arsenalQ: '' }),
    moveGroups,
    arsenalPicking: !!pick,
    arsenalPickTitle: pick ? pick.title || 'your new workout' : '',
    backToPickedWorkout: () =>
      logic.backTo('edit', { arsenalPick: null, arsenalAreas: pick ? pick.prevAreas || [] : st.arsenalAreas }),
    areaFilterOpen: !!st.arsenalAreasOpen,
    toggleAreaFilter: () => logic.s({ arsenalAreasOpen: !st.arsenalAreasOpen }),
    closeAreaFilter: () => logic.s({ arsenalAreasOpen: false }),
    areaFilterLabel: areaFilter.length ? TARGET_AREAS.filter((a) => areaFilter.includes(a)).join(', ') : 'All',
    areaFilterActive: areaFilter.length > 0,
    areaFilterOptions: TARGET_AREAS.map((name) => ({
      name,
      on: areaFilter.includes(name),
      set: (on) =>
        logic.s({ arsenalAreas: on ? areaFilter.concat([name]) : areaFilter.filter((a) => a !== name) }),
    })),
    clearAreaFilter: () => logic.s({ arsenalAreas: [], arsenalAreasOpen: false }),
  };
}
