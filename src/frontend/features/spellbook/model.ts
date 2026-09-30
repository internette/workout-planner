import { EQUIPMENT, EQUIPMENT_GROUPS, EX_DRAFT_CLEARED, MONTHS, TARGET_AREAS } from '@/frontend/shared/constants';
import { iconOptions, iconSvg } from '@/frontend/shared/icons';
import { DEFAULT_WEEKS, dayNames, pickedDays, planDays, toggleDay } from '@/frontend/shared/schedule';
import * as db from '@/frontend/data/plannerData';
import { countsOk, digitsOnly, editTemplatePatch, exerciseDraftDirty, exLine, isoOf, joinSetsReps, longDay, monthPatch, needsLine, newWorkoutPatch, noticePatch, numericOnly, plural, splitSetsReps, withLb, withSec } from '@/frontend/shared/helpers';
import type { Ctx } from '../planner/store/types';
import { areaToggles, plainExercise, DRAFT_CLEARED, draftClash, draftItem, draftOpened, draftReady, equipmentToggles } from '@/frontend/shared/exerciseDraft';
import type { BuiltinWorkout, Exercise, WorkoutSummary } from '@/frontend/data/plannerData';

// Spellbook (the 'arsenal' screen): the exercise library, its search and the add-exercise form.
// The equipment ticked in the Spellbook's filter, kept in this browser so it's there next time. Storage can be off
// (private windows, blocked site data): the filter then just starts empty.
const EQUIPMENT_KEY = 'moonshot.equipment';
function savedEquipment(): string[] {
  try {
    const kept = JSON.parse(window.localStorage.getItem(EQUIPMENT_KEY) || '[]');
    return Array.isArray(kept) ? EQUIPMENT.filter((x) => kept.includes(x)) : [];
  } catch {
    return [];
  }
}
function saveEquipment(list: string[]) {
  try {
    window.localStorage.setItem(EQUIPMENT_KEY, JSON.stringify(list));
  } catch {
    // Not kept, then: it still filters for now.
  }
}

