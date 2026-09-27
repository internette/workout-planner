'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/buttons';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { ExerciseIcon, Sparkle } from '@/components/ui/icons';
import { IconTile } from '@/components/ui/icon-tile';
import { OptionCard, OptionGroup } from '@/components/ui/option-card';
import { Text } from '@/components/ui/typography';
import { vars } from '@/components/ui/colors';
import { shortDate, type PlanDraft, type PlanWorkout } from '@/lib/planDraft';
import { discardPlanDraft, latestPlanDraft } from '@/lib/plannerData';
import { vendorOn } from '@/lib/vendors';

// "Summon a plan": the person asks Claude or ChatGPT for a training plan, the assistant sends it back through Moonshot's
// connector (app/api/mcp) as a draft, and it opens here to look over before anything goes on the calendar.
// Opening an assistant with Moonshot already switched on isn't possible from a link, so the first time walks through
// connecting it once; after that the button opens a new chat with the request started.

type Who = 'claude' | 'chatgpt';
type Step = 'closed' | 'pick' | 'connect' | 'ready' | 'waiting' | 'review';

const EXAMPLE = 'I want to get stronger in 6 weeks: 3 lifts a week, 45 minutes each, dumbbells only, no Sundays.';
const LAST_KEY = 'moonshot.assistant';

// Each assistant signs in through its own Auth0 application (a single-page app, so no secret and the id is safe to show).
// ChatGPT is offered only once its id is set; Claude without an id registers its own client with Auth0.
const ASSISTANTS: Record<Who, {
  name: string;
  clientId: string;
  connectedKey: string;
  /** A new chat with the message typed in. ChatGPT may send it straight away, so its messages stand on their own. */
  chat: (message: string) => string;
  ask: string;
  change: (title: string) => string;
  settings: { label: string; url: string };
}> = {
  claude: {
    name: 'Claude',
    clientId: process.env.NEXT_PUBLIC_CLAUDE_OAUTH_CLIENT_ID || '',
    connectedKey: 'moonshot.claudeConnected',
    chat: (m) => `https://claude.ai/new?q=${encodeURIComponent(m)}`,
    ask: 'Use Moonshot to plan my training. I want to ',
    change: (title) => `In Moonshot, change my plan “${title}”: `,
    settings: { label: 'Open Claude’s connector settings', url: 'https://claude.ai/settings/connectors' },
  },
  chatgpt: {
    name: 'ChatGPT',
    clientId: process.env.NEXT_PUBLIC_CHATGPT_OAUTH_CLIENT_ID || '',
    connectedKey: 'moonshot.chatgptConnected',
    chat: (m) => `https://chatgpt.com/?q=${encodeURIComponent(m)}`,
    ask: 'Use Moonshot to plan my training. Start by asking me what I’m training for.',
    change: (title) => `In Moonshot, change my plan “${title}”. Ask me what I’d like to change.`,
    settings: { label: 'Open ChatGPT', url: 'https://chatgpt.com/' },
  },
};
// Those switched on in vendors.config.ts; ChatGPT also needs its Client ID.
const AVAILABLE: Who[] = (['claude', 'chatgpt'] as const).filter((w) => vendorOn(w) && (w === 'claude' || !!ASSISTANTS[w].clientId));

/** What to call whoever sent a plan: the connector records 'claude', 'chatgpt', or 'assistant' when it can't tell. */
const senderName = (source: string) => (source === 'claude' || source === 'chatgpt' ? ASSISTANTS[source].name : 'Your assistant');
/** Whether "Summon a plan" has any assistant to offer. When not, the planner leaves it out entirely. */
export const SUMMON_ON = AVAILABLE.length > 0;
const sourceWho = (source: string): Who | null => (source === 'claude' || source === 'chatgpt') && AVAILABLE.includes(source) ? source : null;

const store = {
  get: (key: string) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Storage can be off; the setup steps just show again next time.
    }
  },
};
const isConnected = (who: Who) => store.get(ASSISTANTS[who].connectedKey) === '1';
const openChat = (who: Who, message: string) => window.open(ASSISTANTS[who].chat(message), '_blank', 'noopener,noreferrer');

