# Workout Planner

"Moonshot" is a workout planner with a magical-girl theme. You schedule lifting and cycling sessions on a calendar, tick off exercises as you go, write a short diary entry about how it felt, and earn XP that moves you up a rank ladder. The interface comes from a Claude Design prototype, and everything is saved in Supabase.

## Features

- **Calendar:** day, week and month views, with the current day highlighted and past sessions marked done or missed. A day can hold more than one workout: Day and Week views list each one, and a day counts as done (for its marker, the streak and its quest) once all of them are.
- **Workouts:** lifting sessions (exercises with sets, reps, weight and rest) and cycling sessions (distance, elevation, duration, target effort). Both can repeat weekly for 12 weeks. Workout names are unique (ignoring case): a name that's already taken can't be saved, and when adding to the calendar the editor offers to schedule the saved workout of that name instead. A workout left unnamed is saved as "Untitled workout", "Untitled workout 2" and so on. Editing a session from the calendar changes only that session's date, the ride you entered and repeat without asking; a change to the workout itself (name, icon, notes, ride plan, exercises) asks **Only this session** (the default: the session gets its own copy, and the saved workout and its other sessions stay as they are) or **This session and the saved workout** (upcoming sessions follow too). Past and completed sessions never change.
- **Progress tracking:** tick exercises off, mark rides complete, and enter what you actually rode against the plan.
- **Chronicle:** a diary entry per session with mood, effort (1–5) and notes.
- **Spellbook** (formerly the Spellbook): two views, switched with a toggle. **Workouts** lists every saved workout with its exercises and target areas; **Exercises** is your exercise library, grouped by workout, plus exercises not yet assigned to one. Open either to read it without any date, and use Edit to change it. A saved workout's page has **Add to calendar**: pick a day this year, and optionally repeat it weekly for 12 more weeks; the page then says where it went, with a View day link. Editing a workout lists its exercises; each has an Edit button that opens the exercise editor and returns to the workout editor afterwards, with your unsaved workout changes kept. Saving a workout that has upcoming sessions asks how to save it. **Update** edits the workout, with an "Also update upcoming sessions" checkbox: ticked, upcoming sessions follow the edit, unticked they stay on the old version. **Save as new** leaves the original and all its sessions alone and saves your changes as a copy of the workout. Saving an exercise always asks. **Update** changes the exercise (in its workout, with the same checkbox for the workout's upcoming sessions); **Save as a new exercise** leaves the original and its workout exactly as they are and adds a separate exercise to the Spellbook's Unassigned group (a taken name becomes "… (copy)"). Exercises are identified by id, never by name, so two with the same name stay two exercises. Either way, past and completed sessions never change.
- **Plans from Claude or ChatGPT:** with Moonshot added to the assistant as a connector (see "Assistant connector" below), the assistant reads the person's Spellbook and calendar, asks what it needs, and sends a plan back. It shows on the Calendar as a card, saying which assistant sent it, and opens as a draft to look over: **Add N workouts** puts it on the calendar, **Ask Claude for changes** (or ChatGPT) opens that assistant to change it (the new version arrives as a new card), **Let it fade** discards it. Nothing is added without that step.
- **Progress and Profile:** streaks, weekly counts, mood split, personal records, and XP with a 20-step rank ladder (10 XP per exercise, 50 XP per finished workout). Reaching a new rank plays a short transformation sequence the first time you see it, wherever you are in the app (usually right as you tick the exercise that earns it); with reduced motion it shows the finished card. The highest rank already celebrated is kept per account in the browser, so a first visit on a new device records your rank quietly, and a rank that drops and is earned back doesn't replay.

## Addresses

