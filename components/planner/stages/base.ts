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
  // Creating a workout from the Arsenal is the Arsenal's flow, so the Calendar tab is not lit for it.
  const fromArsenal = st.screen === 'edit' && !!st.creating && st.newFrom === 'arsenal';
  const onCal =
    (st.screen === 'day' || st.screen === 'rest' || st.screen === 'diary' || st.screen === 'edit') && !fromArsenal;
  const calActive = ['day', 'rest', 'edit', 'detail', 'newEntry'].indexOf(st.screen) > -1 && !fromArsenal;
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
    ACT,
    creating,
    narrow,
    tablet,
    onCal,
    navExtra,
    calActive,
  };
}
