import { DOWFULL } from '../constants';
import { idOf, questSeed, tokenFor } from '../helpers';
import { iconSvg } from '../icons';
import * as db from '@/lib/plannerData';
import type { Ctx } from '../types';

// The day card and the workout detail screen (today's quest, exercise preview, completion).
export function workoutVals(ctx: Ctx) {
  const {
    logic,
    actFor,
    selDay,
    mi,
    selAct,
    nameOf,
    selRide,
    rideDone,
    selList,
    doneCount,
    st,
    questCleared,
    listKey,
    srcAct,
    all,
    hasEntry,
    selDate,
    doneSel,
    isCycleView,
  } = ctx;
  return {
    backToDay: () => logic.back(),
    goDetail: () => logic.nav({ screen: 'detail', creating: false }),
    goEdit: () => logic.nav({ screen: 'edit', editing: !!actFor(selDay), creating: false, editKey: mi + '-' + selDay }),
    goNewWorkout: () =>
      logic.nav({ screen: 'edit', editing: false, creating: true, addOpen: false, newName: '', newType: null }),
    goDiary: () => logic.nav({ screen: 'diary', diaryFrom: 'day', diaryEdit: false }),
    wName: selAct ? nameOf(selAct.name) : '',
    wMeta: !selAct
      ? ''
      : selRide
        ? rideDone
          ? 'Completed'
          : selRide.dist
            ? selRide.dist + ' mi · ' + selAct.time
            : selAct.time
        : selList.length > 0 && doneCount === selList.length
          ? 'Completed'
          : doneCount > 0
            ? doneCount + ' of ' + selList.length + ' done · ' + selAct.time
            : selList.length + ' exercises · ' + selAct.time,
    showQuest: st.seg === 'Day' && !!actFor(selDay),
    questTitle: questSeed(selDay, mi).title,
    questNote: questCleared ? questSeed(selDay, mi).done : questSeed(selDay, mi).note,
    questDone: questCleared,
    questOpen: !questCleared,
    questEyebrow: questCleared ? 'QUEST CLEARED' : "TODAY'S QUEST",
    questIconWrap:
      'width:40px;height:40px;flex:none;border-radius:13px;display:flex;align-items:center;justify-content:center;' +
      (questCleared
        ? 'background:linear-gradient(135deg,#E1699C 0%,#7C8FC9 50%,#5EC4D6 100%)'
        : 'background:#fff;box-shadow:0 1px 3px rgba(35,42,69,.06)'),
    questTitleStyle:
      "font-family:'Space Grotesk',system-ui,sans-serif;font-size:15px;font-weight:700;letter-spacing:-.01em;margin-top:4px;" +
      (questCleared ? 'color:#746E88;text-decoration:line-through' : 'color:#232A45'),
    isDone: (actFor(selDay) || {}).s === 'c' || rideDone || (selList.length > 0 && doneCount === selList.length),
    dayIsRide: !!selRide,
    dayIsLift: !selRide,
    toggleRideDone: () => {
      logic.s({ rideDone: Object.assign({}, st.rideDone, { [idOf(selAct)]: !rideDone }) });
      logic.save(() => db.setRideDone(idOf(selAct), !rideDone));
    },
    rideDoneLabel: rideDone ? 'Ride completed' : 'Mark ride complete',
    rideDoneBtn:
      'display:inline-flex;align-items:center;gap:10px;margin-top:20px;height:46px;padding:0 18px 0 14px;border:none;border-radius:15px;cursor:pointer;font-size:14px;font-weight:600;' +
      (rideDone ? 'background:#FCE8F1;color:#c4548a' : 'background:#FBF1F3;color:#5C6684'),
    rideDoneMark:
      'width:24px;height:24px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;' +
      (rideDone ? 'background:#E1699C' : 'border:1.5px solid rgba(35,42,69,.18)'),
    rideDoneStroke: rideDone ? '#fff' : 'rgba(35,42,69,0.22)',
    dayIcoSvg: iconSvg(
      (st.icons || {})[listKey] || (srcAct && srcAct.icon) || (selRide ? 'bike' : 'h'),
      (st.iconColors || {})[listKey] || (srcAct && srcAct.iconColor) || '#E1699C',
    ),
    rideStats: !selRide
      ? []
      : [
          { label: 'DISTANCE', value: selRide.dist ? selRide.dist + ' mi' : '—' },
          { label: 'DURATION', value: (selAct && selAct.time) || '—' },
          { label: 'ELEVATION', value: selRide.elev ? selRide.elev + ' ft' : '—' },
          { label: 'EFFORT', value: selRide.zone || 'Endurance' },
        ],
    dayProgLabel: doneCount + '/' + selList.length,
    dayProgBar:
      'width:' +
      (selList.length ? Math.round((doneCount / selList.length) * 100) : 0) +
      '%;height:100%;border-radius:5px;transition:width .35s ease;background:linear-gradient(135deg,#E1699C 0%,#7C8FC9 50%,#5EC4D6 100%)',
    preview: st.more ? all : all.slice(0, 3),
    hasMore: all.length > 3,
    moreLabel: st.more ? 'Show less' : '+ ' + (all.length - 3) + ' more',
    moreCaret:
      'width:15px;height:15px;flex:none;transition:transform .2s' + (st.more ? ';transform:rotate(180deg)' : ''),
    ctaLabel: hasEntry ? 'View chronicle entry' : 'Finish workout & log it',
    longDate: DOWFULL[selDate.getDay()] + ', ' + st.month + ' ' + selDay,
    badgeStyle:
      'margin-left:auto;padding:7px 13px;border-radius:999px;font-size:10.5px;font-weight:700;letter-spacing:.09em;' +
      (doneSel ? 'background:#EAECF3;color:#5C6684' : 'background:#FCE8F1;color:#c4548a'),
    hasProgress: st.screen === 'edit' && !isCycleView && selList.length > 0,
    progLabel: doneCount + ' of ' + selList.length + ' done',
    allDone: selList.length > 0 && doneCount === selList.length,
    someDone: !(selList.length > 0 && doneCount === selList.length),
    progNoteStyle:
      'margin:12px 0 0;display:flex;align-items:center;gap:7px;font-size:13px;font-weight:' +
      (selList.length && doneCount === selList.length ? '600;color:#c4548a' : '400;color:#746E88'),
    progBar:
      'width:' +
      (selList.length ? Math.round((doneCount / selList.length) * 100) : 0) +
      '%;height:100%;border-radius:5px;transition:width .35s ease;background:linear-gradient(135deg,#E1699C 0%,#7C8FC9 50%,#5EC4D6 100%)',
    progNote:
      selList.length === 0
        ? ''
        : doneCount === 0
          ? 'Mark each exercise as you clear it.'
          : doneCount === selList.length
            ? 'Transformation complete. Log how it felt to claim your ' + tokenFor(selDay + mi) + '.'
            : selList.length - doneCount + ' left to go.',
    toggleMore: () => logic.s({ more: !st.more }),
  };
}