Each nav item has its own address: `/calendar` (opens on today's Day view), `/chronicle`, `/spellbook`, `/progress` and `/profile`. `/` goes to `/calendar`, and so does signing in. The nav items are real links, so they open in a new tab, and Back and Forward move between the places you have been. The planner stays loaded as you move between them. Screens inside a flow (an entry form, a workout editor) do not have addresses of their own yet; they keep the address of the nav item they were opened from. `/arsenal`, the Spellbook's old address, redirects to `/spellbook`. `/welcome` is the sign-in page and `/design-system` is the design-system site.

## Getting started

You need Node 20+ and a Supabase project.

```bash
npm install
cp .env.local.example .env.local   # then fill in the values
npm run dev
```

Open http://localhost:3000. The design-system site is a separate app: run `npm run dev:design-system` alongside, and
http://localhost:3000/design-system shows it (or open http://localhost:3001/design-system directly).

### Environment

`.env.local` needs two values, both from Supabase → Project Settings → API:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The publishable (anon) key |

### Vendor features

Some features rely on another company's service: signing in with **Google** or **Apple**, and plans from **Claude** or **ChatGPT**. Each has an on/off switch in `vendors.config.ts` (`true` to offer it, `false` to turn it off); change it and redeploy.

- A sign-in provider that's off has no button on the front door, and `/auth/login` refuses it (and refuses a login with no provider named, which would otherwise show Auth0's page with every one). With both off, the front door says sign-in is closed. People already signed in stay signed in until their session ends.
- An assistant that's off is left out of plan reviews, and the connector refuses its sign-ins, even with a token it already holds. With both off, plan cards don't show and `/api/mcp` answers 503. ChatGPT also needs `NEXT_PUBLIC_CHATGPT_OAUTH_CLIENT_ID`.

### Database

The app expects these tables: `workouts`, `workout_exercises`, `plan_entries` and `diary_entries` (created with the original project), plus the additions in [supabase/migrations/20260919000000_planner_persistence.sql](supabase/migrations/20260919000000_planner_persistence.sql):

- `workouts`: `kind` (lift or ride), `duration_minutes`, `icon`, `icon_color`, `target_areas`, and the ride plan fields.
- `plan_entries`: `done_exercises` and the actual ride figures.
- `diary_entries`: `rpe`, and a unique `plan_entry_id` so saving an entry updates the existing one.
- A new `library_exercises` table for the Spellbook.

A second migration, [supabase/migrations/20260920000000_workout_snapshots.sql](supabase/migrations/20260920000000_workout_snapshots.sql), adds `workouts.archived`. Editing a workout from the Spellbook (with upcoming sessions updated) saves the old version as an archived copy, so past sessions keep showing what you actually did.

Later migrations:

- [20260922000000_workout_notes.sql](supabase/migrations/20260922000000_workout_notes.sql) adds `workouts.notes`.
- [20260924000000_exercise_target_areas.sql](supabase/migrations/20260924000000_exercise_target_areas.sql) adds `target_areas` to `workout_exercises` and `library_exercises`. A workout's target areas are now the union of its exercises' (the old `workouts.target_areas` column is no longer read).
- [20260925000000_builtin_exercises.sql](supabase/migrations/20260925000000_builtin_exercises.sql) adds `builtin_exercises`, a shared catalog of 100 beginner exercises every account sees in its Spellbook. It is read-only to everyone (a read policy, no write policy); a person copies one to change it.
- [20260926000000_workout_snapshot_source.sql](supabase/migrations/20260926000000_workout_snapshot_source.sql) adds `workouts.source_workout_id`, linking each archived copy to the workout it came from. Deleting a workout then also removes its upcoming sessions left on those copies, even after a rename. Until it runs, copies are matched by name.

