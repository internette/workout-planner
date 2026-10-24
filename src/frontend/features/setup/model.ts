// "Customize your experience": who they are and their color, what they train, what they have, when training fits, and
// a first program picked from that, then a send-off. Offered with the tour when a new account first opens the app, and
// from Settings any time. The answers are saved as their profile once they choose how to begin; the color, like the
// one in Settings, is kept on this device and changes as they pick it.
import { savedAccent, setAccent, type Accent } from '@moonshot/design-system/theme';
import { DOW3, DOWFULL, EQUIPMENT, MON3, RANKS } from '@/frontend/shared/constants';
import { isoOf, monthPatch, noticePatch, plural, questSeed } from '@/frontend/shared/helpers';
import { kitChip } from '@/frontend/shared/equipment';
import { iconSvg } from '@/frontend/shared/icons';
import * as db from '@/frontend/data/plannerData';
import type { Profile } from '@/frontend/data/plannerData';
import type { Ctx } from '../planner/store/types';
import { suggestProgram } from './suggest';

/** Where they are in it and what they've said so far. */
export interface SetupDraft {
  /** 0 to 4 the questions, 5 the send-off. */
  step: number;
  name: string;
  accent: Accent;
  /** The color before they started, put back if they leave with the defaults. */
  was: Accent;
  trains: Profile['trains'];
  /** Null until they've said; empty is bodyweight only. */
  kit: string[] | null;
  days: number[];
  minutes: number;
  start: string;
  /** What starting the suggested program put on the calendar, for the send-off. */
  started: { name: string; count: number; first: string | null } | null;
}

export const SETUP_STEPS = 5;

// What they might have, in a few words each: the equipment each stands for. "Just me" is bodyweight only, and a full
// gym is all of it.
const KIT: { label: string; items: string[] }[] = [
  { label: 'Just me', items: [] },
  { label: 'Resistance bands', items: ['Resistance band'] },
  { label: 'Dumbbells', items: ['Dumbbells'] },
  { label: 'Kettlebell', items: ['Kettlebell'] },
  { label: 'Barbell', items: ['Barbell', 'Weight plate'] },
  { label: 'Bench', items: ['Bench'] },
  { label: 'Pull-up bar', items: ['Pull-up bar'] },
  { label: 'A full gym', items: EQUIPMENT },
];
const TRAINS: { value: Profile['trains'][number]; title: string; line: string }[] = [
  { value: 'lift', title: 'Lifting', line: 'Sets, reps and weight.' },
  { value: 'ride', title: 'Cycling', line: 'Distance, time and effort.' },
  { value: 'stretch', title: 'Stretching', line: 'Warm-ups and mobility.' },
  { value: 'yoga', title: 'Yoga', line: 'Flows and holds.' },
  { value: 'run', title: 'Run/Walk', line: 'Distance, time and effort, on foot.' },
];
const MINUTES = [20, 30, 45, 60];

const fromIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const shortDay = (d: Date) => DOWFULL[d.getDay()].slice(0, 3) + ', ' + MON3[d.getMonth()] + ' ' + d.getDate();
const minutesText = (n: number) => (n === 60 ? '1 hour' : n + ' min');

/** A new draft, from what they said last time, or the defaults. */
export function newSetup(profile: Profile | null, signInName: string): SetupDraft {
  const today = new Date();
  const accent = savedAccent();
  return {
    step: 0,
    name: profile?.name || signInName,
    accent,
    was: accent,
    trains: profile?.trains.length ? profile.trains : ['lift'],
    kit: profile?.equipment ?? null,
    days: profile?.days.length ? profile.days : [1, 3, 5],
    minutes: profile?.minutes ?? 45,
    // Programs run Sunday to Saturday, so a first week begins on a Sunday: today if it is one, else the next.
    start: isoOf(new Date(today.getFullYear(), today.getMonth(), today.getDate() + ((7 - today.getDay()) % 7))),
    started: null,
  };
}

