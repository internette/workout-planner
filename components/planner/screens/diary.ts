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
  return {
    saveEntryLabel: hasEntry ? 'Save changes' : 'Save entry',
    entryNote: st.entryNote == null ? (ENTRIES[entryKey] || {}).note || '' : st.entryNote,
    setEntryNote: (e) => logic.s({ entryNote: e.target.value }),
    saveEntry: () =>
      logic.save(
        () =>
          db.saveDiary(entryKey, {
            mood: st.mood,
            rpe: st.rpe,
            note: st.entryNote == null ? (ENTRIES[entryKey] || {}).note || '' : st.entryNote,
          }),
        {
          // Changing an entry, or writing one from the Chronicle, returns to reading it; a new one from a workout
          // gets the "Entry saved" screen.
          screen: hasEntry || st.diaryFrom === 'list' ? 'diary' : 'saved',
          diaryEdit: false,
          entryNote: null,
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
    diaryCount: plural(Object.keys(ENTRIES).length, 'entry', 'entries'),
    openNewEntry: () => logic.nav({ screen: 'newEntry' }),
    closeNewEntry: () => logic.back(),
    noUnlogged: unloggedDays.length === 0,
    // Nothing to list: either nothing was planned this month so far, or everything planned already has an entry.
    noUnloggedNote: ctx.monthDays.some((x) => x.d <= ctx.TODAY_D)
      ? 'Every session this month so far already has an entry.'
      : 'No sessions this month to write about yet. Plan one, and once its day comes it shows up here.',
    unlogged: unloggedDays.map((x) => ({
      rowStyle:
        'display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:16px 22px;border:none;border-radius:999px;text-align:left;width:100%;background:var(--color-white);box-shadow:0 4px 14px rgba(35,42,69,.07);cursor:pointer',
      day: DOW3[new Date(Y, TODAY_M, x.d).getDay()] + ' ' + x.d,
      name: nameOf(x.av.name),
      meta: x.av.ride ? (x.av.ride.dist ? x.av.ride.dist + ' mi' : x.av.time) : x.av.time,
      pick: () =>
        logic.nav({
          screen: 'diary',
          ...monthPatch(TODAY_M),
          day: x.d,
          entryId: x.av.id,
          mood: 'Happy',
          rpe: 3,
          entryNote: null,
          diaryFrom: 'list',
          diaryEdit: true,
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
        stars: [1, 2, 3, 4, 5].map(
          (i) =>
            'font-size:var(--text-md);line-height:var(--leading-none);color:' +
            (i <= en.rpe ? 'var(--color-ink)' : 'var(--color-hairline)'),
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
    readStars: [1, 2, 3, 4, 5].map(
      (n) =>
        'font-size:var(--text-md);line-height:var(--leading-none);color:' +
        (n <= st.rpe ? 'var(--color-ink)' : 'var(--color-hairline)'),
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
    diaryBackLabel: st.diaryFrom === 'list' ? 'Chronicle' : 'Back',
    diaryEyebrow: st.diaryFrom === 'list' || reading ? 'CHRONICLE ENTRY' : 'COMPLETED',
    diaryBack: () => logic.back(),
    moods,
    stars,
    rpeLabel: RPE_WORDS[Math.max(1, Math.min(5, st.rpe)) - 1],
  };
}
