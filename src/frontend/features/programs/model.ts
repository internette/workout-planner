// Programs in the Spellbook: the list, a program's page, its editor, starting it, picking workouts for it and
// sharing it. Built-in programs open read-only; using one copies it into the person's own first.
import { DOW3, DOWFULL, MON3 } from '@/frontend/shared/constants';
import { isoOf, minText, noticePatch, plural, editTemplatePatch } from '@/frontend/shared/helpers';
import { iconSvg } from '@/frontend/shared/icons';
import { blockDays, blockOnDays, blockSessions, runBlockDates, runPlace, runWeeks } from '@/frontend/shared/programs';
import { displayName } from '@/shared/auth';
import { EQUIPMENT } from '@/frontend/shared/constants';
import { kitChip, kitOfAll } from '@/frontend/shared/equipment';
import * as db from '@/frontend/data/plannerData';
import type { BuiltinProgram, Exercise, Program, ProgramRun } from '@/frontend/data/plannerData';
import { splitSide } from '@/frontend/shared/sides';
import type { Ctx } from '../planner/store/types';

export const BUILTIN = 'builtin:';

const shortDate = (d: Date) => MON3[d.getMonth()] + ' ' + d.getDate();
const fromIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const nextSunday = (today: Date) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + (7 - today.getDay()));

/**
 * A workout's main lifts and their weights, to tell one week's from the next: "Bench Press 100 lb · Barbell Row 90 lb".
 * One with no weights says how many exercises it has.
 */
