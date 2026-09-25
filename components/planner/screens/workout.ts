import { DOW3, DOWFULL, EDIT_OVERLAYS, MON3 } from '../constants';
import { digitsOnly, rollMinutes, exLine, formatElapsed, idOf, isoOf, monthPatch, noticePatch, numericOnly, plural, questSeed } from '../helpers';
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
    TODAY_M,
    TODAY_D,
    DIARY,
    actualMinutes,
    minText,
    distOf,
    timeOf,
    TK,
    Y,
  } = ctx;
  // A session on a day still ahead can't be done yet: starting it early would count it for that day. It can be moved
  // to today instead, and started there.
  const isFutureDay = mi * 100 + selDay > TK;
  const isPastDay = mi * 100 + selDay < TK;
  // "Sat 26": the day a session is on.
  const leaveDay = (id) => {
    const x = logic.model.entries.find((e) => e.av.id === id);
    if (!x) return 'its day';
    const dt = new Date(Y, x.m, x.d);
    return DOW3[dt.getDay()].charAt(0) + DOW3[dt.getDay()].slice(1, 3).toLowerCase() + ' ' + x.d;
  };
  const doToday = (av, sure = false) => {
    if (!av) return;
    const id = idOf(av);
    // Already on today: moving this one too would put it there twice, so ask first.
    if (!sure && logic.model.entries.some((x) => x.m === TODAY_M && x.d === TODAY_D && x.av.name === av.name && x.av.id !== id))
      return logic.s({
        confirm: {
          kind: 'doToday',
          title: '“' + nameOf(av.name) + '” is already on today',
          body: 'Moving this one to today too puts it there twice.',
          label: 'Move it to today',
          // Not a destructive choice, so neither button is red, and staying names the day it stays on.
          safe: true,
          cancelLabel: 'Leave it on ' + leaveDay(id),
          then: () => doToday(av, true),
        },
      });
    logic.saveOnce(
      'move',
      () =>
        db.updateWorkout({
          entryId: id,
          workoutId: av.workoutId,
          moveTo: isoOf(new Date(Y, TODAY_M, TODAY_D)),
          exercises: { update: [], removeIds: [], add: [] },
          repeatDates: [],
        }),
      {
        screen: 'detail',
        seg: 'Day',
        creating: false,
        ...monthPatch(TODAY_M),
        day: TODAY_D,
        entryId: id,
        // Only moved: the timer waits for Start, in case it was just the day that changed.
        ...noticePatch('“' + nameOf(av.name) + '” moved to today.', 'detail'),
      },
    );
  };
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
        logged ? { mood: logged.mood, rpe: logged.rpe } : { mood: null, rpe: null },
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
    // Starting over also undoes Finish: what it recorded belonged to the go being thrown away.
    if (selAct && actualMinutes(selAct) > 0) logic.save(() => db.reopenSession(idOf(selAct)));
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
  // Finishing: stops the clock and records what the session actually took — a ride's distance, time and climb, a
  // lifting session's time — pre-filled from the timer (or the plan), so it's usually one tap. A ride is marked
  // complete here too; a lifting session is complete once every exercise is ticked, as before.
  const finished = !!selAct && actualMinutes(selAct) > 0;
  const plannedRideMin = selRide ? Number(selRide.hrs || 0) * 60 + Number(selRide.mins || 0) : 0;
  const openFinish = () => {
    if (!selAct) return;
    // The timer's reading, unless the session already has a recorded time and the timer only ran a few seconds (a
    // stray tap on Start, say): that mustn't overwrite what was recorded.
    const recorded = actualMinutes(selAct);
    const useTimer = !!timerState && (timerElapsedSec >= 60 || !recorded);
    const fromTimer = useTimer ? Math.max(1, Math.round(timerElapsedSec / 60)) : 0;
    const mins = fromTimer || recorded || plannedRideMin;
    const a = selAct.actual || {};
    if (timerRunning) pauseTimer();
    logic.s({
      finish: {
        wasRunning: timerRunning,
        correcting: !fromTimer && recorded > 0,
        ride: !!selRide,
        hrs: mins >= 60 ? String(Math.floor(mins / 60)) : '',
        mins: mins ? String(mins % 60) : '',
        dist: a.dist || (selRide && selRide.dist) || '',
        elev: a.elev || (selRide && selRide.elev) || '',
        fromTimer: !!fromTimer,
      },
    });
  };
  const fin = st.finish || null;
  const finMinutes = fin ? Number(fin.hrs || 0) * 60 + Number(fin.mins || 0) : 0;
  const patchFinish = (patch) => logic.s({ finish: Object.assign({}, fin, patch) });
  const saveFinish = () => {
    if (!fin || !selAct || finMinutes <= 0) return;
    const id = idOf(selAct);
    const timers = Object.assign({}, st.workoutTimer);
    delete timers[timerKey];
    logic.s(
      Object.assign(
        { finish: null, workoutTimer: timers, ...noticePatch(
          fin.correcting ? 'Time changed to ' + minText(finMinutes) + '.' : 'Transformation complete. ' + minText(finMinutes) + ' recorded.',
          'detail',
        ) },
        fin.ride ? { rideDone: Object.assign({}, st.rideDone, { [id]: true }) } : {},
      ),
    );
    logic.saveOnce('finish', () =>
      db.finishSession(id, { ride: fin.ride, minutes: finMinutes, dist: fin.dist, elev: fin.elev }),
    );
  };
  // A stat next to its plan, once the ride is done and what was ridden differs from it.
  const vsPlan = (actual, planned, unit) =>
    actual && planned && actual !== planned ? 'Planned ' + planned + unit : '';
  const rideStatsFor = (av, done) => {
    const r = av.ride;
    const a = done && av.actual ? av.actual : null;
    const took = a ? actualMinutes(av) : 0;
    return [
      { label: 'DISTANCE', value: distOf(av) ? distOf(av) + ' mi' : '—', note: a ? vsPlan(a.dist, r.dist, ' mi') : '' },
      // Like the others, only when what it took differs from the plan.
      {
        label: 'DURATION',
        value: timeOf(av) || '—',
        note: took && took !== Number(r.hrs || 0) * 60 + Number(r.mins || 0) ? 'Planned ' + av.time : '',
      },
      {
        label: 'ELEVATION',
        value: (a && a.elev) || r.elev ? ((a && a.elev) || r.elev) + ' ft' : '—',
        note: a ? vsPlan(a.elev, r.elev, ' ft') : '',
      },
      { label: 'EFFORT', value: r.zone || 'Endurance', note: '' },
    ];
  };
  // Day view shows a card for every workout on the day. A card's buttons pick its session first, then do what
  // the same button does for the session on screen, so the detail, timer and diary all follow that session.
  const exerciseRow = (e, doneNames) => ({
    text: e.name + ' — ' + exLine(e),
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
    // Finished with Finish counts as done here too, even with an exercise left unticked.
    const complete = ride ? rideIsDone : (list.length > 0 && doneN === list.length) || actualMinutes(av) > 0;
    const logged = !!DIARY[id];
    const timer = (st.workoutTimer || {})[id] || null;
    const timed = !!timer;
    const timerSec = timer
      ? timer.elapsed + (timer.runningSince ? Math.floor((Date.now() - timer.runningSince) / 1000) : 0)
      : 0;
    const rows = list.map((e) => exerciseRow(e, doneNames));
    const expanded = !!(st.moreIds || {})[id];
    return {
      key: id,
      name: nameOf(av.name),
      warmup: !!av.warmup,
      meta: complete
        ? 'Completed · ' + (ride && distOf(av) ? distOf(av) + ' mi · ' : '') + ctx.doneTimeOf(av)
        : timer
          ? (timer.runningSince ? 'In progress · ' : 'Paused · ') + formatElapsed(timerSec)
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
        '%;height:100%;border-radius:5px;transition:width var(--dur-bar) var(--ease-standard);background:var(--gradient-gem)',
      rideStats: !ride ? [] : rideStatsFor(av, rideIsDone),
      preview: expanded ? rows : rows.slice(0, 3),
      hasMore: rows.length > 3,
      moreLabel: expanded ? 'Show less' : '+ ' + (rows.length - 3) + ' more',
      moreOpen: expanded,
      moreCaret: 'width:15px;height:15px;flex:none;transition:transform .2s' + (expanded ? ';transform:rotate(180deg)' : ''),
      toggleMore: () => logic.s({ moreIds: Object.assign({}, st.moreIds, { [id]: !expanded }) }),
      // Logged: read it. Every exercise ticked but not logged yet: log it. Started (clock or ticks): carry on, or
      // start over. Otherwise: start.
      // A day gone by isn't timed now: its session just opens, to tick off or mark done.
      ctaTwoButtons: !logged && !complete && !isFutureDay && (timed || (doneN > 0 && !isPastDay)),
      ctaLabel: logged
        ? 'View Chronicle entry'
        : complete
          ? 'Write about it'
          : isFutureDay
            ? 'Do it today'
            : isPastDay
              ? ride ? 'Open ride' : 'Open workout'
              : ride ? 'Start ride' : 'Start workout',
      cta:
        !logged && !complete && isFutureDay
          ? () => doToday(av)
          : run(logged || complete ? 'goDiary' : isPastDay ? 'goDetail' : 'startWorkout'),
      // With the clock going it carries on; with only ticks, the clock starts from zero and the ticks stay.
      restartLabel: 'Start over',
      continueLabel: timed ? 'Continue' : 'Keep going',
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
    // A workout that's already done or finished, and isn't being timed, doesn't need a "Start" — that's for
    // something you're about to do. But once a clock exists for it, keep showing it, with Finish beside it.
    // Not on a day gone by: a timer started now would time today, not that day.
    showTimer: !isFutureDay && (!!timerState || (!doneSel && !finished && !isPastDay)),
    isFuture: isFutureDay && !!selAct && !doneSel,
    futureNote: 'Planned for ' + DOWFULL[selDate.getDay()] + ', ' + MON3[selDate.getMonth()] + ' ' + selDay + '.',
    doItToday: () => doToday(selAct),
    canFinish: !!timerState && !!selAct,
    openFinish,
    finishOpen: !!fin,
    finishTitle: fin && fin.correcting ? 'Change your time' : fin && fin.ride ? 'Finish your ride' : 'Finish your workout',
    // Correcting a recorded time is a plain edit: Cancel and Save, not "Not yet" and "Finish".
    finishCancelLabel: fin && fin.correcting ? 'Cancel' : 'Not yet',
    finishSaveLabel: fin && fin.correcting ? 'Save' : 'Finish',
    finishIsRide: !!(fin && fin.ride),
    // A lift finished with exercises left unticked is done only because of Finish, so Finish can be undone here (a
    // ride has its own "Ride completed" switch; a lift with everything ticked is undone by unticking).
    canUnfinish: !!(fin && fin.correcting && !fin.ride) && doneCount < selList.length,
    unfinish: () => {
      logic.s({
        finish: null,
        confirm: {
          kind: 'unfinish',
          id: idOf(selAct),
          title: 'Mark this workout not done?',
          body: 'The time you recorded is cleared. The exercises you ticked stay ticked.',
          label: 'Mark not done',
        },
      });
    },
    finishNote: !fin
      ? ''
      : fin.correcting
        ? 'Change what you recorded.'
        : (fin.fromTimer ? 'Filled in from your timer' : fin.ride ? 'Filled in from your plan' : '') +
          (fin.fromTimer || fin.ride ? '. Change anything that went differently.' : '') +
        (!fin.ride && selList.length > doneCount
          ? ' ' + plural(selList.length - doneCount, 'exercise') + (selList.length - doneCount === 1 ? " isn't" : " aren't") + ' ticked off. They’ll stay that way.'
          : ''),
    finishHrs: fin ? fin.hrs : '',
    finishMins: fin ? fin.mins : '',
    finishDist: fin ? fin.dist : '',
    finishElev: fin ? fin.elev : '',
    setFinishHrs: (e) => patchFinish({ hrs: digitsOnly(e.target.value).slice(0, 2) }),
    setFinishMins: (e) => {
      const v = digitsOnly(e.target.value).slice(0, 2);
      patchFinish({ mins: v });
    },
    rollFinishMins: () => {
      const r = fin && rollMinutes(fin.hrs, fin.mins);
      if (r) patchFinish(r);
    },
    setFinishDist: (e) => patchFinish({ dist: numericOnly(e.target.value) }),
    setFinishElev: (e) => patchFinish({ elev: digitsOnly(e.target.value).slice(0, 6) }),
    canSaveFinish: finMinutes > 0 && !logic.busy('finish'),
    // "Not yet": the clock carries on where it was, running if it was running.
    cancelFinish: () => {
      const wasRunning = !!(fin && fin.wasRunning);
      logic.s({ finish: null });
      if (wasRunning && timerState && !timerState.runningSince) resumeTimer();
    },
    // "Took 35 min" on a finished session: tap to correct it.
    editTook: finished ? openFinish : undefined,
    saveFinish,
    // For the browser's Back, which asks the same way.
    timerRunningHere: st.screen === 'detail' && !!timerRunning,
    pausePromptOpen: !!st.pausePrompt,
    keepGoing: () => logic.s({ pausePrompt: null }),
    // Leaving with the clock still going: it keeps counting (it's kept by the wall clock), and the day card shows it.
    leaveRunning: () => {
      const pending = st.pausePrompt;
      logic.s({ pausePrompt: null });
      if (pending && pending.proceed) pending.proceed();
    },
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
    questEyebrow: dayCleared ? 'QUEST CLEARED' : mi === TODAY_M && selDay === TODAY_D ? "TODAY'S QUEST" : 'QUEST',
    questIconWrap:
      'width:40px;height:40px;flex:none;border-radius:13px;display:flex;align-items:center;justify-content:center;' +
      (dayCleared
        ? 'background:var(--gradient-gem)'
        : 'background:var(--color-white);box-shadow:var(--elevation-hairline)'),
    // Cleared: the quest's title is struck through and muted.
    questCleared: dayCleared,
    isDone: doneSel,
    dayIsRide: !!selRide,
    dayIsLift: !selRide,
    // Marking a ride complete is finishing it: it asks what was ridden. Unmarking one asks first, since what was
    // recorded for it goes too, so the ride is back to its plan everywhere.
    toggleRideDone: () => {
      if (!rideDone) return openFinish();
      logic.s({
        confirm: {
          kind: 'unfinish',
          id: idOf(selAct),
          title: 'Mark this ride not done?',
          body: actualMinutes(selAct) > 0 ? 'The distance and time you recorded for it will be cleared.' : 'It goes back to planned.',
          label: 'Mark not done',
        },
      });
    },
    rideDoneLabel: rideDone ? 'Ride completed' : 'Mark ride complete',
    rideDoneType: rideDone ? 'secondary' : 'neutral',
    rideDoneMark:
      'width:24px;height:24px;flex:none;border-radius:var(--radius-full);display:flex;align-items:center;justify-content:center;' +
      (rideDone ? 'background:var(--color-pink)' : 'border:1.5px solid var(--color-outline)'),
    rideDoneStroke: rideDone ? 'var(--color-white)' : 'var(--color-outline)',
    dayIcoSvg: iconSvg(
      (st.icons || {})[listKey] || (srcAct && srcAct.icon) || (selRide ? 'bike' : 'h'),
      (st.iconColors || {})[listKey] || (srcAct && srcAct.iconColor) || colors.pink,
    ),
    rideStats: !selRide || !selAct ? [] : rideStatsFor(selAct, rideDone),
    ctaLabel: hasEntry ? 'View Chronicle entry' : 'Write about it',
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
    longDate: DOWFULL[selDate.getDay()] + ', ' + st.month + ' ' + selDay + (st.yOff ? ', ' + selDate.getFullYear() : ''),
    // Nothing to tick off before the session's day, so no progress card then either.
    hasProgress: st.screen === 'edit' && !isCycleView && selList.length > 0 && !ctx.creating && !ctx.tplMode && !isFutureDay,
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
      '%;height:100%;border-radius:5px;transition:width var(--dur-bar) var(--ease-standard);background:var(--gradient-gem)',
    progNote:
      selList.length === 0
        ? ''
        : finished && doneCount < selList.length
          ? 'Finished · ' + doneCount + ' of ' + selList.length + ' ticked off.'
          : doneCount === 0
          ? 'Mark each exercise as you clear it.'
          : doneCount === selList.length
            ? hasEntry
              ? 'Transformation complete.'
              : 'Transformation complete. Write down how it felt while it\'s fresh.'
            : selList.length - doneCount + ' left to go.',
  };
}