- [20260927000000_gym_equipment_exercises.sql](supabase/migrations/20260927000000_gym_equipment_exercises.sql) adds 20 built-in exercises for cable-trainer, lat pulldown / low row, glute-ham developer, plyo box and pull-up bar work. Exercises already in the catalog aren't added again.
- [20260928000000_builtin_workouts.sql](supabase/migrations/20260928000000_builtin_workouts.sql) adds `builtin_workouts`: 30 beginner workouts, built from the built-in exercises, that every account sees in its Spellbook under its own workouts. Adding one to the calendar, or copying it, saves it to that person's workouts first.
- [20260929000000_exercise_equipment.sql](supabase/migrations/20260929000000_exercise_equipment.sql) adds `equipment` to built-in exercises, your own exercises and the exercises in workouts: what each needs, from a fixed list (dumbbells, cable machine, leg press, bench, ...). Empty is bodyweight. It fills in the built-in exercises, and copies of them (by name) that people already have. Until it runs, the app shows no equipment.
- [20260930000000_warmups.sql](supabase/migrations/20260930000000_warmups.sql) adds `is_warmup` to workouts and built-in workouts, nine bodyweight warm-up exercises to the built-in catalog, and five built-in warm-ups. A warm-up is listed first on its day, tagged WARM-UP, and has its own Spellbook filter. Until it runs, the app has no Warm-up switch.

- [20261001000000_plan_drafts.sql](supabase/migrations/20261001000000_plan_drafts.sql) adds `plan_drafts`: plans Claude sends through the connector, waiting to be added or discarded. Each person sees only their own. Until it runs, the Calendar shows no waiting plans and the connector can't save one.

Run the migrations once, in order, in the Supabase SQL editor. They are safe to run again.

### Sign-in

The planner has a landing page with Google and Apple sign-in (at `/welcome`; anyone who is not signed in is sent there from every other page except `/design-system`). Auth0 handles the sign-in on the server: the session lives in an encrypted cookie the page cannot read, and a middleware guards the planner. Supabase trusts an Auth0 token, so row-level security can tell whose data is whose. Until it is set up nobody can sign in, so everyone sees the landing page. To work on the app locally before then, put `NEXT_PUBLIC_AUTH_REQUIRED=false` in `.env.local`. Setup:

