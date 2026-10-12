// Programs in the Spellbook: the list, a program's page, its editor, starting it, picking workouts for it and
// sharing it. Built-in programs open read-only; using one copies it into the person's own first.
import { DOW3, DOWFULL, MON3 } from '@/frontend/shared/constants';
import { isoOf, minText, noticePatch, plural, editTemplatePatch } from '@/frontend/shared/helpers';
import { iconSvg } from '@/frontend/shared/icons';
import { blockDays, runBlockDates, runPlace, runWeeks } from '@/frontend/shared/programs';
import { displayName } from '@/shared/auth';
import { EQUIPMENT } from '@/frontend/shared/constants';
import * as db from '@/frontend/data/plannerData';
import type { BuiltinProgram, Program, ProgramRun } from '@/frontend/data/plannerData';
import type { Ctx } from '../planner/store/types';

export const BUILTIN = 'builtin:';

const shortDate = (d: Date) => MON3[d.getMonth()] + ' ' + d.getDate();
const fromIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const nextSunday = (today: Date) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + (7 - today.getDay()));

/** "Mon", "Mon, Wed, Fri". */
const dayList = (days: number[]) => days.map((d) => DOW3[d].charAt(0) + DOW3[d].slice(1).toLowerCase()).join(', ');

// The shape every program is shown in, own or built-in: blocks with their workouts (and those workouts' weekdays).
type Shown = {
  id: string;
  builtin: boolean;
  name: string;
  notes: string;
  weeks: number;
  blocks: {
    id: string;
    name: string;
    weeks: number;
    workouts: { id: string; name: string; icon: string | null; iconColor: string | null; days: number[]; minutes: number; count: number; ride: boolean; equipment: string[] }[];
  }[];
};

function shownOwn(p: Program): Shown {
  return {
    id: p.id,
    builtin: false,
    name: p.name,
    notes: p.notes,
    weeks: p.weeks,
    blocks: p.blocks.map((b) => ({
      id: b.id,
      name: b.name,
      weeks: b.weeks,
      workouts: b.workouts.map((w) => ({
        id: w.id,
        name: w.name,
        icon: w.icon,
        iconColor: w.iconColor,
        days: w.days,
        minutes: w.minutes,
        count: w.list.length,
        ride: w.kind === 'ride',
        equipment: w.list.flatMap((e) => e.equipment || []),
      })),
    })),
  };
}

function shownBuiltin(p: BuiltinProgram, catalog: db.BuiltinWorkout[]): Shown {
  return {
    id: BUILTIN + p.id,
    builtin: true,
    name: p.name,
    notes: p.notes,
    weeks: p.weeks,
    blocks: p.blocks.map((b, bi) => ({
      id: BUILTIN + p.id + ':' + bi,
      name: b.name,
      weeks: b.weeks,
      workouts: Array.from(new Set(b.days.flat()))
        .map((n) => catalog.find((w) => w.name === n))
        .filter((w): w is db.BuiltinWorkout => !!w)
        .map((w) => ({
          id: w.id,
          name: w.name,
          icon: w.icon,
          iconColor: null,
          days: b.days.flatMap((list, d) => (list.includes(w.name) ? [d] : [])),
          minutes: w.minutes,
          count: w.list.length,
          ride: false,
          equipment: w.list.flatMap((e) => e.equipment || []),
        })),
    })),
  };
}

const daysAWeek = (p: Shown) => Math.max(0, ...p.blocks.map((b) => blockDays(b)));
const metaOf = (p: Shown) =>
  [plural(p.weeks, 'week'), p.blocks.length > 1 ? plural(p.blocks.length, 'block') : '', plural(daysAWeek(p), 'day') + ' a week']
    .filter(Boolean)
    .join(' · ');
const equipmentOf = (p: Shown) => {
  const need = new Set(p.blocks.flatMap((b) => b.workouts.flatMap((w) => w.equipment)));
  return EQUIPMENT.filter((x) => need.has(x));
};
const blockLabel = (b: { name: string }, i: number) => b.name || 'Block ' + (i + 1);

