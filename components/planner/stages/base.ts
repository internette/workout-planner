import { PINK } from '../constants';
import type { Ctx } from '../types';

// Clock, layout breakpoints and the selected screen: the values every other stage builds on.
export function baseStage(ctx: Ctx): Ctx {
  const { logic } = ctx;
  const st = logic.state;
  const { EX, EXV, SEED, DIARY } = logic.model;
  const nowDate = new Date();
  const Y = nowDate.getFullYear();
  const TODAY_M = nowDate.getMonth();
  const TODAY_D = nowDate.getDate();
  const TK = TODAY_M * 100 + TODAY_D;
  // A date's month in the planner's count (see monthPatch): 12 for next January, -1 for last December.
  const relM = (d) => (d.getFullYear() - Y) * 12 + d.getMonth();
  // A day can hold several workouts. entriesAt lists them all; seedAt is the one on screen for that day: the
  // selected session (st.entryId) when it is on that day, otherwise the day's first.
  const entriesAt = (m, d) => (SEED[m] || {})[d] || [];
  const seedAt = (m, d) => {
    const list = entriesAt(m, d);
    return list.find((e) => e.id === st.entryId) || list[0] || null;
  };
  const ACT = SEED[TODAY_M] || {};
  const narrow = logic.viewport === 'narrow';
  const tablet = logic.viewport === 'tablet';
  const navExtra = (tablet ? ';flex:none;padding:11px 16px' : '') + ';text-decoration:none';
  // Creating a workout from the Spellbook is the Spellbook's flow, so the Calendar tab is not lit for it.
  const fromArsenal = st.screen === 'edit' && ((!!st.creating && st.newFrom === 'arsenal') || !!st.editTemplate);
  // Writing in the Chronicle is the Chronicle's flow: its list, "New entry", and an entry opened from the list. An
  // entry opened from a workout on the calendar stays with the calendar. One rule for the sidebar and the tab bar.
  const inChronicle =
    st.screen === 'diaryList' ||
    st.screen === 'newEntry' ||
    ((st.screen === 'diary' || st.screen === 'saved') && st.diaryFrom === 'list');
  const calActive =
    ['day', 'rest', 'edit', 'detail', 'diary', 'saved'].indexOf(st.screen) > -1 && !fromArsenal && !inChronicle;
  const onCal = calActive;
  const creating = st.screen === 'edit' && !!st.creating;
  return {
    st,
    EX,
    EXV,
    DIARY,
    nowDate,
    Y,
    TODAY_M,
    TODAY_D,
    seedAt,
    entriesAt,
    TK,
    relM,
    ACT,
    creating,
    narrow,
    tablet,
    onCal,
    navExtra,
    calActive,
    inChronicle,
  };
}
