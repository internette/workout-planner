import { PINK } from '../constants';
import type { Ctx } from '../types';

// Clock, layout breakpoints and the selected screen: the values every other stage builds on.
export function baseStage(ctx: Ctx): Ctx {
  const { logic } = ctx;
  const st = logic.state;
  const { EX, SEED, DIARY } = logic.model;
  const nowDate = new Date();
  const Y = nowDate.getFullYear();
  const TODAY_M = nowDate.getMonth();
  const TODAY_D = nowDate.getDate();
  const TK = TODAY_M * 100 + TODAY_D;
  const seedAt = (m, d) => (SEED[m] || {})[d] || null;
  const ACT = SEED[TODAY_M] || {};
  const narrow = typeof window !== 'undefined' && window.innerWidth < 720;
  const tablet = typeof window !== 'undefined' && window.innerWidth >= 720 && window.innerWidth < 1020;
  const navExtra = tablet ? ';flex:none;padding:11px 16px' : '';
  const onCal = st.screen === 'day' || st.screen === 'rest' || st.screen === 'diary' || st.screen === 'edit';
  const calActive = ['day', 'rest', 'edit', 'detail', 'newEntry'].indexOf(st.screen) > -1;
  const seg = (on) =>
    'flex:1;min-width:0;padding:12px' +
    (narrow ? '' : ' 20px') +
    ';border:none;border-radius:12px;font-size:var(--text-base);font-weight:var(--font-weight-semibold);cursor:pointer;' +
    (on ? 'background:' + PINK + ';color:var(--color-white)' : 'background:none;color:var(--color-muted)');
  const creating = st.screen === 'edit' && !!st.creating;
  return {
    st,
    EX,
    DIARY,
    nowDate,
    Y,
    TODAY_M,
    TODAY_D,
    seedAt,
    TK,
    ACT,
    creating,
    narrow,
    tablet,
    onCal,
    navExtra,
    calActive,
    seg,
  };
}
