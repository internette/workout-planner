# Workout Planner

"Ritual" is a workout planner with a magical-girl theme. You schedule lifting and cycling sessions on a calendar, tick off exercises as you go, write a short diary entry about how it felt, and earn XP that moves you up a rank ladder. The interface comes from a Claude Design prototype, and everything is saved in Supabase.

## Features

- **Calendar:** day, week and month views, with the current day highlighted and past sessions marked done or missed.
- **Workouts:** lifting sessions (exercises with sets, reps, weight and rest) and cycling sessions (distance, elevation, duration, target effort). Both can repeat weekly for 12 weeks.
- **Progress tracking:** tick exercises off, mark rides complete, and log what you actually rode against the plan.
- **Chronicle:** a diary entry per session with mood, effort (1–5) and notes.
- **Arsenal:** your exercise library, grouped by workout, plus exercises not yet assigned to one.
- **Progress and Profile:** streaks, weekly counts, mood split, personal records, and XP with a 20-step rank ladder (10 XP per exercise, 50 XP per finished workout).

## Getting started

You need Node 20+ and a Supabase project.

```bash
npm install
cp .env.local.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000.

### Environment

`.env.local` needs two values, both from Supabase → Project Settings → API:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The publishable (anon) key |

### Database

The app expects these tables: `workouts`, `workout_exercises`, `plan_entries` and `diary_entries` (created with the original project), plus the additions in [supabase/migrations/20260919000000_planner_persistence.sql](supabase/migrations/20260919000000_planner_persistence.sql):

- `workouts`: `kind` (lift or ride), `duration_minutes`, `icon`, `icon_color`, `target_areas`, and the ride plan fields.
- `plan_entries`: `done_exercises` and the actual ride figures.
- `diary_entries`: `rpe`, and a unique `plan_entry_id` so saving an entry updates the existing one.
- A new `library_exercises` table for the Arsenal.

Run the migration once in the Supabase SQL editor. It is safe to run again.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | Type-check without emitting |

## How it works

```
app/                  Next.js App Router: layout, page, global styles (planner.css)
components/
  Planner.tsx         Host component: loading and error screens, renders the view
  PlannerLoader.tsx   Loads the planner on the client only (its layout depends on window width)
  PlannerView.tsx     The markup for every screen, with no logic of its own
  dcLogic.ts          Small base class that gives the logic its immediate-merge setState
  viewHelpers.tsx     css() and t() helpers used by the view
  ui/icons/           Design-system icons: glyphs, Sparkle, Gem, MoodFace, ExerciseIcon (gallery at /design-system/icons)
  ui/colors/          Design-system colour tokens, published as CSS variables (see /design-system/colors)
  ui/typography/      Design-system type tokens (families, sizes, weights, tracking, leading) as CSS variables
  ui/buttons/         Design-system Button and IconButton (variants, sizes, hover states)
  ui/card/            Design-system Card (raised and overlay surfaces, padding steps, clickable cards)
  ui/segmented-control/  Design-system SegmentedControl (brand and quiet tones, tabs or options, keyboard support)
  ui/chip/            Design-system Chip (info, accent and selectable choice pills)
  ui/text-field/      Design-system TextField, TextArea and Label (filled, title and bare inputs; hint and error)
  planner/
    PlannerLogic.ts   UI state, navigation, loading and saving; renderVals() assembles the view's values
    context.ts        Runs the stages below in order to build a shared context
    stages/           Derived values, built up in order: base (clock, layout), entries, calendar, stats, workout
    screens/          One builder per area of the UI: chrome, calendar, workout, edit, diary, arsenal, progress
    constants.ts      Names, quests, ranks and other fixed data
    helpers.ts        Small pure helpers (ids, ISO dates, quest lookup)
    icons.tsx         Exercise icons and mood faces
    styles.ts         Inline-style builders for active/inactive controls
    types.ts          The loose Ctx type shared by stages and screens
lib/
  supabase.ts         Supabase client
  plannerData.ts      Loads the database into the shapes the UI uses, and all writes
supabase/migrations/  SQL to run in the Supabase SQL editor
```

**Data flow.** On load, `loadModel` reads all five tables and builds one model: exercises by workout, one entry per date, diary entries, ticks and the library. On each render, `PlannerLogic.renderVals()` builds a context from that model plus the UI state (the stages in `planner/stages/`), then each screen builder in `planner/screens/` turns the context into the values and handlers its part of the view needs.

Ticks update the screen immediately. Other saves (creating or editing a workout, diary entries, deletes, the Arsenal) are written to Supabase first. When the writes finish, the model is reloaded and the UI state cleared. Writes run in order, and a failed one shows a dismissible error banner.

**The view is generated.** `PlannerView.tsx` was converted from the design's HTML template by a one-off script and is now ordinary source, so edit it directly. Colours and type are CSS variables such as `var(--color-pink)` and `var(--text-md)` (defined in `components/ui/colors` and `components/ui/typography`). Hover styles from the design are the `.hvN:hover` rules at the bottom of `app/planner.css`, and elements use them by class name.

## Limitations

- **No sign-in.** The tables allow anonymous access with the publishable key, so anyone with that key can read and change your data. Add Supabase Auth and per-user row-level security before sharing the app.
- **One workout per day.** The UI shows one `plan_entries` row per date. A second workout on the same day is stored but not shown.
- **Current year only.** Entries from other years don't appear on the calendar.
- **Free-text exercise fields** such as "4 × 8", "135 lb" and "90 sec" are stored as numbers. Text that doesn't fit those shapes, like "3 × 45s", loses its detail on save.
- **Duplicate exercise rows.** Adding an existing exercise to another workout creates a separate row rather than a link.
- **Fixed profile.** The profile name ("Mika") and start date are constants in `components/planner/constants.ts`.
- **Moods** are stored as `happy`, `neutral`, `sad` or `mad`, the only values the `diary_entries` table accepts.
