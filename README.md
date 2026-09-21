# Workout Planner

"Ritual" is a workout planner with a magical-girl theme. You schedule lifting and cycling sessions on a calendar, tick off exercises as you go, write a short diary entry about how it felt, and earn XP that moves you up a rank ladder. The interface comes from a Claude Design prototype, and everything is saved in Supabase.

## Features

- **Calendar:** day, week and month views, with the current day highlighted and past sessions marked done or missed.
- **Workouts:** lifting sessions (exercises with sets, reps, weight and rest) and cycling sessions (distance, elevation, duration, target effort). Both can repeat weekly for 12 weeks.
- **Progress tracking:** tick exercises off, mark rides complete, and log what you actually rode against the plan.
- **Chronicle:** a diary entry per session with mood, effort (1–5) and notes.
- **Arsenal:** two views, switched with a toggle. **Workouts** lists every saved workout with its exercises and target areas; **Exercises** is your exercise library, grouped by workout, plus exercises not yet assigned to one. Open either to read it without any date, and use Edit to change it. Editing a workout lists its exercises; each has an Edit button that opens the exercise editor and returns to the workout editor afterwards, with your unsaved workout changes kept. Saving a workout that has upcoming sessions asks how to save it. **Update** edits the workout, with an "Also update upcoming sessions" checkbox: ticked, upcoming sessions follow the edit, unticked they stay on the old version. **Save as new** leaves the original and all its sessions alone and saves your changes as a copy of the workout. Saving an exercise always asks. **Update** changes the exercise (in its workout, with the same checkbox for the workout's upcoming sessions); **Save as a new exercise** leaves the original and its workout exactly as they are and adds a separate exercise to the Arsenal's Unassigned group (a taken name becomes "… (copy)"). Exercises are identified by id, never by name, so two with the same name stay two exercises. Either way, past and completed sessions never change.
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

A second migration, [supabase/migrations/20260920000000_workout_snapshots.sql](supabase/migrations/20260920000000_workout_snapshots.sql), adds `workouts.archived`. Editing a workout from the Arsenal (with upcoming sessions updated) saves the old version as an archived copy, so past sessions keep showing what you actually did.

Run both migrations once, in order, in the Supabase SQL editor. They are safe to run again.

### Sign-in

The planner has a landing page with Google and Apple sign-in (at `/welcome`, and at `/` for signed-out visitors when sign-in is required). Auth0 handles the sign-in; Supabase trusts Auth0's token, so row-level security can tell whose data is whose. It is off by default, so the app keeps working until you set it up:

1. **Auth0 application.** Create a *Single Page Application*. Under Settings, add your site's address (`http://localhost:3000` and your production address) to *Allowed Callback URLs*, *Allowed Logout URLs* and *Allowed Web Origins*. The callback address is the site root and the logout address is `/welcome`. Under Advanced Settings → Grant Types, keep *Refresh Token* enabled, and turn on refresh token rotation, since the app renews the person's token with one.
2. **Auth0 connections.** Under Authentication → Social, enable Google and Apple, and turn them on for the application. Google needs an OAuth client from Google Cloud (Auth0's development keys work for testing); Apple needs a Services ID and key from a paid Apple Developer account.
3. **Auth0 role claim.** Under Actions → Library, create a custom Action for the *Login / Post Login* flow, deploy it, and add it to the login flow:

   ```js
   exports.onExecutePostLogin = async (event, api) => {
     api.idToken.setCustomClaim('role', 'authenticated');
   };
   ```

   Supabase reads the person's database role from this claim. It must go on the ID token: Auth0 drops un-namespaced custom claims from access tokens.
4. **Supabase.** Open Authentication → Third-Party Auth, add the Auth0 integration, and enter your tenant id and region. (Tenants signing with HS256 or PS256 are not supported; the default RS256 is.)
5. **Environment.** Put your Auth0 domain and client id in `.env.local` as `NEXT_PUBLIC_AUTH0_DOMAIN` and `NEXT_PUBLIC_AUTH0_CLIENT_ID`, set `NEXT_PUBLIC_AUTH_REQUIRED=true`, and restart the dev server.
6. **Database.** Run [supabase/migrations/20260921000000_per_user_rls.sql](supabase/migrations/20260921000000_per_user_rls.sql) in the SQL editor. It gives every table an owner and lets only that person read or change their rows.

Until steps 1 to 5 are done, the provider buttons say "Sign-in is not set up yet." After step 6 the data you have today is hidden from every account (everyone starts fresh); the last section of the migration shows how to hand it to one account instead.

Two things to know. Google and Apple sign-ins for the same person are **separate Auth0 users** unless you link them, so they would see separate data; Auth0 documents an Action that links accounts by verified email. And the Google and Apple marks in `components/auth/marks.tsx` are drawn approximations: replace them with each provider's official assets before going live. The landing page mentions terms and a privacy policy that do not exist yet.

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
  design-system/      The design-system site at /design-system: overview, sidebar and a page per section (registry.ts lists them)
components/
  Planner.tsx         Host component: loading and error screens, renders the view
  PlannerLoader.tsx   Loads the planner on the client only (its layout depends on window width)
  PlannerView.tsx     The markup for every screen, with no logic of its own
  dcLogic.ts          Small base class that gives the logic its immediate-merge setState
  viewHelpers.tsx     css() and t() helpers used by the view
  ui/icons/           Design-system icons: glyphs, Sparkle, Gem, MoodFace, ExerciseIcon (gallery at /design-system/icons)
  ui/colors/          Design-system colour tokens, plus the crystal gradients and the dialog scrim, published as CSS variables (see /design-system/colors)
  ui/typography/      Design-system type tokens as CSS variables (including two fluid display sizes for marketing pages), plus named text styles and the Text component
  ui/elevation/       Design-system shadow tokens (hairline, raised, overlay) and the primary glow, as CSS variables
  ui/buttons/         Design-system Button and IconButton (variants, sizes, hover states)
  ui/card/            Design-system Card (raised and overlay surfaces, padding steps, clickable cards)
  ui/segmented-control/  Design-system SegmentedControl (brand and quiet tones, tabs or options, keyboard support)
  ui/chip/            Design-system Chip (info, accent and selectable choice pills)
  ui/text-field/      Design-system TextField, TextArea and Label (filled, title and bare inputs; hint and error)
  ui/checkbox/        Design-system Checkbox (a tick box with its label; native checkbox, or a switch role)
  ui/option-card/     Design-system OptionCard and OptionGroup (one answer per card, a native radio underneath)
  ui/dialog/          Design-system Dialog (a native <dialog>: top layer, inert page, Escape and focus handled by the browser)
  ui/popover/         Design-system Popover (the popover attribute: top layer, dismissed on Escape or an outside press)
  auth/               The landing page and sign-in with Auth0: AuthGate, AuthProvider, LandingPage and the provider buttons
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
  auth.ts             Auth0 settings, the connection names, the ID-token hook Supabase reads, and the NEXT_PUBLIC_AUTH_REQUIRED switch
  plannerData.ts      Loads the database into the shapes the UI uses, and all writes
supabase/migrations/  SQL to run in the Supabase SQL editor
```

**Data flow.** On load, `loadModel` reads all five tables and builds one model: exercises by workout, one entry per date, diary entries, ticks and the library. On each render, `PlannerLogic.renderVals()` builds a context from that model plus the UI state (the stages in `planner/stages/`), then each screen builder in `planner/screens/` turns the context into the values and handlers its part of the view needs.

Ticks update the screen immediately. Other saves (creating or editing a workout, diary entries, deletes, the Arsenal) are written to Supabase first. When the writes finish, the model is reloaded and the UI state cleared. Writes run in order, and a failed one shows a dismissible error banner.

**The view is generated.** `PlannerView.tsx` was converted from the design's HTML template by a one-off script and is now ordinary source, so edit it directly. Colours and type are CSS variables such as `var(--color-pink)` and `var(--text-md)` (defined in `components/ui/colors` and `components/ui/typography`). Hover styles from the design are the `.hvN:hover` rules at the bottom of `app/planner.css`, and elements use them by class name.

## Limitations

- **Sign-in is off until you turn it on.** Until the steps under Sign-in are done, the tables allow anonymous access with the publishable key, so anyone with that key can read and change your data. Do not share or deploy the app before then.
- **One workout per day.** The UI shows one `plan_entries` row per date. A second workout on the same day is stored but not shown.
- **Current year only.** Entries from other years don't appear on the calendar.
- **Free-text exercise fields** such as "4 × 8", "135 lb" and "90 sec" are stored as numbers. Text that doesn't fit those shapes, like "3 × 45s", loses its detail on save.
- **Duplicate exercise rows.** Adding an existing exercise to another workout creates a separate row rather than a link.
- **Fixed profile.** The profile name ("Mika") and start date are constants in `components/planner/constants.ts`.
- **Moods** are stored as `happy`, `neutral`, `sad` or `mad`, the only values the `diary_entries` table accepts.
