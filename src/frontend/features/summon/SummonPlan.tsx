'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Dialog } from '@moonshot/design-system/dialog';
import { ExerciseIcon, Sparkle } from '@moonshot/design-system/icons';
import { IconTile } from '@moonshot/design-system/icon-tile';
import { Text } from '@moonshot/design-system/typography';
import { vars } from '@moonshot/design-system/colors';
import { shortDate, type PlanDraft, type PlanWorkout } from '@/shared/planDraft';
import { discardPlanDraft, latestPlanDraft } from '@/frontend/data/plannerData';
import { vendorOn } from '@/shared/vendors';
import { plural } from '@/frontend/shared/helpers';

// A plan from Claude or ChatGPT: the assistant sends it through Moonshot's connector (backend/api/mcp.ts, at /api/mcp)
// as a draft, and it shows here as a card, to look over before anything goes on the calendar.

type Who = 'claude' | 'chatgpt';

const ASSISTANTS: Record<Who, {
  name: string;
  /** A new chat with the message typed in. */
  chat: (message: string) => string;
  change: (title: string) => string;
}> = {
  claude: {
    name: 'Claude',
    chat: (m) => `https://claude.ai/new?q=${encodeURIComponent(m)}`,
    change: (title) => `In Moonshot, change my plan “${title}”: `,
  },
  chatgpt: {
    name: 'ChatGPT',
    chat: (m) => `https://chatgpt.com/?q=${encodeURIComponent(m)}`,
    change: (title) => `In Moonshot, change my plan “${title}”. Ask me what I’d like to change.`,
  },
};
// Those switched on in vendors.config.ts; ChatGPT also needs its own Auth0 application's Client ID to sign in.
const AVAILABLE: Who[] = (['claude', 'chatgpt'] as const).filter(
  (w) => vendorOn(w) && (w === 'claude' || !!process.env.NEXT_PUBLIC_CHATGPT_OAUTH_CLIENT_ID),
);

/** What to call whoever sent a plan: the connector records 'claude', 'chatgpt', or 'assistant' when it can't tell. */
const senderName = (source: string) => (source === 'claude' || source === 'chatgpt' ? ASSISTANTS[source].name : 'Your assistant');
/** Whether any assistant can send plans. When not, the planner leaves this out entirely. */
export const SUMMON_ON = AVAILABLE.length > 0;
// Changes go back to whoever sent the plan, or else the first assistant on offer.
const changeWith = (d: PlanDraft): Who =>
  (d.source === 'claude' || d.source === 'chatgpt') && AVAILABLE.includes(d.source) ? d.source : AVAILABLE[0] ?? 'claude';
const openChat = (who: Who, message: string) => window.open(ASSISTANTS[who].chat(message), '_blank', 'noopener,noreferrer');

