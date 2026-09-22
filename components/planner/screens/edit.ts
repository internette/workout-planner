import { DOW3, DOWFULL, EDIT_OVERLAYS, ICON_COLORS, MON3 } from '../constants';
import { idOf, isoOf, joinSetsReps, splitSetsReps } from '../helpers';
import { EXERCISE_ICON_NAMES } from '@/components/ui/icons';
import { iconSvg } from '../icons';
import { optStyle } from '../styles';
import * as db from '@/lib/plannerData';
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
    EXV,
    selList,
    selDate,
    doneSet,
    doneNames,
  } = ctx;
  return {
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
      logic.s({ aMins: v === '' ? '' : String(Math.min(59, Number(v))) });
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
    ridePctLabel: ridePct == null ? 'Not started' : ridePct + '% of plan',
    rideBar:
      'width:' +
      (ridePct == null ? 0 : Math.min(100, ridePct)) +
      '%;height:100%;border-radius:5px;transition:width .35s ease;background:linear-gradient(135deg,var(--color-pink) 0%,var(--color-periwinkle) 50%,var(--color-teal) 100%)',
    rideNote:
      ridePct == null
        ? 'Log what you rode — a partial ride still counts.'
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
      logic.s({ rMins: v === '' ? '' : String(Math.min(59, Number(v))) });
    },
    setRideZone: (zone) => logic.s({ rZone: zone }),
    targetAreas: ['Core', 'Arms', 'Back', 'Legs'].map((name) => {
      const on = picked.indexOf(name) > -1;
      return {
        name,
        toggle: () =>
          logic.s({
            areas: Object.assign({}, st.areas, {
              [listKey]: on ? picked.filter((p) => p !== name) : picked.concat([name]),
            }),
          }),
        on,
      };
    }),
    addOpen: !!st.addOpen,
    addLib: st.addMode !== 'new',
    addNew: st.addMode === 'new',
    openAdd: () => logic.s({ addOpen: true, addMode: 'lib' }),
    closeAdd: () => logic.s({ addOpen: false }),
    addMode: st.addMode === 'new' ? 'new' : 'lib',
    setAddMode: (mode) => logic.s({ addMode: mode }),
    library: libraryFor(listKey).map((e) => ({
      name: e.name,
      detail: e.sets + ' · ' + e.weight,
      add: () =>
        logic.s({
          extra: Object.assign({}, st.extra, { [listKey]: added.concat([e]) }),
          removed: Object.assign({}, st.removed, { [listKey]: gone.filter((n) => n !== e.name) }),
          addOpen: false,
        }),
      style:
        'display:flex;align-items:center;gap:12px;padding:14px 16px;border:none;border-radius:14px;background:var(--color-canvas);text-align:left;cursor:pointer;width:100%',
    })),
    draftName: st.dName || '',
    draftSets: st.dSets || '',
    draftReps: st.dReps || '',
    draftWeight: st.dWeight || '',
    draftRest: st.dRest || '',
    setName: (e) => logic.s({ dName: e.target.value }),
    setSets: (e) => logic.s({ dSets: e.target.value }),
    setReps: (e) => logic.s({ dReps: e.target.value }),
    setWeight: (e) => logic.s({ dWeight: e.target.value }),
    setRest: (e) => logic.s({ dRest: e.target.value }),
    iconGrid: EXERCISE_ICON_NAMES.map((name) => ({
      svg: iconSvg(name),
      pick: () => logic.s({ dIcon: name }),
      style: optStyle((st.dIcon || 'h') === name),
    })),
    commitDisabled: !(st.dName || '').trim(),
    commitNew: () => {
      const nm = (st.dName || '').trim();
      if (!nm) return;
      const item = {
        name: nm,
        sets: joinSetsReps(st.dSets, st.dReps) || '3 × 10',
        weight: st.dWeight || '—',
        rest: st.dRest || '60 sec',
        i: st.dIcon || 'h',
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
      });
    },
    iconsOpen: !!st.iconsOpen,
    toggleIcons: () => logic.s({ iconsOpen: !st.iconsOpen }),
    iconBadge:
      'width:46px;height:46px;border-radius:15px;background:var(--color-pink-tint);border:2px solid var(--color-white);box-shadow:0 2px 6px rgba(214,96,139,.28),0 0 0 1px rgba(35,42,69,.05);display:flex;align-items:center;justify-content:center;cursor:pointer',
    workoutIcoSvg: iconSvg(wIcon, wColor),
    workoutIconGrid: EXERCISE_ICON_NAMES.map((name) => ({
      svg: iconSvg(name, wColor),
      pick: () => logic.s({ icons: Object.assign({}, st.icons, { [listKey]: name }) }),
      style: optStyle(wIcon === name),
    })),
    iconColors: ICON_COLORS.map((c) => ({
      pick: () => logic.s({ iconColors: Object.assign({}, st.iconColors, { [listKey]: c }) }),
      style:
        'width:34px;height:34px;border:none;border-radius:11px;cursor:pointer;background:' +
        c +
        (c === wColor ? ';box-shadow:0 0 0 2px var(--color-white),0 0 0 4px ' + c : ''),
    })),
    eName: selName,
    eCat: selRide ? selRide.zone || 'Endurance' : picked.length ? picked.join(' · ') : 'No target areas',
    areaPills: selRide ? [selRide.zone || 'Endurance'] : picked,
    inSeries: !!(selAct && selAct.series),
    endSeries: () => {
      const sid = selAct && selAct.series;
      if (!sid) return;
      return logic.s({
        confirm: {
          kind: 'series',
          sid,
          title: 'End this weekly series?',
          body: 'Later repeats of "' + selName + '" will be removed. Past sessions and this one stay.',
          label: 'End series',
        },
      });
    },
    eNamePlaceholder: creating,
    eNameStatic: !creating,
    setNewName: (e) => logic.s({ newName: e.target.value }),
    commitOnEnter: (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.target.blur();
      }
    },
    setEditName: (e) => logic.s({ renames: Object.assign({}, st.renames, { [baseName]: e.target.value }) }),
    eEyebrow: st.editing ? 'EDITING WORKOUT' : 'NEW WORKOUT',
    eSaveLabel: st.editing ? 'Update workout' : creating && st.schedule === false ? 'Save to Arsenal' : 'Save workout',
    eCancelLabel: creating ? 'Cancel' : 'Delete workout',
    footerSecondary: creating
      ? () =>
          logic.s({
            screen: st.newFrom === 'arsenal' ? 'arsenal' : 'day',
            creating: false,
            newType: null,
            newName: '',
            newFrom: null,
            schedule: null,
            extra: Object.assign({}, st.extra, { __draft: [] }),
          })
      : () =>
          logic.s({
            confirm: {
              kind: 'workout',
              title: 'Delete this workout?',
              body:
                '"' +
                selName +
                '" on ' +
                MON3[mi] +
                ' ' +
                selDay +
                " will be removed from your plan. This can't be undone.",
              label: 'Delete workout',
            },
          }),
    leaveOpen: !!st.leaveOpen,
    tryLeave: () => {
      const dirty = !!(
        st.renames ||
        st.fields ||
        st.removed ||
        st.areas ||
        st.newName ||
        st.rDist ||
        st.rElev ||
        st.rHrs ||
        st.rMins ||
        st.aDist ||
        st.aElev ||
        st.aHrs ||
        st.aMins ||
        st.repeat ||
        st.icons ||
        st.iconColors ||
        (st.extra && Object.keys(st.extra).some((k) => (st.extra[k] || []).length))
      );
      if (!dirty) return logic.back();
      logic.s({ leaveOpen: true });
    },
    stayHere: () => logic.s({ leaveOpen: false }),
    deleteWorkout: () =>
      logic.save(() => db.deletePlanEntries([idOf(srcAct)]), {
        screen: 'day',
        creating: false,
        newType: null,
        newName: '',
      }),
    dateOpen: !!st.dateOpen,
    toggleDate: () => logic.s({ dateOpen: !st.dateOpen }),
    pickerCells,
    saveLeave: () => {
      logic.s({ leaveOpen: false });
      logic.renderVals().saveWorkout();
    },
    saveWorkout: () => {
      const weekly = () => {
        const out = [];
        for (let w = 1; w <= 12; w++) out.push(isoOf(new Date(Y, mi, selDay + w * 7)));
        return out;
      };
      const cleared = EDIT_OVERLAYS;
      const bare = (e) => ({ name: e.name, sets: e.sets, weight: e.weight, rest: e.rest, i: e.i });
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
              (st.exIcons || {})[u.ex.name] ? { i: st.exIcons[u.ex.name] } : {},
            ),
          }));
        Object.keys(st.exIcons || {}).forEach((n) => {
          const ex = byName(n);
          if (ex && ex.id && !update.some((u) => u.id === ex.id))
            update.push({ id: ex.id, patch: { i: st.exIcons[n] } });
        });
        const moved = st.editKey && st.editKey !== mi + '-' + selDay;
        const actualEdited = st.aDist != null || st.aElev != null || st.aHrs != null || st.aMins != null;
        return logic.save(
          () =>
            db.updateWorkout({
              entryId: selAct.id,
              workoutId: selAct.workoutId,
              name: (st.renames || {})[baseName],
              icon: (st.icons || {})[listKey],
              iconColor: (st.iconColors || {})[listKey],
              areas: (st.areas || {})[listKey],
              ride: selRide
                ? {
                    dist: rDist,
                    elev: rElev,
                    zone: st.rZone || selRide.zone || 'Endurance',
                    minutes: plannedMin,
                  }
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
              },
              repeatDates: st.repeat && !selAct.series ? weekly() : [],
            }),
          Object.assign({ screen: 'detail' }, cleared),
        );
      }
      const nm = (st.newName || '').trim() || 'Untitled workout';
      const isRide = st.newType === 'cycle';
      // A workout is saved on its own; it only gets a session on the calendar when "Add to calendar" is on.
      const scheduled = st.schedule !== false;
      return logic.save(
        () =>
          db.createWorkout({
            name: nm,
            isRide,
            durationMinutes: isRide ? plannedMin || 45 : Math.max(20, selList.length * 10),
            ride: isRide
              ? { dist: st.rDist || '', elev: st.rElev || '', zone: st.rZone || 'Endurance' }
              : null,
            icon: (st.icons || {}).__draft || null,
            iconColor: (st.iconColors || {}).__draft || null,
            areas: picked,
            exercises: selList.map(bare),
            dates: scheduled ? [isoOf(new Date(Y, mi, selDay))].concat(st.repeat ? weekly() : []) : [],
            repeat: scheduled && !!st.repeat,
          }),
        // Saved only: back to the Arsenal's workouts, where it now is. Scheduled: the day it was put on.
        Object.assign(
          scheduled
            ? { screen: 'day', creating: false, newType: null, newName: '', newFrom: null, schedule: null }
            : { screen: 'arsenal', arsenalView: 'workouts', creating: false, newType: null, newName: '', newFrom: null, schedule: null, repeat: false },
          cleared,
        ),
      );
    },
    discardLeave: () => {
      logic.s({
        leaveOpen: false,
        creating: false,
        newType: null,
        newName: '',
        renames: null,
        fields: null,
        repeat: false,
        areas: null,
        icons: null,
        iconColors: null,
        rDist: null,
        rElev: null,
        rHrs: null,
        rMins: null,
        aDist: null,
        aElev: null,
        aHrs: null,
        aMins: null,
        extra: Object.assign({}, st.extra, { __draft: [] }),
      });
      logic.back();
    },
    cancelEdit: () =>
      logic.s({
        screen: creating ? (st.newFrom === 'arsenal' ? 'arsenal' : 'day') : 'detail',
        creating: false,
        newType: null,
        newName: '',
        newFrom: null,
        schedule: null,
        extra: Object.assign({}, st.extra, { __draft: [] }),
      }),
    eCancelType: creating ? 'neutral' : 'danger',
    eDate:
      DOW3[selDate.getDay()].charAt(0) +
      DOW3[selDate.getDay()].slice(1, 3).toLowerCase() +
      ', ' +
      MON3[mi] +
      ' ' +
      selDay,
    eStatus: doneSel ? 'Completed' : 'Planned',
    eTime: (selAct && selAct.time) || (creating ? 'Duration TBD' : '~50 min'),
    setRepeat: (on) => logic.s({ repeat: !!on }),
    repeatOn: !!st.repeat,
    repeatNote: 'Adds this workout every ' + DOWFULL[selDate.getDay()] + ' for the next 12 weeks, 13 sessions in all.',
    // Creating: whether the new workout also goes on the calendar. Editing a session is always on the calendar.
    isCreating: creating,
    scheduleOn: creating ? st.schedule !== false : true,
    showDate: !creating || st.schedule !== false,
    setSchedule: (on) => logic.s({ schedule: !!on, repeat: on ? st.repeat : false }),
    scheduleNote:
      st.schedule !== false
        ? 'Puts it on ' + DOWFULL[selDate.getDay()] + ', ' + MON3[mi] + ' ' + selDay + ', and keeps it in your Arsenal.'
        : 'Only saved to your Arsenal. You can add it to the calendar any time.',
    exercises: selList.map((e, ix) => {
      const cur = (st.exIcons || {})[e.name] || e.i;
      const set = (v) => () =>
        logic.s({ exIcons: Object.assign({}, st.exIcons, { [e.name]: v }), exOpen: null });
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
      return {
        name: e.name,
        sets: setsParts.sets,
        reps: setsParts.reps,
        weight: e.weight,
        rest: e.rest,
        setSets: (ev) => setSets({ target: { value: joinSetsReps(ev.target.value, setsParts.reps) } }),
        setReps: (ev) => setSets({ target: { value: joinSetsReps(setsParts.sets, ev.target.value) } }),
        setWeight: setField('weight'),
        setRest: setField('rest'),
        icoSvg: iconSvg(cur),
        hideLegacy: false,
        detail: e.sets + ' · ' + e.weight + ' · ' + e.rest + ' rest',
        nameStyle:
          'display:block;font-family:var(--font-heading);font-size:var(--text-xl);font-weight:var(--font-weight-bold);letter-spacing:var(--tracking-snug);' +
          (doneSet[e.name]
            ? 'color:var(--color-muted);text-decoration:line-through'
            : 'color:var(--color-ink)'),
        doneBtn:
          'margin-left:auto;display:flex;align-items:center;justify-content:center;width:34px;height:34px;flex:none;border-radius:11px;cursor:pointer;border:' +
          (doneSet[e.name]
            ? 'none;background:var(--color-pink)'
            : '1.5px solid rgba(35,42,69,.15);background:none'),
        doneStroke: doneSet[e.name] ? 'var(--color-white)' : 'rgba(35,42,69,0.22)',
        isDone: !!doneSet[e.name],
        iconAria: 'Choose icon for ' + e.name,
        removeAria: 'Remove ' + e.name,
        doneAria: doneSet[e.name] ? 'Mark ' + e.name + ' not done' : 'Mark ' + e.name + ' done',
        toggleDone: () => {
          const nowDone = !doneSet[e.name];
          const names = nowDone ? doneNames.concat([e.name]) : doneNames.filter((n) => n !== e.name);
          const tot = selList.length;
          logic.s({
            done: Object.assign({}, st.done, { [listKey]: names }),
            announce:
              e.name +
              (nowDone ? ' marked done' : ' unmarked') +
              '. ' +
              names.length +
              ' of ' +
              tot +
              ' done.',
          });
          if (!creating)
            logic.save(() => db.setExercisesDone(listKey, names, tot > 0 && names.length === tot));
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
