import { colors } from '@/components/ui/colors';
import { DOWFULL, EDIT_OVERLAYS, ICON_NAMES, MONTHS, TARGET_AREAS } from '../constants';
import { iconSvg } from '../icons';
import { EXERCISE_ICON_NAMES } from '@/components/ui/icons';
import * as db from '@/lib/plannerData';
import { digitsOnly, exerciseDraftDirty, exLine, isoOf, joinSetsReps, monthPatch, numericOnly, plural, restDigits, splitSetsReps, withLb, withSec } from '../helpers';
import { optStyle } from '../styles';
import type { Ctx } from '../types';

// Spellbook (the 'arsenal' screen): the exercise library, its search and the add-exercise form.
export function arsenalVals(ctx: Ctx) {
  const { logic, st, EX, Y, TODAY_M, TODAY_D, narrow, relM } = ctx;

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
        edit: () =>
          logic.nav({
            screen: 'exerciseEdit',
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
    };
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
              logic.saveOnce('exercise', () => db.updateExerciseRow({ kind: 'library', id: found.ex.id }, patch), {
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
    if (!st.exEditNav) return logic.s({ screen: 'exercise', exDraft: null, exDraftOrig: null, exCopy: false });
    logic.s({ exDraft: null, exDraftOrig: null, exEditNav: false, exCopy: false });
    logic.back();
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
      label: ICON_NAMES[name] + ' icon',
      on: exDraft.i === name,
      style: optStyle(exDraft.i === name),
    })),
    // A rename can't take a name another exercise in the same place already has: another of the person's own (or a
    // built-in), or another exercise in the same workout.
    nameError: renameClash
      ? (renameClash.builtin ? 'There’s a built-in exercise called “' : 'You already have an exercise called “') +
        renameClash.name +
        '”. Give this one another name.'
      : '',
    canSave: !!exDraft.name.trim() && (exDraft.areas || []).length > 0 && !renameClash,
    heading: copying ? 'COPY OF ' + (found ? found.ex.name.toUpperCase() : 'EXERCISE') : 'EDIT EXERCISE',
    saveLabel: copying ? 'Save copy' : 'Save changes',
    cancel: cancelEdit,
    save: () => {
      if (!found || !exDraft.name.trim() || !(exDraft.areas || []).length || renameClash) return;
      // Nothing changed: nothing to ask about or save.
      if (!copying && !exerciseDraftDirty(st)) return cancelEdit();
      const patch = {
        name: exDraft.name.trim(),
        sets: joinSetsReps(exDraft.sets, exDraft.reps),
        weight: exDraft.weight,
        rest: exDraft.rest,
        i: exDraft.i,
        areas: exDraft.areas || [],
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
          announce: '“' + r.name + '” saved to your Spellbook.',
        }));
      askExerciseSave(patch);
    },
  };

  // ---- one saved workout, read-only: no date, no completion
  const onTemplateScreen = st.screen === 'template';
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
          detail: exLine(e, true),
        })),
        // Takes it out of the Spellbook. Sessions still ahead come off the calendar; past ones stay in your history.
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
                  'It comes out of your Spellbook' +
                  (ahead === 1
                    ? ', and its upcoming session comes off the calendar'
                    : ahead
                      ? ', and its ' + ahead + ' upcoming sessions come off the calendar'
                      : '') +
                  '.' +
                  (kept === 1
                    ? ' Its other session stays in your history.'
                    : kept
                      ? ' Its ' + kept + ' other sessions stay in your history.'
                      : ''),
                label: 'Delete workout',
              },
            });
          } catch (e) {
            logic.s({ saveError: e instanceof Error ? e.message : String(e) });
          }
        },
        // Puts this saved workout on the calendar: a date (and weekly repeats, if wanted) from a small dialog.
        schedule: () => logic.s({ tplSchedule: { date: todayIso, repeat: false } }),
        // The same editor as building a workout, with this saved workout in it: no date, nothing to tick off.
        edit: () =>
          logic.nav({
            ...EDIT_OVERLAYS,
            screen: 'edit',
            editing: true,
            creating: false,
            editTemplate: chosen.id,
            editId: null,
            addOpen: false,
            leaveOpen: false,
          }),
        notes: chosen.notes || '',
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
    ? DOWFULL[schedDate.getDay()] + ', ' + MONTHS[schedDate.getMonth()] + ' ' + schedDate.getDate() +
      (schedDate.getFullYear() !== Y ? ', ' + schedDate.getFullYear() : '')
    : '';
  const schedPast = !!schedDate && schedDate < new Date(Y, TODAY_M, TODAY_D);
  const logPast = schedPast && !(sched && sched.logDone === false);
  const scheduleCalendar = {
    open: !!sched,
    title: chosen ? 'Add “' + chosen.name + '” to the calendar' : '',
    date: (sched && sched.date) || '',
    setDate: (e) => logic.s({ tplSchedule: { ...sched, date: e.target.value } }),
    repeat: !!(sched && sched.repeat),
    setRepeat: (on) => logic.s({ tplSchedule: { ...sched, repeat: !!on } }),
    note: !schedDate
      ? 'Pick a day.'
      : (sched && sched.repeat
          ? 'Every ' + DOWFULL[schedDate.getDay()] + ' for the next 12 weeks too, 13 sessions in all.'
          : 'Just ' + schedWhen + '.') +
        // Said before adding: a second one on a day that has it, or a day already gone by.
        (chosen && logic.model.entries.some((x) => x.m === relM(schedDate) && x.d === schedDate.getDate() && x.av.name === chosen.name)
          ? ' “' + chosen.name + '” is already on that day, so it would be there twice.'
          : '') +
        (schedPast ? (logPast ? ' It goes on the calendar as done.' : ' That day has gone by, so it will show as missed.') : ''),
    // A day that has gone by is most likely a workout already done, so it's logged as done unless switched off.
    showLogDone: schedPast,
    logDone: logPast,
    setLogDone: (on) => logic.s({ tplSchedule: { ...sched, logDone: !!on } }),
    canAdd: !!schedDate && !logic.busy('schedule'),
    cancel: () => logic.s({ tplSchedule: null }),
    // Afterwards it stays here and says where the workout went, with a way to go and see that day.
    add: () => {
      if (!chosen || !schedDate) return;
      const dates = [isoOf(schedDate)];
      if (sched.repeat)
        for (let w = 1; w <= 12; w++)
          dates.push(isoOf(new Date(schedDate.getFullYear(), schedDate.getMonth(), schedDate.getDate() + w * 7)));
      const when = schedWhen;
      logic.saveOnce(
        'schedule',
        () =>
          db.scheduleWorkout(
            chosen.id,
            dates,
            !!sched.repeat,
            logPast ? { exercises: chosen.kind === 'ride' ? [] : chosen.exercises } : undefined,
          ),
        (r) => ({
          tplSchedule: null,
          tplScheduled: {
            templateId: chosen.id,
            text: (logPast ? 'Logged as done: ' : 'On the calendar: ') + when + (sched.repeat ? ', and every ' + DOWFULL[schedDate.getDay()] + ' for 12 weeks after.' : '.'),
            ...monthPatch(relM(schedDate)),
            day: schedDate.getDate(),
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
    const ex = { name: e.name, sets: e.sets, weight: e.weight, rest: e.rest, i: e.i, areas: e.areas || [] };
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
    logic.nav({
      ...EDIT_OVERLAYS,
      screen: 'edit',
      editing: true,
      creating: false,
      editTemplate: w.id,
      editId: null,
      addOpen: false,
      leaveOpen: false,
      addTo: null,
      extra: { ['tpl:' + w.id]: [addTo] },
    });
  const addToNew = (ex) => {
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
      addTo: null,
      extra: { __draft: [ex] },
    });
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
  const exerciseRow = (e) => ({
    name: e.name,
    svg: iconSvg(e.i),
    detail: exLine(e),
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
    // After a delete, the list says what went (and it's read out).
    spellNotice: st.screen === 'arsenal' || st.screen === 'template' ? st.spellNotice || '' : '',
    dismissSpellNotice: () => logic.s({ spellNotice: null }),
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
    tplConfirmShowUpcoming: !!confirm && !confirm.options && confirm.count > 0,
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
        ? "Every workout you've written. Open one to add it to the calendar."
        : "Your exercises, grouped by the workout they belong to, then built-in ones you can add to any workout or copy to make your own.",
    arsenalSearchPlaceholder: view === 'workouts' ? 'Search workouts' : 'Search exercises',
    savedWorkouts,
    noSavedWorkouts: workouts.length === 0,
    noWorkoutMatches: workouts.length > 0 && (!!q || areaFilter.length > 0) && hits.length === 0,
    noWorkoutMatchNote: noMatchText('workouts'),
    arsenalAddOpen: !!st.arsenalAdd,
    // A new exercise starts with real values in its boxes (3 × 10, 60 sec rest) — what it saves if left alone —
    // rather than grey examples that look like values. Weight starts empty: none is saved unless one is typed.
    // Focus goes into the form, which opens further down the page.
    openArsenalAdd: () => {
      logic.s({ arsenalAdd: true, dSets: st.dSets || '3', dReps: st.dReps || '10', dRest: st.dRest || '60' });
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-arsenal-add] input')?.focus());
    },
    closeArsenalAdd: () =>
      logic.s({ arsenalAdd: false, dName: '', dSets: '', dReps: '', dWeight: '', dRest: '', dAreas: [] }),
    commitArsenal: () => {
      const nm = (st.dName || '').trim();
      if (!nm || !(st.dAreas || []).length) return;
      const lower = nm.toLowerCase();
      if (logic.model.library.concat(logic.model.builtins).some((e) => e.name.trim().toLowerCase() === lower)) return;
      const item = {
        name: nm,
        sets: joinSetsReps(st.dSets, st.dReps) || '3 × 10',
        weight: withLb(st.dWeight) || '—',
        rest: withSec(st.dRest) || '60 sec',
        i: st.dIcon || 'h',
        areas: st.dAreas || [],
      };
      logic.saveOnce('exercise', () => db.addLibraryExercise(item), {
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
    // Read out when a search or area filter changes what's listed (the list itself changes silently).
    arsenalResults:
      !q && !areaFilter.length
        ? ''
        : view === 'workouts'
          ? hits.length
            ? plural(hits.length, 'workout') + ' found.'
            : 'No workouts match.'
          : moveGroups.length
            ? plural(moveGroups.reduce((n, g) => n + g.items.length, 0), 'exercise') + ' found.'
            : 'No exercises match.',
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