const liftsLine = (list: Exercise[]) => {
  const lifts = Array.from(new Map(list.filter((e) => /\d/.test(e.weight)).map((e) => [splitSide(e.name).base, e.weight])));
  return lifts.length
    ? lifts.slice(0, 2).map(([name, weight]) => name + ' ' + weight).join(' · ') + (lifts.length > 2 ? ' · +' + (lifts.length - 2) : '')
    : plural(list.length, 'exercise');
};

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
    byWeek: boolean;
    workouts: {
      id: string;
      name: string;
      icon: string | null;
      iconColor: string | null;
      days: number[];
      week: number | null;
      minutes: number;
      count: number;
      ride: boolean;
      lifts: string;
      kit: { need: string[]; complete: boolean };
    }[];
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
      byWeek: b.byWeek,
      workouts: b.workouts.map((w) => ({
        id: w.id,
        name: w.name,
        icon: w.icon,
        iconColor: w.iconColor,
        days: w.days,
        week: w.week,
        minutes: w.minutes,
        count: w.list.length,
        ride: w.kind === 'ride',
        lifts: liftsLine(w.list),
        kit: kitOfAll(w.list),
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
      byWeek: false,
      workouts: Array.from(new Set(b.days.flat()))
        .map((n) => catalog.find((w) => w.name === n))
        .filter((w): w is db.BuiltinWorkout => !!w)
        .map((w) => ({
          id: w.id,
          name: w.name,
          icon: w.icon,
          iconColor: null,
          days: b.days.flatMap((list, d) => (list.includes(w.name) ? [d] : [])),
          week: null,
          minutes: w.minutes,
          count: w.list.length,
          ride: false,
          lifts: liftsLine(w.list),
          kit: kitOfAll(w.list),
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
  const kits = p.blocks.flatMap((b) => b.workouts.map((w) => w.kit));
  return { need: EQUIPMENT.filter((x) => kits.some((k) => k.need.includes(x))), complete: kits.every((k) => k.complete) };
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

  // A running program's weekdays on and after `iso` (or its start, if later): each day's workouts, in the block it's at
  // then; every block's, when it has ended by then.
  const daysThen = (p: Program, r: ProgramRun, iso: string) => {
    const at = runPlace(p.blocks, r.start, r.startBlock, iso > r.start ? iso : r.start);
    const map = new Map<number, Program['blocks'][number]['workouts']>();
    for (const b of at ? [p.blocks[at.block]] : p.blocks)
      for (const w of b.workouts.filter((x) => x.week == null || x.week === (at?.week ?? 1)))
        for (const d of w.days) if (!(map.get(d) || []).some((x) => x.name === w.name)) map.set(d, [...(map.get(d) || []), w]);
    return map;
  };

  const open = (id: string) => () => logic.nav({ screen: 'program', programId: id, programOpenBlocks: {}, programStart: null, programShareOpen: false });

  // ---- The Programs tab
  const q = (st.arsenalQ || '').trim().toLowerCase();
  const hit = (p: Shown) => !q || p.name.toLowerCase().includes(q) || p.blocks.some((b) => b.workouts.some((w) => w.name.toLowerCase().includes(q)));
  const running = (model.programs || []).flatMap((p) =>
    runsOf(p.id)
      .filter(live)
      .filter(() => hit(shownOwn(p)))
      .map((r) => {
        const total = p.blocks.slice(r.startBlock).reduce((n, b) => n + blockSessions(b), 0);
        const done = model.entries.filter((e) => e.av.program?.runId === r.id && e.av.s === 'c').length;
        return { key: r.id, name: p.name, place: where(p, r), pct: total ? Math.round((done / total) * 100) : 0, figure: done + '/' + total, valueText: done + ' of ' + total + ' sessions done', open: open(p.id) };
      }),
  );
  const isRunning = (id: string) => runsOf(id).some(live);
  const card = (p: Shown) => ({ key: p.id, name: p.name, meta: metaOf(p), icon: iconSvg(p.blocks[0]?.workouts[0]?.icon || 'h'), open: open(p.id) });
  const programList = {
    running,
    // A running one is listed under Running, not again here.
    mine: own.filter((p) => !isRunning(p.id)).filter(hit).map(card),
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

  // ---- Adding a program, from Your programs: every one not running, with its days and how they sit with what's running.
  const addSt = st.programAdd || null;
  const runningNow = (model.programs || []).flatMap((p) => runsOf(p.id).filter(live).map((r) => ({ p, r })));
  const busyNow = new Set(runningNow.flatMap(({ p, r }) => [...daysThen(p, r, todayIso).keys()]));
  const aq = (addSt?.q || '').trim().toLowerCase();
  const addRow = (p: Shown) => {
    const days = [...new Set(p.blocks[0]?.workouts.flatMap((w) => w.days) ?? [])].sort((a, b) => a - b);
    const shared = days.filter((d) => busyNow.has(d));
    return {
      key: p.id,
      name: p.name,
      meta: metaOf(p),
      days: days.length ? dayList(days) : '',
      svg: iconSvg(p.blocks[0]?.workouts[0]?.icon || 'h', p.blocks[0]?.workouts[0]?.iconColor || undefined),
      // Next to what's running: the days it shares, or that it fits around it.
      tag: !runningNow.length || !days.length
        ? null
        : shared.length
          ? { label: 'Shares ' + dayList(shared), tone: 'neutral' as const }
          : { label: runningNow.length === 1 ? 'Fits around ' + runningNow[0].p.name : 'Fits around what’s running', tone: 'soft' as const },
      pick: () => logic.s({ programAdd: null, programId: p.id, programStart: { date: isoOf(nextSunday(today)), block: 0 } }),
    };
  };
  const addHit = (p: Shown) => !aq || p.name.toLowerCase().includes(aq);
  const programAdd = {
    label: runningNow.length ? 'Add a program' : 'Start a program',
    openPicker: () => logic.s({ programAdd: { q: '' } }),
    picker: addSt
      ? {
          open: true,
          title: runningNow.length ? 'Add a program' : 'Start a program',
          q: addSt.q,
          setQ: (e: { target: { value: string } }) => logic.s({ programAdd: { q: e.target.value } }),
          clearQ: () => logic.s({ programAdd: { q: '' } }),
          groups: [
            { label: 'Yours', items: own.filter((p) => !isRunning(p.id)) },
            { label: 'Built-in', items: builtins },
          ]
            .map((g) => ({ label: g.label, items: g.items.filter(addHit).map(addRow) }))
            .filter((g) => g.items.length),
          noMatch: aq ? 'No programs match “' + addSt.q.trim() + '”.' : 'Every program you have is running.',
          // Making a new one: its editor, then back to Your programs.
          newProgram: () =>
            logic.saveOnce('program', () => db.createProgram('My program'), (id: string) => ({
              programAdd: null,
              screen: 'programEdit',
              programId: id,
              hist: (st.hist || []).concat([{ screen: 'programRuns' }]),
            })),
          busy: logic.busy('program'),
          cancel: () => logic.s({ programAdd: null }),
        }
      : null,
  };

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
        equipment: kitChip(equipmentOf(shown)),
        // While it runs: how far through it you are, by sessions done of all it puts on the calendar.
        progress: (() => {
          const r = ownProgram ? myRuns.filter(live).sort((a, c) => (a.start < c.start ? -1 : 1))[0] : null;
          if (!ownProgram || !r) return null;
          const total = ownProgram.blocks.slice(r.startBlock).reduce((n, b) => n + blockSessions(b), 0);
          const done = model.entries.filter((e) => e.av.program?.runId === r.id && e.av.s === 'c').length;
          return { pct: total ? Math.round((done / total) * 100) : 0, figure: done + '/' + total, valueText: done + ' of ' + total + ' sessions done' };
        })(),
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
            summary: b.byWeek
              ? plural(new Set(b.workouts.map((w) => w.name)).size, 'workout') + ', week by week'
              : plural(b.workouts.length, 'workout') + ', ' + plural(blockDays(b), 'day') + ' a week',
            open: isOpen,
            toggle: () => logic.s({ programOpenBlocks: { ...openBlocks, [b.id]: !isOpen } }),
            strip,
            // Week by week: each week, with its own workouts and their weights.
            weekList: b.byWeek
              ? Array.from({ length: b.weeks }, (_, k) => ({ key: k + 1, label: 'Week ' + (before + k + 1), ids: b.workouts.filter((w) => w.week === k + 1).map((w) => w.id) }))
              : null,
            workouts: b.workouts.map((w) => ({
              key: w.id,
              days: dayList(w.days),
              name: w.name,
              // Each part stays on one line ("6 exercises", "~1 h"); the line only breaks between them.
              // Week by week, its lifts and their weights in place of its exercise count, each lift a part.
              meta: [...(w.ride ? [] : b.byWeek ? w.lifts.split(' · ') : [plural(w.count, 'exercise')]), '~' + minText(w.minutes)]
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
              move: () => logic.s({ programMove: { runId: r.id, date: r.start } }),
              end: () =>
                logic.setState({
                  confirm: {
                    kind: 'endProgram',
                    title: 'End “' + ownProgram.name + '” here?',
                    body: 'The arc stops: its sessions still ahead come off your calendar. Everything you’ve cleared stays yours.',
                    label: 'End program',
                    then: () => logic.save(() => db.endRun(r.id, todayIso), noticePatch('“' + ownProgram.name + '” ended. What you cleared stays yours.', 'program')),
                  },
                }),
            }))
          : [],
        // A built-in one is copied into the person's programs only when it actually starts (see programStart).
        start: () => logic.s({ programStart: { date: isoOf(nextSunday(today)), block: 0 } }),
        share: shown.builtin ? null : () => logic.s({ programShareOpen: true }),
        edit: shown.builtin ? copyBuiltin({ screen: 'programEdit' }) : () => logic.nav({ screen: 'programEdit' }),
        editLabel: shown.builtin ? 'Copy to my programs' : 'Edit',
        busy: logic.busy('program'),
      }
    : null;

  // ---- Starting it
  const startSt = st.programStart || null;
  // What starts: one of the person's own programs, or a built-in one, which becomes theirs as it starts.
  const startable = ownProgram ? { name: ownProgram.name, blocks: ownProgram.blocks } : builtinProgram && shown ? { name: shown.name, blocks: shown.blocks } : null;
  const programStart =
    startable && startSt
      ? (() => {
          // Its blocks, as starting it needs them.
          type StartBlock = { name: string; weeks: number; workouts: { id: string; name: string; icon: string | null; iconColor: string | null; days: number[]; week: number | null }[] };
          const base: StartBlock[] = startable.blocks;
          const block = Math.min(startSt.block, Math.max(0, base.length - 1));
          const date = startSt.date < todayIso ? todayIso : startSt.date;
          const end0 = isoOf(runBlockDates(base, date, block).slice(-1)[0]?.to ?? fromIso(date));
          // Other programs running at the same time, and the weekdays they have then.
          const overlap = (model.programs || [])
            .filter((p) => p.id !== ownProgram?.id)
            .flatMap((p) => runsOf(p.id).filter(live).map((r) => ({ p, r })))
            .filter(({ r }) => r.start <= end0 && r.end >= date);
          const others = overlap.map(({ p, r }) => ({ p, days: daysThen(p, r, date) }));
          const busy = new Set(others.flatMap((o) => [...o.days.keys()]));
          // Its own weekdays, in the block it starts at, and how many it needs in its busiest week.
          const ownDays = [...new Set(base[block]?.workouts.flatMap((w) => w.days) ?? [])].sort((a, b) => a - b);
          const needs = Math.max(0, ...base.slice(block).map((b) => blockDays(b)));
          const shared = ownDays.filter((d) => busy.has(d));
          // Shared days: it moves to the free days (enough of them to fit, keeping its own days when there aren't), unless
          // the person keeps both.
          const free = [0, 1, 2, 3, 4, 5, 6].filter((d) => !busy.has(d));
          const suggested = free.length >= needs ? free : [...free, ...ownDays.filter((d) => busy.has(d))].slice(0, Math.max(needs, free.length)).sort((a, b) => a - b);
          const chosen = startSt.days ?? suggested;
          const moving = shared.length > 0 && !startSt.both;
          const fits = chosen.length >= needs;
          const blocks = moving && fits ? base.map((b) => ({ ...b, workouts: blockOnDays(b.workouts, chosen) })) : base;
          const lands = runBlockDates(blocks, date, block);
          const end = isoOf(lands.length ? lands[lands.length - 1].to : fromIso(date));
          const sessions = blocks.slice(block).reduce((n, b) => n + blockSessions(b), 0);
          const newDays = new Set(blocks[block]?.workouts.flatMap((w) => w.days) ?? []);
          const stillShared = [...newDays].filter((d) => busy.has(d)).sort((a, b) => a - b);
          const names = overlap.map(({ p }) => '“' + p.name + '”').join(' and ');
          const shortNames = overlap.map(({ p }) => p.name).join(' and ');
          const setSt = (patch: Partial<NonNullable<typeof startSt>>) => logic.s({ programStart: { ...startSt, ...patch } });
          return {
            open: true,
            title: 'Start ' + startable.name,
            date,
            min: todayIso,
            setDate: (e) => setSt({ date: e.target.value || todayIso }),
            blocks: base.length > 1 ? base.map((b, i) => ({ value: String(i), label: blockLabel(b, i) })) : null,
            block: String(block),
            setBlock: (v: string) => setSt({ block: Number(v) }),
            summary: shortDate(fromIso(date)) + ' – ' + shortDate(fromIso(end)) + ' · ' + plural(runWeeks(blocks, block), 'week') + ', ' + plural(sessions, 'session'),
            lands: lands.length > 1 ? lands.map((l) => l.name + ' ' + shortDate(l.from) + ' – ' + shortDate(l.to)).join(' · ') : '',
            // No shared days: it just says the other runs then too.
            overlap: overlap.length && !shared.length ? names + (overlap.length > 1 ? ' run' : ' runs') + ' then too, on other days.' : '',
            // Its week with theirs, once another runs then: each day's workouts, a shared day ringed.
            week: overlap.length
              ? Array.from({ length: 7 }, (_, d) => {
                  const mine = blocks[block]?.workouts.filter((w) => w.days.includes(d)) ?? [];
                  const theirs = others.flatMap((o) => o.days.get(d) ?? []);
                  const all = [...theirs, ...mine];
                  return {
                    letter: DOW3[d].charAt(0),
                    label: DOWFULL[d] + ': ' + (all.length ? all.map((w) => w.name).join(' and ') : 'rest'),
                    icons: all.slice(0, 2).map((w) => iconSvg(w.icon || 'h', w.iconColor || undefined)),
                    flag: mine.length > 0 && theirs.length > 0,
                  };
                })
              : null,
            weekNote: overlap.length ? 'Your week with ' + shortNames + (stillShared.length ? '. Ringed days have both.' : '.') : '',
            // On the days it shares: move it, or do both.
            clash: shared.length
              ? {
                  title: dayList(shared) + (shared.length > 1 ? ' are' : ' is') + ' taken by ' + shortNames,
                  value: moving ? 'move' : 'both',
                  set: (v: string) => setSt({ both: v === 'both' }),
                  moveTitle: 'Use the free days',
                  moveNote: ownProgram
                    ? 'Moves “' + ownProgram.name + '” onto the days you pick, for this run and the next.'
                    : 'Your copy goes on the days you pick.',
                  bothTitle: 'Do both on those days',
                  bothNote: 'Two workouts on ' + dayList(shared) + '.',
                  days: chosen,
                  toggleDay: (d: number) => {
                    const next = chosen.includes(d) ? chosen.filter((x) => x !== d) : [...chosen, d].sort((a, b) => a - b);
                    if (next.length) setSt({ days: next });
                  },
                  daysNote: !fits
                    ? 'It needs ' + plural(needs, 'day') + ' a week: pick ' + (needs - chosen.length) + ' more.'
                    : moving && stillShared.length
                      ? 'Only ' + plural(free.length, 'day') + (free.length === 1 ? ' is' : ' are') + ' free, so ' + dayList(stillShared) + ' still ' + (stillShared.length > 1 ? 'have' : 'has') + ' both.'
                      : '',
                  daysNoteTone: (fits ? 'muted' : 'danger') as 'muted' | 'danger',
                }
              : null,
            canStart: sessions > 0 && (!moving || fits),
            emptyNote: sessions ? '' : 'Add workouts to it first: it has nothing to put on the calendar.',
            busy: logic.busy('startProgram'),
            cancel: () => logic.s({ programStart: null }),
            start: () =>
              logic.saveOnce('startProgram', async () => {
                // A built-in one: its copy first, read back with its workouts, then that copy starts.
                let own = ownProgram
                  ? ownProgram
                  : await db.copyBuiltinProgram(builtinProgram!, catalog).then(async (id) => (await db.loadModel(today)).programs!.find((p) => p.id === id)!);
                // Moved off the days another program has: onto the days picked, then started there.
                if (moving) own = await db.moveProgramDays(own, chosen);
                const r = await db.startProgram(own, date, block, todayIso, { name: own.name, snapshot: db.programSnapshot(own, { notes: true, by: null }) });
                return { ...r, id: own.id, name: own.name };
              }, (r: { first: string | null; count: number; id: string; name: string }) => {
                const at = r.first ? fromIso(r.first) : fromIso(date);
                return {
                  programStart: null,
                  programId: r.id,
                  screen: 'day',
                  seg: 'Week',
                  month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][at.getMonth()],
                  yOff: at.getFullYear() - today.getFullYear(),
                  day: at.getDate(),
                  hist: [],
                  ...noticePatch('“' + r.name + '” begins: ' + plural(r.count, 'session') + ' on your calendar from ' + shortDate(at) + '.', 'day'),
                };
              }),
          };
        })()
      : null;

  // ---- Moving a run to start on another day
  const moveSt = st.programMove || null;
  const moving = ownProgram && moveSt ? myRuns.find((r) => r.id === moveSt.runId) || null : null;
  const programMove =
    ownProgram && moveSt && moving
      ? (() => {
          const date = moveSt.date || moving.start;
          const lands = runBlockDates(ownProgram.blocks, date, moving.startBlock);
          const end = isoOf(lands.length ? lands[lands.length - 1].to : fromIso(date));
          return {
            open: true,
            title: 'Change when it starts',
            date,
            setDate: (e) => logic.s({ programMove: { ...moveSt, date: e.target.value || moving.start } }),
            summary: shortDate(fromIso(date)) + ' – ' + shortDate(fromIso(end)) + ' · ' + plural(runWeeks(ownProgram.blocks, moving.startBlock), 'week'),
            lands: lands.length > 1 ? lands.map((l) => l.name + ' ' + shortDate(l.from) + ' – ' + shortDate(l.to)).join(' · ') : '',
            changed: date !== moving.start,
            busy: logic.busy('moveRun'),
            cancel: () => logic.s({ programMove: null }),
            save: () =>
              logic.saveOnce('moveRun', () => db.moveRun(ownProgram, moving, date, todayIso), (r: { first: string | null }) => ({
                programMove: null,
                ...noticePatch(
                  '“' + ownProgram.name + '” starts ' + shortDate(fromIso(date)) + ' now' + (r.first ? ': its next session is ' + shortDate(fromIso(r.first)) + '.' : '.'),
                  'program',
                ),
              })),
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
            // Week by week, a week taken off takes its own workouts with it, so that asks first.
            fewer:
              b.weeks <= 1
                ? null
                : b.byWeek
                  ? () =>
                      logic.setState({
                        confirm: {
                          kind: 'dropWeek',
                          title: 'Take off week ' + b.weeks + '?',
                          body: 'Its workouts, with their weights and reps, leave the program.',
                          label: 'Take it off',
                          then: () => logic.save(() => db.setBlockWeeks(ownProgram, b, b.weeks - 1, todayIso)),
                        },
                      })
                  : () => logic.save(() => db.setBlockWeeks(ownProgram, b, b.weeks - 1, todayIso)),
            more: b.weeks < 52 ? () => logic.save(() => db.setBlockWeeks(ownProgram, b, b.weeks + 1, todayIso)) : null,
            // Same every week, or each week its own: offered once the program weeks migration has run.
            byWeek: b.byWeek,
            weekModes: model.weeksReady
              ? [
                  { value: 'same', label: 'Same every week' },
                  { value: 'week', label: 'Week by week' },
                ]
              : null,
            setWeekMode: (v: string) =>
              v === 'week'
                ? logic.save(() => db.setBlockByWeek(ownProgram, b, true, todayIso))
                : b.weeks > 1
                  ? logic.setState({
                      confirm: {
                        kind: 'sameEveryWeek',
                        title: 'Make every week the same?',
                        body: 'Every week does week 1’s workouts. Weeks 2' + (b.weeks > 2 ? '–' + b.weeks : '') + ' lose their own weights and reps.',
                        label: 'Same every week',
                        then: () => logic.save(() => db.setBlockByWeek(ownProgram, b, false, todayIso)),
                      },
                    })
                  : logic.save(() => db.setBlockByWeek(ownProgram, b, false, todayIso)),
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
                  remove: () => logic.save(() => db.removeWorkoutFromDay(b, w, d)),
                  removeLabel: 'Take ' + w.name + ' off ' + DOWFULL[d],
                })),
              add: () => logic.s({ programPick: { blockId: b.id, day: d } }),
              addLabel: 'Add a workout on ' + DOWFULL[d],
            })),
            // Week by week: every week listed, each with its own workouts, by weekday. A workout taken off a day comes
            // off that day in every week, as the weeks share their days.
            weekList: b.byWeek
              ? Array.from({ length: b.weeks }, (_, k) => ({
                  key: k + 1,
                  label: 'Week ' + (k + 1),
                  workouts: b.workouts
                    .filter((w) => w.week === k + 1)
                    .flatMap((w) => w.days.map((d) => ({ w, d })))
                    .sort((x, y) => x.d - y.d || x.w.name.localeCompare(y.w.name))
                    .map(({ w, d }) => ({
                      key: w.id + ':' + d,
                      name: dayList([d]) + ' · ' + w.name,
                      meta: w.kind === 'ride' ? '~' + minText(w.minutes) : liftsLine(w.list),
                      open: () => logic.nav(editTemplatePatch(w.id)),
                      openLabel: 'Edit ' + w.name + ', week ' + (k + 1),
                      remove: () => logic.save(() => db.removeWorkoutFromDay(b, w, d)),
                      removeLabel: 'Take ' + w.name + ' off ' + DOWFULL[d] + ' in every week',
                    })),
                }))
              : null,
            addEveryWeek: () => logic.s({ programPick: { blockId: b.id, day: null } }),
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
  // Monday, until another day is picked.
  const pickDay = pick ? (pick.day ?? pick.chosen ?? 1) : 1;
  const programPicker =
    pick && pickBlock && ownProgram
      ? {
          open: true,
          title: pick.day == null ? 'Add to every week' : 'Add to ' + DOWFULL[pick.day],
          // Its day, when it's picked here too.
          dayChoice:
            pick.day == null
              ? {
                  options: Array.from({ length: 7 }, (_, d) => ({ value: String(d), label: DOW3[d].charAt(0) + DOW3[d].slice(1).toLowerCase() })),
                  value: String(pickDay),
                  set: (v: string) => logic.s({ programPick: { ...pick, chosen: Number(v) } }),
                }
              : null,
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
                    logic.save(() => db.addWorkoutToDay(pickBlock, pickDay, copy), { programPick: null });
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
          target: { programId: ownProgram.id } as db.ShareTarget,
          asRan: false,
          name: ownProgram.name,
          snapshot: (o: { notes: boolean; showName: boolean }) =>
            db.programSnapshot(ownProgram, { notes: o.notes, by: o.showName ? displayName(logic.auth.account, logic.model.profile?.name) : null }),
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
    programAdd,
    programMove,
    isProgramEdit: st.screen === 'programEdit',
    programEdit,
    programPicker,
    programShare,
  };
}
