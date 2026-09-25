import { DOW3, MON3 } from '../constants';
import { isoOf, mod12, monthPatch, plural } from '../helpers';
import { moodSvg } from '../icons';
import * as db from '@/lib/plannerData';
import type { Ctx } from '../types';

// Diary: writing and reading an entry, the "saved" screen and the chronicle list with its filters.
export function diaryVals(ctx: Ctx) {
  const {
    logic,
    st,
    ENTRIES,
    entryKey,
    selName,
    mi,
    selDay,
    TK,
    isDoneEntry,
    unloggedDays,
    Y,
    TODAY_M,
    nameOf,
    isoToday,
    todayWkStart,
    iso30,
    dScope,
    diaryDays,
    seedAt,
    moods,
    stars,
    RPE_WORDS,
    relM,
  } = ctx;
  // Whether the session on screen already has an entry: then the diary screen reads it, and edits it on request.
  const hasEntry = !!ENTRIES[entryKey];
  const reading = hasEntry && !st.diaryEdit;
  // The session this entry is about, and whether it's done: an entry for one that isn't can mark it done too.
  const entrySession = logic.model.entries.find((x) => x.av.id === entryKey) || null;
  const offerMarkDone = !!entrySession && !isDoneEntry(entrySession.av) && entrySession.m * 100 + entrySession.d <= TK;
  const markDone = offerMarkDone && !!st.entryMarkDone;
  const markSessionDone = () => {
    if (!markDone || !entrySession) return Promise.resolve();
    const av = entrySession.av;
    return av.ride
      ? db.setRideDone(av.id, true)
      : db.setExercisesDone(av.id, (ctx.EXV[av.exKey] || []).map((e) => e.name), true);
  };
  // Writing or changing an entry, with changes not yet saved: leaving asks first.
  const saved = ENTRIES[entryKey];
  const writing = st.screen === 'diary' && !reading;
  const entryDirty =
    writing &&
    (saved
      ? st.mood !== saved.mood || st.rpe !== saved.rpe || (st.entryNote != null && st.entryNote !== (saved.note || ''))
      : !!st.mood || !!st.rpe || !!(st.entryNote || '').trim());
  // Back from changing an entry returns to reading it, as it was; from a new one, to wherever it was started.
  const stopWriting = () =>
    saved ? logic.s({ diaryEdit: false, mood: saved.mood, rpe: saved.rpe, entryNote: null }) : logic.back();
  const leaveEntry = () =>
    entryDirty
      ? logic.s({
          confirm: {
            kind: 'leaveEntry',
            title: 'Discard your changes?',
            body: saved
              ? 'You’ve changed this entry. Leaving now throws those changes away.'
              : 'This entry isn’t saved yet. Leaving now throws it away.',
            label: 'Discard changes',
            then: stopWriting,
          },
        })
      : writing
        ? stopWriting()
        : logic.back();
  // "Up next" after logging: the first session from today on that isn't done yet, other than the one just logged.
  const nextEntry = logic.model.entries.find(
    (x) => x.m * 100 + x.d >= TK && x.av.id !== entryKey && x.av.s !== 'c' && !isDoneEntry(x.av),
  );
  const nextDate = nextEntry ? new Date(Y, nextEntry.m, nextEntry.d) : null;
  const scopeHandlers = {
    all: () => logic.s({ diaryScope: 'all', rFrom: '', rTo: '' }),
    today: () => logic.s({ diaryScope: 'today', rFrom: isoToday, rTo: isoToday }),
    week: () =>
      logic.s({
        diaryScope: 'week',
        rFrom: isoOf(todayWkStart),
        rTo: isoOf(new Date(Y, TODAY_M, todayWkStart.getDate() + 6)),
      }),
    month: () => logic.s({ diaryScope: 'month', rFrom: iso30, rTo: isoToday }),
    range: () => logic.s({ diaryScope: 'range', rFrom: st.rFrom || iso30, rTo: st.rTo || isoToday }),
  };
  const entryHint = !st.mood && !st.rpe ? 'Pick a mood and how hard it felt.' : !st.mood ? 'Pick a mood.' : !st.rpe ? 'Pick how hard it felt.' : '';
  return {
    saveEntryLabel: hasEntry ? 'Save changes' : 'Save entry',
    showMarkDone: offerMarkDone && !reading,
    markDoneOn: markDone,
    setMarkDone: (on) => logic.s({ entryMarkDone: !!on }),
    // A lift with some exercises already ticked says so: marking it done ticks the rest.
    markDoneLabel:
      entrySession && entrySession.av.ride
        ? 'Mark this ride done'
        : entrySession && ctx.doneCountAt(entrySession.av) > 0
          ? 'Mark all ' + plural((ctx.EXV[entrySession.av.exKey] || []).length, 'exercise') + ' done (' +
            ctx.doneCountAt(entrySession.av) + ' ticked so far)'
          : 'Mark this workout done',
    canSaveEntry: !!st.mood && !!st.rpe,
    saveEntryHint: entryHint,
    entryNote: st.entryNote == null ? (ENTRIES[entryKey] || {}).note || '' : st.entryNote,
    setEntryNote: (e) => logic.s({ entryNote: e.target.value }),
    // Stays focusable while it waits for a mood and effort; pressing it then says what's missing.
    saveEntry: () =>
      !st.mood || !st.rpe
        ? logic.s({ announce: entryHint })
        : logic.saveOnce(
            'entry',
            () =>
              db
                .saveDiary(entryKey, {
                  mood: st.mood,
                  rpe: st.rpe,
                  note: st.entryNote == null ? (ENTRIES[entryKey] || {}).note || '' : st.entryNote,
                })
                .then(markSessionDone),
            {
              // Changing an entry, or writing one from the Chronicle, returns to reading it; a new one from a workout
              // gets the "Entry saved" screen.
              screen: hasEntry || st.diaryFrom === 'list' ? 'diary' : 'saved',
              diaryEdit: false,
              entryNote: null,
              entryMarkDone: null,
            },
          ),
    savedLine:
      st.mood +
      ' · ' +
      st.rpe +
      '/5 effort on ' +
      selName +
      ', ' +
      MON3[mod12(mi)] +
      ' ' +
      selDay +
      '.',
    savedCount: plural(Object.keys(ENTRIES).length, 'entry', 'entries') + ' so far',
    savedNextTitle: nextEntry ? 'Get ready for ' + nameOf(nextEntry.av.name) : 'Plan your next workout',
    savedNextMeta: nextEntry
      ? (nextEntry.m * 100 + nextEntry.d === TK
          ? 'Today'
          : DOW3[nextDate.getDay()].charAt(0) + DOW3[nextDate.getDay()].slice(1, 3).toLowerCase() + ', ' +
            MON3[mod12(nextEntry.m)] + ' ' + nextEntry.d) +
        ' · ' +
        nextEntry.av.time
      : 'Nothing scheduled ahead',
    // Opens that session. With nothing ahead, starts a new workout for tomorrow (today, on the year's last day).
    goNextUp: () => {
      if (nextEntry)
        return logic.nav({
          screen: 'detail',
          creating: false,
          seg: 'Day',
          ...monthPatch(nextEntry.m),
          day: nextEntry.d,
          entryId: nextEntry.av.id,
        });
      const tomorrow = new Date(Y, TODAY_M, ctx.TODAY_D + 1);
      logic.s({ ...monthPatch(relM(tomorrow)), day: tomorrow.getDate(), seg: 'Day' });
      logic.renderVals().goNewWorkout();
    },
    loggedCount: Object.keys(ENTRIES).length,
    loggedUnit: Object.keys(ENTRIES).length === 1 ? 'entry' : 'entries',
    // With a filter on, how many of them are showing.
    diaryCount:
      (dScope !== 'all' ? diaryDays.length + ' of ' : '') + plural(Object.keys(ENTRIES).length, 'entry', 'entries'),
    openNewEntry: () => logic.nav({ screen: 'newEntry' }),
    closeNewEntry: () => logic.back(),
    noUnlogged: unloggedDays.length === 0,
    // Nothing to list: either nothing was planned yet, or every recent session already has an entry.
    noUnloggedNote: logic.model.entries.some((x) => x.m * 100 + x.d <= TK)
      ? 'Every session from the last 60 days already has an entry.'
      : 'No sessions to write about yet. Plan one, and once its day comes it shows up here.',
    unlogged: unloggedDays.map((x) => ({
      rowStyle:
        'display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:16px 22px;border:none;border-radius:999px;text-align:left;width:100%;background:var(--color-white);box-shadow:0 4px 14px rgba(35,42,69,.07);cursor:pointer',
      // This month's by weekday and date; earlier ones name their month too.
      day:
        DOW3[new Date(Y, x.m, x.d).getDay()] +
        (x.m === TODAY_M ? ' ' + x.d : ', ' + MON3[mod12(x.m)].toUpperCase() + ' ' + x.d + (Math.floor(x.m / 12) ? ' ' + (Y + Math.floor(x.m / 12)) : '')),
      name: nameOf(x.av.name),
      meta: x.av.ride ? (ctx.distOf(x.av) ? ctx.distOf(x.av) + ' mi · ' : '') + ctx.timeOf(x.av) : ctx.timeOf(x.av),
      // Whether it was done, so writing about a missed one is a choice, not a surprise.
      status: x.done ? 'Done' : x.m * 100 + x.d < TK ? 'Missed' : 'Not done yet',
      statusStyle:
        'flex:none;padding:4px 10px;border-radius:999px;font-size:var(--text-sm);font-weight:var(--font-weight-semibold);' +
        (x.done ? 'background:var(--color-pink-tint);color:var(--color-pink-deep)' : 'background:var(--color-mist);color:var(--color-slate-deep)'),
      pick: () =>
        logic.nav({
          screen: 'diary',
          ...monthPatch(x.m),
          day: x.d,
          entryId: x.av.id,
          // Nothing picked yet: the entry says how it felt only once the person has said so.
          mood: null,
          rpe: null,
          entryNote: null,
          diaryFrom: 'list',
          diaryEdit: true,
          // Writing about a session not marked done: most likely it was done, so offer to mark it (on to start). Not
          // for one partly done: some exercises were skipped, and that's kept unless asked.
          entryMarkDone: !x.done && !(!x.av.ride && ctx.doneCountAt(x.av) > 0),
        }),
    })),
    showRange: dScope === 'range',
    rangeFrom: st.rFrom || '',
    rangeTo: st.rTo || '',
    setRangeFrom: (e) => {
      const v = e.target.value;
      logic.s({ rFrom: v, diaryScope: 'range', rTo: st.rTo && v && st.rTo < v ? v : st.rTo });
    },
    setRangeTo: (e) => {
      const v = e.target.value;
      logic.s({ rTo: st.rFrom && v && v < st.rFrom ? st.rFrom : v, diaryScope: 'range' });
    },
    rangeMin: st.rFrom || '',
    clearRange: () => logic.s({ rFrom: '', rTo: '' }),
    diaryScope: dScope,
    setDiaryScope: (scope) => scopeHandlers[scope](),
    rangeShown: dScope === 'range',
    diaryEmpty: diaryDays.length === 0,
    diaryEmptyNote:
      dScope === 'today'
        ? 'Nothing written down today yet.'
        : dScope === 'week'
          ? 'Nothing written this week yet.'
          : dScope === 'month'
            ? 'Nothing written in the last 30 days.'
            : dScope === 'range'
              ? 'Nothing written down in that stretch.'
              : 'The chronicle is still blank.',
    // Read out when the Chronicle's filter changes how many entries are listed.
    diaryResults: plural(diaryDays.length, 'entry', 'entries') + ' shown.',
    diaryList: diaryDays.map((id) => {
      const en = ENTRIES[id];
      const d = en.d;
      const dt = new Date(Y, en.m, en.d);
      // An entry from another year says which.
      const yr = dt.getFullYear() !== Y ? ' ' + dt.getFullYear() : '';
      const bg =
        en.mood === 'Happy'
          ? 'var(--color-pink)'
          : en.mood === 'Neutral'
            ? 'var(--color-slate)'
            : en.mood === 'Sad'
              ? 'var(--color-periwinkle)'
              : 'var(--color-danger)';
      return {
        date: DOW3[dt.getDay()] + ', ' + MON3[mod12(en.m)].toUpperCase() + ' ' + en.d + yr,
        name: en.workout || (seedAt(en.m, en.d) || {}).name || 'Workout',
        deleteLabel:
          'Delete entry for ' + (en.workout || (seedAt(en.m, en.d) || {}).name || 'Workout') + ', ' + MON3[mod12(en.m)] + ' ' + en.d + yr,
        note: en.note,
        href: '#',
        aria:
          DOW3[dt.getDay()] +
          ', ' +
          MON3[mod12(en.m)] +
          ' ' +
          en.d +
          yr +
          ': ' +
          (en.workout || (seedAt(en.m, en.d) || {}).name || 'Workout') +
          ', ' +
          en.mood +
          ', effort ' +
          en.rpe +
          ' of 5',
        open: () =>
          logic.nav({
            screen: 'diary',
            ...monthPatch(en.m),
            day: en.d,
            entryId: id,
            mood: en.mood,
            rpe: en.rpe,
            entryNote: null,
            diaryFrom: 'list',
            diaryEdit: false,
          }),
        remove: (ev) => {
          if (ev && ev.stopPropagation) ev.stopPropagation();
          logic.s({
            confirm: {
              kind: 'entry',
              day: id,
              title: 'Delete this entry?',
              body: 'Your reflection for ' + MON3[mod12(en.m)] + ' ' + en.d + ' will be gone for good.',
              label: 'Delete entry',
            },
          });
        },
        faceWrap:
          'width:48px;height:48px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;background:' +
          bg,
        isHappy: en.mood === 'Happy',
        isNeutral: en.mood === 'Neutral',
        isSad: en.mood === 'Sad',
        isMad: en.mood === 'Mad',
        rpe: en.rpe || 0,
        stars: [1, 2, 3, 4, 5].map(
          (i) =>
            'font-size:var(--text-md);line-height:var(--leading-none);color:' +
            (i <= en.rpe ? 'var(--color-ink)' : 'var(--color-outline)'),
        ),
      };
    }),
    diaryReading: reading,
    diaryEditing: !reading,
    editEntry: () => logic.s({ diaryEdit: true }),
    deleteEntry: () =>
      logic.s({
        confirm: {
          kind: 'entry',
          day: entryKey,
          after: 'diaryList',
          title: 'Delete this entry?',
          body: 'Your reflection for ' + MON3[mod12(mi)] + ' ' + selDay + ' will be gone for good.',
          label: 'Delete entry',
        },
      }),
    readMood: st.mood,
    readNote: (ENTRIES[entryKey] || {}).note || 'No notes for this one.',
    readRpe: st.rpe || 0,
    readStars: [1, 2, 3, 4, 5].map(
      (n) =>
        'font-size:var(--text-md);line-height:var(--leading-none);color:' +
        (n <= st.rpe ? 'var(--color-ink)' : 'var(--color-outline)'),
    ),
    readMoodFace:
      'width:44px;height:44px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;background:' +
      (st.mood === 'Happy'
        ? 'var(--color-pink)'
        : st.mood === 'Neutral'
          ? 'var(--color-slate)'
          : st.mood === 'Sad'
            ? 'var(--color-periwinkle)'
            : 'var(--color-danger)'),
    readMoodSvg: moodSvg(st.mood),
    // Entry saved: to the calendar, on the day of the workout just written about (not back one screen).
    backToCalendar: () => logic.s({ screen: 'day', seg: 'Day', monthOpen: false, hist: [] }),
    // Changing a saved entry, Back returns to reading it; otherwise it goes where the screen was opened from.
    diaryBackLabel: writing && saved ? 'Entry' : '',
    diaryEyebrow: st.diaryFrom === 'list' || reading ? 'CHRONICLE ENTRY' : 'COMPLETED',
    diaryBack: leaveEntry,
    entryDirty,
    leaveEntry,
    moods,
    stars,
    rpeLabel: st.rpe ? RPE_WORDS[Math.max(1, Math.min(5, st.rpe)) - 1] : '',
  };
}