export function setupVals(ctx: Ctx) {
  const { logic, st, Y, derivedRank } = ctx;
  const d = st.setup;
  if (!d) return { setup: null };
  const model = logic.model;
  const todayIso = isoOf(new Date());
  const set = (patch: Partial<SetupDraft>) => logic.s({ setup: { ...d, ...patch } });
  const go = (step: number) => set({ step });
  const profile: Profile = { name: d.name.trim() || null, trains: d.trains, equipment: d.kit, days: d.days, minutes: d.minutes };
  const catalog = model.builtinWorkouts || [];
  const suggestion = d.step >= 3 ? suggestProgram(profile, model.builtinPrograms || [], catalog) : null;
  const rank = RANKS[derivedRank] ?? RANKS[0];
  const nextRank = RANKS[derivedRank + 1]?.name ?? '';

  // Saves what they said (once the profiles migration has run), and starts the suggested program if they chose it.
  const finish = (how: 'start' | 'plan' | 'later') =>
    logic.saveOnce(
      'setup',
      async () => {
        if (model.profileReady) await db.saveProfile(profile);
        if (how !== 'start' || !suggestion) return null;
        const id = await db.copyBuiltinProgram(suggestion.program, catalog);
        const own = (await db.loadModel(new Date())).programs.find((p) => p.id === id)!;
        const start = d.start < todayIso ? todayIso : d.start;
        const r = await db.startProgram(own, start, 0, todayIso, { name: own.name, snapshot: db.programSnapshot(own, { notes: true, by: null }) });
        return { name: own.name, count: r.count, first: r.first };
      },
      (started: SetupDraft['started']) => (how === 'plan' ? { setup: null } : { setup: { ...d, step: SETUP_STEPS, started } }),
    );

  // The send-off's first quest: the first session the program put on, its quest, and its workout.
  const first = d.started?.first ? fromIso(d.started.first) : null;
  const firstWorkout = first ? model.entries.find((e) => e.iso === d.started!.first && e.av.program)?.av : null;
  const firstList = firstWorkout ? model.EXV[firstWorkout.exKey] || [] : [];

  return {
    setup: {
      step: d.step,
      steps: SETUP_STEPS,
      busy: logic.busy('setup'),
      back: d.step > 0 && d.step < SETUP_STEPS ? () => go(d.step - 1) : null,
      // Leaves the questions with nothing saved: the color goes back to what it was, and the send-off follows.
      useDefaults: () => {
        setAccent(d.was);
        set({ step: SETUP_STEPS, accent: d.was, started: null });
      },
      next: () => go(d.step + 1),

      // 0: who they are, and their color
      name: d.name,
      setName: (e: { target: { value: string } }) => set({ name: e.target.value }),
      rankName: rank.name,
      accent: d.accent,
      setAccent: (a: string) => {
        setAccent(a as Accent);
        set({ accent: a as Accent });
      },
      canNameNext: !!d.name.trim(),

      // 1: what they train
      // Run/Walk once the database can save it.
      trains: TRAINS.filter((t) => t.value !== 'run' || model.runReady).map((t) => ({
        ...t,
        on: d.trains.includes(t.value),
        toggle: () => set({ trains: d.trains.includes(t.value) ? d.trains.filter((x) => x !== t.value) : TRAINS.map((x) => x.value).filter((x) => x === t.value || d.trains.includes(x)) }),
      })),
      canTrainsNext: d.trains.length > 0,

      // 2: what they have
      kit: KIT.map((k) => {
        const on = d.kit != null && (k.items.length ? k.items.every((x) => d.kit!.includes(x)) : !d.kit.length);
        return {
          label: k.label,
          on,
          toggle: () =>
            set({
              kit: !k.items.length
                ? []
                : on
                  ? (d.kit || []).filter((x) => !k.items.includes(x))
                  : EQUIPMENT.filter((x) => k.items.includes(x) || (d.kit || []).includes(x)),
            }),
        };
      }),
      canKitNext: d.kit != null,

      // 3: when training fits
      days: d.days,
      toggleDay: (day: number) => set({ days: d.days.includes(day) ? d.days.filter((x) => x !== day) : [...d.days, day].sort((a, b) => a - b) }),
      minutes: String(d.minutes),
      minuteOptions: MINUTES.map((m) => ({ value: String(m), label: minutesText(m) })),
      setMinutes: (v: string) => set({ minutes: Number(v) }),
      rhythm: plural(d.days.length, 'day') + ' a week, about ' + (d.minutes === 60 ? 'an hour' : d.minutes + ' minutes') + ' each.',
      canDaysNext: d.days.length > 0,

      // 4: where to begin
      suggestion: suggestion
        ? {
            name: suggestion.program.name,
            meta: [plural(suggestion.program.weeks, 'week'), plural(suggestion.days, 'day') + ' a week', '~' + suggestion.minutes + ' min'].join(' · '),
            kit: kitChip({ need: suggestion.need, complete: true }) ?? '',
            strip: suggestion.week.map((w, day) => ({
              letter: DOW3[day].charAt(0),
              label: DOWFULL[day] + ': ' + (w ? w.name : 'Rest'),
              svg: w ? iconSvg(w.icon || 'h') : null,
            })),
            start: d.start,
            min: todayIso,
            setStart: (e: { target: { value: string } }) => set({ start: e.target.value || todayIso }),
          }
        : null,
      // Why nothing ready-made: they don't lift (every built-in program is lifting), or none fits what they have.
      noSuggestion: d.trains.includes('lift')
        ? 'None of the ready-made programs fits what you have yet. Plan a workout of your own, and repeat it weekly if it works.'
        : 'The ready-made programs are all lifting for now. Plan a ride, a run, a stretch or a flow on any day.',
      startProgram: () => finish('start'),
      planOne: () => {
        logic.s({ setup: null });
        logic.renderVals().goNewWorkout();
        finish('plan');
      },
      later: () => finish('later'),

      // 5: the send-off
      finaleName: (d.name.trim() || 'You') + ', ' + rank.name,
      finaleLine:
        (d.started?.count
          ? (d.started.count === 1 ? '1 session is' : d.started.count + ' sessions are') + ' on your calendar. '
          : 'Plan a workout and that day gets a quest. ') + (nextRank ? 'Every exercise you clear moves you toward ' + nextRank + '.' : ''),
      firstQuest: first
        ? {
            when: 'Your first quest · ' + shortDay(first),
            title: questSeed(first.getDate(), (first.getFullYear() - Y) * 12 + first.getMonth()).title,
            line: firstWorkout ? [firstWorkout.name, plural(firstList.length, 'exercise'), firstWorkout.time].filter(Boolean).join(' · ') : d.started!.name,
          }
        : null,
      takeTour: () => {
        logic.s({ setup: null, screen: 'day', ...monthPatch(new Date().getMonth()), day: new Date().getDate(), seg: 'Day', monthOpen: false, creating: false, tour: 1 });
      },
      toCalendar: () => {
        // With a program started, its first week; otherwise today.
        const at = first ?? new Date();
        logic.s({
          setup: null,
          screen: 'day',
          seg: first ? 'Week' : 'Day',
          ...monthPatch((at.getFullYear() - Y) * 12 + at.getMonth()),
          day: at.getDate(),
          monthOpen: false,
          creating: false,
          ...(d.started?.count ? noticePatch('“' + d.started.name + '” begins: ' + plural(d.started.count, 'session') + ' on your calendar from ' + MON3[at.getMonth()] + ' ' + at.getDate() + '.', 'day') : {}),
        });
      },
    },
  };
}
