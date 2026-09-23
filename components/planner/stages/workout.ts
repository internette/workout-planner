import { idOf } from '../helpers';
import type { Ctx } from '../types';
import { colors } from '@/components/ui/colors';

// The selected workout: ride plan and actuals, exercise list, icons and completion state.
export function workoutStage(ctx: Ctx): Ctx {
  const { logic, Y, mi, dim, selDay, st, creating, seedAt, actFor, EX, EXV, TK, DIARY } = ctx;
  const pickLead = new Date(Y, mi, 1).getDay();
  const pickRows = Math.ceil((pickLead + dim) / 7);
  const pickerCells = [];
  for (let i = 0; i < pickRows * 7; i++) {
    const pd = i - pickLead + 1;
    if (pd < 1 || pd > dim) {
      pickerCells.push({ label: '', style: 'height:34px;border:none;background:none;cursor:default' });
      continue;
    }
    pickerCells.push({
      label: String(pd),
      pick: () => logic.s({ day: pd, dateOpen: false }),
      style:
        "height:34px;border:none;border-radius:10px;cursor:pointer;font-family:var(--font-heading);font-size:var(--text-md);font-weight:" +
        (pd === selDay ? 'var(--font-weight-bold);background:var(--color-pink);color:var(--color-white)' : 'var(--font-weight-medium);background:none;color:var(--color-ink)'),
    });
  }
  const editSrc =
    st.screen === 'edit' && !creating && st.editKey
      ? seedAt(Number(st.editKey.split('-')[0]), Number(st.editKey.split('-')[1]))
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
    return all;
  };
  const listKey = creating ? '__draft' : idOf(srcAct);
  const picked = (st.areas || {})[listKey] || (srcAct && srcAct.areas) || [];
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
  const all = selList.map((e) => ({
    text: e.name + ' — ' + e.sets + ' · ' + e.weight,
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
  const ridePlanOpen = !!savedRide && !rideDone && !ridePast;
  const entryKey = idOf(actFor(selDay));
  const hasEntry = !!DIARY[entryKey];
  const questCleared = !!selAct && (rideDone || (!selRide && selList.length > 0 && doneCount === selList.length));
  const doneSel =
    !!selAct && (selAct.s === 'c' || rideDone || (!selRide && selList.length > 0 && doneCount === selList.length));
  return {
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
    pickerCells,
    doneSet,
    doneNames,
    entryKey,
  };
}