export function programVals(ctx: Ctx) {
  const { logic, st } = ctx;
  const model = logic.model;
  const today = new Date();
  const todayIso = isoOf(today);
  const catalog = model.builtinWorkouts || [];
  const own = (model.programs || []).map(shownOwn);
  const builtins = (model.builtinPrograms || []).map((p) => shownBuiltin(p, catalog));
  const runsOf = (id: string) => (model.programRuns || []).filter((r) => r.programId === id);
  // Running: started, not ended, and not over yet.
  const live = (r: ProgramRun) => !r.ended && r.end >= todayIso;

  // Where a run is today: "Build · week 2 of 3", or when it starts.
  const where = (p: Program, r: ProgramRun) => {
    if (r.start > todayIso) return 'Starts ' + shortDate(fromIso(r.start));
    const at = runPlace(p.blocks, r.start, r.startBlock, todayIso);
    if (!at) return '';
    return (p.blocks.length > 1 ? blockLabel(p.blocks[at.block], at.block) + ' · ' : '') + 'week ' + at.week + ' of ' + at.weeks;
  };
  // How far through it a run is, in weeks of the whole program (for the bar's marker).
  const weeksIn = (p: Program, r: ProgramRun) => {
    if (r.start > todayIso) return null;
    const before = p.blocks.slice(0, r.startBlock).reduce((s, b) => s + b.weeks, 0);
    const days = Math.round((fromIso(todayIso).getTime() - fromIso(r.start).getTime()) / 86400000);
    return before + Math.min(days / 7, runWeeks(p.blocks, r.startBlock));
  };
  const bar = (p: Shown) => p.blocks.map((b, i) => ({ name: blockLabel(b, i), weeks: b.weeks }));

  const open = (id: string) => () => logic.nav({ screen: 'program', programId: id, programOpenBlocks: {}, programStart: null, programShareOpen: false });

  // ---- The Programs tab
  const q = (st.arsenalQ || '').trim().toLowerCase();
  const hit = (p: Shown) => !q || p.name.toLowerCase().includes(q) || p.blocks.some((b) => b.workouts.some((w) => w.name.toLowerCase().includes(q)));
  const running = (model.programs || []).flatMap((p) =>
    runsOf(p.id)
      .filter(live)
      .filter(() => hit(shownOwn(p)))
      .map((r) => ({ key: r.id, name: p.name, place: where(p, r), bar: bar(shownOwn(p)), at: weeksIn(p, r), open: open(p.id) })),
  );
  const card = (p: Shown) => ({ key: p.id, name: p.name, meta: metaOf(p), icon: iconSvg(p.blocks[0]?.workouts[0]?.icon || 'h'), open: open(p.id) });
  const programList = {
    running,
    mine: own.filter(hit).map(card),
    builtin: builtins.filter(hit).map(card),
    none: own.length + builtins.length === 0,
    noMatch: !!q && own.length + builtins.length > 0 && !own.some(hit) && !builtins.some(hit),
    noMatchNote: 'No programs match “' + (st.arsenalQ || '').trim() + '”.',
  };
  const programCount = (q ? own.filter(hit).length + builtins.filter(hit).length + ' of ' : '') + plural(own.length + builtins.length, 'program');
  const newProgram = () =>
    logic.saveOnce('program', () => db.createProgram('My program'), (id: string) => ({
      screen: 'programEdit',
      programId: id,
      hist: (st.hist || []).concat([{ screen: 'arsenal' }]),
    }));

  // ---- A program's page
  const ownProgram = st.programId ? (model.programs || []).find((p) => p.id === st.programId) || null : null;
  const builtinProgram =
    st.programId && st.programId.startsWith(BUILTIN) ? (model.builtinPrograms || []).find((p) => BUILTIN + p.id === st.programId) || null : null;
  const shown: Shown | null = ownProgram ? shownOwn(ownProgram) : builtinProgram ? shownBuiltin(builtinProgram, catalog) : null;
  const openBlocks = st.programOpenBlocks || {};
  // Copying a built-in program, then going on with what was asked (start it, edit it) on the copy.
  const copyBuiltin = (then: Record<string, unknown>) => () =>
    builtinProgram &&
    logic.saveOnce('program', () => db.copyBuiltinProgram(builtinProgram, catalog), (id: string) => ({
      programId: id,
      ...then,
      ...noticePatch('“' + builtinProgram.name + '” is in your programs now, to change as you like.', (then.screen as any) || 'program'),
    }));
  const myRuns = ownProgram ? runsOf(ownProgram.id) : [];
  const program = shown
    ? {
        name: shown.name,
        builtin: shown.builtin,
        eyebrow: shown.builtin ? 'Built-in program' : 'Program',
        notes: shown.notes,
        chips: [plural(shown.weeks, 'week'), plural(daysAWeek(shown), 'day') + ' a week'],
        equipment: (() => {
          const kit = equipmentOf(shown);
          return kit.length ? (kit.length <= 2 ? kit.join(', ') : plural(kit.length, 'piece') + ' of equipment') : 'No equipment';
        })(),
        bar: bar(shown),
        blocks: shown.blocks.map((b, i) => {
          const before = shown.blocks.slice(0, i).reduce((s, x) => s + x.weeks, 0);
          const isOpen = openBlocks[b.id] ?? i === 0;
          const strip = Array.from({ length: 7 }, (_, d) => {
            const w = b.workouts.find((x) => x.days.includes(d));
            return { day: DOWFULL[d], letter: DOW3[d].charAt(0), svg: w ? iconSvg(w.icon || 'h', w.iconColor || undefined) : null, label: w ? b.workouts.filter((x) => x.days.includes(d)).map((x) => x.name).join(', ') : 'Rest' };
          });
          return {
            key: b.id,
            name: blockLabel(b, i),
            range: b.weeks === 1 ? 'Week ' + (before + 1) : 'Weeks ' + (before + 1) + '–' + (before + b.weeks),
            summary: plural(b.workouts.length, 'workout') + ', ' + plural(blockDays(b), 'day') + ' a week',
            open: isOpen,
            toggle: () => logic.s({ programOpenBlocks: { ...openBlocks, [b.id]: !isOpen } }),
            strip,
            workouts: b.workouts.map((w) => ({
              key: w.id,
              days: dayList(w.days),
              name: w.name,
              // Each part stays on one line ("6 exercises", "~1 h"); the line only breaks between them.
              meta: [w.ride ? '' : plural(w.count, 'exercise'), '~' + minText(w.minutes)]
                .filter(Boolean)
                .map((part) => part.replace(/ /g, '\u00a0'))
                .join(' · '),
              svg: iconSvg(w.icon || 'h', w.iconColor || undefined),
              // A program's own workout opens in the workout editor; a built-in one on its own page.
              open: shown.builtin
                ? () => logic.nav({ screen: 'template', templateId: w.id })
                : () => logic.nav(editTemplatePatch(w.id)),
            })),
            empty: b.workouts.length === 0,
          };
        }),
        runs: ownProgram
          ? myRuns.filter(live).map((r) => ({
              key: r.id,
              label: 'Running · ' + where(ownProgram, r),
              dates: shortDate(fromIso(r.start)) + ' – ' + shortDate(fromIso(r.end)),
              end: () =>
                logic.setState({
                  confirm: {
                    kind: 'endProgram',
                    title: 'End “' + ownProgram.name + '”?',
                    body: 'Its sessions still ahead come off your calendar. Anything you’ve done, started or written about stays.',
                    label: 'End program',
                    then: () => logic.save(() => db.endRun(r.id, todayIso), noticePatch('“' + ownProgram.name + '” ended.', 'program')),
                  },
                }),
            }))
          : [],
        start: shown.builtin ? copyBuiltin({ programStart: { date: isoOf(nextSunday(today)), block: 0 } }) : () => logic.s({ programStart: { date: isoOf(nextSunday(today)), block: 0 } }),
        share: shown.builtin ? null : () => logic.s({ programShareOpen: true }),
        edit: shown.builtin ? copyBuiltin({ screen: 'programEdit' }) : () => logic.nav({ screen: 'programEdit' }),
        editLabel: shown.builtin ? 'Copy to my programs' : 'Edit',
        busy: logic.busy('program'),
      }
    : null;

  // ---- Starting it
  const startSt = st.programStart || null;
  const programStart =
    ownProgram && startSt
      ? (() => {
          const blocks = ownProgram.blocks;
          const block = Math.min(startSt.block, Math.max(0, blocks.length - 1));
          const date = startSt.date < todayIso ? todayIso : startSt.date;
          const lands = runBlockDates(blocks, date, block);
          const end = isoOf(lands.length ? lands[lands.length - 1].to : fromIso(date));
          const sessions = blocks
            .slice(block)
            .reduce((n, b) => n + b.weeks * b.workouts.reduce((k, w) => k + w.days.length, 0), 0);
          // Other programs running at the same time.
          const overlap = (model.programs || [])
            .flatMap((p) => runsOf(p.id).filter(live).map((r) => ({ p, r })))
            .filter(({ r }) => r.start <= end && r.end >= date);
          return {
            open: true,
            title: 'Start ' + ownProgram.name,
            date,
            min: todayIso,
            setDate: (e) => logic.s({ programStart: { ...startSt, date: e.target.value || todayIso } }),
            blocks: blocks.length > 1 ? blocks.map((b, i) => ({ value: String(i), label: blockLabel(b, i) })) : null,
            block: String(block),
            setBlock: (v: string) => logic.s({ programStart: { ...startSt, block: Number(v) } }),
            summary: shortDate(fromIso(date)) + ' – ' + shortDate(fromIso(end)) + ' · ' + plural(runWeeks(blocks, block), 'week') + ', ' + plural(sessions, 'session'),
            lands: lands.length > 1 ? lands.map((l) => l.name + ' ' + shortDate(l.from) + ' – ' + shortDate(l.to)).join(' · ') : '',
            overlap: overlap.length
              ? overlap.map(({ p }) => '“' + p.name + '”').join(' and ') + (overlap.length > 1 ? ' run' : ' runs') + ' then too. Both go on the calendar.'
              : '',
            canStart: sessions > 0,
            emptyNote: sessions ? '' : 'Add workouts to it first: it has nothing to put on the calendar.',
            busy: logic.busy('startProgram'),
            cancel: () => logic.s({ programStart: null }),
            start: () =>
              logic.saveOnce('startProgram', () => db.startProgram(ownProgram, date, block, todayIso), (r: { first: string | null; count: number }) => {
                const at = r.first ? fromIso(r.first) : fromIso(date);
                return {
                  programStart: null,
                  screen: 'day',
                  seg: 'Week',
                  month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][at.getMonth()],
                  yOff: at.getFullYear() - today.getFullYear(),
                  day: at.getDate(),
                  hist: [],
                  ...noticePatch('“' + ownProgram.name + '” started: ' + plural(r.count, 'session') + ' on your calendar from ' + shortDate(at) + '.', 'day'),
                };
              }),
          };
        })()
      : null;

  // ---- Editing it
  const pick = st.programPick || null;
  const pickBlock = ownProgram && pick ? ownProgram.blocks.find((b) => b.id === pick.blockId) || null : null;
  const programEdit =
    st.screen === 'programEdit' && ownProgram
      ? {
          name: ownProgram.name,
          notes: ownProgram.notes,
          rename: (e) => {
            const name = e.target.value;
            if (name.trim()) logic.save(() => db.updateProgram(ownProgram.id, { name }));
          },
          setNotes: (e) => logic.save(() => db.updateProgram(ownProgram.id, { notes: e.target.value })),
          blocks: ownProgram.blocks.map((b, i) => ({
            key: b.id,
            heading: 'Block ' + (i + 1) + ' of ' + ownProgram.blocks.length,
            name: b.name,
            weeks: b.weeks,
            rename: (e) => logic.save(() => db.updateBlock(b.id, { name: e.target.value })),
            fewer: b.weeks > 1 ? () => logic.save(() => db.updateBlock(b.id, { weeks: b.weeks - 1 })) : null,
            more: b.weeks < 52 ? () => logic.save(() => db.updateBlock(b.id, { weeks: b.weeks + 1 })) : null,
            days: Array.from({ length: 7 }, (_, d) => ({
              key: d,
              day: DOWFULL[d],
              workouts: b.workouts
                .filter((w) => w.days.includes(d))
                .map((w) => ({
                  key: w.id,
                  name: w.name,
                  meta: w.kind === 'ride' ? '~' + minText(w.minutes) : plural(w.list.length, 'exercise'),
                  open: () => logic.nav(editTemplatePatch(w.id)),
                  remove: () => logic.save(() => db.removeWorkoutFromDay(w, d)),
                  removeLabel: 'Take ' + w.name + ' off ' + DOWFULL[d],
                })),
              add: () => logic.s({ programPick: { blockId: b.id, day: d } }),
              addLabel: 'Add a workout on ' + DOWFULL[d],
            })),
            copyNext: () => logic.save(() => db.addBlock(ownProgram, b)),
            remove:
              ownProgram.blocks.length > 1
                ? () =>
                    logic.setState({
                      confirm: {
                        kind: 'deleteBlock',
                        title: 'Delete ' + blockLabel(b, i) + '?',
                        body: 'Its workouts leave the program. Sessions already on your calendar stay.',
                        label: 'Delete block',
                        then: () => logic.save(() => db.deleteBlock(b)),
                      },
                    })
                : null,
          })),
          addEmpty: () => logic.save(() => db.addBlock(ownProgram, null)),
          remove: () =>
            logic.setState({
              confirm: {
                kind: 'deleteProgram',
                title: 'Delete “' + ownProgram.name + '”?',
                body:
                  (myRuns.some(live) ? 'It ends where it’s running: its sessions still ahead come off your calendar. ' : '') +
                  'Sessions you’ve done stay in your history. A link you shared stops working.',
                label: 'Delete program',
                then: () =>
                  logic.save(() => db.deleteProgram(ownProgram, myRuns.filter(live).map((r) => r.id), todayIso), {
                    screen: 'arsenal',
                    arsenalView: 'programs',
                    programId: null,
                    hist: [],
                    ...noticePatch('“' + ownProgram.name + '” deleted.', 'arsenal'),
                  }),
              },
            }),
          runningNote: myRuns.some(live)
            ? 'It’s running. Changes to its workouts show in the sessions ahead; new days and blocks apply the next time you start it.'
            : '',
          // Back to its page: the screen before, or (opened straight into the editor, from New or a copy) in its place.
          done: () => ((st.hist || []).slice(-1)[0]?.screen === 'program' ? logic.back() : logic.s({ screen: 'program' })),
        }
      : null;

  // ---- Picking a workout for a day: one of the person's own, or a built-in one, copied into the block.
  const pq = (pick?.q || '').trim().toLowerCase();
  const programPicker =
    pick && pickBlock && ownProgram
      ? {
          open: true,
          title: 'Add to ' + DOWFULL[pick.day],
          q: pick.q || '',
          setQ: (e) => logic.s({ programPick: { ...pick, q: e.target.value } }),
          clearQ: () => logic.s({ programPick: { ...pick, q: '' } }),
          groups: [
            { label: 'Your workouts', items: model.workouts },
            { label: 'Built-in', items: catalog },
          ]
            .map((g) => ({
              label: g.label,
              items: g.items
                .filter((w) => !pq || w.name.toLowerCase().includes(pq))
                .map((w) => ({
                  key: w.id,
                  name: w.name,
                  meta: w.kind === 'ride' ? w.time : plural(w.exercises.length, 'exercise') + ' · ' + w.time,
                  svg: iconSvg(w.icon || 'h', w.iconColor || undefined),
                  pick: () => {
                    const copy: db.WorkoutCopy =
                      'builtin' in w && w.builtin
                        ? db.builtinCopy(w as db.BuiltinWorkout)
                        : {
                            name: w.name,
                            isRide: w.kind === 'ride',
                            minutes: w.minutes,
                            ride: w.ride || null,
                            icon: w.icon,
                            iconColor: w.iconColor,
                            notes: w.notes,
                            warmup: w.warmup,
                            stretch: w.stretch,
                            yoga: w.yoga,
                            exercises: model.EX[w.name] || [],
                          };
                    logic.save(() => db.addWorkoutToDay(pickBlock, pick.day, copy), { programPick: null });
                  },
                })),
            }))
            .filter((g) => g.items.length),
          cancel: () => logic.s({ programPick: null }),
        }
      : null;

  // ---- Sharing it (the sheet does the rest)
  const programShare =
    ownProgram
      ? {
          open: !!st.programShareOpen,
          close: () => logic.s({ programShareOpen: false }),
          programId: ownProgram.id,
          name: ownProgram.name,
          snapshot: (o: { notes: boolean; showName: boolean }) =>
            db.programSnapshot(ownProgram, { notes: o.notes, by: o.showName ? displayName(logic.auth.account) : null }),
          canShowName: !!logic.auth.account,
        }
      : null;

  return {
    programsReady: !!model.programsReady,
    programList,
    programCount,
    newProgram,
    isProgram: st.screen === 'program',
    program,
    programStart,
    isProgramEdit: st.screen === 'programEdit',
    programEdit,
    programPicker,
    programShare,
  };
}
