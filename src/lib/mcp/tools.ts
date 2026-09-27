import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { checkPlan, PLAN_LIMITS, RIDE_ZONES, shortDate } from '../planDraft';

// The tools Moonshot's connector gives Claude and ChatGPT. Every query here is filtered to the one person the connector
// verified (lib/mcp/auth.ts): the service role key skips row-level security, so the filter is what keeps each person's
// data their own. Server only.

const TARGET_AREAS = ['Core', 'Arms', 'Back', 'Legs', 'Chest', 'Shoulders'];

/** Supabase with the service role key, or null when it isn't set. Never sent to the browser. */
export function serviceDb(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** What the assistant is told about Moonshot when it connects. */
export const INSTRUCTIONS = `Moonshot is a workout planner with a magical-girl theme: workouts live in the person's Spellbook, sessions sit on a calendar, and their journal is the Chronicle.
To plan training for someone: call get_training_context first, ask about anything you still need (goal, days they can train, time per session, equipment, experience, injuries), then call save_plan.
Moonshot has two kinds of workout: "lift" (strength or bodyweight exercises with sets and reps) and "ride" (a bike ride with minutes, distance and an effort zone). It has no runs, swims or classes; write those as notes, or ask the person how they'd like them handled.
save_plan saves a draft; nothing goes on their calendar until they review it in Moonshot and add it.`;

export const TOOLS = [
  {
    name: 'get_training_context',
    title: 'Read training context',
    description:
      "Reads what Moonshot knows about the person, to plan around: today's date, their own exercises and the built-in ones (with target areas and equipment), the workouts already in their Spellbook, and the sessions already on their calendar for the next 8 weeks. Call it before save_plan.",
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
  },
  {
    name: 'save_plan',
    title: 'Save a plan to Moonshot',
    description: `Saves a training plan to Moonshot as a draft for the person to review. It replaces any draft they haven't decided on yet, so after changes, send the whole plan again. Nothing is added to their calendar until they accept it in Moonshot. Up to ${PLAN_LIMITS.workouts} workouts, dated from today up to a year ahead. Prefer exercise names from get_training_context so Moonshot can match their icons and target areas; new names are fine too.`,
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['title', 'workouts'],
      properties: {
        title: { type: 'string', maxLength: PLAN_LIMITS.title, description: 'A short name for the plan, e.g. "Stronger in 6 weeks".' },
        summary: { type: 'string', maxLength: PLAN_LIMITS.summary, description: 'One or two sentences: the goal and the weekly shape.' },
        workouts: {
          type: 'array',
          minItems: 1,
          maxItems: PLAN_LIMITS.workouts,
          description: 'Every session in the plan, one entry per date.',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['date', 'name', 'kind'],
            properties: {
              date: { type: 'string', description: 'YYYY-MM-DD' },
              name: { type: 'string', maxLength: PLAN_LIMITS.name, description: 'e.g. "Upper Push", "Easy Ride". Reuse a name for the same workout on different days.' },
              kind: { type: 'string', enum: ['lift', 'ride'] },
              warmup: { type: 'boolean', description: 'True for a short warm-up done before another workout that day.' },
              minutes: { type: 'integer', minimum: 5, maximum: 600, description: 'Required for a ride. Optional for a lift.' },
              notes: { type: 'string', maxLength: PLAN_LIMITS.notes },
              exercises: {
                type: 'array',
                maxItems: PLAN_LIMITS.exercises,
                description: 'Required for a lift, in order.',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  required: ['name', 'sets', 'reps'],
                  properties: {
                    name: { type: 'string', maxLength: PLAN_LIMITS.name },
                    sets: { type: 'integer', minimum: 1, maximum: 20 },
                    reps: { type: 'integer', minimum: 1, maximum: 200, description: 'Reps per set; for a timed hold, the seconds.' },
                    weight_lb: { type: 'number', minimum: 0, description: 'Pounds. Leave out for bodyweight.' },
                    rest_seconds: { type: 'integer', minimum: 0, maximum: 900 },
                  },
                },
              },
              ride: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  miles: { type: 'number', minimum: 0 },
                  elevation_ft: { type: 'number', minimum: 0 },
                  zone: { type: 'string', enum: [...RIDE_ZONES] },
                },
              },
            },
          },
        },
      },
    },
  },
] as const;

type ToolResult = { content: { type: 'text'; text: string }[]; isError?: boolean; structuredContent?: Record<string, unknown> };
const reply = (text: string, extra: Partial<ToolResult> = {}): ToolResult => ({ content: [{ type: 'text', text }], ...extra });
const isoToday = () => new Date().toISOString().slice(0, 10);
const plusDays = (iso: string, n: number) => new Date(Date.parse(iso + 'T00:00:00Z') + n * 86_400_000).toISOString().slice(0, 10);

