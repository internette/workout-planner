import { DOW3, MON3, MONTHS } from '../constants';
import { isoOf, tokenFor } from '../helpers';
import { moodSvg } from '../icons';
import { scopeStyle } from '../styles';
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
    nextUp,
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
  } = ctx;
  return {
    saveEntryLabel: st.diaryFrom === 'list' ? 'Save changes' : 'Save entry',
    entryNote: st.entryNote == null ? (ENTRIES[entryKey] || {}).note || '' : st.entryNote,
    setEntryNote: (e) => logic.s({ entryNote: e.target.value }),
    saveEntry: () =>
      logic.save(
        () =>
          db.saveDiary(entryKey, {
            mood: st.mood,
            rpe: st.rpe,
            note:
              (st.entryNote == null ? (ENTRIES[entryKey] || {}).note || '' : st.entryNote) || 'No notes for this one.',
          }),
        {
          screen: st.diaryFrom === 'list' ? 'diary' : 'saved',
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
      MON3[mi] +
      ' ' +
      selDay +
      '. One ' +
      tokenFor(selDay + 2) +
      ' added to your collection.',
    savedCount: Object.keys(ENTRIES).length + ' entries so far',
    savedNextTitle: nextUp ? 'Get ready for ' + nextUp.name : 'Plan your next workout',
    savedNextMeta: nextUp ? nextUp.meta2 : 'Nothing scheduled ahead',
    goNextUp: () => logic.s({ screen: 'edit', editing: !!nextUp, seg: 'Day' }),
    loggedCount: Object.keys(ENTRIES).length,
    diaryCount: Object.keys(ENTRIES).length + ' entries',
    openNewEntry: () => logic.nav({ screen: 'newEntry' }),
    closeNewEntry: () => logic.back(),
    noUnlogged: unloggedDays.length === 0,
    unlogged: unloggedDays.map((x) => ({
      rowStyle:
        'display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:16px 22px;border:none;border-radius:999px;text-align:left;width:100%;background:#fff;box-shadow:0 4px 14px rgba(35,42,69,.07);cursor:pointer',
      day: DOW3[new Date(Y, TODAY_M, x.d).getDay()] + ' ' + x.d,
      name: nameOf(x.av.name),
      meta: x.av.ride ? (x.av.ride.dist ? x.av.ride.dist + ' mi' : x.av.time) : x.av.time,
      pick: () =>
        logic.nav({
          screen: 'diary',
          month: MONTHS[TODAY_M],
          day: x.d,
          mood: 'Happy',
          rpe: 3,
          entryNote: null,
          diaryFrom: 'list',
          diaryEdit: true,
        }),
    })),
    diaryAll: () => logic.s({ diaryScope: 'all', rFrom: '', rTo: '' }),
    diaryToday: () => logic.s({ diaryScope: 'today', rFrom: isoToday, rTo: isoToday }),
    diaryWeek: () =>
      logic.s({
        diaryScope: 'week',
        rFrom: isoOf(todayWkStart),
        rTo: isoOf(new Date(Y, TODAY_M, todayWkStart.getDate() + 6)),
      }),
    diaryMonth: () => logic.s({ diaryScope: 'month', rFrom: iso30, rTo: isoToday }),
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
    diaryAllStyle: scopeStyle(dScope === 'all'),
    diaryTodayStyle: scopeStyle(dScope === 'today'),
    diaryWeekStyle: scopeStyle(dScope === 'week'),
    diaryMonthStyle: scopeStyle(dScope === 'month'),
    dScopeAll: dScope === 'all',
    dScopeToday: dScope === 'today',
    dScopeWeek: dScope === 'week',
    dScope30: dScope === 'month',
    dScopeRange: dScope === 'range',
    diaryRange: () => logic.s({ diaryScope: 'range', rFrom: st.rFrom || iso30, rTo: st.rTo || isoToday }),
    diaryRangeStyle: scopeStyle(dScope === 'range'),
    rangeShown: dScope === 'range',
    diaryEmpty: diaryDays.length === 0,
    diaryEmptyNote:
      dScope === 'today'
        ? 'Nothing written down today yet.'
        : dScope === 'week'
          ? 'Nothing logged this week yet.'
          : dScope === 'month'
            ? 'Nothing logged in the last 30 days.'
            : dScope === 'range'
              ? 'Nothing written down in that stretch.'
              : 'The chronicle is still blank.',
    diaryList: diaryDays.map((id) => {
      const en = ENTRIES[id];
      const d = en.d;
      const dt = new Date(Y, en.m, en.d);
      const bg =
        en.mood === 'Happy' ? '#E1699C' : en.mood === 'Neutral' ? '#5C6684' : en.mood === 'Sad' ? '#7C8FC9' : '#B23A4C';
      return {
        date: DOW3[dt.getDay()] + ', ' + MON3[en.m].toUpperCase() + ' ' + en.d,
        name: en.workout || (seedAt(en.m, en.d) || {}).name || 'Workout',
        note: en.note,
        href: '#',
        aria:
          DOW3[dt.getDay()] +
          ', ' +
          MON3[en.m] +
          ' ' +
          en.d +
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
            month: MONTHS[en.m],
            day: en.d,
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
              body: 'Your reflection for ' + MON3[en.m] + ' ' + en.d + ' will be gone for good.',
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
          (i) => 'font-size:13px;line-height:1;color:' + (i <= en.rpe ? '#232A45' : '#C7C4D0'),
        ),
      };
    }),
    diaryReading: st.diaryFrom === 'list' && !st.diaryEdit,
    diaryEditing: !(st.diaryFrom === 'list' && !st.diaryEdit),
    editEntry: () => logic.s({ diaryEdit: true }),
    deleteEntry: () =>
      logic.s({
        confirm: {
          kind: 'entry',
          day: entryKey,
          after: 'diaryList',
          title: 'Delete this entry?',
          body: 'Your reflection for ' + MON3[mi] + ' ' + selDay + ' will be gone for good.',
          label: 'Delete entry',
        },
      }),
    readMood: st.mood,
    readNote: (ENTRIES[entryKey] || {}).note || 'No notes for this one.',
    readStars: [1, 2, 3, 4, 5].map(
      (n) => 'font-size:13px;line-height:1;color:' + (n <= st.rpe ? '#232A45' : '#C7C4D0'),
    ),
    readMoodFace:
      'width:44px;height:44px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;background:' +
      (st.mood === 'Happy' ? '#E1699C' : st.mood === 'Neutral' ? '#5C6684' : st.mood === 'Sad' ? '#7C8FC9' : '#B23A4C'),
    readMoodSvg: moodSvg(st.mood),
    diaryBackLabel: st.diaryFrom === 'list' ? 'Chronicle' : 'Back',
    diaryEyebrow: st.diaryFrom === 'list' ? 'CHRONICLE ENTRY' : 'COMPLETED',
    diaryBack: () => logic.back(),
    moods,
    stars,
    rpeLabel: RPE_WORDS[Math.max(1, Math.min(5, st.rpe)) - 1],
  };
}
