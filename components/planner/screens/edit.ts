import { DOW3, DOWFULL, EDIT_OVERLAYS, EQUIPMENT, EQUIPMENT_GROUPS, ICON_COLORS, ICON_COLOR_NAMES, ICON_NAMES, MON3, MONTHS, TARGET_AREAS } from '../constants';
import { countsOk, needsLine, rollMinutes, digitsOnly, noticePatch, exLine, idOf, isoOf, joinSetsReps, mod12, monthPatch, numericOnly, plural, restDigits, setsRepsOk, splitSetsReps, withLb, withSec, workoutDraftDirty } from '../helpers';
import { EXERCISE_ICON_NAMES } from '@/components/ui/icons';
import { iconSvg } from '../icons';
import { optStyle } from '../styles';
import * as db from '@/lib/plannerData';
import { colors } from '@/components/ui/colors';
import type { Ctx } from '../types';

// Create / edit workout screen: ride plan, exercise list, icons, date picker, save and delete.
export function editVals(ctx: Ctx) {
  const {
    logic,
    creating,
    st,
    isCycleView,
    ridePlanOpen,
    rideDone,
    ridePast,
    rDist,
    rElev,
    plannedMin,
    savedRide,
    rHrs,
    rMins,
    aDist,
    aElev,
    aHrs,
    aMins,
    ridePct,
    picked,
    notesVal,
    listKey,
    libraryFor,
    added,
    gone,
    wIcon,
    wColor,
    doneSel,
    selName,
    selRide,
    selAct,
    baseName,
    baseKey,
    mi,
    selDay,
    srcAct,
    pickerCells,
    Y,
    relM,
    EXV,
    selList,
    selDate,
    doneSet,
    doneNames,
    TODAY_M,
    TODAY_D,
    DIARY,
    pickM,
    tplMode,
  } = ctx;
  // Another year than this one says which, next to the date.
  const yearNote = Math.floor(mi / 12) ? ', ' + selDate.getFullYear() : '';
  // Where each nav item actually goes, so a guarded nav click can land there after "Discard" or "Save changes" —
  // exactly what pressing that nav item would have done, including the "come back here" history entry the ones
  // through logic.nav() push (Calendar deliberately doesn't: it always starts fresh from today).
  const navHistory = () => (st.hist || []).concat([{
    screen: st.screen, month: st.month, yOff: st.yOff, day: st.day, seg: st.seg,
    diaryFrom: st.diaryFrom, diaryEdit: st.diaryEdit, creating: st.creating,
  }]);
  const NAV_DESTINATIONS = {
    day: { screen: 'day', ...monthPatch(TODAY_M), day: TODAY_D, monthOpen: false, seg: 'Day', creating: false },
    diaryList: { screen: 'diaryList', monthOpen: false, hist: navHistory() },
    arsenal: { screen: 'arsenal', monthOpen: false, hist: navHistory() },
    summary: { screen: 'summary', monthOpen: false, hist: navHistory() },
    profile: { screen: 'profile', monthOpen: false, hist: navHistory() },
  };
  // Workout names are unique among saved workouts (ignoring case): the app looks workouts up by name, and two with
  // one name used to be merged into one. The name being typed, and the saved workout that already has it, if any.
  const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();
  const typedName = creating ? st.newName || '' : (st.renames || {})[baseName] || '';
  const nameClash =
    typedName.trim() && (creating || !sameName(typedName, baseName))
      ? logic.model.workouts.find((w) => sameName(w.name, typedName) && (creating || w.id !== (selAct && selAct.workoutId))) ||
        null
      : null;
  const todayIso = isoOf(new Date(Y, TODAY_M, TODAY_D));
  // Repeating: this weekday for the 12 weeks after the day, leaving out days already gone by (they'd only show as
  // missed) and days that already have this workout.
  // A day that has gone by: whatever is put on it is most likely already done, so it's logged as done unless
  // switched off (as in the Spellbook's "Add to calendar").
  const pastDay = isoOf(new Date(Y, mi, selDay)) < todayIso;
  const logDoneOn = pastDay && st.logDone !== false;
  // An exercise's icon picked in this editor (not yet saved), kept per workout like its other fields.
  const iconPick = (name) => (st.exIcons || {})[listKey + '|' + name];
  const weeklyAfter = (name) => {
    const out = [];
    for (let w = 1; w <= 12; w++) {
      const d = new Date(Y, mi, selDay + w * 7);
      const iso = isoOf(d);
      if (iso >= todayIso && !logic.model.entries.some((x) => x.m === relM(d) && x.d === d.getDate() && x.av.name === name))
        out.push(iso);
    }
    return out;
  };
  // A new workout needs a name, and a lifting one at least one exercise, before it can be saved: an empty
  // "Untitled workout" used to land in the Spellbook with one tap.
  // The same holds when editing: a saved workout or session can't be left without a name, or a lift without exercises.
  const needsName = !(selName || '').trim();
  const needsExercise = (creating ? st.newType !== 'cycle' : !selRide) && selList.length === 0;
  // A lift's length follows its exercises: about ten minutes each, at least twenty. An edit moves it by the
  // exercises added or taken out, so a length set by hand keeps its difference.
  const exDelta = creating ? 0 : selList.length - (EXV[baseKey] || []).length;
  const baseMin = parseInt(String((selAct && selAct.time) || '').replace(/[^0-9]/g, ''), 10) || 50;
  // More or fewer sets of an exercise move it too: each set about 40 seconds of work plus its rest.
  const setsOf = (e) => parseInt(String(e.sets || ''), 10) || 0;
  const restOf = (e) => parseInt(String(e.rest || ''), 10) || 60;
  const setDeltaMin = creating
    ? 0
    : (EXV[baseKey] || []).reduce((sum, orig) => {
        const now = selList.find((e) => e.name === orig.name);
        return now ? sum + ((setsOf(now) - setsOf(orig)) * (restOf(now) + 40)) / 60 : sum;
      }, 0);
  // Marked as a warm-up (lifts only, once the warm-ups migration has run): a draft value until Save.
  const warmupShown = logic.model.warmupReady && (creating ? st.newType !== 'cycle' : !selRide);
  const warmupOn = warmupShown && ((st.warmups || {})[listKey] ?? (!creating && !!(srcAct && srcAct.warmup)));
  const warmupChanged = !creating && warmupShown && warmupOn !== !!(srcAct && srcAct.warmup);
  const lengthChanged = exDelta !== 0 || Math.round(setDeltaMin) !== 0 || warmupChanged;
  // A warm-up's length is a fresh estimate from its exercises (they're quick ones), as is a workout's that stopped
  // being one.
  const estMin =
    creating || warmupChanged || warmupOn
      ? db.estimateMinutes(selList.length, warmupOn)
      : Math.max(20, Math.round((baseMin + exDelta * 10 + setDeltaMin) / 5) * 5);
  const saving = logic.busy('workout');
  // Every exercise needs at least one set of at least one rep.
  const badCounts = selRide ? null : selList.find((e) => !setsRepsOk(e.sets));
  // A new exercise's name must be new where it's going: among the person's exercises and the built-ins in the Spellbook
  // (saving one there would otherwise overwrite the old one), or among this workout's exercises in the editor (a
  // workout keeps track of its exercises by name).
  const dName = (st.dName || '').trim();
  const clash = !dName
    ? null
    : st.screen === 'arsenal'
      ? logic.model.library.concat(logic.model.builtins).find((e) => e.name.trim().toLowerCase() === dName.toLowerCase())
      : selList.find((e) => e.name.trim().toLowerCase() === dName.toLowerCase());
  const draftNameError = !clash
    ? ''
    : st.screen === 'arsenal'
      ? (clash.builtin ? 'There’s a built-in exercise called “' : 'You already have an exercise called “') +
        clash.name +
        '”. Give this one another name.'
      : '“' + clash.name + '” is already in this workout.';
  // The "From Spellbook" list: narrowed to the workout's target areas (say so, and one tap shows everything),
  // searchable, and it stays open so several exercises can be added in a row.
  const pickQ = (st.pickQ || '').trim().toLowerCase();
  // Narrowed to the areas the workout had when the list was opened, so adding one doesn't shrink the list
  // under you (in a new workout, the first add used to narrow it to that one exercise's areas).
  const pickAreas = st.pickAreas || picked;
  const narrowToAreas = pickAreas.length > 0 && !st.pickAll;
  const PICK_LIMIT = 25;
  const pickable = libraryFor(listKey)
    .filter((e) => !narrowToAreas || (e.areas || []).some((a) => pickAreas.includes(a)))
    .filter((e) => !pickQ || e.name.toLowerCase().includes(pickQ))
    .sort((a, b) => a.name.localeCompare(b.name));
  const areaWords = (list) =>
    list.length === 1 ? list[0] : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1];
  // "Or one from your Spellbook": the person's own workouts, then the built-in ones they don't have yet (theirs by that
  // name is already listed), grouped as the Spellbook groups them. Picking one puts it on this day; a built-in one is
  // saved to their workouts first, since a session needs a workout of their own.
  const choiceOf = (w, builtinOne) => ({
      name: w.name,
      warmup: !!w.warmup && !builtinOne,
      svg: iconSvg(w.icon || (w.kind === 'ride' ? 'bike' : 'h'), w.iconColor || colors.pink),
      meta:
        (w.kind === 'ride'
          ? ['Ride', w.ride && w.ride.dist ? w.ride.dist + ' mi' : '', w.time].filter(Boolean).join(' · ')
          : plural(w.exercises.length, 'exercise') + ' · ' + w.time) +
        // Already on this day: tapping it adds a second one, so say so first.
        (logic.model.entries.some((x) => x.m === mi && x.d === selDay && x.av.name === w.name) ? ' · Already on this day' : ''),
      pick: () =>
        logic.saveOnce(
          'workout',
          () =>
            (builtinOne ? db.ownCopyOfBuiltin(w).then((c) => c.workoutId) : Promise.resolve(w.id)).then((id) =>
              db.scheduleWorkout(
                id,
                [isoOf(new Date(Y, mi, selDay))],
                false,
                logDoneOn ? { exercises: w.kind === 'ride' ? [] : w.exercises } : undefined,
              ),
            ),
          (r) =>
            Object.assign(
              { screen: 'day', seg: 'Day', creating: false, newType: null, newName: '', newFrom: null, schedule: null },
              EDIT_OVERLAYS,
              {
                hist: (st.hist || []).slice(0, -1),
                ...noticePatch(
                  '“' + w.name + '” ' + (builtinOne ? 'saved to your workouts and ' : '') +
                    (logDoneOn ? 'logged as done on ' : 'added to ') + MON3[mod12(mi)] + ' ' + selDay + '.',
                  'day',
                ),
              },
              r && r.entryId ? { entryId: r.entryId } : {},
            ),
        ),
  });
  const ownNames = new Set(logic.model.workouts.map((w) => w.name.trim().toLowerCase()));
  const builtinChoices = (logic.model.builtinWorkouts || []).filter((w) => !ownNames.has(w.name.trim().toLowerCase()));
  const savedChoiceGroups = [];
  if (logic.model.workouts.length)
    savedChoiceGroups.push({
      label: builtinChoices.length ? 'YOUR WORKOUTS' : '',
      items: logic.model.workouts.map((w) => choiceOf(w, false)),
    });
  builtinChoices.forEach((w) => {
    const label = 'BUILT-IN · ' + w.category.toUpperCase();
    let g = savedChoiceGroups.find((x) => x.label === label);
    if (!g) savedChoiceGroups.push((g = { label, items: [] }));
    g.items.push(choiceOf(w, true));
  });
  return {
    nameError: nameClash ? 'You already have a workout called “' + nameClash.name + '”. Give this one another name.' : '',
    saveBlocked: !!nameClash || needsName || needsExercise || !!badCounts || saving,
    saveHint: nameClash
      ? ''
      : badCounts
        ? '“' + badCounts.name + '” needs at least 1 set and 1 rep.'
        : needsName && needsExercise
          ? 'Name it and add an exercise to save it.'
          : needsName
            ? 'Name this workout to save it.'
            : needsExercise
              ? 'Add at least one exercise to save it.'
              : '',
    // Creating one for the calendar under a name that's taken: most likely the saved one was meant.
    canUseSaved: !!nameClash && creating && st.schedule !== false,
    useSavedLabel: nameClash ? 'Schedule your saved “' + nameClash.name + '” instead' : '',
    useSaved: () => {
      if (!nameClash) return;
      const dates = [isoOf(new Date(Y, mi, selDay))].concat(st.repeat ? weeklyAfter(nameClash.name) : []);
      logic.saveOnce(
        'workout',
        () => db.scheduleWorkout(nameClash.id, dates, dates.length > 1),
        (r) =>
          Object.assign(
            { screen: 'day' },
            { creating: false, newType: null, newName: '', newFrom: null, schedule: null },
            EDIT_OVERLAYS,
            { extra: Object.assign({}, st.extra, { __draft: [] }) },
            r && r.entryId ? { entryId: r.entryId } : {},
          ),
      );
    },
    // Or skip building one: put a saved workout on this day, straight from the calendar.
    hasSavedChoices:
      creating && st.newFrom === 'calendar' && logic.model.workouts.length + (logic.model.builtinWorkouts || []).length > 0,
    savedChoicesNote:
      'Tap one to put it on ' + DOWFULL[selDate.getDay()] + ', ' + MON3[mod12(mi)] + ' ' + selDay + yearNote +
      (logDoneOn ? ', logged as done.' : '.'),
    showLogDone: pastDay && creating && st.schedule !== false,
    logDoneOn,
    setLogDone: (on) => logic.s({ logDone: !!on }),
    savedChoiceGroups,
    pickTypeLift: () => logic.s({ newType: 'lift' }),
    pickTypeCycle: () => logic.s({ newType: 'cycle' }),
    needsType: creating && !st.newType,
    isCycle: isCycleView && !creating,
    rideLocked: isCycleView && !creating && !ridePlanOpen,
    rideLockNote: rideDone ? 'Completed — plan locked' : ridePast ? 'Past ride — plan locked' : '',
    ridePlanEdit: isCycleView && (creating || ridePlanOpen),
    ridePlanStatic: isCycleView && !creating && !ridePlanOpen,
    planDistText: rDist ? rDist + ' mi' : '—',
    planElevText: rElev ? rElev + ' ft' : '—',
    planDurText: plannedMin
      ? (Math.floor(plannedMin / 60) ? Math.floor(plannedMin / 60) + ' h ' : '') + (plannedMin % 60) + ' min'
      : '—',
    isLift: !isCycleView,
    rideDistance: rDist,
    rideElev: rElev,
    rideZone: st.rZone || (savedRide && savedRide.zone) || 'Endurance',
    rideHours: rHrs,
    rideMins: rMins,
    setDistance: (e) => logic.s({ rDist: e.target.value.replace(/[^0-9.]/g, '') }),
    setElev: (e) => logic.s({ rElev: e.target.value.replace(/[^0-9]/g, '') }),
    actDistance: aDist,
    actElev: aElev,
    actHours: aHrs,
    actMins: aMins,
    setActDistance: (e) => logic.s({ aDist: e.target.value.replace(/[^0-9.]/g, '') }),
    setActElev: (e) => logic.s({ aElev: e.target.value.replace(/[^0-9]/g, '') }),
    setActHours: (e) => logic.s({ aHrs: e.target.value.replace(/[^0-9]/g, '').slice(0, 2) }),
    setActMins: (e) => {
      const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
      logic.s({ aMins: v });
    },
    rollActMins: () => {
      const r = rollMinutes(aHrs, aMins);
      if (r) logic.s({ aHrs: r.hrs, aMins: r.mins });
    },
    plannedDist: rDist ? 'Planned ' + rDist + ' mi' : 'No planned distance',
    plannedElev: rElev ? 'Planned ' + rElev + ' ft' : 'No planned elevation',
    plannedDur: plannedMin
      ? 'Planned ' +
        (Math.floor(plannedMin / 60) ? Math.floor(plannedMin / 60) + ' h ' : '') +
        (plannedMin % 60) +
        ' min'
      : 'No planned duration',
    plannedDistPh: rDist || '0',
    plannedElevPh: rElev || '0',
    ridePctLabel: ridePct != null ? ridePct + '% of plan' : rideDone ? 'Completed' : 'Not started',
    rideBar:
      'width:' +
      (ridePct == null ? 0 : Math.min(100, ridePct)) +
      '%;height:100%;border-radius:5px;transition:width var(--dur-bar) var(--ease-standard);background:var(--gradient-gem)',
    rideNote:
      ridePct == null
        ? 'Enter what you rode — a partial ride still counts.'
        : ridePct >= 100
          ? 'Full route ridden. Plan met.'
          : ridePct + '% of the planned distance. The rest stays on the plan.',
    rideNoteStyle:
      'margin:14px 0 0;font-size:var(--text-md);font-weight:' +
      (ridePct != null && ridePct >= 100
        ? 'var(--font-weight-semibold);color:var(--color-pink-deep)'
        : 'var(--font-weight-regular);color:var(--color-muted)'),
    setHours: (e) => logic.s({ rHrs: e.target.value.replace(/[^0-9]/g, '').slice(0, 2) }),
    setMins: (e) => {
      const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
      logic.s({ rMins: v });
    },
    rollMins: () => {
      const r = rollMinutes(rHrs, rMins);
      if (r) logic.s({ rHrs: r.hrs, rMins: r.mins });
    },
    setRideZone: (zone) => logic.s({ rZone: zone }),
    // No longer picked by hand: a workout's target areas are whatever its exercises target, combined.
    hasTargetAreas: picked.length > 0,
    targetAreaPills: picked,
    addOpen: !!st.addOpen,
    addLib: st.addMode !== 'new',
    addNew: st.addMode === 'new',
    openAdd: () => logic.s({ addOpen: true, addMode: 'lib', pickQ: '', pickAll: false, pickAreas: picked }),
    closeAdd: () => logic.s({ addOpen: false }),
    addMode: st.addMode === 'new' ? 'new' : 'lib',
    // "Create new" starts with real values (3 × 10, 60 sec rest), as in the Spellbook; weight starts empty.
    setAddMode: (mode) =>
      logic.s(
        mode === 'new'
          ? { addMode: mode, dSets: st.dSets || '3', dReps: st.dReps || '10', dRest: st.dRest || '60' }
          : { addMode: mode },
      ),
    // "Browse the full Spellbook": opens the real Spellbook, remembering this workout so "Add to workout" there puts
    // the exercise here and comes back. The names already in it let the Spellbook mark those "In workout".
    // It arrives narrowed to this workout's target areas, like the short list here; the person's own filter comes
    // back when picking ends.
    browseArsenal: () =>
      logic.nav({
        screen: 'arsenal',
        arsenalView: 'exercises',
        addOpen: false,
        monthOpen: false,
        arsenalAreas: picked.length ? picked : st.arsenalAreas || [],
        arsenalPick: {
          key: listKey,
          names: selList.map((e) => e.name),
          title: selName,
          prevAreas: st.arsenalAreas || [],
        },
      }),
    // Says what the list below is narrowed to, e.g. "Showing exercises for Chest, Arms and Shoulders", with a way out.
    libraryFilterNote: narrowToAreas ? 'Showing exercises for ' + areaWords(pickAreas) + '.' : '',
    libraryShowAll: () => logic.s({ pickAll: true }),
    libraryCanNarrow: pickAreas.length > 0 && !!st.pickAll,
    libraryNarrowLabel: 'Only ' + areaWords(pickAreas),
    libraryNarrow: () => logic.s({ pickAll: false }),
    pickQuery: st.pickQ || '',
    setPickQuery: (e) => logic.s({ pickQ: e.target.value }),
    clearPickQuery: () => logic.s({ pickQ: '' }),
    libraryEmpty: pickable.length === 0,
    libraryEmptyNote: pickQ
      ? 'No exercises match “' + (st.pickQ || '').trim() + '”' + (narrowToAreas ? ' for ' + areaWords(pickAreas) + '.' : '.')
      : 'Everything that fits is already in this workout.',
    // Read out as the search narrows the list (the list itself changes silently).
    libraryAnnounce: !pickQ
      ? ''
      : pickable.length
        ? plural(pickable.length, 'exercise') + ' found.'
        : 'No exercises match “' + (st.pickQ || '').trim() + '”' + (narrowToAreas ? ' for ' + areaWords(pickAreas) + '.' : '.'),
    libraryMore: pickable.length > PICK_LIMIT ? plural(pickable.length - PICK_LIMIT, 'more exercise') + ' — search to find one.' : '',
    library: pickable.slice(0, PICK_LIMIT).map((e) => ({
      name: e.name,
      detail: exLine(e),
      // Same as the Spellbook: the row opens the exercise, "+" adds it. Back returns here with this panel still open.
      // An exercise only drafted in this visit has no saved page yet, so it can only be added.
      open: e.id ? () => logic.nav({ screen: 'exercise', exerciseId: e.id }) : null,
      // Adding keeps the list open for the next one; the added exercise leaves the list and joins the workout above.
      add: () =>
        logic.s({
          extra: Object.assign({}, st.extra, { [listKey]: added.concat([e]) }),
          removed: Object.assign({}, st.removed, { [listKey]: gone.filter((n) => n !== e.name) }),
          announce: e.name + ' added.',
        }),
    })),
    draftName: st.dName || '',
    draftSets: st.dSets || '',
    draftReps: st.dReps || '',
    draftWeight: st.dWeight || '',
    draftRest: st.dRest || '',
    setName: (e) => logic.s({ dName: e.target.value }),
    setSets: (e) => logic.s({ dSets: digitsOnly(e.target.value) }),
    setReps: (e) => logic.s({ dReps: digitsOnly(e.target.value) }),
    setWeight: (e) => logic.s({ dWeight: numericOnly(e.target.value) }),
    setRest: (e) => logic.s({ dRest: restDigits(e.target.value) }),
    draftAreas: TARGET_AREAS.map((name) => {
      const on = (st.dAreas || []).includes(name);
      return {
        name,
        on,
        toggle: () =>
          logic.s({
            dAreas: on ? (st.dAreas || []).filter((a) => a !== name) : (st.dAreas || []).concat([name]),
          }),
      };
    }),
    // A new exercise's equipment: one row that opens to the picker, as in the exercise editor. Only once the database
    // has equipment at all.
    draftEquipment: !logic.model.builtins.some((e) => e.equipment !== undefined)
      ? null
      : {
          open: !!st.dEquipOpen,
          toggle: () => logic.s({ dEquipOpen: !st.dEquipOpen }),
          summary: (st.dEquip || []).length ? st.dEquip.join(', ') : 'Bodyweight',
          groups: EQUIPMENT_GROUPS.map((g) => ({
            label: g.label,
            items: g.items.map((name) => {
              const on = (st.dEquip || []).includes(name);
              return {
                name,
                on,
                toggle: () => logic.s({ dEquip: EQUIPMENT.filter((x) => (x === name ? !on : (st.dEquip || []).includes(x))) }),
              };
            }),
          })),
        },
    iconGrid: EXERCISE_ICON_NAMES.map((name) => ({
      svg: iconSvg(name),
      pick: () => logic.s({ dIcon: name }),
      label: ICON_NAMES[name] + ' icon',
      on: (st.dIcon || 'h') === name,
      style: optStyle((st.dIcon || 'h') === name),
    })),
    draftNameError,
    commitDisabled: !(st.dName || '').trim() || !(st.dAreas || []).length || !!clash || !countsOk(st.dSets, st.dReps),
    // Why the button is off, when it is (a name clash says so on the field itself).
    draftHint: clash
      ? ''
      : !(st.dName || '').trim()
        ? 'Name it to save it.'
        : !countsOk(st.dSets, st.dReps)
          ? 'Sets and reps need to be at least 1.'
          : !(st.dAreas || []).length
            ? 'Pick at least one target area.'
            : '',
    commitNew: () => {
      const nm = (st.dName || '').trim();
      if (!nm || !(st.dAreas || []).length || clash || !countsOk(st.dSets, st.dReps)) return;
      const item = {
        name: nm,
        sets: joinSetsReps(st.dSets, st.dReps) || '3 × 10',
        weight: withLb(st.dWeight) || '—',
        rest: withSec(st.dRest) || '60 sec',
        i: st.dIcon || 'h',
        areas: st.dAreas || [],
        ...(logic.model.builtins.some((e) => e.equipment !== undefined) ? { equipment: st.dEquip || [] } : {}),
      };
      logic.s({
        extra: Object.assign({}, st.extra, { [listKey]: added.concat([item]) }),
        addOpen: false,
        dName: '',
        dSets: '',
        dReps: '',
        dWeight: '',
        dRest: '',
        dIcon: 'h',
        dAreas: [],
        dEquip: [],
        dEquipOpen: false,
      });
    },
    iconsOpen: !!st.iconsOpen,
    toggleIcons: () => logic.s({ iconsOpen: !st.iconsOpen }),
    iconBadge:
      'width:46px;height:46px;border-radius:15px;background:var(--color-pink-tint);border:2px solid var(--color-white);box-shadow:0 2px 6px rgba(213,49,129,.28),0 0 0 1px rgba(35,42,69,.05);display:flex;align-items:center;justify-content:center;cursor:pointer',
    workoutIcoSvg: iconSvg(wIcon, wColor),
    workoutIconGrid: EXERCISE_ICON_NAMES.map((name) => ({
      svg: iconSvg(name, wColor),
      pick: () => logic.s({ icons: Object.assign({}, st.icons, { [listKey]: name }) }),
      label: ICON_NAMES[name] + ' icon',
      on: wIcon === name,
      style: optStyle(wIcon === name),
    })),
    iconColors: ICON_COLORS.map((c, i) => ({
      label: ICON_COLOR_NAMES[i],
      on: c === wColor,
      pick: () => logic.s({ iconColors: Object.assign({}, st.iconColors, { [listKey]: c }) }),
      style:
        'width:34px;height:34px;border:none;border-radius:11px;cursor:pointer;background:' +
        c +
        (c === wColor ? ';box-shadow:0 0 0 2px var(--color-white),0 0 0 4px ' + c : ''),
    })),
    eName: selName,
    eNotes: notesVal,
    setNotes: (e) => logic.s({ notes: Object.assign({}, st.notes, { [listKey]: e.target.value }) }),
    eCat: selRide ? selRide.zone || 'Endurance' : picked.length ? picked.join(' · ') : 'No target areas',
    areaPills: selRide ? [selRide.zone || 'Endurance'] : picked,
    needs: selRide ? null : needsLine(selList),
    inSeries: !!(selAct && selAct.series),
    canRepeat: !tplMode && !(selAct && selAct.series),
    // The series' own day, not this session's date (which may have just been moved in this editor).
    seriesNote:
      'Part of a weekly series: it repeats every ' +
      DOWFULL[selAct && selAct.seriesDay != null ? selAct.seriesDay : selDate.getDay()] +
      '. To stop the repeats, tap × on “Weekly series” on this session’s page.',
    endSeries: () => {
      const sid = selAct && selAct.series;
      if (!sid) return;
      return logic.s({
        confirm: {
          kind: 'series',
          sid,
          title: 'End this weekly series?',
          body:
            'Its repeats still ahead come off the calendar. This one, past ones, and any you’ve started or written about stay.',
          label: 'End series',
        },
      });
    },
    eNamePlaceholder: creating,
    eNameStatic: !creating,
    setNewName: (e) => logic.s({ newName: e.target.value }),
    // Enter in the name field does nothing. Focus stays put: blurring it would leave focus on the page itself, where
    // a screen reader loses its place and the next Escape leaves the editor.
    commitOnEnter: (e) => {
      if (e.key === 'Enter') e.preventDefault();
    },
    setEditName: (e) => logic.s({ renames: Object.assign({}, st.renames, { [baseName]: e.target.value }) }),
    eEyebrow: tplMode ? 'EDITING SAVED WORKOUT' : st.editing ? 'EDITING WORKOUT' : 'NEW WORKOUT',
    eSaveLabel: saving
      ? 'Saving…'
      : tplMode
        ? 'Save changes'
        : st.editing
        ? 'Update workout'
        : creating && st.schedule === false
          ? 'Save to Spellbook'
          : 'Save workout',
    // Cancel is the same as Back everywhere: it asks first if anything would be lost. Deleting a session is its own
    // button, apart from Cancel, so one can't be mistaken for the other.
    footerSecondary: () => (workoutDraftDirty(st) ? logic.s({ leaveOpen: true }) : logic.back()),
    canDeleteSession: !creating && !tplMode,
    deleteSession: () =>
      logic.s({
        confirm: {
          kind: 'workout',
          title: 'Delete this workout?',
          body:
            '"' +
            selName +
            '" on ' +
            MON3[mod12(mi)] +
            ' ' +
            selDay +
            (DIARY[idOf(srcAct)]
              ? ' will be removed from your plan, along with your chronicle entry for it.'
              : ' will be removed from your plan.') +
            " This can't be undone.",
          label: 'Delete workout',
        },
      }),
    // The "leave?" question says what's at stake: a workout not saved yet, or changes to one that is.
    leaveTitle: creating ? 'Keep this workout?' : 'Keep your changes?',
    leaveBody: creating
      ? "You've started a new workout. Save it, or discard it."
      : "You've edited this workout. Save what you changed, or leave it as it was.",
    leaveDiscardLabel: creating ? 'Discard workout' : 'Discard changes',
    leaveSaveLabel: creating ? 'Save workout' : 'Save changes',
    leaveOpen: !!st.leaveOpen,
    tryLeave: () => {
      if (!workoutDraftDirty(st)) return logic.back();
      logic.s({ leaveOpen: true });
    },
    // Closing the dialog without choosing (Escape, the X, clicking outside) means "changed my mind, stay here" —
    // never treated as "discard", so a stray dismissal can't lose anything.
    stayHere: () => logic.s({ leaveOpen: false, pendingNav: null }),
    dateOpen: !!st.dateOpen,
    // Opens on the month of the workout's date; its arrows only change what the picker shows.
    toggleDate: () => logic.s({ dateOpen: !st.dateOpen, pickM: null, pickFocus: null }),
    pickMonthName: MONTHS[mod12(pickM)] + (Math.floor(pickM / 12) ? ' ' + new Date(Y, pickM, 1).getFullYear() : ''),
    pickPrevMonth: () => logic.s({ pickM: pickM - 1 }),
    pickNextMonth: () => logic.s({ pickM: pickM + 1 }),
    pickerCells,
    saveLeave: () => {
      logic.s({ leaveOpen: false });
      logic.renderVals().saveWorkout();
    },
    saveWorkout: () => {
      if (nameClash || needsName || needsExercise) return logic.s({ leaveOpen: false, pendingNav: null });
      if (saving) return;
      const cleared = EDIT_OVERLAYS;
      const bare = (e) => ({
        name: e.name,
        sets: e.sets,
        weight: e.weight,
        rest: e.rest,
        i: e.i,
        areas: e.areas || [],
        ...(e.equipment !== undefined ? { equipment: e.equipment } : {}),
      });
      if (!creating) {
        const owned = EXV[baseKey] || [];
        const byName = (n) => owned.find((e) => e.name === n);
        const prefix = listKey + '|';
        const update = Object.keys(st.fields || {})
          .filter((k) => k.indexOf(prefix) === 0)
          .map((k) => ({ ex: byName(k.slice(prefix.length)), patch: st.fields[k] }))
          .filter((u) => u.ex && u.ex.id)
          .map((u) => ({
            id: u.ex.id,
            patch: Object.assign(
              {},
              u.patch,
              iconPick(u.ex.name) ? { i: iconPick(u.ex.name) } : {},
            ),
          }));
        Object.keys(st.exIcons || {})
          .filter((k) => k.indexOf(prefix) === 0)
          .forEach((k) => {
            const ex = byName(k.slice(prefix.length));
            if (ex && ex.id && !update.some((u) => u.id === ex.id)) update.push({ id: ex.id, patch: { i: st.exIcons[k] } });
          });
        const moved = st.editKey && st.editKey !== mi + '-' + selDay;
        const actualEdited = st.aDist != null || st.aElev != null || st.aHrs != null || st.aMins != null;
        const newName = ((st.renames || {})[baseName] || '').trim();
        const notes = (st.notes || {})[listKey];
        const rideEdited = !!selRide && [st.rDist, st.rElev, st.rHrs, st.rMins, st.rZone].some((v) => v != null);
        // Exercises ticked in the editor. A finished session stays completed while ticks change; otherwise it's done
        // once all are ticked.
        const ticked = st.editDone ? st.editDone.filter((n) => selList.some((e) => e.name === n)) : null;
        const saveTicks = (r?) =>
          (ticked
            ? db.setExercisesDone(
                selAct.id,
                ticked,
                (selList.length > 0 && ticked.length === selList.length) || !!ctx.actualMinutes(selAct),
              )
            : Promise.resolve()
          ).then(() => r);
        // Dragged into a new order: the whole list's names go with the save, in that order.
        const reordered =
          selList.map((e) => e.name).join('\n') !==
          (EXV[baseKey] || [])
            .concat(added)
            .filter((e) => gone.indexOf(e.name) === -1)
            .map((e) => e.name)
            .join('\n');
        const edit = {
          entryId: selAct.id,
          workoutId: selAct.workoutId,
          name: newName && newName !== baseName ? newName : undefined,
          icon: (st.icons || {})[listKey],
          iconColor: (st.iconColors || {})[listKey],
          notes: notes != null && notes !== (selAct.notes || '') ? notes : undefined,
          ride: rideEdited
            ? { dist: rDist, elev: rElev, zone: st.rZone || selRide.zone || 'Endurance', minutes: plannedMin }
            : null,
          moveTo: moved ? isoOf(new Date(Y, mi, selDay)) : undefined,
          actual:
            selRide && actualEdited
              ? { dist: aDist, elev: aElev, minutes: Number(aHrs || 0) * 60 + Number(aMins || 0) }
              : null,
          exercises: {
            update,
            removeIds: gone
              .map((n) => byName(n))
              .filter((e) => e && e.id)
              .map((e) => e.id),
            add: added.map(bare),
            order: reordered ? selList.map((e) => e.name) : undefined,
          },
          repeatDates: st.repeat && !selAct.series ? weeklyAfter(baseName) : [],
          warmup: warmupChanged ? warmupOn : undefined,
          durationMinutes: !selRide && lengthChanged ? estMin : undefined,
        };
        // Normally back to the workout's own detail screen; if a nav click was waiting on this save, go there instead.
        // Either way this session stays the selected one, even if it moved to a day that already had a workout.
        // Back where the editor was opened from: its own history entry is left behind with it.
        const after = Object.assign(
          st.pendingNav ? NAV_DESTINATIONS[st.pendingNav] : { screen: 'detail', hist: (st.hist || []).slice(0, -1) },
          cleared,
          { entryId: selAct.id, tplConfirm: null },
          st.pendingNav
            ? {}
            : noticePatch(
                'Changes saved.' +
                  (edit.repeatDates.length
                    ? ' Repeats every ' + DOWFULL[new Date(Y, mi, selDay).getDay()] + ', ' +
                      plural(edit.repeatDates.length, 'more session') + ' on the calendar.'
                    : ''),
                'detail',
              ),
        );
        // The date, the ride you logged and repeating belong to this session. Anything else changes the workout,
        // which other sessions (and the Spellbook) share.
        const changesWorkout =
          edit.name !== undefined ||
          edit.icon !== undefined ||
          edit.iconColor !== undefined ||
          edit.notes !== undefined ||
          !!edit.ride ||
          update.length > 0 ||
          edit.exercises.removeIds.length > 0 ||
          added.length > 0 ||
          reordered ||
          warmupChanged;
        // A saved workout, edited from the Spellbook: saved the way the Spellbook always has, asking whether sessions
        // still ahead should follow (or saving it as a new workout). Then back to the saved workout's page.
        if (tplMode) {
          const id = selAct.workoutId;
          const tplEdit = Object.assign({}, edit, { entryId: '', moveTo: undefined, actual: null, repeatDates: [] });
          const back = Object.assign({}, cleared, {
            screen: 'template',
            templateId: id,
            editTemplate: null,
            editing: false,
            tplConfirm: null,
            hist: (st.hist || []).slice(0, -1),
          });
          if (!changesWorkout) return logic.s(back);
          // "Save as a new workout" is named in the dialog: the name typed here if it's new, else "<name> (copy)".
          const taken = (n) => logic.model.workouts.some((w) => sameName(w.name, n));
          let copyName = (edit.name || '').trim();
          if (!copyName || taken(copyName)) {
            copyName = baseName + ' (copy)';
            for (let n = 2; taken(copyName); n++) copyName = baseName + ' (copy ' + n + ')';
          }
          const apply = (mode, updateUpcoming, name) =>
            logic.saveOnce(
              'workout',
              () =>
                db.updateWorkoutTemplate(mode === 'new' && name ? Object.assign({}, tplEdit, { name }) : tplEdit, {
                  mode,
                  updateUpcoming,
                  todayIso,
                }),
              (r) =>
                Object.assign(
                  {},
                  back,
                  r && r.created
                    ? { templateId: r.workoutId, ...noticePatch('“' + (name || copyName) + '” saved as a new workout.', 'template') }
                    : noticePatch('“' + (edit.name || baseName) + '” saved.', 'template'),
                ),
            );
          // Asked every time, so "Save as a new workout" is always there; the upcoming switch shows only when
          // there are upcoming sessions.
          return db
            .countUpcoming(id, todayIso)
            .then((count) =>
              logic.s({
                tplConfirm: {
                  count,
                  name: baseName,
                  sessions: logic.model.entries.filter((x) => x.av.name === baseName).length,
                  choice: 'update',
                  upcoming: true,
                  copyName,
                  apply,
                },
              }),
            )
            .catch((e) => logic.s({ saveError: e instanceof Error ? e.message : String(e) }));
        }
        if (!changesWorkout) return logic.saveOnce('workout', () => db.updateWorkout(edit).then(saveTicks), after);
        // The workout is shared with the Spellbook, and maybe with other sessions: ask whether the change is for this
        // session only, or for the saved workout too (and the sessions still ahead). Asked even when this is its only
        // session, since changing what was lifted today shouldn't quietly rewrite the saved workout. Past and
        // completed sessions keep the old version either way.
        const workoutName = baseName;
        return db
          .sessionScope(selAct.workoutId, selAct.id, todayIso)
          .then(({ others, upcoming }) => {
            logic.s({
              tplConfirm: {
                name: workoutName,
                count: 0,
                choice: 'new',
                upcoming: true,
                body: others
                  ? '“' + workoutName + '” has ' + plural(others, 'other session') + '.'
                  : '“' + workoutName + '” is also saved in your Spellbook.',
                options: [
                  {
                    value: 'new',
                    title: 'Only this session',
                    description: others
                      ? 'The saved workout and its other sessions stay as they are.'
                      : 'The saved workout stays as it is.',
                  },
                  {
                    value: 'update',
                    title: 'This session and the saved workout',
                    description: others
                      ? (upcoming ? 'Also changes the ' + plural(upcoming, 'upcoming session') + '. ' : '') +
                        'Past and completed sessions keep the old version.'
                      : 'Changes “' + workoutName + '” in your Spellbook too.',
                  },
                ],
                apply: (mode) =>
                  logic.saveOnce(
                    'workout',
                    () =>
                      db
                        .updateWorkoutTemplate(edit, {
                          mode: mode === 'new' ? 'session' : 'update',
                          updateUpcoming: true,
                          todayIso,
                        })
                        .then(saveTicks),
                    after,
                  ),
              },
            });
          })
          .catch((e) => logic.s({ saveError: e instanceof Error ? e.message : String(e) }));
      }
      const nm = (st.newName || '').trim();
      const isRide = st.newType === 'cycle';
      // A workout is saved on its own; it only gets a session on the calendar when "Add to calendar" is on.
      const scheduled = st.schedule !== false;
      return logic.saveOnce(
        'workout',
        () =>
          db.createWorkout({
            name: nm,
            isRide,
            durationMinutes: isRide ? plannedMin || 45 : estMin,
            ride: isRide
              ? { dist: st.rDist || '', elev: st.rElev || '', zone: st.rZone || 'Endurance' }
              : null,
            icon: (st.icons || {}).__draft || null,
            iconColor: (st.iconColors || {}).__draft || null,
            notes: notesVal,
            exercises: selList.map((e) => bare(iconPick(e.name) ? { ...e, i: iconPick(e.name) } : e)),
            dates: scheduled ? [isoOf(new Date(Y, mi, selDay))].concat(st.repeat ? weeklyAfter(nm) : []) : [],
            repeat: scheduled && !!st.repeat && weeklyAfter(nm).length > 0,
            done: scheduled && logDoneOn,
            warmup: warmupOn,
          }),
        // Normally: saved only goes back to the Spellbook's workouts, where it now is; scheduled goes to the day it
        // was put on. If a nav click was waiting on this save, go there instead — that's what was actually asked
        // for. Either way this is leaving "creating" behind, so those fields always get reset, not just by default.
        // A scheduled workout opens on its new session, which matters when that day already had a workout.
        (r) =>
          Object.assign(
            st.pendingNav
              ? NAV_DESTINATIONS[st.pendingNav]
              : Object.assign(
                  // Saved only: its own page, so it's right there (not somewhere down the Spellbook's list).
                  scheduled ? { screen: 'day' } : { screen: 'template', templateId: r.workoutId, arsenalView: 'workouts' },
                  // Scheduled: back where it started, the new-workout screen's history entry gone too. Saved only:
                  // its page takes that entry's place, so Back returns to where "New workout" was pressed.
                  scheduled ? { hist: (st.hist || []).slice(0, -1) } : {},
                ),
            { creating: false, newType: null, newName: '', newFrom: null, schedule: null },
            cleared,
            r && r.entryId ? { entryId: r.entryId } : {},
            // And it says so.
            st.pendingNav
              ? {}
              : scheduled
                ? noticePatch(
                    '“' +
                      r.name +
                      '” saved and added to ' +
                      MON3[mod12(mi)] +
                      ' ' +
                      selDay +
                      (st.repeat ? ', and every ' + DOWFULL[selDate.getDay()] + ' for 12 weeks after (13 sessions).' : '.'),
                    'day',
                  )
                : noticePatch('“' + r.name + '” is written into your Spellbook.', 'template'),
          ),
      );
    },
    discardLeave: () => {
      const cleared = Object.assign(
        {
          leaveOpen: false,
          creating: false,
          newType: null,
          newName: '',
          extra: Object.assign({}, st.extra, { __draft: [] }),
        },
        EDIT_OVERLAYS,
      );
      // A nav item was waiting on this: go there, same as if the draft had never been in the way. Otherwise this is
      // the in-screen Back arrow, which just steps back one screen as it always has.
      if (st.pendingNav) return logic.s(Object.assign(cleared, NAV_DESTINATIONS[st.pendingNav]));
      logic.s(cleared);
      logic.back();
    },
    eDate:
      DOW3[selDate.getDay()].charAt(0) +
      DOW3[selDate.getDay()].slice(1, 3).toLowerCase() +
      ', ' +
      MON3[mod12(mi)] +
      ' ' +
      selDay +
      yearNote,
    // A warm-up says so on its page, beside the date.
    eWarmup: !creating && !!(srcAct && srcAct.warmup),
    eDateAria: DOWFULL[selDate.getDay()] + ', ' + MONTHS[mod12(mi)] + ' ' + selDay + yearNote,
    eStatus: doneSel ? 'Completed' : 'Planned',
    // Once finished, how long it actually took; before that, the plan.
    eTime:
      selAct && ctx.actualMinutes(selAct)
        ? 'Took ' + ctx.minText(ctx.actualMinutes(selAct))
        : isCycleView && plannedMin && (creating || st.rHrs != null || st.rMins != null)
          ? ctx.minText(plannedMin)
          : creating
          ? selList.length && st.newType !== 'cycle'
            ? '~' + estMin + ' min'
            : 'Duration TBD'
          : !selRide && lengthChanged
            ? '~' + estMin + ' min'
            : (selAct && selAct.time) || '~50 min',
    warmupShown,
    warmupOn,
    setWarmup: (on) => logic.s({ warmups: Object.assign({}, st.warmups, { [listKey]: !!on }) }),
    setRepeat: (on) => logic.s({ repeat: !!on }),
    repeatOn: !!st.repeat,
    // Said from the dates it would add: weeks gone by, and days that already have it, are left out.
    repeatNote: (() => {
      const n = weeklyAfter(creating ? (st.newName || '').trim() : baseName).length;
      return n
        ? 'Adds this workout every ' + DOWFULL[selDate.getDay()] + ' after this one, ' + plural(n, 'more session') + '.'
        : 'The weeks after this one have gone by or already have it.';
    })(),
    // Creating: whether the new workout also goes on the calendar. Editing a session is always on the calendar.
    isCreating: creating,
    scheduleOn: creating ? st.schedule !== false : true,
    showDate: !tplMode && (!creating || st.schedule !== false),
    setSchedule: (on) => logic.s({ schedule: !!on, repeat: on ? st.repeat : false }),
    scheduleNote:
      st.schedule !== false
        ? 'Puts it on ' + DOWFULL[selDate.getDay()] + ', ' + MON3[mod12(mi)] + ' ' + selDay + yearNote + ', and keeps it in your Spellbook.'
        : 'Only saved to your Spellbook. You can add it to the calendar any time.',
    exercises: selList.map((e, ix) => {
      const cur = iconPick(e.name) || e.i;
      const set = (v) => () =>
        logic.s({ exIcons: Object.assign({}, st.exIcons, { [listKey + '|' + e.name]: v }), exOpen: null });
      const setField = (k) => (ev) =>
        logic.s({
          fields: Object.assign({}, st.fields, {
            [listKey + '|' + e.name]: Object.assign({}, (st.fields || {})[listKey + '|' + e.name], {
              [k]: ev.target.value,
            }),
          }),
        });
      // Sets and reps are two boxes on screen, but still one "4 × 8" field everywhere else (the row's stored
      // value, "detail" below, and the database). Split it to show two boxes; each one writes the whole string
      // back, filling in the other box's current value.
      const setsParts = splitSetsReps(e.sets);
      const setSets = setField('sets');
      const setWeight = setField('weight');
      const setRest = setField('rest');
      const setAreas = setField('areas');
      const exAreas = e.areas || [];
      const n = selList.length;
      // Moves this exercise to another place in the list (dragged, or with the arrow keys on its handle).
      const moveTo = (to) => {
        to = Math.max(0, Math.min(n - 1, to));
        if (to === ix) return;
        const names = selList.map((x) => x.name).filter((x) => x !== e.name);
        names.splice(to, 0, e.name);
        logic.s({
          exOrder: Object.assign({}, st.exOrder, { [listKey]: names }),
          exOpen: null,
          announce: e.name + ' moved to ' + (to + 1) + ' of ' + n + '.',
        });
      };
      return {
        name: e.name,
        canMove: n > 1,
        moveTo,
        moveAria: 'Move ' + e.name + ', ' + (ix + 1) + ' of ' + n,
        moveKeys: (ev) => {
          const to = { ArrowUp: ix - 1, ArrowDown: ix + 1, Home: 0, End: n - 1 }[ev.key];
          if (to === undefined) return;
          ev.preventDefault();
          moveTo(to);
        },
        sets: setsParts.sets,
        reps: setsParts.reps,
        weight: numericOnly(e.weight),
        rest: restDigits(e.rest),
        setSets: (ev) => setSets({ target: { value: joinSetsReps(digitsOnly(ev.target.value), setsParts.reps) } }),
        setReps: (ev) => setSets({ target: { value: joinSetsReps(setsParts.sets, digitsOnly(ev.target.value)) } }),
        setWeight: (ev) => setWeight({ target: { value: withLb(numericOnly(ev.target.value)) } }),
        setRest: (ev) => setRest({ target: { value: withSec(restDigits(ev.target.value)) } }),
        areas: TARGET_AREAS.map((name) => {
          const on = exAreas.includes(name);
          return {
            name,
            on,
            toggle: () =>
              setAreas({ target: { value: on ? exAreas.filter((a) => a !== name) : exAreas.concat([name]) } }),
          };
        }),
        icoSvg: iconSvg(cur),
        hideLegacy: false,
        detail: exLine(e, true),
        // Ticked off: its name is struck through and muted.
        nameDone: !!doneSet[e.name],
        doneBtn:
          'margin-left:auto;display:flex;align-items:center;justify-content:center;width:34px;height:34px;flex:none;border-radius:11px;cursor:pointer;border:' +
          (doneSet[e.name]
            ? 'none;background:var(--color-pink)'
            : '1.5px solid var(--color-outline);background:none'),
        doneStroke: doneSet[e.name] ? 'var(--color-white)' : 'var(--color-outline)',
        isDone: !!doneSet[e.name],
        // Ticking off belongs to a session on the calendar, not to a workout being built or a saved one.
        showTick: !creating && !tplMode && mi * 100 + selDay <= ctx.TK,
        // One line per exercise until it's opened to edit. Added ones too: they come with their sets, reps and
        // rest already filled in, and opening each one made the page grow with every add.
        expanded: !!(st.exExpanded || {})[listKey + '|' + e.name],
        toggleExpand: () => {
          const k = listKey + '|' + e.name;
          const cur = !!(st.exExpanded || {})[k];
          logic.s({ exExpanded: Object.assign({}, st.exExpanded, { [k]: !cur }) });
        },
        iconAria: 'Choose icon for ' + e.name,
        removeAria: 'Remove ' + e.name,
        // One name either way; aria-pressed says whether it's done.
        doneAria: 'Mark ' + e.name + ' done',
        toggleDone: () => {
          const nowDone = !doneSet[e.name];
          const names = nowDone ? doneNames.concat([e.name]) : doneNames.filter((n) => n !== e.name);
          const tot = selList.length;
          logic.s({
            // Saved with the rest of the edit, so Cancel and "Discard" leave the ticks as they were.
            editDone: names,
            announce:
              e.name +
              (nowDone ? ' marked done' : ' unmarked') +
              '. ' +
              names.length +
              ' of ' +
              tot +
              ' done.',
          });
        },
        remove: () =>
          logic.s({
            removed: Object.assign({}, st.removed, { [listKey]: gone.concat([e.name]) }),
            exOpen: null,
          }),
        isH: cur === 'h',
        isV: cur === 'v',
        isD: cur === 'd',
        open: st.exOpen === e.name,
        toggle: () => logic.s({ exOpen: st.exOpen === e.name ? null : e.name }),
        close: () => logic.state.exOpen === e.name && logic.s({ exOpen: null }),
        pickH: set('h'),
        pickV: set('v'),
        pickD: set('d'),
        optH: optStyle(cur === 'h'),
        optV: optStyle(cur === 'v'),
        optD: optStyle(cur === 'd'),
      };
    }),
  };
}