async function rows<T>(q: PromiseLike<{ data: T[] | null; error: { message: string } | null }>): Promise<T[]> {
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}

async function trainingContext(db: SupabaseClient, sub: string): Promise<ToolResult> {
  const today = isoToday();
  const [mine, builtin, workouts, sessions] = await Promise.all([
    rows<any>(db.from('library_exercises').select('name, target_areas, equipment').eq('user_id', sub)),
    rows<any>(db.from('builtin_exercises').select('name, target_areas, equipment').order('sort_order')),
    rows<any>(db.from('workouts').select('id, name, kind').eq('user_id', sub).eq('archived', false)),
    rows<any>(
      db.from('plan_entries').select('scheduled_date, status, workout_id').eq('user_id', sub)
        .gte('scheduled_date', today).lte('scheduled_date', plusDays(today, 56)).order('scheduled_date'),
    ),
  ]);
  const byId = new Map(workouts.map((w: any) => [w.id, w]));
  const ex = (e: any) => ({ name: e.name, target_areas: e.target_areas ?? [], equipment: e.equipment ?? [] });
  const context = {
    today,
    today_note: "Today's date where Moonshot's server is. Ask the person if the plan should start on a particular day.",
    workout_kinds: ['lift', 'ride'],
    ride_zones: RIDE_ZONES,
    target_areas: TARGET_AREAS,
    their_exercises: mine.map(ex),
    builtin_exercises: builtin.map(ex),
    workouts_in_spellbook: workouts.map((w: any) => ({ name: w.name, kind: w.kind })),
    already_scheduled: sessions.map((s: any) => ({ date: s.scheduled_date, name: byId.get(s.workout_id)?.name ?? 'Workout', status: s.status })),
  };
  return reply(JSON.stringify(context, null, 1), { structuredContent: context });
}

async function savePlan(db: SupabaseClient, sub: string, args: any, source: string): Promise<ToolResult> {
  const title = typeof args?.title === 'string' ? args.title.trim().slice(0, PLAN_LIMITS.title) : '';
  if (!title) return reply('title is missing. Give the plan a short name and send it again.', { isError: true });
  const checked = checkPlan(args, isoToday());
  if ('problems' in checked) {
    return reply(`The plan wasn't saved. Fix these and send the whole plan again:\n- ${checked.problems.slice(0, 25).join('\n- ')}`, { isError: true });
  }
  const summary = typeof args?.summary === 'string' ? args.summary.trim().slice(0, PLAN_LIMITS.summary) || null : null;

  // A newer plan replaces one they haven't decided on, so "change week 2" doesn't leave two drafts behind.
  const { error: supersede } = await db
    .from('plan_drafts').update({ status: 'discarded', decided_at: new Date().toISOString() })
    .eq('user_id', sub).eq('status', 'draft');
  if (supersede) throw new Error(supersede.message);
  const { data, error } = await db
    .from('plan_drafts').insert({ user_id: sub, source, status: 'draft', title, summary, plan: checked.plan })
    .select('id').single();
  if (error) throw new Error(error.message);

  const w = checked.plan.workouts;
  const where = `${(process.env.APP_BASE_URL || '').replace(/\/$/, '')}/calendar`;
  return reply(
    `Saved "${title}" to Moonshot as a draft: ${w.length} workout${w.length === 1 ? '' : 's'}, ${shortDate(w[0].date)} to ${shortDate(w[w.length - 1].date)}. ` +
      `It isn't on their calendar yet. Tell them to go back to Moonshot (${where}) to look it over and add it; if Moonshot is still open there, it's already waiting for them.`,
    { structuredContent: { draft_id: data?.id ?? null, workouts: w.length } },
  );
}

/** Runs one tool for the verified person. `source` is the assistant that asked, kept with a saved plan. Unknown tools
 * and failures come back as a tool error the assistant can read. */
export async function callTool(name: string, args: unknown, sub: string, source: string): Promise<ToolResult> {
  const db = serviceDb();
  if (!db) return reply("Moonshot's connector isn't fully set up yet (its database key is missing).", { isError: true });
  try {
    if (name === 'get_training_context') return await trainingContext(db, sub);
    if (name === 'save_plan') return await savePlan(db, sub, args, source);
    return reply(`There's no tool called ${name}.`, { isError: true });
  } catch (e) {
    console.error(`Connector tool ${name} failed:`, e instanceof Error ? e.message : e);
    return reply('Moonshot had trouble with that just now. Try again in a moment.', { isError: true });
  }
}
