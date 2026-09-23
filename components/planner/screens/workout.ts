import { DOWFULL, EDIT_OVERLAYS } from '../constants';
import { formatElapsed, idOf, plural, questSeed, tokenFor } from '../helpers';
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
    hasEntry,
    selDate,
    doneSel,
    isCycleView,
    timerKey,
    timerState,
    timerRunning,
    timerElapsedSec,
    dayEntries,
    isDoneEntry,
    instList,
    DIARY,
  } = ctx;
  const goDetail = () => logic.nav({ screen: 'detail', creating: false });
  // The quest belongs to the day, so on a day with several workouts it is cleared once all of them are.
  const dayCleared = dayEntries.length > 1 ? dayEntries.every(isDoneEntry) : questCleared;
  const setTimer = (patch) =>
    logic.s({ workoutTimer: Object.assign({}, st.workoutTimer, { [timerKey]: patch }) });
  const startTimer = () => setTimer({ elapsed: 0, runningSince: Date.now() });
  const pauseTimer = () => setTimer({ elapsed: timerElapsedSec, runningSince: null });
  const resumeTimer = () => setTimer({ elapsed: timerElapsedSec, runningSince: Date.now() });
  // "Finish workout & log it" (and reopening what you already logged) means the clock's job is done —
  // stop it here rather than leaving it running unnoticed under the diary screen.
  // An entry that already exists opens to read, with its own mood and effort. A new one starts from a clean form,
  // never from whatever mood and effort were last on screen.
  const goDiary = () => {
    if (timerRunning) pauseTimer();
    const logged = DIARY[listKey];
    logic.nav(
      Object.assign(
        { screen: 'diary', diaryFrom: 'day', diaryEdit: false, entryNote: null },
        logged ? { mood: logged.mood, rpe: logged.rpe } : { mood: 'Happy', rpe: 3 },
      ),
    );
  };
  // Leaving the detail screen while the clock is running asks first, so a stray tap on a nav item can't
  // silently keep it running unattended (or lose track of it). Both the nav guard (chrome.ts) and this
  // screen's own Back arrow route through the same prompt.
  const askThenGo = (proceed) => {
    if (st.screen === 'detail' && timerRunning) return logic.s({ pausePrompt: { proceed } });
    proceed();
  };
  // Starting never touches what's already ticked: it only starts the clock (if it isn't going) and opens the workout.
  const startWorkout = () => {
    if (!timerState) startTimer();
    goDetail();
  };
  const continueWorkout = () => {
    if (!timerRunning) resumeTimer();
    goDetail();
  };
  // Restarting starts the clock from zero and clears the ticks. Clearing them can't be undone, so when there are
  // any it asks first; with nothing ticked there is nothing to lose and it just restarts.
  const hasProgress = !!selAct && (selRide ? rideDone : doneCount > 0);
  const doRestart = () => {
    startTimer();
    if (selAct && hasProgress) {
      if (selRide) {
        logic.s({ rideDone: Object.assign({}, st.rideDone, { [idOf(selAct)]: false }) });
        logic.save(() => db.setRideDone(idOf(selAct), false));
      } else {
        logic.s({ done: Object.assign({}, st.done, { [listKey]: [] }) });
        logic.save(() => db.setExercisesDone(listKey, [], false));
      }
    }
    goDetail();
  };
  const restartWorkout = () => (hasProgress ? logic.s({ restartPrompt: true }) : doRestart());
  // Day view shows a card for every workout on the day. A card's buttons pick its session first, then do what
  // the same button does for the session on screen, so the detail, timer and diary all follow that session.
  const exerciseRow = (e, doneNames) => ({
    text: e.name + ' — ' + e.sets + ' · ' + e.weight,
    isH: e.i === 'h',
    isV: e.i === 'v',
    isD: e.i === 'd',
    textStyle:
      'flex:1;min-width:0;font-size:var(--text-lg);font-weight:var(--font-weight-medium);' +
      (doneNames.includes(e.name) ? 'color:var(--color-muted);text-decoration:line-through' : 'color:var(--color-ink)'),
  });
  const dayCards = dayEntries.map((av) => {
    const id = idOf(av);
    const run = (action) => () => {
      logic.s({ entryId: id });
      logic.renderVals()[action]();
    };
    const list = instList(av.exKey, id).map((e) => Object.assign({}, e, (st.fields || {})[id + '|' + e.name] || {}));
    const doneNames = (st.done || {})[id] || [];
    const doneN = list.filter((e) => doneNames.includes(e.name)).length;
    const ride = av.ride || null;
    const rideIsDone = !!(st.rideDone || {})[id];
    const complete = ride ? rideIsDone : list.length > 0 && doneN === list.length;
    const logged = !!DIARY[id];
    const timed = !!(st.workoutTimer || {})[id];
    const rows = list.map((e) => exerciseRow(e, doneNames));
    const expanded = !!(st.moreIds || {})[id];
    return {
      key: id,
      name: nameOf(av.name),
      meta: complete
        ? 'Completed'
        : ride
          ? ride.dist
            ? ride.dist + ' mi · ' + av.time
            : av.time
          : doneN > 0
            ? doneN + ' of ' + list.length + ' done · ' + av.time
            : plural(list.length, 'exercise') + ' · ' + av.time,
      icoSvg: iconSvg(
        (st.icons || {})[id] || av.icon || (ride ? 'bike' : 'h'),
        (st.iconColors || {})[id] || av.iconColor || colors.pink,
      ),
      open: run('goDetail'),
      isLift: !ride,
      isRide: !!ride,
      progLabel: doneN + '/' + list.length,
      progBar:
        'width:' +
        (list.length ? Math.round((doneN / list.length) * 100) : 0) +
        '%;height:100%;border-radius:5px;transition:width .35s ease;background:linear-gradient(135deg,var(--color-pink) 0%,var(--color-periwinkle) 50%,var(--color-teal) 100%)',
      rideStats: !ride
        ? []
        : [
            { label: 'DISTANCE', value: ride.dist ? ride.dist + ' mi' : '—' },
            { label: 'DURATION', value: av.time || '—' },
            { label: 'ELEVATION', value: ride.elev ? ride.elev + ' ft' : '—' },
            { label: 'EFFORT', value: ride.zone || 'Endurance' },
          ],
      preview: expanded ? rows : rows.slice(0, 3),
      hasMore: rows.length > 3,
      moreLabel: expanded ? 'Show less' : '+ ' + (rows.length - 3) + ' more',
      moreCaret: 'width:15px;height:15px;flex:none;transition:transform .2s' + (expanded ? ';transform:rotate(180deg)' : ''),
      toggleMore: () => logic.s({ moreIds: Object.assign({}, st.moreIds, { [id]: !expanded }) }),
      // Logged: read it. Every exercise ticked but not logged yet: log it. Started (clock or ticks): carry on, or
      // start over. Otherwise: start.
      ctaTwoButtons: !logged && !complete && (timed || doneN > 0),
      ctaLabel: logged ? 'View chronicle entry' : complete ? 'Log this workout' : 'Start workout',
      cta: run(logged || complete ? 'goDiary' : 'startWorkout'),
      restart: run('restartWorkout'),
      continue: run('continueWorkout'),
    };
  });
  return {
    backToDay: () => askThenGo(() => logic.back()),
    goDetail,
    timerLabel: formatElapsed(timerElapsedSec),
    timerButtonLabel: !timerState ? 'Start' : timerRunning ? 'Pause' : 'Resume',
    timerButtonAction: !timerState ? startTimer : timerRunning ? pauseTimer : resumeTimer,
    // A workout that's already done, and was never timed, doesn't need a "Start" — that's for something you're
    // about to do. But once a clock exists for it (started earlier this same session), keep showing it, so
    // finishing the last exercise doesn't yank away the button that pauses or logs it.
    showTimer: !!timerState || !doneSel,
    pausePromptOpen: !!st.pausePrompt,
    keepGoing: () => logic.s({ pausePrompt: null }),
    confirmPause: () => {
      const pending = st.pausePrompt;
      logic.s(
        Object.assign(
          { pausePrompt: null },
          timerRunning ? { workoutTimer: Object.assign({}, st.workoutTimer, { [timerKey]: { elapsed: timerElapsedSec, runningSince: null } }) } : {},
        ),
      );
      if (pending && pending.proceed) pending.proceed();
    },
    goEdit: () =>
      logic.nav({
        screen: 'edit',
        editing: !!selAct,
        creating: false,
        editKey: mi + '-' + selDay,
        editId: selAct ? selAct.id : null,
      }),
    // A new workout always starts blank: nothing carried over from a draft that was left behind elsewhere.
    // From a day of the calendar the new workout goes on that day, and can be switched to saved-only.
    goNewWorkout: () =>
      logic.nav(
        Object.assign({}, EDIT_OVERLAYS, {
          screen: 'edit',
          editing: false,
          creating: true,
          addOpen: false,
          newName: '',
          newType: null,
          newFrom: 'calendar',
          schedule: true,
          arsenalPick: null,
        }),
      ),
    // From the Spellbook it is only saved. It goes on the calendar when the person chooses to.
    goNewWorkoutFromArsenal: () =>
      logic.nav(
        Object.assign({}, EDIT_OVERLAYS, {
          screen: 'edit',
          editing: false,
          creating: true,
          addOpen: false,
          newName: '',
          newType: null,
          newFrom: 'arsenal',
          schedule: false,
          repeat: false,
          arsenalPick: null,
        }),
      ),
    goDiary,
    showQuest: st.seg === 'Day' && !!actFor(selDay),
    dayCards,
    questTitle: questSeed(selDay, mi).title,
    questNote: dayCleared ? questSeed(selDay, mi).done : questSeed(selDay, mi).note,
    questDone: dayCleared,
    questOpen: !dayCleared,
    questEyebrow: dayCleared ? 'QUEST CLEARED' : "TODAY'S QUEST",
    questIconWrap:
      'width:40px;height:40px;flex:none;border-radius:13px;display:flex;align-items:center;justify-content:center;' +
      (dayCleared
        ? 'background:linear-gradient(135deg,var(--color-pink) 0%,var(--color-periwinkle) 50%,var(--color-teal) 100%)'
        : 'background:var(--color-white);box-shadow:0 1px 3px rgba(35,42,69,.06)'),
    questTitleStyle:
      'font-family:var(--font-heading);font-size:var(--text-lg);font-weight:var(--font-weight-bold);letter-spacing:var(--tracking-snug);margin-top:4px;' +
      (dayCleared ? 'color:var(--color-muted);text-decoration:line-through' : 'color:var(--color-ink)'),
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
    ctaLabel: hasEntry ? 'View chronicle entry' : 'Finish workout & log it',
    startWorkout,
    restartWorkout,
    continueWorkout,
    restartPromptOpen: !!st.restartPrompt,
    restartPromptBody: selRide
      ? 'This marks the ride as not done and starts the timer from zero.'
      : 'This clears the ' +
        plural(doneCount, 'exercise') +
        " you've ticked off and starts the timer from zero. It can't be undone.",
    cancelRestart: () => logic.s({ restartPrompt: false }),
    confirmRestart: () => {
      logic.s({ restartPrompt: false });
      doRestart();
    },
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
  };
}