1. **Auth0 application.** Create a *Regular Web Application* (not a single-page one: it has a client secret). Under Settings, add `http://localhost:3000/auth/callback` (and your production address's `/auth/callback`) to *Allowed Callback URLs*, and `http://localhost:3000/welcome` (and the production equivalent) to *Allowed Logout URLs*. Under Advanced Settings → Grant Types, keep *Refresh Token* enabled.
2. **Auth0 connections.** Under Authentication → Social, enable Google and Apple, and turn them on for the application. Google needs an OAuth client from Google Cloud (Auth0's development keys work for testing); Apple needs a Services ID and key from a paid Apple Developer account.
3. **Auth0 role claim.** Under Actions → Library, create a custom Action for the *Login / Post Login* flow, deploy it, and add it to the login flow:

   ```js
   exports.onExecutePostLogin = async (event, api) => {
     api.idToken.setCustomClaim('role', 'authenticated');
     api.idToken.setCustomClaim('created_at', event.user.created_at);
   };
   ```

   Supabase reads the person's database role from the first claim. Both must go on the ID token: Auth0 drops un-namespaced custom claims from access tokens. `created_at` is when the account was created; Profile shows it as "Training since". Sessions that began before it was added lack it, and Profile leaves that line out until the next sign-in.
4. **Supabase.** Open Authentication → Third-Party Auth, add the Auth0 integration, and enter your tenant id and region. (Tenants signing with HS256 or PS256 are not supported; the default RS256 is.)
5. **Environment.** Fill in the `AUTH0_*` and `APP_BASE_URL` variables from `.env.local.example`, and restart the dev server. (Leave `NEXT_PUBLIC_AUTH_REQUIRED` out, or remove any `false`.) `AUTH0_CLIENT_SECRET` and `AUTH0_SECRET` are secrets and are only ever read on the server.
6. **Database.** Run [supabase/migrations/20260921000000_per_user_rls.sql](supabase/migrations/20260921000000_per_user_rls.sql) in the SQL editor. It gives every table an owner and lets only that person read or change their rows.

**Deleting an account.** Profile has a "Delete my account and information" button. It is permanent: it deletes the person's workouts, plan, exercises and diary from Supabase, then their sign-in from Auth0, and nothing can be recovered. (Your hosting provider's own backups may hold a copy for a while, and the app cannot restore from them.) Removing the Auth0 user needs credentials the app's login does not have, so it uses a second application:

1. In Auth0, Applications → Create Application → **Machine to Machine**, and authorise it for the **Auth0 Management API** with the single permission `delete:users`.
2. Set `AUTH0_MANAGEMENT_CLIENT_ID` and `AUTH0_MANAGEMENT_CLIENT_SECRET` from that application (locally and in your hosting provider's environment variables). The secret is server only.

Until they are set, the button refuses and deletes nothing, rather than deleting the data and leaving the name and email with Auth0.

Until steps 1 to 5 are done, the landing page's provider buttons say "Sign-in is not set up yet." After step 6 the data you have today is hidden from every account (everyone starts fresh); the last section of the migration shows how to hand it to one account instead.

How it fits together: the buttons are links to `/auth/login?connection=…`, which the Auth0 SDK's middleware turns into a redirect to Auth0 and back to `/auth/callback`. The browser gets the ID token it needs for Supabase from `GET /api/token`, which reads the session cookie on the server, renews the token when it is close to expiring, and returns 401 when signed out. Signing out is `/auth/logout`, from the Account card at the foot of Profile, which shows the provider and email and asks first. The same card holds the account deletion described above.

Two things to know. Google and Apple sign-ins for the same person are **separate Auth0 users** unless you link them, so they would see separate data; Auth0 documents an Action that links accounts by verified email. And the Google and Apple marks in `src/features/auth/marks.tsx` are drawn approximations: replace them with each provider's official assets before going live. The landing page mentions terms and a privacy policy that do not exist yet.

### Assistant connector (plans from Claude or ChatGPT)

Moonshot is a remote MCP server at `/api/mcp` (Streamable HTTP, answering JSON). Claude and ChatGPT use the same one. The assistant signs people in to it with Moonshot's own Auth0 tenant (OAuth), then calls two tools: `get_training_context` (their exercises, the built-in ones, their workouts and the next 8 weeks of sessions) and `save_plan` (checks the plan and saves it to `plan_drafts`). The connector checks each Auth0 access token itself (signature, issuer, audience, expiry) and reads and writes with the Supabase **service role key**, always filtered to that person. Adding a draft to the calendar happens in the app, with the person's own sign-in, like any other workout. Each assistant signs in through its own Auth0 application, so the connector tells them apart by the token's client ID and saves it with the draft (`plan_drafts.source`).

To turn it on (after Sign-in is set up):

1. **Migration.** Run `20261001000000_plan_drafts.sql`.
2. **Service role key.** Set `SUPABASE_SERVICE_ROLE_KEY` (Supabase → Project Settings → API Keys: the legacy `service_role` key, or a secret key) in Vercel for Production, then redeploy. It bypasses row-level security: server only, never in a `NEXT_PUBLIC_` variable, never committed. Without it the connector answers 503, "isn't set up".
3. **An Auth0 API for the connector.** Applications → APIs → Create API. Identifier: the connector's address exactly, `https://<your app>/api/mcp` (`APP_BASE_URL` + `/api/mcp`, or set `MCP_RESOURCE_URL` to match); signing algorithm RS256. In its settings, turn on **Allow Offline Access** so Claude stays connected. Its **Test** tab gives a token to check the connector: a POST of `initialize` to `/api/mcp` with that token should answer with `"serverInfo":{"name":"moonshot"…}`. Delete the test application afterwards.
4. **Tokens for that API.** Claude asks for it with the standard `resource` parameter, which Auth0 only honours with **Settings → Advanced → Resource Parameter Compatibility Profile** on. Without it the token's audience falls back to `/userinfo`, and Auth0 refuses it for Claude ("The userinfo audience is not allowed for third party clients"). Setting **Settings → General → Default Audience** to the API identifier also works.
5. **One Auth0 application for Claude.** Applications → Create Application → **Single Page Application**, named Claude. It has no secret, so its Client ID is safe to show. Set **Allowed Callback URLs** to `https://claude.ai/api/mcp/auth_callback`, and turn on the Google and Apple connections under its **Connections** tab. Set its Client ID as `NEXT_PUBLIC_CLAUDE_OAUTH_CLIENT_ID` in Vercel and redeploy (the connector uses it to tell Claude's sign-ins apart), and paste the same Client ID into Claude's advanced connector settings: Settings → Connectors → Add custom connector, named Moonshot, address `https://<your app>/api/mcp`. If a sign-in then fails with "Client … is not authorized to access resource server", authorize this application for **user access** on the Moonshot connector API (its application access settings).
   - Why not let Claude register itself (Dynamic Client Registration)? Each connection registers a new application, and the tenant soon reaches its limit ("You reached the limit of entities of this type", `too_many_entities`), after which nobody can connect. If you do use it: registered clients are third-party, so they also need the Google and Apple connections promoted to domain level, and the API's **Default Permissions for Third-Party Applications** set to user access **Authorized** (client access left **Unauthorized**). Leave it off with the shared application.
6. **Connect it in Claude.** Settings → Connectors → Add custom connector: name Moonshot, URL `https://<your app>/api/mcp`, and under Advanced settings the Client ID from step 5 (no secret). Choose Connect and sign in with the same account you use in Moonshot. Custom connectors depend on the Claude plan.
7. **ChatGPT (optional).** Create a second Single Page Application the same way, named ChatGPT, with **Allowed Callback URLs** `https://chatgpt.com/connector_platform_oauth_redirect`, the Google and Apple connections, and (if needed) user access on the connector API. In **Settings → Advanced**, turn on **Include Issuer in Authorization Responses**. Set its Client ID as `NEXT_PUBLIC_CHATGPT_OAUTH_CLIENT_ID` in Vercel (type **Config**, since `NEXT_PUBLIC_` values can't be Sensitive) and redeploy; plans from ChatGPT are then accepted. In ChatGPT: Settings → Apps & Connectors → Advanced → turn on **Developer mode**, then Create: name Moonshot, MCP server URL `https://<your app>/api/mcp`, authentication OAuth with that Client ID (no secret). Developer mode depends on the ChatGPT plan. If ChatGPT's sign-in ends on an Auth0 error, the callback it uses is in that failed log entry: add it to Allowed Callback URLs.

When a sign-in fails, Auth0 shows only "Oops!, something went wrong"; the reason is in Monitoring → Logs, in the newest failed entry's description.

The app finds out a plan has arrived by checking `plan_drafts` every few seconds while its "waiting" dialog is open, and whenever the tab comes back into view.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | Type-check without emitting |
| `npm run dev:design-system` | Start the design-system site on port 3001 |
| `npm run build:design-system` | Production build of the design-system site |

### Design-system site

The design system (`packages/design-system`) is also its own Next.js app, the site at `/design-system`. It's deployed as
a second Vercel project, and the main app forwards `/design-system` to it, so it keeps Moonshot's address:

1. **A Vercel project for it.** Add New → Project, import this same repository, and set **Root Directory** to
   `packages/design-system` (Vercel recognises Next.js and the npm workspace). It needs no environment variables.
   Deploy it and copy its production address, e.g. `https://moonshot-design-system.vercel.app`.
2. **Point the main app at it.** In the main project, set `DESIGN_SYSTEM_URL` to that address (Production, and Preview
   if wanted), then redeploy. Without it, `/design-system` isn't served.

## How it works

```
src/
  app/                  Next.js App Router, routes only: layout, the planner's own global styles (planner.css), the (planner)
                        group with a page per nav address, /welcome, and /api (one line each, re-exporting a handler from
                        backend/api). /design-system is forwarded to the design-system site (next.config.js)
  middleware.ts         Guards the planner and the sign-in routes (runs on the server, before every page)
  frontend/             Everything that runs in the browser. It can't import backend/ (ESLint enforces it)
    features/             One folder per part of the app, named as it appears on screen
      planner/            The shell: Planner (host: loading and error screens, history), PlannerLoader (client only),
                          PlannerView (the frame: dialogs, sidebar, tab bar, banners and the open screen), Sidebar, TabBar,
                          ConfirmDialog, SaveErrorBanner, NoticeBanner, PlannerStatus
                          (the loading and error screens, in the planner's words),
                          routes.ts (which address each screen has), chrome.model.ts (nav and screen switches), styles.ts,
                          viewHelpers.tsx (css() and t()), useViewport
        store/            PlannerLogic (UI state, navigation, loading and saving; renderVals() assembles the view's values),
                          dcLogic (its immediate-merge setState), state.ts (PlannerState: every field of the UI state),
                          context.ts and types.ts (Ctx, typed stage by stage, and PlannerVals, what the screens read),
                          and derive/: the shared derived values, built in order: base (clock, layout), entries, stats
      calendar/           model.ts (the calendar's values), derive.ts (month, week, day and the month grid), CalendarScreen,
                          and its sections: MonthPicker, QuestCard, DayWorkoutCard, WeekRow, MonthGrid, AddToDayDialog, RestartDialog
      session/            model.ts (the day card and the session page), derive.ts (the selected workout), SessionScreen, SessionTimer,
                          SessionExerciseRow, RideSessionCard, FinishDialog, LeaveWorkoutDialog
      editor/             model.ts: the workout editor, EditorScreen and TypePickerScreen, and its sections: TypeChoiceCards, SavedChoices, EditorHeader,
                          DatePicker, RidePlanFields, RideActualCard, EditorExerciseItem, AddExercisePanel, LeaveEditorDialog
      spellbook/          model.ts: the Spellbook, its filters, and the exercise and workout pages. SpellbookScreen,
                          ExerciseScreen, TemplateScreen, ExerciseEditScreen, NotInSpellbook, AreaFilter, EquipmentFilter,
                          NewExerciseCard, ExerciseRow, WorkoutRow, ExerciseEditForm, ScheduleDialog, SaveScopeDialog
      chronicle/          model.ts: the Chronicle list, new entries and reading an entry. ChronicleScreen, NewEntryScreen,
                          EntryScreen, SavedScreen, ChronicleRow, EntryReadView, DiaryEntryForm
      progress/           model.ts: Progress and Profile's stats. ProgressScreen, StreakBanner, ThisWeekCard, NextUpCard, WeekQuestsCard,
                          RanksDialog
      profile/            ProfileScreen, ProfileHeaderCard, SessionsPerWeekCard, QuestsClearedCard, MoodSplitCard, PersonalBestsCard,
                          AccountCard, AppearanceSetting, DeleteAccount, SignOutDialog
      summon/             SummonPlan: a plan Claude or ChatGPT sent, to look over and add
      install/            The install prompt and the service worker registration
      auth/               The landing page and the Google and Apple sign-in buttons and links.ts (the
                          sign-in and sign-out links). The server side is backend/auth0 and middleware.ts
    components/           Reusable pieces the planner's screens share: BackLink, WarmupTag, NeedsLine, IconSquare,
                          SetsFields (sets, reps, weight, rest), AreaChoice, EquipmentPicker, FilterButton,
                          SessionProgress, DoneTick, RepeatWeekly, FormActions, StatRow. Typed props, no planner state
    shared/               Used across the frontend's features: constants (names, quests, ranks), helpers (ids, ISO dates, quest lookup),
                          icons (exercise icons and mood faces)
    data/
      plannerData.ts    Loads the database into the shapes the UI uses, and all writes. Talks to Supabase directly,
                        as the signed-in person, so row-level security keeps each person's data their own. The code
                        is in planner/, by area; this file is what the rest of the app imports
      planner/          types, convert (columns <-> screen strings), db (shared queries), read (loadModel),
                        sessions, workouts, workoutTemplate (saving an edit), exercises, drafts (Summon)
      supabase.ts       The Supabase client, which sends the person's ID token
      session.ts        That ID token, fetched from /api/token and kept until a minute before it expires
  backend/              Everything that runs only on the server. Its files are marked server-only, so importing one into
                        browser code fails the build, and it can't import frontend/
    api/                The API routes' handlers: token (the ID token for Supabase), accountDelete, mcp (the assistant
                        connector) and oauthProtectedResource (its discovery document)
    auth0/              client.ts (the server's Auth0 client and its callback rules), management.ts (deleting a sign-in),
                        sessionToken.ts (a fresh ID token from the session)
    mcp/                The assistant connector's token check (auth.ts) and tools (tools.ts)
  shared/               Used by both sides, and imports neither: auth.ts (the providers, connection names, the
                        NEXT_PUBLIC_AUTH_REQUIRED switch, Account), planDraft.ts (a summoned plan's shape and checks),
                        vendors.ts (the vendor switches)
packages/
  design-system/      @moonshot/design-system, an npm workspace package and the design-system site. The app imports it
                      only through its package.json exports (@moonshot/design-system/buttons, /colors, /theme,
                      /base.css…), and it never imports the app (ESLint enforces both)
    src/              Tokens and components, one folder per section: colors, typography, elevation, radii, spacing, motion,
                      interaction, icons, buttons, card, chip, dialog, popover, text-field, rank-up (the transformation),
                      status-screen (loading, slow and error)…
                      Plus brand (the mark and lockup), theme.ts (light or dark and the accent colour, saved in this
                      browser) and base.css (base type, focus ring, hover washes, forced colours). No Next.js or app code
    app/              The design-system site, its own Next.js app served at /design-system (basePath): overview, sidebar and
                      a page per section (registry.ts lists them; docs.tsx is the frame and text styles they share)
    public/brand/     The brand artwork: lockup, mark, favicon and app icon
vendors.config.ts     Switches for the vendor-reliant features (see "Vendor features")
supabase/migrations/  SQL to run in the Supabase SQL editor
```

**Data flow.** On load, `loadModel` reads all five tables and builds one model: exercises by workout, one entry per date, diary entries, ticks and the library. On each render, `PlannerLogic.renderVals()` builds a context from that model plus the UI state (the shared stages in `frontend/features/planner/store/derive/`, then each feature's `derive.ts`), then each feature's `model.ts` turns the context into the values and handlers its part of the view needs.

Ticks update the screen immediately. Other saves (creating or editing a workout, diary entries, deletes, the Spellbook) are written to Supabase first. When the writes finish, the model is reloaded and the UI state cleared. Writes run in order, and a failed one shows a dismissible error banner.

**The screens started as the design's HTML.** They were converted from the design's template by a one-off script, then split into one `…Screen.tsx` per screen in its feature's folder; all of it is ordinary source now, so edit it directly. Colours and type are CSS variables such as `var(--color-pink)` and `var(--text-md)` (defined in the design system's `colors` and `typography`). Hover styles from the design are the `.hvN:hover` rules in the design system's `base.css`, and elements use them by class name.

## Limitations

- **Claude only, and no link to switch the connector on.** The dialog opens a new Claude chat with the request typed in, but a link can't pick the connector: the message names Moonshot, and Claude uses it once it's connected. Whether someone has connected it is remembered in their browser, not checked with Claude. Moonshot plans only lifts and rides, so Claude is told to put runs or classes in notes.
- **Adding a plan isn't all-or-nothing.** If adding stops partway (a dropped connection), the workouts added so far stay, and the draft is still waiting.
- **Sign-in is off until you turn it on.** Until the steps under Sign-in are done, the tables allow anonymous access with the publishable key, so anyone with that key can read and change your data. Do not share or deploy the app before then.
- **Current year only.** Entries from other years don't appear on the calendar.
- **Free-text exercise fields** such as "4 × 8", "135 lb" and "90 sec" are stored as numbers. Text that doesn't fit those shapes, like "3 × 45s", loses its detail on save.
- **Duplicate exercise rows.** Adding an existing exercise to another workout creates a separate row rather than a link.
- **Fixed profile.** The profile name ("Mika") and start date are constants in `src/frontend/shared/constants.ts`.
- **Moods** are stored as `happy`, `neutral`, `sad` or `mad`, the only values the `diary_entries` table accepts.
