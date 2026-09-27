'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/buttons';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { ExerciseIcon, Sparkle } from '@/components/ui/icons';
import { IconTile } from '@/components/ui/icon-tile';
import { Text } from '@/components/ui/typography';
import { vars } from '@/components/ui/colors';
import { shortDate, type PlanDraft, type PlanWorkout } from '@/lib/planDraft';
import { discardPlanDraft, latestPlanDraft } from '@/lib/plannerData';

// "Summon a plan": the person asks Claude for a training plan, Claude sends it back through Moonshot's connector
// (app/api/mcp) as a draft, and it opens here to look over before anything goes on the calendar.
// Claude only for now. Opening Claude with Moonshot already switched on isn't possible from a link, so the first time
// walks through connecting it once; after that the button opens a new Claude chat with the request started.

const CONNECTED_KEY = 'moonshot.claudeConnected';
const CLAUDE_NEW = 'https://claude.ai/new';
const CLAUDE_CONNECTORS = 'https://claude.ai/settings/connectors';
const ASK = 'Use Moonshot to plan my training. I want to ';
const EXAMPLE = 'get stronger in 6 weeks: 3 lifts a week, 45 minutes each, dumbbells only, no Sundays.';
// The Auth0 application everyone's Claude signs in through (a single-page app, so it has no secret and the id is safe
// to show). Set, it goes in Claude's advanced connector settings; unset, Claude registers its own client with Auth0.
const CLIENT_ID = process.env.NEXT_PUBLIC_CLAUDE_OAUTH_CLIENT_ID || '';

type Step = 'closed' | 'connect' | 'ready' | 'waiting' | 'review';