export function SummonPlan({ onAdd, adding }: { onAdd: (draft: PlanDraft) => void; adding: boolean }) {
  const [step, setStep] = useState<Step>('closed');
  const [who, setWho] = useState<Who>(AVAILABLE[0] ?? 'claude');
  const [draft, setDraft] = useState<PlanDraft | null>(null);
  const [waiting, setWaiting] = useState<PlanDraft | null>(null);
  const [problem, setProblem] = useState('');
  const since = useRef<string | undefined>(undefined);
  // Plans added or let go in this visit. Adding goes through the save queue, so for a moment after it the database
  // still calls the plan a draft; without this the card would come straight back.
  const decided = useRef(new Set<string>());
  const a = ASSISTANTS[who];

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
    // Coming back from the assistant's tab is the moment a new plan is most likely.
    const onFocus = () => document.visibilityState === 'visible' && look();
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      live = false;
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [check, step]);

  // While waiting, look every few seconds for a plan saved since the assistant was opened.
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

  const start = () => {
    if (AVAILABLE.length === 1) {
      setWho(AVAILABLE[0]);
      setStep(isConnected(AVAILABLE[0]) ? 'ready' : 'connect');
      return;
    }
    const last = store.get(LAST_KEY);
    setWho(AVAILABLE.find((w) => w === last) ?? AVAILABLE[0]);
    setStep('pick');
  };
  const close = () => {
    setStep('closed');
    setProblem('');
  };
  const summon = (to: Who, message: string) => {
    since.current = new Date(Date.now() - 5000).toISOString();
    setWho(to);
    store.set(LAST_KEY, to);
    openChat(to, message);
    setStep('waiting');
  };
  const connected = () => {
    store.set(ASSISTANTS[who].connectedKey, '1');
    setStep(AVAILABLE.length > 1 ? 'pick' : 'ready');
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
  // Changes go back to whoever sent the plan, or to the assistant picked last.
  const changeWith = (d: PlanDraft) => sourceWho(d.source) ?? who;

  return (
    <>
      {waiting && step === 'closed' ? (
        <Card pad="sm" style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 14px', background: 'var(--gradient-gem-tint)' }}>
          <Sparkle size={16} color={vars.pink} glow={0.5} />
          <div style={{ flex: '1 1 180px', minWidth: 0 }}>
            <Text variant="itemTitle" as="div" tone="ink">
              {senderName(waiting.source)} sent you a new arc
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
          {AVAILABLE.length > 1 ? 'Summon a plan' : `Summon a plan with ${a.name}`}
        </Button>
      )}

      {step === 'pick' ? (
        <Dialog
          key="pick"
          open
          onClose={close}
          title="Summon a training arc"
          description="Tell your assistant what you’re training for, and it weaves you a plan from your Spellbook. The plan comes back here first: nothing touches your calendar until you add it."
          actions={
            <>
              <Button type="neutral" ghost size="sm" onClick={close}>
                Not now
              </Button>
              {isConnected(who) ? (
                <Button type="primary" size="sm" onClick={() => summon(who, a.ask)}>
                  Open {a.name}
                </Button>
              ) : (
                <Button type="primary" size="sm" onClick={() => setStep('connect')}>
                  Set up {a.name}
                </Button>
              )}
            </>
          }
        >
          <div style={{ marginTop: 18 }}>
            <OptionGroup label="Assistant">
              {AVAILABLE.map((w) => (
                <OptionCard
                  key={w}
                  name="assistant"
                  value={w}
                  checked={who === w}
                  onChange={(v) => setWho(v as Who)}
                  title={ASSISTANTS[w].name}
                  description={<Badge tone={isConnected(w) ? 'soft' : 'neutral'}>{isConnected(w) ? 'Connected' : 'Set up once'}</Badge>}
                />
              ))}
            </OptionGroup>
          </div>
          {isConnected(who) ? (
            <Button type="neutral" link size="sm" onClick={() => setStep('connect')} style={{ marginTop: 14 }}>
              Set up {a.name} again
            </Button>
          ) : null}
        </Dialog>
      ) : null}

      {step === 'connect' ? (
        <Dialog
          key={'connect-' + who}
          open
          onClose={close}
          title={`Bond Moonshot to ${a.name}`}
          description={`Once only. Then ${a.name} can read your Spellbook and send plans back to you here.`}
          actions={
            <>
              <Button type="neutral" ghost size="sm" onClick={AVAILABLE.length > 1 ? () => setStep('pick') : close}>
                {AVAILABLE.length > 1 ? 'Back' : 'Not now'}
              </Button>
              <Button type="primary" size="sm" onClick={connected}>
                I’ve connected it
              </Button>
            </>
          }
        >
          <ol style={{ listStyle: 'none', margin: '18px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {who === 'claude' ? <ClaudeSteps /> : <ChatGptSteps />}
          </ol>
          <Button type="primary" link size="sm" onClick={() => window.open(a.settings.url, '_blank', 'noopener,noreferrer')} style={{ marginTop: 16 }}>
            {a.settings.label}
          </Button>
        </Dialog>
      ) : null}

      {step === 'ready' ? (
        <Dialog
          key="ready"
          open
          onClose={close}
          title="Summon a training arc"
          description={`Tell ${a.name} what you’re training for, and it weaves you a plan from your Spellbook. The plan comes back here first: nothing touches your calendar until you add it.`}
          actions={
            <>
              <Button type="neutral" ghost size="sm" onClick={close}>
                Not now
              </Button>
              <Button type="primary" size="sm" onClick={() => summon(who, a.ask)}>
                Open {a.name}
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
          title={`Waiting for ${a.name}’s plan`}
          description={`Finish in ${a.name}. When it sends the plan to Moonshot, it appears here by itself.`}
          actions={
            <>
              <Button type="neutral" ghost size="sm" onClick={close}>
                Stop waiting
              </Button>
              <Button type="secondary" size="sm" onClick={() => openChat(who, a.ask)}>
                Open {a.name} again
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
          {who === 'chatgpt' ? (
            <Text variant="caption" as="p" tone="muted" style={{ margin: '10px 0 0' }}>
              If ChatGPT doesn’t reach for Moonshot on its own, turn Moonshot on in the chat’s tools, under the + button.
            </Text>
          ) : null}
        </Dialog>
      ) : null}

      {step === 'review' && draft ? (
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
              <Button type="secondary" size="sm" onClick={() => summon(changeWith(draft), ASSISTANTS[changeWith(draft)].change(draft.title))}>
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

const mcpAddress = () => (typeof window === 'undefined' ? '/api/mcp' : `${window.location.origin}/api/mcp`);

function ClaudeSteps() {
  const id = ASSISTANTS.claude.clientId;
  return (
    <>
      <StepItem n={1} title="Add Moonshot as a connector">
        In Claude, open Settings → Connectors, choose <b>Add custom connector</b>, name it Moonshot, and paste this address:
        <CopyRow value={mcpAddress()} what="Address" />
        {id ? (
          <>
            <span style={{ display: 'block', marginTop: 10 }}>
              Then open <b>Advanced settings</b> and paste this as the <b>OAuth Client ID</b>. Leave the secret empty.
            </span>
            <CopyRow value={id} what="Client ID" />
          </>
        ) : null}
      </StepItem>
      <StepItem n={2} title="Swear it in">
        Choose <b>Connect</b>. Claude opens Moonshot’s sign-in: use the same account you use here, so Claude only ever sees
        yours.
      </StepItem>
      <StepItem n={3} title="Return here">
        Then choose <b>I’ve connected it</b>, and tell Claude what you’re training for.
      </StepItem>
    </>
  );
}

function ChatGptSteps() {
  return (
    <>
      <StepItem n={1} title="Turn on Developer mode">
        In ChatGPT, open Settings → <b>Apps &amp; Connectors</b> → <b>Advanced settings</b>, and turn on{' '}
        <b>Developer mode</b>. Custom apps like Moonshot need it.
      </StepItem>
      <StepItem n={2} title="Add Moonshot as an app">
        Back in Apps &amp; Connectors, choose <b>Create app</b>, name it Moonshot, and paste this as the MCP server URL:
        <CopyRow value={mcpAddress()} what="Address" />
        <span style={{ display: 'block', marginTop: 10 }}>
          For authentication choose <b>OAuth</b>, and paste this as the <b>OAuth Client ID</b>. Leave the secret empty.
        </span>
        <CopyRow value={ASSISTANTS.chatgpt.clientId} what="Client ID" />
      </StepItem>
      <StepItem n={3} title="Swear it in">
        ChatGPT opens Moonshot’s sign-in: use the same account you use here, so ChatGPT only ever sees yours.
      </StepItem>
      <StepItem n={4} title="Return here">
        Then choose <b>I’ve connected it</b>, and tell ChatGPT what you’re training for.
      </StepItem>
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
      For example: “{EXAMPLE}”
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
