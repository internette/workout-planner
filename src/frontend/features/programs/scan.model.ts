// Turning what's left of the calendar's weekly repeats into a program: the Programs tab's card, what the scan found
// (its weeks, and ticking workouts in or out), then naming it and choosing what happens to the sessions already there.
import { DOW3, DOWFULL, MON3 } from '@/frontend/shared/constants';
import { isoOf, noticePatch, plural } from '@/frontend/shared/helpers';
import { iconSvg } from '@/frontend/shared/icons';
import { programOfWorkout } from '@/frontend/shared/programs';
import { dayNames } from '@/frontend/shared/schedule';
import { scanCalendar, scanKey, type Scan, type ScanSession } from '@/frontend/shared/scan';
import * as db from '@/frontend/data/plannerData';
import type { Entry } from '@/frontend/data/plannerData';
import type { Ctx } from '../planner/store/types';

const DISMISSED_KEY = 'moonshot.scanDismissed';

const fromIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const shortDate = (iso: string) => {
  const d = fromIso(iso);
  return MON3[d.getMonth()] + ' ' + d.getDate();
};
const nextSunday = (today: Date) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + (7 - today.getDay()));
const weeksLabel = (from: number, weeks: number) => (weeks === 1 ? 'Week ' + from : 'Weeks ' + from + '–' + (from + weeks - 1));
/** "Mondays", "Tuesdays and Thursdays". */
const daysPlural = (days: number[]) => dayNames(days).replace(/day\b/g, 'days');

/** The name a program made in this season gets to start with. */
const seasonName = (iso: string) => ['Winter', 'Winter', 'Spring', 'Spring', 'Spring', 'Summer', 'Summer', 'Summer', 'Fall', 'Fall', 'Fall', 'Winter'][fromIso(iso).getMonth()] + ' routine';
/** Blocks' first names: plain steps up for two or three, numbered past that. A block with nothing in it is a rest. */
const blockNames = (s: Scan) =>
  s.blocks.map((b, i) => (!b.workouts.length ? 'Rest' : s.blocks.length === 1 ? 'Block 1' : s.blocks.length <= 3 ? ['Base', 'Build', 'Peak'][i] : 'Block ' + (i + 1)));

const readDismissed = () => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(DISMISSED_KEY);
  } catch {
    return null;
  }
};