const openClaude = (message: string) =>
  window.open(`${CLAUDE_NEW}?q=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');

const readConnected = () => {
  try {
    return window.localStorage.getItem(CONNECTED_KEY) === '1';
  } catch {
    return false;
  }
};

export function SummonPlan({ onAdd, adding }: { onAdd: (draft: PlanDraft) => void; adding: boolean }) {
  const [step, setStep] = useState<Step>('closed');
  const [draft, setDraft] = useState<PlanDraft | null>(null);
  const [waiting, setWaiting] = useState<PlanDraft | null>(null);
  const [problem, setProblem] = useState('');
  const since = useRef<string | undefined>(undefined);
  // Plans added or let go in this visit. Adding goes through the save queue, so for a moment after it the database
  // still calls the plan a draft; without this the card would come straight back.
  const decided = useRef(new Set<string>());

  // A draft waiting from before (sent while Moonshot was closed, or on another device) shows as a card.
  const check = useCallback(async (after?: string) => {
    try {
      const d = await latestPlanDraft(after);
      return d && !decided.current.has(d.id) ? d : null;
    } catch {
      return null;
    }
  }, []);
  useEffect(() => {
    let live = true;
    const look = () => void check().then((d) => live && setWaiting(d));
    look();
    // Coming back from Claude's tab is the moment a new plan is most likely.
    const onFocus = () => document.visibilityState === 'visible' && look();
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      live = false;
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [check, step]);

  // While waiting, look every few seconds for a plan saved since Claude was opened.
  useEffect(() => {
    if (step !== 'waiting') return;
    const timer = window.setInterval(async () => {
      const d = await check(since.current);
      if (d) {
        setDraft(d);
        setStep('review');
      }
    }, 3000);
    return () => window.clearInterval(timer);
  }, [step, check]);

  const start = () => setStep(readConnected() ? 'ready' : 'connect');
  const close = () => {
    setStep('closed');
    setProblem('');
  };
  const summon = (message: string) => {
    since.current = new Date(Date.now() - 5000).toISOString();
    openClaude(message);
    setStep('waiting');
  };
  const connected = () => {
    try {
      window.localStorage.setItem(CONNECTED_KEY, '1');
    } catch {
      // Storage can be off; the steps just show again next time.
    }
    setStep('ready');
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

  return (
    <>
      {waiting && step === 'closed' ? (
        <Card pad="sm" style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 14px', background: 'var(--gradient-gem-tint)' }}>
          <Sparkle size={16} color={vars.pink} glow={0.5} />
          <div style={{ flex: '1 1 180px', minWidth: 0 }}>
            <Text variant="itemTitle" as="div" tone="ink">
              Claude sent you a new arc
            </Text>
            <Text variant="caption" as="div" tone="slateDeep">
              {waiting.title} · {countLabel(waiting.plan.workouts.length)}
            </Text>
          </div>
          <Button type="primary" size="sm" onClick={() => (setDraft(waiting), setStep('review'))}>
            Look it over
          </Button>
        </Card>
      ) : (
        <Button type="secondary" size="md" fullWidth onClick={start} style={{ marginTop: 14 }}>
          <Sparkle size={15} color="var(--color-accent-deep)" />
          Summon a plan with Claude
        </Button>
      )}

      {step === 'connect' ? (
        <Dialog
          key="connect"
          open
          onClose={close}
          title="Bond Moonshot to Claude"
          description="Once only. Then Claude can read your Spellbook and send plans back to you here."
          actions={
            <>
              <Button type="neutral" ghost size="sm" onClick={close}>
                Not now
              </Button>
              <Button type="primary" size="sm" onClick={connected}>
                I’ve connected it
              </Button>
            </>
          }
        >
          <ol style={{ listStyle: 'none', margin: '18px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <StepItem n={1} title="Add Moonshot as a connector">
              In Claude, open Settings → Connectors, choose <b>Add custom connector</b>, name it Moonshot, and paste this
              address:
              <CopyRow value={typeof window === 'undefined' ? '/api/mcp' : `${window.location.origin}/api/mcp`} what="Address" />
              {CLIENT_ID ? (
                <>
                  <span style={{ display: 'block', marginTop: 10 }}>
                    Then open <b>Advanced settings</b> and paste this as the <b>OAuth Client ID</b>. Leave the secret empty.
                  </span>
                  <CopyRow value={CLIENT_ID} what="Client ID" />
                </>
              ) : null}
            </StepItem>
            <StepItem n={2} title="Swear it in">
              Choose <b>Connect</b>. Claude opens Moonshot’s sign-in: use the same account you use here, so Claude only
              ever sees yours.
            </StepItem>
            <StepItem n={3} title="Return here">
              Then choose <b>I’ve connected it</b>, and tell Claude what you’re training for.
            </StepItem>
          </ol>
          <Button type="primary" link size="sm" onClick={() => window.open(CLAUDE_CONNECTORS, '_blank', 'noopener,noreferrer')} style={{ marginTop: 16 }}>
            Open Claude’s connector settings
          </Button>
        </Dialog>
      ) : null}

      {step === 'ready' ? (
        <Dialog
          key="ready"
          open
          onClose={close}
          title="Summon a training arc"
          description="Tell Claude what you’re training for, and it weaves you a plan from your Spellbook. The plan comes back here first: nothing touches your calendar until you add it."
          actions={
            <>
              <Button type="neutral" ghost size="sm" onClick={close}>
                Not now
              </Button>
              <Button type="primary" size="sm" onClick={() => summon(ASK)}>
                Open Claude
              </Button>
            </>
          }
        >
          <Example />
          <Button type="neutral" link size="sm" onClick={() => setStep('connect')} style={{ marginTop: 14 }}>
            Set up the connection again
          </Button>
        </Dialog>
      ) : null}

      {step === 'waiting' ? (
        <Dialog
          key="waiting"
          open
          onClose={close}
          title="Waiting for Claude’s plan"
          description="Finish in Claude. When it sends the plan to Moonshot, it appears here by itself."
          actions={
            <>
              <Button type="neutral" ghost size="sm" onClick={close}>
                Stop waiting
              </Button>
              <Button type="secondary" size="sm" onClick={() => openClaude(ASK)}>
                Open Claude again
              </Button>
            </>
          }
        >
          <div aria-hidden style={{ display: 'flex', justifyContent: 'center', gap: 10, margin: '20px 0 4px' }}>
            {[vars.pink, vars.periwinkle, vars.teal].map((c, i) => (
              <span key={c} style={{ display: 'flex', animation: `twinkle 2.4s ease-in-out ${i * 0.4}s infinite` }}>
                <Sparkle size={14} color={c} glow={0.5} />
              </span>
            ))}
          </div>
          <Example />
        </Dialog>
      ) : null}

      {step === 'review' && draft ? (
        <Dialog
          key="review"
          open
          size="md"
          onClose={close}
          title={draft.title}
          aside="from Claude"
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
              <Button type="secondary" size="sm" onClick={() => summon(`In Moonshot, change my plan “${draft.title}”: `)}>
                Ask Claude for changes
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

const countLabel = (n: number) => `${n} workout${n === 1 ? '' : 's'}`;
// "Mon, Sep 28 to Wed, Oct 7", or "on Tue, Sep 29" when it's all one day.
const span = (w: PlanWorkout[]) => {
  const first = w[0].date;
  const last = w[w.length - 1].date;
  return first === last ? `on ${shortDate(first)}` : `${shortDate(first)} to ${shortDate(last)}`;
};

// A value to paste somewhere else, with its own Copy button that says when it worked.
function CopyRow({ value, what }: { value: string; what: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };
  return (
    <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 8 }}>
      <code style={{ padding: '6px 10px', borderRadius: 'var(--radius-xs)', background: 'var(--color-mist)', color: 'var(--color-ink)', fontSize: 'var(--text-md)', wordBreak: 'break-all' }}>
        {value}
      </code>
      <Button type="secondary" size="xs" onClick={copy} aria-label={copied ? `${what} copied` : `Copy ${what.toLowerCase()}`}>
        {copied ? 'Copied' : 'Copy'}
      </Button>
      <span role="status" className="sr-only">
        {copied ? `${what} copied` : ''}
      </span>
    </span>
  );
}

function StepItem({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li style={{ display: 'flex', gap: 12 }}>
      <span
        aria-hidden
        style={{ flex: 'none', width: 26, height: 26, borderRadius: 'var(--radius-full)', background: 'var(--color-accent-tint)', color: 'var(--color-accent-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--text-md)' }}
      >
        {n}
      </span>
      <div style={{ minWidth: 0 }}>
        <Text variant="label" weight="semibold" as="div" tone="ink">
          {title}
        </Text>
        <Text variant="caption" as="div" tone="muted" style={{ marginTop: 3, lineHeight: 'var(--leading-snug)' }}>
          {children}
        </Text>
      </div>
    </li>
  );
}

function Example() {
  return (
    <Text variant="caption" as="p" tone="muted" style={{ margin: '16px 0 0' }}>
      For example: “{ASK}
      {EXAMPLE}”
    </Text>
  );
}

// The plan by week (Monday to Sunday), each workout with its day and what it holds.
function Weeks({ workouts }: { workouts: PlanWorkout[] }) {
  const weekOf = (iso: string) => {
    const d = new Date(iso + 'T12:00:00');
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
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
          <Text variant="micro" as="h3" tone="subtle" style={{ margin: 0 }}>
            WEEK {i + 1} · FROM {shortDate(wk.start).toUpperCase()}
          </Text>
          {wk.list.map((w, j) => (
            <div key={w.date + w.name + j} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderTop: j ? '1px solid var(--color-line)' : 'none' }}>
              <IconTile size="sm">
                <ExerciseIcon name={w.kind === 'ride' ? 'bike' : 'h'} color="var(--color-accent)" />
              </IconTile>
              <div style={{ minWidth: 0 }}>
                <Text variant="itemTitle" as="div" tone="ink">
                  {w.warmup ? (
                    <Text variant="micro" tone="accent" style={{ marginRight: 6 }}>
                      WARM-UP
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
  return [`${n} exercise${n === 1 ? '' : 's'}`, w.minutes ? `~${w.minutes} min` : ''].filter(Boolean).join(' · ');
};