export function arsenalVals(ctx: Ctx) {
  const { logic, st, EX, Y, TODAY_M, TODAY_D, narrow, relM } = ctx;

  // ---- exercise count (shown in the header when the exercises view is open)
  // One per row in the list, so it matches what's listed: an exercise inside two workouts is listed (and counted)
  // under each. The editor's picker shows each name once, and leaves out what the workout already has.
  const exerciseCount = plural(
    Object.keys(EX).reduce((n, k) => n + (EX[k] || []).length, 0) +
      logic.model.library.length +
      logic.model.builtins.length,
    'exercise',
  );

  // ---- edits to a saved workout never rewrite sessions that are already done. If sessions are still ahead
  // (from today on, not completed), ask whether they should follow the edit; past and completed ones never do.
  const todayIso = ctx.isoToday;
  // When the edit becomes a new workout, the screen moves on to that copy (and to its copy of the exercise).
  const applyEdit = (edit, mode, updateUpcoming, patch) =>
    logic.saveOnce(
      'template',
      () => db.updateWorkoutTemplate(edit, { mode, updateUpcoming, todayIso }),
      (r) => ({
        ...patch,
        ...(r.created ? { templateId: r.workoutId } : {}),
        // The workout being edited was left alone; its draft belongs to it, so open the copy read-only instead.
        tplConfirm: null,
      }),
    );
  const confirm = st.tplConfirm;
  const copyNameTrim = confirm && confirm.copyName != null && confirm.choice === 'new' ? confirm.copyName.trim() : null;
  const copyNameError =
    copyNameTrim == null
      ? ''
      : !copyNameTrim
        ? 'Give the new workout a name.'
        : logic.model.workouts.some((w) => w.name.trim().toLowerCase() === copyNameTrim.toLowerCase())
          ? 'You already have a workout called “' + copyNameTrim + '”.'
          : '';

  // ---- saved workouts
  const view = st.arsenalView === 'workouts' ? 'workouts' : 'exercises';
  const q = (st.arsenalQ || '').trim().toLowerCase();
  // Target-area filter, shared by both tabs: keeps anything that targets at least one of the chosen areas.
  const areaFilter: string[] = st.arsenalAreas || [];
  const inAreas = (areas) => !areaFilter.length || (areas || []).some((a) => areaFilter.includes(a));
  // Equipment filter, shared by both tabs: what the person has ticked, remembered in this browser. An exercise shows
  // when it needs nothing else (bodyweight ones always do); a workout shows when every one of its exercises does.
  const equipFilter: string[] = st.arsenalEquip !== undefined ? st.arsenalEquip : savedEquipment();
  const canDo = (e) => !equipFilter.length || e.equipment === undefined || e.equipment.every((x) => equipFilter.includes(x));
  // Anything narrowing the lists: a search, target areas, or equipment.
  const filtering = !!q || areaFilter.length > 0 || equipFilter.length > 0;
  const areaList = (list) =>
    list.length === 1 ? list[0] : list.slice(0, -1).join(', ') + ' or ' + list[list.length - 1];
  const noMatchText = (things) =>
    (q && areaFilter.length
      ? 'No ' + things + ' match “' + (st.arsenalQ || '').trim() + '” for ' + areaList(areaFilter)
      : areaFilter.length
        ? 'No ' + things + ' target ' + areaList(areaFilter)
        : q
          ? 'No ' + things + ' match “' + (st.arsenalQ || '').trim() + '”'
          : 'No ' + things) + (equipFilter.length ? ' with the equipment you ticked.' : '.');
  const workouts = logic.model.workouts;
  const builtinWorkouts = logic.model.builtinWorkouts || [];
  // Workouts, warm-ups, stretches or yoga on their own, once there are any of the others to tell apart. Only the kinds
  // there are any of are offered.
  const all = [...workouts, ...builtinWorkouts];
  const hasWarmups = all.some((w) => w.warmup);
  const hasStretches = all.some((w) => w.stretch);
  const hasYoga = all.some((w) => w.yoga);
  const kindOptions = [
    { value: 'all', label: 'All' },
    { value: 'main', label: 'Workouts' },
    // A non-breaking hyphen, so it isn't split over two lines.
    ...(hasWarmups ? [{ value: 'warmups', label: 'Warm\u2011ups' }] : []),
    ...(hasStretches ? [{ value: 'stretches', label: 'Stretches' }] : []),
    ...(hasYoga ? [{ value: 'yoga', label: 'Yoga' }] : []),
  ];
  const kind = kindOptions.some((o) => o.value === st.arsenalKind) ? st.arsenalKind : 'all';
  const workoutFiltering = filtering || kind !== 'all';
  // A warm-up is listed under Warm-ups and under its kind too (a warm-up stretch under Stretches). Workouts are the plain
  // ones: neither a stretch nor yoga, and not a warm-up.
  const inKind = (w) =>
    kind === 'all' ||
    (kind === 'warmups' ? !!w.warmup : kind === 'stretches' ? !!w.stretch : kind === 'yoga' ? !!w.yoga : !w.warmup && !w.stretch && !w.yoga);
  const matches = (w) =>
    inKind(w) &&
    inAreas(w.areas) &&
    (w.builtin ? w.list : EX[w.name] || []).every(canDo) &&
    (!q || w.name.toLowerCase().includes(q) || w.exercises.some((n) => n.toLowerCase().includes(q)));
  const hits = workouts.filter(matches);
  const builtinHits = builtinWorkouts.filter(matches);
  // The person's own workout a built-in one has become (added to the calendar, or copied): the one with its name.
  const mineOf = (w) => workouts.find((x) => x.name.trim().toLowerCase() === w.name.trim().toLowerCase()) || null;
  const workoutCard = (w: WorkoutSummary | BuiltinWorkout) => ({
    name: w.name,
    // Built-in warm-ups, stretches and yoga are grouped under their own heading already.
    warmup: !!w.warmup && !('builtin' in w && w.builtin),
    stretch: !!w.stretch && !('builtin' in w && w.builtin),
    yoga: !!w.yoga && !('builtin' in w && w.builtin),
    svg: iconSvg(w.icon || (w.kind === 'ride' ? 'bike' : 'h'), w.iconColor || undefined),
    meta:
      w.kind === 'ride'
        ? ['Ride', w.ride && w.ride.dist ? w.ride.dist + ' mi' : '', w.ride && w.ride.zone, w.time]
            .filter(Boolean)
            .join(' · ')
        : plural(w.exercises.length, 'exercise') + ' · ' + w.time,
    exercises:
      w.kind === 'ride' || !w.exercises.length
        ? ''
        : w.exercises.slice(0, 3).join(', ') +
          (w.exercises.length > 3 ? ' +' + (w.exercises.length - 3) + ' more' : ''),
    areas: w.areas,
    open: () => logic.nav({ screen: 'template', templateId: w.id }),
  });
  // The person's own workouts, then the built-in ones by group, as the Exercises tab lists exercises. With no built-in
  // workouts (their migration not run yet) it's one list with no heading, as before.
  const workoutGroups: { label: string; count: string; items: ReturnType<typeof workoutCard>[] }[] = [];
  if (hits.length)
    workoutGroups.push({
      label: builtinWorkouts.length ? 'YOUR WORKOUTS' : '',
      count: builtinWorkouts.length ? plural(hits.length, 'workout') : '',
      items: hits.map(workoutCard),
    });
  builtinHits.forEach((w) => {
    const label = 'BUILT-IN · ' + w.category.toUpperCase();
    let g = workoutGroups.find((x) => x.label === label);
    if (!g) workoutGroups.push((g = { label, count: '', items: [] }));
    const card = workoutCard(w);
    // Already one of theirs: said on the card, so it's clear adding it uses theirs.
    if (mineOf(w)) card.meta += ' · In your workouts';
    g.items.push(card);
  });
  workoutGroups.forEach((g) => {
    if (g.label && !g.count) g.count = plural(g.items.length, 'workout');
  });

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
    // Left out until the database has equipment, and the editor then shows no picker for it.
    ...(ex.equipment !== undefined ? { equipment: ex.equipment } : {}),
  });
  const copiesIn =
    found && !found.workout && !found.ex.builtin
      ? workouts.filter((w) => w.kind === 'lift' && w.exercises.some((n) => n.trim().toLowerCase() === found.ex.name.trim().toLowerCase()))
      : [];
  const exercise = found
    ? {
        name: found.ex.name,
        svg: iconSvg(found.ex.i),
        sets: found.ex.sets,
        weight: found.ex.weight,
        rest: found.ex.rest,
        areas: found.ex.areas || [],
        // What it needs; none is bodyweight. Not shown until the database has equipment at all.
        equipment:
          found.ex.equipment === undefined ? null : found.ex.equipment.length ? found.ex.equipment : ['Bodyweight'],
        builtin: !!found.ex.builtin,
        // One inside a workout belongs to that workout. One saved on its own is copied into a workout when it's
        // added, so it lists the workouts holding a copy (by name, which is how workouts keep their exercises).
        usedIn: found.workout
          ? [{ name: found.workout.name, open: () => logic.nav({ screen: 'template', templateId: found.workout.id }) }]
          : copiesIn.map((w) => ({ name: w.name, open: () => logic.nav({ screen: 'template', templateId: w.id }) })),
        usedInNote: !found.workout && copiesIn.length
          ? 'Each workout has its own copy, so changing this one doesn’t change them.'
          : '',
        edit: () =>
          logic.nav({
            screen: 'exerciseEdit',
            exEquipOpen: false,
            exDraft: draftFrom(found.ex, found.ex.name),
            exDraftOrig: draftFrom(found.ex, found.ex.name),
            exEditNav: true,
          }),
        // Only an exercise saved on its own can be deleted here. One inside a workout is removed from that workout's
        // editor, which keeps past sessions as they were; a built-in belongs to everyone.
        canDelete: !found.ex.builtin && !found.workout,
        remove: () =>
          logic.s({
            confirm: {
              kind: 'deleteExercise',
              id: found.ex.id,
              name: found.ex.name,
              title: 'Delete “' + found.ex.name + '”?',
              body: 'It comes out of your Spellbook. Workouts keep their own copy of any exercise, so none of them change.',
              label: 'Delete exercise',
            },
          }),
        // A built-in can't be changed, so "change it" means: open a copy in the editor, under a name of its own. Nothing
        // is saved until Save; Cancel leaves no copy behind.
        copy: () => {
          const taken = new Set(logic.model.library.concat(logic.model.builtins).map((e) => e.name.trim().toLowerCase()));
          let name = found.ex.name + ' (copy)';
          for (let n = 2; taken.has(name.toLowerCase()); n++) name = found.ex.name + ' (copy ' + n + ')';
          logic.nav({
            screen: 'exerciseEdit',
            exEquipOpen: false,
            exDraft: draftFrom(found.ex, name),
            exDraftOrig: draftFrom(found.ex, name),
            exEditNav: true,
            exCopy: true,
          });
        },
        // Straight into a workout, as the list's "+" does.
        add: () => addToWorkout(found.ex),
      }
    : null;
  const exDraft = st.exDraft || { name: '', sets: '', reps: '', weight: '', rest: '', i: 'h', areas: [] };
  const setExDraft = (field) => (e) => logic.s({ exDraft: { ...exDraft, [field]: e.target.value } });
  // Saving an exercise always asks how: update it, or keep it and save the edit as a new exercise.
  // Updating can also carry on to the workout's upcoming sessions. Completed and past sessions never change.
  const askExerciseSave = async (patch) => {
    // Back to the exercise's page. Opened with its own history entry (Edit), that entry is left behind.
    const after = {
      screen: 'exercise',
      exDraft: null,
      exDraftOrig: null,
      exEditNav: false,
      ...(st.exEditNav ? { hist: (st.hist || []).slice(0, -1) } : {}),
      ...noticePatch('“' + patch.name + '” saved.', 'exercise'),
    };
    const workout = found.workout;
    try {
      const count = workout ? await db.countUpcoming(workout.id, todayIso) : 0;
      logic.s({
        tplConfirm: {
          exercise: found.ex.name,
          copies: copiesIn.length,
          name: workout ? workout.name : '',
          count,
          choice: 'update',
          upcoming: true,
          apply: (choice, upcoming) => {
            if (choice === 'new') {
              // A new standalone exercise: the original and its workout stay exactly as they are.
              logic.saveOnce('exercise', () => db.createLibraryExercise(patch), (r) => ({
                ...after,
                exerciseId: r.id,
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
              logic.saveOnce('exercise', () => db.updateLibraryExercise(found.ex.id, patch), {
                ...after,
                tplConfirm: null,
              });
            }
          },
        },
      });
    } catch (e) {
      logic.fail(e);
    }
  };
  const renameTo = (exDraft.name || '').trim().toLowerCase();
  const copying = !!st.exCopy;
  const renameClash = copying
    ? (renameTo && logic.model.library.concat(logic.model.builtins).find((e) => e.name.trim().toLowerCase() === renameTo)) || null
    : found && renameTo && renameTo !== found.ex.name.trim().toLowerCase()
      ? (found.workout
          ? EX[found.workout.name] || []
          : logic.model.library.concat(logic.model.builtins)
        ).find((e) => e.id !== found.ex.id && e.name.trim().toLowerCase() === renameTo) || null
      : null;
  const cancelEdit = () => {
    if (!st.exEditNav) return logic.s({ screen: 'exercise', ...EX_DRAFT_CLEARED });
    logic.s(EX_DRAFT_CLEARED);
    logic.back();
  };
  const exerciseEdit = {
    name: exDraft.name,
    sets: exDraft.sets,
    reps: exDraft.reps,
    weight: numericOnly(exDraft.weight),
    rest: digitsOnly(exDraft.rest),
    setName: setExDraft('name'),
    setSets: (e) => logic.s({ exDraft: { ...exDraft, sets: digitsOnly(e.target.value) } }),
    setReps: (e) => logic.s({ exDraft: { ...exDraft, reps: digitsOnly(e.target.value) } }),
    setWeight: (e) => logic.s({ exDraft: { ...exDraft, weight: withLb(numericOnly(e.target.value)) } }),
    setRest: (e) => logic.s({ exDraft: { ...exDraft, rest: withSec(digitsOnly(e.target.value)) } }),
    areas: areaToggles(exDraft.areas || [], (areas) => logic.s({ exDraft: { ...exDraft, areas } })),
    // Equipment is one row that opens to the picker: what's picked, or "Bodyweight", while it's closed.
    equipmentOpen: !!st.exEquipOpen,
    toggleEquipment: () => logic.s({ exEquipOpen: !st.exEquipOpen }),
    equipmentSummary:
      exDraft.equipment === undefined ? '' : exDraft.equipment.length ? exDraft.equipment.join(', ') : 'Bodyweight',
    // What it needs, picked from the equipment list in its groups; none picked is bodyweight.
    equipmentGroups:
      exDraft.equipment === undefined
        ? null
        : equipmentToggles(exDraft.equipment, (equipment) => logic.s({ exDraft: { ...exDraft, equipment } })),
    icons: {
      value: exDraft.i,
      onChange: (name) => logic.s({ exDraft: { ...exDraft, i: name } }),
      options: iconOptions(),
    },
    // A rename can't take a name another exercise in the same place already has: another of the person's own (or a
    // built-in), or another exercise in the same workout.
    nameError: renameClash
      ? (renameClash.builtin ? 'There’s a built-in exercise called “' : 'You already have an exercise called “') +
        renameClash.name +
        '”. Give this one another name.'
      : '',
    canSave: !!exDraft.name.trim() && (exDraft.areas || []).length > 0 && !renameClash && countsOk(exDraft.sets, exDraft.reps),
    // Why Save is off, when it is (a name clash says so on the field itself).
    saveHint: renameClash
      ? ''
      : !exDraft.name.trim()
        ? 'Name it to save it.'
        : !countsOk(exDraft.sets, exDraft.reps)
          ? 'Sets and reps need to be at least 1.'
          : !(exDraft.areas || []).length
            ? 'Pick at least one target area.'
            : '',
    heading: copying ? 'COPY OF ' + (found ? found.ex.name.toUpperCase() : 'EXERCISE') : 'EDITING EXERCISE',
    saveLabel: copying ? 'Save copy' : 'Save changes',
    cancel: cancelEdit,
    save: () => {
      if (!found || !exDraft.name.trim() || !(exDraft.areas || []).length || renameClash || !countsOk(exDraft.sets, exDraft.reps))
        return;
      // Nothing changed: nothing to ask about or save.
      if (!copying && !exerciseDraftDirty(st)) return cancelEdit();
      const patch = {
        name: exDraft.name.trim(),
        sets: joinSetsReps(exDraft.sets, exDraft.reps),
        weight: exDraft.weight,
        rest: exDraft.rest,
        i: exDraft.i,
        areas: exDraft.areas || [],
        ...(exDraft.equipment !== undefined ? { equipment: exDraft.equipment } : {}),
      };
      if (copying)
        return logic.saveOnce('exercise', () => db.createLibraryExercise(patch), (r) => ({
          screen: 'exercise',
          exerciseId: r.id,
          exDraft: null,
          exDraftOrig: null,
          exEditNav: false,
          exCopy: false,
          ...(st.exEditNav ? { hist: (st.hist || []).slice(0, -1) } : {}),
          ...noticePatch('“' + r.name + '” is written into your Spellbook.', 'exercise'),
        }));
      askExerciseSave(patch);
    },
  };

  // ---- one saved workout, read-only: no date, no completion
  const onTemplateScreen = st.screen === 'template';
  const chosen = onTemplateScreen
    ? workouts.find((w) => w.id === st.templateId) || builtinWorkouts.find((w) => w.id === st.templateId)
    : null;
  const chosenBuiltin = chosen && (chosen as BuiltinWorkout).builtin ? (chosen as BuiltinWorkout) : null;
  const builtin = !!chosenBuiltin;
  const mine = builtin ? mineOf(chosen) : null;
  const template = chosen
    ? {
        name: chosen.name,
        svg: iconSvg(chosen.icon || (chosen.kind === 'ride' ? 'bike' : 'h'), chosen.iconColor || undefined),
        time: chosen.time,
        areas: chosen.areas,
        needs: chosen.kind === 'ride' ? null : needsLine(chosenBuiltin ? chosenBuiltin.list : EX[chosen.name] || []),
        isRide: chosen.kind === 'ride',
        rideStats: chosen.ride
          ? [
              { label: 'DISTANCE', value: chosen.ride.dist ? chosen.ride.dist + ' mi' : '—' },
              { label: 'DURATION', value: chosen.time },
              { label: 'ELEVATION', value: chosen.ride.elev ? chosen.ride.elev + ' ft' : '—' },
              { label: 'EFFORT', value: chosen.ride.zone },
            ]
          : [],
        // A built-in workout lists its own exercises: one of the person's might share its name.
        exercises: (chosenBuiltin ? chosenBuiltin.list : EX[chosen.name] || []).map((e) => ({
          name: e.name,
          svg: iconSvg(e.i),
          detail: exLine(e, true),
        })),
        // Takes it out of the Spellbook. Past sessions stay in your history; sessions still ahead come off the calendar
        // too, unless the switch in the dialog is turned off to keep them.
        remove: async () => {
          try {
            const ahead = (await db.upcomingOfWorkout(chosen.id, todayIso)).length;
            // Sessions it keeps: past and completed ones (its earlier versions carry the same name).
            const kept = Math.max(0, logic.model.entries.filter((x) => x.av.name === chosen.name).length - ahead);
            logic.s({
              confirm: {
                kind: 'archiveWorkout',
                id: chosen.id,
                name: chosen.name,
                title: 'Delete “' + chosen.name + '”?',
                body:
                  'It comes out of your Spellbook.' +
                  (kept === 1
                    ? ' Its past session stays in your history.'
                    : kept
                      ? ' Its ' + kept + ' past sessions stay in your history.'
                      : ''),
                ...(ahead
                  ? {
                      option: {
                        label:
                          ahead === 1
                            ? 'Also remove its upcoming session from the calendar'
                            : 'Also remove its ' + ahead + ' upcoming sessions from the calendar',
                        on: true,
                      },
                      ahead,
                    }
                  : {}),
                label: 'Delete workout',
              },
            });
          } catch (e) {
            logic.fail(e);
          }
        },
        // Puts this saved workout on the calendar: a date (and weekly repeats, if wanted) from a small dialog.
        schedule: () => logic.s({ tplSchedule: { date: todayIso, repeat: false } }),
        // The same editor as building a workout, with this saved workout in it: no date, nothing to tick off.
        edit: () =>
          logic.nav(editTemplatePatch(chosen.id)),
        notes: chosen.notes || '',
        builtin,
        eyebrow:
          (builtin ? 'BUILT-IN ' : 'SAVED ') +
          [chosen.warmup && 'WARM-UP', chosen.stretch ? 'STRETCH' : chosen.yoga ? 'YOGA' : !chosen.warmup && 'WORKOUT']
            .filter(Boolean)
            .join(' · '),
        // A built-in workout can't be changed: copied to the person's own to edit, or, once it is theirs, opened.
        builtinNote: !builtin
          ? ''
          : mine
            ? 'You have “' + mine.name + '” in your workouts. Adding it to the calendar uses yours; open yours to change it.'
            : 'Built-in workouts can’t be changed. Add it to the calendar as it is (it’s saved to your workouts when you do), or copy it to make your own version to edit.',
        copyLabel: mine ? 'Open yours' : 'Copy',
        copy: () =>
          mine
            ? logic.nav({ screen: 'template', templateId: mine.id })
            : logic.saveOnce(
                'copy',
                () => db.ownCopyOfBuiltin(chosenBuiltin),
                (r) => ({
                  screen: 'template',
                  templateId: r && r.workoutId,
                  ...noticePatch('“' + chosen.name + '” copied to your workouts. Edit it to make it your own.', 'template'),
                }),
              ),
      }
    : null;

  // ---- "Add to calendar" from a saved workout, on any day.
  const sched = onTemplateScreen && chosen ? st.tplSchedule : null;
  const schedDate = (() => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((sched && sched.date) || '');
    if (!m) return null;
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return isNaN(d.getTime()) ? null : d;
  })();
  // "Monday, September 5", with the year when it isn't this one.
  const schedWhen = schedDate
    ? longDay(schedDate) +
      (schedDate.getFullYear() !== Y ? ', ' + schedDate.getFullYear() : '')
    : '';
  const schedPast = !!schedDate && schedDate < new Date(Y, TODAY_M, TODAY_D);
  const logPast = schedPast && !(sched && sched.logDone === false);
  // Whether the chosen workout is already on a day.
  const hasOn = (d) => !!chosen && logic.model.entries.some((x) => x.m === relM(d) && x.d === d.getDate() && x.av.name === chosen.name);
  // The weekdays picked from the day (its own, unless others were), for the week from it or, repeating, for the weeks
  // chosen, leaving out days already gone by (they'd only show as missed) and days the workout is already on.
  // Until the repeat-days migration has run, a weekly series keeps just the one weekday it's started on.
  const oneRepeatDay = !logic.model.repeatDaysReady && !!(sched && sched.repeat);
  const schedDays = schedDate ? pickedDays(sched && sched.days, schedDate, schedPast || oneRepeatDay) : [];
  const schedWeeks = (sched && sched.weeks) || DEFAULT_WEEKS;
  const plan = schedDate
    ? planDays({
        start: schedDate,
        days: schedDays,
        repeat: !!(sched && sched.repeat),
        weeks: schedWeeks,
        today: new Date(Y, TODAY_M, TODAY_D),
        has: hasOn,
      })
    : { dates: [], skipped: 0 };
  // The days after the first.
  const repeatDays = plan.dates.slice(1);
  const lastRepeat = repeatDays[repeatDays.length - 1];
  const md = (d) => MONTHS[d.getMonth()] + ' ' + d.getDate() + (d.getFullYear() !== Y ? ', ' + d.getFullYear() : '');
  const first = plan.dates[0] || schedDate;
  // "Monday, September 5", with the year when it isn't this one.
  const firstWhen = first ? longDay(first) + (first.getFullYear() !== Y ? ', ' + first.getFullYear() : '') : '';
  // "every Tuesday and Thursday through November 24", or the days themselves, a week's worth without repeating.
  const repeatText = !lastRepeat
    ? ''
    : sched && sched.repeat
      ? 'every ' + dayNames(schedDays) + ' through ' + md(lastRepeat)
      : 'on ' + (repeatDays.length > 1 ? repeatDays.slice(0, -1).map(md).join(', ') + ' and ' : '') + md(lastRepeat);
  const scheduleCalendar = {
    open: !!sched,
    title: chosen ? 'Add “' + chosen.name + '” to the calendar' : '',
    date: (sched && sched.date) || '',
    setDate: (e) => logic.s({ tplSchedule: { ...sched, date: e.target.value } }),
    repeat: !!(sched && sched.repeat),
    setRepeat: (on) => logic.s({ tplSchedule: { ...sched, repeat: !!on } }),
    weeks: schedWeeks,
    setWeeks: (w) => logic.s({ tplSchedule: { ...sched, weeks: w } }),
    // The weekdays it goes on from the day. A day gone by only has its own.
    showDays: !!schedDate && !schedPast && !oneRepeatDay,
    days: schedDays,
    toggleDay: (d) => logic.s({ tplSchedule: { ...sched, days: toggleDay(schedDays, d) } }),
    note: !schedDate
      ? 'Pick a day.'
      : (repeatDays.length
          ? firstWhen + ', then ' + repeatText + ': ' + plan.dates.length + ' sessions in all.'
          : sched && sched.repeat
            ? 'Just ' + firstWhen + '. The weeks after have gone by or already have it.'
            : 'Just ' + firstWhen + '.') +
        (plan.skipped ? ' ' + plural(plan.skipped, 'day') + ' that already ' + (plan.skipped === 1 ? 'has' : 'have') + ' it left out.' : '') +
        // Said before adding: a second one on a day that has it, or a day already gone by.
        (schedDays.includes(schedDate.getDay()) && hasOn(schedDate) ? ' “' + chosen.name + '” is already on that day, so it would be there twice.' : '') +
        (schedPast
          ? (logPast ? ' ' + schedWhen + ' goes on the calendar as done.' : ' ' + schedWhen + ' has gone by, so it will show as missed.')
          : ''),
    // A day that has gone by is most likely a workout already done, so it's logged as done unless switched off.
    showLogDone: schedPast,
    logDone: logPast,
    setLogDone: (on) => logic.s({ tplSchedule: { ...sched, logDone: !!on } }),
    canAdd: plan.dates.length > 0 && !logic.busy('schedule'),
    cancel: () => logic.s({ tplSchedule: null }),
    // Afterwards it stays here and says where the workout went, with a way to go and see that day.
    add: () => {
      if (!chosen || !schedDate) return;
      if (!plan.dates.length) return;
      const dates = plan.dates.map(isoOf);
      const when = firstWhen;
      const then = repeatText;
      // A built-in workout goes on the calendar as one of the person's own: theirs by that name, or a new copy.
      const saving = builtin && !mine;
      logic.saveOnce(
        'schedule',
        () =>
          (chosenBuiltin ? db.ownCopyOfBuiltin(chosenBuiltin).then((c) => c.workoutId) : Promise.resolve(chosen.id)).then((id) =>
            db.scheduleWorkout(
              id,
              dates,
              sched && sched.repeat ? schedDays : [],
              logPast ? { exercises: chosen.kind === 'ride' ? [] : chosen.exercises } : undefined,
            ),
          ),
        (r) => ({
          tplSchedule: null,
          tplScheduled: {
            templateId: chosen.id,
            text:
              (saving ? 'Saved to your workouts. ' : '') +
              (logPast ? 'Logged as done: ' : 'On the calendar: ') + when + (then ? ', then ' + then + '.' : '.'),
            ...monthPatch(relM(first)),
            day: first.getDate(),
            entryId: r && r.entryId,
          },
        }),
      );
    },
    // The confirmation belongs to the workout it was added from.
    done: chosen && st.tplScheduled && st.tplScheduled.templateId === chosen.id ? st.tplScheduled.text : '',
    viewDay: () => {
      const t = st.tplScheduled;
      if (!t) return;
      logic.nav({ screen: 'day', seg: 'Day', monthOpen: false, month: t.month, yOff: t.yOff || 0, day: t.day, entryId: t.entryId, tplScheduled: null });
    },
  };

  // ---- "Add to workout". Opened from a workout's "Browse the full Spellbook", it goes into that workout and returns
  // there; opened any other way, it asks which workout: a saved one (opened in the editor with it added) or a new one.
  const pick = st.arsenalPick || null;
  const addToWorkout = (e) => {
    const ex = plainExercise(e);
    if (pick) {
      const gone = (st.removed || {})[pick.key] || [];
      // Taken out of this workout earlier in the edit: bring the original back rather than adding a second copy.
      const patch = gone.includes(e.name)
        ? { removed: { ...st.removed, [pick.key]: gone.filter((n) => n !== e.name) } }
        : { extra: { ...st.extra, [pick.key]: ((st.extra || {})[pick.key] || []).concat([ex]) } };
      return logic.backTo('edit', { ...patch, arsenalPick: null, arsenalAreas: pick.prevAreas || [] });
    }
    // Otherwise ask which workout it goes in: one of the saved ones, or a new one.
    logic.s({ addTo: ex });
  };
  const addTo = st.addTo || null;
  // Into a saved workout: its editor opens with the exercise already added, to look over and save.
  const addToSaved = (w) =>
    logic.nav(
      editTemplatePatch(w.id, {
        addTo: null,
        extra: { ['tpl:' + w.id]: [addTo] },
        // Added in the editor, not yet saved: says so, so leaving without Save isn't a surprise.
        ...noticePatch('“' + addTo.name + '” added to “' + w.name + '”. Save to keep it.', 'edit'),
      }),
    );
  const addToNew = (ex) => {
    logic.nav(
      newWorkoutPatch({
        newType: 'lift',
        newFrom: 'arsenal',
        schedule: false,
        arsenalPick: null,
        addTo: null,
        extra: { __draft: [ex] },
        ...noticePatch('“' + ex.name + '” is in a new workout. Name it and save to keep it.', 'edit'),
      }),
    );
  };
  const addToDialog = {
    open: !!addTo,
    title: addTo ? 'Add “' + addTo.name + '” to…' : '',
    // Lifting workouts only; one that already has this exercise says so instead.
    options: addTo
      ? workouts
          .filter((w) => w.kind === 'lift')
          .map((w) => {
            const has = w.exercises.includes(addTo.name);
            return {
              name: w.name,
              meta: has ? 'Already in it' : plural(w.exercises.length, 'exercise'),
              disabled: has,
              pick: () => addToSaved(w),
            };
          })
      : [],
    pickNew: () => addTo && addToNew(addTo),
    cancel: () => logic.s({ addTo: null }),
  };

  // ---- the Exercises tab: the person's own groups, then the built-in catalog, narrowed by search and area filter
  const exerciseRow = (e: Exercise) => ({
    name: e.name,
    svg: iconSvg(e.i),
    detail: exLine(e),
    open: () => openExercise(e.id),
    // Already in the workout being built: one of each, since a workout tracks its exercises by name.
    inWorkout: !!pick && pick.names.includes(e.name),
    add: () => addToWorkout(e),
  });
  const moveGroups: { label: string; count: string; items: ReturnType<typeof exerciseRow>[] }[] = [];
  const pushGroup = (label, list) => {
    const hit = list
      .filter((e) => inAreas(e.areas) && canDo(e) && (!q || e.name.toLowerCase().includes(q)))
      .map(exerciseRow);
    if (hit.length) moveGroups.push({ label: label.toUpperCase(), count: plural(hit.length, 'exercise'), items: hit });
  };
  Object.keys(EX).forEach((w) => pushGroup(w, EX[w] || []));
  // The person's own exercises, made in the Spellbook. Adding one to a workout puts a copy there, listed under that
  // workout too, so this isn't "not in any workout": it's where their own ones live.
  pushGroup('Your own exercises', logic.model.library);
  // The shared starter catalog, after the person's own, grouped by each exercise's main target area.
  TARGET_AREAS.forEach((area) =>
    pushGroup('Built-in · ' + area, logic.model.builtins.filter((e) => (e.areas || [])[0] === area)),
  );

  return {
    tplConfirmOpen: !!confirm,
    tplConfirmTitle: 'How should this change be saved?',
    // For a workout, its name once (the options carry the rest). An exercise names itself in its own options.
    // A caller can bring its own text and options (the calendar does, for an edit to one session).
    tplConfirmBody: confirm?.body ?? (confirm && !confirm.exercise ? 'Editing “' + confirm.name + '”.' : ''),
    tplConfirmChoice: confirm?.choice === 'new' ? 'new' : 'update',
    tplConfirmSetChoice: (value) => confirm && logic.s({ tplConfirm: { ...confirm, choice: value } }),
    tplConfirmOptions: confirm?.options
      ? confirm.options
      : confirm
      ? [
          confirm.exercise
            ? {
                value: 'update',
                title: 'Update “' + confirm.exercise + '”',
                description: confirm.name
                  ? 'Changes the exercise in “' + confirm.name + '”. Past and completed sessions keep the old version.'
                  : confirm.copies
                    ? 'Changes this exercise. Workouts that use it keep their own copy.'
                    : 'Changes the exercise itself.',
              }
            : {
                value: 'update',
                title: 'Update this workout',
                // Nothing on the calendar yet: there's no old version to keep.
                description:
                  confirm.sessions === 0
                    ? 'Changes “' + confirm.name + '” in your Spellbook.'
                    : 'Past and completed sessions keep the old version.',
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
    tplConfirmShowUpcoming: !!confirm && !confirm.options && confirm.count > 0,
    tplConfirmUpcoming: !!confirm?.upcoming,
    tplConfirmToggleUpcoming: () => confirm && logic.s({ tplConfirm: { ...confirm, upcoming: !confirm.upcoming } }),
    tplConfirmUpcomingLabel: confirm
      ? confirm.exercise
        ? 'Also update ' +
          plural(confirm.count, 'upcoming session') +
          ' of “' +
          confirm.name +
          '”.'
        : 'Also update ' + plural(confirm.count, 'upcoming session')
      : '',
    // A saved workout's "Save as a new workout" takes a name for the copy, which has to be new.
    tplConfirmShowName: !!confirm && confirm.copyName != null && confirm.choice === 'new',
    tplConfirmName: confirm && confirm.copyName != null ? confirm.copyName : '',
    tplConfirmSetName: (e) => confirm && logic.s({ tplConfirm: { ...confirm, copyName: e.target.value } }),
    tplConfirmNameError: copyNameError,
    tplConfirmBlocked: !!copyNameError,
    tplConfirmCancel: () => logic.s({ tplConfirm: null }),
    tplConfirmSave: () => {
      if (!confirm || copyNameError) return;
      logic.s({ tplConfirm: null });
      confirm.apply(confirm.choice === 'new' ? 'new' : 'update', !!confirm.upcoming, (confirm.copyName || '').trim());
    },
    exercise,
    exerciseEdit,
    addToDialog,
    template,
    scheduleCalendar,
    arsenalView: view,
    setArsenalView: (next) => logic.s({ arsenalView: next, arsenalAdd: false }),
    showArsenalWorkouts: view === 'workouts',
    // The "New" button is at the end of the title's line. On a phone there's only room for "New", and the
    // Workouts/Exercises toggle below already says which kind; screen readers still get the whole name.
    arsenalNewLabel: narrow ? 'New' : view === 'workouts' ? 'New workout' : 'New exercise',
    arsenalNewName: view === 'workouts' ? 'New workout' : 'New exercise',
    showArsenalExercises: view === 'exercises',
    // While searching or filtering, how many of them are showing.
    arsenalCount:
      view === 'workouts'
        ? (workoutFiltering ? hits.length + builtinHits.length + ' of ' : '') +
          plural(workouts.length + builtinWorkouts.length, 'workout')
        : (filtering ? moveGroups.reduce((n, g) => n + g.items.length, 0) + ' of ' : '') + exerciseCount,
    // One line: the group labels say the rest.
    arsenalIntro:
      view === 'workouts'
        ? builtinWorkouts.length
          ? 'Your workouts first, then built\u2011in ones.'
          : "Every workout you've written."
        : 'By the workout they’re in, then built\u2011in ones.',
    arsenalSearchPlaceholder: view === 'workouts' ? 'Search workouts' : 'Search exercises',
    workoutGroups,
    noSavedWorkouts: workouts.length + builtinWorkouts.length === 0,
    noWorkoutMatches:
      workouts.length + builtinWorkouts.length > 0 && workoutFiltering && hits.length + builtinHits.length === 0,
    noWorkoutMatchNote: noMatchText(kind === 'warmups' ? 'warm-ups' : kind === 'stretches' ? 'stretches' : kind === 'yoga' ? 'yoga flows' : 'workouts'),
    workoutKindOptions: kindOptions,
    workoutKind: kind,
    setWorkoutKind: (k) => logic.s({ arsenalKind: k }),
    arsenalAddOpen: !!st.arsenalAdd,
    // Focus goes into the form, which opens further down the page.
    openArsenalAdd: () => {
      logic.s({ arsenalAdd: true, ...draftOpened(st) });
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-arsenal-add] input')?.focus());
    },
    closeArsenalAdd: () => logic.s({ arsenalAdd: false, ...DRAFT_CLEARED }),
    commitArsenal: () => {
      if (!draftReady(st, draftClash(st, logic.model.library.concat(logic.model.builtins)))) return;
      const item = draftItem(st, logic.model);
      logic.saveOnce('exercise', () => db.createLibraryExercise(item), (r) => ({
        ...noticePatch('“' + r.name + '” added to your Spellbook, under “Your own exercises”.', 'arsenal'),
        arsenalAdd: false,
        ...DRAFT_CLEARED,
      }));
    },
    arsenalQuery: st.arsenalQ || '',
    noMatches: filtering && moveGroups.length === 0,
    // Read out when a search or area filter changes what's listed (the list itself changes silently).
    arsenalResults:
      !filtering
        ? ''
        : view === 'workouts'
          ? hits.length + builtinHits.length
            ? plural(hits.length + builtinHits.length, 'workout') + ' found.'
            : 'No workouts match.'
          : moveGroups.length
            ? plural(moveGroups.reduce((n, g) => n + g.items.length, 0), 'exercise') + ' found.'
            : 'No exercises match.',
    noMatchNote: noMatchText('exercises'),
    setArsenalQuery: (e) => logic.s({ arsenalQ: e.target.value }),
    clearArsenalQuery: () => logic.s({ arsenalQ: '' }),
    moveGroups,
    arsenalPicking: !!pick,
    arsenalPickTitle: pick ? pick.title || 'your new workout' : '',
    backToPickedWorkout: () =>
      logic.backTo('edit', { arsenalPick: null, arsenalAreas: pick ? pick.prevAreas || [] : st.arsenalAreas }),
    // ---- The Filter button and its sheet: the kind (workouts only), target areas and equipment. Each change applies at
    // once; the sheet's button says how many that leaves, and closes it.
    filterOpen: !!st.arsenalFilterOpen,
    openFilter: () => logic.s({ arsenalFilterOpen: true }),
    closeFilter: () => logic.s({ arsenalFilterOpen: false }),
    filterTitle: view === 'workouts' ? 'Filter workouts' : 'Filter exercises',
    showKindInFilter: view === 'workouts' && kindOptions.length > 2,
    filterShowLabel: (() => {
      const n =
        view === 'workouts' ? hits.length + builtinHits.length : moveGroups.reduce((sum, g) => sum + g.items.length, 0);
      return n ? 'Show ' + plural(n, view === 'workouts' ? 'workout' : 'exercise') : 'Nothing matches';
    })(),
    // What's filtered, as chips under the search: one each, ✕ to take it off.
    activeFilters: [
      ...(view === 'workouts' && kind !== 'all'
        ? [{ label: kindOptions.find((o) => o.value === kind)?.label || '', remove: () => logic.s({ arsenalKind: 'all' }) }]
        : []),
      ...TARGET_AREAS.filter((a) => areaFilter.includes(a)).map((a) => ({
        label: a,
        remove: () => logic.s({ arsenalAreas: areaFilter.filter((x) => x !== a) }),
      })),
      ...(equipFilter.length
        ? [
            {
              label: equipFilter.length <= 2 ? equipFilter.join(', ') : equipFilter.length + ' pieces of equipment',
              remove: () => {
                saveEquipment([]);
                logic.s({ arsenalEquip: [] });
              },
            },
          ]
        : []),
    ],
    clearFilters: () => {
      if (equipFilter.length) saveEquipment([]);
      logic.s({ arsenalKind: 'all', arsenalAreas: [], ...(equipFilter.length ? { arsenalEquip: [] } : {}) });
    },
    areaFilterActive: areaFilter.length > 0,
    areaFilterOptions: TARGET_AREAS.map((name) => ({
      name,
      on: areaFilter.includes(name),
      set: (on) =>
        logic.s({ arsenalAreas: on ? areaFilter.concat([name]) : areaFilter.filter((a) => a !== name) }),
    })),
    clearAreaFilter: () => logic.s({ arsenalAreas: [] }),
    // Shown once exercises know their equipment (the equipment migration has run).
    equipFilterShown: logic.model.builtins.some((e) => e.equipment !== undefined),
    equipFilterActive: equipFilter.length > 0,
    // Each group of the filter opens and closes on its own; one with something ticked starts open.
    equipFilterGroups: EQUIPMENT_GROUPS.map((g) => ({
      label: g.label,
      open: (st.equipGroupsOpen || {})[g.label] ?? g.items.some((x) => equipFilter.includes(x)),
      picked: g.items.filter((x) => equipFilter.includes(x)).join(', '),
      toggle: () => {
        const isOpen = (st.equipGroupsOpen || {})[g.label] ?? g.items.some((x) => equipFilter.includes(x));
        logic.s({ equipGroupsOpen: { ...(st.equipGroupsOpen || {}), [g.label]: !isOpen } });
      },
      items: g.items.map((name) => {
        const on = equipFilter.includes(name);
        return {
          name,
          on,
          set: (tick) => {
            const next = EQUIPMENT.filter((x) => (x === name ? !!tick : equipFilter.includes(x)));
            saveEquipment(next);
            logic.s({ arsenalEquip: next });
          },
        };
      }),
    })),
    clearEquipFilter: () => {
      saveEquipment([]);
      logic.s({ arsenalEquip: [] });
    },
  };
}