export function SummonPlan({ onAdd, adding }: { onAdd: (draft: PlanDraft) => void; adding: boolean }) {
  const [draft, setDraft] = useState<PlanDraft | null>(null);
  const [waiting, setWaiting] = useState<PlanDraft | null>(null);
  const [problem, setProblem] = useState('');
  // Plans added or let go in this visit. Adding goes through the save queue, so for a moment after it the database
  // still calls the plan a draft; without this the card would come straight back.
  const decided = useRef(new Set<string>());

  // A draft waiting (sent while Moonshot was closed, or on another device) shows as a card.
  const check = useCallback(async () => {
    try {
      const d = await latestPlanDraft();
      return d && !decided.current.has(d.id) ? d : null;
    } catch {
      return null;
    }
  }, []);
  useEffect(() => {
    let live = true;
    const look = () => void check().then((d) => live && setWaiting(d));
    look();
    // Coming back from the assistant's tab is the moment a new plan is most likely.
    const onFocus = () => document.visibilityState === 'visible' && look();
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      live = false;
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [check, draft]);

  const close = () => {
    setDraft(null);
    setProblem('');
  };
  const discard = async (d: PlanDraft) => {
    try {
      await discardPlanDraft(d.id);
      decided.current.add(d.id);
      setWaiting(null);
      close();
    } catch {
      setProblem('That didn’t go through. Try again in a moment.');
    }
  };
  const add = (d: PlanDraft) => {
    decided.current.add(d.id);
    onAdd(d);
    setWaiting(null);
    close();
  };
  // Asking for changes opens the assistant; the changed plan shows here as a new card once it's sent.
  const askForChanges = (d: PlanDraft) => {
    openChat(changeWith(d), ASSISTANTS[changeWith(d)].change(d.title));
    close();
  };

  return (
    <>
      {waiting && !draft ? (
        <Card pad="sm" style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 14px', background: 'var(--gradient-gem-tint)' }}>
          <Sparkle size={16} color={vars.pink} glow={0.5} />
          <div style={{ flex: '1 1 180px', minWidth: 0 }}>
            <Text variant="subheading" as="div" tone="ink">
              {senderName(waiting.source)} sent you a new arc
            </Text>
            <Text variant="caption" as="div" tone="slateDeep">
              {waiting.title} · {countLabel(waiting.plan.workouts.length)}
            </Text>
          </div>
          <Button type="primary" size="sm" onClick={() => setDraft(waiting)}>
            Look it over
          </Button>
        </Card>
      ) : null}

      {draft ? (
        <Dialog
          key="review"
          open
          size="md"
          onClose={close}
          title={draft.title}
          aside={`from ${senderName(draft.source)}`}
          description={
            <>
              {draft.summary ? <>{draft.summary} </> : null}
              {countLabel(draft.plan.workouts.length)}, {span(draft.plan.workouts)}. Nothing is on your calendar until you
              add it.
            </>
          }
          actions={
            <>
              <Button type="neutral" ghost size="sm" onClick={() => discard(draft)}>
                Let it fade
              </Button>
              <Button type="secondary" size="sm" onClick={() => askForChanges(draft)}>
                Ask {ASSISTANTS[changeWith(draft)].name} for changes
              </Button>
              <Button type="primary" size="sm" onClick={() => add(draft)} aria-disabled={adding || undefined}>
                Add {countLabel(draft.plan.workouts.length)}
              </Button>
            </>
          }
        >
          <Weeks workouts={draft.plan.workouts} />
          {problem ? (
            <Text variant="caption" as="p" tone="danger" role="alert" style={{ margin: '12px 0 0' }}>
              {problem}
            </Text>
          ) : null}
        </Dialog>
      ) : null}
    </>
  );
}

const countLabel = (n: number) => plural(n, 'workout');
// "Mon, Sep 28 to Wed, Oct 7", or "on Tue, Sep 29" when it's all one day.
const span = (w: PlanWorkout[]) => {
  const first = w[0].date;
  const last = w[w.length - 1].date;
  return first === last ? `on ${shortDate(first)}` : `${shortDate(first)} to ${shortDate(last)}`;
};

// The plan by week (Sunday to Saturday, as everywhere else in the app), each workout with its day and what it holds.
function Weeks({ workouts }: { workouts: PlanWorkout[] }) {
  const weekOf = (iso: string) => {
    const d = new Date(iso + 'T12:00:00');
    d.setDate(d.getDate() - d.getDay());
    return d.toISOString().slice(0, 10);
  };
  const weeks: { start: string; list: PlanWorkout[] }[] = [];
  for (const w of workouts) {
    const start = weekOf(w.date);
    const last = weeks[weeks.length - 1];
    if (last && last.start === start) last.list.push(w);
    else weeks.push({ start, list: [w] });
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
      {weeks.map((wk, i) => (
        <section key={wk.start} aria-label={`Week ${i + 1}`} style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--color-canvas)' }}>
          <Text variant="micro" as="h3" tone="muted" style={{ margin: 0 }}>
            WEEK {i + 1} · FROM {shortDate(wk.start).toUpperCase()}
          </Text>
          {wk.list.map((w, j) => (
            <div key={w.date + w.name + j} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderTop: j ? '1px solid var(--color-line)' : 'none' }}>
              <IconTile size="sm">
                <ExerciseIcon name={w.kind === 'ride' ? 'bike' : w.stretch ? 'lunge' : w.yoga ? 'flower' : 'h'} color="var(--color-accent)" />
              </IconTile>
              <div style={{ minWidth: 0 }}>
                <Text variant="subheading" as="div" tone="ink">
                  {w.warmup || w.stretch || w.yoga ? (
                    <Text variant="micro" tone="accent" style={{ marginRight: 6 }}>
                      {w.warmup ? 'WARM-UP' : w.stretch ? 'STRETCH' : 'YOGA'}
                    </Text>
                  ) : null}
                  {w.name}
                </Text>
                <Text variant="caption" as="div" tone="muted">
                  {shortDate(w.date)} · {meta(w)}
                </Text>
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

const meta = (w: PlanWorkout) => {
  if (w.kind === 'ride') return [w.minutes ? `${w.minutes} min` : '', w.ride?.miles ? `${w.ride.miles} mi` : '', w.ride?.zone ?? ''].filter(Boolean).join(' · ');
  const n = w.exercises?.length ?? 0;
  return [plural(n, 'exercise'), w.minutes ? `~${w.minutes} min` : ''].filter(Boolean).join(' · ');
};
