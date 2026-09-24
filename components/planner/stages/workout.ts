import { exLine, idOf, monthPatch } from '../helpers';
import type { Ctx } from '../types';
import { colors } from '@/components/ui/colors';

// The selected workout: ride plan and actuals, exercise list, icons and completion state.
export function workoutStage(ctx: Ctx): Ctx {
  const { logic, Y, mi, dim, selDay, st, creating, actFor, EX, EXV, TK, DIARY } = ctx;
  // The editor's date picker browses months on its own (st.pickM); only tapping a day moves the workout there.
  const pickM = st.pickM != null ? st.pickM : mi;
  const pickDim = new Date(Y, pickM + 1, 0).getDate();
  const pickLead = new Date(Y, pickM, 1).getDay();
  const pickRows = Math.ceil((pickLead + pickDim) / 7);
  const pickerCells = [];
  for (let i = 0; i < pickRows * 7; i++) {
    const pd = i - pickLead + 1;
    if (pd < 1 || pd > pickDim) {
      pickerCells.push({ label: '', style: 'height:34px;border:none;background:none;cursor:default' });
      continue;
    }
    pickerCells.push({
      label: String(pd),
      pick: () => logic.s({ ...monthPatch(pickM), day: pd, dateOpen: false, pickM: null }),
      selected: pickM === mi && pd === selDay,
      style:
        "height:34px;border:none;border-radius:10px;cursor:pointer;font-family:var(--font-heading);font-size:var(--text-md);font-weight:" +
        (pickM === mi && pd === selDay ? 'var(--font-weight-bold);background:var(--color-pink);color:var(--color-white)' : 'var(--font-weight-medium);background:none;color:var(--color-ink)'),
    });
  }
  // Editing a saved workout from the Spellbook uses this same editor, with the workout standing in for a session: no
  // date, nothing to tick off. Its edits are keyed "tpl:<id>" like a session's are keyed by its id.
  const tplWorkout =
    st.screen === 'edit' && !creating && st.editTemplate
      ? logic.model.workouts.find((w) => w.id === st.editTemplate) || null
      : null;
  const tplMode = !!tplWorkout;
  const tplEntry = tplWorkout
    ? {
        id: 'tpl:' + tplWorkout.id,
        workoutId: tplWorkout.id,
        name: tplWorkout.name,
        exKey: tplWorkout.name,
        s: 'p',
        time: tplWorkout.time,
        icon: tplWorkout.icon,
        iconColor: tplWorkout.iconColor,
        areas: tplWorkout.areas,
        repeat: false,
        notes: tplWorkout.notes,
        actual: null,
        ride: tplWorkout.ride
          ? {
              dist: tplWorkout.ride.dist,
              elev: tplWorkout.ride.elev,
              zone: tplWorkout.ride.zone,
              hrs: Math.floor(tplWorkout.minutes / 60) ? String(Math.floor(tplWorkout.minutes / 60)) : '',
              mins: tplWorkout.minutes % 60 ? String(tplWorkout.minutes % 60) : '',
            }
          : undefined,
      }
    : null;
  // The session being edited, by id: its day may hold other workouts, and the date picker may be moving it.
  const editSrc = tplEntry
    ? tplEntry
    : st.screen === 'edit' && !creating && st.editId
      ? (logic.model.entries.find((x) => x.av.id === st.editId) || {}).av || null
      : null;
  // A workout being created starts blank; it must not inherit whatever is already on the selected day.
  const srcAct = creating ? null : editSrc || actFor(selDay);
  const selRide = srcAct && srcAct.ride ? srcAct.ride : null;
  const rideDone = !!(st.rideDone || {})[idOf(srcAct)];
  const savedRide = !creating && selRide ? selRide : null;
  const isCycleView = creating ? st.newType === 'cycle' : !!savedRide;
  const rDist = st.rDist != null ? st.rDist : savedRide ? savedRide.dist || '' : '';
  const rElev = st.rElev != null ? st.rElev : savedRide ? savedRide.elev || '' : '';
  const rHrs = st.rHrs != null ? st.rHrs : savedRide ? savedRide.hrs || '' : '';
  const rMins = st.rMins != null ? st.rMins : savedRide ? savedRide.mins || '' : '';
  const plannedMin = Number(rHrs || 0) * 60 + Number(rMins || 0);
  const planDist = Number(rDist || 0);
  const actual: any = (srcAct && srcAct.actual) || {};
  const aDist = st.aDist != null ? st.aDist : actual.dist || '';
  const aElev = st.aElev != null ? st.aElev : actual.elev || '';
  const aHrs = st.aHrs != null ? st.aHrs : actual.hrs || '';
  const aMins = st.aMins != null ? st.aMins : actual.mins || '';
  const rodeDist = Number(aDist || 0);
  const ridePct = !rodeDist ? null : planDist ? Math.round((rodeDist / planDist) * 100) : 100;
  const selAct = creating ? null : srcAct;
  // A stopwatch for the session on screen, keyed by its plan entry so a different day's workout never shares it.
  const timerKey = idOf(selAct);
  const timerState = (st.workoutTimer || {})[timerKey] || null;
  const timerRunning = !!(timerState && timerState.runningSince);
  const timerElapsedSec = timerState
    ? timerState.elapsed + (timerRunning ? Math.floor((Date.now() - timerState.runningSince) / 1000) : 0)
    : 0;
  const baseName = (srcAct && srcAct.name) || '';
  const baseKey = (srcAct && srcAct.exKey) || '';
  const selName = creating ? st.newName || '' : (st.renames || {})[baseName] != null ? st.renames[baseName] : baseName;
  const libraryFor = (name) => {
    const have = {};
    (EX[name] || [])
      .concat((st.extra || {})[name] || [])
      .filter((e) => ((st.removed || {})[name] || []).indexOf(e.name) === -1)
      .forEach((e) => {
        have[e.name] = 1;
      });
    const all = [];
    const add = (e) => {
      if (!have[e.name] && !all.some((x) => x.name === e.name)) all.push(e);
    };
    Object.keys(EX).forEach((k) => EX[k].forEach(add));
    Object.keys(st.extra || {}).forEach((k) => (st.extra[k] || []).forEach(add));
    logic.model.library.forEach(add);
    // Last, so a person's own exercise wins over a built-in with the same name.
    logic.model.builtins.forEach(add);
    return all;
  };
  const listKey = creating ? '__draft' : idOf(srcAct);
  const notesVal = (st.notes || {})[listKey] != null ? (st.notes || {})[listKey] : (srcAct && srcAct.notes) || '';
  const wIcon = (st.icons || {})[listKey] || (srcAct && srcAct.icon) || (isCycleView ? 'bike' : 'h');
  const wColor = (st.iconColors || {})[listKey] || (srcAct && srcAct.iconColor) || colors.pink;
  const doneNames = (st.done || {})[listKey] || [];
  const doneSet = {};
  doneNames.forEach((n) => {
    doneSet[n] = 1;
  });
  const doneCount = doneNames.length;
  const gone = (st.removed || {})[listKey] || [];
  const added = (st.extra || {})[listKey] || [];
  const selList = (creating ? [] : EXV[baseKey] || [])
    .concat(added)
    .filter((e) => gone.indexOf(e.name) === -1)
    .map((e) => Object.assign({}, e, (st.fields || {})[listKey + '|' + e.name] || {}));
  // The workout's own target areas aren't picked directly any more — they're whatever its exercises target.
  const picked = Array.from(new Set(selList.flatMap((e) => e.areas || [])));
  const all = selList.map((e) => ({
    text: e.name + ' — ' + exLine(e),
    isH: e.i === 'h',
    isV: e.i === 'v',
    isD: e.i === 'd',
    textStyle:
      'flex:1;min-width:0;font-size:var(--text-lg);font-weight:var(--font-weight-medium);' +
      (doneSet[e.name] ? 'color:var(--color-muted);text-decoration:line-through' : 'color:var(--color-ink)'),
    tick:
      'flex:none;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:' +
      (doneSet[e.name] ? 'var(--color-pink)' : 'transparent'),
  }));
  const ridePast = mi * 100 + selDay < TK;
  // A saved workout's plan is always editable; a session's only until it's done or past.
  const ridePlanOpen = !!savedRide && (tplMode || (!rideDone && !ridePast));
  const entryKey = idOf(actFor(selDay));
  const hasEntry = !!DIARY[entryKey];
  // Finished with Finish counts as done, the same as everywhere else (entries' isDoneEntry).
  const finishedSel = !!selAct && !selRide && ctx.actualMinutes(selAct) > 0;
  const questCleared =
    !!selAct && (rideDone || finishedSel || (!selRide && selList.length > 0 && doneCount === selList.length));
  const doneSel =
    !!selAct &&
    (selAct.s === 'c' || rideDone || finishedSel || (!selRide && selList.length > 0 && doneCount === selList.length));
  return {
    tplMode,
    srcAct,
    selAct,
    selRide,
    rideDone,
    selList,
    doneCount,
    questCleared,
    listKey,
    all,
    hasEntry,
    doneSel,
    isCycleView,
    ridePlanOpen,
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
    libraryFor,
    added,
    gone,
    wIcon,
    wColor,
    selName,
    baseName,
    baseKey,
    timerKey,
    timerState,
    timerRunning,
    timerElapsedSec,
    pickerCells,
    pickM,
    doneSet,
    doneNames,
    entryKey,
  };
}
