import { MONTHS } from '../constants';
import { idOf, isoOf } from '../helpers';
import { mLabel, mTab, tab } from '../styles';
import * as db from '@/lib/plannerData';
import type { Ctx } from '../types';

// Shell: sidebar, tab bar, screen flags, navigation shortcuts, confirm dialog and error banner.
export function chromeVals(ctx: Ctx) {
  const { logic, narrow, tablet, onCal, st, navExtra, calActive, Y, srcAct, mi, selDay, creating, TODAY_M, TODAY_D } =
    ctx;
  return {
    topTabsStyle: narrow ? 'display:none' : 'display:flex;flex-wrap:wrap;gap:6px;padding:18px 28px 0',
    sidebarStyle: narrow
      ? 'display:none'
      : tablet
        ? 'flex:1 1 100%;width:100%;position:relative;background:#fff;border-radius:18px;padding:8px;box-shadow:0 4px 14px rgba(35,42,69,.07)'
        : 'flex:0 1 208px;min-width:180px;position:relative;background:#fff;border-radius:22px;padding:18px 14px;box-shadow:0 4px 14px rgba(35,42,69,.07)',
    navListStyle: tablet ? 'display:flex;flex-direction:row;gap:4px' : 'display:flex;flex-direction:column;gap:4px',
    pageStyle: 'min-height:100vh;padding:0 0 ' + (narrow ? '108px' : '64px'),
    tabbarStyle: narrow
      ? 'position:fixed;left:0;right:0;bottom:0;z-index:50;display:flex;align-items:center;gap:4px;padding:8px 12px calc(8px + env(safe-area-inset-bottom));background:rgba(255,255,255,.94);backdrop-filter:blur(14px);border-top:1px solid rgba(35,42,69,.07);box-shadow:0 -4px 14px rgba(35,42,69,.07)'
      : 'display:none',
    mTabCal: mTab(onCal),
    mTabDiary: mTab(st.screen === 'diaryList'),
    mTabSummary: mTab(st.screen === 'summary'),
    mCalColor: onCal ? '#c4548a' : '#746E88',
    mDiaryColor: st.screen === 'diaryList' ? '#c4548a' : '#746E88',
    mSummaryColor: st.screen === 'summary' ? '#c4548a' : '#746E88',
    mTabProfile: mTab(st.screen === 'profile'),
    mProfileColor: st.screen === 'profile' ? '#c4548a' : '#746E88',
    mProfileLabel: mLabel(st.screen === 'profile'),
    mCalLabel: mLabel(onCal),
    mDiaryLabel: mLabel(st.screen === 'diaryList'),
    mSummaryLabel: mLabel(st.screen === 'summary'),
    isDiaryList: st.screen === 'diaryList',
    isProfile: st.screen === 'profile',
    goProfile: () => logic.nav({ screen: 'profile', monthOpen: false }),
    tabProfile: tab(st.screen === 'profile'),
    navProfile:
      'display:flex;align-items:center;gap:11px;padding:11px 13px;border:none;border-radius:14px;font-size:13.5px;text-align:left;cursor:pointer;' +
      (st.screen === 'profile'
        ? 'background:#FCE8F1;color:#c4548a;font-weight:600'
        : 'background:none;color:#746E88;font-weight:500') +
      navExtra,
    navProfileInk: st.screen === 'profile' ? '#E1699C' : '#A9A2B4',
    isSummary: st.screen === 'summary',
    isSaved: st.screen === 'saved',
    goSummary: () => logic.nav({ screen: 'summary', monthOpen: false }),
    tabSummary: tab(st.screen === 'summary'),
    goDiaryList: () => logic.nav({ screen: 'diaryList', monthOpen: false }),
    isNewEntry: st.screen === 'newEntry',
    navCal:
      'display:flex;align-items:center;gap:11px;padding:11px 13px;border:none;border-radius:14px;font-size:13.5px;text-align:left;cursor:pointer;' +
      (calActive
        ? 'background:#FCE8F1;color:#c4548a;font-weight:600'
        : 'background:none;color:#746E88;font-weight:500') +
      navExtra,
    navDiary:
      'display:flex;align-items:center;gap:11px;padding:11px 13px;border:none;border-radius:14px;font-size:13.5px;text-align:left;cursor:pointer;' +
      (st.screen === 'diaryList'
        ? 'background:#FCE8F1;color:#c4548a;font-weight:600'
        : 'background:none;color:#746E88;font-weight:500') +
      navExtra,
    navCalInk: calActive ? '#E1699C' : '#A9A2B4',
    navDiaryInk: st.screen === 'diaryList' ? '#E1699C' : '#A9A2B4',
    navSummary:
      'display:flex;align-items:center;gap:11px;padding:11px 13px;border:none;border-radius:14px;font-size:13.5px;text-align:left;cursor:pointer;' +
      (st.screen === 'summary'
        ? 'background:#FCE8F1;color:#c4548a;font-weight:600'
        : 'background:none;color:#746E88;font-weight:500') +
      navExtra,
    navSummaryInk: st.screen === 'summary' ? '#E1699C' : '#A9A2B4',
    announce: st.announce || '',
    saveError: st.saveError || '',
    dismissError: () => logic.s({ saveError: null }),
    yearLabel: String(Y),
    confirmOpen: !!st.confirm,
    confirmTitle: (st.confirm || {}).title,
    confirmBody: (st.confirm || {}).body,
    confirmLabel: (st.confirm || {}).label,
    confirmCancel: () => logic.s({ confirm: null }),
    confirmRun: () => {
      const c = st.confirm || {};
      logic.s({ confirm: null });
      if (c.kind === 'workout')
        logic.save(() => db.deletePlanEntries([idOf(srcAct)]), { screen: 'day', creating: false });
      if (c.kind === 'entry') logic.save(() => db.deleteDiary(c.day), { screen: c.after || st.screen });
      if (c.kind === 'series') logic.save(() => db.endSeries(c.sid, isoOf(new Date(Y, mi, selDay))));
    },
    isArsenal: st.screen === 'arsenal',
    canGoBack: (st.hist || []).length > 0,
    goBack: () => logic.back(),
    goArsenal: () => logic.nav({ screen: 'arsenal', monthOpen: false }),
    navArsenal:
      'display:flex;align-items:center;gap:11px;padding:11px 13px;border:none;border-radius:14px;font-size:13.5px;text-align:left;cursor:pointer;' +
      (st.screen === 'arsenal'
        ? 'background:#FCE8F1;color:#c4548a;font-weight:600'
        : 'background:none;color:#746E88;font-weight:500') +
      navExtra,
    navArsenalInk: st.screen === 'arsenal' ? '#E1699C' : '#A9A2B4',
    isCal: st.screen === 'day' || st.screen === 'rest',
    isEdit: st.screen === 'edit' && !(creating && !st.newType),
    isDiary: st.screen === 'diary',
    goDay: () =>
      logic.s({ screen: 'day', month: MONTHS[TODAY_M], day: TODAY_D, monthOpen: false, seg: 'Day', creating: false }),
    isDetail: st.screen === 'detail',
    goRest: () => logic.s({ screen: 'rest', month: MONTHS[TODAY_M], day: TODAY_D, monthOpen: false, seg: 'Day' }),
    tabDay: tab(st.screen === 'day'),
    tabEdit: tab(st.screen === 'edit'),
    tabDiary: tab(st.screen === 'diary'),
    tabRest: tab(st.screen === 'rest'),
    navCalOn: calActive ? 'page' : false,
    navDiaryOn: st.screen === 'diaryList' ? 'page' : false,
    navArsenalOn: st.screen === 'arsenal' ? 'page' : false,
    navSummaryOn: st.screen === 'summary' ? 'page' : false,
    navProfileOn: st.screen === 'profile' ? 'page' : false,
  };
}