export function scanVals(ctx: Ctx) {
  const { logic, st } = ctx;
  const model = logic.model;
  const today = new Date();
  const todayIso = isoOf(today);
  const ready = !!model.programsReady;

  const sessions: ScanSession[] = model.entries.map(({ iso, av }) => ({
    id: av.id,
    iso,
    name: av.name,
    series: !!av.series,
    done: av.s === 'c',
    inProgram: !!av.program || !!programOfWorkout(model, av.workoutId),
  }));
  const byId: Record<string, { iso: string; av: Entry }> = {};
  model.entries.forEach((e) => (byId[e.av.id] = e));

  const all = ready ? scanCalendar(sessions, todayIso) : null;
  const open = () => {
    logic.nav({
      screen: 'programScan',
      programScan: { step: all ? 'found' : 'none', id: null, off: [], name: null, blockNames: null, keep: true, endSeries: true, date: isoOf(nextSunday(today)) },
    });
  };

  // ---- The Programs tab's card, unless it was put aside.
  const offer = all;
  const hidden = offer && (st.scanHidden === scanKey(offer) || readDismissed() === scanKey(offer));
  const scanCard =
    offer && !hidden
      ? {
          title: 'Your calendar has a program in it',
          body:
            plural(offer.names.length, 'workout') +
            (offer.names.length === 1 ? ' repeats' : ' repeat') +
            ' every week through ' +
            shortDate(offer.end) +
            ', outside any program. Turn them into one to see where you are, share it, or run it again.',
          go: open,
          notNow: () => {
            const key = scanKey(offer);
            try {
              window.localStorage.setItem(DISMISSED_KEY, key);
            } catch {
              // No storage: hidden until the page reloads.
            }
            logic.s({ scanHidden: key });
          },
        }
      : null;

  // ---- The flow
  const f = st.programScan || null;
  const off = new Set(f?.off || []);
  const scan = f && all ? scanCalendar(sessions, todayIso, new Set(all.names.filter((n) => !off.has(n)))) : null;
  const set = (patch: Partial<NonNullable<typeof f>>) => f && logic.s({ programScan: { ...f, ...patch } });

  // A workout as the scan shows it: from its latest session (the version the program copies).
  const latest = (name: string) => {
    const ids = (all?.series || []).filter((id) => byId[id]?.av.name === name);
    const pickFrom = ids.map((id) => byId[id]).sort((a, b) => (a.iso < b.iso ? 1 : -1));
    return pickFrom.find((e) => model.workouts.some((w) => w.id === e.av.workoutId)) || pickFrom[0] || null;
  };
  const row = (name: string, days: number[] | null) => {
    const e = latest(name);
    const av = e?.av;
    const meta = av ? (av.ride ? [av.ride.dist ? av.ride.dist + ' mi' : '', av.time].filter(Boolean)[0] : plural((model.EXV[av.exKey] || []).length, 'exercise')) : '';
    return {
      key: name,
      name,
      meta: (days ? daysPlural(days) + ' · ' : '') + meta,
      svg: iconSvg(av?.icon || (av?.ride ? 'bike' : 'h'), av?.iconColor || undefined),
      on: !off.has(name),
      toggle: () => set({ off: off.has(name) ? [...off].filter((n) => n !== name) : [...off, name] }),
    };
  };

  const names = scan && f ? f.blockNames && f.blockNames.length === scan.blocks.length ? f.blockNames : blockNames(scan) : [];

  const found =
    f && f.step === 'found' && scan && all
      ? (() => {
          const seen = new Set<string>();
          let before = 0;
          const blocks = scan.blocks.map((b, i) => {
            const from = before + 1;
            before += b.weeks;
            const prev = i > 0 ? scan.blocks[i - 1] : null;
            const fresh = b.workouts.filter((w) => !seen.has(w.name));
            fresh.forEach((w) => seen.add(w.name));
            // From the second block on: what changed from the one before.
            let change = '';
            if (prev) {
              const gone = prev.workouts.filter((w) => !b.workouts.some((x) => x.name === w.name)).map((w) => w.name);
              const moved = b.workouts
                .filter((w) => {
                  const p = prev.workouts.find((x) => x.name === w.name);
                  return p && p.days.join() !== w.days.join();
                })
                .map((w) => w.name + ' on ' + daysPlural(w.days));
              const added = b.workouts.filter((w) => !prev.workouts.some((x) => x.name === w.name));
              const seenAdded = added.filter((w) => !fresh.includes(w)).map((w) => w.name + ' on ' + daysPlural(w.days));
              const parts = [gone.length ? 'without ' + gone.join(', ') : '', ...moved, ...seenAdded.map((x) => 'plus ' + x)].filter(Boolean);
              change = !b.workouts.length
                ? 'Nothing repeats these weeks.'
                : 'The same' + (parts.length ? ', ' + parts.join(', ') : '') + (fresh.length ? ', plus:' : '.');
            }
            return {
              key: String(i),
              title: weeksLabel(from, b.weeks),
              strip: Array.from({ length: 7 }, (_, d) => {
                const on = b.workouts.filter((w) => w.days.includes(d));
                const e = on.length ? latest(on[0].name) : null;
                return {
                  letter: DOW3[d].charAt(0),
                  label: DOWFULL[d] + ': ' + (on.length ? on.map((w) => w.name).join(', ') : 'Rest'),
                  icon: e ? iconSvg(e.av.icon || (e.av.ride ? 'bike' : 'h'), e.av.iconColor || undefined) : undefined,
                };
              }),
              change,
              workouts: fresh.map((w) => row(w.name, w.days)),
            };
          });
          const oneOffs = scan.oneOffs.map((id) => byId[id]).filter(Boolean);
          const listed = oneOffs.slice(0, 3).map((e) => e.av.name + ' ' + shortDate(e.iso));
          return {
            title: plural(scan.weeks, 'week') + (scan.blocks.length > 1 ? ', ' + plural(scan.blocks.length, 'block') : ''),
            meta: scan.weeks
              ? 'This week to ' + shortDate(scan.end) + ' · ' + plural(scan.sessions.length, 'session') + ' left'
              : 'Nothing ticked',
            bar: scan.blocks.map((b, i) => ({ name: weeksLabel(scan.blocks.slice(0, i).reduce((s, x) => s + x.weeks, 0) + 1, b.weeks), weeks: b.weeks })),
            blocks,
            leftOut: all.names.filter((n) => off.has(n)).map((n) => row(n, null)),
            oneOffs: oneOffs.length
              ? 'Left out: ' +
                plural(oneOffs.length, 'one-off session') +
                ' (' +
                listed.join(', ') +
                (oneOffs.length > listed.length ? ' and ' + (oneOffs.length - listed.length) + ' more' : '') +
                ')'
              : '',
            canNext: scan.blocks.some((b) => b.workouts.length > 0),
            next: () => set({ step: 'name' }),
          };
        })()
      : null;

  const seriesWorkouts = () => Array.from(new Set((scan?.sessions || []).map((id) => byId[id]?.av).filter((av) => av && av.repeat).map((av) => av!.workoutId)));
  const name = f && scan ? (f.name ?? seasonName(scan.start)) : '';
  const naming =
    f && f.step === 'name' && scan
      ? {
          name,
          setName: (e) => set({ name: e.target.value }),
          blocks:
            scan.blocks.length > 1
              ? names.map((n, i) => ({
                  key: String(i),
                  label: 'Block ' + (i + 1),
                  value: n,
                  set: (e) => set({ blockNames: names.map((x, j) => (j === i ? e.target.value : x)) }),
                }))
              : [],
          keep: f.keep,
          setKeep: (v: string) => set({ keep: v === 'keep' }),
          keepNote:
            (scan.sessions.length === 1 ? 'The session left becomes' : 'The ' + scan.sessions.length + ' sessions left become') +
            ' its run, through ' +
            shortDate(scan.end) +
            ': tagged, and any workout ending sooner is added to the weeks it misses. Past ones stay as they are.',
          freshNote: 'The sessions left come off, and the program starts from a date you pick. Past ones stay.',
          date: f.date < todayIso ? todayIso : f.date,
          min: todayIso,
          setDate: (e) => set({ date: e.target.value || todayIso }),
          endSeries: f.endSeries,
          setEndSeries: (on: boolean) => set({ endSeries: on }),
          back: () => set({ step: 'found' }),
          busy: logic.busy('scanProgram'),
          canMake: !!name.trim(),
          make: () => {
            const date = f.date < todayIso ? todayIso : f.date;
            const programName = name.trim();
            logic.saveOnce(
              'scanProgram',
              () => {
                const blocks = scan.blocks.map((b, i) => ({
                  name: (names[i] || '').trim(),
                  weeks: b.weeks,
                  workouts: b.workouts.map((w) => ({ days: w.days, workout: db.entryCopy(model, latest(w.name)!.av) })),
                }));
                return db.programFromCalendar({
                  name: programName,
                  blocks,
                  snapshot: db.copiesSnapshot(blocks),
                  start: scan.start,
                  sessions: scan.sessions.map((id) => ({ id, iso: byId[id].iso, name: byId[id].av.name })),
                  taken: model.entries.map((e) => e.av.name + '|' + e.iso),
                  seriesWorkouts: seriesWorkouts(),
                  keep: f.keep,
                  freshStart: date,
                  endSeries: f.endSeries,
                  todayIso,
                });
              },
              (r: { programId: string; count: number; first: string | null }) => ({
                screen: 'program',
                programId: r.programId,
                programScan: null,
                programOpenBlocks: {},
                programStart: null,
                programShareOpen: false,
                // Back from the program goes where the scan was opened from, unless that was a session starting afresh
                // took off the calendar: then up to the Spellbook.
                ...(f.keep ? {} : { hist: [] }),
                ...noticePatch(
                  f.keep
                    ? 'Made “' + programName + '” from your calendar: ' + plural(r.count, 'session') + ' through ' + shortDate(scan.end) + (r.count === 1 ? ' is' : ' are') + ' part of it now.'
                    : '“' + programName + '” begins: ' + plural(r.count, 'session') + ' on your calendar from ' + shortDate(r.first || date) + '.',
                  'program',
                ),
              }),
            );
          },
        }
      : null;

  const nothing =
    f && (f.step === 'none' || !all)
      ? {
          title: 'No pattern to make a program from',
          body: 'Nothing left on your calendar outside a program repeats on the same day week to week.',
          saveWeek: () =>
            logic.s({
              screen: 'day',
              seg: 'Week',
              programScan: null,
              hist: [],
              ...noticePatch('Pick a week, then use “Save as program” to make it one.', 'day'),
            }),
        }
      : null;

  return {
    scanCard,
    // A session in a weekly series that no program put there can start the scan from its page.
    makeProgram: (() => {
      const e = st.screen === 'detail' && st.entryId ? byId[st.entryId] : null;
      return ready && e && e.av.series && !e.av.program && !programOfWorkout(model, e.av.workoutId) ? open : null;
    })(),
    isProgramScan: st.screen === 'programScan',
    scanFound: found,
    scanNaming: naming,
    scanNothing: nothing,
  };
}

