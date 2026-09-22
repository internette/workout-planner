import { DOWFULL } from '../constants';
import { idOf, questSeed, tokenFor } from '../helpers';
import { iconSvg } from '../icons';
import * as db from '@/lib/plannerData';
import type { Ctx } from '../types';
import { colors } from '@/components/ui/colors';

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
    goEdit: () =>
      logic.nav({ screen: 'edit', editing: !!actFor(selDay), creating: false, editKey: mi + '-' + selDay }),
    // From a day of the calendar the new workout goes on that day, and can be switched to saved-only.
    goNewWorkout: () =>
      logic.nav({
        screen: 'edit',
        editing: false,
        creating: true,
        addOpen: false,
        newName: '',
        newType: null,
        newFrom: 'calendar',
        schedule: true,
      }),
    // From the Arsenal it is only saved. It goes on the calendar when the person chooses to.
    goNewWorkoutFromArsenal: () =>
      logic.nav({
        screen: 'edit',
        editing: false,
        creating: true,
        addOpen: false,
        newName: '',
        newType: null,
        newFrom: 'arsenal',
        schedule: false,
        repeat: false,
      }),
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
        ? 'background:linear-gradient(135deg,var(--color-pink) 0%,var(--color-periwinkle) 50%,var(--color-teal) 100%)'
        : 'background:var(--color-white);box-shadow:0 1px 3px rgba(35,42,69,.06)'),
    questTitleStyle:
      'font-family:var(--font-heading);font-size:var(--text-lg);font-weight:var(--font-weight-bold);letter-spacing:var(--tracking-snug);margin-top:4px;' +
      (questCleared ? 'color:var(--color-muted);text-decoration:line-through' : 'color:var(--color-ink)'),
    isDone:
      (actFor(selDay) || {}).s === 'c' || rideDone || (selList.length > 0 && doneCount === selList.length),
    dayIsRide: !!selRide,
    dayIsLift: !selRide,
    toggleRideDone: () => {
      logic.s({ rideDone: Object.assign({}, st.rideDone, { [idOf(selAct)]: !rideDone }) });
      logic.save(() => db.setRideDone(idOf(selAct), !rideDone));
    },
    rideDoneLabel: rideDone ? 'Ride completed' : 'Mark ride complete',
    rideDoneType: rideDone ? 'secondary' : 'neutral',
    rideDoneMark:
      'width:24px;height:24px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;' +
      (rideDone ? 'background:var(--color-pink)' : 'border:1.5px solid rgba(35,42,69,.18)'),
    rideDoneStroke: rideDone ? 'var(--color-white)' : 'rgba(35,42,69,0.22)',
    dayIcoSvg: iconSvg(
      (st.icons || {})[listKey] || (srcAct && srcAct.icon) || (selRide ? 'bike' : 'h'),
      (st.iconColors || {})[listKey] || (srcAct && srcAct.iconColor) || colors.pink,
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
      '%;height:100%;border-radius:5px;transition:width .35s ease;background:linear-gradient(135deg,var(--color-pink) 0%,var(--color-periwinkle) 50%,var(--color-teal) 100%)',
    preview: st.more ? all : all.slice(0, 3),
    hasMore: all.length > 3,
    moreLabel: st.more ? 'Show less' : '+ ' + (all.length - 3) + ' more',
    moreCaret:
      'width:15px;height:15px;flex:none;transition:transform .2s' +
      (st.more ? ';transform:rotate(180deg)' : ''),
    ctaLabel: hasEntry ? 'View chronicle entry' : 'Finish workout & log it',
    longDate: DOWFULL[selDate.getDay()] + ', ' + st.month + ' ' + selDay,
    badgeStyle:
      'margin-left:auto;padding:7px 13px;border-radius:999px;font-size:var(--text-xs);font-weight:var(--font-weight-bold);letter-spacing:var(--tracking-wide);' +
      (doneSel
        ? 'background:var(--color-cloud);color:var(--color-slate)'
        : 'background:var(--color-pink-tint);color:var(--color-pink-deep)'),
    hasProgress: st.screen === 'edit' && !isCycleView && selList.length > 0,
    progLabel: doneCount + ' of ' + selList.length + ' done',
    allDone: selList.length > 0 && doneCount === selList.length,
    someDone: !(selList.length > 0 && doneCount === selList.length),
    progNoteStyle:
      'margin:12px 0 0;display:flex;align-items:center;gap:7px;font-size:var(--text-md);font-weight:' +
      (selList.length && doneCount === selList.length
        ? 'var(--font-weight-semibold);color:var(--color-pink-deep)'
        : 'var(--font-weight-regular);color:var(--color-muted)'),
    progBar:
      'width:' +
      (selList.length ? Math.round((doneCount / selList.length) * 100) : 0) +
      '%;height:100%;border-radius:5px;transition:width .35s ease;background:linear-gradient(135deg,var(--color-pink) 0%,var(--color-periwinkle) 50%,var(--color-teal) 100%)',
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
