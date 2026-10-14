// Programs on the Profile: the one running (or the last one run), the list of every program run, and each run's page,
// with the program as it was when it ran. From there it can be shared, or added to the person's programs again.
import { DOW3, DOWFULL, MON3 } from '@/frontend/shared/constants';
import { exLine, isoOf, minText, noticePatch, plural } from '@/frontend/shared/helpers';
import { iconSvg } from '@/frontend/shared/icons';
import { runPlace, runWeeks } from '@/frontend/shared/programs';
import { blockWorkouts, daysOf, programWeeks, trainingDays, type SharedProgram } from '@/frontend/shared/sharedProgram';
import { displayName } from '@/shared/auth';
import * as db from '@/frontend/data/plannerData';
import type { Program, ProgramRun } from '@/frontend/data/plannerData';
import type { Ctx } from '../planner/store/types';

const fromIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const shortDate = (iso: string) => {
  const d = fromIso(iso);
  return MON3[d.getMonth()] + ' ' + d.getDate();
};
const nextSunday = (today: Date) => isoOf(new Date(today.getFullYear(), today.getMonth(), today.getDate() + (7 - today.getDay())));
const blockLabel = (b: { name: string }, i: number) => b.name || 'Block ' + (i + 1);
const DAY = 86400000;

export function historyVals(ctx: Ctx) {
  const { logic, st } = ctx;
  const model = logic.model;
  const today = new Date();
  const todayIso = isoOf(today);
  const programById: Record<string, Program> = {};
  (model.programs || []).forEach((p) => (programById[p.id] = p));

  // The program a run shows: as it was when it started, or (for a run from before that was kept) as it is now.
  const shownOf = (r: ProgramRun): SharedProgram | null =>
    r.snapshot || (r.programId && programById[r.programId] ? db.programSnapshot(programById[r.programId], { notes: true, by: null }) : null);

  const runs = (model.programRuns || [])
    .map((r) => ({ r, shown: shownOf(r) }))
    .filter((x): x is { r: ProgramRun; shown: SharedProgram } => !!x.shown);

  const sessionsOf = (runId: string) => model.entries.filter((e) => e.av.program?.runId === runId);
  const doneOf = (runId: string) => sessionsOf(runId).filter((e) => e.av.s === 'c').length;
  // Every session it would put on the calendar, from the block it started at.
  const totalOf = (r: ProgramRun, p: SharedProgram) => p.blocks.slice(r.startBlock).reduce((n, b) => n + b.weeks * b.days.flat().length, 0);
  const running = (r: ProgramRun) => !r.ended && r.end >= todayIso;
  const where = (r: ProgramRun, p: SharedProgram) => {
    if (r.start > todayIso) return 'Starts ' + shortDate(r.start);
    const at = runPlace(p.blocks, r.start, r.startBlock, todayIso);
    if (!at) return '';
    return (p.blocks.length > 1 ? blockLabel(p.blocks[at.block], at.block) + ' · ' : '') + 'week ' + at.week + ' of ' + at.weeks;
  };
  // Weeks it lasted: to its end, or to the day it was ended early.
  const weeksRun = (r: ProgramRun, p: SharedProgram) => {
    const all = runWeeks(p.blocks, r.startBlock);
    if (!r.ended || !r.endedOn) return all;
    return Math.max(0, Math.min(all, Math.ceil((fromIso(r.endedOn).getTime() - fromIso(r.start).getTime() + DAY) / DAY / 7)));
  };
  const statusOf = (r: ProgramRun) => (running(r) ? 'running' : r.ended ? 'ended' : 'finished');
  const endOf = (r: ProgramRun) => (r.ended && r.endedOn ? r.endedOn : r.end);

  // A running one opens its program (where it can be moved or ended); one that's done, its own page.
  const openRun = (r: ProgramRun) => () =>
    running(r) && r.programId && programById[r.programId]
      ? logic.nav({ screen: 'program', programId: r.programId, programOpenBlocks: {}, programStart: null, programShareOpen: false })
      : logic.nav({ screen: 'programRun', runId: r.id, runShareOpen: false, runOpen: {} });
  const openAll = () => logic.nav({ screen: 'programRuns' });

  // ---- The Profile's card
  const live = runs.filter(({ r }) => running(r)).sort((a, b) => (a.r.start < b.r.start ? -1 : 1));
  const current = live.find(({ r }) => r.start <= todayIso) || live[0] || null;
  const last = runs.filter(({ r }) => !running(r)).sort((a, b) => (endOf(a.r) < endOf(b.r) ? 1 : -1))[0] || null;
  // Copying the program as it ran into the person's own, then going on with what was asked on the copy.
  const addCopy = (r: ProgramRun, p: SharedProgram, then: Record<string, unknown>, notice: string) =>
    logic.saveOnce('addRun', () => db.copySharedProgram(r.name, p), (id: string) => ({
      screen: 'program',
      programId: id,
      programOpenBlocks: {},
      programShareOpen: false,
      programStart: null,
      ...then,
      ...noticePatch(notice, 'program'),
    }));
  const profileProgram = current
    ? (() => {
        const { r, shown } = current;
        const done = doneOf(r.id);
        const total = totalOf(r, shown);
        const next = sessionsOf(r.id).find((e) => e.iso >= todayIso && e.av.s !== 'c');
        return {
          running: true as const,
          name: r.name,
          place: where(r, shown),
          open: openRun(r),
          done,
          total,
          pct: total ? Math.round((done / total) * 100) : 0,
          next: next ? 'Sessions done · next: ' + next.av.name + ', ' + DOW3[fromIso(next.iso).getDay()].charAt(0) + DOW3[fromIso(next.iso).getDay()].slice(1).toLowerCase() + ' ' + shortDate(next.iso) : 'Sessions done',
          count: runs.length,
          openAll,
        };
      })()
    : last
      ? (() => {
          const { r, shown } = last;
          const own = r.programId && programById[r.programId] ? programById[r.programId] : null;
          return {
            running: false as const,
            lastLine:
              'Last: ' +
              r.name +
              ', ' +
              (r.ended ? 'ended ' : 'finished ') +
              shortDate(endOf(r)) +
              ' (' +
              doneOf(r.id) +
              ' of ' +
              plural(totalOf(r, shown), 'session') +
              ').',
            // Again: its Start sheet, on the program if it's still there, else on a copy of it as it ran.
            runAgain: own
              ? () => logic.nav({ screen: 'program', programId: own.id, programOpenBlocks: {}, programShareOpen: false, programStart: { date: nextSunday(today), block: 0 } })
              : () => addCopy(r, shown, { programStart: { date: nextSunday(today), block: 0 } }, '“' + r.name + '” is in your programs again. Pick when it starts.'),
            busy: logic.busy('addRun'),
            find: () => logic.nav({ screen: 'arsenal', arsenalView: 'programs' }),
            count: runs.length,
            openAll,
          };
        })()
      : null;

  // ---- Every program run
  const rowOf = ({ r, shown }: { r: ProgramRun; shown: SharedProgram }) => {
    const status = statusOf(r);
    const total = totalOf(r, shown);
    const done = doneOf(r.id);
    const all = runWeeks(shown.blocks, r.startBlock);
    return {
      key: r.id,
      name: r.name,
      status: status === 'running' ? where(r, shown) : status === 'ended' ? 'Left unfinished' : 'Arc complete',
      statusTone: (status === 'running' ? 'accent' : 'muted') as 'accent' | 'muted',
      dates:
        shortDate(r.start) +
        ' – ' +
        shortDate(endOf(r)) +
        ' · ' +
        (status === 'ended' ? weeksRun(r, shown) + ' of ' + plural(all, 'week') : plural(all, 'week')),
      svg: iconSvg(shown.workouts[0]?.icon || 'h', shown.workouts[0]?.iconColor || undefined),
      done,
      total,
      pct: total ? Math.round((done / total) * 100) : 0,
      open: openRun(r),
    };
  };
  const runningRows = runs.filter(({ r }) => running(r)).map(rowOf);
  const doneRows = runs
    .filter(({ r }) => !running(r))
    .sort((a, b) => (endOf(a.r) < endOf(b.r) ? 1 : -1))
    .map(rowOf);
  const finished = runs.filter(({ r }) => statusOf(r) === 'finished').length;
  const sessionsDone = runs.reduce((n, { r }) => n + doneOf(r.id), 0);
  const programRuns = {
    summary: [plural(runs.length, 'program') + ' run', finished ? plural(finished, 'arc') + ' complete' : '', plural(sessionsDone, 'session') + ' done'].filter(Boolean).join(' · '),
    running: runningRows,
    done: doneRows,
    empty: !runs.length,
    find: () => logic.nav({ screen: 'arsenal', arsenalView: 'programs' }),
  };

  // ---- A run's page: the program as it ran
  const page = st.runId ? runs.find(({ r }) => r.id === st.runId) || null : null;
  const openWorkouts = st.runOpen || {};
  const programRun = page
    ? (() => {
        const { r, shown } = page;
        const status = statusOf(r);
        const done = doneOf(r.id);
        const total = totalOf(r, shown);
        let before = 0;
        return {
          // Finished, the card under the name says so: the eyebrow keeps to the dates.
          eyebrow: (status === 'running' ? 'Running · ' : status === 'ended' ? 'Left unfinished · ' : '') + shortDate(r.start) + ' – ' + shortDate(endOf(r)),
          name: r.name,
          // Finished: its moment, said on its page.
          complete: status === 'finished' ? '“' + r.name + '” is done: ' + done + ' of ' + total + ' sessions. Every one of them is in you now.' : '',
          chips: [plural(programWeeks(shown), 'week'), plural(trainingDays(shown), 'day') + ' a week', done + ' of ' + total + ' done'],
          bar: shown.blocks.map((b, i) => ({ name: blockLabel(b, i), weeks: b.weeks })),
          note: 'As it was when you ran it. Adding it makes a copy you can change and start again.',
          add: () => addCopy(r, shown, {}, '“' + r.name + '” is in your programs. Change it, or start it from here.'),
          adding: logic.busy('addRun'),
          share: () => logic.s({ runShareOpen: true }),
          blocks: shown.blocks.map((b, bi) => {
            const from = before + 1;
            before += b.weeks;
            const ixs = blockWorkouts(b);
            return {
              key: String(bi),
              name: blockLabel(b, bi),
              range: (b.weeks === 1 ? 'Week ' + from : 'Weeks ' + from + '–' + (from + b.weeks - 1)) + ' · ' + plural(ixs.length, 'workout') + ', ' + plural(b.days.filter((d) => d.length).length, 'day') + ' a week',
              strip: Array.from({ length: 7 }, (_, d) => {
                const w = b.days[d].length ? shown.workouts[b.days[d][0]] : null;
                return {
                  letter: DOW3[d].charAt(0),
                  label: DOWFULL[d] + ': ' + (b.days[d].length ? b.days[d].map((ix) => shown.workouts[ix].name).join(', ') : 'Rest'),
                  icon: w ? iconSvg(w.icon, w.iconColor || undefined) : undefined,
                };
              }),
              workouts: ixs.map((ix) => {
                const w = shown.workouts[ix];
                const key = bi + ':' + ix;
                const isOpen = !!openWorkouts[key];
                return {
                  key,
                  name: w.name,
                  meta: [
                    daysOf(b, ix).map((d) => DOW3[d].charAt(0) + DOW3[d].slice(1).toLowerCase()).join(', '),
                    w.kind === 'ride' ? '' : plural(w.exercises.length, 'exercise'),
                    '~' + minText(w.minutes),
                  ]
                    .filter(Boolean)
                    .join(' · '),
                  svg: iconSvg(w.icon, w.iconColor || undefined),
                  open: isOpen,
                  toggle: () => logic.s({ runOpen: { ...openWorkouts, [key]: !isOpen } }),
                  lines: w.kind === 'ride' ? [[w.ride?.dist ? w.ride.dist + ' mi' : '', w.ride?.zone || ''].filter(Boolean).join(' · ')] : w.exercises.map((e) => e.name + ' — ' + exLine(e, true)),
                  notes: w.notes,
                };
              }),
            };
          }),
        };
      })()
    : null;

  const runShare = page
    ? {
        open: !!st.runShareOpen,
        close: () => logic.s({ runShareOpen: false }),
        target: { runId: page.r.id } as db.ShareTarget,
        asRan: true,
        name: page.r.name,
        snapshot: (o: { notes: boolean; showName: boolean }) => ({
          ...page.shown,
          by: o.showName ? displayName(logic.auth.account, logic.model.profile?.name) : null,
          workouts: o.notes ? page.shown.workouts : page.shown.workouts.map((w) => ({ ...w, notes: '' })),
        }),
        canShowName: !!logic.auth.account,
      }
    : null;

  return {
    profileProgram,
    isProgramRuns: st.screen === 'programRuns',
    programRuns,
    isProgramRun: st.screen === 'programRun',
    programRun,
    runShare,
  };
}
