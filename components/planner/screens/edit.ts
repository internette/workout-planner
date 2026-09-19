import { DOW3, EDIT_OVERLAYS, ICON_COLORS, MON3, PINK } from '../constants';
import { idOf, isoOf } from '../helpers';
import { EXERCISE_ICON_NAMES } from '@/components/ui/icons';
import { iconSvg } from '../icons';
import { modeStyle, optStyle, zoneStyle } from '../styles';
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
    mi,
    selDay,
    srcAct,
    pickerCells,
    Y,
    EX,
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
      '%;height:100%;border-radius:5px;transition:width .35s ease;background:linear-gradient(135deg,#E1699C 0%,#7C8FC9 50%,#5EC4D6 100%)',
    rideNote:
      ridePct == null
        ? 'Log what you rode — a partial ride still counts.'
        : ridePct >= 100
          ? 'Full route ridden. Plan met.'
          : ridePct + '% of the planned distance. The rest stays on the plan.',
    rideNoteStyle:
      'margin:14px 0 0;font-size:13px;font-weight:' +
      (ridePct != null && ridePct >= 100 ? '600;color:#c4548a' : '400;color:#746E88'),
    setHours: (e) => logic.s({ rHrs: e.target.value.replace(/[^0-9]/g, '').slice(0, 2) }),
    setMins: (e) => {
      const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 2);
      logic.s({ rMins: v === '' ? '' : String(Math.min(59, Number(v))) });
    },
    zoneRecovery: zoneStyle(st.rZone === 'Recovery'),
    zoneEndurance: zoneStyle((st.rZone || 'Endurance') === 'Endurance'),
    zoneTempo: zoneStyle(st.rZone === 'Tempo'),
    zoneIntervals: zoneStyle(st.rZone === 'Intervals'),
    setZoneRecovery: () => logic.s({ rZone: 'Recovery' }),
    setZoneEndurance: () => logic.s({ rZone: 'Endurance' }),
    setZoneTempo: () => logic.s({ rZone: 'Tempo' }),
    setZoneIntervals: () => logic.s({ rZone: 'Intervals' }),
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
        style:
          'padding:10px 16px;border:none;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;' +
          (on ? 'background:#E1699C;color:#fff' : 'background:#FBF1F3;color:#5C6684'),
      };
    }),
    addOpen: !!st.addOpen,
    addLib: st.addMode !== 'new',
    addNew: st.addMode === 'new',
    openAdd: () => logic.s({ addOpen: true, addMode: 'lib' }),
    closeAdd: () => logic.s({ addOpen: false }),
    modeLib: () => logic.s({ addMode: 'lib' }),
    modeNew: () => logic.s({ addMode: 'new' }),
    modeLibStyle: modeStyle(st.addMode !== 'new'),
    modeNewStyle: modeStyle(st.addMode === 'new'),
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
        'display:flex;align-items:center;gap:12px;padding:14px 16px;border:none;border-radius:14px;background:#FBF1F3;text-align:left;cursor:pointer;width:100%',
    })),
    draftName: st.dName || '',
    draftSets: st.dSets || '',
    draftWeight: st.dWeight || '',
    draftRest: st.dRest || '',
    setName: (e) => logic.s({ dName: e.target.value }),
    setSets: (e) => logic.s({ dSets: e.target.value }),
    setWeight: (e) => logic.s({ dWeight: e.target.value }),
    setRest: (e) => logic.s({ dRest: e.target.value }),
    iconGrid: EXERCISE_ICON_NAMES.map((name) => ({
      svg: iconSvg(name),
      pick: () => logic.s({ dIcon: name }),
      style: optStyle((st.dIcon || 'h') === name),
    })),
    commitStyle:
      'height:52px;padding:0 30px;border:none;border-radius:16px;font-size:15px;font-weight:600;cursor:pointer;color:#fff;background:' +
      ((st.dName || '').trim() ? '#E1699C' : '#E8BFD2'),
    commitNew: () => {
      const nm = (st.dName || '').trim();
      if (!nm) return;
      const item = {
        name: nm,
        sets: st.dSets || '3 × 10',
        weight: st.dWeight || '—',
        rest: st.dRest || '60 sec',
        i: st.dIcon || 'h',
      };
      logic.s({
        extra: Object.assign({}, st.extra, { [listKey]: added.concat([item]) }),
        addOpen: false,
        dName: '',
        dSets: '',
        dWeight: '',
        dRest: '',
        dIcon: 'h',
      });
    },
    iconsOpen: !!st.iconsOpen,
    toggleIcons: () => logic.s({ iconsOpen: !st.iconsOpen }),
    iconBadge:
      'width:46px;height:46px;border-radius:15px;background:#FCE8F1;border:2px solid #fff;box-shadow:0 2px 6px rgba(214,96,139,.28),0 0 0 1px rgba(35,42,69,.05);display:flex;align-items:center;justify-content:center;cursor:pointer',
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
        (c === wColor ? ';box-shadow:0 0 0 2px #fff,0 0 0 4px ' + c : ''),
    })),
    chipStyle:
      'flex:none;white-space:nowrap;padding:8px 14px;border-radius:999px;color:#fff;font-size:12.5px;font-weight:600;background:' +
      (doneSel ? '#5C6684' : '#E1699C'),
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
    eSaveLabel: st.editing ? 'Update workout' : 'Save workout',
    eCancelLabel: creating ? 'Cancel' : 'Delete workout',
    footerSecondary: creating
      ? () =>
          logic.s({
            screen: 'day',
            creating: false,
            newType: null,
            newName: '',
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
        const owned = EX[baseName] || [];
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
            dates: [isoOf(new Date(Y, mi, selDay))].concat(st.repeat ? weekly() : []),
            repeat: !!st.repeat,
          }),
        Object.assign({ screen: 'day', creating: false, newType: null, newName: '' }, cleared),
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
        screen: creating ? 'day' : 'detail',
        creating: false,
        newType: null,
        newName: '',
        extra: Object.assign({}, st.extra, { __draft: [] }),
      }),
    eCancelStyle:
      'height:52px;padding:0 22px;border:none;border-radius:16px;background:none;font-size:14.5px;font-weight:600;cursor:pointer;color:' +
      (creating ? '#5C6684' : '#B23A4C'),
    eDate:
      DOW3[selDate.getDay()].charAt(0) +
      DOW3[selDate.getDay()].slice(1, 3).toLowerCase() +
      ', ' +
      MON3[mi] +
      ' ' +
      selDay,
    eStatus: doneSel ? 'Completed' : 'Planned',
    eTime: (selAct && selAct.time) || (creating ? 'Duration TBD' : '~50 min'),
    toggleRepeat: () => logic.s({ repeat: !st.repeat }),
    repeatOn: !!st.repeat,
    switchTrack:
      'margin-left:auto;width:58px;height:34px;flex:none;border:none;border-radius:999px;padding:4px;cursor:pointer;display:flex;align-items:center;justify-content:' +
      (st.repeat ? 'flex-end' : 'flex-start') +
      ';background:' +
      (st.repeat ? PINK : '#C7C4D0'),
    switchKnob:
      'width:26px;height:26px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(35,42,69,.35)',
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
      return {
        name: e.name,
        sets: e.sets,
        weight: e.weight,
        rest: e.rest,
        setSets: setField('sets'),
        setWeight: setField('weight'),
        setRest: setField('rest'),
        icoSvg: iconSvg(cur),
        hideLegacy: false,
        detail: e.sets + ' · ' + e.weight + ' · ' + e.rest + ' rest',
        nameStyle:
          "display:block;font-family:'Space Grotesk',system-ui,sans-serif;font-size:16.5px;font-weight:700;letter-spacing:-.01em;" +
          (doneSet[e.name] ? 'color:#746E88;text-decoration:line-through' : 'color:#232A45'),
        doneBtn:
          'margin-left:auto;display:flex;align-items:center;justify-content:center;width:34px;height:34px;flex:none;border-radius:11px;cursor:pointer;border:' +
          (doneSet[e.name] ? 'none;background:#E1699C' : '1.5px solid rgba(35,42,69,.15);background:none'),
        doneStroke: doneSet[e.name] ? '#fff' : 'rgba(35,42,69,0.22)',
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
